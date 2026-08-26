import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CONFIG_FILE, DEFAULT_CONFIG, readConfig } from "../config.js";
import { OVERRIDES_BEGIN, OVERRIDES_END, themeAdd, themeSet } from "./theme.js";

const LAYOUT = `import { KronusThemeScript } from "@kronus-ui/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <KronusThemeScript defaultThemeName="aurora" defaultModeName="dark" />
      </head>
      <body>{children}</body>
    </html>
  );
}
`;

function writeLayout(cwd: string, content = LAYOUT): string {
  mkdirSync(join(cwd, "app"), { recursive: true });
  const path = join(cwd, "app/layout.tsx");
  writeFileSync(path, content, "utf8");
  return path;
}

function writeConfigFile(cwd: string, theme?: { name: string; mode: string }): void {
  const config = { ...DEFAULT_CONFIG, ...(theme ? { theme } : {}) };
  writeFileSync(join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

describe("themeSet", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "kronus-ui-theme-"));
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
  });

  it("rewrites the layout theme name and records it in config.theme", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "midnight", cwd });

    const onDisk = readFileSync(layoutPath, "utf8");
    expect(onDisk).toContain('defaultThemeName="midnight"');
    expect(onDisk).not.toContain('defaultThemeName="aurora"');
    // --mode omitted → the existing mode attribute is left untouched.
    expect(onDisk).toContain('defaultModeName="dark"');

    const config = await readConfig(cwd);
    // Preserves the config's existing mode when --mode is omitted.
    expect(config.theme).toEqual({ name: "midnight", mode: "dark" });
  });

  it("rewrites both attributes and config when --mode is given", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "sunset", mode: "light", cwd });

    const onDisk = readFileSync(layoutPath, "utf8");
    expect(onDisk).toContain('defaultThemeName="sunset"');
    expect(onDisk).toContain('defaultModeName="light"');

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "sunset", mode: "light" });
  });

  it("defaults the mode to dark when config has none and --mode is omitted", async () => {
    writeLayout(cwd);
    writeConfigFile(cwd); // no theme block

    await themeSet({ name: "emerald", cwd });

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "emerald", mode: "dark" });
  });

  it("is idempotent — a re-run reports zero attribute changes and leaves the file byte-identical", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "neutral", mode: "light", cwd });
    const first = readFileSync(layoutPath, "utf8");

    await themeSet({ name: "neutral", mode: "light", cwd });
    const second = readFileSync(layoutPath, "utf8");

    expect(second).toBe(first);
    expect(second).toContain('defaultThemeName="neutral"');
    expect(second).toContain('defaultModeName="light"');
  });

  it("rejects an unknown theme without touching the layout or config", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await expect(themeSet({ name: "bogus", cwd })).resolves.toBeUndefined();

    expect(readFileSync(layoutPath, "utf8")).toBe(LAYOUT);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });

  it("rejects an invalid mode without touching the layout or config", async () => {
    const layoutPath = writeLayout(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await expect(themeSet({ name: "emerald", mode: "sepia", cwd })).resolves.toBeUndefined();

    expect(readFileSync(layoutPath, "utf8")).toBe(LAYOUT);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });

  it("still updates config when no layout file is present", async () => {
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await expect(themeSet({ name: "midnight", mode: "light", cwd })).resolves.toBeUndefined();

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "midnight", mode: "light" });
  });

  it("ignores a layout that does not mount the theme runtime", async () => {
    // A layout.tsx without KronusThemeScript/KronusUIProvider must be left alone.
    const bare = "export default function RootLayout() {\n  return null;\n}\n";
    const layoutPath = writeLayout(cwd, bare);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeSet({ name: "midnight", cwd });

    expect(readFileSync(layoutPath, "utf8")).toBe(bare);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "midnight", mode: "dark" });
  });

  it("does not crash when there is no kronus-ui.json", async () => {
    writeLayout(cwd);

    await expect(themeSet({ name: "sunset", cwd })).resolves.toBeUndefined();

    const onDisk = readFileSync(join(cwd, "app/layout.tsx"), "utf8");
    expect(onDisk).toContain('defaultThemeName="sunset"');
  });
});

const GLOBALS = `@import "tailwindcss";\n@import "@kronus-ui/tokens/styles.css";\n`;

function writeGlobals(cwd: string, content = GLOBALS): string {
  mkdirSync(join(cwd, "app"), { recursive: true });
  const path = join(cwd, "app/globals.css");
  writeFileSync(path, content, "utf8");
  return path;
}

