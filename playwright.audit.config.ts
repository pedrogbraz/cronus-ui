import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";

/**
 * Cronus Audit Playwright config. Do NOT add these webServers to
 * playwright.config.ts — that would boot the kernel for a11y/e2e/visual
 * and boot Pro for audit.
 *
 * Pixel SoT: `next start` + `cronus run --audit-canvas`. Always
 * `reuseExistingServer: false`. Viewport is explicit 1280×900 (not Desktop Chrome 720p).
 */

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4747);
const BASE_URL = `http://localhost:${PORT}`;
const KERNEL_ORIGIN = "http://127.0.0.1:5176";
const isCI = !!process.env.CI;

function cronusBin(): string {
  if (process.env.CRONUS_BIN) return process.env.CRONUS_BIN;
  const candidates = [
    join(homedir(), "projects/cooud/cronus-kernel/target/debug/cronus"),
    join(process.cwd(), "../cronus-kernel/target/debug/cronus"),
    join(process.cwd(), "cronus-kernel/target/debug/cronus"),
    join(process.cwd(), "cronus-kernel/target/release/cronus"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  return "cronus";
}

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
    baseURL: BASE_URL,
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    launchOptions: { args: ["--force-color-profile=srgb"] },
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "bun run --filter @cronus-ui/www start",
      url: BASE_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { CRONUS_AUDIT_ORIGIN: KERNEL_ORIGIN },
    },
    {
      command: `bun ../src/cli.ts emit && ${cronusBin()} run --audit-canvas 5176`,
      cwd: "packages/audit/cronus-fixtures",
      url: `${KERNEL_ORIGIN}/audit/button/primary-md`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
