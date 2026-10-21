import { useState } from 'react';
import type { Incident, ProposedAction } from '@nexus/shared';
import { TrustTag } from '../../components/Badges';
import { PermissionDenied } from '../../components/StateView';
import { api, ApiError } from '../../lib/api';
import { track } from '../../lib/analytics';

export function ActionCard({
  action,
  canApprove,
  evidenceRated,
  onIncident,
}: {
  action: ProposedAction;
  canApprove: boolean;
  evidenceRated: number;
  onIncident: (i: Incident) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [simulate, setSimulate] = useState<'success' | 'failure'>('success');

  async function run(kind: string, fn: () => Promise<Incident>) {
    setBusy(kind);
    setError(null);
    try {
      onIncident(await fn());
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(null);
    }
  }

  const approve = () => {
    track('action_approved', { action: action.kind, evidence_items_rated: evidenceRated });
    if (evidenceRated === 0) track('blind_approval_flagged', { action: action.kind });
    return run('approve', () => api.approve(action.id));
  };
  const execute = () => {
    track(action.attempts > 0 ? 'action_retried' : 'action_executed', {
      action: action.kind,
      attempt: action.attempts + 1,
    });
    return run('execute', () => api.execute(action.id, simulate));
  };

  const tagState = action.status === 'succeeded' ? 'completed' : 'proposed';
  const tagLabel =
    action.status === 'succeeded'
      ? 'Completed'
      : action.status === 'approved'
        ? 'Approved'
        : action.status === 'rejected'
          ? 'Rejected'
          : action.status === 'failed'
            ? 'Failed'
            : 'Proposed';

  return (
    <div className="action">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <TrustTag state={tagState} label={tagLabel} />
        <h3>{action.title}</h3>
      </div>
      <dl>
        <dt>Scope</dt>
        <dd>{action.scope}</dd>
        <dt>Risk</dt>
        <dd>{action.risk}</dd>
        <dt>Expected effect</dt>
        <dd>{action.expectedEffect}</dd>
        <dt>If it fails</dt>
        <dd>{action.ifItFails}</dd>
        <dt>Runs as</dt>
        <dd>
          <code>{action.executesAs}</code>, a scoped service identity
        </dd>
      </dl>
      <ul className="policy" aria-label="Policy checks">
        {action.policyChecks.map((c) => (
          <li key={c.label} className={c.passed ? 'pass' : 'fail'}>
            {c.label}
          </li>
        ))}
      </ul>

      {error && (
        <div style={{ marginTop: 12 }}>
          {error instanceof ApiError && error.status === 403 ? (
            <PermissionDenied message={error.message} />
          ) : (
            <div className="result fail" role="alert">
              {error.message}
            </div>
          )}
        </div>
      )}

      {action.status === 'proposed' && (
        <>
          <p className="small muted" style={{ margin: '12px 0 8px' }}>
            Nexus won’t run this without approval under policy {action.policyId}.
          </p>
          <div className="btn-row">
            <button
              className="btn primary"
              disabled={!canApprove || !!busy}
              onClick={approve}
              title={canApprove ? undefined : 'Review the evidence first'}
            >
              {busy === 'approve' ? 'Approving…' : 'Approve'}
            </button>
            <button
              className="btn danger"
              disabled={!!busy}
              onClick={() => run('reject', () => api.reject(action.id))}
            >
              Reject
            </button>
          </div>
          {!canApprove && (
            <p className="small muted" style={{ marginTop: 8 }}>
              Confirm you’ve reviewed the evidence to enable approval.
            </p>
          )}
        </>
      )}

      {(action.status === 'approved' ||
        action.status === 'failed' ||
        action.status === 'running' ||
        busy === 'execute') && (
        <>
          {action.status === 'failed' && (
            <div className="result fail" role="alert">
              <strong>Action failed.</strong> {action.result}
            </div>
          )}
          {action.attempts === 0 && (
            <div className="proto">
              <span>Demo control, not part of the product: simulate</span>
              <span className="seg" role="group" aria-label="Simulated outcome">
                <button
                  aria-pressed={simulate === 'success'}
                  onClick={() => setSimulate('success')}
                >
                  Success
                </button>
                <button
                  aria-pressed={simulate === 'failure'}
                  onClick={() => setSimulate('failure')}
                >
                  Failure
                </button>
              </span>
            </div>
          )}
          <div className="btn-row" style={{ marginTop: 10 }}>
            <button className="btn primary" disabled={!!busy} onClick={execute}>
              {busy === 'execute' ? (
                <>
                  <span className="spinner" aria-hidden="true" /> Running and verifying…
                </>
              ) : action.status === 'failed' ? (
                'Retry'
              ) : (
                'Run approved action'
              )}
            </button>
          </div>
        </>
      )}

      {action.status === 'succeeded' && (
        <div className="result ok">
          <strong>Completed and verified.</strong> {action.result}
        </div>
      )}
      {action.status === 'rejected' && (
        <p className="small muted" style={{ marginTop: 10 }}>
          Rejected. Nothing was run.
        </p>
      )}
    </div>
  );
}
