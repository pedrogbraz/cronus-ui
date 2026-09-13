import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { compareTokenSnapshots, extractRuntimeLayer } from "./token-snapshot-check.js";

const here = dirname(fileURLToPath(import.meta.url));

function kernelCss(): string | null {
  const root = process.env.CRONUS_KERNEL_ROOT ?? join(homedir(), "projects/cooud/cronus-kernel");
  const file = join(root, "src/cronus_ui_tokens.css");
  if (!existsSync(file)) return null;
  return readFileSync(file, "utf8");
}

describe("token snapshot", () => {
  it("runtime layer matches vendored kernel CSS when the kernel is present", () => {
    const kernel = kernelCss();
    if (!kernel) return;
    const ui = readFileSync(join(here, "../../tokens/styles/tokens.css"), "utf8");
    const result = compareTokenSnapshots(ui, kernel);
    expect(result.ok, result.message).toBe(true);
    expect(extractRuntimeLayer(ui).length).toBeGreaterThan(0);
  });

  it("detects a mutated hex in the runtime layer", () => {
    const ui = `[data-cronus-theme="aurora"][data-cronus-mode="dark"] { --cronus-primary: oklch(0.685 0.169 237.3); }`;
    const kernel = `[data-cronus-theme="aurora"][data-cronus-mode="dark"] { --cronus-primary: oklch(0.1 0 0); }`;
    expect(compareTokenSnapshots(ui, kernel).ok).toBe(false);
  });
});
