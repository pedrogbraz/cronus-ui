import { AuroraBackground } from "@cronus-ui/ui/aurora-background";
import { GridPattern } from "@cronus-ui/ui/grid-pattern";
import { LightRays } from "@cronus-ui/ui/light-rays";
import { Particles } from "@cronus-ui/ui/particles";
import { ShinyText } from "@cronus-ui/ui/shiny-text";
import { ArrowRight } from "lucide-react";
import { PACK, packApp } from "../lib/catalog";
import { OSS_URL } from "../lib/origins";
import { PreviewThumb } from "./preview-thumb";

const featured = packApp("chat");
const side = PACK.filter((app) => app.slug !== featured.slug);

export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-border/60"
      aria-labelledby="hero-heading"
    >
      <AuroraBackground className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 text-fg-tertiary opacity-40">
        <GridPattern className="h-full w-full" size={32} />
      </div>
      <LightRays className="pointer-events-none absolute inset-0 opacity-60" />
      <Particles className="pointer-events-none absolute inset-0" count={36} />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            Cronus <ShinyText>Pro</ShinyText>
          </p>
          <h1
            id="hero-heading"
            className="mt-4 font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-6xl sm:tracking-[-0.03em]"
          >
            The rest of the product.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-7 text-fg-secondary">
            OSS is the engine — tokens, looks, SaaS, compose, upgrade. Pro adds mail, chat, and
            finance. Nothing you already have is gated.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#pricing"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground outline-none transition-opacity duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              See pricing
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#pack"
              className="inline-flex items-center rounded-xl border border-border bg-surface-inset/80 px-4 py-2.5 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore the pack
            </a>
            <a
              href={OSS_URL}
              className="inline-flex items-center px-2 py-2.5 text-sm font-medium text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Open source stays complete
            </a>
          </div>
          <p className="mt-6 text-sm text-fg-tertiary">
            One-time. Perpetual. Not billed yet — public list for first release.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-lg">
            <PreviewThumb app={featured} />
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-fg">{featured.name}</p>
                <p className="text-xs text-fg-tertiary">{featured.appearance}</p>
              </div>
              <span className="rounded-full border border-border bg-surface-overlay px-2.5 py-0.5 text-xs font-medium text-fg">
                Live
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {side.map((app) => (
              <div
                key={app.slug}
                className="overflow-hidden rounded-2xl border border-border bg-surface-raised"
              >
                <PreviewThumb app={app} />
                <p className="border-t border-border px-3 py-2 text-xs font-medium text-fg">
                  {app.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
