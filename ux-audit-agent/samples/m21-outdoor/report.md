# UX audit: Media 21 Outdoor: LED Media Network site

**URL:** https://outdoor.m21world.com/ (local build: Website-M21/M-21 Outdoor Media Network/dist.zip) · **Audited:** 2026-11-25 · **Input:** rendered (Vite build served locally, rendered in Chromium at 1440px and 375px; Images/ folder added because dist.zip omits it) · **Rubric:** v2.0

**Pages reviewed:** /

## Score: 45/100 (Needs significant improvement)

Strong product presentation: each LED screen has a photo, size, traffic flow and estimated views, inside a tight, consistent design. It loses trust on a headline number ('1M+ Daily Views' while the largest screen claims '1M+ monthly impressions'), leaves two 'Coming Soon' placeholders live, gives buyers no rate card or availability, and shares the agency site's SEO problems.

| Category | Weight | Score | |
|---|---:|---:|---|
| UX & conversion | 30 | 62/100 | `████████████░░░░░░░░` |
| SEO | 30 | 28/100 | `██████░░░░░░░░░░░░░░` |
| Content | 20 | 53/100 | `███████████░░░░░░░░░` |
| Trust | 20 | 36/100 | `███████░░░░░░░░░░░░░` |

## Top 5 blockers

**1. Screen locations have no pages; site is JS-rendered** · CRITICAL · costs 5.3 pts on *Indexable page architecture*

- Evidence: `dist/index.html` "1,190-byte shell"; `LED Network` "Hatat House, Hormuz Grand Gold, Lulu Zakher Mall... no URLs"
- Fix: Pre-render and create one page per screen (photo, specs, map, availability) plus a /network/ index. (effort L, owner Dev + SEO)

**2. '1M+ Daily Views' contradicts the per-screen figures** · HIGH · costs 3.8 pts on *Claim substantiation*

- Evidence: `hero stat` "1M+ Daily Views"; `Hatat House card` "1M+ monthly impressions"
- Why it matters: Media buyers check numbers; one inflated headline taints the whole rate conversation.
- Fix: Change the hero to the network monthly total (sum of the screens, about 2.8M+) and add 'Estimated from RTA traffic counts, 2025' or the real source. (effort S, owner Content)

**3. Title/description copied from the agency site** · HIGH · costs 3.0 pts on *Title tag and meta description*

- Evidence: `<title>` "M21 Global — Transforming Ideas Into Success"
- Fix: Title: 'LED Billboards in Muscat | Media 21 Outdoor'; write a unique description naming the locations. (effort S, owner SEO)

**4. No campaign results on-site** · HIGH · costs 2.3 pts on *Proof depth (case studies)*

- Evidence: `a 'Portfolio'` "Google Drive PDF"
- Fix: Show 2-3 campaigns (advertiser, screen, duration, recall or footfall lift). (effort M, owner Content)

**5. 56 logo images use filenames as alt text** · HIGH · costs 3.0 pts on *Image alt text*

- Evidence: `img alt` "bank Dhofar.png"
- Fix: Map logos to brand names; aria-hide marquee duplicates. (effort S, owner Dev)

## Fix plan by effort and impact

Effort: S = 2 hours or less, M = 2 days or less, L = more than 2 days.

| | Low effort (S) | Higher effort (M/L) |
|---|---|---|
| **Higher impact** | **Quick wins**<br>F01 '1M+ Daily Views' contradicts the per-screen figures<br>F04 Title/description copied from the agency site<br>F05 56 logo images use filenames as alt text<br>F08 Share image is the bolt.new default<br>F03 Two 'Coming Soon' placeholders are live<br>F11 No LocalBusiness schema<br>F12 No named team or sales contact<br>F07 No hero CTA for media buyers<br>F14 No objection handling before contact<br>F10 Logo wall fails alt; no skip link<br>F13 No advertiser problem framing | **Major projects**<br>F02 Screen locations have no pages; site is JS-rendered<br>F09 No campaign results on-site<br>F06 No rate card, slot length or availability |
| **Lower impact** | **Fill-ins**<br>— | **Later / reconsider**<br>F16 No internal pages<br>F15 No dated content |

## Quick wins

