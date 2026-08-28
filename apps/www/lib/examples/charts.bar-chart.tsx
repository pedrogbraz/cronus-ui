"use client";

import { BarChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { MONEY, MONTHS } from "./charts.sample-data";

export default function BarChartDemo() {
  return (
    <ChartFrame className="h-64" label="Bar chart of revenue and profit from January to June.">
      <BarChart
        className="h-full"
        data={MONTHS}
        series={[
          { key: "revenue", label: "Revenue" },
          { key: "profit", label: "Profit" },
        ]}
        formatValue={(value) => MONEY.format(value)}
      />
    </ChartFrame>
  );
}
