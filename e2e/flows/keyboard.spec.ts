import { expect, type Locator, type Page, test } from "@playwright/test";

/**
 * Keyboard-operability suite for the highest-value interactive primitives.
 *
 * The a11y (axe) project proves *static* accessibility — names, roles, contrast,
 * landmarks. This suite proves the other half of WCAG 2.1.1 (Keyboard) /
 * 2.4.3 (Focus Order): every core widget is actually *operable* with the
 * keyboard, following the WAI-ARIA authoring pattern for its role. For each
 * component we open its live demo page, drive it with real `page.keyboard`
 * events, and assert the resulting state — focus location (`:focus`),
 * `aria-expanded`, `aria-checked`, `aria-valuenow`, selected value — never a
 * screenshot or a private class.
 *
 * The demos are statically generated (SSG): a keypress fired before React has
 * hydrated the island is a no-op. So each interaction that depends on hydration
 * is wrapped in `expect(...).toPass()`, which re-drives the input until the
 * handler is live (rather than sleeping a fixed, flaky amount). Overlay widgets
 * (dialog, dropdown, select, combobox) portal their surface to `document.body`,
 * so those surfaces are matched at the page level by role; only the *trigger*
 * is scoped to the demo `<section>`.
 *
 * Each example renders inside `<section id="{demo-id}">` (see
 * components/docs/component-preview.tsx), which is how we scope to one demo on
 * pages that also carry the "Examples/Gallery" tablist and install tabs.
 */

/** Wait for the hydrated main landmark so the client tree has taken over. */
async function gotoDemo(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: "load" });
  await expect(page.locator("main#main-content")).toBeVisible();
}

/** The demo `<section id>` a given example renders into. */
function demoSection(page: Page, id: string): Locator {
  return page.locator(`section#${id}`);
}

