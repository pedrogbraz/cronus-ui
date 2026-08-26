/**
 * Generates the copy-paste registry consumed by the `cronus-ui add` CLI.
 * Reads the real @cronus-ui/ui component sources, derives npm + cross-component
 * dependencies by parsing imports, and writes registry/*.json at the repo root.
 *
 * Run from anywhere:  bun run packages/cli/scripts/build-registry.ts
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
// These two indexes are the single source of block/component metadata. Both are
// pure data modules (zero imports, no React), so importing them here never pulls
// UI code into the build-registry process. If either ever gains a React import,
// switch to reading the manifest + a small typed lift instead.
import { BLOCK_CATEGORIES } from "../../../apps/www/lib/blocks-index.ts";
import { CATEGORIES as COMPONENT_CATEGORIES } from "../../../apps/www/lib/components-index.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../..");
const uiRoot = join(repoRoot, "packages/ui");
const componentsDir = join(uiRoot, "src/components");
const libDir = join(uiRoot, "src/lib");
const blocksDir = join(repoRoot, "apps/www/lib/blocks");

/**
 * The shared `registry:lib` modules published alongside the components/blocks
 * (F3). Each is a PURE data/util module under `packages/ui/src/lib/`: `cn` is the
 * class-merge helper every component imports; `demo-store`/`demo-saas` are the
 * cohesive demo datasets the storefront/dashboard blocks read from. A lib item's
 * `name` doubles as the `../lib/<name>.js` specifier blocks import, so a block's
 * `registryDependencies` are derived by matching that specifier against this set
 * (see {@link LIB_NAMES}). npm `dependencies` are parsed from each module's own
 * imports — pure data modules yield none, `cn` yields clsx + tailwind-merge — so
 * the set never has to be hand-maintained.
 */
const LIB_MODULES: ReadonlyArray<{ name: string; file: string }> = [
  { name: "cn", file: "cn.ts" },
  { name: "demo-store", file: "demo-store.ts" },
  { name: "demo-saas", file: "demo-saas.ts" },
];

/** Every published `registry:lib` name, for `../lib/<name>.js` dependency detection. */
const LIB_NAMES: ReadonlySet<string> = new Set(LIB_MODULES.map((m) => m.name));
/** Bundled app-template manifests read into the meta `apps` section (empty when absent). */
export const appsTemplatesDir = join(repoRoot, "packages/cli/templates/apps");

/** Committed registry output directory. */
export const outDir = join(repoRoot, "registry");
/** Committed metadata sidecar file name (lives alongside index.json in `registry/`). */
export const META_FILE = "meta.json";
/** Registry metadata schema version (bumped on breaking meta shape changes). */
const REGISTRY_VERSION = "0.5.0";

