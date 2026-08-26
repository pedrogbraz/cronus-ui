import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Kronus UI showcase (`@kronus-ui/www`) and
 * the Pro origin (`@kronus-ui/pro`).
 *
 * Three projects, all Chromium-headless, separated by spec directory so each
 * suite can be targeted on its own:
 *   - `a11y`   → e2e/a11y/**   (axe-core scans of the core routes)
 *   - `e2e`    → e2e/flows/**  (skip-link, command palette, install tabs behavior)
 *   - `visual` → e2e/visual/** (screenshot regression of the component galleries;
 *                run with `bunx playwright test --project=visual`)
 *
 * The `webServer`s serve the **already-built** production apps via `next start`
 * (the CI runs `bun run build` before the test steps; locally you must build
 * first too). We deliberately do NOT build inside the webServer command so the
 * server boots fast and the suite reflects the shipped SSG/SSR output.
 *
 * Port 4747 is OSS (`apps/www`). Port 4748 is Kronus Pro (`apps/pro`).
 * `reuseExistingServer` is on outside CI so a dev server you already have
 * running is reused.
 */

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4747);
const PRO_PORT = Number(process.env.PLAYWRIGHT_PRO_PORT ?? 4748);
const BASE_URL = `http://localhost:${PORT}`;
const PRO_URL = `http://localhost:${PRO_PORT}`;
const isCI = !!process.env.CI;

export default defineConfig({
  // Only Playwright specs live here; vitest unit tests live under packages/**
  // and apps/** and are matched by their own runner, never by Playwright.
  testDir: "./e2e",
  // Deterministic, sequential-ish runs: fail fast on flake in CI.
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [["github"], ["list"]] : [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // Stable, predictable viewport for both a11y scans and flows.
    viewport: { width: 1280, height: 900 },
  },

  projects: [
    {
      name: "a11y",
      testDir: "./e2e/a11y",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "e2e",
      testDir: "./e2e/flows",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "visual",
      testDir: "./e2e/visual",
      // Baselines are PLATFORM-HONEST: font rasterization/AA differ across
      // OSes, so darwin (committed from a dev machine) and linux (bootstrapped
      // by the CI `visual` job — see ci.yml + CONTRIBUTING.md) each get their
      // own directory instead of pretending one set of pixels fits all.
      snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
      use: {
        ...devices["Desktop Chrome"],
        // Pin the pixel pipeline: 1x density and a fixed color profile so the
        // same platform always rasterizes identically (retina Macs included).
        deviceScaleFactor: 1,
        launchOptions: { args: ["--force-color-profile=srgb"] },
      },
    },
  ],

  webServer: [
    {
      // Serve the already-built apps. Build is the CI step BEFORE these tests
      // (and you must `bun run build` locally before running the suite).
      command: "bun run --filter @kronus-ui/www start",
      url: BASE_URL,
      reuseExistingServer: !isCI,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      command: "bun run --filter @kronus-ui/pro start",
      url: PRO_URL,
      reuseExistingServer: !isCI,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
  ],
});
