# SDVOSBNews.com Planning Blueprint

## 1. Executive Summary

SDVOSBNews.com is an AI-assisted federal contracting intelligence business for veteran-owned contractors, with emphasis on SDVOSBs and VOSBs. The company does not compete as a generic news blog. It operates as a signal detection, triage, analysis, review, and distribution system that turns fragmented federal market changes into actionable intelligence products.

The operating model is:

- Paperclip runs the company: org structure, assignments, budgets, approvals, governance, dashboards, and escalation.
- LangGraph runs the work: data collection, analysis loops, verification, report assembly, retries, interruptions, and persistent execution state.
- A VPS-hosted application stack publishes public signals, captures subscribers, supports premium intelligence delivery, and provides an internal review interface for human control.

The initial business objective is to launch a subscriber capture engine around public-safe signals, then convert that audience into paid weekly intelligence, premium opportunity reports, and teaming partner reports. The system must actively discover missing capabilities and treat them as executable work, not blockers.

## 2. Business Model

### Operating model

SDVOSBNews.com runs as a compact intelligence publisher with four operating loops:

1. Detection: collect contracting, policy, budget, and teaming signals.
2. Production: convert verified signals into public posts, subscriber alerts, and premium reports.
3. Distribution: publish to the site, email list, and social channels.
4. Monetization: convert subscribers into paid products and later sponsored placements.

### Product ladder

| Tier | Product | Buyer | Delivery | Purpose |
| --- | --- | --- | --- | --- |
| Free | Public signal posts | Broad GovCon audience | Website + social | Audience growth and trust |
| Free | Weekly email brief | Subscribers | Email | Habit formation and segmentation |
| Paid | Paid intelligence alerts | BD leads, capture teams, consultants | Email + portal | Faster signal delivery |
| Paid | Weekly premium briefing | Small/mid GovCon firms | Email/PDF + portal | Deeper analysis and action recommendations |
| Premium | Opportunity intelligence report | Pursuit teams, executives | Report + portal | Specific bid and agency opportunity analysis |
| Premium | Teaming partner intelligence report | Primes/subs | Report + portal | Likely primes, subs, fit, gaps, and partner mapping |
| Future | Sponsored placement | Relevant vendors/service providers | Website + email | Monetize reach without compromising core product |

### Monetization strategy

- Free content drives email acquisition.
- The email list is segmented by interest: opportunities, compliance, budget, teaming.
- Paid conversion begins with a low-friction premium weekly briefing and alert tier.
- High-value one-off reports monetize urgent or strategic needs.
- Sponsorship is introduced only after trust, open rates, and subscriber quality are established.

### Core economic logic

- Public content has low marginal cost and high top-of-funnel value.
- Paid weekly intelligence creates recurring revenue and validates editorial relevance.
- Premium reports create high-margin revenue from targeted analyst work.
- Sponsorship becomes additive, not foundational.

## 3. Paperclip Company Design

### Department structure

| Department | Mandate | Head |
| --- | --- | --- |
| Executive | Company direction, budget, priority, approvals | CEO |
| Intelligence | Signal detection, triage, analysis, report framing | Intelligence Officer |
| Editorial | Writing, editing, review prep, publication packaging | Briefing Writer |
| Growth | Acquisition, email, social distribution, conversion | Growth / Marketing Strategist |
| Engineering | Platform, workflows, website, internal systems | Chief Founding Engineer |
| Operations & Governance | Audit, policy, permissions, SOP enforcement | CEO initially |

### Roles

