# Manual vs agent: before and after

## What each produces

| | Manual audit (Bradbury, March 2026) | UX Audit Agent |
|---|---|---|
| Output | Long-form Google Doc: score, 4 category scores, 10 issues, recommendations, UX case study, UI analysis, journey map | `report.md` (score, top 5 blockers, effort × impact matrix, quick wins, full fix plan, scorecard) + `fix-plan.csv` |
| Scoring | Expert judgment per category; sub-scores not tied to a fixed formula | 26 fixed criteria, levels 0-4, weights total 100; same arithmetic every time |
| Evidence | Mostly cited inline in prose | Required on every criterion and finding; the validator rejects missing or vague evidence |
| Fix plan | Q / M / S tags in a list | Owner, effort (S/M/L), impact, severity, quadrant; sortable CSV |
| Repeatable | Re-audit = start again | Re-run collect + score; `run_evals.py` flags drift |
| Comparable across sites | No | Yes (same rubric, same bands) |
| Strengths of the manual approach the agent does not replace | Journey map, persona narrative, competitive "attack vectors", visual-system redesign proposal | — (out of scope; the agent's report is the input to that work) |

## Time

**Agent: measured in this build** (container, headless Chromium):

| Step | Time per site |
|---|---|
| Evidence collection (`collect.py --serve … --render`) | 4.8 s (Solomon Engine), 6.1 s (M21 Outdoor), 13.5 s (M21 Agency) |
| Model judgment: 26 criteria + 15-20 findings into a scoresheet | about 10-15 min of model time per site |
| Validate + score + render report and CSV (`score.py report`) | 0.04 s |
| Regression evals, all 4 cases (`run_evals.py`) | 0.03 s |
| **Total, URL to report** | **about 15 minutes**, plus human review of the top 5 |

**Manual: to fill in.** The time spent on the Bradbury audit is not recorded in the repo. Add it here so the comparison is real, not estimated:

| Step | Manual time (Bradbury) |
|---|---|
| Crawl and inspect page, CTAs, source | ___ h |
| Score and write findings | ___ h |
| Recommendations and fix plan | ___ h |
| Formatting the doc | ___ h |
| **Total** | **___ h** |

Speed-up = manual total ÷ 0.25 h.

## Quality check on the same site

| | Manual | Agent (v2) |
|---|---|---|
| Overall score | 54 | 48 (within ±8 tolerance) |
| Critical issues found | 3 | 3 (same three) |
| Manual's 10 issues found by agent | — | 10 / 10 |
| Top-5 overlap | — | 4 / 5 |
| Additional evidence-backed findings | — | 8 |

See `docs/benchmark.md` for the full comparison.
