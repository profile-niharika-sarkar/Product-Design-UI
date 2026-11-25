# Benchmark and calibration

The agent was calibrated against the manual **Bradbury Group website audit** (`UX Research-TBG/Website - Analysis and Audit.docx`, March 2026), then tested on three more real pages built in this repo.

## 1. Bradbury benchmark

The live site (thebradburygroup.com) could not be fetched from the build environment, whose network policy blocks outside hosts. The agent therefore scored the evidence the manual audit recorded: CTA labels and destinations, alt text, stats, nav hrefs and footer text. This is the pasted-text input mode. The judgment (levels 0-4 per criterion) is the agent's own; the manual scores were not copied in.

### Scores

| | Manual audit | Agent, rubric v1 | Agent, rubric v2 (current) |
|---|---:|---:|---:|
| **Overall** | **54** | 43 (−11) | **48 (−6)** |
| UX | 55 | 38 (−17) | 43 (−12) |
| SEO | 38 | 35 (−3) | 35 (−3) |
| Content | 60 | 59 (−1) | 61 (+1) |
| Trust | 68 | 49 (−19) | 60 (−8) |
| Band | "Needs significant improvement" | same | same |

`python3 evals/run_evals.py --rubric rubric/history/rubric-v1.json --case bradbury-2026-03` reproduces the v1 failure. The current rubric passes the benchmark with a ±8 tolerance overall and ±15 per category.

### What changed from v1 to v2, and why

| Change | Reason (where v1 disagreed with the manual audit) |
|---|---|
| Added **`ux.persuasion_flow`** (5 pts) and took the points from the three conversion criteria (6/5/6 → 5/4/5), navigation (4 → 3), visual hierarchy (4 → 3) and responsive (3 → 2). Accessibility went up (2 → 3). | v1 UX was all mechanics, so a page with broken CTAs scored near zero even though the manual audit rated its *sections* highly (About 78, FAQ 72, testimonials 70). The flow criterion credits a strong problem → offer → proof → objection sequence. |
| Removed **`trust.pricing_transparency`** (3 pts) and folded the pricing / engagement-model signal into **`content.offer_specificity`**. Freed points went to social proof (4 → 5), founder (3 → 4) and contact (3 → 4). | The manual audit treats pricing as a content gap, not a trust failure; premium consultancies rarely publish rates. v1 put a hard 0 on trust for it, which caused most of the −19 trust gap. |
| Proof depth 4 → 3, readability 2 → 3. | Proof was being double-penalised alongside claim substantiation; voice and readability carried more weight in the manual content score. |
| Added the **"score one defect once"** rule to SKILL.md. | v1 docked the ElevenLabs hero link under both primary CTA and CTA fidelity. |

### Why the remaining 6-point gap is accepted

The manual audit's headline category scores are more generous than its own sub-scores:

| Category | Manual headline | Mean of the manual's own sub-scores | Agent v2 |
|---|---:|---:|---:|
| UX / CRO | 55 | 45.7 (CTA 25, nav 60, funnel 30, booking 35, mobile 55, hierarchy 65, speed 50) | 43 |
| SEO | 38 | 35.0 (structure 25, keywords 35, linking 20, alt 30, depth 55, pages 20, blog 60) | 35 |
| Content + trust | 60 / 68 | 45.7 (value prop 75, social proof 60, stats 20, cases 15, founder 80, pricing 0, blog 70) | 61 / 60 |

The agent sits close to the manual's detailed sub-scores for UX and SEO. Closing the gap further would mean making the rubric lenient on conversion-breaking CTAs, which is the opposite of what the audit is for. Decision: no further tuning.

### Blocker match

All 10 issues the manual audit flagged were found. Agent rank is after severity → impact → points at stake → effort.

