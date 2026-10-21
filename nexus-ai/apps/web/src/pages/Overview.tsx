import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, Loading, StaleBanner } from '../components/StateView';
import { HealthBadge, SeverityBadge, StatusPill } from '../components/Badges';
import { DataTable } from '../components/DataTable';
import { DependencyMap } from '../components/DependencyMap';
import { Sparkline } from '../components/LineChart';
import { lag, pct, timeAgo } from '../lib/format';
import { AuditFeed } from '../features/incident/AuditFeed';

export function Overview() {
  const nav = useNavigate();
  const summary = useApi(api.overview);
  const services = useApi(api.services);
  const incidents = useApi(api.incidents);
  const audit = useApi(api.audit);

  if (summary.error) return <ErrorState error={summary.error} onRetry={summary.reload} />;
  const s = summary.data;
  const stale = s?.dataFreshness.filter((f) => f.lagSeconds > 120) ?? [];
  const open = incidents.data?.filter((i) => !['mitigated', 'resolved'].includes(i.status)) ?? [];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Platform health, open incidents and recent AI activity across your services."
      />
      {stale.map((f) => (
        <StaleBanner key={f.source}>
          <strong>
            {f.source} is {lag(f.lagSeconds)} behind.
          </strong>{' '}
          Recent log evidence may be missing from investigations until it catches up.
        </StaleBanner>
      ))}
      {!s ? (
        <Loading />
      ) : (
        <div className="grid cols-4">
          <div className="card kpi">
            <div className="label">Open incidents</div>
            <div className="value">{s.openIncidents}</div>
            <div className="note">{s.servicesDegraded} services not healthy</div>
          </div>
          <div className="card kpi">
            <div className="label">Mean time to resolve, 30 days</div>
            <div className="value">{s.mttrMinutes} min</div>
            <div className="note">Baseline before Nexus: 52 min (simulated)</div>
          </div>
          <div className="card kpi">
            <div className="label">Duplicate alerts held back today</div>
            <div className="value">
              {s.alertsSuppressed} of {s.alertsToday}
            </div>
            <div className="note">Grouped into incidents instead of paging</div>
          </div>
          <div className="card kpi">
            <div className="label">Copilot evidence validity</div>
            <div className="value">{pct(s.evidenceValidity * 100, 0)}</div>
            <div className="note">Last weekly expert review; gate is 90%</div>
          </div>
        </div>
      )}

      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <section className="card">
          <div className="card-head">
            <h2>Open incidents</h2>
            <button className="btn sm" onClick={() => nav('/incidents')}>
              View all
            </button>
          </div>
          {!incidents.data ? (
            <Loading lines={3} />
          ) : (
            <DataTable
              rows={open}
              rowKey={(r) => r.id}
              onRowClick={(r) => nav(`/incidents/${r.id}`)}
              empty="No open incidents. Everything is quiet."
              columns={[
                {
                  key: 'sev',
                  header: 'Severity',
                  render: (r) => <SeverityBadge severity={r.severity} />,
                },
                {
                  key: 'title',
                  header: 'Incident',
                  render: (r) => (
                    <>
                      <strong>{r.id}</strong> <span className="muted">{r.title}</span>
                    </>
                  ),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (r) => <StatusPill status={r.status} />,
                },
                {
                  key: 'age',
                  header: 'Opened',
                  render: (r) => <span className="muted small">{timeAgo(r.openedAt)}</span>,
                },
              ]}
            />
          )}
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Recent activity</h2>
          </div>
          {!audit.data ? <Loading lines={3} /> : <AuditFeed entries={audit.data.slice(0, 6)} />}
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <h2>Service map</h2>
          <span className="small muted">Select a service to open it</span>
        </div>
        {!services.data ? (
          <Loading />
        ) : (
          <DependencyMap
            services={services.data}
            focus={['checkout-service', 'payment-service']}
            onSelect={(id) => nav(`/services/${id}`)}
          />
        )}
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <h2>Service health</h2>
        </div>
        {!services.data ? (
          <Loading />
        ) : (
          <div className="grid cols-4">
            {services.data.map((sv) => (
              <button
                key={sv.id}
                className="card"
                style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                onClick={() => nav(`/services/${sv.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong>{sv.name}</strong>
                  <HealthBadge health={sv.health} />
                </div>
                <div className="small muted">{sv.team}</div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    marginTop: 8,
                  }}
                >
                  <span className="num small">{pct(sv.errorRate)} errors</span>
                  <Sparkline
                    values={sv.errorSeries}
                    color={sv.health === 'healthy' ? 'var(--ink-3)' : 'var(--crit)'}
                    width={90}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
