import { expect, test } from "@playwright/test";
import { cronusFrame, freezeFrame, SCREENSHOT_OPTIONS } from "./audit-freeze";

const DEFAULT_THEMES = [
  { preset: "aurora", mode: "dark" },
  { preset: "aurora", mode: "light" },
  { preset: "neutral", mode: "dark" },
] as const;

async function openAudit(
  page: import("@playwright/test").Page,
  slug: string,
  fixture: string,
  preset: string,
  mode: string,
  dir = "ltr",
) {
  await page.goto(`/audit/${slug}?fixture=${fixture}&preset=${preset}&mode=${mode}&dir=${dir}`);
  const frame = cronusFrame(page);
  await expect(frame.locator("[data-audit-canvas]")).toBeVisible();
  await freezeFrame(frame);
  return frame;
}

test.describe("visual parity", () => {
  for (const { preset, mode } of DEFAULT_THEMES) {
    test(`button primary-md ${preset}/${mode}`, async ({ page }) => {
      const frame = await openAudit(page, "button", "primary-md", preset, mode);
      await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
        `button-primary-md-${preset}-${mode}.png`,
        SCREENSHOT_OPTIONS,
      );
    });

    test(`badge default ${preset}/${mode}`, async ({ page }) => {
      const frame = await openAudit(page, "badge", "default", preset, mode);
      await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
        `badge-default-${preset}-${mode}.png`,
        SCREENSHOT_OPTIONS,
      );
    });

    test(`input empty ${preset}/${mode}`, async ({ page }) => {
      const frame = await openAudit(page, "input", "empty", preset, mode);
      await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
        `input-empty-${preset}-${mode}.png`,
        SCREENSHOT_OPTIONS,
      );
    });
  }

  test("button hover aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "button", "primary-md", "aurora", "dark");
    await frame.locator('[data-slot="button"]').hover();
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "button-hover-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("button disabled aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "button", "disabled", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "button-disabled-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("button as-link aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "button", "as-link", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "button-as-link-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("button rtl aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "button", "primary-md", "aurora", "dark", "rtl");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "button-rtl-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("badge rtl aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "badge", "default", "aurora", "dark", "rtl");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "badge-rtl-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("input disabled aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "input", "disabled", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "input-disabled-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("input invalid aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "input", "invalid", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "input-invalid-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("input rtl aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "input", "empty", "aurora", "dark", "rtl");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "input-rtl-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });
});
