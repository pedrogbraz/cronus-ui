"use client";

import { ImagesBadge } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "folder",
    title: "Folder",
    description:
      "A manila folder that fans up to three preview images on hover, then flattens the front. Same spring as Aceternity (`stiffness: 400`, `damping: 25`).",
    code: `<ImagesBadge
  text="Introducing Agenforce Marketing Template"
  images={[
    "https://assets.aceternity.com/pro/agenforce-1.webp",
    "https://assets.aceternity.com/pro/agenforce-2.webp",
    "https://assets.aceternity.com/pro/agenforce-3.webp",
  ]}
/>`,
    preview: (
      <div className="flex h-40 w-full items-center justify-center">
        <ImagesBadge
          text="Introducing Agenforce Marketing Template"
          images={[
            "https://assets.aceternity.com/pro/agenforce-1.webp",
            "https://assets.aceternity.com/pro/agenforce-2.webp",
            "https://assets.aceternity.com/pro/agenforce-3.webp",
          ]}
        />
      </div>
    ),
  },
];

/** Stacked list view for `/components/images-badge`; loaded on its own by the premium family. */
export default function ImagesBadgeExamples() {
  return <ExampleList examples={examples} />;
}
