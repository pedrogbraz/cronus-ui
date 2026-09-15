"use client";

import { TypingText } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "typewriter",
    title: "Typewriter",
    description:
      "Types, pauses, deletes, and moves to the next phrase. Reduced-motion visitors see the first phrase in full.",
    code: `<TypingText
  className="font-display text-3xl text-fg"
  text={["Design systems.", "Product surfaces.", "Copy you can upgrade."]}
/>`,
    preview: (
      <TypingText
        className="font-display text-3xl text-fg"
        text={["Design systems.", "Product surfaces.", "Copy you can upgrade."]}
      />
    ),
  },
];

/** Stacked list view for `/components/typing-text`; loaded on its own by the premium family. */
export default function TypingTextExamples() {
  return <ExampleList examples={examples} />;
}
