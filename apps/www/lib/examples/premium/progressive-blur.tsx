"use client";

import { ProgressiveBlur } from "@cronus-ui/ui";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

export const examples: Example[] = [
  {
    id: "edge",
    title: "Edge fade",
    description:
      "Stacked backdrop-blur that fades a scroll region into the chrome. Place it over overflowing content.",
    code: `<div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border bg-surface-raised">
  <div className="h-full overflow-y-auto p-4 pb-16">
    <p className="text-sm text-fg-secondary">
      Scroll under the blur. The band is decorative and sits on the edge of the region.
    </p>
    <p className="mt-4 text-sm text-fg-secondary">More copy so the panel actually scrolls.</p>
    <p className="mt-4 text-sm text-fg-secondary">Keep going — the fade holds the last lines.</p>
    <p className="mt-4 text-sm text-fg-secondary">Last line of the stack.</p>
  </div>
  <ProgressiveBlur side="bottom" />
</div>`,
    preview: (
      <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border bg-surface-raised">
        <div className="h-full overflow-y-auto p-4 pb-16">
          <p className="text-sm text-fg-secondary">
            Scroll under the blur. The band is decorative and sits on the edge of the region.
          </p>
          <p className="mt-4 text-sm text-fg-secondary">More copy so the panel actually scrolls.</p>
          <p className="mt-4 text-sm text-fg-secondary">
            Keep going — the fade holds the last lines.
          </p>
          <p className="mt-4 text-sm text-fg-secondary">Last line of the stack.</p>
        </div>
        <ProgressiveBlur side="bottom" />
      </div>
    ),
  },
];

/** Stacked list view for `/components/progressive-blur`; loaded on its own by the premium family. */
export default function ProgressiveBlurExamples() {
  return <ExampleList examples={examples} />;
}
