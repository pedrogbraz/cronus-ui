import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { ComposedRecord } from "../config.js";
import {
  baseSnapshotDir,
  listBaseSnapshotRels,
  readBaseSnapshot,
  reloadManifest,
} from "./reload.js";

const stubRecord = (hash?: string): ComposedRecord => ({
  version: "0.5.0",
  planVersion: 1,
  choices: { variants: {}, pages: ["/"], brand: "Acme" },
  files: [],
  ...(hash !== undefined ? { manifestHash: hash } : {}),
});

describe("baseSnapshotDir", () => {
  it("is .cronus-ui/base/<composed-key>", () => {
    expect(baseSnapshotDir("landing")).toBe(join(".cronus-ui", "base", "landing"));
    expect(baseSnapshotDir("tiny")).toBe(join(".cronus-ui", "base", "tiny"));
  });
});

describe("readBaseSnapshot — composed-key first, package-name fallback", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "cronus-snapshot-"));
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  const rel = join("app", "(site)", "page.tsx");

  function writeSnap(appKey: string, content: string): void {
    const dest = join(cwd, ".cronus-ui", "base", appKey, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, content, "utf8");
  }

  it("reads from the composed-key dir when present", async () => {
    writeSnap("landing", "NEW");
    writeSnap("loja", "LEGACY");
    expect(await readBaseSnapshot(cwd, "landing", "loja", rel)).toBe("NEW");
  });

  it("falls back to the package-name dir when the composed-key file is missing", async () => {
    writeSnap("loja", "LEGACY");
    expect(await readBaseSnapshot(cwd, "landing", "loja", rel)).toBe("LEGACY");
  });

  it("returns undefined when neither dir has the file", async () => {
    expect(await readBaseSnapshot(cwd, "landing", "loja", rel)).toBeUndefined();
  });

  it("lists rels from both dirs (union) so mixed pre/post-fix snapshots are visible", async () => {
    writeSnap("landing", "NEW");
    const extra = join("app", "(site)", "faq", "page.tsx");
    const dest = join(cwd, ".cronus-ui", "base", "loja", extra);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, "FAQ", "utf8");
    const rels = await listBaseSnapshotRels(cwd, "landing", "loja");
    expect(rels).toContain(rel);
    expect(rels).toContain(extra);
  });
});

describe("reloadManifest — provenance", () => {
  it("fails loud when a custom --manifest app collides with a bundled template", async () => {
    await expect(reloadManifest("landing", undefined, stubRecord("deadbeef"))).rejects.toThrow(
      /provenance hash mismatch|Re-run with --manifest/,
    );
  });

  it("fails loud when the composed key is not a bundled template", async () => {
    await expect(reloadManifest("tiny", undefined, stubRecord())).rejects.toThrow(
      /Pass --manifest <file>/,
    );
  });

  it("loads an explicit --manifest file without checking provenance", async () => {
    const dir = mkdtempSync(join(tmpdir(), "cronus-manifest-"));
    const path = join(dir, "custom.json");
    writeFileSync(
      path,
      JSON.stringify({
        name: "landing",
        type: "registry:app",
        planVersion: 1,
        manifest: {
          title: "Custom",
          description: "x",
          chrome: { site: { navbar: "navbar", footer: "footer" } },
          pages: [{ route: "/", title: "Home", chrome: "site", blocks: ["hero"] }],
        },
      }),
    );
    try {
      const loaded = await reloadManifest("landing", path, stubRecord("deadbeef"));
      expect(loaded.name).toBe("landing");
      expect(loaded.manifest.pages).toHaveLength(1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("readBaseSnapshot dest round-trip", () => {
  it("does not invent a package-name snapshot when keys match", async () => {
    const cwd = mkdtempSync(join(tmpdir(), "cronus-samekey-"));
    try {
      const rel = join("app", "(site)", "page.tsx");
      const dest = join(cwd, ".cronus-ui", "base", "tiny", rel);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, "OK", "utf8");
      expect(await readBaseSnapshot(cwd, "tiny", "tiny", rel)).toBe("OK");
      expect(readFileSync(dest, "utf8")).toBe("OK");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
