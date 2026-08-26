import type { TemplateMode, TemplateTheme } from "./catalog";

/** Inline script that wins first paint after CronusThemeScript reads storage. */
export function previewThemeInlineScript(
  theme: TemplateTheme,
  mode: TemplateMode,
  embed: boolean,
): string {
  return `(function(){var d=document.documentElement;d.dataset.cronusTheme=${JSON.stringify(
    theme,
  )};d.dataset.cronusMode=${JSON.stringify(mode)};d.classList.toggle("dark",${
    mode === "dark"
  });${embed ? 'd.dataset.cronusPreviewEmbed="1";' : "delete d.dataset.cronusPreviewEmbed;"}})();`;
}
