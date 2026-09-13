"use client";

import { WorkspaceSwitcher } from "@cronus-ui/ui/workspace-switcher";

const FALLBACK_ITEMS = ["Cronus", "Northwind"];

/** Workspace objects cannot round-trip through emit — names come from `items`. */
export function WorkspaceSwitcherFixture({ items }: { items?: string[] }) {
  const names = items && items.length > 0 ? items : FALLBACK_ITEMS;
  return (
    <WorkspaceSwitcher
      workspaces={names.map((name) => ({
        id: name.toLowerCase().replaceAll(/\s+/g, "-"),
        name,
      }))}
    />
  );
}
