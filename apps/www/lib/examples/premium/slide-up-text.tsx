"use client";

import { SlideUpText } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "words",
    title: "By words",
    description:
      "Each word clips up from below on a 0.5s tween, staggered from the first. The full string stays in the a11y tree via an sr-only copy.",
    code: `<SlideUpText className="font-display text-3xl text-fg">
  You can just ship things.
</SlideUpText>`,
    preview: (
      <SlideUpText className="font-display text-3xl text-fg">You can just ship things.</SlideUpText>
    ),
  },
  {
    id: "characters",
    title: "By characters",
    description: "Same clip, staggered per grapheme so emoji and flags stay whole.",
    code: `<SlideUpText split="characters" className="font-display text-3xl text-fg">
  You just can ship things.
</SlideUpText>`,
    preview: (
      <SlideUpText split="characters" className="font-display text-3xl text-fg">
        You just can ship things.
      </SlideUpText>
    ),
  },
  {
    id: "lines",
    title: "By lines",
    description: "Split on newlines and stack each line as its own clip.",
    code: `<SlideUpText split="lines" className="font-display text-3xl text-fg">
  First line
  Second line
  Third line
</SlideUpText>`,
    preview: (
      <SlideUpText split="lines" className="font-display text-3xl text-fg">
        {"First line\nSecond line\nThird line"}
      </SlideUpText>
    ),
  },
  {
    id: "from-last",
    title: "From last",
    description: "Stagger runs from the last word back to the first.",
    code: `<SlideUpText from="last" className="font-display text-3xl text-fg">
  Animation from last word
</SlideUpText>`,
    preview: (
      <SlideUpText from="last" className="font-display text-3xl text-fg">
        Animation from last word
      </SlideUpText>
    ),
  },
];

/** Stacked list view for `/components/slide-up-text`; loaded on its own by the premium family. */
export default function SlideUpTextExamples() {
  return <ExampleList examples={examples} />;
}
