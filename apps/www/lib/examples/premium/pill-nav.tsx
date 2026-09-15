"use client";

import { PillNav } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "pills",
    title: "Sliding pill",
    description:
      "A compact nav row whose active item is marked by a sliding pill. Arrow keys move selection.",
    code: `<PillNav
  aria-label="Product sections"
  items={[
    { value: "overview", label: "Overview" },
    { value: "pricing", label: "Pricing" },
    { value: "docs", label: "Docs" },
  ]}
/>`,
    preview: (
      <PillNav
        aria-label="Product sections"
        items={[
          { value: "overview", label: "Overview" },
          { value: "pricing", label: "Pricing" },
          { value: "docs", label: "Docs" },
        ]}
      />
    ),
  },
];

/** Stacked list view for `/components/pill-nav`; loaded on its own by the premium family. */
export default function PillNavExamples() {
  return <ExampleList examples={examples} />;
}
