"use client";

import { ProfitLossChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";
import { PL_LINE } from "./charts.sample-data";

export default function ProfitLossChartDemo() {
  return (
    <ChartFrame className="h-64" label="Profit and loss line, split at zero.">
      <ProfitLossChart className="h-full" data={PL_LINE} />
    </ChartFrame>
  );
}
