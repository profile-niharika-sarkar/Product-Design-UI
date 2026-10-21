# Nexus AI

Incident intelligence for on-call engineers: correlate alerts, investigate with an evidence-citing AI copilot, and fix with governed, human-approved actions.

This is a **concept product built as an AI Product Manager portfolio project**. All data is simulated unless you connect real sources (see `docs/DEVELOPMENT_PIPELINE.md`).

## Quick start

Requirements: Node.js 20 or newer, Git, VS Code.

```bash
npm install
npm run dev
```

Open http://localhost:5173. The API runs on http://localhost:4000.

The copilot runs in **scripted mode** by default, so the demo works offline. To use a live Claude model:

```bash
cp .env.example apps/api/.env
# then put your key in apps/api/.env as ANTHROPIC_API_KEY=...
```

Restart `npm run dev`. The top bar shows `Copilot: live model` when it’s on.

## Try the flagship flow

1. Open **Incidents → INC-2048**.
2. Acknowledge, then **Start investigation**.
3. Click the evidence chips (E1, E2…) on hypothesis 1 and rate a few evidence items.
4. Tick **I’ve reviewed the evidence**, then **Approve** the rollback.
5. Set the demo control to **Failure**, run it, then **Retry**.
6. Open **Control center → Audit log** and **Analytics events** to see what was recorded.

Also try **INC-2047**: the copilot abstains, and approving the runbook action is blocked by policy (permission-denied state).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | API and web app with hot reload |
| `npm run typecheck` | TypeScript across all packages |
| `npm test` | Unit tests (Vitest) |
| `npm run build` | Production build of the web app |
| `npm run check` | All of the above; run before every commit |
| `npm run format` | Prettier |

## Repo map

```
apps/
  api/            Fastify API, in-memory store, copilot (Claude or scripted)
    src/copilot/  investigate.ts (model call), validate.ts (citation guardrail + tests)
    src/data/     seed.ts (all simulated data)
    src/routes/   incidents.ts, platform.ts
  web/            React + Vite + TypeScript UI
    src/components/        design-system components (TrustTag, DataTable, charts, states)
    src/features/incident/ copilot panel, evidence, action approval, timeline
    src/pages/             one file per screen
    src/styles/            tokens.css (all colors), app.css
packages/
  shared/         domain types used by both apps
docs/
  DEVELOPMENT_PIPELINE.md  phased build plan from prototype to deployed product
  UI_SPEC.md               screens, components, states, analytics events
  CLAUDE_PROMPTS.md        copy-paste prompts for Claude Code, phase by phase
CLAUDE.md         project rules Claude Code reads at the start of each session
.claude/commands/ project slash commands for Claude Code
```

## Status

Concept. Research has not been run; metrics shown in the UI are illustrative.
