"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { SlideUpText } from "./slide-up-text.js";

/** Cronus motion curve — the only easing the system uses. */
const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE_UP_DURATION_MS = 500;
const SLIDE_UP_STAGGER_MS = 100;
/** Read pause after the line has fully clipped in. */
const FIRST_DELAY_MS = 500;
const STEP_DELAY_MS = 500;
const LAST_HOLD_MS = 800;
/** Copy dissolves; mark scales in on the same center. */
const TEXT_EXIT_S = 0.32;
const END_ENTER_S = 0.48;
const END_ENTER_MS = 480;
const BULGE = 300;

function revealDurationMs(line: string) {
  const units = line.split(" ").filter(Boolean).length;
  return SLIDE_UP_DURATION_MS + Math.max(0, units - 1) * SLIDE_UP_STAGGER_MS;
}

export const DEFAULT_PRELOADER_WORDS = [
  "The innovation of interfaces.",
  "One system. The whole product follows.",
] as const;

export const wordsPreloaderVariants = cva(
  "flex items-center justify-center overflow-visible bg-surface-raised text-fg",
  {
    variants: {
      layout: {
        page: "fixed inset-0 z-[60]",
        contained: "absolute inset-0 z-50",
      },
    },
    defaultVariants: { layout: "page" },
  },
);

export interface WordsPreloaderLabels {
  /** Accessible name for the loading status. */
  status: string;
}

export interface WordsPreloaderProps
  extends Omit<
      ComponentPropsWithoutRef<"div">,
      "children" | "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
    >,
    VariantProps<typeof wordsPreloaderVariants> {
  ref?: Ref<HTMLDivElement>;
  /** Lines cycled before the curve exits. Product lines by default. */
  words?: readonly string[];
  /** Hold after the first line has revealed, in ms. */
  firstDelayMs?: number;
  /** Hold after each following line has revealed, in ms. */
  stepDelayMs?: number;
  /** Extra hold on the last beat before `onComplete`, in ms. */
  lastHoldMs?: number;
  /** Optional last beat — typically a brand mark — after the copy. */
  end?: ReactNode;
  /** Fired after the last beat has been held. Unmount inside `AnimatePresence`. */
  onComplete?: () => void;
  labels?: Partial<WordsPreloaderLabels>;
}

const DEFAULT_LABELS: WordsPreloaderLabels = {
  status: "Loading",
};

/**
 * Words preloader. Full-viewport `surface-raised` panel — a step above the
 * page canvas — English product lines via `SlideUpText`, optional last-beat
 * mark, then a curved lip that flattens as the panel slides up. Parent
 * unmounts it inside `AnimatePresence` after `onComplete` so the exit can play.
 */
export function WordsPreloader({
  ref,
  className,
  layout = "page",
  words: wordsProp,
  firstDelayMs = FIRST_DELAY_MS,
  stepDelayMs = STEP_DELAY_MS,
  lastHoldMs = LAST_HOLD_MS,
  end,
  onComplete,
  labels: labelsProp,
  ...props
}: WordsPreloaderProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const words = wordsProp && wordsProp.length > 0 ? wordsProp : DEFAULT_PRELOADER_WORDS;
  const reduceMotion = useReducedMotion() === true;
  const hostRef = useRef<HTMLDivElement | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const hasEnd = end != null;
  const last = hasEnd ? words.length : Math.max(0, words.length - 1);
  const showingEnd = hasEnd && index >= words.length;
  const current = words[index] ?? words[0] ?? "";

  useLayoutEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (layout !== "page") return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [layout]);

  useEffect(() => {
    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onCompleteRef.current?.();
    };

    if (reduceMotion) {
      setIndex(last);
      finish();
      return;
    }
    if (showingEnd) {
      const timer = window.setTimeout(finish, END_ENTER_MS + lastHoldMs);
      return () => window.clearTimeout(timer);
    }
    const hold = index < last ? (index === 0 ? firstDelayMs : stepDelayMs) : lastHoldMs;
    const timer = window.setTimeout(() => {
      if (index < last) {
        setIndex((next) => next + 1);
        return;
      }
      finish();
    }, revealDurationMs(current) + hold);
    return () => window.clearTimeout(timer);
  }, [current, firstDelayMs, index, last, lastHoldMs, reduceMotion, showingEnd, stepDelayMs]);

  const width = size.width;
  const height = size.height;
  const ready = width > 0 && height > 0;
  const bulge = layout === "contained" ? Math.min(BULGE, Math.max(96, height * 0.28)) : BULGE;
  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + bulge} 0 ${height} L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`;
  const textClass =
    "max-w-5xl justify-center text-center font-display text-4xl leading-[1.08] tracking-[-0.025em] text-fg text-balance sm:text-5xl sm:tracking-[-0.03em] lg:text-6xl";

  return (
    <motion.div
      ref={(node) => {
        hostRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="words-preloader"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={labels.status}
      className={cn(wordsPreloaderVariants({ layout }), className)}
      initial={{ y: 0 }}
      exit={
        reduceMotion
          ? { opacity: 0, transition: { duration: 0.01 } }
          : {
              y: "-100%",
              transition: { duration: 0.8, ease: EASE, delay: 0.12 },
            }
      }
      {...props}
    >
      <div className="relative z-10 grid w-full place-items-center px-6">
        <AnimatePresence initial={false}>
          {showingEnd ? (
            <motion.div
              key="end"
              className="col-start-1 row-start-1 flex items-center justify-center"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0.01 : END_ENTER_S, ease: EASE }}
            >
              {end}
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              className="col-start-1 row-start-1 flex items-center justify-center"
              initial={false}
              exit={
                reduceMotion
                  ? { opacity: 0, transition: { duration: 0.01 } }
                  : {
                      opacity: 0,
                      filter: "blur(8px)",
                      transition: { duration: TEXT_EXIT_S, ease: EASE },
                    }
              }
            >
              {reduceMotion ? (
                <p className={textClass}>{current}</p>
              ) : (
                <SlideUpText key={current} className={textClass}>
                  {current}
                </SlideUpText>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {ready ? (
        <svg
          className="pointer-events-none absolute inset-x-0 top-0 w-full fill-surface-raised"
          style={{ height: `calc(100% + ${bulge}px)` }}
          aria-hidden="true"
        >
          <motion.path
            initial={{ d: initialPath }}
            exit={
              reduceMotion
                ? { d: targetPath, transition: { duration: 0.01 } }
                : {
                    d: targetPath,
                    transition: { duration: 0.7, ease: EASE, delay: 0.18 },
                  }
            }
          />
        </svg>
      ) : null}
    </motion.div>
  );
}