- [ ] **'1M+ Daily Views' contradicts the per-screen figures**: Change the hero to the network monthly total (sum of the screens, about 2.8M+) and add 'Estimated from RTA traffic counts, 2025' or the real source. (Content)
- [ ] **Title/description copied from the agency site**: Title: 'LED Billboards in Muscat | Media 21 Outdoor'; write a unique description naming the locations. (SEO)
- [ ] **56 logo images use filenames as alt text**: Map logos to brand names; aria-hide marquee duplicates. (Dev)
- [ ] **Share image is the bolt.new default**: Use a branded 1200x630 photo of the Hatat House screen; add a canonical. (Dev)
- [ ] **Two 'Coming Soon' placeholders are live**: Hide unlaunched screens or show them as 'Launching Q1 2027 — pre-book now'. (Content)
- [ ] **No LocalBusiness schema**: Add LocalBusiness + Place (per screen) JSON-LD. (SEO)
- [ ] **No named team or sales contact**: Name the outdoor sales lead with photo and direct WhatsApp. (Content)
- [ ] **No hero CTA for media buyers**: Add 'Check availability' (primary) and 'View the network' (secondary) to the hero. (Design)
- [ ] **No objection handling before contact**: Add a 4-question FAQ: minimum booking, creative specs, proof of play, pricing. (Design)
- [ ] **Logo wall fails alt; no skip link**: Covered by F05; add a skip-to-content link. (Dev)
- [ ] **No advertiser problem framing**: Add a line on ad-skipping and digital fatigue with a cited stat. (Content)

## Full fix plan

| ID | Issue | Evidence | Severity | Effort | Impact | Recommended fix | Owner |
|---|---|---|---|---|---|---|---|
| F02 | Screen locations have no pages; site is JS-rendered | `dist/index.html` "1,190-byte shell"; `LED Network` "Hatat House, Hormuz Grand Gold, Lulu Zakher Mall... no URLs" | critical | L | high | Pre-render and create one page per screen (photo, specs, map, availability) plus a /network/ index. | Dev + SEO |
| F01 | '1M+ Daily Views' contradicts the per-screen figures | `hero stat` "1M+ Daily Views"; `Hatat House card` "1M+ monthly impressions" | high | S | high | Change the hero to the network monthly total (sum of the screens, about 2.8M+) and add 'Estimated from RTA traffic counts, 2025' or the real source. | Content |
| F04 | Title/description copied from the agency site | `<title>` "M21 Global — Transforming Ideas Into Success" | high | S | high | Title: 'LED Billboards in Muscat \| Media 21 Outdoor'; write a unique description naming the locations. | SEO |
| F09 | No campaign results on-site | `a 'Portfolio'` "Google Drive PDF" | high | M | high | Show 2-3 campaigns (advertiser, screen, duration, recall or footfall lift). | Content |
| F05 | 56 logo images use filenames as alt text | `img alt` "bank Dhofar.png" | high | S | medium | Map logos to brand names; aria-hide marquee duplicates. | Dev |
| F08 | Share image is the bolt.new default | `meta[property='og:image']` "https://bolt.new/static/og_default.png" | high | S | medium | Use a branded 1200x630 photo of the Hatat House screen; add a canonical. | Dev |
| F03 | Two 'Coming Soon' placeholders are live | `LED Network card 6` "Coming Soon"; `Lulu Amerat` "5.7m x 9.6m. Coming Soon" | high | S | medium | Hide unlaunched screens or show them as 'Launching Q1 2027 — pre-book now'. | Content |
| F06 | No rate card, slot length or availability | `screen cards` "Size / Traffic Flow / Estimated Views only" | medium | M | high | Add 'Request rate card' per screen plus spot length, loop and booking lead time. | Founder |
| F11 | No LocalBusiness schema | `script[type='application/ld+json']` "none found" | medium | S | medium | Add LocalBusiness + Place (per screen) JSON-LD. | SEO |
| F12 | No named team or sales contact | `footer` "We are a team of individuals..." | medium | S | medium | Name the outdoor sales lead with photo and direct WhatsApp. | Content |
| F07 | No hero CTA for media buyers | `hero` "Visibility At Scale + stats, no button" | medium | S | medium | Add 'Check availability' (primary) and 'View the network' (secondary) to the hero. | Design |
| F14 | No objection handling before contact | `h2 order` "Designed For Maximum Impact -> Let's Build Something Great" | medium | S | medium | Add a 4-question FAQ: minimum booking, creative specs, proof of play, pricing. | Design |
| F10 | Logo wall fails alt; no skip link | `logo img alt` "Jotun.png" | medium | S | medium | Covered by F05; add a skip-to-content link. | Dev |
| F13 | No advertiser problem framing | `Why Outdoor` "Because Attention Can't Be Skipped." | low | S | medium | Add a line on ad-skipping and digital fatigue with a cited stat. | Content |
| F16 | No internal pages | `links` "0 internal page links" | low | M | low | Follows from F02. | SEO |
| F15 | No dated content | `page text` "no dates" | low | M | low | Add 'Now showing' or recent-campaigns strip. | Marketing |

## Scorecard

