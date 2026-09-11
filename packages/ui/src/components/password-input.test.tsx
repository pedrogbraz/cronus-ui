import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { getPasswordStrength, PasswordInput } from "./password-input.js";

describe("getPasswordStrength", () => {
  it("scores an empty value as 0", () => {
    expect(getPasswordStrength("")).toEqual({ score: 0, label: "Weak" });
  });

  it("scores a strong mixed value as 4", () => {
    expect(getPasswordStrength("Abcd1234!xyz").score).toBe(4);
  });

  it("scores a short lowercase value low", () => {
    expect(getPasswordStrength("abc").score).toBeLessThan(2);
  });

  it("returns a human label for each score", () => {
    expect(getPasswordStrength("Abcd1234!xyz").label).toBe("Strong");
  });
});

describe("PasswordInput", () => {
  it("renders an input of type password by default", () => {
    render(<PasswordInput aria-label="Password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("toggles to text and updates the toggle a11y state on click", async () => {
    render(<PasswordInput aria-label="Password" />);
    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    const hideToggle = screen.getByRole("button", { name: "Hide password" });
    expect(hideToggle).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(hideToggle);
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders the strength meter label when showStrength is set", async () => {
    render(<PasswordInput aria-label="Password" showStrength />);
    await userEvent.type(screen.getByLabelText("Password"), "Abcd1234!xyz");
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });

  it("respects a controlled value", () => {
    render(<PasswordInput aria-label="Password" value="hunter2" readOnly />);
    expect(screen.getByLabelText("Password")).toHaveValue("hunter2");
  });

  it("overrides the toggle copy through labels", () => {
    render(<PasswordInput aria-label="Password" labels={{ show: "Mostrar senha" }} />);
    expect(screen.getByRole("button", { name: "Mostrar senha" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<PasswordInput aria-label="Password" showStrength />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
