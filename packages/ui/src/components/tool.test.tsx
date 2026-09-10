import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "./tool.js";

function Fixture() {
  return (
    <Tool defaultOpen>
      <ToolHeader type="tool-search" state="output-available" title="search" />
      <ToolContent>
        <ToolInput input={{ query: "cronus" }} />
        <ToolOutput output={{ hits: 3 }} errorText={undefined} />
      </ToolContent>
    </Tool>
  );
}

describe("Tool", () => {
  it("renders a completed tool with parameters and result", () => {
    render(<Fixture />);
    expect(screen.getByText("search")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Parameters")).toBeInTheDocument();
    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getByText(/"query": "cronus"/)).toBeInTheDocument();
  });

  it("toggles content via the header", async () => {
    const user = userEvent.setup();
    render(
      <Tool>
        <ToolHeader type="tool-search" state="input-available" />
        <ToolContent>
          <ToolInput input={{ q: 1 }} />
        </ToolContent>
      </Tool>,
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
