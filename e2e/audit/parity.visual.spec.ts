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

  test("label default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "label", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "label-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("textarea empty aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "textarea", "empty", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "textarea-empty-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("checkbox off aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "checkbox", "off", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "checkbox-off-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("switch off aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "switch", "off", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "switch-off-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("spinner default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "spinner", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "spinner-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("separator horizontal aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "separator", "horizontal", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "separator-horizontal-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("kbd default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "kbd", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "kbd-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("toggle off aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "toggle", "off", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "toggle-off-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("progress half aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "progress", "half", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "progress-half-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("alert default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "alert", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "alert-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("skeleton default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "skeleton", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "skeleton-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("banner default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "banner", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "banner-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("slider half aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "slider", "half", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "slider-half-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("radio-group default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "radio-group", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "radio-group-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("chip default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "chip", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "chip-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("avatar fallback aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "avatar", "fallback", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "avatar-fallback-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("card default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "card", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "card-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("empty default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "empty", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "empty-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("field default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "field", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "field-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("input-group default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "input-group", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "input-group-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("rating default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "rating", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "rating-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("copy-button default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "copy-button", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "copy-button-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("fab default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "fab", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "fab-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("toggle-group default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "toggle-group", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "toggle-group-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("metric default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "metric", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "metric-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("avatar-group default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "avatar-group", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "avatar-group-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("button-group default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "button-group", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "button-group-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("combobox default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "combobox", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "combobox-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("stepper default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "stepper", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "stepper-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("input-otp default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "input-otp", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "input-otp-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("file-dropzone default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "file-dropzone", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "file-dropzone-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("popover default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "popover", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "popover-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("hover-card default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "hover-card", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "hover-card-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("dropdown-menu default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "dropdown-menu", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "dropdown-menu-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("collapsible default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "collapsible", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "collapsible-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("mode-toggle default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "mode-toggle", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "mode-toggle-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("command default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "command", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "command-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("menubar default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "menubar", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "menubar-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("context-menu default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "context-menu", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "context-menu-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("drawer default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "drawer", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "drawer-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("sheet default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "sheet", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "sheet-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("calendar default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "calendar", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "calendar-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("date-picker default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "date-picker", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "date-picker-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("time-picker default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "time-picker", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "time-picker-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("date-range-picker default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "date-range-picker", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "date-range-picker-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("area-chart default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "area-chart", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "area-chart-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("bar-chart default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "bar-chart", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "bar-chart-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("line-chart default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "line-chart", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "line-chart-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("sparkline default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "sparkline", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "sparkline-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("pie-chart default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "pie-chart", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "pie-chart-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("data-table default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "data-table", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "data-table-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("sidebar default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "sidebar", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "sidebar-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("sonner default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "sonner", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "sonner-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });

  test("navigation-menu default aurora/dark", async ({ page }) => {
    const frame = await openAudit(page, "navigation-menu", "default", "aurora", "dark");
    await expect(frame.locator("[data-audit-canvas]")).toHaveScreenshot(
      "navigation-menu-default-aurora-dark.png",
      SCREENSHOT_OPTIONS,
    );
  });
});
