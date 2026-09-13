import { expect, test } from "@playwright/test";
import { cssColorToHex } from "../../packages/audit/src/css-color-to-hex";
import { compareLayoutBox } from "../../packages/audit/src/layout-box";
import { cronusFrame } from "./audit-freeze";

test.describe("logic parity", () => {
  test("button data-slot and data-variant; no data-size required", async ({ page }) => {
    await page.goto("/audit/button?fixture=primary-md&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="button"]');
    const cronus = cronusFrame(page).locator('[data-slot="button"]');
    await expect(react).toHaveAttribute("data-variant", "primary");
    await expect(cronus).toHaveAttribute("data-variant", "primary");
    await expect(react).toHaveAttribute("data-slot", "button");
    await expect(cronus).toHaveAttribute("data-slot", "button");
  });

  test("href renders as a link on both sides", async ({ page }) => {
    await page.goto("/audit/button?fixture=as-link&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="button"]');
    const cronus = cronusFrame(page).locator('[data-slot="button"]');
    await expect(react).toHaveRole("link");
    await expect(cronus).toHaveRole("link");
    await expect(react).toHaveAttribute("href", "/docs");
    await expect(cronus).toHaveAttribute("href", "/docs");
  });

  test("disabled button does not fire click", async ({ page }) => {
    await page.goto("/audit/button?fixture=disabled&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="button"]');
    const cronus = cronusFrame(page).locator('[data-slot="button"]');
    await expect(react).toBeDisabled();
    await expect(cronus).toBeDisabled();
  });

  test("input is a raw input, not interact wrapper", async ({ page }) => {
    await page.goto("/audit/input?fixture=empty&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="input"]');
    const cronus = cronusFrame(page).locator('[data-slot="input"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("INPUT");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("INPUT");
    await expect(page.locator('[data-slot="input-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="input-control"]')).toHaveCount(0);
  });

  test("invalid input sets aria-invalid", async ({ page }) => {
    await page.goto("/audit/input?fixture=invalid&preset=aurora&mode=dark");
    await expect(page.locator('[data-audit-side="react"] [data-slot="input"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(cronusFrame(page).locator('[data-slot="input"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("badge is a span", async ({ page }) => {
    await page.goto("/audit/badge?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="badge"]');
    const cronus = cronusFrame(page).locator('[data-slot="badge"]');
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(react).toHaveAttribute("data-variant", "default");
    await expect(cronus).toHaveAttribute("data-variant", "default");
  });

  test("label is a label, not label-control", async ({ page }) => {
    await page.goto("/audit/label?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="label"]');
    const cronus = cronusFrame(page).locator('[data-slot="label"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("LABEL");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("LABEL");
    await expect(page.locator('[data-slot="label-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="label-control"]')).toHaveCount(0);
  });

  test("textarea is a raw textarea, not textarea-control", async ({ page }) => {
    await page.goto("/audit/textarea?fixture=empty&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="textarea"]');
    const cronus = cronusFrame(page).locator('[data-slot="textarea"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("TEXTAREA");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("TEXTAREA");
    await expect(page.locator('[data-slot="textarea-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="textarea-control"]')).toHaveCount(0);
  });

  test("checkbox is a button, not input-control", async ({ page }) => {
    await page.goto("/audit/checkbox?fixture=off&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="checkbox"]');
    const cronus = cronusFrame(page).locator('[data-slot="checkbox"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="checkbox-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="checkbox-control"]')).toHaveCount(0);
  });

  test("switch is a button, not input-control", async ({ page }) => {
    await page.goto("/audit/switch?fixture=off&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="switch"]');
    const cronus = cronusFrame(page).locator('[data-slot="switch"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="switch-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="switch-control"]')).toHaveCount(0);
  });

  test("spinner is an svg status, not spinner-control", async ({ page }) => {
    await page.goto("/audit/spinner?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="spinner"]');
    const cronus = cronusFrame(page).locator('[data-slot="spinner"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("svg");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("svg");
    await expect(react).toHaveAttribute("role", "status");
    await expect(cronus).toHaveAttribute("role", "status");
    await expect(page.locator('[data-slot="spinner-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="spinner-control"]')).toHaveCount(0);
  });

  test("separator is a div, not separator-control", async ({ page }) => {
    await page.goto("/audit/separator?fixture=horizontal&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="separator"]');
    const cronus = cronusFrame(page).locator('[data-slot="separator"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="separator-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="separator-control"]')).toHaveCount(0);
  });

  test("kbd is a kbd, not kbd-control", async ({ page }) => {
    await page.goto("/audit/kbd?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="kbd"]');
    const cronus = cronusFrame(page).locator('[data-slot="kbd"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("KBD");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("KBD");
    await expect(page.locator('[data-slot="kbd-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="kbd-control"]')).toHaveCount(0);
  });

  test("toggle is a button without data-size or data-variant", async ({ page }) => {
    await page.goto("/audit/toggle?fixture=off&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="toggle"]');
    const cronus = cronusFrame(page).locator('[data-slot="toggle"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(react).not.toHaveAttribute("data-size");
    await expect(cronus).not.toHaveAttribute("data-size");
    await expect(react).not.toHaveAttribute("data-variant");
    await expect(cronus).not.toHaveAttribute("data-variant");
    await expect(page.locator('[data-slot="toggle-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="toggle-control"]')).toHaveCount(0);
  });

  test("progress is a div, not progress-control", async ({ page }) => {
    await page.goto("/audit/progress?fixture=half&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="progress"]');
    const cronus = cronusFrame(page).locator('[data-slot="progress"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="progress-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="progress-control"]')).toHaveCount(0);
  });

  test("alert is a div without data-variant", async ({ page }) => {
    await page.goto("/audit/alert?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="alert"]');
    const cronus = cronusFrame(page).locator('[data-slot="alert"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "status");
    await expect(cronus).toHaveAttribute("role", "status");
    await expect(react).not.toHaveAttribute("data-variant");
    await expect(cronus).not.toHaveAttribute("data-variant");
    await expect(page.locator('[data-slot="alert-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="alert-control"]')).toHaveCount(0);
  });

  test("skeleton is a div, not skeleton-control", async ({ page }) => {
    await page.goto("/audit/skeleton?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="skeleton"]');
    const cronus = cronusFrame(page).locator('[data-slot="skeleton"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("aria-hidden", "true");
    await expect(cronus).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator('[data-slot="skeleton-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="skeleton-control"]')).toHaveCount(0);
  });

  test("banner is a section, not banner-control", async ({ page }) => {
    await page.goto("/audit/banner?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="banner"]');
    const cronus = cronusFrame(page).locator('[data-slot="banner"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SECTION");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SECTION");
    await expect(page.locator('[data-slot="banner-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="banner-control"]')).toHaveCount(0);
  });

  test("slider is a span, not input range or slider-control", async ({ page }) => {
    await page.goto("/audit/slider?fixture=half&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="slider"]');
    const cronus = cronusFrame(page).locator('[data-slot="slider"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-audit-side="react"] input[type="range"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('input[type="range"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="slider-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="slider-control"]')).toHaveCount(0);
  });

  test("radio-group is a div radiogroup, not radio-group-control", async ({ page }) => {
    await page.goto("/audit/radio-group?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="radio-group"]');
    const cronus = cronusFrame(page).locator('[data-slot="radio-group"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "radiogroup");
    await expect(cronus).toHaveAttribute("role", "radiogroup");
    await expect(page.locator('[data-slot="radio-group-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="radio-group-control"]')).toHaveCount(0);
  });

  test("chip is a span without data-size, not chip-control", async ({ page }) => {
    await page.goto("/audit/chip?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="chip"]');
    const cronus = cronusFrame(page).locator('[data-slot="chip"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(react).not.toHaveAttribute("data-size");
    await expect(cronus).not.toHaveAttribute("data-size");
    await expect(page.locator('[data-slot="chip-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="chip-control"]')).toHaveCount(0);
  });

  test("avatar is a span, not avatar-control", async ({ page }) => {
    await page.goto("/audit/avatar?fixture=fallback&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="avatar"]');
    const cronus = cronusFrame(page).locator('[data-slot="avatar"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-slot="avatar-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="avatar-control"]')).toHaveCount(0);
  });

  test("card is a div, not card-control", async ({ page }) => {
    await page.goto("/audit/card?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="card"]');
    const cronus = cronusFrame(page).locator('[data-slot="card"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="card-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="card-control"]')).toHaveCount(0);
  });

  test("empty is a div, not empty-control", async ({ page }) => {
    await page.goto("/audit/empty?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="empty"]');
    const cronus = cronusFrame(page).locator('[data-slot="empty"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="empty-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="empty-control"]')).toHaveCount(0);
  });

  test("field is a div, not field-control", async ({ page }) => {
    await page.goto("/audit/field?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="field"]');
    const cronus = cronusFrame(page).locator('[data-slot="field"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="field-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="field-control"]')).toHaveCount(0);
  });

  test("input-group is a div, not a label wrapper or *-control", async ({ page }) => {
    await page.goto("/audit/input-group?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="input-group"]');
    const cronus = cronusFrame(page).locator('[data-slot="input-group"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] [data-slot$="-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot$="-control"]')).toHaveCount(0);
  });

  test("rating is a div slider, not a radiogroup", async ({ page }) => {
    await page.goto("/audit/rating?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="rating"]');
    const cronus = cronusFrame(page).locator('[data-slot="rating"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "slider");
    await expect(cronus).toHaveAttribute("role", "slider");
    await expect(page.locator('[data-audit-side="react"] [role="radiogroup"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[role="radiogroup"]')).toHaveCount(0);
    await expect(page.locator('[data-audit-side="react"] input[type="radio"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('input[type="radio"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="rating-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="rating-control"]')).toHaveCount(0);
  });

  test("copy-button is a button, not copy-button-control", async ({ page }) => {
    await page.goto("/audit/copy-button?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="copy-button"]');
    const cronus = cronusFrame(page).locator('[data-slot="copy-button"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="copy-button-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="copy-button-control"]')).toHaveCount(0);
  });

  test("fab is a div, not fab-control", async ({ page }) => {
    await page.goto("/audit/fab?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="fab"]');
    const cronus = cronusFrame(page).locator('[data-slot="fab"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="fab-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="fab-control"]')).toHaveCount(0);
  });

  test("toggle-group is a div, not toggle-group-control", async ({ page }) => {
    await page.goto("/audit/toggle-group?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="toggle-group"]');
    const cronus = cronusFrame(page).locator('[data-slot="toggle-group"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="toggle-group-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="toggle-group-control"]')).toHaveCount(0);
  });

  test("metric is a div, not metric-control", async ({ page }) => {
    await page.goto("/audit/metric?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="metric"]');
    const cronus = cronusFrame(page).locator('[data-slot="metric"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="metric-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="metric-control"]')).toHaveCount(0);
  });

  test("avatar-group is a div, not avatar-group-control", async ({ page }) => {
    await page.goto("/audit/avatar-group?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="avatar-group"]');
    const cronus = cronusFrame(page).locator('[data-slot="avatar-group"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="avatar-group-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="avatar-group-control"]')).toHaveCount(0);
  });

  test("combobox trigger is a button, not a select", async ({ page }) => {
    await page.goto("/audit/combobox?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="combobox-trigger"]');
    const cronus = cronusFrame(page).locator('[data-slot="combobox-trigger"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-audit-side="react"] select')).toHaveCount(0);
    await expect(cronusFrame(page).locator("select")).toHaveCount(0);
    await expect(page.locator('[data-slot="combobox-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="combobox-control"]')).toHaveCount(0);
  });

  test("stepper is a div, not stepper-control", async ({ page }) => {
    await page.goto("/audit/stepper?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="stepper"]');
    const cronus = cronusFrame(page).locator('[data-slot="stepper"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="stepper-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="stepper-control"]')).toHaveCount(0);
  });

  test("input-otp is a hidden input, not input-otp-control", async ({ page }) => {
    await page.goto("/audit/input-otp?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="input-otp"]');
    const cronus = cronusFrame(page).locator('[data-slot="input-otp"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("INPUT");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("INPUT");
    await expect(page.locator('[data-slot="input-otp-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="input-otp-control"]')).toHaveCount(0);
  });

  test("file-dropzone is a label, not file-dropzone-control", async ({ page }) => {
    await page.goto("/audit/file-dropzone?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="file-dropzone"]');
    const cronus = cronusFrame(page).locator('[data-slot="file-dropzone"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("LABEL");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("LABEL");
    await expect(page.locator('[data-slot="file-dropzone-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="file-dropzone-control"]')).toHaveCount(0);
  });

  test("popover content is a div, not popover-control", async ({ page }) => {
    await page.goto("/audit/popover?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="popover-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="popover-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="popover-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="popover-control"]')).toHaveCount(0);
  });

  test("hover-card content is a div, not hover-card-control", async ({ page }) => {
    await page.goto("/audit/hover-card?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="hover-card-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="hover-card-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="hover-card-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="hover-card-control"]')).toHaveCount(0);
  });

  test("dropdown-menu content is a div, not dropdown-menu-control", async ({ page }) => {
    await page.goto("/audit/dropdown-menu?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="dropdown-menu-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="dropdown-menu-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="dropdown-menu-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="dropdown-menu-control"]')).toHaveCount(0);
  });

  test("collapsible content is a div, not collapsible-control", async ({ page }) => {
    await page.goto("/audit/collapsible?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="collapsible-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="collapsible-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="collapsible-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="collapsible-control"]')).toHaveCount(0);
  });

  test("command is a div, not command-control", async ({ page }) => {
    await page.goto("/audit/command?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="command"]');
    const cronus = cronusFrame(page).locator('[data-slot="command"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="command-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="command-control"]')).toHaveCount(0);
  });

  test("menubar is a div, not menubar-control", async ({ page }) => {
    await page.goto("/audit/menubar?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="menubar"]');
    const cronus = cronusFrame(page).locator('[data-slot="menubar"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="menubar-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="menubar-control"]')).toHaveCount(0);
  });

  test("context-menu content is a div, not context-menu-control", async ({ page }) => {
    await page.goto("/audit/context-menu?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="context-menu-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="context-menu-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="context-menu-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="context-menu-control"]')).toHaveCount(0);
  });

  test("drawer content is a div, not a native dialog", async ({ page }) => {
    await page.goto("/audit/drawer?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="drawer-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="drawer-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] dialog')).toHaveCount(0);
    await expect(cronusFrame(page).locator("dialog")).toHaveCount(0);
    await expect(page.locator('[data-slot="drawer-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="drawer-control"]')).toHaveCount(0);
  });

  test("sheet content is a div, not a native dialog", async ({ page }) => {
    await page.goto("/audit/sheet?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="sheet-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="sheet-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] dialog')).toHaveCount(0);
    await expect(cronusFrame(page).locator("dialog")).toHaveCount(0);
    await expect(page.locator('[data-slot="sheet-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="sheet-control"]')).toHaveCount(0);
  });

  test("calendar is a wrapper div, not calendar-control", async ({ page }) => {
    await page.goto("/audit/calendar?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="calendar"]');
    const cronus = cronusFrame(page).locator('[data-slot="calendar"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="calendar-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="calendar-control"]')).toHaveCount(0);
  });

  test("date-picker trigger is a button, not input[type=date]", async ({ page }) => {
    await page.goto("/audit/date-picker?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="date-picker-trigger"]');
    const cronus = cronusFrame(page).locator('[data-slot="date-picker-trigger"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-audit-side="react"] input[type="date"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('input[type="date"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="date-picker-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="date-picker-control"]')).toHaveCount(0);
  });

  test("time-picker is a button, not time-picker-control", async ({ page }) => {
    await page.goto("/audit/time-picker?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="time-picker"]');
    const cronus = cronusFrame(page).locator('[data-slot="time-picker"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="time-picker-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="time-picker-control"]')).toHaveCount(0);
  });

  test("date-range-picker trigger is a button, not input[type=date]", async ({ page }) => {
    await page.goto("/audit/date-range-picker?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="date-range-picker-trigger"]');
    const cronus = cronusFrame(page).locator('[data-slot="date-range-picker-trigger"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-audit-side="react"] input[type="date"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('input[type="date"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="date-range-picker-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="date-range-picker-control"]')).toHaveCount(
      0,
    );
  });

  test("mode-toggle is a button, not mode-toggle-control", async ({ page }) => {
    await page.goto("/audit/mode-toggle?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="mode-toggle"]');
    const cronus = cronusFrame(page).locator('[data-slot="mode-toggle"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="mode-toggle-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="mode-toggle-control"]')).toHaveCount(0);
  });

  test("area-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/area-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="area-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="area-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="area-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="area-chart-control"]')).toHaveCount(0);
  });

  test("bar-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/bar-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="bar-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="bar-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="bar-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="bar-chart-control"]')).toHaveCount(0);
  });

  test("line-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/line-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="line-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="line-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="line-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="line-chart-control"]')).toHaveCount(0);
  });

  test("sparkline is an svg with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/sparkline?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="sparkline"]');
    const cronus = cronusFrame(page).locator('[data-slot="sparkline"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("svg");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("svg");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="sparkline-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="sparkline-control"]')).toHaveCount(0);
  });

  test("pie-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/pie-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="pie-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="pie-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="pie-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="pie-chart-control"]')).toHaveCount(0);
  });

  test("data-table is a div, not data-table-control", async ({ page }) => {
    await page.goto("/audit/data-table?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="data-table"]');
    const cronus = cronusFrame(page).locator('[data-slot="data-table"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="data-table-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="data-table-control"]')).toHaveCount(0);
  });

  test("sidebar is an aside, not sidebar-control", async ({ page }) => {
    await page.goto("/audit/sidebar?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="sidebar"]');
    const cronus = cronusFrame(page).locator('[data-slot="sidebar"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("ASIDE");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("ASIDE");
    await expect(page.locator('[data-slot="sidebar-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="sidebar-control"]')).toHaveCount(0);
  });

  test("sonner toaster is a div, not sonner-control", async ({ page }) => {
    await page.goto("/audit/sonner?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="toaster"]');
    const cronus = cronusFrame(page).locator('[data-slot="toaster"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="sonner-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="sonner-control"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="toaster-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="toaster-control"]')).toHaveCount(0);
  });

  test("navigation-menu is a nav, not navigation-menu-control", async ({ page }) => {
    await page.goto("/audit/navigation-menu?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="navigation-menu"]');
    const cronus = cronusFrame(page).locator('[data-slot="navigation-menu"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("NAV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("NAV");
    await expect(page.locator('[data-slot="navigation-menu-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="navigation-menu-control"]')).toHaveCount(0);
  });

  test("radar-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/radar-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="radar-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="radar-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="radar-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="radar-chart-control"]')).toHaveCount(0);
  });

  test("scatter-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/scatter-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="scatter-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="scatter-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="scatter-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="scatter-chart-control"]')).toHaveCount(0);
  });

  test("ring-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/ring-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="ring-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="ring-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="ring-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="ring-chart-control"]')).toHaveCount(0);
  });

  test("phone-input is a group, not *-control", async ({ page }) => {
    await page.goto("/audit/phone-input?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="phone-input"]');
    const cronus = cronusFrame(page).locator('[data-slot="phone-input"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "group");
    await expect(cronus).toHaveAttribute("role", "group");
    await expect(page.locator('[data-audit-side="react"] [data-slot$="-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot$="-control"]')).toHaveCount(0);
  });

  test("currency-input is a div, not currency-input-control", async ({ page }) => {
    await page.goto("/audit/currency-input?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="currency-input"]');
    const cronus = cronusFrame(page).locator('[data-slot="currency-input"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="currency-input-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="currency-input-control"]')).toHaveCount(0);
  });

  test("color-picker trigger is a button, not color-picker-control", async ({ page }) => {
    await page.goto("/audit/color-picker?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="color-picker-trigger"]');
    const cronus = cronusFrame(page).locator('[data-slot="color-picker-trigger"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="color-picker-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="color-picker-control"]')).toHaveCount(0);
  });

  test("scroll-area is a div, not scroll-area-control", async ({ page }) => {
    await page.goto("/audit/scroll-area?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="scroll-area"]');
    const cronus = cronusFrame(page).locator('[data-slot="scroll-area"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="scroll-area-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="scroll-area-control"]')).toHaveCount(0);
  });

  test("toolbar is a div, not toolbar-control", async ({ page }) => {
    await page.goto("/audit/toolbar?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="toolbar"]');
    const cronus = cronusFrame(page).locator('[data-slot="toolbar"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "toolbar");
    await expect(cronus).toHaveAttribute("role", "toolbar");
    await expect(page.locator('[data-slot="toolbar-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="toolbar-control"]')).toHaveCount(0);
  });

  test("status-dot is a span, not status-dot-control", async ({ page }) => {
    await page.goto("/audit/status-dot?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="status-dot"]');
    const cronus = cronusFrame(page).locator('[data-slot="status-dot"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(react).toHaveAttribute("role", "status");
    await expect(cronus).toHaveAttribute("role", "status");
    await expect(page.locator('[data-slot="status-dot-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="status-dot-control"]')).toHaveCount(0);
  });

  test("button-group is a div group, not button-group-control", async ({ page }) => {
    await page.goto("/audit/button-group?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="button-group"]');
    const cronus = cronusFrame(page).locator('[data-slot="button-group"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "group");
    await expect(cronus).toHaveAttribute("role", "group");
    await expect(page.locator('[data-slot="button-group-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="button-group-control"]')).toHaveCount(0);
  });

  test("tags-input is a div, not a native select", async ({ page }) => {
    await page.goto("/audit/tags-input?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="tags-input"]');
    const cronus = cronusFrame(page).locator('[data-slot="tags-input"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] select')).toHaveCount(0);
    await expect(cronusFrame(page).locator("select")).toHaveCount(0);
    await expect(page.locator('[data-slot="tags-input-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="tags-input-control"]')).toHaveCount(0);
  });

  test("autocomplete is a div, not a native select", async ({ page }) => {
    await page.goto("/audit/autocomplete?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="autocomplete"]');
    const cronus = cronusFrame(page).locator('[data-slot="autocomplete"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] select')).toHaveCount(0);
    await expect(cronusFrame(page).locator("select")).toHaveCount(0);
    await expect(page.locator('[data-slot="autocomplete-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="autocomplete-control"]')).toHaveCount(0);
  });

  test("multi-select trigger is a div, not a native select", async ({ page }) => {
    await page.goto("/audit/multi-select?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="multi-select-trigger"]');
    const cronus = cronusFrame(page).locator('[data-slot="multi-select-trigger"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] select')).toHaveCount(0);
    await expect(cronusFrame(page).locator("select")).toHaveCount(0);
    await expect(page.locator('[data-slot="multi-select-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="multi-select-control"]')).toHaveCount(0);
  });

  test("credit-card-input is a div, not credit-card-input-control", async ({ page }) => {
    await page.goto("/audit/credit-card-input?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="credit-card-input"]');
    const cronus = cronusFrame(page).locator('[data-slot="credit-card-input"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="credit-card-input-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="credit-card-input-control"]')).toHaveCount(
      0,
    );
  });

  test("floating-label-input is a div, not floating-label-input-control", async ({ page }) => {
    await page.goto("/audit/floating-label-input?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="floating-label-input"]');
    const cronus = cronusFrame(page).locator('[data-slot="floating-label-input"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="floating-label-input-control"]')).toHaveCount(0);
    await expect(
      cronusFrame(page).locator('[data-slot="floating-label-input-control"]'),
    ).toHaveCount(0);
  });

  test("split-button is a div group, not split-button-control", async ({ page }) => {
    await page.goto("/audit/split-button?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="split-button"]');
    const cronus = cronusFrame(page).locator('[data-slot="split-button"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "group");
    await expect(cronus).toHaveAttribute("role", "group");
    await expect(page.locator('[data-slot="split-button-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="split-button-control"]')).toHaveCount(0);
  });

  test("pill-nav is a nav, not pill-nav-control", async ({ page }) => {
    await page.goto("/audit/pill-nav?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="pill-nav"]');
    const cronus = cronusFrame(page).locator('[data-slot="pill-nav"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("NAV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("NAV");
    await expect(page.locator('[data-slot="pill-nav-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="pill-nav-control"]')).toHaveCount(0);
  });

  test("dock is a div, not dock-control", async ({ page }) => {
    await page.goto("/audit/dock?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="dock"]');
    const cronus = cronusFrame(page).locator('[data-slot="dock"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="dock-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="dock-control"]')).toHaveCount(0);
  });

  test("app-shell-content is a div, not app-shell-control", async ({ page }) => {
    await page.goto("/audit/app-shell?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="app-shell-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="app-shell-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="app-shell-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="app-shell-control"]')).toHaveCount(0);
  });

  test("table-of-contents is a nav, not table-of-contents-control", async ({ page }) => {
    await page.goto("/audit/table-of-contents?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="table-of-contents"]');
    const cronus = cronusFrame(page).locator('[data-slot="table-of-contents"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("NAV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("NAV");
    await expect(page.locator('[data-slot="table-of-contents-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="table-of-contents-control"]')).toHaveCount(
      0,
    );
  });

  test("form-item is a div inside a form, not form-item-control", async ({ page }) => {
    await page.goto("/audit/form?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="form-item"]');
    const cronus = cronusFrame(page).locator('[data-slot="form-item"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] form')).toHaveCount(1);
    await expect(page.locator('[data-slot="form-item-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="form-item-control"]')).toHaveCount(0);
  });

  test("signature-pad is a div, not signature-pad-control", async ({ page }) => {
    await page.goto("/audit/signature-pad?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="signature-pad"]');
    const cronus = cronusFrame(page).locator('[data-slot="signature-pad"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="signature-pad-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="signature-pad-control"]')).toHaveCount(0);
  });

  test("resizable-panel-group is a div, not resizable-control", async ({ page }) => {
    await page.goto("/audit/resizable?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="resizable-panel-group"]');
    const cronus = cronusFrame(page).locator('[data-slot="resizable-panel-group"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="resizable-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="resizable-control"]')).toHaveCount(0);
  });

  test("scheduler is a div, not scheduler-control", async ({ page }) => {
    await page.goto("/audit/scheduler?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="scheduler"]');
    const cronus = cronusFrame(page).locator('[data-slot="scheduler"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="scheduler-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="scheduler-control"]')).toHaveCount(0);
  });

  test("alert-dialog content is a div, not a native dialog", async ({ page }) => {
    await page.goto("/audit/alert-dialog?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="alert-dialog-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="alert-dialog-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] dialog')).toHaveCount(0);
    await expect(cronusFrame(page).locator("dialog")).toHaveCount(0);
    await expect(page.locator('[data-slot="alert-dialog-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="alert-dialog-control"]')).toHaveCount(0);
  });

  test("lightbox is a div, not a native dialog", async ({ page }) => {
    await page.goto("/audit/lightbox?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="lightbox"]');
    const cronus = cronusFrame(page).locator('[data-slot="lightbox"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] dialog')).toHaveCount(0);
    await expect(cronusFrame(page).locator("dialog")).toHaveCount(0);
    await expect(page.locator('[data-slot="lightbox-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="lightbox-control"]')).toHaveCount(0);
  });

  test("notification-center is a div, not notification-center-control", async ({ page }) => {
    await page.goto("/audit/notification-center?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="notification-center"]');
    const cronus = cronusFrame(page).locator('[data-slot="notification-center"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="notification-center-control"]')).toHaveCount(0);
    await expect(
      cronusFrame(page).locator('[data-slot="notification-center-control"]'),
    ).toHaveCount(0);
  });

  test("segmented-control is a div radiogroup, not radio inputs", async ({ page }) => {
    await page.goto("/audit/segmented-control?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="segmented-control"]');
    const cronus = cronusFrame(page).locator('[data-slot="segmented-control"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toHaveAttribute("role", "radiogroup");
    await expect(cronus).toHaveAttribute("role", "radiogroup");
    await expect(page.locator('[data-audit-side="react"] input[type="radio"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('input[type="radio"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="segmented-control-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="segmented-control-control"]')).toHaveCount(
      0,
    );
  });

  test("usage-meter is a div, not usage-meter-control", async ({ page }) => {
    await page.goto("/audit/usage-meter?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="usage-meter"]');
    const cronus = cronusFrame(page).locator('[data-slot="usage-meter"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="usage-meter-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="usage-meter-control"]')).toHaveCount(0);
  });

  test("masonry is a div, not masonry-control", async ({ page }) => {
    await page.goto("/audit/masonry?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="masonry"]');
    const cronus = cronusFrame(page).locator('[data-slot="masonry"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="masonry-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="masonry-control"]')).toHaveCount(0);
  });

  test("heatmap is a div, not heatmap-control", async ({ page }) => {
    await page.goto("/audit/heatmap?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="heatmap"]');
    const cronus = cronusFrame(page).locator('[data-slot="heatmap"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="heatmap-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="heatmap-control"]')).toHaveCount(0);
  });

  test("comparison-slider is a div, not comparison-slider-control", async ({ page }) => {
    await page.goto("/audit/comparison-slider?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="comparison-slider"]');
    const cronus = cronusFrame(page).locator('[data-slot="comparison-slider"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="comparison-slider-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="comparison-slider-control"]')).toHaveCount(
      0,
    );
  });

  test("code-tabs is a div, not code-tabs-control", async ({ page }) => {
    await page.goto("/audit/code-tabs?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="code-tabs"]');
    const cronus = cronusFrame(page).locator('[data-slot="code-tabs"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="code-tabs-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="code-tabs-control"]')).toHaveCount(0);
  });

  test("expandable-tabs is a div, not expandable-tabs-control", async ({ page }) => {
    await page.goto("/audit/expandable-tabs?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="expandable-tabs"]');
    const cronus = cronusFrame(page).locator('[data-slot="expandable-tabs"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="expandable-tabs-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="expandable-tabs-control"]')).toHaveCount(0);
  });

  test("live-line-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/live-line-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="live-line-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="live-line-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="live-line-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="live-line-chart-control"]')).toHaveCount(0);
  });

  test("sunburst-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/sunburst-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="sunburst-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="sunburst-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="sunburst-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="sunburst-chart-control"]')).toHaveCount(0);
  });

  test("choropleth-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/choropleth-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="choropleth-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="choropleth-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="choropleth-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="choropleth-chart-control"]')).toHaveCount(
      0,
    );
  });

  test("profit-loss-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/profit-loss-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="profit-loss-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="profit-loss-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="profit-loss-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="profit-loss-chart-control"]')).toHaveCount(
      0,
    );
  });

  test("scroll-progress is a div, not scroll-progress-control", async ({ page }) => {
    await page.goto("/audit/scroll-progress?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="scroll-progress"]');
    const cronus = cronusFrame(page).locator('[data-slot="scroll-progress"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="scroll-progress-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="scroll-progress-control"]')).toHaveCount(0);
  });

  test("rich-text-editor is a div, not textarea-control", async ({ page }) => {
    await page.goto("/audit/rich-text-editor?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="rich-text-editor"]');
    const cronus = cronusFrame(page).locator('[data-slot="rich-text-editor"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] textarea')).toHaveCount(0);
    await expect(cronusFrame(page).locator("textarea")).toHaveCount(0);
    await expect(page.locator('[data-slot="textarea-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="textarea-control"]')).toHaveCount(0);
    await expect(page.locator('[data-slot="rich-text-editor-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="rich-text-editor-control"]')).toHaveCount(
      0,
    );
  });

  test("confirmation-dialog is a div, not a native dialog", async ({ page }) => {
    await page.goto("/audit/confirmation-dialog?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="confirmation-dialog"]');
    const cronus = cronusFrame(page).locator('[data-slot="confirmation-dialog"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] dialog')).toHaveCount(0);
    await expect(cronusFrame(page).locator("dialog")).toHaveCount(0);
    await expect(page.locator('[data-slot="confirmation-dialog-control"]')).toHaveCount(0);
    await expect(
      cronusFrame(page).locator('[data-slot="confirmation-dialog-control"]'),
    ).toHaveCount(0);
  });

  test("invite-dialog is a div, not a native dialog", async ({ page }) => {
    await page.goto("/audit/invite-dialog?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-slot="invite-dialog"]');
    const cronus = cronusFrame(page).locator('[data-slot="invite-dialog"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] dialog')).toHaveCount(0);
    await expect(cronusFrame(page).locator("dialog")).toHaveCount(0);
    await expect(page.locator('[data-slot="invite-dialog-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="invite-dialog-control"]')).toHaveCount(0);
  });

  test("shimmer is a div, not shimmer-control", async ({ page }) => {
    await page.goto("/audit/shimmer?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="shimmer"]');
    const cronus = cronusFrame(page).locator('[data-slot="shimmer"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="shimmer-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="shimmer-control"]')).toHaveCount(0);
  });

  test("reveal is a div, not reveal-control", async ({ page }) => {
    await page.goto("/audit/reveal?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="reveal"]');
    const cronus = cronusFrame(page).locator('[data-slot="reveal"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="reveal-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="reveal-control"]')).toHaveCount(0);
  });

  test("text-shimmer is a p, not text-shimmer-control", async ({ page }) => {
    await page.goto("/audit/text-shimmer?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="text-shimmer"]');
    const cronus = cronusFrame(page).locator('[data-slot="text-shimmer"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("P");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("P");
    await expect(page.locator('[data-slot="text-shimmer-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="text-shimmer-control"]')).toHaveCount(0);
  });

  test("particles is a div with children, not a SURF-only fx layer", async ({ page }) => {
    await page.goto("/audit/particles?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="particles"]');
    const cronus = cronusFrame(page).locator('[data-slot="particles"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toContainText("Field");
    await expect(cronus).toContainText("Field");
    await expect(page.locator('[data-slot="particles-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="particles-control"]')).toHaveCount(0);
  });

  test("sparkles-text is a span, not sparkles-text-control", async ({ page }) => {
    await page.goto("/audit/sparkles-text?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="sparkles-text"]');
    const cronus = cronusFrame(page).locator('[data-slot="sparkles-text"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-slot="sparkles-text-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="sparkles-text-control"]')).toHaveCount(0);
  });

  test("noise is a div, not noise-control", async ({ page }) => {
    await page.goto("/audit/noise?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="noise"]');
    const cronus = cronusFrame(page).locator('[data-slot="noise"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="noise-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="noise-control"]')).toHaveCount(0);
  });

  test("morphing-popover content is a div, not a details element", async ({ page }) => {
    await page.goto("/audit/morphing-popover?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="morphing-popover-content"]');
    const cronus = cronusFrame(page).locator('[data-slot="morphing-popover-content"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] details')).toHaveCount(0);
    await expect(cronusFrame(page).locator("details")).toHaveCount(0);
    await expect(page.locator('[data-slot="morphing-popover-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="morphing-popover-control"]')).toHaveCount(
      0,
    );
  });

  test("bouncy-accordion is a div, not bouncy-accordion-control", async ({ page }) => {
    await page.goto("/audit/bouncy-accordion?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="bouncy-accordion"]');
    const cronus = cronusFrame(page).locator('[data-slot="bouncy-accordion"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="bouncy-accordion-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="bouncy-accordion-control"]')).toHaveCount(
      0,
    );
  });

  test("typing-text is a span, not typing-text-control", async ({ page }) => {
    await page.goto("/audit/typing-text?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="typing-text"]');
    const cronus = cronusFrame(page).locator('[data-slot="typing-text"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-slot="typing-text-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="typing-text-control"]')).toHaveCount(0);
  });

  test("word-rotate is a span, not word-rotate-control", async ({ page }) => {
    await page.goto("/audit/word-rotate?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="word-rotate"]');
    const cronus = cronusFrame(page).locator('[data-slot="word-rotate"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-slot="word-rotate-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="word-rotate-control"]')).toHaveCount(0);
  });

  test("timeline is an ol, not timeline-control", async ({ page }) => {
    await page.goto("/audit/timeline?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="timeline"]');
    const cronus = cronusFrame(page).locator('[data-slot="timeline"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("OL");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("OL");
    await expect(page.locator('[data-slot="timeline-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="timeline-control"]')).toHaveCount(0);
  });

  test("tree-view is a div, not tree-view-control", async ({ page }) => {
    await page.goto("/audit/tree-view?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="tree-view"]');
    const cronus = cronusFrame(page).locator('[data-slot="tree-view"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="tree-view-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="tree-view-control"]')).toHaveCount(0);
  });

  test("tilt-card is a div, not tilt-card-control", async ({ page }) => {
    await page.goto("/audit/tilt-card?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="tilt-card"]');
    const cronus = cronusFrame(page).locator('[data-slot="tilt-card"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="tilt-card-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="tilt-card-control"]')).toHaveCount(0);
  });

  test("star-border is a div, not star-border-control", async ({ page }) => {
    await page.goto("/audit/star-border?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="star-border"]');
    const cronus = cronusFrame(page).locator('[data-slot="star-border"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="star-border-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="star-border-control"]')).toHaveCount(0);
  });

  test("glass-card is a div, not glass-card-control", async ({ page }) => {
    await page.goto("/audit/glass-card?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="glass-card"]');
    const cronus = cronusFrame(page).locator('[data-slot="glass-card"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="glass-card-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="glass-card-control"]')).toHaveCount(0);
  });

  test("terminal exposes terminal or terminal-screen, not terminal-control", async ({ page }) => {
    await page.goto("/audit/terminal?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="terminal"]');
    const reactScreen = page.locator('[data-audit-side="react"] [data-slot="terminal-screen"]');
    const cronus = cronusFrame(page).locator('[data-slot="terminal"]');
    const cronusScreen = cronusFrame(page).locator('[data-slot="terminal-screen"]');
    await expect(react).toHaveCount(1);
    await expect(reactScreen).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect((await cronus.count()) + (await cronusScreen.count())).toBeGreaterThan(0);
    await expect(page.locator('[data-slot="terminal-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="terminal-control"]')).toHaveCount(0);
  });

  test("video-player is a div, not video-player-control", async ({ page }) => {
    await page.goto("/audit/video-player?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="video-player"]');
    const cronus = cronusFrame(page).locator('[data-slot="video-player"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="video-player-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="video-player-control"]')).toHaveCount(0);
  });

  test("text-effect is a p, not text-effect-control", async ({ page }) => {
    await page.goto("/audit/text-effect?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="text-effect"]');
    const cronus = cronusFrame(page).locator('[data-slot="text-effect"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("P");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("P");
    await expect(page.locator('[data-slot="text-effect-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="text-effect-control"]')).toHaveCount(0);
  });

  test("spotlight-card is a div, not spotlight-card-control", async ({ page }) => {
    await page.goto("/audit/spotlight-card?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="spotlight-card"]');
    const cronus = cronusFrame(page).locator('[data-slot="spotlight-card"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="spotlight-card-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="spotlight-card-control"]')).toHaveCount(0);
  });

  test("animated-list is a ul, not animated-list-control", async ({ page }) => {
    await page.goto("/audit/animated-list?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="animated-list"]');
    const cronus = cronusFrame(page).locator('[data-slot="animated-list"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("UL");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("UL");
    await expect(page.locator('[data-slot="animated-list-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="animated-list-control"]')).toHaveCount(0);
  });

  test("carousel is a div, not carousel-control", async ({ page }) => {
    await page.goto("/audit/carousel?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="carousel"]');
    const cronus = cronusFrame(page).locator('[data-slot="carousel"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="carousel-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="carousel-control"]')).toHaveCount(0);
  });

  test("code-block is a div, not code-block-control", async ({ page }) => {
    await page.goto("/audit/code-block?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="code-block"]');
    const cronus = cronusFrame(page).locator('[data-slot="code-block"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="code-block-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="code-block-control"]')).toHaveCount(0);
  });

  test("description-list is a dl, not description-list-control", async ({ page }) => {
    await page.goto("/audit/description-list?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="description-list"]');
    const cronus = cronusFrame(page).locator('[data-slot="description-list"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DL");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DL");
    await expect(page.locator('[data-slot="description-list-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="description-list-control"]')).toHaveCount(
      0,
    );
  });

  test("kanban exposes kanban or kanban-column, not kanban-control", async ({ page }) => {
    await page.goto("/audit/kanban?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="kanban"]');
    const reactColumn = page.locator('[data-audit-side="react"] [data-slot="kanban-column"]');
    const cronus = cronusFrame(page).locator('[data-slot="kanban"]');
    const cronusColumn = cronusFrame(page).locator('[data-slot="kanban-column"]');
    await expect(react).toHaveCount(1);
    expect(await reactColumn.count()).toBeGreaterThan(0);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect((await cronus.count()) + (await cronusColumn.count())).toBeGreaterThan(0);
    await expect(page.locator('[data-slot="kanban-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="kanban-control"]')).toHaveCount(0);
  });

  test("json-viewer is a div, not json-viewer-control", async ({ page }) => {
    await page.goto("/audit/json-viewer?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="json-viewer"]');
    const cronus = cronusFrame(page).locator('[data-slot="json-viewer"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="json-viewer-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="json-viewer-control"]')).toHaveCount(0);
  });

  test("animated-number is a span, not animated-number-control", async ({ page }) => {
    await page.goto("/audit/animated-number?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="animated-number"]');
    const cronus = cronusFrame(page).locator('[data-slot="animated-number"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-slot="animated-number-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="animated-number-control"]')).toHaveCount(0);
  });

  test("marquee is a div, not marquee-control", async ({ page }) => {
    await page.goto("/audit/marquee?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="marquee"]');
    const cronus = cronusFrame(page).locator('[data-slot="marquee"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="marquee-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="marquee-control"]')).toHaveCount(0);
  });

  test("gradient-text is a span, not gradient-text-control", async ({ page }) => {
    await page.goto("/audit/gradient-text?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="gradient-text"]');
    const cronus = cronusFrame(page).locator('[data-slot="gradient-text"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-slot="gradient-text-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="gradient-text-control"]')).toHaveCount(0);
  });

  test("shiny-text is a span, not shiny-text-control", async ({ page }) => {
    await page.goto("/audit/shiny-text?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="shiny-text"]');
    const cronus = cronusFrame(page).locator('[data-slot="shiny-text"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SPAN");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SPAN");
    await expect(page.locator('[data-slot="shiny-text-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="shiny-text-control"]')).toHaveCount(0);
  });

  test("aspect-ratio is a div, not aspect-ratio-control", async ({ page }) => {
    await page.goto("/audit/aspect-ratio?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="aspect-ratio"]');
    const cronus = cronusFrame(page).locator('[data-slot="aspect-ratio"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="aspect-ratio-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="aspect-ratio-control"]')).toHaveCount(0);
  });

  test("frame is a div, not frame-control", async ({ page }) => {
    await page.goto("/audit/frame?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="frame"]');
    const cronus = cronusFrame(page).locator('[data-slot="frame"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="frame-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="frame-control"]')).toHaveCount(0);
  });

  test("flip-card is a div, not flip-card-control", async ({ page }) => {
    await page.goto("/audit/flip-card?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="flip-card"]');
    const cronus = cronusFrame(page).locator('[data-slot="flip-card"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="flip-card-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="flip-card-control"]')).toHaveCount(0);
  });

  test("countdown is a div, not countdown-control", async ({ page }) => {
    await page.goto("/audit/countdown?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="countdown"]');
    const cronus = cronusFrame(page).locator('[data-slot="countdown"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="countdown-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="countdown-control"]')).toHaveCount(0);
  });

  test("animated-button is a button, not animated-button-control", async ({ page }) => {
    await page.goto("/audit/animated-button?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="animated-button"]');
    const cronus = cronusFrame(page).locator('[data-slot="animated-button"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="animated-button-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="animated-button-control"]')).toHaveCount(0);
  });

  test("card-stack is a section, not card-stack-control", async ({ page }) => {
    await page.goto("/audit/card-stack?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="card-stack"]');
    const cronus = cronusFrame(page).locator('[data-slot="card-stack"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("SECTION");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("SECTION");
    await expect(page.locator('[data-slot="card-stack-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="card-stack-control"]')).toHaveCount(0);
  });

  test("gauge-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/gauge-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="gauge-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="gauge-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="gauge-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="gauge-chart-control"]')).toHaveCount(0);
  });

  test("funnel-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/funnel-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="funnel-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="funnel-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="funnel-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="funnel-chart-control"]')).toHaveCount(0);
  });

  test("candlestick-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/candlestick-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="candlestick-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="candlestick-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="candlestick-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="candlestick-chart-control"]')).toHaveCount(
      0,
    );
  });

  test("logo-carousel is a ul, not logo-carousel-control", async ({ page }) => {
    await page.goto("/audit/logo-carousel?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="logo-carousel"]');
    const cronus = cronusFrame(page).locator('[data-slot="logo-carousel"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("UL");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("UL");
    await expect(page.locator('[data-slot="logo-carousel-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="logo-carousel-control"]')).toHaveCount(0);
  });

  test("dynamic-island is a div, not dynamic-island-control", async ({ page }) => {
    await page.goto("/audit/dynamic-island?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="dynamic-island"]');
    const cronus = cronusFrame(page).locator('[data-slot="dynamic-island"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="dynamic-island-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="dynamic-island-control"]')).toHaveCount(0);
  });

  test("image-zoom is a button, not image-zoom-control", async ({ page }) => {
    await page.goto("/audit/image-zoom?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="image-zoom"]');
    const cronus = cronusFrame(page).locator('[data-slot="image-zoom"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="image-zoom-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="image-zoom-control"]')).toHaveCount(0);
  });

  test("aurora-background is a div, not aurora-background-control", async ({ page }) => {
    await page.goto("/audit/aurora-background?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="aurora-background"]');
    const cronus = cronusFrame(page).locator('[data-slot="aurora-background"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="aurora-background-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="aurora-background-control"]')).toHaveCount(
      0,
    );
  });

  test("border-beam is a div, not border-beam-control", async ({ page }) => {
    await page.goto("/audit/border-beam?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="border-beam"]');
    const cronus = cronusFrame(page).locator('[data-slot="border-beam"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="border-beam-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="border-beam-control"]')).toHaveCount(0);
  });

  test("confetti is a div, not confetti-control", async ({ page }) => {
    await page.goto("/audit/confetti?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="confetti"]');
    const cronus = cronusFrame(page).locator('[data-slot="confetti"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-slot="confetti-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="confetti-control"]')).toHaveCount(0);
  });

  test("composed-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/composed-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="composed-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="composed-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="composed-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="composed-chart-control"]')).toHaveCount(0);
  });

  test("heatmap-chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/heatmap-chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="heatmap-chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="heatmap-chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="heatmap-chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="heatmap-chart-control"]')).toHaveCount(0);
  });

  test("chart is a div with data-slot, not a figure", async ({ page }) => {
    await page.goto("/audit/chart?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="chart"]');
    const cronus = cronusFrame(page).locator('[data-slot="chart"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(page.locator('[data-audit-side="react"] figure')).toHaveCount(0);
    await expect(cronusFrame(page).locator("figure")).toHaveCount(0);
    await expect(page.locator('[data-slot="chart-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="chart-control"]')).toHaveCount(0);
  });

  test("toast is a visible div with data-slot toast, not toaster-only empty", async ({ page }) => {
    await page.goto("/audit/toast?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="toast"]');
    const cronus = cronusFrame(page).locator('[data-slot="toast"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("DIV");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("DIV");
    await expect(react).toBeVisible();
    await expect(cronus).toBeVisible();
    await expect(page.locator('[data-slot="toast-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="toast-control"]')).toHaveCount(0);
  });

  test("workspace-switcher is a button, not workspace-switcher-control", async ({ page }) => {
    await page.goto("/audit/workspace-switcher?fixture=default&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="workspace-switcher"]');
    const cronus = cronusFrame(page).locator('[data-slot="workspace-switcher"]');
    await expect(react).toHaveCount(1);
    await expect(cronus).toHaveCount(1);
    expect(await react.evaluate((el) => el.tagName)).toBe("BUTTON");
    expect(await cronus.evaluate((el) => el.tagName)).toBe("BUTTON");
    await expect(page.locator('[data-slot="workspace-switcher-control"]')).toHaveCount(0);
    await expect(cronusFrame(page).locator('[data-slot="workspace-switcher-control"]')).toHaveCount(
      0,
    );
  });

  test("root data-slot boxes match within 2px", async ({ page }) => {
    await page.goto("/audit/button?fixture=primary-md&preset=aurora&mode=dark");
    const reactBox = await page
      .locator('[data-audit-side="react"] [data-slot="button"]')
      .boundingBox();
    const cronusBox = await cronusFrame(page).locator('[data-slot="button"]').boundingBox();
    expect(reactBox).toBeTruthy();
    expect(cronusBox).toBeTruthy();
    if (!reactBox || !cronusBox) return;
    expect(
      compareLayoutBox(
        { x: 0, y: 0, width: reactBox.width, height: reactBox.height },
        { x: 0, y: 0, width: cronusBox.width, height: cronusBox.height },
      ).ok,
    ).toBe(true);
  });

  test("computed colors serialize to the same hex", async ({ page }) => {
    await page.goto("/audit/button?fixture=primary-md&preset=aurora&mode=dark");
    const read = async (locator: ReturnType<typeof page.locator>) =>
      locator.evaluate((el) => {
        const toRgb = (color: string) => {
          const canvas = el.ownerDocument.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext("2d");
          if (!ctx) return color;
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
        };
        const s = getComputedStyle(el);
        return { bg: toRgb(s.backgroundColor), color: toRgb(s.color) };
      });
    const react = await read(page.locator('[data-audit-side="react"] [data-slot="button"]'));
    const cronus = await read(cronusFrame(page).locator('[data-slot="button"]'));
    expect(cssColorToHex(react.bg)).toBe(cssColorToHex(cronus.bg));
    expect(cssColorToHex(react.color)).toBe(cssColorToHex(cronus.color));
  });

  test("focus-visible ring exists on both (logic only)", async ({ page }) => {
    await page.goto("/audit/button?fixture=primary-md&preset=aurora&mode=dark");
    const react = page.locator('[data-audit-side="react"] [data-slot="button"]');
    await react.focus();
    const reactRing = await react.evaluate((el) => {
      const s = getComputedStyle(el);
      return `${s.outline} ${s.boxShadow}`;
    });
    const cronus = cronusFrame(page).locator('[data-slot="button"]');
    await cronus.focus();
    const cronusRing = await cronus.evaluate((el) => {
      const s = getComputedStyle(el);
      return `${s.outline} ${s.boxShadow}`;
    });
    expect(reactRing).not.toMatch(/none none|none rgb\(0, 0, 0\) 0px 0px 0px 0px/);
    expect(cronusRing.includes("none") && !cronusRing.match(/\d+px/)).toBeFalsy();
  });
});
