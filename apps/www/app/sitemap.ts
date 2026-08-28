import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { BLOCK_SLUGS } from "../lib/blocks-index";
import { COMPONENT_SLUGS } from "../lib/components-index";
import { absoluteUrl } from "../lib/site-url";
import { isProTemplate, TEMPLATE_CATALOG } from "../lib/templates/catalog";

/**
 * Sitemap for the whole showcase. Evaluated once at build time (no dynamic
 * APIs), so the filesystem walk below reads the compile-time route tree:
 * top-level static routes and `/docs/*` come straight from the `app/`
 * directory, component/block detail pages come from the same server-safe
 * indices that drive `generateStaticParams`. Adding a page or a slug is
 * therefore picked up on the next build with no edits here.
 */

const APP_DIR = join(process.cwd(), "app");

/** Names of child directories that are real static routes (have a page, not dynamic). */
function staticChildRoutes(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => !entry.name.startsWith("[") && !entry.name.startsWith("("))
    .filter((entry) => existsSync(join(dir, entry.name, "page.tsx")))
    .map((entry) => entry.name)
    .sort();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "weekly",
    priority,
  });

  // /components, /blocks, /docs, /create, /stack, /changelog, ... (+ any future
  // top-level page, e.g. /playground, the moment its page.tsx lands).
  const topLevel = staticChildRoutes(APP_DIR)
    .filter((route) => route !== "pro")
    .map((route) => {
      const isCatalog = route === "components" || route === "blocks" || route === "docs";
      return entry(`/${route}`, isCatalog ? 0.9 : 0.7);
    });

  const docs = staticChildRoutes(join(APP_DIR, "docs")).map((page) => entry(`/docs/${page}`, 0.7));

  const components = COMPONENT_SLUGS.map((slug) => entry(`/components/${slug}`, 0.6));
  const blocks = BLOCK_SLUGS.map((slug) => entry(`/blocks/${slug}`, 0.6));
  const templates = TEMPLATE_CATALOG.filter((entry) => !isProTemplate(entry)).map((item) =>
    entry(`/templates/${item.slug}`, 0.6),
  );

  return [entry("/", 1), ...topLevel, ...docs, ...components, ...blocks, ...templates];
}
