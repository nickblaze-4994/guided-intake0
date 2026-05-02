import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: IntakeApp,
});

/* ============================================================
   SEED DATA
   v1 base: Company 005 (Mid-Market / Managed IT Premium tier).
   v1.1 add: Company 012 (Boutique / White Glove tier) — Segment 2.
   ============================================================ */

const RECENT_TICKETS = [
  { id: "T-100033", summary: "Enable USB Wall FAILED · SUR-64-01", site: "Site 027", category: "Security Policy", created: "2d", status: "Resolved" },
  { id: "T-100025", summary: "Enable USB Wall FAILED · SUR-8E-02", site: "Site 035", category: "Security Policy", created: "3d", status: "Resolved" },
  { id: "T-100057", summary: "Enable USB Wall FAILED · SUR-8A-02", site: "Site 033", category: "Security Policy", created: "4d", status: "Resolved" },
  { id: "T-100089", summary: "Outlook freezing for Jenna Morris", site: "Site 027", category: "Application", created: "4d", status: "Open" },
  { id: "T-100091", summary: "Enhance Security Logging FAILED", site: "Site 018", category: "Security Policy", created: "5d", status: "Resolved" },
  { id: "T-100094", summary: "Enable USB Wall FAILED · SUR-5D-02", site: "Site 023", category: "Security Policy", created: "5d", status: "Resolved" },
  { id: "T-100096", summary: "Enable USB Wall FAILED · SOO-K4-02", site: "Site 047", category: "Security Policy", created: "6d", status: "Resolved" },
  { id: "T-100098", summary: "Server Free Space < 5 GB · SOU-DC-01", site: "Site 014", category: "Server", created: "7d", status: "Resolved" },
  { id: "T-100102", summary: "Enable USB Wall FAILED · SUR-1B-01", site: "Site 002", category: "Security Policy", created: "7d", status: "Resolved" },
  { id: "T-100104", summary: "Enforce UAC FAILED", site: "Site 024", category: "Security Policy", created: "8d", status: "Resolved" },
];

const CUSTOMER_PROFILES = {
  "Company 005": {
    psa_company_id: "C-005",
    contract: "Managed IT Premium",
    tier: "Mid-Market",
    email_platform: "Microsoft 365",
    mfa_method: "Microsoft Authenticator",
    sites: 52,
    primary_contacts: ["ops@company-005.com (Operations alias)", "it@company-005.com (IT Manager: Dave Reilly)"],
    known_users: {
      "jenna.morris@company-005.com": { name: "Jenna Morris", role: "VP Finance", site: "Site 027", device: "JM-LT-019" },
      "m.chen@company-005.com": { name: "Mark Chen", role: "Senior Analyst", site: "Site 035", device: "MC-LT-042" },
      "lisa.park@company-005.com": { name: "Lisa Park", role: "Account Manager", site: "Site 027", device: "LP-LT-038" },
      "reception@company-005.com": { name: "Reception (shared mailbox)", site: "Site 027" },
      "ops@company-005.com": { name: "Operations Team alias", site: "various" },
    },
    known_assets: {
      "Site 027 reception printer": "HP LaserJet M428fdn (asset RP-027-01)",
      "Site 014 file server": "SOU-DC-01 (Windows Server 2019, 500GB)",
      "Site 027 file server": "SOU-FS-01 (Windows Server 2019)",
    },
  },
  "Company 012": {
    psa_company_id: "C-012",
    contract: "White Glove",
    tier: "Boutique",
    email_platform: "Microsoft 365",
    mfa_method: "Microsoft Authenticator",
    sites: 1,
    notes: "Boutique law firm. All named partners are VIPs — every ticket from a partner defaults to needs_review regardless of priority. Confidentiality: never include matter details in summaries.",
    primary_contacts: ["practice.manager@company-012.com (Practice Manager: Helen Voss)"],
    known_users: {
      "r.albright@company-012.com": { name: "Richard Albright", role: "Managing Partner (VIP)", site: "Main Office", device: "RA-LT-001" },
      "s.devereaux@company-012.com": { name: "Sarah Devereaux", role: "Senior Partner (VIP)", site: "Main Office", device: "SD-LT-002" },
      "practice.manager@company-012.com": { name: "Helen Voss", role: "Practice Manager", site: "Main Office" },
    },
    known_assets: {
      "Main Office file server": "C012-FS-01 (Windows Server 2022, encrypted)",
    },
  },
};

