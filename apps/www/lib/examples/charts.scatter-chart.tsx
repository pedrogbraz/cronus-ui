"use client";

import { ScatterChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { SCATTER } from "./charts.sample-data";

export default function ScatterChartDemo() {
  const search = SCATTER.filter((row) => row.channel === "Search").map((row) => ({
    x: row.reach,
    y: row.conv,
  }));
  const social = SCATTER.filter((row) => row.channel === "Social").map((row) => ({
    x: row.reach,
    y: row.conv,
  }));

  return (
    <ChartFrame className="h-64" label="Scatter chart of reach versus conversion for two channels.">
      <ScatterChart
        className="h-full"
        series={[
          { key: "Search", label: "Search", data: search },
          { key: "Social", label: "Social", data: social },
        ]}
      />
    </ChartFrame>
  );
}
