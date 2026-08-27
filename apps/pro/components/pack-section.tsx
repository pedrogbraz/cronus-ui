import { ArrowUpRight } from "lucide-react";
import { PACK } from "../lib/catalog";
import { ossUrl } from "../lib/origins";
import { CopyCommand } from "./copy-command";
import { PreviewThumb } from "./preview-thumb";
import { Eyebrow, SectionGlow } from "./showcase-ui";

export function PackSection() {
  return (
    <section id="pack" aria-labelledby="pack-heading" className="relative scroll-mt-20">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>Pack</Eyebrow>
          <h2
            id="pack-heading"
            className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl"
          >
            The Pro pack
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Three composed apps, live from the OSS stage. Preview is public. Scaffold is the same
            compose engine as SaaS.
          </p>
        </div>

        <div className="mt-10 grid min-w-0 gap-4 lg:grid-cols-3">
          {PACK.map((app) => (
            <article
              key={app.slug}
              className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised"
            >
              <div className="relative border-b border-border/60">
                <PreviewThumb app={app} />
                <a
                  href={ossUrl(`/templates/${app.slug}`)}
                  className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span className="sr-only">Open {app.name} on the open-source site</span>
                </a>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl tracking-[-0.02em] text-fg">{app.name}</h3>
                  <span className="rounded-full border border-border bg-surface-overlay px-2.5 py-0.5 text-xs font-medium text-fg">
                    {app.tagline}
                  </span>
                </div>
                <p className="text-sm leading-6 text-fg-secondary">{app.description}</p>
                <div className="mt-auto border-t border-border pt-4">
                  <CopyCommand command={app.command} label={`Copy ${app.name} scaffold`} />
                  <a
                    href={ossUrl(`/templates/${app.slug}`)}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Open preview
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
