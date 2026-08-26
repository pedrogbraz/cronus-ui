/**
 * Builders for the AI-legible doc surface: /llms.txt, /llms-full.txt, and the
 * /llms/<section>/<slug>.md markdown mirrors of every component, block, and
 * guide page.
 *
 * Everything here runs at BUILD time (the routes are force-static). Example
 * code is lifted from `lib/examples/<family>.tsx` with the TypeScript compiler
 * API — never importing/executing those client modules (same technique as
 * scripts/build-props.ts) — and block sources come from the committed registry
 * items, i.e. exactly what `npx cronus-ui add <slug>` installs.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";
import { ALL_BLOCKS, BLOCK_CATEGORIES, getBlockMeta } from "./blocks-index";
import { ALL_COMPONENTS, getComponentDisplayName, getComponentMeta } from "./components-index";
import {
  ACCESSIBILITY_CHECKS,
  CHANGELOG_ENTRIES,
  DOC_NAV_SECTIONS,
  FRAMEWORKS,
  INSTALL_OPTIONS,
  PACKAGE_MANAGERS,
} from "./docs";
import { COMPONENT_PROPS, type PropsDoc } from "./props.generated";
import { absoluteUrl } from "./site-url";

/* -------------------------------------------------------------------------- */
/*  Filesystem roots                                                          */
/* -------------------------------------------------------------------------- */

/**
 * `next build` runs with cwd = apps/www under turbo, but tolerate a repo-root
 * invocation so the extraction never silently reads the wrong tree.
 */
function appRoot(): string {
  const cwd = process.cwd();
  for (const candidate of [cwd, join(cwd, "apps/www")]) {
    if (existsSync(join(candidate, "lib", "examples"))) return candidate;
  }
  throw new Error(`llms: could not locate apps/www from ${cwd}`);
}

function repoRoot(): string {
  return resolve(appRoot(), "../..");
}

/* -------------------------------------------------------------------------- */
/*  Example extraction (TS compiler API — no module execution)                */
/* -------------------------------------------------------------------------- */

export interface ExtractedExample {
  title: string;
  description?: string;
  /** The exact snippet shown in the docs code block. */
  code: string;
  /** Registry item to install when it differs from the component slug. */
  registryItem?: string;
}

/** The family modules that own every `ExampleMap` (see lib/examples/registry.ts). */
const EXAMPLE_FAMILIES = [
  "buttons",
  "forms",
  "data-display",
  "feedback",
  "overlays",
  "navigation",
  "date-time",
  "charts",
  "premium",
] as const;

function propertyKey(name: ts.PropertyName): string | undefined {
  return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : undefined;
}

/**
 * Resolve a string-valued initializer: inline strings and templates directly,
 * identifiers through the file's top-level template consts (the house pattern
 * for long block/example sources).
 */
function literalText(
  node: ts.Expression,
  templateConsts: Map<string, string>,
  sourceFile: ts.SourceFile,
): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node)) return templateConsts.get(node.text);
  if (ts.isTemplateExpression(node)) {
    // Escaped-only interpolation: keep the authored text, drop the escapes.
    return node
      .getText(sourceFile)
      .slice(1, -1)
      .replace(/\\([`$\\])/g, "$1");
  }
  return undefined;
}

/** Top-level `const x = \`…\`` values, so `code: someConst` resolves. */
function topLevelTemplateConsts(sourceFile: ts.SourceFile): Map<string, string> {
  const consts = new Map<string, string>();
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        ts.isNoSubstitutionTemplateLiteral(declaration.initializer)
      ) {
        consts.set(declaration.name.text, declaration.initializer.text);
      }
    }
  }
  return consts;
}

function readExample(
  node: ts.ObjectLiteralExpression,
  templateConsts: Map<string, string>,
  sourceFile: ts.SourceFile,
): ExtractedExample | undefined {
  let title: string | undefined;
  let description: string | undefined;
  let code: string | undefined;
  let registryItem: string | undefined;

  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = propertyKey(prop.name);
    if (key === "title") title = literalText(prop.initializer, templateConsts, sourceFile);
    else if (key === "description")
      description = literalText(prop.initializer, templateConsts, sourceFile);
    else if (key === "code") code = literalText(prop.initializer, templateConsts, sourceFile);
    else if (key === "install" && ts.isObjectLiteralExpression(prop.initializer)) {
      for (const installProp of prop.initializer.properties) {
        if (
          ts.isPropertyAssignment(installProp) &&
          propertyKey(installProp.name) === "registryItem"
        ) {
          registryItem = literalText(installProp.initializer, templateConsts, sourceFile);
        }
      }
    }
  }

  if (!title || !code) return undefined;
  return { title, description, code, registryItem };
}

