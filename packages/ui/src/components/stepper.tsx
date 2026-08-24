"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type OlHTMLAttributes,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/* ------------------------------------------------------------------ *
 * Context
 * ------------------------------------------------------------------ */

type StepperOrientation = "horizontal" | "vertical";

/**
 * Screen-reader-only step-state announcements. Pass any subset via the
 * `labels` prop on {@link Stepper} to localize; omitted keys keep their
 * English defaults.
 */
export interface StepperLabels {
  /** Announced after a completed step. */
  completed: string;
  /** Announced after the active step. */
  current: string;
  /** Announced after a step that has not started yet. */
  upcoming: string;
}

const DEFAULT_LABELS: StepperLabels = {
  completed: "completed",
  current: "current",
  upcoming: "not started",
};

interface StepperContextValue {
  /** Zero-based index of the active step. */
  value: number;
  /** Select a step (no-op when it already equals `value`). */
  setValue: (value: number) => void;
  /** Layout axis. */
  orientation: StepperOrientation;
  /** Resolved sr-only state labels (defaults merged with the `labels` prop). */
  labels: StepperLabels;
}

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepper(component: string): StepperContextValue {
  const context = useContext(StepperContext);
  if (context === null) {
    throw new Error(`<${component}> must be used within <Stepper>.`);
  }
  return context;
}

/* ------------------------------------------------------------------ *
 * Per-item context
 * ------------------------------------------------------------------ */

type StepState = "completed" | "active" | "upcoming";

interface StepperItemContextValue {
  /** This step's zero-based index. */
  step: number;
  /** Derived state relative to the stepper's active value. */
  state: StepState;
  /** Whether this step is non-interactive. */
  disabled: boolean;
}

const StepperItemContext = createContext<StepperItemContextValue | null>(null);

function useStepperItem(component: string): StepperItemContextValue {
  const context = useContext(StepperItemContext);
  if (context === null) {
    throw new Error(`<${component}> must be used within <StepperItem>.`);
  }
  return context;
}

/* ------------------------------------------------------------------ *
 * Stepper (root)
 * ------------------------------------------------------------------ */

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled active step index. When provided the stepper is fully controlled. */
  value?: number;
  /** Initial active step index for the uncontrolled case. Defaults to `0`. */
  defaultValue?: number;
  /** Called whenever a step should become active (controlled or not). */
  onValueChange?: (value: number) => void;
  /** Layout axis. Defaults to `"horizontal"`. */
  orientation?: StepperOrientation;
  /** Localize the sr-only step-state announcements. See {@link StepperLabels}. */
  labels?: Partial<StepperLabels>;
}

