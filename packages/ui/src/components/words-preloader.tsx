"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/**
 * Skiper 8 / Dennis Snellenberg / Olivier Larose — cubic for the panel
 * slide and the SVG bulge flatten. Not a spring.
 */
const EASE = [0.76, 0, 0.24, 1] as const;
const FIRST_DELAY_MS = 1000;
const STEP_DELAY_MS = 150;
const BULGE = 300;

export const DEFAULT_PRELOADER_WORDS = [
  "Hello",
  "Bonjour",
  "Ciao",
  "Olà",
  "やあ",
  "Hallå",
  "Guten tag",
  "Hallo",
  "안녕하세요",
  "नमस्ते",
  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ",
] as const;

export const wordsPreloaderVariants = cva(
  "z-50 flex items-center justify-center overflow-visible bg-white", // contract-ok: Skiper 8 panel the component paints, over the page
  {
    variants: {
      layout: {
        page: "fixed inset-0",
        contained: "absolute inset-0",
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
  /** Greetings cycled before the curve exits. Defaults to the Skiper 8 set. */
  words?: readonly string[];
  /** Hold on the first word, in ms. Original is 1000. */
  firstDelayMs?: number;
  /** Hold on each following word, in ms. Original is 150. */
  stepDelayMs?: number;
  labels?: Partial<WordsPreloaderLabels>;
}

const DEFAULT_LABELS: WordsPreloaderLabels = {
  status: "Loading",
};

/**
 * Words preloader (Skiper 8). Full-viewport white panel over the page, a dark
 * greeting that steps through languages, then a curved SVG lip that flattens
 * as the whole panel translates up. Parent unmounts it (typically after 2500ms)
 * inside `AnimatePresence` so the exit can play.
 */
export function WordsPreloader({
  ref,
  className,
  layout = "page",
  words = DEFAULT_PRELOADER_WORDS,
  firstDelayMs = FIRST_DELAY_MS,
  stepDelayMs = STEP_DELAY_MS,
  labels: labelsProp,
  ...props
}: WordsPreloaderProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const reduceMotion = useReducedMotion();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const last = Math.max(0, words.length - 1);

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
    if (reduceMotion) {
      setIndex(last);
      return;
    }
    if (index >= last) return;
    const delay = index === 0 ? firstDelayMs : stepDelayMs;
    const timer = window.setTimeout(() => setIndex((current) => current + 1), delay);
    return () => window.clearTimeout(timer);
  }, [firstDelayMs, index, last, reduceMotion, stepDelayMs]);

  const width = size.width;
  const height = size.height;
  const ready = width > 0 && height > 0;
  const bulge = layout === "contained" ? Math.min(BULGE, Math.max(96, height * 0.28)) : BULGE;
  const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height + bulge} 0 ${height} L0 0`;
  const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width / 2} ${height} 0 ${height} L0 0`;

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
              transition: { duration: 0.8, ease: EASE, delay: 0.2 },
            }
      }
      {...props}
    >
      {ready ? (
        <>
          <motion.p
            className="relative z-10 flex items-center text-[42px] leading-none text-black"
            // contract-ok: Skiper 8 greeting on the painted white panel
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 0.75, transition: { duration: 1, delay: 0.2 } }}
          >
            <span
              className="me-2.5 inline-block size-2.5 shrink-0 rounded-full bg-black"
              aria-hidden="true"
            />
            {words[index] ?? words[0]}
          </motion.p>
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 w-full"
            style={{ height: `calc(100% + ${bulge}px)` }}
            aria-hidden="true"
          >
            <motion.path
              fill="#ffffff" // contract-ok: Skiper 8 white lip the SVG paints
              initial={{ d: initialPath }}
              exit={
                reduceMotion
                  ? { d: targetPath, transition: { duration: 0.01 } }
                  : {
                      d: targetPath,
                      transition: { duration: 0.7, ease: EASE, delay: 0.3 },
                    }
              }
            />
          </svg>
        </>
      ) : null}
    </motion.div>
  );
}
