export const pct = (v: number, digits = 1) => `${v.toFixed(digits)}%`;

export function ms(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(1)} s` : `${Math.round(v)} ms`;
}

export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

export const clock = (iso: string) => new Date(iso).toTimeString().slice(0, 8);

export function lag(seconds: number): string {
  return seconds < 60 ? `${seconds}s` : `${(seconds / 60).toFixed(1)} min`;
}
