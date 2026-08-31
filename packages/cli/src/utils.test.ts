import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "./config.js";
import type { RegistryItem } from "./registry.js";
import {
  mergeDependencySpecsIntoPackageJson,
  resolveSafeDest,
  splitDependencySpec,
  targetDir,
  writeItemFiles,
} from "./utils.js";

const cwd = "/tmp/project";
const dir = "components/ui";

describe("resolveSafeDest (path-traversal containment)", () => {
  it("accepts a normal file directly under the target dir", () => {
    expect(resolveSafeDest(cwd, dir, "button.tsx")).toBe(resolve(cwd, dir, "button.tsx"));
  });

  it("accepts a nested path that stays inside the target dir", () => {
    expect(resolveSafeDest(cwd, dir, "primitives/button.tsx")).toBe(
      resolve(cwd, dir, "primitives/button.tsx"),
    );
  });

  it("rejects a '../escape' traversal path", () => {
    expect(() => resolveSafeDest(cwd, dir, "../escape")).toThrow(/outside target directory/);
  });

  it("rejects deep traversal that escapes the root", () => {
    expect(() => resolveSafeDest(cwd, dir, "../../../../etc/passwd")).toThrow(
      /outside target directory/,
    );
  });

  it("rejects an absolute path", () => {
    expect(() => resolveSafeDest(cwd, dir, "/etc/passwd")).toThrow(/absolute registry path/);
  });

  it("rejects traversal that re-enters via a sibling prefix", () => {
    // "components/ui-evil" must NOT be accepted as inside "components/ui".
    expect(() => resolveSafeDest(cwd, "components/ui", "../ui-evil/x.tsx")).toThrow(
      /outside target directory/,
    );
  });
});

describe("targetDir (file kind → consumer path)", () => {
  it("maps a block target to paths.blocks", () => {
    expect(targetDir(DEFAULT_CONFIG, "block")).toBe(DEFAULT_CONFIG.paths.blocks);
  });

  it("still maps ui and lib targets to their paths", () => {
    expect(targetDir(DEFAULT_CONFIG, "ui")).toBe(DEFAULT_CONFIG.paths.ui);
    expect(targetDir(DEFAULT_CONFIG, "lib")).toBe(DEFAULT_CONFIG.paths.lib);
  });
});

describe("splitDependencySpec", () => {
  it("splits unscoped and scoped specs with ranges", () => {
    expect(splitDependencySpec("lucide-react@^0.577.0")).toEqual({
      name: "lucide-react",
      range: "^0.577.0",
    });
    expect(splitDependencySpec("@cronus-ui/ui@0.6.1")).toEqual({
      name: "@cronus-ui/ui",
      range: "0.6.1",
    });
  });

  it("leaves a bare name without a range", () => {
    expect(splitDependencySpec("clsx")).toEqual({ name: "clsx", range: undefined });
    expect(splitDependencySpec("@cronus-ui/ui")).toEqual({
      name: "@cronus-ui/ui",
      range: undefined,
    });
  });
});

describe("mergeDependencySpecsIntoPackageJson", () => {
  it("pins missing specs and keeps existing ranges", () => {
    const raw = JSON.stringify(
      { name: "app", dependencies: { next: "16.2.10", "@cronus-ui/ui": "^0.6.1" } },
      null,
      2,
    );
    const next = JSON.parse(
      mergeDependencySpecsIntoPackageJson(raw, [
        "lucide-react@^0.577.0",
        "recharts@^3.9.2",
        "@cronus-ui/ui@0.6.1",
        "clsx",
      ]),
    ) as { dependencies: Record<string, string> };
    expect(next.dependencies["lucide-react"]).toBe("^0.577.0");
    expect(next.dependencies.recharts).toBe("^3.9.2");
    expect(next.dependencies["@cronus-ui/ui"]).toBe("^0.6.1");
    expect(next.dependencies.clsx).toBeUndefined();
    expect(next.dependencies.next).toBe("16.2.10");
  });

  it("returns the original string when nothing new is added", () => {
    const raw = '{"name":"app","dependencies":{"lucide-react":"^0.577.0"}}';
    expect(mergeDependencySpecsIntoPackageJson(raw, ["lucide-react@^0.577.0"])).toBe(raw);
  });
});

describe("writeItemFiles (registry:block)", () => {
  let projectDir: string;

  beforeEach(() => {
    projectDir = mkdtempSync(join(tmpdir(), "cronus-ui-blk-"));
  });

  afterEach(() => {
    rmSync(projectDir, { recursive: true, force: true });
  });

  it("writes a block to paths.blocks and leaves @cronus-ui/ui imports untouched", async () => {
    const source =
      'import { Button, Card } from "@cronus-ui/ui";\n\nexport function Dashboard() {}\n';
    const item: RegistryItem = {
      name: "dashboard",
      type: "registry:block",
      dependencies: ["@cronus-ui/ui@0.2.0", "lucide-react@^0.460.0"],
      registryDependencies: [],
      files: [{ path: "dashboard.tsx", content: source, target: "block" }],
    };

    const { written, skipped } = await writeItemFiles(item, DEFAULT_CONFIG, projectDir, {
      overwrite: true,
    });

    const expectedRel = join(DEFAULT_CONFIG.paths.blocks, "dashboard.tsx");
    expect(written).toEqual([expectedRel]);
    expect(skipped).toEqual([]);

    const onDisk = readFileSync(join(projectDir, expectedRel), "utf8");
    expect(onDisk).toContain('from "@cronus-ui/ui"');
    expect(onDisk).toBe(source);
  });
});
