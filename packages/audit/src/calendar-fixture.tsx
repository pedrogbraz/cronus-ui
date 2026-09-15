"use client";

import { Calendar } from "@cronus-ui/ui/calendar";

/** DayPicker has no `data-slot`; the wrapper is the audit contract root. */
function parseLocalDate(value: unknown): Date | undefined {
  if (typeof value !== "string") return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/**
 * `defaultMonth` / `selected` are ISO `YYYY-MM-DD` fixture props, emitted to
 * the kernel as the same attrs. No `selected` → no selected day.
 */
export function CalendarFixture({
  defaultMonth,
  selected,
}: {
  defaultMonth?: string;
  selected?: string;
}) {
  const month = parseLocalDate(defaultMonth) ?? new Date(2026, 5, 1);
  return (
    <div data-slot="calendar">
      <Calendar mode="single" defaultMonth={month} selected={parseLocalDate(selected)} />
    </div>
  );
}
