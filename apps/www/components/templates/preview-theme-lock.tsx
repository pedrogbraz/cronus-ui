"use client";

import { useLayoutEffect } from "react";
import type { TemplateMode, TemplateTheme } from "../../lib/templates/catalog";

/**
 * Force `<html>` onto the template's theme/mode without writing localStorage.
 *
 * The root layout's `CronusThemeScript` + `CronusUIProvider asRoot` hydrate from
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
      theme: el.dataset.cronusTheme,
      mode: el.dataset.cronusMode,
      dark: el.classList.contains("dark"),
      embed: el.dataset.cronusPreviewEmbed,
      forceMotion: el.dataset.forceMotion,
    };

    const apply = () => {
      if (el.dataset.cronusTheme !== theme) el.dataset.cronusTheme = theme;
      if (el.dataset.cronusMode !== mode) el.dataset.cronusMode = mode;
      const wantDark = mode === "dark";
      if (el.classList.contains("dark") !== wantDark) {
        el.classList.toggle("dark", wantDark);
      }
      if (embed) {
        if (el.dataset.cronusPreviewEmbed !== "1") el.dataset.cronusPreviewEmbed = "1";
        if (el.dataset.forceMotion !== "") el.dataset.forceMotion = "";
      } else {
        if (el.dataset.cronusPreviewEmbed !== undefined) delete el.dataset.cronusPreviewEmbed;
        if (el.dataset.forceMotion !== undefined) delete el.dataset.forceMotion;
      }
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(el, {
      attributes: true,
      attributeFilter: [
        "data-cronus-theme",
        "data-cronus-mode",
        "class",
        "data-cronus-preview-embed",
        "data-force-motion",
      ],
    });

    return () => {
      observer.disconnect();
      if (prev.theme) el.dataset.cronusTheme = prev.theme;
      else delete el.dataset.cronusTheme;
      if (prev.mode) el.dataset.cronusMode = prev.mode;
      else delete el.dataset.cronusMode;
      el.classList.toggle("dark", prev.dark);
      if (prev.embed) el.dataset.cronusPreviewEmbed = prev.embed;
      else delete el.dataset.cronusPreviewEmbed;
      if (prev.forceMotion !== undefined) el.dataset.forceMotion = prev.forceMotion;
      else delete el.dataset.forceMotion;
    };
  }, [theme, mode, embed]);

  return null;
}
