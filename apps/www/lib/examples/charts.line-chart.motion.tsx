"use client";

import { ChartTooltip, Grid, Line, LineChart, XAxis } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { LINE_DATES } from "./charts.sample-data";

export default function LineChartDemo() {
  return (
    <ChartFrame label="Line chart of users and pageviews over thirty days.">
      <LineChart data={LINE_DATES}>
        <Grid horizontal />
        <Line dataKey="users" stroke="var(--chart-line-primary)" />
        <Line dataKey="pageviews" stroke="var(--chart-line-secondary)" />
        <XAxis />
        <ChartTooltip />
      </LineChart>
    </ChartFrame>
  );
}
