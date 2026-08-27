import type { HTMLAttributes } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart } from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface RadarChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  angleKey?: string;
  series: ChartSeries[];
}

export function RadarChart({
  data,
  angleKey = "metric",
  series,
  className,
  ...props
}: RadarChartProps) {
  const config = chartSeriesConfig(series);

  return (
    <div data-slot="radar-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey={angleKey} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.map((item) => (
            <Radar
              key={item.key}
              dataKey={item.key}
              stroke={`var(--color-${item.key})`}
              fill={`var(--color-${item.key})`}
              fillOpacity={0.25}
            />
          ))}
        </RechartsRadarChart>
      </ChartContainer>
    </div>
  );
}
