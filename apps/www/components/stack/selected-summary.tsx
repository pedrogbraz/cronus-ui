"use client";

import { Badge, Button, cn, GlassCard, ScrollArea } from "@cooud-ui/ui";
import { Layers, RotateCcw, Shuffle } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { GROUP_ORDER } from "@/lib/stack/catalog";
import type { Catalog, Resolution } from "@/lib/stack/types";

export interface SelectedSummaryProps {
  /** The current resolution (drives the rendered choices). */
  resolution: Resolution;
  /** The catalog (for category order + option names). */
  catalog: Catalog;
  /** Restore the default selection. */
  onReset: () => void;
  /** Roll a fresh, valid random stack. */
  onRandomize: () => void;
  className?: string;
}

interface SummaryRow {
  categoryId: string;
  title: string;
  /** The human values chosen for this category (empty when nothing meaningful). */
  values: string[];
}

/** Whether an option id represents an empty / "None" choice we hide from the list. */
function isNoneId(id: string): boolean {
  return id.endsWith("-none");
}

/**
 * Follows its content's measured height with a CSS height transition, so
 * summary rows and advisory notes appearing/disappearing settle smoothly
 * instead of snapping the rail around.
 *
 * Mechanism: a ResizeObserver on the inner wrapper writes an explicit pixel
 * height onto the outer element inside requestAnimationFrame (a direct style
 * write — never a React re-render per change), and `transition-[height]` does
 * the tween. The inner wrapper is a flex column so child margins are counted
 * (no margin collapsing through the measurement). SSR renders `height: auto`,
 * so there is no hydration mismatch; reduced motion disables the tween.
 */
function SmoothHeight({ className, children }: { className?: string; children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    let raf = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        outer.style.height = `${inner.offsetHeight}px`;
      });
    });
    observer.observe(inner);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      data-slot="smooth-height"
      className={cn(
        "overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
        className,
      )}
    >
      <div ref={innerRef} className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

/**
 * The "Selected stack" panel — mirrors Better-T-Stack's summary. Lists every
 * meaningful choice (Nones and off-toggles are hidden), shows a live count, and
 * exposes Reset + Randomize. It is a pure projection of {@link Resolution}.
 */
export function SelectedSummary({
  resolution,
  catalog,
  onReset,
  onRandomize,
  className,
}: SelectedSummaryProps) {
  // Rows grouped by builder section (Framework, Data, Conventions, …), in the
  // same order as the left column, so the summary reads as its mirror.
  const grouped = useMemo(() => {
    const byGroup = new Map<string, SummaryRow[]>();
    for (const cat of catalog) {
      const rc = resolution.categories[cat.id];
      if (!rc) continue;
      const { value } = rc;
      const values: string[] = [];

      if (cat.kind === "single" && typeof value === "string") {
        if (!isNoneId(value)) {
          const opt = cat.options.find((o) => o.id === value);
          if (opt) values.push(opt.name);
        }
      } else if (cat.kind === "multi" && Array.isArray(value)) {
        for (const id of value) {
          const opt = cat.options.find((o) => o.id === id);
          if (opt) values.push(opt.name);
        }
      } else if (cat.kind === "toggle" && value === true) {
        values.push("On");
      }

      if (values.length === 0) continue;
      const group = cat.group ?? "Other";
      const arr = byGroup.get(group) ?? [];
      arr.push({ categoryId: cat.id, title: cat.title, values });
      byGroup.set(group, arr);
    }
    return GROUP_ORDER.filter((g) => byGroup.has(g)).map((g) => ({
      group: g,
      rows: byGroup.get(g) ?? [],
    }));
  }, [resolution, catalog]);

  // Count distinct selected choices (each value counts once).
  const count = grouped.reduce((n, g) => n + g.rows.reduce((m, r) => m + r.values.length, 0), 0);
  const hasErrors = resolution.issues.some((i) => i.level === "error");
  const infos = resolution.issues.filter((i) => i.level === "info");

  return (
    <GlassCard
      role="region"
      data-slot="selected-summary"
      aria-labelledby="selected-summary-heading"
      className={cn("flex flex-col p-4 sm:p-5", className)}
    >
      <div className="flex flex-col">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg border border-border bg-surface-overlay text-fg-secondary">
              <Layers className="size-4" aria-hidden="true" />
            </span>
            <h2
              id="selected-summary-heading"
              className="text-xs font-medium uppercase tracking-wider text-fg-secondary"
            >
              Selected stack
            </h2>
          </div>
          <Badge
            variant="secondary"
            aria-label={`${count} choices selected`}
            className="tabular-nums"
          >
            {count}
          </Badge>
        </header>

        {/* SmoothHeight keeps the rail below (buttons, output panel) settling
            gently as choices add/remove rows. The -mr-2/pr-2 pair that tucks
            the scrollbar into the card padding moves to the outer element so
            its overflow-hidden never clips the scrollbar. */}
        <SmoothHeight className="-mr-2 mt-4">
          <ScrollArea className="max-h-[20rem] pr-2">
            <div className="flex flex-col gap-4">
              {grouped.map(({ group, rows }) => (
                <div key={group} className="flex flex-col gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-fg-tertiary">
                    {group}
                  </p>
                  <dl className="flex flex-col gap-2">
                    {rows.map((row) => (
                      <div key={row.categoryId} className="flex items-start justify-between gap-3">
                        <dt className="shrink-0 text-xs text-fg-tertiary">{row.title}</dt>
                        <dd className="flex flex-wrap justify-end gap-1.5 text-right">
                          {row.values.map((v) => (
                            <span
                              key={`${row.categoryId}-${v}`}
                              className="inline-flex rounded-md bg-surface-overlay px-1.5 py-0.5 text-xs font-medium text-fg"
                            >
                              {v}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Advisory recommendations (info-level issues). mr-2 restores the
              card-padding edge inside the widened SmoothHeight wrapper. */}
          {infos.length > 0 ? (
            <ul className="mt-4 mr-2 flex flex-col gap-1 rounded-lg border border-info/30 bg-info/10 px-3 py-2">
              {infos.map((issue) => (
                <li key={issue.message} className="text-xs text-fg-secondary">
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : null}
        </SmoothHeight>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="group/randomize flex-1"
            onClick={onRandomize}
            data-slot="summary-randomize"
          >
            <Shuffle
              aria-hidden="true"
              className="transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/randomize:rotate-180 motion-reduce:transition-none motion-reduce:group-hover/randomize:rotate-0"
            />
            Randomize
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="group/reset flex-1"
            onClick={onReset}
            data-slot="summary-reset"
          >
            <RotateCcw
              aria-hidden="true"
              className="transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/reset:-rotate-90 motion-reduce:transition-none motion-reduce:group-hover/reset:rotate-0"
            />
            Reset
          </Button>
        </div>

        {/* Live status for assistive tech (and a subtle visual note on errors). */}
        <p
          role="status"
          aria-live="polite"
          className={cn("mt-4 text-xs", hasErrors ? "text-error" : "sr-only")}
        >
          {hasErrors
            ? "This stack has conflicting choices — adjust the highlighted categories."
            : "Stack is valid."}
        </p>
      </div>
    </GlassCard>
  );
}
