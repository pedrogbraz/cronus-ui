"use client";

import { GradientText } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "headline",
    title: "Headline",
    description:
      "Use `asChild` to clip your own heading element to a primary→foreground fade — the typography stays yours, the fill follows the theme.",
    code: `<GradientText asChild>
  <h3 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
    Design that themes itself
  </h3>
</GradientText>`,
    preview: (
      <GradientText asChild>
        <h3 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Design that themes itself
        </h3>
      </GradientText>
    ),
  },
];

/** Stacked list view for `/components/gradient-text`; loaded on its own by the premium family. */
export default function GradientTextExamples() {
  return <ExampleList examples={examples} />;
}
