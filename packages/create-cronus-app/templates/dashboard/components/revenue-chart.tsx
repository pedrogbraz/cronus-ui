"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@cronus-ui/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@cronus-ui/ui/chart";
import { MetricDelta } from "@cronus-ui/ui/metric";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const REVENUE_DATA = [
  { month: "Jan", revenue: 42100 },
  { month: "Feb", revenue: 48400 },
  { month: "Mar", revenue: 45900 },
  { month: "Apr", revenue: 56200 },
  { month: "May", revenue: 61800 },
  { month: "Jun", revenue: 72400 },
  { month: "Jul", revenue: 84210 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

/** Monthly recurring revenue as a themed bar chart (recharts via `chart`). */
export function RevenueChart() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-base">Revenue trend</CardTitle>
          <p className="text-sm text-fg-secondary">Monthly recurring revenue</p>
        </div>
        <MetricDelta trend="up">+99.8% YoY</MetricDelta>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[16/6] w-full">
          <BarChart accessibilityLayer data={REVENUE_DATA} margin={{ left: 4, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
