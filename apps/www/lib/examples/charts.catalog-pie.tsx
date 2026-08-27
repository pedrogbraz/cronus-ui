"use client";

import { PieChart } from "@cronus-ui/ui";
import { ChartFrame } from "./charts.frame";

const ROWS = [
  { key: "direct", value: 320 },
  { key: "organic", value: 280 },
  { key: "referral", value: 190 },
  { key: "social", value: 140 },
];

const SERIES = [
  { key: "direct", label: "Direct" },
  { key: "organic", label: "Organic" },
  { key: "referral", label: "Referral" },
  { key: "social", label: "Social" },
];

export default function CatalogPieDemo() {
  return (
    <ChartFrame className="h-64" label="Pie chart of traffic sources.">
      <PieChart className="h-full" data={ROWS} series={SERIES} />
    </ChartFrame>
  );
}
