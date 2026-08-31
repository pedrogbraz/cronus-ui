import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CLI_VERSION, CONFIG_FILE, DEFAULT_CONFIG, readConfig } from "../config.js";
import { add } from "./add.js";

const WIDGET_FILE = join("components", "ui", "widget.tsx");
const CONTENT = "export const widget = 1;\n";

/** Lay out a local registry dir with a single dependency-free ui item. */
function writeRegistry(dir: string, content = CONTENT): void {
  mkdirSync(dir, { recursive: true });
  const item = {
    name: "widget",
    type: "registry:ui",
    dependencies: [],
    registryDependencies: [],
    files: [{ path: "widget.tsx", content, target: "ui" }],
  };
  writeFileSync(join(dir, "index.json"), JSON.stringify([{ ...item, files: undefined }]));
  writeFileSync(join(dir, "widget.json"), JSON.stringify(item));
}

describe("add records the install manifest", () => {
  let root: string;
  let cwd: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "cronus-ui-add-test-"));
    cwd = join(root, "project");
    mkdirSync(cwd, { recursive: true });
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  function writeConfigFile(registry: string): void {
    writeFileSync(join(cwd, CONFIG_FILE), JSON.stringify({ ...DEFAULT_CONFIG, registry }, null, 2));
  }

  it("records registry npm pins into package.json even with --no-install", async () => {
    const registry = join(root, "registry");
    writeRegistry(registry);
    const itemPath = join(registry, "widget.json");
    const item = JSON.parse(readFileSync(itemPath, "utf8")) as {
      dependencies: string[];
    };
    item.dependencies = ["lucide-react@^0.577.0"];
    writeFileSync(itemPath, JSON.stringify(item));
    writeConfigFile(registry);
    writeFileSync(
      join(cwd, "package.json"),
      JSON.stringify({ name: "app", version: "0.0.0", private: true, dependencies: {} }),
    );

    await add(["widget"], { cwd, skipInstall: true });

    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies["lucide-react"]).toBe("^0.577.0");
  });

  it("writes an installed entry with the version and file list", async () => {
    const registry = join(root, "registry"); // unversioned source → pins CLI_VERSION
    writeRegistry(registry);
    writeConfigFile(registry);

    await add(["widget"], { cwd, skipInstall: true });

    expect(readFileSync(join(cwd, WIDGET_FILE), "utf8")).toBe(CONTENT);
    const config = await readConfig(cwd);
    expect(config.installed?.widget).toEqual({ version: CLI_VERSION, files: [WIDGET_FILE] });
  });

  it("records the release version when the registry source is version-pinned", async () => {
    const registry = join(root, "v0.0.1", "registry");
    writeRegistry(registry);
    writeConfigFile(registry);

    await add(["widget"], { cwd, skipInstall: true });

    expect((await readConfig(cwd)).installed?.widget?.version).toBe("0.0.1");
  });

  it("does not record an item whose files were skipped (existing, no --overwrite)", async () => {
    const registry = join(root, "registry");
    writeRegistry(registry);
    writeConfigFile(registry);
    // A pre-existing (possibly edited) file: add must skip it AND must not pin
    // the manifest to today's release, or upgrade would merge from a wrong base.
    mkdirSync(join(cwd, "components", "ui"), { recursive: true });
    writeFileSync(join(cwd, WIDGET_FILE), "export const widget = 2; // edited\n", "utf8");

    await add(["widget"], { cwd, skipInstall: true });

    expect((await readConfig(cwd)).installed?.widget).toBeUndefined();
  });

  it("re-records the entry on --overwrite", async () => {
    const registry = join(root, "registry");
    writeRegistry(registry);
    writeConfigFile(registry);
    mkdirSync(join(cwd, "components", "ui"), { recursive: true });
    writeFileSync(join(cwd, WIDGET_FILE), "export const widget = 2; // edited\n", "utf8");

    await add(["widget"], { cwd, skipInstall: true, overwrite: true });

    expect((await readConfig(cwd)).installed?.widget).toEqual({
      version: CLI_VERSION,
      files: [WIDGET_FILE],
    });
  });
});
