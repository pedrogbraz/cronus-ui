/**
 * demo-saas — the single source of truth for the SaaS dashboard demo dataset.
 *
 * PURE TS DATA (zero React / hooks / DOM), so it is safe to import from a React
 * Server Component and ships as a `registry:lib` item (`kronus-ui add demo-saas`
 * writes `lib/demo-saas.ts`). The application/dashboard/billing blocks (KPIs,
 * revenue chart, activity feed, team, plans, usage, invoices) are meant to read
 * from HERE so the same team, plans, and numbers appear across every surface.
 *
 * The values below are LIFTED verbatim from the existing dashboard/stats/billing
 * blocks (behaviour-preserving), so visual snapshots stay byte-identical.
 *
 * Brand: {@link BRAND} is the standalone demo app name ("Northwind"), used when
 * this dataset is consumed on its own. It is a demo default — `kronus-ui compose`
 * does NOT override it (the composed app's brand reaches its VISIBLE chrome via
 * the separate brandTokens literal-replacement path, not this lib).
 */

/** The SaaS product/workspace brand wordmark — the standalone demo app name. */
export const BRAND = "Northwind";

/** A directional metric trend. */
export type Trend = "up" | "down";

/** A headline KPI card. */
export interface Kpi {
  /** Metric label (e.g. "Total revenue"). */
  label: string;
  /** Value, exactly as rendered (e.g. "$84,210"). */
  value: string;
  /** Period-over-period delta, as rendered (e.g. "+14.2%"). */
  delta: string;
  /** Delta direction. */
  trend: Trend;
}

/**
 * The four dashboard KPIs (revenue / active users / conversion / churn), lifted
 * from the analytics dashboard block.
 */
export const KPIS: Kpi[] = [
  { label: "Total revenue", value: "$84,210", delta: "+14.2%", trend: "up" },
  { label: "Active users", value: "12,840", delta: "+6.8%", trend: "up" },
  { label: "Conversion", value: "4.21%", delta: "+0.9%", trend: "up" },
  { label: "Churn", value: "1.64%", delta: "-0.4%", trend: "down" },
];

/** One month of the revenue time series. */
export interface RevenuePoint {
  /** Short month label ("Jan".."Jul"). */
  month: string;
  /** Revenue in whole currency units. */
  revenue: number;
}

/**
 * The seven-month revenue series the dashboard chart renders. The last point
 * (`Jul → 84_210`) matches the "Total revenue" KPI value (asserted in the test).
 */
export const REVENUE_SERIES: RevenuePoint[] = [
  { month: "Jan", revenue: 42_100 },
  { month: "Feb", revenue: 48_400 },
  { month: "Mar", revenue: 45_900 },
  { month: "Apr", revenue: 56_200 },
  { month: "May", revenue: 61_800 },
  { month: "Jun", revenue: 72_400 },
  { month: "Jul", revenue: 84_210 },
];

/** A billing/activity status, matching the dashboard badge variants. */
export type ActivityStatus = "Paid" | "Pending" | "Refunded";

/** One row of the recent-activity feed. */
export interface Activity {
  /** Invoice id, e.g. "INV-2048". */
  id: string;
  /** Customer display name. */
  customer: string;
  /** Customer email. */
  email: string;
  /** Customer monogram. */
  initials: string;
  /** Optional avatar URL (as in the source). */
  avatar?: string;
  /** Formatted charge amount (e.g. "$1,290.00"). */
  amount: string;
  /** Charge status. */
  status: ActivityStatus;
}

/**
 * The recent-activity feed (four rows) the analytics dashboard renders, lifted
 * verbatim (customers, emails, avatars, amounts, statuses).
 */
export const ACTIVITY: Activity[] = [
  {
    id: "INV-2048",
    customer: "Mara Castillo",
    email: "mara@kronus.io",
    initials: "MC",
    avatar: "https://i.pravatar.cc/96?img=12",
    amount: "$1,290.00",
    status: "Paid",
  },
  {
    id: "INV-2047",
    customer: "Devon Lane",
    email: "devon@acme.dev",
    initials: "DL",
    avatar: "https://i.pravatar.cc/96?img=33",
    amount: "$640.00",
    status: "Pending",
  },
  {
    id: "INV-2046",
    customer: "Priya Sharma",
    email: "priya@lumon.co",
    initials: "PS",
    amount: "$2,180.00",
    status: "Paid",
  },
  {
    id: "INV-2045",
    customer: "Tobias Funke",
    email: "tobias@bluth.com",
    initials: "TF",
    avatar: "https://i.pravatar.cc/96?img=68",
    amount: "$320.00",
    status: "Refunded",
  },
];

/** A workspace role, matching the team block badge variants. */
export type Role = "Owner" | "Admin" | "Member";

/** A team member. */
export interface TeamMember {
  /** Stable id. */
  id: string;
  /** Display name. */
  name: string;
  /** Work email. */
  email: string;
  /** Workspace role. */
  role: Role;
  /** Monogram. */
  initials: string;
  /** Optional avatar URL (as in the source). */
  avatar?: string;
}

