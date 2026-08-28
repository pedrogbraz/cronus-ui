import type { HTMLAttributes } from "react";
import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface PieChartItem {
  key: string;
  value: number;
}

export interface PieChartProps extends HTMLAttributes<HTMLDivElement> {
  data: PieChartItem[];
  series: ChartSeries[];
}

export function PieChart({ data, series, className, ...props }: PieChartProps) {
  const config = chartSeriesConfig(series);
  const rows = data.map((item) => ({
    ...item,
    fill: `var(--color-${item.key})`,
  }));

  return (
    <div data-slot="pie-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsPieChart accessibilityLayer>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={rows} dataKey="value" nameKey="key" strokeWidth={0}>
            {rows.map((item) => (
              <Cell key={item.key} fill={item.fill} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ChartContainer>
    </div>
  );
}