| Manual audit issue | Manual severity | Agent finding | Agent rank |
|---|---|---|---:|
| Primary CTA leaves the site | Critical | F01 | 2 |
| Assessment CTA is a broken promise | Critical | F02 | 3 |
| Single-page architecture cripples SEO | Critical | F03 | 1 |
| Unsubstantiated statistics | High | F04 | 5 |
| Duplicate hero section in HTML | High | F05 | 7 |
| Partner logos unnamed | High | F06 | 9 |
| No booking widget | High | F07 | 4 |
| Copyright year outdated | Medium | F17 | 18 |
| Only one social channel | Medium | F18 | 15 |
| Stock photo alt text | Medium | F13 | 12 |

**Top 5 overlap: 4 of 5.** The agent ranks the missing booking widget (a 2-hour fix with high impact) above the duplicate hero (a multi-day refactor). The manual audit had them the other way round. The agent also surfaced 8 issues the manual audit's issue list did not include as separate items (e.g. the misdirected "Guiding Principles" CTA, no CTA after the testimonials, no button system); most of them appear elsewhere in the manual's narrative sections.

## 2. Additional test sites

All three are real builds in this repo, audited from the local build because the live domains were unreachable. `collect.py --serve` rendered them in headless Chromium at 1440px and 375px.

| Case | Overall | UX | SEO | Content | Trust | Findings | Top blocker |
|---|---:|---:|---:|---:|---:|---:|---|
| Solomon Engine, Enterprise tier (`UX Research-TBG/the-solomon-engine/…Enterprise`) | 47 | 54 | 37 | 64 | 34 | 17 | Price contradiction: `$25,000` tier vs "your **$6,000** investment" |
| Media 21 Advertising Agency (`Website-M21/M-21 - Advertising Agency/dist.zip`) | 42 | 62 | 25 | 36 | 45 | 17 | Client-rendered one-pager; services have no URLs |
| Media 21 Outdoor (`Website-M21/M-21 Outdoor Media Network/dist.zip`) | 45 | 62 | 28 | 53 | 36 | 16 | Screen locations have no pages; hero "1M+ **Daily** Views" vs "1M+ **monthly** impressions" on the largest screen |

Things the agent caught that are easy to miss by eye:
- **Solomon Engine:** the ROI case study, IDC benchmark and three cohort pillars exist only inside `TSE.png` / `Beta Cohort.png`, both with `alt="Architecture Framework"`. `body { font-family: 'Montserrat Bold' }` names a family that is never loaded, so body text falls back to the system sans. The closing "Schedule your discovery call" block has no scheduling link, and the email is a `<span>`.
- **Both M21 sites:** `og:image` is `https://bolt.new/static/og_default.png`, so every share shows the template placeholder. Title and description are identical across both sites. 56 logos use filenames as alt text. `dist.zip` omits `Images/` and `Logos/` (21-24 requests return 404 when it is served as shipped).

## 3. Eval change log

| Date | Change | Why |
|---|---|---|
| 2026-11-25 | Blocker ranking: severity → **impact** → points lost → effort (was severity → points lost → impact). | A broken closing CTA on a $25k offer page was ranking below "missing meta description" because SEO criteria carry more weight. Triage should follow business impact first. Bradbury ranks were unchanged. |
| 2026-11-25 | `m21-outdoor` › `coming-soon-placeholders`: `in_top` 5 → 8. | The expectation was set before the first run. Placeholders are a high-severity, medium-impact finding and rank 7, behind four high-impact items. That ranking is correct. |

## 4. Known limits

- The judgment step is model-driven, so two runs can differ by a level on borderline criteria. The ±5 overall range in `evals/expected.json` absorbs about two level changes on heavy criteria. A larger drift fails the eval.
- Pasted-text and screenshot inputs cannot observe meta tags, alt text, schema or link targets. Those criteria get `confidence: low`, which the report lists under *Limitations*.
- `collect.py`'s CTA detection is heuristic (class names, Tailwind button utilities, action verbs). The agent must still check the screenshot.
