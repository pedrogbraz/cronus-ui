import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_REGISTRY,
  RegistryClient,
  type RegistryIndex,
  type RegistryLoader,
} from "./registry.js";
import {
  buildInstallCommand,
  getComponent,
  getDesignContext,
  getInstallCommand,
  humanizeName,
  listBlocks,
  listCatalog,
  listComponents,
  matchCatalog,
  searchRegistry,
} from "./tools.js";
import { SERVER_VERSION } from "./version.js";

const INDEX: RegistryIndex = [
  { name: "cn", type: "registry:lib", dependencies: ["clsx@^2.1.1"], registryDependencies: [] },
  {
    name: "button",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-slot@^1.2.3", "class-variance-authority@^0.7.1"],
    registryDependencies: ["cn"],
  },
  {
    name: "alert-dialog",
    type: "registry:ui",
    dependencies: ["@radix-ui/react-alert-dialog@^1.1.14"],
    registryDependencies: ["button", "cn"],
  },
  {
    name: "pricing",
    type: "registry:block",
    dependencies: ["@cronus-ui/ui@0.2.0", "lucide-react@^0.577.0"],
    registryDependencies: [],
  },
];

const BUTTON_ITEM = {
  name: "button",
  type: "registry:ui" as const,
  dependencies: ["@radix-ui/react-slot@^1.2.3", "class-variance-authority@^0.7.1"],
  registryDependencies: ["cn"],
  files: [
    {
      path: "button.tsx",
      content: "export const Button = () => null;\n",
      target: "ui" as const,
    },
  ],
};

/** A meta sidecar matching the fixture INDEX, exercising the enrichment path. */
const META = {
  registryVersion: "0.5.0",
  blocks: {
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
    "alert-dialog": {
      title: "AlertDialog",
      description: "Confirm a destructive action.",
      category: "feedback",
    },
  },
};

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

describe("MCP server release version", () => {
  it("keeps the runtime version aligned with package.json", () => {
    expect(SERVER_VERSION).toBe(pkg.version);
  });

  it("pins the default registry to the runtime version tag", () => {
    expect(DEFAULT_REGISTRY).toBe(
      `https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v${pkg.version}/registry`,
    );
  });
});

/** An in-memory loader so the tool logic is exercised without any network. */
function fixtureLoader(): RegistryLoader {
  return {
    async readJson<T>(file: string): Promise<T> {
      if (file === "index.json") return INDEX as unknown as T;
      if (file === "button.json") return BUTTON_ITEM as unknown as T;
      if (file === "meta.json") return META as unknown as T;
      throw new Error(`registry fetch failed (404): ${file}`);
    },
  };
}

/** A loader for an older/custom registry that ships NO meta.json sidecar. */
function fixtureLoaderNoMeta(): RegistryLoader {
  return {
    async readJson<T>(file: string): Promise<T> {
      if (file === "index.json") return INDEX as unknown as T;
      if (file === "button.json") return BUTTON_ITEM as unknown as T;
      throw new Error(`registry fetch failed (404): ${file}`);
    },
  };
}

function client(): RegistryClient {
  return new RegistryClient(fixtureLoader());
}

function clientNoMeta(): RegistryClient {
  return new RegistryClient(fixtureLoaderNoMeta());
}

describe("humanizeName", () => {
  it("title-cases hyphenated names", () => {
    expect(humanizeName("alert-dialog")).toBe("Alert Dialog");
    expect(humanizeName("button")).toBe("Button");
    expect(humanizeName("data-table")).toBe("Data Table");
  });
});

describe("buildInstallCommand", () => {
  it("builds the npx cronus-ui add command", () => {
    expect(buildInstallCommand(["button"])).toBe("npx cronus-ui add button");
    expect(buildInstallCommand(["button", "card", "dialog"])).toBe(
      "npx cronus-ui add button card dialog",
    );
  });

  it("de-duplicates and trims names while preserving order", () => {
    expect(buildInstallCommand([" button ", "card", "button"])).toBe(
      "npx cronus-ui add button card",
    );
  });

  it("throws when no usable names are given", () => {
    expect(() => buildInstallCommand([])).toThrow(/at least one/i);
    expect(() => buildInstallCommand(["  ", ""])).toThrow(/at least one/i);
  });

  it("rejects flag-like or path-like names", () => {
    expect(() => buildInstallCommand(["--overwrite"])).toThrow(/Invalid component name/);
    expect(() => buildInstallCommand(["../button"])).toThrow(/Invalid component name/);
  });
});

