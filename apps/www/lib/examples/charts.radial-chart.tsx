"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@kronus-ui/ui";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

/**
 * The only recharts-touching render in this family, isolated so it can be pulled
 * in via `next/dynamic` (`ssr: false`). Keeping recharts behind a client-only
 * dynamic boundary means the chart family chunk no longer drags the recharts
 * graph into any server bundle — it streams in only when this demo mounts.
 */

const chartConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--kronus-chart-1)" },
  mobile: { label: "Mobile", color: "var(--kronus-chart-2)" },
  tablet: { label: "Tablet", color: "var(--kronus-chart-3)" },
  other: { label: "Other", color: "var(--kronus-chart-4)" },
} satisfies ChartConfig;

const chartData = [
  { device: "desktop", visitors: 5200, fill: "var(--color-desktop)" },
  { device: "mobile", visitors: 4100, fill: "var(--color-mobile)" },
  { device: "tablet", visitors: 1800, fill: "var(--color-tablet)" },
  { device: "other", visitors: 900, fill: "var(--color-other)" },
];

export default function RadialChartDemo() {
  return (
    // Data is exposed to assistive tech via this label; the SVG internals are
    // hidden so recharts' nameless role="img" nodes aren't announced.
    <div
      role="img"
      aria-label="Radial bar chart of visitors by device: Desktop 5,200, Mobile 4,100, Tablet 1,800, Other 900."
      className="h-64 w-full"
    >
      <div aria-hidden="true" className="h-full w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <RadialBarChart
            accessibilityLayer={false}
            data={chartData}
            innerRadius={32}
            outerRadius={110}
          >
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="device" />} />
            <PolarGrid gridType="circle" radialLines={false} stroke="none" />
            <RadialBar dataKey="visitors" background cornerRadius={8} />
            <ChartLegend content={<ChartLegendContent nameKey="device" />} />
          </RadialBarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
