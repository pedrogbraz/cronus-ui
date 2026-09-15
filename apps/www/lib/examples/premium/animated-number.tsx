"use client";

import { AnimatedNumber, Button, Card, CardContent } from "@cronus-ui/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/**
 * AnimatedNumber: a revenue tile whose value springs to each new total. Click
 * "Nova venda" to add a sale and watch it count up (reduced-motion snaps).
 */
function AnimatedNumberDemo() {
  const [total, setTotal] = useState(12480);
  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-1 p-6 text-center">
          <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Receita do mês
          </span>
          <AnimatedNumber
            value={total}
            locale="pt-BR"
            formatOptions={{ style: "currency", currency: "BRL" }}
            reducedMotion="never"
            className="font-display text-4xl font-semibold text-fg"
          />
        </CardContent>
      </Card>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setTotal((t) => t + 200 + Math.round(Math.random() * 1800))}
      >
        <Plus aria-hidden="true" className="size-4" />
        Nova venda
      </Button>
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "count-up",
    title: "Count up",
    description:
      "Springs toward the target whenever it changes, so a balance or KPI counts up instead of snapping. Honours reduced-motion (snaps) and formats through Intl. Click to add a sale.",
    code: `function Revenue() {
  const [total, setTotal] = useState(12480);
  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedNumber
        value={total}
        locale="pt-BR"
        formatOptions={{ style: "currency", currency: "BRL" }}
        className="font-display text-4xl font-semibold text-fg"
      />
      <Button size="sm" variant="outline" onClick={() => setTotal((t) => t + 850)}>
        Nova venda
      </Button>
    </div>
  );
}`,
    preview: <AnimatedNumberDemo />,
  },
];

/** Stacked list view for `/components/animated-number`; loaded on its own by the premium family. */
export default function AnimatedNumberExamples() {
  return <ExampleList examples={examples} />;
}
