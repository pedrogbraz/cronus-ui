"use client";

import { Button, Card, Separator } from "@cronus-ui/ui";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Welcome email
 * ────────────────────────────────────────────────────────────────────────── */

export function EmailWelcomeBlock() {
  return (
    <div className="flex justify-center bg-surface-inset/40 p-6">
      <Card className="w-full max-w-xl gap-0 overflow-hidden p-0 shadow-lg">
        <div className="flex justify-center border-b border-border/60 px-8 py-6">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="size-3 rounded-sm bg-primary-foreground/90" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cronus</span>
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 py-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Welcome to Cronus 🎉
          </h1>
          <p className="text-sm leading-relaxed text-fg-secondary">
            Hi Mara, we&apos;re thrilled to have you on board. Your workspace is ready and
            there&apos;s nothing left to install — everything runs in the browser.
          </p>
          <p className="text-sm leading-relaxed text-fg-secondary">
            Jump in below to create your first project, invite teammates, and explore the building
            blocks that make shipping fast.
          </p>

          <div>
            <Button variant="primary" size="lg">
              Get started
            </Button>
          </div>

          <ul className="flex flex-col gap-2 text-sm text-fg-secondary">
            <li>
              <a
                href="#docs"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Read the quickstart guide
              </a>
            </li>
            <li>
              <a
                href="#invite"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Invite your team
              </a>
            </li>
            <li>
              <a
                href="#templates"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Browse starter templates
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/60 px-8 py-6 text-xs text-fg-tertiary">
          <p>
            You&apos;re receiving this because you signed up for Cronus.{" "}
            <a href="#unsubscribe" className="underline underline-offset-4 hover:text-fg-secondary">
              Unsubscribe
            </a>
          </p>
          <p>Cronus, Inc. · 2261 Market St, San Francisco</p>
        </div>
      </Card>
    </div>
  );
}

const emailWelcomeCode = `import { Button, Card } from "@cronus-ui/ui";

export function EmailWelcomeBlock() {
  return (
    <div className="flex justify-center bg-surface-inset/40 p-6">
      <Card className="w-full max-w-xl gap-0 overflow-hidden p-0 shadow-lg">
        <div className="flex justify-center border-b border-border/60 px-8 py-6">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="size-3 rounded-sm bg-primary-foreground/90" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cronus</span>
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 py-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Welcome to Cronus 🎉
          </h1>
          <p className="text-sm leading-relaxed text-fg-secondary">
            Hi Mara, we&apos;re thrilled to have you on board. Your workspace is ready and there&apos;s
            nothing left to install — everything runs in the browser.
          </p>
          <p className="text-sm leading-relaxed text-fg-secondary">
            Jump in below to create your first project, invite teammates, and explore the building
            blocks that make shipping fast.
          </p>

          <div>
            <Button variant="primary" size="lg">
              Get started
            </Button>
          </div>

          <ul className="flex flex-col gap-2 text-sm text-fg-secondary">
            <li>
              <a href="#docs" className="font-medium text-primary underline-offset-4 hover:underline">
                Read the quickstart guide
              </a>
            </li>
            <li>
              <a href="#invite" className="font-medium text-primary underline-offset-4 hover:underline">
                Invite your team
              </a>
            </li>
            <li>
              <a href="#templates" className="font-medium text-primary underline-offset-4 hover:underline">
                Browse starter templates
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/60 px-8 py-6 text-xs text-fg-tertiary">
          <p>
            You&apos;re receiving this because you signed up for Cronus.{" "}
            <a href="#unsubscribe" className="underline underline-offset-4 hover:text-fg-secondary">
              Unsubscribe
            </a>
          </p>
          <p>Cronus, Inc. · 2261 Market St, San Francisco</p>
        </div>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Receipt email
 * ────────────────────────────────────────────────────────────────────────── */

export function EmailReceiptBlock() {
  return (
    <div className="flex justify-center bg-surface-inset/40 p-6">
      <Card className="w-full max-w-xl gap-0 overflow-hidden p-0 shadow-lg">
        <div className="flex justify-center border-b border-border/60 px-8 py-6">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="size-3 rounded-sm bg-primary-foreground/90" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cronus</span>
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 py-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Receipt from Cronus
            </h1>
            <p className="text-sm text-fg-secondary">Order #CO-10482 · April 18, 2026</p>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-fg-tertiary">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 text-center font-medium">Qty</th>
                <th className="pb-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="text-fg-secondary">
              <tr className="border-t border-border/60">
                <td className="py-3">Pro plan — monthly</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">$24.00</td>
              </tr>
              <tr className="border-t border-border/60">
                <td className="py-3">Additional seats</td>
                <td className="py-3 text-center">3</td>
                <td className="py-3 text-right">$36.00</td>
              </tr>
              <tr className="border-t border-border/60">
                <td className="py-3">Priority support</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">$12.00</td>
              </tr>
            </tbody>
          </table>

          <Separator />

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between text-fg-secondary">
              <span>Subtotal</span>
              <span>$72.00</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-fg">
              <span>Total</span>
              <span>$72.00</span>
            </div>
          </div>

          <div>
            <Button variant="primary" size="lg">
              View invoice
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/60 px-8 py-6 text-xs text-fg-tertiary">
          <p>
            Questions about this charge? Contact{" "}
            <a href="#support" className="underline underline-offset-4 hover:text-fg-secondary">
              support@cronus.com
            </a>
          </p>
          <p>Cronus, Inc. · 2261 Market St, San Francisco</p>
        </div>
      </Card>
    </div>
  );
}

const emailReceiptCode = `import { Button, Card, Separator } from "@cronus-ui/ui";

