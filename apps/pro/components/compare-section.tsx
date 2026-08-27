import { Check } from "lucide-react";
import { type Cell, COMPARE_ROWS } from "../lib/catalog";
import { OSS_URL } from "../lib/origins";
import { Eyebrow, SectionGlow } from "./showcase-ui";

function CellMark({ cell }: { cell: Cell }) {
  if (cell === "oss-note") {
    return <span className="text-fg-tertiary">—</span>;
  }
  return <Check className="size-4 text-fg" aria-label="Included" />;
}

export function CompareSection() {
  return (
    <section id="compare" aria-labelledby="compare-heading" className="relative scroll-mt-20">
      <SectionGlow />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>Compare</Eyebrow>
          <h2
            id="compare-heading"
            className="max-w-2xl font-display text-3xl tracking-[-0.025em] sm:text-4xl"
          >
            You only gain
          </h2>
          <p className="max-w-2xl text-fg-secondary">
            Every OSS row stays in Pro. Looks are not a paywall. Glass is free.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <caption className="sr-only">What OSS includes versus what Pro adds</caption>
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-3 pr-4 font-medium text-fg">
                  Included
                </th>
                <th scope="col" className="w-28 px-4 py-3 font-medium text-fg">
                  OSS
                </th>
                <th scope="col" className="w-28 px-4 py-3 font-medium text-fg">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border/60 last:border-b-0">
                  <th scope="row" className="py-3.5 pr-4 text-start font-normal text-fg">
                    {row.label}
                    {row.hint ? (
                      <span className="mt-0.5 block text-xs font-normal text-fg-tertiary">
                        {row.hint}
                      </span>
                    ) : null}
                  </th>
                  <td className="px-4 py-3.5 text-fg-secondary">
                    <CellMark cell={row.oss} />
                  </td>
                  <td className="px-4 py-3.5 text-fg-secondary">
                    <CellMark cell={row.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm text-fg-tertiary">
          The engine lives on the{" "}
          <a
            href={OSS_URL}
            className="text-fg-secondary underline underline-offset-4 outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
          >
            open-source site
          </a>
          . This origin is only the pack.
        </p>
      </div>
    </section>
  );
}
