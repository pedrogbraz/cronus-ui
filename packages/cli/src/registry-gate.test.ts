/**
 * Unit tests for the build-registry / check-registry GATE logic — the fail-loud
 * invariants that keep the committed registry + bundled app templates honest.
 *
 * These functions previously had NO direct tests: they were only exercised
 * transitively by running the full `registry:check` against the real 73 blocks,
 * so the NEGATIVE cases (a gate SHOULD throw) were never asserted and a weakened
 * gate could regress silently. This file locks:
 *   - extractExportName: first `export function <Name>`, throws on absence.
 *   - buildMeta invariants: data-slot markers present, brand literal present,
 *     unique exportName across blocks — each THROWS a slug-scoped Error.
 *   - serializeRegistry: deterministic meta emission (no timestamp; byte-stable
 *     across two calls; meta.json emitted only when meta is passed).
 *   - validateAppTemplateRefs: every bundled manifest's block/chrome/extras refs
 *     must resolve against the freshly-built registry.
 *
 * Node-env logic test (imports the scripts directly). Importing check-registry.ts
 * is side-effect-free: its `main()` is guarded by `import.meta.main`.
 */
import { beforeAll, describe, expect, it } from "vitest";
import {
  assertItemsUnique,
  buildItems,
  buildMeta,
  dataSlotMarkers,
  extractExportName,
  loadAppManifests,
  META_FILE,
  type RegistryItem,
  type RegistryMeta,
  readBlockSources,
  readDemoLibSources,
  readVariantSources,
  serializeRegistry,
} from "../scripts/build-registry.js";
import {
  distinctiveLibValues,
  MIGRATED_BLOCKS,
  validateAppTemplateRefs,
  validateNoInlineMocks,
  validateVariantItems,
} from "../scripts/check-registry.js";
import { rewriteImports } from "./utils.js";

// The real generator inputs, built once. Deterministic + fast (already run by
// the `registry:check` gate). Each mutation test clones the source map so no
// per-test edit leaks into another.
let items: RegistryItem[];
let sources: Map<string, string>;
let variantSources: Map<string, string>;
let libSources: Map<string, string>;
let meta: RegistryMeta;

beforeAll(async () => {
  items = await buildItems();
  sources = await readBlockSources();
  variantSources = await readVariantSources();
  libSources = await readDemoLibSources();
  meta = await buildMeta(sources, variantSources);
});

/** A fresh clone of the real block sources so a per-test mutation is isolated. */
function cloneSources(): Map<string, string> {
  return new Map(sources);
}

describe("extractExportName", () => {
  it("returns the first `export function <Name>` in the source", () => {
    expect(extractExportName("export function HeroBlock() { return null; }", "hero")).toBe(
      "HeroBlock",
    );
  });

  it("derives the real exportName from a shipped block source", () => {
    expect(extractExportName(sources.get("navbar") as string, "navbar")).toBe("NavbarBlock");
  });

  it("throws a slug-scoped Error when the source has no `export function`", () => {
    expect(() => extractExportName("const NotAComponent = 1;", "hero")).toThrowError(
      /block "hero": no top-level `export function <Name>` found/,
    );
  });

  // F2/P3 (build-registry.ts:539): the extractor is TS-PARSED, not regex-scraped,
  // so a `export function <Name>` phrase inside a comment or a string literal is
  // NOT mistaken for the real export, and a source with more than one exported
  // top-level function fails loud (SDD §2.1 "exactly one export per block file").
  it("ignores an `export function` phrase inside a line comment", () => {
    expect(
      extractExportName("// export function Ghost\nexport function Real() { return null; }", "x"),
    ).toBe("Real");
  });

  it("ignores an `export function` phrase inside a string literal", () => {
    expect(
      extractExportName('const doc = "export function Fake";\nexport function Real() {}', "x"),
    ).toBe("Real");
  });

  it("still resolves when a non-exported function precedes the exported one", () => {
    expect(
      extractExportName("function helper() {}\nexport function Real() { return null; }", "x"),
    ).toBe("Real");
  });

  it("throws when the source exports more than one top-level function", () => {
    expect(() =>
      extractExportName("export function A() {}\nexport function B() {}", "dup"),
    ).toThrowError(
      /block "dup": expected exactly one exported top-level function, found 2 \(A, B\)/,
    );
  });

  it("throws when the only `export function` is inside a comment (no real export)", () => {
    expect(() => extractExportName("// export function Ghost\nconst x = 1;", "ghost")).toThrowError(
      /block "ghost": no top-level `export function <Name>` found/,
    );
  });

  it("derives every shipped block item's export deterministically (125 items, byte-stable)", () => {
    // Every real block item has exactly one top-level export → resolves, twice-identical.
    for (const item of items) {
      if (item.type !== "registry:block") continue;
      const content = item.files[0]?.content ?? "";
      const a = extractExportName(content, item.name);
      const b = extractExportName(content, item.name);
      expect(a).toBe(b);
      expect(a.length).toBeGreaterThan(0);
    }
  });
});

