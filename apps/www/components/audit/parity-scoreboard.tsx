import { Badge } from "@cronus-ui/ui";
import Link from "next/link";
import {
  familyHref,
  geometryText,
  logicText,
  matchesFilter,
  PARITY_BADGE,
  pixelText,
  SCOREBOARD_FILTERS,
  type Scoreboard,
  STATUS_BADGE,
} from "../../lib/audit/scoreboard";

/**
 * Zero-JS filter: radio inputs + `:has()` hide rows, so the table stays a
 * static server render.
 */
const FILTER_CSS = `
[data-parity-board]:has(input[value="diffs"]:checked) tr[data-diff="false"],
[data-parity-board]:has(input[value="not-ported"]:checked) tr[data-ported="true"] { display: none; }
`;

export function ParityScoreboard({
  board,
  auditOrigin,
}: {
  board: Scoreboard;
  auditOrigin: string | null;
}) {
  const t = board.totals;
  const stats = [
    { label: "Families", value: t.families, hint: `${t.components} documented components` },
    {
      label: "Ported to .cronus",
      value: t.ported,
      hint: `${t.stub} stub · ${t.reactOnly} React only`,
    },
    {
      label: "Parity match",
      value: t.parity.match,
      hint: `${t.parity.diff} with diffs · ${t.parity.notRun} not run`,
    },
    {
      label: "Fixtures",
      value: t.fixtures,
      hint: `geometry ${t.geometry.pass}/${t.geometry.pass + t.geometry.fail} · logic ${t.logic.pass}/${t.logic.pass + t.logic.fail}`,
    },
    {
      label: "Pixel diff",
      value: `${t.pixel.diffPixels} px`,
      hint: `${t.pixel.diff} fixture${t.pixel.diff === 1 ? "" : "s"} over budget`,
    },
    { label: "Style props", value: t.geometry.propMismatches, hint: "report-only mismatches" },
  ];

  return (
    <div data-parity-board className="mt-10">
      <style>{FILTER_CSS}</style>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface-raised p-4">
            <dt className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
              {stat.label}
            </dt>
            <dd className="mt-2 font-display text-3xl tracking-[-0.02em] text-fg tabular-nums">
              {stat.value}
            </dd>
            <dd className="mt-1 text-sm text-fg-secondary">{stat.hint}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <fieldset className="flex flex-wrap gap-1 rounded-full border border-border bg-surface-inset p-1">
          <legend className="sr-only">Filter families</legend>
          {SCOREBOARD_FILTERS.map((filter) => (
            <label
              key={filter.id}
              className="cursor-pointer rounded-full px-3 py-1.5 text-sm text-fg-secondary transition-colors has-checked:bg-surface-overlay has-checked:text-fg has-focus-visible:ring-2 has-focus-visible:ring-ring"
            >
              <input
                type="radio"
                name="parity-filter"
                value={filter.id}
                defaultChecked={filter.id === "all"}
                className="sr-only"
              />
              {filter.label}{" "}
              <span className="tabular-nums text-fg-tertiary">
                {board.families.filter((f) => matchesFilter(f, filter.id)).length}
              </span>
            </label>
          ))}
        </fieldset>
        <p className="text-xs text-fg-tertiary">
          Generated {board.generatedAt} · kernel{" "}
          <span className="font-mono">{board.kernelRef?.slice(0, 7) ?? "unknown"}</span>
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <caption className="sr-only">React vs Cronus parity by family</caption>
          <thead className="bg-surface-raised text-xs uppercase tracking-widest text-fg-tertiary">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Family
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Kernel
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Fixtures
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Geometry
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Pixel diff
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Logic
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Parity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {board.families.map((family) => {
              const href = familyHref(family, auditOrigin);
              const status = STATUS_BADGE[family.status];
              const parity = PARITY_BADGE[family.parity];
              return (
                <tr
                  key={family.family}
                  data-diff={String(family.parity === "diff")}
                  data-ported={String(family.status === "ported")}
                >
                  <th scope="row" className="px-4 py-2.5 font-mono font-normal text-fg">
                    {href ? (
                      <Link href={href} className="underline-offset-4 hover:underline">
                        {family.family}
                      </Link>
                    ) : (
                      family.family
                    )}
                  </th>
                  <td className="px-4 py-2.5">
                    <Badge variant={status.variant}>
                      {status.label}
                      {family.stubKind ? ` · ${family.stubKind}` : ""}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-fg-secondary">
                    {family.fixtures.length || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-fg-secondary">
                    {geometryText(family.geometry)}
                    {family.geometry.propMismatches > 0 ? (
                      <span
                        className="ml-1 text-fg-tertiary"
                        title="Report-only style prop mismatches"
                      >
                        · {family.geometry.propMismatches} props
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-fg-secondary">
                    {pixelText(family.pixel)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-fg-secondary">
                    {logicText(family.logic)}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={parity.variant}>{parity.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 max-w-3xl text-sm leading-6 text-fg-tertiary">
        Geometry pairs every <code className="font-mono">data-slot</code> between the React and
        Cronus panes (rect, typography, colors, radius, border, text); a mismatch fails the audit.
        Style props (shadow, opacity, per-side borders…) and pixel diffs over 50 px are report-only.
        Logic checks tags, attributes and behavior. A dash means not run.
      </p>
    </div>
  );
}
