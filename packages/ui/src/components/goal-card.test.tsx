import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { GoalCard } from "./goal-card.js";

const steps = [
  { id: "1", title: "Design", completed: true },
  { id: "2", title: "Develop", completed: true },
  { id: "3", title: "Ship", completed: false },
  { id: "4", title: "Announce", completed: false },
];

describe("GoalCard", () => {
  it("renders the title, progress, derived status, and step count", () => {
    render(
      <GoalCard
        id="mvp"
        title="Launch MVP by end of quarter"
        progress={75}
        steps={steps}
        dueDate="2025-12-08"
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Launch MVP by end of quarter" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Goal progress" })).toHaveAttribute(
      "aria-valuenow",
      "75",
    );
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("2/4 steps")).toBeInTheDocument();
    expect(screen.getByText("Dec 8, 2025")).toBeInTheDocument();
  });

  it("honors an explicit at-risk status", () => {
    render(<GoalCard id="perf" title="Fix performance" progress={30} status="at_risk" />);
    expect(screen.getByText("At risk")).toBeInTheDocument();
  });

  it("derives completed when progress is 100", () => {
    render(
      <GoalCard
        id="onboard"
        title="Complete user onboarding flow"
        progress={100}
        steps={[
          { id: "1", title: "Welcome", isComplete: true },
          { id: "2", title: "Profile", isComplete: true },
          { id: "3", title: "Tour", isComplete: true },
        ]}
      />,
    );
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("3/3 steps")).toBeInTheDocument();
  });

  it("calls onClick with the goal id from the view button", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<GoalCard id="mvp" title="Launch MVP" progress={75} onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "View goal" }));
    expect(onClick).toHaveBeenCalledWith("mvp");
  });

  it("calls onDelete with the goal id", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<GoalCard id="mvp" title="Launch MVP" progress={10} onDelete={onDelete} />);
    await user.click(screen.getByRole("button", { name: "Delete goal" }));
    expect(onDelete).toHaveBeenCalledWith("mvp");
  });

  it("overrides user-facing copy through labels", () => {
    render(
      <GoalCard
        id="mvp"
        title="Launch MVP"
        progress={10}
        onClick={() => undefined}
        labels={{ viewGoal: "Open goal", inProgress: "Underway" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Open goal" })).toBeInTheDocument();
    expect(screen.getByText("Underway")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <GoalCard
        id="mvp"
        title="Launch MVP"
        description="Ship the first public cut."
        progress={75}
        steps={steps}
        dueDate="2025-12-08"
        onClick={() => undefined}
        onDelete={() => undefined}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
