import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CLI_VERSION,
  CONFIG_FILE,
  DEFAULT_CONFIG,
  type InstalledRecord,
  readConfig,
} from "../config.js";
import { registrySourceAtVersion, registrySourceVersion } from "../registry.js";
import { addPage } from "./add-page.js";
import { composeApp } from "./compose.js";
import { REPORT_FILE, upgrade } from "./upgrade.js";

/**
 * These tests exercise the real command end-to-end against LOCAL registry
 * directories laid out exactly like the release-pinned remote
 * (`<root>/v<version>/registry/*.json`) — the same "inject a fetcher" seam the
 * CLI already ships (Registry accepts a local dir), so no module mocks needed.
 * `git merge-file` is invoked for real (git is present in CI).
 */

const BASE_VERSION = "0.0.1";
const WIDGET_FILE = join("components", "ui", "widget.tsx");

/** 9 spaced lines so non-overlapping top/bottom edits merge cleanly. */
const lines = (overrides: Record<string, number> = {}): string =>
  `${["a", "b", "c", "d", "e", "f", "g", "h", "i"]
    .map((name) => `export const ${name} = ${overrides[name] ?? 1};`)
    .join("\n")}\n`;

const BASE_CONTENT = lines();
const TARGET_CONTENT = lines({ i: 99 }); // upstream edits the bottom
const LOCAL_CONTENT = lines({ a: 10 }); // user edits the top
const LOCAL_CONFLICT = lines({ e: 5 }); // user edits the middle …
const TARGET_CONFLICT = lines({ e: 55 }); // … upstream edits it differently

interface TestItem {
  name: string;
  type: string;
  dependencies: string[];
  registryDependencies: string[];
  files: { path: string; content: string; target: string }[];
}

function makeItem(name: string, files: Record<string, string>): TestItem {
  return {
    name,
    type: "registry:ui",
    dependencies: [],
    registryDependencies: [],
    files: Object.entries(files).map(([path, content]) => ({ path, content, target: "ui" })),
  };
}

/** Lay out `<root>/v<version>/registry/{index.json,<item>.json}`. */
function writeRegistry(root: string, version: string, items: TestItem[]): string {
  const dir = join(root, `v${version}`, "registry");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "index.json"),
    JSON.stringify(items.map(({ files: _f, ...meta }) => meta)),
  );
  for (const item of items) {
    writeFileSync(join(dir, `${item.name}.json`), JSON.stringify(item));
  }
  return dir;
}

describe("registry source version pinning", () => {
  it("extracts and re-pins the /vX.Y.Z/ segment of the default registry URL", () => {
    const url = "https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v0.2.0/registry";
    expect(registrySourceVersion(url)).toBe("0.2.0");
    expect(registrySourceAtVersion(url, "0.1.0")).toBe(
      "https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v0.1.0/registry",
    );
  });

  it("returns undefined for sources without a version segment", () => {
    expect(registrySourceVersion("/some/local/registry")).toBeUndefined();
    expect(registrySourceAtVersion("/some/local/registry", "0.1.0")).toBeUndefined();
  });
});

