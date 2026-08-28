"use client";

import { ChartTooltip, Grid, Scatter, ScatterChart, XAxis } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { SCATTER_DATES } from "./charts.sample-data";

export default function ScatterChartDemo() {
  return (
    <ChartFrame label="Scatter chart of sessions versus conversions.">
      <ScatterChart data={SCATTER_DATES}>
        <Grid horizontal />
        <Scatter dataKey="sessions" />
        <Scatter dataKey="conversions" />
        <XAxis />
        <ChartTooltip />
      </ScatterChart>
    </ChartFrame>
  );
}
