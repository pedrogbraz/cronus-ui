import { readFileSync } from "node:fs";
import { join } from "node:path";

export function tokensPackageCssPath(monorepoRoot: string): string {
  return join(monorepoRoot, "packages/tokens/styles/tokens.css");
}

export function kernelVendoredCssPath(kernelRoot: string): string {
  return join(kernelRoot, "src/cronus_ui_tokens.css");
}

/** Runtime layer: `[data-cronus-theme="…"][data-cronus-mode="…"] { --cronus-*: … }`. */
export function extractRuntimeLayer(css: string): string {
  const blocks: string[] = [];
  const re = /\[data-cronus-theme="[^"]+"\]\[data-cronus-mode="(?:light|dark)"\]\s*\{[^}]*\}/g;
  for (const m of css.matchAll(re)) {
    if (m[0]) blocks.push(m[0].replace(/\s+/g, " ").trim());
  }
  return blocks.sort().join("\n");
}

export function compareTokenSnapshots(
  uiCss: string,
  kernelCss: string,
): { ok: boolean; message: string } {
  const a = extractRuntimeLayer(uiCss);
  const b = extractRuntimeLayer(kernelCss);
  if (a.length === 0) {
    return { ok: false, message: "no runtime layer in UI tokens.css" };
  }
  if (a !== b) {
    return {
      ok: false,
      message: "kernel vendored tokens.css runtime layer drifted from packages/tokens",
    };
  }
  return { ok: true, message: "runtime layer matches" };
}

export function checkTokenSnapshot(
  monorepoRoot: string,
  kernelRoot: string,
): { ok: boolean; message: string } {
  const uiCss = readFileSync(tokensPackageCssPath(monorepoRoot), "utf8");
  const kernelCss = readFileSync(kernelVendoredCssPath(kernelRoot), "utf8");
  return compareTokenSnapshots(uiCss, kernelCss);
}
