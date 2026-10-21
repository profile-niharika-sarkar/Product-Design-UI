import type { Service } from '@nexus/shared';
import { ms, pct } from '../lib/format';

/**
 * Layered dependency map. Columns are computed from call depth, so it works for any
 * small service graph without a layout library. Swap for a force layout (e.g. d3-dag)
 * when the graph grows past ~20 nodes.
 */
export function DependencyMap({
  services,
  focus,
  onSelect,
}: {
  services: Service[];
  focus?: string[];
  onSelect?: (id: string) => void;
}) {
  const byId = new Map(services.map((s) => [s.id, s]));
  const incoming = new Set(services.flatMap((s) => s.dependsOn));
  const roots = services.filter((s) => !incoming.has(s.id)).map((s) => s.id);
  const depth = new Map<string, number>();
  const q: [string, number][] = roots.map((id) => [id, 0]);
  while (q.length) {
    const [id, d] = q.shift()!;
    if (d > services.length || (depth.get(id) ?? -1) >= d) continue; // guard against cycles
    depth.set(id, d);
    byId.get(id)?.dependsOn.forEach((c) => q.push([c, d + 1]));
  }
  const cols: string[][] = [];
  services.forEach((s) => {
    const d = depth.get(s.id) ?? 0;
    (cols[d] ??= []).push(s.id);
  });

  const NW = 150,
    NH = 46,
    GX = 50,
    GY = 16;
  const rows = Math.max(...cols.map((c) => c.length));
  const W = cols.length * NW + (cols.length - 1) * GX + 4;
  const H = rows * NH + (rows - 1) * GY + 4;
  const pos = new Map<string, { x: number; y: number }>();
  cols.forEach((col, ci) => {
    const offset = ((rows - col.length) * (NH + GY)) / 2;
    col.forEach((id, ri) => pos.set(id, { x: 2 + ci * (NW + GX), y: 2 + offset + ri * (NH + GY) }));
  });
  const hot = new Set(focus ?? []);

  return (
    <div className="chart" style={{ overflowX: 'auto' }}>
      <svg
        className="graph"
        viewBox={`0 0 ${W} ${H}`}
        style={{ minWidth: Math.min(W, 640) }}
        role="img"
        aria-label="Service dependency map"
      >
        {services.flatMap((s) =>
          s.dependsOn.map((dep) => {
            const a = pos.get(s.id),
              b = pos.get(dep);
            if (!a || !b) return null;
            const x1 = a.x + NW,
              y1 = a.y + NH / 2,
              x2 = b.x,
              y2 = b.y + NH / 2;
            const mx = (x1 + x2) / 2;
            const isHot = hot.has(s.id) && hot.has(dep);
            return (
              <path
                key={`${s.id}-${dep}`}
                className={isHot ? 'hot' : ''}
                d={`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
              />
            );
          }),
        )}
        {services.map((s) => {
          const p = pos.get(s.id)!;
          const cls = [
            s.health !== 'healthy' ? `n-${s.health}` : '',
            s.external ? 'n-external' : '',
            onSelect ? 'clickable' : '',
          ].join(' ');
          return (
            <g
              key={s.id}
              className={cls}
              transform={`translate(${p.x},${p.y})`}
              onClick={() => onSelect?.(s.id)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect?.(s.id)}
              tabIndex={onSelect ? 0 : undefined}
              role={onSelect ? 'link' : undefined}
              aria-label={`${s.name}, ${s.health}`}
            >
              <rect width={NW} height={NH} rx="7" />
              <text x="10" y="19" fontWeight="700">
                {s.name.length > 19 ? s.name.slice(0, 18) + '…' : s.name}
              </text>
              <text className="sub" x="10" y="35">
                {s.external ? 'external' : `${pct(s.errorRate)} err, p95 ${ms(s.p95Ms)}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
