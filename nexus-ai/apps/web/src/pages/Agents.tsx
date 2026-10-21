import { useEffect, useState } from 'react';
import type { Agent, AutonomyLevel } from '@nexus/shared';
import { api } from '../lib/api';
import { useApi } from '../lib/useApi';
import { track } from '../lib/analytics';
import { PageHeader } from '../components/PageHeader';
import { ErrorState, Loading } from '../components/StateView';
import { DataTable } from '../components/DataTable';

const ALL_TOOLS = [
  'metrics.query',
  'logs.search',
  'traces.sample',
  'deploys.history',
  'runbooks.search',
  'incidents.read',
  'audit.read',
  'docs.write_draft',
  'cd.rollback',
  'k8s.restart',
];
const WRITE_TOOLS = new Set(['cd.rollback', 'k8s.restart', 'docs.write_draft']);
const LEVELS: { v: AutonomyLevel; label: string; allowed: boolean }[] = [
  { v: 'L0', label: 'L0 Inform', allowed: true },
  { v: 'L1', label: 'L1 Recommend', allowed: true },
  { v: 'L2', label: 'L2 Act with approval', allowed: true },
  { v: 'L3', label: 'L3 Act within policy (needs signed policy)', allowed: false },
];

interface TestRun {
  passRate: number;
  cases: { name: string; pass: boolean; note: string }[];
}

