/**
 * Hydra-ready catalog tags. Closed vocabularies so a downstream ranker can
 * match by probability instead of dumping source into an LLM context.
 *
 * Public card:
 *   Component / description / design style / palette
 * Extra facets the 2-query path needs:
 *   motion (none | snappy | smooth | cinematic)
 *   intents (login, pricing, dashboard, …)
 *
 * Category defaults cover the catalog; per-slug / per-variant overrides
 * catch the items whose look or motion is not the category's.
 */

export const DESIGN_STYLES = ["default", "editorial", "operational", "glass", "brutalist"] as const;
export type DesignStyle = (typeof DESIGN_STYLES)[number];

export const PALETTES = ["semantic", "aurora", "neutral", "midnight", "sunset", "emerald"] as const;
export type Palette = (typeof PALETTES)[number];

export const MOTIONS = ["none", "snappy", "smooth", "cinematic"] as const;
export type Motion = (typeof MOTIONS)[number];

export const CATALOG_KINDS = ["component", "block", "variant", "template"] as const;
export type CatalogKind = (typeof CATALOG_KINDS)[number];

export const INTENTS = [
  "action",
  "form",
  "auth",
  "login",
  "signup",
  "nav",
  "overlay",
  "feedback",
  "data",
  "chart",
  "commerce",
  "marketing",
  "dashboard",
  "settings",
  "account",
  "billing",
  "ai",
  "media",
  "motion",
  "layout",
  "chrome",
  "content",
  "email",
  "onboarding",
  "social",
  "admin",
  "empty",
] as const;
export type Intent = (typeof INTENTS)[number];

export interface CatalogTags {
  style: DesignStyle;
  palette: Palette;
  motion: Motion;
  intents: Intent[];
}

export interface CatalogTagInput {
  slug: string;
  category: string;
  kind: Exclude<CatalogKind, "variant">;
  variantId?: string;
}

type TagPatch = Partial<Omit<CatalogTags, "intents">> & { intents?: Intent[] };

const CATEGORY_DEFAULTS: Record<string, CatalogTags> = {
  buttons: { style: "default", palette: "semantic", motion: "snappy", intents: ["action"] },
  forms: { style: "default", palette: "semantic", motion: "none", intents: ["form"] },
  "data-display": {
    style: "operational",
    palette: "semantic",
    motion: "none",
    intents: ["data"],
  },
  feedback: { style: "default", palette: "semantic", motion: "none", intents: ["feedback"] },
  overlays: { style: "default", palette: "semantic", motion: "snappy", intents: ["overlay"] },
  navigation: { style: "default", palette: "semantic", motion: "none", intents: ["nav"] },
  "date-time": {
    style: "operational",
    palette: "semantic",
    motion: "none",
    intents: ["form", "data"],
  },
  charts: {
    style: "operational",
    palette: "semantic",
    motion: "smooth",
    intents: ["chart", "data"],
  },
  premium: { style: "editorial", palette: "semantic", motion: "smooth", intents: ["motion"] },
  auth: { style: "default", palette: "semantic", motion: "none", intents: ["auth"] },
  account: {
    style: "default",
    palette: "semantic",
    motion: "none",
    intents: ["account", "settings"],
  },
  marketing: { style: "editorial", palette: "semantic", motion: "none", intents: ["marketing"] },
  content: { style: "editorial", palette: "semantic", motion: "none", intents: ["content"] },
  application: {
    style: "operational",
    palette: "semantic",
    motion: "none",
    intents: ["dashboard"],
  },
  onboarding: { style: "default", palette: "semantic", motion: "none", intents: ["onboarding"] },
  social: { style: "default", palette: "semantic", motion: "none", intents: ["social"] },
  dashboard: { style: "operational", palette: "semantic", motion: "none", intents: ["dashboard"] },
  admin: { style: "operational", palette: "semantic", motion: "none", intents: ["admin"] },
  billing: { style: "default", palette: "semantic", motion: "none", intents: ["billing"] },
  commerce: { style: "default", palette: "semantic", motion: "none", intents: ["commerce"] },
  store: { style: "default", palette: "semantic", motion: "none", intents: ["commerce"] },
  page: { style: "default", palette: "semantic", motion: "none", intents: ["layout"] },
  ai: { style: "default", palette: "semantic", motion: "none", intents: ["ai"] },
  notifications: { style: "default", palette: "semantic", motion: "snappy", intents: ["feedback"] },
  email: { style: "editorial", palette: "semantic", motion: "none", intents: ["email"] },
  states: { style: "default", palette: "semantic", motion: "none", intents: ["empty", "feedback"] },
  survey: { style: "default", palette: "semantic", motion: "none", intents: ["form"] },
  integrations: {
    style: "operational",
    palette: "semantic",
    motion: "none",
    intents: ["settings"],
  },
  shell: { style: "operational", palette: "semantic", motion: "none", intents: ["chrome", "nav"] },
};

