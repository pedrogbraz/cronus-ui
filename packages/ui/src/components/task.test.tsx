import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "./task.js";

function BasicTask({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Task defaultOpen={defaultOpen}>
      <TaskTrigger title="Search codebase" />
      <TaskContent>
        <TaskItem>Find matching files</TaskItem>
        <TaskItemFile>src/app.tsx</TaskItemFile>
      </TaskContent>
    </Task>
  );
}

describe("Task", () => {
  it("renders data-slot attributes", () => {
    const { container } = render(<BasicTask defaultOpen />);

    expect(container.querySelector('[data-slot="task"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="task-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="task-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="task-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="task-item-file"]')).toBeInTheDocument();
    expect(screen.getByText("Search codebase")).toBeInTheDocument();
  });

  it("toggles open and closed on trigger click", async () => {
    render(<BasicTask />);
    const trigger = screen.getByRole("button");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Find matching files")).toBeVisible();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<BasicTask defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
