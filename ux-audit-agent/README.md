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
└── tests/                      ← unit tests (stdlib unittest)
```

## Install as a Claude Code skill

The repo already links it at `.claude/skills/ux-audit` → `ux-audit-agent/`, so Claude Code opened at the repo root picks it up. To use it everywhere:

```bash
ln -s "$(pwd)/ux-audit-agent" ~/.claude/skills/ux-audit
```

Then ask: *"Audit https://example.com"*, or run `/ux-audit https://example.com`.

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

Python 3.9+ standard library only. `--render` additionally needs Node and Playwright (`npm i -g playwright && npx playwright install chromium`).

## Test

```bash
python3 -m unittest discover -s tests
```

```bash
python3 evals/run_evals.py
```

To check a fresh agent run against a stored case:

```bash
python3 evals/run_evals.py --candidate m21-agency=out/m21/scoresheet.json
```

## Sample results

| Site | Score | Top blocker |
|---|---:|---|
| [The Bradbury Group (benchmark)](samples/bradbury-2026-03/report.md) | 48 | Services exist only as #anchors on one page |
| [Solomon Engine, Enterprise tier](samples/tse-enterprise/report.md) | 47 | Price contradiction: $25,000 vs "$6,000 investment" |
| [Media 21 Agency](samples/m21-agency/report.md) | 42 | Client-rendered one-pager; services have no URLs |
| [Media 21 Outdoor](samples/m21-outdoor/report.md) | 45 | Screen locations have no pages; JS-rendered |

See [docs/benchmark.md](docs/benchmark.md) for the calibration and [docs/time-comparison.md](docs/time-comparison.md) for manual vs agent.
