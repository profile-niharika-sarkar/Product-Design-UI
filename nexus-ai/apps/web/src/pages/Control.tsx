import { useState } from 'react';
import type { ActorType, AuditEntry, ModelEntry, Policy } from '@nexus/shared';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, Loading } from '../components/StateView';
import { DataTable } from '../components/DataTable';
import { clock, ms } from '../lib/format';

type Tab = 'audit' | 'policies' | 'models' | 'quality' | 'events';

function AuditTab() {
  const { data, error, reload } = useApi(api.audit);
  const [actor, setActor] = useState<ActorType | 'all'>('all');
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <DataTable<AuditEntry>
      rows={data.filter((e) => actor === 'all' || e.actorType === actor)}
      rowKey={(r) => r.id}
      filterText={(r) => `${r.actor} ${r.action} ${r.target} ${r.detail ?? ''}`}
      filterPlaceholder="Filter audit log"
      empty="No audit entries yet. Work an incident to create some."
      toolbar={
        <div className="seg" role="group" aria-label="Actor type">
          {(['all', 'human', 'agent', 'system'] as const).map((a) => (
            <button key={a} aria-pressed={actor === a} onClick={() => setActor(a)}>
              {a[0].toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>
      }
      columns={[
        {
          key: 'at',
          header: 'Time',
          render: (r) => <span className="num">{clock(r.at)}</span>,
          sortValue: (r) => r.at,
        },
        {
          key: 'actor',
          header: 'Actor',
          render: (r) => (
            <span
              className={`who-${r.actorType}`}
              style={{
                fontWeight: 700,
                color:
                  r.actorType === 'agent'
                    ? 'var(--hyp)'
                    : r.actorType === 'system'
                      ? 'var(--obs)'
                      : undefined,
              }}
            >
              {r.actor}
            </span>
          ),
          sortValue: (r) => r.actor,
        },
        { key: 'type', header: 'Type', render: (r) => <span className="pill">{r.actorType}</span> },
        {
          key: 'action',
          header: 'Action',
          render: (r) => r.action.replace(/_/g, ' '),
          sortValue: (r) => r.action,
        },
        {
          key: 'target',
          header: 'Target',
          render: (r) => <span className="mono">{r.target}</span>,
        },
        {
          key: 'detail',
          header: 'Detail',
          render: (r) => <span className="small muted">{r.detail}</span>,
        },
      ]}
    />
  );
}

function PoliciesTab() {
  const { data, error, reload } = useApi(api.policies);
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <DataTable<Policy>
      rows={data}
      rowKey={(r) => r.id}
      columns={[
        {
          key: 'name',
          header: 'Policy',
          render: (r) => (
            <>
              <strong>{r.name}</strong>
              <div className="small muted">{r.description}</div>
            </>
          ),
        },
        {
          key: 'class',
          header: 'Action class',
          render: (r) => <span className="mono">{r.actionClass}</span>,
        },
        { key: 'auto', header: 'Max autonomy', render: (r) => r.autonomy },
        {
          key: 'roles',
          header: 'Who can approve',
          render: (r) =>
            r.approverRoles.length ? (
              r.approverRoles.join(', ')
            ) : (
              <span className="muted">Nobody: blocked</span>
            ),
        },
        {
          key: 'on',
          header: 'Status',
          render: (r) => <span className="pill">{r.enabled ? 'Enforced' : 'Off'}</span>,
        },
      ]}
    />
  );
}

function ModelsTab() {
  const { data, error, reload } = useApi(api.models);
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <DataTable<ModelEntry>
      rows={data}
      rowKey={(r) => r.id}
      columns={[
        {
          key: 'model',
          header: 'Model',
          render: (r) => (
            <>
              <strong>{r.model}</strong>
              <div className="small muted">{r.provider}</div>
            </>
          ),
          sortValue: (r) => r.model,
        },
        { key: 'use', header: 'Used for', render: (r) => r.useCase },
        {
          key: 'status',
          header: 'Status',
          render: (r) => <span className="pill">{r.status}</span>,
        },
        {
          key: 'valid',
          header: 'Evidence validity',
          render: (r) => `${Math.round(r.evidenceValidity * 100)}%`,
          sortValue: (r) => r.evidenceValidity,
          align: 'right',
        },
        {
          key: 'lat',
          header: 'p95 latency',
          render: (r) => ms(r.p95LatencyMs),
          sortValue: (r) => r.p95LatencyMs,
          align: 'right',
        },
        {
          key: 'cost',
          header: 'Cost per investigation',
          render: (r) => `$${r.costPerInvestigationUsd.toFixed(2)}`,
          sortValue: (r) => r.costPerInvestigationUsd,
          align: 'right',
        },
      ]}
    />
  );
}

const GATES = [
  { m: 'Evidence validity', target: '≥ 90%', now: '91%', pass: true },
  { m: 'Root cause in top 3', target: '≥ 70%', now: '74%', pass: true },
  { m: 'Calibration, “likely” band', target: '60–80% correct', now: '68%', pass: true },
  { m: 'Permission leaks', target: '0', now: '0', pass: true },
  { m: 'Injection probes passed', target: '100%', now: '100%', pass: true },
  { m: 'Time to first hypothesis, p95', target: '< 90 s', now: '64 s', pass: true },
  { m: 'Blind approvals', target: '< 10%', now: '14%', pass: false },
];

function QualityTab() {
  return (
    <>
      <p className="small muted">
        Release gates for the copilot, from the latest evaluation run on the versioned golden set
        (simulated).
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              <th>Gate</th>
              <th className="right">Current</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {GATES.map((g) => (
              <tr key={g.m}>
                <td>{g.m}</td>
                <td>{g.target}</td>
                <td className="right">{g.now}</td>
                <td>
                  <ul className="policy" style={{ margin: 0 }}>
                    <li className={g.pass ? 'pass' : 'fail'}>{g.pass ? 'Pass' : 'Needs work'}</li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EventsTab() {
  const { data, error, reload } = useApi(api.events);
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!data) return <Loading />;
  return (
    <>
      <p className="small muted">
        Product analytics events. Separate from the audit log: these measure how the product is
        used, not who changed what.
      </p>
      <DataTable
        rows={data.map((e, i) => ({ ...e, key: `${e.at}-${i}` }))}
        rowKey={(r) => r.key}
        filterText={(r) => r.name}
        filterPlaceholder="Filter by event name"
        empty="No events yet. Use the app and come back."
        columns={[
          { key: 'at', header: 'Time', render: (r) => <span className="num">{clock(r.at)}</span> },
          {
            key: 'name',
            header: 'Event',
            render: (r) => (
              <span className="mono" style={{ color: 'var(--dec)' }}>
                {r.name}
              </span>
            ),
          },
          {
            key: 'props',
            header: 'Properties',
            render: (r) => <span className="mono small">{JSON.stringify(r.props)}</span>,
          },
        ]}
      />
    </>
  );
}

export function Control() {
  const [tab, setTab] = useState<Tab>('audit');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'audit', label: 'Audit log' },
    { id: 'policies', label: 'Action policies' },
    { id: 'models', label: 'Model registry' },
    { id: 'quality', label: 'AI quality' },
    { id: 'events', label: 'Analytics events' },
  ];
  return (
    <>
      <PageHeader
        title="Control center"
        description="Who and what did each thing, what agents are allowed to do, and whether the AI is good enough to ship."
      />
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === 'audit' && <AuditTab />}
        {tab === 'policies' && <PoliciesTab />}
        {tab === 'models' && <ModelsTab />}
        {tab === 'quality' && <QualityTab />}
        {tab === 'events' && <EventsTab />}
      </div>
    </>
  );
}
