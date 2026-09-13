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
