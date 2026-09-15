"use client";

import { Highlighter } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "mark",
    title: "Marker",
    description:
      "A marker stroke draws in behind a phrase. The words stay in the accessibility tree; the mark is decorative.",
    code: `<p className="font-display text-3xl text-fg">
  Build the <Highlighter>product surface</Highlighter> first.
</p>`,
    preview: (
      <p className="font-display text-3xl text-fg">
        Build the <Highlighter>product surface</Highlighter> first.
      </p>
    ),
  },
];

/** Stacked list view for `/components/highlighter`; loaded on its own by the premium family. */
export default function HighlighterExamples() {
  return <ExampleList examples={examples} />;
}
