import { describe, expect, it } from 'vitest';
import { lag, ms, timeAgo } from './format';

describe('format', () => {
  it('formats latency', () => {
    expect(ms(240)).toBe('240 ms');
    expect(ms(2400)).toBe('2.4 s');
  });
  it('formats relative time', () => {
    const now = new Date('2026-10-20T14:10:00Z').getTime();
    expect(timeAgo('2026-10-20T14:08:00Z', now)).toBe('2m ago');
    expect(timeAgo('2026-10-20T12:10:00Z', now)).toBe('2h ago');
  });
  it('formats data lag', () => {
    expect(lag(40)).toBe('40s');
    expect(lag(210)).toBe('3.5 min');
  });
});
