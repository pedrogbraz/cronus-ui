"use client";

import { GridPattern } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "field",
    title: "Grid field",
    description: "A faint SVG grid behind content. Colour inherits currentColor.",
    code: `<GridPattern className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Blueprint</p>
</GridPattern>`,
    preview: (
      <GridPattern className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Blueprint</p>
      </GridPattern>
    ),
  },
];

/** Stacked list view for `/components/grid-pattern`; loaded on its own by the premium family. */
export default function GridPatternExamples() {
  return <ExampleList examples={examples} />;
}
