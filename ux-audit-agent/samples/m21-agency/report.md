# UX audit: Media 21: Advertising Agency site

**URL:** https://m21world.com/ (local build: Website-M21/M-21 - Advertising Agency/dist.zip) · **Audited:** 2026-11-25 · **Input:** rendered (Vite build served locally, rendered in Chromium at 1440px and 375px; Images/ folder added because dist.zip omits it) · **Rubric:** v2.0

**Pages reviewed:** /

## Score: 42/100 (Needs significant improvement)

A clean, consistent, well-written agency one-pager with an easy contact form and full contact details. It barely exists for search: a client-rendered single page with a slogan title shared with the sister site, a bolt.new default share image, 56 logos with filename alt text, and no case studies or named people to back the claims.

| Category | Weight | Score | |
|---|---:|---:|---|
| UX & conversion | 30 | 62/100 | `████████████░░░░░░░░` |
| SEO | 30 | 25/100 | `█████░░░░░░░░░░░░░░░` |
| Content | 20 | 36/100 | `███████░░░░░░░░░░░░░` |
| Trust | 20 | 45/100 | `█████████░░░░░░░░░░░` |

## Top 5 blockers

**1. Client-rendered one-pager: services have no URLs** · CRITICAL · costs 5.3 pts on *Indexable page architecture*

- Evidence: `dist/index.html` "1,191-byte HTML shell"; `nav` "#services, #our-approach"
- Why it matters: The site cannot rank for 'branding agency Oman' or 'performance marketing Muscat'.
- Fix: Pre-render (vite-plugin-ssg or Astro) and give each service and industry its own route with unique copy. (effort L, owner Dev + SEO)

**2. 56 client logos use filenames as alt text** · HIGH · costs 4.0 pts on *Image alt text*

- Evidence: `img alt` "Eicher_Motors-Logo.wine.png"; `img alt` "Ahlibank.png"
- Fix: Generate alt from a brand-name map (alt="Ahlibank"); mark the duplicated marquee copies aria-hidden. (effort S, owner Dev)

**3. Slogan title and description shared with the Outdoor site** · HIGH · costs 3.0 pts on *Title tag and meta description*

- Evidence: `<title>` "M21 Global — Transforming Ideas Into Success"
- Fix: Title: 'Media 21 | Full-Service Marketing Agency in Muscat, Oman'; write a distinct 150-char description. (effort S, owner SEO)

**4. Services are one-line blurbs** · HIGH · costs 3.0 pts on *Offer specificity and engagement model*

- Evidence: `service card` "Public Relations: Building visibility, credibility, and meaningful conversations around brands."
- Fix: Per service: 3 deliverables, typical timeline, and 'retainer or project' engagement line. (effort M, owner Content)

**5. No on-site case studies; portfolio is a Drive PDF** · HIGH · costs 2.3 pts on *Proof depth (case studies)*

- Evidence: `a 'Portfolio'` "https://drive.google.com/file/d/19KJ-sSMCn9Kk7bymoFQVCNkODjdPQqxk/view"
- Fix: Publish 3 case pages (one per key industry: banking, automotive, real estate) with brief, work and result. (effort L, owner Content)

## Fix plan by effort and impact

Effort: S = 2 hours or less, M = 2 days or less, L = more than 2 days.

| | Low effort (S) | Higher effort (M/L) |
|---|---|---|
| **Higher impact** | **Quick wins**<br>F03 56 client logos use filenames as alt text<br>F02 Slogan title and description shared with the Outdoor site<br>F05 Share image is the bolt.new template default<br>F06 Contact form inputs have no labels<br>F09 No named leadership or team<br>F10 No Organization/LocalBusiness schema<br>F08 Hero has no CTA<br>F17 No proof section before the closing CTA<br>F11 Copy is about Media 21, not the client's problem<br>F12 Form collects data with no privacy policy<br>F13 dist.zip ships without Images/ and Logos/ | **Major projects**<br>F01 Client-rendered one-pager: services have no URLs<br>F07 Services are one-line blurbs<br>F04 No on-site case studies; portfolio is a Drive PDF |
| **Lower impact** | **Fill-ins**<br>F14 Category count differs between M21 sites | **Later / reconsider**<br>F16 No internal pages to link between<br>F15 No dated content or news |

