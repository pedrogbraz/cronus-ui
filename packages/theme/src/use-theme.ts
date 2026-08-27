"use client";

import type { Mode, ThemeName, ThemeOverrides } from "@cronus-ui/tokens";
import { createContext, useContext } from "react";

export interface ThemeContextValue {
  theme: ThemeName;
  mode: Mode;
  overrides: ThemeOverrides;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  setOverrides: (overrides: ThemeOverrides) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <CronusUIProvider>");
  }
  return ctx;
}

/** Mode from the nearest provider, or null outside one. */
export function useOptionalThemeMode(): Mode | null {
  return useContext(ThemeContext)?.mode ?? null;
}