| Role | Reports to | Responsibilities | Workflow interaction | Autonomy limits |
| --- | --- | --- | --- | --- |
| CEO | None | Sets strategy, approves budgets, approves sensitive launches, defines product priorities, reviews dashboards | Creates strategic initiatives in Paperclip and approves high-risk exceptions | Cannot be bypassed for pricing changes, sponsorship approval, legal-sensitive claims, external account creation |
| Intelligence Officer | CEO | Owns signal taxonomy, source priorities, triage rules, analyst quality thresholds, premium report standards | Starts and supervises signal collection, triage, and premium report workflows | Cannot publish externally without review policy being satisfied |
| Policy Analyst | Intelligence Officer | Tracks rule changes, compliance notices, SBA/VA/FAR updates, implications for veteran-owned firms | Feeds compliance workflow nodes and annotates uncertainty | Cannot issue definitive legal guidance; must route high-risk interpretation for human review |
| Briefing Writer | Intelligence Officer | Converts verified analysis into readable signal posts, weekly briefs, and premium report drafts | Consumes structured workflow outputs and submits draft payloads into review interface | Cannot self-approve publication when uncertainty or unresolved revision requests remain |
| Growth / Marketing Strategist | CEO | Defines funnel, offer packaging, conversion targets, landing pages, channel priorities, CTA strategy | Opens campaigns and optimization tasks in Paperclip, receives metrics from workflows | Cannot change pricing or run paid outreach without budget approval |
| Social Signal Publisher | Growth / Marketing Strategist | Publishes public-safe signal summaries to LinkedIn/X, routes traffic to signup pages, manages post cadence | Triggered by approved public post workflow outputs | Cannot post unreviewed intelligence or create new external accounts without approval |
| Email Marketing Manager | Growth / Marketing Strategist | Manages signup flows, segmentation, welcome sequence, weekly sends, upsell campaigns | Consumes approved content packages and send-ready audience segments | Cannot email unapproved content or import external lists without approval |
| Chief Founding Engineer | CEO | Owns architecture, platform roadmap, capability gap resolution, deployment, observability, security | Converts capability gaps into build tasks and manages engineering execution in Paperclip | Cannot deploy destructive infra changes without change controls |
| Frontend Interface Engineer | Chief Founding Engineer | Builds public site, signup flows, premium pages, internal review UI | Implements front-end work created by Paperclip and connected to LangGraph outputs | Cannot alter business rules or data models without engineering approval |
| Backend Platform Engineer | Chief Founding Engineer | Builds APIs, workflow services, databases, integrations, publishing endpoints | Implements workflow services, review backend, CMS connectors, email and analytics integrations | Cannot grant new production permissions outside approved governance rules |

### Paperclip rules of operation

- Every strategic objective, recurring process, budget, and approval policy lives in Paperclip.
- Every agent has a budget envelope, escalation path, and approved tool scope.
- Paperclip issues assignments that are explicit about outcome, budget, deadline, and approval threshold.
- Paperclip tracks whether a task is planning, building, verification, or live operations so planning cannot be misreported as execution.

### Capability discovery inside Paperclip

Paperclip must maintain a "capability registry" with statuses:

- existing
- missing
- in design
- in build
- in verification
- ready
- blocked_pending_approval

When LangGraph detects a missing capability, it creates a structured capability-gap incident back into Paperclip. Paperclip then opens:

1. a design task,
2. one or more engineering implementation tasks,
3. a verification task,
4. a resume-original-work task once the capability becomes ready.

## 4. LangGraph Workflow Design

### Workflow design principles

- Workflows own execution only, not company management.
- Every workflow persists state per run.
- Every major node writes structured evidence, not only text.
- Any output intended for publication must pass verification and review nodes.
- Missing capabilities trigger a capability-gap subflow instead of a hard stop.

### Workflow 1: Collect Contracting Signals

**Inputs**

- Source registry
- Collection schedule
- Relevant keywords, NAICS/PSC tags, agencies, vehicles
- Existing signal history

**Outputs**

- Raw signal records with source links, timestamps, extraction notes, and confidence

**Key steps**

1. Pull from configured feeds, sites, and APIs.
2. Extract candidate items.
3. De-duplicate against recent history.
4. Score by relevance to SDVOSB/VOSB audience.
5. Store structured raw records.
6. Emit capability-gap incident if a required source connector or browser automation tool is missing.

**Stop conditions**

- Collection window exhausted
- Source batch completed
- Manual pause from Paperclip

**Failure conditions**

- Source unavailable
- Parser failure exceeds retry threshold
- Rate limiting without approved workaround

**Human interruption**

- Only if a source requires credential purchase, legal review, or anti-bot risk decision

**Verification criteria**

- Each record has source URL, capture timestamp, extractor version, and traceable raw evidence

