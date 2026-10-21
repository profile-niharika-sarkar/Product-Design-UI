import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Incident } from '@nexus/shared';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';
import { track } from '../lib/analytics';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, Loading } from '../components/StateView';
import { SeverityBadge, StatusPill, TrustTag } from '../components/Badges';
import { LineChart } from '../components/LineChart';
import { DependencyMap } from '../components/DependencyMap';
import { Timeline } from '../features/incident/Timeline';
import { EvidenceList, type Feedback } from '../features/incident/EvidenceList';
import { CopilotPanel } from '../features/incident/CopilotPanel';
import { AuditFeed } from '../features/incident/AuditFeed';

export function IncidentDetail() {
  const { id = '' } = useParams();
  const { data: incident, error, reload, setData } = useApi(() => api.incident(id), [id]);
  const services = useApi(api.services);
  const audit = useApi(api.audit, [
    incident?.status,
    incident?.investigation?.id,
    incident?.actions.map((a) => a.status).join(),
  ]);
  const [highlight, setHighlight] = useState<string>();
  const [feedback, setFeedback] = useState<Feedback>({});
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    if (incident) track('incident_viewed', { incident: incident.id, status: incident.status });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incident?.id]);

  const onIncident = useCallback((i: Incident) => setData(i), [setData]);

  const cite = (evidenceId: string) => {
    setHighlight(evidenceId);
    document
      .getElementById(`evidence-${evidenceId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    track('evidence_opened', { incident: id, evidence: evidenceId });
    window.setTimeout(() => setHighlight(undefined), 2000);
  };

  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!incident) return <Loading lines={8} />;

  const ack = async () => {
    track('incident_acknowledged', { incident: incident.id });
    setData(await api.acknowledge(incident.id));
  };

  const aff = new Set(incident.affectedServices);
  const affected = services.data?.filter(
    (s) =>
      aff.has(s.id) ||
      s.dependsOn.some((d) => aff.has(d)) ||
      services.data!.some((x) => aff.has(x.id) && x.dependsOn.includes(s.id)),
  );
  const duplicates = incident.alerts.filter((a) => a.duplicate).length;

  return (
    <>
      <PageHeader
        crumbs={[{ to: '/incidents', label: 'Incidents' }]}
        title={
          <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {incident.id} <span style={{ fontWeight: 500 }}>{incident.title}</span>
          </span>
        }
        description={
          <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <SeverityBadge severity={incident.severity} /> <StatusPill status={incident.status} />
            <span className="small">{incident.region}</span>
          </span>
        }
        actions={
          incident.status === 'open' ? (
            <button className="btn primary" onClick={ack}>
              Acknowledge
            </button>
          ) : undefined
        }
      />

      <div className="split">
        <div className="stack">
          <section className="card">
            <div className="card-head">
              <h2>{incident.metric.label}</h2>
              <TrustTag state="observed" />
            </div>
            <p className="small muted">{incident.summary}</p>
            <LineChart series={incident.metric} />
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Timeline</h2>
              <button
                className="btn sm"
                onClick={() => setShowAlerts((v) => !v)}
                aria-expanded={showAlerts}
              >
                {incident.alerts.length} alerts grouped
                {duplicates ? `, ${duplicates} held back` : ''}
              </button>
            </div>
            {showAlerts && (
              <div className="table-wrap" style={{ marginBottom: 14 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Signal</th>
                      <th>Service</th>
                      <th>Source</th>
                      <th>First seen</th>
                      <th>Paged</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incident.alerts.map((a) => (
                      <tr key={a.id}>
                        <td>{a.signal}</td>
                        <td className="mono">{a.service}</td>
                        <td>{a.source}</td>
                        <td className="num">{a.firstSeen}</td>
                        <td>{a.duplicate ? <span className="muted">Held back</span> : 'Yes'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <Timeline events={incident.timeline} />
          </section>

          {affected && affected.length > 0 && (
            <section className="card">
              <div className="card-head">
                <h2>Affected services</h2>
              </div>
              <DependencyMap services={affected} focus={incident.affectedServices} />
            </section>
          )}

          <section className="card">
            <div className="card-head">
              <h2>Evidence</h2>
              <span className="small muted">
                {Object.keys(feedback).length} of {incident.evidence.length} rated
              </span>
            </div>
            <EvidenceList
              evidence={incident.evidence}
              highlight={highlight}
              feedback={feedback}
              onFeedback={(eid, v) => {
                setFeedback((f) => ({ ...f, [eid]: v }));
                track('evidence_feedback', {
                  incident: incident.id,
                  evidence: eid,
                  relevant: v === 'yes',
                });
              }}
            />
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Audit log</h2>
              <span className="small muted">
                Append-only. Agent identities are separate from people.
              </span>
            </div>
            {audit.data ? (
              <AuditFeed
                entries={audit.data.filter(
                  (e) =>
                    e.target === incident.id || incident.actions.some((a) => a.id === e.target),
                )}
              />
            ) : (
              <Loading lines={3} />
            )}
          </section>
        </div>

        <div className="sticky">
          <CopilotPanel
            incident={incident}
            onIncident={onIncident}
            onCite={cite}
            evidenceRated={Object.keys(feedback).length}
          />
        </div>
      </div>
    </>
  );
}