interface PkgJson {
  version?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface RegistryFile {
  path: string;
  content: string;
  target: "ui" | "lib" | "block";
}
export interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:lib" | "registry:block";
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

const IGNORED_NPM = new Set(["react", "react-dom", "react/jsx-runtime"]);

const VALID_TYPES = new Set(["registry:ui", "registry:lib", "registry:block"]);
const VALID_TARGETS = new Set(["ui", "lib", "block"]);

/**
 * The reserved separator between a block slug and a variant id in a variant's
 * registry item name (`<slug>--<variantId>`). No real block slug may contain it
 * (asserted in {@link buildItems}) so `login--split` is always unambiguously a
 * variant item, and `blockRefParts`/plan resolution can split on it safely.
 */
export const VARIANT_SEPARATOR = "--";

/** One non-default variant of a block: its id + the family-file code const. */
interface BlockVariantManifest {
  /** Variant id, mirrors the `variants[].id` in blocks-index / the family map. */
  id: string;
  /** The family-file template-literal const holding this variant's shipped source. */
  constName: string;
}

/**
 * Installable product blocks. Each entry maps a registry slug to the family
 * source file under `apps/www/lib/blocks/` and the exported template-literal
 * const that holds the block's copy-paste source. The source is TS-parsed out
 * of these files (never imported) so block generation never pulls in React.
 *
 * `constName` is the DEFAULT variant (the first `variants[]` entry in
 * blocks-index, whose family-file `code` equals the block's bare const) — it
 * ships as the bare `<slug>` item. `variants[]` lists ONLY the NON-DEFAULT
 * variants; each ships as a separate `<slug>--<variantId>` item (file
 * `<slug>-<variantId>.tsx`) whose `exportName` is parsed from its shipped source.
 * The default variant is intentionally absent here (the bare item covers it).
 */
const BLOCK_MANIFEST: ReadonlyArray<{
  slug: string;
  file: string;
  constName: string;
  variants?: ReadonlyArray<BlockVariantManifest>;
}> = [
  {
    slug: "hero",
    file: "marketing.tsx",
    constName: "heroCode",
    variants: [
      { id: "split", constName: "splitHeroCode" },
      { id: "compact", constName: "compactHeroCode" },
      { id: "atmosphere", constName: "atmosphereHeroCode" },
    ],
  },
  {
    slug: "pricing",
    file: "marketing.tsx",
    constName: "pricingCode",
    variants: [
      { id: "toggle", constName: "pricingToggleCode" },
      { id: "usage", constName: "usagePricingCode" },
    ],
  },
  {
    slug: "feature-grid",
    file: "marketing.tsx",
    constName: "featureGridCode",
    variants: [{ id: "bento", constName: "bentoFeatureCode" }],
  },
  {
    slug: "cta",
    file: "marketing.tsx",
    constName: "ctaCode",
    variants: [
      { id: "banner", constName: "ctaBannerCode" },
      { id: "split-visual", constName: "ctaSplitVisualCode" },
    ],
  },
  {
    slug: "testimonials",
    file: "marketing.tsx",
    constName: "testimonialsCode",
    variants: [{ id: "grid", constName: "testimonialsGridCode" }],
  },
  {
    slug: "faq",
    file: "marketing.tsx",
    constName: "faqCode",
    variants: [{ id: "split", constName: "faqSplitCode" }],
  },
  {
    slug: "footer",
    file: "marketing.tsx",
    constName: "footerCode",
    variants: [
      { id: "mega", constName: "footerMegaCode" },
      { id: "minimal", constName: "footerMinimalCode" },
    ],
  },
  {
    slug: "navbar",
    file: "marketing.tsx",
    constName: "navbarCode",
    variants: [
      { id: "centered", constName: "navbarCenteredCode" },
      { id: "with-announcement", constName: "navbarAnnouncementCode" },
    ],
  },
  {
    slug: "login",
    file: "auth.tsx",
    constName: "loginCode",
    variants: [
      { id: "split", constName: "loginSplitCode" },
      { id: "social-first", constName: "loginSocialFirstCode" },
      { id: "minimal", constName: "loginMinimalCode" },
    ],
  },
  {
    slug: "signup",
    file: "auth.tsx",
    constName: "signupCode",
    variants: [
      { id: "split-proof", constName: "signupSplitProofCode" },
      { id: "with-plan", constName: "signupWithPlanCode" },
    ],
  },
  {
    slug: "forgot-password",
    file: "auth.tsx",
    constName: "forgotPasswordCode",
    variants: [{ id: "sent", constName: "forgotPasswordSentCode" }],
  },
  { slug: "otp", file: "auth.tsx", constName: "otpCode" },
  {
    slug: "magic-link",
    file: "auth.tsx",
    constName: "magicLinkCode",
    variants: [{ id: "sent", constName: "magicLinkSentCode" }],
  },
  {
    slug: "stats",
    file: "application.tsx",
    constName: "statsCode",
    variants: [
      { id: "compact-summary", constName: "statsCompactCode" },
      { id: "pipeline-funnel", constName: "statsPipelineCode" },
    ],
  },
  { slug: "settings", file: "application.tsx", constName: "settingsCode" },
  { slug: "team", file: "application.tsx", constName: "teamCode" },
  { slug: "welcome", file: "onboarding.tsx", constName: "welcomeCode" },
  { slug: "setup-wizard", file: "onboarding.tsx", constName: "setupWizardCode" },
  { slug: "setup-checklist", file: "onboarding.tsx", constName: "setupChecklistCode" },
  {
    slug: "dashboard",
    file: "dashboard.tsx",
    constName: "dashboardAnalyticsCode",
    variants: [{ id: "admin-overview", constName: "dashboardAdminOverviewCode" }],
  },
  {
    slug: "billing",
    file: "billing.tsx",
    constName: "subscriptionCode",
    variants: [{ id: "plans", constName: "plansCode" }],
  },
  { slug: "manage-subscription", file: "billing.tsx", constName: "manageSubscriptionCode" },
  {
    slug: "payment-method",
    file: "billing.tsx",
    constName: "paymentMethodCode",
    variants: [{ id: "add-card", constName: "paymentMethodAddCode" }],
  },
  { slug: "usage-dashboard", file: "billing.tsx", constName: "usageDashboardCode" },
  { slug: "cancel-flow", file: "billing.tsx", constName: "cancelFlowCode" },
  {
    slug: "checkout",
    file: "commerce.tsx",
    constName: "checkoutCode",
    variants: [
      { id: "one-page", constName: "checkoutOnePageCode" },
      { id: "multi-step", constName: "checkoutMultiStepCode" },
    ],
  },
  { slug: "payouts", file: "commerce.tsx", constName: "payoutsCode" },
  {
    slug: "product-grid",
    file: "commerce.tsx",
    constName: "productGridCode",
    variants: [
      { id: "with-filters", constName: "productGridWithFiltersCode" },
      { id: "showcase", constName: "productGridShowcaseCode" },
    ],
  },
  {
    slug: "invoice",
    file: "commerce.tsx",
    constName: "invoiceCode",
    variants: [{ id: "receipt", constName: "invoiceReceiptCode" }],
  },
  {
    slug: "page-header",
    file: "page-sections.tsx",
    constName: "pageHeaderCode",
    variants: [{ id: "with-tabs", constName: "pageHeaderTabsCode" }],
  },
  { slug: "filter-bar", file: "page-sections.tsx", constName: "filterBarCode" },
  {
    slug: "empty-state",
    file: "page-sections.tsx",
    constName: "emptyStateCode",
    variants: [{ id: "error", constName: "emptyStateErrorCode" }],
  },
  { slug: "status-page", file: "status-page.tsx", constName: "statusPageCode" },
  { slug: "chat-thread", file: "ai.tsx", constName: "chatThreadCode" },
  { slug: "prompt-box", file: "ai.tsx", constName: "promptBoxCode" },
  { slug: "ai-response", file: "ai.tsx", constName: "aiResponseCode" },
  { slug: "not-found", file: "states.tsx", constName: "notFoundCode" },
  { slug: "error-state", file: "states.tsx", constName: "errorStateCode" },
  { slug: "success-state", file: "states.tsx", constName: "successStateCode" },
  { slug: "maintenance", file: "states.tsx", constName: "maintenanceCode" },
  { slug: "email-welcome", file: "email.tsx", constName: "emailWelcomeCode" },
  { slug: "email-receipt", file: "email.tsx", constName: "emailReceiptCode" },
  { slug: "email-verify", file: "email.tsx", constName: "emailVerifyCode" },
  { slug: "notification-panel", file: "notifications.tsx", constName: "notificationPanelCode" },
  { slug: "activity-feed", file: "notifications.tsx", constName: "activityFeedCode" },
  { slug: "toast-stack", file: "notifications.tsx", constName: "toastStackCode" },
  { slug: "nps-survey", file: "survey.tsx", constName: "npsSurveyCode" },
  { slug: "feedback-form", file: "survey.tsx", constName: "feedbackFormCode" },
  { slug: "contact-form", file: "survey.tsx", constName: "contactFormCode" },
  { slug: "post-card", file: "social.tsx", constName: "postCardCode" },
  { slug: "comment-thread", file: "social.tsx", constName: "commentThreadCode" },
  { slug: "profile-card", file: "social.tsx", constName: "profileCardCode" },
  { slug: "changelog", file: "changelog.tsx", constName: "changelogCode" },
  { slug: "integrations", file: "integrations.tsx", constName: "integrationsCode" },
  { slug: "waitlist", file: "waitlist.tsx", constName: "waitlistCode" },
  { slug: "feature-matrix", file: "feature-matrix.tsx", constName: "featureMatrixCode" },
  {
    slug: "product-detail",
    file: "store.tsx",
    constName: "productDetailCode",
    variants: [
      { id: "gallery", constName: "productDetailGalleryCode" },
      { id: "minimal", constName: "productDetailMinimalCode" },
    ],
  },
  {
    slug: "cart",
    file: "store.tsx",
    constName: "cartPageCode",
    variants: [{ id: "drawer", constName: "cartDrawerCode" }],
  },
  {
    slug: "order-tracking",
    file: "store.tsx",
    constName: "orderTrackingCode",
    variants: [
      { id: "delivered", constName: "orderDeliveredCode" },
      { id: "delayed", constName: "orderDelayedCode" },
    ],
  },
  {
    slug: "order-history",
    file: "store.tsx",
    constName: "orderHistoryTableCode",
    variants: [{ id: "cards", constName: "orderHistoryCardsCode" }],
  },
  {
    slug: "reviews",
    file: "store.tsx",
    constName: "reviewsSummaryCode",
    variants: [{ id: "compact", constName: "reviewsCompactCode" }],
  },
  {
    slug: "account-security",
    file: "account.tsx",
    constName: "accountSecurityTwoFactorCode",
    variants: [{ id: "password", constName: "accountSecurityPasswordCode" }],
  },
  {
    slug: "sessions",
    file: "account.tsx",
    constName: "sessionsListCode",
    variants: [{ id: "table", constName: "sessionsTableCode" }],
  },
  {
    slug: "api-keys",
    file: "account.tsx",
    constName: "apiKeysListCode",
    variants: [{ id: "create", constName: "apiKeysCreateCode" }],
  },
  {
    slug: "notification-preferences",
    file: "account.tsx",
    constName: "notificationPreferencesMatrixCode",
    variants: [{ id: "simple", constName: "notificationPreferencesSimpleCode" }],
  },
  {
    slug: "user-management",
    file: "admin.tsx",
    constName: "userManagementTableCode",
    variants: [{ id: "cards", constName: "userManagementCardsCode" }],
  },
  {
    slug: "analytics",
    file: "admin.tsx",
    constName: "analyticsOverviewCode",
    variants: [{ id: "engagement", constName: "analyticsEngagementCode" }],
  },
  {
    slug: "kanban-board",
    file: "admin.tsx",
    constName: "kanbanBoardCode",
    variants: [{ id: "compact", constName: "kanbanBoardCompactCode" }],
  },
  {
    slug: "audit-log",
    file: "admin.tsx",
    constName: "auditLogTimelineCode",
    variants: [{ id: "table", constName: "auditLogTableCode" }],
  },
  {
    slug: "blog",
    file: "content.tsx",
    constName: "blogGridCode",
    variants: [{ id: "list", constName: "blogListCode" }],
  },
  {
    slug: "blog-post",
    file: "content.tsx",
    constName: "blogPostArticleCode",
    variants: [{ id: "with-sidebar", constName: "blogPostSidebarCode" }],
  },
  {
    slug: "logo-cloud",
    file: "content.tsx",
    constName: "logoCloudGridCode",
    variants: [{ id: "marquee", constName: "logoCloudMarqueeCode" }],
  },
  {
    slug: "about",
    file: "content.tsx",
    constName: "aboutStoryCode",
    variants: [{ id: "values", constName: "aboutValuesCode" }],
  },
  { slug: "app-shell-chrome", file: "shell.tsx", constName: "appShellCode" },
];

/**
 * Semantic kind of a block, used by the composer for slot validation:
 * - `page`   — a full-page surface a route can render on its own (login, checkout…).
 * - `section`— a stackable page section (hero, pricing, product-grid…). Default.
 * - `chrome` — layout furniture that lives in a layout, never in a page (navbar, footer).
 * - `email`  — an email template, never rendered in an app route.
 */
export type BlockKind = "page" | "section" | "chrome" | "email";

/**
 * Explicit per-slug `kind` overrides. Anything not listed here falls back to the
 * category default in {@link CATEGORY_KIND}, then to `"section"`. Kept explicit
 * (no runtime guessing) so the semantic slot rules the composer enforces are a
 * reviewable, deterministic table — never inferred from source at build time.
 */
const BLOCK_KIND: Readonly<Record<string, BlockKind>> = {
  // Layout chrome — only ever valid in a route-group layout slot.
  navbar: "chrome",
  footer: "chrome",
  "app-shell-chrome": "chrome",
  // Full-page auth surfaces.
  login: "page",
  signup: "page",
  "forgot-password": "page",
  otp: "page",
  "magic-link": "page",
  // Full-page application/commerce/store surfaces.
  checkout: "page",
  dashboard: "page",
  "product-detail": "page",
  cart: "page",
  // Full-page states (also usable as Next special files via manifest `extras`).
  "not-found": "page",
  "error-state": "page",
  "success-state": "page",
  maintenance: "page",
  "status-page": "page",
};

/**
 * Category-level `kind` default, applied when a slug has no {@link BLOCK_KIND}
 * entry. The `email` family is entirely email templates; every other category
 * defaults to a stackable `section`.
 */
const CATEGORY_KIND: Readonly<Record<string, BlockKind>> = {
  email: "email",
};

/**
 * Brand-token anchors per block: `{ token, literal }` where `literal` MUST occur
 * verbatim in the shipped block source (enforced by `registry:check`). The
 * composer replaces the literal with the app's `--brand` value. Phase 1 anchors
 * only the two chrome blocks that carry the brand wordmark.
 */
const BLOCK_BRAND_TOKENS: Readonly<Record<string, ReadonlyArray<BrandTokenMeta>>> = {
  navbar: [{ token: "brand", literal: "Cronus" }],
  footer: [{ token: "brand", literal: "Cronus" }],
  "app-shell-chrome": [{ token: "brand", literal: "Cronus" }],
};

/**
 * Data-slot expectations per block: the `@cronus:data <name>` markers the block
 * source MUST contain so the composer can replace the delimited data const. Both
 * `build-registry` (records them in meta) and `registry:check` (fails if absent)
 * read this table, so the two never drift.
 */
export const BLOCK_DATA_SLOTS: Readonly<Record<string, ReadonlyArray<string>>> = {
  navbar: ["navbar-links"],
  footer: ["footer-links"],
  "app-shell-chrome": ["app-nav"],
};

/** Open/close markers for a named data-slot inside a block source. */
export function dataSlotMarkers(name: string): { open: string; close: string } {
  return { open: `/* @cronus:data ${name} */`, close: "/* @cronus:data-end */" };
}

/**
 * `registry/meta.json` shapes — a generated, committed sidecar carrying the
 * semantic metadata (title/description/category/exportName/kind/variants…) that
 * the flat registry index does not. Deterministic: a pure function of the source
 * indexes + block sources, with stable key ordering and no timestamps.
 */
export interface BrandTokenMeta {
  token: string;
  literal: string;
}
export interface VariantMeta {
  id: string;
  name: string;
  description: string;
  /**
   * The registry item name the composer installs for this variant: the bare
   * `<slug>` for the DEFAULT variant, or `<slug>--<id>` for a non-default one.
   */
  item: string;
  /** The component export a generated page imports for this variant. */
  exportName: string;
}
export interface BlockMetaEntry {
  title: string;
  description: string;
  category: string;
  exportName: string;
  kind: BlockKind;
  dataSlots: string[];
  brandTokens: BrandTokenMeta[];
  variants: VariantMeta[];
}
export interface ComponentMetaEntry {
  title: string;
  category: string;
  description: string;
  rsc: boolean;
}
export interface AppMetaEntry {
  title: string;
  description: string;
  pages: number;
}
export interface RegistryMeta {
  registryVersion: string;
  blocks: Record<string, BlockMetaEntry>;
  components: Record<string, ComponentMetaEntry>;
  apps: Record<string, AppMetaEntry>;
}

/**
 * Resolve the semantic {@link BlockKind} for a block: explicit per-slug override
 * first, then the category default, then `section`.
 */
function kindFor(slug: string, category: string): BlockKind {
  return BLOCK_KIND[slug] ?? CATEGORY_KIND[category] ?? "section";
}

/**
 * Extract the component export a generated page will import from the SHIPPED
 * block source (the extracted template-literal text). The source is TS-PARSED
 * (not regex-scraped) and the single exported top-level function declaration's
 * name is returned, so a `// export function Ghost` in a comment or an
 * `"export function Fake"` string literal is never mistaken for the real export
 * (a page's `import { <Name> }` must resolve to what actually ships). This is
 * deterministic and matches exactly what `add` writes to disk. Throws a
 * slug-scoped Error when the source carries zero — or more than one — exported
 * top-level function so drift fails loudly (SDD §2.1: exactly one export/block).
 */
export function extractExportName(source: string, slug: string): string {
  const sourceFile = ts.createSourceFile(
    `${slug}.tsx`,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const exported: string[] = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isFunctionDeclaration(statement) || statement.name === undefined) continue;
    const isExported = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (isExported) exported.push(statement.name.text);
  }
  if (exported.length === 0) {
    throw new Error(
      `block "${slug}": no top-level \`export function <Name>\` found in the shipped source — ` +
        `meta.exportName cannot be derived (a generated page imports this name).`,
    );
  }
  if (exported.length > 1) {
    throw new Error(
      `block "${slug}": expected exactly one exported top-level function, found ` +
        `${exported.length} (${exported.join(", ")}) — a generated page imports a single name.`,
    );
  }
  // Non-null: length is exactly 1 here.
  return exported[0] as string;
}

