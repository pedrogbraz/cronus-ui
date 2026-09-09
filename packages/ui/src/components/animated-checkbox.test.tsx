import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AnimatedCheckbox } from "./animated-checkbox.js";

describe("AnimatedCheckbox", () => {
  it("renders a checkbox named by its title", () => {
    render(<AnimatedCheckbox title="Write documentation" />);
    const checkbox = screen.getByRole("checkbox", { name: "Write documentation" });
    expect(checkbox.closest("[data-slot='animated-checkbox']")).toBeTruthy();
    expect(checkbox).not.toBeChecked();
  });

  it("toggles checked state on click (uncontrolled)", async () => {
    render(<AnimatedCheckbox title="Add tests" />);
    const checkbox = screen.getByRole("checkbox", { name: "Add tests" });
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("starts checked when defaultChecked is set", () => {
    render(<AnimatedCheckbox title="Already done" defaultChecked />);
    expect(screen.getByRole("checkbox", { name: "Already done" })).toBeChecked();
  });

  it("fires onCheckedChange with the next value", async () => {
    const onCheckedChange = vi.fn();
    render(<AnimatedCheckbox title="Task" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Task" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("honors a controlled checked value", async () => {
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return <AnimatedCheckbox title="Bound" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    const checkbox = screen.getByRole("checkbox", { name: "Bound" });
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("does not toggle while disabled", async () => {
    const onCheckedChange = vi.fn();
    render(<AnimatedCheckbox title="Off" disabled onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Off" });
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<AnimatedCheckbox title="Accept" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
