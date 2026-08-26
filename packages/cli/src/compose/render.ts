/**
 * The PURE compose renderer. Given a validated plan it emits the generated files:
 * one `page.tsx` per route, one route-group `layout.tsx` per chrome group, and the
 * thin `components/chrome/site-nav.tsx` / `site-footer.tsx` wrappers.
 *
 * GOLDEN RULE: a generated page is ONLY `imports of installed blocks + a <main>
 * stacking them`. This module never emits UI JSX beyond that wrapper (and the
 * chrome layout wrapper, itself just block wrappers). Every visible pixel comes
 * from a registry item.
 *
 * DETERMINISM: a pure function of `(plan, config)` — no `Date`/random, stable
 * ordering — so `registry:check`-style byte-equality and the F4 3-way base hold.
 */

import type { CronusUIConfig } from "../config.js";
import { replaceBrandLiteral, replaceDataSlot } from "./data-slots.js";
import type { ComposePlan, PlanBlock, PlanChrome, PlanExtra, PlanPage } from "./plan.js";

/** A file the composer will write, relative to the project root. */
export interface GeneratedFile {
  /** Project-relative path, e.g. "app/(site)/page.tsx". */
  path: string;
  content: string;
}

/** How the composer customizes one installed chrome block copy (nav data + brand). */
export interface ChromeRewrite {
  /** The chrome block slug (e.g. "navbar"). */
  slug: string;
  /** Project-relative path of the installed block file to rewrite in place. */
  file: string;
  /** The rewritten source (data-slot + brand applied). */
  content: string;
}

/** Everything the composer emits: generated files + the in-place chrome rewrites. */
export interface RenderResult {
  files: GeneratedFile[];
  chromeRewrites: ChromeRewrite[];
}

/** One nav entry derived from a manifest page carrying a `nav` label. */
interface NavLink {
  label: string;
  href: string;
}

/**
 * Turn an App Router route into a page-directory path under a route group. "/" is
 * the group root (empty dir); "/products/[id]" → "products/[id]". Dynamic segments
 * are preserved verbatim (already validated in plan.ts).
 */
function routeToDir(route: string): string {
  const trimmed = route.replace(/^\/+/, "").replace(/\/+$/, "");
  return trimmed;
}

/** Derive a PascalCase component name for a generated page from its route. */
function pageComponentName(route: string): string {
  const dir = routeToDir(route);
  if (dir === "") return "HomePage";
  const parts = dir
    .split("/")
    .map((seg) => seg.replace(/\[(\.\.\.)?([^\]]+)\]/g, "$2")) // [id] / [...slug] → id / slug
    .flatMap((seg) => seg.split(/[-_]/))
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  return `${parts.join("")}Page`;
}

/** Serialize a JS string literal deterministically (double quotes, escaped). */
function jsString(value: string): string {
  return JSON.stringify(value);
}

/** Serialize nav links to a `const NAME = [...]` body (2-space indent, stable). */
function serializeNavLinks(constName: string, links: NavLink[]): string {
  if (links.length === 0) return `const ${constName} = [];`;
  const rows = links
    .map((l) => `  { label: ${jsString(l.label)}, href: ${jsString(l.href)} },`)
    .join("\n");
  return `const ${constName} = [\n${rows}\n];`;
}

/** Serialize the footer columns const (a single "Navigation" column of the nav links). */
function serializeFooterColumns(constName: string, links: NavLink[]): string {
  const inner = links
    .map((l) => `      { label: ${jsString(l.label)}, href: ${jsString(l.href)} },`)
    .join("\n");
  const linksBlock = links.length === 0 ? "[]" : `[\n${inner}\n    ]`;
  return `const ${constName} = [\n  {\n    heading: "Navigation",\n    links: ${linksBlock},\n  },\n];`;
}

/**
 * Serialize the app-shell sidebar nav const (a flat `{ label, href }[]`, same
 * shape as the navbar links). The shell block maps over this const to render the
 * SidebarMenu items, so the composer replaces its body from the (app) group's
 * nav pages. Kept as a plain `const NAME = [...]` (no `as const`) so the emitted
 * data-slot matches the shipped code literal's const exactly.
 */
function serializeAppNav(constName: string, links: NavLink[]): string {
  return serializeNavLinks(constName, links);
}

/**
 * The nav links derived from the plan's pages: every page that carries a `nav`
 * label, in manifest order, linking to its route. Deterministic.
 */
export function navLinksOf(plan: ComposePlan): NavLink[] {
  const links: NavLink[] = [];
  for (const page of plan.pages) {
    if (page.nav !== undefined) links.push({ label: page.nav, href: page.route });
  }
  return links;
}

