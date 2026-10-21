import { useState } from 'react';
import { LIKELIHOOD_BAND, LIKELIHOOD_LABEL, type Incident } from '@nexus/shared';
import { TrustTag } from '../../components/Badges';
import { api } from '../../lib/api';
import { track } from '../../lib/analytics';
import { ActionCard } from './ActionCard';

export function CopilotPanel({
  incident,
  onIncident,
  onCite,
  evidenceRated,
}: {
  incident: Incident;
  onIncident: (i: Incident) => void;
  onCite: (evidenceId: string) => void;
  evidenceRated: number;
}) {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState(false);
  const inv = incident.investigation;

  async function start() {
    setRunning(true);
    setError(null);
    track('investigation_started', { incident: incident.id });
    try {
      const updated = await api.investigate(incident.id);
      onIncident(updated);
      const r = updated.investigation!;
      track('hypotheses_shown', {
        incident: incident.id,
        status: r.status,
        count: r.hypotheses.length,
        seconds_to_first_hypothesis: r.secondsToFirstHypothesis,
        mode: r.mode,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }

  async function escalate(reason: string) {
    track('incident_escalated', { incident: incident.id, from: 'copilot' });
    onIncident(await api.escalate(incident.id, reason));
  }

  return (
    <section className="card copilot" aria-labelledby="copilot-h">
      <div className="card-head">
        <h2 id="copilot-h">Copilot</h2>
        {inv && (
          <span className="pill">{inv.mode === 'claude' ? 'Live model' : 'Scripted demo'}</span>
        )}
      </div>
      <p className="small muted">
        Reads metrics, logs, traces, deploys and runbooks you have access to. It can’t change
        anything.
      </p>

      {!inv && !running && (
        <button className="btn primary" onClick={start}>
          Start investigation
        </button>
      )}
      {running && (
        <p role="status" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="spinner" aria-hidden="true" /> Investigating. Reading telemetry and
          recent changes…
        </p>
      )}
      {error && (
        <div className="result fail" role="alert">
          {error}
        </div>
      )}

      {inv && (
        <>
          <ul className="toolcalls" aria-label="What the copilot did">
            {inv.toolCalls.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="small muted">
            {inv.status === 'complete' &&
              `${inv.hypotheses.length} explanations, ranked. First hypothesis in ${inv.secondsToFirstHypothesis} s.`}
            {inv.droppedClaims
              ? ` ${inv.droppedClaims} unsupported claim(s) were removed before display.`
              : ''}
          </p>

          {inv.status !== 'complete' && (
            <div
              className="result fail"
              style={{ background: 'transparent', borderColor: 'var(--med)' }}
            >
              <strong>
                {inv.status === 'abstained' ? 'No confident root cause.' : 'Investigation failed.'}
              </strong>{' '}
              {inv.abstainReason}
            </div>
          )}

          {inv.hypotheses.map((h) => (
            <div key={h.id} className={`hyp ${h.rank === 1 ? 'top' : ''}`}>
              <div className="head">
                <span className="rank">{h.rank}</span>
                <TrustTag state="hypothesis" />
                <span className="conf">
                  {LIKELIHOOD_LABEL[h.likelihood]}
                  <span className="bar" aria-hidden="true">
                    <i style={{ width: `${LIKELIHOOD_BAND[h.likelihood] * 100}%` }} />
                  </span>
                </span>
              </div>
              <p style={{ margin: '4px 0 6px' }}>{h.statement}</p>
              <div className="small">
                {h.evidenceIds.length > 0 && <span className="muted">Supported by </span>}
                {h.evidenceIds.map((id) => (
                  <button key={id} className="cite" onClick={() => onCite(id)}>
                    {id}
                  </button>
                ))}
                {h.againstIds.length > 0 && <span className="muted">Weakened by </span>}
                {h.againstIds.map((id) => (
                  <button
                    key={id}
                    className="cite against"
                    onClick={() => onCite(id)}
                    aria-label={`${id}, evidence against`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {inv.missingInfo.length > 0 && (
            <div className="missing">
              <h3>Missing information</h3>
              <ul>
                {inv.missingInfo.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="small">
            <strong>Suggested next step:</strong> {inv.recommendedNextStep}{' '}
            <span className="muted">No production action has been taken.</span>
          </p>

          {inv.status === 'complete' && incident.actions.length > 0 && (
            <>
              <label className="check" style={{ marginTop: 12 }}>
                <input
                  type="checkbox"
                  checked={reviewed}
                  onChange={(e) => {
                    setReviewed(e.target.checked);
                    if (e.target.checked)
                      track('evidence_review_confirmed', {
                        incident: incident.id,
                        evidence_items_rated: evidenceRated,
                      });
                  }}
                />
                I’ve reviewed the evidence for hypothesis 1
              </label>
              {incident.actions.map((a) => (
                <ActionCard
                  key={a.id}
                  action={a}
                  canApprove={reviewed}
                  evidenceRated={evidenceRated}
                  onIncident={onIncident}
                />
              ))}
            </>
          )}

          {inv.status !== 'complete' && incident.actions.length > 0 && (
            <>
              <h3 style={{ marginTop: 14 }}>Runbook action</h3>
              <p className="small muted">
                Suggested by the service runbook, not by the copilot. The same approval policy
                applies.
              </p>
              {incident.actions.map((a) => (
                <ActionCard
                  key={a.id}
                  action={a}
                  canApprove
                  evidenceRated={evidenceRated}
                  onIncident={onIncident}
                />
              ))}
            </>
          )}

          {incident.status !== 'escalated' &&
            incident.status !== 'mitigated' &&
            incident.status !== 'resolved' && (
              <div className="btn-row" style={{ marginTop: 14 }}>
                <button
                  className="btn"
                  onClick={() =>
                    escalate(
                      inv.status === 'complete'
                        ? 'Engineer wants a second opinion'
                        : 'Copilot abstained',
                    )
                  }
                >
                  Escalate to service owner
                </button>
              </div>
            )}
        </>
      )}
    </section>
  );
}
