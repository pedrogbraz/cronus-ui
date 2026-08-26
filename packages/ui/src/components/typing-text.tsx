"use client";

import { type HTMLAttributes, type Ref, useEffect, useState } from "react";
import { cn } from "../lib/cn.js";

export type TypingTextMotionPreference = "respect" | "always" | "never";

export interface TypingTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  ref?: Ref<HTMLSpanElement>;
  /**
   * Phrases to type. A single string is treated as one phrase. When more than
   * one is provided the component types, pauses, deletes, and moves on.
   */
  text: string | string[];
  /**
   * Milliseconds per typed character.
   * @default 50
   */
  typingSpeed?: number;
  /**
   * Milliseconds per deleted character.
   * @default 30
   */
  deletingSpeed?: number;
  /**
   * Milliseconds to rest on a finished phrase before deleting.
   * @default 1400
   */
  pause?: number;
  /**
   * Loop back to the first phrase after the last. Defaults to `true` when
   * more than one phrase is provided.
   */
  loop?: boolean;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"respect"` (show
   * the current phrase in full). `"always"` forces the typewriter;
   * `"never"` always shows the first phrase statically.
   * @default "respect"
   */
  reducedMotion?: TypingTextMotionPreference;
}

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
 * A typewriter that types one or more phrases with a blinking caret. The
 * accessible name is the current phrase (or the joined list, announced as a
 * status region only when it settles — we keep the live string on the
 * wrapper so AT reads the visible text). Reduced-motion visitors see the
 * first phrase in full with no caret blink.
 */
export function TypingText({
  ref,
  className,
  text,
  typingSpeed = 50,
  deletingSpeed = 30,
  pause = 1400,
  loop,
  reducedMotion = "respect",
  ...props
}: TypingTextProps) {
  const phrases = (Array.isArray(text) ? text : [text]).filter((phrase) => phrase.length > 0);
  const shouldLoop = loop ?? phrases.length > 1;
  const firstPhrase = phrases[0] ?? "";

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [glyphCount, setGlyphCount] = useState(() =>
    reducedMotion === "never" ? segmentGraphemes(firstPhrase).length : 0,
  );
  const [deleting, setDeleting] = useState(false);
  const [staticMode, setStaticMode] = useState(reducedMotion === "never");

  const phrase = phrases[phraseIndex] ?? firstPhrase;
  const glyphs = segmentGraphemes(phrase);

  useEffect(() => {
    const reduce =
      reducedMotion === "never"
        ? true
        : reducedMotion === "always"
          ? false
          : prefersReducedMotion();
    setStaticMode(reduce);
    if (reduce) {
      setGlyphCount(segmentGraphemes(firstPhrase).length);
      setPhraseIndex(0);
      setDeleting(false);
    }
  }, [firstPhrase, reducedMotion]);

  useEffect(() => {
    if (staticMode || phrases.length === 0) return;
    const typeMs = Math.max(8, finiteOr(typingSpeed, 50));
    const deleteMs = Math.max(8, finiteOr(deletingSpeed, 30));
    const pauseMs = Math.max(0, finiteOr(pause, 1400));

    if (!deleting && glyphCount === glyphs.length) {
      if (!shouldLoop && phraseIndex === phrases.length - 1) return;
      const timeout = window.setTimeout(() => setDeleting(true), pauseMs);
      return () => window.clearTimeout(timeout);
    }

    if (deleting && glyphCount === 0) {
      const next = (phraseIndex + 1) % phrases.length;
      const timeout = window.setTimeout(() => {
        setPhraseIndex(next);
        setDeleting(false);
      }, 80);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(
      () => setGlyphCount((count) => count + (deleting ? -1 : 1)),
      deleting ? deleteMs : typeMs,
    );
    return () => window.clearTimeout(timeout);
  }, [
    deleting,
    deletingSpeed,
    glyphCount,
    glyphs.length,
    pause,
    phraseIndex,
    phrases.length,
    shouldLoop,
    staticMode,
    typingSpeed,
  ]);

  const visible = glyphs.slice(0, glyphCount).join("");

  return (
    <span
      ref={ref}
      data-slot="typing-text"
      className={cn("inline whitespace-pre-wrap", className)}
      {...props}
    >
      {visible}
      {staticMode ? null : (
        <span
          aria-hidden="true"
          className="ms-px inline-block h-[1em] w-px translate-y-[0.1em] animate-pulse bg-fg align-baseline"
        />
      )}
    </span>
  );
}
TypingText.displayName = "TypingText";
