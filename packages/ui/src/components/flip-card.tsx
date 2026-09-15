"use client";

import {
  type CSSProperties,
  createContext,
  type FocusEvent,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/** What causes the card to reveal its back face. */
export type FlipCardTrigger = "hover" | "click" | "controlled";
/** Axis the card rotates around when it flips. */
export type FlipCardAxis = "horizontal" | "vertical";

interface FlipCardContextValue {
  /** Whether the back face is currently showing. */
  flipped: boolean;
  /** Rotation axis, shared with the faces so the back can pre-rotate to match. */
  axis: FlipCardAxis;
}

const FlipCardContext = createContext<FlipCardContextValue | null>(null);

function useFlipCard(component: string): FlipCardContextValue {
  const context = useContext(FlipCardContext);
  if (context === null) {
    throw new Error(`<${component}> must be used within <FlipCard>.`);
  }
  return context;
}

export interface FlipCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /**
   * What flips the card. `"hover"` flips on pointer hover **and** keyboard focus
   * (so it is fully operable without a mouse); `"click"` toggles on click, Enter
   * or Space and exposes `role="button"` + `aria-pressed`; `"controlled"` never
   * self-flips — you drive it entirely through the {@link flipped} prop.
   * @default "hover"
   */
  trigger?: FlipCardTrigger;
  /**
   * Axis the card rotates around. `"horizontal"` spins left↔right (`rotateY`);
   * `"vertical"` tumbles top↔bottom (`rotateX`).
   * @default "horizontal"
   */
  axis?: FlipCardAxis;
  /**
   * Controlled flip state. When provided the card shows the back face iff `true`
   * and its own hover/click toggling is suppressed (parent owns the state).
   */
  flipped?: boolean;
  /** Initial flip state when uncontrolled. @default false */
  defaultFlipped?: boolean;
  /**
   * Fires with the next flip state whenever the card would flip. Still called
   * while controlled, so you can lift the state up.
   */
  onFlippedChange?: (flipped: boolean) => void;
  /**
   * Accessible name for the flip control. Strongly recommended for
   * `trigger="click"`, where the whole card is a single button.
   */
  "aria-label"?: string;
}

/**
 * A 3D flip card composed from `FlipCard` + `FlipCardFront` + `FlipCardBack`
 * (wired through context). Both faces are always in the DOM, stacked with
 * `position: absolute`; the inner wrapper is an `absolute inset-0`
 * `transform-style: preserve-3d` stage (so it fills a min-height-only card)
 * that rotates 180° on a spring-eased `transition-transform`, and each
 * face uses `backface-visibility: hidden` so only the forward-facing side shows.
 *
 * Triggers: `"hover"` flips on pointer hover or keyboard focus, `"click"`
 * toggles on click / Enter / Space (with `role="button"` + `aria-pressed`), and
 * `"controlled"` flips only via the `flipped` prop. State is uncontrolled by
 * default and lifts up through `onFlippedChange`.
 *
 * Performance: the rotation is a single compositor-friendly `transform`; there
 * are no timers, animation frames or `mousemove` state updates to clean up.
 * Accessibility: the inactive face is `inert`, so its content never double-reads
 * to a screen reader and its focusable children stay out of the tab order until
 * that face is showing. Under `prefers-reduced-motion: reduce` the rotation is
 * forced off and the faces cross-swap instantly (no spin).
 */
