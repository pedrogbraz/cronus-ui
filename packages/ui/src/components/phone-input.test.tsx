import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { PhoneInput } from "./phone-input.js";

// The country selector uses Radix Popover + cmdk, which lean on browser APIs
// jsdom does not implement.
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

describe("PhoneInput", () => {
  it("renders with the default country and a labelled number field", () => {
    render(<PhoneInput />);
    // Default country is Brazil (+55) surfaced on the selector trigger.
    expect(screen.getByRole("combobox", { name: /brazil, \+55/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Phone number" })).toBeInTheDocument();
  });

  it("groups typed digits and emits the composed E.164 string", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PhoneInput onValueChange={handleChange} />);

    const field = screen.getByRole("textbox", { name: "Phone number" }) as HTMLInputElement;
    await user.type(field, "11987654321");

    // BR pattern [2, 5, 4] groups the national number for display…
    expect(field.value).toBe("11 98765 4321");
    // …while onChange reports the full E.164 number.
    expect(handleChange).toHaveBeenLastCalledWith("+5511987654321");
  });

  it("prefers onValueChange over the deprecated onChange alias when both are set", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} onChange={onChange} />);

    await user.type(screen.getByRole("textbox", { name: "Phone number" }), "11987654321");

    expect(onValueChange).toHaveBeenLastCalledWith("+5511987654321");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("re-composes the number under the newly selected country's dial code (deprecated onChange alias)", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PhoneInput onChange={handleChange} />);

    await user.type(screen.getByRole("textbox", { name: "Phone number" }), "912345678");
    await user.click(screen.getByRole("combobox", { name: /brazil, \+55/i }));
    await user.click(await screen.findByText("Portugal"));

    expect(handleChange).toHaveBeenLastCalledWith("+351912345678");
    expect(screen.getByRole("combobox", { name: /portugal, \+351/i })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<PhoneInput defaultValue="+5511987654321" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
