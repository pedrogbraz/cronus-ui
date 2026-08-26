"use client";

import { Badge } from "@kronus-ui/ui";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Changelog — product release feed on a vertical timeline
 * ────────────────────────────────────────────────────────────────────────── */

type ChangeKind = "Feature" | "Fix" | "Perf";

/** Change type → Badge tone (Feature = success, Fix = info, Perf = warning). */
const CHANGE_BADGE_VARIANT: Record<ChangeKind, "success" | "info" | "warning"> = {
  Feature: "success",
  Fix: "info",
  Perf: "warning",
};

interface ChangelogRelease {
  version: string;
  /** ISO date for the `<time dateTime>` attribute. */
  date: string;
  /** Human-readable date, pre-formatted so server and client render identically. */
  dateLabel: string;
  title: string;
  description: string;
  latest?: boolean;
  changes: ReadonlyArray<{ kind: ChangeKind; text: string }>;
}

const RELEASES: ReadonlyArray<ChangelogRelease> = [
  {
    version: "v0.3.0",
    date: "2026-07-02",
    dateLabel: "July 2, 2026",
    title: "Spotlight effects and timeline primitives",
    description:
      "This release focuses on ambient polish: pointer-tracked glows, composable timelines, and a leaner registry payload for faster installs.",
    latest: true,
    changes: [
      {
        kind: "Feature",
        text: "SpotlightCard now tracks the pointer with CSS variables inside requestAnimationFrame — zero re-renders, reduced-motion safe.",
      },
      {
        kind: "Feature",
        text: "New Timeline primitives with toned dots, icons, and connector lines for activity feeds.",
      },
      {
        kind: "Perf",
        text: "Registry items ship 38% less JSON by deduplicating shared file metadata.",
      },
      {
        kind: "Fix",
        text: "Badge no longer clips descenders when a leading icon is present.",
      },
    ],
  },
  {
    version: "v0.2.4",
    date: "2026-06-18",
    dateLabel: "June 18, 2026",
    title: "Sharper focus rings, smaller bundles",
    description:
      "A quality pass across form controls and the showcase build, driven by keyboard-navigation audits.",
    changes: [
      {
        kind: "Fix",
        text: "Select and Combobox render a full focus-visible ring inside dense table rows.",
      },
      {
        kind: "Perf",
        text: "Icon imports are tree-shaken per block, cutting showcase JavaScript by 22 KB.",
      },
      {
        kind: "Feature",
        text: "Badge gains an info variant to complete the semantic tone set.",
      },
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-06-03",
    dateLabel: "June 3, 2026",
    title: "Theming without the flash",
    description:
      "Theme state now resolves before first paint, and token overrides react to runtime changes across every scope.",
    changes: [
      {
        kind: "Feature",
        text: "KronusThemeScript inlines the stored theme before hydration — no dark-mode flash.",
      },
      {
        kind: "Feature",
        text: "Token overrides are reactive: swap a palette at any DOM scope and components follow.",
      },
      {
        kind: "Fix",
        text: "Card borders use the border token on inset surfaces instead of inheriting the raised tone.",
      },
    ],
  },
];

export function ChangelogBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <section aria-labelledby="changelog-heading" className="w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3">
          <span className="font-medium text-primary-strong text-xs uppercase tracking-widest">
            Changelog
          </span>
          <h2 id="changelog-heading" className="font-display font-semibold text-3xl tracking-tight">
            What&rsquo;s new
          </h2>
          <p className="max-w-xl text-fg-secondary text-sm leading-relaxed">
            New features, fixes, and performance work — everything that shipped, release by release.
          </p>
        </div>

        <ol className="relative mt-10 flex flex-col gap-12">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />
          {RELEASES.map((release) => (
            <li key={release.version} className="relative flex flex-col gap-3 pl-8 sm:pl-10">
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-0 size-[11px] rounded-full bg-gradient-primary shadow-glow"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono tabular-nums">
                  {release.version}
                </Badge>
                {release.latest ? <Badge variant="primary">Latest</Badge> : null}
                <time dateTime={release.date} className="text-fg-tertiary text-xs tabular-nums">
                  {release.dateLabel}
                </time>
              </div>

              <h3 className="font-display font-semibold text-fg text-xl">{release.title}</h3>
              <p className="text-fg-secondary text-sm leading-relaxed">{release.description}</p>

              <ul className="mt-1 flex flex-col gap-2.5">
                {release.changes.map((change) => (
                  <li key={change.text} className="flex items-start gap-3">
                    <Badge
                      variant={CHANGE_BADGE_VARIANT[change.kind]}
                      className="w-16 shrink-0 justify-center"
                    >
                      {change.kind}
                    </Badge>
                    <span className="text-fg-secondary text-sm leading-relaxed">{change.text}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const changelogCode = `import { Badge } from "@kronus-ui/ui";

type ChangeKind = "Feature" | "Fix" | "Perf";

/** Change type → Badge tone (Feature = success, Fix = info, Perf = warning). */
const CHANGE_BADGE_VARIANT: Record<ChangeKind, "success" | "info" | "warning"> = {
  Feature: "success",
  Fix: "info",
  Perf: "warning",
};

interface ChangelogRelease {
  version: string;
  /** ISO date for the <time dateTime> attribute. */
  date: string;
  /** Human-readable date, pre-formatted so server and client render identically. */
  dateLabel: string;
  title: string;
  description: string;
  latest?: boolean;
  changes: ReadonlyArray<{ kind: ChangeKind; text: string }>;
}

const RELEASES: ReadonlyArray<ChangelogRelease> = [
  {
    version: "v0.3.0",
    date: "2026-07-02",
    dateLabel: "July 2, 2026",
    title: "Spotlight effects and timeline primitives",
    description:
      "This release focuses on ambient polish: pointer-tracked glows, composable timelines, and a leaner registry payload for faster installs.",
    latest: true,
    changes: [
      {
        kind: "Feature",
        text: "SpotlightCard now tracks the pointer with CSS variables inside requestAnimationFrame — zero re-renders, reduced-motion safe.",
      },
      {
        kind: "Feature",
        text: "New Timeline primitives with toned dots, icons, and connector lines for activity feeds.",
      },
      {
        kind: "Perf",
        text: "Registry items ship 38% less JSON by deduplicating shared file metadata.",
      },
      {
        kind: "Fix",
        text: "Badge no longer clips descenders when a leading icon is present.",
      },
    ],
  },
  {
    version: "v0.2.4",
    date: "2026-06-18",
    dateLabel: "June 18, 2026",
    title: "Sharper focus rings, smaller bundles",
    description:
      "A quality pass across form controls and the showcase build, driven by keyboard-navigation audits.",
    changes: [
      {
        kind: "Fix",
        text: "Select and Combobox render a full focus-visible ring inside dense table rows.",
      },
      {
        kind: "Perf",
        text: "Icon imports are tree-shaken per block, cutting showcase JavaScript by 22 KB.",
      },
      {
        kind: "Feature",
        text: "Badge gains an info variant to complete the semantic tone set.",
      },
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-06-03",
    dateLabel: "June 3, 2026",
    title: "Theming without the flash",
    description:
      "Theme state now resolves before first paint, and token overrides react to runtime changes across every scope.",
    changes: [
      {
        kind: "Feature",
        text: "KronusThemeScript inlines the stored theme before hydration — no dark-mode flash.",
      },
      {
        kind: "Feature",
        text: "Token overrides are reactive: swap a palette at any DOM scope and components follow.",
      },
      {
        kind: "Fix",
        text: "Card borders use the border token on inset surfaces instead of inheriting the raised tone.",
      },
    ],
  },
];

export function ChangelogBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <section aria-labelledby="changelog-heading" className="w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-3">
          <span className="font-medium text-primary-strong text-xs uppercase tracking-widest">
            Changelog
          </span>
          <h2 id="changelog-heading" className="font-display font-semibold text-3xl tracking-tight">
            What&rsquo;s new
          </h2>
          <p className="max-w-xl text-fg-secondary text-sm leading-relaxed">
            New features, fixes, and performance work — everything that shipped, release by release.
          </p>
        </div>

        <ol className="relative mt-10 flex flex-col gap-12">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />
          {RELEASES.map((release) => (
            <li key={release.version} className="relative flex flex-col gap-3 pl-8 sm:pl-10">
              <span
                aria-hidden="true"
                className="absolute top-1.5 left-0 size-[11px] rounded-full bg-gradient-primary shadow-glow"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono tabular-nums">
                  {release.version}
                </Badge>
                {release.latest ? <Badge variant="primary">Latest</Badge> : null}
                <time dateTime={release.date} className="text-fg-tertiary text-xs tabular-nums">
                  {release.dateLabel}
                </time>
              </div>

              <h3 className="font-display font-semibold text-fg text-xl">{release.title}</h3>
              <p className="text-fg-secondary text-sm leading-relaxed">{release.description}</p>

              <ul className="mt-1 flex flex-col gap-2.5">
                {release.changes.map((change) => (
                  <li key={change.text} className="flex items-start gap-3">
                    <Badge
                      variant={CHANGE_BADGE_VARIANT[change.kind]}
                      className="w-16 shrink-0 justify-center"
                    >
                      {change.kind}
                    </Badge>
                    <span className="text-fg-secondary text-sm leading-relaxed">{change.text}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const changelogBlocks: BlockContentMap = {
  changelog: { preview: <ChangelogBlock />, code: changelogCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function ChangelogGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(changelogBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function ChangelogView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(changelogBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
