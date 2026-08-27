"use client";

import { Bar, BarChart, BarXAxis, ChartTooltip, Grid } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { MONTHS } from "./charts.sample-data";

export default function BarChartDemo() {
  return (
    <ChartFrame label="Bar chart of revenue and profit from January to June.">
      <BarChart data={MONTHS} xDataKey="month">
        <Grid horizontal />
        <Bar dataKey="revenue" fill="var(--chart-line-primary)" lineCap="round" />
        <Bar dataKey="profit" fill="var(--chart-line-secondary)" lineCap="round" />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </ChartFrame>
  );
}
