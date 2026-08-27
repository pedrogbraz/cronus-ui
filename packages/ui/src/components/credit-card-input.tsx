"use client";

import { Check, CreditCard } from "lucide-react";
import {
  type ChangeEvent,
  forwardRef,
  type HTMLAttributes,
  type MouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/**
 * A single, unified card-entry field group — card number (auto-spaced with live
 * brand detection from the IIN/prefix), expiry (MM/YY auto-slash), and CVC
 * (3–4 digits depending on brand). Values are validated with the Luhn algorithm,
 * a not-in-the-past expiry check, and a brand-correct CVC length, then surfaced
 * through a single `onChange({ number, expiry, cvc, brand, complete, valid })`.
 *
 * Behaviour:
 * - Brand is detected as the user types and rendered as a monochrome glyph; the
 *   detected brand is announced to assistive tech via a polite live region.
 * - Focus auto-advances number → expiry → CVC once each field is complete/valid.
 * - CVC is clamped to the brand's length when the brand narrows (Amex → Visa).
 *
 * Performance / a11y:
 * - Brand detection and validation are pure and memoised; no timers, intervals,
 *   or RAF are used, so there is nothing to leak on unmount.
 * - The group is labelled; each field carries its own `aria-label`, and the
 *   valid-state check icon transition is disabled under `prefers-reduced-motion`.
 *
 * @remarks SECURITY: this is a **display-side formatter/validator only** — it is
 * NOT a PCI vault. It never stores, logs, autofill-persists, or transmits the
 * PAN/CVC. Autocomplete is disabled and no `name` attributes are emitted. Send
 * card data straight to a compliant tokenizer (e.g. a payment iframe/SDK); do
 * not read it back out of `onChange` into your own persistence or telemetry.
 */

/** A payment network detected from the card's IIN/prefix. */
export type CardBrand = "visa" | "mastercard" | "amex" | "elo" | "discover" | "unknown";

/** The parsed, validated snapshot emitted by {@link CreditCardInput} `onChange`. */
export interface CreditCardValue {
  /** Digits only, no spaces (the raw PAN — treat as sensitive). */
  number: string;
  /** Expiry formatted as `MM/YY` (or a partial as typed). */
  expiry: string;
  /** The security code digits. */
  cvc: string;
  /** Payment network inferred from the prefix, or `"unknown"`. */
  brand: CardBrand;
  /** All three fields have a plausible, complete length for the brand. */
  complete: boolean;
  /** Passes Luhn + non-past expiry + brand-correct CVC length. */
  valid: boolean;
}

interface CardType {
  brand: CardBrand;
  label: string;
  pattern: RegExp;
  lengths: number[];
  cvc: number[];
  gaps: number[];
}

// Order matters — the first matching pattern wins. Elo (Brazilian) borrows ranges
// from Visa/Discover, so it must be tested before them.
const CARD_TYPES: CardType[] = [
  {
    brand: "elo",
    label: "Elo",
    pattern: /^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|651|655)/,
    lengths: [16],
    cvc: [3],
    gaps: [4, 8, 12],
  },
  {
    brand: "amex",
    label: "American Express",
    pattern: /^3[47]/,
    lengths: [15],
    cvc: [4],
    gaps: [4, 10],
  },
  {
    brand: "mastercard",
    label: "Mastercard",
    pattern: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/,
    lengths: [16],
    cvc: [3],
    gaps: [4, 8, 12],
  },
  {
    brand: "visa",
    label: "Visa",
    pattern: /^4/,
    lengths: [16, 19],
    cvc: [3],
    gaps: [4, 8, 12],
  },
  {
    brand: "discover",
    label: "Discover",
    pattern: /^(6011|64[4-9]|65|622)/,
    lengths: [16, 19],
    cvc: [3],
    gaps: [4, 8, 12],
  },
];

const UNKNOWN_CARD: CardType = {
  brand: "unknown",
  label: "Card",
  pattern: /.*/,
  lengths: [16, 19],
  cvc: [3, 4],
  gaps: [4, 8, 12],
};

function getCardType(digits: string): CardType {
  if (!digits) return UNKNOWN_CARD;
  for (const type of CARD_TYPES) {
    if (type.pattern.test(digits)) return type;
  }
  return UNKNOWN_CARD;
}

/** Standard Luhn checksum over a digit string. */
function luhnValid(digits: string): boolean {
  if (digits.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

function formatNumber(digits: string, gaps: number[]): string {
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && gaps.includes(i)) out += " ";
    out += digits[i];
  }
  return out;
}

function formatExpiry(digits: string): string {
  if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  return digits;
}

