"use client";

import { LiveLineChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { LIVE_SEED } from "./charts.sample-data";

export default function LiveLineChartDemo() {
  return (
    <ChartFrame
      className="h-64"
      label="Live line chart of requests per second, appending a point about once a second."
    >
      <LiveLineChart className="h-full" data={LIVE_SEED} />
    </ChartFrame>
  );
}