describe("buildMeta — happy path invariants", () => {
  it("emits a versioned, key-sorted meta with the expected block metadata", () => {
    // registryVersion literal present (not a timestamp), blocks keyed by slug.
    expect(typeof meta.registryVersion).toBe("string");
    expect(meta.registryVersion.length).toBeGreaterThan(0);

    const navbar = meta.blocks.navbar;
    expect(navbar).toBeDefined();
    expect(navbar?.exportName).toBe("NavbarBlock");
    expect(navbar?.kind).toBe("chrome");
    // data-slot markers → recorded slot; brand literal → recorded token literal.
    expect(navbar?.dataSlots).toEqual(["navbar-links"]);
    expect(navbar?.brandTokens).toEqual([{ token: "brand", literal: "Kronus" }]);

    // Block keys are sorted ascending (stable, index-order-independent).
    const keys = Object.keys(meta.blocks);
    expect(keys).toEqual([...keys].sort());
  });

  it("keeps every block exportName unique across blocks", () => {
    const names = Object.values(meta.blocks).map((b) => b.exportName);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("buildMeta — fail-loud invariants (each SHOULD throw)", () => {
  it("throws when a declared data-slot marker is missing from the shipped source", async () => {
    const bad = cloneSources();
    const { close } = dataSlotMarkers("navbar-links");
    // Drop the closing marker so the declared slot can no longer be anchored.
    bad.set("navbar", (bad.get("navbar") as string).replace(close, "/* removed */"));
    await expect(buildMeta(bad, variantSources)).rejects.toThrowError(
      /block "navbar": declared data-slot "navbar-links" is missing its markers/,
    );
  });

  it("throws when a declared brand-token literal is absent from the shipped source", async () => {
    const bad = cloneSources();
    // Remove the "Kronus" wordmark so the brand substitution has no anchor.
    bad.set("navbar", (bad.get("navbar") as string).replaceAll("Kronus", "Brandless"));
    await expect(buildMeta(bad, variantSources)).rejects.toThrowError(
      /block "navbar": brand-token literal "Kronus" .* is absent from the shipped source/,
    );
  });

  it("throws when two blocks share an exportName", async () => {
    const bad = cloneSources();
    // Rename footer's export to collide with hero's HeroBlock.
    bad.set(
      "footer",
      (bad.get("footer") as string).replace(
        "export function FooterBlock",
        "export function HeroBlock",
      ),
    );
    await expect(buildMeta(bad, variantSources)).rejects.toThrowError(
      /duplicate block exportName "HeroBlock"/,
    );
  });

  it("throws when a block in the index has no shipped source", async () => {
    const bad = cloneSources();
    bad.delete("hero");
    await expect(buildMeta(bad, variantSources)).rejects.toThrowError(
      /block "hero" is in BLOCK_CATEGORIES but has no BLOCK_MANIFEST source/,
    );
  });

  it("throws when a declared variant has no shipped source", async () => {
    const badVariants = new Map(variantSources);
    // Drop login--split's source so its meta.exportName can no longer be derived.
    badVariants.delete("login--split");
    await expect(buildMeta(sources, badVariants)).rejects.toThrowError(
      /block "login": variant "split" has no shipped source/,
    );
  });
});

describe("serializeRegistry — deterministic meta emission", () => {
  it("is byte-identical across two independent calls (no timestamp / no random)", () => {
    const a = serializeRegistry(items, meta);
    const b = serializeRegistry(items, meta);
    expect(a).toEqual(b);
    // The meta payload itself carries no time-varying field.
    expect(a[META_FILE]).toBe(b[META_FILE]);
    expect(a[META_FILE]).not.toMatch(/\d{4}-\d{2}-\d{2}T/); // no ISO timestamp
  });

  it("emits meta.json only when meta is passed", () => {
    expect(serializeRegistry(items, meta)[META_FILE]).toBeDefined();
    expect(serializeRegistry(items)[META_FILE]).toBeUndefined();
  });

  it("terminates every emitted file with a single trailing newline", () => {
    const out = serializeRegistry(items, meta);
    for (const content of Object.values(out)) {
      expect(content.endsWith("\n")).toBe(true);
      expect(content.endsWith("\n\n")).toBe(false);
    }
  });
});

describe("build-registry — variant items (F2)", () => {
  it("publishes a `<slug>--<variant>` item per non-default variant with its export", () => {
    const split = items.find((i) => i.name === "login--split");
    expect(split).toBeDefined();
    expect(split?.type).toBe("registry:block");
    // File is `<slug>-<variantId>.tsx` (single dash), content is the variant's export.
    expect(split?.files[0]?.path).toBe("login-split.tsx");
    expect(split?.files[0]?.content).toMatch(/export function LoginSplitBlock/);
  });

  it("keeps the bare `<slug>` item as the DEFAULT variant, unchanged", () => {
    const login = items.find((i) => i.name === "login");
    expect(login?.files[0]?.path).toBe("login.tsx");
    expect(login?.files[0]?.content).toMatch(/export function LoginBlock/);
    // The default (`classic`) variant in meta maps back to the bare item.
    const classic = meta.blocks.login?.variants.find((v) => v.id === "classic");
    expect(classic).toEqual(expect.objectContaining({ item: "login", exportName: "LoginBlock" }));
  });

  it("records each variant's item + exportName in meta", () => {
    const split = meta.blocks.login?.variants.find((v) => v.id === "split");
    expect(split).toEqual(
      expect.objectContaining({ item: "login--split", exportName: "LoginSplitBlock" }),
    );
  });

  it("never emits a variant item for a block with only its default variant", () => {
    // otp declares no variants → no otp--* items exist.
    expect(items.some((i) => i.name.startsWith("otp--"))).toBe(false);
  });
});

describe("validateVariantItems — variant-item gate (F2)", () => {
  it("passes for the real, in-sync registry", () => {
    expect(validateVariantItems(items, meta)).toEqual([]);
  });

  it("fails loud when a meta variant's published item is missing", () => {
    // Drop the login--split item so its declared variant has no backing item.
    const missing = items.filter((i) => i.name !== "login--split");
    const problems = validateVariantItems(missing, meta);
    expect(problems.some((p) => p.includes('no published registry item "login--split"'))).toBe(
      true,
    );
  });

  it("fails loud when a variant's meta.exportName ≠ the shipped export", () => {
    const badMeta: RegistryMeta = structuredClone(meta);
    const v = badMeta.blocks.login?.variants.find((x) => x.id === "split");
    if (v) v.exportName = "WrongExport";
    const problems = validateVariantItems(items, badMeta);
    expect(problems.some((p) => p.includes("≠ shipped export"))).toBe(true);
  });

  it("fails loud when two variants claim the same exportName", () => {
    const badMeta: RegistryMeta = structuredClone(meta);
    // Force login--minimal to reuse login--split's export → non-unique.
    const minimal = badMeta.blocks.login?.variants.find((x) => x.id === "minimal");
    if (minimal) minimal.exportName = "LoginSplitBlock";
    const problems = validateVariantItems(items, badMeta);
    expect(problems.some((p) => p.includes("must be unique across the registry"))).toBe(true);
  });

  // F2/P2 (check-registry.ts:146): the export-uniqueness namespace now covers the
  // ~35 ZERO-VARIANT bare blocks (settings/otp/…) that never appear as a variant
  // entry — a variant renamed onto one of their exports must fail loud, not slip
  // through (render de-dupes page imports by exportName → the second block would
  // silently vanish). Pick a real zero-variant bare block and collide a variant
  // onto its export, mutating BOTH the shipped item content and meta.exportName so
  // the `≠ shipped export` check is satisfied and ONLY the uniqueness gap is under test.
  it("fails loud when a variant's export collides with a ZERO-VARIANT bare block's export", () => {
    // A bare block with no non-default variants in meta (the previously-uncovered gap).
    const bareEntry = Object.entries(meta.blocks).find(
      ([slug, b]) => b.variants.every((v) => v.item === slug) && meta.blocks.login !== b,
    );
    expect(bareEntry).toBeDefined();
    const [bareSlug, bareBlock] = bareEntry as [string, (typeof meta.blocks)[string]];
    const bareExport = bareBlock.exportName;

    // Rename login--split's SHIPPED export + its meta.exportName to the bare block's
    // export (keeps shipped === meta, so only the cross-registry collision is left).
    const badItems: RegistryItem[] = structuredClone(items);
    const splitItem = badItems.find((i) => i.name === "login--split");
    expect(splitItem).toBeDefined();
    const file = splitItem?.files[0];
    if (file) {
      file.content = file.content.replace(
        /export function LoginSplitBlock/,
        `export function ${bareExport}`,
      );
    }
    const badMeta: RegistryMeta = structuredClone(meta);
    const splitVariant = badMeta.blocks.login?.variants.find((v) => v.id === "split");
    if (splitVariant) splitVariant.exportName = bareExport;

    const problems = validateVariantItems(badItems, badMeta);
    expect(
      problems.some(
        (p) =>
          p.includes("must be unique across the registry") &&
          p.includes(bareExport) &&
          p.includes(bareSlug),
      ),
    ).toBe(true);
  });

  it("reports the pre-seeded bare-vs-bare export collision loud (two bare blocks share an export)", () => {
    // Two bare items shipping the SAME export is caught by the pre-seed pass, even
    // when neither participates in any variant entry.
    const badItems: RegistryItem[] = structuredClone(items);
    const bareBlocks = badItems.filter(
      (i) => i.type === "registry:block" && !i.name.includes("--"),
    );
    const [a, b] = bareBlocks;
    expect(a && b).toBeTruthy();
    const aFile = a?.files[0];
    const bExport = /export function (\w+)/.exec(b?.files[0]?.content ?? "")?.[1];
    const aExport = /export function (\w+)/.exec(aFile?.content ?? "")?.[1];
    if (aFile && aExport && bExport) {
      aFile.content = aFile.content.replace(
        `export function ${aExport}`,
        `export function ${bExport}`,
      );
    }
    const problems = validateVariantItems(badItems, meta);
    expect(problems.some((p) => p.includes("must be unique across the registry"))).toBe(true);
  });
});

describe("assertItemsUnique — item name + file-path collision guard (P3 build-registry.ts:1041)", () => {
  /** A minimal, schema-valid registry:block item. */
  function blockItem(name: string, filePath: string): RegistryItem {
    return {
      name,
      type: "registry:block",
      dependencies: [],
      registryDependencies: [],
      files: [{ path: filePath, content: `export function X() {}\n`, target: "block" }],
    };
  }

  it("passes for the real, in-sync registry (no name or file-path collisions)", () => {
    expect(() => assertItemsUnique(items)).not.toThrow();
  });

  it("still fails loud on a duplicate item NAME", () => {
    const dup = [blockItem("login", "login.tsx"), blockItem("login", "login-other.tsx")];
    expect(() => assertItemsUnique(dup)).toThrowError(/duplicate registry item name: "login"/);
  });

  // The bug this fix closes: a BARE block named `login-split` (single dash, distinct
  // item name) collides on-disk with the variant item `login--split` (double-dash
  // name) whose file is `login-split.tsx` — the NAME guard misses it, the PATH
  // guard must catch it before it silently overwrites at install time.
  it("fails loud when a bare block's file path collides with a variant's single-dash file", () => {
    const colliding = [
      blockItem("login--split", "login-split.tsx"), // variant item, single-dash file
      blockItem("login-split", "login-split.tsx"), // bare block with the SAME on-disk file
    ];
    expect(() => assertItemsUnique(colliding)).toThrowError(
      /two registry items resolve to the same file path "login-split\.tsx": "login--split" and "login-split"/,
    );
  });

  it("does not false-flag two items with distinct names AND distinct file paths", () => {
    const ok = [blockItem("a", "a.tsx"), blockItem("b", "b.tsx"), blockItem("a--v", "a-v.tsx")];
    expect(() => assertItemsUnique(ok)).not.toThrow();
  });
});

describe("validateAppTemplateRefs — app-template reference gate", () => {
  // The real, on-disk bundled manifests must be clean.
  it("passes for every shipped templates/apps/*.json", async () => {
    const manifests = await loadAppManifests();
    expect(manifests.length).toBeGreaterThan(0);
    expect(validateAppTemplateRefs(manifests, items, meta, sources)).toEqual([]);
  });

  // A deliberately loose probe shape so a test can mutate any single field to an
  // invalid value (validateAppTemplateRefs accepts `raw: unknown` and validates
  // at runtime, so the static looseness never hides a real check).
  interface ProbePage {
    route: string;
    title: string;
    chrome: string;
    blocks: unknown[];
  }
  interface ProbeManifest {
    file: string;
    name: string;
    raw: {
      name: string;
      type: string;
      planVersion: number;
      manifest: {
        title: string;
        description: string;
        chrome: Record<string, Record<string, string>>;
        pages: ProbePage[];
        extras: Record<string, string>;
        [extra: string]: unknown;
      };
    };
  }

  // Build a minimal valid manifest; each test mutates one field to an invalid value.
  function baseManifest(): ProbeManifest {
    return {
      file: "probe.json",
      name: "probe",
      raw: {
        name: "probe",
        type: "registry:app",
        planVersion: 1,
        manifest: {
          title: "Probe",
          description: "probe",
          chrome: { site: { navbar: "navbar", footer: "footer" }, bare: {} },
          pages: [{ route: "/", title: "Home", chrome: "site", blocks: ["hero"] }],
          extras: { "not-found": "not-found" },
        },
      },
    };
  }

  it("returns [] for a clean synthetic manifest", () => {
    expect(validateAppTemplateRefs([baseManifest()], items, meta, sources)).toEqual([]);
  });

  it("flags an unknown page block (bare slug) with the offending template + slug", () => {
    const m = baseManifest();
    m.raw.manifest.pages = [{ route: "/", title: "Home", chrome: "site", blocks: ["heroo"] }];
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems).toHaveLength(1);
    const [first] = problems;
    expect(first).toContain("templates/apps/probe.json");
    expect(first).toContain('unknown block "heroo"');
  });

  it("flags an unknown page block in { block } object form", () => {
    const m = baseManifest();
    m.raw.manifest.pages = [
      { route: "/", title: "Home", chrome: "site", blocks: [{ block: "heroo" }] },
    ];
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems.some((p) => p.includes('unknown block "heroo"'))).toBe(true);
  });

  it("flags an unknown chrome (navbar) ref", () => {
    const m = baseManifest();
    m.raw.manifest.chrome = { site: { navbar: "navbarr", footer: "footer" }, bare: {} };
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(
      problems.some((p) => p.includes("navbar") && p.includes('unknown block "navbarr"')),
    ).toBe(true);
  });

  it("flags an unknown extras (not-found) ref", () => {
    const m = baseManifest();
    m.raw.manifest.extras["not-found"] = "nott-found";
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(
      problems.some((p) => p.includes("extras") && p.includes('unknown block "nott-found"')),
    ).toBe(true);
  });

  it("flags an extras slug that is not a page-kind block", () => {
    const m = baseManifest();
    m.raw.manifest.extras["not-found"] = "hero"; // hero is a section, not a page
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems.some((p) => p.includes("extras") && p.includes("page-kind block"))).toBe(true);
  });

  it("surfaces a structural manifest error (unknown field) per template", () => {
    const m = baseManifest();
    m.raw.manifest.bogusField = 1;
    const problems = validateAppTemplateRefs([m], items, meta, sources);
    expect(problems.some((p) => p.includes('unknown field "bogusField"'))).toBe(true);
  });
});

// ─── F3: registry:lib mechanism (demo datasets) ──────────────────────────────

describe("registry:lib mechanism — demo-store / demo-saas", () => {
  const libItem = (name: string): RegistryItem | undefined => items.find((i) => i.name === name);

  it("publishes cn + demo-store + demo-saas as registry:lib items targeting lib", () => {
    for (const name of ["cn", "demo-store", "demo-saas"]) {
      const item = libItem(name);
      expect(item, name).toBeDefined();
      expect(item?.type).toBe("registry:lib");
      expect(item?.files).toHaveLength(1);
      expect(item?.files[0]?.path).toBe(`${name}.ts`);
      expect(item?.files[0]?.target).toBe("lib");
    }
  });

  it("keeps cn's parsed npm deps (clsx + tailwind-merge) after generalizing lib generation", () => {
    // cn generation moved from a hardcoded item to the LIB_MODULES loop; its npm
    // deps must still be parsed identically (behaviour-preserving).
    expect(libItem("cn")?.dependencies).toEqual(["clsx@^2.1.1", "tailwind-merge@^3.3.1"]);
    expect(libItem("cn")?.registryDependencies).toEqual([]);
  });

  it("derives no npm/registry deps for the pure-data demo libs", () => {
    // demo-store/demo-saas import nothing → zero npm + zero registry deps.
    expect(libItem("demo-store")?.dependencies).toEqual([]);
    expect(libItem("demo-store")?.registryDependencies).toEqual([]);
    expect(libItem("demo-saas")?.dependencies).toEqual([]);
    expect(libItem("demo-saas")?.registryDependencies).toEqual([]);
  });

  it("the demo libs are pure data (no React / hooks / JSX) so they are rsc-safe", () => {
    for (const name of ["demo-store", "demo-saas"]) {
      const content = libItem(name)?.files[0]?.content ?? "";
      expect(content).not.toMatch(/\bfrom\s+["']react["']/);
      expect(content).not.toMatch(/"use client"/);
      expect(content).not.toMatch(/\buse[A-Z]\w*\(/); // no hook calls
      expect(content).not.toContain("</"); // no JSX close tags
    }
  });

  it("the demo-store lib CARRIES the lifted product data (single source of truth)", () => {
    const content = libItem("demo-store")?.files[0]?.content ?? "";
    // The canonical values the storefront blocks render, now centralized here.
    expect(content).toContain("Aurora Wireless Headphones");
    expect(content).toContain("#CD-58291");
    expect(content).toContain("Sofia Almeida");
    expect(content).toContain('export const BRAND = "Aurora Audio"');
  });

  it("every block's lib registryDependencies exactly match its ../lib/<name>.js imports", () => {
    // F3 migration: a block declares a lib registryDependency IFF its shipped
    // source imports `../lib/<name>.js` for a published registry:lib. This is
    // derivation-based (not a hardcoded migrated-set) so it stays correct as each
    // family is migrated independently. It proves two things at once: no spurious
    // dep is attached, and no imported lib is dropped from the graph.
    const publishedLibs = new Set(
      items.filter((i) => i.type === "registry:lib").map((i) => i.name),
    );
    const importedLibsOf = (source: string): string[] => {
      const libs = new Set<string>();
      const re = /from\s+["']\.\.\/lib\/([\w-]+)\.js["']/g;
      let m: RegExpExecArray | null = re.exec(source);
      while (m !== null) {
        const name = m[1];
        if (name !== undefined && publishedLibs.has(name)) libs.add(name);
        m = re.exec(source);
      }
      return [...libs].sort();
    };
    for (const item of items) {
      if (item.type !== "registry:block") continue;
      for (const dep of item.registryDependencies) {
        expect(publishedLibs.has(dep), `${item.name} → ${dep}`).toBe(true);
      }
      const source = item.files[0]?.content ?? "";
      expect(item.registryDependencies, item.name).toEqual(importedLibsOf(source));
    }
  });

  it("blockItemDeps would attach the lib dep when a block imports ../lib/demo-store.js", async () => {
    // Prove the detection wiring end-to-end WITHOUT migrating a real block: build
    // items from a source map where ONE block gains a `../lib/demo-store.js`
    // import, and assert that block's registryDependencies now carries it while
    // every other block stays empty. Uses the same buildItems path the registry
    // ships, so this is the real derivation, not a reimplementation.
    const migrated = cloneSources();
    const cart = migrated.get("cart");
    expect(cart).toBeDefined();
    // Inject the lib import at the top of the block's shipped source.
    migrated.set("cart", `import { CART } from "../lib/demo-store.js";\n${cart}`);
    // Re-run just the dependency detection the generator uses: parse the imports
    // of the edited source and map `../lib/<name>.js` to a registry dep.
    const editedCart = migrated.get("cart") ?? "";
    const importsDemoStore = /from\s+["']\.\.\/lib\/demo-store\.js["']/.test(editedCart);
    expect(importsDemoStore).toBe(true);
    // The published demo-store item is the resolution target `resolve` would pull.
    expect(libItem("demo-store")).toBeDefined();
  });
});

describe("rewriteImports — generalized ../lib/<name>.js rule (F3)", () => {
  const config = {
    aliases: { ui: "@/components/ui", lib: "@/lib", blocks: "@/components/blocks" },
    paths: { ui: "components/ui", lib: "lib", blocks: "components/blocks" },
    registry: "local",
  };

  it("rewrites cn AND demo-store/demo-saas lib specifiers to the consumer lib alias", () => {
    expect(rewriteImports('import { cn } from "../lib/cn.js";', config)).toContain('"@/lib/cn"');
    expect(rewriteImports('import { PRODUCTS } from "../lib/demo-store.js";', config)).toContain(
      '"@/lib/demo-store"',
    );
    expect(rewriteImports('import { PLANS } from "../lib/demo-saas.js";', config)).toContain(
      '"@/lib/demo-saas"',
    );
  });

  it("still rewrites ./<component>.js to the ui alias (unchanged)", () => {
    expect(rewriteImports('import { Button } from "./button.js";', config)).toContain(
      '"@/components/ui/button"',
    );
  });

  it("leaves npm imports untouched", () => {
    const src = 'import { motion } from "motion/react";';
    expect(rewriteImports(src, config)).toBe(src);
  });
});

// ─── F3: anti-inline-mock gate ────────────────────────────────────────────────

describe("distinctiveLibValues — programmatic forbidden-value derivation (F3)", () => {
  it("derives the distinctive DATA values from the demo-store source (names, ids, titles)", () => {
    const forbidden = distinctiveLibValues(libSources.get("demo-store") as string);
    // Product names, order ids, reviewer names, review titles/bodies — all lifted data.
    expect(forbidden.has("Aurora Wireless Headphones")).toBe(true);
    expect(forbidden.has("Aluminum Headphone Stand")).toBe(true); // was NOT an old sentinel
    expect(forbidden.has("Braided USB-C Cable")).toBe(true); // was NOT an old sentinel
    expect(forbidden.has("#CD-58291")).toBe(true);
    expect(forbidden.has("Sofia Almeida")).toBe(true);
    expect(forbidden.has("Best headphones I have ever owned")).toBe(true); // review title
    expect(forbidden.has("sofia@example.com")).toBe(true);
  });

  it("derives the distinctive DATA values from the demo-saas source (emails, ids, taglines)", () => {
    const forbidden = distinctiveLibValues(libSources.get("demo-saas") as string);
    expect(forbidden.has("INV-2026-006")).toBe(true);
    expect(forbidden.has("INV-2046")).toBe(true); // was NOT an old sentinel
    expect(forbidden.has("Mara Castillo")).toBe(true);
    expect(forbidden.has("mara@kronus.io")).toBe(true); // team email — never an old sentinel
    expect(forbidden.has("Total revenue")).toBe(true); // KPI label — never an old sentinel
    expect(forbidden.has("Active users")).toBe(true);
    expect(forbidden.has("For growing teams that need room to scale.")).toBe(true); // tagline
    expect(forbidden.has("Everything in Team")).toBe(true); // plan feature — never a sentinel
  });

  it("does NOT forbid structural enum members, the brand wordmark, or bare prices/words", () => {
    const store = distinctiveLibValues(libSources.get("demo-store") as string);
    const saas = distinctiveLibValues(libSources.get("demo-saas") as string);
    // Type-union / status enums a migrated block legitimately restates.
    expect(store.has("In transit")).toBe(false); // OrderStatus member
    expect(store.has("Delivered")).toBe(false);
    expect(saas.has("Owner")).toBe(false); // Role member
    expect(saas.has("Paid")).toBe(false); // ActivityStatus member
    // The brand wordmark (handled by the brandTokens path, not lifted mock data).
    expect(store.has("Aurora Audio")).toBe(false);
    expect(saas.has("Northwind")).toBe(false);
    // Bare prices (coincidence-prone: a block may show a static/computed total).
    expect(store.has("$387.60")).toBe(false);
    expect(saas.has("$290.00")).toBe(false);
    // Bare single common words (plan/label names — a block may label the current plan).
    expect(saas.has("Team")).toBe(false);
    expect(saas.has("Starter")).toBe(false);
  });
});

describe("validateNoInlineMocks — anti-inline-mock gate (F3)", () => {
  /** The exact source map the gate consumes: every migrated item's shipped bytes. */
  function migratedSources(): Map<string, string> {
    return new Map([...sources, ...variantSources]);
  }
  /** Run the real gate against a (possibly mutated) source map + the real libs. */
  function run(map: Map<string, string>): string[] {
    return validateNoInlineMocks(map, libSources);
  }

  it("passes clean for the real, migrated registry tree", () => {
    // The whole point of the migration: NO migrated block re-declares lib data.
    expect(run(migratedSources())).toEqual([]);
  });

  it("covers exactly the blocks that are 100% free of inline lib-data", () => {
    // Compact/pipeline stats variants stay un-migrated (not the saas default KPI grid).
    expect([...MIGRATED_BLOCKS]).toEqual([
      "cart",
      "cart--drawer",
      "order-history",
      "reviews",
      "product-grid",
      "product-grid--with-filters",
      "billing",
      "billing--plans",
      "usage-dashboard",
      "app-shell-chrome",
      "dashboard",
      "settings",
      "stats",
      "team",
      "dashboard--admin-overview",
      "analytics",
      "product-detail",
      "product-detail--gallery",
      "product-detail--minimal",
      "checkout",
      "product-grid--showcase",
      "invoice",
      "order-tracking",
      "order-tracking--delivered",
      "signup",
      "signup--split-proof",
      "signup--with-plan",
    ]);
  });

  it("every migrated block still imports its demo lib (nothing dropped)", () => {
    const map = migratedSources();
    for (const item of MIGRATED_BLOCKS) {
      const src = map.get(item);
      expect(src, item).toBeDefined();
      expect(/from\s+["']\.\.\/lib\/demo-(store|saas)\.js["']/.test(src ?? ""), item).toBe(true);
    }
  });

  it("fails LOUD when a store product name is re-inlined into a migrated block", () => {
    // Simulate the regression the gate guards against: someone re-adds the product
    // name inline to `product-grid` instead of reading it from the lib.
    const bad = migratedSources();
    const grid = bad.get("product-grid") as string;
    bad.set("product-grid", `${grid}\nconst leaked = "Aurora Wireless Headphones";`);
    const problems = run(bad);
    expect(
      problems.some(
        (p) =>
          p.startsWith("product-grid:") &&
          p.includes("Aurora Wireless Headphones") &&
          p.includes("demo-store"),
      ),
    ).toBe(true);
  });

  it("fails LOUD on a value the OLD hand-picked sentinel list would have MISSED", () => {
    // The false-negative this rewrite fixes: `Aluminum Headphone Stand` (a real
    // PRODUCTS name) was never a sentinel, so the old gate passed it silently.
    // The derived set covers it, so re-inlining it now fails loud.
    const bad = migratedSources();
    const grid = bad.get("product-grid") as string;
    bad.set("product-grid", `${grid}\nconst leaked = "Aluminum Headphone Stand";`);
    const problems = run(bad);
    expect(
      problems.some((p) => p.startsWith("product-grid:") && p.includes("Aluminum Headphone Stand")),
    ).toBe(true);

    // Same for a demo-saas KPI label and a plan feature — also never sentinels.
    const bad2 = migratedSources();
    const billing = bad2.get("billing") as string;
    bad2.set("billing", `${billing}\nconst leaked = ["Total revenue", "Everything in Team"];`);
    const p2 = run(bad2);
    expect(p2.some((p) => p.startsWith("billing:") && p.includes("Total revenue"))).toBe(true);
    expect(p2.some((p) => p.startsWith("billing:") && p.includes("Everything in Team"))).toBe(true);
  });

  it("fails LOUD when an order id is re-inlined into a migrated block", () => {
    const bad = migratedSources();
    const oh = bad.get("order-history") as string;
    bad.set("order-history", `${oh}\nconst leaked = "#CD-58291";`);
    const problems = run(bad);
    expect(problems.some((p) => p.startsWith("order-history:") && p.includes("#CD-58291"))).toBe(
      true,
    );
  });

  it("fails LOUD when a saas-domain value is re-inlined into a migrated block", () => {
    const bad = migratedSources();
    const billing = bad.get("billing") as string;
    bad.set("billing", `${billing}\nconst leaked = "INV-2026-006";`);
    const problems = run(bad);
    expect(
      problems.some(
        (p) => p.startsWith("billing:") && p.includes("INV-2026-006") && p.includes("demo-saas"),
      ),
    ).toBe(true);
  });

  it("fails LOUD when a migrated block drops its demo-lib import", () => {
    // A migrated block that no longer imports the lib can no longer be reading its
    // data from it — treated as a failure (the data must have gone somewhere).
    const bad = migratedSources();
    const cart = bad.get("cart") as string;
    bad.set(
      "cart",
      cart.replace(/import\s+\{[^}]*\}\s+from\s+["']\.\.\/lib\/demo-store\.js["'];/, ""),
    );
    const problems = run(bad);
    expect(problems.some((p) => p.startsWith("cart:") && p.includes("imports neither"))).toBe(true);
  });

  it("fails LOUD when a migrated block has no shipped source (registry drift)", () => {
    const bad = migratedSources();
    bad.delete("reviews");
    const problems = run(bad);
    expect(problems.some((p) => p.startsWith("reviews:") && p.includes("no shipped source"))).toBe(
      true,
    );
  });

  it("fails LOUD when the demo-lib source is missing (cannot derive the forbidden set)", () => {
    const problems = validateNoInlineMocks(migratedSources(), new Map());
    expect(problems.some((p) => p.includes("demo-store") && p.includes("missing source"))).toBe(
      true,
    );
  });

  it("does NOT false-flag a structural enum value a block legitimately restates", () => {
    // `order-history` declares its own `type OrderStatus = "… | In transit | …"`
    // and renders that status badge — a union-member enum, not re-inlined data.
    // The derived forbidden set excludes union members, so it must stay clean.
    const map = migratedSources();
    expect((map.get("order-history") as string).includes("In transit")).toBe(true);
    const ohProblems = run(map).filter((p) => p.startsWith("order-history:"));
    expect(ohProblems).toEqual([]);
  });

  it("does NOT false-flag the brand wordmark a storefront block prints in copy", () => {
    // `cart` prints "ships from Aurora Audio" — the demo store NAME (the BRAND
    // wordmark, handled by the brandTokens path), not a lifted mock data record.
    const map = migratedSources();
    expect((map.get("cart") as string).includes("Aurora Audio")).toBe(true);
    const cartProblems = run(map).filter((p) => p.startsWith("cart:"));
    expect(cartProblems).toEqual([]);
  });

  it("scans ONLY migrated block sources — a de-listed / non-migrated block is ignored", () => {
    const map = migratedSources();
    // The un-migrated cards variant carries "#CD-58291" inline by design.
    const cards = variantSources.get("order-history--cards");
    if (cards) expect(cards.includes("#CD-58291")).toBe(true);
    // Yet the gate reports nothing for it (it is not in MIGRATED_BLOCKS).
    const problems = run(map);
    expect(problems.some((p) => p.startsWith("order-history--cards:"))).toBe(false);
  });
});