/** The registry item name for a block variant: `<slug>--<variantId>`. */
export function variantItemName(slug: string, variantId: string): string {
  return `${slug}${VARIANT_SEPARATOR}${variantId}`;
}

/** The block file path for a variant item: `<slug>-<variantId>.tsx`. */
function variantFileName(slug: string, variantId: string): string {
  return `${slug}-${variantId}.tsx`;
}

/**
 * Read every non-default block variant's SHIPPED source (the cooked
 * no-substitution template literal held by its family-file const) into a
 * `Map<itemName, source>` keyed by `<slug>--<variantId>`. The DEFAULT variant is
 * excluded — it ships as the bare `<slug>` item via {@link readBlockSources}.
 * Same TS-parse path as the bare sources, so a variant's published bytes are the
 * exact family-file const bytes.
 */
export async function readVariantSources(): Promise<Map<string, string>> {
  const fileTextCache = new Map<string, string>();
  const sources = new Map<string, string>();
  for (const block of BLOCK_MANIFEST) {
    for (const variant of block.variants ?? []) {
      const filePath = join(blocksDir, block.file);
      let fileText = fileTextCache.get(filePath);
      if (fileText === undefined) {
        fileText = await readFile(filePath, "utf8");
        fileTextCache.set(filePath, fileText);
      }
      const itemName = variantItemName(block.slug, variant.id);
      sources.set(itemName, extractBlockSource(filePath, fileText, variant.constName, itemName));
    }
  }
  return sources;
}

