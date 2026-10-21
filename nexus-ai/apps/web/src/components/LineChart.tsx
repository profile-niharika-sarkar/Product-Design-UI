import type { MetricSeries } from '@nexus/shared';

/** Dependency-free SVG line chart with threshold line and event markers. */
export function LineChart({ series, height = 200 }: { series: MetricSeries; height?: number }) {
  const W = 640;
  const H = height;
  const pl = 44,
    pr = 12,
    pt = 16,
    pb = 28;
  const values = series.points.map((p) => p.v);
  const max = Math.max(series.threshold * 1.25, ...values) * 1.1;
  const x = (i: number) => pl + (i * (W - pl - pr)) / Math.max(1, series.points.length - 1);
  const y = (v: number) => pt + (1 - v / max) * (H - pt - pb);
  const idx = (t: string) => series.points.findIndex((p) => p.t === t);
  const ticks = [0, max / 3, (2 * max) / 3].map((v) => +v.toPrecision(2));
  const pts = series.points.map((p, i) => `${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const last = series.points[series.points.length - 1];
  const step = Math.ceil(series.points.length / 6);

  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${series.label}: latest ${last?.v}${series.unit}, threshold ${series.threshold}${series.unit}, baseline ${series.baseline}${series.unit}`}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="var(--line)" />
            <text x={pl - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="var(--ink-3)">
              {t}
              {series.unit === '%' ? '%' : ''}
            </text>
          </g>
        ))}
        {series.points.map((p, i) =>
          i % step === 0 || i === series.points.length - 1 ? (
            <text
              key={p.t}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--ink-3)"
            >
              {p.t}
            </text>
          ) : null,
        )}
        <line
          x1={pl}
          x2={W - pr}
          y1={y(series.threshold)}
          y2={y(series.threshold)}
          stroke="var(--crit)"
          strokeDasharray="3 3"
        />
        <text
          x={W - pr}
          y={y(series.threshold) - 5}
          textAnchor="end"
          fontSize="10"
          fill="var(--crit)"
        >
          threshold {series.threshold}
          {series.unit}
        </text>
        {series.markers.map((m) => {
          const i = idx(m.t);
          if (i < 0) return null;
          const color = m.kind === 'deploy' ? 'var(--dec)' : 'var(--done)';
          return (
            <g key={m.label}>
              <line
                x1={x(i)}
                x2={x(i)}
                y1={pt}
                y2={H - pb}
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x={x(i) + 5} y={pt + 10} fontSize="10" fill={color}>
                {m.label}
              </text>
            </g>
          );
        })}
        <polyline
          points={pts}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Sparkline({
  values,
  width = 120,
  height = 28,
  color = 'var(--ink-2)',
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const max = Math.max(...values) || 1;
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * width).toFixed(1)},${(height - 2 - ((v - min) / span) * (height - 4)).toFixed(1)}`,
    )
    .join(' ');
  return (
    <svg
      className="spark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}
