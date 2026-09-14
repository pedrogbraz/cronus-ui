/**
 * Runs the audit specs against an already-running `bun run audit:dev`;
 * never starts or stops servers.
 *
 * Expects www on http://localhost:4747 (CRONUS_AUDIT_ORIGIN=http://127.0.0.1:5176)
 * and the kernel audit canvas on http://127.0.0.1:5176. No `webServer` block on
 * purpose: `playwright.audit.config.ts` boots its own servers with
 * `reuseExistingServer: false` and would collide with a shared dev session.
 *
 * `use` / viewport / colorScheme / snapshot / reporter settings mirror
 * `playwright.audit.config.ts` so results and baselines are comparable.
 *
 * Env flags (see playwright.audit.config.ts): AUDIT_WORKERS, AUDIT_STRICT_PROPS,
 * AUDIT_STRICT_PIXELS, AUDIT_PIXEL_MAX_DIFF.
 */
import { defineConfig } from "@playwright/test";

const isCI = !!process.env.CI;
const workers = Number(process.env.AUDIT_WORKERS ?? 1);

export default defineConfig({
  testDir: "./e2e/audit",
  fullyParallel: false,
  forbidOnly: isCI,
  retries: 0,
  workers: Number.isInteger(workers) && workers > 0 ? workers : 1,
  reporter: [
    ...(isCI ? [["github"] as const] : []),
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report/audit" }],
    ["json", { outputFile: "test-results/audit-report.json" }],
  ],
  timeout: 60_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      pathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
    },
  },
  // Only `toMatchSnapshot` uses this: parity.pixel.spec.ts writes the React
  // canvas PNG here per run and compares the Cronus canvas against it.
  snapshotPathTemplate: "{testDir}/../../test-results/audit-pixel-baseline/{arg}{ext}",
  use: {
    baseURL: "http://localhost:4747",
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    launchOptions: { args: ["--force-color-profile=srgb"] },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
