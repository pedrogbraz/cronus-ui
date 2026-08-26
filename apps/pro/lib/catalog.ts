/**
 * Cronus Pro pack + license list. Server-safe. Kept here so the Pro origin
 * does not import `apps/www` (the two Next apps stay siblings).
 */

export type PackTheme = "aurora" | "midnight" | "emerald";
export type PackMode = "dark" | "light";

export interface PackApp {
  slug: "mail" | "chat" | "finance";
  name: string;
  tagline: string;
  description: string;
  command: string;
  theme: PackTheme;
  mode: PackMode;
  appearance: string;
}

function cmd(slug: PackApp["slug"]): string {
  return `bunx create-cronus-app my-app --template ${slug}`;
}

export const PACK: readonly PackApp[] = [
  {
    slug: "mail",
    name: "Mail",
    tagline: "Inbox product",
    description:
      "Notification panel and activity feed under the app shell, plus compose and preferences. Additive — SaaS stays free.",
    command: cmd("mail"),
    theme: "midnight",
    mode: "dark",
    appearance: "Midnight · dark",
  },
  {
    slug: "chat",
    name: "Chat",
    tagline: "Assistant product",
    description:
      "A live thread under the app shell, a prompt box on a new-message route, plus replies and settings.",
    command: cmd("chat"),
    theme: "aurora",
    mode: "dark",
    appearance: "Aurora · dark",
  },
  {
    slug: "finance",
    name: "Finance",
    tagline: "Money product",
    description:
      "Payouts and invoices on home, plus billing, usage, and analytics under the app shell.",
    command: cmd("finance"),
    theme: "emerald",
    mode: "light",
    appearance: "Emerald · light",
  },
];

export function packApp(slug: PackApp["slug"]): PackApp {
  const found = PACK.find((app) => app.slug === slug);
  if (!found) {
    throw new Error(`Unknown pack app: ${slug}`);
  }
  return found;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export interface Plan {
  id: "maker" | "studio";
  name: string;
  price: number;
  priceLabel: string;
  cadence: string;
  blurb: string;
  featured: boolean;
  seats: string;
  features: readonly string[];
}

export const PLANS: readonly Plan[] = [
  {
    id: "maker",
    name: "Maker",
    price: 199,
    priceLabel: usd.format(199),
    cadence: "one-time",
    blurb: "One builder. Unlimited projects. The pack, forever.",
    featured: false,
    seats: "1 seat",
    features: [
      "Mail, chat, and finance compose apps",
      "Commercial use, unlimited projects",
      "Perpetual license — no subscription",
      "Lifetime updates to the pack",
      "Figma file of the system",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    price: 299,
    priceLabel: usd.format(299),
    cadence: "one-time",
    blurb: "A small team, priority at launch, and a human on the other side.",
    featured: true,
    seats: "Up to 10 seats",
    features: [
      "Everything in Maker",
      "Up to 10 seats on one license",
      "Priority issues at launch",
      "A human at launch",
      "Same perpetual terms — no renewal",
    ],
  },
];

export type Cell = "both" | "pro" | "oss-note";

export const COMPARE_ROWS: { label: string; hint?: string; oss: Cell; pro: Cell }[] = [
  { label: "Components, tokens, CLI", oss: "both", pro: "both" },
  { label: "Looks — Default, Brutalist, Glass, Mauve", oss: "both", pro: "both" },
  { label: "SaaS, store, landing + flavors", oss: "both", pro: "both" },
  { label: "Live preview, compose, add-page, upgrade", oss: "both", pro: "both" },
  { label: "AI Kit (MIT)", oss: "both", pro: "both" },
  {
    label: "Figma Variables JSON",
    hint: "Already in @cronus-ui/tokens",
    oss: "both",
    pro: "both",
  },
  { label: "Mail, chat, and finance apps", oss: "oss-note", pro: "pro" },
  { label: "Figma file + a human at launch", oss: "oss-note", pro: "pro" },
  { label: "Priority issues at launch", oss: "oss-note", pro: "pro" },
];

export const INCLUDED = [
  { title: "Three compose apps", body: "Mail, chat, finance — same engine as SaaS." },
  { title: "Commercial, perpetual", body: "Unlimited projects. No subscription." },
  { title: "Lifetime pack updates", body: "The apps keep moving. You keep the seat." },
  { title: "Figma file", body: "The curated file. Variables JSON stays OSS." },
] as const;

export const FAQ = [
  {
    q: "Does Pro take anything out of OSS?",
    a: "No. Tokens, looks, SaaS, store, landing, compose, add-page, upgrade, and the AI Kit stay MIT. Pro only adds rows.",
  },
  {
    q: "Are looks (Glass, Brutalist, Mauve) paid?",
    a: "No. Looks are an OSS token axis. Paywalling Glass would contradict the category — the engine is the product, not a skin.",
  },
  {
    q: "Can I see the apps before paying?",
    a: "Yes. Live previews on this page iframe the OSS stage. Scaffold commands work in this open monorepo; the license is commercial positioning, not a fake lock.",
  },
  {
    q: "When can I pay?",
    a: "Not billed yet. Maker and Studio are the public list for first release. No Stripe on this preview — watch the repo to be first in line.",
  },
  {
    q: "Why isn't there a Mobile or Super edition?",
    a: "Cronus is web. We don't ship React Native, so we don't sell a mobile SKU or a bundle that pretends we do.",
  },
  {
    q: "Is the CLI gated?",
    a: "Not in this repository. `create-cronus-app --template mail` still composes. When the license publishes, it covers the pack and support — the MIT engine does not move.",
  },
] as const;
