"use client";

import { Scheduler } from "@cronus-ui/ui/scheduler";

const FALLBACK_ITEMS = ["Launch call", "Webinar"];

function parseLocalDate(value: unknown): Date {
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }
  return new Date(2026, 5, 1);
}

/** Event `{id, title, date}` objects cannot round-trip through emit. */
export function SchedulerFixture({
  items,
  defaultMonth,
}: {
  items?: string[];
  defaultMonth?: string;
}) {
  const month = parseLocalDate(defaultMonth);
  const titles = items && items.length > 0 ? items : FALLBACK_ITEMS;
  return (
    <Scheduler
      defaultMonth={month}
      today={new Date(month.getFullYear(), month.getMonth(), 15)}
      events={titles.map((title, index) => ({
        id: title.toLowerCase().replaceAll(/\s+/g, "-"),
        title,
        date: new Date(month.getFullYear(), month.getMonth(), index === 0 ? 15 : 20),
      }))}
    />
  );
}
