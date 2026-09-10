import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "./chain-of-thought.js";

function BasicChain({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <ChainOfThought defaultOpen={defaultOpen}>
      <ChainOfThoughtHeader />
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          label="Gather context"
          description="Read the relevant files"
          status="complete"
        />
        <ChainOfThoughtStep label="Draft answer" status="active" />
        <ChainOfThoughtSearchResults>
          <ChainOfThoughtSearchResult>docs</ChainOfThoughtSearchResult>
        </ChainOfThoughtSearchResults>
        <ChainOfThoughtImage caption="Diagram">
          <img alt="flow" src="about:blank" />
        </ChainOfThoughtImage>
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

describe("ChainOfThought", () => {
  it("renders data-slot attributes when open", () => {
    const { container } = render(<BasicChain defaultOpen />);

    expect(container.querySelector('[data-slot="chain-of-thought"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chain-of-thought-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chain-of-thought-content"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chain-of-thought-step"]')).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="chain-of-thought-search-results"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="chain-of-thought-search-result"]'),
    ).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chain-of-thought-image"]')).toBeInTheDocument();
    expect(screen.getByText("Chain of Thought")).toBeInTheDocument();
  });

  it("toggles open and closed on header click", async () => {
    render(<BasicChain />);
    const trigger = screen.getByRole("button", { name: /Chain of Thought/i });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Gather context")).toBeVisible();

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("respects labels.header", () => {
    render(
      <ChainOfThought defaultOpen labels={{ header: "Raciocínio" }}>
        <ChainOfThoughtHeader />
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="One" />
        </ChainOfThoughtContent>
      </ChainOfThought>,
    );

    expect(screen.getByRole("button", { name: "Raciocínio" })).toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<BasicChain defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
