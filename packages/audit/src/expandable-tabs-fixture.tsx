"use client";

import { ExpandableTabs } from "@cronus-ui/ui/expandable-tabs";

const FALLBACK_ITEMS = ["Home", "Search"];

function TabGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

/** Icons are React nodes emit cannot hold — labels come from fixture `items`. */
export function ExpandableTabsFixture({
  items,
  "aria-label": ariaLabel,
}: {
  items?: string[];
  "aria-label"?: string;
}) {
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;
  return (
    <ExpandableTabs
      aria-label={ariaLabel}
      defaultValue={labels[0]}
      items={labels.map((label) => ({
        value: label,
        label,
        icon: <TabGlyph />,
      }))}
    />
  );
}
