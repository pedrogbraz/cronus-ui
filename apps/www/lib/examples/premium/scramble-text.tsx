"use client";

import { ScrambleText } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "decrypt",
    title: "Decrypt",
    description:
      "Random glyphs lock in left-to-right. Assistive tech gets the resolved phrase immediately.",
    code: `<ScrambleText className="font-display text-3xl text-fg">cronus-ui</ScrambleText>`,
    preview: <ScrambleText className="font-display text-3xl text-fg">cronus-ui</ScrambleText>,
  },
];

/** Stacked list view for `/components/scramble-text`; loaded on its own by the premium family. */
export default function ScrambleTextExamples() {
  return <ExampleList examples={examples} />;
}
