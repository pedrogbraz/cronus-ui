import type { HTMLAttributes } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import { cn } from "../lib/cn.js";
import {
  ChartContainer,
  type ChartSeries,
  ChartTooltip,
  ChartTooltipContent,
  chartSeriesConfig,
} from "./chart.js";

export interface RingChartItem {
  key: string;
  value: number;
}

export interface RingChartProps extends HTMLAttributes<HTMLDivElement> {
  data: RingChartItem[];
  series: ChartSeries[];
  centerLabel?: string;
}

const TOTAL = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function RingChart({
  data,
  series,
  centerLabel = "Total",
  className,
  ...props
}: RingChartProps) {
  const config = chartSeriesConfig(series);
  const rows = data.map((item) => ({ ...item, fill: `var(--color-${item.key})` }));
  const sum = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div data-slot="ring-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <PieChart accessibilityLayer>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={rows}
            dataKey="value"
            nameKey="key"
            innerRadius={64}
            outerRadius={98}
            paddingAngle={3}
            strokeWidth={0}
          >
            {rows.map((item) => (
              <Cell key={item.key} fill={item.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-fg text-2xl font-medium">
                      {TOTAL.format(sum)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 20}
                      className="fill-fg-tertiary text-xs"
                    >
                      {centerLabel}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