### UX & conversion: 62/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Primary CTA: clear and on-site | 5 | 2/4 | 2.5 | `header button` "CONTACT US"; `hero` "h1 'Visibility At Scale' + stats; no hero CTA" |
| CTA label matches destination | 4 | 3/4 | 3.0 | `a 'Marketing'` "-> https://marketing.m21world.com/"; `a 'Portfolio'` "-> drive.google.com/file/d/19KJ-..." |
| Conversion path and booking friction | 5 | 3/4 | 3.8 | `form fields` "Full Name, Email Address, Company (optional), Tell Us About Your Project Requirements"; `contact aside` "RESPONSE TIME < 24hrs" |
| Navigation and information architecture | 3 | 3/4 | 2.3 | `nav` "Home, Why Outdoor, LED Network, Why Choose Us (#anchors)" |
| Page flow and persuasion sequence | 5 | 2/4 | 2.5 | `heading outline` "Visibility At Scale -> Strategically Positioned Across Muscat -> Collaborations Across Sectors -> Because Attention Can't Be Skipped -> Designed For Maximum Impact -> Let's Build Something Great" |
| Visual hierarchy and component consistency | 3 | 3/4 | 2.3 | `LED Network cards` "uniform photo cards with location labels"; `card 6` "Coming Soon (empty card)" |
| Responsive build | 2 | 3/4 | 1.5 | `render @375px` "scrollWidth 375 = viewport 375; 8 tap targets under 32px" |
| Accessibility basics (WCAG 2.1 A/AA) | 3 | 1/4 | 0.8 | `logo wall img alt` "56 filename alts e.g. 'bank Dhofar.png'"; `html` "no skip link" |

### SEO: 28/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Indexable page architecture | 7 | 1/4 | 1.8 | `dist/index.html` "1,190-byte shell; JS-rendered"; `LED Network` "5 screens, no per-location URLs" |
| Title tag and meta description | 4 | 1/4 | 1.0 | `<title>` "M21 Global — Transforming Ideas Into Success" |
| Heading structure | 4 | 3/4 | 3.0 | `h1` "Visibility At Scale"; `h3` "< 24hrs (used as a heading)" |
| Image alt text | 4 | 1/4 | 1.0 | `images` "72 total: 56 filename alt, 16 ok (screens: 'Hormuz Grand Gold', 'Lulu Zakher Mall')" |
| Structured data (schema.org) | 4 | 0/4 | 0.0 | `script[type='application/ld+json']` "none found" |
| Internal linking | 3 | 1/4 | 0.8 | `links` "4 anchors, 0 internal pages" |
| Technical crawl basics | 4 | 1/4 (medium confidence) | 1.0 | `meta[property='og:image']` "https://bolt.new/static/og_default.png" |

### Content: 53/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Value proposition clarity | 5 | 3/4 | 3.8 | `hero p` "Premium LED billboard solutions designed to place brands where attention already exists." |
| Audience and pain articulation | 3 | 1/4 | 0.8 | `Why Outdoor` "Because Attention Can't Be Skipped." |
| Offer specificity and engagement model | 4 | 3/4 | 3.0 | `Hatat House card` "Size 23.05m × 10.50m · Traffic Flow Ruwi, Amerat & Hamriyah commuters · Estimated Views 1M+ monthly impressions" |
| Proof depth (case studies) | 3 | 1/4 | 0.8 | `a 'Portfolio'` "-> Google Drive PDF" |
| Content freshness and velocity | 2 | 0/4 | 0.0 | `page text` "no dated content" |
| Readability and brand voice | 3 | 3/4 | 2.3 | `Why Choose Us p` "Outdoor advertising is no longer just about placement. It's about visibility, timing, creative presentation, and repeated audience exposure." |

### Trust: 36/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Claim substantiation | 5 | 1/4 | 1.3 | `hero stat` "1M+ Daily Views"; `Hatat House card` "Estimated Views 1M+ monthly impressions" |
| Identifiable social proof | 5 | 2/4 | 2.5 | `logo wall` "Lulu, Omantel, Bank Dhofar... alt = filenames" |
| Founder and team credibility | 4 | 0/4 | 0.0 | `footer` "We are a team of individuals who are dedicated to growing..." |
| Maintenance signals | 2 | 1/4 | 0.5 | `LED Network card` "Coming Soon"; `Lulu Amerat card` "5.7m x 9.6m. Coming Soon" +1 more |
| Contact and legitimacy | 4 | 3/4 | 3.0 | `contact links` "mailto:sales@media21world.com, tel:+96891229053, Majan I tower map"; `social` "Facebook, Instagram, LinkedIn" |

## Strengths to keep

- **Inventory cards with real specs**: `Hormuz Grand Gold card` "Size 13.50m × 11.50m · Seeb highway commuters · 750K+ monthly impressions"
- **Location photos have meaningful alt**: `img alt` "Lulu Zakher Mall"
- **Consistent, premium visual system**: `desktop.png` "uniform photo cards, single gradient button style"

## Limitations

- Audited from the local build; live domain, robots.txt and sitemap not checked.

---
Generated by ux-audit-agent with rubric v2.0. Scores are a weighted sum of 26 criteria (levels 0-4); every finding cites the element or text it came from.
