"use client";

import {
  defaultMode,
  defaultTheme,
  type Mode,
  type ThemeName,
  type ThemeOverrides,
  tokensToCssVars,
} from "@kronus-ui/tokens";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ThemeContext, type ThemeContextValue } from "./use-theme.js";

export interface KronusUIProviderProps {
  children: ReactNode;
  /** Initial theme. @default "aurora" */
  defaultThemeName?: ThemeName;
  /** Initial mode. @default "dark" */
  defaultModeName?: Mode;
  /** Per-scope token overrides (radius, primary, border, ...). */
  overrides?: ThemeOverrides;
  /**
   * When true, attributes are written to <html> so the whole document is
   * themed. When false (default), they are written to a wrapper <div> so a
   * subtree can be themed independently (useful for the ThemeBuilder preview).
   */
  asRoot?: boolean;
  /** Persist theme/mode choice to localStorage under this key. */
  storageKey?: string;
  className?: string;
}

function applyRootAttributes(theme: ThemeName, mode: Mode) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.dataset.kronusTheme = theme;
  el.dataset.kronusMode = mode;
  el.classList.toggle("dark", mode === "dark");
}

/**
 * Themes its subtree purely via CSS custom properties — no per-component
 * re-render, no context churn beyond the controls themselves. Overriding
 * `radius`, `primary`, `border`, etc. updates the entire subtree instantly.
 */
export function KronusUIProvider({
  children,
  defaultThemeName = defaultTheme,
  defaultModeName = defaultMode,
  overrides,
  asRoot = false,
  storageKey,
  className,
}: KronusUIProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(defaultThemeName);
  const [mode, setModeState] = useState<Mode>(defaultModeName);
  // `overrides` seeds the initial value; the effect below keeps it in sync when
  // the prop's CONTENT changes (controlled usage), while setScopedOverrides
  // still drives uncontrolled changes via setOverrides() (e.g. the
  // ThemeBuilder). Syncing on a stable serialization — not the object identity —
  // means a re-render with an equal-content new reference neither loops nor
  // resets the live overrides.
  const [scopedOverrides, setScopedOverrides] = useState<ThemeOverrides>(() => overrides ?? {});

  // Make the controlled `overrides` prop reactive. Keying on the JSON instead of
  // the object reference avoids the infinite loop an inline `overrides={{...}}`
  // (new reference every render) would otherwise cause.
  const overridesKey = JSON.stringify(overrides ?? {});
  // biome-ignore lint/correctness/useExhaustiveDependencies: `overridesKey` is the stable serialization of `overrides`; depending on the object reference is exactly what we must avoid.
  useEffect(() => {
    setScopedOverrides(overrides ?? {});
  }, [overridesKey]);

  // Hydrate from storage once on mount.
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as { theme?: ThemeName; mode?: Mode };
      if (saved.theme) setThemeState(saved.theme);
      if (saved.mode) setModeState(saved.mode);
    } catch {
      // ignore malformed storage
    }
  }, [storageKey]);

  const persist = useCallback(
    (next: { theme: ThemeName; mode: Mode }) => {
      if (!storageKey || typeof window === "undefined") return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // ignore quota / privacy errors
      }
    },
    [storageKey],
  );

  const setTheme = useCallback(
    (next: ThemeName) => {
      setThemeState(next);
      persist({ theme: next, mode });
    },
    [mode, persist],
  );

  const setMode = useCallback(
    (next: Mode) => {
      setModeState(next);
      persist({ theme, mode: next });
    },
    [theme, persist],
  );

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persist({ theme, mode: next });
      return next;
    });
  }, [theme, persist]);

  // Sync <html> attributes + overrides when used as the document root.
  useEffect(() => {
    if (!asRoot) return;
    applyRootAttributes(theme, mode);
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const vars = tokensToCssVars(scopedOverrides);
    for (const [prop, val] of Object.entries(vars)) el.style.setProperty(prop, val);
    return () => {
      for (const prop of Object.keys(vars)) el.style.removeProperty(prop);
    };
  }, [asRoot, theme, mode, scopedOverrides]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      overrides: scopedOverrides,
      setTheme,
      setMode,
      toggleMode,
      setOverrides: setScopedOverrides,
    }),
    [theme, mode, scopedOverrides, setTheme, setMode, toggleMode],
  );

  const style = useMemo(() => tokensToCssVars(scopedOverrides), [scopedOverrides]);

  return (
    <ThemeContext.Provider value={value}>
      {asRoot ? (
        children
      ) : (
        <div
          data-kronus-theme={theme}
          data-kronus-mode={mode}
          className={mode === "dark" ? `dark ${className ?? ""}` : className}
          style={style}
        >
          {children}
        </div>
      )}
    </ThemeContext.Provider>
  );
}
