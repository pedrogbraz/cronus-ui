"use client";

import { TreeView } from "@cronus-ui/ui/tree-view";

const FALLBACK_ITEMS = ["src", "README.md"];

/** Nested `{id, label, children}` cannot round-trip through emit — labels come from `items`. */
export function TreeViewFixture({
  items,
  "aria-label": ariaLabel,
}: {
  items?: string[];
  "aria-label"?: string;
}) {
  const labels = items && items.length > 0 ? items : FALLBACK_ITEMS;
  const root = labels[0];
  const rest = labels.slice(1);
  const data =
    root && rest.length > 0
      ? [
          {
            id: root,
            label: root,
            children: rest.map((label) => ({ id: label, label })),
          },
        ]
      : labels.map((label) => ({ id: label, label }));
  return (
    <TreeView
      data={data}
      defaultExpandedIds={root && rest.length > 0 ? [root] : undefined}
      aria-label={ariaLabel ?? "Files"}
    />
  );
}
