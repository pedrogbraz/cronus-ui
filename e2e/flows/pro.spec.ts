import { expect, test } from "@playwright/test";

const PRO_ORIGIN = process.env.PLAYWRIGHT_PRO_URL ?? "http://localhost:4748";

/**
 * Cronus Pro is a separate origin. OSS CTAs leave the docs chrome; the Pro
 * site is additive (looks/SaaS stay free) and lists Maker / Studio.
 */
test.describe("Pro origin split", () => {
  test("OSS See Pro points off-site", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const seePro = page.locator("footer").getByRole("link", { name: "Pro" });
    await expect(seePro).toBeVisible();
    await expect(seePro).toHaveAttribute("href", /localhost:4748|cronusui\.pro/);
  });

  test("Pro landing is additive, priced, and previewable", async ({ page }) => {
    await page.goto(PRO_ORIGIN, { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveAttribute("data-cronus-theme", "neutral");
    await expect(page.getByRole("heading", { name: "The rest of the product." })).toBeVisible();

    const table = page.getByRole("table");
    await expect(table).toBeVisible();

    const looks = page.getByRole("row", { name: /Looks — Default, Brutalist, Glass/ });
    await expect(looks.getByLabel("Included")).toHaveCount(2);

    const saas = page.getByRole("row", { name: /SaaS, store, landing/ });
    await expect(saas.getByLabel("Included")).toHaveCount(2);

    const pack = page.getByRole("row", { name: /Mail, chat, and finance apps/ });
    await expect(pack.getByLabel("Included")).toHaveCount(1);

    await expect(page.getByRole("heading", { name: "One-time. Perpetual." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Maker" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Studio" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Get Maker" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Get Studio" })).toBeVisible();

    await expect(page.getByRole("link", { name: "Looks stay free" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore Mail" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Mail on the open-source site" }),
    ).toBeVisible();
  });
});
