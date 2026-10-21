/**
 * Product analytics. Separate from the audit log on purpose:
 * audit = compliance record of who did what; analytics = how the product is used.
 * Event names are snake_case verbs in past tense. See docs/UI_SPEC.md for the catalogue.
 */
export function track(name: string, props: Record<string, string | number | boolean | null> = {}) {
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, props }),
  }).catch(() => {
    /* analytics must never break the product */
  });
}
