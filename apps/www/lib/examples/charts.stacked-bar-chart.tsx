"use client";

import { BarChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { MONTHS } from "./charts.sample-data";

export default function StackedBarChartDemo() {
  return (
    <ChartFrame
      className="h-64"
      label="Stacked bar of desktop and mobile sessions from January to June."
    >
      <BarChart
        className="h-full"
        data={MONTHS}
        stacked
        series={[
          { key: "desktop", label: "Desktop" },
          { key: "mobile", label: "Mobile" },
        ]}
      />
    </ChartFrame>
  );
}
