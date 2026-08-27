import type { HTMLAttributes } from "react";
import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis } from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  ChartCursor,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface LineChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  xKey?: string;
  series: ChartSeries[];
  formatValue?: (value: number, name: string) => string;
}

export function LineChart({
  data,
  xKey = "date",
  series,
  formatValue,
  className,
  ...props
}: LineChartProps) {
  const config = chartSeriesConfig(series);

  return (
    <div data-slot="line-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsLineChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={12} minTickGap={24} />
          <ChartTooltip
            cursor={<ChartCursor labelKey={xKey} />}
            content={<ChartTooltipContent formatValue={formatValue} />}
          />
          {series.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={`var(--color-${item.key})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={1100}
              animationEasing="ease-out"
            />
          ))}
        </RechartsLineChart>
      </ChartContainer>
    </div>
  );
}
