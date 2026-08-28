"use client";

import { type HTMLAttributes, useId } from "react";
import { Area, CartesianGrid, AreaChart as RechartsAreaChart, XAxis } from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  ChartCursor,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface AreaChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  /** Category / time field. @default "date" */
  xKey?: string;
  series: ChartSeries[];
  formatValue?: (value: number, name: string) => string;
}

export function AreaChart({
  data,
  xKey = "date",
  series,
  formatValue,
  className,
  ...props
}: AreaChartProps) {
  const uid = useId().replace(/:/g, "");
  const config = chartSeriesConfig(series);

  return (
    <div data-slot="area-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsAreaChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <defs>
            {series.map((item) => (
              <linearGradient key={item.key} id={`${uid}-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`var(--color-${item.key})`} stopOpacity={0.4} />
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
          {series.map((item) => (
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={`var(--color-${item.key})`}
              fill={`url(#${uid}-${item.key})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          ))}
        </RechartsAreaChart>
      </ChartContainer>
    </div>
  );
}
