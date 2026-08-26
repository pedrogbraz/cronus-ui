import { cva, type VariantProps } from "class-variance-authority";
import { Check, X } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useId,
} from "react";
import { cn } from "../lib/cn.js";

const chipVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full border font-medium transition-[background,border-color,box-shadow,transform,opacity] duration-150 ease-[var(--ease-out-quart)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none [&_svg]:shrink-0 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        solid: "border-transparent shadow-xs",
        soft: "border-transparent",
        outline: "bg-transparent",
      },
      // Colour recipes depend on the variant, so they live in compoundVariants.
      color: {
        neutral: "",
        primary: "",
        success: "",
        warning: "",
        error: "",
        info: "",
      },
      size: {
        sm: "h-6 gap-1 px-2 text-xs [&_svg]:size-3 [&_[data-slot=chip-avatar]]:size-4",
        md: "h-7 gap-1.5 px-2.5 text-sm [&_svg]:size-3.5 [&_[data-slot=chip-avatar]]:size-5",
        lg: "h-8 gap-2 px-3 text-sm [&_svg]:size-4 [&_[data-slot=chip-avatar]]:size-6",
      },
      // Derived from `onClick`/`selected` inside the component — not public props.
      interactive: {
        true: "cursor-pointer select-none active:scale-[0.97]",
        false: "",
      },
      selected: {
        true: "font-semibold",
        false: "",
      },
    },
    compoundVariants: [
      // ── solid ── filled pills. `neutral` is the inverse fill (`fg-inverse`
      // is the AA-paired text token for an `fg` surface) and `primary` rides
      // its paired foreground token. The semantic hues have no paired
      // foreground, so they reuse the Button technique: darken the fill 30%
      // toward black in OKLCH so white text clears >=4.5:1 on every theme/mode
      // (see button.tsx `destructive` — the raw fills are too light for white).
      { variant: "solid", color: "neutral", class: "bg-fg text-fg-inverse" },
      { variant: "solid", color: "primary", class: "bg-primary text-primary-foreground" },
      {
        variant: "solid",
        color: "success",
        class: "bg-[color-mix(in_oklch,var(--kronus-success),black_30%)] text-white",
      },
      {
        variant: "solid",
        color: "warning",
        class: "bg-[color-mix(in_oklch,var(--kronus-warning),black_30%)] text-white",
      },
      {
        variant: "solid",
        color: "error",
        class: "bg-[color-mix(in_oklch,var(--kronus-error),black_30%)] text-white",
      },
      {
        variant: "solid",
        color: "info",
        class: "bg-[color-mix(in_oklch,var(--kronus-info),black_30%)] text-white",
      },
      // ── soft ── 15% tints. Same-hue text on a tint can read <4.5:1, so the
      // label uses the AA-tuned `*-strong` text variants (tokens contract).
      { variant: "soft", color: "neutral", class: "bg-surface-overlay text-fg" },
      { variant: "soft", color: "primary", class: "bg-primary/15 text-primary-strong" },
      { variant: "soft", color: "success", class: "bg-success/15 text-success-strong" },
      { variant: "soft", color: "warning", class: "bg-warning/15 text-warning-strong" },
      { variant: "soft", color: "error", class: "bg-error/15 text-error-strong" },
      { variant: "soft", color: "info", class: "bg-info/15 text-info-strong" },
      // ── outline ── bordered, transparent fill; text again on `*-strong`.
      { variant: "outline", color: "neutral", class: "border-border text-fg" },
      { variant: "outline", color: "primary", class: "border-primary/50 text-primary-strong" },
      { variant: "outline", color: "success", class: "border-success/50 text-success-strong" },
      { variant: "outline", color: "warning", class: "border-warning/50 text-warning-strong" },
      { variant: "outline", color: "error", class: "border-error/50 text-error-strong" },
      { variant: "outline", color: "info", class: "border-info/50 text-info-strong" },
      // Hover affordances only when the chip is a real control. `currentColor`
      // keeps them hue-correct for every color without another 18 entries.
      { interactive: true, variant: "solid", class: "hover:opacity-90" },
      { interactive: true, variant: "soft", class: "hover:border-current/40" },
      { interactive: true, variant: "outline", class: "hover:bg-current/10" },
      // Selection emphasis (the leading check mark is rendered by the
      // component). Listed last so tailwind-merge resolves border/background
      // conflicts in its favor.
      {
        selected: true,
        variant: "soft",
        class: "border-current/50 hover:border-current/50",
      },
      {
        selected: true,
        variant: "outline",
        class: "border-current bg-current/10 hover:border-current",
      },
    ],
    defaultVariants: {
      variant: "soft",
      color: "neutral",
      size: "md",
      interactive: false,
      selected: false,
    },
  },
);

