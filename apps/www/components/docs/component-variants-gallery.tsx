"use client";

import type { Example } from "../../lib/examples/types";

/**
 * "All states at a glance" grid for a single component — the component-side
 * counterpart to the blocks variations gallery. It renders every documented
 * example's LIVE preview in a responsive card grid so you can compare a
 * component's states without scrolling section by section.
 *
 * Unlike the blocks gallery (which shrinks fixed-width page layouts into
 * non-interactive thumbnails), component demos are small enough to stay fully
 * interactive here — each card is the real, usable component in that state.
 */
export function ComponentVariantsGallery({
  examples,
  displayName,
}: {
  examples: Example[];
  displayName: string;
}) {
  if (examples.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface-inset px-6 py-10 text-center text-sm text-fg-tertiary">
        No gallery states for {displayName} yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {examples.map((example) => (
        <figure
          key={example.id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong"
        >
          <div className="relative flex min-h-[15rem] flex-1 items-center justify-center overflow-auto border-b border-border/60 bg-surface-inset p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--cronus-border)_1px,transparent_1px)] opacity-40 [background-size:18px_18px]"
            />
            <div className="relative flex w-full items-center justify-center">
              {example.preview}
            </div>
          </div>
          <figcaption className="p-5">
            <h3 className="font-display text-base font-medium text-fg">{example.title}</h3>
            {example.description ? (
              <p className="mt-1 line-clamp-2 text-sm text-fg-tertiary">{example.description}</p>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
