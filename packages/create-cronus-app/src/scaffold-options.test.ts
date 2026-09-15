import { describe, expect, it } from "vitest";
import {
  COMPOSED_TEMPLATES,
  DEFAULT_TEMPLATE,
  isComposedTemplate,
  isGoldPathTemplate,
  TEMPLATE_APPEARANCE,
  TEMPLATE_HINTS,
  TEMPLATES,
  THEME_HINTS,
  templateBaseDir,
} from "./scaffold-options.js";

describe("templates", () => {
  it("includes the composed templates in the picker set", () => {
    expect(TEMPLATES).toContain("store");
    expect(TEMPLATES).toContain("landing");
    expect(TEMPLATES).toContain("saas");
    expect(TEMPLATES).toContain("admin");
    expect(TEMPLATES).toContain("docs");
    // The bundled-dir templates stay listed too.
    expect(TEMPLATES).toContain("default");
    expect(TEMPLATES).toContain("dashboard");
    expect(TEMPLATES).toContain("marketing");
    expect(TEMPLATES).toContain("gontify");
    expect(TEMPLATES).toContain("portfolio");
    expect(TEMPLATE_APPEARANCE.gontify).toEqual({ theme: "neutral", mode: "dark" });
    expect(TEMPLATE_APPEARANCE.portfolio).toEqual({ theme: "neutral", mode: "light" });
  });

  it("has a one-line hint for every template", () => {
    for (const t of TEMPLATES) {
      expect(TEMPLATE_HINTS[t], t).toBeTruthy();
    }
  });

  it("defaults the CLI to saas (gold path, breaking vs the old empty starter)", () => {
    expect(DEFAULT_TEMPLATE).toBe("saas");
  });

  it("positions saas as the recommended full-product template", () => {
    expect(TEMPLATE_HINTS.saas).toMatch(/recommended for a full product/);
  });

  it("describes the neutral theme as docs-site chrome, achromatic", () => {
    expect(THEME_HINTS.neutral).toMatch(/docs-site chrome/);
    expect(THEME_HINTS.neutral).toMatch(/achromatic/);
    expect(THEME_HINTS.neutral).toMatch(/black & white/);
  });

  it("classifies store/landing/saas and landing-* flavors as composed templates", () => {
    expect(isComposedTemplate("store")).toBe(true);
    expect(isComposedTemplate("landing")).toBe(true);
    expect(isComposedTemplate("saas")).toBe(true);
    expect(isComposedTemplate("admin")).toBe(true);
    expect(isComposedTemplate("docs")).toBe(true);
    expect(isComposedTemplate("landing-studio")).toBe(true);
    expect(isComposedTemplate("landing-glass")).toBe(true);
    expect(isComposedTemplate("mail")).toBe(true);
    expect(isComposedTemplate("chat")).toBe(true);
    expect(isComposedTemplate("finance")).toBe(true);
    expect(isComposedTemplate("default")).toBe(false);
    expect(isComposedTemplate("dashboard")).toBe(false);
    expect(isComposedTemplate("marketing")).toBe(false);
    expect(isComposedTemplate("gontify")).toBe(false);
    expect(isComposedTemplate("portfolio")).toBe(false);
    expect(Object.keys(COMPOSED_TEMPLATES).sort()).toEqual(
      [
        "admin",
        "docs",
        "landing",
        "landing-agency",
        "landing-agents",
        "landing-broadcast",
        "landing-care",
        "landing-coverage",
        "landing-docs",
        "landing-glass",
        "landing-ops",
        "landing-premium",
        "landing-secure",
        "landing-shop",
        "landing-studio",
        "chat",
        "finance",
        "mail",
        "saas",
        "store",
      ].sort(),
    );
  });

  it("classifies only saas and admin as gold-path templates", () => {
    expect(isGoldPathTemplate("saas")).toBe(true);
    expect(isGoldPathTemplate("admin")).toBe(true);
    expect(isGoldPathTemplate("store")).toBe(false);
    expect(isGoldPathTemplate("landing")).toBe(false);
    expect(isGoldPathTemplate("default")).toBe(false);
  });

  it("maps composed templates to the default base dir, others to themselves", () => {
    expect(templateBaseDir("store")).toBe("default");
    expect(templateBaseDir("landing")).toBe("default");
    expect(templateBaseDir("saas")).toBe("default");
    expect(templateBaseDir("default")).toBe("default");
    expect(templateBaseDir("dashboard")).toBe("dashboard");
    expect(templateBaseDir("marketing")).toBe("marketing");
    expect(templateBaseDir("landing-studio")).toBe("default");
  });
});