const FALLBACK: CatalogTags = {
  style: "default",
  palette: "semantic",
  motion: "none",
  intents: ["layout"],
};

/** Per-slug overrides. Only the fields that differ from the category default. */
const SLUG_OVERRIDES: Record<string, TagPatch> = {
  "animated-button": { motion: "smooth", intents: ["action", "motion"] },
  "mode-toggle": { motion: "smooth", intents: ["action", "settings"] },
  "copy-button": { motion: "snappy", intents: ["action"] },
  fab: { motion: "snappy", intents: ["action"] },
  "password-input": { intents: ["form", "auth"] },
  "input-otp": { intents: ["form", "auth"] },
  "credit-card-input": { intents: ["form", "billing", "commerce"] },
  "currency-input": { intents: ["form", "billing"] },
  "signature-pad": { intents: ["form", "media"] },
  "file-dropzone": { intents: ["form", "media"] },
  "data-table": { style: "operational", intents: ["data", "dashboard"] },
  kanban: { style: "operational", intents: ["data", "dashboard"] },
  metric: { style: "operational", intents: ["data", "dashboard"] },
  sparkline: { motion: "smooth", intents: ["data", "chart"] },
  "video-player": { intents: ["media"] },
  "image-zoom": { intents: ["media"] },
  command: { intents: ["nav", "overlay"] },
  sidebar: { intents: ["nav", "chrome", "layout"] },
  "app-shell": { intents: ["nav", "chrome", "layout"] },
  "live-line-chart": { motion: "smooth", intents: ["chart", "data"] },
  "glass-card": { style: "glass", motion: "none" },
  "gradient-border": { palette: "aurora", motion: "none" },
  "gradient-text": { palette: "aurora", style: "editorial", motion: "none" },
  "spotlight-card": { motion: "cinematic", style: "editorial" },
  "scroll-progress": { motion: "smooth", intents: ["nav", "motion"] },
  "aurora-background": {
    style: "editorial",
    palette: "aurora",
    motion: "cinematic",
    intents: ["motion", "marketing"],
  },
  "logo-carousel": { motion: "smooth", intents: ["marketing", "motion"] },
  marquee: { motion: "smooth", intents: ["marketing", "motion"] },
  "morphing-popover": { motion: "smooth", intents: ["overlay", "motion"] },
  reveal: { motion: "smooth", intents: ["motion"] },
  carousel: { motion: "smooth", intents: ["media", "motion"] },
  "text-effect": { motion: "smooth", style: "editorial" },
  "border-beam": { motion: "smooth", palette: "aurora" },
  "flip-card": { motion: "smooth" },
  "tilt-card": { motion: "snappy" },
  magnetic: { motion: "smooth" },
  orbit: { motion: "cinematic" },
  ripple: { motion: "snappy" },
  meteors: { motion: "cinematic", intents: ["motion", "marketing"] },
  "light-rays": { motion: "cinematic", palette: "aurora" },
  "progressive-blur": { style: "glass", motion: "none" },
  "flickering-grid": { motion: "cinematic", style: "brutalist" },
  "star-border": { motion: "smooth", palette: "aurora" },
  "shiny-text": { motion: "smooth", palette: "aurora", style: "editorial" },
  highlighter: { style: "editorial", motion: "none" },
  "spinning-text": { motion: "smooth", style: "editorial" },
  "sparkles-text": { motion: "smooth", palette: "aurora", style: "editorial" },
  "typing-text": { motion: "smooth", style: "editorial" },
  "word-rotate": { motion: "smooth", style: "editorial" },
  "scramble-text": { motion: "snappy", style: "editorial" },
  "glare-hover": { motion: "snappy" },
  "click-spark": { motion: "snappy", intents: ["action", "motion"] },
  "animated-list": { motion: "smooth" },
  "card-stack": { motion: "smooth" },
  "dynamic-island": { motion: "smooth", intents: ["feedback", "motion"] },
  confetti: { motion: "cinematic", intents: ["feedback", "motion"] },
  particles: { motion: "cinematic", intents: ["motion", "marketing"] },
  "retro-grid": { style: "brutalist", motion: "none" },
  dock: { motion: "snappy", intents: ["nav", "motion"] },
  "expandable-tabs": { motion: "snappy", intents: ["nav"] },
  "segmented-control": { motion: "snappy", intents: ["nav", "form"] },
  "pill-nav": { motion: "snappy", intents: ["nav"] },
  "motion-presets": { motion: "smooth", intents: ["motion"] },
  frame: { style: "editorial", motion: "none" },
  noise: { motion: "none" },
  "dot-pattern": { motion: "none" },
  "grid-pattern": { motion: "none" },
  login: { intents: ["login", "auth"] },
  signup: { intents: ["signup", "auth"] },
  "forgot-password": { intents: ["auth", "form"] },
  otp: { intents: ["auth", "form"] },
  "magic-link": { intents: ["auth", "form"] },
  hero: { style: "editorial", intents: ["marketing"] },
  cta: { style: "editorial", palette: "aurora", intents: ["marketing"] },
  waitlist: { intents: ["marketing", "form"] },
  navbar: { intents: ["nav", "chrome"] },
  footer: { intents: ["chrome", "marketing"] },
  "app-shell-chrome": { intents: ["chrome", "nav", "layout"] },
  dashboard: { style: "operational", intents: ["dashboard"] },
  analytics: { style: "operational", intents: ["dashboard", "data"] },
  checkout: { intents: ["commerce", "billing"] },
  cart: { intents: ["commerce"] },
  "product-grid": { intents: ["commerce", "marketing"] },
  "product-detail": { intents: ["commerce"] },
  "chat-thread": { intents: ["ai", "social"] },
  "prompt-box": { intents: ["ai", "form"] },
  "ai-response": { intents: ["ai"] },
};

