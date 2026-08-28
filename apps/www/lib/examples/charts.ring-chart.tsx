"use client";

import { RingChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";

const ROWS = [
  { key: "email", value: 42 },
  { key: "social", value: 28 },
  { key: "direct", value: 18 },
  { key: "other", value: 12 },
];

const SERIES = [
  { key: "email", label: "Email" },
  { key: "social", label: "Social" },
  { key: "direct", label: "Direct" },
  { key: "other", label: "Other" },
];

export default function RingChartDemo() {
  return (
    <ChartFrame className="h-64" label="Ring chart of channel mix.">
      <RingChart className="h-full" data={ROWS} series={SERIES} centerLabel="Channels" />
    </ChartFrame>
  );
}
