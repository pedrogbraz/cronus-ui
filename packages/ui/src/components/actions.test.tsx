import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Action, Actions } from "./actions.js";

describe("Actions", () => {
  it("renders a group of actions", () => {
    render(
      <Actions>
        <Action label="Copy">C</Action>
        <Action label="Retry">R</Action>
      </Actions>,
    );
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(document.querySelector('[data-slot="actions"]')).toBeInTheDocument();
  });

  it("fires onClick on Action", async () => {
    const onClick = vi.fn();
    render(
      <Actions>
        <Action label="Copy" onClick={onClick}>
          C
        </Action>
      </Actions>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses tooltip as the accessible name when label is omitted", () => {
    render(
      <Actions>
        <Action tooltip="Share">S</Action>
      </Actions>,
    );
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("does not render a duplicate sr-only label when aria-label is set", () => {
    const { container } = render(
      <Actions>
        <Action label="Copy">C</Action>
      </Actions>,
    );
    expect(container.querySelector(".sr-only")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toHaveAttribute("aria-label", "Copy");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Actions>
        <Action label="Copy">C</Action>
        <Action label="Retry">R</Action>
      </Actions>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
