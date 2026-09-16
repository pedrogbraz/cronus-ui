"use client";

import { WordRotate } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "cycle",
    title: "Word cycle",
    description:
      "Cycles through a list of words with a vertical swap. A polite live region announces the current word.",
    code: `<p className="font-display text-3xl text-fg">
  Ship <WordRotate words={["faster", "calmer", "on-brand"]} />.
</p>`,
    preview: (
      <p className="font-display text-3xl text-fg">
        Ship <WordRotate words={["faster", "calmer", "on-brand"]} />.
      </p>
    ),
  },
];

/** Stacked list view for `/components/word-rotate`; loaded on its own by the premium family. */
export default function WordRotateExamples() {
  return <ExampleList examples={examples} />;
}