/**
 * The nav links of the pages under one chrome group (every such page carrying a
 * `nav` label), in manifest order. The app-shell sidebar nav is scoped to its
 * own (app) group's pages — a shell sidebar lists the app sections, not a bare
 * /login page. Falls back to `navLinksOf` shape but filtered by group.
 */
export function navLinksForGroup(plan: ComposePlan, group: string): NavLink[] {
  const links: NavLink[] = [];
  for (const page of plan.pages) {
    if (page.chrome === group && page.nav !== undefined) {
      links.push({ label: page.nav, href: page.route });
    }
  }
  return links;
}

/**
 * The data-const name declared inside a chrome block's data-slot. Kept as an
 * explicit table (not inferred) so the serialized replacement matches the shipped
 * const exactly — the two chrome families F1 supports.
 */
const CHROME_SLOT_CONST: Readonly<Record<string, string>> = {
  "navbar-links": "NAVBAR_LINKS",
  "footer-links": "FOOTER_COLUMNS",
  "app-nav": "APP_NAV",
};

/**
 * Rewrite one installed chrome block copy: inject the real nav links into its
 * data-slot and replace its brand literal(s) with the app brand. `blockSource` is
 * the exact on-disk copy (post-`add`), so the markers/literals are present or the
 * data-slot helpers throw (fail-loud). Pure.
 */
export function rewriteChromeBlock(slug: string, blockSource: string, plan: ComposePlan): string {
  const links = navLinksOf(plan);
  // The (app)-group this chrome block serves, if it is the shell — its sidebar
  // nav is scoped to that group's pages. A navbar/footer slug has no group here.
  const shellGroup = plan.chromes.find((c) => c.block === slug)?.group;
  let out = blockSource;

  for (const slot of plan.dataSlotsBySlug[slug] ?? []) {
    const constName = CHROME_SLOT_CONST[slot];
    if (constName === undefined) {
      // A declared slot with no known serializer is a build/table drift — the
      // markers exist (gated) but we have no data to fill them, so fail loud.
      throw new Error(`chrome block "${slug}": no serializer for data-slot "${slot}"`);
    }
    let body: string;
    if (constName === "FOOTER_COLUMNS") {
      body = serializeFooterColumns(constName, links);
    } else if (constName === "APP_NAV") {
      // Scope the sidebar nav to the shell's own group pages when known.
      const groupLinks = shellGroup !== undefined ? navLinksForGroup(plan, shellGroup) : links;
      body = serializeAppNav(constName, groupLinks);
    } else {
      body = serializeNavLinks(constName, links);
    }
    out = replaceDataSlot(out, slot, body);
  }

  for (const brand of plan.brandTokensBySlug[slug] ?? []) {
    out = replaceBrandLiteral(out, brand.literal, plan.choices.brand);
  }

  return out;
}

/**
 * The blocks-alias import base for a block. The installed file is named after the
 * item with the `--` variant separator collapsed to a single dash
 * (`login--split` → `login-split.tsx`), so the import must match that file
 * basename: the bare `<slug>` for the default variant, or `<slug>-<variant>` for
 * a non-default one. Built from slug+variant (not by munging the item name) so
 * it always agrees with the registry's `<slug>-<variantId>.tsx` file name.
 */
export function blockImportBase(block: { slug: string; variant?: string }): string {
  return block.variant === undefined ? block.slug : `${block.slug}-${block.variant}`;
}

/** Import specifier for a block via the consumer's blocks alias. */
function blockImport(config: CronusUIConfig, importBase: string): string {
  return `${config.aliases.blocks}/${importBase}`;
}

/** Render a single page.tsx: imports of its blocks + a <main> stacking them. */
export function renderPage(page: PlanPage, config: CronusUIConfig): string {
  // De-dupe imports by exportName (a page may legitimately repeat a section, but
  // it must be imported once); keep first-seen order for determinism.
  const imports: string[] = [];
  const seen = new Set<string>();
  for (const block of page.blocks) {
    if (seen.has(block.exportName)) continue;
    seen.add(block.exportName);
    imports.push(
      `import { ${block.exportName} } from ${jsString(blockImport(config, blockImportBase(block)))};`,
    );
  }
  const importLines = imports.join("\n");

  const componentName = pageComponentName(page.route);
  const stack = page.blocks.map((b) => `      <${b.exportName} />`).join("\n");

  // Page-kind blocks are full-page surfaces; when a route renders a single page
  // block, center it. Otherwise stack sections in a plain column.
  const single = page.blocks.length === 1 && page.blocks[0]?.kind === "page";
  const mainClass = single
    ? "flex min-h-svh flex-col items-center justify-center"
    : "flex min-h-svh flex-col";

  return [
    importLines,
    "",
    `export const metadata = { title: ${jsString(page.title)} };`,
    "",
    `export default function ${componentName}() {`,
    "  return (",
    `    <main className=${jsString(mainClass)}>`,
    stack,
    "    </main>",
    "  );",
    "}",
    "",
  ].join("\n");
}