/**
 * One bundled app-template manifest as read off disk: the source `file`, the
 * derived `name` (manifest `name` field, falling back to the basename), and the
 * raw JSON-parsed value. Deliberately un-narrowed (`raw: unknown`) — the meta
 * build reads a permissive shape, while `registry:check` runs the strict
 * `parseManifest` + a plan against the registry to catch bad block refs.
 */
export interface LoadedAppManifest {
  file: string;
  name: string;
  raw: unknown;
}

/**
 * Read every `templates/apps/*.json` once (sorted for determinism) and return
 * the parsed JSON per file. Returns `[]` when the directory is absent (Phase 1
 * ships no bundled apps yet). Shared by {@link buildAppsMeta} and the
 * `registry:check` app-template reference gate so both read the same bytes.
 */
export async function loadAppManifests(): Promise<LoadedAppManifest[]> {
  let files: string[];
  try {
    files = (await readdir(appsTemplatesDir)).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return [];
  }
  const loaded: LoadedAppManifest[] = [];
  for (const file of files) {
    const raw = JSON.parse(await readFile(join(appsTemplatesDir, file), "utf8")) as unknown;
    const name =
      typeof (raw as { name?: unknown }).name === "string"
        ? (raw as { name: string }).name
        : basename(file, ".json");
    loaded.push({ file, name, raw });
  }
  return loaded;
}

