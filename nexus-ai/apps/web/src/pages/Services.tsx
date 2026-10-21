import { useNavigate } from 'react-router-dom';
import type { Service } from '@nexus/shared';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, Loading } from '../components/StateView';
import { HealthBadge } from '../components/Badges';
import { DataTable } from '../components/DataTable';
import { Sparkline } from '../components/LineChart';
import { ms, pct } from '../lib/format';

const HEALTH_ORDER = { down: 0, degraded: 1, healthy: 2 };

export function Services() {
  const nav = useNavigate();
  const { data, error, reload } = useApi(api.services);
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader
        title="Services"
        description="Health, golden signals and dependencies for every service sending telemetry."
      />
      {!data ? (
        <Loading />
      ) : (
        <DataTable<Service>
          rows={data}
          rowKey={(r) => r.id}
          onRowClick={(r) => nav(`/services/${r.id}`)}
          filterText={(r) => `${r.name} ${r.team}`}
          filterPlaceholder="Filter by service or team"
          columns={[
            {
              key: 'health',
              header: 'Health',
              render: (r) => <HealthBadge health={r.health} />,
              sortValue: (r) => HEALTH_ORDER[r.health],
            },
            {
              key: 'name',
              header: 'Service',
              render: (r) => <strong className="mono">{r.name}</strong>,
              sortValue: (r) => r.name,
            },
            { key: 'team', header: 'Owner', render: (r) => r.team, sortValue: (r) => r.team },
            {
              key: 'err',
              header: 'Error rate',
              render: (r) => pct(r.errorRate),
              sortValue: (r) => r.errorRate,
              align: 'right',
            },
            {
              key: 'p95',
              header: 'p95 latency',
              render: (r) => ms(r.p95Ms),
              sortValue: (r) => r.p95Ms,
              align: 'right',
            },
            {
              key: 'rps',
              header: 'Requests/s',
              render: (r) => r.rps.toLocaleString(),
              sortValue: (r) => r.rps,
              align: 'right',
            },
            {
              key: 'trend',
              header: 'Errors, last 30 min',
              render: (r) => (
                <Sparkline
                  values={r.errorSeries}
                  color={r.health === 'healthy' ? 'var(--ink-3)' : 'var(--crit)'}
                />
              ),
            },
          ]}
        />
      )}
    </>
  );
}
