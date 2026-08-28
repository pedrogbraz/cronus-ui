"use client";

import { Button } from "@cronus-ui/ui";
import {
  ChoroplethChart,
  ChoroplethFeatureComponent,
  ChoroplethTooltip,
  useChoroplethZoom,
} from "@cronus-ui/ui/charts";
import { Minus, Plus } from "lucide-react";
import { ChartFrame } from "./charts.frame";
import { useWorldCountries } from "./charts.world-data";

function ZoomControls() {
  const { zoom } = useChoroplethZoom();
  if (!zoom) return null;
  return (
    <div className="absolute right-4 bottom-4 flex flex-col gap-1">
      <Button
        aria-label="Zoom in"
        className="shadow-md"
        onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
        size="icon"
        type="button"
        variant="secondary"
      >
        <Plus />
      </Button>
      <Button
        aria-label="Zoom out"
        className="shadow-md"
        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
        size="icon"
        type="button"
        variant="secondary"
      >
        <Minus />
      </Button>
    </div>
  );
}

export default function ChoroplethChartDemo() {
  const { worldData, isLoading } = useWorldCountries();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center text-sm text-fg-tertiary">
        Loading map…
      </div>
    );
  }

  if (!worldData) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center text-sm text-error-strong">
        Failed to load map data
      </div>
    );
  }

  return (
    <ChartFrame label="Choropleth chart of the world with zoom and hover.">
      <ChoroplethChart aspectRatio="16 / 9" data={worldData} zoomEnabled>
        <ChoroplethFeatureComponent
          fill="var(--chart-scale-03)"
          stroke="var(--chart-background)"
          strokeWidth={0.5}
        />
        <ChoroplethTooltip />
        <ZoomControls />
      </ChoroplethChart>
    </ChartFrame>
  );
}
