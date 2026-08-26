/**
 * Showcase catalog for composed apps and starters. Server-safe (no React).
 * Live previews stack the same block variants the compose manifests install.
 */

export type TemplateTheme = "aurora" | "neutral" | "midnight" | "sunset" | "emerald";
export type TemplateMode = "dark" | "light";
export type TemplateKind = "product" | "landing" | "starter";

export interface TemplateBlockRef {
  block: string;
  variant?: string;
}

export type TemplateTier = "oss" | "pro";

export interface TemplateCatalogEntry {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  command: string;
  recommended?: boolean;
  kind: TemplateKind;
  /** Omit or `oss` = free pack. `pro` is additive — never removes an OSS template. */
  tier?: TemplateTier;
  theme: TemplateTheme;
  mode: TemplateMode;
  chrome: { navbar?: string; footer?: string };
  /** Home-page stack used by `/preview/t/[slug]`. Empty = no live stage. */
  blocks: TemplateBlockRef[];
  inside: string[];
}

function cmd(slug: string): string {
  return slug === "default"
    ? "bunx create-cronus-app my-app"
    : `bunx create-cronus-app my-app --template ${slug}`;
}

const siteChrome = { navbar: "navbar", footer: "footer" } as const;

export const TEMPLATE_CATALOG: readonly TemplateCatalogEntry[] = [
  {
    slug: "saas",
    name: "SaaS",
    tagline: "Recommended",
    description:
      "A full product: split auth, a sidebar app shell, dashboard, analytics, team, billing, and settings — composed from validated blocks, ready to re-theme.",
    command: cmd("saas"),
    recommended: true,
    kind: "product",
    theme: "aurora",
    mode: "dark",
    chrome: {},
    blocks: ["dashboard", "stats"].map((block) => ({ block })),
    inside: [
      "Split login/signup plus an (app) shell with sidebar nav",
      "Dashboard, analytics, team, billing, and settings routes",
      "Aurora theme by default — `theme set` re-skins the tree",
      "Grow with `cronus-ui add-page`; upgrade keeps local edits",
    ],
  },
  {
    slug: "store",
    name: "Store",
    tagline: "9-page storefront",
    description:
      "A navigable shop: home, catalog, product, cart, checkout, auth, and account — the same blocks as the gallery, wired into real routes.",
    command: cmd("store"),
    kind: "product",
    theme: "aurora",
    mode: "dark",
    chrome: siteChrome,
    blocks: ["hero", "product-grid", "testimonials", "cta"].map((block) => ({ block })),
    inside: [
      "Nine routes with site chrome (navbar + footer)",
      "Catalog, product detail, cart, and checkout",
      "Shared demo-store data across product surfaces",
      "Brand wordmark baked into chrome at compose time",
    ],
  },
  {
    slug: "landing",
    name: "Landing",
    tagline: "Marketing site",
    description:
      "A composed marketing page: hero, features, pricing, testimonials, FAQ, and CTA — one command, then edit the installed blocks.",
    command: cmd("landing"),
    kind: "product",
    theme: "aurora",
    mode: "dark",
    chrome: siteChrome,
    blocks: ["hero", "feature-grid", "pricing", "testimonials", "faq", "cta"].map((block) => ({
      block,
    })),
    inside: [
      "Hero, feature grid, pricing, testimonials, FAQ, CTA",
      "Navbar and footer chrome from the registry",
      "Same token system as the rest of Cronus UI",
      "Swap block variants with `--variant` on compose",
    ],
  },
  {
    slug: "landing-studio",
    name: "Studio",
    tagline: "AI design tool",
    description:
      "Dark atmospheric hero, logo marquee, bento features, stats, pricing, and a split product CTA.",
    command: cmd("landing-studio"),
    kind: "landing",
    theme: "midnight",
    mode: "dark",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "atmosphere" },
      { block: "logo-cloud", variant: "marquee" },
      { block: "feature-grid", variant: "bento" },
      { block: "stats" },
      { block: "pricing" },
      { block: "cta", variant: "split-visual" },
    ],
    inside: [
      "hero--atmosphere + logo-cloud marquee",
      "Bento feature grid, stats, three-tier pricing",
      "Midnight theme, dark mode",
      "Same add-page / upgrade loop as landing",
    ],
  },
  {
    slug: "landing-ops",
    name: "Ops",
    tagline: "Workflow product",
    description:
      "Split hero with a quality panel, logo cloud, feature grid, integrations, and a banner CTA.",
    command: cmd("landing-ops"),
    kind: "landing",
    theme: "aurora",
    mode: "dark",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "split" },
      { block: "logo-cloud" },
      { block: "feature-grid" },
      { block: "integrations" },
      { block: "cta", variant: "banner" },
    ],
    inside: [
      "hero--split + integrations grid",
      "Aurora theme, dark mode",
      "Navbar + footer chrome from the registry",
    ],
  },
  {
    slug: "landing-secure",
    name: "Secure",
    tagline: "Infra / encryption",
    description: "Compact registry hero, metrics, proof, usage-based pricing, split FAQ, and CTA.",
    command: cmd("landing-secure"),
    kind: "landing",
    theme: "midnight",
    mode: "dark",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "compact" },
      { block: "feature-grid" },
      { block: "stats" },
      { block: "testimonials", variant: "grid" },
      { block: "pricing", variant: "usage" },
      { block: "faq", variant: "split" },
      { block: "cta" },
    ],
    inside: [
      "hero--compact + pricing--usage + faq--split",
      "Midnight theme, dark mode",
      "Stats and testimonial grid for trust",
    ],
  },
  {
    slug: "landing-care",
    name: "Care",
    tagline: "Healthcare",
    description:
      "Waitlist capture hero, bento features, testimonials, contained CTA. Emerald light.",
    command: cmd("landing-care"),
    kind: "landing",
    theme: "emerald",
    mode: "light",
    chrome: siteChrome,
    blocks: [
      { block: "waitlist" },
      { block: "feature-grid", variant: "bento" },
      { block: "testimonials" },
      { block: "cta" },
    ],
    inside: ["waitlist hero + bento features", "Emerald theme, light mode"],
  },
  {
    slug: "landing-shop",
    name: "Shop",
    tagline: "Storefront",
    description: "Compact hero, editorial product showcase, banner CTA. Sunset light.",
    command: cmd("landing-shop"),
    kind: "landing",
    theme: "sunset",
    mode: "light",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "compact" },
      { block: "product-grid", variant: "showcase" },
      { block: "cta", variant: "banner" },
    ],
    inside: ["hero--compact + product-grid--showcase", "Sunset theme, light mode"],
  },
  {
    slug: "landing-docs",
    name: "Docs product",
    tagline: "Developer tool",
    description: "Compact hero, logo cloud, features, integrations, CTA.",
    command: cmd("landing-docs"),
    kind: "landing",
    theme: "aurora",
    mode: "dark",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "compact" },
      { block: "logo-cloud" },
      { block: "feature-grid" },
      { block: "integrations" },
      { block: "cta" },
    ],
    inside: ["hero--compact + integrations", "Aurora theme, dark mode"],
  },
  {
    slug: "landing-premium",
    name: "Premium SaaS",
    tagline: "Full marketing page",
    description:
      "Split hero, logos, features, monthly/annual pricing, testimonials, FAQ, CTA. Aurora light.",
    command: cmd("landing-premium"),
    kind: "landing",
    theme: "aurora",
    mode: "light",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "split" },
      { block: "logo-cloud" },
      { block: "feature-grid" },
      { block: "pricing", variant: "toggle" },
      { block: "testimonials" },
      { block: "faq" },
      { block: "cta" },
    ],
    inside: ["hero--split + pricing--toggle + FAQ", "Aurora theme, light mode"],
  },
  {
    slug: "landing-agents",
    name: "Agents",
    tagline: "Automation",
    description:
      "Split hero, marquee logos, bento, stats, proof, pricing, FAQ, banner CTA. Emerald light.",
    command: cmd("landing-agents"),
    kind: "landing",
    theme: "emerald",
    mode: "light",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "split" },
      { block: "logo-cloud", variant: "marquee" },
      { block: "feature-grid", variant: "bento" },
      { block: "stats" },
      { block: "testimonials" },
      { block: "pricing" },
      { block: "faq" },
      { block: "cta", variant: "banner" },
    ],
    inside: ["Marquee + bento + stats", "Emerald theme, light mode"],
  },
  {
    slug: "landing-coverage",
    name: "Coverage",
    tagline: "Global services",
    description: "Centered hero, stats, testimonial grid, FAQ, CTA. Sunset light.",
    command: cmd("landing-coverage"),
    kind: "landing",
    theme: "sunset",
    mode: "light",
    chrome: siteChrome,
    blocks: [
      { block: "hero" },
      { block: "stats" },
      { block: "testimonials", variant: "grid" },
      { block: "faq" },
      { block: "cta" },
    ],
    inside: ["stats + testimonials--grid", "Sunset theme, light mode"],
  },
  {
    slug: "landing-broadcast",
    name: "Broadcast",
    tagline: "Studio / show",
    description: "Atmospheric hero, marquee logos, features, testimonials, pricing. Aurora dark.",
    command: cmd("landing-broadcast"),
    kind: "landing",
    theme: "aurora",
    mode: "dark",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "atmosphere" },
      { block: "logo-cloud", variant: "marquee" },
      { block: "feature-grid" },
      { block: "testimonials" },
      { block: "pricing" },
    ],
    inside: ["hero--atmosphere + logo-cloud marquee", "Aurora theme, dark mode"],
  },
  {
    slug: "landing-agency",
    name: "Agency",
    tagline: "Studio site",
    description:
      "Split hero, logos, about story, services, stats, testimonials, CTA. Midnight dark.",
    command: cmd("landing-agency"),
    kind: "landing",
    theme: "midnight",
    mode: "dark",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "split" },
      { block: "logo-cloud" },
      { block: "about" },
      { block: "feature-grid" },
      { block: "stats" },
      { block: "testimonials" },
      { block: "cta" },
    ],
    inside: ["about + feature-grid + stats", "Midnight theme, dark mode"],
  },
  {
    slug: "landing-glass",
    name: "Glass",
    tagline: "Glass dark",
    description: "Atmospheric hero, bento features, split FAQ, split-visual CTA. Midnight dark.",
    command: cmd("landing-glass"),
    kind: "landing",
    theme: "midnight",
    mode: "dark",
    chrome: siteChrome,
    blocks: [
      { block: "hero", variant: "atmosphere" },
      { block: "feature-grid", variant: "bento" },
      { block: "faq", variant: "split" },
      { block: "cta", variant: "split-visual" },
    ],
    inside: ["hero--atmosphere + feature-grid--bento + faq--split", "Midnight theme, dark mode"],
  },
  {
    slug: "mail",
    name: "Mail",
    tagline: "Pro pack",
    description:
      "An inbox product: notification panel and activity feed under the app shell, plus compose and preferences. Additive — SaaS stays free.",
    command: cmd("mail"),
    kind: "product",
    tier: "pro",
    theme: "midnight",
    mode: "dark",
    chrome: {},
    blocks: [{ block: "notification-panel" }, { block: "activity-feed" }],
    inside: [
      "Split login plus an (app) shell with sidebar nav",
      "Inbox: notification-panel + activity-feed",
      "Compose (contact-form) and notification preferences",
      "Midnight theme, dark mode",
    ],
  },
  {
    slug: "chat",
    name: "Chat",
    tagline: "Pro pack",
    description:
      "An assistant product: live thread and prompt box under the app shell, plus replies and settings.",
    command: cmd("chat"),
    kind: "product",
    tier: "pro",
    theme: "aurora",
    mode: "dark",
    chrome: {},
    blocks: [{ block: "chat-thread" }, { block: "prompt-box" }],
    inside: [
      "Split login plus an (app) shell",
      "Thread: chat-thread on home",
      "New prompt (prompt-box + ai-response) and settings",
      "Aurora theme, dark mode",
    ],
  },
  {
    slug: "finance",
    name: "Finance",
    tagline: "Pro pack",
    description:
      "A money product: payouts and invoices on the home, plus billing, usage, and analytics under the app shell.",
    command: cmd("finance"),
    kind: "product",
    tier: "pro",
    theme: "emerald",
    mode: "light",
    chrome: {},
    blocks: [{ block: "payouts" }, { block: "invoice" }],
    inside: [
      "Split login plus an (app) shell",
      "Money: payouts + invoice",
      "Billing, usage-dashboard, and analytics routes",
      "Emerald theme, light mode",
    ],
  },
  {
    slug: "default",
    name: "Default",
    tagline: "Single-page starter",
    description:
      "The smallest useful app: one page wired with the theme provider, anti-flash script, and a sample of metrics, a table, and cards to build from.",
    command: cmd("default"),
    kind: "starter",
    theme: "aurora",
    mode: "dark",
    chrome: {},
    blocks: [],
    inside: [
      "One page: metric cards, orders table, invite card",
      "CronusUIProvider + anti-flash CronusThemeScript",
      "Tailwind v4 + token CSS pre-wired",
      "cronus-ui.json so `npx cronus-ui add` just works",
    ],
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    tagline: "Multi-page app shell",
    description:
      "A real application skeleton: an icon-collapsible sidebar shell with route-aware nav, a KPI + chart + data-table overview, and a settings page of forms.",
    command: cmd("dashboard"),
    kind: "starter",
    theme: "aurora",
    mode: "dark",
    chrome: {},
    blocks: [{ block: "dashboard" }, { block: "stats" }],
    inside: [
      "AppShell + Sidebar chrome with light/dark toggle",
      "Overview: KPI metrics, revenue chart, orders DataTable",
      "Settings: profile, workspace & notification forms",
      "recharts + @tanstack/react-table patterns included",
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    tagline: "Hand-built landing",
    description:
      "A complete landing page from the bundled marketing template: hero, feature grid, pricing, testimonials, FAQ, and a waitlist capture.",
    command: cmd("marketing"),
    kind: "starter",
    theme: "aurora",
    mode: "dark",
    chrome: siteChrome,
    blocks: ["hero", "feature-grid", "pricing", "testimonials", "faq", "cta"].map((block) => ({
      block,
    })),
    inside: [
      "Sticky header, hero & feature grid",
      "Pricing tiers with a featured card",
      "Testimonials grid + FAQ accordion",
      "Waitlist CTA (the only client island) + footer",
    ],
  },
];

