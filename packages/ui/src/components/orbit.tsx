import {
  Children,
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
} from "react";
import { cn } from "../lib/cn.js";

/**
 * The one shared keyframe the whole system runs on: a plain 0→1 turn rotation.
 * Everything else (starting angle, speed, direction, counter-rotation) rides
 * CSS custom properties and the `rotate` property, so a single fixed name
 * covers every ring and every item. It is injected once per `<Orbit>` stage;
 * repeated identical definitions are deduped by the browser (same pattern as
 * `BorderBeam`'s `kronus-border-beam`).
 */
const ORBIT_KEYFRAMES =
  "@keyframes kronus-orbit-spin{from{transform:rotate(0turn)}to{transform:rotate(1turn)}}";

const DEFAULT_DURATION = 24;
const MIN_DURATION = 1;

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/** Per-ring CSS custom properties inherited by its positioners and items. */
interface OrbitRingStyle extends CSSProperties {
  "--orbit-duration"?: string;
  "--orbit-spin-direction"?: string;
  "--orbit-counter-direction"?: string;
}

/** Per-item slot angle, consumed by both the positioner and the item. */
interface OrbitPositionerStyle extends CSSProperties {
  "--orbit-angle"?: string;
}

export interface OrbitProps extends HTMLAttributes<HTMLDivElement> {}

export interface OrbitRingProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Radius of the ring in pixels — the distance from the nucleus' centre to
   * the centre of each orbiting item. The ring renders as a `2 × radius`
   * circle absolutely centred on the stage.
   */
  radius: number;
  /**
   * Seconds for one full revolution. Larger is calmer; concentric rings look
   * best with distinct durations so their items never sync up. Defaults to
   * `24`.
   */
  duration?: number;
  /** Revolve counter-clockwise instead of clockwise. Defaults to `false`. */
  reverse?: boolean;
  /**
   * Angle of the first item's slot in degrees, measured clockwise from
   * 12 o'clock. Remaining items stay evenly distributed after the offset.
   * Use it to de-align concentric rings' starting positions. Defaults to `0`.
   */
  startAngle?: number;
  /** Draw the faint circular guide (`border-border/40`). Defaults to `true`. */
  guide?: boolean;
}

export interface OrbitItemProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * The stage for a decorative orbit system: a `relative` flex box that centres
 * its children as the **nucleus** while `OrbitRing`s (absolutely positioned)
 * centre themselves around it. Size the stage to contain the largest ring,
 * e.g. `className="size-72"` for a 128 px ring.
 *
 * **Mechanism** — pure CSS, zero JS per frame. Each item hangs off a
 * *positioner* that fills the ring's circle and spins via one shared keyframe
 * (`kronus-orbit-spin`, injected here once). The positioner's slot angle lives
 * in the CSS `rotate` property, which the browser **composes with** the
 * animated `transform` instead of being overwritten by it — so one keyframe
 * serves every slot. The item itself runs the same keyframe with
 * `animation-direction` inverted plus a `rotate` of the negated slot angle, so
 * the two rotations cancel exactly and content stays upright while it travels.
 *
 * **Pause on hover** — hovering anywhere on the stage pauses every ring via
 * `animation-play-state` (the stage is a named `group/orbit`), so no frame is
 * ever dropped and interactive items can be reached mid-flight.
 *
 * **Reduced motion** — under `prefers-reduced-motion: reduce` the animations
 * are removed (`motion-reduce:[animation-name:none]`) and the static `rotate`
 * bases take over: items keep their exact distributed placement on the ring,
 * upright, with no spin.
 */
export const Orbit = forwardRef<HTMLDivElement, OrbitProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="orbit"
      className={cn("group/orbit relative flex items-center justify-center", className)}
      {...props}
    >
      {/* display:none — never participates in the flex layout. */}
      <style>{ORBIT_KEYFRAMES}</style>
      {children}
    </div>
  ),
);
Orbit.displayName = "Orbit";

/**
 * One circular track of an `Orbit` stage: an absolutely-centred `2 × radius`
 * circle with a faint guide border, whose children are distributed evenly
 * around the circumference and revolve together. Each child is wrapped in a
 * spinning positioner; wrap the child content in `OrbitItem` so it
 * counter-rotates and stays upright (bare children simply spin with the ring).
 *
 * Slots are counted from the ring's **direct** children (`Children.toArray`),
 * so render items inline — a wrapper component or fragment is opaque to React
 * and would occupy a single slot.
 */
