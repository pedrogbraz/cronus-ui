"use client";

import { LightRays } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "shafts",
    title: "Light shafts",
    description:
      "A rotating conic gradient masked into volumetric shafts. Paused under reduced motion.",
    code: `<LightRays className="grid min-h-56 place-items-center rounded-2xl border border-border bg-surface-raised">
  <p className="font-display text-2xl text-fg">Dawn</p>
</LightRays>`,
    preview: (
      <LightRays className="grid min-h-56 w-full place-items-center rounded-2xl border border-border bg-surface-raised">
        <p className="font-display text-2xl text-fg">Dawn</p>
      </LightRays>
    ),
  },
];

/** Stacked list view for `/components/light-rays`; loaded on its own by the premium family. */
export default function LightRaysExamples() {
  return <ExampleList examples={examples} />;
}
