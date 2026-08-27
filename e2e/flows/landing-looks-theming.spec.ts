import { expect, test } from "@playwright/test";

/**
 * OSS homepage chrome is Neutral-locked. Looks and live theming restyle
 * nested specimens without leaking onto <html> or the outer stage panes.
 *
 * The retired header theme picker must stay gone — look chips live in
 * `#looks` (Default / Brutalist / Glass, never Mauve) and preset chips
 * live in `#theming`, recoloring only the nested CronusUIProvider.
 */
test.describe("landing looks and theming", () => {
  test("homepage chrome is Neutral locked, with no nav theme picker", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });

    await expect(page.locator("html")).toHaveAttribute("data-cronus-theme", "neutral");

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("combobox")).toHaveCount(0);
    await expect(nav.locator("select")).toHaveCount(0);
    await expect(nav.getByRole("button", { name: "Aurora" })).toHaveCount(0);
  });

  test("looks stage switches Default / Brutalist / Glass and has no Mauve", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });

    const looks = page.locator("#looks");
    const stage = looks.locator('[data-slot="look-stage"]');

    await looks.getByRole("button", { name: "Glass", exact: true }).click();
    await expect(stage).toHaveAttribute("data-cronus-look", "glass");

    await looks.getByRole("button", { name: "Brutalist", exact: true }).click();
    await expect(stage).toHaveAttribute("data-cronus-look", "brutalist");

    await looks.getByRole("button", { name: "Default", exact: true }).click();
    await expect(stage).toHaveAttribute("data-cronus-look", "default");

    await expect(looks.getByRole("button", { name: "Mauve" })).toHaveCount(0);
  });

  test("live theming recolors the nested specimen, not chrome or the stage pane", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "load" });

    const theming = page.locator("#theming");
    const stage = theming.locator('[data-slot="theme-stage"]');

    await theming.getByRole("button", { name: "Sunset" }).click();

    await expect(theming.locator('[data-slot="card"] [data-cronus-theme]')).toHaveAttribute(
      "data-cronus-theme",
      "sunset",
    );

    await expect(stage).not.toHaveAttribute("data-cronus-theme", "sunset");
    await expect(stage).toHaveAttribute("data-cronus-look", "glass");
    const chromeMode = await page.locator("html").getAttribute("data-cronus-mode");
    await expect(stage).toHaveAttribute("data-cronus-mode", chromeMode ?? "");

    await expect(page.locator("html")).toHaveAttribute("data-cronus-theme", "neutral");
  });
});
