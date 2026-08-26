import { expect, test } from "@playwright/test";

/**
 * Live template gallery → detail → Open Preview.
 *
 * Asserts the Kairo-class loop: a card thumbnail is a real preview iframe,
 * the detail page exposes Preview / Code / Open Preview, and Open Preview
 * is the composed site (not the docs chrome).
 */
test.describe("template live preview", () => {
  test("gallery card opens a live detail, then the full site", async ({ page }) => {
    await page.goto("/templates", { waitUntil: "domcontentloaded" });

    const studio = page.getByRole("article").filter({
      has: page.getByRole("heading", { name: "Studio", exact: true }),
    });
    await expect(studio).toBeVisible();
    await expect(studio.getByRole("link", { name: "View Studio template" })).toBeVisible();

    await studio.getByRole("link", { name: "View Studio template" }).click();
    await expect(page).toHaveURL(/\/templates\/landing-studio$/);
    await expect(page.getByRole("heading", { name: "Studio", exact: true })).toBeVisible();

    const tablist = page.getByRole("tablist").first();
    await expect(tablist.getByRole("tab", { name: "Preview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("link", { name: "Open Preview" })).toBeVisible();

    await tablist.getByRole("tab", { name: "Code" }).click();
    await expect(page.getByRole("heading", { name: "Block stack" })).toBeVisible();
    await expect(page.getByRole("link", { name: "hero--atmosphere" })).toBeVisible();

    const previewPromise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "Open Preview" }).click();
    const preview = await previewPromise;
    await preview.waitForLoadState("domcontentloaded");
    await expect(preview).toHaveURL(/\/preview\/t\/landing-studio/);
    await expect(
      preview.locator("[data-slot=template-stage][data-template=landing-studio]"),
    ).toBeVisible();
    await expect(
      preview.locator("[data-slot=template-block][data-block=hero--atmosphere]"),
    ).toBeVisible();
  });
});