/**
 * Build the meta `apps` section, keyed by manifest `name`. Reads only
 * title/description/pages-count off each manifest. Deterministic: entries are
 * sorted by key.
 */
async function buildAppsMeta(): Promise<Record<string, AppMetaEntry>> {
  const apps: Record<string, AppMetaEntry> = {};
  for (const { name, raw } of await loadAppManifests()) {
    const m =
      (raw as { manifest?: { title?: unknown; description?: unknown; pages?: unknown } })
        .manifest ?? {};
    apps[name] = {
      title: typeof m.title === "string" ? m.title : name,
      description: typeof m.description === "string" ? m.description : "",
      pages: Array.isArray(m.pages) ? m.pages.length : 0,
    };
  }
  // Stable key ordering regardless of readdir order.
  return Object.fromEntries(Object.entries(apps).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/**
 * Map every block slug to its BLOCK_MANIFEST entry (for variant lookup in meta).
 */
const MANIFEST_BY_SLUG = new Map(BLOCK_MANIFEST.map((b) => [b.slug, b] as const));

/**
 * Build the `registry/meta.json` payload from the source indexes and the shipped
 * block sources. `blockSources` maps slug → shipped source string (the exact
 * bytes `add` writes), so `exportName` is parsed from what actually ships.
 * `variantSources` maps `<slug>--<variantId>` → the variant's shipped source, so
 * each non-default variant's meta carries its item name + parsed exportName (the
 * default variant maps to the bare `<slug>` item + the block's own exportName).
 * Deterministic: keys are ordered by the source indexes, then re-sorted, and no
 * `Date`/random is used anywhere.
 */
export async function buildMeta(
  blockSources: Map<string, string>,
  variantSources: Map<string, string> = new Map(),
): Promise<RegistryMeta> {
  const blocks: Record<string, BlockMetaEntry> = {};
  const exportNameOwner = new Map<string, string>();
  for (const category of BLOCK_CATEGORIES) {
    for (const item of category.items) {
      const source = blockSources.get(item.slug);
      if (source === undefined) {
        // A block in the index without a manifest entry (no shipped source) is a
        // drift bug — fail loudly rather than emit half a meta entry.
        throw new Error(
          `block "${item.slug}" is in BLOCK_CATEGORIES but has no BLOCK_MANIFEST source — ` +
            `add it to BLOCK_MANIFEST so its meta.exportName can be derived.`,
        );
      }
      const exportName = extractExportName(source, item.slug);
      // exportName must be unique across blocks: a generated page imports it by
      // name, so a collision would produce ambiguous/duplicate imports.
      const prior = exportNameOwner.get(exportName);
      if (prior !== undefined) {
        throw new Error(
          `duplicate block exportName "${exportName}" shared by "${prior}" and "${item.slug}" — ` +
            `each block's shipped export must be uniquely named.`,
        );
      }
      exportNameOwner.set(exportName, item.slug);

      // Every declared data-slot marker must be present in the shipped source
      // (both the opening `@cronus:data <name>` and its `@cronus:data-end`), so the
      // composer's anchored replacement can never silently target a missing slot.
      for (const slot of BLOCK_DATA_SLOTS[item.slug] ?? []) {
        const { open, close } = dataSlotMarkers(slot);
        if (!source.includes(open) || !source.includes(close)) {
          throw new Error(
            `block "${item.slug}": declared data-slot "${slot}" is missing its markers in the ` +
              `shipped source (expected both \`${open}\` and \`${close}\`).`,
          );
        }
      }

      // Every declared brand-token literal must occur verbatim in the shipped
      // source so the composer's brand substitution has a real anchor.
      for (const brand of BLOCK_BRAND_TOKENS[item.slug] ?? []) {
        if (!source.includes(brand.literal)) {
          throw new Error(
            `block "${item.slug}": brand-token literal "${brand.literal}" (token "${brand.token}") ` +
              `is absent from the shipped source.`,
          );
        }
      }

      // Map each blocks-index variant to its registry item + exportName. The
      // DEFAULT variant (any id NOT listed in the manifest's non-default
      // `variants[]`) resolves to the bare `<slug>` item and the block's own
      // exportName; a non-default variant resolves to `<slug>--<id>` and the
      // exportName parsed from its shipped variant source. Fails loud on drift
      // (a blocks-index variant id with no manifest const, or a missing source).
      const manifestVariants = MANIFEST_BY_SLUG.get(item.slug)?.variants ?? [];
      const nonDefaultIds = new Set(manifestVariants.map((v) => v.id));
      const variants: VariantMeta[] = (item.variants ?? []).map((v) => {
        if (!nonDefaultIds.has(v.id)) {
          // Default variant → the bare block item + the block's own export.
          return {
            id: v.id,
            name: v.name,
            description: v.description,
            item: item.slug,
            exportName,
          };
        }
        const variantItem = variantItemName(item.slug, v.id);
        const variantSource = variantSources.get(variantItem);
        if (variantSource === undefined) {
          throw new Error(
            `block "${item.slug}": variant "${v.id}" has no shipped source — ` +
              `expected a BLOCK_MANIFEST variant const for it (regenerate variant sources).`,
          );
        }
        const variantExport = extractExportName(variantSource, variantItem);
        return {
          id: v.id,
          name: v.name,
          description: v.description,
          item: variantItem,
          exportName: variantExport,
        };
      });

      blocks[item.slug] = {
        title: item.name,
        description: item.description,
        category: category.slug,
        exportName,
        kind: kindFor(item.slug, category.slug),
        dataSlots: [...(BLOCK_DATA_SLOTS[item.slug] ?? [])],
        brandTokens: (BLOCK_BRAND_TOKENS[item.slug] ?? []).map((b) => ({ ...b })),
        variants,
      };
    }
  }

  const components: Record<string, ComponentMetaEntry> = {};
  for (const category of COMPONENT_CATEGORIES) {
    for (const item of category.items) {
      components[item.slug] = {
        title: item.name,
        category: category.slug,
        description: item.description,
        rsc: item.rsc === true,
      };
    }
  }

  return {
    registryVersion: REGISTRY_VERSION,
    // Re-sort so meta key order never depends on index authoring order.
    blocks: sortByKey(blocks),
    components: sortByKey(components),
    apps: await buildAppsMeta(),
  };
}

/** Return a new object with the same entries ordered by key (ascending). */
function sortByKey<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(record).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
}

/**
 * Hand-rolled schema validation (no extra deps): every emitted item must carry a
 * non-empty `name`, a known `type`, string[] `dependencies`/`registryDependencies`,
 * and at least one file with a non-empty `path`, string `content`, and valid `target`.
 * Throws a clear, item-scoped Error so registry generation fails loudly on drift.
 */
function validateItem(item: RegistryItem): void {
  const where = item?.name ? `item "${item.name}"` : "item (missing name)";
  if (typeof item.name !== "string" || item.name.length === 0) {
    throw new Error(`${where}: "name" must be a non-empty string`);
  }
  if (!VALID_TYPES.has(item.type)) {
    throw new Error(`${where}: "type" must be one of ${[...VALID_TYPES].join(", ")}`);
  }
  if (!Array.isArray(item.dependencies) || item.dependencies.some((d) => typeof d !== "string")) {
    throw new Error(`${where}: "dependencies" must be a string[]`);
  }
  if (
    !Array.isArray(item.registryDependencies) ||
    item.registryDependencies.some((d) => typeof d !== "string")
  ) {
    throw new Error(`${where}: "registryDependencies" must be a string[]`);
  }
  if (!Array.isArray(item.files) || item.files.length === 0) {
    throw new Error(`${where}: "files" must be a non-empty array`);
  }
  for (const f of item.files) {
    if (typeof f.path !== "string" || f.path.length === 0) {
      throw new Error(`${where}: a file is missing a non-empty "path"`);
    }
    if (typeof f.content !== "string") {
      throw new Error(`${where}: file "${f.path}" is missing string "content"`);
    }
    if (!VALID_TARGETS.has(f.target)) {
      throw new Error(
        `${where}: file "${f.path}" has invalid "target" (expected ${[...VALID_TARGETS].join(
          " | ",
        )})`,
      );
    }
  }
}

function packageNameOf(spec: string): string {
  if (spec.startsWith("@")) return spec.split("/").slice(0, 2).join("/");
  return spec.split("/")[0] ?? spec;
}

/**
 * If `spec` is a `../lib/<name>.js` import of a PUBLISHED `registry:lib` module
 * (`cn`, `demo-store`, `demo-saas`), return that lib name so it becomes a
 * `registryDependency`; otherwise `undefined`. Generalizes the old `cn`-only
 * special case (F3): a block/component importing `../lib/demo-store.js` now
 * declares `demo-store` as a registry dependency, so `resolve` pulls the demo
 * dataset in transitively and `rewriteImports` retargets the specifier to the
 * consumer's `lib` alias. A `../lib/<name>.js` that is NOT a known lib is left
 * unmatched (returns undefined) rather than silently fabricating a dependency.
 */
function libDependencyOf(spec: string): string | undefined {
  const m = /^\.\.\/lib\/([\w-]+)\.js$/.exec(spec);
  const name = m?.[1];
  return name !== undefined && LIB_NAMES.has(name) ? name : undefined;
}

function parseImports(content: string): string[] {
  const specs: string[] = [];
  const re = /(?:from|import)\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null = re.exec(content);
  while (m !== null) {
    if (m[1]) specs.push(m[1]);
    m = re.exec(content);
  }
  return specs;
}

/**
 * TS-parse a block family file and return the cooked source held by `constName`.
 * The const must be a top-level `const <constName> = \`...\`` whose initializer is
 * a plain (no-substitution) template literal; we return its `.text` (the exact
 * block source). Throws a clear, slug-scoped Error if the const is missing or its
 * initializer is anything else, so future source drift fails the build loudly.
 */
function extractBlockSource(
  filePath: string,
  fileText: string,
  constName: string,
  slug: string,
): string {
  const sourceFile = ts.createSourceFile(
    filePath,
    fileText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  let source: string | null = null;
  let sawConst = false;

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(sourceFile) !== constName) continue;
      sawConst = true;
      const initializer = declaration.initializer;
      if (initializer && ts.isNoSubstitutionTemplateLiteral(initializer)) {
        source = initializer.text;
      }
    }
  }

  if (source === null) {
    const reason = sawConst
      ? `its initializer is not a plain (no-substitution) template literal`
      : `the const was not found`;
    throw new Error(
      `block "${slug}": cannot extract source from ${basename(filePath)} — ${reason} (expected \`const ${constName} = \`...\`\`)`,
    );
  }
  return source;
}