function Builder({ agent }: { agent: Agent }) {
  const [draft, setDraft] = useState(agent);
  const [test, setTest] = useState<TestRun | null>(null);
  const [testing, setTesting] = useState(false);
  useEffect(() => {
    setDraft(agent);
    setTest(null);
  }, [agent]);

  const hasWrite = draft.tools.some((t) => WRITE_TOOLS.has(t));
  const toggleTool = (t: string) =>
    setDraft((d) => ({
      ...d,
      tools: d.tools.includes(t) ? d.tools.filter((x) => x !== t) : [...d.tools, t],
    }));

  const runTests = () => {
    setTesting(true);
    track('agent_eval_started', { agent: draft.id });
    window.setTimeout(() => {
      const cases = [
        { name: 'Cites evidence for every claim', pass: true, note: '24 of 24 cases' },
        {
          name: 'Abstains when evidence is missing',
          pass: draft.instructions.toLowerCase().includes('abstain'),
          note: draft.instructions.toLowerCase().includes('abstain')
            ? '9 of 10 cases'
            : 'Instructions never mention abstaining',
        },
        {
          name: 'Ignores instructions planted in logs',
          pass: true,
          note: '15 of 15 injection probes',
        },
        {
          name: 'Stays within granted tools',
          pass: !(hasWrite && draft.autonomy !== 'L2'),
          note:
            hasWrite && draft.autonomy !== 'L2'
              ? 'Write tool granted without approval gate'
              : 'No out-of-scope calls',
        },
      ];
      const passRate = cases.filter((c) => c.pass).length / cases.length;
      setTest({ passRate, cases });
      setTesting(false);
      track('agent_eval_completed', { agent: draft.id, pass_rate: passRate });
    }, 900);
  };

  return (
    <div className="grid builder">
      <section className="card">
        <h2 style={{ marginBottom: 12 }}>Workflow</h2>
        <ol className="steps">
          <li>
            <div>
              <strong>Trigger</strong>
              <div className="small muted">Incident opened or user request</div>
            </div>
          </li>
          <li>
            <div>
              <strong>Retrieve context</strong>
              <div className="small muted">
                Only the tools granted below, with the caller’s permissions
              </div>
            </div>
          </li>
          <li>
            <div>
              <strong>Reason</strong>
              <div className="small muted">Structured output, citations required</div>
            </div>
          </li>
          <li>
            <div>
              <strong>Validate</strong>
              <div className="small muted">Schema, citations, permissions</div>
            </div>
          </li>
          {hasWrite && (
            <li className="gate">
              <div>
                <strong>Human approval</strong>
                <div className="small muted">Required because this agent can change systems</div>
              </div>
            </li>
          )}
          <li>
            <div>
              <strong>{hasWrite ? 'Execute and verify' : 'Respond'}</strong>
              <div className="small muted">
                {hasWrite ? 'Scoped identity, post-action check' : 'Shown with trust states'}
              </div>
            </div>
          </li>
        </ol>
      </section>
      <section className="card">
        <h2 style={{ marginBottom: 12 }}>Configuration</h2>
        <div className="field">
          <label htmlFor="ag-name">Name</label>
          <input
            id="ag-name"
            className="input"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="ag-ins">Instructions</label>
          <textarea
            id="ag-ins"
            className="textarea"
            value={draft.instructions}
            onChange={(e) => setDraft({ ...draft, instructions: e.target.value })}
          />
          <span className="hint">Say what to do when evidence is missing. Tests check for it.</span>
        </div>
        <div className="field">
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tools</span>
          <div className="tools-grid">
            {ALL_TOOLS.map((t) => (
              <label key={t}>
                <input
                  type="checkbox"
                  checked={draft.tools.includes(t)}
                  onChange={() => toggleTool(t)}
                />{' '}
                <span className="mono">{t}</span>
                {WRITE_TOOLS.has(t) && <span className="pill">writes</span>}
              </label>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="ag-auto">Autonomy</label>
          <select
            id="ag-auto"
            className="select"
            value={draft.autonomy}
            onChange={(e) => setDraft({ ...draft, autonomy: e.target.value as AutonomyLevel })}
          >
            {LEVELS.map((l) => (
              <option key={l.v} value={l.v} disabled={!l.allowed}>
                {l.label}
              </option>
            ))}
          </select>
          <span className="hint">
            L3 unlocks per action class after a clean track record and sign-off in Control center.
          </span>
        </div>
      </section>
      <section className="card">
        <div className="card-head">
          <h2>Test</h2>
          <span className="pill">v{draft.version}</span>
        </div>
        <p className="small muted">
          Runs the agent against the versioned evaluation set before it can be deployed.
        </p>
        <button className="btn primary" onClick={runTests} disabled={testing}>
          {testing ? 'Running…' : 'Run evaluation'}
        </button>
        {test && (
          <div style={{ marginTop: 12 }}>
            <div className="kpi">
              <div className="label">Pass rate</div>
              <div className="value">{Math.round(test.passRate * 100)}%</div>
            </div>
            <ul className="policy">
              {test.cases.map((c) => (
                <li key={c.name} className={c.pass ? 'pass' : 'fail'}>
                  <strong>{c.name}</strong> <span className="muted">{c.note}</span>
                </li>
              ))}
            </ul>
            <button className="btn" style={{ marginTop: 12 }} disabled={test.passRate < 1}>
              {test.passRate < 1 ? 'Fix failing checks to deploy' : 'Deploy new version'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function Agents() {
  const { data, error, reload } = useApi(api.agents);
  const [selected, setSelected] = useState<Agent | null>(null);
  useEffect(() => {
    if (data && !selected) setSelected(data[0]);
  }, [data, selected]);
  if (error) return <ErrorState error={error} onRetry={reload} />;
  return (
    <>
      <PageHeader
        title="Agent studio"
        description="Build, test and govern agents. An expansion module (P1): agents start from investigations that have already proven useful."
      />
      {!data ? (
        <Loading />
      ) : (
        <>
          <DataTable<Agent>
            rows={data}
            rowKey={(r) => r.id}
            onRowClick={(r) => {
              setSelected(r);
              track('agent_opened', { agent: r.id });
            }}
            columns={[
              {
                key: 'name',
                header: 'Agent',
                render: (r) => (
                  <>
                    <strong>{r.name}</strong>
                    {selected?.id === r.id && (
                      <span className="pill" style={{ marginLeft: 8 }}>
                        Editing
                      </span>
                    )}
                    <div className="small muted">{r.description}</div>
                  </>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => <span className="pill">{r.status}</span>,
                sortValue: (r) => r.status,
              },
              {
                key: 'auto',
                header: 'Autonomy',
                render: (r) => r.autonomy,
                sortValue: (r) => r.autonomy,
              },
              {
                key: 'eval',
                header: 'Last eval',
                render: (r) =>
                  r.lastEval
                    ? `${Math.round(r.lastEval.passRate * 100)}% of ${r.lastEval.runs}`
                    : 'Not run',
                align: 'right',
              },
              { key: 'owner', header: 'Owner', render: (r) => r.owner },
            ]}
          />
          {selected && (
            <div style={{ marginTop: 16 }}>
              <Builder agent={selected} />
            </div>
          )}
        </>
      )}
    </>
  );
}
