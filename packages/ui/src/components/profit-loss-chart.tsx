import type { HTMLAttributes } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis } from "recharts";
import { cn } from "../lib/cn.js";
import { ChartContainer, ChartCursor, ChartTooltip, ChartTooltipContent } from "./chart.js";

export interface ProfitLossPoint {
  month: string;
  pnl: number;
}

export interface ProfitLossChartProps extends HTMLAttributes<HTMLDivElement> {
  data: ProfitLossPoint[];
}

export function ProfitLossChart({ data, className, ...props }: ProfitLossChartProps) {
  return (
    <div data-slot="profit-loss-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer
        config={{ pnl: { label: "P/L", color: "var(--cronus-success)" } }}
        className="h-full w-full"
      >
        <LineChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" />
          <ReferenceLine y={0} stroke="var(--cronus-border)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={12} />
          <ChartTooltip
            cursor={<ChartCursor labelKey="month" />}
            content={<ChartTooltipContent />}
          />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="var(--cronus-success)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
