# GovCon Signal MVP Web Conversion Plan

Issue: `GOV-18`

## Current workspace assessment

- No GovCon Signal website or landing-page implementation exists in this workspace today.
- No GovCon Signal-specific frontend app, form integration, analytics setup, brand asset pack, or CMS was found.
- Existing company context supports a newsletter-led acquisition model tied to public-safe federal market intelligence.
- Current adjacent work indicates the initial funnel should support topic segmentation across opportunity, compliance, budget, and teaming intelligence.

## Recommended MVP site structure

1. `/` or `/newsletter` — primary newsletter signup landing page for social and direct traffic
2. `/intel` — lightweight public intelligence archive/blog page for signal recirculation and SEO groundwork
3. `/premium` — premium intelligence offer page with either paid conversion or waitlist/contact CTA until pricing and fulfillment are finalized

Launch recommendation: ship the newsletter landing page first, then add the archive page, then publish the premium offer page once the paid product definition is locked.

---

- `page`: `/` or `/newsletter`
- `goal`: Convert social and direct visitors into newsletter subscribers.
- `audience`: Federal contractors, capture leaders, BD teams, consultants, and operators who want early signal on opportunities, compliance shifts, budget movement, and teaming patterns.
- `sections`:
  1. Hero with a plain-language value proposition and one email capture form
  2. "What you get" section covering weekly opportunity, compliance, budget, and teaming signals
  3. Public-safe sample insights preview using short examples from existing verified signal themes
  4. "Who it is for" section to qualify contractors, subcontractors, and GovCon advisors
  5. Trust and expectation-setting section covering cadence, tone, and no-spam/privacy reassurance
  6. Optional topic-preference selector for opportunity/compliance/budget/teaming interest capture
  7. Final CTA block with repeat signup form
- `primary_cta`: Subscribe to the weekly GovCon Signal brief.
- `supporting_elements`:
  - Headline direction: "Federal market signals for teams that need to move before the bid gets crowded."
  - Subhead direction: "Get a concise weekly brief on opportunity movement, compliance changes, budget signals, and teaming patterns shaping the GovCon market."
  - Form fields: email required, first name optional, company optional, topic interest optional
  - Social-proof placeholder: "Built from verified internal intelligence workflows" without unsupported subscriber or performance claims
  - Compliance microcopy: privacy note, unsubscribe note, and expectation of weekly cadence
- `implementation_notes`:
  - This is the single highest-priority page and should be the first shippable asset.
  - Keep one conversion action only: newsletter signup.
  - Support traffic from LinkedIn and X CTAs already being drafted in related work.
  - Add analytics events for page view, form start, form submit, and topic preference selection.
  - Add thank-you state or redirect that hands off to the welcome sequence owned by the Email Funnel Manager.

---

- `page`: `/intel`
- `goal`: Turn one-time visitors into repeat readers and create a bridge from public signals into newsletter subscription.
- `audience`: Search, social, and referral traffic evaluating whether GovCon Signal is credible and worth subscribing to.
- `sections`:
  1. Archive hero with short description of the public signal feed
  2. Featured signals list with category tags for opportunity, compliance, budget, and teaming
  3. Inline newsletter CTA block after the first few posts
  4. Category navigation or filters for topic discovery
  5. Footer CTA to subscribe for deeper weekly coverage
- `primary_cta`: Subscribe for the full weekly signal brief.
- `supporting_elements`:
  - Post template should favor concise signal summaries instead of long essays
  - Each post should include one public-safe takeaway and one CTA to subscribe
  - Category tags should align to funnel segmentation
- `implementation_notes`:
  - This page can launch as a simple index before a full CMS exists.
  - Initial content can be manually published from verified social/editorial outputs.
  - Avoid exposing premium analysis depth, named pursuit strategy, or internal sourcing detail.

---

- `page`: `/premium`
- `goal`: Present the paid intelligence offer and convert qualified subscribers into paid interest or purchase.
- `audience`: Warm newsletter subscribers, serious federal market operators, and decision-makers evaluating whether premium intelligence is worth budget allocation.
- `sections`:
  1. Offer hero focused on premium intelligence outcome, not hype
  2. "What premium includes" section covering deeper analysis, earlier warning, and more actionable context
  3. "Who it is for" qualification section
  4. Sample deliverable framing without leaking proprietary detail
  5. Pricing or access model block when finalized
  6. FAQ covering cadence, scope, and fit
  7. Final CTA block
- `primary_cta`: Join the premium waitlist.
- `supporting_elements`:
  - Use waitlist/contact CTA until product packaging, pricing, and fulfillment are approved
  - Include credibility signals from the intelligence workflow, not outcome guarantees
  - Keep copy specific about categories served, but avoid unsupported ROI claims
- `implementation_notes`:
  - This page should not go live with a direct buy CTA until pricing, payment flow, and product operations are defined.
  - Before monetization is enabled, route clicks to waitlist, contact, or "request access" flow.
  - Reuse newsletter segmentation to personalize future premium outreach.

## Copy and layout recommendations

- Lead with market awareness and decision advantage, not generic "insights" language.
- Use short, concrete headlines and avoid buzzwords like "revolutionary" or "game-changing."
- Keep page sections compact so mobile social traffic reaches the form quickly.
- Repeat the signup CTA at least twice on the newsletter page without introducing competing actions.
- Use sample insight cards to demonstrate relevance while preserving premium depth.

## Asset checklist

- Brand basics: logo, wordmark, preferred colors, typography, favicon
- Domain decision and preferred production URL structure
- Email platform/form destination
- Thank-you page or post-submit state definition
- Analytics destination and event naming conventions
- Premium product definition, packaging, and pricing decision
- Archive publishing workflow owner and content source process

## Blockers

- No existing GovCon Signal website codebase or deployment target is present in the workspace.
- Form provider, CRM/email platform, and analytics destination are not yet defined in the available context.
- Premium offer details are not yet defined enough for a direct paid conversion page.
- Social proof assets and brand identity assets are not yet available.

## Suggested build tasks

1. Create the GovCon Signal public web workspace and choose the initial routing approach.
2. Implement the newsletter landing page with one embedded signup form and analytics hooks.
3. Connect post-submit behavior to the Email Funnel Manager's welcome sequence.
4. Add a simple intelligence archive index using manually curated posts first.
5. Publish a premium waitlist page before enabling any direct checkout flow.
6. Add baseline analytics reporting for visit-to-signup conversion.

## Dependency notes

- Coordinate with the Email Funnel Manager on form fields, welcome sequence trigger, segmentation taxonomy, and thank-you page behavior.
- Coordinate with the Social Intelligence Editor on CTA language consistency between posts and landing-page hero copy.
- Coordinate with engineering on framework choice, hosting, forms, analytics, and deployment once the engineering issue is staffed.