export const TEMPLATE_SLUGS = TEMPLATE_CATALOG.map((entry) => entry.slug);

export function getTemplate(slug: string): TemplateCatalogEntry | undefined {
  return TEMPLATE_CATALOG.find((entry) => entry.slug === slug);
}

export function templatesOfKind(kind: TemplateKind): TemplateCatalogEntry[] {
  return TEMPLATE_CATALOG.filter((entry) => entry.kind === kind);
}

export function isProTemplate(entry: TemplateCatalogEntry): boolean {
  return entry.tier === "pro";
}

export function templatesOssOfKind(kind: TemplateKind): TemplateCatalogEntry[] {
  return templatesOfKind(kind).filter((entry) => !isProTemplate(entry));
}

export function templatesPro(): TemplateCatalogEntry[] {
  return TEMPLATE_CATALOG.filter(isProTemplate);
}

export function hasLivePreview(entry: TemplateCatalogEntry): boolean {
  return entry.blocks.length > 0 || entry.chrome.navbar !== undefined;
}

export function previewPath(slug: string, embed = false): string {
  return embed ? `/preview/t/${slug}?embed=1` : `/preview/t/${slug}`;
}

export function blockLabel(ref: TemplateBlockRef): string {
  return ref.variant ? `${ref.block}--${ref.variant}` : ref.block;
}