const INTAKE_QUEUE = [
  { key: "uac", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Enforce UAC FAILED", age: "1m", raw: "TW - Enforce UAC FAILED for Company 005\\Site 032\\SOU-WHS-022:241533 -" },
  { key: "usb", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Enable USB Wall FAILED", age: "3m", raw: "TW - Enable USB Wall FAILED for Company 005\\Site 048\\SUR-9C-01:267412 -" },
  { key: "backup", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Veeam Backup Job FAILED", age: "6m", raw: "TW - Veeam Backup Job FAILED for Company 005\\Site 014\\SOU-DC-01:241200 - Retention policy violation, last successful backup 72hrs ago" },
  { key: "vague", source: "email", icon: "✉", sourceMeta: "ops@company-005.com", preview: "not working again. fix it.", age: "12m", raw: "not working again. fix it." },
  { key: "diskspace", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Server Free Space < 5GB", age: "18m", raw: "TW - Server Free Space < 5GB for Company 005\\Site 027\\SOU-FS-01:198432 - Drive D: 3.2GB free of 500GB" },
  { key: "password", source: "email", icon: "✉", sourceMeta: "m.chen@company-005.com", preview: "Locked out of email after password change", age: "22m", raw: "Hi, I'm locked out of my email after the password change yesterday. Can someone reset it? I'm working from home today, not in the office. Thanks, Mark" },
  { key: "printer", source: "email", icon: "✉", sourceMeta: "reception@company-005.com", preview: "Reception printer offline since yesterday", age: "35m", raw: "The printer on the reception desk hasn't been working since yesterday afternoon. We've tried turning it off and on. Multiple staff members can't print invoices. Site 027." },
  { key: "outlook", source: "email", icon: "✉", sourceMeta: "jenna.morris@company-005.com", preview: "Outlook keeps crashing - urgent, close week", age: "47m", raw: "Hi, my Outlook has been crashing every few minutes since this morning. I've restarted my laptop twice but no luck. I'm in the middle of quarter close so this is really urgent. I'm working from the Site 027 office today. Thanks, Jenna" },
  { key: "reboot", source: "automate", icon: "◆", sourceMeta: "Automate · monitoring", preview: "TW - Pending Reboot > 7 days", age: "1h", raw: "TW - Pending Reboot > 7 days for Company 005\\Site 035\\SUR-LT-08:267123 - Last reboot 12 days ago, security patches pending" },
  { key: "mfa", source: "email", icon: "✉", sourceMeta: "lisa.park@company-005.com", preview: "Got new phone, can't log into anything", age: "1h", raw: "I got a new phone yesterday and now I can't log into anything. The Microsoft Authenticator app is on my old phone. What do I do? I really need access to email today." },

  // ----- Segment 2: Boutique / White Glove (Company 012) -----
  { key: "vip-laptop", source: "email", icon: "✉", sourceMeta: "r.albright@company-012.com", preview: "Laptop very slow, court hearing tomorrow", age: "8m", raw: "My laptop has become extremely slow over the last two days. Spinning beach ball every time I open a Word document. I have a court hearing tomorrow morning at 9am and I need this resolved tonight. — Richard Albright, Managing Partner" },
  { key: "vip-mfa-travel", source: "email", icon: "✉", sourceMeta: "s.devereaux@company-012.com", preview: "Traveling to London Mon — pre-stage MFA", age: "32m", raw: "Hi team, I'm flying to London Monday for a two-week arbitration. Can you make sure my MFA, VPN, and email all work from international IPs before I leave? Last time I traveled I got locked out of email for half a day. — Sarah Devereaux" },
  { key: "vip-confidential", source: "email", icon: "✉", sourceMeta: "practice.manager@company-012.com", preview: "Need secure file share for matter (sensitive)", age: "55m", raw: "We have an incoming matter that requires a secure document exchange with outside counsel. Please set up an encrypted share — partners-only access. I'll send the matter details separately, do not include them in the ticket. — Helen" },
];

const TECHS_BY_BOARD: Record<string, string[]> = {
  "Service Desk": ["Sarah Chen", "Mike Patel"],
  "Managed Service Alerts": ["Carlos Rivera", "Dave Reilly"],
  "Network Alerts": ["Carlos Rivera"],
  "Backups": ["Dave Reilly"],
  "Recurring (Proactive)": ["Mike Patel"],
  "VIP Desk": ["Dave Reilly"],
};
const pickTech = (board: string, index: number) => {
  const pool = TECHS_BY_BOARD[board] || ["Sarah Chen"];
  return pool[index % pool.length];
};

const SYSTEM_PROMPT = `You are an AI ticket intake assistant for an MSP using a ConnectWise-style PSA.
You auto-create and auto-route most tickets without human review. The dispatcher only sees exceptions.

The MSP serves TWO customer segments:
 1. Mid-Market (Managed IT Premium) — high RMM volume, multi-site, cost-sensitive.
 2. Boutique (White Glove) — small headcount, named-partner VIPs, confidentiality-critical, white-glove SLAs.

Available categories: Hardware, Application, Network, Server, Security Policy, Backup, Performance, Account/Access, Request, Incident
Available priorities: P1-Critical, P2-High, P3-Medium, P4-Low
Available boards: Service Desk, Managed Service Alerts, Network Alerts, Backups, Recurring (Proactive), VIP Desk

Customer profile data MSPbots maintains. Use this to ENRICH fields silently. Never ask about anything in this profile:
${JSON.stringify(CUSTOMER_PROFILES, null, 2)}

Recent tickets in the PSA (last 7 days) for duplicate detection:
${JSON.stringify(RECENT_TICKETS, null, 2)}

ROUTING DECISION (the most important field, choose ONE):
- "auto_route": Default. Use when input is clear, all field confidence is HIGH, no duplicate pattern detected, AND priority is P3-Medium or P4-Low, AND the customer's contract is NOT "White Glove". Most routine RMM alerts and clear support emails.
- "needs_review": Use when ANY of: priority is P1-Critical or P2-High, OR a duplicate pattern was detected (5+ matching tickets), OR any field confidence is "medium" or "low", OR the customer's contract tier is "White Glove" (every White Glove ticket gets human eyes regardless of priority).
- "needs_input": Use when input is so ambiguous a meaningful ticket can't be created without more info ("not working" with no specifics).

Segment-specific routing:
- White Glove tickets should be routed to the "VIP Desk" board.
- Mid-Market RMM alerts go to "Managed Service Alerts"; user-reported issues go to "Service Desk".

Confidentiality rule for Boutique/White Glove: NEVER include matter details, client names, or case specifics in the summary. Use generic phrasing like "secure file share request" or "VPN access for travel".

Rules:
- Always populate every field if you can infer it. Use customer profile to enrich silently.
- Generate clarifying_questions ONLY for needs_input cases. Maximum 2 questions. Never ask about info in the profile.
- field_confidence reflects genuine uncertainty. Default to "high".
- field_reasoning: 6-8 words plain English per field. Examples: "parsed: Site 032 from path", "profile: Jenna's office", "urgent + close week → P2", "White Glove: VIP human review".
- routing_reason: 4-8 words explaining the routing decision. Examples: "high confidence, routine alert", "P2 urgency, human approval", "White Glove tier, VIP review", "duplicate of 7 recent tickets".

Return ONLY a JSON object, no preamble, no markdown, no code fences. Schema:
{
  "summary": string,
  "category": string,
  "sub_category": string,
  "priority": string,
  "board": string,
  "company": string,
  "site": string | null,
  "device": string | null,
  "contact_email": string | null,
  "contract_tier": string | null,
  "clarifying_questions": string[],
  "duplicate_check": {
    "is_likely_duplicate": boolean,
    "matched_ticket_ids": string[],
    "pattern_count": number,
    "recommendation": "merge" | "link to pattern" | "process as new"
  },
  "field_confidence": {
    "summary": "high" | "medium" | "low",
    "category": "high" | "medium" | "low",
    "priority": "high" | "medium" | "low"
  },
  "field_reasoning": {
    "summary": string | null, "category": string | null, "sub_category": string | null,
    "priority": string | null, "board": string | null, "company": string | null,
    "site": string | null, "device": string | null, "contact_email": string | null
  },
  "routing_decision": "auto_route" | "needs_review" | "needs_input",
  "routing_reason": string
}`;

/* ============================================================
   MOCK AI RESULTS
   Replaces the live model call so the prototype runs offline and
   ships cleanly to Vercel without crossing the client/server line.
   Distribution: 6 auto_route, 5 needs_review, 2 needs_input.
   Two needs_review are White Glove → VIP Desk (Boutique tier).
   ============================================================ */

const MOCK_AI_RESULTS: Record<string, any> = {
  uac: {
    summary: "Enforce UAC FAILED · SOU-WHS-022",
    category: "Security Policy", sub_category: "UAC Enforcement",
    priority: "P3-Medium", board: "Managed Service Alerts",
    company: "Company 005", site: "Site 032", device: "SOU-WHS-022", contact_email: null,
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 1, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed from alert payload", category: "UAC → Security Policy", sub_category: null,
      priority: "routine policy alert → P3", board: "Automate alerts → MSA",
      company: "parsed: Company 005", site: "parsed: Site 032 from path", device: "parsed: SOU-WHS-022", contact_email: null,
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, routine alert",
  },
  usb: {
    summary: "Enable USB Wall FAILED · SUR-9C-01",
    category: "Security Policy", sub_category: "USB Wall",
    priority: "P3-Medium", board: "Managed Service Alerts",
    company: "Company 005", site: "Site 048", device: "SUR-9C-01", contact_email: null,
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: {
      is_likely_duplicate: true,
      matched_ticket_ids: ["T-100033", "T-100025", "T-100057", "T-100094", "T-100096", "T-100102"],
      pattern_count: 6,
      recommendation: "link to pattern",
    },
    field_confidence: { summary: "high", category: "high", priority: "medium" },
    field_reasoning: {
      summary: "parsed from alert payload", category: "USB → Security Policy", sub_category: null,
      priority: "duplicate pattern → escalate to human", board: "Automate alerts → MSA",
      company: "parsed: Company 005", site: "parsed: Site 048 from path", device: "parsed: SUR-9C-01", contact_email: null,
    },
    routing_decision: "needs_review",
    routing_reason: "duplicate of 6 recent tickets",
  },
  backup: {
    summary: "Veeam Backup Job FAILED · SOU-DC-01 · 72hrs since last success",
    category: "Backup", sub_category: "Veeam",
    priority: "P2-High", board: "Backups",
    company: "Company 005", site: "Site 014", device: "SOU-DC-01", contact_email: null,
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed alert + retention details", category: "Veeam → Backup", sub_category: null,
      priority: "72hr retention breach → P2", board: "Backup alerts → Backups board",
      company: "parsed: Company 005", site: "parsed: Site 014", device: "profile: Site 014 file server", contact_email: null,
    },
    routing_decision: "needs_review",
    routing_reason: "P2 urgency, human approval",
  },
  vague: {
    summary: "Vague request from ops alias — needs context",
    category: "Incident", sub_category: null,
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: null, device: null, contact_email: "ops@company-005.com",
    contract_tier: "Managed IT Premium",
    clarifying_questions: [
      "Which system or device isn't working?",
      "Who's affected and which site are they at?",
    ],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "low", category: "low", priority: "medium" },
    field_reasoning: {
      summary: "no specifics in body", category: "no signal — fallback Incident", sub_category: null,
      priority: "default until clarified", board: "inbound email → Service Desk",
      company: "matched email domain", site: null, device: null, contact_email: "alias on file",
    },
    routing_decision: "needs_input",
    routing_reason: "input too vague to classify",
  },
  diskspace: {
    summary: "Server Free Space < 5 GB · SOU-FS-01 · D: 3.2 GB",
    category: "Server", sub_category: "Disk Space",
    priority: "P3-Medium", board: "Managed Service Alerts",
    company: "Company 005", site: "Site 027", device: "SOU-FS-01", contact_email: null,
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed alert + free-space details", category: "disk space → Server", sub_category: null,
      priority: "above critical threshold → P3", board: "Automate alerts → MSA",
      company: "parsed: Company 005", site: "parsed: Site 027", device: "profile: Site 027 file server", contact_email: null,
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, routine alert",
  },
  password: {
    summary: "Email lockout after password change — Mark Chen",
    category: "Account/Access", sub_category: "Password Reset",
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: "Site 035", device: "MC-LT-042", contact_email: "m.chen@company-005.com",
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "Mark says locked out post-change", category: "password reset → Account/Access", sub_category: null,
      priority: "single user access → P3", board: "inbound email → Service Desk",
      company: "matched email domain", site: "profile: Mark at Site 035", device: "profile: Mark's laptop", contact_email: "from email header",
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, profile-enriched",
  },
  printer: {
    summary: "Reception printer offline — Site 027",
    category: "Hardware", sub_category: "Printer",
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: "Site 027", device: "RP-027-01", contact_email: "reception@company-005.com",
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "reception printer down, multi-user impact", category: "printer offline → Hardware", sub_category: null,
      priority: "shared device, no workaround → P3", board: "inbound email → Service Desk",
      company: "matched email domain", site: "stated in body: Site 027", device: "profile: HP LaserJet M428fdn", contact_email: "from email header",
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, profile-enriched",
  },
  outlook: {
    summary: "Outlook crashing every few minutes — Jenna Morris",
    category: "Application", sub_category: "Outlook",
    priority: "P2-High", board: "Service Desk",
    company: "Company 005", site: "Site 027", device: "JM-LT-019", contact_email: "jenna.morris@company-005.com",
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "Jenna reports repeated crashes despite restart", category: "Outlook → Application", sub_category: null,
      priority: "urgent + close-week impact → P2", board: "inbound email → Service Desk",
      company: "matched email domain", site: "profile: Jenna at Site 027", device: "profile: Jenna's laptop", contact_email: "from email header",
    },
    routing_decision: "needs_review",
    routing_reason: "P2 urgency, human approval",
  },
  reboot: {
    summary: "Pending Reboot > 7 days · SUR-LT-08 · 12 days",
    category: "Security Policy", sub_category: "Patch Management",
    priority: "P4-Low", board: "Recurring (Proactive)",
    company: "Company 005", site: "Site 035", device: "SUR-LT-08", contact_email: null,
    contract_tier: "Managed IT Premium",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "parsed alert + last-reboot details", category: "patch reboot → Security Policy", sub_category: null,
      priority: "non-urgent maintenance → P4", board: "proactive recurring → Recurring (Proactive)",
      company: "parsed: Company 005", site: "parsed: Site 035", device: "parsed: SUR-LT-08", contact_email: null,
    },
    routing_decision: "auto_route",
    routing_reason: "high confidence, routine alert",
  },
  mfa: {
    summary: "MFA reset — Lisa Park got new phone",
    category: "Account/Access", sub_category: "MFA Reset",
    priority: "P3-Medium", board: "Service Desk",
    company: "Company 005", site: "Site 027", device: "LP-LT-038", contact_email: "lisa.park@company-005.com",
    contract_tier: "Managed IT Premium",
    clarifying_questions: [
      "Do you still have access to your old phone, or has it been wiped?",
      "Can we verify your identity via a callback to a number on file?",
    ],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "medium" },
    field_reasoning: {
      summary: "Lisa's authenticator on old phone", category: "MFA → Account/Access", sub_category: null,
      priority: "single user, urgent same-day → P3", board: "inbound email → Service Desk",
      company: "matched email domain", site: "profile: Lisa at Site 027", device: "profile: Lisa's laptop", contact_email: "from email header",
    },
    routing_decision: "needs_input",
    routing_reason: "identity verification required",
  },
  "vip-laptop": {
    summary: "VIP laptop performance issue — pre-court urgency",
    category: "Performance", sub_category: "Laptop",
    priority: "P2-High", board: "VIP Desk",
    company: "Company 012", site: "Main Office", device: "RA-LT-001", contact_email: "r.albright@company-012.com",
    contract_tier: "White Glove",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "high" },
    field_reasoning: {
      summary: "VIP partner, generic phrasing per confidentiality rule", category: "slow laptop → Performance", sub_category: null,
      priority: "VIP + same-day deadline → P2", board: "White Glove → VIP Desk",
      company: "matched email domain", site: "profile: Main Office", device: "profile: Richard's laptop", contact_email: "from email header",
    },
    routing_decision: "needs_review",
    routing_reason: "White Glove tier, VIP review",
  },
  "vip-mfa-travel": {
    summary: "Pre-stage MFA, VPN, email for international travel",
    category: "Request", sub_category: "Travel Access",
    priority: "P3-Medium", board: "VIP Desk",
    company: "Company 012", site: "Main Office", device: "SD-LT-002", contact_email: "s.devereaux@company-012.com",
    contract_tier: "White Glove",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "medium" },
    field_reasoning: {
      summary: "VIP partner, travel access pre-stage", category: "scheduled access change → Request", sub_category: null,
      priority: "scheduled, no immediate impact → P3", board: "White Glove → VIP Desk",
      company: "matched email domain", site: "profile: Main Office", device: "profile: Sarah's laptop", contact_email: "from email header",
    },
    routing_decision: "needs_review",
    routing_reason: "White Glove tier, VIP review",
  },
  "vip-confidential": {
    summary: "Secure file share request — partners-only access",
    category: "Request", sub_category: "Secure File Share",
    priority: "P3-Medium", board: "VIP Desk",
    company: "Company 012", site: "Main Office", device: null, contact_email: "practice.manager@company-012.com",
    contract_tier: "White Glove",
    clarifying_questions: [],
    duplicate_check: { is_likely_duplicate: false, matched_ticket_ids: [], pattern_count: 0, recommendation: "process as new" },
    field_confidence: { summary: "high", category: "high", priority: "medium" },
    field_reasoning: {
      summary: "generic per confidentiality rule, no matter detail", category: "encrypted share setup → Request", sub_category: null,
      priority: "scheduled setup, partners-only → P3", board: "White Glove → VIP Desk",
      company: "matched email domain", site: "profile: Main Office", device: null, contact_email: "from email header",
    },
    routing_decision: "needs_review",
    routing_reason: "White Glove tier, VIP review",
  },
};

