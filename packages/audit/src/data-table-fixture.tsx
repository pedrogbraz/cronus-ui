"use client";

import { DataTable } from "@cronus-ui/ui/data-table";

const ROWS = [
  { name: "Ada", role: "Admin" },
  { name: "Linus", role: "Editor" },
];

const COLUMNS = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];

/** Columns are functions/objects emit cannot hold — extra fixture props are ignored. */
export function DataTableFixture() {
  return <DataTable columns={COLUMNS} data={ROWS} />;
}