/** Path of a page.tsx under its chrome route group. */
export function pagePath(page: PlanPage): string {
  const dir = routeToDir(page.route);
  const group = `(${page.chrome})`;
  return dir === "" ? `app/${group}/page.tsx` : `app/${group}/${dir}/page.tsx`;
}

/** Import path from a route-group layout to a chrome wrapper via the blocks alias. */
function chromeWrapperImport(config: CronusUIConfig, name: string): string {
  // Wrappers live under the blocks path in a `chrome/` subdir; import via the
  // blocks alias so the consumer's tsconfig path mapping resolves them.
  return `${config.aliases.blocks}/chrome/${name}`;
}

/**
 * Render a route-group layout for a chrome group:
 *   - site  = navbar + footer thin wrappers around a flex column;
 *   - shell = the AppShellNav thin wrapper (sidebar + header) around {children};
 *   - bare  = a passthrough layout (centered pages own their own frame).
 */
export function renderLayout(chrome: PlanChrome, config: CronusUIConfig): string {
  const hasNav = chrome.navbar !== undefined;
  const hasFooter = chrome.footer !== undefined;
  const hasShell = chrome.block !== undefined;

  if (hasShell) {
    // App-shell group: the whole page frame is the shell block (sidebar + header
    // wrapping {children}). The layout is a thin wrapper import + a single
    // <AppShellNav> — no invented UI, mirroring the (site) SiteNav/SiteFooter
    // pattern. The generated page still owns the one <main> inside {children}.
    return [
      `import type { ReactNode } from "react";`,
      `import { AppShellNav } from ${jsString(chromeWrapperImport(config, "app-shell"))};`,
      "",
      `export default function ${layoutComponentName(chrome.group)}({ children }: { children: ReactNode }) {`,
      "  return <AppShellNav>{children}</AppShellNav>;",
      "}",
      "",
    ].join("\n");
  }

  if (!hasNav && !hasFooter) {
    // Bare/centered group: no chrome furniture, just a passthrough layout so the
    // route group is a real segment (keeps auth/checkout off the site chrome).
    return [
      `import type { ReactNode } from "react";`,
      "",
      `export default function ${layoutComponentName(chrome.group)}({ children }: { children: ReactNode }) {`,
      "  return <>{children}</>;",
      "}",
      "",
    ].join("\n");
  }

  const imports = [`import type { ReactNode } from "react";`];
  if (hasNav)
    imports.push(`import { SiteNav } from ${jsString(chromeWrapperImport(config, "site-nav"))};`);
  if (hasFooter)
    imports.push(
      `import { SiteFooter } from ${jsString(chromeWrapperImport(config, "site-footer"))};`,
    );

  const body: string[] = [];
  body.push(`    <div className="flex min-h-svh flex-col">`);
  if (hasNav) body.push("      <SiteNav />");
  body.push(`      <div className="flex-1">{children}</div>`);
  if (hasFooter) body.push("      <SiteFooter />");
  body.push("    </div>");

  return [
    imports.join("\n"),
    "",
    `export default function ${layoutComponentName(chrome.group)}({ children }: { children: ReactNode }) {`,
    "  return (",
    body.join("\n"),
    "  );",
    "}",
    "",
  ].join("\n");
}

/** PascalCase layout component name for a chrome group. */
function layoutComponentName(group: string): string {
  const pascal = group
    .split(/[-_]/)
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return `${pascal}Layout`;
}

/** Path of a chrome route-group layout. */
export function layoutPath(chrome: PlanChrome): string {
  return `app/(${chrome.group})/layout.tsx`;
}

/**
 * Render a thin chrome wrapper: a named re-export of the installed block's default
 * export, so the layout imports a stable `SiteNav`/`SiteFooter` while the visual
 * source stays the (customized) installed block. GOLDEN-RULE compliant: pure
 * re-export, no new UI.
 */
export function renderChromeWrapper(
  exportAs: string,
  blockSlug: string,
  blockExportName: string,
  config: CronusUIConfig,
): string {
  return [
    `import { ${blockExportName} } from ${jsString(blockImport(config, blockSlug))};`,
    "",
    `export function ${exportAs}() {`,
    `  return <${blockExportName} />;`,
    "}",
    "",
  ].join("\n");
}

/**
 * Render the thin app-shell wrapper: a `children`-forwarding component that wraps
 * the layout's {children} in the installed shell chrome block. Unlike SiteNav/
 * SiteFooter (which render standalone furniture), the shell composes the page
 * content, so this wrapper takes + forwards `children`. GOLDEN-RULE compliant:
 * imports the installed block and forwards children — no new UI. Pure.
 */
