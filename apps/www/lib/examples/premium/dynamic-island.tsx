"use client";

import { DynamicIsland } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "live",
    title: "Live activity",
    description:
      "A compact pill that morphs between views. The dots are a tablist; the shell resizes with a spring.",
    code: `<DynamicIsland
  views={[
    { id: "idle", label: "Idle", content: <span className="text-sm">Cronus</span> },
    {
      id: "now",
      label: "Now playing",
      content: <span className="text-sm">Shipping the surface</span>,
    },
  ]}
/>`,
    preview: (
      <DynamicIsland
        views={[
          { id: "idle", label: "Idle", content: <span className="text-sm">Cronus</span> },
          {
            id: "now",
            label: "Now playing",
            content: <span className="text-sm">Shipping the surface</span>,
          },
        ]}
      />
    ),
  },
];

/** Stacked list view for `/components/dynamic-island`; loaded on its own by the premium family. */
export default function DynamicIslandExamples() {
  return <ExampleList examples={examples} />;
}
