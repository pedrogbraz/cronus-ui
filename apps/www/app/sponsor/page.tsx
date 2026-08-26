import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, SectionGlow } from "../../components/showcase-ui";
import { SponsorCard } from "../../components/sponsor/sponsor-card";
import { GITHUB_SPONSORS_URL, SPONSOR_URL } from "../../lib/sponsor";

export const metadata: Metadata = {
  title: "Sponsor — Cronus UI",
  description:
    "Cronus OSS is free. If the engine helped you ship, you can leave a coffee — any amount, one-time.",
};

export default function SponsorPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-16">
      <SectionGlow />

      <header className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Eyebrow>Sponsor</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
            The engine is free.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-fg-secondary">
            Tokens, looks, SaaS, compose, and upgrade stay MIT. If Cronus helped you ship and you
            want to leave a coffee, pick an amount — or type your own.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <SponsorCard />

        <ul className="mt-10 flex flex-col gap-3 text-sm leading-6 text-fg-secondary">
          <li className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-fg-tertiary"
            />
            One-time. Not a subscription. Not a paywall. The catalog does not change if you skip
            this.
          </li>
          <li className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2 size-1.5 shrink-0 rounded-full bg-fg-tertiary"
            />
            Checkout is GitHub Sponsors
            {SPONSOR_URL === GITHUB_SPONSORS_URL ? "" : " (or the rail set for this deploy)"}.
            Custom amounts land on the next page.
          </li>
        </ul>

        <p className="mt-10 text-sm text-fg-tertiary">
          Prefer to contribute code?{" "}
          <Link
            href="/docs/getting-started"
            className="text-fg-secondary underline underline-offset-4 outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start with OSS
          </Link>{" "}
          or open an issue on{" "}
          <a
            href="https://github.com/pedrogbraz/cronus-ui"
            className="text-fg-secondary underline underline-offset-4 outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
