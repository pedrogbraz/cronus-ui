import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyTokens, DB_PUSH_ARGS, scaffold } from "./scaffold.js";
import { CREATE_VERSION } from "./version.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

describe("create-cronus-app release version", () => {
  it("keeps the runtime version aligned with package.json", () => {
    expect(CREATE_VERSION).toBe(pkg.version);
  });
});

describe("DB_PUSH_ARGS", () => {
  it("passes --force through to drizzle-kit for a non-interactive first push", () => {
    expect([...DB_PUSH_ARGS]).toEqual(["run", "db:push", "--", "--force"]);
  });
});

describe("applyTokens", () => {
  it("replaces every __APP_NAME__ occurrence", () => {
    expect(applyTokens('"name": "__APP_NAME__"\n# __APP_NAME__', "my-app")).toBe(
      '"name": "my-app"\n# my-app',
    );
  });

  it("leaves content without tokens untouched", () => {
    expect(applyTokens("const x = 1;", "my-app")).toBe("const x = 1;");
  });
});

describe("scaffold (into a temp dir, no install)", () => {
  let root: string;
  let targetDir: string;
  const name = "scaffold-test-app";

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "create-cronus-app-"));
    targetDir = join(root, name);
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("creates the app dir and copies template files", () => {
    const { fileCount } = scaffold({ targetDir, name });
    expect(existsSync(targetDir)).toBe(true);
    expect(fileCount).toBeGreaterThan(5);
    expect(existsSync(join(targetDir, "app", "page.tsx"))).toBe(true);
  });

  it("writes package.json with the project name and the three @cronus-ui/* deps", () => {
    scaffold({ targetDir, name });
    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      name: string;
      dependencies: Record<string, string>;
    };
    expect(pkg.name).toBe(name);
    expect(pkg.dependencies["@cronus-ui/ui"]).toBe(`^${CREATE_VERSION}`);
    expect(pkg.dependencies["@cronus-ui/tokens"]).toBe(`^${CREATE_VERSION}`);
    expect(pkg.dependencies["@cronus-ui/theme"]).toBe(`^${CREATE_VERSION}`);
  });

  it("renames gitignore → .gitignore (and does not leave the undotted file)", () => {
    scaffold({ targetDir, name });
    expect(existsSync(join(targetDir, ".gitignore"))).toBe(true);
    expect(existsSync(join(targetDir, "gitignore"))).toBe(false);
  });

  it("wires the anti-flash theme script in app/layout.tsx", () => {
    scaffold({ targetDir, name });
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain("CronusThemeScript");
    expect(layout).toContain("CronusUIProvider");
  });

  it("replaces template tokens (no __APP_NAME__ left behind)", () => {
    scaffold({ targetDir, name });
    for (const file of ["package.json", "README.md"]) {
      const content = readFileSync(join(targetDir, file), "utf8");
      expect(content).not.toContain("__APP_NAME__");
      expect(content).toContain(name);
    }
  });

  it("ships a cronus-ui.json so `npx cronus-ui add` works in the app", () => {
    scaffold({ targetDir, name });
    const configPath = join(targetDir, "cronus-ui.json");
    expect(existsSync(configPath)).toBe(true);
    const config = JSON.parse(readFileSync(configPath, "utf8")) as { registry: string };
    expect(config.registry).toBe(
      `https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v${CREATE_VERSION}/registry`,
    );
  });

  it("defaults to the aurora/dark theme when none is given (no tokens left behind)", () => {
    scaffold({ targetDir, name });
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain('defaultThemeName="aurora"');
    expect(layout).toContain('defaultModeName="dark"');
    expect(layout).not.toContain("__THEME__");
    expect(layout).not.toContain("__MODE__");
    const config = JSON.parse(readFileSync(join(targetDir, "cronus-ui.json"), "utf8")) as {
      theme: { name: string; mode: string };
    };
    expect(config.theme).toEqual({ name: "aurora", mode: "dark" });
  });

  it("bakes the chosen theme + mode into layout.tsx and cronus-ui.json", () => {
    scaffold({ targetDir, name, theme: "sunset", mode: "light" });
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain('defaultThemeName="sunset"');
    expect(layout).toContain('defaultModeName="light"');
    const config = JSON.parse(readFileSync(join(targetDir, "cronus-ui.json"), "utf8")) as {
      theme: { name: string; mode: string };
    };
    expect(config.theme).toEqual({ name: "sunset", mode: "light" });
  });

  it('scaffolds the default single-page starter for template: "default"', () => {
    scaffold({ targetDir, name, template: "default" });
    expect(existsSync(join(targetDir, "app", "page.tsx"))).toBe(true);
    // The default template has no extra routes or components dir.
    expect(existsSync(join(targetDir, "app", "settings"))).toBe(false);
    expect(existsSync(join(targetDir, "components"))).toBe(false);
  });

  it.each([
    "store",
    "landing",
    "saas",
  ] as const)('scaffolds the "%s" composed template from the default base (compose runs later)', (template) => {
    const { fileCount } = scaffold({ targetDir, name, template });
    // Composed templates have no bundled dir: they copy the "default" base.
    const defaultTarget = join(root, "default-ref");
    const { fileCount: defaultCount } = scaffold({
      targetDir: defaultTarget,
      name,
      template: "default",
    });
    expect(fileCount).toBe(defaultCount);
    expect(existsSync(join(targetDir, "app", "page.tsx"))).toBe(true);
    expect(existsSync(join(targetDir, "cronus-ui.json"))).toBe(true);
    // Tokens still replaced (the base is the default template).
    const pkgJson = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      name: string;
    };
    expect(pkgJson.name).toBe(name);
  });

  it("scaffolds the dashboard template (shell, pages, chart, table, settings)", () => {
    scaffold({ targetDir, name, template: "dashboard" });

    for (const file of [
      ["app", "page.tsx"],
      ["app", "settings", "page.tsx"],
      ["components", "dashboard-shell.tsx"],
      ["components", "revenue-chart.tsx"],
      ["components", "orders-table.tsx"],
      ["components", "settings-form.tsx"],
      ["cronus-ui.json"],
      [".gitignore"],
    ]) {
      expect(existsSync(join(targetDir, ...file)), file.join("/")).toBe(true);
    }

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      name: string;
      dependencies: Record<string, string>;
    };
    expect(pkg.name).toBe(name);
    expect(pkg.dependencies["@cronus-ui/ui"]).toBe(`^${CREATE_VERSION}`);
    expect(pkg.dependencies.recharts).toBeDefined();
    expect(pkg.dependencies["lucide-react"]).toBeDefined();

    // Tokens replaced everywhere, incl. the shell brand + baked theme/mode.
    const shell = readFileSync(join(targetDir, "components", "dashboard-shell.tsx"), "utf8");
    expect(shell).toContain(name);
    expect(shell).not.toContain("__APP_NAME__");
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain('defaultThemeName="aurora"');
    expect(layout).not.toContain("__THEME__");
  });

  it("scaffolds the marketing template (landing sections + waitlist)", () => {
    scaffold({ targetDir, name, template: "marketing", theme: "emerald", mode: "light" });

    for (const file of [
      ["app", "page.tsx"],
      ["components", "site-header.tsx"],
      ["components", "hero.tsx"],
      ["components", "feature-grid.tsx"],
      ["components", "pricing.tsx"],
      ["components", "testimonials.tsx"],
      ["components", "faq.tsx"],
      ["components", "waitlist-cta.tsx"],
      ["components", "site-footer.tsx"],
      ["cronus-ui.json"],
      [".gitignore"],
    ]) {
      expect(existsSync(join(targetDir, ...file)), file.join("/")).toBe(true);
    }

    const pkg = JSON.parse(readFileSync(join(targetDir, "package.json"), "utf8")) as {
      name: string;
      dependencies: Record<string, string>;
    };
    expect(pkg.name).toBe(name);
    expect(pkg.dependencies["@cronus-ui/theme"]).toBe(`^${CREATE_VERSION}`);

    // Tokens replaced + the chosen theme/mode baked in.
    for (const file of ["README.md", join("components", "site-footer.tsx")]) {
      const content = readFileSync(join(targetDir, file), "utf8");
      expect(content).not.toContain("__APP_NAME__");
      expect(content).toContain(name);
    }
    const layout = readFileSync(join(targetDir, "app", "layout.tsx"), "utf8");
    expect(layout).toContain('defaultThemeName="emerald"');
    expect(layout).toContain('defaultModeName="light"');
  });

  it("throws a friendly error when a template directory cannot be found", () => {
    expect(() =>
      scaffold({ targetDir, name, template: "missing" as unknown as "default" }),
    ).toThrow(/Could not locate the bundled "missing" template/);
  });
});
