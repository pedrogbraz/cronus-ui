"use client";

import type { ReactNode } from "react";

/** Theme is owned by CronusUIProvider in app/layout.tsx. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return children;
}
