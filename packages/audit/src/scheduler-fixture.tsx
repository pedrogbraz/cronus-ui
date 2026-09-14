"use client";

import { Scheduler } from "@cronus-ui/ui/scheduler";

const FALLBACK_ITEMS = ["Launch call", "Webinar"];

function parseLocalDate(value: unknown): Date | undefined {
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }
  return undefined;
}

/**
 * Event `{id, title, date}` objects cannot round-trip through emit.
 * `defaultMonth` / `today` are ISO `YYYY-MM-DD` fixture props, emitted to the
 * kernel as the same attrs. No `today` → no highlighted day.
 */
export function SchedulerFixture({
  items,
  defaultMonth,
  today,
}: {
  items?: string[];
  defaultMonth?: string;
  today?: string;
}) {
  const month = parseLocalDate(defaultMonth) ?? new Date(2026, 5, 1);
  const titles = items && items.length > 0 ? items : FALLBACK_ITEMS;
  return (
    <Scheduler
      defaultMonth={month}
      today={parseLocalDate(today)}
      events={titles.map((title, index) => ({
        id: title.toLowerCase().replaceAll(/\s+/g, "-"),
        title,
        date: new Date(month.getFullYear(), month.getMonth(), index === 0 ? 15 : 20),
      }))}
    />
  );
}
