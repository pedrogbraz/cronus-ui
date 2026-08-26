import type { ColumnDef } from "@tanstack/react-table";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  DataTable,
  DataTableColumnHeader,
  fuzzyTextFilter,
  SELECTION_COLUMN_ID,
  tableRowsToCsv,
} from "./data-table.js";

interface Person {
  id: number;
  name: string;
  email: string;
  amount: number;
}

const DATA: Person[] = [
  { id: 1, name: "Charlie", email: "charlie@kronus.com", amount: 30 },
  { id: 2, name: "Alice", email: "alice@kronus.com", amount: 10 },
  { id: 3, name: "Bob", email: "bob@kronus.com", amount: 20 },
];

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => row.original.name,
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount" },
];

/** Read the body rows' first data column (Name) in DOM order. */
function nameColumnOrder(): string[] {
  const rows = screen.getAllByRole("row").slice(1); // drop the header row
  return rows
    .map((r) => within(r).queryAllByRole("cell")[0]?.textContent ?? "")
    .filter((t) => t === "Alice" || t === "Bob" || t === "Charlie");
}

describe("DataTable — rendering", () => {
  it("renders the column headers", () => {
    render(<DataTable columns={columns} data={DATA} />);
    expect(screen.getByRole("columnheader", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Amount" })).toBeInTheDocument();
  });

  it("renders one body row per record", () => {
    render(<DataTable columns={columns} data={DATA} />);
    // 1 header row + 3 data rows.
    expect(screen.getAllByRole("row")).toHaveLength(4);
    expect(screen.getByRole("cell", { name: "alice@kronus.com" })).toBeInTheDocument();
  });

  it("shows the empty state when there is no data", () => {
    render(<DataTable columns={columns} data={[]} emptyState="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders an error state with a retry button", () => {
    render(<DataTable columns={columns} data={[]} error="Failed to load" onRetry={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load");
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});

describe("DataTable — sorting", () => {
  it("toggles ascending order when a sortable header is activated", async () => {
    render(<DataTable columns={columns} data={DATA} />);
    expect(nameColumnOrder()).toEqual(["Charlie", "Alice", "Bob"]);
    await userEvent.click(screen.getByRole("button", { name: /sort by name/i }));
    expect(nameColumnOrder()).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("reverses to descending on a second activation and updates the header label", async () => {
    render(<DataTable columns={columns} data={DATA} />);
    await userEvent.click(screen.getByRole("button", { name: /sort by name/i }));
    // After ascending, the accessible name advertises the next action (descending).
    const ascHeader = screen.getByRole("button", { name: /sorted by name ascending/i });
    await userEvent.click(ascHeader);
    expect(nameColumnOrder()).toEqual(["Charlie", "Bob", "Alice"]);
    expect(screen.getByRole("button", { name: /sorted by name descending/i })).toBeInTheDocument();
  });

  it("cycles aria-sort through none → ascending → descending → ascending", async () => {
    render(<DataTable columns={columns} data={DATA} />);
    const header = () => screen.getByRole("columnheader", { name: /name/i });
    const sortButton = () => within(header()).getByRole("button");

    expect(header()).toHaveAttribute("aria-sort", "none");
    await userEvent.click(sortButton());
    expect(header()).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(sortButton());
    expect(header()).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(sortButton());
    expect(header()).toHaveAttribute("aria-sort", "ascending");
  });

  it("marks header cells with scope=col and omits aria-sort on non-sortable columns", () => {
    render(<DataTable columns={columns} data={DATA} enableRowSelection />);
    const selectionHeader = screen.getByRole("columnheader", { name: /select all rows/i });
    expect(selectionHeader).toHaveAttribute("scope", "col");
    expect(selectionHeader).not.toHaveAttribute("aria-sort");
    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute("scope", "col");
  });

  it("advertises the true next action for every sort state", async () => {
    render(<DataTable columns={columns} data={DATA} />);
    // Unsorted: activation sorts ascending.
    const unsorted = screen.getByRole("button", {
      name: "Sort by Name. Activate to sort ascending.",
    });
    await userEvent.click(unsorted);
    // Ascending: activation sorts descending.
    const asc = screen.getByRole("button", {
      name: "Sorted by Name ascending. Activate to sort descending.",
    });
    await userEvent.click(asc);
    // Descending: activation re-sorts ascending (toggleSorting with an explicit
    // direction never clears the sort), and the label must say so.
    const desc = screen.getByRole("button", {
      name: "Sorted by Name descending. Activate to sort ascending.",
    });
    await userEvent.click(desc);
    expect(nameColumnOrder()).toEqual(["Alice", "Bob", "Charlie"]);
    expect(
      screen.getByRole("button", {
        name: "Sorted by Name ascending. Activate to sort descending.",
      }),
    ).toBeInTheDocument();
  });
});

describe("DataTable — search / filter", () => {
  it("narrows the visible rows to matches of the global search", async () => {
    render(<DataTable columns={columns} data={DATA} searchable />);
    expect(nameColumnOrder()).toHaveLength(3);
    const search = screen.getByRole("searchbox");
    await userEvent.type(search, "ali");
    expect(nameColumnOrder()).toEqual(["Alice"]);
  });

  it("restores all rows when the search is cleared", async () => {
    render(<DataTable columns={columns} data={DATA} searchable />);
    const search = screen.getByRole("searchbox");
    await userEvent.type(search, "bob");
    expect(nameColumnOrder()).toEqual(["Bob"]);
    await userEvent.clear(search);
    expect(nameColumnOrder()).toHaveLength(3);
  });
});

describe("DataTable — row selection", () => {
  it("prepends a selection column with a header select-all checkbox", () => {
    render(<DataTable columns={columns} data={DATA} enableRowSelection />);
    expect(
      screen.getByRole("checkbox", { name: /select all rows on this page/i }),
    ).toBeInTheDocument();
    // One select-all + one per row.
    expect(screen.getAllByRole("checkbox", { name: /select row/i })).toHaveLength(3);
  });

  it("toggles a single row and reports the selected count", async () => {
    render(<DataTable columns={columns} data={DATA} enableRowSelection />);
    const [firstRowCheckbox] = screen.getAllByRole("checkbox", { name: /select row/i });
    await userEvent.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();
    expect(screen.getByText(/1 of 3 row\(s\) selected/i)).toBeInTheDocument();
  });

  it("select-all toggles every row and shows the bulk-actions bar", async () => {
    render(
      <DataTable
        columns={columns}
        data={DATA}
        enableRowSelection
        bulkActions={(rows) => <button type="button">Delete {rows.length}</button>}
      />,
    );
    await userEvent.click(screen.getByRole("checkbox", { name: /select all rows on this page/i }));
    for (const cb of screen.getAllByRole("checkbox", { name: /select row/i })) {
      expect(cb).toBeChecked();
    }
    const bulkBar = screen.getByRole("region", { name: "Bulk actions" });
    expect(within(bulkBar).getByText("3 selected")).toBeInTheDocument();
    expect(within(bulkBar).getByRole("button", { name: "Delete 3" })).toBeInTheDocument();
  });
});

describe("DataTable — pagination", () => {
  const many: Person[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Person ${String.fromCharCode(65 + i)}`,
    email: `p${i}@kronus.com`,
    amount: i,
  }));

  it("limits rows to the page size and disables previous on the first page", () => {
    render(<DataTable columns={columns} data={many} pagination initialPageSize={5} />);
    // header + 5 data rows.
    expect(screen.getAllByRole("row")).toHaveLength(6);
    expect(screen.getByRole("button", { name: /go to previous page/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /go to next page/i })).toBeEnabled();
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
  });

  it("advances to the next page and disables next on the last page", async () => {
    render(<DataTable columns={columns} data={many} pagination initialPageSize={5} />);
    await userEvent.click(screen.getByRole("button", { name: /go to next page/i }));
    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to previous page/i })).toBeEnabled();
    await userEvent.click(screen.getByRole("button", { name: /go to last page/i }));
    expect(screen.getByText(/page 3 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to next page/i })).toBeDisabled();
  });
});

describe("DataTable — loading", () => {
  it("announces loading politely and marks the table region busy", () => {
    const { container } = render(<DataTable columns={columns} data={[]} loading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading rows…");
    expect(container.querySelector('[data-slot="data-table-container"]')).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("clears the announcement and busy state once loading finishes", () => {
    const { container, rerender } = render(<DataTable columns={columns} data={DATA} loading />);
    rerender(<DataTable columns={columns} data={DATA} />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-container"]')).not.toHaveAttribute(
      "aria-busy",
    );
  });
});

describe("DataTable — labels", () => {
  it("names row checkboxes by index so they are distinguishable", () => {
    render(<DataTable columns={columns} data={DATA} enableRowSelection />);
    expect(screen.getByRole("checkbox", { name: "Select row 1" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Select row 3" })).toBeInTheDocument();
  });

  it("getRowLabel names row checkboxes from the row data", () => {
    render(
      <DataTable
        columns={columns}
        data={DATA}
        enableRowSelection
        getRowLabel={(row) => `Select ${row.original.name}`}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Select Alice" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Select Charlie" })).toBeInTheDocument();
  });

  it("labels prop overrides the built-in strings", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        pagination
        enableRowSelection
        labels={{
          noResults: "Nada encontrado.",
          rowsPerPage: "Linhas por página",
          pagination: "Paginação",
          nextPage: "Próxima página",
          pageOf: (page, pageCount) => `Página ${page} de ${pageCount}`,
          selectedOfTotal: (selected, total) => `${selected} de ${total} linha(s) selecionada(s).`,
        }}
      />,
    );
    expect(screen.getByText("Nada encontrado.")).toBeInTheDocument();
    expect(screen.getByText("Linhas por página")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Paginação" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Próxima página" })).toBeInTheDocument();
    expect(screen.getByText("Página 0 de 0")).toBeInTheDocument();
    expect(screen.getByText("0 de 0 linha(s) selecionada(s).")).toBeInTheDocument();
  });

  it("labels prop localizes the selection checkboxes", () => {
    render(
      <DataTable
        columns={columns}
        data={DATA}
        enableRowSelection
        labels={{
          selectAllRows: "Selecionar todas as linhas",
          selectRow: (rowIndex) => `Selecionar linha ${rowIndex + 1}`,
        }}
      />,
    );
    expect(
      screen.getByRole("checkbox", { name: "Selecionar todas as linhas" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Selecionar linha 2" })).toBeInTheDocument();
  });

  it("labels prop localizes the loading announcement", () => {
    render(
      <DataTable columns={columns} data={[]} loading labels={{ loadingRows: "Carregando…" }} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Carregando…");
  });
});

describe("DataTable — helpers", () => {
  it("fuzzyTextFilter matches case-insensitively", () => {
    const row = { getValue: () => "Kronus Checkout" } as never;
    expect(fuzzyTextFilter(row, "name", "checkout", () => {})).toBe(true);
    expect(fuzzyTextFilter(row, "name", "stripe", () => {})).toBe(false);
  });

  it("exposes a stable selection column id", () => {
    expect(SELECTION_COLUMN_ID).toBe("__select__");
  });

  it("tableRowsToCsv is exported for server-side reuse", () => {
    expect(typeof tableRowsToCsv).toBe("function");
  });
});

describe("DataTable — a11y", () => {
  it("has no axe violations for a plain table", async () => {
    const { container } = render(<DataTable columns={columns} data={DATA} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with search + selection enabled", async () => {
    const { container } = render(
      <DataTable columns={columns} data={DATA} searchable enableRowSelection />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations while loading", async () => {
    const { container } = render(<DataTable columns={columns} data={[]} loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