describe("upgrade", () => {
  let root: string;
  let cwd: string;
  let logs: string[];
  let errors: string[];

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cronus-ui-upgrade-test-"));
    cwd = join(root, "project");
    mkdirSync(join(cwd, "components", "ui"), { recursive: true });
    logs = [];
    errors = [];
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      logs.push(args.join(" "));
    });
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      errors.push(args.join(" "));
    });
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  function setup(args: {
    baseContent?: string;
    targetContent: string;
    localContent?: string;
    installed?: Record<string, InstalledRecord>;
  }): void {
    if (args.baseContent !== undefined) {
      writeRegistry(root, BASE_VERSION, [makeItem("widget", { "widget.tsx": args.baseContent })]);
    }
    const registry = writeRegistry(root, CLI_VERSION, [
      makeItem("widget", { "widget.tsx": args.targetContent }),
    ]);
    writeFileSync(
      join(cwd, CONFIG_FILE),
      JSON.stringify(
        { ...DEFAULT_CONFIG, registry, ...(args.installed ? { installed: args.installed } : {}) },
        null,
        2,
      ),
    );
    if (args.localContent !== undefined) {
      writeFileSync(join(cwd, WIDGET_FILE), args.localContent, "utf8");
    }
  }

  const manifest = (version = BASE_VERSION): Record<string, InstalledRecord> => ({
    widget: { version, files: [WIDGET_FILE] },
  });

  const localFile = (): string => readFileSync(join(cwd, WIDGET_FILE), "utf8");
  const loggedText = (): string => logs.join("\n");

  it("fast-forwards a file with no local edits and bumps the manifest", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONTENT,
      localContent: BASE_CONTENT,
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd });

    expect(localFile()).toBe(TARGET_CONTENT);
    const config = await readConfig(cwd);
    expect(config.installed?.widget).toEqual({ version: CLI_VERSION, files: [WIDGET_FILE] });
    expect(existsSync(join(cwd, REPORT_FILE))).toBe(false);
  });

  it("reports up-to-date files and still records the new version", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONTENT,
      localContent: TARGET_CONTENT,
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd });

    expect(localFile()).toBe(TARGET_CONTENT);
    expect((await readConfig(cwd)).installed?.widget?.version).toBe(CLI_VERSION);
  });

  it("keeps local edits untouched when upstream did not change the file", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: BASE_CONTENT, // upstream unchanged between releases
      localContent: LOCAL_CONTENT,
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd });

    expect(localFile()).toBe(LOCAL_CONTENT);
    expect((await readConfig(cwd)).installed?.widget?.version).toBe(CLI_VERSION);
  });

  it("3-way merges non-overlapping local and upstream edits (both survive)", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONTENT, // bottom edit
      localContent: LOCAL_CONTENT, // top edit
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd });

    const merged = localFile();
    expect(merged).toContain("export const a = 10;"); // local edit kept
    expect(merged).toContain("export const i = 99;"); // upstream edit adopted
    expect(merged).not.toContain("<<<<<<<");
    expect((await readConfig(cwd)).installed?.widget?.version).toBe(CLI_VERSION);
  });

  it("leaves a conflicted file untouched when the user declines, but writes the report", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONFLICT,
      localContent: LOCAL_CONFLICT,
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd, confirm: async () => false });

    expect(localFile()).toBe(LOCAL_CONFLICT); // untouched
    // Manifest must NOT be bumped: the file still embodies the old base.
    expect((await readConfig(cwd)).installed?.widget?.version).toBe(BASE_VERSION);

    const report = readFileSync(join(cwd, REPORT_FILE), "utf8");
    expect(report).toContain("## File status");
    expect(report).toContain("| widget |");
    expect(report).toContain("````text");
    expect(report).toContain("3-way merge `components/ui/widget.tsx`");
    // The base→upstream diff rides along so an agent can resolve it.
    expect(report).toContain("-export const e = 1;");
    expect(report).toContain("+export const e = 55;");
    expect(report).toContain(`registry v${BASE_VERSION}`);
  });

  it("writes conflict markers with --yes and bumps the manifest", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONFLICT,
      localContent: LOCAL_CONFLICT,
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd, yes: true });

    const onDisk = localFile();
    expect(onDisk).toContain("<<<<<<< LOCAL (your edits)");
    expect(onDisk).toContain(`||||||| BASE (registry v${BASE_VERSION})`);
    expect(onDisk).toContain(`>>>>>>> UPSTREAM (registry v${CLI_VERSION})`);
    expect(onDisk).toContain("export const e = 5;");
    expect(onDisk).toContain("export const e = 55;");
    expect((await readConfig(cwd)).installed?.widget?.version).toBe(CLI_VERSION);
    expect(existsSync(join(cwd, REPORT_FILE))).toBe(true);
  });

  it("writes conflict markers when the interactive confirmation answers yes", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONFLICT,
      localContent: LOCAL_CONFLICT,
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd, confirm: async () => true });

    expect(localFile()).toContain("<<<<<<< LOCAL (your edits)");
  });

  it("dry-run writes nothing: no files, no report, no manifest change", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONFLICT,
      localContent: LOCAL_CONFLICT,
      installed: manifest(),
    });

    await upgrade(["widget"], { cwd, dryRun: true, yes: true });

    expect(localFile()).toBe(LOCAL_CONFLICT);
    expect(existsSync(join(cwd, REPORT_FILE))).toBe(false);
    expect((await readConfig(cwd)).installed?.widget?.version).toBe(BASE_VERSION);
    expect(loggedText()).toContain("CONFLICT");
    expect(loggedText()).toContain("Nothing written (dry-run)");
  });

  it("legacy install matching upstream: records the manifest going forward", async () => {
    setup({ targetContent: TARGET_CONTENT, localContent: TARGET_CONTENT }); // no manifest

    await upgrade(["widget"], { cwd });

    expect((await readConfig(cwd)).installed?.widget).toEqual({
      version: CLI_VERSION,
      files: [WIDGET_FILE],
    });
  });

  it("legacy install that differs: kept without --overwrite, reported with a 2-way prompt", async () => {
    setup({ targetContent: TARGET_CONTENT, localContent: LOCAL_CONTENT });

    await upgrade(["widget"], { cwd, yes: true }); // yes alone must not overwrite

    expect(localFile()).toBe(LOCAL_CONTENT);
    expect((await readConfig(cwd)).installed?.widget).toBeUndefined();
    const report = readFileSync(join(cwd, REPORT_FILE), "utf8");
    expect(report).toContain("2-way merge `components/ui/widget.tsx`");
    expect(report).toContain("+export const i = 99;");
  });

  it("legacy install with --overwrite --yes: replaced and recorded", async () => {
    setup({ targetContent: TARGET_CONTENT, localContent: LOCAL_CONTENT });

    await upgrade(["widget"], { cwd, overwrite: true, yes: true });

    expect(localFile()).toBe(TARGET_CONTENT);
    expect((await readConfig(cwd)).installed?.widget).toEqual({
      version: CLI_VERSION,
      files: [WIDGET_FILE],
    });
  });

  it("falls back to the 2-way path when the installed version's registry is missing", async () => {
    // Manifest points at a release that was never published locally.
    setup({
      targetContent: TARGET_CONTENT,
      localContent: LOCAL_CONTENT,
      installed: manifest("0.0.9"),
    });

    await upgrade(["widget"], { cwd });

    expect(localFile()).toBe(LOCAL_CONTENT); // nothing clobbered
    expect(loggedText()).toContain("was it published?");
    expect((await readConfig(cwd)).installed?.widget?.version).toBe("0.0.9"); // not bumped
  });

  it("adds new upstream files, respects local deletions, and never deletes removed files", async () => {
    writeRegistry(root, BASE_VERSION, [
      makeItem("widget", { "widget.tsx": BASE_CONTENT, "old.ts": "export const old = 1;\n" }),
    ]);
    const registry = writeRegistry(root, CLI_VERSION, [
      makeItem("widget", { "widget.tsx": TARGET_CONTENT, "extra.ts": "export const extra = 1;\n" }),
    ]);
    writeFileSync(
      join(cwd, CONFIG_FILE),
      JSON.stringify({
        ...DEFAULT_CONFIG,
        registry,
        installed: {
          widget: {
            version: BASE_VERSION,
            files: [WIDGET_FILE, join("components", "ui", "old.ts")],
          },
        },
      }),
    );
    // widget.tsx locally deleted; old.ts (dropped upstream) still on disk.
    writeFileSync(join(cwd, "components", "ui", "old.ts"), "export const old = 1;\n", "utf8");

    await upgrade(["widget"], { cwd });

    expect(existsSync(join(cwd, WIDGET_FILE))).toBe(false); // deletion respected
    expect(readFileSync(join(cwd, "components", "ui", "extra.ts"), "utf8")).toBe(
      "export const extra = 1;\n",
    );
    expect(readFileSync(join(cwd, "components", "ui", "old.ts"), "utf8")).toBe(
      "export const old = 1;\n",
    ); // removed upstream but never deleted locally
    const config = await readConfig(cwd);
    expect(config.installed?.widget).toEqual({
      version: CLI_VERSION,
      files: [WIDGET_FILE, join("components", "ui", "extra.ts")],
    });
  });

  it("--all upgrades every manifest entry", async () => {
    setup({
      baseContent: BASE_CONTENT,
      targetContent: TARGET_CONTENT,
      localContent: BASE_CONTENT,
      installed: manifest(),
    });

    await upgrade([], { cwd, all: true });

    expect(localFile()).toBe(TARGET_CONTENT);
  });

  it("--all on a pre-manifest project scans the registry for locally installed items", async () => {
    setup({ targetContent: TARGET_CONTENT, localContent: TARGET_CONTENT }); // legacy, file present

    await upgrade([], { cwd, all: true });

    expect((await readConfig(cwd)).installed?.widget?.version).toBe(CLI_VERSION);
  });

  it("errors when called with neither names nor --all", async () => {
    setup({ targetContent: TARGET_CONTENT });

    await upgrade([], { cwd });

    expect(process.exitCode).toBe(1);
  });

  it("suggests the closest name for a typo", async () => {
    setup({ targetContent: TARGET_CONTENT });

    await upgrade(["wdget"], { cwd });

    expect(process.exitCode).toBe(1);
    expect(errors.join("\n")).toContain('Did you mean "widget"?');
  });
});

