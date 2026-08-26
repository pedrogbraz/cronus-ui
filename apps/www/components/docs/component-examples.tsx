"use client";

import { cn } from "@cronus-ui/ui";
import dynamic from "next/dynamic";
import { type ComponentType, useState } from "react";
import { type ExampleFamily, getExampleFamily } from "../../lib/examples/registry";
import { ComponentVariantsGallery } from "./component-variants-gallery";

/**
 * Skeleton shown while a component's example *family* chunk streams in. Mirrors
 * the rhythm of `ExampleBlock` (heading + framed preview + code block) so the
 * detail page doesn't shift layout once the live examples hydrate.
 */
function ExamplesSkeleton() {
  return (
    <div className="flex flex-col gap-12" aria-hidden="true">
      {[0, 1].map((row) => (
        <section key={row} className="flex flex-col gap-4">
          <div className="h-6 w-40 animate-pulse rounded-md bg-surface-inset" />
          <div className="h-3 w-72 max-w-full animate-pulse rounded bg-surface-inset/70" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-surface-inset/50" />
          <div className="h-10 animate-pulse rounded-xl bg-surface-inset/60" />
        </section>
      ))}
    </div>
  );
}

type FamilyView = ComponentType<{ slug: string }>;

/**
 * One `next/dynamic` per family. The import specifiers are static (so the
 * bundler can split them), but only the family a slug belongs to is ever
 * imported — visiting `/components/button` pulls the buttons chunk and never
 * touches recharts, forms or overlays. `ssr: false` is intentionally NOT set:
 * the examples still server-render (showcase stays crawlable / no blank flash);
 * the win is that each family is a separate, route-scoped chunk instead of one
 * eager catalog barrel.
 */
const FAMILY_VIEWS: Record<ExampleFamily, FamilyView> = {
  buttons: dynamic(() => import("../../lib/examples/buttons"), { loading: ExamplesSkeleton }),
  forms: dynamic(() => import("../../lib/examples/forms"), { loading: ExamplesSkeleton }),
  "data-display": dynamic(() => import("../../lib/examples/data-display"), {
    loading: ExamplesSkeleton,
  }),
  feedback: dynamic(() => import("../../lib/examples/feedback"), { loading: ExamplesSkeleton }),
  overlays: dynamic(() => import("../../lib/examples/overlays"), { loading: ExamplesSkeleton }),
  navigation: dynamic(() => import("../../lib/examples/navigation"), { loading: ExamplesSkeleton }),
  "date-time": dynamic(() => import("../../lib/examples/date-time"), { loading: ExamplesSkeleton }),
  charts: dynamic(() => import("../../lib/examples/charts"), { loading: ExamplesSkeleton }),
  premium: dynamic(() => import("../../lib/examples/premium"), { loading: ExamplesSkeleton }),
};

type GalleryView = ComponentType<{ slug: string; displayName: string }>;

/**
 * The Gallery counterpart of `FAMILY_VIEWS`: it pulls the SAME family chunk (so
 * no extra bundle — the sectioned + gallery views share one dynamic import) but
 * feeds the family's exported `ExampleMap` into `ComponentVariantsGallery`
 * instead of the stacked `ExampleList`. Each named inner component is defined
 * once, at module scope inside the import resolution (not per-render).
 */
const FAMILY_GALLERY_VIEWS: Record<ExampleFamily, GalleryView> = {
  buttons: dynamic(
    () =>
      import("../../lib/examples/buttons").then((m) => ({
        default: function ButtonsGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.buttonsExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  forms: dynamic(
    () =>
      import("../../lib/examples/forms").then((m) => ({
        default: function FormsGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.formsExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  "data-display": dynamic(
    () =>
      import("../../lib/examples/data-display").then((m) => ({
        default: function DataDisplayGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.dataDisplayExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  feedback: dynamic(
    () =>
      import("../../lib/examples/feedback").then((m) => ({
        default: function FeedbackGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.feedbackExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  overlays: dynamic(
    () =>
      import("../../lib/examples/overlays").then((m) => ({
        default: function OverlaysGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.overlaysExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  navigation: dynamic(
    () =>
      import("../../lib/examples/navigation").then((m) => ({
        default: function NavigationGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.navigationExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  "date-time": dynamic(
    () =>
      import("../../lib/examples/date-time").then((m) => ({
        default: function DateTimeGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.dateTimeExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  charts: dynamic(
    () =>
      import("../../lib/examples/charts").then((m) => ({
        default: function ChartsGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.chartsExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
  premium: dynamic(
    () =>
      import("../../lib/examples/premium").then((m) => ({
        default: function PremiumGallery({
          slug,
          displayName,
        }: {
          slug: string;
          displayName: string;
        }) {
          return (
            <ComponentVariantsGallery
              examples={m.premiumExamples[slug] ?? []}
              displayName={displayName}
            />
          );
        },
      })),
    { loading: ExamplesSkeleton },
  ),
};

const VIEW_OPTIONS = [
  { value: "examples", label: "Examples" },
  { value: "gallery", label: "Gallery" },
] as const;

type ExampleView = (typeof VIEW_OPTIONS)[number]["value"];

export function ComponentExamples({ slug, displayName }: { slug: string; displayName: string }) {
  const [view, setView] = useState<ExampleView>("examples");
  const family = getExampleFamily(slug);
  const FamilyView = family ? FAMILY_VIEWS[family] : undefined;
  const GalleryView = family ? FAMILY_GALLERY_VIEWS[family] : undefined;

  if (!FamilyView) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface-inset px-6 py-10 text-center text-sm text-fg-tertiary">
        Interactive examples for {displayName} are coming soon.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">Examples</h2>
        <div
          role="tablist"
          aria-label="Example layout"
          className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-inset p-1"
        >
          {VIEW_OPTIONS.map((option) => {
            const active = view === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setView(option.value)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "bg-surface-raised text-fg" : "text-fg-tertiary hover:text-fg",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === "examples" ? (
        <div className="flex flex-col gap-12">
          <FamilyView slug={slug} />
        </div>
      ) : GalleryView ? (
        <GalleryView slug={slug} displayName={displayName} />
      ) : null}
    </div>
  );
}
