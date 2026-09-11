"use client";

import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Columns3,
  Download,
  PlusCircle,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { type ComponentType, type ReactNode, useId, useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";
import { Input } from "./input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";
import { Skeleton } from "./skeleton.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table.js";

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

/** Cell padding density. `comfortable` matches the historical Table look. */
export type DataTableDensity = "comfortable" | "compact";

/** Option used to build a faceted (multi-select) column filter. */
export interface DataTableFacetOption {
  label: string;
  value: string;
  /** Optional leading icon rendered before the label. */
  icon?: ComponentType<{ className?: string }>;
}

/** Configuration for a single faceted column filter rendered in the toolbar. */
export interface DataTableFacetedFilter {
  /** `id` of the column the filter targets. */
  columnId: string;
  /** Visible button label. */
  title: string;
  options: DataTableFacetOption[];
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  /* ---- Toolbar / global filter (opt-in) ---- */
  /** Show the toolbar with a global search field. */
  searchable?: boolean;
  /** Placeholder for the global search field. Defaults to "Search…". */
  searchPlaceholder?: string;
  /** Controlled global filter value. Implies a controlled toolbar search. */
  globalFilter?: string;
  /** Called when the global filter changes (controlled or uncontrolled). */
  onGlobalFilterChange?: OnChangeFn<string>;
  /** Faceted (multi-select) column filters rendered in the toolbar. */
  facetedFilters?: DataTableFacetedFilter[];
  /** Extra nodes rendered on the left side of the toolbar. */
  toolbarStart?: ReactNode;
  /** Extra nodes rendered on the right side of the toolbar (before the View menu). */
  toolbarEnd?: ReactNode;

  /* ---- Column visibility (opt-in) ---- */
  /** Show the "View" menu that toggles column visibility. */
  enableColumnVisibility?: boolean;
  /** Controlled column visibility state. */
  columnVisibility?: VisibilityState;
  /** Called when column visibility changes. */
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  /* ---- Sorting ---- */
  /** Controlled sorting state. */
  sorting?: SortingState;
  /** Called when sorting changes. */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Server-side sorting: skip the client sort model. */
  manualSorting?: boolean;

  /* ---- Column filtering ---- */
  /** Controlled column filters state. */
  columnFilters?: ColumnFiltersState;
  /** Called when column filters change. */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  /** Server-side filtering: skip the client filter model. */
  manualFiltering?: boolean;

  /* ---- Pagination (opt-in) ---- */
  /** Show the pagination footer. */
  pagination?: boolean;
  /** Controlled pagination state. */
  paginationState?: PaginationState;
  /** Called when pagination changes (controlled). */
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Server-side pagination: provide `pageCount` or `rowCount`. */
  manualPagination?: boolean;
  /** Total page count for server-side pagination. */
  pageCount?: number;
  /** Total row count for server-side pagination (used to derive `pageCount`). */
  rowCount?: number;
  /** Initial page size when uncontrolled. Defaults to 10. */
  initialPageSize?: number;
  /** Page-size options offered in the footer select. Defaults to [10, 20, 30, 50]. */
  pageSizeOptions?: number[];

  /* ---- Row selection (opt-in) ---- */
  /** Render a leading checkbox column with header select-all. */
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  /** Controlled row-selection state. */
  rowSelection?: RowSelectionState;
  /** Called when row selection changes. */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /**
   * Render slot for bulk actions. Receives the currently selected rows; shown
   * in a bar above the table only while at least one row is selected.
   */
  bulkActions?: (rows: Row<TData>[]) => ReactNode;

  /* ---- Density (opt-in) ---- */
  /**
   * Controlled cell padding density. When provided, the toolbar toggle becomes
   * controlled and you must update it via {@link onDensityChange}. Omit it to
   * let the table manage density internally (see {@link initialDensity}).
   */
  density?: DataTableDensity;
  /** Called when the density toggle is pressed (controlled or uncontrolled). */
  onDensityChange?: (density: DataTableDensity) => void;
  /** Initial density when uncontrolled. Defaults to "comfortable". */
  initialDensity?: DataTableDensity;
  /** Show a comfortable/compact density toggle in the toolbar. */
  enableDensityToggle?: boolean;

  /* ---- CSV export (opt-in) ---- */
  /** Show a CSV export button in the toolbar. */
  enableCsvExport?: boolean;
  /** Download file name (without extension). Defaults to "export". */
  csvFileName?: string;

  /* ---- Async states ---- */
  /** Render skeleton rows instead of data. */
  loading?: boolean;
  /** Number of skeleton rows while `loading`. Defaults to the page size or 5. */
  loadingRowCount?: number;
  /** Render an error state with an optional retry button. */
  error?: ReactNode;
  /** Called when the error-state retry button is pressed. */
  onRetry?: () => void;
  /** Custom empty-state content. Defaults to "No results.". */
  emptyState?: ReactNode;

  /** Class applied to the outer wrapper. */
  className?: string;
  /** Accessible label for the toolbar region. Defaults to "Table controls". */
  toolbarLabel?: string;
  /**
   * Override any subset of the built-in UI strings (selection checkbox labels,
   * pagination, empty/loading/retry states…) for localization. Defaults are
   * English; see {@link DataTableLabels}.
   */
  labels?: Partial<DataTableLabels>;
  /**
   * Accessible name for each row-selection checkbox, built from the row data
   * (e.g. `(row) => "Select " + row.original.name`). Takes precedence over
   * `labels.selectRow`. Only applies to the selection column injected by
   * `enableRowSelection`.
   */
  getRowLabel?: (row: Row<TData>) => string;
}

/**
 * Every built-in user-facing string the table renders. Pass any subset via the
 * `labels` prop to localize; omitted keys keep their English defaults.
 * Interpolated strings are builder functions so word order stays free per
 * locale.
 */
export interface DataTableLabels {
  /** `aria-label` of the header select-all checkbox. */
  selectAllRows: string;
  /** `aria-label` of a row checkbox. Receives the zero-based row index. */
  selectRow: (rowIndex: number) => string;
  /** Toolbar button that clears all active filters. */
  reset: string;
  /** Density toggle caption while compact (activating restores comfortable). */
  densityComfortable: string;
  /** Density toggle caption while comfortable (activating switches to compact). */
  densityCompact: string;
  /** Toolbar CSV export button. */
  exportCsv: string;
  /** Column-visibility menu trigger. */
  view: string;
  /** Column-visibility menu heading. */
  toggleColumns: string;
  /** Faceted-filter menu item that clears that filter. */
  clearFilter: string;
  /** `aria-label` of the bulk-actions bar. */
  bulkActions: string;
  /** Bulk-bar summary, e.g. "3 selected". */
  selectedCount: (count: number) => string;
  /** Selection summary under the table, e.g. "1 of 3 row(s) selected." */
  selectedOfTotal: (selected: number, total: number) => string;
  /** Label of the page-size select. */
  rowsPerPage: string;
  /** Visible row range, e.g. "1–10 of 42". */
  rowRange: (first: number, last: number, total: number) => string;
  /** Page position, e.g. "Page 2 of 5". */
  pageOf: (page: number, pageCount: number) => string;
  /** `aria-label` of the pagination nav. */
  pagination: string;
  /** `aria-label` of the first-page button. */
  firstPage: string;
  /** `aria-label` of the previous-page button. */
  previousPage: string;
  /** `aria-label` of the next-page button. */
  nextPage: string;
  /** `aria-label` of the last-page button. */
  lastPage: string;
  /** Default empty-state message (a custom `emptyState` node wins). */
  noResults: string;
  /** Error-state retry button. */
  retry: string;
  /** Polite screen-reader announcement while `loading`. */
  loadingRows: string;
}

/* -------------------------------------------------------------------------------------------------
 * Constants & helpers
 * -----------------------------------------------------------------------------------------------*/

const DENSITY_CELL: Record<DataTableDensity, string> = {
  comfortable: "",
  compact: "py-1.5",
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const DEFAULT_LABELS: DataTableLabels = {
  selectAllRows: "Select all rows on this page",
  // The index makes each row checkbox distinguishable to assistive tech —
  // a page of identical "Select row" names is not navigable by voice or list.
  selectRow: (rowIndex) => `Select row ${rowIndex + 1}`,
  reset: "Reset",
  densityComfortable: "Comfortable",
  densityCompact: "Compact",
  exportCsv: "Export",
  view: "View",
  toggleColumns: "Toggle columns",
  clearFilter: "Clear filter",
  bulkActions: "Bulk actions",
  selectedCount: (count) => `${count} selected`,
  selectedOfTotal: (selected, total) => `${selected} of ${total} row(s) selected.`,
  rowsPerPage: "Rows per page",
  rowRange: (first, last, total) => `${first}–${last} of ${total}`,
  pageOf: (page, pageCount) => `Page ${page} of ${pageCount}`,
  pagination: "Pagination",
  firstPage: "Go to first page",
  previousPage: "Go to previous page",
  nextPage: "Go to next page",
  lastPage: "Go to last page",
  noResults: "No results.",
  retry: "Retry",
  loadingRows: "Loading rows…",
};

/** Reserved column id for the built-in selection checkbox column. */
export const SELECTION_COLUMN_ID = "__select__";

/**
 * Case-insensitive "includes" global filter used by the toolbar search. It is
 * exported so server-side callers can reuse the same matching semantics.
 */
export const fuzzyTextFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (value == null) return false;
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
};

const arrIncludesSomeFilter: FilterFn<unknown> = (row, columnId, filterValue) => {
  const selected = filterValue as string[];
  if (!selected?.length) return true;
  return selected.includes(String(row.getValue(columnId)));
};

/**
 * Resolve the effective TanStack column id for a `ColumnDef`, mirroring
 * table-core's own derivation: explicit `id`, else `accessorKey` (with `.`
 * normalised to `_`), else a string `header`. Used to match a column to a
 * faceted-filter `columnId` so we can attach the correct multi-select filterFn.
 */
function resolveColumnDefId<TData, TValue>(column: ColumnDef<TData, TValue>): string | undefined {
  if (column.id != null) return column.id;
  const accessorKey = (column as { accessorKey?: string | number }).accessorKey;
  if (accessorKey != null) return String(accessorKey).replace(/\./g, "_");
  if (typeof column.header === "string") return column.header;
  return undefined;
}

/** Labels for the checkbox column built by {@link createSelectionColumn}. */
export interface DataTableSelectionColumnOptions<TData> {
  /** `aria-label` of the header select-all checkbox. */
  selectAllLabel?: string;
  /**
   * `aria-label` of each row checkbox. Defaults to "Select row {n}" (1-based)
   * so every checkbox has a distinguishable accessible name.
   */
  getRowLabel?: (row: Row<TData>) => string;
}

/**
 * Build the leading checkbox selection column. Exposed so callers who supply
 * their own `columns` can prepend an identical, accessible selection column
 * instead of relying on `enableRowSelection` injection.
 */
export function createSelectionColumn<TData>(
  options: DataTableSelectionColumnOptions<TData> = {},
): ColumnDef<TData, unknown> {
  const {
    selectAllLabel = DEFAULT_LABELS.selectAllRows,
    getRowLabel = (row: Row<TData>) => DEFAULT_LABELS.selectRow(row.index),
  } = options;
  return {
    id: SELECTION_COLUMN_ID,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected();
      const some = table.getIsSomePageRowsSelected();
      return (
        <Checkbox
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
          aria-label={selectAllLabel}
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label={getRowLabel(row)}
      />
    ),
  };
}

/** Convert the visible (filtered/sorted) rows of a table to a CSV string. */
export function tableRowsToCsv<TData>(table: TanstackTable<TData>): string {
  const visibleLeafColumns = table
    .getVisibleLeafColumns()
    .filter((c) => c.id !== SELECTION_COLUMN_ID);

  const escapeCell = (value: unknown): string => {
    let str = value == null ? "" : String(value);
    // CSV-injection (formula injection) neutralisation: a leading =, +, -, @,
    // tab, or carriage return makes Excel/Sheets treat the cell as a formula and
    // execute it on open. Prefix such values with a single apostrophe so the
    // spreadsheet renders them as literal text. This intentionally also prefixes
    // negative numbers (leading `-`) — the accepted, standard tradeoff for safety.
    if (/^[=+\-@\t\r]/.test(str)) str = `'${str}`;
    // Quote per RFC 4180 when the value contains a comma, double-quote, or any
    // line break (LF *or* CR — an unquoted CR also breaks row boundaries).
    return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const header = visibleLeafColumns
    .map((c) => {
      const raw = c.columnDef.header;
      return escapeCell(typeof raw === "string" ? raw : c.id);
    })
    .join(",");

  const selected = table.getFilteredSelectedRowModel().rows;
  const source = selected.length ? selected : table.getFilteredRowModel().rows;

  const body = source
    .map((row) => visibleLeafColumns.map((c) => escapeCell(row.getValue(c.id))).join(","))
    .join("\n");

  return `${header}\n${body}`;
}

function downloadCsv(csv: string, fileName: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------------------------------------
 * DataTableColumnHeader — sortable header with affordance icon
 * -----------------------------------------------------------------------------------------------*/

/**
 * `aria-label` builders for the sort button, one per sort state. Pass any
 * subset to localize; each receives the column title.
 */
export interface DataTableColumnHeaderLabels {
  /** Unsorted — activation sorts ascending. */
  sort: (title: string) => string;
  /** Sorted ascending — activation sorts descending. */
  sortedAscending: (title: string) => string;
  /** Sorted descending — activation re-sorts ascending (never clears). */
  sortedDescending: (title: string) => string;
}

const DEFAULT_HEADER_LABELS: DataTableColumnHeaderLabels = {
  sort: (title) => `Sort by ${title}. Activate to sort ascending.`,
  sortedAscending: (title) => `Sorted by ${title} ascending. Activate to sort descending.`,
  sortedDescending: (title) => `Sorted by ${title} descending. Activate to sort ascending.`,
};

export interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
  /** Localize the sort-button `aria-label`s. See {@link DataTableColumnHeaderLabels}. */
  labels?: Partial<DataTableColumnHeaderLabels>;
}

/**
 * Sortable header cell with a sort-state icon. Falls back to plain text when
 * the column cannot sort, so it is safe to use everywhere.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  labels,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <span
        data-slot="data-table-column-header"
        className={cn("font-medium text-fg-secondary", className)}
      >
        {title}
      </span>
    );
  }

  const sorted = column.getIsSorted();
  const mergedLabels: DataTableColumnHeaderLabels = { ...DEFAULT_HEADER_LABELS, ...labels };

  return (
    <Button
      variant="ghost"
      size="sm"
      data-slot="data-table-column-header"
      // `toggleSorting` receives an explicit direction, so table-core's
      // remove-sort branch (taken only when no manual value is passed) never
      // runs: the real cycle is unsorted → ascending → descending → ascending,
      // forever. The labels below promise exactly that — nothing more.
      onClick={() => column.toggleSorting(sorted === "asc")}
      aria-label={
        sorted === "asc"
          ? mergedLabels.sortedAscending(title)
          : sorted === "desc"
            ? mergedLabels.sortedDescending(title)
            : mergedLabels.sort(title)
      }
      className="-ms-3 h-8 text-fg-secondary data-[state=open]:bg-surface-overlay"
    >
      <span>{title}</span>
      {sorted === "asc" ? (
        <ArrowUp aria-hidden />
      ) : sorted === "desc" ? (
        <ArrowDown aria-hidden />
      ) : (
        <ChevronsUpDown aria-hidden className="opacity-60" />
      )}
    </Button>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Faceted filter (opt-in)
 * -----------------------------------------------------------------------------------------------*/

function DataTableFacetedFilterControl<TData>({
  column,
  title,
  options,
  clearFilterLabel,
}: {
  column: Column<TData, unknown> | undefined;
  title: string;
  options: DataTableFacetOption[];
  clearFilterLabel: string;
}) {
  const facets = column?.getFacetedUniqueValues();
  const selected = new Set((column?.getFilterValue() as string[] | undefined) ?? []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-slot="data-table-faceted-filter"
          className="border-dashed"
        >
          <PlusCircle aria-hidden />
          {title}
          {selected.size > 0 ? (
            <>
              <span className="mx-1 h-4 w-px bg-border" aria-hidden />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {selected.size}
              </Badge>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[12rem]">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const isSelected = selected.has(option.value);
          const Icon = option.icon;
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={() => {
                const next = new Set(selected);
                if (isSelected) next.delete(option.value);
                else next.add(option.value);
                const values = Array.from(next);
                column?.setFilterValue(values.length ? values : undefined);
              }}
            >
              {Icon ? <Icon className="size-4 text-fg-tertiary" /> : null}
              <span>{option.label}</span>
              {facets?.get(option.value) ? (
                <span className="ms-auto text-xs text-fg-tertiary">{facets.get(option.value)}</span>
              ) : null}
            </DropdownMenuCheckboxItem>
          );
        })}
        {selected.size > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => column?.setFilterValue(undefined)}
              className="justify-center"
            >
              {clearFilterLabel}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Toolbar (opt-in)
 * -----------------------------------------------------------------------------------------------*/

interface DataTableToolbarProps<TData> {
  table: TanstackTable<TData>;
  label: string;
  labels: DataTableLabels;
  searchable: boolean;
  searchPlaceholder: string;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  facetedFilters?: DataTableFacetedFilter[];
  enableColumnVisibility: boolean;
  density: DataTableDensity;
  enableDensityToggle: boolean;
  onDensityChange: (density: DataTableDensity) => void;
  enableCsvExport: boolean;
  onExportCsv: () => void;
  toolbarStart?: ReactNode;
  toolbarEnd?: ReactNode;
}

function DataTableToolbar<TData>({
  table,
  label,
  labels,
  searchable,
  searchPlaceholder,
  globalFilter,
  onGlobalFilterChange,
  facetedFilters,
  enableColumnVisibility,
  density,
  enableDensityToggle,
  onDensityChange,
  enableCsvExport,
  onExportCsv,
  toolbarStart,
  toolbarEnd,
}: DataTableToolbarProps<TData>) {
  const searchId = useId();
  const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0;

  return (
    // `role="group"` (not "toolbar"): a toolbar carries a WAI-ARIA keyboard
    // contract (roving tabindex + arrow-key navigation) we don't implement.
    // A labelled group is honest — it names the region for assistive tech while
    // leaving each control individually tabbable, which is the expected and
    // accessible behaviour here. <fieldset> (the rule's suggestion) is wrong:
    // these are toolbar controls, not grouped form fields with a <legend>.
    // biome-ignore lint/a11y/useSemanticElements: a group of toolbar controls is not a <fieldset>.
    <div
      role="group"
      aria-label={label}
      data-slot="data-table-toolbar"
      className="flex flex-wrap items-center gap-2"
    >
      {toolbarStart}

      {searchable ? (
        <div className="relative w-full max-w-[16rem]">
          <Search
            aria-hidden
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
          />
          <label htmlFor={searchId} className="sr-only">
            {searchPlaceholder}
          </label>
          <Input
            id={searchId}
            type="search"
            value={globalFilter}
            onChange={(event) => onGlobalFilterChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 ps-9"
          />
        </div>
      ) : null}

      {facetedFilters?.map((filter) => (
        <DataTableFacetedFilterControl
          key={filter.columnId}
          column={table.getColumn(filter.columnId)}
          title={filter.title}
          options={filter.options}
          clearFilterLabel={labels.clearFilter}
        />
      ))}

      {isFiltered ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            table.resetColumnFilters();
            onGlobalFilterChange("");
          }}
        >
          {labels.reset}
          <X aria-hidden />
        </Button>
      ) : null}

      <div className="ms-auto flex items-center gap-2">
        {toolbarEnd}

        {enableDensityToggle ? (
          <Button
            variant="outline"
            size="sm"
            aria-pressed={density === "compact"}
            onClick={() => onDensityChange(density === "compact" ? "comfortable" : "compact")}
          >
            <SlidersHorizontal aria-hidden />
            {density === "compact" ? labels.densityComfortable : labels.densityCompact}
          </Button>
        ) : null}

        {enableCsvExport ? (
          <Button variant="outline" size="sm" onClick={onExportCsv}>
            <Download aria-hidden />
            {labels.exportCsv}
          </Button>
        ) : null}

        {enableColumnVisibility ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3 aria-hidden />
                {labels.view}
                <ChevronDown aria-hidden className="opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              <DropdownMenuLabel>{labels.toggleColumns}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onSelect={(event) => event.preventDefault()}
                    onCheckedChange={(value) => column.toggleVisibility(value === true)}
                    className="capitalize"
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Pagination footer (opt-in)
 * -----------------------------------------------------------------------------------------------*/

function DataTablePagination<TData>({
  table,
  pageSizeOptions,
  labels,
}: {
  table: TanstackTable<TData>;
  pageSizeOptions: number[];
  labels: DataTableLabels;
}) {
  const pageSizeId = useId();
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getRowCount();
  const pageCount = table.getPageCount();

  const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      data-slot="data-table-pagination"
      className="flex flex-wrap items-center justify-between gap-4 px-1 py-2"
    >
      <p className="text-sm text-fg-tertiary" aria-live="polite">
        {labels.rowRange(firstRow, lastRow, totalRows)}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor={pageSizeId} className="text-sm text-fg-secondary">
            {labels.rowsPerPage}
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger id={pageSizeId} className="h-8 w-[4.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-fg-secondary">
          {labels.pageOf(pageCount === 0 ? 0 : pageIndex + 1, pageCount)}
        </p>

        <nav aria-label={labels.pagination} className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label={labels.firstPage}
          >
            <ChevronsLeft aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={labels.previousPage}
          >
            <ChevronLeft aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={labels.nextPage}
          >
            <ChevronRight aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label={labels.lastPage}
          >
            <ChevronsRight aria-hidden />
          </Button>
        </nav>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * DataTable
 * -----------------------------------------------------------------------------------------------*/

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns,
    data,
    searchable = false,
    searchPlaceholder = "Search…",
    globalFilter: globalFilterProp,
    onGlobalFilterChange,
    facetedFilters,
    toolbarStart,
    toolbarEnd,
    enableColumnVisibility = false,
    columnVisibility: columnVisibilityProp,
    onColumnVisibilityChange,
    sorting: sortingProp,
    onSortingChange,
    manualSorting,
    columnFilters: columnFiltersProp,
    onColumnFiltersChange,
    manualFiltering,
    pagination = false,
    paginationState: paginationProp,
    onPaginationChange,
    manualPagination,
    pageCount,
    rowCount,
    initialPageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    enableRowSelection,
    rowSelection: rowSelectionProp,
    onRowSelectionChange,
    bulkActions,
    density: densityProp,
    onDensityChange,
    initialDensity = "comfortable",
    enableDensityToggle = false,
    enableCsvExport = false,
    csvFileName = "export",
    loading = false,
    loadingRowCount,
    error,
    onRetry,
    emptyState,
    className,
    toolbarLabel = "Table controls",
    labels: labelsProp,
    getRowLabel,
  } = props;

  const labels = useMemo<DataTableLabels>(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp],
  );

  /* ---- Uncontrolled fallbacks (only used when the matching prop is absent) ---- */
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [columnFiltersState, setColumnFiltersState] = useState<ColumnFiltersState>([]);
  const [globalFilterState, setGlobalFilterState] = useState("");
  const [columnVisibilityState, setColumnVisibilityState] = useState<VisibilityState>({});
  const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({});
  const [paginationStateInternal, setPaginationStateInternal] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [densityState, setDensityState] = useState<DataTableDensity>(initialDensity);

  const sorting = sortingProp ?? sortingState;
  const columnFilters = columnFiltersProp ?? columnFiltersState;
  const globalFilter = globalFilterProp ?? globalFilterState;
  const columnVisibility = columnVisibilityProp ?? columnVisibilityState;
  const rowSelection = rowSelectionProp ?? rowSelectionState;
  const paginationStateValue = paginationProp ?? paginationStateInternal;
  const density = densityProp ?? densityState;

  const selectionEnabled = Boolean(enableRowSelection);

  /* ---- Compose columns ---- *
   * 1. For every faceted-filter target, guarantee `filterFn: "arrIncludesSome"`
   *    when the author hasn't set one. The toolbar control writes an array of
   *    selected values; without this, table-core's `auto` filterFn resolves to
   *    `includesString` for string columns, which coerces the array via
   *    `toString()` ("active,invited") and filters every row out once 2+ values
   *    are selected. We only override the default ("auto"), never an explicit
   *    author choice, so this is backward-compatible.
   * 2. Prepend the selection column when row selection is enabled.
   */
  const facetedColumnIds = useMemo(
    () => new Set((facetedFilters ?? []).map((f) => f.columnId)),
    [facetedFilters],
  );

  const resolvedColumns = useMemo<ColumnDef<TData, TValue>[]>(() => {
    const withFacetFilterFn =
      facetedColumnIds.size === 0
        ? columns
        : columns.map((column) => {
            if (column.filterFn != null && column.filterFn !== "auto") return column;
            const id = resolveColumnDefId(column);
            if (id == null || !facetedColumnIds.has(id)) return column;
            return { ...column, filterFn: "arrIncludesSome" as const };
          });

    if (!selectionEnabled) return withFacetFilterFn;
    const selectionColumn = createSelectionColumn<TData>({
      selectAllLabel: labels.selectAllRows,
      getRowLabel: getRowLabel ?? ((row) => labels.selectRow(row.index)),
    });
    return [selectionColumn as ColumnDef<TData, TValue>, ...withFacetFilterFn];
  }, [columns, facetedColumnIds, selectionEnabled, labels, getRowLabel]);

  /* ---- Feature detection: only wire optional models/state when used ---- */
  const filteringEnabled =
    searchable || Boolean(facetedFilters?.length) || Boolean(columnFiltersProp);
  const paginationEnabled = pagination || Boolean(manualPagination);

  const derivedPageCount =
    pageCount ??
    (rowCount != null
      ? Math.max(1, Math.ceil(rowCount / Math.max(1, paginationStateValue.pageSize)))
      : undefined);

  const table = useReactTable<TData>({
    data,
    columns: resolvedColumns,
    state: {
      sorting,
      ...(filteringEnabled ? { columnFilters, globalFilter } : {}),
      ...(enableColumnVisibility ? { columnVisibility } : {}),
      ...(selectionEnabled ? { rowSelection } : {}),
      ...(paginationEnabled ? { pagination: paginationStateValue } : {}),
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: onSortingChange ?? setSortingState,
    manualSorting,

    ...(filteringEnabled
      ? {
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
          onColumnFiltersChange: onColumnFiltersChange ?? setColumnFiltersState,
          onGlobalFilterChange: onGlobalFilterChange ?? setGlobalFilterState,
          globalFilterFn: fuzzyTextFilter as FilterFn<TData>,
          manualFiltering,
        }
      : {}),

    ...(enableColumnVisibility
      ? { onColumnVisibilityChange: onColumnVisibilityChange ?? setColumnVisibilityState }
      : {}),

    ...(selectionEnabled
      ? {
          enableRowSelection,
          onRowSelectionChange: onRowSelectionChange ?? setRowSelectionState,
        }
      : {}),

    ...(paginationEnabled
      ? {
          onPaginationChange: onPaginationChange ?? setPaginationStateInternal,
          manualPagination,
          ...(manualPagination
            ? { pageCount: derivedPageCount, rowCount }
            : { getPaginationRowModel: getPaginationRowModel() }),
        }
      : {}),

    filterFns: { arrIncludesSome: arrIncludesSomeFilter as FilterFn<TData> },
  });

  /* ---- Derived render state ---- */
  const showToolbar =
    searchable ||
    Boolean(facetedFilters?.length) ||
    enableColumnVisibility ||
    enableDensityToggle ||
    enableCsvExport ||
    Boolean(toolbarStart) ||
    Boolean(toolbarEnd);

  const rows = table.getRowModel().rows;
  const colSpan = resolvedColumns.length || 1;
  const densityClass = DENSITY_CELL[density];

  const selectedRows = selectionEnabled ? table.getFilteredSelectedRowModel().rows : [];
  const skeletonRows = loadingRowCount ?? (paginationEnabled ? paginationStateValue.pageSize : 5);

  return (
    <div data-slot="data-table" className={cn("flex flex-col gap-3", className)}>
      {showToolbar ? (
        <DataTableToolbar
          table={table}
          label={toolbarLabel}
          labels={labels}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          globalFilter={globalFilter}
          onGlobalFilterChange={(value) => (onGlobalFilterChange ?? setGlobalFilterState)(value)}
          {...(facetedFilters ? { facetedFilters } : {})}
          enableColumnVisibility={enableColumnVisibility}
          density={density}
          enableDensityToggle={enableDensityToggle}
          onDensityChange={(value) => {
            // Uncontrolled: drive internal state. Controlled (`density` set):
            // leave state alone so the prop stays the single source of truth.
            if (densityProp == null) setDensityState(value);
            onDensityChange?.(value);
          }}
          enableCsvExport={enableCsvExport}
          onExportCsv={() => downloadCsv(tableRowsToCsv(table), csvFileName)}
          {...(toolbarStart ? { toolbarStart } : {})}
          {...(toolbarEnd ? { toolbarEnd } : {})}
        />
      ) : null}

      {selectionEnabled && bulkActions && selectedRows.length > 0 ? (
        <section
          aria-label={labels.bulkActions}
          data-slot="data-table-bulk-actions"
          className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-inset px-3 py-2"
        >
          <span className="text-sm text-fg-secondary" aria-live="polite">
            {labels.selectedCount(selectedRows.length)}
          </span>
          <div className="ms-auto flex items-center gap-2">{bulkActions(selectedRows)}</div>
        </section>
      ) : null}

      <div
        data-slot="data-table-container"
        // The whole table region is "busy" while skeleton rows stand in for
        // data, so assistive tech knows the content is not final yet.
        aria-busy={loading || undefined}
        className="overflow-hidden rounded-xl border border-border"
      >
        {loading ? (
          // The skeletons themselves are aria-hidden; this polite status is
          // the only thing screen readers hear while rows load.
          <span role="status" data-slot="data-table-loading" className="sr-only">
            {labels.loadingRows}
          </span>
        ) : null}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortable = !header.isPlaceholder && header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      // WAI-ARIA sort pattern: sortable columns always expose
                      // their sort state; non-sortable ones omit the attribute.
                      aria-sort={
                        sortable
                          ? sorted === "asc"
                            ? "ascending"
                            : sorted === "desc"
                              ? "descending"
                              : "none"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity.
                <TableRow key={`skeleton-${rowIndex}`}>
                  {resolvedColumns.map((_column, cellIndex) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity.
                    <TableCell key={`skeleton-cell-${cellIndex}`} className={densityClass}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error != null ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-fg-secondary">
                    <AlertCircle aria-hidden className="size-6 text-error" />
                    <div role="alert" className="text-sm">
                      {error}
                    </div>
                    {onRetry ? (
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        <RefreshCw aria-hidden />
                        {labels.retry}
                      </Button>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={densityClass}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan} className="h-24 text-center text-fg-tertiary">
                  {emptyState ?? labels.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationEnabled && !loading && error == null ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {selectionEnabled ? (
            <p className="text-sm text-fg-tertiary" aria-live="polite">
              {labels.selectedOfTotal(selectedRows.length, table.getFilteredRowModel().rows.length)}
            </p>
          ) : (
            <span />
          )}
          <div className="ms-auto">
            <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} labels={labels} />
          </div>
        </div>
      ) : selectionEnabled && !loading && error == null ? (
        <p className="text-sm text-fg-tertiary" aria-live="polite">
          {labels.selectedOfTotal(selectedRows.length, table.getFilteredRowModel().rows.length)}
        </p>
      ) : null}
    </div>
  );
}
