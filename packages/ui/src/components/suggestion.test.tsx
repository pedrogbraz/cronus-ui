import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Suggestion, Suggestions } from "./suggestion.js";

describe("Suggestions", () => {
  it("renders suggestion chips in a horizontal row", () => {
    render(
      <Suggestions>
        <Suggestion suggestion="Summarize" />
        <Suggestion suggestion="Translate" />
      </Suggestions>,
    );
    expect(screen.getByRole("button", { name: "Summarize" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Translate" })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="suggestions"]')).toBeInTheDocument();
  });

  it("calls onClick with the suggestion string", async () => {
    const onClick = vi.fn();
    render(
      <Suggestions>
        <Suggestion suggestion="Summarize this" onClick={onClick} />
      </Suggestions>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Summarize this" }));
    expect(onClick).toHaveBeenCalledWith("Summarize this");
  });

  it("prefers children over the suggestion string for the label", () => {
    render(
      <Suggestions>
        <Suggestion suggestion="raw">Pretty label</Suggestion>
      </Suggestions>,
    );
    expect(screen.getByRole("button", { name: "Pretty label" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Suggestions>
        <Suggestion suggestion="One" />
        <Suggestion suggestion="Two" />
      </Suggestions>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("makes the scrollable region keyboard-focusable", () => {
    render(
      <Suggestions>
        <Suggestion suggestion="One" />
      </Suggestions>,
    );
    const region = document.querySelector('[data-slot="suggestions"]');
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveAttribute("aria-label", "Suggestions");
  });

  it("uses labels.suggestions for the region name", () => {
    render(
      <Suggestions labels={{ suggestions: "Prompts" }}>
        <Suggestion suggestion="One" />
      </Suggestions>,
    );
    expect(document.querySelector('[data-slot="suggestions"]')).toHaveAttribute(
      "aria-label",
      "Prompts",
    );
  });
});
