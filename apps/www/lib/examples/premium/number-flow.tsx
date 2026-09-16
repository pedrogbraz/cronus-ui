"use client";

import { Button, NumberFlow, type NumberFlowFormat } from "@cronus-ui/ui";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/** Currency NumberFlow whose ones place rolls on each increment. */
function NumberFlowDemo() {
  const [value, setValue] = useState(19348.43);
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <NumberFlow
        value={value}
        prefix="$"
        format="currency"
        reducedMotion="never"
        className="font-display text-5xl tracking-[-0.03em] text-fg"
      />
      <Button size="sm" variant="outline" onClick={() => setValue((current) => current + 1)}>
        Update value
      </Button>
    </div>
  );
}

const NUMBER_FLOW_SAMPLES: Array<{
  value: number;
  format: NumberFlowFormat;
  prefix?: string;
  suffix?: string;
  locale?: string;
}> = [
  { value: 12345, format: "number" },
  { value: 19348.43, format: "currency", prefix: "$" },
  { value: 0.42, format: "percentage" },
  { value: 1234.5, format: "decimal" },
  { value: 19348.43, format: "currency", prefix: "€", locale: "de-DE" },
];

function NumberFlowShuffleDemo() {
  const [sample, setSample] = useState(0);
  const current = NUMBER_FLOW_SAMPLES[sample] ?? {
    value: 12345,
    format: "number",
  };
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <NumberFlow
        value={current.value}
        prefix={current.prefix}
        suffix={current.suffix}
        format={current.format}
        locale={current.locale}
        reducedMotion="never"
        className="font-display text-5xl tracking-[-0.03em] text-fg"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => setSample((index) => (index + 1) % NUMBER_FLOW_SAMPLES.length)}
      >
        <RotateCw aria-hidden="true" className="size-4" />
        Shuffle format
      </Button>
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "flow",
    title: "Digit flow",
    description:
      "Each digit rolls the short way to the next value — grouping, prefix and suffix stay put. Shuffle through number, currency, percent and decimal.",
    code: `<NumberFlow value={12345} className="font-display text-5xl text-fg" />`,
    preview: <NumberFlowShuffleDemo />,
  },
  {
    id: "currency",
    title: "Currency",
    description:
      "Two fraction digits, prefix for the symbol. Click to increment and watch the ones place roll.",
    code: `function Revenue() {
  const [value, setValue] = useState(19348.43);
  return (
    <div className="flex flex-col items-center gap-4">
      <NumberFlow
        value={value}
        prefix="$"
        format="currency"
        className="font-display text-5xl text-fg"
      />
      <Button size="sm" variant="outline" onClick={() => setValue((n) => n + 1)}>
        Update value
      </Button>
    </div>
  );
}`,
    preview: <NumberFlowDemo />,
  },
];

/** Stacked list view for `/components/number-flow`; loaded on its own by the premium family. */
export default function NumberFlowExamples() {
  return <ExampleList examples={examples} />;
}
