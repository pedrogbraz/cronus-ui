"use client";

import { Shimmer } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "loading-sheen",
    title: "Loading sheen",
    description:
      "Sized skeleton blocks with a sweeping sheen — give each Shimmer explicit height and width to match the content it stands in for.",
    code: `<div className="flex flex-col gap-3">
  <Shimmer className="h-8 w-48 rounded-lg" />
  <Shimmer className="h-4 w-full rounded-md" />
  <Shimmer className="h-4 w-3/4 rounded-md" />
  <Shimmer className="h-10 w-32 rounded-lg" />
</div>`,
    preview: (
      <div className="flex flex-col gap-3">
        <Shimmer className="h-8 w-48 rounded-lg" />
        <Shimmer className="h-4 w-full rounded-md" />
        <Shimmer className="h-4 w-3/4 rounded-md" />
        <Shimmer className="h-10 w-32 rounded-lg" />
      </div>
    ),
  },
];

/** Stacked list view for `/components/shimmer`; loaded on its own by the premium family. */
export default function ShimmerExamples() {
  return <ExampleList examples={examples} />;
}
