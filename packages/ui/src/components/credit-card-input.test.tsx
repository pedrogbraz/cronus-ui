import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CreditCardInput, type CreditCardValue } from "./credit-card-input.js";

const futureYY = String((new Date().getFullYear() + 3) % 100).padStart(2, "0");

describe("CreditCardInput", () => {
  it("renders a labelled group with number, expiry, and CVC fields", () => {
    render(<CreditCardInput label="Payment card" />);
    expect(screen.getByRole("group", { name: "Payment card" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Card number" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Expiration date/ })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Security code/ })).toBeInTheDocument();
  });

  it("overrides field copy through labels", () => {
    render(
      <CreditCardInput
        labels={{
          number: "Número do cartão",
          expiry: "Validade",
          cvc: (digits) => `CVC, ${digits} dígitos`,
        }}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Número do cartão" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Validade" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /CVC/ })).toBeInTheDocument();
  });

  it("formats, detects the brand, and validates a full card via onChange", async () => {
    const onChange = vi.fn<(value: CreditCardValue) => void>();
    render(<CreditCardInput onChange={onChange} />);

    const number = screen.getByRole("textbox", { name: "Card number" });
    await userEvent.type(number, "4242424242424242");
    // Auto-spaced into groups of four.
    expect(number).toHaveValue("4242 4242 4242 4242");

    const expiry = screen.getByRole("textbox", { name: /Expiration date/ });
    await userEvent.type(expiry, `12${futureYY}`);
    expect(expiry).toHaveValue(`12/${futureYY}`);

    const cvc = screen.getByRole("textbox", { name: /Security code/ });
    await userEvent.type(cvc, "123");

    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last).toMatchObject({
      number: "4242424242424242",
      expiry: `12/${futureYY}`,
      cvc: "123",
      brand: "visa",
      complete: true,
      valid: true,
    });
  });

  it("rejects a number that fails the Luhn checksum", async () => {
    const onChange = vi.fn<(value: CreditCardValue) => void>();
    render(<CreditCardInput onChange={onChange} />);

    await userEvent.type(screen.getByRole("textbox", { name: "Card number" }), "4242424242424241");
    await userEvent.type(screen.getByRole("textbox", { name: /Expiration date/ }), `12${futureYY}`);
    await userEvent.type(screen.getByRole("textbox", { name: /Security code/ }), "123");

    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last?.brand).toBe("visa");
    expect(last?.complete).toBe(true);
    expect(last?.valid).toBe(false);
  });

  it("surfaces an error message via role=alert", () => {
    render(<CreditCardInput error="Card is expired" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Card is expired");
  });

  it("has no axe violations", async () => {
    const { container } = render(<CreditCardInput label="Credit card" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
