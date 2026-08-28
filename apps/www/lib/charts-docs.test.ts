import { describe, expect, it } from "vitest";
import { CHART_DOCS, chartDocsTocItems, componentAnchor, getChartDocs } from "./charts-docs";
import { CATEGORIES } from "./components-index";
import { EXAMPLE_SECTIONS } from "./examples/sections";

const namedChartSlugs = (CATEGORIES.find((category) => category.slug === "charts")?.items ?? [])
  .map((item) => item.slug)
  .filter((slug) => slug !== "chart");

describe("chart docs catalog", () => {
  it("covers every named chart slug", () => {
    expect(namedChartSlugs.length).toBeGreaterThan(0);
    for (const slug of namedChartSlugs) {
      expect(getChartDocs(slug), slug).toBeDefined();
    }
  });

  it("does not document the recharts Chart primitive as a Motion page", () => {
    expect(getChartDocs("chart")).toBeUndefined();
  });

  it("gives each page installation, usage, components, data, theming, deps", () => {
    for (const doc of Object.values(CHART_DOCS)) {
      expect(doc.motionImports.length, doc.slug).toBeGreaterThan(0);
      expect(doc.defaultUsage, doc.slug).toContain("@cronus-ui/ui");
      expect(doc.motionUsage, doc.slug).toContain("@cronus-ui/ui/charts");
      expect(doc.components.length, doc.slug).toBeGreaterThan(0);
      expect(doc.dataFormat.length, doc.slug).toBeGreaterThan(0);
      expect(doc.theming, doc.slug).toMatch(/--chart-/);
      expect(doc.dependencies.length, doc.slug).toBeGreaterThan(0);
    }
  });

  it("builds unique component anchors for the TOC", () => {
    for (const doc of Object.values(CHART_DOCS)) {
      const anchors = doc.components.map((component) => componentAnchor(component.name));
      expect(new Set(anchors).size, doc.slug).toBe(anchors.length);
    }
  });

  it("does not collide extra-section ids with example anchors", () => {
    const reserved = new Set([
      "installation",
      "usage",
      "components",
      "data-format",
      "theming",
      "dependencies",
      "props",
      "import",
    ]);
    for (const doc of Object.values(CHART_DOCS)) {
      const exampleIds = new Set((EXAMPLE_SECTIONS[doc.slug] ?? []).map((section) => section.id));
      for (const extra of doc.extraSections ?? []) {
        expect(exampleIds.has(extra.id), `${doc.slug} extra "${extra.id}"`).toBe(false);
        expect(reserved.has(extra.id), `${doc.slug} extra "${extra.id}"`).toBe(false);
      }
    }
  });

  it("nests component names under Components in the TOC", () => {
    const toc = chartDocsTocItems("choropleth-chart");
    const titles = toc.map((item) => item.title);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Installation",
        "Usage",
        "Components",
        "Data format",
        "Theming",
        "Dependencies",
      ]),
    );
    const components = toc.find((item) => item.id === "components");
    expect(components?.children?.map((child) => child.title)).toEqual([
      "ChoroplethChart",
      "ChoroplethFeatureComponent",
      "ChoroplethGraticule",
      "ChoroplethTooltip",
    ]);
  });
});
