import type { HTMLAttributes } from "react";
import {
  CartesianGrid,
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface ScatterChartSeries extends ChartSeries {
  data: Record<string, unknown>[];
}

export interface ScatterChartProps extends HTMLAttributes<HTMLDivElement> {
  xKey?: string;
  yKey?: string;
  series: ScatterChartSeries[];
}

export function ScatterChart({
  xKey = "x",
  yKey = "y",
  series,
  className,
  ...props
}: ScatterChartProps) {
  const config = chartSeriesConfig(series);

  return (
    <div data-slot="scatter-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsScatterChart margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} type="number" />
          <YAxis dataKey={yKey} tickLine={false} axisLine={false} type="number" />
          <ZAxis range={[60, 60]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.map((item) => (
            <Scatter
              key={item.key}
              name={item.label}
              data={item.data}
              fill={`var(--color-${item.key})`}
            />
          ))}
        </RechartsScatterChart>
      </ChartContainer>
    </div>
  );
}
