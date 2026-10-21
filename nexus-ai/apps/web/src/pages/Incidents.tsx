import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IncidentListItem } from '@nexus/shared';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, Loading } from '../components/StateView';
import { SeverityBadge, StatusPill } from '../components/Badges';
import { DataTable } from '../components/DataTable';
import { timeAgo } from '../lib/format';

const SEV_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };
type View = 'active' | 'all';

export function Incidents() {
  const nav = useNavigate();
  const { data, error, reload } = useApi(api.incidents);
  const [view, setView] = useState<View>('active');
  if (error) return <ErrorState error={error} onRetry={reload} />;
  const rows = (data ?? []).filter(
    (i) => view === 'all' || !['resolved', 'mitigated'].includes(i.status),
  );

  return (
    <>
      <PageHeader
        title="Incidents"
        description="Alerts are grouped into incidents so one problem pages once."
      />
      {!data ? (
        <Loading />
      ) : (
        <DataTable<IncidentListItem>
          rows={rows}
          rowKey={(r) => r.id}
          onRowClick={(r) => nav(`/incidents/${r.id}`)}
          filterText={(r) => `${r.id} ${r.title} ${r.service}`}
          filterPlaceholder="Filter by id, title or service"
          empty={view === 'active' ? 'No active incidents.' : 'No incidents match this filter.'}
          toolbar={
            <div className="seg" role="group" aria-label="Saved view">
              <button aria-pressed={view === 'active'} onClick={() => setView('active')}>
                Active
              </button>
              <button aria-pressed={view === 'all'} onClick={() => setView('all')}>
                All
              </button>
            </div>
          }
          columns={[
            {
              key: 'sev',
              header: 'Severity',
              render: (r) => <SeverityBadge severity={r.severity} />,
              sortValue: (r) => SEV_ORDER[r.severity],
            },
            {
              key: 'id',
              header: 'ID',
              render: (r) => <strong>{r.id}</strong>,
              sortValue: (r) => r.id,
            },
            { key: 'title', header: 'Title', render: (r) => r.title },
            {
              key: 'service',
              header: 'Service',
              render: (r) => <span className="mono">{r.service}</span>,
              sortValue: (r) => r.service,
            },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <StatusPill status={r.status} />,
              sortValue: (r) => r.status,
            },
            {
              key: 'alerts',
              header: 'Alerts',
              render: (r) => r.alertCount,
              sortValue: (r) => r.alertCount,
              align: 'right',
            },
            {
              key: 'ai',
              header: 'Copilot',
              render: (r) =>
                r.hasInvestigation ? (
                  <span className="pill">Investigated</span>
                ) : (
                  <span className="muted small">Not run</span>
                ),
            },
            {
              key: 'opened',
              header: 'Opened',
              render: (r) => <span className="muted">{timeAgo(r.openedAt)}</span>,
              sortValue: (r) => r.openedAt,
            },
          ]}
        />
      )}
    </>
  );
}
