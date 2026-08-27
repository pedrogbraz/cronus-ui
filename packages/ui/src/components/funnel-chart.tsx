import type { HTMLAttributes } from "react";
import { Funnel, LabelList, FunnelChart as RechartsFunnelChart } from "recharts";
import { cn } from "../lib/cn.js";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart.js";

export interface FunnelChartItem {
  stage: string;
  value: number;
  key: string;
}

export interface FunnelChartProps extends HTMLAttributes<HTMLDivElement> {
  data: FunnelChartItem[];
}

export function FunnelChart({ data, className, ...props }: FunnelChartProps) {
  const config: ChartConfig = {};
  for (const [index, item] of data.entries()) {
    config[item.key] = {
      label: item.stage,
      color: `var(--cronus-chart-${(index % 5) + 1})`,
    };
  }
  const rows = data.map((item) => ({ ...item, fill: `var(--color-${item.key})` }));

  return (
    <div data-slot="funnel-chart" className={cn("h-64 w-full", className)} {...props}>
      <ChartContainer config={config} className="h-full w-full">
        <RechartsFunnelChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Funnel data={rows} dataKey="value" nameKey="stage" isAnimationActive>
            <LabelList dataKey="stage" position="right" className="fill-fg text-xs" />
          </Funnel>
        </RechartsFunnelChart>
      </ChartContainer>
    </div>
  );
}
