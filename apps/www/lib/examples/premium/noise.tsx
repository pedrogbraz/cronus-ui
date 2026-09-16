"use client";

import { Noise } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "grain",
    title: "Film grain",
    description: "A still SVG turbulence overlay. No animation — analog depth, not flicker.",
    code: `<Noise className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Print</p>
</Noise>`,
    preview: (
      <Noise className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Print</p>
      </Noise>
    ),
  },
];

/** Stacked list view for `/components/noise`; loaded on its own by the premium family. */
export default function NoiseExamples() {
  return <ExampleList examples={examples} />;
}
