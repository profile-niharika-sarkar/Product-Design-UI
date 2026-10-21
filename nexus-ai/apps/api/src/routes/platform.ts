import type { FastifyInstance } from 'fastify';
import type { AnalyticsEvent, OverviewSummary } from '@nexus/shared';
import { agents, models, policies, services } from '../data/seed.js';
import { currentUser, store } from '../store.js';

export async function platformRoutes(app: FastifyInstance) {
  app.get('/api/health', async () => ({
    ok: true,
    copilotMode: process.env.ANTHROPIC_API_KEY ? 'claude' : 'scripted',
  }));
  app.get('/api/me', async () => currentUser);

  app.get('/api/overview', async () => {
    const incidents = store.incidents();
    const alerts = incidents.flatMap((i) => i.alerts);
    const summary: OverviewSummary = {
      openIncidents: incidents.filter((i) => !['resolved', 'mitigated'].includes(i.status)).length,
      mttrMinutes: 37,
      alertsToday: alerts.length,
      alertsSuppressed: alerts.filter((a) => a.duplicate).length,
      evidenceValidity: 0.91,
      servicesDegraded: services.filter((s) => s.health !== 'healthy').length,
      dataFreshness: [
        { source: 'Metrics (Prometheus)', lagSeconds: 15 },
        { source: 'Traces (OpenTelemetry)', lagSeconds: 40 },
        { source: 'Logs (Loki)', lagSeconds: 210 },
      ],
    };
    return summary;
  });

  app.get('/api/services', async () => services);
  app.get<{ Params: { id: string } }>('/api/services/:id', async (req, reply) => {
    const s = services.find((x) => x.id === req.params.id);
    if (!s) return reply.code(404).send({ message: `Service ${req.params.id} not found` });
    return s;
  });

  app.get('/api/agents', async () => agents);
  app.get('/api/policies', async () => policies);
  app.get('/api/models', async () => models);
  app.get('/api/audit', async () => store.auditLog());

  app.get('/api/events', async () => store.events());
  app.post<{ Body: Omit<AnalyticsEvent, 'at'> }>('/api/events', async (req, reply) => {
    if (!req.body?.name) return reply.code(400).send({ message: 'Event name is required' });
    store.track({ name: req.body.name, props: req.body.props ?? {} });
    return reply.code(204).send();
  });

  app.post('/api/admin/reset', async () => {
    store.reset();
    return { ok: true };
  });
}
