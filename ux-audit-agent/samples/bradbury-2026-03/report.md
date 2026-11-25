# UX audit: The Bradbury Group (benchmark, March 2026 snapshot)

**URL:** https://thebradburygroup.com/ · **Audited:** 2026-11-25 · **Input:** text · **Rubric:** v2.0

**Pages reviewed:** /, /solomon-engine/, /tbgexecutiveaifluencytraining/, /blog/

## Score: 48/100 (Needs significant improvement)

A credible, well-written consultancy page whose conversion path breaks at the first click. The hero CTA and the Consulting 'Learn More' both leave for ElevenLabs, the advertised Columbus assessment is a contact form, and every service is a #anchor on one page, so nothing ranks for service queries. Founder story, named testimonials and the FAQ are real assets.

| Category | Weight | Score | |
|---|---:|---:|---|
| UX & conversion | 30 | 43/100 | `█████████░░░░░░░░░░░` |
| SEO | 30 | 35/100 | `███████░░░░░░░░░░░░░` |
| Content | 20 | 61/100 | `████████████░░░░░░░░` |
| Trust | 20 | 60/100 | `████████████░░░░░░░░` |

## Top 5 blockers

**1. Services exist only as #anchors on one page** · CRITICAL · costs 5.3 pts on *Indexable page architecture*

- Evidence: `nav hrefs` "#about, #services, #reviews, #faq"
- Why it matters: Nothing can rank for 'AI training for L&D teams' or 'AI keynote speaker'.
- Fix: Create /training/, /consulting/ and /speaking/ pages with unique copy and keywords, following the /solomon-engine/ model; point nav and cards at them. (effort L, owner Dev + SEO)

**2. Primary hero CTA leaves the site for ElevenLabs** · CRITICAL · costs 3.8 pts on *Primary CTA: clear and on-site*

- Evidence: `hero CTA` "Discover Your AI Readiness -> elevenlabs.io/app/talk-to?agent_id=..."
- Why it matters: The session is lost at the first click; consulting buyers rarely come back.
- Fix: Embed the ElevenLabs/Columbus agent on-site as an inline widget or branded modal; never let the primary CTA exit the domain. (effort S, owner Dev)

**3. Columbus 3-minute assessment CTA opens a contact form** · CRITICAL · costs 3.0 pts on *CTA label matches destination*

- Evidence: `a 'Let's Go!'` "Take our 3-minute assessment guided by AI assistant Columbus -> #contact"
- Why it matters: A broken promise at peak intent is worse than no promise.
- Fix: Wire 'Let's Go!' to the real Columbus assessment; if it does not exist yet, remove the copy. (effort M, owner Dev)

**4. 'Book A Call Today' has no booking mechanism** · HIGH · costs 3.8 pts on *Conversion path and booking friction*

- Evidence: `section 'Book A Call Today'` "only a logo and tagline text"
- Why it matters: Adds 24-72 hours of back-and-forth to the conversion moment.
- Fix: Embed a Cal.com or Calendly inline scheduler in the section. (effort S, owner Dev)

**5. Seven headline statistics have no source** · HIGH · costs 3.8 pts on *Claim substantiation*

- Evidence: `stat callouts` "92% adoption rates"; `stat callouts` "40% reduction in course development time"
- Why it matters: Analytical L&D and C-suite buyers discount unsourced numbers.
- Fix: Footnote each stat with its source or 'based on N client cohorts, 2024-25'; drop any that cannot be sourced. (effort M, owner Content)

## Fix plan by effort and impact

Effort: S = 2 hours or less, M = 2 days or less, L = more than 2 days.

