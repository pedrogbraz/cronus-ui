"use client";

import { LineChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { MONEY, TIMESERIES } from "./charts.sample-data";

export default function LineChartDemo() {
  return (
    <ChartFrame className="h-64" label="Line chart of revenue versus costs from Jul 29 to Aug 27.">
      <LineChart
        className="h-full"
        data={TIMESERIES}
        series={[
          { key: "revenue", label: "Revenue" },
          { key: "costs", label: "Costs" },
        ]}
        formatValue={(value) => MONEY.format(value)}
      />
    </ChartFrame>
  );
}