## Quick wins

- [ ] **56 client logos use filenames as alt text**: Generate alt from a brand-name map (alt="Ahlibank"); mark the duplicated marquee copies aria-hidden. (Dev)
- [ ] **Slogan title and description shared with the Outdoor site**: Title: 'Media 21 | Full-Service Marketing Agency in Muscat, Oman'; write a distinct 150-char description. (SEO)
- [ ] **Share image is the bolt.new template default**: Set og:image to a branded 1200x630 image; set og:title/description and a canonical URL. (Dev)
- [ ] **Contact form inputs have no labels**: Add <label for> (visually hidden if needed) or aria-label to each input. (Dev)
- [ ] **No named leadership or team**: Add a leadership strip (names, roles, photos, LinkedIn). (Content)
- [ ] **No Organization/LocalBusiness schema**: Add LocalBusiness JSON-LD with the Majan I tower address, phone and sameAs social links. (SEO)
- [ ] **Hero has no CTA**: Add 'Start a project' (primary) and 'See our work' (secondary) buttons under the hero paragraph. (Design)
- [ ] **No proof section before the closing CTA**: Insert 2 client quotes or one mini-case between Industries and the closing CTA. (Design)
- [ ] **Copy is about Media 21, not the client's problem**: Add a 'Sound familiar?' block naming 3 client problems (inconsistent brand, content without results, agency sprawl). (Content)
- [ ] **Form collects data with no privacy policy**: Publish a privacy policy and link it under the form and in the footer. (Founder)
- [ ] **dist.zip ships without Images/ and Logos/**: Move Images/ into public/ so Vite copies it into dist; add a 404 check to the release step. (Dev)

## Full fix plan

| ID | Issue | Evidence | Severity | Effort | Impact | Recommended fix | Owner |
|---|---|---|---|---|---|---|---|
| F01 | Client-rendered one-pager: services have no URLs | `dist/index.html` "1,191-byte HTML shell"; `nav` "#services, #our-approach" | critical | L | high | Pre-render (vite-plugin-ssg or Astro) and give each service and industry its own route with unique copy. | Dev + SEO |
| F03 | 56 client logos use filenames as alt text | `img alt` "Eicher_Motors-Logo.wine.png"; `img alt` "Ahlibank.png" | high | S | high | Generate alt from a brand-name map (alt="Ahlibank"); mark the duplicated marquee copies aria-hidden. | Dev |
| F02 | Slogan title and description shared with the Outdoor site | `<title>` "M21 Global — Transforming Ideas Into Success" | high | S | high | Title: 'Media 21 \| Full-Service Marketing Agency in Muscat, Oman'; write a distinct 150-char description. | SEO |
| F07 | Services are one-line blurbs | `service card` "Public Relations: Building visibility, credibility, and meaningful conversations around brands." | high | M | high | Per service: 3 deliverables, typical timeline, and 'retainer or project' engagement line. | Content |
| F04 | No on-site case studies; portfolio is a Drive PDF | `a 'Portfolio'` "https://drive.google.com/file/d/19KJ-sSMCn9Kk7bymoFQVCNkODjdPQqxk/view" | high | L | high | Publish 3 case pages (one per key industry: banking, automotive, real estate) with brief, work and result. | Content |
| F05 | Share image is the bolt.new template default | `meta[property='og:image']` "https://bolt.new/static/og_default.png" | high | S | medium | Set og:image to a branded 1200x630 image; set og:title/description and a canonical URL. | Dev |
| F06 | Contact form inputs have no labels | `form input` "placeholder 'Your name' only; 4 unlabeled fields" | high | S | medium | Add <label for> (visually hidden if needed) or aria-label to each input. | Dev |
| F09 | No named leadership or team | `footer` "We are a team of individuals who are dedicated to growing, nurturing and sustaining brands." | medium | S | medium | Add a leadership strip (names, roles, photos, LinkedIn). | Content |
| F10 | No Organization/LocalBusiness schema | `script[type='application/ld+json']` "none found" | medium | S | medium | Add LocalBusiness JSON-LD with the Majan I tower address, phone and sameAs social links. | SEO |
| F08 | Hero has no CTA | `hero` "h1 + paragraph + stats; CTA only in header" | medium | S | medium | Add 'Start a project' (primary) and 'See our work' (secondary) buttons under the hero paragraph. | Design |
| F17 | No proof section before the closing CTA | `h2 order` "Built Across Multiple Industries -> You've Seen The Direction. Now Let's Build The Brand." | medium | S | medium | Insert 2 client quotes or one mini-case between Industries and the closing CTA. | Design |
| F11 | Copy is about Media 21, not the client's problem | `Relevance Over Noise` "We don't chase trends blindly." | medium | S | medium | Add a 'Sound familiar?' block naming 3 client problems (inconsistent brand, content without results, agency sprawl). | Content |
| F12 | Form collects data with no privacy policy | `footer links` "no privacy/terms links" | medium | S | medium | Publish a privacy policy and link it under the form and in the footer. | Founder |
| F13 | dist.zip ships without Images/ and Logos/ | `render of dist.zip as shipped` "21 requests 404 (e.g. /Logos/Ahlibank.png)" | medium | S | medium | Move Images/ into public/ so Vite copies it into dist; add a 404 check to the release step. | Dev |
| F14 | Category count differs between M21 sites | `hero stats` "25+ Categories"; `Outdoor hero stats` "50+ Categories" | low | S | low | Use one source of truth for company stats across both sites. | Content |
| F16 | No internal pages to link between | `links` "0 internal page links" | low | M | low | Follows from F01: link service pages to related case pages. | SEO |
| F15 | No dated content or news | `page text` "no blog, news or dated work" | low | L | low | Add a 'Latest work' feed (one post per campaign) linked from the homepage. | Marketing |

## Scorecard

### UX & conversion: 62/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Primary CTA: clear and on-site | 5 | 2/4 | 2.5 | `header button` "Contact Us"; `hero (first viewport)` "h1 'Built For Brands That Want To Stand Out' + stats; no CTA in the hero itself" |
| CTA label matches destination | 4 | 3/4 | 3.0 | `a 'Portfolio'` "-> drive.google.com/file/d/19KJ-... (leaves site)"; `a 'Outdoor Media'` "-> https://outdoor.m21world.com/" |
| Conversion path and booking friction | 5 | 3/4 | 3.8 | `form fields` "Full Name, Email Address, Company (optional), Tell Us About Your Project Requirement."; `contact aside` "Response Time < 24hrs. We respond to all inquiries within one business day." |
| Navigation and information architecture | 3 | 3/4 | 2.3 | `nav` "Home, Who We Are, Services, Our Approach, Our Experience, Why Media 21 (all #anchors)" |
| Page flow and persuasion sequence | 5 | 2/4 | 2.5 | `heading outline` "Built For Brands... -> Modern Marketing Backed By Experience -> Collaborations Across Sectors -> Everything Your Brand Needs To Grow -> Relevance Over Noise -> Built Across Multiple Industries -> You've Seen The Direction. Now Let's Build The Brand." |
| Visual hierarchy and component consistency | 3 | 3/4 (medium confidence) | 2.3 | `desktop.png` "one gradient pill button style; consistent dark theme and card grid" |
| Responsive build | 2 | 3/4 | 1.5 | `render @375px` "scrollWidth 375 = viewport 375; 6 tap targets under 32px" |
| Accessibility basics (WCAG 2.1 A/AA) | 3 | 1/4 | 0.8 | `logo wall img alt` "Ahlibank.png, Al Khamayil.png, BM_logo.png ... (56 of 69 images)"; `form inputs` "4 inputs with placeholder only, no label/aria-label" |

### SEO: 25/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Indexable page architecture | 7 | 1/4 | 1.8 | `dist/index.html` "1,191-byte shell; all content rendered client-side by index-*.js"; `nav hrefs` "#who-we-are, #services, ... (no service URLs)" |
| Title tag and meta description | 4 | 1/4 | 1.0 | `<title>` "M21 Global — Transforming Ideas Into Success"; `meta[name=description]` "M21 Global. Thrive in a competitive, ever-evolving landscape through creativity, innovation, and data-driven strategy." |
| Heading structure | 4 | 3/4 | 3.0 | `h1` "Built For Brands That Want To Stand Out"; `h2/h3 outline` "8 H2, 10 H3 in logical order, no duplicates" |
| Image alt text | 4 | 0/4 | 0.0 | `images` "69 total: 56 filename alt (e.g. 'Eicher_Motors-Logo.wine.png'), 13 ok" |
| Structured data (schema.org) | 4 | 0/4 | 0.0 | `script[type='application/ld+json']` "none found" |
| Internal linking | 3 | 1/4 | 0.8 | `links` "6 anchors, 0 internal pages; 7 external links" |
| Technical crawl basics | 4 | 1/4 (medium confidence) | 1.0 | `meta[property='og:image']` "https://bolt.new/static/og_default.png"; `link[rel=canonical]` "none" |

### Content: 36/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Value proposition clarity | 5 | 2/4 | 2.5 | `hero p` "Media 21 is a full-service marketing agency built on experience and shaped by how marketing works today." |
| Audience and pain articulation | 3 | 1/4 | 0.8 | `section 'Relevance Over Noise'` "We don't chase trends blindly." |
| Offer specificity and engagement model | 4 | 1/4 | 1.0 | `service cards` "Performance Marketing: Targeted campaigns focused on visibility, conversions, and measurable business growth." |
| Proof depth (case studies) | 3 | 1/4 | 0.8 | `a 'Portfolio'` "-> Google Drive PDF; no on-site case study" |
| Content freshness and velocity | 2 | 0/4 | 0.0 | `page text` "no dated content, blog or news found" |
| Readability and brand voice | 3 | 3/4 | 2.3 | `Who We Are p` "No unnecessary complexity. No marketing for the sake of it. Just work designed to move brands forward." |

### Trust: 45/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Claim substantiation | 5 | 2/4 (medium confidence) | 2.5 | `hero stats` "40+ Clients · 11 Years · 25+ Categories"; `Outdoor site hero` "50+ Categories (sister site)" |
| Identifiable social proof | 5 | 2/4 | 2.5 | `logo wall` "Bank Dhofar, Al Zain, friendi mobile... visually recognisable; alt = filenames; no captions" |
| Founder and team credibility | 4 | 0/4 | 0.0 | `footer` "We are a team of individuals who are dedicated to growing, nurturing and sustaining brands." |
| Maintenance signals | 2 | 2/4 (medium confidence) | 1.0 | `footer` "no copyright line"; `dist.zip` "Images/ and Logos/ missing from the build: 21 x 404 until added" |
| Contact and legitimacy | 4 | 3/4 | 3.0 | `contact links` "mailto:sales@media21world.com, tel:+96891229053, 603-604, Majan I tower, Ghala (Google Map)"; `social links` "Facebook, Instagram, LinkedIn" |

## Strengths to keep

- **Crisp, confident voice**: `Who We Are` "No unnecessary complexity. No marketing for the sake of it."
- **Short form with a response SLA**: `contact aside` "We respond to all inquiries within one business day."
- **Full business identity**: `contact` "603-604, Majan I tower, Ghala"

## Limitations

- Audited from the local build; robots.txt, sitemap and the live domain's canonical could not be checked.

---
Generated by ux-audit-agent with rubric v2.0. Scores are a weighted sum of 26 criteria (levels 0-4); every finding cites the element or text it came from.
