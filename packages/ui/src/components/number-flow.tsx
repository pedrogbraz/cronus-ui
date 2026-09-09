"use client";

import { cva } from "class-variance-authority";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { type ComponentPropsWithoutRef, type Ref, useEffect, useMemo, useRef } from "react";
import { cn } from "../lib/cn.js";

/**
 * Digit-roll spring — same curve as Skiper 69 / Motion Primitives SlidingNumber
 * (`stiffness: 280`, `damping: 18`, `mass: 0.3`). Keep byte-stable.
 */
const DIGIT_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 18,
  mass: 0.3,
};

export type NumberFlowFormat = "number" | "currency" | "percentage" | "decimal";

export type NumberFlowLocale =
  | "en-US"
  | "de-DE"
  | "fr-FR"
  | "es-ES"
  | "it-IT"
  | "ja-JP"
  | "ko-KR"
  | "zh-CN"
  | "zh-TW"
  | (string & {});

export const numberFlowVariants = cva("inline-flex items-center tabular-nums leading-none");

type FlowToken =
  | { kind: "digit"; key: string; digit: number }
  | { kind: "symbol"; key: string; value: string };

function resolveFormatOptions(
  format: NumberFlowFormat,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number,
): Intl.NumberFormatOptions {
  const min = minimumFractionDigits;
  let max = maximumFractionDigits;
  if (min !== undefined && max !== undefined && min > max) {
    max = min;
  }
  const fraction: Intl.NumberFormatOptions = {
    ...(min !== undefined ? { minimumFractionDigits: min } : {}),
    ...(max !== undefined ? { maximumFractionDigits: max } : {}),
  };

  switch (format) {
    case "currency":
      return { minimumFractionDigits: 2, maximumFractionDigits: 2, ...fraction };
    case "percentage":
      return { style: "percent", ...fraction };
    case "decimal":
      return { minimumFractionDigits: 2, maximumFractionDigits: 2, ...fraction };
    default:
      return fraction;
  }
}

function formatDisplay(
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions,
  prefix: string,
  suffix: string,
): string {
  return `${prefix}${new Intl.NumberFormat(locale, options).format(value)}${suffix}`;
}

function tokensFromValue(
  value: number,
  locale: string,
  options: Intl.NumberFormatOptions,
  prefix: string,
  suffix: string,
): FlowToken[] {
  const parts = new Intl.NumberFormat(locale, options).formatToParts(value);
  const integerDigits = parts
    .filter((part) => part.type === "integer")
    .map((part) => part.value)
    .join("");

  const tokens: FlowToken[] = [];
  if (prefix) tokens.push({ kind: "symbol", key: "prefix", value: prefix });

  let integerIndex = 0;
  let fractionIndex = 0;
  let symbolIndex = 0;

  for (const part of parts) {
    if (part.type === "integer") {
      for (const char of part.value) {
        const place = 10 ** (integerDigits.length - integerIndex - 1);
        tokens.push({ kind: "digit", key: `int-${place}`, digit: Number(char) });
        integerIndex += 1;
      }
      continue;
    }
    if (part.type === "fraction") {
      for (const char of part.value) {
        tokens.push({
          kind: "digit",
          key: `frac-${10 ** -(fractionIndex + 1)}`,
          digit: Number(char),
        });
        fractionIndex += 1;
      }
      continue;
    }
    tokens.push({
      kind: "symbol",
      key: `${part.type}-${symbolIndex}`,
      value: part.value,
    });
    symbolIndex += 1;
  }

  if (suffix) tokens.push({ kind: "symbol", key: "suffix", value: suffix });
  return tokens;
}

function advanceSpin(currentSpin: number, digit: number, trend: number): number {
  const currentDigit = ((currentSpin % 10) + 10) % 10;
  let diff = digit - currentDigit;
  if (trend > 0 && diff < 0) diff += 10;
  else if (trend < 0 && diff > 0) diff -= 10;
  else if (trend === 0) {
    if (diff > 5) diff -= 10;
    else if (diff < -5) diff += 10;
  }
  return currentSpin + diff;
}

/** Extra 9 at the start and 0 at the end so 0↔9 can roll one step past the edge. */
const DIGIT_STRIP = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

