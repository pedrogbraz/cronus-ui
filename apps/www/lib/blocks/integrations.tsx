"use client";

import { Badge, Button } from "@cronus-ui/ui";
import { Check, CreditCard, FileText, MessageSquare, SquareKanban, Triangle } from "lucide-react";
import type { SVGProps } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * Inline brand glyphs — same geometry as the lucide brand marks, kept local
 * so the blocks never import brand icons from `lucide-react`.
 * ────────────────────────────────────────────────────────────────────────── */

function GithubGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function FigmaGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    </svg>
  );
}

function SlackGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="3" height="8" x="13" y="2" rx="1.5" />
      <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
      <rect width="3" height="8" x="8" y="14" rx="1.5" />
      <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
      <rect width="8" height="3" x="14" y="13" rx="1.5" />
      <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
      <rect width="8" height="3" x="2" y="8" rx="1.5" />
      <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Integrations grid — marketing section of connectable services
 * ────────────────────────────────────────────────────────────────────────── */

const INTEGRATIONS = [
  {
    icon: SlackGlyph,
    name: "Slack",
    description: "Route alerts and approvals into any channel.",
    connected: true,
  },
  {
    icon: GithubGlyph,
    name: "GitHub",
    description: "Sync issues, PRs, and deploy statuses.",
    connected: true,
  },
  {
    icon: FigmaGlyph,
    name: "Figma",
    description: "Embed live design files next to specs.",
    connected: false,
  },
  {
    icon: SquareKanban,
    name: "Linear",
    description: "Create issues from feedback in one click.",
    connected: false,
  },
  {
    icon: FileText,
    name: "Notion",
    description: "Publish docs and changelogs automatically.",
    connected: false,
  },
  {
    icon: CreditCard,
    name: "Stripe",
    description: "Reconcile invoices and payout events.",
    connected: true,
  },
  {
    icon: Triangle,
    name: "Vercel",
    description: "Preview every branch before it ships.",
    connected: false,
  },
  {
    icon: MessageSquare,
    name: "Discord",
    description: "Keep your community in the release loop.",
    connected: false,
  },
] as const;

/**
 * Marketing integrations section: a centered eyebrow/title/lede header above a
 * responsive grid of integration tiles. Each tile pairs a monochrome lucide
 * mark inside a rounded-xl icon well with a name, a one-line description, and
 * a right-aligned action — an outline `Connect` button, or a success Badge
 * once the service is linked.
 *
 * Hover affect is pure token-driven CSS (`group` + `transition-colors`):
 * the tile border steps up to `border-border-strong`, the surface lifts to
 * `bg-surface-overlay`, and the icon tints to `text-primary`. Color-only
 * transitions introduce no movement, so no reduced-motion branch is needed.
 */
export function IntegrationsGridBlock() {
  return (
    <section aria-labelledby="integrations-heading" className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Integrations</Badge>
        <h2
          id="integrations-heading"
          className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg"
        >
          Plays well with your stack
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Connect the tools your team already lives in — two clicks, no glue code, revocable
          anytime.
        </p>
      </div>

      <ul className="mx-auto mt-14 grid max-w-5xl list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INTEGRATIONS.map((integration) => (
          <li
            key={integration.name}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5 transition-colors hover:border-border-strong hover:bg-surface-overlay"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-inset text-fg-secondary transition-colors group-hover:text-primary">
                <integration.icon aria-hidden="true" className="size-5" />
              </span>
              {integration.connected ? (
                <Badge variant="success">
                  <Check aria-hidden="true" />
                  Connected
                </Badge>
              ) : (
                <Button variant="outline" size="sm">
                  Connect<span className="sr-only"> {integration.name}</span>
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-fg text-sm">{integration.name}</h3>
              <p className="text-fg-tertiary text-sm">{integration.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const integrationsCode = `import { Badge, Button } from "@cronus-ui/ui";
import { Check, CreditCard, FileText, MessageSquare, SquareKanban, Triangle } from "lucide-react";
import type { SVGProps } from "react";

function GithubGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function FigmaGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
    </svg>
  );
}

function SlackGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="3" height="8" x="13" y="2" rx="1.5" />
      <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
      <rect width="3" height="8" x="8" y="14" rx="1.5" />
      <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
      <rect width="8" height="3" x="14" y="13" rx="1.5" />
      <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
      <rect width="8" height="3" x="2" y="8" rx="1.5" />
      <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
    </svg>
  );
}

const INTEGRATIONS = [
  {
    icon: SlackGlyph,
    name: "Slack",
    description: "Route alerts and approvals into any channel.",
    connected: true,
  },
  {
    icon: GithubGlyph,
    name: "GitHub",
    description: "Sync issues, PRs, and deploy statuses.",
    connected: true,
  },
  {
    icon: FigmaGlyph,
    name: "Figma",
    description: "Embed live design files next to specs.",
    connected: false,
  },
  {
    icon: SquareKanban,
    name: "Linear",
    description: "Create issues from feedback in one click.",
    connected: false,
  },
  {
    icon: FileText,
    name: "Notion",
    description: "Publish docs and changelogs automatically.",
    connected: false,
  },
  {
    icon: CreditCard,
    name: "Stripe",
    description: "Reconcile invoices and payout events.",
    connected: true,
  },
  {
    icon: Triangle,
    name: "Vercel",
    description: "Preview every branch before it ships.",
    connected: false,
  },
  {
    icon: MessageSquare,
    name: "Discord",
    description: "Keep your community in the release loop.",
    connected: false,
  },
] as const;

export function IntegrationsGridBlock() {
  return (
    <section aria-labelledby="integrations-heading" className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary">Integrations</Badge>
        <h2
          id="integrations-heading"
          className="mt-4 font-display text-4xl font-semibold tracking-tight text-fg"
        >
          Plays well with your stack
        </h2>
        <p className="mt-4 text-balance text-fg-secondary">
          Connect the tools your team already lives in — two clicks, no glue code, revocable
          anytime.
        </p>
      </div>

      <ul className="mx-auto mt-14 grid max-w-5xl list-none gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INTEGRATIONS.map((integration) => (
          <li
            key={integration.name}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5 transition-colors hover:border-border-strong hover:bg-surface-overlay"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-inset text-fg-secondary transition-colors group-hover:text-primary">
                <integration.icon aria-hidden="true" className="size-5" />
              </span>
              {integration.connected ? (
                <Badge variant="success">
                  <Check aria-hidden="true" />
                  Connected
                </Badge>
              ) : (
                <Button variant="outline" size="sm">
                  Connect<span className="sr-only"> {integration.name}</span>
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-fg text-sm">{integration.name}</h3>
              <p className="text-fg-tertiary text-sm">{integration.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const integrationsBlocks: BlockContentMap = {
  integrations: { preview: <IntegrationsGridBlock />, code: integrationsCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function IntegrationsGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(integrationsBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function IntegrationsView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(integrationsBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
