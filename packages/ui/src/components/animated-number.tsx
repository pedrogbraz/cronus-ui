"use client";

import {
  type AnimationPlaybackControlsWithThen,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { cn } from "../lib/cn.js";

/**
 * Spring used to tween between values. A gentle bounce makes the count read as
 * a physical settle rather than a linear ramp. Overridable via the `spring`
 * prop; when a `duration` is given it takes precedence (spring stiffness/damping
 * are ignored and motion derives them to hit the target duration).
 */
const ANIMATED_NUMBER_SPRING = {
  type: "spring" as const,
  bounce: 0.18,
};

/** Subset of motion's spring transition we expose; `duration` is in seconds. */
export interface AnimatedNumberSpring {
  bounce?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface AnimatedNumberProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.span>, "children"> {
  /** Target value. Whenever it changes, the number tweens from its current displayed value to here. */
  value: number;
  /**
   * Custom formatter for the displayed string. When omitted, the value is
   * formatted with `Intl.NumberFormat(locale, formatOptions)`.
   */
  format?: (n: number) => string;
  /** Locale passed to the default `Intl.NumberFormat` formatter (ignored if `format` is set). */
  locale?: string;
  /** Options passed to the default `Intl.NumberFormat` formatter (ignored if `format` is set). */
  formatOptions?: Intl.NumberFormatOptions;
  /** Tween length in seconds. Defaults to ~0.8s; overrides the spring's natural duration. */
  duration?: number;
  /** Override the settle spring (advanced — defaults to the Kronus count spring). */
  spring?: AnimatedNumberSpring;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"user"` (snap for
   * users who opt out). Pass `"never"` to always animate the count — e.g. a
   * showcase that must demonstrate it — or `"always"` to force the snap.
   */
  reducedMotion?: "user" | "always" | "never";
  /**
   * Announce the **settled** value to screen readers via a visually-hidden
   * `aria-live="polite"` sibling. Defaults to `false`. Only the final value
   * (once the tween completes / snaps) is announced — never the ~97
   * interpolated frames — so opting in stays quiet.
   */
  announce?: boolean;
}

/**
 * Smoothly tweens (counts up/down) from its previously displayed value to the
 * new `value` whenever `value` changes — ideal for dashboards, balances,
 * pricing and KPIs. It pairs naturally with `Metric` / `MetricValue`.
 *
 * How it works: an internal motion value is `animate`d toward each new target
 * with a spring (or a fixed `duration`). On every frame the latest number is
 * formatted (custom `format`, else `Intl.NumberFormat`) and written straight to
 * the span's `textContent`, so updates never trigger React re-renders. The span
 * uses `tabular-nums` so digit width stays fixed and the value does not jitter
 * as it climbs.
 *
 * Color is inherited — the component never hardcodes one, so consumers control
 * it via `className` (e.g. `text-fg`, `text-success`) or a parent.
 *
 * SSR-safe & no flash: the first render already shows the formatted initial
 * value (never `0` or `NaN`), and the component starts *at* that value — it only
 * animates on subsequent `value` changes, not on mount.
 *
 * Reduced motion: when `prefers-reduced-motion` is set, the number snaps
 * directly to each new `value` (still fully formatted) with no tween.
 *
 * Accessibility: the high-frequency live text is not announced by default to
 * avoid noisy screen-reader chatter (it would read ~97 interpolated frames).
 * Pass `announce` to opt into a single, polite announcement of the *settled*
 * value via a dedicated visually-hidden `aria-live` sibling.
 */
export const AnimatedNumber = forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  (
    {
      value,
      format,
      locale,
      formatOptions,
      duration = 0.8,
      spring,
      reducedMotion = "user",
      announce = false,
      className,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    // Sanitize once: a non-finite/undefined `value` would (a) make
    // `motionValue.get() !== value` forever true (NaN !== NaN) — an
    // unsettleable spring that re-fires every frame — and (b) render literal
    // "NaN"/"∞", breaking the "never 0 or NaN" promise above.
    const safe = Number.isFinite(value) ? value : 0;
    const systemReducedMotion = useReducedMotion();
    const shouldReduceMotion =
      reducedMotion === "never" ? false : reducedMotion === "always" ? true : systemReducedMotion;
    const motionValue = useMotionValue(safe);
    const spanRef = useRef<HTMLSpanElement | null>(null);
    // The animated digits live in their own node so the per-frame textContent
    // writes never wipe the sibling `announce` region.
    const valueRef = useRef<HTMLSpanElement | null>(null);
    const announceRef = useRef<HTMLSpanElement | null>(null);

    // Format helper. The default Intl formatter is created lazily per call so
    // that prop changes (locale/options) are always reflected without effects.
    const formatRef = useRef<(n: number) => string>(() => "");
    formatRef.current = (n: number): string => {
      if (format) return format(n);
      return new Intl.NumberFormat(locale, formatOptions).format(n);
    };

    const setRefs = (node: HTMLSpanElement | null): void => {
      spanRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    // Memoize the transition on PRIMITIVE fields so an inline `spring={{...}}`
    // (a fresh object every parent render) does not re-run the animate effect,
    // stop()+restart the tween and reset its clock so it never settles. Keying
    // on the `spring` object identity is the exact churn this memo exists to
    // avoid, hence the suppression below.
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — keyed on spring's primitive fields, not its (unstable) object identity.
    const transition = useMemo(
      () => ({ ...ANIMATED_NUMBER_SPRING, ...spring, duration }),
      [spring?.bounce, spring?.stiffness, spring?.damping, spring?.mass, duration],
    );

    // Re-sync the React-committed text child to the LIVE motion value before
    // paint. The JSX child renders the *target* every commit; when a formatting
    // prop (locale/options) changes mid-tween React would win for one painted
    // frame and flash the final value. Overwrite it with the in-flight value.
    // No dependency array on purpose: it must run after every commit.
    useLayoutEffect(() => {
      if (valueRef.current) {
        valueRef.current.textContent = formatRef.current(motionValue.get());
      }
    });

    // Write the formatted current value straight to the DOM on every frame —
    // no React re-render per tick.
    useEffect(() => {
      const write = (n: number): void => {
        if (valueRef.current) {
          valueRef.current.textContent = formatRef.current(n);
        }
      };
      write(motionValue.get());
      const unsubscribe = motionValue.on("change", write);
      return unsubscribe;
    }, [motionValue]);

    // Animate toward each new target. On mount this is a no-op (motionValue
    // already equals the initial value). Reduced motion snaps with no tween.
    useEffect(() => {
      if (shouldReduceMotion) {
        motionValue.set(safe);
        if (announceRef.current) {
          announceRef.current.textContent = formatRef.current(safe);
        }
        return;
      }
      let controls: AnimationPlaybackControlsWithThen | undefined;
      if (motionValue.get() !== safe) {
        controls = animate(motionValue, safe, transition);
        // Announce only the settled value once the tween completes. Guard so a
        // stop()/unmount rejection does not write a stale value.
        controls
          .then(() => {
            if (announceRef.current) {
              announceRef.current.textContent = formatRef.current(safe);
            }
          })
          .catch(() => {});
      }
      return () => controls?.stop();
    }, [safe, transition, shouldReduceMotion, motionValue]);

    return (
      <motion.span
        ref={setRefs}
        data-slot="animated-number"
        className={cn("tabular-nums", className)}
        style={style}
        {...props}
      >
        {/* SSR + first paint: the initial formatted value lives in its OWN span
            so the per-frame writer overwrites only its textContent, never the
            sibling announce node. */}
        <span ref={valueRef}>{formatRef.current(safe)}</span>
        {/* Opt-in screen-reader channel. The per-frame writer NEVER touches this
            node — only the settled value is written to it, exactly once. */}
        {announce ? (
          <span ref={announceRef} className="sr-only" aria-live="polite" role="status" />
        ) : null}
      </motion.span>
    );
  },
);
AnimatedNumber.displayName = "AnimatedNumber";
