import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { BouncyAccordion } from "./bouncy-accordion.js";

const ITEMS = [
  {
    id: "type",
    title: "Type Shit",
    description: "Fast, accurate typing with real-time validation and helpful hints.",
  },
  {
    id: "schedule",
    title: "Schedule",
    description: "Plan tasks with timelines, reminders, and conflict detection.",
  },
];

describe("BouncyAccordion", () => {
  it("renders each item collapsed", () => {
    render(<BouncyAccordion items={ITEMS} />);
    expect(screen.getByRole("button", { name: /Type Shit/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.querySelector("[data-slot='bouncy-accordion']")).toBeInTheDocument();
  });

  it("expands an item on click and collapses it when clicked again", async () => {
    const user = userEvent.setup();
    render(<BouncyAccordion items={ITEMS} />);
    const trigger = screen.getByRole("button", { name: /Type Shit/ });
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps only one item open at a time", async () => {
    const user = userEvent.setup();
    render(<BouncyAccordion items={ITEMS} />);
    const type = screen.getByRole("button", { name: /Type Shit/ });
    const schedule = screen.getByRole("button", { name: /Schedule/ });
    await user.click(type);
    await user.click(schedule);
    expect(type).toHaveAttribute("aria-expanded", "false");
    expect(schedule).toHaveAttribute("aria-expanded", "true");
  });

  it("has no axe violations when expanded", async () => {
    const { container } = render(<BouncyAccordion items={ITEMS} defaultValue="schedule" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
