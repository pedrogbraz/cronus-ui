import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CurrencyInput } from "./currency-input.js";

describe("CurrencyInput", () => {
  it("formats a controlled minor-unit value with the active currency's locale", () => {
    render(<CurrencyInput aria-label="Amount" value={123456} onValueChange={() => {}} />);
    // Default currency is BRL (pt-BR) → grouping "." decimal ",".
    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveValue("1.234,56");
    expect(screen.getByRole("button", { name: "Select currency" })).toHaveTextContent("R$BRL");
  });

  it("accumulates typed digits as minor units and emits them via onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<CurrencyInput aria-label="Amount" onValueChange={onValueChange} />);
    const field = screen.getByRole("textbox", { name: "Amount" });

    await userEvent.type(field, "12345");

    // Right-to-left fill: the field reads 123,45 and the callback gets 12345 cents.
    expect(field).toHaveValue("123,45");
    expect(onValueChange).toHaveBeenLastCalledWith(
      12345,
      expect.objectContaining({ currency: "BRL", float: 123.45, formatted: "123,45" }),
    );
  });

  it("clears back to empty when backspacing through the last digit", async () => {
    const onValueChange = vi.fn();
    render(<CurrencyInput aria-label="Amount" onValueChange={onValueChange} />);
    const field = screen.getByRole("textbox", { name: "Amount" });

    await userEvent.type(field, "5");
    expect(field).toHaveValue("0,05");
    await userEvent.type(field, "{backspace}");
    expect(field).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith(null, expect.objectContaining({ float: null }));
  });

  it("reformats when the currency is switched from the selector", async () => {
    const user = userEvent.setup();
    const onCurrencyChange = vi.fn();
    render(
      <CurrencyInput
        aria-label="Amount"
        value={123456}
        defaultCurrency="USD"
        onValueChange={() => {}}
        onCurrencyChange={onCurrencyChange}
      />,
    );
    const field = screen.getByRole("textbox", { name: "Amount" });
    expect(field).toHaveValue("1,234.56"); // USD / en-US

    await user.click(screen.getByRole("button", { name: "Select currency" }));
    const menu = await screen.findByRole("menu");
    await user.click(within(menu).getByRole("menuitemradio", { name: /EUR/ }));

    expect(onCurrencyChange).toHaveBeenCalledWith(
      "EUR",
      expect.objectContaining({ currency: "EUR" }),
    );
    expect(field).toHaveValue("1.234,56"); // EUR / de-DE
  });

  it("lists the full default currency set without locking page scroll", async () => {
    const user = userEvent.setup();
    render(<CurrencyInput aria-label="Amount" onValueChange={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Select currency" }));
    const menu = await screen.findByRole("menu");
    const options = within(menu).getAllByRole("menuitemradio");
    expect(options.length).toBeGreaterThan(20);
    expect(within(menu).getByRole("menuitemradio", { name: /Japanese Yen/ })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitemradio", { name: /Argentine Peso/ })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <CurrencyInput aria-label="Amount" value={1000} onValueChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
