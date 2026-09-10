"use client";

import { useTheme } from "@cronus-ui/theme";
import { useCallback, useLayoutEffect, useState } from "react";

/**
 * Theme toggle that prefers a local `[data-template-stage]` scope (docs preview)
 * and falls back to Cronus `toggleMode` in a generated app.
 */
export function useTemplateMode() {
  const { mode, toggleMode } = useTheme();
  const [stageDark, setStageDark] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const stage = document.querySelector("[data-template-stage]");
    if (stage) setStageDark(stage.classList.contains("dark"));
  }, []);

  const isDark = stageDark ?? mode === "dark";

  const toggle = useCallback(() => {
    const stage = document.querySelector("[data-template-stage]");
    if (stage) {
      const next = !stage.classList.contains("dark");
      stage.classList.toggle("dark", next);
      setStageDark(next);
      return;
    }
    toggleMode();
  }, [toggleMode]);

  return { isDark, toggle };
}
