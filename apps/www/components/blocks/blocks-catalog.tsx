"use client";

import { cn } from "@kronus-ui/ui";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BLOCK_CATEGORIES,
  BLOCK_COUNT,
  BLOCK_VARIANT_COUNT,
  getBlockVariantMetas,
} from "../../lib/blocks-index";
import { Eyebrow } from "../showcase-ui";

/**
 * Flattened, server-safe catalog row for every block. Built once from the
 * lightweight `BLOCK_CATEGORIES` metadata — this page renders NO live previews,
 * so it never imports the heavy `lib/blocks/*` family chunks. Each block links
 * to its `/blocks/[slug]` gallery, where the live previews stream in.
 */
const ALL_BLOCKS = BLOCK_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    category: category.name,
    categorySlug: category.slug,
    variations: getBlockVariantMetas(item.slug).length,
  })),
);

const CATEGORY_FILTERS = [
  { slug: "all", name: "All", count: ALL_BLOCKS.length },
  ...BLOCK_CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: category.items.length,
  })),
];

/** Single motion curve for the whole surface — short, calm, non-bouncy. */
const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

export function BlocksCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return ALL_BLOCKS.filter((block) => {
      const matchesCategory = category === "all" || block.categorySlug === category;
      const matchesSearch =
        !normalized ||
        `${block.name} ${block.description} ${block.category}`.toLowerCase().includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [query, category]);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-[92rem] px-4 py-12 sm:px-6 lg:px-8">
          <Eyebrow>Blocks</Eyebrow>
          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-4xl font-normal tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
                Ready-made sections
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-fg-secondary">
                Copy-paste UI sections composed from Kronus UI. Open a family, compare variations,
                then launch the live preview and source.
              </p>
            </div>
            {/* Stats read as a divided row, not as three nested pills. */}
            <div className="flex flex-wrap items-center divide-x divide-border">
              <Stat label="Families" value={BLOCK_CATEGORIES.length} />
              <Stat label="Blocks" value={BLOCK_COUNT} />
              <Stat label="Variations" value={BLOCK_VARIANT_COUNT} />
            </div>
          </div>
        </div>
      </header>

      {/* Sticky filter toolbar: search + category chips. Stays in reach while
          scrolling a long catalog. Sits just under the 4rem site nav. */}
      <div className="sticky top-16 z-10 border-b border-border/60 bg-surface-base/85 backdrop-blur supports-[backdrop-filter]:bg-surface-base/70">
        <div className="mx-auto flex max-w-[92rem] flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-8">
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search blocks</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blocks..."
              className={cn(
                "h-10 w-full rounded-xl border border-border bg-surface-inset pl-9 pr-3 text-sm text-fg outline-none placeholder:text-fg-tertiary",
                "transition-colors duration-150",
                EASE,
                "focus:border-border-strong focus:ring-2 focus:ring-ring",
              )}
            />
          </label>

          <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-1 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            {CATEGORY_FILTERS.map((filter) => {
              const active = category === filter.slug;

              return (
                <button
                  key={filter.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(filter.slug)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm outline-none",
                    "transition-colors duration-150",
                    EASE,
                    "focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-border-strong bg-surface-raised text-fg"
                      : "border-border bg-surface-inset text-fg-secondary hover:border-border-strong hover:text-fg",
                  )}
                >
                  <span>{filter.name}</span>
                  <span
                    className={cn("text-xs", active ? "text-fg-secondary" : "text-fg-tertiary")}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[92rem] px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-fg-tertiary" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "block" : "blocks"}
        </p>

        {filtered.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((block) => (
              <article
                key={block.slug}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised",
                  "transition-colors duration-200",
                  EASE,
                  "hover:border-border-strong focus-within:ring-2 focus-within:ring-ring",
                )}
              >
                {/* Lightweight thumbnail — dotted-grid surface + the block name.
                    No live preview here (that lives on the gallery route). */}
                <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-border/60 bg-surface-inset">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(var(--kronus-border)_1px,transparent_1px)] opacity-40 [background-size:16px_16px]"
                  />
                  <span
                    className={cn(
                      "relative px-4 text-center font-display text-xl font-normal tracking-[-0.02em] text-fg-tertiary",
                      "transition-colors duration-200",
                      EASE,
                      "group-hover:text-fg",
                    )}
                  >
                    {block.name}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-fg">{block.name}</span>
                    <span className="shrink-0 rounded-full border border-border bg-surface-inset px-2 py-0.5 text-xs font-medium text-fg-tertiary">
                      {block.category}
                    </span>
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm text-fg-tertiary">
                    {block.description}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-fg-tertiary">
                      {block.variations} {block.variations === 1 ? "variation" : "variations"}
                    </span>
                    <ArrowRight
                      className={cn(
                        "size-4 shrink-0 text-fg-tertiary",
                        "transition-[transform,color] duration-200",
                        EASE,
                        "group-hover:translate-x-0.5 group-hover:text-fg",
                      )}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <Link
                  href={`/blocks/${block.slug}`}
                  aria-label={block.name}
                  className="absolute inset-0 z-20 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-border bg-surface-raised p-10 text-center">
            <p className="text-sm text-fg-secondary">
              No blocks match {query ? `“${query.trim()}”` : "this filter"}.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className={cn(
                "mt-3 text-sm font-medium text-primary underline-offset-4 outline-none",
                "transition-colors duration-150",
                EASE,
                "hover:underline focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1.5 px-4 text-sm first:pl-0 last:pr-0">
      <span className="font-medium text-fg">{value}</span>
      <span className="text-fg-tertiary">{label}</span>
    </div>
  );
}
