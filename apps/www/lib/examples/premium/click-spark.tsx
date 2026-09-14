"use client";

import { Button, ClickSpark } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "burst",
    title: "Click burst",
    description: "Click anywhere on the wrapper to emit sparks from the pointer.",
    code: `<ClickSpark className="grid min-h-40 place-items-center rounded-2xl border border-border bg-surface-raised">
  <Button>Click me</Button>
</ClickSpark>`,
    preview: (
      <ClickSpark className="grid min-h-40 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <Button>Click me</Button>
      </ClickSpark>
    ),
  },
];

/** Stacked list view for `/components/click-spark`; loaded on its own by the premium family. */
export default function ClickSparkExamples() {
  return <ExampleList examples={examples} />;
}
