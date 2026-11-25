# Audit input

**Required:** one URL, the page to audit (homepage or the landing page that sells the main offer).

**Optional, when fetching is blocked** (bot wall, login, geo-block, or the agent's network cannot reach the host):

| Provide | How | What the agent can still score |
|---|---|---|
| Screenshots | Desktop full page (1440px wide) + one phone-width (375px) screenshot | Hierarchy, CTAs, copy, proof, placeholders. Not meta tags, alt text, schema or link targets. |
| Pasted page text | Ctrl/Cmd+A, Ctrl/Cmd+C on the page; paste into a .txt file | Copy, claims, stats, dates, copyright, pricing |
| Saved HTML | Browser "Save page as… → Webpage, HTML only" | Nearly everything except console errors and the phone render |
| Built site folder | e.g. a Vite/Next `dist/` or `out/` | Everything except robots.txt and sitemap of the live domain |

**Helpful context (one line each, optional):** target audience · the one conversion goal · 1-3 competitor URLs.

## Message to send when fetching fails

> I couldn't load {url} from here ({reason}). To finish the audit, could you send either (a) a full-page desktop screenshot plus a phone screenshot, or (b) the page text (select all, copy, paste)? Saved HTML ("Save page as") gives the most complete audit. Anything I can't observe will be marked low-confidence in the report.
