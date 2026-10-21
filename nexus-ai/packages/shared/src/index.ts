/**
 * Domain types shared by the API and the web app.
 * Change these first when adding a feature: both sides will then fail to typecheck until updated.
 */

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type ServiceHealth = 'healthy' | 'degraded' | 'down';

/** The four trust states every AI-related surface must distinguish. */
export type TrustState = 'observed' | 'hypothesis' | 'proposed' | 'completed';

export interface Service {
  id: string;
  name: string;
  team: string;
  health: ServiceHealth;
  errorRate: number; // percent
  p95Ms: number;
  rps: number;
  dependsOn: string[];
  external?: boolean;
  errorSeries: number[]; // last 14 points
  latencySeries: number[]; // last 14 points, ms
}

export interface Alert {
  id: string;
  source: string;
  signal: string;
  service: string;
  firstSeen: string;
  severity: Severity;
  duplicate: boolean;
}

export type TimelineKind =
  'deploy' | 'metric' | 'trace' | 'log' | 'alert' | 'action' | 'human' | 'agent';

export interface TimelineEvent {
  id: string;
  time: string; // HH:MM:SS
  kind: TimelineKind;
  text: string;
  source: string;
  key?: boolean;
}

export interface Evidence {
  id: string;
  source: string;
  timestamp: string;
  title: string;
  detail: string;
  snippet?: string;
}

export type Likelihood = 'likely' | 'possible' | 'unlikely' | 'very_unlikely';

export interface Hypothesis {
  id: string;
  rank: number;
  statement: string;
  likelihood: Likelihood;
  evidenceIds: string[];
  againstIds: string[];
}

export interface Investigation {
  id: string;
  incidentId: string;
  status: 'complete' | 'abstained' | 'failed';
  mode: 'scripted' | 'claude';
  startedAt: string;
  secondsToFirstHypothesis: number;
  toolCalls: string[];
  hypotheses: Hypothesis[];
  missingInfo: string[];
  recommendedNextStep: string;
  abstainReason?: string;
  droppedClaims?: number; // hypotheses removed because their citations failed validation
}

export type ActionStatus =
  'proposed' | 'approved' | 'rejected' | 'running' | 'succeeded' | 'failed';

export interface PolicyCheck {
  label: string;
  passed: boolean;
}

export interface ProposedAction {
  id: string;
  incidentId: string;
  title: string;
  kind: 'rollback' | 'restart' | 'scale';
  scope: string;
  risk: string;
  expectedEffect: string;
  ifItFails: string;
  executesAs: string;
  policyId: string;
  requiredRole: string;
  policyChecks: PolicyCheck[];
  status: ActionStatus;
  attempts: number;
  result?: string;
  approvedBy?: string;
}

export type IncidentStatus =
  'open' | 'acknowledged' | 'investigating' | 'mitigating' | 'mitigated' | 'escalated' | 'resolved';

export interface MetricSeries {
  label: string;
  unit: string;
  threshold: number;
  baseline: number;
  points: { t: string; v: number }[];
  markers: { t: string; label: string; kind: 'deploy' | 'action' }[];
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  openedAt: string;
  region: string;
  summary: string;
  alerts: Alert[];
  timeline: TimelineEvent[];
  evidence: Evidence[];
  metric: MetricSeries;
  affectedServices: string[];
  investigation?: Investigation;
  actions: ProposedAction[];
}

export type IncidentListItem = Pick<
  Incident,
  'id' | 'title' | 'service' | 'severity' | 'status' | 'openedAt' | 'region'
> & { alertCount: number; hasInvestigation: boolean };

export type ActorType = 'human' | 'agent' | 'system';

export interface AuditEntry {
  id: string;
  at: string; // ISO
  actor: string;
  actorType: ActorType;
  action: string;
  target: string;
  detail?: string;
}

export interface AnalyticsEvent {
  name: string;
  at: string;
  props: Record<string, string | number | boolean | null>;
}

export type AutonomyLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'testing' | 'deployed';
  owner: string;
  version: string;
  autonomy: AutonomyLevel;
  tools: string[];
  instructions: string;
  lastEval?: { passRate: number; runs: number; at: string };
}

export interface Policy {
  id: string;
  name: string;
  actionClass: string;
  autonomy: AutonomyLevel;
  approverRoles: string[];
  enabled: boolean;
  description: string;
}

export interface ModelEntry {
  id: string;
  provider: string;
  model: string;
  useCase: string;
  status: 'active' | 'shadow' | 'retired';
  p95LatencyMs: number;
  costPerInvestigationUsd: number;
  evidenceValidity: number; // 0..1, from last eval run
}

export interface OverviewSummary {
  openIncidents: number;
  mttrMinutes: number;
  alertsToday: number;
  alertsSuppressed: number;
  evidenceValidity: number;
  servicesDegraded: number;
  dataFreshness: { source: string; lagSeconds: number }[];
}

export interface CurrentUser {
  id: string;
  name: string;
  roles: string[];
}

export const LIKELIHOOD_LABEL: Record<Likelihood, string> = {
  likely: 'Likely',
  possible: 'Possible',
  unlikely: 'Unlikely',
  very_unlikely: 'Very unlikely',
};

/** Rough probability band shown next to each likelihood word. Calibration targets, not guarantees. */
export const LIKELIHOOD_BAND: Record<Likelihood, number> = {
  likely: 0.7,
  possible: 0.4,
  unlikely: 0.18,
  very_unlikely: 0.06,
};
