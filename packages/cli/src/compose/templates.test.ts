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

  it("saas ships auth recovery and the activation loop after the dashboard cluster", async () => {
    const saas = await loadTemplate("saas");
    expect(saas.manifest.pages.map((page) => page.route)).toEqual([
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/",
      "/analytics",
      "/team",
      "/billing",
      "/settings",
      "/welcome",
      "/setup",
      "/checklist",
    ]);
    expect(saas.manifest.pages.find((page) => page.route === "/login")).toMatchObject({
      title: "Sign in",
      chrome: "bare",
      blocks: [{ block: "login", variant: "split" }],
    });
    expect(saas.manifest.pages.find((page) => page.route === "/signup")).toMatchObject({
      title: "Create account",
      chrome: "bare",
      blocks: [{ block: "signup", variant: "split" }],
    });
    expect(saas.manifest.pages.find((page) => page.route === "/forgot-password")).toMatchObject({
      title: "Reset password",
      chrome: "bare",
      blocks: [{ block: "forgot-password", variant: "split" }],
    });
    expect(saas.manifest.pages.find((page) => page.route === "/reset-password")).toMatchObject({
      title: "Set new password",
      chrome: "bare",
      blocks: [{ block: "forgot-password", variant: "reset" }],
    });
    expect(saas.manifest.pages.find((page) => page.route === "/welcome")).toMatchObject({
      title: "Welcome",
      chrome: "shell",
      blocks: ["welcome"],
    });
    expect(saas.manifest.pages.find((page) => page.route === "/setup")).toMatchObject({
      title: "Setup",
      chrome: "shell",
      blocks: ["setup-wizard"],
    });
    expect(saas.manifest.pages.find((page) => page.route === "/checklist")).toMatchObject({
      title: "Get started",
      nav: "Setup",
      chrome: "shell",
      blocks: ["setup-checklist"],
    });
    expect(saas.manifest.description).toMatch(/welcome|setup|checklist/i);
    expect(saas.manifest.description).toMatch(/password reset/i);
  });
});
