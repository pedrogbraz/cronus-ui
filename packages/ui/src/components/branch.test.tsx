import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Branch,
  BranchMessages,
  BranchNext,
  BranchPage,
  BranchPrevious,
  BranchSelector,
} from "./branch.js";

function Fixture({ onBranchChange }: { onBranchChange?: (i: number) => void }) {
  return (
    <Branch onBranchChange={onBranchChange}>
      <BranchMessages>
        <div>Branch A</div>
        <div>Branch B</div>
        <div>Branch C</div>
      </BranchMessages>
      <BranchSelector>
        <BranchPrevious />
        <BranchPage />
        <BranchNext />
      </BranchSelector>
    </Branch>
  );
}

describe("Branch", () => {
  it("shows the first branch and disables previous at the start", () => {
    render(<Fixture />);
    expect(screen.getByText("Branch A")).toBeVisible();
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous branch" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next branch" })).toBeEnabled();
  });

  it("advances and retreats with next/prev", async () => {
    const user = userEvent.setup();
    const onBranchChange = vi.fn();
    render(<Fixture onBranchChange={onBranchChange} />);

    await user.click(screen.getByRole("button", { name: "Next branch" }));
    expect(screen.getByText("Branch B")).toBeVisible();
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
    expect(onBranchChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole("button", { name: "Previous branch" }));
    expect(screen.getByText("Branch A")).toBeVisible();
    expect(onBranchChange).toHaveBeenCalledWith(0);
  });

  it("disables next at the last branch", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    await user.click(screen.getByRole("button", { name: "Next branch" }));
    await user.click(screen.getByRole("button", { name: "Next branch" }));
    expect(screen.getByText("Branch C")).toBeVisible();
    expect(screen.getByRole("button", { name: "Next branch" })).toBeDisabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("does not clone identity props onto every pane", () => {
    render(
      <Branch>
        <BranchMessages id="thread">
          <div>Branch A</div>
          <div>Branch B</div>
          <div>Branch C</div>
        </BranchMessages>
      </Branch>,
    );
    expect(document.querySelectorAll("#thread")).toHaveLength(1);
  });
});