/** Extract every `export const …: ExampleMap = { slug: [ … ] }` in one file. */
function extractExampleMap(fileName: string): Record<string, ExtractedExample[]> {
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const templateConsts = topLevelTemplateConsts(sourceFile);
  const out: Record<string, ExtractedExample[]> = {};

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        !declaration.type ||
        !ts.isTypeReferenceNode(declaration.type) ||
        declaration.type.typeName.getText(sourceFile) !== "ExampleMap" ||
        !declaration.initializer ||
        !ts.isObjectLiteralExpression(declaration.initializer)
      ) {
        continue;
      }
      for (const prop of declaration.initializer.properties) {
        if (!ts.isPropertyAssignment(prop) || !ts.isArrayLiteralExpression(prop.initializer)) {
          continue;
        }
        const slug = propertyKey(prop.name);
        if (!slug) continue;
        const examples: ExtractedExample[] = [];
        for (const element of prop.initializer.elements) {
          if (!ts.isObjectLiteralExpression(element)) continue;
          const example = readExample(element, templateConsts, sourceFile);
          if (example) examples.push(example);
        }
        if (examples.length > 0) out[slug] = examples;
      }
    }
  }
  return out;
}

let exampleCache: Record<string, ExtractedExample[]> | undefined;

/** slug → its documented examples, extracted once per build. */
export function getExamplesBySlug(): Record<string, ExtractedExample[]> {
  if (!exampleCache) {
    const out: Record<string, ExtractedExample[]> = {};
    for (const family of EXAMPLE_FAMILIES) {
      Object.assign(out, extractExampleMap(join(appRoot(), "lib", "examples", `${family}.tsx`)));
    }
    exampleCache = out;
  }
  return exampleCache;
}

/* -------------------------------------------------------------------------- */
/*  Registry + packages                                                       */
/* -------------------------------------------------------------------------- */

interface RegistryItem {
  name: string;
  type: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; content: string; target?: string }[];
}

const registryCache = new Map<string, RegistryItem | undefined>();

function readRegistryItem(slug: string): RegistryItem | undefined {
  if (!registryCache.has(slug)) {
    const file = join(repoRoot(), "registry", `${slug}.json`);
    registryCache.set(
      slug,
      existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as RegistryItem) : undefined,
    );
  }
  return registryCache.get(slug);
}

/** The nine publishables, in the changelog's lockstep order. */
const PACKAGE_DIRS = [
  "tokens",
  "theme",
  "ui",
  "stack",
  "ai-kit",
  "cli",
  "create-cronus-app",
  "create-cronus-stack",
  "mcp",
] as const;

let packageCache: { name: string; description: string }[] | undefined;

/** npm name + one-liner for every publishable, read from its package.json. */
export function getPackages(): { name: string; description: string }[] {
  if (!packageCache) {
    packageCache = PACKAGE_DIRS.map((dir) => {
      const pkg = JSON.parse(
        readFileSync(join(repoRoot(), "packages", dir, "package.json"), "utf8"),
      ) as { name: string; description?: string };
      return { name: pkg.name, description: pkg.description ?? "" };
    });
  }
  return packageCache;
}

/* -------------------------------------------------------------------------- */
/*  Markdown helpers                                                          */
/* -------------------------------------------------------------------------- */

/** Inline code span, with pipes escaped so union types survive GFM tables. */
function codeSpan(value: string): string {
  return `\`${value.replace(/\s+/g, " ").replace(/\|/g, "\\|")}\``;
}

/** Plain table cell: single line, pipes escaped. */
function tableCell(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
}

function fencedCode(code: string, language: string): string[] {
  return [`\`\`\`${language}`, code, "```", ""];
}

function propsSection(doc: PropsDoc): string[] {
  const lines: string[] = [`### ${doc.interfaceName}`, ""];
  if (doc.extends) lines.push(`${doc.extends}.`, "");
  if (doc.props.length === 0) {
    lines.push("No own props beyond the extended type.", "");
    return lines;
  }
  lines.push("| Prop | Type | Default | Description |", "| --- | --- | --- | --- |");
  for (const prop of doc.props) {
    const name = `${codeSpan(prop.name)}${prop.required ? " (required)" : ""}`;
    const defaultValue = prop.default ? codeSpan(prop.default) : "—";
    lines.push(
      `| ${name} | ${codeSpan(prop.type)} | ${defaultValue} | ${tableCell(prop.description ?? "")} |`,
    );
  }
  lines.push("");
  return lines;
}

