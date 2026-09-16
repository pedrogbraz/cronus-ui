"use client";

import type { Mode, ThemeName } from "@cronus-ui/tokens";
import { useEffect } from "react";

/**
 * Radix/cmdk portals mount on `<body>`, outside the themed audit canvas, so
 * floating fixture content (e.g. multi-select's open popover) inherited the site
 * theme from `<html data-cronus-theme="neutral">` instead of the audited preset.
 * While the audit page is mounted, mirror the preset/mode on `<body>` so portaled
 * content resolves the same tokens as the canvas. Restores the previous values.
 */
export function AuditPortalTheme({ preset, mode }: { preset: ThemeName; mode: Mode }) {
  useEffect(() => {
    const body = document.body;
    const previous = {
      theme: body.getAttribute("data-cronus-theme"),
      mode: body.getAttribute("data-cronus-mode"),
    };
    body.setAttribute("data-cronus-theme", preset);
    body.setAttribute("data-cronus-mode", mode);
    return () => {
      if (previous.theme === null) body.removeAttribute("data-cronus-theme");
      else body.setAttribute("data-cronus-theme", previous.theme);
      if (previous.mode === null) body.removeAttribute("data-cronus-mode");
      else body.setAttribute("data-cronus-mode", previous.mode);
    };
  }, [preset, mode]);
  return null;
}
