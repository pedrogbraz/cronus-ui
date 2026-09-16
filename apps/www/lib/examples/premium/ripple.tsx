"use client";

import { Ripple } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "pulse",
    title: "Pulse",
    description:
      "Concentric rings expand from the centre and fade out. Reduced-motion visitors see the surface with no animation.",
    code: `<Ripple className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Now live</p>
</Ripple>`,
    preview: (
      <Ripple className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Now live</p>
      </Ripple>
    ),
  },
];

/** Stacked list view for `/components/ripple`; loaded on its own by the premium family. */
export default function RippleExamples() {
  return <ExampleList examples={examples} />;
}
