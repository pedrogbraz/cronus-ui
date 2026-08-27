import { describe, expect, it } from "vitest";
import {
  DEFAULT_COMPOSE_TEMPLATE,
  defaultComposeTemplate,
  isTemplateSlug,
  listTemplates,
  loadTemplate,
} from "./templates.js";

describe("compose templates", () => {
  it("defaults --yes to saas, not the lexicographic first name", () => {
    expect(DEFAULT_COMPOSE_TEMPLATE).toBe("saas");
    expect(defaultComposeTemplate(["chat", "finance", "saas", "store"])).toBe("saas");
    expect(defaultComposeTemplate(["alpha", "beta"])).toBe("alpha");
  });

  it("rejects path-like template names", () => {
    expect(isTemplateSlug("saas")).toBe(true);
    expect(isTemplateSlug("landing-studio")).toBe(true);
    expect(isTemplateSlug("../package")).toBe(false);
    expect(isTemplateSlug("foo/bar")).toBe(false);
    expect(isTemplateSlug("foo.json")).toBe(false);
  });

  it("loadTemplate refuses traversal names", async () => {
    await expect(loadTemplate("../package")).rejects.toThrow(/Unknown template/);
  });

  it("lists bundled templates including saas", async () => {
    const names = await listTemplates();
    expect(names).toContain("saas");
    expect(names.every(isTemplateSlug)).toBe(true);
  });
});