### Workflow 2: Triage Signals

**Inputs**

- Raw signal records
- Scoring rubric
- Existing topic taxonomy

**Outputs**

- Ranked signal queue with topic labels, urgency, audience fit, and recommended product route

**Key steps**

1. Classify signals into opportunities, budget, compliance, vehicles, teaming.
2. Estimate public-safe vs premium-only suitability.
3. Score novelty, urgency, and revenue potential.
4. Route to public post, email alert, premium brief, or archive.

**Stop conditions**

- All incoming records processed

**Failure conditions**

- Confidence too low
- Conflicting classification
- Missing taxonomy or routing rules

**Human interruption**

- When classification ambiguity affects legal/commercial risk

**Verification criteria**

- Each routed item includes rationale, confidence, and intended delivery type

### Workflow 3: Generate Public Signal Posts

**Inputs**

- Triage-approved public-safe signals
- Editorial template
- CTA rules

**Outputs**

- Draft public post payload for review interface

**Key steps**

1. Convert signal into concise summary, why it matters, and one next-step takeaway.
2. Add topic tag and CTA to newsletter signup.
3. Check for prohibited disclosure or unsupported claims.
4. Submit draft to internal review interface.

**Stop conditions**

- Draft accepted by review interface

**Failure conditions**

- Source evidence insufficient
- Content exceeds public-safe boundary
- CMS endpoint missing

**Human interruption**

- Required before publication until trust thresholds and policy rules permit low-risk auto-publish

**Verification criteria**

- Draft contains source attribution, uncertainty note if needed, correct CTA, and no premium leakage

### Workflow 4: Produce Premium Intelligence Reports

**Inputs**

- High-value signals
- Historical context
- Agency and vehicle context
- Buyer segment definition

**Outputs**

- Premium weekly briefing section or standalone premium report

**Key steps**

1. Expand signal with context, implications, timing, and recommended actions.
2. Compare against prior agency behavior and procurement patterns.
3. Identify uncertainty and missing evidence.
4. Package report for review and subscriber delivery.

**Stop conditions**

- Report is approved or rejected

**Failure conditions**

- Unsupported inference
- Missing delivery mechanism
- Pricing/entitlement system absent

**Human interruption**

- Required for all premium reports in v1 and v2

**Verification criteria**

- Clear evidence chain, actionable recommendations, audience fit, and explicit uncertainty handling

### Workflow 5: Generate Teaming Partner Reports

**Inputs**

- Opportunity target
- Agency, incumbent, and contract-vehicle context
- Public contractor data and known relationship signals

**Outputs**

- Teaming partner intelligence report with likely primes, likely subs, capability gaps, and outreach priorities

**Key steps**

1. Identify likely pursuit landscape.
2. Map probable prime and subcontractor candidates.
3. Infer gaps between opportunity needs and likely contractor capabilities.
4. Produce recommended partner targets and rationale.

**Stop conditions**

- Report is approved or request is closed

**Failure conditions**

- Evidence too weak
- Opportunity context incomplete
- Restricted data source unavailable

**Human interruption**

- Required when recommendations rely on weak or sensitive inference

**Verification criteria**

- Every recommendation tied to evidence, confidence, and caveats

### Workflow 6: Internal Human Review Loop

**Inputs**

- Draft reports from generation workflows
- Reviewer comments and revision requests

**Outputs**

- Approved, needs_update, archived, or escalated content

**Key steps**

1. Create report in review backend.
2. Reviewer leaves comments or revision requests.
3. Writer/agent produces immutable revision.
4. Reviewer changes status.
5. Approved item is handed to publishing/distribution workflows.

**Stop conditions**

- Status becomes approved or archived

**Failure conditions**

- Review SLA breach
- Unresolved revision loops exceed threshold
- Reviewer assignment missing

**Human interruption**

- This workflow is the human interruption point by design

**Verification criteria**

- Audit trail exists for versions, comments, revision requests, and status history

### Workflow 7: Landing Page Creation and Update

**Inputs**

- Offer definition
- CTA strategy
- Current site capability map

**Outputs**

- Deployed landing page or capability-gap task set

**Key steps**

