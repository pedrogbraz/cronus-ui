"use client";

import { useTheme } from "@cronus-ui/theme";
import { useEffect } from "react";

/** Pro chrome is Neutral — same palette as the OSS landing. */
export function ChromeThemeLock() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme !== "neutral") setTheme("neutral");
  }, [theme, setTheme]);

  return null;
}
