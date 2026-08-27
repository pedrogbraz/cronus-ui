import type { HTMLAttributes } from "react";
import { Sankey, Tooltip } from "recharts";
import { cn } from "../lib/cn.js";
import { ChartContainer } from "./chart.js";

export interface SankeyChartData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

export interface SankeyChartProps extends HTMLAttributes<HTMLDivElement> {
  data: SankeyChartData;
}

export function SankeyChart({ data, className, ...props }: SankeyChartProps) {
  return (
    <div data-slot="sankey-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer
        config={{ flow: { label: "Flow", color: "var(--cronus-chart-1)" } }}
        className="h-full w-full"
      >
        <Sankey data={data} nodePadding={16} nodeWidth={12} linkCurvature={0.5} iterations={32}>
          <Tooltip />
        </Sankey>
      </ChartContainer>
    </div>
  );
}
