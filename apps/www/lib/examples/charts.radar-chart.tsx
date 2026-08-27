"use client";

import { RadarChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { RADAR_METRICS_TABLE } from "./charts.sample-data";

export default function RadarChartDemo() {
  return (
    <ChartFrame className="h-64" label="Radar chart comparing current versus target metrics.">
      <RadarChart
        className="h-full"
        data={RADAR_METRICS_TABLE}
        series={[
          { key: "current", label: "Current" },
          { key: "target", label: "Target" },
        ]}
      />
    </ChartFrame>
  );
}