1. Check whether landing page, form endpoint, analytics, and thank-you state exist.
2. If missing, open capability-gap tasks in Paperclip and pause execution.
3. Once ready, generate/update copy and deploy page changes.
4. Verify page load, form submit, analytics fire, and welcome sequence trigger.

**Stop conditions**

- Page deployed and verified

**Failure conditions**

- Missing site stack
- Form integration absent
- Analytics not recording

**Human interruption**

- Required for brand, pricing, or compliance copy approval

**Verification criteria**

- Successful page render, form submission, analytics events, and email enrollment

### Workflow 8: Newsletter Distribution

**Inputs**

- Approved content package
- Subscriber segments
- Send rules and calendar

**Outputs**

- Sent newsletter, campaign metrics, and follow-up conversion tasks

**Key steps**

1. Build issue from approved items.
2. Personalize subject line and section ordering by segment where appropriate.
3. Validate links, segmentation, and unsubscribe footer.
4. Send or schedule.
5. Collect open, click, and conversion metrics.

**Stop conditions**

- Send completed and metrics recorded

**Failure conditions**

- Email provider unavailable
- Segment mapping invalid
- Required compliance footer missing

**Human interruption**

- Required before first live sends and before major segmentation changes

**Verification criteria**

- Test sends pass, final send succeeds, metrics captured, suppression/unsubscribe logic intact

### Workflow 9: Website Publishing

**Inputs**

- Approved public content
- CMS or file-based publish target

**Outputs**

- Published post and distribution event

**Key steps**

1. Transform approved report into public post format.
2. Push to site.
3. Confirm canonical URL, tag assignment, and CTA rendering.
4. Trigger social distribution task if configured.

**Stop conditions**

- Post is visible and indexed in site feed

**Failure conditions**

- CMS endpoint missing
- Publish API failure
- Rendering mismatch

**Human interruption**

- Required when the post touches sensitive policy interpretation or sponsor content

**Verification criteria**

- Live URL accessible, metadata correct, CTA visible, analytics event logged

### Workflow 10: Capability Gap Resolution

**Inputs**

- Missing capability incident from any workflow

**Outputs**

- New capability delivered and original workflow resumed

**Key steps**

1. Classify gap: tooling, integration, infrastructure, account, data, policy.
2. Determine whether buildable autonomously or approval-gated.
3. Send structured incident to Paperclip with impact and urgency.
4. Paperclip issues design/build/verify tasks.
5. Engineering completes capability.
6. Verification node tests capability.
7. Original workflow resumes from checkpoint.

**Stop conditions**

- Capability marked ready and dependent workflow resumed

**Failure conditions**

- Budget not approved
- Human approval denied
- External dependency inaccessible

**Human interruption**

- Required for new paid services, external account creation, credentials, or legal-sensitive automations

**Verification criteria**

- Capability registry updated, test evidence stored, blocked workflow resumes successfully

## 5. Paperclip ↔ LangGraph Integration Model

### Boundary definition

Paperclip decides what should happen. LangGraph performs how it happens.

### Tasks that originate in Paperclip

- Strategic objectives
- Recurring collection schedules
- Editorial priorities
- Build requests
- Capability-gap remediation tasks
- Budget approvals
- Human review assignments
- Go/no-go publication approvals

### Tasks that run in LangGraph

- Source collection
- Parsing and extraction
- Signal scoring and routing
- Draft generation
- Revision loops
- Publish/send execution
- Verification checks
- Resume after interruption

### Result flow back to Paperclip

LangGraph writes back structured status updates:

- run started
- waiting_on_capability
- waiting_on_human_review
- verification_failed
- completed
- escalated

Each update includes:

- originating task ID
- workflow run ID
- artifacts produced
- evidence links
- cost/time metrics
- next required decision, if any

### Completion verification

- Paperclip cannot mark execution complete from a planning artifact alone.
- A task is complete only when LangGraph returns verification evidence or a human approver records acceptance.
- Examples:
  - "Design landing page" completes with approved spec.
  - "Launch landing page" completes only after deployment proof and form/analytics checks.
  - "Produce premium report" completes only after approved report exists in the review system.

### Preventing planning from being marked as execution