/**
 * Root of a multi-step / wizard progress indicator. Owns the active step index
 * (controlled via `value` + `onValueChange`, or uncontrolled via `defaultValue`)
 * and broadcasts the orientation through context. Renders nothing itself beyond
 * a layout wrapper — compose {@link StepperItem}s (and an inner ordered list)
 * inside it. SSR-safe: state is derived synchronously with no effects.
 */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      value: valueProp,
      defaultValue = 0,
      onValueChange,
      orientation = "horizontal",
      labels,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Uncontrolled state lives here; a provided `value` makes it controlled.
    // Plain useState (no effects) keeps the first paint correct on both the
    // server and the client.
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : uncontrolledValue;

    const setValue = useCallback(
      (next: number) => {
        if (next === value) {
          return;
        }
        if (!isControlled) {
          setUncontrolledValue(next);
        }
        onValueChange?.(next);
      },
      [value, isControlled, onValueChange],
    );

    const mergedLabels = useMemo<StepperLabels>(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);

    const contextValue = useMemo<StepperContextValue>(
      () => ({ value, setValue, orientation, labels: mergedLabels }),
      [value, setValue, orientation, mergedLabels],
    );

    return (
      <StepperContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="stepper"
          data-orientation={orientation}
          className={cn(
            "group/stepper flex w-full",
            orientation === "vertical" ? "flex-col" : "flex-row",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

/* ------------------------------------------------------------------ *
 * Stepper list
 * ------------------------------------------------------------------ */

/**
 * Ordered list landmark wrapping the steps. Pure layout — lays the items out
 * along the stepper's axis. Optional (a consumer may bring their own `<ol>`),
 * but provided for the common case so the steps read as an ordered list to AT.
 */
export const StepperList = forwardRef<HTMLOListElement, OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useStepper("StepperList");
    return (
      <ol
        ref={ref}
        data-slot="stepper-list"
        data-orientation={orientation}
        className={cn(
          "flex w-full",
          orientation === "vertical" ? "flex-col" : "flex-row items-center",
          className,
        )}
        {...props}
      />
    );
  },
);
StepperList.displayName = "StepperList";

/* ------------------------------------------------------------------ *
 * Stepper item
 * ------------------------------------------------------------------ */

export interface StepperItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * This step's zero-based index. Required so the item can derive its state
   * (completed / active / upcoming) from the stepper's active value.
   */
  step: number;
  /** Mark the step done explicitly. Overrides the index-derived "completed". */
  completed?: boolean;
  /** Disable interaction + dim the step. */
  disabled?: boolean;
}

/**
 * A single step. Computes its state relative to the active step — earlier steps
 * are `completed`, the current one is `active`, later ones are `upcoming` — and
 * exposes it (plus its index and disabled flag) to descendants through context.
 * Renders an `<li>`; carries `aria-current="step"` on the active step and
 * appends an sr-only state suffix ("completed" / "current" / "not started",
 * localizable via the stepper's `labels` prop) — the visual state is otherwise
 * color/icon-only, which screen readers cannot perceive.
 */
export const StepperItem = forwardRef<HTMLLIElement, StepperItemProps>(
  ({ step, completed, disabled = false, className, children, ...props }, ref) => {
    const { value, orientation, labels } = useStepper("StepperItem");

    const state: StepState =
      completed || step < value ? "completed" : step === value ? "active" : "upcoming";
    const stateLabel =
      state === "completed"
        ? labels.completed
        : state === "active"
          ? labels.current
          : labels.upcoming;

    const itemContext = useMemo<StepperItemContextValue>(
      () => ({ step, state, disabled }),
      [step, state, disabled],
    );

    return (
      <StepperItemContext.Provider value={itemContext}>
        <li
          ref={ref}
          data-slot="stepper-item"
          data-state={state}
          data-orientation={orientation}
          data-disabled={disabled || undefined}
          aria-current={state === "active" ? "step" : undefined}
          className={cn(
            "group/step relative flex",
            orientation === "vertical" ? "flex-col" : "flex-row items-center not-last:flex-1",
            className,
          )}
          {...props}
        >
          {children}
          <span data-slot="stepper-item-state" className="sr-only">
            {stateLabel}
          </span>
        </li>
      </StepperItemContext.Provider>
    );
  },
);
StepperItem.displayName = "StepperItem";

/* ------------------------------------------------------------------ *
 * Stepper indicator
 * ------------------------------------------------------------------ */

