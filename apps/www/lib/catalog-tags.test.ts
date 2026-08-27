import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BLOCK_CATEGORIES } from "./blocks-index";
import {
  type CatalogKind,
  INTENTS,
  isDesignStyle,
  isIntent,
  isMotion,
  isPalette,
  resolveCatalogTags,
} from "./catalog-tags";
import { CATEGORIES } from "./components-index";

function assertTags(
  slug: string,
  category: string,
  kind: Exclude<CatalogKind, "variant">,
  variantId?: string,
) {
  const tags = resolveCatalogTags({ slug, category, kind, variantId });
  expect(isDesignStyle(tags.style), `${slug} style`).toBe(true);
  expect(isPalette(tags.palette), `${slug} palette`).toBe(true);
  expect(isMotion(tags.motion), `${slug} motion`).toBe(true);
  expect(tags.intents.length).toBeGreaterThan(0);
  for (const intent of tags.intents) {
    expect(isIntent(intent), `${slug} intent ${intent}`).toBe(true);
  }
  expect(new Set(tags.intents).size).toBe(tags.intents.length);
  expect(INTENTS.length).toBeGreaterThan(8);
}

describe("catalog tags", () => {
  it("tags every documented component with a closed vocabulary", () => {
    for (const category of CATEGORIES) {
      for (const item of category.items) {
        assertTags(item.slug, category.slug, "component");
      }
    }
  });

  it("tags every block and declared variant", () => {
    for (const category of BLOCK_CATEGORIES) {
      for (const item of category.items) {
        assertTags(item.slug, category.slug, "block");
        for (const variant of item.variants ?? []) {
          assertTags(item.slug, category.slug, "block", variant.id);
        }
      }
    }
  });

  it("tags every bundled compose app", () => {
    const dir = join(import.meta.dirname, "../../../packages/cli/templates/apps");
    const apps = readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(/\.json$/, ""));
    expect(apps.length).toBeGreaterThan(10);
    for (const slug of apps) {
      assertTags(slug, "application", "template");
      const tags = resolveCatalogTags({ slug, category: "application", kind: "template" });
      expect(tags.intents.length).toBeGreaterThan(0);
    }
  });

  it("maps login split to a smooth editorial aurora card", () => {
    const split = resolveCatalogTags({
      slug: "login",
      category: "auth",
      kind: "block",
      variantId: "split",
    });
    expect(split).toMatchObject({
      style: "editorial",
      palette: "aurora",
      motion: "smooth",
      intents: ["login", "auth"],
    });
  });

  it("keeps the default login card static", () => {
    const classic = resolveCatalogTags({
      slug: "login",
      category: "auth",
      kind: "block",
      variantId: "classic",
    });
    expect(classic.motion).toBe("none");
    expect(classic.style).toBe("default");
  });

  it("marks animated-button as smooth action motion", () => {
    const tags = resolveCatalogTags({
      slug: "animated-button",
      category: "buttons",
      kind: "component",
    });
    expect(tags.motion).toBe("smooth");
    expect(tags.intents).toContain("action");
    expect(tags.intents).toContain("motion");
  });
});
