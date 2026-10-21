import { useState } from 'react';
import { track } from '../lib/analytics';
import { PageHeader } from '../components/PageHeader';
import { TrustTag } from '../components/Badges';
import { Empty } from '../components/StateView';

interface Answer {
  q: string;
  answer: string;
  explanation: string;
  bars: { label: string; value: number }[];
  unit: string;
  sql: string;
  sources: string[];
  freshness: string;
}

const CANNED: Answer[] = [
  {
    q: 'How much revenue did INC-2048 put at risk?',
    answer:
      'About $41,000 in checkout value failed during the 13 minutes the error rate was above threshold.',
    explanation:
      'Failed checkouts track the payment timeouts closely, which suggests most of the loss came from the incident rather than normal abandonment. Some of these customers likely retried successfully later; that isn’t measured here.',
    bars: [
      { label: '14:04', value: 1.2 },
      { label: '14:06', value: 6.8 },
      { label: '14:08', value: 9.9 },
      { label: '14:10', value: 9.6 },
      { label: '14:12', value: 8.1 },
      { label: '14:14', value: 4.2 },
      { label: '14:16', value: 0.9 },
    ],
    unit: '$k failed checkout value',
    sql: "SELECT date_trunc('2 minutes', ts) AS t,\n       SUM(order_value) / 1000 AS failed_k\nFROM checkout_attempts\nWHERE status = 'failed'\n  AND ts BETWEEN '14:04' AND '14:17'\nGROUP BY 1 ORDER BY 1;",
    sources: ['warehouse.checkout_attempts', 'Nexus incident INC-2048 window'],
    freshness: 'Warehouse loaded 6 minutes ago',
  },
  {
    q: 'Which services caused the most incident minutes this quarter?',
    answer: 'payment-service and search-service account for 58% of incident minutes this quarter.',
    explanation:
      'Both had config-related incidents. This is a correlation across a small number of incidents and shouldn’t be read as a ranking of team performance.',
    bars: [
      { label: 'payment', value: 212 },
      { label: 'search', value: 148 },
      { label: 'notification', value: 96 },
      { label: 'checkout', value: 61 },
      { label: 'inventory', value: 33 },
    ],
    unit: 'incident minutes',
    sql: "SELECT service, SUM(duration_min) AS minutes\nFROM nexus.incidents\nWHERE opened_at >= date_trunc('quarter', now())\nGROUP BY service ORDER BY minutes DESC;",
    sources: ['nexus.incidents'],
    freshness: 'Live',
  },
];

function Bars({ data, unit }: { data: Answer['bars']; unit: string }) {
  const max = Math.max(...data.map((d) => d.value));
  const W = 560,
    H = 200,
    pl = 8,
    pb = 26,
    bw = (W - pl) / data.length;
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Bar chart of ${unit}`}>
        {data.map((d, i) => {
          const h = (d.value / max) * (H - pb - 20);
          return (
            <g key={d.label}>
              <rect
                x={pl + i * bw + 6}
                y={H - pb - h}
                width={bw - 12}
                height={h}
                rx="3"
                fill="var(--obs)"
              />
              <text
                x={pl + i * bw + bw / 2}
                y={H - pb - h - 5}
                textAnchor="middle"
                fontSize="11"
                fill="var(--ink)"
              >
                {d.value}
              </text>
              <text
                x={pl + i * bw + bw / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize="11"
                fill="var(--ink-3)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="small muted">{unit}</div>
    </div>
  );
}

export function Insights() {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [unknown, setUnknown] = useState(false);

  const ask = (text: string) => {
    setQ(text);
    const hit = CANNED.find((c) => c.q.toLowerCase() === text.trim().toLowerCase());
    setAnswer(hit ?? null);
    setUnknown(!hit);
    track('insight_asked', { matched: !!hit });
  };

  return (
    <>
      <PageHeader
        title="Insights"
        description="Ask questions about operational and business data. Every answer shows how it was calculated. An expansion module (P2)."
      />
      <section className="card">
        <form
          className="ask"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) ask(q);
          }}
        >
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask about incidents, reliability or business impact"
            aria-label="Question"
          />
          <button className="btn primary" type="submit">
            Ask
          </button>
        </form>
        <div className="suggestions">
          {CANNED.map((c) => (
            <button key={c.q} onClick={() => ask(c.q)}>
              {c.q}
            </button>
          ))}
        </div>
      </section>

      {unknown && (
        <div style={{ marginTop: 16 }}>
          <Empty title="This prototype only answers the suggested questions">
            In the product, Nexus would generate a governed query against approved datasets. Pick a
            suggested question to see the full answer format.
          </Empty>
        </div>
      )}

      {answer && (
        <div className="grid cols-2" style={{ marginTop: 16 }}>
          <section className="card">
            <div className="card-head">
              <h2>Answer</h2>
              <TrustTag state="observed" label="Computed from data" />
            </div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{answer.answer}</p>
            <Bars data={answer.bars} unit={answer.unit} />
            <div style={{ marginTop: 12 }}>
              <TrustTag state="hypothesis" label="Interpretation" />
              <p className="small" style={{ marginTop: 6 }}>
                {answer.explanation}
              </p>
            </div>
          </section>
          <section className="card">
            <div className="card-head">
              <h2>How this was calculated</h2>
            </div>
            <div className="prov">
              <strong>Query</strong>
              <pre>{answer.sql}</pre>
            </div>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr',
                gap: '6px 12px',
                fontSize: '0.88rem',
                marginTop: 12,
              }}
            >
              <dt className="muted">Sources</dt>
              <dd style={{ margin: 0 }}>
                {answer.sources.map((s) => (
                  <div key={s} className="mono">
                    {s}
                  </div>
                ))}
              </dd>
              <dt className="muted">Freshness</dt>
              <dd style={{ margin: 0 }}>{answer.freshness}</dd>
              <dt className="muted">Access</dt>
              <dd style={{ margin: 0 }}>
                Query ran with your permissions. Rows you can’t see were excluded.
              </dd>
            </dl>
            <div className="btn-row" style={{ marginTop: 14 }}>
              <button className="btn sm" onClick={() => track('insight_saved', {})}>
                Save to report
              </button>
              <button className="btn sm" onClick={() => track('insight_flagged', {})}>
                Flag as wrong
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
