"use client";

import { ScrollProgress } from "@cronus-ui/ui";
import { useRef } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

function ScrollProgressDemo() {
  const ref = useRef<HTMLElement>(null);
  return (
    <div className="flex w-full max-w-md items-start gap-4">
      {/* A <section> with an aria-label is a named, scrollable region; it must be
          keyboard-focusable (axe scrollable-region-focusable). */}
      <section
        ref={ref}
        aria-label="Release notes, scrollable"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable (WCAG / axe scrollable-region-focusable)
        tabIndex={0}
        className="relative h-64 flex-1 overflow-y-auto rounded-lg border border-border bg-surface-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ScrollProgress target={ref} className="sticky top-0 z-10" />
        <div className="space-y-4 p-4">
          <h4 className="text-sm font-semibold text-fg">Release notes</h4>
          {Array.from({ length: 12 }).map((_, paragraph) => (
            <p
              // biome-ignore lint/suspicious/noArrayIndexKey: static, never-reordered filler text
              key={paragraph}
              className="text-sm text-fg-secondary"
            >
              Scroll this panel to advance the bar above and the ring beside it. Both read from the
              same container ref, so they stay perfectly in sync without tracking the page itself.
            </p>
          ))}
        </div>
      </section>
      <ScrollProgress variant="circle" target={ref} size={48} />
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "reading-bar",
    title: "Reading bar & ring",
    description:
      "Pass a `target` ref to scope progress to a scroll container instead of the page. The `bar` variant pins to the top of the box; the `circle` variant reads the same ref so a sticky reading bar and a progress ring stay in sync.",
    code: `function ScrollProgressDemo() {
  const ref = useRef<HTMLElement>(null);
  return (
    <div className="flex items-start gap-4">
      {/* A named <section> is a scrollable region; keep it keyboard-focusable. */}
      <section ref={ref} tabIndex={0} aria-label="Release notes, scrollable" className="relative h-64 overflow-y-auto rounded-lg border">
        <ScrollProgress target={ref} className="sticky top-0 z-10" />
        <div className="space-y-4 p-4">
          {/* …tall content… */}
        </div>
      </section>
      <ScrollProgress variant="circle" target={ref} size={48} />
    </div>
  );
}`,
    preview: <ScrollProgressDemo />,
  },
];

/** Stacked list view for `/components/scroll-progress`; loaded on its own by the premium family. */
export default function ScrollProgressExamples() {
  return <ExampleList examples={examples} />;
}
