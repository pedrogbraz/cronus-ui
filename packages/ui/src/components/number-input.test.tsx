import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { NumberInput } from "./number-input.js";

describe("NumberInput", () => {
  it("renders a spinbutton with its accessible name and bounds", () => {
    render(<NumberInput aria-label="Quantity" defaultValue={5} min={0} max={10} />);
    const field = screen.getByRole("spinbutton", { name: "Quantity" });
    expect(field).toBeInTheDocument();
    expect(field).toHaveValue("5");
    expect(field).toHaveAttribute("aria-valuemin", "0");
    expect(field).toHaveAttribute("aria-valuemax", "10");
    expect(field).toHaveAttribute("aria-valuenow", "5");
  });

  it("renders increment and decrement steppers", () => {
    render(<NumberInput aria-label="Quantity" defaultValue={1} />);
    expect(screen.getByRole("button", { name: "Increment" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decrement" })).toBeInTheDocument();
  });

  it("overrides stepper copy through labels", () => {
    render(
      <NumberInput
        aria-label="Quantity"
        labels={{ increment: "Aumentar", decrement: "Diminuir" }}
      />,
    );
    expect(screen.getByRole("button", { name: "Aumentar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Diminuir" })).toBeInTheDocument();
  });

  it("increments via the stepper button (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Quantity" defaultValue={2} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveValue("3");
  });

  it("increments and decrements with the arrow keys", async () => {
    render(<NumberInput aria-label="Quantity" defaultValue={5} />);
    const field = screen.getByRole("spinbutton", { name: "Quantity" });
    field.focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(field).toHaveValue("6");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(field).toHaveValue("4");
  });

  it("clamps to max and disables the increment stepper at the bound", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberInput
        aria-label="Quantity"
        defaultValue={9}
        min={0}
        max={10}
        onValueChange={onValueChange}
      />,
    );
    const field = screen.getByRole("spinbutton", { name: "Quantity" });
    field.focus();
    await userEvent.keyboard("{End}"); // jumps to max
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled();
  });

  it("parses typed input into a number on commit", async () => {
    const onValueChange = vi.fn();
    render(<NumberInput aria-label="Price" onValueChange={onValueChange} />);
    const field = screen.getByRole("spinbutton", { name: "Price" });
    await userEvent.type(field, "42");
    expect(onValueChange).toHaveBeenLastCalledWith(42);
  });

  it("honors a controlled value", () => {
    function Controlled() {
      const [value] = useState<number | null>(7);
      return <NumberInput aria-label="Bound" value={value} onValueChange={() => {}} />;
    }
    render(<Controlled />);
    expect(screen.getByRole("spinbutton", { name: "Bound" })).toHaveValue("7");
  });

  it("disables the field and both steppers when disabled", async () => {
    render(<NumberInput aria-label="Quantity" defaultValue={3} disabled />);
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Increment" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Decrement" })).toBeDisabled();
  });

  it("forwards the invalid prop to aria-invalid", () => {
    render(<NumberInput aria-label="Quantity" invalid />);
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<NumberInput aria-label="Quantity" defaultValue={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
