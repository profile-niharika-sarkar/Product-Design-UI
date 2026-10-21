import type { Evidence } from '@nexus/shared';
import { TrustTag } from '../../components/Badges';
import { Empty } from '../../components/StateView';

export type Feedback = Record<string, 'yes' | 'no'>;

export function EvidenceList({
  evidence,
  highlight,
  feedback,
  onFeedback,
}: {
  evidence: Evidence[];
  highlight?: string;
  feedback: Feedback;
  onFeedback: (id: string, v: 'yes' | 'no') => void;
}) {
  if (evidence.length === 0)
    return (
      <Empty title="No evidence collected yet">
        Connect traces or logs for this service so the copilot has something to cite.
      </Empty>
    );
  return (
    <div>
      {evidence.map((e) => (
        <article
          key={e.id}
          id={`evidence-${e.id}`}
          className={`evidence ${highlight === e.id ? 'highlight' : ''}`}
        >
          <div className="meta">
            <TrustTag state="observed" />
            <span className="title">
              {e.id} {e.title}
            </span>
          </div>
          <div className="meta" style={{ marginTop: 4 }}>
            <span>{e.source}</span>
            <span className="num">{e.timestamp}</span>
          </div>
          {e.snippet ? <pre>{e.snippet}</pre> : null}
          <p className="small" style={{ margin: '6px 0 0' }}>
            {e.detail}
          </p>
          <div className="fb">
            <span>Is this relevant to the leading hypothesis?</span>
            <button
              type="button"
              aria-pressed={feedback[e.id] === 'yes'}
              onClick={() => onFeedback(e.id, 'yes')}
            >
              Yes
            </button>
            <button
              type="button"
              aria-pressed={feedback[e.id] === 'no'}
              onClick={() => onFeedback(e.id, 'no')}
            >
              No
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
