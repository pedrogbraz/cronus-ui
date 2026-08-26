"use client";

import { Button, Input, Reveal } from "@kronus-ui/ui";
import { AlertTriangle, Check, Clock, RotateCw, Search, Wrench } from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Not found — 404 page
 * ────────────────────────────────────────────────────────────────────────── */

export function NotFoundBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="bg-gradient-primary bg-clip-text font-display text-7xl font-bold text-transparent">
          404
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">Page not found</h1>
          <p className="text-sm text-fg-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary" />
          <Input className="pl-9" placeholder="Search the docs…" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Back to home</Button>
          <Button variant="ghost">Contact support</Button>
        </div>
      </Reveal>
    </div>
  );
}

const notFoundCode = `import { Button, Input, Reveal } from "@kronus-ui/ui";
import { Search } from "lucide-react";

export function NotFoundBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="bg-gradient-primary bg-clip-text font-display text-7xl font-bold text-transparent">
          404
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">Page not found</h1>
          <p className="text-sm text-fg-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary" />
          <Input className="pl-9" placeholder="Search the docs…" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Back to home</Button>
          <Button variant="ghost">Contact support</Button>
        </div>
      </Reveal>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Error state — something went wrong
 * ────────────────────────────────────────────────────────────────────────── */

export function ErrorStateBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">Something went wrong</h1>
          <p className="text-sm text-fg-secondary">
            An unexpected error occurred while processing your request. Please try again.
          </p>
        </div>
        <span className="rounded bg-surface-inset px-2 py-1 font-mono text-xs text-fg-tertiary">
          ERR_500 · request 8f2c
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">
            <RotateCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button variant="outline">Contact support</Button>
        </div>
      </Reveal>
    </div>
  );
}

const errorStateCode = `import { Button, Reveal } from "@kronus-ui/ui";
import { AlertTriangle, RotateCw } from "lucide-react";

export function ErrorStateBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="size-7" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">Something went wrong</h1>
          <p className="text-sm text-fg-secondary">
            An unexpected error occurred while processing your request. Please try again.
          </p>
        </div>
        <span className="rounded bg-surface-inset px-2 py-1 font-mono text-xs text-fg-tertiary">
          ERR_500 · request 8f2c
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">
            <RotateCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button variant="outline">Contact support</Button>
        </div>
      </Reveal>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Success state — confirmation
 * ────────────────────────────────────────────────────────────────────────── */

export function SuccessStateBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">You&apos;re all set!</h1>
          <p className="text-sm text-fg-secondary">
            Your account is ready. Everything has been configured and is good to go.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Go to dashboard</Button>
          <Button variant="ghost">View details</Button>
        </div>
      </Reveal>
    </div>
  );
}

const successStateCode = `import { Button, Reveal } from "@kronus-ui/ui";
import { Check } from "lucide-react";

export function SuccessStateBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="size-8" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">You&apos;re all set!</h1>
          <p className="text-sm text-fg-secondary">
            Your account is ready. Everything has been configured and is good to go.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Go to dashboard</Button>
          <Button variant="ghost">View details</Button>
        </div>
      </Reveal>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Maintenance — be right back
 * ────────────────────────────────────────────────────────────────────────── */

export function MaintenanceBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-surface-overlay text-fg-secondary">
          <Wrench className="size-7" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">We&apos;ll be right back</h1>
          <p className="text-sm text-fg-secondary">
            We&apos;re performing scheduled maintenance to improve your experience.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-fg-tertiary">
          <Clock className="size-4" aria-hidden="true" />
          Estimated downtime: ~30 minutes
        </span>
        <div className="flex w-full max-w-sm flex-wrap items-center justify-center gap-3">
          <Input
            className="min-w-0 flex-1"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
          />
          <Button variant="primary">Notify me</Button>
        </div>
      </Reveal>
    </div>
  );
}

const maintenanceCode = `import { Button, Input, Reveal } from "@kronus-ui/ui";
import { Clock, Wrench } from "lucide-react";

export function MaintenanceBlock() {
  return (
    <div className="flex min-h-[28rem] flex-col items-center justify-center px-6 py-16 text-center">
      <Reveal className="flex w-full max-w-md flex-col items-center gap-5">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-surface-overlay text-fg-secondary">
          <Wrench className="size-7" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold text-fg">We&apos;ll be right back</h1>
          <p className="text-sm text-fg-secondary">
            We&apos;re performing scheduled maintenance to improve your experience.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm text-fg-tertiary">
          <Clock className="size-4" aria-hidden="true" />
          Estimated downtime: ~30 minutes
        </span>
        <div className="flex w-full max-w-sm flex-wrap items-center justify-center gap-3">
          <Input
            className="min-w-0 flex-1"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
          />
          <Button variant="primary">Notify me</Button>
        </div>
      </Reveal>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const statesBlocks: BlockContentMap = {
  "not-found": { preview: <NotFoundBlock />, code: notFoundCode },
  "error-state": { preview: <ErrorStateBlock />, code: errorStateCode },
  "success-state": { preview: <SuccessStateBlock />, code: successStateCode },
  maintenance: { preview: <MaintenanceBlock />, code: maintenanceCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function StatesGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(statesBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function StatesView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(statesBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
