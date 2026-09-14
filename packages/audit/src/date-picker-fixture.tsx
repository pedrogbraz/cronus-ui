"use client";

import { DatePicker } from "@cronus-ui/ui/date-picker";

function parseLocalDate(value: unknown): Date | undefined {
  if (typeof value !== "string") return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function DatePickerFixture({
  placeholder,
  value,
  "aria-label": ariaLabel,
}: {
  placeholder?: string;
  value?: string;
  "aria-label"?: string;
}) {
  return (
    <DatePicker
      defaultOpen
      placeholder={placeholder}
      defaultValue={parseLocalDate(value)}
      aria-label={ariaLabel}
    />
  );
}
