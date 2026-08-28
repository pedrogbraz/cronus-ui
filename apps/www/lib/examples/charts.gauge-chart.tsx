"use client";

import { GaugeChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";

export default function GaugeChartDemo() {
  return (
    <ChartFrame className="h-64" label="Gauge chart showing a score of 72.">
      <GaugeChart className="h-full" value={72} label="Health" />
    </ChartFrame>
  );
}