/** True when a 4-digit `MMYY` string is a real month and not in the past. */
function expiryNotPast(digits: string): boolean {
  if (digits.length !== 4) return false;
  const mm = Number(digits.slice(0, 2));
  const yy = Number(digits.slice(2, 4));
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;
  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;
  return true;
}

function BrandGlyph({ brand }: { brand: CardBrand }) {
  const box =
    "h-5 w-8 shrink-0 text-fg-secondary transition-opacity duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none";
  switch (brand) {
    case "visa":
      return (
        <svg viewBox="0 0 32 20" aria-hidden="true" className={cn(box, "font-display")}>
          <text
            x="16"
            y="15"
            textAnchor="middle"
            fontSize="10"
            fontStyle="italic"
            fontWeight="800"
            letterSpacing="0.4"
            fill="currentColor"
          >
            VISA
          </text>
        </svg>
      );
    case "mastercard":
      return (
        <svg viewBox="0 0 32 20" aria-hidden="true" className={box}>
          <circle cx="12" cy="10" r="6.5" fill="currentColor" opacity="0.9" />
          <circle cx="20" cy="10" r="6.5" fill="currentColor" opacity="0.45" />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 32 20" aria-hidden="true" className={cn(box, "font-display")}>
          <text
            x="16"
            y="14"
            textAnchor="middle"
            fontSize="8"
            fontWeight="800"
            letterSpacing="0.3"
            fill="currentColor"
          >
            AMEX
          </text>
        </svg>
      );
    case "elo":
      return (
        <svg viewBox="0 0 32 20" aria-hidden="true" className={cn(box, "font-display")}>
          <text
            x="16"
            y="15"
            textAnchor="middle"
            fontSize="11"
            fontWeight="800"
            letterSpacing="0.2"
            fill="currentColor"
          >
            elo
          </text>
        </svg>
      );
    case "discover":
      return (
        <svg viewBox="0 0 32 20" aria-hidden="true" className={cn(box, "font-display")}>
          <text x="12" y="14" textAnchor="middle" fontSize="8" fontWeight="800" fill="currentColor">
            DISC
          </text>
          <circle cx="26" cy="10" r="3.2" fill="currentColor" />
        </svg>
      );
    default:
      return <CreditCard aria-hidden className={cn(box, "p-0.5")} />;
  }
}

export interface CreditCardInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Accessible group label announced to assistive tech. @default "Credit card" */
  label?: string;
  /** Uncontrolled initial card number (digits or already-spaced). */
  defaultNumber?: string;
  /**
   * Fires on every keystroke with the parsed, validated card value.
   * Display-side only — do not persist, log, or transmit the raw PAN/CVC.
   */
  onChange?: (value: CreditCardValue) => void;
  /** Forces the invalid styling and sets `aria-invalid` on every field. */
  invalid?: boolean;
  /** Disables all three fields. */
  disabled?: boolean;
  /** Optional error message rendered under the group with `role="alert"`. */
  error?: string;
}

