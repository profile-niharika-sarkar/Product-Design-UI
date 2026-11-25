---
name: ux-audit
description: Audit a website's UX, SEO, content and trust against a weighted 100-point rubric and produce a scored report with the top 5 blockers, a fix plan by effort and impact, and quick wins. Use when the user gives a URL (or screenshots / pasted page text) and asks for a website audit, UX review, conversion review, SEO health check, landing-page critique or "what's wrong with this site". Every finding must cite the page element or text it came from.
---

# UX Audit Agent

You audit one website (or one landing page) and produce a report a founder, designer and developer can act on the same day. The scoring is fixed by the rubric, so audits of different sites, and repeat audits of the same site, are comparable.

Files in this skill (paths are relative to this file):

| File | Use |
|---|---|
| `rubric/rubric.json` | The 26 criteria: weight, pass sentence, fail sentence, what evidence to look at. **Source of truth.** |
| `rubric/RUBRIC.md` | Same rubric, human-readable. |
| `templates/input.md` | Input contract and the message to send when a site cannot be fetched. |
| `templates/scoresheet.template.json` | The JSON you fill in. |
| `templates/fix-plan.md` / `.csv` | Fix-plan columns and effort/impact definitions. |
| `templates/report-template.md` | What the final report looks like (rendered by `score.py`; do not hand-write it). |
| `tools/collect.py` | Fetches/renders the page and extracts evidence (titles, headings, CTAs + destinations, alt text, schema, stats, forms, copyright...). |
| `tools/score.py` | Validates your scoresheet (incl. the evidence rule), computes scores, ranks blockers, renders the report + CSV. |
| `evals/` | Regression cases; run after changing the rubric or this file. |

## The one rule

**Every finding must cite the page element or text it came from.** Each criterion score, finding and strength carries `evidence: [{page, element, quote}]` where `element` is a selector, tag, filename or URL and `quote` is verbatim page text or an attribute value. "The site lacks trust" is not a finding; `footer: "Copyright © 2025"` is. If you cannot point at it, you cannot score it below 4 or report it. Lower your `confidence` instead. `score.py` rejects scoresheets that break this rule.

## Input

Required: **one URL** (the page to audit, usually the homepage or the landing page being sold from).

Optional, used when fetching is blocked or the page is behind a login, geo-block or bot wall:
- **screenshots** (desktop full-page + one at phone width), and/or
- **pasted page text** (select-all from the browser), and/or
- **saved HTML** (browser "Save page as") or a **built site folder** (e.g. a Vite `dist/`).

Also ask (one line, optional) for: the audience, the one conversion goal (book a call, buy, sign up), and 1-3 competitor URLs. If not given, infer them from the page and state your inference in the summary.

## Steps

### 1. Fetch (collect evidence)

Pick the first mode that works and note it in `site.input_mode`:

```bash
python3 tools/collect.py https://example.com/ --render --assets out/example -o out/example/evidence.json   # best: JS rendered, screenshots, console errors, phone overflow
python3 tools/collect.py https://example.com/ -o out/example/evidence.json                                # static fetch (+ robots.txt, sitemap)
python3 tools/collect.py --serve path/to/dist -o out/example/evidence.json                                 # a local build
python3 tools/collect.py --html saved.html --base-url https://example.com/ -o out/example/evidence.json   # saved HTML
python3 tools/collect.py --text pasted.txt -o out/example/evidence.json                                   # pasted text only
```

`--render` needs Node + Playwright. If every mode fails (exit 3 or a proxy/DNS error), stop and ask the user for screenshots or pasted text, explaining that the site could not be fetched. Do not audit from memory of what the site "probably" looks like.

Then, beyond the JSON:
- Look at the screenshots (`desktop.png`, `mobile.png`) for hierarchy, button styles, empty or placeholder sections, and **text baked into images**, which the parser cannot see.
- Open the destination of every CTA you can. A CTA label is a promise; check it is kept.
- Skim 2-3 linked internal pages (a service page, a blog post, the contact page) when they exist, and list them in `site.pages_reviewed`.
- Note cross-page inconsistencies (prices, stats, titles copied between pages or sister sites). These are often the most damaging trust findings.

### 2. Evaluate against the rubric