- Paperclip task types are separated into `plan`, `build`, `operate`, `verify`, `approve`.
- Only `build`, `operate`, and `verify` tasks can satisfy live operational milestones.
- LangGraph can never self-close a `plan` task as if it delivered the production outcome.
- Dashboards must show designed vs built vs verified states separately.

## 6. Website and Product Plan

### Public website v1

1. Homepage
   - Hero for veteran-owned federal contracting intelligence
   - Email capture as primary CTA
   - Three value pillars: opportunities, compliance, teaming
   - Proof section showing sample signal cards
   - Secondary path to public signals archive
2. Signals blog
   - Short-form public-safe signal posts
   - Topic tags
   - Inline newsletter CTAs
3. Newsletter signup page
   - Focused landing page for social/direct traffic
   - Minimal fields: email, optional name, optional company, topic preference
4. Premium intelligence page
   - Premium weekly briefing offer
   - Waitlist/request access CTA at first

### Internal tools

1. Internal review interface
   - Already aligned to immutable versions, comments, revision requests, and status history
   - Used as mandatory checkpoint before publish/send actions
2. Admin operations interface
   - Source registry
   - Workflow run monitor
   - Capability registry
   - Content calendar
   - Subscriber and product dashboard summary

### Product packaging in v1

- Free: weekly newsletter and public signal archive
- Paid beta: premium weekly intelligence briefing
- Custom premium: opportunity report and teaming report via request flow

### Product packaging in v2+

- Paid alert tier with faster dispatch
- Subscriber portal with searchable archive
- Sponsor inventory management

## 7. Monetization Plan

### Free content strategy

- Publish brief, high-signal posts that answer "why should a veteran-owned contractor care now?"
- Use public posts to prove relevance, not to exhaust the analysis.
- Every public asset should drive to email capture.

### Subscriber growth strategy

- Primary channels: LinkedIn, X, direct referrals, partner referrals, SEO from public signals
- Segment signup by topic interest to improve relevance from day one
- Run a welcome sequence that explains categories, cadence, and paid offerings

### Paid intelligence offerings

- Premium weekly briefing
  - Deeper context
  - Action items
  - Earlier warning
  - Limited audience beta launch first
- Paid intelligence alerts
  - Time-sensitive signal notifications
  - Targeted to subscribers who opt into urgency

### Premium report offerings

- Opportunity intelligence report
  - Opportunity context
  - likely buying motion
  - timing clues
  - capture considerations
- Teaming partner intelligence report
  - likely primes/subs
  - partner fit
  - relationship hypotheses
  - outreach prioritization

### Sponsored placements

- Introduce only after audience fit and trust metrics are stable
- Clearly label sponsorship
- Keep sponsored content operationally separated from editorial intelligence

### Conversion funnel

1. Social/public post drives visit
2. Landing page converts to subscriber
3. Welcome sequence segments interest
4. Weekly brief builds habit
5. Premium waitlist or trial converts warm readers
6. Premium/custom reports monetize highest-intent buyers

## 8. MVP Build Order

### v1: Fast launch

Goal: launch a credible public site, capture subscribers, and support manual review-backed publishing.

- Public landing page
- Newsletter signup form
- Basic analytics
- Public signal archive
- Internal review backend and simple UI
- Manual weekly newsletter workflow
- Manual publish flow with LangGraph-assisted drafting

### v2: Revenue-ready operations

Goal: introduce paid intelligence and more reliable automation.

- Premium waitlist/request access flow
- Paid weekly briefing operations
- Subscriber segmentation and email automation
- CMS publishing integration
- Source registry and workflow monitor
- Capability-gap automation loop

### v3: Scaled intelligence platform

Goal: increase throughput, product depth, and monetization sophistication.

- Paid alert tier
- Customer portal/searchable archive
- Teaming report workflow tooling
- Sponsorship inventory and approval controls
- Deeper analytics and conversion dashboards
- More autonomous low-risk publishing for approved categories

## 9. VPS Deployment Plan

### Core stack

