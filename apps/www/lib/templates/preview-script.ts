import type { TemplateMode, TemplateTheme } from "./catalog";

/** Inline script that wins first paint after KronusThemeScript reads storage. */
export function previewThemeInlineScript(
  theme: TemplateTheme,
  mode: TemplateMode,
  embed: boolean,
): string {
  return `(function(){var d=document.documentElement;d.dataset.kronusTheme=${JSON.stringify(
    theme,
  )};d.dataset.kronusMode=${JSON.stringify(mode)};d.classList.toggle("dark",${
    mode === "dark"
  });${embed ? 'd.dataset.kronusPreviewEmbed="1";' : "delete d.dataset.kronusPreviewEmbed;"}})();`;
}
