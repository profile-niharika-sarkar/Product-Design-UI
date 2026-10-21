import type { IncidentStatus, ServiceHealth, Severity, TrustState } from '@nexus/shared';

const TRUST_LABEL: Record<TrustState, string> = {
  observed: 'Observed',
  hypothesis: 'Hypothesis',
  proposed: 'Proposed',
  completed: 'Completed',
};

/**
 * The single most important component in the product.
 * Every AI-related surface must label its content with one of these four states.
 * Shape (border style + glyph) carries meaning, so it never relies on color alone.
 */
export function TrustTag({ state, label }: { state: TrustState; label?: string }) {
  return <span className={`tag t-${state}`}>{label ?? TRUST_LABEL[state]}</span>;
}

const SEV_LABEL: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};
export function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`sev sev-${severity}`}>{SEV_LABEL[severity]}</span>;
}

const STATUS_LABEL: Record<IncidentStatus, string> = {
  open: 'Open',
  acknowledged: 'Acknowledged',
  investigating: 'Investigating',
  mitigating: 'Mitigating',
  mitigated: 'Mitigated',
  escalated: 'Escalated',
  resolved: 'Resolved',
};
export function StatusPill({ status }: { status: IncidentStatus }) {
  return <span className={`status st-${status}`}>{STATUS_LABEL[status]}</span>;
}

const HEALTH_LABEL: Record<ServiceHealth, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Failing',
};
export function HealthBadge({ health }: { health: ServiceHealth }) {
  return <span className={`health h-${health}`}>{HEALTH_LABEL[health]}</span>;
}