/** Variant-level overrides (`slug::variantId`). Inherit the family tags first. */
const VARIANT_OVERRIDES: Record<string, TagPatch> = {
  "login::classic": { style: "default", motion: "none" },
  "login::split": { style: "editorial", palette: "aurora", motion: "smooth" },
  "login::social-first": { style: "default", motion: "snappy" },
  "login::minimal": { style: "editorial", motion: "none" },
  "signup::classic": { style: "default", motion: "none" },
  "signup::split-proof": { style: "editorial", motion: "none" },
  "signup::with-plan": { style: "operational", motion: "none" },
  "hero::centered": { style: "editorial", motion: "none" },
  "hero::split": { style: "operational", motion: "none" },
  "hero::compact": { style: "default", motion: "none" },
  "hero::atmosphere": { style: "editorial", palette: "aurora", motion: "cinematic" },
  "cta::classic": { style: "editorial", palette: "aurora", motion: "none" },
  "cta::banner": { style: "editorial", palette: "aurora", motion: "none" },
  "cta::split-visual": { style: "editorial", palette: "aurora", motion: "smooth" },
  "feature-grid::bento": { style: "editorial" },
  "feature-grid::cards": { style: "default" },
  "pricing::tiers": { style: "editorial" },
  "pricing::toggle": { style: "operational", motion: "snappy" },
  "pricing::usage": { style: "operational" },
  "logo-cloud::marquee": { motion: "smooth" },
};