const fetchMockResult = (key: string): Promise<any> =>
  new Promise((resolve) => {
    const delay = 80 + Math.floor(Math.random() * 120);
    setTimeout(() => resolve(MOCK_AI_RESULTS[key]), delay);
  });

/* ============================================================
   UI HELPERS
   ============================================================ */

const AIIndicator = ({ confidence }: { confidence?: string }) => {
  if (!confidence || confidence === "high") return null;
  const color = confidence === "medium" ? "bg-amber-400" : "bg-rose-400";
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1.5 ${color}`} title={`AI confidence: ${confidence}`} />;
};

const TierPill = ({ tier }: { tier?: string | null }) => {
  if (!tier) return null;
  const isVIP = tier === "White Glove" || tier === "Boutique";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded uppercase tracking-wider ${
        isVIP
          ? "bg-amber-100 text-amber-900 border border-amber-300"
          : "bg-neutral-100 text-neutral-700 border border-neutral-300"
      }`}
    >
      {isVIP ? "★ White Glove" : tier}
    </span>
  );
};

type FieldProps = {
  label: string;
  value?: string | null;
  onChange?: (v: string) => void;
  confidence?: string;
  reason?: string | null;
  readOnly?: boolean;
};
const Field = ({ label, value, onChange, confidence, reason, readOnly }: FieldProps) => (
  <div>
    <div className="flex items-center text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
      {label}
      <AIIndicator confidence={confidence} />
    </div>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange && onChange(e.target.value)}
      readOnly={readOnly}
      placeholder="—"
      className={`w-full text-sm text-neutral-900 bg-transparent border-0 border-b border-neutral-200 ${readOnly ? "" : "hover:border-neutral-400 focus:border-neutral-900"} focus:outline-none transition-colors py-1`}
    />
    {reason && <p className="mt-1 text-xs text-neutral-400 leading-tight normal-case tracking-normal">{reason}</p>}
  </div>
);

