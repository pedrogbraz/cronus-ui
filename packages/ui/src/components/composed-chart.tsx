"use client";

import { type HTMLAttributes, useId } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Line,
  ComposedChart as RechartsComposedChart,
  XAxis,
} from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  ChartCursor,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface ComposedChartSeries extends ChartSeries {
  type: "area" | "bar" | "line";
}

export interface ComposedChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  xKey?: string;
  series: ComposedChartSeries[];
  formatValue?: (value: number, name: string) => string;
}

export function ComposedChart({
  data,
  xKey = "date",
  series,
  formatValue,
  className,
  ...props
}: ComposedChartProps) {
  const uid = useId().replace(/:/g, "");
  const config = chartSeriesConfig(series);

  return (
    <div data-slot="composed-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsComposedChart
          accessibilityLayer
          data={data}
          margin={{ left: 8, right: 8, top: 8 }}
        >
          <defs>
            {series
              .filter((item) => item.type === "area")
              .map((item) => (
                <linearGradient
                  key={item.key}
                  id={`${uid}-${item.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={`var(--color-${item.key})`} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={`var(--color-${item.key})`} stopOpacity={0} />
                </linearGradient>
              ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={12} minTickGap={24} />
          <ChartTooltip
            cursor={<ChartCursor labelKey={xKey} />}
            content={<ChartTooltipContent formatValue={formatValue} />}
          />
          {series.map((item) => {
            if (item.type === "bar") {
              return (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  fill={`var(--color-${item.key})`}
                  radius={4}
                />
              );
            }
            if (item.type === "area") {
              return (
                <Area
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  stroke={`var(--color-${item.key})`}
                  fill={`url(#${uid}-${item.key})`}
                  strokeWidth={2}
                  dot={false}
                />
              );
            }
            return (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                stroke={`var(--color-${item.key})`}
                strokeWidth={2}
                dot={false}
              />
            );
          })}
        </RechartsComposedChart>
      </ChartContainer>
    </div>
  );
}
