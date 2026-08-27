import type { HTMLAttributes } from "react";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { cn } from "../lib/cn.js";
import { ChartContainer } from "./chart.js";

export interface GaugeChartProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
  max?: number;
}

export function GaugeChart({
  value,
  label = "Score",
  max = 100,
  className,
  ...props
}: GaugeChartProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const data = [{ name: label, value: clamped, fill: "var(--cronus-chart-1)" }];

  return (
    <div data-slot="gauge-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer
        config={{ [label]: { label, color: "var(--cronus-chart-1)" } }}
        className="h-full w-full"
      >
        <RadialBarChart
          data={data}
          startAngle={210}
          endAngle={-30}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          <RadialBar dataKey="value" background cornerRadius={8} />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-fg text-2xl font-medium"
          >
            {clamped}
          </text>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}
