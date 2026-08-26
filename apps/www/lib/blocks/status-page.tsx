"use client";

import { Button, Card } from "@cronus-ui/ui";
import { ArrowRight } from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Status page — service status section
 *
 * An overall "all systems operational" banner, one uptime row per service
 * (45 tiny day segments, oldest → newest, each with a tooltip-ish `title`),
 * and a legend + incident-history footer. Everything is static/deterministic
 * (fixed incident indices, no Date/random) so server and client markup match.
 * ────────────────────────────────────────────────────────────────────────── */

type SegmentTone = "operational" | "degraded" | "outage";

interface ServiceUptime {
  name: string;
  uptime: string;
  /** Segment indices (0 = oldest of the 45 days) with degraded performance. */
  degraded: readonly number[];
  /** Segment indices with a full outage. */
  outage: readonly number[];
}

const SERVICES: readonly ServiceUptime[] = [
  { name: "API", uptime: "99.98%", degraded: [11, 29], outage: [30] },
  { name: "Dashboard", uptime: "99.95%", degraded: [7, 22, 36], outage: [23] },
  { name: "Webhooks", uptime: "99.91%", degraded: [3, 18], outage: [19] },
  { name: "CDN", uptime: "99.99%", degraded: [33, 41], outage: [8] },
];

const SEGMENTS = Array.from({ length: 45 }, (_, index) => index);

const TONE_CLASS: Record<SegmentTone, string> = {
  operational: "bg-success/70",
  degraded: "bg-warning/70",
  outage: "bg-error/70",
};

const TONE_LABEL: Record<SegmentTone, string> = {
  operational: "Operational",
  degraded: "Degraded performance",
  outage: "Outage",
};

function segmentTone(service: ServiceUptime, index: number): SegmentTone {
  if (service.outage.includes(index)) return "outage";
  if (service.degraded.includes(index)) return "degraded";
  return "operational";
}

function segmentTitle(index: number, tone: SegmentTone): string {
  const daysAgo = SEGMENTS.length - 1 - index;
  const day = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;
  return `${day} · ${TONE_LABEL[tone]}`;
}

export function StatusPageBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3"
        >
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-success" />
          </span>
          <p className="font-medium text-sm text-success-strong">All systems operational</p>
          <span className="ml-auto text-fg-tertiary text-xs tabular-nums">Updated 2 min ago</span>
        </div>

        <Card className="gap-0 divide-y divide-border p-0">
          {SERVICES.map((service) => (
            <div key={service.name} className="flex items-center gap-4 px-4 py-3.5">
              <span className="w-24 shrink-0 truncate font-medium text-sm">{service.name}</span>
              <div
                role="img"
                aria-label={`${service.name}: ${service.uptime} uptime over the last 45 days`}
                className="flex min-w-0 flex-1 items-center gap-px"
              >
                {SEGMENTS.map((index) => {
                  const tone = segmentTone(service, index);
                  return (
                    <span
                      key={index}
                      title={segmentTitle(index, tone)}
                      className={`h-6 min-w-0 flex-1 rounded-sm transition-opacity hover:opacity-70 motion-reduce:transition-none ${TONE_CLASS[tone]}`}
                    />
                  );
                })}
              </div>
              <span className="w-16 shrink-0 text-right text-fg-secondary text-sm tabular-nums">
                {service.uptime}
              </span>
            </div>
          ))}
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-fg-tertiary text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-success/70" aria-hidden="true" />
              Operational
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-warning/70" aria-hidden="true" />
              Degraded
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-error/70" aria-hidden="true" />
              Outage
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="#incident-history">
              View incident history
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const statusPageCode = `import { Button, Card } from "@cronus-ui/ui";
import { ArrowRight } from "lucide-react";

type SegmentTone = "operational" | "degraded" | "outage";

interface ServiceUptime {
  name: string;
  uptime: string;
  /** Segment indices (0 = oldest of the 45 days) with degraded performance. */
  degraded: readonly number[];
  /** Segment indices with a full outage. */
  outage: readonly number[];
}

const SERVICES: readonly ServiceUptime[] = [
  { name: "API", uptime: "99.98%", degraded: [11, 29], outage: [30] },
  { name: "Dashboard", uptime: "99.95%", degraded: [7, 22, 36], outage: [23] },
  { name: "Webhooks", uptime: "99.91%", degraded: [3, 18], outage: [19] },
  { name: "CDN", uptime: "99.99%", degraded: [33, 41], outage: [8] },
];

const SEGMENTS = Array.from({ length: 45 }, (_, index) => index);

const TONE_CLASS: Record<SegmentTone, string> = {
  operational: "bg-success/70",
  degraded: "bg-warning/70",
  outage: "bg-error/70",
};

const TONE_LABEL: Record<SegmentTone, string> = {
  operational: "Operational",
  degraded: "Degraded performance",
  outage: "Outage",
};

function segmentTone(service: ServiceUptime, index: number): SegmentTone {
  if (service.outage.includes(index)) return "outage";
  if (service.degraded.includes(index)) return "degraded";
  return "operational";
}

function segmentTitle(index: number, tone: SegmentTone): string {
  const daysAgo = SEGMENTS.length - 1 - index;
  const day = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : \`\${daysAgo} days ago\`;
  return \`\${day} · \${TONE_LABEL[tone]}\`;
}

export function StatusPageBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3"
        >
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2.5 rounded-full bg-success" />
          </span>
          <p className="font-medium text-sm text-success-strong">All systems operational</p>
          <span className="ml-auto text-fg-tertiary text-xs tabular-nums">Updated 2 min ago</span>
        </div>

        <Card className="gap-0 divide-y divide-border p-0">
          {SERVICES.map((service) => (
            <div key={service.name} className="flex items-center gap-4 px-4 py-3.5">
              <span className="w-24 shrink-0 truncate font-medium text-sm">{service.name}</span>
              <div
                role="img"
                aria-label={\`\${service.name}: \${service.uptime} uptime over the last 45 days\`}
                className="flex min-w-0 flex-1 items-center gap-px"
              >
                {SEGMENTS.map((index) => {
                  const tone = segmentTone(service, index);
                  return (
                    <span
                      key={index}
                      title={segmentTitle(index, tone)}
                      className={\`h-6 min-w-0 flex-1 rounded-sm transition-opacity hover:opacity-70 motion-reduce:transition-none \${TONE_CLASS[tone]}\`}
                    />
                  );
                })}
              </div>
              <span className="w-16 shrink-0 text-right text-fg-secondary text-sm tabular-nums">
                {service.uptime}
              </span>
            </div>
          ))}
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-fg-tertiary text-xs">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-success/70" aria-hidden="true" />
              Operational
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-warning/70" aria-hidden="true" />
              Degraded
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-error/70" aria-hidden="true" />
              Outage
            </span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="#incident-history">
              View incident history
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const statusPageBlocks: BlockContentMap = {
  "status-page": { preview: <StatusPageBlock />, code: statusPageCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function StatusPageGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(statusPageBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function StatusPageView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(statusPageBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
