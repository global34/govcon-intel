export type SignalPost = {
  slug: string;
  category: "Opportunity" | "Budget" | "Compliance" | "Teaming";
  title: string;
  agency: string;
  publishedAt: string;
  summary: string;
  whyItMatters: string;
  premiumAngle: string;
};

export const signalPosts: SignalPost[] = [
  {
    slug: "va-health-it-budget-watch",
    category: "Budget",
    title: "VA digital modernization dollars are moving toward health IT execution again",
    agency: "Department of Veterans Affairs",
    publishedAt: "March 9, 2026",
    summary:
      "Budget movement and modernization language suggest downstream work for firms positioned around veteran-facing digital services, data migration, and platform support.",
    whyItMatters:
      "SDVOSBs with health IT past performance can use this signal to sharpen agency call plans before the vehicle traffic gets crowded.",
    premiumAngle:
      "Premium coverage would map likely offices, timing clues, and which contract vehicles may absorb the work.",
  },
  {
    slug: "air-force-small-business-on-ramp",
    category: "Opportunity",
    title: "Air Force small-business on-ramp chatter is increasing around platform support scopes",
    agency: "Department of the Air Force",
    publishedAt: "March 8, 2026",
    summary:
      "Source monitoring indicates likely movement around a small-business friendly access path tied to technical platform support.",
    whyItMatters:
      "Early signal matters because teaming conversations need to start before the formal opening window narrows.",
    premiumAngle:
      "Premium analysis would identify likely incumbents, probable workshare patterns, and the best SDVOSB teaming posture.",
  },
  {
    slug: "sba-certification-friction-points",
    category: "Compliance",
    title: "Certification and documentation friction is still creating avoidable bid risk for veteran-owned firms",
    agency: "Small Business Administration",
    publishedAt: "March 7, 2026",
    summary:
      "Recent policy and protest-adjacent language suggests veteran-owned firms need tighter documentation discipline before proposal volume rises.",
    whyItMatters:
      "Compliance misses kill otherwise strong pursuits. A short warning can be more valuable than a long postmortem.",
    premiumAngle:
      "Premium coverage would translate policy language into concrete bid-review checkpoints for operating teams.",
  },
  {
    slug: "prime-partner-patterns-cyber",
    category: "Teaming",
    title: "Prime-partner patterns are tightening in cyber-heavy recompete territory",
    agency: "Civilian agencies",
    publishedAt: "March 6, 2026",
    summary:
      "Relationship and scope patterns suggest a smaller pool of realistic prime partners than the market narrative implies.",
    whyItMatters:
      "Teams that focus outreach on the right partner set save cycles and avoid low-probability chasing.",
    premiumAngle:
      "Premium teaming reports would rank likely partners and explain fit, overlap, and missing capability risk.",
  },
];

export const premiumPackages = [
  {
    title: "Premium weekly briefing",
    description: "A tighter issue for operators who need more context, faster filtering, and explicit action items.",
  },
  {
    title: "Opportunity intelligence report",
    description: "Focused on likely buying motion, timing clues, and what veteran-owned teams should do next.",
  },
  {
    title: "Teaming partner report",
    description: "Maps likely primes, subcontractors, fit hypotheses, and outreach priorities for a target pursuit.",
  },
];

export const opsHighlights = [
  {
    title: "Capability registry",
    status: "2 missing, 4 in build, 9 ready",
    body: "Tracks missing infrastructure such as publishing endpoints, email integrations, and analytics hooks.",
  },
  {
    title: "Workflow monitor",
    status: "Collect -> triage -> draft -> review",
    body: "Keeps LangGraph runs visible by state, with blocked runs returning incidents into Paperclip.",
  },
  {
    title: "Growth dashboard",
    status: "Visitor -> subscriber -> paid",
    body: "Shows which public signal categories convert into email signups and paid interest.",
  },
];
