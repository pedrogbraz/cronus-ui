import { expect, test } from "@playwright/test";
import { cronusFrame } from "./audit-freeze";

test.describe("harness browser", () => {
  test("split view has React and Cronus panes with kernel iframe", async ({ page }) => {
    await page.goto("/audit/button?fixture=primary-md&preset=aurora&mode=dark");
    await expect(page.locator('[data-audit-side="react"]')).toBeVisible();
    await expect(page.locator('[data-audit-side="cronus"]')).toBeVisible();
    const iframe = page.locator('[data-audit-side="cronus"] iframe');
    await expect(iframe).toHaveAttribute(
      "src",
      /http:\/\/127\.0\.0\.1:5176\/audit\/button\/primary-md/,
    );
    await expect(iframe).not.toHaveAttribute("srcdoc", /./);
    const src = await iframe.getAttribute("src");
    expect(src).not.toContain("/components/");
    expect(src).not.toContain("srcdoc");

    const kernel = await page.request.get(
      "http://127.0.0.1:5176/audit/button/primary-md?preset=aurora&mode=dark",
    );
    expect(kernel.ok()).toBeTruthy();
    expect(kernel.headers()["x-cronus-audit"]).toBe("1");
    expect(kernel.headers()["x-cronus-engine"]).toBe("cronus-lang/0.1.0");
    const body = await kernel.text();
    expect(body).toContain("data-audit-canvas");
    expect(body).not.toContain("<script");

    const canvas = cronusFrame(page).locator("[data-audit-canvas]");
    await expect(canvas).toBeVisible();
    await expect(canvas.locator('[data-slot="button"]')).toBeVisible();
  });

  test("toolbar preset rewrites the iframe query", async ({ page }) => {
    await page.goto("/audit/button?fixture=primary-md&preset=aurora&mode=dark");
    await page.getByLabel("Preset").selectOption("neutral");
    await expect(page.locator('[data-audit-side="cronus"] iframe')).toHaveAttribute(
      "src",
      /preset=neutral/,
    );
  });
});
