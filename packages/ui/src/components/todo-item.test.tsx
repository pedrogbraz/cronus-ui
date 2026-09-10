import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TodoItem } from "./todo-item.js";

const now = new Date("2026-09-10T12:00:00Z");

describe("TodoItem", () => {
  it("renders the title, description, project, labels, priority, and subtask count", () => {
    render(
      <TodoItem
        id="1"
        title="Review pull requests"
        description="Check and review the pending pull requests on GitHub"
        completed={false}
        priority="high"
        dueDate="2025-12-22T12:00:00Z"
        now={now}
        project={{ id: "p1", name: "GAIA UI" }}
        labels={[
          { id: "l1", name: "Development" },
          { id: "l2", name: "Urgent" },
        ]}
        subtasks={[
          { id: "s1", title: "Triage", completed: true },
          { id: "s2", title: "Review", completed: false },
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: "Review pull requests" })).toBeInTheDocument();
    expect(
      screen.getByText("Check and review the pending pull requests on GitHub"),
    ).toBeInTheDocument();
    expect(screen.getByText("GAIA UI")).toBeInTheDocument();
    expect(screen.getByText("Development")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("1/2 subtasks")).toBeInTheDocument();
  });

  it("toggles completion through the checkbox", async () => {
    const onToggleComplete = vi.fn();
    const user = userEvent.setup();
    render(
      <TodoItem
        id="1"
        title="Write docs"
        completed={false}
        priority="medium"
        onToggleComplete={onToggleComplete}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Mark complete" }));
    expect(onToggleComplete).toHaveBeenCalledWith("1", true);
  });

  it("calls onClick from the row without toggling the checkbox", async () => {
    const onClick = vi.fn();
    const onToggleComplete = vi.fn();
    const user = userEvent.setup();
    render(
      <TodoItem
        id="1"
        title="Write docs"
        completed={false}
        onClick={onClick}
        onToggleComplete={onToggleComplete}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Write docs" }));
    expect(onClick).toHaveBeenCalledWith("1");
    expect(onToggleComplete).not.toHaveBeenCalled();
  });

  it("marks an overdue due date", () => {
    render(
      <TodoItem
        id="1"
        title="Fix bug"
        completed={false}
        dueDate="2026-09-01T12:00:00Z"
        now={now}
      />,
    );
    expect(screen.getByText("9 days ago")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <TodoItem
        id="1"
        title="Review pull requests"
        description="Check pending reviews"
        completed={false}
        priority="high"
        dueDate="2026-09-10T18:00:00Z"
        now={now}
        project={{ id: "p1", name: "Cronus" }}
        labels={[{ id: "l1", name: "Docs" }]}
        subtasks={[{ id: "s1", title: "Draft", completed: false }]}
        onToggleComplete={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