For each of the 26 criteria in `rubric/rubric.json`:
1. Read its `pass` and `fail` sentences and `evidence_hint`.
2. Find the evidence in the collected JSON or screenshots.
3. Assign a **level 0-4**. 4 means the pass sentence is true with nothing material missing; 0 means the fail sentence describes the page; 1-3 sit in between (see `scale.levels`).
4. Record `evidence` (1-3 items), a one-line `rationale`, and `confidence` (`high` if you saw it in the DOM or a screenshot, `medium` if inferred, `low` if you could not observe it, e.g. robots.txt for a local build).
5. Mark a criterion `{"na": "<reason>"}` only when it genuinely does not apply (e.g. navigation on a deliberate no-nav campaign landing page, freshness on a single offer page). Its weight is redistributed within the category.

Calibration rules (learned from the Bradbury benchmark; see `docs/benchmark.md`):
- **Score one defect once.** If the hero CTA exits the site, that is `ux.primary_cta`; do not also dock `ux.cta_fidelity` for the same link. Do dock it for *other* misdirected CTAs.
- **Credit strengths.** A brilliant founder section or named testimonials earn their level even if conversion is broken elsewhere.
- **Anchor-only nav is an SEO problem**, not a navigation-usability one, if the labels are clear.
- **Text inside images** counts as missing for SEO and accessibility, but counts as present for content and persuasion criteria (people can read it).
- **Unverifiable is not zero.** If you cannot observe something, score your best estimate with `confidence: low` and say why in `limitations`.

### 3. Score

Write the scoresheet to `out/<site>/scoresheet.json` (start from `templates/scoresheet.template.json`), then:

```bash
python3 tools/score.py validate out/<site>/scoresheet.json   # must print "ok"; fix every error
```

Do not compute scores by hand. `score.py` applies `points = weight × level / 4`, the N/A redistribution and the rounding.

### 4. Find blockers

Add a `findings` entry for **every criterion at level 0 or 1** (the validator warns if you miss one), plus any level-2 or level-3 issue a buyer would notice. Each finding has:

| Field | Values |
|---|---|
| `title` | The problem in under 10 words, naming the element ("Hero CTA leaves the site for ElevenLabs"). |
| `criterion` | The rubric id it costs points on. |
| `severity` | `critical`: breaks conversion or indexing for most visitors (off-site primary CTA, broken promise CTA, offers not indexable, contradictory price). `high`: materially lowers trust, conversion or ranking. `medium`: noticeable gap. `low`: polish. Use the criterion's `blocker_class` as the default and move it one step only with a reason. |
| `evidence` | Element + quote, as above. |
| `why` | Optional one line on the business consequence. |
| `impact` | `high` / `medium` / `low`: the expected effect on the conversion goal if fixed. |
| `effort` | `S` 2 hours or less, `M` 2 days or less, `L` more than 2 days. |
| `fix` | One concrete action: what to change, where, and to what. Include replacement copy or code when it is short. |
| `owner` | `Dev`, `Design`, `Content`, `SEO`, `Marketing`, `Founder` (or two joined with +). |

Also list 3-5 `strengths` (with evidence) so the team knows what not to break.

### 5. Rank fixes and render

```bash
python3 tools/score.py report out/<site>/scoresheet.json -o out/<site>/report.md --csv out/<site>/fix-plan.csv
```

`score.py` ranks blockers by severity, then impact, then rubric points at stake, then effort. It places each finding in the effort × impact matrix (Quick wins / Major projects / Fill-ins / Later) and produces:

1. **Score**: overall /100 with band, plus the four category scores
2. **Top 5 blockers**: evidence, why, fix, effort, owner
3. **Fix plan by effort and impact**: the 2×2 matrix
4. **Quick wins**: a checklist of high-impact fixes of 2 hours or less
5. Full fix-plan table, criterion scorecard, strengths, limitations

### 6. Reply to the user

Give: the score and band, the top 5 blockers (one line each), the quick-wins count, and the path to `report.md` and `fix-plan.csv`. Keep it short; the report holds the detail. State the input mode and any low-confidence areas.

## Writing the summary

`summary` is 2-3 sentences: what the site does well, the single biggest problem, and the cost of not fixing it. Quote the page; no generic phrases ("leverage", "robust", "seamless").

## Changing the rubric

Edit `rubric/rubric.json` (weights must still total 100, which tests check), bump `version`, regenerate `rubric/RUBRIC.md` with `python3 tools/score.py rubric-md -o rubric/RUBRIC.md`, then run:

```bash
python3 -m unittest discover -s tests
python3 evals/run_evals.py
```

If an eval range must move, record why in `docs/benchmark.md`.
