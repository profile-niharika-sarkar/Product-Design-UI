# Fix plan template

One row per finding. `tools/score.py report --csv` fills this in from the scoresheet, ordered by severity, then impact, then rubric points at stake, then effort.

| Column | What goes in it |
|---|---|
| **ID** | `F01`, `F02`... stable within one audit. |
| **Issue** | The problem in under 10 words, naming the element. |
| **Evidence** | The page element (selector, tag, filename, URL) **and/or** verbatim quote it came from. Required: no evidence, no row. |
| **Page** | Path where the evidence was seen. |
| **Criterion** | Rubric id the issue costs points on (e.g. `ux.primary_cta`). |
| **Severity** | `critical` breaks conversion or indexing for most visitors · `high` materially lowers trust, conversion or ranking · `medium` noticeable gap · `low` polish. |
| **Effort** | `S` 2 hours or less · `M` 2 days or less · `L` more than 2 days. |
| **Impact** | `high` / `medium` / `low`: expected effect on the site's conversion goal once fixed. |
| **Quadrant** | Derived from effort and impact (below). |
| **Recommended fix** | One concrete action: what to change, where, to what. Include replacement copy/code when short. |
| **Owner** | `Dev`, `Design`, `Content`, `SEO`, `Marketing`, `Founder` (two can be joined with `+`). |

## Effort × impact matrix

| | Effort S | Effort M / L |
|---|---|---|
| **Impact high or medium** | **Quick wins**: do this week | **Major projects** (high impact): plan and resource |
| **Impact low** | **Fill-ins**: batch into a cleanup | **Later / reconsider** |

(Medium-impact M/L items fall into *Later / reconsider*; promote them if they unblock a major project.)

## Blank table

| ID | Issue | Evidence | Page | Criterion | Severity | Effort | Impact | Recommended fix | Owner |
|---|---|---|---|---|---|---|---|---|---|
| F01 | | | | | | | | | |
