"use client";

import { Gauge } from "@cronus-ui/ui/charts";
import { ChartFrame } from "./charts.frame";

export default function GaugeChartDemo() {
  return (
    <ChartFrame label="Gauge chart of annual recurring revenue run rate.">
      <div className="mx-auto w-full min-w-[300px] max-w-lg py-4">
        <Gauge
          centerValue={428_000}
          defaultLabel="ARR run rate"
          formatOptions={{
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }}
          inactiveFillOpacity={0.4}
          spacing={25}
          value={66}
        />
      </div>
    </ChartFrame>
  );
}
