"use client";

import { AreaChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { MONEY, TIMESERIES } from "./charts.sample-data";

export default function AreaChartDemo() {
  return (
    <ChartFrame className="h-64" label="Area chart of revenue versus costs from Jul 29 to Aug 27.">
      <AreaChart
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
