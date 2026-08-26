import { GITHUB_URL, OSS_URL } from "../lib/origins";

export function LicenseSection() {
  return (
    <section
      id="license"
      aria-labelledby="license-heading"
      className="scroll-mt-24 border-t border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-raised p-8 sm:p-10">
          <h2
            id="license-heading"
            className="font-display text-3xl font-normal tracking-[-0.02em] text-fg"
          >
            First public license — not billed yet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-secondary">
            No Stripe on this preview. When we publish, Pro is a perpetual seat for the pack plus
            support. The MIT engine does not move behind a paywall. Looks stay free.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={OSS_URL}
              className="inline-flex items-center rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
            >
              Start with OSS SaaS
            </a>
            <a
              href={GITHUB_URL}
              className="inline-flex items-center rounded-xl border border-border bg-surface-inset px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
            >
              Watch the repo
            </a>
            <a
              href={`${OSS_URL}/#looks`}
              className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Looks stay free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