function DigitRoller({
  digit,
  trend,
  reducedMotion,
}: {
  digit: number;
  trend: number;
  reducedMotion: boolean;
}) {
  const spin = useRef(digit);
  const mv = useSpring(digit, DIGIT_SPRING);
  // `y` is a CSS transform; overflow:hidden does not clip transformed
  // descendants in this tree, so the strip is shifted with marginTop.
  const marginTop = useTransform(mv, (latest) => `${-(latest + 1)}em`);

  useEffect(() => {
    const next = advanceSpin(spin.current, digit, trend);
    if (next === spin.current) {
      if (reducedMotion) mv.jump(((digit % 10) + 10) % 10);
      return;
    }
    spin.current = next;
    if (reducedMotion) {
      const snapped = ((digit % 10) + 10) % 10;
      spin.current = snapped;
      mv.jump(snapped);
    } else {
      mv.set(next);
    }
  }, [digit, trend, reducedMotion, mv]);

  useEffect(() => {
    return mv.on("change", (value) => {
      if (value >= 10) {
        spin.current = value - 10;
        mv.jump(spin.current);
      } else if (value <= -1) {
        spin.current = value + 10;
        mv.jump(spin.current);
      }
    });
  }, [mv]);

  return (
    <span
      className="block h-[1em] w-[1ch] shrink-0 overflow-hidden leading-none"
      style={{ lineHeight: 1 }}
    >
      <motion.span className="flex flex-col" style={{ marginTop }}>
        {DIGIT_STRIP.map((glyph, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: strip copies 9 and 0 twice; position is identity.
            key={`strip-${index}-${glyph}`}
            className="block h-[1em] w-[1ch] overflow-hidden text-center leading-none"
          >
            {glyph}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export interface NumberFlowProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  ref?: Ref<HTMLSpanElement>;
  /** Number to display. Non-finite values render as `0`. */
  value: number;
  /** Text drawn before the formatted number. */
  prefix?: string;
  /** Text drawn after the formatted number. */
  suffix?: string;
  /**
   * How the number is formatted.
   * `currency` and `decimal` default to 2 fraction digits (the currency
   * symbol is `prefix`, not Intl). `percentage` uses `Intl` percent style
   * (pass `0.42` for 42%).
   * @default "number"
   */
  format?: NumberFlowFormat;
  /**
   * Locale passed to `Intl.NumberFormat`.
   * @default "en-US"
   */
  locale?: NumberFlowLocale;
  /** Minimum fraction digits. Overrides the format default when set. */
  minimumFractionDigits?: number;
  /** Maximum fraction digits. Overrides the format default when set. */
  maximumFractionDigits?: number;
  /**
   * How `prefers-reduced-motion` is honoured. Defaults to `"user"` (snap).
   * `"never"` always rolls digits — e.g. a showcase that must demonstrate it.
   */
  reducedMotion?: "user" | "always" | "never";
}

/**
 * Per-digit odometer for a formatted number. Each digit rolls the short way
 * in the overall value's trend (9 → 0 goes up one step when the number
 * increases). Prefix, suffix, grouping and fraction glyphs stay put.
 *
 * Distinct from {@link AnimatedNumber}, which tweens the *count* as a single
 * string. This is Skiper 69 / NumberFlow: the digits themselves slide.
 *
 * SSR-safe: the first paint already exposes the formatted value via
 * `aria-label` (never `0` / `NaN` unless the value is). Digits only roll on
 * subsequent `value` changes.
 */
export function NumberFlow({
  ref,
  value,
  prefix = "",
  suffix = "",
  format = "number",
  locale = "en-US",
  minimumFractionDigits,
  maximumFractionDigits,
  reducedMotion = "user",
  className,
  ...props
}: NumberFlowProps) {
  const safe = Number.isFinite(value) ? value : 0;
  const systemReducedMotion = useReducedMotion();
  const shouldReduceMotion =
    reducedMotion === "never" ? false : reducedMotion === "always" ? true : !!systemReducedMotion;

  const options = useMemo(
    () => resolveFormatOptions(format, minimumFractionDigits, maximumFractionDigits),
    [format, minimumFractionDigits, maximumFractionDigits],
  );

  const display = formatDisplay(safe, locale, options, prefix, suffix);
  const tokens = tokensFromValue(safe, locale, options, prefix, suffix);

  const prevValue = useRef(safe);
  const trend = Math.sign(safe - prevValue.current);
  prevValue.current = safe;

  return (
    <span
      {...props}
      ref={ref}
      role="img"
      aria-label={display}
      data-slot="number-flow"
      className={cn(numberFlowVariants(), className)}
    >
      {/* Numbers stay LTR even in RTL documents — digits and grouping must not reverse. */}
      <span
        aria-hidden="true"
        className="inline-flex items-center leading-none"
        dir="ltr"
        style={{ lineHeight: 1 }}
      >
        {tokens.map((token) =>
          token.kind === "digit" ? (
            <DigitRoller
              key={token.key}
              digit={token.digit}
              trend={trend}
              reducedMotion={shouldReduceMotion}
            />
          ) : (
            <span key={token.key} className="inline-block">
              {token.value}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
