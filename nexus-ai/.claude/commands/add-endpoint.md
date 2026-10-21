Add an API endpoint to apps/api: $ARGUMENTS

Rules:
- Request/response types go in packages/shared/src/index.ts first.
- Validate input; return 400 with a clear message for bad input, 404 for missing entities,
  403 when the user lacks a role, 409 for invalid state transitions.
- Anything that changes state writes an audit entry via store.audit().
- Add a Vitest test using Fastify's inject() covering success and each error code.

Propose the plan first. After building, run `npm run check`.
