"use client";

import { AreaChart } from "@cronus-ui/ui/area-chart";
import { BarChart } from "@cronus-ui/ui/bar-chart";
import { LineChart } from "@cronus-ui/ui/line-chart";
import { LiveLineChart } from "@cronus-ui/ui/live-line-chart";
import { PieChart } from "@cronus-ui/ui/pie-chart";
import { RadarChart } from "@cronus-ui/ui/radar-chart";
import { RingChart } from "@cronus-ui/ui/ring-chart";
import { ScatterChart } from "@cronus-ui/ui/scatter-chart";
import { Sparkline } from "@cronus-ui/ui/sparkline";
import { SunburstChart } from "@cronus-ui/ui/sunburst-chart";

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

const RADAR_DATA = [
  { metric: "Speed", desktop: 4 },
  { metric: "Reliability", desktop: 8 },
  { metric: "Comfort", desktop: 6 },
];

const SCATTER_SERIES = [
  {
    key: "desktop",
    label: "Desktop",
    data: [
      { x: 1, y: 4 },
      { x: 2, y: 8 },
      { x: 3, y: 6 },
    ],
  },
];

const RING_DATA = [
  { key: "desktop", value: 4 },
  { key: "mobile", value: 8 },
];

const RING_SERIES = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

const LIVE_DATA = [
  { tick: 0, value: 4 },
  { tick: 1, value: 8 },
  { tick: 2, value: 6 },
];

const SUNBURST_DATA = [
  {
    name: "Desktop",
    value: 8,
    children: [
      { name: "Chrome", value: 5 },
      { name: "Safari", value: 3 },
    ],
  },
  {
    name: "Mobile",
    value: 4,
    children: [{ name: "iOS", value: 4 }],
  },
];

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

export function RadarChartFixture() {
  return <RadarChart data={RADAR_DATA} series={SERIES} />;
}

export function ScatterChartFixture() {
  return <ScatterChart series={SCATTER_SERIES} />;
}

export function RingChartFixture() {
  return <RingChart data={RING_DATA} series={RING_SERIES} />;
}

/** Tiny static series — nested objects cannot round-trip through emit. */
export function LiveLineChartFixture() {
  return <LiveLineChart data={LIVE_DATA} interval={86_400_000} maxPoints={3} />;
}

/** Nested `{name, value, children}` cannot round-trip through emit. */
export function SunburstChartFixture() {
  return <SunburstChart data={SUNBURST_DATA} />;
}
