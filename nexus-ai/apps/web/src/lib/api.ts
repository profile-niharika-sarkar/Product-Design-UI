import type {
  Agent,
  AnalyticsEvent,
  AuditEntry,
  CurrentUser,
  Incident,
  IncidentListItem,
  ModelEntry,
  OverviewSummary,
  Policy,
  Service,
} from '@nexus/shared';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: init?.body
        ? { 'Content-Type': 'application/json', ...init?.headers }
        : init?.headers,
    });
  } catch {
    throw new ApiError(
      0,
      'Can’t reach the Nexus API. Check that it’s running on port 4000 (npm run dev).',
    );
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.message ?? `Request failed (${res.status})`);
  return body as T;
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) });

export const api = {
  health: () => request<{ ok: boolean; copilotMode: 'claude' | 'scripted' }>('/api/health'),
  me: () => request<CurrentUser>('/api/me'),
  overview: () => request<OverviewSummary>('/api/overview'),
  services: () => request<Service[]>('/api/services'),
  service: (id: string) => request<Service>(`/api/services/${id}`),
  incidents: () => request<IncidentListItem[]>('/api/incidents'),
  incident: (id: string) => request<Incident>(`/api/incidents/${id}`),
  acknowledge: (id: string) => post<Incident>(`/api/incidents/${id}/acknowledge`),
  investigate: (id: string) => post<Incident>(`/api/incidents/${id}/investigate`),
  escalate: (id: string, reason?: string) =>
    post<Incident>(`/api/incidents/${id}/escalate`, { reason }),
  approve: (actionId: string) => post<Incident>(`/api/actions/${actionId}/approve`),
  reject: (actionId: string) => post<Incident>(`/api/actions/${actionId}/reject`),
  execute: (actionId: string, simulate: 'success' | 'failure') =>
    post<Incident>(`/api/actions/${actionId}/execute`, { simulate }),
  agents: () => request<Agent[]>('/api/agents'),
  policies: () => request<Policy[]>('/api/policies'),
  models: () => request<ModelEntry[]>('/api/models'),
  audit: () => request<AuditEntry[]>('/api/audit'),
  events: () => request<AnalyticsEvent[]>('/api/events'),
  reset: () => post<{ ok: boolean }>('/api/admin/reset'),
};
