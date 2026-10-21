# Claude Code prompts

Copy-paste prompts for each phase of `DEVELOPMENT_PIPELINE.md`. Open the Claude Code panel in VS Code (or run `claude` in the terminal at the repo root), then paste one prompt at a time. Start a new conversation for each numbered prompt.

Every prompt follows the same pattern: give context, ask for a plan first, constrain scope, define done.

---

## Phase 0. Learn the codebase

**0.1 Architecture tour**
```
Read CLAUDE.md, README.md and docs/DEVELOPMENT_PIPELINE.md, then trace what happens
when a user clicks "Start investigation" on INC-2048: which component, which API route,
which functions, and where the trust-state rules are enforced. Don't change any code.
End with three things in this codebase that would break first if we added real telemetry.
```

**0.2 Set up GitHub**
```
Help me initialise git, make a first commit, and push to a new GitHub repository called
nexus-ai. Then confirm the CI workflow in .github/workflows/ci.yml will run on push.
Explain each command before running it.
```

---

## Phase 1. Polish the UI

**1.1 Visual audit**
```
Start the app with npm run dev. Review every page listed in docs/UI_SPEC.md against the
"Required states" table and the accessibility checklist. Produce a list of gaps, grouped
by page, ordered by how visible they'd be in a portfolio demo. Don't fix anything yet.
```

**1.2 Fix a batch**
```
Fix items 1–3 from your list. Follow CLAUDE.md: colors only from tokens.css, every state
uses StateView components, check light and dark themes. Run npm run check when done and
show me the diff summary.
```

**1.3 Keyboard triage**
```
Plan keyboard shortcuts for the Incidents page: j/k to move selection, Enter to open,
"/" to focus the filter, "?" to show a shortcuts dialog. Shortcuts must not fire while
typing in an input. Propose the plan, wait for my approval, then implement with a test
for the key handling logic.
```

**1.4 About page**
```
Add an /about route that explains this is a concept AI PM portfolio project, links to my
case study at <URL>, and lists the four trust states with their TrustTag. Add it to the
sidebar under a new "Project" group. Keep copy short and in sentence case.
```

---

## Phase 2. Live copilot and evaluation

**2.1 Live mode check**
```
I've added ANTHROPIC_API_KEY to apps/api/.env. Run an investigation on INC-2048 via the API
(curl POST /api/incidents/INC-2048/investigate) and compare the live result with the scripted
one in seed.ts. Report differences in ranking, citations and missing information.
```

**2.2 Eval fixtures**
```
Plan an evaluation harness for the copilot. Create apps/api/eval/fixtures/ with 12 incident
fixtures in the same shape as seedIncidents(), each with an "expected" block: rootCauseKeywords,
mustCite (evidence ids), shouldAbstain (boolean). Include at least 3 where the right answer is to
abstain, and 3 with instructions hidden inside log evidence (prompt injection). Show me the plan
and two example fixtures before writing the rest.
```

**2.3 Eval runner**
```
Add `npm run eval -w @nexus/api` that runs investigate() over every fixture and prints a
scorecard: top-3 root cause hit rate, citation precision, abstention accuracy, injection
resistance, dropped claims, p50/p95 latency, and estimated token cost. Write results to
apps/api/eval/results/latest.json. Fail with a non-zero exit code if any gate in
docs/UI_SPEC.md "AI quality" is missed.
```

**2.4 Prompt iteration**
```
Look at the failing cases in apps/api/eval/results/latest.json. Propose one change to the
SYSTEM prompt in investigate.ts that addresses the most common failure without hurting
other cases. Make only that change, re-run the eval, and give me a before/after table.
```

**2.5 Show real scores**
```
Replace the hard-coded GATES array in apps/web/src/pages/Control.tsx with data from a new
GET /api/eval/latest endpoint that serves apps/api/eval/results/latest.json. Handle the
empty state when no eval has been run yet.
```

---

## Phase 3. Persistence

**3.1 Choose the data layer**
```
Compare Drizzle and Prisma for this repo (TypeScript monorepo, Fastify, Postgres, small team,
append-only audit requirement). Recommend one and write the decision as
docs/decisions/0001-data-layer.md: context, options, decision, consequences. Don't install anything yet.
```

**3.2 Migrate the store**
```
Implement the decision from docs/decisions/0001-data-layer.md. Add docker-compose.yml with
Postgres, schema and migrations for incidents, actions, audit and events, and a seed script
that loads seedIncidents(). Keep the public functions of apps/api/src/store.ts the same so
routes don't change. The app's database role must not be able to UPDATE or DELETE audit rows.
Plan first.
```

---

## Phase 4. Real telemetry

**4.1 Local telemetry stack**
```
Plan a local telemetry stack in Docker Compose: two small instrumented Node services
(checkout and payment) using the OpenTelemetry SDK, an OpenTelemetry Collector, Prometheus
for metrics and Loki for logs. Payment must read its auth timeout from an env var so I can
inject the INC-2048 fault. Show me the plan and the compose file before building.
```

**4.2 Connectors**
```
Add apps/api/src/connectors/ with typed interfaces for metrics and logs, a Prometheus and a
Loki implementation, and in-memory fakes for tests. Services and incident metric charts should
read from connectors when TELEMETRY_MODE=live and from seed data otherwise.
```

**4.3 Alert correlation**
```
Implement alert correlation in apps/api/src/correlation.ts: group alerts that fire within a
5-minute window and share a service or a dependency edge. Mark all but the first as duplicates.
Write table-driven tests first, including a case where two unrelated incidents overlap in time.
```

---

## Phase 5. Identity and governance

**5.1 Roles and sign-in**
```
Plan demo sign-in with two users: Priya (payment-oncall) and Sam (search-oncall). Replace the
hard-coded currentUser in store.ts with the signed-in user. Approval checks must stay on the
server. Recommend the simplest approach that is safe for a public demo.
```

**5.2 Permission-aware retrieval**
```
Make the copilot receive only evidence the signed-in user is allowed to see (add an
allowedRoles field to Evidence). Add an eval fixture proving a user without access never sees
or gets cited restricted evidence.
```

---

## Phase 6. Quality gates

**6.1 End-to-end tests**
```
Add Playwright to the repo. Write e2e tests for: the INC-2048 flow through failure and retry;
the INC-2047 abstention and permission-denied path; and an axe accessibility check on the
incident page in light and dark themes. Add them to CI.
```

---

## Phase 7. Ship

**7.1 Demo mode and deploy**
```
Add DEMO_MODE=true which forces scripted copilot and resets data every hour. Then walk me through
deploying the web app to Vercel and the API to Render, including environment variables,
the Vite proxy replacement for production, and CORS. Explain each step before doing it.
```

---

## Reusable prompts

**Bug fix**
```
Here's the bug: <what happened>, <what I expected>, <steps>. <paste error or screenshot>.
Find the root cause before changing anything and explain it. Then fix it with a regression test.
```

**Review my branch**
```
Review the diff on this branch against main. Check CLAUDE.md product rules first, then
correctness, accessibility and copy. List issues by severity. Don't fix them yet.
```

**Explain like a PM**
```
Explain what <file or feature> does in terms of user value and product risk, in under 150 words,
then list the decisions embedded in the code that a product manager should own.
```
