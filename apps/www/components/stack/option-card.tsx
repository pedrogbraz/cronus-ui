"use client";

import { Badge, cn, Tooltip, TooltipContent, TooltipTrigger } from "@cooud-ui/ui";
import { Check } from "lucide-react";
import { type KeyboardEvent, useId } from "react";
import type { Badge as BadgeKind, ResolvedOption } from "@/lib/stack/types";
import { OptionIcon } from "./option-icon";

/** Map a catalog {@link BadgeKind} to a Cooud UI Badge variant + label. */
const BADGE_META: Record<BadgeKind, { label: string; variant: "warning" | "info" | "primary" }> = {
  beta: { label: "Beta", variant: "warning" },
  new: { label: "New", variant: "info" },
  experimental: { label: "Experimental", variant: "warning" },
  gated: { label: "Gated", variant: "primary" },
};

export interface OptionCardProps {
  /** The resolved option (definition + availability + selected state). */
  resolved: ResolvedOption;
  /** How the owning category is selected — drives ARIA role + semantics. */
  kind: "single" | "multi";
  /** Roving-tabindex value supplied by the parent group (single only). */
  tabIndex?: number;
  /** Select / toggle this option. Never called when the option is unavailable. */
  onSelect: () => void;
  /** Arrow-key handler for roving focus inside a radiogroup (single only). */
  onKeyNav?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

/**
 * A single selectable stack option, rendered as a button.
 *
 * Semantics by category kind:
 *  - `single` → `role="radio"` with `aria-checked` (the parent is a radiogroup
 *    that owns roving focus via `tabIndex` + `onKeyNav`).
 *  - `multi`  → a toggle button with `aria-pressed` (checkbox-style).
 *
 * When the option is unavailable it is rendered `aria-disabled`, removed from the
 * tab order, visually dimmed (`cursor-not-allowed`, reduced opacity) and will NOT
 * fire `onSelect`. The human reason is surfaced both as a Tooltip AND wired to
 * the button via `aria-describedby` (so it reaches screen readers, not just
 * sighted hover users).
 */
export function OptionCard({ resolved, kind, tabIndex, onSelect, onKeyNav }: OptionCardProps) {
  const { option, available, selected, reason } = resolved;
  const disabled = !available;
  const reasonId = useId();
  const badge = option.badge ? BADGE_META[option.badge] : undefined;

  // Role + checked/pressed state are kind-dependent. Single options are radios
  // inside a radiogroup (aria-checked); multi options are pressable toggle
  // buttons (aria-pressed). Built as a spread so the pairing of role + state is
  // statically coherent.
  const roleProps =
    kind === "single"
      ? ({ role: "radio", "aria-checked": selected } as const)
      : ({ "aria-pressed": selected } as const);

  const card = (
    <button
      type="button"
      data-slot="option-card"
      {...roleProps}
      aria-disabled={disabled || undefined}
      aria-describedby={disabled ? reasonId : undefined}
      // Disabled cards leave the tab order entirely; single uses roving tabindex.
      tabIndex={disabled ? -1 : kind === "single" ? tabIndex : 0}
      onClick={() => {
        if (!disabled) onSelect();
      }}
      onKeyDown={(event) => {
        if (disabled) return;
        // Space/Enter activate (native for buttons, but radios need the explicit
        // Space handler). Arrow keys move roving focus in single groups.
        if (kind === "single" && (event.key === " " || event.key === "Enter")) {
          event.preventDefault();
          onSelect();
        }
        onKeyNav?.(event);
      }}
      className={cn(
        // A calm, flat card: a crisp 1px border on a raised surface — no lift, no
        // colored glow, no ring. State reads through the border and a quiet
        // surface shift only; the restraint is the point. Transitions stay to
        // color so there is never a layout shift inside the grid.
        "group/option relative flex h-full w-full flex-col items-start gap-2.5 rounded-xl border bg-surface-raised p-3.5 text-left outline-none",
        "transition-[border-color,background-color] duration-150 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
        disabled
          ? // Dimmed so it recedes; the color transition keeps the availability
            // flip graceful rather than a hard flicker.
            "cursor-not-allowed border-border/60 opacity-45"
          : "cursor-pointer",
        // Hover firms the border and warms the surface a barely-there half step;
        // pressing deepens it toward the full selected surface, so the click
        // feels acknowledged before the border flips. Selected cards keep their
        // steady style — no hover restyle (it would downgrade the selected border).
        !disabled &&
          !selected &&
          "hover:border-border-strong hover:bg-surface-overlay/60 active:bg-surface-overlay",
        selected ? "border-border-strong bg-surface-overlay shadow-xs" : "border-border",
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <OptionIcon name={option.icon} selected={selected} />

        {badge ? (
          <Badge
            variant={badge.variant}
            className="px-1.5 py-0 text-[10px] font-medium uppercase tracking-wide leading-4"
          >
            {badge.label}
          </Badge>
        ) : null}
      </div>

      {/*
        The selected check: a bare checkmark pinned to the bottom-right corner so
        it never reserves layout space or collides with a top-right badge. It
        fades in with a soft settle from 75% scale (Tailwind v4's `scale-*` maps
        to the CSS `scale` property, hence `transition-[opacity,scale]`) — no
        filled pill, no overshoot — so selection reads calmly, in step with the
        border. `motion-reduce` keeps it an instant toggle.
      */}
      <span
        data-slot="option-card-check"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 bottom-3 text-fg",
          "transition-[opacity,scale] duration-200 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
          selected ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      >
        <Check className="size-4" strokeWidth={2.5} />
      </span>

      {/* Right padding clears the bottom-right corner check so text never runs under it. */}
      <span className="flex flex-col gap-0.5 pr-7">
        <span className="text-sm font-medium text-fg">{option.name}</span>
        <span
          className={cn(
            "text-xs leading-snug transition-colors duration-200 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
            "text-fg-secondary group-hover/option:text-fg",
          )}
        >
          {option.description}
        </span>
      </span>

      {/*
        Always rendered (sr-only when available) so `aria-describedby` always
        resolves and the reason is announced to assistive tech, not just shown
        on hover. When disabled it is also visible inline as a subtle hint.
      */}
      <span
        id={reasonId}
        data-slot="option-card-reason"
        className={cn(
          "mt-auto text-[11px] font-medium text-fg-tertiary",
          disabled ? "block pt-1" : "sr-only",
        )}
      >
        {disabled ? (reason ?? "Unavailable in this stack") : ""}
      </span>
    </button>
  );

  // Disabled options get a Tooltip explaining the reason on hover/focus. We keep
  // the trigger reachable for hover even though it is out of the tab order.
  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{card}</TooltipTrigger>
        <TooltipContent>{reason ?? "Unavailable in this stack"}</TooltipContent>
      </Tooltip>
    );
  }

  return card;
}
