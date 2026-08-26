import { ArrowUpRight } from "lucide-react";
import { PACK } from "../lib/catalog";
import { ossUrl } from "../lib/origins";
import { CopyCommand } from "./copy-command";
import { PreviewThumb } from "./preview-thumb";

export function PackSection() {
  return (
    <section
      id="pack"
      aria-labelledby="pack-heading"
      className="scroll-mt-24 border-t border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          id="pack-heading"
          className="font-display text-3xl font-normal tracking-[-0.02em] text-fg sm:text-4xl"
        >
          The Pro pack
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-secondary">
          Three composed apps, live from the OSS stage. Preview is public. Scaffold is the same
          compose engine as SaaS.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PACK.map((app) => (
            <article
              key={app.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised"
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
                  <h3 className="font-display text-xl font-normal tracking-[-0.02em] text-fg">
                    {app.name}
                  </h3>
                  <span className="rounded-full border border-border bg-surface-overlay px-2.5 py-0.5 text-xs font-medium text-fg">
                    {app.tagline}
                  </span>
                </div>
                <p className="text-xs text-fg-tertiary">{app.appearance}</p>
                <p className="text-sm leading-6 text-fg-secondary">{app.description}</p>
                <div className="mt-auto border-t border-border pt-4">
                  <CopyCommand command={app.command} />
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
