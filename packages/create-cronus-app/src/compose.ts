/**
 * Post-scaffold composition adapter.
 *
 * `store`/`landing` have no bundled template dir: create-cronus-app copies the
 * `default` base, then this module calls `cronus-ui`'s `composeApp()` library
 * entry to generate the pages + chrome from validated registry blocks.
 *
 * The import is dynamic so the rest of the CLI (and its tests) never pay for
 * loading `cronus-ui/compose` — only composed templates reach here.
 *
 * Registry resolution (F1 honest cut — the chicken-and-egg):
 *   A freshly scaffolded app's `cronus-ui.json` pins the registry to the release
 *   remote (`v<version>/registry`), which only ships the `meta.json` sidecar
 *   compose needs from v0.4.0+. `composeApp` hard-requires that sidecar. So:
 *     1. `CRONUS_UI_REGISTRY` (env) wins — the dev/CI escape hatch that points at
 *        the local workspace `registry/` dir (which has meta.json today).
 *     2. Otherwise `composeApp` uses the project's own config registry (the
 *        release remote — correct once v0.4.0+ publishes meta.json).
 *   When the registry lacks meta.json, compose fails gracefully and the caller
 *   keeps the valid `default` scaffold with a clear "run compose later" hint.
 */

import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

/** What create-cronus-app needs from the composer (a subset of `ComposeAppResult`). */
export interface ComposeTemplateOptions {
  /** The scaffolded project root (contains cronus-ui.json). */
  targetDir: string;
  /** The composed template name (`store` / `landing`). */
  template: string;
  /** Brand string baked into chrome/hero copy (the project name). */
  brand: string;
  /** Skip the composer's own `pm add` (the final create-cronus-app install covers it). */
  skipInstall?: boolean;
  /**
   * Registry override. Defaults to `process.env.CRONUS_UI_REGISTRY` so dev/CI can
   * point at the local workspace registry; falls through to the project config
   * when unset.
   */
  registry?: string;
}

/** Structured outcome so the caller can log a page count or a graceful skip. */
export type ComposeTemplateResult =
  | { ok: true; pageCount: number; blockCount: number; files: string[] }
  | { ok: false; reason: string };

/**
 * True when `file` is a generated page that owns the root URL "/".
 *
 * The renderer emits the home page as `app/(<chromeGroup>)/page.tsx` (route "/"
 * inside a path-transparent route group), never a bare `app/page.tsx`. So a
 * generated `app/(<group>)/page.tsx` is the compose-authored home page.
 */
function isGeneratedRootPage(file: string): boolean {
  return /^app\/\([^/]+\)\/page\.tsx$/.test(file);
}

/**
 * Remove the base template's `app/page.tsx` when compose generated its own home
 * page. `create-cronus-app store|landing` scaffolds the `default` base (which
 * ships `app/page.tsx`, the single-page dashboard starter) and THEN composes
 * `app/(<group>)/page.tsx` for the manifest's "/" route. In the Next.js App
 * Router a route group like `(site)` is path-transparent, so `app/page.tsx` and
 * `app/(site)/page.tsx` both own "/". Left together, `next build` either errors
 * ("two parallel pages resolve to /") or — on the Turbopack builder the template
 * uses — silently serves the leftover base starter and drops the composed store
 * home. Deleting the now-superseded base page leaves exactly one "/" page.
 *
 * The base `app/layout.tsx` (the required <html>/<body> root layout) is KEPT:
 * Next allows a root `app/layout.tsx` plus nested route-group layouts
 * (`app/(site)/layout.tsx`) to coexist, so only the PAGE collides.
 */
function removeSupersededBasePage(targetDir: string, generatedFiles: string[]): void {
  // Only delete the base page when compose actually authored a "/" page to
  // replace it — never orphan the app of a home route.
  if (!generatedFiles.some(isGeneratedRootPage)) return;
  const basePage = join(targetDir, "app", "page.tsx");
  if (existsSync(basePage)) rmSync(basePage);
}

/**
 * Compose a bundled app template into the freshly scaffolded project. Never
 * throws: a compose failure (e.g. the pinned registry has no meta.json yet)
 * returns `{ ok: false, reason }` so scaffolding still succeeds with the valid
 * `default` base.
 */
export async function composeTemplate(
  options: ComposeTemplateOptions,
): Promise<ComposeTemplateResult> {
  const registry = options.registry ?? process.env.CRONUS_UI_REGISTRY;
  try {
    // Dynamic import: only composed templates load the compose library, and a
    // missing/unbuilt `cronus-ui/compose` degrades to a graceful skip rather than
    // crashing the scaffolder.
    const { composeApp } = await import("cronus-ui/compose");
    const result = await composeApp({
      targetDir: options.targetDir,
      template: options.template,
      choices: { brand: options.brand },
      skipInstall: options.skipInstall ?? true,
      ...(registry !== undefined ? { registry } : {}),
    });
    // Compose owns the "/" route via app/(<group>)/page.tsx; drop the base
    // template's colliding app/page.tsx so exactly one page resolves to "/".
    removeSupersededBasePage(options.targetDir, result.generatedFiles);
    return {
      ok: true,
      pageCount: result.generatedFiles.filter((f) => f.endsWith("page.tsx")).length,
      blockCount: result.installedBlocks.length,
      files: result.generatedFiles,
    };
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
}
