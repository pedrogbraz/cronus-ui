import type { HTMLAttributes } from "react";
import { Bar, CartesianGrid, BarChart as RechartsBarChart, XAxis } from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  ChartCursor,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  xKey?: string;
  series: ChartSeries[];
  stacked?: boolean;
  formatValue?: (value: number, name: string) => string;
}

export function BarChart({
  data,
  xKey = "month",
  series,
  stacked = false,
  formatValue,
  className,
  ...props
}: BarChartProps) {
  const config = chartSeriesConfig(series);

  return (
    <div data-slot="bar-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsBarChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={12} />
          <ChartTooltip
            cursor={<ChartCursor labelKey={xKey} />}
            content={<ChartTooltipContent formatValue={formatValue} />}
          />
          {series.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              fill={`var(--color-${item.key})`}
              radius={4}
              stackId={stacked ? "stack" : undefined}
              animationDuration={1100}
            />
          ))}
        </RechartsBarChart>
      </ChartContainer>
    </div>
  );
}