/**
 * The five-person team the team block renders (Mara owner, Devon admin, three
 * members), lifted verbatim.
 */
export const TEAM: TeamMember[] = [
  {
    id: "m1",
    name: "Mara Castillo",
    email: "mara@kronus.io",
    role: "Owner",
    initials: "MC",
    avatar: "https://i.pravatar.cc/96?img=12",
  },
  {
    id: "m2",
    name: "Devon Lane",
    email: "devon@kronus.io",
    role: "Admin",
    initials: "DL",
    avatar: "https://i.pravatar.cc/96?img=33",
  },
  { id: "m3", name: "Priya Sharma", email: "priya@kronus.io", role: "Member", initials: "PS" },
  {
    id: "m4",
    name: "Tobias Funke",
    email: "tobias@kronus.io",
    role: "Member",
    initials: "TF",
    avatar: "https://i.pravatar.cc/96?img=68",
  },
  { id: "m5", name: "Aiko Tanaka", email: "aiko@kronus.io", role: "Member", initials: "AT" },
];

/** The signed-in account (workspace owner). */
export interface SaasUser {
  name: string;
  email: string;
  initials: string;
  role: Role;
}

/** The demo account — the workspace Owner (Mara). */
export const USER: SaasUser = {
  name: "Mara Castillo",
  email: "mara@kronus.io",
  initials: "MC",
  role: "Owner",
};

/** One billing invoice line. */
export interface Invoice {
  /** Invoice id, e.g. "INV-2026-006". */
  id: string;
  /** Issue date, as rendered. */
  date: string;
  /** Formatted amount (e.g. "$290.00"). */
  amount: string;
  /** Payment status. */
  status: "Paid" | "Pending";
}

/**
 * The four billing invoices the billing block renders (three paid at $290, one
 * pending at $245), lifted verbatim.
 */
export const INVOICES: Invoice[] = [
  { id: "INV-2026-006", date: "Jun 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-005", date: "May 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "$290.00", status: "Paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$245.00", status: "Pending" },
];

/** One usage meter (seats / storage / API calls). */
export interface UsageMeter {
  /** Stable id. */
  id: string;
  /** Meter label. */
  label: string;
  /** Amount used (numeric). */
  used: number;
  /** Plan limit (numeric). */
  limit: number;
  /** "used / limit" display string, as rendered. */
  display: string;
  /** Percent used (0–100), as rendered on the progress bar. */
  value: number;
}

/**
 * The three usage meters the usage/billing blocks render (seats, storage, API
 * calls), lifted verbatim. `value` is the rendered percent (coherent with
 * used/limit within rounding; asserted loosely in the test).
 */
export const USAGE_METERS: UsageMeter[] = [
  { id: "usage-seats", label: "Seats", used: 18, limit: 25, display: "18 / 25", value: 72 },
  {
    id: "usage-storage",
    label: "Storage",
    used: 164,
    limit: 250,
    display: "164 GB / 250 GB",
    value: 66,
  },
  {
    id: "usage-api",
    label: "API calls",
    used: 842_000,
    limit: 1_000_000,
    display: "842K / 1M",
    value: 84,
  },
];

/** A pricing plan. */
export interface Plan {
  /** Stable id. */
  id: string;
  /** Plan name. */
  name: string;
  /** One-line positioning. */
  tagline: string;
  /** Monthly price in whole currency units (0 = free). */
  monthly: number;
  /** Annual (per-month, billed yearly) price. */
  annual: number;
  /** Feature bullets. */
  features: string[];
  /** Primary CTA label. */
  cta: string;
  /** Whether this is the highlighted plan. */
  popular?: boolean;
}

/**
 * The three pricing plans the billing--plans block renders (Starter free, Team
 * $29 popular, Enterprise $89), lifted verbatim. Marketing `pricing` stays
 * local (Pro/Custom, project features — a different narrative).
 */
export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For individuals shipping their first project.",
    monthly: 0,
    annual: 0,
    features: ["1 workspace", "Up to 3 seats", "5 GB storage", "Community support"],
    cta: "Get started",
  },
  {
    id: "team",
    name: "Team",
    tagline: "For growing teams that need room to scale.",
    monthly: 29,
    annual: 24,
    features: [
      "Unlimited workspaces",
      "Up to 25 seats",
      "250 GB storage",
      "Priority email support",
      "Usage analytics",
    ],
    cta: "Upgrade to Team",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations with advanced controls.",
    monthly: 89,
    annual: 74,
    features: [
      "Everything in Team",
      "SSO & SCIM",
      "Unlimited storage",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Contact sales",
  },
];

/** The currently-active plan id (matches a {@link PLANS} entry). */
export const CURRENT_PLAN_ID = "team";

/** Look up a plan by its stable id (undefined when absent). */
export function planById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
