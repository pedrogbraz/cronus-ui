"use client";

import { SpinningText } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "orbit",
    title: "Orbit",
    description:
      "The phrase is laid out around a circle. Assistive tech reads the original string once.",
    code: `<SpinningText radius={56}>cronus ui · product · </SpinningText>`,
    preview: <SpinningText radius={56}>cronus ui · product · </SpinningText>,
  },
];

/** Stacked list view for `/components/spinning-text`; loaded on its own by the premium family. */
export default function SpinningTextExamples() {
  return <ExampleList examples={examples} />;
}