export const FlipCard = forwardRef<HTMLDivElement, FlipCardProps>(
  (
    {
      trigger = "hover",
      axis = "horizontal",
      flipped: controlledFlipped,
      defaultFlipped = false,
      onFlippedChange,
      className,
      children,
      onClick,
      onKeyDown,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);
    const isControlled = controlledFlipped !== undefined;
    const flipped = isControlled ? controlledFlipped : internalFlipped;
    const interactive = trigger !== "controlled";

    const setFlipped = (next: boolean) => {
      if (!isControlled) {
        setInternalFlipped(next);
      }
      onFlippedChange?.(next);
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      if (trigger === "click") {
        setFlipped(!flipped);
      }
      onClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (trigger === "click" && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        setFlipped(!flipped);
      }
      onKeyDown?.(event);
    };

    const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
      if (trigger === "hover") {
        setFlipped(true);
      }
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
      if (trigger === "hover") {
        setFlipped(false);
      }
      onMouseLeave?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
      if (trigger === "hover") {
        setFlipped(true);
      }
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      // Only unflip when focus actually leaves the card — not when it moves
      // between the card's own descendants (e.g. tabbing onto a back-face link).
      if (trigger === "hover" && !event.currentTarget.contains(event.relatedTarget)) {
        setFlipped(false);
      }
      onBlur?.(event);
    };

    const rotation = axis === "vertical" ? "rotateX(180deg)" : "rotateY(180deg)";
    const contextValue = useMemo<FlipCardContextValue>(() => ({ flipped, axis }), [flipped, axis]);

    // aria-label must live on a role that supports naming (never a bare div).
    const role = trigger === "click" ? "button" : ariaLabel ? "group" : undefined;

    return (
      <FlipCardContext.Provider value={contextValue}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: the card is a self-contained flip surface; its face content carries its own semantics, and interactive roles/handlers are applied only in the hover/click modes. */}
        {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-pressed is only ever emitted together with role="button" (both gated on trigger === "click"); biome can't correlate the two runtime conditions. */}
        <div
          ref={ref}
          data-slot="flip-card"
          data-flipped={flipped ? "" : undefined}
          role={role}
          tabIndex={interactive ? 0 : undefined}
          aria-pressed={trigger === "click" ? flipped : undefined}
          aria-label={ariaLabel}
          className={cn(
            "group/flip relative isolate min-h-[16rem] rounded-2xl [perspective:1600px]",
            interactive &&
              "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
            className,
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          <div
            className={cn(
              // `absolute inset-0`, not `size-full`: the card usually sets only
              // `min-h-[16rem]`, and a percentage height against min-height
              // resolves to 0, collapsing both absolute faces to their borders.
              "absolute inset-0 transition-transform duration-[600ms] ease-[var(--ease-spring)] [transform-style:preserve-3d] will-change-transform",
              "motion-reduce:transition-none motion-reduce:!transform-none",
            )}
            style={{ transform: flipped ? rotation : undefined }}
          >
            {children}
          </div>
        </div>
      </FlipCardContext.Provider>
    );
  },
);
FlipCard.displayName = "FlipCard";

const faceClassName = cn(
  "absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border text-fg shadow-sm",
  "[backface-visibility:hidden] motion-reduce:[backface-visibility:visible]",
);

/**
 * The front (default) face of a {@link FlipCard}. Shown while the card is not
 * flipped; becomes `inert` and instantly hidden (reduced motion) once the card
 * turns to the back.
 */
export const FlipCardFront = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { flipped } = useFlipCard("FlipCardFront");
    return (
      <div
        ref={ref}
        data-slot="flip-card-front"
        data-active={!flipped || undefined}
        inert={flipped || undefined}
        className={cn(
          faceClassName,
          "bg-surface-raised",
          // Reduced motion: no spin, so hide the front the instant we flip.
          "motion-reduce:group-data-[flipped]/flip:invisible",
          className,
        )}
        {...props}
      />
    );
  },
);
FlipCardFront.displayName = "FlipCardFront";

/**
 * The back face of a {@link FlipCard}. Pre-rotated 180° on the card's axis so it
 * faces the viewer once the stage turns. `inert` while the front is showing.
 */
export const FlipCardBack = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    const { flipped, axis } = useFlipCard("FlipCardBack");
    const preRotate: CSSProperties = {
      transform: axis === "vertical" ? "rotateX(180deg)" : "rotateY(180deg)",
    };
    return (
      <div
        ref={ref}
        data-slot="flip-card-back"
        data-active={flipped || undefined}
        inert={!flipped || undefined}
        className={cn(
          faceClassName,
          "bg-surface-elevated",
          // Reduced motion: drop the 180° pre-rotation and swap by visibility.
          "motion-reduce:!transform-none motion-reduce:invisible motion-reduce:group-data-[flipped]/flip:visible",
          className,
        )}
        style={{ ...preRotate, ...style }}
        {...props}
      />
    );
  },
);
FlipCardBack.displayName = "FlipCardBack";
