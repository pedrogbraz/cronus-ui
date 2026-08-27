import { ArrowRight, Coffee } from "lucide-react";
import Link from "next/link";
import { Eyebrow, SectionGlow } from "../showcase-ui";

/** Quiet homepage ask — OSS stays free; this is optional. */
export function SponsorBand() {
  return (
    <section aria-labelledby="sponsor-heading" className="relative">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <Eyebrow>Sponsor</Eyebrow>
            <h2
              id="sponsor-heading"
              className="mt-3 font-display text-2xl font-normal tracking-[-0.02em] text-fg"
            >
              Buy Cronus a coffee
            </h2>
            <p className="mt-2 text-sm leading-6 text-fg-secondary">
              The engine is free. If it helped you ship, you can leave any amount — one-time, no
              paywall.
            </p>
          </div>
          <Link
            href="/sponsor"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Coffee className="size-4 text-fg-tertiary" aria-hidden="true" />
            Choose an amount
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
