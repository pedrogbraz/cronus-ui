/**
 * Runs the audit specs against an already-running `bun run audit:dev`;
 * never starts or stops servers.
 *
 * Expects www on http://localhost:4747 (CRONUS_AUDIT_ORIGIN=http://127.0.0.1:5176)
 * and the kernel audit canvas on http://127.0.0.1:5176. No `webServer` block on
 * purpose: `playwright.audit.config.ts` boots its own servers with
 * `reuseExistingServer: false` and would collide with a shared dev session.
 *
 * `use` / viewport / colorScheme / snapshot settings mirror
 * `playwright.audit.config.ts` so results and baselines are comparable.
 */
import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./e2e/audit",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: 0,
  workers: 1,
  reporter: isCI ? [["github"], ["list"]] : [["list"]],
  timeout: 60_000,
  expect: { timeout: 15_000, toHaveScreenshot: { maxDiffPixelRatio: 0.02 } },
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  use: {
    baseURL: "http://localhost:4747",
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    launchOptions: { args: ["--force-color-profile=srgb"] },
    trace: "on-first-retry",
  },
});
