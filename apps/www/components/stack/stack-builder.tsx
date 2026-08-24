"use client";

import { cn, Input, Label, Reveal } from "@cooud-ui/ui";
import { ListChecks, SlidersHorizontal, Terminal } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { catalog, GROUP_ORDER } from "@/lib/stack/catalog";
import { defaultSelection, randomize, resolve, select, toggleMulti } from "@/lib/stack/engine";
import type { Selection } from "@/lib/stack/types";
import { CategorySection } from "./category-section";
import { SelectedSummary } from "./selected-summary";
import { StackOutput } from "./stack-output";

type MobileView = "configure" | "output";

/**
 * The single stagger step (seconds) shared by every `Reveal` on the page, so
 * the hero, the builder sections, and the summary rail all enter on one rhythm
 * instead of each picking its own timing.
 */
const REVEAL_STAGGER = 0.05;

/**
 * The shared one-shot enter for the mobile configure ↔ output swap: the newly
 * shown column fades/rises from its `@starting-style` state. Tailwind v4 maps
 * `translate-y-*` to the CSS `translate` property, so that is what we
 * transition (never `transform`). Reduced motion pins both starting values.
 */
const MOBILE_SWAP_ENTER =
  "transition-[opacity,translate] duration-300 ease-[cubic-bezier(.22,1,.36,1)] starting:opacity-0 starting:translate-y-1 motion-reduce:transition-none motion-reduce:starting:opacity-100 motion-reduce:starting:translate-y-0";

/**
 * The Cooud Stack Builder — a Better-T-Stack-class configurator.
 *
 * Owns the raw {@link Selection} and runs every mutation through the pure engine
 * (`select` / `toggleMulti` / `randomize`), then re-resolves on render so the UI
 * always reflects the auto-corrected, valid stack. The resolved selection is the
 * single `StackConfig` handed to {@link StackOutput} for the generated artifacts.
 *
 * Renders the page's single `<main id="main-content">`.
 */
