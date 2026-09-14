"use client";

import { DotPattern } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "field",
    title: "Dotted field",
    description: "A faint SVG dotted field. Colour inherits currentColor from the wrapper.",
    code: `<DotPattern className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Quiet texture</p>
</DotPattern>`,
    preview: (
      <DotPattern className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Quiet texture</p>
      </DotPattern>
    ),
  },
];

/** Stacked list view for `/components/dot-pattern`; loaded on its own by the premium family. */
export default function DotPatternExamples() {
  return <ExampleList examples={examples} />;
}
