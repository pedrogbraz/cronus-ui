import { defaultMode, defaultTheme, type Mode, type ThemeName } from "@kronus-ui/tokens";

export interface KronusThemeScriptProps {
  /**
   * The same `storageKey` passed to `<KronusUIProvider>`. The script reads the
   * persisted `{ theme, mode }` from `localStorage[storageKey]`.
   */
  storageKey: string;
  /** Theme to apply when storage is empty/unreadable. @default "aurora" */
  defaultThemeName?: ThemeName;
  /** Mode to apply when storage is empty/unreadable. @default "dark" */
  defaultModeName?: Mode;
  /** CSP nonce forwarded to the inline `<script nonce>`. */
  nonce?: string;
}

/**
 * Builds the dependency-free IIFE source. The body mirrors the provider's
 * `applyRootAttributes` byte-for-byte (dataset.kronusTheme / dataset.kronusMode /
 * classList.toggle("dark", …)) so the pre-paint state matches what React would
 * compute on hydration. All interpolated values are `JSON.stringify`-encoded so
 * a storage key or default containing quotes can't break out of the script.
 */
function buildScript(
  storageKey: string,
  defaultThemeName: ThemeName,
  defaultModeName: Mode,
): string {
  // Defaults are applied first and the storage read overrides them, so a quota /
  // malformed-JSON throw still leaves <html> on the SSR default the provider
  // reconciles to on hydration (rather than a bare, attribute-less root).
  return `(function(){var d=document.documentElement,t=${JSON.stringify(
    defaultThemeName,
  )},m=${JSON.stringify(defaultModeName)};try{var s=localStorage.getItem(${JSON.stringify(
    storageKey,
  )});if(s){var p=JSON.parse(s);if(p&&p.theme)t=p.theme;if(p&&p.mode)m=p.mode;}}catch(e){}d.dataset.kronusTheme=t;d.dataset.kronusMode=m;d.classList.toggle("dark",m==="dark");})();`;
}

/**
 * Inline head script that applies the persisted theme/mode to `<html>` BEFORE
 * first paint, eliminating the flash of the default theme that otherwise occurs
 * while `<KronusUIProvider asRoot storageKey>` hydrates from `localStorage` in a
 * post-paint effect.
 *
 * Place it inside `<head>` (above the app) and add `suppressHydrationWarning` to
 * the `<html>` element, since this mutates `<html>` before React hydrates.
 *
 * ```tsx
 * <html lang="en" suppressHydrationWarning>
 *   <head>
 *     <KronusThemeScript storageKey="kronus-ui-theme" defaultThemeName="aurora" defaultModeName="dark" />
 *   </head>
 *   ...
 * </html>
 * ```
 */
export function KronusThemeScript({
  storageKey,
  defaultThemeName = defaultTheme,
  defaultModeName = defaultMode,
  nonce,
}: KronusThemeScriptProps) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: required to inline a pre-paint anti-FOUC script; all interpolated values are JSON.stringify-encoded.
      dangerouslySetInnerHTML={{
        __html: buildScript(storageKey, defaultThemeName, defaultModeName),
      }}
      nonce={nonce}
    />
  );
}