const REPO_REGISTRY = fileURLToPath(new URL("../../../../registry", import.meta.url));
const HAS_REGISTRY = existsSync(join(REPO_REGISTRY, "meta.json"));
const HOME_PAGE = "app/(site)/page.tsx";
const FAQ_PAGE = "app/(site)/faq/page.tsx";

/** Write a tiny custom app manifest (one chrome group, one `/` page). */
function writeTinyManifest(dir: string, blocks: string[], name = "tiny"): string {
  const path = join(dir, `${name}.json`);
  writeFileSync(
    path,
    JSON.stringify({
      name,
      type: "registry:app",
      planVersion: 1,
      manifest: {
        title: "Tiny",
        description: "test",
        chrome: { site: { navbar: "navbar", footer: "footer" } },
        pages: [{ route: "/", title: "Home", nav: "Home", chrome: "site", blocks }],
      },
    }),
  );
  return path;
}

function seedComposeProject(cwd: string, name = "loja"): void {
  mkdirSync(cwd, { recursive: true });
  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({ name, version: "0.0.0", private: true }),
  );
  writeFileSync(
    join(cwd, CONFIG_FILE),
    JSON.stringify({ ...DEFAULT_CONFIG, registry: REPO_REGISTRY }, null, 2),
  );
}

describe.skipIf(!HAS_REGISTRY)("upgrade --all — composed pages (F4)", () => {
  let root: string;
  let cwd: string;
  let logs: string[];
  let errors: string[];

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cronus-ui-upgrade-compose-"));
    cwd = join(root, "project");
    seedComposeProject(cwd);
    logs = [];
    errors = [];
    vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      logs.push(args.join(" "));
    });
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      errors.push(args.join(" "));
    });
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  const loggedText = (): string => logs.join("\n");
  const errorText = (): string => errors.join("\n");
  const pageFile = (rel = HOME_PAGE): string => readFileSync(join(cwd, rel), "utf8");
  const snapFile = (key: string, rel = HOME_PAGE): string =>
    readFileSync(join(cwd, `.cronus-ui/base/${key}/${rel}`), "utf8");

  async function composeTiny(manifestPath: string): Promise<void> {
    await composeApp({
      targetDir: cwd,
      manifestPath,
      skipInstall: true,
      choices: { brand: "Acme" },
    });
  }

  it("compose snapshot path is the composed key, not the package name", async () => {
    await composeTiny(writeTinyManifest(cwd, ["hero"]));
    expect(existsSync(join(cwd, `.cronus-ui/base/tiny/${HOME_PAGE}`))).toBe(true);
    expect(existsSync(join(cwd, `.cronus-ui/base/loja/${HOME_PAGE}`))).toBe(false);
  });

  it("fast-forwards a composed page when local == snapshot and upstream gained a block", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"]);
    await composeTiny(manifestPath);
    expect(pageFile()).toContain("<HeroBlock />");
    expect(pageFile()).not.toContain("<CtaBlock />");
    expect(snapFile("tiny")).toBe(pageFile());

    writeTinyManifest(cwd, ["hero", "cta"]);
    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, manifestPath });

    expect(pageFile()).toContain("<CtaBlock />");
    expect(pageFile()).toContain("<HeroBlock />");
    expect(snapFile("tiny")).toBe(pageFile());
    expect((await readConfig(cwd)).composed?.tiny?.version).toBe(CLI_VERSION);
    expect((await readConfig(cwd)).installed?.cta).toBeDefined();
    expect(existsSync(join(cwd, "components/blocks/cta.tsx"))).toBe(true);
    expect(loggedText()).toContain("fast-forward");
  });

  it("keeps local page edits when upstream did not change", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"]);
    await composeTiny(manifestPath);
    const marker = "// KEEP-ME-UNIQUE";
    writeFileSync(join(cwd, HOME_PAGE), `${marker}\n${pageFile()}`, "utf8");
    const snapBefore = snapFile("tiny");

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, manifestPath });

    expect(pageFile()).toContain(marker);
    expect(snapFile("tiny")).toBe(snapBefore);
    expect(loggedText()).toContain("kept your edits");
  });

  it("leaves a conflicted composed page untouched without --yes", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"]);
    await composeTiny(manifestPath);
    const localRewrite = [
      "// USER REWRITE",
      "export default function HomePage() {",
      "  return <div>mine</div>;",
      "}",
      "",
    ].join("\n");
    writeFileSync(join(cwd, HOME_PAGE), localRewrite, "utf8");
    const snapBefore = snapFile("tiny");
    writeTinyManifest(cwd, ["hero", "cta"]);

    await upgrade([], {
      cwd,
      all: true,
      registry: REPO_REGISTRY,
      manifestPath,
      confirm: async () => false,
    });

    expect(pageFile()).toBe(localRewrite);
    expect(pageFile()).not.toContain("<<<<<<<");
    expect(snapFile("tiny")).toBe(snapBefore);
    expect(loggedText()).toContain("CONFLICT");
  });

  it("writes composed-page conflict markers with --yes and snapshots upstream", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"]);
    await composeTiny(manifestPath);
    writeFileSync(
      join(cwd, HOME_PAGE),
      [
        "// USER REWRITE",
        "export default function HomePage() {",
        "  return <div>mine</div>;",
        "}",
        "",
      ].join("\n"),
      "utf8",
    );
    writeTinyManifest(cwd, ["hero", "cta"]);

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, manifestPath, yes: true });

    expect(pageFile()).toContain("<<<<<<< LOCAL (your edits)");
    expect(pageFile()).toContain(">>>>>>> UPSTREAM");
    // Snapshot is the new upstream render, not the conflict-marked local file.
    expect(snapFile("tiny")).toContain("<CtaBlock />");
    expect(snapFile("tiny")).not.toContain("<<<<<<<");
  });

  it("does not delete an add-page route when upgrading other pages", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"]);
    await composeTiny(manifestPath);
    await addPage({
      targetDir: cwd,
      route: "/faq",
      blocks: ["faq"],
      skipInstall: true,
      manifestPath,
    });
    expect(existsSync(join(cwd, FAQ_PAGE))).toBe(true);
    expect((await readConfig(cwd)).composed?.tiny?.choices.pages).toEqual(["/", "/faq"]);

    writeTinyManifest(cwd, ["hero", "cta"]);
    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, manifestPath });

    expect(existsSync(join(cwd, FAQ_PAGE))).toBe(true);
    expect(pageFile(FAQ_PAGE)).toContain("<Faq");
    expect((await readConfig(cwd)).composed?.tiny?.choices.pages).toEqual(["/", "/faq"]);
    expect(pageFile()).toContain("<CtaBlock />");
  });

  it("dry-run writes nothing: page, snapshot, and cronus-ui.json stay identical", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"]);
    await composeTiny(manifestPath);
    writeTinyManifest(cwd, ["hero", "cta"]);
    const pageBefore = pageFile();
    const snapBefore = snapFile("tiny");
    const jsonBefore = readFileSync(join(cwd, CONFIG_FILE), "utf8");

    await upgrade([], {
      cwd,
      all: true,
      dryRun: true,
      yes: true,
      registry: REPO_REGISTRY,
      manifestPath,
    });

    expect(pageFile()).toBe(pageBefore);
    expect(snapFile("tiny")).toBe(snapBefore);
    expect(readFileSync(join(cwd, CONFIG_FILE), "utf8")).toBe(jsonBefore);
    expect(existsSync(join(cwd, REPORT_FILE))).toBe(false);
    expect(existsSync(join(cwd, "components/blocks/cta.tsx"))).toBe(false);
    expect(loggedText()).toContain("would install cta");
    expect(loggedText()).toContain("Nothing written (dry-run)");
  });

  it("fails loud on a bundled-name collision without --manifest", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"], "landing");
    await composeTiny(manifestPath);
    const pageBefore = pageFile();
    const jsonBefore = readFileSync(join(cwd, CONFIG_FILE), "utf8");

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY });

    expect(process.exitCode).toBe(1);
    expect(errorText()).toMatch(/provenance hash mismatch|Re-run with --manifest/);
    expect(pageFile()).toBe(pageBefore);
    expect(readFileSync(join(cwd, CONFIG_FILE), "utf8")).toBe(jsonBefore);
  });

  it("named upgrade does not touch composed pages", async () => {
    const manifestPath = writeTinyManifest(cwd, ["hero"]);
    await composeTiny(manifestPath);
    writeTinyManifest(cwd, ["hero", "cta"]);
    const pageBefore = pageFile();
    const snapBefore = snapFile("tiny");

    await upgrade(["hero"], { cwd, registry: REPO_REGISTRY });

    expect(pageFile()).toBe(pageBefore);
    expect(pageFile()).not.toContain("<CtaBlock />");
    expect(snapFile("tiny")).toBe(snapBefore);
  });
});

