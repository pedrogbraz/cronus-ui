"use client";

import { SunburstChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";

export default function SunburstChartDemo() {
  return (
    <ChartFrame className="h-64" label="Sunburst chart of revenue by product line.">
      <SunburstChart
        className="h-full"
        data={[
          {
            name: "Product",
            value: 48,
            children: [
              { name: "App", value: 28 },
              { name: "API", value: 20 },
            ],
          },
          {
            name: "Services",
            value: 32,
            children: [
              { name: "Support", value: 18 },
              { name: "Consulting", value: 14 },
            ],
          },
        ]}
      />
    </ChartFrame>
  );
}
