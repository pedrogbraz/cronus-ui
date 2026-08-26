"use client";

import { useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/**
 * Whether the marquee scrolls. `"respect"` (default) honours the visitor's
 * `prefers-reduced-motion` setting — it scrolls for everyone except those who
 * opt out, who get a static, fully-legible row. `"always"` always scrolls,
 * ignoring the OS setting (e.g. a showcase that must demonstrate the motion);
 * `"never"` is always static.
 */
export type MarqueeMotionPreference = "respect" | "always" | "never";

interface MarqueeStyle extends CSSProperties {
  "--marquee-duration"?: string;
  "--marquee-gap"?: string;
  "--marquee-from"?: string;
  "--marquee-to"?: string;
}

export interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  /** The items to scroll — logos, cards, testimonials, or a text ticker. */
  children: ReactNode;
  /**
   * Scroll direction. Horizontal: `"left"` (default) | `"right"`. When
   * {@link MarqueeProps.vertical} is set, the same prop reads as `"up"`
   * (default) | `"down"` — i.e. `"left"`/`"up"` share the forward sense and
   * `"right"`/`"down"` the reverse, so one prop covers both axes.
   */
  direction?: "left" | "right";
  /** Scroll the marquee on the vertical axis instead of the horizontal one. */
  vertical?: boolean;
  /**
   * Travel speed in **pixels per second** — resolution-independent and stable
   * across content widths (the loop duration is derived from the measured track
   * size). Defaults to `40` (a tasteful, slow drift).
   */
  speed?: number;
  /** Pause the scroll while the pointer is over the marquee. Defaults to `true`. */
  pauseOnHover?: boolean;
  /**
   * Fade the leading and trailing edges into the background with a gradient
   * `mask-image`, so items dissolve rather than clip. Defaults to `true`.
   */
  fade?: boolean;
  /** Spacing between repeated items. Accepts any CSS length. Defaults to `"1rem"`. */
  gap?: string;
  /**
   * How many copies of {@link MarqueeProps.children} are rendered back-to-back.
   * The track translates by exactly one copy, so any count ≥ 2 loops
   * seamlessly. Defaults to `2`; raise it when a single copy cannot fill wide
   * viewports (leaving a visible gap before the loop point).
   */
  repeat?: number;
  /**
   * Whether the marquee scrolls vs. honours `prefers-reduced-motion`:
   * `"respect"` (default), `"always"` (force motion), or `"never"` (force
   * static). Defaults to `"respect"`.
   */
  motionPreference?: MarqueeMotionPreference;
  /** Class applied to each repeated copy (the flex row/column of items). */
  groupClassName?: string;
}

const DEFAULT_SPEED = 40;
const DEFAULT_GAP = "1rem";
const DEFAULT_REPEAT = 2;
const MIN_REPEAT = 2;
const MIN_DURATION = 1;

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * A seamless, constant-velocity infinite scroller for logos, testimonials, or a
 * text ticker. The track is rendered as N (`repeat`, default 2) identical copies
 * laid back-to-back; a CSS keyframe translates the whole track by exactly **one
 * copy's length** and loops, so the moment it resets is pixel-identical to the
 * start — there is no visible jump. The animation runs on a single composited
 * `transform`, so it stays buttery regardless of how many items it carries.
 *
 * The keyframe travels by percentage (robust to resize), while the loop
 * *duration* is computed from the live track measurement so the apparent
 * {@link MarqueeProps.speed} (px/sec) holds whatever the content width is.
 *
 * **Pause on hover** is pure CSS (`animation-play-state`), so hovering never
 * drops a frame. **Reduced motion** is honoured: when the visitor prefers
 * reduced motion (or {@link MarqueeProps.motionPreference} forces it), a single
 * static copy is rendered with no animation — the content stays fully legible.
 */
