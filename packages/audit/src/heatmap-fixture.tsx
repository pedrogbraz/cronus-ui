"use client";

import { Heatmap } from "@cronus-ui/ui/heatmap";

/** Tiny static series — nested `{date, value}` objects cannot round-trip through emit. */
const FALLBACK_VALUES = [0, 1, 4, 2, 8, 3, 1, 0, 2, 6, 4, 1, 3, 5];

function numberList(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number" && Number.isFinite(item))
    : [];
}

export function HeatmapFixture({
  data,
  "aria-label": ariaLabel,
}: {
  data?: unknown;
  "aria-label"?: string;
}) {
  const values = numberList(data);
  const series = values.length > 0 ? values : FALLBACK_VALUES;
  return (
    <Heatmap
      aria-label={ariaLabel}
      data={series.map((value, index) => ({
        date: `2026-06-${String(index + 1).padStart(2, "0")}`,
        value,
      }))}
    />
  );
}
