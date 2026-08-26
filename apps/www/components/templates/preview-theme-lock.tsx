"use client";

import { useLayoutEffect } from "react";
import type { TemplateMode, TemplateTheme } from "../../lib/templates/catalog";

/**
 * Force `<html>` onto the template's theme/mode without writing localStorage.
 *
 * The root layout's `KronusThemeScript` + `KronusUIProvider asRoot` hydrate from
 * the docs-site key. This lock re-applies the composed app's appearance and
 * keeps a MutationObserver on the root so the provider cannot win after paint.
 * Cleanup restores the previous attributes so leaving the preview does not
 * leak the template theme into the rest of the showcase.
 */
export function PreviewThemeLock({
  theme,
  mode,
  embed = false,
}: {
  theme: TemplateTheme;
  mode: TemplateMode;
  embed?: boolean;
}) {
  useLayoutEffect(() => {
    const el = document.documentElement;
    const prev = {
      theme: el.dataset.kronusTheme,
      mode: el.dataset.kronusMode,
      dark: el.classList.contains("dark"),
      embed: el.dataset.kronusPreviewEmbed,
    };

    const apply = () => {
      if (el.dataset.kronusTheme !== theme) el.dataset.kronusTheme = theme;
      if (el.dataset.kronusMode !== mode) el.dataset.kronusMode = mode;
      const wantDark = mode === "dark";
      if (el.classList.contains("dark") !== wantDark) {
        el.classList.toggle("dark", wantDark);
      }
      if (embed) {
        if (el.dataset.kronusPreviewEmbed !== "1") el.dataset.kronusPreviewEmbed = "1";
      } else if (el.dataset.kronusPreviewEmbed !== undefined) {
        delete el.dataset.kronusPreviewEmbed;
      }
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(el, {
      attributes: true,
      attributeFilter: [
        "data-kronus-theme",
        "data-kronus-mode",
        "class",
        "data-kronus-preview-embed",
      ],
    });

    return () => {
      observer.disconnect();
      if (prev.theme) el.dataset.kronusTheme = prev.theme;
      else delete el.dataset.kronusTheme;
      if (prev.mode) el.dataset.kronusMode = prev.mode;
      else delete el.dataset.kronusMode;
      el.classList.toggle("dark", prev.dark);
      if (prev.embed) el.dataset.kronusPreviewEmbed = prev.embed;
      else delete el.dataset.kronusPreviewEmbed;
    };
  }, [theme, mode, embed]);

  return null;
}
