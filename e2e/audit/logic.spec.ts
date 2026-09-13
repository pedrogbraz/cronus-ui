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