/**
 * Read every block family file once and extract each slug's SHIPPED source (the
 * cooked no-substitution template literal) into a `Map<slug, source>`. This is
 * the exact bytes `add` writes, so both the registry `<slug>.json` files and
 * `meta.json` (its `exportName`/`dataSlots`) are derived from the same strings.
 */
export async function readBlockSources(): Promise<Map<string, string>> {
  const fileTextCache = new Map<string, string>();
  const sources = new Map<string, string>();
  for (const block of BLOCK_MANIFEST) {
    const filePath = join(blocksDir, block.file);
    let fileText = fileTextCache.get(filePath);
    if (fileText === undefined) {
      fileText = await readFile(filePath, "utf8");
      fileTextCache.set(filePath, fileText);
    }
    sources.set(block.slug, extractBlockSource(filePath, fileText, block.constName, block.slug));
  }
  return sources;
}

/**
 * Read the DEMO-DATASET `registry:lib` module sources (`demo-store` / `demo-saas`)
 * keyed by lib name, exactly as they ship. These are the single source of truth
 * the migrated blocks import from; the anti-inline-mock gate parses them to derive
 * (from source, never hand-maintained) the set of distinctive data values that a
 * migrated block must NOT re-inline. `cn` is excluded — it is a util, not a mock
 * dataset. Returns `name → source` for exactly the two demo libs.
 */
