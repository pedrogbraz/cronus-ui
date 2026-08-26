import { type CSSProperties, forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn.js";

/** Per-instance CSS custom properties that parametrise the travelling beam. */
interface BorderBeamStyle extends CSSProperties {
  "--beam-size"?: string;
  "--beam-duration"?: string;
  "--beam-delay"?: string;
  "--beam-border-width"?: string;
  "--beam-color-from"?: string;
  "--beam-color-to"?: string;
}

export interface BorderBeamProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Length of the luminous head, in pixels. Also sets the corner radius of the
   * travel path so the beam rounds the corners smoothly. Larger values read as a
   * longer comet trail. Defaults to `60`.
   */
  size?: number;
  /** Seconds for one full lap around the perimeter. Defaults to `8` (a calm, premium drift). */
  duration?: number;
  /**
   * Phase offset in seconds — the beam starts as if it had already been running
   * for this long, so two beams on stacked cards can be staggered around the
   * loop instead of moving in lockstep. Defaults to `0`.
   */
  delay?: number;
  /** Colour of the leading edge of the beam. Defaults to the theme primary (`var(--kronus-primary)`). */
  colorFrom?: string;
  /** Colour the trail fades through before it dissolves. Defaults to the theme accent (`var(--kronus-accent)`). */
  colorTo?: string;
  /** Thickness of the border band the beam rides in, in pixels. Defaults to `1.5`. */
  borderWidth?: number;
  /** Travel counter-clockwise instead of clockwise. Defaults to `false`. */
  reverse?: boolean;
}

// Two-layer mask: layer 1 (clipped to padding-box) hides, layer 2 (clipped to
// border-box) shows; `mask-composite: intersect` leaves only the border band, so
// the comet is visible strictly along the perimeter and never over the content.
const BEAM_MASK_IMAGE = "linear-gradient(transparent, transparent), linear-gradient(#000, #000)";

/**
 * A single bright light head that continuously orbits the element's border, like
 * a comet tracing the perimeter of a card or CTA. The head rides the border via
 * CSS Motion Path (`offset-path`/`offset-distance`) and is clipped to a thin
 * border band with a two-layer mask, so it reads as a beam *on* the border rather
 * than a dot floating on the edge. This is distinct from the static
 * `GradientBorder`: nothing is painted until the beam sweeps past, giving a live,
 * premium shimmer.
 *
 * **Performance:** the whole effect is one composited CSS animation on
 * `offset-distance` (hinted with `will-change`) — no JS, no timers, no re-renders;
 * every knob (size, duration, delay, colours, thickness) rides a CSS variable.
 *
 * **Accessibility & motion:** the beam layer is purely decorative
 * (`aria-hidden`), sits behind the content, and is fully suppressed under
 * `prefers-reduced-motion: reduce` (`motion-reduce:hidden`) — it carries no
 * information, so reduced-motion visitors simply see the card with no animation.
 */
export const BorderBeam = forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      className,
      children,
      size = 60,
      duration = 8,
      delay = 0,
      colorFrom = "var(--kronus-primary)",
      colorTo = "var(--kronus-accent)",
      borderWidth = 1.5,
      reverse = false,
      style,
      ...props
    },
    ref,
  ) => {
    const beamStyle: BorderBeamStyle = {
      "--beam-size": `${size}px`,
      "--beam-duration": `${duration}s`,
      // Negative delay offsets the phase without an initial pause, so staggered
      // beams are already mid-lap on first paint.
      "--beam-delay": `${-delay}s`,
      "--beam-border-width": `${borderWidth}px`,
      "--beam-color-from": colorFrom,
      "--beam-color-to": colorTo,
    };

    return (
      <div
        ref={ref}
        data-slot="border-beam"
        className={cn("relative rounded-2xl", className)}
        style={{ ...beamStyle, ...style }}
        {...props}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] motion-reduce:hidden"
          style={{
            border: "var(--beam-border-width) solid transparent",
            maskClip: "padding-box, border-box",
            maskComposite: "intersect",
            maskImage: BEAM_MASK_IMAGE,
            WebkitMaskImage: BEAM_MASK_IMAGE,
          }}
        >
          {/* Shared, identical keyframes — safe to repeat per instance (the
              browser dedupes by name); all timing/appearance rides CSS variables,
              so no per-instance keyframe name is needed. */}
          <style>
            {"@keyframes kronus-border-beam{from{offset-distance:0%}to{offset-distance:100%}}"}
          </style>
          <div
            className={cn(
              "absolute aspect-square w-[var(--beam-size)]",
              "[offset-path:rect(0_auto_auto_0_round_var(--beam-size))]",
              "[animation-name:kronus-border-beam] [animation-duration:var(--beam-duration)]",
              "[animation-timing-function:linear] [animation-iteration-count:infinite]",
              "[animation-delay:var(--beam-delay)] [will-change:offset-distance]",
              reverse && "[animation-direction:reverse]",
            )}
            style={{
              background:
                "linear-gradient(to left, var(--beam-color-from), var(--beam-color-to), transparent)",
            }}
          />
        </div>
        <div className="relative">{children}</div>
      </div>
    );
  },
);
BorderBeam.displayName = "BorderBeam";