export function renderShellWrapper(
  exportAs: string,
  blockSlug: string,
  blockExportName: string,
  config: CronusUIConfig,
): string {
  return [
    `import type { ReactNode } from "react";`,
    `import { ${blockExportName} } from ${jsString(blockImport(config, blockSlug))};`,
    "",
    `export function ${exportAs}({ children }: { children: ReactNode }) {`,
    `  return <${blockExportName}>{children}</${blockExportName}>;`,
    "}",
    "",
  ].join("\n");
}

/** Path of a chrome wrapper file under the blocks path. */
export function chromeWrapperPath(config: CronusUIConfig, name: string): string {
  return `${config.paths.blocks}/chrome/${name}.tsx`;
}

/**
 * Render a Next special-file wrapper page for an `extras` block (e.g.
 * `app/not-found.tsx`). GOLDEN-RULE compliant: imports the installed page-kind
 * block and centers it in a single `<main>` — no new UI. The component name is
 * PascalCase(key)Page (e.g. "not-found" → NotFoundPage). Pure.
 */
export function renderExtra(extra: PlanExtra, config: CronusUIConfig): string {
  const componentName = `${extra.key
    .split(/[-_]/)
    .filter((s) => s.length > 0)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("")}Page`;
  return [
    `import { ${extra.exportName} } from ${jsString(blockImport(config, extra.slug))};`,
    "",
    `export default function ${componentName}() {`,
    "  return (",
    `    <main className="flex min-h-svh flex-col items-center justify-center">`,
    `      <${extra.exportName} />`,
    "    </main>",
    "  );",
    "}",
    "",
  ].join("\n");
}

/**
 * Render the whole plan into files. Deterministic ordering: chrome rewrites by
 * slug, then wrappers, then layouts (by group), then pages (manifest order),
 * then Next special-file extras (by key). The caller writes them; nothing here
 * touches the filesystem.
 *
 * NOTE: the app brand reaches every visible surface via the brandTokens
 * literal-replacement path ({@link rewriteChromeBlock} → replaceBrandLiteral in
 * the chrome navbar/footer/hero) — NOT via a generated `lib/brand.ts`. The demo
 * libs (`demo-store`/`demo-saas`) carry their own standalone `BRAND` default for
 * the storefront/dashboard demo name; compose does not override it.
 */
export function renderPlan(plan: ComposePlan, config: CronusUIConfig): RenderResult {
  const files: GeneratedFile[] = [];
  const chromeRewrites: ChromeRewrite[] = [];

  // 1. Chrome block rewrites (in-place customization of installed copies).
  for (const slug of plan.chromeSlugs) {
    const source = plan.chromeSources[slug];
    if (source === undefined) continue;
    chromeRewrites.push({
      slug,
      file: `${config.paths.blocks}/${slug}.tsx`,
      content: rewriteChromeBlock(slug, source, plan),
    });
  }

  // 2. Thin chrome wrappers (SiteNav / SiteFooter), only for chrome actually used.
  if (plan.usesNavbar && plan.navbarExportName !== undefined && plan.navbarSlug !== undefined) {
    files.push({
      path: chromeWrapperPath(config, "site-nav"),
      content: renderChromeWrapper("SiteNav", plan.navbarSlug, plan.navbarExportName, config),
    });
  }
  if (plan.usesFooter && plan.footerExportName !== undefined && plan.footerSlug !== undefined) {
    files.push({
      path: chromeWrapperPath(config, "site-footer"),
      content: renderChromeWrapper("SiteFooter", plan.footerSlug, plan.footerExportName, config),
    });
  }
  // The app-shell wrapper (AppShellNav): a children-forwarding thin wrapper the
  // (app)-group layout imports, only when a group uses the shell.
  if (plan.usesShell && plan.shellExportName !== undefined && plan.shellSlug !== undefined) {
    files.push({
      path: chromeWrapperPath(config, "app-shell"),
      content: renderShellWrapper("AppShellNav", plan.shellSlug, plan.shellExportName, config),
    });
  }

  // 3. Route-group layouts, one per chrome group used (stable by group name).
  for (const chrome of plan.chromes) {
    files.push({ path: layoutPath(chrome), content: renderLayout(chrome, config) });
  }

  // 4. Pages, in manifest order.
  for (const page of plan.pages) {
    files.push({ path: pagePath(page), content: renderPage(page, config) });
  }

  // 5. Next special-file wrappers from `extras` (sorted by key in the plan).
  for (const extra of plan.extras) {
    files.push({ path: extra.file, content: renderExtra(extra, config) });
  }

  return { files, chromeRewrites };
}

export type { PlanBlock };