describe("getDesignContext", () => {
  it("returns extended Aurora taste by default", () => {
    const result = getDesignContext();
    expect(result.theme).toBe("aurora");
    expect(result.look).toBe("default");
    expect(result.format).toBe("extended");
    expect(result.markdown).toContain("Cronus UI — DESIGN.md");
    expect(result.markdown).toContain("get_design_context");
  });

  it("returns compact glass on midnight", () => {
    const result = getDesignContext({ theme: "midnight", look: "glass", format: "compact" });
    expect(result.theme).toBe("midnight");
    expect(result.look).toBe("glass");
    expect(result.format).toBe("compact");
    expect(result.markdown).toContain("**midnight**");
    expect(result.markdown).toContain("**glass**");
    expect(result.markdown).toContain("(compact)");
  });

  it("rejects unknown names", () => {
    expect(() => getDesignContext({ theme: "mauve" as never })).toThrow(/Unknown theme/);
    expect(() => getDesignContext({ look: "mauve" as never })).toThrow(/Unknown look/);
  });
});

describe("listComponents", () => {
  it("returns only registry:ui items with the right shape", async () => {
    const result = await listComponents(client());
    expect(result.count).toBe(2);
    expect(result.items.map((i) => i.name)).toEqual(["button", "alert-dialog"]);
    expect(result.items.every((i) => i.type === "registry:ui")).toBe(true);
    // No registry:lib (cn) and no registry:block (pricing) leak in.
    expect(result.items.some((i) => i.name === "cn")).toBe(false);
    expect(result.items.some((i) => i.name === "pricing")).toBe(false);

    const button = result.items.find((i) => i.name === "button");
    expect(button).toMatchObject({
      name: "button",
      type: "registry:ui",
      title: "Button",
      // Enriched from meta.json.
      description: "Clickable action with variants, sizes and asChild.",
      category: "buttons",
      style: "default",
      palette: "semantic",
      motion: "snappy",
      intents: ["action"],
      registryDependencies: ["cn"],
      install: "npx cronus-ui add button",
    });
    expect(button?.dependencies).toContain("class-variance-authority@^0.7.1");
  });

  it("falls back to a name-derived title and omits meta fields when no sidecar exists", async () => {
    const result = await listComponents(clientNoMeta());
    const button = result.items.find((i) => i.name === "button");
    expect(button?.title).toBe("Button");
    expect(button?.description).toBeUndefined();
    expect(button?.category).toBeUndefined();
  });
});

describe("listBlocks", () => {
  it("returns only registry:block items enriched from meta", async () => {
    const result = await listBlocks(client());
    expect(result.count).toBe(1);
    expect(result.items[0]).toMatchObject({
      name: "pricing",
      type: "registry:block",
      title: "Pricing",
      description: "A three-tier pricing grid with a highlighted plan.",
      category: "marketing",
      install: "npx cronus-ui add pricing",
    });
  });

  it("omits meta fields when the registry ships no sidecar", async () => {
    const result = await listBlocks(clientNoMeta());
    expect(result.items[0]?.title).toBe("Pricing");
    expect(result.items[0]?.description).toBeUndefined();
    expect(result.items[0]?.category).toBeUndefined();
  });
});

describe("searchRegistry", () => {
  it("fuzzy-matches components and blocks by name", async () => {
    const result = await searchRegistry(client(), "dialog");
    expect(result.query).toBe("dialog");
    expect(result.items.map((i) => i.name)).toEqual(["alert-dialog"]);
  });

  it("matches against the humanized title too", async () => {
    const result = await searchRegistry(client(), "Alert");
    expect(result.items.map((i) => i.name)).toEqual(["alert-dialog"]);
  });

  it("matches against the meta description and category when a sidecar exists", async () => {
    // "three-tier" appears only in the pricing block's meta description.
    const byDescription = await searchRegistry(client(), "three-tier");
    expect(byDescription.items.map((i) => i.name)).toEqual(["pricing"]);

    // "marketing" is only the pricing block's meta category.
    const byCategory = await searchRegistry(client(), "marketing");
    expect(byCategory.items.map((i) => i.name)).toEqual(["pricing"]);
  });

  it("degrades to name/title matching when no sidecar exists", async () => {
    // Without meta, the description-only term matches nothing...
    const byDescription = await searchRegistry(clientNoMeta(), "three-tier");
    expect(byDescription.count).toBe(0);
    // ...but a name match still works.
    const byName = await searchRegistry(clientNoMeta(), "pricing");
    expect(byName.items.map((i) => i.name)).toEqual(["pricing"]);
  });

  it("never returns the lib primitive (cn)", async () => {
    const result = await searchRegistry(client(), "cn");
    expect(result.items.some((i) => i.name === "cn")).toBe(false);
  });

  it("returns all components and blocks for an empty query", async () => {
    const result = await searchRegistry(client(), "");
    expect(result.count).toBe(3);
    expect(result.items.some((i) => i.name === "pricing")).toBe(true);
  });
});

