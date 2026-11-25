# UX Audit Rubric v2.0

Calibrated against: The Bradbury Group manual audit (thebradburygroup.com, March 2026, 54/100).

Four categories, 26 criteria. The criterion weights sum to 100, so the overall score is the sum of points earned.

**Scoring each criterion (levels 0-4):**

- **0**: Fail: the fail sentence describes the page, or the element is missing entirely.
- **1**: Poor: mostly failing; one weak redeeming element.
- **2**: Mixed: about half right; a visitor or crawler would notice the gaps.
- **3**: Good: passes with minor, low-risk gaps.
- **4**: Pass: the pass sentence describes the page with nothing material missing.

Points = weight * level / 4. A criterion marked not applicable is dropped and its weight is shared out across the other criteria in the same category, pro rata.

**Score bands:** 85+ Excellent, 70+ Good, 55+ Needs improvement, 40+ Needs significant improvement, below 40 Critical

| Category | Weight |
|---|---:|
| UX & conversion | 30 |
| SEO | 30 |
| Content | 20 |
| Trust | 20 |

## UX & conversion (30 pts)

| ID | Criterion | Wt | Pass looks like | Fail looks like | Blocker class |
|---|---|---:|---|---|---|
| `ux.primary_cta` | Primary CTA: clear and on-site | 5 | One visually dominant primary CTA sits in the first viewport, its label names the action, and it keeps the visitor on the site. | There is no clear primary CTA in the first viewport, or the main CTA sends the visitor to another domain. | critical |
| `ux.cta_fidelity` | CTA label matches destination | 4 | Every CTA lands on content that delivers what its label promises (an assessment opens an assessment, 'Learn more about X' opens X). | Two or more CTAs lead somewhere their label does not promise, such as a contact form, an unrelated anchor or an external tool. | critical |
| `ux.conversion_path` | Conversion path and booking friction | 5 | A ready buyer can convert on-site in two steps or fewer, e.g. an embedded scheduler or a short form with an instant confirmation. | There is no on-site way to convert, or the only route is a generic contact form followed by an unstated wait. | critical |
| `ux.navigation` | Navigation and information architecture | 3 | The main nav has 7 or fewer plainly worded items, each leading to a real destination, and the current location is clear. | Nav labels are vague or jargon, items are broken or missing, or a visitor cannot find the core offers from the nav. | high |
| `ux.persuasion_flow` | Page flow and persuasion sequence | 5 | Sections run hook -> problem -> offer -> proof -> objection handling -> CTA, with a CTA placed right after the strongest proof. | Sections feel random, proof and CTAs are far apart, and objections (cost, risk, fit) are never addressed. | high |
| `ux.visual_hierarchy` | Visual hierarchy and component consistency | 3 | One consistent button system (primary/secondary/text), a clear type scale, and repeated components look and behave the same. | CTAs come in several unrelated styles, headings compete at equal weight, and similar cards use different layouts. | medium |
| `ux.responsive` | Responsive build | 2 | One fluid DOM serves every breakpoint, a viewport meta tag is set, and there is no horizontal scroll at 375px. | Content is duplicated in the DOM for mobile and desktop, the viewport meta is missing, or the page overflows on a phone. | high |
| `ux.accessibility` | Accessibility basics (WCAG 2.1 A/AA) | 3 | Images have meaningful alt text, html has a lang attribute, a skip link exists, inputs have labels and text contrast looks adequate. | Images use filenames or stock captions as alt text, form inputs are unlabeled, or content is announced twice to screen readers. | high |

## SEO (30 pts)