function dependencyLines(item: RegistryItem | undefined): string[] {
  if (!item) return [];
  const lines: string[] = [];
  if (item.dependencies?.length) {
    lines.push(`Package dependencies: ${item.dependencies.map(codeSpan).join(", ")}.`, "");
  }
  if (item.registryDependencies?.length) {
    lines.push(
      `Registry dependencies (installed automatically): ${item.registryDependencies
        .map(codeSpan)
        .join(", ")}.`,
      "",
    );
  }
  return lines;
}

/* -------------------------------------------------------------------------- */
/*  Per-page markdown builders                                                */
/* -------------------------------------------------------------------------- */

/** Full markdown doc for one component, or undefined for unknown slugs. */
export function componentMarkdown(slug: string): string | undefined {
  const meta = getComponentMeta(slug);
  if (!meta) return undefined;

  const displayName = getComponentDisplayName(meta.name);
  const examples = getExamplesBySlug()[slug] ?? [];
  const propsDocs = COMPONENT_PROPS[slug] ?? [];

  const lines: string[] = [
    `# ${displayName}`,
    "",
    meta.description,
    "",
    `- Category: ${meta.category}`,
    `- Interactive docs: ${absoluteUrl(`/components/${slug}`)}`,
    "",
    "## Install",
    "",
    ...fencedCode(`npx cronus-ui add ${slug}`, "bash"),
    ...fencedCode(`import { ${meta.importName ?? meta.name} } from "@cronus-ui/ui";`, "tsx"),
    ...dependencyLines(readRegistryItem(slug)),
  ];

  if (examples.length > 0) {
    lines.push("## Examples", "");
    for (const example of examples) {
      lines.push(`### ${example.title}`, "");
      if (example.description) lines.push(example.description, "");
      if (example.registryItem && example.registryItem !== slug) {
        lines.push(...fencedCode(`npx cronus-ui add ${example.registryItem}`, "bash"));
      }
      lines.push(...fencedCode(example.code, "tsx"));
    }
  }

  if (propsDocs.length > 0) {
    lines.push("## API reference", "");
    lines.push("Generated from the component's exported types.", "");
    for (const doc of propsDocs) lines.push(...propsSection(doc));
  }

  lines.push("---", "", `Live preview: ${absoluteUrl(`/components/${slug}`)}`);
  return `${lines.join("\n")}\n`;
}

/** Full markdown doc for one block; `includeSource` embeds the registry source. */
export function blockMarkdown(slug: string, includeSource = true): string | undefined {
  const meta = getBlockMeta(slug);
  if (!meta) return undefined;

  const item = readRegistryItem(slug);
  const lines: string[] = [
    `# ${meta.name}`,
    "",
    meta.description,
    "",
    `- Category: ${meta.category}`,
    `- Interactive preview: ${absoluteUrl(`/blocks/${slug}`)}`,
    "",
    "## Install",
    "",
    ...fencedCode(`npx cronus-ui add ${slug}`, "bash"),
    ...dependencyLines(item),
  ];

  if (meta.variants?.length) {
    lines.push("## Variants", "");
    for (const variant of meta.variants) {
      lines.push(`- ${variant.name} (\`${variant.id}\`): ${variant.description}`);
    }
    lines.push("");
  }

  if (item && includeSource) {
    lines.push("## Source", "");
    lines.push("The exact files the CLI installs.", "");
    for (const file of item.files) {
      lines.push(`### ${file.path}`, "", ...fencedCode(file.content.trimEnd(), "tsx"));
    }
  } else if (item) {
    lines.push(`Full source: ${absoluteUrl(`/llms/blocks/${slug}.md`)}`, "");
  }

  lines.push("---", "", `Live preview: ${absoluteUrl(`/blocks/${slug}`)}`);
  return `${lines.join("\n")}\n`;
}

/* -------------------------------------------------------------------------- */
/*  Guide pages                                                               */
/* -------------------------------------------------------------------------- */

interface GuidePage {
  slug: string;
  label: string;
  href: string;
  description: string;
}

