import { ArrowRight } from "lucide-react";
import { PACK } from "../lib/catalog";
import { ossUrl } from "../lib/origins";
import { PreviewThumb } from "./preview-thumb";

/** Three pack surfaces under the hero — the same rhythm as the OSS landing. */
export function HeroPack() {
  return (
    <div className="cronus-rise cronus-rise-3 mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:pb-24">
      {PACK.map((app) => (
        <article
          key={app.slug}
          className="flex min-h-[22rem] flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised"
        >
          <div className="min-h-0 flex-1">
            <PreviewThumb app={app} className="h-full min-h-[16rem] rounded-none" />
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-fg-secondary">{app.name}</p>
            <a
              href={ossUrl(`/templates/${app.slug}`)}
              className="inline-flex items-center gap-1 text-sm text-fg-secondary outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore {app.name}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