export function StackBuilder() {
  const [selection, setSelection] = useState<Selection>(() => defaultSelection(catalog));
  const [projectName, setProjectName] = useState("my-cooud-app");
  const [mobileView, setMobileView] = useState<MobileView>("configure");
  // A roll counter (not render state) so repeated Randomize presses vary, while
  // each individual roll stays deterministic for its derived seed.
  const rollRef = useRef(0);

  // Resolve on every render — pure + cheap, so it's safe per keystroke.
  const resolution = useMemo(() => resolve(catalog, selection), [selection]);
  const projectNameId = useId();

  const handleSelectSingle = useCallback((categoryId: string, optionId: string) => {
    setSelection((prev) => select(catalog, prev, categoryId, optionId));
  }, []);

  const handleToggleMulti = useCallback((categoryId: string, optionId: string) => {
    setSelection((prev) => toggleMulti(catalog, prev, categoryId, optionId));
  }, []);

  const handleToggleBoolean = useCallback((categoryId: string, next: boolean) => {
    setSelection((prev) => select(catalog, prev, categoryId, next));
  }, []);

  const handleReset = useCallback(() => {
    setSelection(defaultSelection(catalog));
  }, []);

  const handleRandomize = useCallback(() => {
    rollRef.current = (rollRef.current + 1) >>> 0;
    const seed = (Date.now() ^ (rollRef.current * 0x9e3779b1)) >>> 0;
    setSelection(randomize(catalog, seed));
  }, []);

  // --- Summary-rail scroll shadow ----------------------------------------
  // The sticky rail scrolls independently on desktop; when it does, a soft top
  // fade signals the clipped content. The scroll handler never re-renders —
  // it writes a boolean data-attribute inside requestAnimationFrame and CSS
  // owns the fade (same pattern as SpotlightCard's data-attribute hover).
  const railRef = useRef<HTMLDivElement>(null);
  const railRafRef = useRef(0);

  const handleRailScroll = useCallback(() => {
    cancelAnimationFrame(railRafRef.current);
    railRafRef.current = requestAnimationFrame(() => {
      const rail = railRef.current;
      if (rail) rail.toggleAttribute("data-scrolled", rail.scrollTop > 8);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(railRafRef.current), []);

  return (
    <main id="main-content" className="min-h-[calc(100vh-4rem)] bg-surface-base text-fg">
      {/* --- Hero header --------------------------------------------------
          A clean, premium intro. A single aurora accent + a faint dotted grid
          (coherent with the site hero) sit behind the copy with parsimony — an
          accent, not decoration. Both are aria-hidden and reduced-motion safe
          (they're static; no animation to park). */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-64 bg-gradient-aurora opacity-[0.07] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--cooud-border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.35,
          }}
        />
        <Reveal className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex max-w-3xl flex-col gap-5">
            <h1 className="text-balance font-display text-4xl leading-[1.05] tracking-[-0.03em] text-fg sm:text-5xl">
              Stack Builder
            </h1>

            <p className="max-w-2xl text-pretty text-lg text-fg-secondary">
              Compose your app stack, layer by layer — every choice is validated live, and your
              naming, structure, and standards come baked in. Walk away with a runnable default
              scaffold command and a KICKOFF.md your coding agent follows to the letter.
            </p>

            <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-surface-raised/60 px-3 py-1.5 text-xs text-fg-secondary backdrop-blur">
              <Terminal className="size-3.5 shrink-0 text-fg-tertiary" aria-hidden="true" />
              <span>
                Outputs a{" "}
                <code className="rounded bg-surface-overlay px-1 py-0.5 font-mono text-[11px] text-fg">
                  bun create
                </code>{" "}
                command + KICKOFF.md + stack.json.
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* --- Builder body ------------------------------------------------- */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Mobile view switcher (configure ↔ output); hidden on desktop.
            A segmented control: an absolutely-positioned thumb slides under the
            active tab via a GPU transform (no layout shift). The buttons stay
            transparent so the thumb reads through them. */}
        <div className="mb-8 lg:hidden">
          <fieldset
            className="relative grid grid-cols-2 rounded-xl border border-border bg-surface-raised p-1"
            aria-label="Builder view"
          >
            <legend className="sr-only">Builder view</legend>
            {/* Sliding thumb */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg border border-border bg-surface-overlay shadow-xs transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
              style={{
                transform: mobileView === "output" ? "translateX(100%)" : "translateX(0)",
              }}
            />
            <button
              type="button"
              aria-pressed={mobileView === "configure"}
              onClick={() => setMobileView("configure")}
              className={cn(
                "relative z-10 inline-flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-medium outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
                mobileView === "configure" ? "text-fg" : "text-fg-tertiary hover:text-fg-secondary",
              )}
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Configure
            </button>
            <button
              type="button"
              aria-pressed={mobileView === "output"}
              onClick={() => setMobileView("output")}
              className={cn(
                "relative z-10 inline-flex h-9 items-center justify-center gap-2 rounded-lg text-sm font-medium outline-none transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised",
                mobileView === "output" ? "text-fg" : "text-fg-tertiary hover:text-fg-secondary",
              )}
            >
              <ListChecks className="size-4" aria-hidden="true" />
              Summary &amp; output
            </button>
          </fieldset>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-10">
          {/* Categories column */}
          <div
            key={`configure-${mobileView === "configure"}`}
            data-active={mobileView === "configure"}
            className={cn(
              "flex-col gap-10 lg:flex",
              // Mobile: show only the active view; desktop always shows both.
              // Soft enter on the mobile swap: a one-shot fade/rise from the
              // `starting:` state (Tailwind v4 @starting-style). Reduced-motion
              // safe and never affects the always-visible desktop layout.
              MOBILE_SWAP_ENTER,
              mobileView === "configure" ? "flex" : "hidden",
            )}
          >
            <Reveal className="flex flex-col gap-2">
              <Label htmlFor={projectNameId} className="text-sm font-semibold text-fg">
                Project name
              </Label>
              <Input
                id={projectNameId}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my-cooud-app"
                spellCheck={false}
                autoComplete="off"
                aria-describedby={`${projectNameId}-hint`}
                className="max-w-sm font-mono"
              />
              <p id={`${projectNameId}-hint`} className="text-xs text-fg-tertiary">
                Used in the scaffolding command — sanitized to a safe slug.
              </p>
            </Reveal>

            {GROUP_ORDER.map((group, gi) => {
              const cats = catalog.filter((c) => c.group === group && resolution.categories[c.id]);
              if (cats.length === 0) return null;
              return (
                // Each builder section (Framework, Data, Conventions, …) fades up
                // once as it enters, one shared stagger step after the project
                // name. The stagger is capped so later sections don't feel
                // delayed; `Reveal` is reduced-motion safe.
                <Reveal key={group} delay={Math.min(gi + 1, 6) * REVEAL_STAGGER}>
                  <section aria-label={group} className="flex flex-col gap-5">
                    {/* Section header — a quiet uppercase label + a hairline. */}
                    <div className="flex items-center gap-3">
                      <h2 className="text-xs font-medium uppercase tracking-wider text-fg-tertiary">
                        {group}
                      </h2>
                      <span aria-hidden="true" className="h-px flex-1 bg-border/60" />
                    </div>
                    <div className="flex flex-col gap-8">
                      {cats.map((cat) => {
                        const rc = resolution.categories[cat.id];
                        if (!rc) return null;
                        return (
                          <CategorySection
                            key={cat.id}
                            resolved={rc}
                            onSelectSingle={handleSelectSingle}
                            onToggleMulti={handleToggleMulti}
                            onToggleBoolean={handleToggleBoolean}
                          />
                        );
                      })}
                    </div>
                  </section>
                </Reveal>
              );
            })}
          </div>

          {/* Aside: summary + output. Sticky on desktop with a top offset that
              clears the 4rem sticky nav (top-20 = 5rem → 1rem breathing room).
              The inner rail carries max-h + overflow so a long rail scrolls
              independently of the page, while the aside itself stays a plain
              positioning context for the scroll-shadow overlay. */}
          <aside
            key={`output-${mobileView === "output"}`}
            data-active={mobileView === "output"}
            className={cn(
              "relative min-w-0 flex-col lg:sticky lg:top-20 lg:flex",
              // Mobile: show only the active view; desktop always shows both.
              MOBILE_SWAP_ENTER,
              mobileView === "output" ? "flex" : "hidden",
            )}
            aria-label="Selected stack and output"
          >
            <div
              ref={railRef}
              onScroll={handleRailScroll}
              className="peer/rail flex min-w-0 flex-col gap-6 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain lg:pr-1"
            >
              {/* shrink-0 (on the Reveal wrappers, the rail's flex children): the
                  rail is a flex column with a max-height + scroll, so its children
                  must keep their natural height instead of being compressed to fit
                  — otherwise the output frame's overflow-hidden would clip the
                  KICKOFF brief and the rail would have nothing to scroll. The
                  Reveals enter on the same stagger rhythm as the left column. */}
              <Reveal delay={REVEAL_STAGGER} className="shrink-0">
                <SelectedSummary
                  resolution={resolution}
                  catalog={catalog}
                  onReset={handleReset}
                  onRandomize={handleRandomize}
                />
              </Reveal>
              <Reveal delay={REVEAL_STAGGER * 2} className="shrink-0">
                <StackOutput
                  config={resolution.selection}
                  projectName={projectName}
                  catalog={catalog}
                />
              </Reveal>
            </div>
            {/* Top scroll shadow: a soft fade that appears once the rail has
                scrolled (data-scrolled is toggled by the rAF handler above, so
                showing it costs no re-render). Desktop-only — the rail only
                scrolls independently at lg — and purely decorative. */}
            <div
              aria-hidden="true"
              data-slot="rail-scroll-shadow"
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-10 bg-gradient-to-b from-surface-base to-transparent lg:block",
                "opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.22,1,.36,1)] peer-data-[scrolled]/rail:opacity-100 motion-reduce:transition-none",
              )}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