const APP_OVERRIDES: Record<string, TagPatch> = {
  saas: {
    style: "operational",
    palette: "aurora",
    motion: "smooth",
    intents: ["dashboard", "auth"],
  },
  admin: {
    style: "operational",
    palette: "midnight",
    motion: "none",
    intents: ["admin", "dashboard"],
  },
  docs: { style: "editorial", palette: "neutral", motion: "none", intents: ["content"] },
  store: { style: "default", palette: "aurora", motion: "none", intents: ["commerce"] },
  landing: { style: "editorial", palette: "aurora", motion: "none", intents: ["marketing"] },
  "landing-studio": {
    style: "editorial",
    palette: "midnight",
    motion: "cinematic",
    intents: ["marketing", "ai"],
  },
  "landing-ops": {
    style: "operational",
    palette: "aurora",
    motion: "none",
    intents: ["marketing", "dashboard"],
  },
  "landing-secure": {
    style: "operational",
    palette: "midnight",
    motion: "none",
    intents: ["marketing"],
  },
  "landing-care": {
    style: "editorial",
    palette: "emerald",
    motion: "none",
    intents: ["marketing"],
  },
  "landing-shop": { style: "editorial", palette: "sunset", motion: "none", intents: ["commerce"] },
  "landing-docs": { style: "default", palette: "aurora", motion: "none", intents: ["marketing"] },
  "landing-premium": {
    style: "editorial",
    palette: "aurora",
    motion: "smooth",
    intents: ["marketing"],
  },
  "landing-glass": { style: "glass", palette: "aurora", motion: "smooth", intents: ["marketing"] },
  "landing-agency": {
    style: "editorial",
    palette: "aurora",
    motion: "none",
    intents: ["marketing"],
  },
  "landing-agents": {
    style: "editorial",
    palette: "aurora",
    motion: "smooth",
    intents: ["marketing", "ai"],
  },
  "landing-broadcast": {
    style: "operational",
    palette: "aurora",
    motion: "none",
    intents: ["marketing"],
  },
  "landing-coverage": {
    style: "operational",
    palette: "aurora",
    motion: "none",
    intents: ["marketing"],
  },
  mail: { style: "operational", palette: "aurora", motion: "none", intents: ["email"] },
  chat: { style: "default", palette: "aurora", motion: "snappy", intents: ["ai", "social"] },
  finance: {
    style: "operational",
    palette: "aurora",
    motion: "none",
    intents: ["billing", "data"],
  },
};

function mergeTags(base: CatalogTags, patch: TagPatch | undefined): CatalogTags {
  if (!patch) return base;
  return {
    style: patch.style ?? base.style,
    palette: patch.palette ?? base.palette,
    motion: patch.motion ?? base.motion,
    intents: patch.intents ?? base.intents,
  };
}

export function resolveCatalogTags(input: CatalogTagInput): CatalogTags {
  if (input.kind === "template") {
    return mergeTags(FALLBACK, APP_OVERRIDES[input.slug]);
  }
  const categoryTags = CATEGORY_DEFAULTS[input.category] ?? FALLBACK;
  const family = mergeTags(categoryTags, SLUG_OVERRIDES[input.slug]);
  if (input.variantId) {
    return mergeTags(family, VARIANT_OVERRIDES[`${input.slug}::${input.variantId}`]);
  }
  return family;
}

export function isDesignStyle(value: string): value is DesignStyle {
  return (DESIGN_STYLES as readonly string[]).includes(value);
}

export function isPalette(value: string): value is Palette {
  return (PALETTES as readonly string[]).includes(value);
}

export function isMotion(value: string): value is Motion {
  return (MOTIONS as readonly string[]).includes(value);
}

export function isIntent(value: string): value is Intent {
  return (INTENTS as readonly string[]).includes(value);
}