/** Localizable strings rendered by {@link Chip}. Defaults are English. */
export interface ChipLabels {
  /**
   * Screen-reader string for the remove affordance: the accessible name of the
   * remove button on a non-interactive chip, and the Delete/Backspace removal
   * hint (exposed as the chip's accessible description) on an interactive one.
   * @default "Remove"
   */
  remove: string;
}

const DEFAULT_LABELS: ChipLabels = { remove: "Remove" };

const REMOVE_AFFORDANCE_CLASSES =
  "ms-0.5 -me-1 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 opacity-70 transition-opacity duration-150 hover:opacity-100";

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    Omit<VariantProps<typeof chipVariants>, "interactive" | "selected"> {
  /**
   * Visual treatment: `solid` fill, `soft` 15% tint, or `outline`.
   * @default "soft"
   */
  variant?: "solid" | "soft" | "outline";
  /**
   * Semantic hue applied by the variant recipe.
   * @default "neutral"
   */
  color?: "neutral" | "primary" | "success" | "warning" | "error" | "info";
  /**
   * Pill height / typography preset.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Toggle state for filter-style chips. Any non-`undefined` value renders the
   * chip as a `<button>` with `aria-pressed`; while `true` it also gains a
   * leading check mark and emphasized styling.
   * @default undefined
   */
  selected?: boolean;
  /** Leading icon slot rendered before the label (e.g. a lucide icon). */
  icon?: ReactNode;
  /** Leading avatar slot (an `img`, `Avatar`, …) clipped to a circle and sized by `size`. */
  avatar?: ReactNode;
  /**
   * Makes the chip dismissible. On a static chip this renders a real,
   * focusable remove button (Enter/Space activate it); on an interactive chip
   * the affordance is decorative and Delete or Backspace on the focused chip
   * removes it instead. Removal never triggers `onClick`, and removal clicks
   * never propagate to ancestor click handlers.
   */
  onRemove?: () => void;
  /**
   * Disables the chip and its remove affordance.
   * @default false
   */
  disabled?: boolean;
  /** Override any subset of the built-in screen-reader strings. See {@link ChipLabels}. */
  labels?: Partial<ChipLabels>;
}

/**
 * Interactive filter / selection chip. Where {@link Badge} is a static status
 * label, Chip is a control: give it `onClick` and/or `selected` and it renders
 * as a real `<button>` (Enter/Space activate natively, `aria-pressed` carries
 * the toggle state); leave both off and it stays a server-safe `<span>`. A
 * `selected`-only chip attaches no event handlers, so it can also render from
 * a Server Component as a display-only pressed button.
 * `onRemove` adds a dismiss affordance plus Delete/Backspace removal.
 */