export const CreditCardInput = forwardRef<HTMLDivElement, CreditCardInputProps>(
  (
    {
      className,
      label = "Credit card",
      defaultNumber,
      onChange,
      invalid = false,
      disabled = false,
      error,
      ...props
    },
    ref,
  ) => {
    const [numberDigits, setNumberDigits] = useState(() =>
      (defaultNumber ?? "").replace(/\D/g, "").slice(0, 19),
    );
    const [expiryDigits, setExpiryDigits] = useState("");
    const [cvcDigits, setCvcDigits] = useState("");

    const expiryInputRef = useRef<HTMLInputElement>(null);
    const cvcInputRef = useRef<HTMLInputElement>(null);
    const numberInputRef = useRef<HTMLInputElement>(null);
    const prevExpiry = useRef("");
    const onChangeRef = useRef(onChange);
    useEffect(() => {
      onChangeRef.current = onChange;
    });

    const errorId = useId();
    const isInvalid = invalid || Boolean(error);

    const cardType = useMemo(() => getCardType(numberDigits), [numberDigits]);
    const maxCvc = Math.max(...cardType.cvc);

    // Narrow the CVC to the brand's length when the brand changes (e.g. Amex→Visa).
    useEffect(() => {
      setCvcDigits((c) => (c.length > maxCvc ? c.slice(0, maxCvc) : c));
    }, [maxCvc]);

    const value = useMemo<CreditCardValue>(() => {
      const numberComplete = cardType.lengths.includes(numberDigits.length);
      const cvcComplete = cardType.cvc.includes(cvcDigits.length);
      const expiryComplete = expiryDigits.length === 4;
      const complete = numberComplete && cvcComplete && expiryComplete;
      const valid =
        complete && luhnValid(numberDigits) && expiryNotPast(expiryDigits) && cvcComplete;
      return {
        number: numberDigits,
        expiry: formatExpiry(expiryDigits),
        cvc: cvcDigits,
        brand: cardType.brand,
        complete,
        valid,
      };
    }, [numberDigits, expiryDigits, cvcDigits, cardType]);

    useEffect(() => {
      onChangeRef.current?.(value);
    }, [value]);

    const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
      let digits = event.target.value.replace(/\D/g, "");
      const type = getCardType(digits);
      digits = digits.slice(0, Math.max(...type.lengths));
      setNumberDigits(digits);
      if (type.lengths.includes(digits.length) && luhnValid(digits)) {
        expiryInputRef.current?.focus();
      }
    };

    const handleExpiryChange = (event: ChangeEvent<HTMLInputElement>) => {
      let raw = event.target.value;
      // Break the auto-slash backspace trap: if the previously rendered value ended
      // in "/" and the user deleted a char landing on the month, drop a month digit
      // instead of re-inserting the separator.
      if (prevExpiry.current.endsWith("/") && raw === prevExpiry.current.slice(0, -1)) {
        raw = raw.slice(0, -1);
      }
      let digits = raw.replace(/\D/g, "").slice(0, 4);
      if (digits.length === 1 && Number(digits) > 1) digits = `0${digits}`;
      prevExpiry.current = formatExpiry(digits);
      setExpiryDigits(digits);
      if (expiryNotPast(digits)) {
        cvcInputRef.current?.focus();
      }
    };

    const handleCvcChange = (event: ChangeEvent<HTMLInputElement>) => {
      setCvcDigits(event.target.value.replace(/\D/g, "").slice(0, maxCvc));
    };

    const focusNumberOnPadding = (event: MouseEvent<HTMLFieldSetElement>) => {
      if (event.target === event.currentTarget) {
        event.preventDefault();
        numberInputRef.current?.focus();
      }
    };

    const fieldClass =
      "bg-transparent tabular-nums text-fg outline-none placeholder:text-fg-tertiary disabled:cursor-not-allowed";
    const brandAnnounce = cardType.brand === "unknown" ? "" : `${cardType.label} card`;

    return (
      <div
        ref={ref}
        data-slot="credit-card-input"
        className={cn("flex w-full flex-col gap-1.5", className)}
        {...props}
      >
        <fieldset
          disabled={disabled}
          data-invalid={isInvalid || undefined}
          data-brand={cardType.brand}
          onMouseDown={disabled ? undefined : focusNumberOnPadding}
          className={cn(
            "m-0 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-surface-inset px-3.5 py-2.5 text-sm text-fg shadow-xs",
            "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)]",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-base",
            "data-[invalid=true]:border-error data-[invalid=true]:focus-within:ring-error/30",
            "disabled:opacity-60",
          )}
        >
          <legend className="sr-only">{label}</legend>
          <span className="sr-only" aria-live="polite">
            {brandAnnounce}
          </span>
          <BrandGlyph brand={cardType.brand} />
          <input
            ref={numberInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Card number"
            aria-invalid={isInvalid || undefined}
            aria-describedby={error ? errorId : undefined}
            placeholder={cardType.brand === "amex" ? "0000 000000 00000" : "0000 0000 0000 0000"}
            value={formatNumber(numberDigits, cardType.gaps)}
            onChange={handleNumberChange}
            className={cn(fieldClass, "min-w-[11ch] flex-1 tracking-[0.02em]")}
          />
          <input
            ref={expiryInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Expiration date, M M slash Y Y"
            aria-invalid={isInvalid || undefined}
            placeholder="MM/YY"
            value={formatExpiry(expiryDigits)}
            onChange={handleExpiryChange}
            className={cn(fieldClass, "w-[3.25rem] shrink-0")}
          />
          <input
            ref={cvcInputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={`Security code, ${maxCvc} digits`}
            aria-invalid={isInvalid || undefined}
            placeholder={maxCvc === 4 ? "CVV" : "CVC"}
            value={cvcDigits}
            onChange={handleCvcChange}
            className={cn(fieldClass, "w-[3rem] shrink-0")}
          />
          <Check
            aria-hidden
            className={cn(
              "size-4 shrink-0 text-success transition-[opacity,transform] duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
              value.valid ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          />
        </fieldset>
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-error-strong">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
CreditCardInput.displayName = "CreditCardInput";