export const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      children,
      className,
      groupClassName,
      direction = "left",
      vertical = false,
      speed = DEFAULT_SPEED,
      pauseOnHover = true,
      fade = true,
      gap = DEFAULT_GAP,
      repeat = DEFAULT_REPEAT,
      motionPreference = "respect",
      style,
      ...props
    },
    ref,
  ) => {
    const systemReducedMotion = useReducedMotion();
    const prefersReducedMotion =
      motionPreference === "always"
        ? false
        : motionPreference === "never"
          ? true
          : systemReducedMotion;

    // Per-instance keyframe name so multiple marquees (different axes/durations)
    // never collide on a shared `@keyframes`. `useId` is SSR-stable; sanitise it
    // since CSS identifiers cannot contain the `:` React emits.
    const rawId = useId();
    const animationName = `cronus-marquee-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

    const safeSpeed = Math.max(finiteOr(speed, DEFAULT_SPEED), 1);
    const copies = Math.max(Math.round(finiteOr(repeat, DEFAULT_REPEAT)), MIN_REPEAT);

    // Measure one copy along the scroll axis so the loop duration tracks the real
    // content size — the keyframe itself moves by percentage, so we only need the
    // distance to keep px/sec speed constant. Falls back to a sane duration until
    // the measurement lands (and stays correct under resize via ResizeObserver).
    const measureRef = useRef<HTMLDivElement>(null);
    const [copySize, setCopySize] = useState(0);

    useLayoutEffect(() => {
      const node = measureRef.current;
      if (!node || prefersReducedMotion) return;

      const read = () => {
        const rect = node.getBoundingClientRect();
        setCopySize(vertical ? rect.height : rect.width);
      };
      read();

      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(read);
      observer.observe(node);
      return () => observer.disconnect();
    }, [vertical, prefersReducedMotion]);

    // distance = one copy + the gap that follows it before the next copy starts,
    // so the reset lands exactly on the seam (no half-gap stutter).
    const gapPx = useMemo(() => parseGap(gap), [gap]);
    const distance = copySize + gapPx;
    const duration = Math.max(distance / safeSpeed, MIN_DURATION);

    // The keyframe always animates 0 → -(100/copies)% of the TRACK (one copy).
    // For "forward" (left / up) the row slides toward its start; "right"/"down"
    // reverse it by swapping the from/to endpoints, so velocity stays linear and
    // the seam is identical in both directions.
    const axisSign = vertical ? "Y" : "X";
    const forward = direction === "left";
    // Each copy is one full repeat of the children; sliding it by exactly its
    // own length PLUS the inter-copy gap lands the *next* copy precisely where
    // this one began, so the reset is pixel-identical — a seamless loop. The
    // travel is one copy + gap regardless of `copies` (which only needs to be
    // ≥ 2 to keep the viewport filled), and it matches the `distance` the
    // duration is derived from, so the apparent px/sec speed is exact. Both
    // endpoints use the SAME translate function on the scroll axis so the
    // browser interpolates them linearly (mismatched function lists fall back
    // to matrix decomposition, which can stutter); `[will-change:transform]`
    // already composites the track, so the 3d hint is unnecessary.
    const zero = `translate${axisSign}(0)`;
    const shifted = `translate${axisSign}(calc(-100% - var(--marquee-gap)))`;
    const fromTransform = forward ? zero : shifted;
    const toTransform = forward ? shifted : zero;

    const fadeMask = vertical
      ? "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)"
      : "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)";

    const trackStyle: MarqueeStyle = {
      "--marquee-duration": `${duration}s`,
      "--marquee-gap": gap,
      "--marquee-from": fromTransform,
      "--marquee-to": toTransform,
    };

    if (prefersReducedMotion) {
      // Static, fully-legible fallback: one copy, no track animation, no clones.
      return (
        <div
          ref={ref}
          data-slot="marquee"
          data-vertical={vertical || undefined}
          data-reduced-motion="true"
          className={cn(
            "relative overflow-hidden",
            fade && "[mask-image:var(--marquee-mask)] [-webkit-mask-image:var(--marquee-mask)]",
            className,
          )}
          style={
            {
              ...style,
              ...(fade ? { "--marquee-mask": fadeMask } : {}),
            } as CSSProperties
          }
          {...props}
        >
          <div
            data-slot="marquee-group"
            className={cn(
              "flex w-max items-center",
              vertical ? "flex-col" : "flex-row",
              groupClassName,
            )}
            style={{ gap }}
          >
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="marquee"
        data-vertical={vertical || undefined}
        className={cn(
          "group relative flex overflow-hidden",
          vertical ? "flex-col" : "flex-row",
          fade && "[mask-image:var(--marquee-mask)] [-webkit-mask-image:var(--marquee-mask)]",
          className,
        )}
        style={
          {
            ...style,
            ...trackStyle,
            // Space the back-to-back copies by the SAME gap used between items,
            // so the gap straddling the loop seam matches every other gap (the
            // `<style>` child is display:none, so it never gets a flex gap).
            gap,
            ...(fade ? { "--marquee-mask": fadeMask } : {}),
          } as MarqueeStyle
        }
        {...props}
      >
        {/* Per-instance keyframes — keeps the file self-contained (no shared
            stylesheet edit) while still using a native CSS animation, which is
            the smoothest, most seamless loop the platform offers. The pause and
            reduced-motion resets are handled by classes + the tokens.css media
            query backstop, so this only declares the motion itself. */}
        <style>{`@keyframes ${animationName}{from{transform:var(--marquee-from)}to{transform:var(--marquee-to)}}`}</style>
        {Array.from({ length: copies }, (_, copyIndex) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: clones are positional, identical, and stable for the lifetime of the track.
            key={`copy-${copyIndex}`}
            ref={copyIndex === 0 ? measureRef : undefined}
            // Clones are decorative duplicates of the first copy; hide them from
            // assistive tech so the content is announced exactly once.
            aria-hidden={copyIndex === 0 ? undefined : "true"}
            data-slot="marquee-group"
            className={cn(
              "flex w-max shrink-0 items-center [animation:var(--marquee-animation)] [will-change:transform]",
              // SSR backstop: until hydration swaps in the static fallback, this
              // stops motion for reduced-motion visitors. `"always"` opts out —
              // it must scroll regardless of the OS setting.
              motionPreference !== "always" && "motion-reduce:[animation:none]",
              vertical ? "min-h-max flex-col" : "min-w-max flex-row",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              groupClassName,
            )}
            style={
              {
                gap,
                "--marquee-animation": `${animationName} var(--marquee-duration) linear infinite`,
              } as CSSProperties
            }
          >
            {children}
          </div>
        ))}
      </div>
    );
  },
);
Marquee.displayName = "Marquee";

/**
 * Resolve a CSS gap length to pixels for the duration maths. Handles the common
 * `px`/`rem`/`em` units (rem/em assume the 16px root default — exact enough for
 * timing, which only needs to be perceptually constant, not sub-pixel precise);
 * anything else contributes 0 so the loop still runs at the copy width.
 */
function parseGap(gap: string): number {
  const match = /^(-?[\d.]+)(px|rem|em)?$/.exec(gap.trim());
  if (!match) return 0;
  const value = Number.parseFloat(match[1] ?? "0");
  if (!Number.isFinite(value)) return 0;
  const unit = match[2] ?? "px";
  return unit === "px" ? value : value * 16;
}