const stepperIndicatorVariants = cva(
  cn(
    "inline-flex size-8 shrink-0 select-none items-center justify-center rounded-full text-sm font-medium",
    "transition-[background,color,border-color] duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ),
  {
    variants: {
      state: {
        completed: "bg-primary/15 text-primary-strong",
        active: "bg-primary text-white shadow-xs",
        upcoming: "border border-border bg-surface-overlay text-fg-tertiary",
      },
    },
    defaultVariants: { state: "upcoming" },
  },
);

export interface StepperIndicatorProps
  extends HTMLAttributes<HTMLSpanElement>,
    Omit<VariantProps<typeof stepperIndicatorVariants>, "state"> {
  /** Override the auto-rendered content (step number / check). */
  children?: HTMLAttributes<HTMLSpanElement>["children"];
}

/**
 * The numbered circle for a step. Shows a {@link Check} once the step is
 * completed, the 1-based step number while it is active or upcoming, and styles
 * itself from the item state (active = solid primary, completed = tinted, else
 * muted). Pass `children` to render custom content (e.g. an icon).
 */
export const StepperIndicator = forwardRef<HTMLSpanElement, StepperIndicatorProps>(
  ({ className, children, ...props }, ref) => {
    const { step, state } = useStepperItem("StepperIndicator");
    return (
      <span
        ref={ref}
        data-slot="stepper-indicator"
        data-state={state}
        className={cn(stepperIndicatorVariants({ state }), className)}
        {...props}
      >
        {children ??
          (state === "completed" ? (
            <Check aria-hidden="true" strokeWidth={2.5} />
          ) : (
            <span>{step + 1}</span>
          ))}
      </span>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

/* ------------------------------------------------------------------ *
 * Stepper separator
 * ------------------------------------------------------------------ */

/**
 * The connector line between two steps. Fills with `bg-primary` once the
 * preceding step is complete and stays `bg-border` otherwise; orients itself
 * along the stepper axis. Decorative — hidden from assistive tech.
 */
export const StepperSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useStepper("StepperSeparator");
    const { state } = useStepperItem("StepperSeparator");
    const filled = state === "completed";
    return (
      <div
        ref={ref}
        data-slot="stepper-separator"
        data-state={filled ? "completed" : "incomplete"}
        aria-hidden="true"
        className={cn(
          "shrink-0 rounded-full transition-colors duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
          filled ? "bg-primary" : "bg-border",
          orientation === "vertical" ? "mx-auto my-1 w-px flex-1" : "mx-2 h-px flex-1",
          className,
        )}
        {...props}
      />
    );
  },
);
StepperSeparator.displayName = "StepperSeparator";

/* ------------------------------------------------------------------ *
 * Stepper trigger
 * ------------------------------------------------------------------ */

export interface StepperTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Optional clickable wrapper that activates its step on press. Inherits the
 * item's `disabled` state, forwards keyboard/focus semantics as a real
 * `<button>`, and is a no-op when the step is already active. Wrap the
 * indicator + title/description in it to make a step navigable.
 */
export const StepperTrigger = forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ className, disabled, type, onClick, ...props }, ref) => {
    const { setValue } = useStepper("StepperTrigger");
    const { step, disabled: itemDisabled } = useStepperItem("StepperTrigger");
    const isDisabled = disabled ?? itemDisabled;
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        data-slot="stepper-trigger"
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center gap-3 rounded-lg text-left",
          "transition-opacity duration-150 ease-[var(--ease-out-quart)]",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:pointer-events-none disabled:opacity-50",
          "not-disabled:cursor-pointer",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) {
            return;
          }
          setValue(step);
        }}
        {...props}
      />
    );
  },
);
StepperTrigger.displayName = "StepperTrigger";

/* ------------------------------------------------------------------ *
 * Stepper title / description
 * ------------------------------------------------------------------ */

/** The short label for a step. Brightens to `text-fg` once active or completed. */
export const StepperTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { state } = useStepperItem("StepperTitle");
    return (
      <div
        ref={ref}
        data-slot="stepper-title"
        className={cn(
          "text-sm font-medium leading-none",
          state === "upcoming" ? "text-fg-tertiary" : "text-fg",
          className,
        )}
        {...props}
      />
    );
  },
);
StepperTitle.displayName = "StepperTitle";

/** Optional secondary line under a {@link StepperTitle}. */
export const StepperDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="stepper-description"
        className={cn("mt-1 text-xs text-fg-secondary", className)}
        {...props}
      />
    );
  },
);
StepperDescription.displayName = "StepperDescription";

export { stepperIndicatorVariants };
