import type { AnalyticsEvent, AuditEntry, CurrentUser, Incident } from '@nexus/shared';
import { seedIncidents } from './data/seed.js';

/**
 * In-memory store. Good enough for the prototype; pipeline phase 3 swaps this
 * for Postgres behind the same functions so routes don't change.
 */
interface State {
  incidents: Incident[];
  audit: AuditEntry[];
  events: AnalyticsEvent[];
}

let state: State = fresh();
let seq = 0;

function fresh(): State {
  return { incidents: seedIncidents(), audit: [], events: [] };
}

export const currentUser: CurrentUser = {
  id: 'you',
  name: 'You (on-call SRE)',
  roles: ['payment-oncall'],
};

export const store = {
  reset() {
    state = fresh();
    seq = 0;
    store.audit({
      actor: 'Nexus',
      actorType: 'system',
      action: 'grouped_alerts',
      target: 'INC-2048',
      detail: 'Grouped 14 alerts into INC-2048 and paged on-call',
    });
  },
  incidents: () => state.incidents,
  incident: (id: string) => state.incidents.find((i) => i.id === id),
  findAction(actionId: string) {
    for (const inc of state.incidents) {
      const action = inc.actions.find((a) => a.id === actionId);
      if (action) return { incident: inc, action };
    }
    return undefined;
  },
  /** Audit entries are append-only: there is deliberately no update or delete. */
  audit(entry: Omit<AuditEntry, 'id' | 'at'>) {
    const full: AuditEntry = { id: `AU-${++seq}`, at: new Date().toISOString(), ...entry };
    state.audit.push(full);
    return full;
  },
  auditLog: () => [...state.audit].reverse(),
  track(event: Omit<AnalyticsEvent, 'at'>) {
    state.events.push({ ...event, at: new Date().toISOString() });
  },
  events: () => [...state.events].reverse(),
};

store.reset();
