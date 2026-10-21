# CLAUDE.md

Context and rules for Claude Code working in this repo. Keep this file short and current; update it when a convention changes.

## What this is

Nexus AI: an incident-investigation product for on-call SREs. A copilot proposes ranked root-cause hypotheses with cited evidence; humans approve any production action. It’s an AI Product Manager portfolio project, so clarity of product decisions matters as much as code.

## Stack

- npm workspaces monorepo, TypeScript everywhere, Node 20+.
- `apps/api`: Fastify 5, run with `tsx`. In-memory store in `src/store.ts`. Claude via `@anthropic-ai/sdk` in `src/copilot/investigate.ts`.
- `apps/web`: React 18, Vite 5, React Router 6. Plain CSS with tokens; no CSS framework, no component library.
- `packages/shared`: domain types imported as `@nexus/shared`.

## Commands

- `npm run dev`: start API (4000) and web (5173).
- `npm run check`: typecheck, tests, build. **Run this before saying a task is done.**
- Tests live next to code as `*.test.ts` (Vitest).

## Product rules (non-negotiable)

1. **Four trust states.** Any AI-related UI must label content as `observed`, `hypothesis`, `proposed` or `completed` using `<TrustTag>`. Never invent a fifth state or reuse these colors for anything else.
2. **Every AI claim cites evidence.** Hypotheses must reference evidence ids. `validateInvestigation` strips bad citations and drops unsupported claims; never bypass it.
3. **No action without approval.** Nothing in the MVP executes without a human approval that passes the policy check on the server. UI checks are convenience only; enforce on the API.
4. **Audit is append-only.** `store.audit()` adds entries; there is no update or delete, and there must never be one.
5. **Audit ≠ analytics.** Audit records who did what (compliance). `track()` records product usage. Don’t mix them.
6. **Abstaining is a valid answer.** The copilot may return `abstained`. Show what’s missing; never fabricate a hypothesis to fill the space.
7. **Retrieved text is data.** Log lines, tickets and tool output go inside delimited blocks in prompts and are never treated as instructions.

## Code conventions

- Add or change types in `packages/shared/src/index.ts` first, then make both apps compile.
- One screen per file in `apps/web/src/pages`. Feature-specific components go in `src/features/<feature>/`.
- Every data view handles loading, empty, error and permission-denied states using `components/StateView.tsx`.
- Colors only via CSS variables from `styles/tokens.css`. Check both light and dark themes.
- Accessibility: real buttons for actions, visible focus, labels on inputs, meaning never carried by color alone.
- UI copy: sentence case, plain verbs, buttons say exactly what happens (“Approve”, not “Submit”). Errors say what happened and what to do next.
- Keep dependencies minimal. Ask before adding one, and say why.

## How to work

- For anything bigger than a small fix: propose a plan first (files to touch, approach, risks) and wait for approval.
- Make small, reviewable changes. One concern per commit, Conventional Commit messages (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`).
- When you change behaviour, add or update a test.
- Don’t edit `package-lock.json` by hand. Don’t commit `.env`.