| ID | Criterion | Wt | Pass looks like | Fail looks like | Blocker class |
|---|---|---:|---|---|---|
| `seo.indexable_architecture` | Indexable page architecture | 7 | Each core service or offer has its own crawlable URL with unique copy, and the nav links to those URLs. | Core offers live only as #anchor sections of one page, or content is rendered only by JavaScript with no crawlable URL. | critical |
| `seo.title_meta` | Title tag and meta description | 4 | The title (under 60 chars) names the brand and the category keyword, and a unique 120-160 char meta description states the offer. | The title is missing, generic or just the brand name, or the meta description is missing. | high |
| `seo.headings` | Heading structure | 4 | Exactly one H1 holds the core keyword theme, and H2/H3s follow in a logical outline with no duplicated headings. | There is no H1, more than one H1, or headings are duplicated or used for styling rather than structure. | high |
| `seo.image_alt` | Image alt text | 4 | 90% or more of content images have descriptive, context-specific alt text, and logos carry the brand name. | Most images have empty alt text, filename alt text (1.png, IMG_123) or stock-library captions. | medium |
| `seo.structured_data` | Structured data (schema.org) | 4 | Valid JSON-LD for Organization plus the page-relevant types (Service, FAQPage, Person, Product, Article) is present. | There is no structured data at all. | medium |
| `seo.internal_linking` | Internal linking | 3 | Pages link to related service, case-study and blog pages with descriptive anchor text, and nothing important is orphaned. | Internal links are almost all #anchors, or they use non-descriptive text like 'click here' and 'learn more'. | medium |
| `seo.technical` | Technical crawl basics | 4 | HTTPS, a self-referencing canonical, robots.txt and an XML sitemap, Open Graph tags, and no noindex on public pages. | A public page is noindexed, the canonical points elsewhere, or there is no sitemap and no canonical. | high |

## Content (20 pts)

| ID | Criterion | Wt | Pass looks like | Fail looks like | Blocker class |
|---|---|---:|---|---|---|
| `content.value_prop` | Value proposition clarity | 5 | Within 5 seconds the hero says who it is for, what they get and why this provider is different. | The hero is generic or clever-but-vague, and a visitor cannot say what is sold or to whom. | high |
| `content.audience_pain` | Audience and pain articulation | 3 | The copy names the target audience's specific problems in their own language. | There is no audience or problem framing, and the page only lists features or services. | medium |
| `content.offer_specificity` | Offer specificity and engagement model | 4 | Each offer states deliverables, format and who it suits, plus a pricing or engagement-model signal (from-price, tiers, retainer or project). | Offers are one-line labels with no deliverables, and a buyer cannot self-qualify on scope or budget. | high |
| `content.proof_depth` | Proof depth (case studies) | 3 | At least one case study gives the client context, the intervention and a measurable before/after outcome. | There are no case studies, only generic claims or one-line testimonials. | high |
| `content.freshness` | Content freshness and velocity | 2 | The blog or resources have dated content from the last 90 days, published regularly. | There is no dated content, or the newest item is over 12 months old. | low |
| `content.readability_voice` | Readability and brand voice | 3 | Copy is scannable (short paragraphs, descriptive subheads, plain words) and the voice stays consistent and distinct. | Walls of text, jargon or buzzword stacks, typos, or placeholder or lorem ipsum copy. | low |

## Trust (20 pts)

| ID | Criterion | Wt | Pass looks like | Fail looks like | Blocker class |
|---|---|---:|---|---|---|
| `trust.claim_substantiation` | Claim substantiation | 5 | Every statistic or performance claim shows its source, sample or method (footnote, link or 'based on N clients'). | Bold numeric claims appear with no source, sample size or method. | high |
| `trust.social_proof` | Identifiable social proof | 5 | Testimonials carry a full name, title and organisation, and client logos are recognisable and named in alt text or captions. | Testimonials are anonymous or absent, and logos are unidentifiable (filename alt, no captions). | high |
| `trust.founder_team` | Founder and team credibility | 4 | Named people with photos, relevant credentials and verifiable history (LinkedIn, past employers, certifications). | No named people, or only stock photos and vague 'our team' copy. | medium |
| `trust.maintenance` | Maintenance signals | 2 | The copyright year is current, there are no broken links or console errors, and no placeholder or 'coming soon' content. | Outdated copyright, broken links, visible errors or placeholder sections. | medium |
| `trust.contact_legitimacy` | Contact and legitimacy | 4 | Direct contact details (email or phone, a location), privacy policy and terms are linked, and there are active social profiles beyond one channel. | Contact is only possible through a form, there is no privacy policy, and no verifiable business identity. | medium |
