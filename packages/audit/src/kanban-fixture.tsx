"use client";

import { Kanban, type KanbanColumn } from "@cronus-ui/ui/kanban";
import { useState } from "react";

const FALLBACK_ITEMS = ["Todo", "Ship", "Doing", "Review"];

function slug(value: string): string {
  return value.toLowerCase().replaceAll(/\s+/g, "-");
}

/** Nested `{id, title, items}` columns cannot round-trip through emit. */
function columnsFromItems(items: string[]): KanbanColumn[] {
  const labels = items.length >= 2 ? items : FALLBACK_ITEMS;
  const columns: KanbanColumn[] = [];
  for (let index = 0; index < labels.length; index += 2) {
    const title = labels[index];
    if (!title) continue;
    const card = labels[index + 1];
    const id = slug(title);
    columns.push({
      id,
      title,
      items: card ? [{ id: `${id}-${slug(card)}`, title: card }] : [],
    });
  }
  return columns;
}

/**
 * `onColumnsChange` is required and must not be passed from the server page.
 * React Kanban already emits `data-slot="kanban"` — no extra family wrapper.
 */
export function KanbanFixture({
  items,
  "aria-label": ariaLabel,
}: {
  items?: string[];
  "aria-label"?: string;
}) {
  const [columns, setColumns] = useState(() => columnsFromItems(items ?? []));
  return (
    <Kanban columns={columns} onColumnsChange={setColumns} aria-label={ariaLabel ?? "Board"} />
  );
}
