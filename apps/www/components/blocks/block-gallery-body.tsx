"use client";

import { cn } from "@cooud-ui/ui";
import { ArrowRight, Grid2X2, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { BlockVariant, BlockVariantAppearance } from "../../lib/blocks/types";
import type { BlockMeta } from "../../lib/blocks-index";
import { Eyebrow } from "../showcase-ui";

type AppearanceFilter = "all" | BlockVariantAppearance;

/**
 * Intrinsic width (px) of the block preview canvas. Each variant's preview is a
 * fixed `w-[64rem]` (= 64 × 16px) desktop layout; the thumbnail shrinks that
 * canvas to fit the card. Deriving the scale from this constant — instead of
 * viewport breakpoints — is what keeps previews from clipping on narrow cards.
 */
const PREVIEW_WIDTH_PX = 64 * 16;

/** Single motion curve for the whole surface — short, calm, non-bouncy. */
const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

/** `useLayoutEffect` on the client, `useEffect` on the server (SSG-safe). */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Renders a fixed-width block preview shrunk to *exactly* fit its card.
 *
 * The previous version scaled the `w-[64rem]` canvas by hard-coded viewport
 * breakpoints (`scale-[0.38] sm:scale-[0.48] …`). Those key off the *viewport*,
 * not the *card*, so on narrow screens — or whenever the card is narrower than
 * the breakpoint assumed — the 1024px canvas overflowed and was cropped (a
 * gradient mask was hiding the clipped right edge).
 *
 * Here we measure the card via `ResizeObserver` and set `scale =
 * cardWidth / 1024`, so the full canvas width always fits regardless of column
 * count or screen size. The first render (and SSG HTML) uses a CSS-only
 * fallback derived from the container width via a clamp, so the thumbnail is
 * already correctly sized before hydration and never flashes a clipped frame.
 */
function ScaledPreview({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useIsoLayoutEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    // The inner padding (p-6 → 24px each side) is *outside* the scaled canvas,
    // so the available canvas width is the content-box width of the padded host.
    const measure = (innerWidth: number) => {
      if (innerWidth > 0) setScale(innerWidth / PREVIEW_WIDTH_PX);
    };

    const readInnerWidth = () => {
      const style = getComputedStyle(node);
      const padX = Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
      return node.clientWidth - padX;
    };

    measure(readInnerWidth());

    const observer = new ResizeObserver(() => measure(readInnerWidth()));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    // `[container-type:inline-size]` lets the no-JS / pre-hydration fallback
    // size the canvas from the card width via `cqw`, so SSG HTML already fits.
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden p-6 [container-type:inline-size]"
    >
      <div
        className="origin-top-left"
        style={
          scale === null
            ? { width: `${PREVIEW_WIDTH_PX}px`, transform: "scale(min(1, calc(100cqw / 64rem)))" }
            : { width: `${PREVIEW_WIDTH_PX}px`, transform: `scale(${scale})` }
        }
      >
        <div className="max-w-none">{children}</div>
      </div>
    </div>
  );
}

const APPEARANCE_FILTERS: { value: AppearanceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

/**
 * Presentational gallery for a single block family. It receives the already
 * resolved meta + variants (loaded from the lazily-imported family chunk), so
 * the heavy preview JSX lives in that chunk and this shared shell renders the
 * filters, search and variant cards.
 */
export function BlockGalleryBody({
  slug,
  meta,
  variants,
}: {
  slug: string;
  meta: BlockMeta & { category: string };
  variants: BlockVariant[];
}) {
  const [query, setQuery] = useState("");
  const [appearanceFilter, setAppearanceFilter] = useState<AppearanceFilter>("all");

  const appearanceCounts = useMemo(() => {
    return {
      all: variants.length,
      dark: variants.filter((variant) => (variant.appearance ?? "dark") === "dark").length,
      light: variants.filter((variant) => (variant.appearance ?? "dark") === "light").length,
    } satisfies Record<AppearanceFilter, number>;
  }, [variants]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return variants.filter((variant) => {
      const appearance = variant.appearance ?? "dark";
      const matchesAppearance = appearanceFilter === "all" || appearance === appearanceFilter;
      const matchesSearch =
        !normalized || `${variant.name} ${variant.description}`.toLowerCase().includes(normalized);

      return matchesAppearance && matchesSearch;
    });
  }, [appearanceFilter, query, variants]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="border-b border-border/60">
        <div className="mx-auto max-w-[92rem] px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-fg-tertiary">
            <Link
              href="/blocks"
              className={cn(
                "rounded outline-none",
                "transition-colors duration-150",
                EASE,
                "hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Blocks
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-fg-secondary">{meta.name}</span>
          </nav>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>{meta.category}</Eyebrow>
              <h1 className="mt-3 font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
                {meta.name} variations
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-fg-secondary">{meta.description}</p>
            </div>

            {/* Plain count line — no pill, no accent icon. */}
            <div className="flex w-fit items-center gap-2 text-sm text-fg-tertiary">
              <Grid2X2 className="size-4" aria-hidden="true" />
              {variants.length} {variants.length === 1 ? "variation" : "variations"}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[92rem] gap-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="border-border/60 px-4 py-6 sm:px-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-r lg:px-8">
          <div className="flex items-center gap-2 text-sm font-medium text-fg">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters
          </div>

          <div className="mt-8">
            <h2 className="text-xs font-medium uppercase tracking-widest text-fg-tertiary">
              Appearance
            </h2>
            <div className="mt-3 grid gap-2">
              {APPEARANCE_FILTERS.map((filter) => {
                const active = appearanceFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setAppearanceFilter(filter.value)}
                    className={cn(
                      "flex h-10 w-full items-center justify-between rounded-xl border px-3 text-left text-sm outline-none",
                      "transition-colors duration-150",
                      EASE,
                      "focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-border-strong bg-surface-raised text-fg"
                        : "border-border bg-surface-inset text-fg-secondary hover:border-border-strong hover:text-fg",
                    )}
                  >
                    <span>{filter.label}</span>
                    <span className="text-xs text-fg-tertiary">
                      {appearanceCounts[filter.value]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block w-full max-w-md">
              <span className="sr-only">Search variations</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search variations..."
                className={cn(
                  "h-10 w-full rounded-xl border border-border bg-surface-inset pl-9 pr-3 text-sm text-fg outline-none placeholder:text-fg-tertiary",
                  "transition-colors duration-150",
                  EASE,
                  "focus:border-border-strong focus:ring-2 focus:ring-ring",
                )}
              />
            </label>
            <span className="text-sm text-fg-tertiary">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {filtered.map((variant) => {
                const appearance = variant.appearance ?? "dark";

                return (
                  <article
                    key={variant.id}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border border-border bg-surface-raised",
                      "transition-colors duration-200",
                      EASE,
                      "hover:border-border-strong focus-within:ring-2 focus-within:ring-ring",
                    )}
                  >
                    <div
                      data-cooud-theme="aurora"
                      data-cooud-mode={appearance}
                      className={cn(
                        "relative h-[28rem] overflow-hidden border-b border-border/60 bg-surface-inset",
                        appearance === "dark" ? "dark" : "",
                      )}
                    >
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(var(--cooud-border)_1px,transparent_1px)] opacity-45 [background-size:18px_18px]"
                      />
                      <div className="pointer-events-none absolute inset-0">
                        <ScaledPreview>{variant.preview}</ScaledPreview>
                      </div>
                    </div>

                    <div className="flex items-end justify-between gap-5 p-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">
                            {variant.name}
                          </h2>
                          <span className="rounded-full border border-border bg-surface-inset px-2 py-0.5 text-xs font-medium capitalize text-fg-tertiary">
                            {appearance}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-fg-tertiary">
                          {variant.description}
                        </p>
                      </div>
                      <ArrowRight
                        className={cn(
                          "size-5 shrink-0 text-fg-tertiary",
                          "transition-[transform,color] duration-200",
                          EASE,
                          "group-hover:translate-x-0.5 group-hover:text-fg",
                        )}
                        aria-hidden="true"
                      />
                    </div>

                    <Link
                      href={`/blocks/${slug}/${variant.id}`}
                      aria-label={`${variant.name} preview`}
                      className="absolute inset-0 z-10 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-border bg-surface-raised p-8 text-sm text-fg-secondary">
              No variations match this filter.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