describe("getComponent", () => {
  it("returns full detail incl. files, deps, install command, and meta enrichment", async () => {
    const detail = await getComponent(client(), "button");
    expect(detail).toMatchObject({
      name: "button",
      type: "registry:ui",
      title: "Button",
      description: "Clickable action with variants, sizes and asChild.",
      category: "buttons",
      style: "default",
      palette: "semantic",
      motion: "snappy",
      intents: ["action"],
      registryDependencies: ["cn"],
      install: "npx cronus-ui add button",
    });
    expect(detail.files).toHaveLength(1);
    expect(detail.files[0]?.path).toBe("button.tsx");
    expect(detail.files[0]?.content).toContain("export const Button");
  });

  it("omits meta fields when the registry ships no sidecar", async () => {
    const detail = await getComponent(clientNoMeta(), "button");
    expect(detail.title).toBe("Button");
    expect(detail.description).toBeUndefined();
    expect(detail.category).toBeUndefined();
  });

  it("propagates a helpful error for an unknown item", async () => {
    await expect(getComponent(client(), "does-not-exist")).rejects.toThrow(/404/);
  });

  it("caches items and the meta sidecar so a second call does not re-read", async () => {
    let itemReads = 0;
    let metaReads = 0;
    const loader: RegistryLoader = {
      async readJson<T>(file: string): Promise<T> {
        if (file === "button.json") {
          itemReads += 1;
          return BUTTON_ITEM as unknown as T;
        }
        if (file === "meta.json") {
          metaReads += 1;
          return META as unknown as T;
        }
        throw new Error(`unexpected ${file}`);
      },
    };
    const c = new RegistryClient(loader);
    await getComponent(c, "button");
    await getComponent(c, "button");
    // The item is fetched once and the meta sidecar is fetched once, then both cache.
    expect(itemReads).toBe(1);
    expect(metaReads).toBe(1);
  });

  it("fetches an absent meta sidecar only once, then serves the cached null", async () => {
    let metaReads = 0;
    const loader: RegistryLoader = {
      async readJson<T>(file: string): Promise<T> {
        if (file === "button.json") return BUTTON_ITEM as unknown as T;
        if (file === "meta.json") {
          metaReads += 1;
          throw new Error("registry fetch failed (404): meta.json");
        }
        throw new Error(`unexpected ${file}`);
      },
    };
    const c = new RegistryClient(loader);
    await getComponent(c, "button");
    await getComponent(c, "button");
    expect(metaReads).toBe(1);
  });
});

describe("getInstallCommand", () => {
  it("returns the names and the composed command", () => {
    expect(getInstallCommand(["button", "card"])).toEqual({
      names: ["button", "card"],
      command: "npx cronus-ui add button card",
    });
  });
});

describe("listCatalog / matchCatalog", () => {
  it("returns compact tagged cards without source files", async () => {
    const result = await listCatalog(client());
    const button = result.items.find((item) => item.name === "button");
    expect(button).toMatchObject({
      kind: "component",
      description: "Clickable action with variants, sizes and asChild.",
      style: "default",
      palette: "semantic",
      motion: "snappy",
      intents: ["action"],
      install: "npx cronus-ui add button",
    });
    expect(button).not.toHaveProperty("files");
  });

  it("infers filters from a free-text query even when the fixture has no login item", async () => {
    const result = await matchCatalog(client(), {
      query: "pagina de login com animation suave",
    });
    expect(result.filters.intent).toBe("login");
    expect(result.filters.motion).toBe("smooth");
  });
});
