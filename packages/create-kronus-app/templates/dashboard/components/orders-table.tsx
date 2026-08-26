"use client";

import { Badge } from "@kronus-ui/ui/badge";
import { Card, CardHeader, CardTitle } from "@kronus-ui/ui/card";
import { DataTable, DataTableColumnHeader } from "@kronus-ui/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

interface Order {
  id: string;
  customer: string;
  email: string;
  status: "Paid" | "Pending" | "Refunded";
  amount: number;
}

const STATUS_VARIANT = {
  Paid: "success",
  Pending: "warning",
  Refunded: "secondary",
} as const;

const ORDERS: Order[] = [
  {
    id: "INV-2048",
    customer: "Mara Castillo",
    email: "mara@northwind.io",
    status: "Paid",
    amount: 1290,
  },
  {
    id: "INV-2047",
    customer: "Devon Lane",
    email: "devon@acme.dev",
    status: "Pending",
    amount: 640,
  },
  {
    id: "INV-2046",
    customer: "Priya Sharma",
    email: "priya@lumon.co",
    status: "Paid",
    amount: 2180,
  },
  {
    id: "INV-2045",
    customer: "Tobias Funke",
    email: "tobias@bluth.com",
    status: "Refunded",
    amount: 320,
  },
  { id: "INV-2044", customer: "Aiko Tanaka", email: "aiko@hooli.com", status: "Paid", amount: 990 },
  {
    id: "INV-2043",
    customer: "Jonas Berg",
    email: "jonas@fathom.dev",
    status: "Paid",
    amount: 1475,
  },
  {
    id: "INV-2042",
    customer: "Sofia Lindqvist",
    email: "sofia@driftwood.se",
    status: "Pending",
    amount: 210,
  },
  {
    id: "INV-2041",
    customer: "David Chen",
    email: "david@parallel.io",
    status: "Paid",
    amount: 3120,
  },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const COLUMNS: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
    cell: ({ row }) => <span className="font-medium text-fg">{row.original.id}</span>,
  },
  {
    accessorKey: "customer",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-fg">{row.original.customer}</span>
        <span className="truncate text-xs text-fg-tertiary">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" className="justify-end" />
    ),
    cell: ({ row }) => (
      <span className="block text-right font-medium tabular-nums text-fg">
        {currency.format(row.original.amount)}
      </span>
    ),
  },
];

/** Recent orders in a searchable, sortable, paginated `DataTable`. */
export function OrdersTable() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="px-6 py-5">
        <CardTitle className="font-display text-base">Recent orders</CardTitle>
        <p className="text-sm text-fg-secondary">Latest invoices and payments</p>
      </CardHeader>
      <DataTable
        columns={COLUMNS}
        data={ORDERS}
        searchable
        searchPlaceholder="Search orders…"
        pagination
        initialPageSize={5}
        className="px-6 pb-6"
      />
    </Card>
  );
}
