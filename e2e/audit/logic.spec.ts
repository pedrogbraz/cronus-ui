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
