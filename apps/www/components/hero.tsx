"use client";

import { WordRotate } from "@cronus-ui/ui/word-rotate";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeroProducts } from "./home/hero-products";

const ROTATE = ["ship.", "compose.", "keep."];

/**
 * x.ai-style landing hero: centered editorial type, two pills, then three
 * product surfaces. No atmosphere, no fake dashboard chrome.
 */
export function Hero({ displayClassName }: { displayClassName?: string }) {
  return (
    <section id="top" className="relative">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-8 pt-16 text-center sm:px-6 sm:pt-24 lg:pt-28">
        <Link
          href="/docs/getting-started"
          className="cronus-rise inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1 text-xs text-fg-secondary outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="rounded-full bg-surface-overlay px-1.5 py-px text-[10px] font-medium tracking-wide text-fg">
            NEW
          </span>
          Compose a SaaS in one command
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>

        <h1
          className={`cronus-rise cronus-rise-2 mt-8 w-full font-normal leading-[1.08] tracking-[-0.035em] text-fg text-[2.25rem] sm:text-5xl lg:text-6xl ${displayClassName ?? "font-display"}`}
        >
          <span className="block">A product UI system</span>
          <span className="mt-[0.06em] inline-flex flex-nowrap items-baseline justify-center gap-x-[0.28em] max-sm:flex-wrap">
            <span className="whitespace-nowrap">for everything you</span>
            <span className="relative inline-block whitespace-nowrap align-baseline leading-none">
              <WordRotate words={ROTATE} interval={2800} lockWidth={false} />
              <span
                aria-hidden="true"
                className="cronus-word-underline pointer-events-none absolute inset-x-0 h-[3px] rounded-full bottom-[0.1em]"
              />
            </span>
          </span>
        </h1>

        <p className="cronus-rise cronus-rise-3 mt-6 max-w-xl text-pretty text-lg leading-7 text-fg-secondary">
          Tokens, looks, compose, and upgrade. MIT. One command writes a themed SaaS you can keep
          editing.
        </p>

        <div className="cronus-rise cronus-rise-3 mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center rounded-full border border-border bg-surface-raised px-5 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
          >
            View documentation
          </Link>
        </div>
      </div>

      <HeroProducts />
    </section>
  );
}
