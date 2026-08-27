"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type HTMLAttributes, type Ref, useEffect, useState } from "react";
import { cn } from "../lib/cn.js";

export interface WordRotateProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  ref?: Ref<HTMLSpanElement>;
  /** Phrases to cycle through. */
  words: string[];
  /**
   * Milliseconds each word stays on screen.
   * @default 2200
   */
  interval?: number;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"user"` (cross-fade
   * becomes a cut). `"never"` always animates; `"always"` always cuts.
   * @default "user"
   */
  reducedMotion?: "user" | "always" | "never";
  /**
   * When true (default), the box stays as wide as the longest word so the
   * line does not reflow. Set false when an underline or similar chrome
   * should track the visible word.
   * @default true
   */
  lockWidth?: boolean;
  /**
   * When false, skip the polite live region — use inside a heading so
   * assistive tech is not re-announced every interval.
   * @default true
   */
  announce?: boolean;
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Cycles through a list of words with a vertical swap. Assistive tech is
 * pointed at a polite live region so the current word is announced when it
 * changes. Reduced-motion visitors get an instant cut instead of the slide.
 */
export function WordRotate({
  ref,
  className,
  words,
  interval = 2200,
  reducedMotion = "user",
  lockWidth = true,
  announce = true,
  ...props
}: WordRotateProps) {
  const systemReduced = useReducedMotion();
  const reduce =
    reducedMotion === "never" ? false : reducedMotion === "always" ? true : !!systemReduced;
  const list = words.filter((word) => word.length > 0);
  const [index, setIndex] = useState(0);
  const current = list[index] ?? list[0] ?? "";

  useEffect(() => {
    if (list.length < 2) return;
    const ms = Math.max(400, finiteOr(interval, 2200));
    const timeout = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, ms);
    return () => window.clearInterval(timeout);
  }, [interval, list.length]);

  return (
    <span
      ref={ref}
      data-slot="word-rotate"
      className={cn(
        "relative h-[1.2em] overflow-hidden align-baseline",
        lockWidth ? "inline-grid" : "inline-flex",
        className,
      )}
      {...props}
    >
      {announce ? (
        <span className="sr-only" aria-live="polite">
          {current}
        </span>
      ) : (
        <span className="sr-only">{current}</span>
      )}
      {lockWidth
        ? list.map((word, i) => (
            <span
              key={`${word}-${String(i)}`}
              aria-hidden="true"
              data-word-rotate-sizer=""
              className="invisible col-start-1 row-start-1 whitespace-nowrap"
            >
              {word}
            </span>
          ))
        : null}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current + String(index)}
          aria-hidden="true"
          className="col-start-1 row-start-1 inline-block whitespace-nowrap justify-self-start"
          initial={reduce ? false : { y: "40%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduce ? { opacity: 1 } : { y: "-40%", opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
WordRotate.displayName = "WordRotate";
