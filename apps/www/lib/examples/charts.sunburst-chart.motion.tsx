"use client";

import {
  buildArcs,
  SunburstBreadcrumb,
  SunburstCenter,
  SunburstChart,
  SunburstHint,
  SunburstLabels,
  SunburstSegment,
  useSunburstBreadcrumbItems,
} from "@cronus-ui/ui/charts";
import { useEffect, useMemo, useState } from "react";
import { ChartFrame } from "./charts.frame";
import { SUNBURST_TREE } from "./charts.sample-data";

function DrillBreadcrumb() {
  const { items, zoomTo } = useSunburstBreadcrumbItems();
  return (
    <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-tertiary">
      {items.map((item, index) => (
        <li className="flex items-center gap-1" key={item.id}>
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.isCurrent ? (
            <span className="text-fg">{item.label}</span>
          ) : (
            <button className="hover:text-fg" onClick={() => zoomTo(item.id)} type="button">
              {item.label}
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function SunburstChartDemo() {
  const { arcs, rootId } = useMemo(() => buildArcs(SUNBURST_TREE), []);
  const [focusId, setFocusId] = useState(rootId);

  useEffect(() => {
    setFocusId(rootId);
  }, [rootId]);

  return (
    <ChartFrame label="Sunburst chart of revenue by product line.">
      <SunburstChart
        className="mx-auto"
        data={SUNBURST_TREE}
        focusId={focusId}
        onFocusChange={setFocusId}
        size={360}
      >
        <SunburstBreadcrumb>
          <DrillBreadcrumb />
        </SunburstBreadcrumb>
        {arcs.map((arc) => (
          <SunburstSegment index={arc.arcIndex} key={arc.id} />
        ))}
        <SunburstCenter />
        <SunburstLabels />
        <SunburstHint />
      </SunburstChart>
    </ChartFrame>
  );
}