/** The guide pages mirrored under /llms/docs/<slug>.md. */
export function getGuidePages(): GuidePage[] {
  const pages: GuidePage[] = [];
  for (const section of DOC_NAV_SECTIONS) {
    for (const item of section.items) {
      // The catalogs get their own llms.txt sections; skip their overview pages.
      if (item.href === "/components") continue;
      const slug = item.href === "/docs" ? "index" : item.href.replace(/^\/(?:docs\/)?/, "");
      pages.push({ slug, label: item.label, href: item.href, description: item.description });
    }
  }
  return pages;
}

/**
 * Structured extras per guide, sourced from the same server-safe constants
 * that render the pages. Guides whose body is TSX-authored prose stay as a
 * summary + link — the markdown mirror never paraphrases what it can't quote.
 */
function guideExtras(slug: string): string[] {
  switch (slug) {
    case "index": {
      const lines = [
        "Cronus UI is distributed two ways: as npm packages (`@cronus-ui/ui` + `@cronus-ui/tokens` + `@cronus-ui/theme`) or as source copied into your project through the shadcn-style registry (`npx cronus-ui add <slug>`).",
        "",
        "## Packages",
        "",
      ];
      for (const pkg of getPackages()) lines.push(`- \`${pkg.name}\`: ${pkg.description}`);
      lines.push("");
      return lines;
    }
    case "getting-started":
    case "cli": {
      const lines = ["## Commands", ""];
      for (const pm of PACKAGE_MANAGERS) {
        lines.push(
          `### ${pm.label}`,
          "",
          ...fencedCode(
            `${pm.create}\n${pm.compose}\n${pm.addPage}\n${pm.upgrade}\n${pm.init}\n${pm.add}`,
            "bash",
          ),
        );
      }
      return lines;
    }
    case "installation": {
      const lines = ["## Paths", ""];
      for (const option of INSTALL_OPTIONS) {
        lines.push(`- ${option.title} (${absoluteUrl(option.href)}): ${option.description}`);
      }
      lines.push("", "## Scaffold, compose, add-page, upgrade, init, and add", "");
      for (const pm of PACKAGE_MANAGERS) {
        lines.push(
          `### ${pm.label}`,
          "",
          ...fencedCode(
            `${pm.create}\n${pm.compose}\n${pm.addPage}\n${pm.upgrade}\n${pm.init}\n${pm.add}`,
            "bash",
          ),
        );
      }
      return lines;
    }
    case "frameworks": {
      const lines: string[] = [];
      for (const framework of FRAMEWORKS) {
        lines.push(`## ${framework.name}`, "", framework.description, "");
        lines.push(...fencedCode(framework.command, "bash"));
        lines.push("Checks:", "");
        for (const check of framework.checks) lines.push(`- ${check}`);
        lines.push("");
      }
      return lines;
    }
    case "accessibility": {
      const lines = ["## What every component is checked against", ""];
      for (const check of ACCESSIBILITY_CHECKS)
        lines.push(`- ${check.title}: ${check.description}`);
      lines.push("");
      return lines;
    }
    case "changelog": {
      const lines: string[] = [];
      for (const entry of CHANGELOG_ENTRIES) {
        lines.push(`## ${entry.version} — ${entry.title} (${entry.status}, ${entry.date})`, "");
        lines.push(entry.summary, "");
        for (const item of entry.items) lines.push(`- ${item}`);
        lines.push("");
      }
      return lines;
    }
    case "blocks": {
      const lines = ["## Block families", ""];
      for (const category of BLOCK_CATEGORIES) {
        const links = category.items
          .map((block) => `[${block.name}](${absoluteUrl(`/llms/blocks/${block.slug}.md`)})`)
          .join(", ");
        lines.push(`- ${category.name}: ${links}`);
      }
      lines.push("");
      return lines;
    }
    default:
      return [];
  }
}

/** Markdown mirror of one guide page, or undefined for unknown slugs. */
export function guideMarkdown(slug: string): string | undefined {
  const page = getGuidePages().find((candidate) => candidate.slug === slug);
  if (!page) return undefined;

  const lines: string[] = [
    `# ${page.label} — Cronus UI`,
    "",
    page.description,
    "",
    ...guideExtras(slug),
    "---",
    "",
    `Full guide with live examples: ${absoluteUrl(page.href)}`,
  ];
  return `${lines.join("\n")}\n`;
}