export function EmailReceiptBlock() {
  return (
    <div className="flex justify-center bg-surface-inset/40 p-6">
      <Card className="w-full max-w-xl gap-0 overflow-hidden p-0 shadow-lg">
        <div className="flex justify-center border-b border-border/60 px-8 py-6">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="size-3 rounded-sm bg-primary-foreground/90" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cronus</span>
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 py-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight">Receipt from Cronus</h1>
            <p className="text-sm text-fg-secondary">
              Order #CO-10482 · April 18, 2026
            </p>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-fg-tertiary">
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 text-center font-medium">Qty</th>
                <th className="pb-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="text-fg-secondary">
              <tr className="border-t border-border/60">
                <td className="py-3">Pro plan — monthly</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">$24.00</td>
              </tr>
              <tr className="border-t border-border/60">
                <td className="py-3">Additional seats</td>
                <td className="py-3 text-center">3</td>
                <td className="py-3 text-right">$36.00</td>
              </tr>
              <tr className="border-t border-border/60">
                <td className="py-3">Priority support</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right">$12.00</td>
              </tr>
            </tbody>
          </table>

          <Separator />

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between text-fg-secondary">
              <span>Subtotal</span>
              <span>$72.00</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-fg">
              <span>Total</span>
              <span>$72.00</span>
            </div>
          </div>

          <div>
            <Button variant="primary" size="lg">
              View invoice
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/60 px-8 py-6 text-xs text-fg-tertiary">
          <p>
            Questions about this charge? Contact{" "}
            <a href="#support" className="underline underline-offset-4 hover:text-fg-secondary">
              support@cronus.com
            </a>
          </p>
          <p>Cronus, Inc. · 2261 Market St, San Francisco</p>
        </div>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Verify email
 * ────────────────────────────────────────────────────────────────────────── */

export function EmailVerifyBlock() {
  return (
    <div className="flex justify-center bg-surface-inset/40 p-6">
      <Card className="w-full max-w-xl gap-0 overflow-hidden p-0 shadow-lg">
        <div className="flex justify-center border-b border-border/60 px-8 py-6">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="size-3 rounded-sm bg-primary-foreground/90" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cronus</span>
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 py-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Confirm your email address
          </h1>
          <p className="text-sm leading-relaxed text-fg-secondary">
            Tap the button below to verify your email and activate your Cronus account.
          </p>

          <div>
            <Button variant="primary" size="lg">
              Verify email
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-fg-secondary">Or paste this code:</p>
            <span className="inline-flex w-fit items-center rounded-lg border border-border bg-surface-inset/60 px-5 py-3 font-mono text-2xl font-semibold tracking-[0.4em] text-fg">
              382 914
            </span>
          </div>

          <p className="text-xs text-fg-tertiary">This code expires in 30 minutes.</p>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/60 px-8 py-6 text-xs text-fg-tertiary">
          <p>If you didn&apos;t create an account you can ignore this email.</p>
          <p>Cronus, Inc. · 2261 Market St, San Francisco</p>
        </div>
      </Card>
    </div>
  );
}

const emailVerifyCode = `import { Button, Card } from "@cronus-ui/ui";

export function EmailVerifyBlock() {
  return (
    <div className="flex justify-center bg-surface-inset/40 p-6">
      <Card className="w-full max-w-xl gap-0 overflow-hidden p-0 shadow-lg">
        <div className="flex justify-center border-b border-border/60 px-8 py-6">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <span className="size-3 rounded-sm bg-primary-foreground/90" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Cronus</span>
          </span>
        </div>

        <div className="flex flex-col gap-5 px-8 py-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Confirm your email address
          </h1>
          <p className="text-sm leading-relaxed text-fg-secondary">
            Tap the button below to verify your email and activate your Cronus account.
          </p>

          <div>
            <Button variant="primary" size="lg">
              Verify email
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-fg-secondary">Or paste this code:</p>
            <span className="inline-flex w-fit items-center rounded-lg border border-border bg-surface-inset/60 px-5 py-3 font-mono text-2xl font-semibold tracking-[0.4em] text-fg">
              382 914
            </span>
          </div>

          <p className="text-xs text-fg-tertiary">This code expires in 30 minutes.</p>
        </div>

        <div className="flex flex-col gap-1 border-t border-border/60 px-8 py-6 text-xs text-fg-tertiary">
          <p>If you didn&apos;t create an account you can ignore this email.</p>
          <p>Cronus, Inc. · 2261 Market St, San Francisco</p>
        </div>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const emailBlocks: BlockContentMap = {
  "email-welcome": { preview: <EmailWelcomeBlock />, code: emailWelcomeCode },
  "email-receipt": { preview: <EmailReceiptBlock />, code: emailReceiptCode },
  "email-verify": { preview: <EmailVerifyBlock />, code: emailVerifyCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function EmailGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(emailBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function EmailView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(emailBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