describe.skipIf(!HAS_REGISTRY)("upgrade — gold-path chrome", () => {
  let root: string;
  let cwd: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cronus-ui-upgrade-gold-"));
    cwd = join(root, "project");
    seedComposeProject(cwd, "Painel");
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  const chromeRel = "components/blocks/app-shell-chrome.tsx";
  const chromeFile = (): string => readFileSync(join(cwd, chromeRel), "utf8");

  it("upgrade --all on saas keeps WorkspaceMenu after a catalog chrome overwrite", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    expect(chromeFile()).toContain("WorkspaceMenu");
    expect(chromeFile()).toContain("InviteMember");
    expect(chromeFile()).toContain("SessionUser");

    const catalog = JSON.parse(
      readFileSync(join(REPO_REGISTRY, "app-shell-chrome.json"), "utf8"),
    ) as { files: { content: string }[] };
    const mara = catalog.files[0]?.content;
    expect(mara).toBeDefined();
    writeFileSync(join(cwd, chromeRel), mara as string);

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });

    const chrome = chromeFile();
    expect(chrome).toContain("WorkspaceMenu");
    expect(chrome).toContain("InviteMember");
    expect(chrome).toContain("SessionUser");
    expect(chrome).not.toContain("WORKSPACES");
    expect(chrome).not.toContain("WorkspaceSwitcher");
    expect(chrome).not.toContain("InviteDialog");
    expect(chrome).not.toContain('href: "/analytics"');
    expect(chrome).not.toContain('href: "/billing"');
    expect(chrome).not.toContain('href: "/settings"');
  });

  it("upgrade --all on saas strips catalog nav restored onto gold chrome", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    const gold = chromeFile();
    expect(gold).not.toContain('href: "/analytics"');
    writeFileSync(
      join(cwd, chromeRel),
      gold.replace(
        /const APP_NAV = \[[\s\S]*?\];/,
        `const APP_NAV = [
  { label: "Items", href: "/" },
  { label: "Analytics", href: "/analytics" },
  { label: "Team", href: "/team" },
  { label: "Billing", href: "/billing" },
];`,
      ),
    );

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });

    const chrome = chromeFile();
    expect(chrome).toContain("WorkspaceMenu");
    expect(chrome).toContain('{ label: "Items", href: "/" }');
    expect(chrome).toContain('{ label: "Team", href: "/team" }');
    expect(chrome).not.toContain('href: "/analytics"');
    expect(chrome).not.toContain('href: "/billing"');
  });

  it("upgrade --all on saas is a no-op on already gold-patched chrome", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    const before = chromeFile();
    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });
    expect(chromeFile()).toBe(before);
    expect(chromeFile()).toContain("WorkspaceMenu");
  });

  const layoutRel = "app/(shell)/layout.tsx";
  const teamRel = "app/(shell)/team/page.tsx";
  const homeRel = "app/(shell)/page.tsx";
  const layoutFile = (): string => readFileSync(join(cwd, layoutRel), "utf8");
  const teamFile = (): string => readFileSync(join(cwd, teamRel), "utf8");
  const homeFile = (): string => readFileSync(join(cwd, homeRel), "utf8");

  it("upgrade --all on saas keeps the session gate and MembersPanel", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    expect(layoutFile()).toContain("auth.api.getSession");
    expect(layoutFile()).toContain('redirect("/login")');
    expect(teamFile()).toContain("MembersPanel");
    expect(teamFile()).not.toContain("TeamBlock");

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });

    expect(layoutFile()).toContain("auth.api.getSession");
    expect(layoutFile()).toContain('redirect("/login")');
    expect(layoutFile()).toContain('from "@/lib/auth"');
    expect(teamFile()).toContain("MembersPanel");
    expect(teamFile()).not.toContain("TeamBlock");
  });

  it("upgrade --all on saas restores layout and team after a catalog overwrite", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });

    writeFileSync(
      join(cwd, layoutRel),
      `import type { ReactNode } from "react";
import { AppShellNav } from "@/components/blocks/chrome/app-shell";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return <AppShellNav>{children}</AppShellNav>;
}
`,
    );
    writeFileSync(
      join(cwd, teamRel),
      `import { TeamBlock } from "@/components/blocks/team";

export const metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <main className="flex min-h-svh flex-col">
      <TeamBlock />
    </main>
  );
}
`,
    );

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });

    expect(layoutFile()).toContain("auth.api.getSession");
    expect(layoutFile()).toContain('redirect("/login")');
    expect(layoutFile()).not.toMatch(
      /export default function ShellLayout[\s\S]*return <AppShellNav>\{children\}<\/AppShellNav>/,
    );
    expect(teamFile()).toContain("MembersPanel");
    expect(teamFile()).toContain("export default async function");
    expect(teamFile()).not.toContain("TeamBlock");
  });

  it("upgrade --all on saas is a no-op on already gold-patched layout and team", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    const beforeLayout = layoutFile();
    const beforeTeam = teamFile();
    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });
    expect(layoutFile()).toBe(beforeLayout);
    expect(teamFile()).toBe(beforeTeam);
  });

  it("upgrade --all on saas keeps ItemsPanel on home", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    expect(homeFile()).toContain("ItemsPanel");
    expect(homeFile()).not.toContain("DashboardAnalyticsBlock");
    expect(homeFile()).not.toContain("StatsBlock");

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });

    expect(homeFile()).toContain("ItemsPanel");
    expect(homeFile()).toContain("export default async function");
    expect(homeFile()).not.toContain("DashboardAnalyticsBlock");
    expect(homeFile()).not.toContain("StatsBlock");
  });

  it("upgrade --all on saas restores home after a catalog overwrite", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });

    writeFileSync(
      join(cwd, homeRel),
      `import { DashboardAnalyticsBlock } from "@/components/blocks/dashboard";
import { StatsBlock } from "@/components/blocks/stats";

export const metadata = { title: "Items" };

export default function HomePage() {
  return (
    <main className="flex min-h-svh flex-col">
      <DashboardAnalyticsBlock />
      <StatsBlock />
    </main>
  );
}
`,
    );

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });

    expect(homeFile()).toContain("ItemsPanel");
    expect(homeFile()).toContain("export default async function");
    expect(homeFile()).not.toContain("DashboardAnalyticsBlock");
    expect(homeFile()).not.toContain("StatsBlock");
  });

  it("upgrade --all on saas is a no-op on already gold-patched home", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    const before = homeFile();
    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });
    expect(homeFile()).toBe(before);
    expect(homeFile()).toContain("ItemsPanel");
  });

  it("upgrade --all on saas re-emits owned gold-path files", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    writeFileSync(join(cwd, "lib", "items.ts"), "// STALE\n");
    writeFileSync(join(cwd, "lib", "members.ts"), "// STALE\n");
    writeFileSync(join(cwd, "lib", "auth-adapter.ts"), "// STALE\n");
    writeFileSync(join(cwd, "components", "invite-member.tsx"), "// STALE\n");
    writeFileSync(join(cwd, "components", "session-user.tsx"), "// STALE\n");

    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });

    expect(readFileSync(join(cwd, "lib", "items.ts"), "utf8")).toContain("createItem");
    expect(readFileSync(join(cwd, "lib", "members.ts"), "utf8")).toContain("loadMembers");
    expect(readFileSync(join(cwd, "lib", "auth-adapter.ts"), "utf8")).toContain("authClient");
    expect(readFileSync(join(cwd, "components", "invite-member.tsx"), "utf8")).toContain(
      "inviteMember",
    );
    expect(readFileSync(join(cwd, "components", "session-user.tsx"), "utf8")).toContain("signOut");
  });

  it("upgrade --all on saas does not overwrite lib/auth.ts", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    writeFileSync(join(cwd, "lib", "auth.ts"), "// KEEP AUTH\n");
    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });
    expect(readFileSync(join(cwd, "lib", "auth.ts"), "utf8")).toBe("// KEEP AUTH\n");
  });

  it("upgrade --all on saas is a no-op on already gold owned files", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    const beforeItems = readFileSync(join(cwd, "lib", "items.ts"), "utf8");
    const beforeInvite = readFileSync(join(cwd, "components", "invite-member.tsx"), "utf8");
    await upgrade([], { cwd, all: true, registry: REPO_REGISTRY, yes: true });
    expect(readFileSync(join(cwd, "lib", "items.ts"), "utf8")).toBe(beforeItems);
    expect(readFileSync(join(cwd, "components", "invite-member.tsx"), "utf8")).toBe(beforeInvite);
  });

  it("named upgrade does not re-emit owned gold-path files", async () => {
    await composeApp({
      targetDir: cwd,
      template: "saas",
      choices: { brand: "Painel" },
      skipInstall: true,
    });
    writeFileSync(join(cwd, "components", "invite-member.tsx"), "// STALE\n");
    await upgrade(["stats"], { cwd, registry: REPO_REGISTRY, yes: true });
    expect(readFileSync(join(cwd, "components", "invite-member.tsx"), "utf8")).toBe("// STALE\n");
  });
});
