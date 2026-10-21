import type { FastifyInstance } from 'fastify';
import type { Incident, IncidentListItem } from '@nexus/shared';
import { currentUser, store } from '../store.js';
import { investigate } from '../copilot/investigate.js';

/** Next timestamp on the incident's own clock, so new events read in sequence with the seeded ones. */
function nextTime(inc: Incident, addMinutes = 2): string {
  const last = inc.timeline[inc.timeline.length - 1]?.time ?? '00:00:00';
  const [h, m, s] = last.split(':').map(Number);
  const t = h * 3600 + m * 60 + s + addMinutes * 60;
  return [Math.floor(t / 3600) % 24, Math.floor((t % 3600) / 60), t % 60]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function incidentRoutes(app: FastifyInstance) {
  app.get('/api/incidents', async () => {
    const list: IncidentListItem[] = store.incidents().map((i) => ({
      id: i.id,
      title: i.title,
      service: i.service,
      severity: i.severity,
      status: i.status,
      openedAt: i.openedAt,
      region: i.region,
      alertCount: i.alerts.length,
      hasInvestigation: !!i.investigation,
    }));
    return list;
  });

  app.get<{ Params: { id: string } }>('/api/incidents/:id', async (req, reply) => {
    const inc = store.incident(req.params.id);
    if (!inc) return reply.code(404).send({ message: `Incident ${req.params.id} not found` });
    return inc;
  });

  app.post<{ Params: { id: string } }>('/api/incidents/:id/acknowledge', async (req, reply) => {
    const inc = store.incident(req.params.id);
    if (!inc) return reply.code(404).send({ message: 'Incident not found' });
    if (inc.status === 'open') inc.status = 'acknowledged';
    store.audit({
      actor: currentUser.name,
      actorType: 'human',
      action: 'acknowledged',
      target: inc.id,
    });
    return inc;
  });

  app.post<{ Params: { id: string } }>('/api/incidents/:id/investigate', async (req, reply) => {
    const inc = store.incident(req.params.id);
    if (!inc) return reply.code(404).send({ message: 'Incident not found' });
    store.audit({
      actor: 'nexus-copilot',
      actorType: 'agent',
      action: 'investigation_started',
      target: inc.id,
      detail: `Read-only, acting with ${currentUser.name}’s data permissions`,
    });
    if (inc.status === 'open' || inc.status === 'acknowledged') inc.status = 'investigating';
    const result = await investigate(inc);
    inc.investigation = result;
    store.audit({
      actor: 'nexus-copilot',
      actorType: 'agent',
      action: `investigation_${result.status}`,
      target: inc.id,
      detail:
        result.status === 'complete'
          ? `${result.hypotheses.length} hypotheses, ${new Set(result.hypotheses.flatMap((h) => [...h.evidenceIds, ...h.againstIds])).size} cited evidence items (${result.mode})`
          : result.abstainReason,
    });
    return inc;
  });

  app.post<{ Params: { id: string }; Body: { reason?: string } }>(
    '/api/incidents/:id/escalate',
    async (req, reply) => {
      const inc = store.incident(req.params.id);
      if (!inc) return reply.code(404).send({ message: 'Incident not found' });
      inc.status = 'escalated';
      inc.timeline.push({
        id: `T-${Date.now()}`,
        time: nextTime(inc),
        kind: 'human',
        text: `Escalated to service owner${req.body?.reason ? `: ${req.body.reason}` : ''}`,
        source: 'Nexus',
      });
      store.audit({
        actor: currentUser.name,
        actorType: 'human',
        action: 'escalated',
        target: inc.id,
        detail: req.body?.reason,
      });
      store.audit({
        actor: 'Nexus',
        actorType: 'system',
        action: 'paged_owner',
        target: inc.id,
        detail: 'Service owner paged with timeline, hypotheses and evidence attached',
      });
      return inc;
    },
  );

  app.post<{ Params: { id: string } }>('/api/actions/:id/approve', async (req, reply) => {
    const found = store.findAction(req.params.id);
    if (!found) return reply.code(404).send({ message: 'Action not found' });
    const { incident, action } = found;
    if (!currentUser.roles.includes(action.requiredRole)) {
      store.audit({
        actor: currentUser.name,
        actorType: 'human',
        action: 'approval_denied',
        target: action.id,
        detail: `Missing role ${action.requiredRole}`,
      });
      return reply
        .code(403)
        .send({
          message: `Approving this action needs the ${action.requiredRole} role. Ask the service owner or an SRE lead to approve it.`,
        });
    }
    if (action.status !== 'proposed')
      return reply.code(409).send({ message: `Action is already ${action.status}` });
    action.status = 'approved';
    action.approvedBy = currentUser.name;
    incident.status = 'mitigating';
    store.audit({
      actor: currentUser.name,
      actorType: 'human',
      action: 'approved_action',
      target: action.id,
      detail: `${action.title} (policy ${action.policyId})`,
    });
    return incident;
  });

  app.post<{ Params: { id: string } }>('/api/actions/:id/reject', async (req, reply) => {
    const found = store.findAction(req.params.id);
    if (!found) return reply.code(404).send({ message: 'Action not found' });
    found.action.status = 'rejected';
    store.audit({
      actor: currentUser.name,
      actorType: 'human',
      action: 'rejected_action',
      target: found.action.id,
    });
    return found.incident;
  });

  app.post<{ Params: { id: string }; Body: { simulate?: 'success' | 'failure' } }>(
    '/api/actions/:id/execute',
    async (req, reply) => {
      const found = store.findAction(req.params.id);
      if (!found) return reply.code(404).send({ message: 'Action not found' });
      const { incident, action } = found;
      if (action.status !== 'approved' && action.status !== 'failed') {
        return reply
          .code(409)
          .send({ message: 'Only approved actions can run. Approve it first.' });
      }
      action.status = 'running';
      action.attempts += 1;
      store.audit({
        actor: action.executesAs,
        actorType: 'agent',
        action: action.attempts > 1 ? 'retried_action' : 'started_action',
        target: action.id,
      });
      await sleep(1500);

      const fail = req.body?.simulate === 'failure' && action.attempts === 1;
      if (fail) {
        action.status = 'failed';
        action.result =
          'Rollback job timed out after 120 s. Verified state: all 12 pods still run v2.8.1. No partial changes were applied.';
        store.audit({
          actor: action.executesAs,
          actorType: 'agent',
          action: 'action_failed',
          target: action.id,
          detail: 'Timeout; verified no pods changed',
        });
        return incident;
      }
      action.status = 'succeeded';
      action.result =
        'All 12 pods run v2.8.0. Error rate is 0.5% and has stayed under 1% for 5 minutes.';
      incident.status = 'mitigated';
      const pts = incident.metric.points;
      const recovery = [6.2, 2.4, 0.7, 0.5];
      recovery.forEach((v, i) => (pts[pts.length - recovery.length + i].v = v));
      incident.metric.markers.push({
        t: pts[pts.length - recovery.length].t,
        label: 'rollback to v2.8.0',
        kind: 'action',
      });
      incident.timeline.push({
        id: `T-${Date.now()}`,
        time: nextTime(incident, 13),
        kind: 'action',
        text: `${action.title}: completed and verified`,
        source: action.executesAs,
        key: true,
      });
      store.audit({
        actor: action.executesAs,
        actorType: 'agent',
        action: 'action_succeeded',
        target: action.id,
        detail: action.result,
      });
      store.audit({
        actor: 'Nexus',
        actorType: 'system',
        action: 'post_action_check_passed',
        target: incident.id,
        detail: 'Error rate under 1% for 5 minutes',
      });
      return incident;
    },
  );
}
