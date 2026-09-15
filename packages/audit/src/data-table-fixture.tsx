"use client";

import { DataTable } from "@cronus-ui/ui/data-table";

const FALLBACK_ITEMS = ["Name", "Role", "Ada", "Admin", "Linus", "Editor"];

/**
 * Column definitions are objects emit cannot hold, so the fixture carries a flat
 * `items` list the kernel receives as `text` lines too: the first two entries are
 * the column headers, the rest fill two-column rows in order. Both panes then
 * render the same table from the same source.
 */
export function DataTableFixture({ items }: { items?: string[] }) {
  const cells = items && items.length >= 4 ? items : FALLBACK_ITEMS;
  const [nameHeader = "Name", roleHeader = "Role", ...body] = cells;
  const columns = [
    { accessorKey: "name", header: nameHeader },
    { accessorKey: "role", header: roleHeader },
  ];
  const rows: { name: string; role: string }[] = [];
  for (let i = 0; i + 1 < body.length; i += 2) {
    rows.push({ name: body[i] ?? "", role: body[i + 1] ?? "" });
  }
  return <DataTable columns={columns} data={rows} />;
}