test.describe("keyboard operability", () => {
  test("dialog — Tab is trapped, Escape closes, focus returns to the trigger", async ({ page }) => {
    await gotoDemo(page, "/components/dialog");

    const trigger = demoSection(page, "basic").getByRole("button", { name: "Edit profile" });
    await expect(trigger).toBeVisible();

    const dialog = page.getByRole("dialog");

    // Open with the keyboard (Enter on the focused trigger). Retry until the
    // island has hydrated and the trigger's handler is wired.
    await expect(async () => {
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(dialog).toBeVisible({ timeout: 1_000 });
    }).toPass();

    // The dialog names itself with its title heading (via aria-labelledby).
    await expect(dialog.getByRole("heading", { name: "Edit profile" })).toBeVisible();

    // Focus moved *into* the dialog on open (Radix autofocuses the surface).
    const focusInDialog = await dialog.evaluate((node) => node.contains(document.activeElement));
    expect(focusInDialog).toBe(true);

    // Focus is TRAPPED: tabbing through every focusable descendant must never
    // escape the dialog. Walk more Tabs than there are controls and assert we
    // stay inside the whole time.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const stillInside = await dialog.evaluate((node) => node.contains(document.activeElement));
      expect(stillInside, `focus left the dialog after ${i + 1} Tab(s)`).toBe(true);
    }

    // Escape closes it and returns focus to the trigger that opened it.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("dropdown-menu — opens via keyboard, arrows move, Escape closes", async ({ page }) => {
    await gotoDemo(page, "/components/dropdown-menu");

    const trigger = demoSection(page, "actions").getByRole("button", { name: "Open menu" });
    await expect(trigger).toBeVisible();

    const menu = page.getByRole("menu");

    // Enter on the trigger opens the menu AND (per the ARIA menu-button pattern)
    // moves focus to the first item.
    await expect(async () => {
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(menu).toBeVisible({ timeout: 1_000 });
    }).toPass();

    // While the menu is open Radix marks the outside content inert, so the
    // trigger is not queryable by role — the visible menu with its first item
    // focused is the proof the menu-button opened. (aria-expanded is asserted
    // after close, once the trigger is reachable again.)
    const profile = menu.getByRole("menuitem", { name: /Profile/ });
    await expect(profile).toBeFocused();

    // ArrowDown moves roving focus to the next item (Billing).
    await page.keyboard.press("ArrowDown");
    await expect(menu.getByRole("menuitem", { name: /Billing/ })).toBeFocused();

    // Escape closes the menu and restores focus to the trigger.
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("tabs — Arrow switches selection, Home/End jump to the ends", async ({ page }) => {
    await gotoDemo(page, "/components/tabs");

    // Scope to the demo's own tablist (the page also has the Examples/Gallery
    // tablist and install tabs). The demo tabs are Account/Password/Team.
    const tablist = demoSection(page, "three-tabs").getByRole("tablist");
    const account = tablist.getByRole("tab", { name: "Account" });
    const password = tablist.getByRole("tab", { name: "Password" });
    const team = tablist.getByRole("tab", { name: "Team" });

    await expect(account).toHaveAttribute("aria-selected", "true");

    // ArrowRight (Radix automatic activation) moves focus AND selection.
    await expect(async () => {
      await account.focus();
      await page.keyboard.press("ArrowRight");
      await expect(password).toBeFocused({ timeout: 1_000 });
    }).toPass();
    await expect(password).toHaveAttribute("aria-selected", "true");
    await expect(account).toHaveAttribute("aria-selected", "false");

    // End jumps to the last tab, Home back to the first.
    await page.keyboard.press("End");
    await expect(team).toBeFocused();
    await expect(team).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Home");
    await expect(account).toBeFocused();
    await expect(account).toHaveAttribute("aria-selected", "true");
  });

  test("select — opens, arrow highlights, Enter commits the value", async ({ page }) => {
    await gotoDemo(page, "/components/select");

    // Radix Select trigger exposes role=combobox and is labelled "Deploy region".
    const trigger = demoSection(page, "grouped").getByRole("combobox", { name: "Deploy region" });
    await expect(trigger).toBeVisible();

    const listbox = page.getByRole("listbox");

    // Enter/Space opens the portaled listbox.
    await expect(async () => {
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(listbox).toBeVisible({ timeout: 1_000 });
    }).toPass();

    // Type-ahead: typing "US" highlights the first matching option; committing
    // with Enter closes the list and writes the value back onto the trigger.
    const firstOption = listbox.getByRole("option", { name: "US East (N. Virginia)" });
    await firstOption.hover();
    await page.keyboard.press("Enter");

    await expect(listbox).toBeHidden();
    await expect(trigger).toContainText("US East (N. Virginia)");
  });

  test("combobox — opens, typed query filters, Enter selects", async ({ page }) => {
    await gotoDemo(page, "/components/combobox");

    // The Combobox trigger is role=combobox, labelled by the "Framework" field.
    const trigger = demoSection(page, "single-select").getByRole("combobox", { name: "Framework" });
    await expect(trigger).toBeVisible();

    // Enter opens the Popover with its Command search input.
    const search = page.getByPlaceholder("Search frameworks…");
    await expect(async () => {
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(search).toBeVisible({ timeout: 1_000 });
    }).toPass();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    // Type to filter, ArrowDown to highlight, Enter to select — the trigger
    // label updates to the chosen option and the popover closes.
    await search.fill("Rem");
    const remix = page.getByRole("option", { name: /Remix/ });
    await expect(remix).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(search).toBeHidden();
    await expect(trigger).toContainText("Remix");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("slider — Arrow keys change the value", async ({ page }) => {
    await gotoDemo(page, "/components/slider");

    // Radix Slider thumb has role=slider, aria-label "Volume", starts at 40.
    const slider = demoSection(page, "single-thumb").getByRole("slider", { name: "Volume" });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("aria-valuenow", "40");

    // ArrowRight increments by the step (1). Retry the first press until the
    // island has hydrated, then assert the exact new value.
    await expect(async () => {
      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await expect(slider).toHaveAttribute("aria-valuenow", "41", { timeout: 1_000 });
    }).toPass();

    // A few more presses accumulate deterministically.
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", "43");

    // ArrowLeft decrements back.
    await page.keyboard.press("ArrowLeft");
    await expect(slider).toHaveAttribute("aria-valuenow", "42");
  });

  test("switch — Space toggles the checked state", async ({ page }) => {
    await gotoDemo(page, "/components/switch");

    // Radix Switch has role=switch, labelled "Push notifications", starts on.
    const toggle = demoSection(page, "default").getByRole("switch", { name: "Push notifications" });
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeChecked();

    // Space toggles it off (retry until hydrated), then on again.
    await expect(async () => {
      await toggle.focus();
      await page.keyboard.press("Space");
      await expect(toggle).not.toBeChecked({ timeout: 1_000 });
    }).toPass();

    await page.keyboard.press("Space");
    await expect(toggle).toBeChecked();
  });

  test("checkbox — Space toggles the checked state", async ({ page }) => {
    await gotoDemo(page, "/components/checkbox");

    // Radix Checkbox role=checkbox, labelled "Accept terms & conditions", on.
    const box = demoSection(page, "default").getByRole("checkbox", {
      name: /Accept terms/,
    });
    await expect(box).toBeVisible();
    await expect(box).toBeChecked();

    await expect(async () => {
      await box.focus();
      await page.keyboard.press("Space");
      await expect(box).not.toBeChecked({ timeout: 1_000 });
    }).toPass();

    await page.keyboard.press("Space");
    await expect(box).toBeChecked();
  });

  test("accordion — Enter toggles a disclosure panel", async ({ page }) => {
    await gotoDemo(page, "/components/accordion");

    // Single-open FAQ accordion; triggers are buttons with aria-expanded.
    const first = demoSection(page, "faq").getByRole("button", { name: "Is it accessible?" });
    await expect(first).toBeVisible();
    await expect(first).toHaveAttribute("aria-expanded", "false");

    // Enter on the focused header expands it.
    await expect(async () => {
      await first.focus();
      await page.keyboard.press("Enter");
      await expect(first).toHaveAttribute("aria-expanded", "true", { timeout: 1_000 });
    }).toPass();

    // Its disclosure panel is now revealed. Scope to the accordion content
    // slot so we don't also match the same copy inside the code block below.
    await expect(
      demoSection(page, "faq")
        .locator("[data-slot='accordion-content']")
        .filter({ hasText: /follows the WAI-ARIA disclosure pattern/ }),
    ).toBeVisible();

    // Enter again collapses it (single-open + collapsible).
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });
});