| | Low effort (S) | Higher effort (M/L) |
|---|---|---|
| **Higher impact** | **Quick wins**<br>F01 Primary hero CTA leaves the site for ElevenLabs<br>F07 'Book A Call Today' has no booking mechanism<br>F08 'Guiding Principles' and Consulting 'Learn More' CTAs misdirect<br>F06 Partner logos are unnamed<br>F12 No schema markup<br>F13 Stock-library alt text on service images<br>F11 No CTA after the named testimonials | **Major projects**<br>F03 Services exist only as #anchors on one page<br>F02 Columbus 3-minute assessment CTA opens a contact form<br>F04 Seven headline statistics have no source<br>F05 Hero (and H1) duplicated in the DOM<br>F09 No case studies with measurable outcomes |
| **Lower impact** | **Fill-ins**<br>F17 Footer copyright says 2025 | **Later / reconsider**<br>F10 WCAG basics fail: stock/filename alt, no skip link<br>F15 No engagement model or price signal<br>F14 Internal links are anchors, not pages<br>F18 LinkedIn is the only channel<br>F16 CTAs use three unrelated styles |

## Quick wins

- [ ] **Primary hero CTA leaves the site for ElevenLabs**: Embed the ElevenLabs/Columbus agent on-site as an inline widget or branded modal; never let the primary CTA exit the domain. (Dev)
- [ ] **'Book A Call Today' has no booking mechanism**: Embed a Cal.com or Calendly inline scheduler in the section. (Dev)
- [ ] **'Guiding Principles' and Consulting 'Learn More' CTAs misdirect**: Point each CTA at the content its label names (principles section, /consulting/ page). (Dev)
- [ ] **Partner logos are unnamed**: Add brand-name alt text and a caption or hover label to each logo; use monochrome PNGs. (Dev)
- [ ] **No schema markup**: Add FAQPage JSON-LD on the FAQ, Person on the founder bio and Service on each service URL. (SEO)
- [ ] **Stock-library alt text on service images**: Replace with descriptive, keyworded alt text per image. (Content)
- [ ] **No CTA after the named testimonials**: Add the primary 'Book a consultation' button directly after the testimonials. (Design)

## Full fix plan

| ID | Issue | Evidence | Severity | Effort | Impact | Recommended fix | Owner |
|---|---|---|---|---|---|---|---|
| F03 | Services exist only as #anchors on one page | `nav hrefs` "#about, #services, #reviews, #faq" | critical | L | high | Create /training/, /consulting/ and /speaking/ pages with unique copy and keywords, following the /solomon-engine/ model; point nav and cards at them. | Dev + SEO |
| F01 | Primary hero CTA leaves the site for ElevenLabs | `hero CTA` "Discover Your AI Readiness -> elevenlabs.io/app/talk-to?agent_id=..." | critical | S | high | Embed the ElevenLabs/Columbus agent on-site as an inline widget or branded modal; never let the primary CTA exit the domain. | Dev |
| F02 | Columbus 3-minute assessment CTA opens a contact form | `a 'Let's Go!'` "Take our 3-minute assessment guided by AI assistant Columbus -> #contact" | critical | M | high | Wire 'Let's Go!' to the real Columbus assessment; if it does not exist yet, remove the copy. | Dev |
| F07 | 'Book A Call Today' has no booking mechanism | `section 'Book A Call Today'` "only a logo and tagline text" | high | S | high | Embed a Cal.com or Calendly inline scheduler in the section. | Dev |
| F04 | Seven headline statistics have no source | `stat callouts` "92% adoption rates"; `stat callouts` "40% reduction in course development time" | high | M | high | Footnote each stat with its source or 'based on N client cohorts, 2024-25'; drop any that cannot be sourced. | Content |
| F08 | 'Guiding Principles' and Consulting 'Learn More' CTAs misdirect | `a 'Learn About Our Guiding Principles'` "-> #contact"; `a 'Learn More' (Consulting)` "-> elevenlabs.io" | high | S | high | Point each CTA at the content its label names (principles section, /consulting/ page). | Dev |
| F05 | Hero (and H1) duplicated in the DOM | `h1 x2` "Stop Implementing AI Tools. Start Architecting Human Performance." | high | M | high | Replace the mobile/desktop clones with one responsive hero and a single H1. | Dev |
| F09 | No case studies with measurable outcomes | `testimonials only` "No case studies with before/after detail" | high | L | high | Publish 2-3 case studies using the case-study template (challenge, intervention, metric). | Content |
| F06 | Partner logos are unnamed | `logo strip img src` "1.png, 3.png, sweet.png (no alt)" | high | S | high | Add brand-name alt text and a caption or hover label to each logo; use monochrome PNGs. | Dev |
| F10 | WCAG basics fail: stock/filename alt, no skip link | `img alt` "Young asia student study in the public library, She makes note on notebook." | high | M | medium | Rewrite alt text, add a skip link, check secondary-text contrast in services. | Dev |
| F12 | No schema markup | `JSON-LD` "No schema markup evident for FAQPage, Person, Service" | medium | S | medium | Add FAQPage JSON-LD on the FAQ, Person on the founder bio and Service on each service URL. | SEO |
| F13 | Stock-library alt text on service images | `services img alt` "Young asia student study in the public library..." | medium | S | medium | Replace with descriptive, keyworded alt text per image. | Content |
| F15 | No engagement model or price signal | `services section` "Consulting, Training, Speaking: no pricing or engagement model" | medium | M | medium | Add an engagement-model line per service (format, duration, 'from' price or 'typical engagement'). | Founder |
| F14 | Internal links are anchors, not pages | `section links` "#services, #contact" | medium | M | medium | Link services, blog posts and future case studies to each other with descriptive anchor text. | SEO |
| F18 | LinkedIn is the only channel | `footer social links` "LinkedIn only" | medium | L | medium | Add a newsletter sign-up and a YouTube channel for demos; list a direct email. | Marketing |
| F16 | CTAs use three unrelated styles | `buttons` "some bordered, some filled, some plain text links" | medium | M | medium | Define primary (Mustard Gold fill), secondary (outline) and text-link styles and apply site-wide. | Design |
| F11 | No CTA after the named testimonials | `testimonials section` "Korn Ferry, Purdue Global; next element is not a CTA" | medium | S | medium | Add the primary 'Book a consultation' button directly after the testimonials. | Design |
| F17 | Footer copyright says 2025 | `footer` "Copyright © 2025" | medium | S | low | Render the year dynamically. | Dev |

