import { ArrowRight } from "lucide-react";
import { GITHUB_URL, OSS_URL } from "../lib/origins";
import { SectionGlow } from "./showcase-ui";

export function LicenseSection() {
  return (
    <section id="license" aria-labelledby="license-heading" className="relative scroll-mt-20">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="rounded-2xl border border-border bg-surface-raised px-6 py-14 text-center sm:px-12">
          <h2
            id="license-heading"
            className="font-display text-3xl tracking-[-0.025em] sm:text-4xl"
          >
            First public license — not billed yet
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-fg-secondary">
            No Stripe on this preview. When we publish, Pro is a perpetual seat for the pack plus
            support. The MIT engine does not move behind a paywall. Looks stay free.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={OSS_URL}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Start with OSS SaaS
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href={GITHUB_URL}
              className="inline-flex items-center rounded-full border border-border bg-surface-raised px-5 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
            >
              Watch the repo
            </a>
            <a
              href={`${OSS_URL}/#looks`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Looks stay free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
