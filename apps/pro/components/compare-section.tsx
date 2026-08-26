import { Check } from "lucide-react";
import { type Cell, COMPARE_ROWS } from "../lib/catalog";
import { OSS_URL } from "../lib/origins";

function CellMark({ cell }: { cell: Cell }) {
  if (cell === "oss-note") {
    return <span className="text-fg-tertiary">—</span>;
  }
  return <Check className="size-4 text-fg" aria-label="Included" />;
}

export function CompareSection() {
  return (
    <section
      id="compare"
      aria-labelledby="compare-heading"
      className="scroll-mt-24 border-t border-border/60"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2
          id="compare-heading"
          className="font-display text-3xl font-normal tracking-[-0.02em] text-fg sm:text-4xl"
        >
          You only gain
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-fg-secondary">
          Every OSS row stays in Pro. Looks are not a paywall. Glass is free.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <caption className="sr-only">What OSS includes versus what Pro adds</caption>
            <thead>
              <tr className="border-b border-border bg-surface-inset text-left">
                <th scope="col" className="px-4 py-3 font-medium text-fg">
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
                <tr key={row.label} className="border-b border-border last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-start font-normal text-fg">
                    {row.label}
                    {row.hint ? (
                      <span className="mt-0.5 block text-xs font-normal text-fg-tertiary">
                        {row.hint}
                      </span>
                    ) : null}
                  </th>
                  <td className="px-4 py-3 text-fg-secondary">
                    <CellMark cell={row.oss} />
                  </td>
                  <td className="px-4 py-3 text-fg-secondary">
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
