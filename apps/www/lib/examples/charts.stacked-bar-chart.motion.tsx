"use client";

import { Bar, BarChart, BarXAxis, ChartTooltip, Grid } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { MONTHS } from "./charts.sample-data";

export default function StackedBarChartDemo() {
  return (
    <ChartFrame label="Stacked bar of desktop and mobile sessions from January to June.">
      <BarChart data={MONTHS} stacked stackGap={3} xDataKey="month">
        <Grid horizontal />
        <Bar dataKey="desktop" fill="var(--chart-line-primary)" lineCap={4} stackGap={3} />
        <Bar dataKey="mobile" fill="var(--chart-line-secondary)" lineCap={4} stackGap={3} />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </ChartFrame>
  );
}
