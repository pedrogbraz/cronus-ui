"use client";

import { SparklesText } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "twinkle",
    title: "Sparkles",
    description: "Twinkling sparkles around a phrase. Hidden under reduced motion.",
    code: `<SparklesText className="font-display text-4xl text-fg">Launch</SparklesText>`,
    preview: <SparklesText className="font-display text-4xl text-fg">Launch</SparklesText>,
  },
];

/** Stacked list view for `/components/sparkles-text`; loaded on its own by the premium family. */
export default function SparklesTextExamples() {
  return <ExampleList examples={examples} />;
}
