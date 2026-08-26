import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "./input.js";

describe("Input", () => {
  it("renders a textbox with its placeholder", () => {
    render(<Input placeholder="Your name" aria-label="Name" />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Your name");
  });

  it("updates its value as the user types (uncontrolled)", async () => {
    render(<Input aria-label="Email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    await userEvent.type(input, "ada@kronus.com");
    expect(input).toHaveValue("ada@kronus.com");
  });

  it("does not accept typing while disabled", async () => {
    render(<Input aria-label="Locked" disabled />);
    const input = screen.getByRole("textbox", { name: "Locked" });
    expect(input).toBeDisabled();
    await userEvent.type(input, "nope");
    expect(input).toHaveValue("");
  });

  it("maps the invalid prop to aria-invalid", () => {
    render(<Input aria-label="Field" invalid />);
    expect(screen.getByRole("textbox", { name: "Field" })).toHaveAttribute("aria-invalid", "true");
  });

  it("respects an explicit aria-invalid when invalid is not set", () => {
    render(<Input aria-label="Field" aria-invalid />);
    expect(screen.getByRole("textbox", { name: "Field" })).toHaveAttribute("aria-invalid", "true");
  });

  it("has no axe violations when labelled", async () => {
    const { container } = render(
      <>
        <label htmlFor="full-name">Full name</label>
        <Input id="full-name" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
