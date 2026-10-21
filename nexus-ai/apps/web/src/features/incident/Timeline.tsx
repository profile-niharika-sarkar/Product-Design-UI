import type { TimelineEvent } from '@nexus/shared';

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="timeline">
      {events.map((e) => (
        <li key={e.id} className={`${e.key ? 'key' : ''} k-${e.kind}`}>
          <span className="t">{e.time}</span>
          {e.text}
          <span className="src">{e.source}</span>
        </li>
      ))}
    </ol>
  );
}
