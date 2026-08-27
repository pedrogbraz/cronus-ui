"use client";

import {
  defaultPieColors,
  Legend,
  LegendItemComponent,
  LegendLabel,
  LegendMarker,
  LegendValue,
  PieChart,
  PieSlice,
} from "@cronus-ui/ui/charts";
import { useState } from "react";
import { ChartFrame } from "./charts.frame";
import { PIE_TRAFFIC } from "./charts.sample-data";

const LEGEND = PIE_TRAFFIC.map((item, index) => ({
  label: item.label,
  value: item.value,
  color: defaultPieColors[index % defaultPieColors.length] ?? "var(--chart-1)",
}));

export default function CatalogPieDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
      <ChartFrame className="size-[280px] shrink-0" label="Pie chart of traffic sources.">
        <PieChart
          data={PIE_TRAFFIC}
          hoveredIndex={hoveredIndex}
          onHoverChange={setHoveredIndex}
          size={280}
        >
          {PIE_TRAFFIC.map((item, index) => (
            <PieSlice index={index} key={item.label} />
          ))}
        </PieChart>
      </ChartFrame>
      <Legend
        className="min-w-[12rem]"
        hoveredIndex={hoveredIndex}
        items={LEGEND}
        onHoverChange={setHoveredIndex}
        title="Traffic"
        titleClassName="text-sm"
      >
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
          <LegendValue />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
