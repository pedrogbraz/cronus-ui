"use client";

import { StarBorder } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "twinkle",
    title: "Twinkle border",
    description:
      "Two sparkle heads chase each other around the perimeter. Distinct from BorderBeam, which is a comet trail.",
    code: `<StarBorder className="rounded-2xl border border-border bg-surface-raised p-8">
  <p className="font-display text-xl text-fg">Featured</p>
</StarBorder>`,
    preview: (
      <StarBorder className="w-full max-w-sm rounded-2xl border border-border bg-surface-raised p-8">
        <p className="font-display text-xl text-fg">Featured</p>
      </StarBorder>
    ),
  },
];

/** Stacked list view for `/components/star-border`; loaded on its own by the premium family. */
export default function StarBorderExamples() {
  return <ExampleList examples={examples} />;
}