## Scorecard

### UX & conversion: 43/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Primary CTA: clear and on-site | 5 | 1/4 | 1.3 | `hero CTA button` "Discover Your AI Readiness -> elevenlabs.io/app/talk-to?agent_id=..." |
| CTA label matches destination | 4 | 1/4 | 1.0 | `a 'Let's Go!' (3-minute assessment)` "Take our 3-minute assessment guided by AI assistant Columbus -> #contact"; `a 'Learn About Our Guiding Principles'` "-> #contact" +1 more |
| Conversion path and booking friction | 5 | 1/4 | 1.3 | `section 'Book A Call Today'` "contains only a logo and tagline text; no Calendly/Cal.com embed" |
| Navigation and information architecture | 3 | 3/4 | 2.3 | `nav` "About -> #about, Services -> #services, Reviews -> #reviews, FAQ -> #faq" |
| Page flow and persuasion sequence | 5 | 3/4 | 3.8 | `section 'Three Brutal Realities'` "your team is overwhelmed by AI hype ... every quick fix risks data leaks ... your leaders demand ROI proof you can't deliver"; `testimonials section` "Korn Ferry, Purdue Global attributions; no CTA follows" |
| Visual hierarchy and component consistency | 3 | 2/4 (medium confidence) | 1.5 | `CTA styles` "some bordered, some filled, some plain text links"; `service cards` "two-column image+text in one service, text-only stacked in another" |
| Responsive build | 2 | 2/4 | 1.0 | `hero section x2 in DOM` "headline, CTA and image render twice (mobile/desktop split)" |
| Accessibility basics (WCAG 2.1 A/AA) | 3 | 1/4 | 0.8 | `img alt` "Young asia student study in the public library, She makes note on notebook."; `logo strip img` "1.png, 3.png, sweet.png with no alt" |

