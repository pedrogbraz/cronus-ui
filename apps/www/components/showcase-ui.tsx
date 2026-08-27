import { cn } from "@cronus-ui/ui";
import type { ReactNode } from "react";

/**
 * Shared showcase primitives for the Cronus UI component galleries.
 *
 * These mirror the heroui.com component-docs aesthetic: refined section
 * headers with an eyebrow line, generous vertical rhythm, and clean preview
 * frames with a faint dotted grid. The prop signatures are drop-in compatible
 * with the local `Section` / `Cluster` / `Subcard` helpers the galleries used
 * before, so swapping in the shared imports requires no usage changes.
 */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Short faded hairline between landing sections. The fade eats most of the
 * width so the rule reads as a tick, not a full-bleed bar.
 */
export function SectionGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 top-0 flex justify-center", className)}
    >
      <div className="h-px w-[min(12rem,32%)] bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

/** A small uppercase label preceded by a neutral dot. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-fg-tertiary",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-fg-tertiary" />
      {children}
    </span>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
}

/**
 * A generous documentation section: eyebrow + display title + optional lede,
 * then the children in a roomy area below. A hairline rule separates each
 * section for an airy, heroui-style rhythm.
 */
export function Section({ title, description, children, id }: SectionProps) {
  const resolvedId = id ?? slugify(title);

  return (
    <section
      id={resolvedId}
      aria-labelledby={`${resolvedId}-title`}
      className="scroll-mt-24 border-t border-border/60 py-12 sm:py-16"
    >
      <div className="flex flex-col gap-3">
        <Eyebrow>{title}</Eyebrow>
        <h3
          id={`${resolvedId}-title`}
          className="font-display text-2xl font-medium tracking-[-0.025em] text-fg sm:text-3xl"
        >
          {title}
        </h3>
        {description ? <p className="max-w-2xl text-fg-secondary">{description}</p> : null}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}

interface PreviewFrameProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

/**
 * The heroui-style preview container — a soft inset surface with a faint
 * dotted-grid backdrop and centered, wrapping children. An optional `label`
 * renders as a tiny chip in the top-left corner.
 */
export function PreviewFrame({ label, children, className }: PreviewFrameProps) {
  return (
    <div
      data-slot="preview-frame"
      data-force-motion
      className={cn(
        "relative flex min-h-[8rem] items-center justify-center gap-4 overflow-x-auto overflow-y-hidden rounded-2xl border border-border bg-surface-inset/50 p-8",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-0 bg-[radial-gradient(var(--cronus-border)_1px,transparent_1px)] opacity-50 [background-size:16px_16px]"
      />
      {label ? (
        <span className="absolute left-3 top-3 rounded-md bg-surface-raised/80 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-fg-tertiary backdrop-blur">
          {label}
        </span>
      ) : null}
      <div className="relative z-10 flex w-full min-w-0 flex-wrap items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
}

interface ClusterProps {
  label?: string;
  children: ReactNode;
}

/**
 * A labeled sub-group: a small label above a preview frame that wraps the
 * children. `label` stays optional so existing label-less usages still render.
 */
export function Cluster({ label, children }: ClusterProps) {
  return (
    <div className="flex flex-col gap-3">
      {label ? <span className="text-xs font-medium text-fg-tertiary">{label}</span> : null}
      <PreviewFrame>{children}</PreviewFrame>
    </div>
  );
}

interface SubcardProps {
  label: string;
  children: ReactNode;
}

/** A titled card with a header label and a roomy body. */
export function Subcard({ label, children }: SubcardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised p-5 shadow-xs">
      <span className="text-sm font-medium text-fg">{label}</span>
      <div className="mt-4">{children}</div>
    </div>
  );
}
