import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Kanban, type KanbanColumn } from "./kanban.js";

const COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "A fazer",
    items: [
      { id: "t1", title: "Configurar checkout", description: "Habilitar boleto" },
      { id: "t2", title: "Revisar repasse" },
    ],
  },
  {
    id: "doing",
    title: "Em andamento",
    items: [{ id: "d1", title: "Migrar tokens" }],
  },
];

/** Find a column section by its accessible name. */
function column(name: string): HTMLElement {
  return screen.getByRole("region", { name });
}

describe("Kanban", () => {
  it("renders every column with its title", () => {
    render(<Kanban columns={COLUMNS} onColumnsChange={() => {}} />);
    expect(column("A fazer")).toBeInTheDocument();
    expect(column("Em andamento")).toBeInTheDocument();
  });

  it("renders an item-count badge per column", () => {
    render(<Kanban columns={COLUMNS} onColumnsChange={() => {}} />);
    expect(within(column("A fazer")).getByText("2")).toBeInTheDocument();
    expect(within(column("Em andamento")).getByText("1")).toBeInTheDocument();
  });

  it("renders each item inside its own column", () => {
    render(<Kanban columns={COLUMNS} onColumnsChange={() => {}} />);
    const todo = column("A fazer");
    expect(within(todo).getByText("Configurar checkout")).toBeInTheDocument();
    expect(within(todo).getByText("Revisar repasse")).toBeInTheDocument();
    // The "doing" card is not in the "todo" column.
    expect(within(todo).queryByText("Migrar tokens")).not.toBeInTheDocument();
    expect(within(column("Em andamento")).getByText("Migrar tokens")).toBeInTheDocument();
  });

  it("renders an item description when provided", () => {
    render(<Kanban columns={COLUMNS} onColumnsChange={() => {}} />);
    expect(screen.getByText("Habilitar boleto")).toBeInTheDocument();
  });

  it("uses renderItem when provided to customize card content", () => {
    render(
      <Kanban
        columns={COLUMNS}
        onColumnsChange={() => {}}
        renderItem={(item) => <span>card:{item.id}</span>}
      />,
    );
    expect(screen.getByText("card:t1")).toBeInTheDocument();
    expect(screen.getByText("card:d1")).toBeInTheDocument();
    // Default rendering is replaced, so the original title text is gone.
    expect(screen.queryByText("Configurar checkout")).not.toBeInTheDocument();
  });

  it("exposes a drag handle per card", () => {
    render(<Kanban columns={COLUMNS} onColumnsChange={() => {}} />);
    // 2 + 1 cards, each with a reorder handle.
    expect(screen.getAllByRole("button", { name: /reorder card/i })).toHaveLength(3);
  });

  it("renders an empty column without cards", () => {
    const cols: KanbanColumn[] = [...COLUMNS, { id: "done", title: "Concluído", items: [] }];
    render(<Kanban columns={cols} onColumnsChange={() => {}} />);
    const done = column("Concluído");
    expect(within(done).getByText("0")).toBeInTheDocument();
    expect(within(done).queryByRole("button", { name: /reorder card/i })).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Kanban columns={COLUMNS} onColumnsChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
