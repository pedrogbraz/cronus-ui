"use client";

import { Dock } from "@cronus-ui/ui/dock";

const FALLBACK_ITEMS = ["Home", "Search"];

function DockGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

/** Icons are React nodes emit cannot hold — labels come from fixture `items`. */
export function DockFixture({
  items,
  "aria-label": ariaLabel,
}: {
  items?: string[];
  "aria-label"?: string;
}) {
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;
  return (
    <Dock
      aria-label={ariaLabel}
      items={labels.map((label) => ({
        label,
        icon: <DockGlyph />,
      }))}
    />
  );
}
