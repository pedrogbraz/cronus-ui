// @ts-nocheck
"use client";

import { useCallback, useEffect } from "react";
import { click8bitSound } from "../lib/click-8bit";
import { useTemplateMode } from "../lib/use-template-mode";
import { useSound } from "./use-sound";
import { usePixelTransition } from "./usepixel-transition";

export function useThemeTransition() {
  const { isDark, toggle } = useTemplateMode();
  const { runTransition } = usePixelTransition({ cols: 20, rows: 12 });

  const [play] = useSound(click8bitSound, { volume: 0.1 });

  const toggleTheme = useCallback(
    (x?: number, y?: number) => {
      setTimeout(() => {
        play();
      }, 60);

      runTransition("wave", isDark, () => toggle(), x && y ? { x, y } : undefined);
    },
    [isDark, runTransition, toggle, play],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key.toLowerCase() === "d") {
        toggleTheme(window.innerWidth / 2, window.innerHeight / 2);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleTheme]);

  return toggleTheme;
}
