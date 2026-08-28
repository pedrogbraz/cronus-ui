"use client";

import { Area, AreaChart, ChartTooltip, Grid, XAxis } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { AREA_DATES } from "./charts.sample-data";

export default function AreaChartDemo() {
  return (
    <ChartFrame label="Area chart of revenue over thirty days.">
      <AreaChart animationDuration={1100} data={AREA_DATES}>
        <Grid horizontal />
        <Area dataKey="revenue" fadeEdges fill="var(--chart-line-primary)" fillOpacity={0.3} />
        <XAxis />
        <ChartTooltip />
      </AreaChart>
    </ChartFrame>
  );
}
