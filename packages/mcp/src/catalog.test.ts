import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildCatalogIndex, listCatalog, matchCatalog, parseCatalogQuery } from "./catalog.js";
import type { RegistryIndex, RegistryMeta } from "./registry.js";

const INDEX: RegistryIndex = [
  { name: "button", type: "registry:ui", dependencies: [], registryDependencies: ["cn"] },
  { name: "animated-button", type: "registry:ui", dependencies: [], registryDependencies: ["cn"] },
  { name: "login", type: "registry:block", dependencies: [], registryDependencies: [] },
  { name: "login--split", type: "registry:block", dependencies: [], registryDependencies: [] },
  { name: "pricing", type: "registry:block", dependencies: [], registryDependencies: [] },
];

const META: RegistryMeta = {
  components: {
    button: {
      title: "Button",
      description: "Clickable action with variants, sizes and asChild.",
      category: "buttons",
      style: "default",
      palette: "semantic",
      motion: "snappy",
      intents: ["action"],
    },
    "animated-button": {
      title: "AnimatedButton",
      description: "Motion-powered button with spring feedback.",
      category: "buttons",
      style: "default",
      palette: "semantic",
      motion: "smooth",
      intents: ["action", "motion"],
    },
  },
  blocks: {
    login: {
      title: "Login",
      description: "A centered authentication card with email + social login.",
      category: "auth",
      style: "default",
      palette: "semantic",
      motion: "none",
      intents: ["login", "auth"],
      variants: [
        {
          id: "classic",
          name: "Classic card",
          description: "Centered email and password card.",
          item: "login",
          style: "default",
          palette: "semantic",
          motion: "none",
          intents: ["login", "auth"],
        },
        {
          id: "split",
          name: "Split panel",
          description: "Brand gradient panel beside the sign-in form.",
          item: "login--split",
          style: "editorial",
          palette: "aurora",
          motion: "smooth",
          intents: ["login", "auth"],
        },
      ],
    },
    pricing: {
      title: "Pricing",
      description: "A three-tier pricing grid with a highlighted plan.",
      category: "marketing",
      style: "editorial",
      palette: "semantic",
      motion: "none",
      intents: ["marketing"],
    },
  },
  apps: {
    saas: {
      title: "SaaS",
      description: "Split auth plus a sidebar-shell dashboard.",
      style: "operational",
      palette: "aurora",
      motion: "smooth",
      intents: ["dashboard", "auth"],
    },
  },
};

describe("parseCatalogQuery", () => {
  it("lifts a Portuguese login + smooth prompt into two filters", () => {
    expect(parseCatalogQuery({ query: "pagina de login com animation suave" })).toMatchObject({
      intent: "login",
      motion: "smooth",
    });
  });

  it("lets explicit fields win over the free-text query", () => {
    expect(
      parseCatalogQuery({ query: "login suave", intent: "pricing", motion: "snappy" }),
    ).toMatchObject({
      intent: "pricing",
      motion: "snappy",
    });
  });
});

describe("buildCatalogIndex", () => {
  it("flattens components, blocks, non-default variants, and templates", () => {
    const cards = buildCatalogIndex(INDEX, META);
    const names = cards.map((card) => `${card.kind}:${card.name}`).sort();
    expect(names).toEqual([
      "block:login",
      "block:pricing",
      "component:animated-button",
      "component:button",
      "template:saas",
      "variant:login--split",
    ]);
  });
});

describe("matchCatalog — two-query pick", () => {
  it("picks the smooth login variant for a login + smooth request", () => {
    const result = matchCatalog(INDEX, META, {
      query: "quero uma pagina de login com animation suave",
    });
    expect(result.filters).toMatchObject({ intent: "login", motion: "smooth" });
    expect(result.pick.some((card) => card.name === "login--split")).toBe(true);
    expect(result.intent.some((card) => card.intents.includes("login"))).toBe(true);
    expect(result.motion.some((card) => card.motion === "smooth")).toBe(true);
  });

  it("splits the two facets when no item matches both", () => {
    const result = matchCatalog(INDEX, META, { intent: "marketing", motion: "cinematic" });
    expect(result.pick.map((card) => card.name)).toContain("pricing");
  });
});

describe("listCatalog", () => {
  it("can restrict by kind", () => {
    const templates = listCatalog(INDEX, META, "template");
    expect(templates.count).toBe(1);
    expect(templates.items[0]?.name).toBe("saas");
    expect(templates.items[0]?.install).toContain("create-cronus-app");
  });
});

const REPO_REGISTRY = join(import.meta.dirname, "../../../registry");

describe.skipIf(!existsSync(join(REPO_REGISTRY, "meta.json")))(
  "live registry — agent without extra context",
  () => {
    const index = JSON.parse(
      readFileSync(join(REPO_REGISTRY, "index.json"), "utf8"),
    ) as RegistryIndex;
    const meta = JSON.parse(readFileSync(join(REPO_REGISTRY, "meta.json"), "utf8")) as RegistryMeta;

    it("tags every component and block in the published meta sidecar", () => {
      const components = Object.values(meta.components ?? {});
      const blocks = Object.values(meta.blocks ?? {});
      expect(components.length).toBeGreaterThan(50);
      expect(blocks.length).toBeGreaterThan(20);
      for (const entry of [...components, ...blocks]) {
        expect(entry.style).toBeTruthy();
        expect(entry.palette).toBeTruthy();
        expect(entry.motion).toBeTruthy();
        expect(entry.intents?.length).toBeGreaterThan(0);
        expect(entry.description.length).toBeGreaterThan(8);
      }
    });

    it("resolves 'login page with smooth animation' to tagged cards, not source", () => {
      const result = matchCatalog(index, meta, {
        query: "login page with smooth animation",
      });
      expect(result.filters.intent).toBe("login");
      expect(result.filters.motion).toBe("smooth");
      expect(result.pick.length).toBeGreaterThan(0);
      expect(result.pick.some((card) => card.intents.includes("login"))).toBe(true);
      expect(result.pick.some((card) => card.motion === "smooth")).toBe(true);
      for (const card of result.pick) {
        expect(card).not.toHaveProperty("files");
        expect(card.install.length).toBeGreaterThan(0);
      }
    });
  },
);
