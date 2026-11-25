# UX Audit Agent

A Claude skill that audits a website's **UX, SEO, content and trust** against a fixed, weighted 100-point rubric. For each site it produces a score, the top 5 blockers, a fix plan by effort and impact, and quick wins. **Every finding cites the page element or text it came from**, and the scorer rejects any that don't.

The rubric is calibrated against the manual Bradbury Group audit: the agent scores it 48 against the manual 54, finds all 10 of the manual's issues, and matches 4 of its top 5.

```
ux-audit-agent/
├── SKILL.md                    ← agent instructions (steps, output template, evidence rule)
├── rubric/
│   ├── rubric.json             ← 4 categories, 26 criteria, weights = 100, pass/fail sentence each
│   ├── RUBRIC.md               ← readable scoring sheet (generated)
│   └── history/rubric-v1.json  ← pre-calibration draft, kept for the before/after eval
├── templates/                  ← input contract, scoresheet, fix-plan (md + csv), report layout
├── tools/
│   ├── collect.py              ← fetch / render / parse evidence (URL, local build, HTML, pasted text)
│   ├── render.cjs              ← headless Chromium: rendered DOM, screenshots, console errors, 375px overflow
│   └── score.py                ← validate → score → rank blockers → render report + CSV
├── evals/
│   ├── expected.json           ← stored score ranges + must-find blockers per test site
│   ├── run_evals.py            ← regression eval
│   └── cases/<site>/scoresheet.json
├── samples/<site>/report.md, fix-plan.csv   ← published sample reports
├── docs/benchmark.md           ← Bradbury calibration, v1→v2 changes, test-site results
├── docs/time-comparison.md     ← manual vs agent
├── ci/audit-prompt.md          ← prompt for the GitHub Actions run (.github/workflows/ux-audit.yml)
└── tests/                      ← unit tests (stdlib unittest)
```

## Run it

The UX Audit Agent is a Claude Code skill. It scores a website against a
100-point rubric (UX & conversion, SEO, content, trust) and returns a ranked
fix plan. Every finding cites the page element or text it came from.

### Prerequisites
- [Claude Code](https://claude.com/claude-code) installed
- Python 3.10+
- This repo cloned locally
- Optional: Node + Playwright, for JavaScript-rendered sites, screenshots and the phone-width check (`npm i -g playwright && npx playwright install chromium`)

### Steps
1. Clone the repo and open it in Claude Code:
   ```bash
   git clone https://github.com/profile-niharika-sarkar/Product-Design-UI.git
   cd Product-Design-UI
   claude
   ```
   The skill is linked at `.claude/skills/ux-audit`, so Claude Code picks it up from the repo root.
2. Run the skill with a URL:
   ```
   /ux-audit https://example.com
   ```
3. Claude collects evidence from the page (`tools/collect.py`), fills in the
   scoresheet, and `tools/score.py` validates it and renders the report.

To use the skill outside this repo, link it into your user skills folder:

```bash
ln -s "$(pwd)/ux-audit-agent" ~/.claude/skills/ux-audit
```

### What you get
| Output | Description |
|---|---|
| Report (`.md`) | Overall score, top blockers, quick wins |
| Fix plan (`.csv`) | Issue, evidence, severity, effort, recommended fix |
| Scoresheet (`.json`) | Raw scores per criterion, for comparison across runs |

### Run the tests
```bash
python ux-audit-agent/evals/run_evals.py
```
This checks the agent's scores against the expected ranges for the sample
sites, so you can see whether a rubric change shifted the results.

The unit tests cover the collector, the scoring maths and the evidence rule:

```bash
python -m unittest discover -s ux-audit-agent/tests
```

To check a fresh agent run against a stored case:

```bash
python ux-audit-agent/evals/run_evals.py --candidate m21-agency=out/m21/scoresheet.json
```

### Run on GitHub (optional)
Go to **Actions → UX Audit → Run workflow**, paste a URL, and download the
report from the run's artifacts. This needs an `ANTHROPIC_API_KEY` repository
secret (Settings → Secrets and variables → Actions).

The workflow (`.github/workflows/ux-audit.yml`) renders the page, has Claude Code
fill in the scoresheet by following `SKILL.md` (prompt: `ci/audit-prompt.md`), then
validates it and renders the report with `score.py`. The artifact contains
`report.md`, `fix-plan.csv`, `scoresheet.json`, the evidence and the screenshots, and
the run's summary page shows the score and top 5 blockers. Optional inputs: a site
name for the report and a Claude model id. Claude is limited to reading and writing
files and running `score.py`.

### Known limitations
- Sites that block automated fetching need pasted page text or screenshots.
- Scores are heuristic and run slightly stricter than my manual audits
  (see [docs/benchmark.md](docs/benchmark.md)).
- It reviews what is visible on the page, not analytics or real user data.

## Run the pieces by hand

```bash
python3 tools/collect.py https://example.com/ --render --assets out/example -o out/example/evidence.json
```

```bash
python3 tools/score.py validate out/example/scoresheet.json
```

```bash
python3 tools/score.py report out/example/scoresheet.json -o out/example/report.md --csv out/example/fix-plan.csv
```

These commands run from inside `ux-audit-agent/` and use the Python standard library only. `--render` also needs Node and Playwright.

## Sample results

| Site | Score | Top blocker |
|---|---:|---|
| [The Bradbury Group (benchmark)](samples/bradbury-2026-03/report.md) | 48 | Services exist only as #anchors on one page |
| [Solomon Engine, Enterprise tier](samples/tse-enterprise/report.md) | 47 | Price contradiction: $25,000 vs "$6,000 investment" |
| [Media 21 Agency](samples/m21-agency/report.md) | 42 | Client-rendered one-pager; services have no URLs |
| [Media 21 Outdoor](samples/m21-outdoor/report.md) | 45 | Screen locations have no pages; JS-rendered |

See [docs/benchmark.md](docs/benchmark.md) for the calibration and [docs/time-comparison.md](docs/time-comparison.md) for manual vs agent.
