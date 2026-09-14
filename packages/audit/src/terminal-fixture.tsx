"use client";

import { Terminal } from "@cronus-ui/ui/terminal";

const FALLBACK_ITEMS = ["bunx cronus-ui add button", "added button"];

/** `{type, text}` lines cannot round-trip through emit — labels come from `items`. */
export function TerminalFixture({ items, title }: { items?: string[]; title?: string }) {
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;
  const lines = labels.map((text, index) => ({
    type: index % 2 === 0 ? ("input" as const) : ("output" as const),
    text,
  }));
  return (
    <Terminal lines={lines} title={title ?? "zsh"} motionPreference="never" className="w-72" />
  );
}