export async function readDemoLibSources(): Promise<Map<string, string>> {
  const sources = new Map<string, string>();
  for (const lib of LIB_MODULES) {
    if (lib.name !== "demo-store" && lib.name !== "demo-saas") continue;
    sources.set(lib.name, await readFile(join(libDir, lib.file), "utf8"));
  }
  return sources;
}

/** Read the @cronus-ui/ui sources and derive the full, validated set of registry items. */
export async function buildItems(): Promise<RegistryItem[]> {
  const pkg = JSON.parse(await readFile(join(uiRoot, "package.json"), "utf8")) as PkgJson;
  const versions = { ...pkg.dependencies, ...pkg.peerDependencies };
  const resolveDep = (name: string): string => {
    const v = versions[name];
    return v ? `${name}@${v}` : name;
  };

  // Component sources only — never ship test/spec/story files into the registry
  // (their imports would otherwise be parsed as bogus npm dependencies).
  const entries = (await readdir(componentsDir))
    .filter((f) => /\.tsx?$/.test(f) && !/\.(test|spec|stories)\.tsx?$/.test(f))
    .sort();

  const items: RegistryItem[] = [];

  // The shared `registry:lib` modules (cn + the F3 demo datasets). Each item's
  // npm `dependencies` are PARSED from the module's own imports (pure data
  // modules yield none; `cn` yields clsx + tailwind-merge), so the set is derived
  // from source, never hand-maintained. A lib may itself depend on another lib
  // via `../lib/<name>.js` (recorded as a registryDependency, same as blocks).
  for (const lib of LIB_MODULES) {
    const content = await readFile(join(libDir, lib.file), "utf8");
    const npm = new Set<string>();
    const reg = new Set<string>();
    for (const spec of parseImports(content)) {
      const libDep = libDependencyOf(spec);
      if (libDep !== undefined && libDep !== lib.name) {
        reg.add(libDep);
      } else if (!spec.startsWith(".")) {
        const pkgName = packageNameOf(spec);
        if (!IGNORED_NPM.has(pkgName)) npm.add(resolveDep(pkgName));
      }
    }
    items.push({
      name: lib.name,
      type: "registry:lib",
      dependencies: [...npm].sort(),
      registryDependencies: [...reg].sort(),
      files: [{ path: lib.file, content, target: "lib" }],
    });
  }

  for (const file of entries) {
    const name = basename(file, extname(file));
    const content = await readFile(join(componentsDir, file), "utf8");
    const npm = new Set<string>();
    const reg = new Set<string>();

    for (const spec of parseImports(content)) {
      const libDep = libDependencyOf(spec);
      if (libDep !== undefined) {
        reg.add(libDep);
      } else if (spec.startsWith("./")) {
        reg.add(spec.replace(/^\.\//, "").replace(/\.js$/, ""));
      } else if (!spec.startsWith(".")) {
        const pkgName = packageNameOf(spec);
        if (!IGNORED_NPM.has(pkgName)) npm.add(resolveDep(pkgName));
      }
    }

    items.push({
      name,
      type: "registry:ui",
      dependencies: [...npm].sort(),
      registryDependencies: [...reg].sort(),
      files: [{ path: file, content, target: "ui" }],
    });
  }

  // Installable blocks: copy-paste product sections that depend on the published
  // @cronus-ui/ui PACKAGE (not on copied component files), so they carry npm
  // `dependencies` only and an empty `registryDependencies`. Their source is
  // TS-parsed out of the app's block family files — never imported/executed.
  const uiPackage = `@cronus-ui/ui@${pkg.version ?? "latest"}`;
  const blockSources = await readBlockSources();
  const variantSources = await readVariantSources();

  /**
   * Derive a block item's dependencies from its shipped source (bare or variant):
   * npm `dependencies` (always pinned `@cronus-ui/ui` + any other bare imports) and
   * `registryDependencies` — the shared `registry:lib` modules the block imports
   * via `../lib/<name>.js` (F3: `demo-store`/`demo-saas`). Today every unmigrated
   * block imports only `@cronus-ui/ui` + `lucide-react`, so `registryDeps` is `[]`;
   * once a block is migrated to read the demo dataset it declares the lib here and
   * `resolve` pulls it in transitively (`writeItemFiles` places it under `lib`).
   */
  const blockItemDeps = (source: string): { npm: string[]; registry: string[] } => {
    // @cronus-ui/ui is a bare import in every block but is not in the ui package's
    // own dependency map, so pin it explicitly to the ui package version.
    const npm = new Set<string>([uiPackage]);
    const registry = new Set<string>();
    for (const spec of parseImports(source)) {
      const libDep = libDependencyOf(spec);
      if (libDep !== undefined) {
        registry.add(libDep);
        continue;
      }
      if (spec.startsWith(".")) continue;
      const pkgName = packageNameOf(spec);
      if (pkgName === "@cronus-ui/ui" || IGNORED_NPM.has(pkgName)) continue;
      npm.add(resolveDep(pkgName));
    }
    return { npm: [...npm].sort(), registry: [...registry].sort() };
  };

  for (const block of BLOCK_MANIFEST) {
    // A real block slug can never contain the reserved variant separator, or the
    // `<slug>--<variantId>` item name would be ambiguous.
    if (block.slug.includes(VARIANT_SEPARATOR)) {
      throw new Error(
        `block slug "${block.slug}" contains the reserved "${VARIANT_SEPARATOR}" separator.`,
      );
    }

    const source = blockSources.get(block.slug);
    if (source === undefined) throw new Error(`block "${block.slug}": missing extracted source`);

    // The bare DEFAULT-variant item. `registryDependencies` are derived from the
    // block's `../lib/<name>.js` imports (empty until the block is migrated).
    const bareDeps = blockItemDeps(source);
    items.push({
      name: block.slug,
      type: "registry:block",
      dependencies: bareDeps.npm,
      registryDependencies: bareDeps.registry,
      files: [{ path: `${block.slug}.tsx`, content: source, target: "block" }],
    });

    // One `<slug>--<variantId>` item per NON-DEFAULT variant (file
    // `<slug>-<variantId>.tsx`), same npm-dep derivation as the bare block.
    for (const variant of block.variants ?? []) {
      const itemName = variantItemName(block.slug, variant.id);
      const variantSource = variantSources.get(itemName);
      if (variantSource === undefined) {
        throw new Error(`variant "${itemName}": missing extracted source`);
      }
      const variantDeps = blockItemDeps(variantSource);
      items.push({
        name: itemName,
        type: "registry:block",
        dependencies: variantDeps.npm,
        registryDependencies: variantDeps.registry,
        files: [
          {
            path: variantFileName(block.slug, variant.id),
            content: variantSource,
            target: "block",
          },
        ],
      });
    }
  }

  // Validate every item (schema + duplicate-name + duplicate-file-path guards).
  assertItemsUnique(items);

  return items;
}

/**
 * Fail loud (before anything ships) when two registry items collide on either
 * their NAME or their on-disk FILE PATH. Also runs the per-item schema check.
 *
 * The NAME guard alone is insufficient: variant items are named `<slug>--<id>`
 * (double dash) but WRITE to a single-dash file `<slug>-<id>.tsx`. A bare block
 * whose slug is literally `<slug>-<id>` (e.g. a real `login-split` block
 * colliding with the variant `login--split`) has a DISTINCT item name yet both
 * carry `files[].path === "login-split.tsx"`, so `writeItemFiles` would silently
 * overwrite one with the other at install/compose time. The path guard rejects
 * that. Exported so the gate is directly unit-testable with synthetic items.
 */
export function assertItemsUnique(items: RegistryItem[]): void {
  const seenNames = new Set<string>();
  const pathOwner = new Map<string, string>();
  for (const item of items) {
    validateItem(item);
    if (seenNames.has(item.name)) {
      throw new Error(`duplicate registry item name: "${item.name}"`);
    }
    seenNames.add(item.name);
    for (const file of item.files) {
      const priorOwner = pathOwner.get(file.path);
      if (priorOwner !== undefined) {
        throw new Error(
          `two registry items resolve to the same file path "${file.path}": ` +
            `"${priorOwner}" and "${item.name}" — a bare block slug must not collide with a ` +
            `variant's single-dash file basename (install-time overwrite).`,
        );
      }
      pathOwner.set(file.path, item.name);
    }
  }
}

/**
 * Serialize items (and, when provided, the metadata sidecar) to the exact file
 * map written to disk: `{ "index.json": "...", "<name>.json": "...", "meta.json":
 * "..." }` — newline-terminated JSON, matching `writeFile` output byte-for-byte
 * so checks can diff in memory. `meta.json` is emitted only when `meta` is passed
 * so the serializer stays a pure function of its inputs (no I/O, deterministic).
 */
export function serializeRegistry(
  items: RegistryItem[],
  meta?: RegistryMeta,
): Record<string, string> {
  const out: Record<string, string> = {};
  const index = items.map(({ name, type, dependencies, registryDependencies }) => ({
    name,
    type,
    dependencies,
    registryDependencies,
  }));
  out["index.json"] = `${JSON.stringify(index, null, 2)}\n`;
  for (const item of items) {
    out[`${item.name}.json`] = `${JSON.stringify(item, null, 2)}\n`;
  }
  if (meta) {
    out[META_FILE] = `${JSON.stringify(meta, null, 2)}\n`;
  }
  return out;
}

export async function writeRegistry(
  targetDir: string,
  items: RegistryItem[],
  meta?: RegistryMeta,
): Promise<void> {
  await mkdir(targetDir, { recursive: true });
  const files = serializeRegistry(items, meta);
  for (const [file, content] of Object.entries(files)) {
    await writeFile(join(targetDir, file), content, "utf8");
  }
}

async function main() {
  const items = await buildItems();
  const meta = await buildMeta(await readBlockSources(), await readVariantSources());
  await writeRegistry(outDir, items, meta);
  console.log(`registry: wrote ${items.length} items + index.json + ${META_FILE} to ${outDir}`);
}

// Only run when invoked directly (not when imported by check-registry.ts).
if (import.meta.main) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
