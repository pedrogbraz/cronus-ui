import { describe, expect, it } from "vitest";
import { getBlockFamily } from "../blocks/registry";
import {
  appearanceLabel,
  blockHref,
  blockLabel,
  getTemplate,
  hasLivePreview,
  isProTemplate,
  previewPath,
  scaffoldCommands,
  similarTemplates,
  stageRefs,
  TEMPLATE_CATALOG,
  TEMPLATE_MOOD_BY_SLUG,
  TEMPLATE_SLUGS,
  templateMood,
  templatesPro,
} from "./catalog";

const LANDING_FLAVORS = [
  "landing-studio",
  "landing-ops",
  "landing-secure",
  "landing-care",
  "landing-shop",
  "landing-docs",
  "landing-premium",
  "landing-agents",
  "landing-coverage",
  "landing-broadcast",
  "landing-agency",
  "landing-glass",
] as const;

describe("template catalog", () => {
  it("has unique slugs covering every named landing flavor", () => {
    expect(new Set(TEMPLATE_SLUGS).size).toBe(TEMPLATE_SLUGS.length);
    expect(getTemplate("landing")?.kind).toBe("product");
    for (const slug of LANDING_FLAVORS) {
      expect(getTemplate(slug)?.kind).toBe("landing");
    }
  });

  it("gives every stacked block a known family", () => {
    for (const entry of TEMPLATE_CATALOG) {
      for (const ref of stageRefs(entry)) {
        expect(getBlockFamily(ref.block), `${entry.slug} → ${blockLabel(ref)}`).toBeDefined();
      }
    }
  });

  it("exposes a live stage for every template except the default starter", () => {
    for (const entry of TEMPLATE_CATALOG) {
      if (entry.slug === "default") {
        expect(hasLivePreview(entry)).toBe(false);
        continue;
      }
      expect(hasLivePreview(entry), entry.slug).toBe(true);
    }
  });

  it("builds preview paths, block labels, and scaffold commands", () => {
    expect(previewPath("landing-studio")).toBe("/preview/t/landing-studio");
    expect(previewPath("landing-studio", true)).toBe("/preview/t/landing-studio?embed=1");
    expect(blockLabel({ block: "hero", variant: "atmosphere" })).toBe("hero--atmosphere");
    expect(blockHref({ block: "hero", variant: "atmosphere" })).toBe("/blocks/hero/atmosphere");
    expect(appearanceLabel(getTemplate("landing-studio")!)).toBe("Midnight · dark");
    expect(scaffoldCommands("saas").map((item) => item.id)).toEqual(["bun", "pnpm", "npm", "yarn"]);
    expect(scaffoldCommands("default")[0]?.command).toBe("bunx create-cronus-app my-app");
  });

  it("groups similar templates by mood", () => {
    expect(templateMood(getTemplate("saas")!)).toBe("saas");
    expect(templateMood(getTemplate("landing-glass")!)).toBe("glass");
    expect(similarTemplates("saas").every((entry) => templateMood(entry) === "saas")).toBe(true);
    expect(similarTemplates("saas").some((entry) => entry.slug === "saas")).toBe(false);
  });

  it("assigns an explicit mood to every catalog slug", () => {
    for (const slug of TEMPLATE_SLUGS) {
      expect(TEMPLATE_MOOD_BY_SLUG[slug], slug).toBeDefined();
    }
  });

  it("keeps saas/store/landing OSS and lists mail/chat/finance as additive Pro", () => {
    expect(isProTemplate(getTemplate("saas")!)).toBe(false);
    expect(isProTemplate(getTemplate("store")!)).toBe(false);
    expect(isProTemplate(getTemplate("landing")!)).toBe(false);
    expect(
      templatesPro()
        .map((entry) => entry.slug)
        .sort(),
    ).toEqual(["chat", "finance", "mail"]);
    for (const slug of ["mail", "chat", "finance"] as const) {
      expect(getTemplate(slug)?.tier).toBe("pro");
      expect(hasLivePreview(getTemplate(slug)!)).toBe(true);
    }
  });
});