/** Encode a permalink payload with the Create Studio's `?c=` codec (base64url JSON). */
function encodeToken(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/** The Studio's "Editorial"-flavored customization: light stone + rose + warm + serif. */
const EDITORIAL_TOKEN = encodeToken({
  m: "light",
  b: "stone",
  r: "rose",
  c: "warm",
  h: "serif",
  d: 12,
});
const EDITORIAL_URL = `https://ui.testkronus.cloud/create?c=${EDITORIAL_TOKEN}`;

describe("themeAdd", () => {
  let cwd: string;

  beforeEach(() => {
    cwd = mkdtempSync(join(tmpdir(), "kronus-ui-theme-add-"));
  });

  afterEach(() => {
    rmSync(cwd, { recursive: true, force: true });
    process.exitCode = undefined;
  });

  it("applies a Create Studio permalink: layout, config, and a marked overrides block", async () => {
    const layoutPath = writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeAdd({ source: EDITORIAL_URL, cwd });

    // Layout pins the neutral base preset + the theme's mode (Studio provider-export parity).
    const layout = readFileSync(layoutPath, "utf8");
    expect(layout).toContain('defaultThemeName="neutral"');
    expect(layout).toContain('defaultModeName="light"');

    // The marked block carries the computed overrides.
    const globals = readFileSync(globalsPath, "utf8");
    expect(globals).toContain(OVERRIDES_BEGIN);
    expect(globals).toContain(OVERRIDES_END);
    expect(globals).toContain(":root[data-kronus-theme] {");
    // rose (light mode → primaryLight/accentLight), mirrored into ring/info.
    expect(globals).toContain("--kronus-primary: oklch(0.53 0.2 18);");
    expect(globals).toContain("--kronus-ring: oklch(0.53 0.2 18);");
    expect(globals).toContain("--kronus-accent: oklch(0.55 0.17 0);");
    expect(globals).toContain("--kronus-info: oklch(0.55 0.17 0);");
    // stone light ramp + warm charts + serif display + 12px radius.
    expect(globals).toContain("--kronus-surface-base: oklch(0.985 0.003 70);");
    expect(globals).toContain("--kronus-chart-1: oklch(0.82 0.13 88);");
    expect(globals).toContain(
      '--kronus-font-display: Charter, "Iowan Old Style", "New York", Georgia, ui-serif, serif;',
    );
    expect(globals).toContain("--kronus-radius: 12px;");
    // The original imports stay untouched above the block.
    expect(globals.startsWith(GLOBALS)).toBe(true);

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "neutral", mode: "light" });
    expect(process.exitCode).toBeUndefined();
  });

  it("accepts a bare c= payload", async () => {
    writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeConfigFile(cwd);

    await themeAdd({ source: `c=${EDITORIAL_TOKEN}`, cwd });

    const globals = readFileSync(globalsPath, "utf8");
    expect(globals).toContain("--kronus-primary: oklch(0.53 0.2 18);");
    expect(process.exitCode).toBeUndefined();
  });

  it("applies an exported theme JSON file (full DesignConfig shape)", async () => {
    const layoutPath = writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "light" });
    const themeJson = {
      style: "Terminal",
      mode: "dark",
      baseColor: "neutral",
      brand: "emerald",
      chart: "neutral",
      headingFont: "mono",
      bodyFont: "mono",
      iconLibrary: "remix",
      radius: 4,
    };
    writeFileSync(join(cwd, "my-theme.json"), JSON.stringify(themeJson, null, 2), "utf8");

    await themeAdd({ source: "my-theme.json", cwd });

    const layout = readFileSync(layoutPath, "utf8");
    expect(layout).toContain('defaultThemeName="neutral"');
    expect(layout).toContain('defaultModeName="dark"');

    const globals = readFileSync(globalsPath, "utf8");
    // emerald dark primary + neutral dark ramp + mono fonts + 4px radius.
    expect(globals).toContain("--kronus-primary: oklch(0.715 0.155 162.5);");
    expect(globals).toContain("--kronus-surface-base: oklch(0.11 0 0);");
    expect(globals).toContain(
      '--kronus-font-sans: "SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;',
    );
    expect(globals).toContain("--kronus-radius: 4px;");

    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "neutral", mode: "dark" });
  });

  it("applies a saved-preset JSON ({ name, config }) and honors safe freeform colors", async () => {
    writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    const preset = {
      name: "Brand kit",
      config: {
        mode: "dark",
        baseColor: "slate",
        brand: "teal",
        chart: "brand",
        headingFont: "grotesk",
        bodyFont: "inter",
        iconLibrary: "lucide",
        primaryColor: "#ff0044",
        radius: 20,
      },
    };
    writeFileSync(join(cwd, "preset.json"), JSON.stringify(preset), "utf8");

    await themeAdd({ source: "preset.json", cwd });

    const globals = readFileSync(globalsPath, "utf8");
    // The freeform primary wins over the brand's value and feeds ring + glow.
    expect(globals).toContain("--kronus-primary: #ff0044;");
    expect(globals).toContain("--kronus-ring: #ff0044;");
    expect(globals).toContain("--kronus-surface-base: oklch(0.11 0.012 252);");
    expect(globals).toContain("--kronus-radius: 20px;");
  });

  it("rejects an undecodable payload without touching any file", async () => {
    const layoutPath = writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await expect(themeAdd({ source: "!!!not-base64url!!!", cwd })).resolves.toBeUndefined();

    expect(process.exitCode).toBe(1);
    expect(readFileSync(layoutPath, "utf8")).toBe(LAYOUT);
    expect(readFileSync(globalsPath, "utf8")).toBe(GLOBALS);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });

  it("rejects a permalink URL without a c= payload", async () => {
    writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);

    await themeAdd({ source: "https://ui.testkronus.cloud/create", cwd });

    expect(process.exitCode).toBe(1);
    expect(readFileSync(globalsPath, "utf8")).toBe(GLOBALS);
  });

  it("rejects a theme JSON with an unknown brand id", async () => {
    writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeFileSync(
      join(cwd, "bad.json"),
      JSON.stringify({
        mode: "dark",
        baseColor: "neutral",
        brand: "hotpink",
        chart: "brand",
        headingFont: "geist",
        bodyFont: "geist",
        radius: 8,
      }),
      "utf8",
    );

    await themeAdd({ source: "bad.json", cwd });

    expect(process.exitCode).toBe(1);
    expect(readFileSync(globalsPath, "utf8")).toBe(GLOBALS);
  });

  it("rejects a theme JSON whose freeform color smells like CSS injection", async () => {
    writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeFileSync(
      join(cwd, "evil.json"),
      JSON.stringify({
        mode: "dark",
        baseColor: "neutral",
        brand: "sky",
        chart: "brand",
        headingFont: "geist",
        bodyFont: "geist",
        radius: 8,
        primaryColor: "red; } :root { background: url(https://evil.example/x)",
      }),
      "utf8",
    );

    await themeAdd({ source: "evil.json", cwd });

    expect(process.exitCode).toBe(1);
    expect(readFileSync(globalsPath, "utf8")).toBe(GLOBALS);
  });

  it("re-running replaces the marked block instead of duplicating it", async () => {
    writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeConfigFile(cwd);

    await themeAdd({ source: EDITORIAL_URL, cwd });
    const first = readFileSync(globalsPath, "utf8");

    // Same source → byte-identical file.
    await themeAdd({ source: EDITORIAL_URL, cwd });
    expect(readFileSync(globalsPath, "utf8")).toBe(first);

    // Different theme → block swapped in place, never duplicated.
    const violetToken = encodeToken({ b: "slate", r: "violet", d: 16 });
    await themeAdd({ source: `https://ui.testkronus.cloud/create?c=${violetToken}`, cwd });
    const second = readFileSync(globalsPath, "utf8");

    expect(second.split(OVERRIDES_BEGIN)).toHaveLength(2);
    expect(second.split(OVERRIDES_END)).toHaveLength(2);
    expect(second).toContain("--kronus-primary: oklch(0.66 0.2 292);");
    expect(second).toContain("--kronus-radius: 16px;");
    expect(second).not.toContain("--kronus-primary: oklch(0.53 0.2 18);");
    expect(second.startsWith(GLOBALS)).toBe(true);
  });

  it("--dry-run prints the plan and writes nothing", async () => {
    const layoutPath = writeLayout(cwd);
    const globalsPath = writeGlobals(cwd);
    writeConfigFile(cwd, { name: "aurora", mode: "dark" });

    await themeAdd({ source: EDITORIAL_URL, cwd, dryRun: true });

    expect(process.exitCode).toBeUndefined();
    expect(readFileSync(layoutPath, "utf8")).toBe(LAYOUT);
    expect(readFileSync(globalsPath, "utf8")).toBe(GLOBALS);
    const config = await readConfig(cwd);
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });
});
