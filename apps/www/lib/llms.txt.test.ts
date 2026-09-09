import { describe, expect, it } from "vitest";
import { ALL_BLOCKS, BLOCK_SLUGS } from "./blocks-index";
import { ALL_COMPONENTS, CATEGORIES, COMPONENT_SLUGS } from "./components-index";
import { DOC_NAV_SECTIONS } from "./docs";
import { buildLlmsFullTxt, buildLlmsTxt, getLlmsCatalogStats } from "./llms";
import { isProTemplate, TEMPLATE_CATALOG } from "./templates/catalog";

describe("llms.txt catalog", () => {
  const txt = buildLlmsTxt();
  const stats = getLlmsCatalogStats();

  it("opens with the product name and a counted summary", () => {
    expect(txt.startsWith("# Cronus UI\n")).toBe(true);
    expect(txt).toContain(
      `> Cronus UI is a product UI system: ${stats.components} React components`,
    );
    expect(txt).toContain(`${stats.blocks} composed blocks (${stats.variants} variants)`);
    expect(txt).toContain(`${stats.templates} OSS app templates`);
    expect(txt).toContain("npx create-cronus-app my-app --template saas");
    expect(txt).toContain("npx -y cronus-ui-mcp");
  });

  it("lists site, documentation, catalog, packages, MCP, and license", () => {
    for (const heading of [
      "## Site",
      "## Documentation",
      `## Components (${stats.components})`,
      `## Blocks (${stats.blocks})`,
      `## Templates (${stats.templates})`,
      "## Packages",
      "## MCP",
      "## License",
    ]) {
      expect(txt).toContain(heading);
    }
  });

  it("links every live docs-nav page", () => {
    for (const section of DOC_NAV_SECTIONS) {
      for (const item of section.items) {
        expect(txt).toContain(`](https://aicronus.com${item.href})`);
      }
    }
  });

  it("lists every component under its category, with a live catalog URL", () => {
    for (const category of CATEGORIES) {
      expect(txt).toContain(`### ${category.name} (${category.items.length})`);
    }
    for (const component of ALL_COMPONENTS) {
      expect(txt).toContain(`/components/${component.slug})`);
    }
    expect(COMPONENT_SLUGS).toHaveLength(stats.components);
  });

  it("lists every block with variants and a live catalog URL", () => {
    for (const block of ALL_BLOCKS) {
      expect(txt).toContain(`/blocks/${block.slug})`);
      if (block.variants && block.variants.length > 1) {
        expect(txt).toContain(`\`${block.variants[0]?.id}\``);
      }
    }
    expect(BLOCK_SLUGS).toHaveLength(stats.blocks);
  });

  it("lists OSS templates and hides Pro compose apps", () => {
    for (const template of TEMPLATE_CATALOG.filter((entry) => !isProTemplate(entry))) {
      expect(txt).toContain(`/templates/${template.slug})`);
    }
    for (const template of TEMPLATE_CATALOG.filter(isProTemplate)) {
      expect(txt).not.toContain(`/templates/${template.slug})`);
    }
    expect(txt).not.toContain("/docs/cursor");
    expect(txt).not.toContain("/docs/grok");
  });

  it("documents stdio and hosted HTTP MCP setup", () => {
    expect(txt).toContain("npx cronus-ui mcp init");
    expect(txt).toContain("claude mcp add cronus-ui -- npx -y cronus-ui-mcp");
    expect(txt).toContain("https://aicronus.com/mcp");
    expect(txt).toContain("https://aicronus.com/docs/mcp");
    expect(txt).toContain('"cronus-ui-mcp"');
    expect(txt).toContain('"servers"');
    expect(txt).toContain("match_catalog");
    expect(txt).toContain("compose_app");
    expect(txt).not.toContain("Not a hosted HTTP MCP");
  });

  it("keeps llms-full.txt as the inlined corpus", () => {
    const full = buildLlmsFullTxt();
    expect(full).toContain("# Cronus UI — full documentation");
    expect(full).toContain("# Button");
    expect(full).toContain("# Login");
  });
});
