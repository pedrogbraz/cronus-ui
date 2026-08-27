"use client";

import { useTheme } from "@cronus-ui/theme";
import { useEffect } from "react";

/**
 * Landing chrome is Neutral. Persists Neutral so a leftover preset from the
 * retired header picker cannot restyle the homepage after hydrate.
 */
export function ChromeThemeLock() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme !== "neutral") setTheme("neutral");
  }, [theme, setTheme]);

  return null;
}
