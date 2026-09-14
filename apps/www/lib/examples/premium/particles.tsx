"use client";

import { Particles } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "field",
    title: "Drifting field",
    description: "A calm 2D particle field. Canvas-only, no WebGL. Undrawn under reduced motion.",
    code: `<Particles className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Atmosphere</p>
</Particles>`,
    preview: (
      <Particles className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Atmosphere</p>
      </Particles>
    ),
  },
];

/** Stacked list view for `/components/particles`; loaded on its own by the premium family. */
export default function ParticlesExamples() {
  return <ExampleList examples={examples} />;
}
