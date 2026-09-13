"use client";

import { AreaChart } from "@cronus-ui/ui/area-chart";
import { BarChart } from "@cronus-ui/ui/bar-chart";
import { LineChart } from "@cronus-ui/ui/line-chart";
import { PieChart } from "@cronus-ui/ui/pie-chart";
import { Sparkline } from "@cronus-ui/ui/sparkline";

/** Tiny static series — nested objects cannot round-trip through emit. */
const AREA_DATA = [
  { date: "Jan", desktop: 4 },
  { date: "Feb", desktop: 8 },
  { date: "Mar", desktop: 6 },
];

const BAR_DATA = [
  { month: "Jan", desktop: 4 },
  { month: "Feb", desktop: 8 },
  { month: "Mar", desktop: 6 },
];

const SERIES = [{ key: "desktop", label: "Desktop" }];

const PIE_DATA = [
  { key: "desktop", value: 4 },
  { key: "mobile", value: 8 },
];

const PIE_SERIES = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

const FALLBACK_SPARKLINE = [4, 8, 6, 10, 7];

function numberList(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number" && Number.isFinite(item))
    : [];
}

export function AreaChartFixture() {
  return <AreaChart data={AREA_DATA} series={SERIES} />;
}

export function BarChartFixture() {
  return <BarChart data={BAR_DATA} series={SERIES} />;
}

export function LineChartFixture() {
  return <LineChart data={AREA_DATA} series={SERIES} />;
}

export function PieChartFixture() {
  return <PieChart data={PIE_DATA} series={PIE_SERIES} />;
}

export function SparklineFixture({
  data,
  "aria-label": ariaLabel,
}: {
  data?: unknown;
  "aria-label"?: string;
}) {
  const series = numberList(data);
  return (
    <Sparkline data={series.length > 0 ? series : FALLBACK_SPARKLINE} aria-label={ariaLabel} />
  );
}
