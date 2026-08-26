import { expect, test } from "@playwright/test";

/**
 * OSS sponsor is optional. Presets and a custom amount both produce a GitHub
 * Sponsors one-time checkout; nothing on the catalog is gated.
 */
test.describe("Sponsor coffee", () => {
  test("homepage band leads to a custom-amount checkout", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("link", { name: "Choose an amount" }).click();
    await expect(page).toHaveURL(/\/sponsor$/);
    await expect(page.getByRole("heading", { name: "The engine is free." })).toBeVisible();

    const coffee = page.getByRole("button", { name: /Coffee/ });
    await expect(coffee).toHaveAttribute("aria-pressed", "true");

    const continueLink = page.getByRole("link", { name: /Continue with/ });
    await expect(continueLink).toHaveAttribute("href", /github\.com\/sponsors\/pedrogbraz/);
    await expect(continueLink).toHaveAttribute("href", /frequency=one-time/);
    await expect(continueLink).toHaveAttribute("href", /amount=5/);

    await page.getByRole("button", { name: /Lunch/ }).click();
    await expect(page.getByRole("link", { name: /Continue with/ })).toHaveAttribute(
      "href",
      /amount=15/,
    );

    await page.getByLabel("Or your own amount").fill("12");
    await expect(page.getByRole("link", { name: "Continue with $12" })).toHaveAttribute(
      "href",
      /amount=12/,
    );
  });
});