- Reverse proxy: Nginx or Caddy
- Public web app: Next.js or equivalent frontend
- Internal review API: FastAPI service
- Workflow workers: LangGraph worker processes
- Company layer: Paperclip service
- Database: PostgreSQL for production app data
- Review data: move SQLite MVP data model to PostgreSQL when multi-user or hosted access is required
- Queue/worker support: Redis or Postgres-backed job mechanism
- Object storage: local disk first, then S3-compatible storage for report artifacts/backups

### Production services

1. `paperclip`
   - company state, assignments, governance, dashboards
2. `langgraph-workers`
   - scheduled collection, triage, drafting, verification, resume logic
3. `web-public`
   - homepage, archive, premium pages, signup flows
4. `review-api`
   - draft/review/version/status endpoints
5. `admin-ui`
   - internal operations dashboard
6. `db`
   - Postgres
7. `cache/queue`
   - Redis

### Deployment model

- Docker Compose for MVP VPS deployment
- Daily backups for database and artifacts
- Separate internal-only routes for review/admin tools
- HTTPS everywhere
- SSO or strong auth for internal interfaces
- Structured logs and alerting for worker failures

### Data boundaries

- Public content data
- Internal draft and review data
- Subscriber/contact data
- Workflow execution state
- Capability registry and audit logs

## 10. Governance and Controls

### Actions allowed automatically

- Collect from approved sources
- Triage and score signals
- Draft public-safe and premium content
- Open review records
- Request revisions
- Update internal dashboards
- Publish approved content to already-approved channels
- Send approved newsletter campaigns using approved templates

### Actions requiring human approval

- Pricing changes
- Sponsorship acceptance
- Creation of external accounts
- New paid tool subscriptions
- Legal-sensitive policy interpretations
- Premium report release when confidence is below threshold
- Changes to source policy or risk tolerance
- Production deployment of security-sensitive infrastructure changes

### Control mechanisms

- Role-based permissions by agent and workflow
- Approval thresholds by risk class
- Immutable review history for content
- Execution logs for every workflow run
- Capability-gap incidents for any missing dependency
- Budget and spend ceilings enforced in Paperclip

### Risk policies

- No unsupported legal advice
- No fabricated agency or opportunity claims
- No automated sponsored content publishing without explicit review
- No silent failure on missing capability; every blocker becomes a tracked task or escalation

## 11. First 30 Days Plan

### Days 1-7: Foundation

- Stand up Paperclip company structure, roles, and approval policies
- Stand up VPS baseline with public app, review API, database, and worker runtime
- Finalize source taxonomy and signal categories
- Launch the homepage/newsletter landing page from the existing landing-page plan
- Verify email capture, thank-you flow, and analytics events

### Days 8-14: Content pipeline

- Configure approved initial data sources and collection schedules
- Run collection and triage workflows manually supervised
- Publish first 5 to 10 public-safe signal posts
- Run first weekly email brief manually
- Use the review interface for every piece of published content

### Days 15-21: Product validation

- Add premium page with waitlist/request access CTA
- Produce 1 sample premium weekly briefing and 1 sample opportunity report
- Interview early subscribers or prospects from the waitlist
- Tune triage scoring based on open/click/reply data

### Days 22-30: Monetization readiness

- Launch premium beta offer to a small initial cohort
- Add basic subscriber segmentation and welcome sequence
- Operationalize teaming report request intake
- Implement capability registry and gap-remediation workflow in Paperclip/LangGraph
- Review metrics:
  - visitor-to-subscriber conversion
  - newsletter open/click rates
  - top-performing signal categories
  - premium interest rate

### 30-day success criteria

- Public site live
- Subscriber capture working
- Weekly publishing cadence established
- Review loop functioning with audit trail
- At least one paid or pilot premium offer ready
- Capability-gap process proven by resolving at least one missing dependency end to end

## Recommended immediate next build sequence

1. Treat the existing landing-page plan as the v1 public acquisition spec.
2. Add a minimal frontend for the existing review backend so draft, review, approval, and revision are usable by non-technical reviewers.
3. Define the initial source registry and signal taxonomy in a production-readable format.
4. Build the first LangGraph workflow chain: collect -> triage -> draft -> review.
5. Connect approved outputs to site publishing and weekly newsletter assembly.
