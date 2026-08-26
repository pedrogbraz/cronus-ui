"use client";

import { Avatar, AvatarFallback, Badge, Button, Input, Label } from "@kronus-ui/ui";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Waitlist hero — early-access capture with a joined state
 * ────────────────────────────────────────────────────────────────────────── */

const waitlistFounders = ["NK", "SF", "JT", "PB"];

/**
 * A centered waitlist hero: an early-access announcement pill, a display
 * headline with one gradient word, and an inline email capture that swaps to
 * a "joined" confirmation on submit.
 *
 * The swap area is a persistent `aria-live="polite"` region, so replacing the
 * form with the confirmation is announced to screen readers; the form itself
 * relies on native `type="email" required` validation, keeping the fake
 * submit keyboard-complete (Enter or click). The confirmation entrance
 * animates only under `motion-safe:`, and the aurora backdrop is a static
 * blurred gradient — no per-frame work anywhere.
 */
export function WaitlistHeroBlock() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section
      aria-labelledby="waitlist-heading"
      className="relative w-full overflow-hidden px-6 py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-80 transform-gpu bg-gradient-aurora opacity-20 blur-3xl"
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised py-1 pr-3 pl-1 shadow-xs">
          <Badge variant="primary" className="gap-1 rounded-full">
            <Sparkles aria-hidden="true" className="size-3" />
            Early access
          </Badge>
          <span className="font-medium text-fg-secondary text-xs">Invites roll out weekly</span>
        </span>

        <h1
          id="waitlist-heading"
          className="mt-6 text-balance font-display font-semibold text-5xl text-fg leading-[1.05] tracking-tight sm:text-6xl"
        >
          Be first in line for a{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">faster</span> way to
          ship
        </h1>

        <p className="mt-6 max-w-xl text-balance text-fg-secondary text-lg">
          Join the waitlist and we&apos;ll email your invite the moment a spot opens. No spam, and
          you can leave the list any time.
        </p>

        <div aria-live="polite" className="mt-9 w-full max-w-md">
          {joined ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 text-left shadow-sm motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:animate-in motion-safe:duration-300"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Check aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-fg text-sm">You&apos;re on the list</p>
                <p className="truncate text-fg-tertiary text-sm">
                  We&apos;ll email {email} when your invite is ready.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEmail("");
                  setJoined(false);
                }}
              >
                Undo
              </Button>
            </div>
          ) : (
            <form
              aria-label="Join the waitlist"
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                setJoined(true);
              }}
            >
              <Label htmlFor="waitlist-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 flex-1"
              />
              <Button type="submit" variant="primary" size="lg" className="shrink-0">
                Join the waitlist
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex -space-x-2">
            {waitlistFounders.map((initials) => (
              <Avatar key={initials} className="size-9 border-2 border-surface-base shadow-xs">
                <AvatarFallback className="bg-surface-overlay text-fg-secondary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-fg-tertiary text-sm">
            <span className="font-medium text-fg tabular-nums">+2,400</span> waiting for access
          </p>
        </div>
      </div>
    </section>
  );
}

const waitlistCode = `"use client";

import { Avatar, AvatarFallback, Badge, Button, Input, Label } from "@kronus-ui/ui";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";

const waitlistFounders = ["NK", "SF", "JT", "PB"];

export function WaitlistHeroBlock() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section
      aria-labelledby="waitlist-heading"
      className="relative w-full overflow-hidden px-6 py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-80 transform-gpu bg-gradient-aurora opacity-20 blur-3xl"
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised py-1 pr-3 pl-1 shadow-xs">
          <Badge variant="primary" className="gap-1 rounded-full">
            <Sparkles aria-hidden="true" className="size-3" />
            Early access
          </Badge>
          <span className="font-medium text-fg-secondary text-xs">Invites roll out weekly</span>
        </span>

        <h1
          id="waitlist-heading"
          className="mt-6 text-balance font-display font-semibold text-5xl text-fg leading-[1.05] tracking-tight sm:text-6xl"
        >
          Be first in line for a{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">faster</span> way to
          ship
        </h1>

        <p className="mt-6 max-w-xl text-balance text-fg-secondary text-lg">
          Join the waitlist and we&apos;ll email your invite the moment a spot opens. No spam, and
          you can leave the list any time.
        </p>

        <div aria-live="polite" className="mt-9 w-full max-w-md">
          {joined ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 text-left shadow-sm motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:animate-in motion-safe:duration-300"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Check aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-fg text-sm">You&apos;re on the list</p>
                <p className="truncate text-fg-tertiary text-sm">
                  We&apos;ll email {email} when your invite is ready.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEmail("");
                  setJoined(false);
                }}
              >
                Undo
              </Button>
            </div>
          ) : (
            <form
              aria-label="Join the waitlist"
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                setJoined(true);
              }}
            >
              <Label htmlFor="waitlist-email" className="sr-only">
                Email address
              </Label>
              <Input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 flex-1"
              />
              <Button type="submit" variant="primary" size="lg" className="shrink-0">
                Join the waitlist
                <ArrowRight aria-hidden="true" />
              </Button>
            </form>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <div className="flex -space-x-2">
            {waitlistFounders.map((initials) => (
              <Avatar key={initials} className="size-9 border-2 border-surface-base shadow-xs">
                <AvatarFallback className="bg-surface-overlay text-fg-secondary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-fg-tertiary text-sm">
            <span className="font-medium text-fg tabular-nums">+2,400</span> waiting for access
          </p>
        </div>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const waitlistBlocks: BlockContentMap = {
  waitlist: { preview: <WaitlistHeroBlock />, code: waitlistCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function WaitlistGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(waitlistBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function WaitlistView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(waitlistBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
