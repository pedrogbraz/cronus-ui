"use client";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@cronus-ui/ui";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

/**
 * The only recharts-touching render in this family, isolated so it can be pulled
 * in via `next/dynamic` (`ssr: false`). Keeping recharts behind a client-only
 * dynamic boundary means the chart family chunk no longer drags the recharts
 * graph into any server bundle — it streams in only when this demo mounts.
 */

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--cronus-primary)" },
  profit: { label: "Profit", color: "var(--cronus-info)" },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", revenue: 4200, profit: 1400 },
  { month: "Feb", revenue: 3800, profit: 1100 },
  { month: "Mar", revenue: 5200, profit: 1900 },
  { month: "Apr", revenue: 4900, profit: 1700 },
  { month: "May", revenue: 6100, profit: 2400 },
  { month: "Jun", revenue: 7300, profit: 3100 },
];

export default function BarChartDemo() {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip
          cursor={{ fill: "var(--cronus-fg)", fillOpacity: 0.05, radius: 8 }}
          content={<ChartTooltipContent />}
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
