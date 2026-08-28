"use client";

import { ComposedChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { TIMESERIES } from "./charts.sample-data";

export default function ComposedChartDemo() {
  return (
    <ChartFrame className="h-64" label="Composed chart of area, bar, and line on one time axis.">
      <ComposedChart
        className="h-full"
        data={TIMESERIES}
        series={[
          { key: "costs", label: "Run rate", type: "area" },
          { key: "units", label: "Units", type: "bar" },
          { key: "revenue", label: "Revenue", type: "line" },
        ]}
      />
    </ChartFrame>
  );
}
