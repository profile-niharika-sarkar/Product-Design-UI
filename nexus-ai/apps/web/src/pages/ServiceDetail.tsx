import { Link, useNavigate, useParams } from 'react-router-dom';
import type { MetricSeries, Service } from '@nexus/shared';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';
import { PageHeader } from '../components/PageHeader';
import { Empty, ErrorState, Loading } from '../components/StateView';
import { HealthBadge, SeverityBadge, StatusPill } from '../components/Badges';
import { LineChart } from '../components/LineChart';
import { DependencyMap } from '../components/DependencyMap';
import { ms, pct } from '../lib/format';

const T = [
  '13:56',
  '13:58',
  '14:00',
  '14:02',
  '14:04',
  '14:06',
  '14:08',
  '14:10',
  '14:12',
  '14:14',
  '14:16',
  '14:18',
  '14:20',
  '14:22',
];
const series = (label: string, unit: string, vals: number[], threshold: number): MetricSeries => ({
  label,
  unit,
  threshold,
  baseline: vals[0],
  points: vals.map((v, i) => ({ t: T[i] ?? String(i), v })),
  markers: [],
});

export function ServiceDetail() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const svc = useApi(() => api.service(id), [id]);
  const all = useApi(api.services);
  const incidents = useApi(api.incidents);
  if (svc.error) return <ErrorState error={svc.error} onRetry={svc.reload} />;
  const s = svc.data;
  if (!s) return <Loading lines={6} />;

  const neighbours: Service[] =
    all.data?.filter(
      (x) => x.id === s.id || s.dependsOn.includes(x.id) || x.dependsOn.includes(s.id),
    ) ?? [];
  const related = incidents.data?.filter((i) => i.service === s.id) ?? [];

  return (
    <>
      <PageHeader
        crumbs={[{ to: '/services', label: 'Services' }]}
        title={
          <span className="mono" style={{ fontSize: '1.4rem' }}>
            {s.name}
          </span>
        }
        description={
          <span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
            <HealthBadge health={s.health} /> Owned by {s.team}
          </span>
        }
      />
      <div className="grid cols-4">
        <div className="card kpi">
          <div className="label">Error rate</div>
          <div className="value">{pct(s.errorRate)}</div>
        </div>
        <div className="card kpi">
          <div className="label">p95 latency</div>
          <div className="value">{ms(s.p95Ms)}</div>
        </div>
        <div className="card kpi">
          <div className="label">Requests per second</div>
          <div className="value">{s.rps.toLocaleString()}</div>
        </div>
        <div className="card kpi">
          <div className="label">Dependencies</div>
          <div className="value">{s.dependsOn.length}</div>
        </div>
      </div>
      <div className="grid cols-2" style={{ marginTop: 16 }}>
        <section className="card">
          <div className="card-head">
            <h2>Error rate</h2>
          </div>
          <LineChart series={series('error rate', '%', s.errorSeries, 2)} height={180} />
        </section>
        <section className="card">
          <div className="card-head">
            <h2>p95 latency</h2>
          </div>
          <LineChart
            series={series(
              'p95 latency',
              'ms',
              s.latencySeries,
              Math.max(800, s.latencySeries[0] * 2),
            )}
            height={180}
          />
        </section>
      </div>
      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <h2>Upstream and downstream</h2>
        </div>
        {neighbours.length > 1 ? (
          <DependencyMap services={neighbours} onSelect={(sid) => nav(`/services/${sid}`)} />
        ) : (
          <Empty title="No known dependencies">
            Dependencies appear once traces flow between services.
          </Empty>
        )}
      </section>
      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-head">
          <h2>Incidents on this service</h2>
        </div>
        {related.length === 0 ? (
          <Empty title="No incidents in the last 7 days" />
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {related.map((i) => (
              <li
                key={i.id}
                style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0' }}
              >
                <SeverityBadge severity={i.severity} />{' '}
                <Link to={`/incidents/${i.id}`}>
                  <strong>{i.id}</strong> {i.title}
                </Link>{' '}
                <StatusPill status={i.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
