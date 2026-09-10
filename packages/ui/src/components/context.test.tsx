import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "./context.js";

function Fixture() {
  return (
    <Context
      usedTokens={3200}
      maxTokens={128000}
      usage={{
        inputTokens: 1200,
        outputTokens: 800,
        reasoningTokens: 400,
        cachedInputTokens: 800,
      }}
      costs={{ total: 0.042 }}
    >
      <ContextTrigger />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody>
          <ContextInputUsage />
          <ContextOutputUsage />
          <ContextReasoningUsage />
          <ContextCacheUsage />
        </ContextContentBody>
        <ContextContentFooter />
      </ContextContent>
    </Context>
  );
}

describe("Context", () => {
  it("renders usage percent on the trigger", () => {
    render(<Fixture />);
    expect(screen.getByText("2.5%")).toBeInTheDocument();
  });

  it("shows token rows when the hover card opens", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    await user.hover(screen.getByRole("button"));
    expect(await screen.findByText("Input")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(screen.getByText("Reasoning")).toBeInTheDocument();
    expect(screen.getByText("Cache")).toBeInTheDocument();
    expect(screen.getByText("Total cost")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
