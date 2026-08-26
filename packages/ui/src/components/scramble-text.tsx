"use client";

import { type HTMLAttributes, type Ref, useEffect, useMemo, useState } from "react";
import { cn } from "../lib/cn.js";

export type ScrambleTextMotionPreference = "respect" | "always" | "never";

export interface ScrambleTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  ref?: Ref<HTMLSpanElement>;
  /** The phrase to resolve to. */
  children: string;
  /**
   * Milliseconds between scramble ticks.
   * @default 40
   */
  speed?: number;
  /**
   * How many ticks each glyph stays scrambled before locking.
   * @default 4
   */
  ticksPerGlyph?: number;
  /**
   * Glyphs used while scrambling. Defaults to a Latin + digit set.
   */
  charset?: string;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"respect"` (show
   * the resolved phrase immediately).
   * @default "respect"
   */
  reducedMotion?: ScrambleTextMotionPreference;
}

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function segmentGraphemes(value: string): string[] {
  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(value), (segment) => segment.segment);
  }
  return Array.from(value);
}

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Resolves a phrase by cycling random glyphs from the start of the string, until the real
 * string locks in — the "decryption" beat on a hero or terminal. Assistive
 * tech is given the resolved string immediately via an `sr-only` copy; the
 * scrambling glyphs are `aria-hidden`. Reduced-motion visitors skip the
 * scramble entirely.
 */
export function ScrambleText({
  ref,
  className,
  children,
  speed = 40,
  ticksPerGlyph = 4,
  charset = DEFAULT_CHARSET,
  reducedMotion = "respect",
  ...props
}: ScrambleTextProps) {
  const glyphs = useMemo(() => segmentGraphemes(children), [children]);
  const pool = charset.length > 0 ? charset : DEFAULT_CHARSET;
  const [locked, setLocked] = useState(() => (reducedMotion === "never" ? glyphs.length : 0));
  const [tick, setTick] = useState(0);
  const [staticMode, setStaticMode] = useState(reducedMotion === "never");

  useEffect(() => {
    const reduce =
      reducedMotion === "never"
        ? true
        : reducedMotion === "always"
          ? false
          : prefersReducedMotion();
    setStaticMode(reduce);
    setLocked(reduce ? glyphs.length : 0);
    setTick(0);
  }, [glyphs.length, reducedMotion]);

  useEffect(() => {
    if (staticMode || glyphs.length === 0) return;
    const ms = Math.max(12, finiteOr(speed, 40));
    const per = Math.max(1, Math.round(finiteOr(ticksPerGlyph, 4)));
    let lockedCount = 0;
    let tickCount = 0;
    let timeout = 0;
    const step = () => {
      if (lockedCount >= glyphs.length) return;
      tickCount += 1;
      if (tickCount % per === 0) {
        lockedCount = Math.min(glyphs.length, lockedCount + 1);
        setLocked(lockedCount);
      }
      setTick(tickCount);
      timeout = window.setTimeout(step, ms);
    };
    timeout = window.setTimeout(step, ms);
    return () => window.clearTimeout(timeout);
  }, [glyphs.length, speed, staticMode, ticksPerGlyph]);

  const display = glyphs
    .map((glyph, index) => {
      if (index < locked || /^\s+$/.test(glyph)) return glyph;
      return pool[(index * 17 + tick * 31) % pool.length] ?? glyph;
    })
    .join("");

  return (
    <span
      ref={ref}
      data-slot="scramble-text"
      className={cn("inline font-mono", className)}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">{staticMode ? children : display}</span>
    </span>
  );
}
ScrambleText.displayName = "ScrambleText";
