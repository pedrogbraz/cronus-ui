"use client";

import { FunnelChart } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";
import { FUNNEL_STAGES } from "./charts.sample-data";

export default function FunnelChartDemo() {
  return (
    <ChartFrame label="Funnel chart from visitors to closed.">
      <FunnelChart color="var(--chart-1)" data={FUNNEL_STAGES} layers={3} />
    </ChartFrame>
  );
}
