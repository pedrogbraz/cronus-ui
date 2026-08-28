"use client";

import { FunnelChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { FUNNEL } from "./charts.sample-data";

export default function FunnelChartDemo() {
  return (
    <ChartFrame className="h-64" label="Funnel chart from visit to retain.">
      <FunnelChart
        className="h-full"
        data={FUNNEL.map((row) => ({
          stage: row.stage,
          value: row.value,
          key: row.stage.toLowerCase(),
        }))}
      />
    </ChartFrame>
  );
}
