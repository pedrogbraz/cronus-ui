import { cn } from "@cooud-ui/ui";
import { CalendarDays, GitBranch } from "lucide-react";
import { DocsHeader, DocsSection } from "../../components/docs/documentation";
import { SectionGlow } from "../../components/showcase-ui";
import { CHANGELOG_ENTRIES } from "../../lib/docs";

// Status is the one place colour still earns its keep on this page: it encodes
// semantic state, not decoration. `text-*-strong` (AA-tuned same-hue variants)
// keeps the small label readable against the page surface — the plain semantic
// colours read <4.5:1 at this size. "Planned" is deliberately achromatic: it is
// the absence of a state, not a warning.
const statusTone = {
  Released: "text-success-strong",
  "In development": "text-info-strong",
  Planned: "text-fg-tertiary",
};

export default function ChangelogPage() {
  return (
    <div className="relative py-10">
      {/* The same aurora top-edge shimmer the home sections carry — keeps the
          changelog header consistent with the rest of the showcase. */}
      <SectionGlow />
      <DocsHeader
        eyebrow="Changelog"
        title="A clean record of what shipped, what is in development, and what is next"
        description="Track component launches, Create updates, registry changes, accessibility work, and docs improvements in one place."
      />

      <DocsSection title="Release timeline">
        {/* A flat ledger: one hairline-separated row per release. No rail, no
            stacked cards — the rhythm of the rules carries the timeline. */}
        <div>
          {CHANGELOG_ENTRIES.map((entry) => (
            <article
              key={`${entry.version}-${entry.title}`}
              className="grid gap-x-10 gap-y-4 border-t border-border py-8 md:grid-cols-[9rem_1fr]"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 md:flex-col md:items-start md:gap-1.5">
                <span className="text-sm font-medium tabular-nums text-fg">{entry.version}</span>
                <span className="inline-flex items-center gap-1.5 text-xs tabular-nums text-fg-tertiary">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {entry.date}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium",
                    statusTone[entry.status],
                  )}
                >
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                  {entry.status}
                </span>
              </div>

              <div className="min-w-0">
                <h2 className="font-display text-2xl tracking-[-0.02em] text-fg">{entry.title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-fg-secondary">
                  {entry.summary}
                </p>

                <ul className="mt-5 grid gap-x-8 gap-y-2 md:grid-cols-2">
                  {entry.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-6 text-fg-secondary">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-border-strong"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </DocsSection>

      <DocsSection
        title="Release policy"
        description="Every visible change should include a short entry so teams know whether it is ready to use, still in development, or planned."
      >
        <div className="flex items-start gap-4 border-t border-border pt-6">
          <span
            aria-hidden="true"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-inset text-fg-tertiary"
          >
            <GitBranch className="size-5" aria-hidden="true" />
          </span>
          <p className="max-w-3xl text-sm leading-6 text-fg-secondary">
            Component releases should mention docs, registry output, accessibility coverage, and
            migration notes when a change affects copied code or app-level setup.
          </p>
        </div>
      </DocsSection>
    </div>
  );
}
