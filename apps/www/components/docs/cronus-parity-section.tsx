import { Badge } from "@cronus-ui/ui";
import Link from "next/link";
import { cronusSourcesFor } from "../../lib/audit/cronus-sources";
import {
  type FamilyScore,
  geometryText,
  logicText,
  PARITY_BADGE,
  pixelText,
  STATUS_BADGE,
} from "../../lib/audit/scoreboard";

/**
 * `.cronus` source for each audit fixture of a family plus its parity status.
 * Server component: sources are emitted at build time and ship as static text.
 */
export function CronusParitySection({ score }: { score: FamilyScore }) {
  const sources = cronusSourcesFor(score.family);
  const status = STATUS_BADGE[score.status];
  const parity = PARITY_BADGE[score.parity];
  const facts = [
    { label: "Geometry", value: geometryText(score.geometry) },
    { label: "Pixel diff", value: pixelText(score.pixel) },
    { label: "Logic", value: logicText(score.logic) },
  ];

  return (
    <section id="cronus" className="mt-16 scroll-mt-24">
      <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">.cronus</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-tertiary">
        {sources.length > 0
          ? "The same component declared in Cronus. Emitted at build time from the audit fixtures — the kernel renders it as HTML with no React."
          : "No audit fixture declares this family in .cronus yet."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <Badge variant={status.variant}>
          {status.label}
          {score.stubKind ? ` · ${score.stubKind}` : ""}
        </Badge>
        <Badge variant={parity.variant}>Parity: {parity.label}</Badge>
        {sources.length > 0
          ? facts.map((fact) => (
              <span key={fact.label} className="text-fg-secondary">
                {fact.label} <span className="tabular-nums text-fg">{fact.value}</span>
              </span>
            ))
          : null}
        <Link href="/audit" className="ml-auto text-fg underline underline-offset-4">
          Parity scoreboard
        </Link>
      </div>

      {sources.length > 0 ? (
        <div className="mt-4 flex flex-col gap-2">
          {sources.map((item, index) => (
            <details
              key={item.id}
              open={index === 0}
              className="group rounded-xl border border-border bg-surface-inset"
            >
              <summary className="cursor-pointer px-4 py-2.5 font-mono text-sm text-fg-secondary group-open:text-fg">
                {item.id}.cronus
              </summary>
              <pre className="overflow-x-auto border-t border-border px-4 py-3 font-mono text-xs leading-5 text-fg-secondary">
                <code>{item.source}</code>
              </pre>
            </details>
          ))}
        </div>
      ) : null}
    </section>
  );
}
