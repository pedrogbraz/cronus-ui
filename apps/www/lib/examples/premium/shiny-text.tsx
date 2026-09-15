"use client";

import { ShinyText } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "sheen",
    title: "Sheen",
    description:
      "A metallic sheen sweeps across live text. Reduced-motion visitors see the resting fill.",
    code: `<ShinyText className="font-display text-4xl">Ship the surface</ShinyText>`,
    preview: <ShinyText className="font-display text-4xl">Ship the surface</ShinyText>,
  },
];

/** Stacked list view for `/components/shiny-text`; loaded on its own by the premium family. */
export default function ShinyTextExamples() {
  return <ExampleList examples={examples} />;
}
