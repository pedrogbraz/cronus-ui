/**
 * Test utilities for apps built on Cronus UI — imported from
 * `@cronus-ui/ui/testing` (deliberately not part of the main barrel, so test
 * helpers can never leak into an app bundle).
 *
 * - `renderWithCronus` — Testing Library `render` wrapped in a scoped
 *   `CronusUIProvider`, plus `rerenderWithTheme` to flip theme/mode mid-test.
 * - `findDialog` / `findTooltip` — document.body-scoped async queries for
 *   Radix surfaces that render through portals (outside the render container).
 * - `expectNoA11yViolations` — the house axe gate: run axe-core over an
 *   element (pass Testing Library's `baseElement` so portaled overlays are
 *   included) and fail with the formatted violations.
 *
 * Peer requirements: `@testing-library/react` (all helpers) and `vitest-axe`
 * (`expectNoA11yViolations` only) are optional peer dependencies — install
 * them with your dev dependencies. Runs under jsdom with Vitest or Jest.
 */
import { CronusUIProvider, type CronusUIProviderProps } from "@cronus-ui/theme";
import {
  type RenderOptions,
  type RenderResult,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

/** Theme preset accepted by {@link renderWithCronus} (e.g. "aurora", "neutral"). */
export type CronusTheme = NonNullable<CronusUIProviderProps["defaultThemeName"]>;
/** Mode accepted by {@link renderWithCronus} ("dark" | "light"). */
export type CronusMode = NonNullable<CronusUIProviderProps["defaultModeName"]>;

export interface RenderWithCronusOptions extends Omit<RenderOptions, "queries"> {
  /** Theme preset to mount the UI under. @default "aurora" */
  theme?: CronusTheme;
  /** Color mode to mount the UI under. @default "dark" */
  mode?: CronusMode;
}

export interface RenderWithCronusResult extends RenderResult {
  /**
   * Remount the themed scope under a different theme/mode (the provider seeds
   * its state from the mount-time defaults, so switching requires a remount —
   * component state inside the tree is reset, exactly like a fresh render).
   */
  rerenderWithTheme: (theme: CronusTheme, mode?: CronusMode) => void;
}

/**
 * Testing Library `render` with the UI wrapped in a scoped `CronusUIProvider`
 * (non-`asRoot`): the theme attributes land on a wrapper `<div
 * data-cronus-theme data-cronus-mode>`, never on `<html>`, so parallel tests
 * cannot bleed theme state into each other through the document.
 *
 * Returns the usual render result — `rerender` keeps re-wrapping in the same
 * provider — plus {@link RenderWithCronusResult.rerenderWithTheme}.
 *
 * Note: Radix overlays portal to `document.body`, outside the themed wrapper.
 * Use `baseElement` (not `container`) for assertions that must see them.
 */
export function renderWithCronus(
  ui: ReactElement,
  options: RenderWithCronusOptions = {},
): RenderWithCronusResult {
  const { theme = "aurora", mode = "dark", ...rtlOptions } = options;
  const current = { theme, mode };
  let lastUi: ReactNode = ui;

  // The provider seeds theme/mode state from its `default*` props, so a theme
  // change must remount it — the key encodes the active pair to force that.
  const wrap = (el: ReactNode) => (
    <CronusUIProvider
      key={`${current.theme}:${current.mode}`}
      defaultThemeName={current.theme}
      defaultModeName={current.mode}
    >
      {el}
    </CronusUIProvider>
  );

  const result = render(wrap(ui), rtlOptions);

  return {
    ...result,
    rerender: (next: ReactNode) => {
      lastUi = next;
      result.rerender(wrap(next));
    },
    rerenderWithTheme: (nextTheme: CronusTheme, nextMode?: CronusMode) => {
      current.theme = nextTheme;
      current.mode = nextMode ?? current.mode;
      result.rerender(wrap(lastUi));
    },
  };
}

/**
 * Find the open dialog (Radix `Dialog`, `AlertDialog`, …) wherever it
 * portaled to — queries are document.body-scoped, so it works even though the
 * surface renders outside the container `render` returned. Optionally narrow
 * by accessible name (a `DialogTitle` labels the surface).
 */
export function findDialog(name?: string | RegExp): Promise<HTMLElement> {
  return screen.findByRole("dialog", name === undefined ? undefined : { name });
}

/**
 * Find the open tooltip (role="tooltip") in the document, optionally
 * narrowed to the one whose content matches `text`. Like {@link findDialog},
 * this queries document.body, so the portaled Radix content is found.
 */
export function findTooltip(text?: string | RegExp): Promise<HTMLElement> {
  if (text === undefined) return screen.findByRole("tooltip");
  return waitFor(() => {
    const tooltips = screen.getAllByRole("tooltip");
    const match = tooltips.find((el) => {
      const content = el.textContent ?? "";
      return typeof text === "string" ? content.includes(text) : text.test(content);
    });
    if (!match) {
      throw new Error(
        `Found ${tooltips.length} open tooltip(s), but none matching ${String(text)}`,
      );
    }
    return match;
  });
}

type VitestAxe = typeof import("vitest-axe");

async function loadVitestAxe(): Promise<VitestAxe> {
  try {
    return await import("vitest-axe");
  } catch {
    throw new Error(
      '@cronus-ui/ui/testing: expectNoA11yViolations needs the optional peer dependency "vitest-axe". ' +
        "Install it with your dev dependencies (e.g. `npm i -D vitest-axe`) and re-run the tests.",
    );
  }
}

/**
 * Run axe-core over an element and fail with the formatted violations if any
 * are found — the same gate the Cronus UI component suite runs on every
 * surface. Overlays portal to `document.body`, so pass Testing Library's
 * `baseElement` (rather than `container`) to include them in the scan.
 *
 * `axeOptions` is forwarded to axe-core's run options, e.g.
 * `{ rules: { region: { enabled: false } } }` for an isolated component mount
 * that intentionally has no landmark structure.
 */
export async function expectNoA11yViolations(
  elementOrBaseElement: Element,
  axeOptions?: Record<string, unknown>,
): Promise<void> {
  const { axe } = await loadVitestAxe();
  const results = await axe(elementOrBaseElement, axeOptions as Parameters<VitestAxe["axe"]>[1]);
  const { violations } = results;
  if (violations.length === 0) return;
  const details = violations
    .map((violation) => {
      const nodes = violation.nodes.map((node) => `    ${node.target.join(", ")}`).join("\n");
      return `  ${violation.id}: ${violation.help}\n${nodes}\n    ${violation.helpUrl}`;
    })
    .join("\n");
  throw new Error(
    `Expected no axe accessibility violations, but found ${violations.length}:\n${details}`,
  );
}