/* -------------------------------------------------------------------------- */
/*  Top-level documents                                                       */
/* -------------------------------------------------------------------------- */

function summaryBlockquote(): string {
  return `> Cronus UI is a product UI system: themeable, accessible React components, design tokens, a runtime theming engine (Radix + CVA + Tailwind v4), and a compose path that turns validated blocks into apps — grow with add-page, then \`upgrade --all\`. Install from npm (\`@cronus-ui/ui\`) or copy source with \`npx cronus-ui add <slug>\`. Canonical start: \`npx create-cronus-app my-app --template saas\`.`;
}

/** The /llms.txt index, in the llms.txt spec format. */
export function buildLlmsTxt(): string {
  const lines: string[] = [
    "# Cronus UI",
    "",
    summaryBlockquote(),
    "",
    `Every page below is mirrored as plain markdown at the linked \`.md\` URL. The whole corpus in one file: ${absoluteUrl("/llms-full.txt")}.`,
    "",
    "## Docs",
    "",
  ];

  for (const page of getGuidePages()) {
    lines.push(
      `- [${page.label}](${absoluteUrl(`/llms/docs/${page.slug}.md`)}): ${page.description}`,
    );
  }

  lines.push("", "## Components", "");
  for (const component of ALL_COMPONENTS) {
    lines.push(
      `- [${getComponentDisplayName(component.name)}](${absoluteUrl(
        `/llms/components/${component.slug}.md`,
      )}): ${component.description}`,
    );
  }

  lines.push("", "## Blocks", "");
  for (const block of ALL_BLOCKS) {
    lines.push(
      `- [${block.name}](${absoluteUrl(`/llms/blocks/${block.slug}.md`)}): ${block.description}`,
    );
  }

  lines.push("", "## Packages", "");
  for (const pkg of getPackages()) {
    lines.push(`- [${pkg.name}](https://www.npmjs.com/package/${pkg.name}): ${pkg.description}`);
  }

  lines.push(
    "",
    "## Optional",
    "",
    `- [llms-full.txt](${absoluteUrl("/llms-full.txt")}): every guide and component doc inlined in one file.`,
    `- [Interactive showcase](${absoluteUrl("/")}): the live site with previews, theming, and the stack builder.`,
  );
  return `${lines.join("\n")}\n`;
}

/**
 * The /llms-full.txt corpus: every guide and component doc embedded whole;
 * blocks embedded without their (large) sources, which stay one fetch away
 * at their own .md URL.
 */
export function buildLlmsFullTxt(): string {
  const parts: string[] = [
    `# Cronus UI — full documentation\n\n${summaryBlockquote()}\n\nThis file inlines every guide and component doc. Block docs are inlined without their full sources — each links its own markdown mirror.\n`,
  ];

  for (const page of getGuidePages()) {
    const doc = guideMarkdown(page.slug);
    if (doc) parts.push(doc);
  }
  for (const component of ALL_COMPONENTS) {
    const doc = componentMarkdown(component.slug);
    if (doc) parts.push(doc);
  }
  for (const block of ALL_BLOCKS) {
    const doc = blockMarkdown(block.slug, false);
    if (doc) parts.push(doc);
  }

  return parts.join("\n---\n\n");
}

/* -------------------------------------------------------------------------- */
/*  Catch-all routing                                                         */
/* -------------------------------------------------------------------------- */

/** Static params for /llms/[...slug]: every mirrored markdown page. */
export function markdownStaticParams(): { slug: string[] }[] {
  return [
    ...getGuidePages().map((page) => ({ slug: ["docs", `${page.slug}.md`] })),
    ...ALL_COMPONENTS.map((component) => ({ slug: ["components", `${component.slug}.md`] })),
    ...ALL_BLOCKS.map((block) => ({ slug: ["blocks", `${block.slug}.md`] })),
  ];
}

/** Resolve /llms/<section>/<slug>.md to its markdown, or undefined → 404. */
export function markdownForPath(segments: string[]): string | undefined {
  const [section, file] = segments;
  if (segments.length !== 2 || section === undefined || file === undefined) return undefined;
  if (!file.endsWith(".md")) return undefined;
  const slug = file.slice(0, -".md".length);
  if (slug.length === 0) return undefined;

  if (section === "components") return componentMarkdown(slug);
  if (section === "blocks") return blockMarkdown(slug);
  if (section === "docs") return guideMarkdown(slug);
  return undefined;
}
