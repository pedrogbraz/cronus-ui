"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@cronus-ui/ui";
import { Cell, Label, Pie, PieChart } from "recharts";

/**
 * The only recharts-touching render in this family, isolated so it can be pulled
 * in via `next/dynamic` (`ssr: false`). Keeping recharts behind a client-only
 * dynamic boundary means the chart family chunk no longer drags the recharts
 * graph into any server bundle — it streams in only when this demo mounts.
 */

const chartConfig = {
  visitors: { label: "Visitors" },
  direct: { label: "Direct", color: "var(--cronus-chart-1)" },
  organic: { label: "Organic", color: "var(--cronus-chart-2)" },
  referral: { label: "Referral", color: "var(--cronus-chart-3)" },
  social: { label: "Social", color: "var(--cronus-chart-4)" },
  email: { label: "Email", color: "var(--cronus-chart-5)" },
} satisfies ChartConfig;

const chartData = [
  { source: "direct", visitors: 4200, fill: "var(--color-direct)" },
  { source: "organic", visitors: 3100, fill: "var(--color-organic)" },
  { source: "referral", visitors: 1900, fill: "var(--color-referral)" },
  { source: "social", visitors: 1400, fill: "var(--color-social)" },
  { source: "email", visitors: 800, fill: "var(--color-email)" },
];

export default function PieChartDemo() {
  return (
    // The data is conveyed to assistive tech via this label; the SVG internals
    // (recharts tags each sector role="img" with no name) are hidden so they're
    // not announced as 13 nameless images.
    <div
      role="img"
      aria-label="Donut chart of traffic sources by visitors: Direct 4,200, Organic 3,100, Referral 1,900, Social 1,400, Email 800."
      className="h-64 w-full"
    >
      <div aria-hidden="true" className="h-full w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart accessibilityLayer={false}>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="source"
              innerRadius={64}
              outerRadius={98}
              paddingAngle={3}
              cornerRadius={6}
              strokeWidth={0}
              rootTabIndex={-1}
            >
              {chartData.map((entry) => (
                <Cell key={entry.source} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                  const { cx, cy } = viewBox;
                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={cx} y={cy} className="fill-fg font-semibold text-2xl">
                        11.4K
                      </tspan>
                      <tspan
                        x={cx}
                        y={(cy ?? 0) + 22}
                        className="fill-fg-tertiary text-xs tracking-wide"
                      >
                        Visitors
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="source" />} />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
}