const formatRelative = (ts: number) => {
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 30) return "just now";
  if (diffSec < 60) return "30s ago";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

type SegmentFilter = "all" | "midmarket" | "boutique";

const inferSegment = (item: any): SegmentFilter => {
  const tier = item.ai?.contract_tier;
  if (tier === "White Glove" || tier === "Boutique") return "boutique";
  if (tier) return "midmarket";
  // Fallback by source meta / raw text before AI returns
  const blob = `${item.sourceMeta} ${item.raw}`.toLowerCase();
  if (blob.includes("company-012") || blob.includes("company 012")) return "boutique";
  return "midmarket";
};

function IntakeApp() {
  const [items, setItems] = useState<any[]>(
    INTAKE_QUEUE.map((item, idx) => ({ ...item, ai: null, bucket: null, idx, edits: null, ts: null }))
  );
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [stage, setStage] = useState<"loading" | "viewing">("loading");
  const [, setError] = useState<string | null>(null);
  const [edits, setEdits] = useState<any>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>("all");
  const [, setTick] = useState(0);

  const startedRef = useRef(false);

  const matchesSegment = (i: any) => segmentFilter === "all" || inferSegment(i) === segmentFilter;

  const attention = items.filter((i) => i.bucket === "attention" && matchesSegment(i));
  const routed = items
    .filter((i) => i.bucket === "routed" && matchesSegment(i))
    .sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const processedCount = items.filter((i) => i.bucket).length;
  const allDone = items.every((i) => i.bucket);

  const active = items.find((i) => i.key === activeKey);

  const processItem = async (item: any) => {
    try {
      const parsed = await fetchMockResult(item.key);
      if (!parsed) throw new Error("no mock result for key");
      const bucket = parsed.routing_decision === "auto_route" ? "routed" : "attention";
      const tech = pickTech(parsed.board, item.idx);
      const newId = `T-${100247 + item.idx}`;

      setItems((prev) =>
        prev.map((it) =>
          it.key === item.key
            ? {
                ...it,
                ai: parsed,
                bucket,
                ts: bucket === "routed" ? Date.now() : null,
                ticketId: bucket === "routed" ? newId : null,
                tech: bucket === "routed" ? tech : null,
              }
            : it
        )
      );
    } catch (e: any) {
      setError(`${item.key}: ${e.message}`);
      setItems((prev) =>
        prev.map((it) => (it.key === item.key ? { ...it, bucket: "attention", ai: null, errored: true } : it))
      );
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const queue = [...INTAKE_QUEUE];
    const concurrency = 2;
    const runWorker = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (item) await processItem(item);
      }
    };
    Promise.all(Array(concurrency).fill(null).map(runWorker));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (allDone && stage === "loading") {
      setStage("viewing");
      const firstAttention = items.find((i) => i.bucket === "attention");
      if (firstAttention) selectItem(firstAttention.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, stage]);

  const selectItem = (key: string) => {
    const item = items.find((i) => i.key === key);
    if (!item) return;
    setActiveKey(key);
    setSubmittedId(null);
    if (item.ai) {
      setEdits({
        summary: item.edits?.summary ?? item.ai.summary,
        category: item.edits?.category ?? item.ai.category,
        sub_category: item.edits?.sub_category ?? item.ai.sub_category,
        priority: item.edits?.priority ?? item.ai.priority,
        board: item.edits?.board ?? item.ai.board,
        company: item.edits?.company ?? item.ai.company,
        site: item.edits?.site ?? item.ai.site,
        device: item.edits?.device ?? item.ai.device,
        contact_email: item.edits?.contact_email ?? item.ai.contact_email,
      });
    }
  };

  const updateEdit = (field: string, value: string) => setEdits((prev: any) => ({ ...prev, [field]: value }));

  const submitAttention = (linkedToTicketId: string | null = null) => {
    const item = items.find((i) => i.key === activeKey);
    if (!item) return;
    const newId = `T-${100247 + item.idx}`;
    const tech = pickTech(edits.board, item.idx);
    setSubmittedId(newId);

    setItems((prev) =>
      prev.map((it) =>
        it.key === activeKey
          ? {
              ...it,
              bucket: "routed",
              edits,
              ticketId: newId,
              tech,
              ts: Date.now(),
              linkedTo: linkedToTicketId,
              humanReviewed: true,
            }
          : it
      )
    );

    setTimeout(() => {
      setSubmittedId(null);
      const nextAttention = items.find((i) => i.bucket === "attention" && i.key !== activeKey);
      if (nextAttention) selectItem(nextAttention.key);
      else setActiveKey(null);
    }, 1500);
  };

  const handleLinkToPattern = () => {
    const matched = active?.ai?.duplicate_check?.matched_ticket_ids?.[0];
    if (matched) submitAttention(matched);
  };

  const reset = () => {
    startedRef.current = false;
    setItems(INTAKE_QUEUE.map((item, idx) => ({ ...item, ai: null, bucket: null, idx, edits: null, ts: null })));
    setActiveKey(null);
    setStage("loading");
    setError(null);
    setEdits({});
    setSubmittedId(null);
    setTimeout(() => {
      startedRef.current = true;
      INTAKE_QUEUE.forEach((item) => processItem(item));
    }, 100);
  };

  const matchedTicketIds = active?.ai?.duplicate_check?.matched_ticket_ids || [];
  const reasoning = active?.ai?.field_reasoning || {};
  const isAutoRouted = active?.bucket === "routed" && !active?.humanReviewed;
  const activeTier = active?.ai?.contract_tier;

  const segCount = (s: SegmentFilter) =>
    s === "all" ? items.length : items.filter((i) => inferSegment(i) === s).length;

  return (
    <div
      className="h-screen flex flex-col bg-neutral-100 antialiased text-neutral-900"
      style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 flex-shrink-0">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-neutral-900 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="text-sm font-medium">MSPbots</span>
            <span className="text-neutral-300">/</span>
            <span className="text-sm text-neutral-600">Intake</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            {stage === "loading" ? (
              <span className="text-neutral-500">
                Processing intake · <span className="text-neutral-900 font-medium">{processedCount}</span>/{items.length}
              </span>
            ) : (
              <>
                <span className="text-neutral-500">
                  <span className="text-neutral-900 font-medium">{attention.length}</span> need attention
                </span>
                <span className="text-neutral-500">
                  <span className="text-neutral-900 font-medium">{routed.length}</span> auto-routed
                </span>
              </>
            )}
            <button onClick={reset} className="text-neutral-400 hover:text-neutral-900" title="Reset">↻</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 border-r border-neutral-200 bg-white flex flex-col">
          {/* Segment filter */}
          <div className="px-3 py-2 border-b border-neutral-100 flex-shrink-0">
            <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5 px-1">Segment</div>
            <div className="flex gap-1">
              {([
                { id: "all", label: "All" },
                { id: "midmarket", label: "Mid-Market" },
                { id: "boutique", label: "★ Boutique" },
              ] as { id: SegmentFilter; label: string }[]).map((s) => {
                const active = segmentFilter === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSegmentFilter(s.id)}
                    className={`flex-1 px-2 py-1 text-[11px] rounded transition-colors ${
                      active
                        ? s.id === "boutique"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-neutral-900 text-white"
                        : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-transparent"
                    }`}
                  >
                    {s.label}
                    <span className={`ml-1 ${active ? "" : "text-neutral-400"}`}>{segCount(s.id)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Needs attention */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Needs your attention</span>
              <span className="text-xs text-neutral-400">{attention.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {stage === "loading" && attention.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <div className="w-4 h-4 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-neutral-400">Sorting incoming…</p>
                </div>
              )}
              {stage === "viewing" && attention.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium">All clear</p>
                  <p className="text-xs text-neutral-400 mt-0.5">AI handling new tickets in background</p>
                </div>
              )}
              {attention.map((item) => {
                const isActive = item.key === activeKey;
                const reasonShort = item.ai?.routing_reason || "needs review";
                const tier = item.ai?.contract_tier;
                const isVIP = tier === "White Glove" || tier === "Boutique";
                return (
                  <button
                    key={item.key}
                    onClick={() => selectItem(item.key)}
                    className={`w-full text-left px-4 py-3 border-b border-neutral-100 transition-all ${
                      isActive
                        ? "bg-neutral-50 border-l-2 border-l-neutral-900"
                        : "hover:bg-neutral-50 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`text-sm mt-0.5 ${isVIP ? "text-amber-600" : isActive ? "text-neutral-700" : "text-neutral-400"}`}>
                        {isVIP ? "★" : item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-xs font-medium truncate ${isActive ? "text-neutral-900" : "text-neutral-700"}`}>
                            {item.sourceMeta}
                          </span>
                          <span className="text-xs text-neutral-400 flex-shrink-0">{item.age}</span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-snug truncate mb-1">{item.preview}</p>
                        <p className={`text-xs leading-tight ${isVIP ? "text-amber-700" : "text-amber-700"}`}>{reasonShort}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto-routed */}
          <div className="border-t-2 border-neutral-200 flex flex-col flex-shrink-0" style={{ maxHeight: "45%" }}>
            <div className="px-4 py-3 border-b border-neutral-100 flex-shrink-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto-routed</span>
                <span className="text-xs text-neutral-400">{routed.length}</span>
              </div>
              <p className="text-xs text-neutral-400">via Next Ticket Manager</p>
            </div>
            <div className="overflow-y-auto">
              {routed.length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-neutral-400">{stage === "loading" ? "Sorting…" : "Nothing yet"}</p>
                </div>
              )}
              {routed.map((r) => {
                const isActive = r.key === activeKey;
                return (
                  <button
                    key={r.key}
                    onClick={() => selectItem(r.key)}
                    className={`w-full text-left px-4 py-2.5 border-b border-neutral-100 transition-all ${
                      isActive ? "bg-neutral-50 border-l-2 border-l-neutral-900" : "hover:bg-neutral-50 border-l-2 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-mono text-neutral-500 font-medium">{r.ticketId}</span>
                      <span className="text-xs text-neutral-400">{r.ts ? formatRelative(r.ts) : ""}</span>
                    </div>
                    <p className="text-xs text-neutral-800 leading-snug truncate mb-1">{r.ai?.summary || r.preview}</p>
                    {r.linkedTo ? (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-neutral-400">↗</span>
                        <span className="text-neutral-500">linked to {r.linkedTo}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 truncate">→ {r.tech}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Detail */}
        <section className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="p-6">
            {!active && stage === "loading" && (
              <div className="max-w-md mx-auto pt-16 text-center">
                <div className="w-10 h-10 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-neutral-600">Classifying {items.length} incoming items…</p>
                <p className="text-xs text-neutral-400 mt-1">{processedCount} done</p>
              </div>
            )}

            {stage === "viewing" && !active && attention.length === 0 && (
              <div className="max-w-md mx-auto pt-16 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-600 text-xl">✓</span>
                </div>
                <p className="text-base font-medium text-neutral-900 mb-1">All caught up</p>
                <p className="text-sm text-neutral-500 mb-2">
                  {routed.length} ticket{routed.length === 1 ? "" : "s"} routed.{" "}
                  {items.filter((i) => i.humanReviewed).length} reviewed by you,{" "}
                  {items.filter((i) => !i.humanReviewed && i.bucket === "routed").length} auto-routed by AI.
                </p>
                <p className="text-xs text-neutral-400 mb-6">AI is handling new incoming tickets in the background.</p>
                <button onClick={reset} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
                  Reset
                </button>
              </div>
            )}

            {active && active.ai && (
              <div className="max-w-2xl mx-auto">
                {active.bucket === "attention" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-3 flex items-center gap-2">
                    <span className="text-amber-600 text-sm">⚠</span>
                    <p className="text-sm text-amber-900">
                      <span className="font-medium">Why you're seeing this:</span> {active.ai.routing_reason}
                    </p>
                  </div>
                )}
                {isAutoRouted && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-3 flex items-center gap-2">
                    <span className="text-emerald-600 text-sm">✓</span>
                    <p className="text-sm text-emerald-900">
                      <span className="font-medium">Auto-routed by AI:</span> {active.ai.routing_reason}
                      <span className="text-emerald-700"> · {active.ticketId} → {active.tech}</span>
                    </p>
                  </div>
                )}
                {active.bucket === "routed" && active.humanReviewed && (
                  <div className="bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-2.5 mb-3 flex items-center gap-2">
                    <span className="text-neutral-500 text-sm">✓</span>
                    <p className="text-sm text-neutral-700">
                      <span className="font-medium">Reviewed and routed:</span> {active.ticketId} →{" "}
                      {active.linkedTo ? `linked to ${active.linkedTo}` : active.tech}
                    </p>
                  </div>
                )}

                {/* Source */}
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden mb-3">
                  <div className="px-4 py-2 flex items-center gap-3 border-b border-neutral-100">
                    <span className="text-neutral-400 text-sm">{active.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <span className="text-neutral-500">{active.source === "email" ? "Email from" : "Alert from"}</span>
                        <span className="text-neutral-900 font-medium truncate">{active.sourceMeta}</span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-neutral-400">{active.age} ago</span>
                        {activeTier && (
                          <>
                            <span className="text-neutral-300">·</span>
                            <TierPill tier={activeTier} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 font-mono text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed bg-neutral-50">
                    {active.raw}
                  </div>
                </div>

                {/* Ticket card */}
                <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                  {submittedId && (
                    <div className="p-12 text-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-emerald-600 text-lg">✓</span>
                      </div>
                      <p className="text-sm text-neutral-900 font-medium mb-1">Ticket {submittedId} created</p>
                      <p className="text-xs text-neutral-500">Routing via Next Ticket Manager…</p>
                    </div>
                  )}

                  {!submittedId && (
                    <>
                      {active.bucket === "attention" && active.ai.duplicate_check?.is_likely_duplicate && (
                        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <p className="text-sm text-amber-900">
                              <span className="font-medium">Looks like {active.ai.duplicate_check.pattern_count} similar recent tickets.</span>{" "}
                              Submit as new or link to the pattern.
                            </p>
                            <button
                              onClick={handleLinkToPattern}
                              className="text-xs px-2 py-1 bg-white border border-amber-300 rounded text-amber-900 hover:bg-amber-50 whitespace-nowrap font-medium"
                            >
                              Link to pattern
                            </button>
                          </div>
                          <div className="space-y-1 pt-3 border-t border-amber-200">
                            {RECENT_TICKETS.filter((t) => matchedTicketIds.includes(t.id))
                              .slice(0, 6)
                              .map((t) => (
                                <div key={t.id} className="flex items-center gap-2 text-xs">
                                  <span className="font-mono text-amber-700">{t.id}</span>
                                  <span className="text-amber-900 truncate">{t.summary}</span>
                                  <span className="text-amber-600 flex-shrink-0">· {t.site}</span>
                                </div>
                              ))}
                            {matchedTicketIds.length > 6 && (
                              <div className="text-xs text-amber-700 pt-1">+ {matchedTicketIds.length - 6} more</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="px-5 pt-5 pb-4">
                        <div className="flex items-center text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                          Summary
                          <AIIndicator confidence={active.ai.field_confidence?.summary} />
                        </div>
                        <input
                          type="text"
                          value={edits.summary || ""}
                          onChange={(e) => updateEdit("summary", e.target.value)}
                          readOnly={active.bucket === "routed"}
                          className="w-full text-base text-neutral-900 bg-transparent border-0 focus:outline-none font-medium"
                        />
                        {reasoning.summary && <p className="mt-1 text-xs text-neutral-400 leading-tight">{reasoning.summary}</p>}
                      </div>

                      <div className="px-5 pb-5 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-neutral-100 pt-5">
                        <Field label="Category" value={edits.category} onChange={(v) => updateEdit("category", v)} confidence={active.ai.field_confidence?.category} reason={reasoning.category} readOnly={active.bucket === "routed"} />
                        <Field label="Priority" value={edits.priority} onChange={(v) => updateEdit("priority", v)} confidence={active.ai.field_confidence?.priority} reason={reasoning.priority} readOnly={active.bucket === "routed"} />
                        <Field label="Sub-category" value={edits.sub_category} onChange={(v) => updateEdit("sub_category", v)} reason={reasoning.sub_category} readOnly={active.bucket === "routed"} />
                        <Field label="Board" value={edits.board} onChange={(v) => updateEdit("board", v)} reason={reasoning.board} readOnly={active.bucket === "routed"} />
                        <Field label="Company" value={edits.company} onChange={(v) => updateEdit("company", v)} reason={reasoning.company} readOnly={active.bucket === "routed"} />
                        <Field label="Site" value={edits.site} onChange={(v) => updateEdit("site", v)} reason={reasoning.site} readOnly={active.bucket === "routed"} />
                        <Field label="Device" value={edits.device} onChange={(v) => updateEdit("device", v)} reason={reasoning.device} readOnly={active.bucket === "routed"} />
                        <Field label="Contact" value={edits.contact_email} onChange={(v) => updateEdit("contact_email", v)} reason={reasoning.contact_email} readOnly={active.bucket === "routed"} />
                      </div>

                      {active.bucket === "attention" && (
                        <div className="px-5 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-2">
                          <button
                            onClick={() => submitAttention(null)}
                            className="px-4 py-1.5 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-700"
                          >
                            Create ticket
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
