import type { AuditEntry } from '@nexus/shared';
import { clock } from '../../lib/format';
import { Empty } from '../../components/StateView';

export function AuditFeed({ entries }: { entries: AuditEntry[] }) {
  if (entries.length === 0) return <Empty title="No activity yet" />;
  return (
    <ul className="feed">
      {entries.map((e) => (
        <li key={e.id}>
          <span className="when">{clock(e.at)}</span>
          <div>
            <span className={`who-${e.actorType}`}>{e.actor}</span>{' '}
            <span className="muted">{e.action.replace(/_/g, ' ')}</span>{' '}
            <span className="mono">{e.target}</span>
            {e.detail && <div className="small muted">{e.detail}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}
