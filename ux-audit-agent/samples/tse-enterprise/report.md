# UX audit: The Solomon Engine: Enterprise Tier landing page

**URL:** https://thebradburygroup.com/solomon-engine/ (local build: UX Research-TBG/the-solomon-engine/The Solomon Engine-Enterprise/index.html) · **Audited:** 2026-11-25 · **Input:** rendered (local HTML served and rendered in Chromium at 1440px and 375px) · **Rubric:** v2.0

**Pages reviewed:** index.html

## Score: 47/100 (Needs significant improvement)

A focused, priced offer page with real scarcity and a useful tax section, undercut by a price contradiction ($25,000 vs '$6,000 investment'), a closing 'schedule your call' block with no link, and its best proof (Andy Ivey's ROI case, the IDC benchmark, the three cohort pillars) locked inside two images alt-tagged 'Architecture Framework'.

| Category | Weight | Score | |
|---|---:|---:|---|
| UX & conversion | 30 | 54/100 | `███████████░░░░░░░░░` |
| SEO | 30 | 37/100 | `███████░░░░░░░░░░░░░` |
| Content | 20 | 64/100 | `█████████████░░░░░░░` |
| Trust | 20 | 34/100 | `███████░░░░░░░░░░░░░` |

## Top 5 blockers

**1. Price contradiction: $25,000 tier vs '$6,000 investment'** · CRITICAL · costs 2.5 pts on *Claim substantiation*

- Evidence: `div.inv-amount` "$25,000"; `tax-summary p` "your $6,000 investment can be fully deducted"
- Why it matters: An enterprise buyer reading two prices on one page will doubt both.
- Fix: Replace '$6,000' with '$25,000' (or 'your investment') in the tax section; diff the two tier pages for other copy-paste residue. (effort S, owner Content)

**2. No testimonials or named clients** · HIGH · costs 3.8 pts on *Identifiable social proof*

- Evidence: `TSE.png (image text)` "Andy Ivey's Pilot Case study results"
- Fix: Add Andy Ivey's title/organisation plus 2 named testimonials from the main site (Korn Ferry, Purdue Global). (effort M, owner Founder)

**3. ROI case study and cohort pillars exist only as images** · HIGH · costs 3.0 pts on *Image alt text*

- Evidence: `img[src='TSE.png']` "alt="Architecture Framework""; `img[src='Beta Cohort.png']` "alt="Architecture Framework""
- Why it matters: The page's strongest proof is invisible to search, screen readers and phone users.
- Fix: Rebuild the ROI stats, the Andy Ivey case and the three pillars as HTML text/cards; keep the charts as images with descriptive alt. (effort M, owner Design + Dev)

**4. Hero tagline is jargon, outcome unclear** · HIGH · costs 2.8 pts on *Value proposition clarity*

- Evidence: `p.header-tagline` "systematically protect cognitive bandwidth ... anchor downstream division scaling"
- Fix: Lead with the outcome in plain words, e.g. 'A 12-week, 1:1 AI programme that gives your leadership team back 14 hours a week.' (effort S, owner Content)

**5. 'Schedule your discovery call' block has no scheduling link** · HIGH · costs 2.2 pts on *CTA label matches destination*

- Evidence: `div.cta-block` "Schedule your professional discovery call ..."; `div.cta-contact` "only <a> to www.thebradburygroup.com"
- Why it matters: The closing CTA promises an action the page cannot perform.
- Fix: Add a 'Book scoping call' button linked to Cal.com or Calendly, and make the email a mailto link. (effort S, owner Dev)

## Fix plan by effort and impact

Effort: S = 2 hours or less, M = 2 days or less, L = more than 2 days.

| | Low effort (S) | Higher effort (M/L) |
|---|---|---|
| **Higher impact** | **Quick wins**<br>F01 Price contradiction: $25,000 tier vs '$6,000 investment'<br>F06 Hero tagline is jargon, outcome unclear<br>F02 'Schedule your discovery call' block has no scheduling link<br>F07 No meta description; brand-only title<br>F11 No Course/Offer schema<br>F08 Contact details are plain text; no privacy link<br>F09 Founder not introduced on a $25k offer<br>F12 No canonical or Open Graph tags<br>F13 No objection handling or proof-adjacent CTA<br>F14 Two competing conversion routes, neither direct<br>F10 Body font 'Montserrat Bold' never loads | **Major projects**<br>F04 No testimonials or named clients<br>F03 ROI case study and cohort pillars exist only as images |
| **Lower impact** | **Fill-ins**<br>F15 Tier pages do not link to each other<br>F16 Buzzword-dense CTA and capacity copy<br>F17 Unclosed wrapper <div> around the framework image | **Later / reconsider**<br>F05 Text-in-image and generic alt fail WCAG 1.1.1 |

## Quick wins

- [ ] **Price contradiction: $25,000 tier vs '$6,000 investment'**: Replace '$6,000' with '$25,000' (or 'your investment') in the tax section; diff the two tier pages for other copy-paste residue. (Content)
- [ ] **Hero tagline is jargon, outcome unclear**: Lead with the outcome in plain words, e.g. 'A 12-week, 1:1 AI programme that gives your leadership team back 14 hours a week.' (Content)
- [ ] **'Schedule your discovery call' block has no scheduling link**: Add a 'Book scoping call' button linked to Cal.com or Calendly, and make the email a mailto link. (Dev)
- [ ] **No meta description; brand-only title**: Title: 'Executive AI Training for $10M+ Companies | The Solomon Engine'; add a 150-char description. (SEO)
- [ ] **No Course/Offer schema**: Add Course + Offer JSON-LD (price 25000 USD, provider The Bradbury Group). (SEO)
- [ ] **Contact details are plain text; no privacy link**: Make the email (mailto) and LinkedIn (href) clickable; add privacy and terms links in the footer. (Dev)
- [ ] **Founder not introduced on a $25k offer**: Add a short founder strip: photo, name, 2-3 credentials (CNN, IBM, Microsoft/SAP/Coursera). (Content)
- [ ] **No canonical or Open Graph tags**: Add a canonical plus og:title, og:description and og:image (the TSE banner) for LinkedIn shares. (Dev)
- [ ] **No objection handling or proof-adjacent CTA**: Repeat the scoping CTA under the ROI proof; add a 3-question FAQ (time commitment, data security, refund/credit). (Design)
- [ ] **Two competing conversion routes, neither direct**: Pick one path for the Enterprise tier (scoping call) and use it for both CTAs. (Founder)
- [ ] **Body font 'Montserrat Bold' never loads**: Use font-family: 'Open Sans' for body and 'Montserrat' with font-weight: 700 for headings. (Dev)

## Full fix plan

| ID | Issue | Evidence | Severity | Effort | Impact | Recommended fix | Owner |
|---|---|---|---|---|---|---|---|
| F01 | Price contradiction: $25,000 tier vs '$6,000 investment' | `div.inv-amount` "$25,000"; `tax-summary p` "your $6,000 investment can be fully deducted" | critical | S | high | Replace '$6,000' with '$25,000' (or 'your investment') in the tax section; diff the two tier pages for other copy-paste residue. | Content |
| F04 | No testimonials or named clients | `TSE.png (image text)` "Andy Ivey's Pilot Case study results" | high | M | high | Add Andy Ivey's title/organisation plus 2 named testimonials from the main site (Korn Ferry, Purdue Global). | Founder |
| F03 | ROI case study and cohort pillars exist only as images | `img[src='TSE.png']` "alt="Architecture Framework""; `img[src='Beta Cohort.png']` "alt="Architecture Framework"" | high | M | high | Rebuild the ROI stats, the Andy Ivey case and the three pillars as HTML text/cards; keep the charts as images with descriptive alt. | Design + Dev |
| F06 | Hero tagline is jargon, outcome unclear | `p.header-tagline` "systematically protect cognitive bandwidth ... anchor downstream division scaling" | high | S | high | Lead with the outcome in plain words, e.g. 'A 12-week, 1:1 AI programme that gives your leadership team back 14 hours a week.' | Content |
| F02 | 'Schedule your discovery call' block has no scheduling link | `div.cta-block` "Schedule your professional discovery call ..."; `div.cta-contact` "only <a> to www.thebradburygroup.com" | high | S | high | Add a 'Book scoping call' button linked to Cal.com or Calendly, and make the email a mailto link. | Dev |
| F07 | No meta description; brand-only title | `<title>` "The Solomon Engine — Enterprise Tier"; `meta[name=description]` "missing" | high | S | medium | Title: 'Executive AI Training for $10M+ Companies \| The Solomon Engine'; add a 150-char description. | SEO |
| F05 | Text-in-image and generic alt fail WCAG 1.1.1 | `img alt` "Logo / Architecture Framework / Architecture Framework" | high | M | medium | Covered by F03; also set the logo alt to 'The Bradbury Group' and raise 10-12.5px text to 14px or more. | Dev |
| F11 | No Course/Offer schema | `script[type='application/ld+json']` "none found" | medium | S | medium | Add Course + Offer JSON-LD (price 25000 USD, provider The Bradbury Group). | SEO |
| F08 | Contact details are plain text; no privacy link | `div.cta-contact span` "tbgtraining@thebradburygroup.net" | medium | S | medium | Make the email (mailto) and LinkedIn (href) clickable; add privacy and terms links in the footer. | Dev |
| F09 | Founder not introduced on a $25k offer | `div.cta-contact span` "linkedin.com/in/paigebradbury" | medium | S | medium | Add a short founder strip: photo, name, 2-3 credentials (CNN, IBM, Microsoft/SAP/Coursera). | Content |
| F12 | No canonical or Open Graph tags | `<head>` "no link[rel=canonical], no og:title/og:image" | medium | S | medium | Add a canonical plus og:title, og:description and og:image (the TSE banner) for LinkedIn shares. | Dev |
| F13 | No objection handling or proof-adjacent CTA | `section order` "ROI image -> Beta Cohort image -> $25,000 (no CTA between)" | medium | S | medium | Repeat the scoping CTA under the ROI proof; add a 3-question FAQ (time commitment, data security, refund/credit). | Design |
| F14 | Two competing conversion routes, neither direct | `a.vip-btn` "Secure Your Seat Now -> /vip/"; `div.cta-block` "Initiate Corporate Scoping (no link)" | medium | S | medium | Pick one path for the Enterprise tier (scoping call) and use it for both CTAs. | Founder |
| F10 | Body font 'Montserrat Bold' never loads | `body { font-family }` "font-family: 'Montserrat Bold', sans-serif;" | medium | S | medium | Use font-family: 'Open Sans' for body and 'Montserrat' with font-weight: 700 for headings. | Dev |
| F15 | Tier pages do not link to each other | `internal links` "/vip/, / only" | low | S | low | Add 'Under $10M? See the Small Business cohort' and links to case studies and the founder bio. | SEO |
| F16 | Buzzword-dense CTA and capacity copy | `cta-block p` "verify organizational alignment and secure tier validation" | low | S | low | Rewrite in plain words: 'Book a 30-minute call to check fit.' | Content |
| F17 | Unclosed wrapper <div> around the framework image | `div.architecture-image` "<div class="architecture-image"> <img src="TSE.png"> (no closing tag)" | low | S | low | Close the div; run the page through the W3C validator. | Dev |

## Scorecard

### UX & conversion: 54/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Primary CTA: clear and on-site | 5 | 3/4 | 4.2 | `a.vip-btn (first viewport)` "Secure Your Seat Now -> https://thebradburygroup.com/vip/ (target=_blank)" |
| CTA label matches destination | 4 | 2/4 | 2.2 | `div.cta-block h3 + p` "Initiate Corporate Scoping. Schedule your professional discovery call ..."; `div.cta-contact` "<a> www.thebradburygroup.com; <span>tbgtraining@thebradburygroup.net</span>" |
| Conversion path and booking friction | 5 | 2/4 (medium confidence) | 2.8 | `a.vip-btn` "-> /vip/ (destination not in this build)"; `div.cta-contact span` "tbgtraining@thebradburygroup.net (not a mailto link)" |
| Navigation and information architecture | 3 | n/a | — | Standalone campaign landing page; leaving out the nav is a deliberate conversion pattern. The logo and footer link back to the main site. |
| Page flow and persuasion sequence | 5 | 2/4 | 2.8 | `section order` "hero -> ROI image -> Beta Cohort image -> $25,000 investment -> 5 slots -> tax section -> $225/hr -> Initiate Corporate Scoping" |
| Visual hierarchy and component consistency | 3 | 2/4 | 1.7 | `body { font-family }` "font-family: 'Montserrat Bold', sans-serif;"; `.card-body` "font-size: 12.5px" |
| Responsive build | 2 | 3/4 | 1.7 | `meta viewport` "width=device-width, initial-scale=1.0"; `render @375px` "scrollWidth 375 = viewport 375 (no overflow)" |
| Accessibility basics (WCAG 2.1 A/AA) | 3 | 1/4 | 0.8 | `img[src='TSE.png'], img[src='Beta Cohort.png']` "alt="Architecture Framework" (both)"; `img.header-logo` "alt="Logo"" |

### SEO: 37/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Indexable page architecture | 7 | 3/4 (medium confidence) | 5.3 | `page URL` "/solomon-engine/ (dedicated offer URL)"; `tier pages` "Enterprise and Small Business tiers are separate HTML files" |
| Title tag and meta description | 4 | 1/4 | 1.0 | `<title>` "The Solomon Engine — Enterprise Tier (36 chars)"; `meta[name=description]` "missing" |
| Heading structure | 4 | 2/4 | 2.0 | `h1` "The Solomon Engine"; `TSE.png (image text)` "From Pilot to Profit : Achieving "AI Leader" ROI (not a heading)" |
| Image alt text | 4 | 1/4 | 1.0 | `img alt values` "Logo / Architecture Framework / Architecture Framework" |
| Structured data (schema.org) | 4 | 0/4 | 0.0 | `script[type='application/ld+json']` "none found" |
| Internal linking | 3 | 1/4 | 0.8 | `internal links` "/vip/, / (x2): no link to the Small Business tier, case study or founder bio" |
| Technical crawl basics | 4 | 1/4 (medium confidence) | 1.0 | `link[rel=canonical], meta[property^=og]` "none found" |

### Content: 64/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Value proposition clarity | 5 | 2/4 | 2.8 | `p.header-tagline` "Isolate high-stakes executive bottlenecks and systematically protect cognitive bandwidth. ... anchor downstream division scaling."; `h2` "Enterprise Tier — Over $10M Revenue" |
| Audience and pain articulation | 3 | 3/4 | 2.5 | `Beta Cohort.png (image text)` "The Reality: Leaders are buying AI licenses, handing them to teams, and praying for ROI. It doesn't work." |
| Offer specificity and engagement model | 4 | 3/4 | 3.3 | `div.inv-amount` "$25,000"; `capacity-box p` "Firm capacity of 5 active slots per master cohort" +1 more |
| Proof depth (case studies) | 3 | 3/4 | 2.5 | `TSE.png (image text)` "A $4,500 training investment returned $62,224 in projected annual value — $13.83 per dollar invested" |
| Content freshness and velocity | 2 | n/a | — | Single-offer landing page; dated content is not expected. Maintenance is scored under trust. |
| Readability and brand voice | 3 | 2/4 | 1.7 | `capacity-box p` "Enterprise blueprinting requires strict resource devotion and cannot be batched."; `cta-block p` "verify organizational alignment and secure tier validation" |

### Trust: 34/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Claim substantiation | 5 | 2/4 | 2.5 | `TSE.png (image text)` "Source: Microsoft sponsored IDC Report 2024"; `tax-summary p` "your $6,000 investment can be fully deducted" |
| Identifiable social proof | 5 | 1/4 | 1.3 | `TSE.png (image text)` "Andy Ivey's Pilot Case study results (no title or organisation)" |
| Founder and team credibility | 4 | 1/4 | 1.0 | `div.cta-contact span` "linkedin.com/in/paigebradbury" |
| Maintenance signals | 2 | 2/4 | 1.0 | `tax-summary p` "your $6,000 investment (copied from the Small Business tier)"; `div.architecture-image` "first wrapper <div> is never closed" |
| Contact and legitimacy | 4 | 1/4 | 1.0 | `div.cta-contact` "<span>tbgtraining@thebradburygroup.net</span> <span>linkedin.com/in/paigebradbury</span>" |

## Strengths to keep

- **Transparent pricing and credit policy**: `rate block` "Any consulting fees paid prior to cohort enrollment are fully applied toward your total cohort investment"
- **Real scarcity**: `capacity-box` "5 active slots per master cohort"
- **Quantified pilot case**: `TSE.png` "$4,500 ... returned $62,224"
- **No overflow at 375px**: `render @375px` "scrollWidth 375"

## Limitations

- Audited from the local build; the /vip/ destination, robots.txt and sitemap could not be checked.
- Image text was read from the rendered screenshot, not the DOM.

---
Generated by ux-audit-agent with rubric v2.0. Scores are a weighted sum of 26 criteria (levels 0-4); every finding cites the element or text it came from.
