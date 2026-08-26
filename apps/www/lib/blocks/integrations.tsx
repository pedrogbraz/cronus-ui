"use client";

import { Badge, Button } from "@kronus-ui/ui";
import {
  Check,
  CreditCard,
  Figma,
  FileText,
  Github,
  MessageSquare,
  Slack,
  SquareKanban,
  Triangle,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Integrations grid — marketing section of connectable services
 * ────────────────────────────────────────────────────────────────────────── */

const INTEGRATIONS = [
  {
    icon: Slack,
    name: "Slack",
    description: "Route alerts and approvals into any channel.",
    connected: true,
  },
  {
    icon: Github,
    name: "GitHub",
    description: "Sync issues, PRs, and deploy statuses.",
    connected: true,
  },
  {
    icon: Figma,
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

const integrationsCode = `import { Badge, Button } from "@kronus-ui/ui";
import {
  Check,
  CreditCard,
  Figma,
  FileText,
  Github,
  MessageSquare,
  Slack,
  SquareKanban,
  Triangle,
} from "lucide-react";

const INTEGRATIONS = [
  {
    icon: Slack,
    name: "Slack",
    description: "Route alerts and approvals into any channel.",
    connected: true,
  },
  {
    icon: Github,
    name: "GitHub",
    description: "Sync issues, PRs, and deploy statuses.",
    connected: true,
  },
  {
    icon: Figma,
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
