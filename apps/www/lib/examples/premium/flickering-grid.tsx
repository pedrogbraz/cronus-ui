"use client";

import { FlickeringGrid } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "signal",
    title: "Signal grid",
    description:
      "Cells flicker on independent, index-derived timings so SSR and the client match. Reduced-motion visitors get a still, faint grid.",
    code: `<FlickeringGrid className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Signal</p>
</FlickeringGrid>`,
    preview: (
      <FlickeringGrid className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Signal</p>
      </FlickeringGrid>
    ),
  },
];

/** Stacked list view for `/components/flickering-grid`; loaded on its own by the premium family. */
export default function FlickeringGridExamples() {
  return <ExampleList examples={examples} />;
}
