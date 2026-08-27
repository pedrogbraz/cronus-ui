"use client";

import {
  defaultRadarColors,
  Legend,
  LegendItemComponent,
  LegendLabel,
  LegendMarker,
  RadarArea,
  RadarAxis,
  RadarChart,
  RadarGrid,
  RadarLabels,
} from "@cronus-ui/ui/charts";
import { useState } from "react";
import { ChartFrame } from "./charts.frame";
import { RADAR_METRICS, RADAR_ROWS } from "./charts.sample-data";

const LEGEND = RADAR_ROWS.map((row, index) => ({
  label: row.label,
  value: 1,
  color: defaultRadarColors[index % defaultRadarColors.length] ?? "var(--chart-1)",
}));

export default function RadarChartDemo() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
      <ChartFrame className="size-[320px] shrink-0" label="Radar chart comparing product metrics.">
        <RadarChart
          data={RADAR_ROWS}
          hoveredIndex={hoveredIndex}
          metrics={RADAR_METRICS}
          onHoverChange={setHoveredIndex}
          size={320}
        >
          <RadarGrid />
          <RadarAxis />
          <RadarLabels fontSize={10} offset={16} />
          {RADAR_ROWS.map((row, index) => (
            <RadarArea index={index} key={row.label} />
          ))}
        </RadarChart>
      </ChartFrame>
      <Legend
        className="min-w-[10rem]"
        hoveredIndex={hoveredIndex}
        items={LEGEND}
        onHoverChange={setHoveredIndex}
        title="Series"
        titleClassName="text-sm"
      >
        <LegendItemComponent className="flex items-center gap-3">
          <LegendMarker />
          <LegendLabel className="flex-1" />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
