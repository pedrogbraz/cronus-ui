import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TimePicker, type TimeValue } from "./time-picker.js";

// Radix Popover measures its content with ResizeObserver and probes pointer
// capture; jsdom lacks both. scrollIntoView is also unimplemented. Stub them at
// file scope so the shared setup stays untouched.
beforeAll(() => {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

describe("TimePicker", () => {
  it("renders the trigger with the placeholder when unset", () => {
    render(<TimePicker placeholder="Select time" />);
    expect(screen.getByRole("button", { name: /select time/i })).toBeInTheDocument();
  });

  it("stays closed until the trigger is activated", () => {
    render(<TimePicker placeholder="Select time" />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("commits a chosen hour and minute and reflects them on the trigger", async () => {
    const onChange = vi.fn();
    render(<TimePicker aria-label="Meeting time" hourCycle={24} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: /meeting time/i }));

    const hours = await screen.findByRole("listbox", { name: "Hour" });
    await userEvent.click(within(hours).getByRole("option", { name: "09" }));
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ hours: 9, minutes: 0 }));

    const minutes = screen.getByRole("listbox", { name: "Minute" });
    await userEvent.click(within(minutes).getByRole("option", { name: "30" }));
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ hours: 9, minutes: 30 }));

    expect(screen.getByRole("button", { name: /meeting time/i })).toHaveTextContent("09:30");
  });

  it("changes the value with the arrow keys on a column", async () => {
    const onChange = vi.fn();
    render(
      <TimePicker
        aria-label="Alarm"
        hourCycle={24}
        defaultValue={{ hours: 9, minutes: 0 }}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /alarm/i }));

    const minutes = await screen.findByRole("listbox", { name: "Minute" });
    minutes.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ minutes: 1 }));
  });

  it("renders an AM/PM column only in 12-hour mode", async () => {
    render(<TimePicker aria-label="Reminder" hourCycle={12} />);
    await userEvent.click(screen.getByRole("button", { name: /reminder/i }));
    expect(await screen.findByRole("listbox", { name: "AM or PM" })).toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<TimePicker placeholder="Select time" disabled />);
    const trigger = screen.getByRole("button", { name: /select time/i });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports controlled usage", async () => {
    function Controlled() {
      const [value, setValue] = useState<TimeValue | undefined>(undefined);
      return <TimePicker aria-label="Slot" hourCycle={24} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: /slot/i }));

    const hours = await screen.findByRole("listbox", { name: "Hour" });
    await userEvent.click(within(hours).getByRole("option", { name: "14" }));
    // Trigger reflects the controlled update round-trip.
    expect(screen.getByRole("button", { name: /slot/i })).toHaveTextContent("14:00");
  });

  it("prefers onValueChange over the deprecated onChange alias when both are set", async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <TimePicker
        aria-label="Standup"
        hourCycle={24}
        onValueChange={onValueChange}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /standup/i }));

    const hours = await screen.findByRole("listbox", { name: "Hour" });
    await userEvent.click(within(hours).getByRole("option", { name: "07" }));

    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ hours: 7 }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has no axe violations on the open panel", async () => {
    const { baseElement } = render(
      <TimePicker aria-label="Meeting time" hourCycle={12} showSeconds defaultValue="09:30:00" />,
    );
    await userEvent.click(screen.getByRole("button", { name: /meeting time/i }));
    await screen.findByRole("listbox", { name: "Hour" });
    // Popover content portals to document.body, so audit the whole baseElement.
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
