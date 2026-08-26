"use client";

import { cn } from "@cronus-ui/ui";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES, getComponentDisplayName } from "../lib/components-index";

/**
 * Flattened, server-safe catalog row for every component. Built once from the
 * lightweight `CATEGORIES` metadata — this page renders NO live previews, so it
 * never imports the heavy example families (recharts / forms / overlays). Each
 * card links to `/components/[slug]`, where the live previews stream in.
 */
const ALL_COMPONENTS = CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({
    slug: item.slug,
    name: item.name,
    displayName: getComponentDisplayName(item.name),
    description: item.description,
    category: category.name,
    categorySlug: category.slug,
  })),
);

const TOTAL = ALL_COMPONENTS.length;

const CATEGORY_FILTERS = [
  { slug: "all", name: "All", count: TOTAL },
  ...CATEGORIES.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: category.items.length,
  })),
];

export function ComponentsCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const normalized = query.trim().toLowerCase();
  // Default view (no search, "All"): keep the grouped, anchor-linkable sections
  // so deep links like /components#forms still scroll to the right place.
  const isDefaultView = category === "all" && !normalized;

  const filtered = useMemo(() => {
    return ALL_COMPONENTS.filter((component) => {
      const matchesCategory = category === "all" || component.categorySlug === category;
      const matchesSearch =
        !normalized ||
        `${component.displayName} ${component.name} ${component.description} ${component.category}`
          .toLowerCase()
          .includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [category, normalized]);

  return (
    <div className="py-10">
      <header className="border-b border-border-soft pb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-[-0.025em] text-fg">All Components</h1>
            <p className="mt-3 max-w-2xl text-lg text-fg-secondary">
              Explore the full library — {TOTAL} themeable, accessible components. Click any one to
              see variants, states and copy-paste code.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatPill label="Categories" value={CATEGORIES.length} />
            <StatPill label="Components" value={TOTAL} />
          </div>
        </div>
      </header>

      {/* Sticky filter toolbar: search + category chips, in reach while scrolling
          the long catalog. Sits just under the 4rem site nav. */}
      <div className="sticky top-16 z-10 border-b border-border-soft bg-surface-base/85 py-4 backdrop-blur supports-[backdrop-filter]:bg-surface-base/70">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search components</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search components..."
              className="h-10 w-full rounded-xl border border-border bg-surface-inset pl-9 pr-3 text-sm text-fg outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(.22,1,.36,1)] placeholder:text-fg-tertiary focus:border-border-strong focus:ring-2 focus:ring-ring motion-reduce:transition-none"
            />
          </label>

          <div className="-mx-6 flex items-center gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-1 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            {CATEGORY_FILTERS.map((filter) => {
              const active = category === filter.slug;

              return (
                // Selected reads achromatically — a firmed border on a raised
                // surface — so the filter row carries no decorative hue. Hover
                // firms the border and the label only: color-only tweens, no
                // layout shift.
                <button
                  key={filter.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(filter.slug)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm outline-none",
                    "transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
                    active
                      ? "border-border-strong bg-surface-raised text-fg shadow-xs"
                      : "border-border bg-surface-inset text-fg-secondary hover:border-border-strong hover:text-fg",
                  )}
                >
                  <span>{filter.name}</span>
                  <span
                    className={cn(
                      "text-xs tabular-nums transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
                      active ? "text-fg-secondary" : "text-fg-tertiary",
                    )}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-8">
        <p className="text-sm tabular-nums text-fg-tertiary" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "component" : "components"}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface-raised p-10 text-center">
            <p className="text-sm text-fg-secondary">
              No components match {query ? `“${query.trim()}”` : "this filter"}.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
              className="mt-3 text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Clear filters
            </button>
          </div>
        ) : isDefaultView ? (
          <div className="mt-6 flex flex-col gap-12">
            {CATEGORIES.map((cat) => (
              <section key={cat.slug} id={cat.slug} className="scroll-mt-36">
                <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-fg">
                  {cat.name}
                </h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {cat.items.map((item, index) => (
                    <ComponentCard
                      key={item.slug}
                      slug={item.slug}
                      displayName={getComponentDisplayName(item.name)}
                      description={item.description}
                      category={cat.name}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((component, index) => (
              <ComponentCard
                key={component.slug}
                slug={component.slug}
                displayName={component.displayName}
                description={component.description}
                category={component.category}
                index={index}
                showTag
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentCard({
  slug,
  displayName,
  description,
  category,
  index = 0,
  showTag = false,
}: {
  slug: string;
  displayName: string;
  description: string;
  category: string;
  /** Position in its grid — drives the (capped) entrance stagger delay. */
  index?: number;
  showTag?: boolean;
}) {
  return (
    // Entrance lives on this wrapper (not the card) so the per-item
    // transition-delay never lags the card's own hover tweens. Cards fade/slide
    // up from the `starting:` state (CSS @starting-style) as they mount; the
    // stagger is capped so deep grids never feel slow. Reduced-motion safe.
    <div
      className="transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none motion-reduce:starting:translate-y-0 motion-reduce:starting:opacity-100"
      style={{ transitionDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-border-strong hover:shadow-sm focus-within:border-border-strong focus-within:ring-2 focus-within:ring-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        {/* Lightweight thumbnail — a dotted-grid card with the component name. No
            live preview here (that lives on the /components/[slug] route). */}
        <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-border-soft bg-surface-inset">
          {/* The preview content (grid + name) lifts a hair on hover — a GPU
              transform inside the overflow-hidden frame, so no layout shift. */}
          <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(var(--cronus-border)_1px,transparent_1px)] opacity-50 [background-size:16px_16px]"
            />
            <span className="relative px-4 text-center font-display text-lg text-fg-tertiary transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:text-fg motion-reduce:transition-none">
              {displayName}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-fg">{displayName}</span>
            {showTag ? (
              <span className="shrink-0 rounded-full border border-border bg-surface-inset px-2 py-0.5 text-xs font-medium text-fg-tertiary">
                {category}
              </span>
            ) : null}
          </div>
          <span className="line-clamp-1 text-sm text-fg-tertiary">{description}</span>
        </div>
        <Link
          href={`/components/${slug}`}
          aria-label={displayName}
          className="absolute inset-0 z-20 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-3 py-1.5 text-sm">
      <span className="font-semibold tabular-nums text-fg">{value}</span>
      <span className="text-fg-tertiary">{label}</span>
    </div>
  );
}