export const Chip = forwardRef<HTMLElement, ChipProps>(
  (
    {
      className,
      variant,
      color,
      size,
      selected,
      icon,
      avatar,
      onRemove,
      labels,
      disabled = false,
      onClick,
      onKeyDown,
      children,
      ...props
    },
    ref,
  ) => {
    const isInteractive = onClick !== undefined || selected !== undefined;
    const dismissible = onRemove !== undefined;
    const removeLabel = labels?.remove ?? DEFAULT_LABELS.remove;
    // `selected` is a serializable boolean, so a display-only selected chip is
    // legitimately reachable from a Server Component — where function props on
    // host elements throw. Handlers are therefore only attached when they can
    // do something (`onClick` routing or removal); a selected-only chip renders
    // a handler-free `<button aria-pressed>`.
    const attachesClickHandler = isInteractive && (onClick !== undefined || dismissible);
    const describesRemoval = isInteractive && dismissible;
    const removeHintId = useId();

    // Delete/Backspace removes the focused chip (interactive chips only — the
    // static variant exposes a real, focusable remove button instead).
    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        onRemove?.();
      }
    };

    // A real <button> may not nest inside the chip button (invalid HTML + axe
    // `nested-interactive`), so the interactive chip renders its remove
    // affordance as a decorative span and routes clicks on it here — removal
    // must never activate the chip's own onClick.
    const handleInteractiveClick = (event: MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (dismissible && target.closest("[data-slot=chip-remove]") !== null) {
        // Same contract as the static path's remove button: removal clicks
        // stay inside the chip and never reach ancestor click handlers.
        event.stopPropagation();
        onRemove?.();
        return;
      }
      onClick?.(event);
    };

    const handleRemoveClick = (event: MouseEvent<HTMLElement>) => {
      // Keep the removal click from reaching any ancestor click handlers.
      event.stopPropagation();
      onRemove?.();
    };

    // Single render path for both elements; the cast is safe because every
    // button-only attribute below is gated on `isInteractive`.
    const Comp = (isInteractive ? "button" : "span") as "button";

    return (
      <Comp
        // The root is a <button> or a <span>; the forwarded ref is typed as
        // their shared supertype and narrowed here.
        ref={ref as Ref<HTMLButtonElement>}
        data-slot="chip"
        type={isInteractive ? "button" : undefined}
        disabled={isInteractive ? disabled : undefined}
        data-disabled={disabled ? "" : undefined}
        data-selected={selected ? "" : undefined}
        aria-pressed={selected === undefined ? undefined : selected}
        aria-keyshortcuts={describesRemoval ? "Delete Backspace" : undefined}
        aria-describedby={describesRemoval ? removeHintId : undefined}
        className={cn(
          chipVariants({
            variant,
            color,
            size,
            interactive: isInteractive,
            selected: selected === true,
          }),
          className,
        )}
        onClick={attachesClickHandler ? handleInteractiveClick : onClick}
        onKeyDown={isInteractive && dismissible ? handleKeyDown : onKeyDown}
        {...props}
      >
        {selected ? <Check aria-hidden="true" data-slot="chip-check" /> : null}
        {avatar ? (
          <span
            data-slot="chip-avatar"
            aria-hidden="true"
            className="-ms-1 inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full [&>img]:size-full [&>img]:object-cover"
          >
            {avatar}
          </span>
        ) : null}
        {icon ? (
          <span
            data-slot="chip-icon"
            aria-hidden="true"
            className="inline-flex shrink-0 items-center justify-center"
          >
            {icon}
          </span>
        ) : null}
        {children}
        {dismissible ? (
          isInteractive ? (
            // Decorative pointer target only (no handler of its own — the chip
            // button routes clicks). Keyboard/AT removal is Delete/Backspace,
            // surfaced to AT through aria-keyshortcuts plus the hidden
            // description below (hidden nodes referenced by aria-describedby
            // still contribute to the accessible description).
            <>
              <span
                data-slot="chip-remove"
                aria-hidden="true"
                className={REMOVE_AFFORDANCE_CLASSES}
              >
                <X />
              </span>
              <span id={removeHintId} hidden>
                {removeLabel}: Delete
              </span>
            </>
          ) : (
            <button
              type="button"
              data-slot="chip-remove"
              disabled={disabled}
              className={cn(
                REMOVE_AFFORDANCE_CLASSES,
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              )}
              onClick={handleRemoveClick}
            >
              <X aria-hidden="true" />
              <span className="sr-only">{removeLabel}</span>
            </button>
          )
        ) : null}
      </Comp>
    );
  },
);
Chip.displayName = "Chip";

export interface ChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name announcing what the chip collection represents. */
  "aria-label"?: string;
}

/** Flex-wrap layout for a set of related chips, exposed as a labelled `role="group"`. */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a chip group bundles related chips, not form controls — <fieldset> would be semantically wrong; role="group" is the correct generic grouping.
      <div
        ref={ref}
        data-slot="chip-group"
        role="group"
        className={cn("flex flex-wrap items-center gap-2", className)}
        {...props}
      />
    );
  },
);
ChipGroup.displayName = "ChipGroup";

export { chipVariants };