export const OrbitRing = forwardRef<HTMLDivElement, OrbitRingProps>(
  (
    {
      className,
      children,
      radius,
      duration = DEFAULT_DURATION,
      reverse = false,
      startAngle = 0,
      guide = true,
      style,
      ...props
    },
    ref,
  ) => {
    const safeRadius = Math.max(finiteOr(radius, 0), 0);
    const safeDuration = Math.max(finiteOr(duration, DEFAULT_DURATION), MIN_DURATION);
    const safeStartAngle = finiteOr(startAngle, 0);

    const items = Children.toArray(children);
    const step = items.length > 0 ? 360 / items.length : 0;

    const ringStyle: OrbitRingStyle = {
      width: safeRadius * 2,
      height: safeRadius * 2,
      "--orbit-duration": `${safeDuration}s`,
      // The item's counter-spin runs the SAME keyframe in the opposite
      // direction, so the pair always sums to a full turn (≡ upright).
      "--orbit-spin-direction": reverse ? "reverse" : "normal",
      "--orbit-counter-direction": reverse ? "normal" : "reverse",
    };

    return (
      <div
        ref={ref}
        data-slot="orbit-ring"
        className={cn(
          // pointer-events-none keeps the (potentially large) circle from
          // blocking the nucleus; OrbitItem restores pointer-events for its
          // own content.
          "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
          guide && "border border-border/40",
          className,
        )}
        style={{ ...ringStyle, ...style }}
        {...props}
      >
        {items.map((child, index) => {
          const angle = safeStartAngle + index * step;
          const key =
            isValidElement(child) && child.key != null ? child.key : `orbit-slot-${index}`;
          const positionerStyle: OrbitPositionerStyle = {
            "--orbit-angle": `${angle}deg`,
            // Static slot placement. While the animation runs, the keyframe's
            // `transform` composes ON TOP of this `rotate` (they are separate
            // properties); under reduced motion the animation is removed and
            // this alone places the item at its distributed angle.
            rotate: "var(--orbit-angle)",
          };
          return (
            <div
              key={key}
              data-slot="orbit-positioner"
              className={cn(
                "absolute inset-0 [animation-name:kronus-orbit-spin] [will-change:transform]",
                "[animation-duration:var(--orbit-duration)] [animation-timing-function:linear]",
                "[animation-iteration-count:infinite] [animation-direction:var(--orbit-spin-direction)]",
                "group-hover/orbit:[animation-play-state:paused] motion-reduce:[animation-name:none]",
              )}
              style={positionerStyle}
            >
              {/* Top-centre of the circle = exactly `radius` from the nucleus;
                  the positioner's rotation carries it around the track. */}
              <div
                data-slot="orbit-holder"
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
              >
                {child}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
OrbitRing.displayName = "OrbitRing";

/**
 * The upright content of one ring slot. Runs the shared spin keyframe with the
 * ring's inverted `animation-direction` (via the inherited
 * `--orbit-counter-direction`) plus a static `rotate` of the negated slot
 * angle, cancelling the positioner's rotation frame-for-frame — the content
 * revolves around the nucleus but never tilts. Restores `pointer-events` so
 * links/buttons inside remain clickable (hovering the stage pauses the orbit,
 * making them easy to reach).
 */
export const OrbitItem = forwardRef<HTMLDivElement, OrbitItemProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="orbit-item"
      className={cn(
        "pointer-events-auto flex items-center justify-center [animation-name:kronus-orbit-spin]",
        "[animation-duration:var(--orbit-duration,24s)] [animation-timing-function:linear]",
        "[animation-iteration-count:infinite] [animation-direction:var(--orbit-counter-direction,reverse)]",
        "group-hover/orbit:[animation-play-state:paused] motion-reduce:[animation-name:none]",
        className,
      )}
      style={{ rotate: "calc(var(--orbit-angle, 0deg) * -1)", ...style }}
      {...props}
    />
  ),
);
OrbitItem.displayName = "OrbitItem";
