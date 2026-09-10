"use client";

import { cva } from "class-variance-authority";
import { type AnimationOptions, motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function splitIntoCharacters(value: string): string[] {
  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(value), ({ segment }) => segment);
  }
  return Array.from(value);
}

/** Spell's default tween — keep the curve and duration byte-stable. */
const DEFAULT_TRANSITION: AnimationOptions = {
  type: "tween",
  ease: [0.625, 0.05, 0, 1],
  duration: 0.5,
};

export type SlideUpTextSplit = "words" | "characters" | "lines";
export type SlideUpTextFrom = "first" | "last" | "center";

export interface SlideUpTextRef {
  startAnimation: () => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

export const slideUpTextVariants = cva("flex flex-wrap whitespace-pre-wrap", {
  variants: {
    split: {
      words: "",
      characters: "",
      lines: "flex-col",
    },
  },
  defaultVariants: { split: "words" },
});

export interface SlideUpTextProps
  extends Omit<
    ComponentPropsWithoutRef<"span">,
    | "children"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
  > {
  ref?: Ref<HTMLSpanElement>;
  /** Imperative start / reset handle (Spell's `ref`). */
  animationRef?: Ref<SlideUpTextRef>;
  /** The phrase to reveal. Must be a plain string so it can be split. */
  children: string;
  /**
   * How the string is broken before staggering.
   * @default "words"
   */
  split?: SlideUpTextSplit;
  /**
   * Delay (seconds) before the first unit animates.
   * @default 0
   */
  delay?: number;
  /**
   * Gap (seconds) between consecutive units.
   * @default 0.1
   */
  stagger?: number;
  /**
   * Which end of the string the stagger starts from.
   * @default "first"
   */
  from?: SlideUpTextFrom;
  /** Motion transition for each unit. Defaults to Spell's 0.5s tween. */
  transition?: AnimationOptions;
  /** Extra classes on each word (or line) clip. */
  wordClass?: string;
  /** Extra classes on each character clip. */
  charClass?: string;
  /**
   * Play on mount when `inView` is false.
   * @default true
   */
  autoStart?: boolean;
  /** Called when the reveal starts. */
  onStart?: () => void;
  /** Called when the last unit finishes. */
  onComplete?: () => void;
  /**
   * Start when the node enters the viewport instead of on mount.
   * @default false
   */
  inView?: boolean;
  /**
   * When `inView` is true, play only the first time it enters.
   * @default true
   */
  once?: boolean;
}

export function SlideUpText({
  ref,
  animationRef,
  children,
  split = "words",
  delay = 0,
  stagger = 0.1,
  from = "first",
  transition = DEFAULT_TRANSITION,
  className,
  wordClass,
  charClass,
  autoStart = true,
  onStart,
  onComplete,
  inView = false,
  once = true,
  ...props
}: SlideUpTextProps) {
  const text = children;
  const reduceMotion = !!useReducedMotion();
  const [isAnimating, setIsAnimating] = useState(false);

  const words = useMemo((): WordObject[] => {
    if (split === "characters") {
      const parts = text.split(" ");
      return parts.map((word, index) => ({
        characters: splitIntoCharacters(word),
        needsSpace: index !== parts.length - 1,
      }));
    }
    const parts = split === "words" ? text.split(" ") : text.split("\n");
    return parts.map((part, index, array) => ({
      characters: [part],
      needsSpace: split === "words" && index !== array.length - 1,
    }));
  }, [text, split]);

  const getStaggerDelay = useCallback(
    (index: number) => {
      const total =
        split === "characters"
          ? words.reduce((sum, word) => sum + word.characters.length + (word.needsSpace ? 1 : 0), 0)
          : words.length;

      if (from === "last") return (total - 1 - index) * stagger;
      if (from === "center") {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * stagger;
      }
      return index * stagger;
    },
    [words, from, stagger, split],
  );

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    onStart?.();
  }, [onStart]);

  useImperativeHandle(animationRef, () => ({
    startAnimation,
    reset: () => setIsAnimating(false),
  }));

  useEffect(() => {
    if (autoStart && !inView) {
      startAnimation();
    }
  }, [autoStart, inView, startAnimation]);

  const variants = {
    hidden: { y: reduceMotion ? 0 : "100%" },
    visible: (index: number) => ({
      y: 0,
      transition: reduceMotion
        ? { duration: 0, delay: 0 }
        : {
            ...transition,
            delay:
              delay +
              (typeof transition.delay === "number" ? transition.delay : 0) +
              getStaggerDelay(index),
          },
    }),
  };

  return (
    <motion.span
      ref={ref}
      data-slot="slide-up-text"
      className={cn(className, slideUpTextVariants({ split }))}
      initial={reduceMotion ? false : "hidden"}
      whileInView={inView ? "visible" : undefined}
      animate={inView ? undefined : isAnimating ? "visible" : "hidden"}
      viewport={{ once }}
      onAnimationStart={() => {
        if (inView) {
          setIsAnimating(true);
          onStart?.();
        }
      }}
      {...props}
    >
      <span className="sr-only">{text}</span>

      {words.map((word, wordIndex, array) => {
        const unitKey = `unit-${wordIndex}`;
        const previousCharsCount = array
          .slice(0, wordIndex)
          .reduce((sum, item) => sum + item.characters.length, 0);
        const isLastWord = wordIndex === array.length - 1;

        return (
          <span
            key={unitKey}
            aria-hidden="true"
            className={cn("inline-flex overflow-hidden", wordClass)}
          >
            {word.characters.map((char, charIndex) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: split text pieces are positional and stable within their word.
                key={`${unitKey}-piece-${charIndex}`}
                className={cn(charClass, "relative overflow-hidden whitespace-pre-wrap")}
              >
                <motion.span
                  custom={previousCharsCount + charIndex}
                  initial={reduceMotion ? false : "hidden"}
                  animate={isAnimating ? "visible" : "hidden"}
                  variants={variants}
                  onAnimationComplete={
                    isLastWord && charIndex === word.characters.length - 1 ? onComplete : undefined
                  }
                  className="inline-block"
                >
                  {char}
                </motion.span>
              </span>
            ))}
            {word.needsSpace ? (
              <span className="relative overflow-hidden">
                <motion.span
                  custom={previousCharsCount + word.characters.length}
                  initial={reduceMotion ? false : "hidden"}
                  animate={isAnimating ? "visible" : "hidden"}
                  variants={variants}
                  className="inline-block"
                >
                  {" "}
                </motion.span>
              </span>
            ) : null}
          </span>
        );
      })}
    </motion.span>
  );
}
