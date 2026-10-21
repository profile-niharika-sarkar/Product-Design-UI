# UI specification

The complete UI for Nexus AI: information architecture, every screen, the component inventory, required states, and the analytics event catalogue. Status column shows what this starter already implements.

## Information architecture

```
Operate
  Overview ............................ /                     built
  Incidents ........................... /incidents            built
    Incident detail ................... /incidents/:id        built (flagship)
  Services ............................ /services             built
    Service detail .................... /services/:id         built
Expand
  Agent studio (P1) ................... /agents               built (client-side prototype)
  Insights (P2) ....................... /insights             built (canned answers)
Govern
  Control center ...................... /control              built
    Audit log | Action policies | Model registry | AI quality | Analytics events
Planned
  Settings: integrations, data sources, users and roles ...... phase 4–5
  Postmortem draft ............................................ phase 2+
  Sign-in ..................................................... phase 5
```

Navigation is a persistent left sidebar (collapses to a drawer under 900 px) grouped by job: operate, expand, govern. Expansion modules carry their priority tier (P1, P2) so the product strategy is visible in the UI.

## Trust-state system

The defining UI rule. Every AI-related surface labels content with exactly one state, and each state has a distinct shape so meaning never depends on color.

| State | Component | Shape | Used for |
| --- | --- | --- | --- |
| Observed | `<TrustTag state="observed">` | Solid border, filled square | Telemetry, evidence, computed data |
| Hypothesis | `<TrustTag state="hypothesis">` | Dashed border, hollow diamond | Copilot explanations, interpretations |
| Proposed | `<TrustTag state="proposed">` | Double border, triangle | Actions awaiting approval |
| Completed | `<TrustTag state="completed">` | Filled, check mark | Verified, executed actions |

Containers echo the tag: hypothesis cards have dashed borders, proposed action cards have double borders.

## Screens

### Overview
**Job:** “Is anything wrong, and where?” in five seconds.
**Content:** stale-data banners; KPIs (open incidents, MTTR, duplicate alerts held back, evidence validity); open incidents table; recent activity feed; service dependency map; service health cards with sparklines.
**States:** loading skeletons per section; stale data banner when any source lags more than 2 minutes; empty open-incidents message; API-unreachable banner.

### Incidents
**Job:** triage the queue.
**Content:** sortable, filterable table (severity, id, title, service, status, alert count, copilot status, age); saved views (Active, All).
**States:** loading, empty per view, no filter matches, error with retry.

### Incident detail (flagship)
**Job:** go from page to verified fix without leaving the screen.
**Layout:** two columns. Left: metric chart with deploy/action markers, timeline with grouped-alert drill-down, affected-services map, evidence list with relevance feedback, incident audit log. Right (sticky): copilot panel.
**Copilot panel sequence:**
1. Scope statement (what it can read; that it can’t act).
2. Start investigation → progress state.
3. Tool calls performed (transparency).
4. Ranked hypotheses: likelihood word plus band, statement, citation chips (supporting, and struck-through “against”).
5. Missing information.
6. Suggested next step plus “No production action has been taken.”
7. Evidence-review confirmation (gates approval).
8. Proposed action card: scope, risk, expected effect, failure handling, executing identity, policy checks, Approve / Reject.
9. Execution: demo outcome control, running state, success (completed) or failure (verified state + Retry / Escalate).
**Alternate paths:** abstention (no hypotheses, runbook action shown separately); permission denied on approval; escalation; investigation failure.

### Services and service detail
**Job:** understand one service’s health and neighbours.
**Content:** table with health, golden signals and trend; detail with KPI row, error and latency charts, upstream/downstream map, incidents on this service.

### Agent studio (P1)
**Job:** build and safely ship an agent.
**Content:** agent list; builder with workflow steps (an approval gate appears automatically when a write tool is granted), configuration (name, instructions, tools with “writes” labels, autonomy level with L3 locked), evaluation panel with checks that block deploy until all pass.

### Insights (P2)
**Job:** answer a business question with visible provenance.
**Content:** question box and suggestions; answer card with computed result (observed) and interpretation (hypothesis); provenance card with query, sources, freshness, access note; save and flag actions.

### Control center
**Job:** govern and audit.
**Tabs:** audit log (filter by human / agent / system), action policies, model registry (validity, latency, cost), AI quality release gates, analytics events.

## Component inventory

| Component | File | Notes |
| --- | --- | --- |
| AppShell | `components/AppShell.tsx` | Sidebar, top bar, theme switch, copilot mode chip, API-down banner |
| PageHeader | `components/PageHeader.tsx` | Breadcrumbs, title, description, actions |
| TrustTag, SeverityBadge, StatusPill, HealthBadge | `components/Badges.tsx` | Shape and glyph carry meaning, not only color |
| DataTable | `components/DataTable.tsx` | Sort, filter, row click, keyboard, toolbar slot |
| LineChart, Sparkline | `components/LineChart.tsx` | SVG, threshold line, event markers |
| DependencyMap | `components/DependencyMap.tsx` | Layered layout, health styling, clickable nodes |
| Loading, ErrorState, Empty, PermissionDenied, StaleBanner | `components/StateView.tsx` | Every data view uses these |
| Timeline, EvidenceList, CopilotPanel, ActionCard, AuditFeed | `features/incident/` | Flagship flow |

## Required states for every data view

| State | Pattern |
| --- | --- |
| Loading | Skeleton lines with `role="status"` |
| Empty | Dashed box, says what will appear and how to make it appear |
| Error | Says what failed and offers Try again |
| Permission denied | Says which role is needed and who can help |
| Stale data | Banner naming the source and lag, and what it means for results |
| Partial data | Copilot lists missing information explicitly |
| Action failed | Shows verified system state, then Retry / Escalate |

## Analytics event catalogue

Event names are past-tense snake_case. Properties never include personal data or free text.

| Event | Fired when | Key properties | Metric it feeds |
| --- | --- | --- | --- |
| `incident_viewed` | Incident detail opens | incident, status | Coverage |
| `incident_acknowledged` | Acknowledge clicked | incident | MTTA |
| `investigation_started` | Start investigation | incident | Coverage |
| `hypotheses_shown` | Result arrives | status, count, seconds_to_first_hypothesis, mode | North star, latency, abstention rate |
| `evidence_opened` | Citation chip clicked | evidence | Trust behaviour |
| `evidence_feedback` | Relevance rated | evidence, relevant | Evidence validity (online proxy) |
| `evidence_review_confirmed` | Review box ticked | evidence_items_rated | Blind-approval guardrail |
| `action_approved` | Approve clicked | action, evidence_items_rated | Acceptance |
| `blind_approval_flagged` | Approved with zero evidence rated | action | Guardrail |
| `action_executed` / `action_retried` | Run / Retry | action, attempt | Remediation success |
| `incident_escalated` | Escalate | from | Abstention handling |
| `agent_eval_started` / `agent_eval_completed` | Agent studio | agent, pass_rate | Agent quality |
| `insight_asked` / `insight_saved` / `insight_flagged` | Insights | matched | P2 demand signal |

## Accessibility checklist

- All actions are `<button>` or links; table rows with click handlers are focusable and respond to Enter.
- Visible focus ring from `--focus`.
- Severity, health and trust states use shape or glyph in addition to color.
- Charts have `role="img"` and an `aria-label` describing the latest value and threshold.
- Dynamic results use `role="status"` or `role="alert"`.
- Reduced motion respected (skeleton shimmer and drawer transition disabled).
- Light and dark themes both meet contrast; test both.
