"use client";

import { SegmentedControl, SegmentedControlItem } from "@cronus-ui/ui";
import { useState } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/**
 * SegmentedControl: a period filter whose thumb slides between options. The
 * selected value is mirrored below to show the controlled state.
 */
function SegmentedControlDemo() {
  const [period, setPeriod] = useState("30d");
  const labels: Record<string, string> = {
    "7d": "7 dias",
    "30d": "30 dias",
    "12m": "12 meses",
  };
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <SegmentedControl
        value={period}
        onValueChange={setPeriod}
        reducedMotion="never"
        aria-label="Período"
      >
        <SegmentedControlItem value="7d">7 dias</SegmentedControlItem>
        <SegmentedControlItem value="30d">30 dias</SegmentedControlItem>
        <SegmentedControlItem value="12m">12 meses</SegmentedControlItem>
      </SegmentedControl>
      <p className="text-sm text-fg-secondary">
        Período: <span className="font-medium text-fg">{labels[period]}</span>
      </p>
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "single-select",
    title: "Single select",
    description:
      "A thumb that slides between options via a shared layoutId — radiogroup semantics with full arrow-key navigation. Ideal for period filters and view toggles.",
    code: `<SegmentedControl defaultValue="30d" aria-label="Período">
  <SegmentedControlItem value="7d">7 dias</SegmentedControlItem>
  <SegmentedControlItem value="30d">30 dias</SegmentedControlItem>
  <SegmentedControlItem value="12m">12 meses</SegmentedControlItem>
</SegmentedControl>`,
    preview: <SegmentedControlDemo />,
  },
];

/** Stacked list view for `/components/segmented-control`; loaded on its own by the premium family. */
export default function SegmentedControlExamples() {
  return <ExampleList examples={examples} />;
}