export function blockHref(ref: TemplateBlockRef): string {
  return ref.variant ? `/blocks/${ref.block}/${ref.variant}` : `/blocks/${ref.block}`;
}

/** Navbar + page blocks + footer, in the order the composed home page stacks them. */
export function stageRefs(entry: TemplateCatalogEntry): TemplateBlockRef[] {
  const refs: TemplateBlockRef[] = [];
  if (entry.chrome.navbar) refs.push({ block: entry.chrome.navbar });
  refs.push(...entry.blocks);
  if (entry.chrome.footer) refs.push({ block: entry.chrome.footer });
  return refs;
}

export const TEMPLATE_THEME_LABELS: Record<TemplateTheme, string> = {
  aurora: "Aurora",
  neutral: "Neutral",
  midnight: "Midnight",
  sunset: "Sunset",
  emerald: "Emerald",
};

export function appearanceLabel(entry: TemplateCatalogEntry): string {
  return `${TEMPLATE_THEME_LABELS[entry.theme]} · ${entry.mode}`;
}

export interface ScaffoldCommand {
  id: "bun" | "pnpm" | "npm" | "yarn";
  label: string;
  command: string;
}

export function scaffoldCommands(slug: string): ScaffoldCommand[] {
  const flag = slug === "default" ? "" : ` --template ${slug}`;
  return [
    { id: "bun", label: "bun", command: `bunx create-cronus-app my-app${flag}` },
    { id: "pnpm", label: "pnpm", command: `pnpm dlx create-cronus-app my-app${flag}` },
    { id: "npm", label: "npm", command: `npx create-cronus-app my-app${flag}` },
    { id: "yarn", label: "yarn", command: `yarn dlx create-cronus-app my-app${flag}` },
  ];
}
