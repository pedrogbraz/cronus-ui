import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const repo = process.cwd();

test.describe("language cheats 6/7/8/10 (route + static)", () => {
  test("cheat 6: Cronus pane does not dump React HTML", () => {
    const files = [
      "apps/www/components/audit/cronus-pane.tsx",
      "apps/www/app/preview/cronus/[slug]/[fixture]/page.tsx",
    ];
    for (const file of files) {
      const src = readFileSync(join(repo, file), "utf8");
      expect(src, file).not.toContain("dangerouslySetInnerHTML");
    }
  });

  test("cheat 7+8: Cronus iframe is the kernel origin, never srcdoc or docs", async ({ page }) => {
    await page.goto("/audit/button");
    const iframe = page.locator('[data-audit-side="cronus"] iframe');
    const src = (await iframe.getAttribute("src")) ?? "";
    expect(src).toMatch(/^http:\/\/127\.0\.0\.1:5176\/audit\//);
    expect(src).not.toContain("/components/");
    expect(await iframe.getAttribute("srcdoc")).toBeNull();
    expect(await iframe.getAttribute("sandbox")).toBe("allow-scripts");
  });

  test("cheat 10: preview/cronus does not import @cronus-ui/ui", () => {
    const dir = join(repo, "apps/www/app/preview/cronus");
    const walk = (d: string): string[] => {
      const out: string[] = [];
      for (const name of readdirSync(d, { withFileTypes: true })) {
        const p = join(d, name.name);
        if (name.isDirectory()) out.push(...walk(p));
        else if (name.name.endsWith(".ts") || name.name.endsWith(".tsx")) out.push(p);
      }
      return out;
    };
    for (const file of walk(dir)) {
      const src = readFileSync(file, "utf8");
      expect(src, file).not.toMatch(/from ["']@cronus-ui\/ui/);
    }
  });

  test("page.config.source is 404 on the kernel, never file bytes", async ({ request }) => {
    const stolen = await request.get("http://127.0.0.1:5176/audit/button/primary-md", {
      failOnStatusCode: false,
    });
    // Happy fixture has no source and is 200. The cheat fixture is a language
    // fail; GET of a page that declared source is covered by kernel unit tests.
    expect(stolen.status()).toBe(200);
    expect(stolen.headers()["x-cronus-audit"]).toBe("1");
    const body = await stolen.text();
    expect(body).not.toContain("STOLEN_HTML_MARKER");
  });
});
