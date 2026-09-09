import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ReceiveButton } from "./receive-button.js";

describe("ReceiveButton", () => {
  it("renders the collapsed Receive trigger", () => {
    render(<ReceiveButton />);
    expect(screen.getByRole("button", { name: "Receive" })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='receive-button']")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("morphs into the confirmation dialog on click", async () => {
    const user = userEvent.setup();
    render(<ReceiveButton />);
    await user.click(screen.getByRole("button", { name: "Receive" }));
    expect(screen.getByRole("dialog", { name: "Confirm" })).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to receive hell load of money?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("closes on Cancel and restores the trigger", async () => {
    const user = userEvent.setup();
    render(<ReceiveButton />);
    await user.click(screen.getByRole("button", { name: "Receive" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(document.querySelector("[data-slot='receive-button-trigger']")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("confirms from the dialog Receive action", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ReceiveButton onConfirm={onConfirm} />);
    await user.click(screen.getByRole("button", { name: "Receive" }));
    await user.click(screen.getByRole("button", { name: "Receive" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(document.querySelector("[data-slot='receive-button-trigger']")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ReceiveButton defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(document.querySelector("[data-slot='receive-button-trigger']")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("has no axe violations when open", async () => {
    const { container } = render(<ReceiveButton defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