### SEO: 35/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Indexable page architecture | 7 | 1/4 | 1.8 | `nav hrefs` "#about, #services, #reviews, #faq"; `dedicated URL` "Solomon Engine has its own page; Training, Speaking, Consulting do not" (/solomon-engine/) |
| Title tag and meta description | 4 | 3/4 (medium confidence) | 3.0 | `<title>` "AI Strategy & Training for L&D Teams \| The Bradbury Group" |
| Heading structure | 4 | 1/4 | 1.0 | `h1 (duplicated)` "Stop Implementing AI Tools. Start Architecting Human Performance. (appears twice in DOM)" |
| Image alt text | 4 | 1/4 | 1.0 | `service images alt` "Young asia student study in the public library..."; `partner logos` "1.png, 3.png, sweet.png" |
| Structured data (schema.org) | 4 | 0/4 | 0.0 | `JSON-LD` "No schema markup evident for FAQPage, Person, Service, or LocalBusiness" |
| Internal linking | 3 | 1/4 | 0.8 | `internal links` "primary nav and section CTAs are #anchors; services do not link to blog or case pages" |
| Technical crawl basics | 4 | 3/4 (low confidence) | 3.0 | `platform` "WordPress (custom theme); blog posts have full URLs with category tagging" |

### Content: 61/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Value proposition clarity | 5 | 3/4 | 3.8 | `h1` "Stop Implementing AI Tools. Start Architecting Human Performance." |
| Audience and pain articulation | 3 | 4/4 | 3.0 | `section 'Three Brutal Realities'` "your leaders demand ROI proof you can't deliver" |
| Offer specificity and engagement model | 4 | 1/4 | 1.0 | `services section` "Consulting, Training, Speaking presented without pricing, engagement model or case links" |
| Proof depth (case studies) | 3 | 1/4 | 0.8 | `testimonials only` "No case studies with before/after detail" |
| Content freshness and velocity | 2 | 3/4 | 1.5 | `blog post dates` "3 recent posts (Jan-Feb 2026)" (/blog/) |
| Readability and brand voice | 3 | 3/4 | 2.3 | `blog titles` "Wax On, Wax Off: What The Karate Kid Teaches Us About AI Skills" (/blog/) |

### Trust: 60/100

| Criterion | Weight | Level | Points | Evidence |
|---|---:|---:|---:|---|
| Claim substantiation | 5 | 1/4 | 1.3 | `stat callouts` "92% adoption rates; 20% efficiency gains in 60 days; 40% content dev time reduction; 82% of L&D pros" |
| Identifiable social proof | 5 | 3/4 | 3.8 | `testimonials` "AI Task Force Chair, Purdue Global University; Talent Development Manager, Korn Ferry"; `logo strip` "1.png, 3.png, sweet.png (unnamed)" |
| Founder and team credibility | 4 | 4/4 | 4.0 | `About section` "CNN Radio correspondent, two decades in nonprofits, IBM certification, Coursera, Microsoft, SAP, Xbox" |
| Maintenance signals | 2 | 2/4 | 1.0 | `footer` "Copyright © 2025" |
| Contact and legitimacy | 4 | 2/4 (medium confidence) | 2.0 | `footer social links` "LinkedIn only"; `#contact form` "contact form is the only contact route recorded" |

## Strengths to keep

- **Category-challenging headline**: `h1` "Stop Implementing AI Tools. Start Architecting Human Performance."
- **Specific founder story**: `About section` "CNN Radio correspondent ... IBM certification"
- **Named, titled testimonials**: `testimonials` "AI Task Force Chair, Purdue Global University"
- **FAQ handles real objections**: `FAQ` "Will AI replace instructional designers?"

## Limitations

- Scored from the evidence recorded in the March 2026 manual audit; the live site was not reachable from the build environment.
- F19 and trust.pricing_transparency apply only to rubric v1 and are ignored by v2 (with a warning).
- *Technical crawl basics* scored with low confidence: HTTPS WordPress with indexable blog; canonical/sitemap were not recorded in the snapshot, so this level is a low-confidence estimate.

---
Generated by ux-audit-agent with rubric v2.0. Scores are a weighted sum of 26 criteria (levels 0-4); every finding cites the element or text it came from.
