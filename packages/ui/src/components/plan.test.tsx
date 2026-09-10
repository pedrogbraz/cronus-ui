import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "./plan.js";

function BasicPlan({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Plan defaultOpen={defaultOpen}>
      <PlanHeader>
        <PlanTitle>Ship checklist</PlanTitle>
        <PlanDescription>Steps to release</PlanDescription>
        <PlanAction>
          <PlanTrigger />
        </PlanAction>
      </PlanHeader>
      <PlanContent>Build, test, deploy</PlanContent>
      <PlanFooter>Ready</PlanFooter>
    </Plan>
  );
}

describe("Plan", () => {
  it("renders data-slot attributes on composed parts", () => {
    const { container } = render(<BasicPlan defaultOpen />);

    expect(container.querySelector('[data-slot="plan"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="plan-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="plan-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="plan-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="plan-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="plan-trigger"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="plan-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="plan-footer"]')).toBeInTheDocument();
  });

  it("toggles open and closed on trigger click", async () => {
    render(<BasicPlan />);
    const trigger = screen.getByRole("button", { name: "Toggle plan" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Build, test, deploy")).toBeVisible();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<BasicPlan defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
