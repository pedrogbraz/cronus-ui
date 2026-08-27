"use client";

import { ChevronDown } from "lucide-react";
import {
  type ChangeEvent,
  type FocusEvent,
  forwardRef,
  type InputHTMLAttributes,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

/**
 * A premium, payments-grade money input. A compact currency selector (symbol +
 * ISO code, e.g. `R$ BRL`) is fused to an end-aligned numeric field that
 * live-formats thousands separators and decimals **as the user types**, driven
 * entirely by `Intl.NumberFormat` for the active currency's locale.
 *
 * ## Value model
 * The field is a **minor-unit accumulator** (the pattern used by Wise / Revolut /
 * Cash App): each digit shifts the amount in from the right, so typing `1 2 3 4 5`
 * with 2-decimal money reads `0,01 → 0,12 → 1,23 → 12,34 → 123,45`. Consumers
 * always receive the value in **minor units** (integer cents) via
 * `onValueChange(cents, meta)` — never a lossy float — with the display string,
 * major-unit float, currency and locale carried in `meta`.
 *
 * ## Interaction
 * - **Caret stability:** the caret is pinned to the end after every edit, so
 *   grouping separators appearing/disappearing never make it jump.
 * - **Backspace** removes the last digit; deleting through zero clears the field.
 * - **Paste** is treated as its digit stream, so `1.234,56` pastes as `123456`.
 * - **max** is a hard live ceiling (you can't type past it); **min** is enforced
 *   on blur so in-progress entries below it aren't fought mid-type.
 * - **disabled / invalid** dim the group and set `aria-invalid`.
 *
 * ## Performance / a11y
 * - `Intl.NumberFormat` instances are cached per `locale:fractionDigits`; caret
 *   pinning runs in a single `useLayoutEffect` — no timers, intervals, or RAF, so
 *   there is nothing to leak on unmount.
 * - The selector is a real Radix dropdown (roving focus, `Esc`, typeahead); the
 *   numeric field forwards its ref and takes an accessible name. All transitions
 *   degrade under `prefers-reduced-motion`.
 */

/** A currency the selector can switch between. */
export interface CurrencyOption {
  /** ISO 4217 code, e.g. `"BRL"`. Also the value passed to `onCurrencyChange`. */
  code: string;
  /** Symbol shown in the selector, e.g. `"R$"`, `"US$"`, `"€"`. */
  symbol: string;
  /** BCP-47 locale used to format grouping + decimals, e.g. `"pt-BR"`. */
  locale: string;
  /** Full name shown on the dropdown row, e.g. `"Brazilian Real"`. */
  label?: string;
  /** Minor-unit exponent (2 for cents, 0 for yen). Auto-derived from `Intl` when omitted. */
  fractionDigits?: number;
}

/** Formatting context handed back alongside every value/currency change. */
export interface CurrencyInputMeta {
  /** Active ISO 4217 currency code. */
  currency: string;
  /** The string rendered in the field, e.g. `"1.234,56"`. */
  formatted: string;
  /** The amount in major units (e.g. `1234.56`), or `null` when empty. */
  float: number | null;
  /** Locale used for formatting. */
  locale: string;
}

export interface CurrencyInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "min" | "max" | "type"
  > {
  /** Controlled amount in **minor units** (integer cents). Use `null` for empty. Pair with `onValueChange`. */
  value?: number | null;
  /** Initial amount in minor units for uncontrolled usage. Defaults to `null` (empty). */
  defaultValue?: number | null;
  /** Fired on every edit with the amount in **minor units** (`null` when cleared) plus formatting `meta`. */
  onValueChange?: (value: number | null, meta: CurrencyInputMeta) => void;
  /** Selectable currencies. Defaults to BRL, USD and EUR. A single entry renders a static (non-interactive) prefix. */
  currencies?: CurrencyOption[];
  /** Controlled active currency code. Pair with `onCurrencyChange`. */
  currency?: string;
  /** Initial active currency code for uncontrolled usage. Defaults to the first `currencies` entry. */
  defaultCurrency?: string;
  /** Fired when the user picks a different currency (also re-fires `onValueChange` with the new `meta`). */
  onCurrencyChange?: (code: string, meta: CurrencyInputMeta) => void;
  /** Lower clamp in minor units, enforced on blur. Defaults to `0` (no negatives). */
  min?: number;
  /** Upper clamp in minor units — a hard live ceiling the value can never be typed past. */
  max?: number;
  /** Marks the field invalid (red border + `aria-invalid`). */
  invalid?: boolean;
  /** Disables the field and the currency selector. */
  disabled?: boolean;
  /** Accessible name for the currency selector button. @default "Select currency" */
  selectorLabel?: string;
  /** Extra classes for the underlying `<input>`. */
  inputClassName?: string;
}

/** ISO 4217 set covering the currencies a payments field actually sees. */
const DEFAULT_CURRENCIES: [CurrencyOption, ...CurrencyOption[]] = [
  { code: "BRL", symbol: "R$", locale: "pt-BR", label: "Brazilian Real" },
  { code: "USD", symbol: "US$", locale: "en-US", label: "US Dollar" },
  { code: "EUR", symbol: "€", locale: "de-DE", label: "Euro" },
  { code: "GBP", symbol: "£", locale: "en-GB", label: "British Pound" },
  { code: "JPY", symbol: "¥", locale: "ja-JP", label: "Japanese Yen", fractionDigits: 0 },
  { code: "CNY", symbol: "¥", locale: "zh-CN", label: "Chinese Yuan" },
  { code: "INR", symbol: "₹", locale: "en-IN", label: "Indian Rupee" },
  { code: "AUD", symbol: "A$", locale: "en-AU", label: "Australian Dollar" },
  { code: "CAD", symbol: "CA$", locale: "en-CA", label: "Canadian Dollar" },
  { code: "CHF", symbol: "CHF", locale: "de-CH", label: "Swiss Franc" },
  { code: "MXN", symbol: "MX$", locale: "es-MX", label: "Mexican Peso" },
  { code: "ARS", symbol: "AR$", locale: "es-AR", label: "Argentine Peso" },
  { code: "CLP", symbol: "CL$", locale: "es-CL", label: "Chilean Peso", fractionDigits: 0 },
  { code: "COP", symbol: "CO$", locale: "es-CO", label: "Colombian Peso" },
  { code: "PEN", symbol: "S/", locale: "es-PE", label: "Peruvian Sol" },
  { code: "UYU", symbol: "$U", locale: "es-UY", label: "Uruguayan Peso" },
  { code: "PYG", symbol: "₲", locale: "es-PY", label: "Paraguayan Guarani", fractionDigits: 0 },
  { code: "BOB", symbol: "Bs", locale: "es-BO", label: "Bolivian Boliviano" },
  { code: "KRW", symbol: "₩", locale: "ko-KR", label: "South Korean Won", fractionDigits: 0 },
  { code: "HKD", symbol: "HK$", locale: "zh-HK", label: "Hong Kong Dollar" },
  { code: "SGD", symbol: "S$", locale: "en-SG", label: "Singapore Dollar" },
  { code: "NZD", symbol: "NZ$", locale: "en-NZ", label: "New Zealand Dollar" },
  { code: "SEK", symbol: "kr", locale: "sv-SE", label: "Swedish Krona" },
  { code: "NOK", symbol: "kr", locale: "nb-NO", label: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", locale: "da-DK", label: "Danish Krone" },
  { code: "PLN", symbol: "zł", locale: "pl-PL", label: "Polish Zloty" }, // contract-ok: BCP-47 locale, not padding
  { code: "CZK", symbol: "Kč", locale: "cs-CZ", label: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", locale: "hu-HU", label: "Hungarian Forint", fractionDigits: 0 },
  { code: "RON", symbol: "lei", locale: "ro-RO", label: "Romanian Leu" },
  { code: "TRY", symbol: "₺", locale: "tr-TR", label: "Turkish Lira" },
  { code: "ZAR", symbol: "R", locale: "en-ZA", label: "South African Rand" },
  { code: "NGN", symbol: "₦", locale: "en-NG", label: "Nigerian Naira" },
  { code: "EGP", symbol: "E£", locale: "ar-EG", label: "Egyptian Pound" },
  { code: "AED", symbol: "د.إ", locale: "ar-AE", label: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", locale: "ar-SA", label: "Saudi Riyal" },
  { code: "ILS", symbol: "₪", locale: "he-IL", label: "Israeli Shekel" },
  { code: "THB", symbol: "฿", locale: "th-TH", label: "Thai Baht" },
  { code: "IDR", symbol: "Rp", locale: "id-ID", label: "Indonesian Rupiah" },
  { code: "MYR", symbol: "RM", locale: "ms-MY", label: "Malaysian Ringgit" },
  { code: "PHP", symbol: "₱", locale: "en-PH", label: "Philippine Peso" },
  { code: "VND", symbol: "₫", locale: "vi-VN", label: "Vietnamese Dong", fractionDigits: 0 },
  { code: "TWD", symbol: "NT$", locale: "zh-TW", label: "New Taiwan Dollar" },
  { code: "PKR", symbol: "₨", locale: "en-PK", label: "Pakistani Rupee" },
  { code: "BDT", symbol: "৳", locale: "bn-BD", label: "Bangladeshi Taka" },
];

/** The active option for `code`, always resolving to a real currency. */
function resolveActive(list: CurrencyOption[], code: string): CurrencyOption {
  return list.find((c) => c.code === code) ?? list[0] ?? DEFAULT_CURRENCIES[0];
}

/** Cap digits well under `Number.MAX_SAFE_INTEGER` so `Number(digits)` stays exact. */
const MAX_DIGITS = 15;

const FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();
function getFormatter(locale: string, fractionDigits: number): Intl.NumberFormat {
  const key = `${locale}:${fractionDigits}`;
  let fmt = FORMATTER_CACHE.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
      useGrouping: true,
    });
    FORMATTER_CACHE.set(key, fmt);
  }
  return fmt;
}

/** Resolve the minor-unit exponent, honouring an explicit override then `Intl`. */
function resolveFractionDigits(option: CurrencyOption): number {
  if (option.fractionDigits !== undefined) return option.fractionDigits;
  try {
    return (
      new Intl.NumberFormat(option.locale, {
        style: "currency",
        currency: option.code,
      }).resolvedOptions().maximumFractionDigits ?? 2
    );
  } catch {
    return 2;
  }
}

function clampCents(cents: number, min: number | undefined, max: number | undefined): number {
  let next = cents;
  if (min !== undefined) next = Math.max(next, min);
  if (max !== undefined) next = Math.min(next, max);
  return next;
}

function formatCents(cents: number, fmt: Intl.NumberFormat, fractionDigits: number): string {
  return fmt.format(cents / 10 ** fractionDigits);
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      currencies,
      currency: currencyProp,
      defaultCurrency,
      onCurrencyChange,
      min = 0,
      max,
      invalid = false,
      disabled = false,
      selectorLabel = "Select currency",
      className,
      inputClassName,
      placeholder,
      "aria-label": ariaLabel,
      "aria-invalid": ariaInvalid,
      onFocus,
      onBlur,
      name,
      ...props
    },
    ref,
  ) => {
    const list = currencies && currencies.length > 0 ? currencies : DEFAULT_CURRENCIES;

    // ---- currency (controlled / uncontrolled) ----
    const isCurrencyControlled = currencyProp !== undefined;
    const [uncontrolledCurrency, setUncontrolledCurrency] = useState(
      () => defaultCurrency ?? (list[0] ?? DEFAULT_CURRENCIES[0]).code,
    );
    const activeCode = isCurrencyControlled ? currencyProp : uncontrolledCurrency;
    const active = useMemo(() => resolveActive(list, activeCode), [list, activeCode]);
    const fractionDigits = useMemo(() => resolveFractionDigits(active), [active]);
    const formatter = getFormatter(active.locale, fractionDigits);

    // ---- amount in minor units (controlled / uncontrolled) ----
    const isValueControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(defaultValue);
    const cents = isValueControlled ? valueProp : uncontrolledValue;

    // The visible string is a pure function of the value — no separate text state
    // is needed because the accumulator never has partial ("1.") intermediates.
    const display = cents == null ? "" : formatCents(cents, formatter, fractionDigits);
    const zeroHint = formatCents(0, formatter, fractionDigits);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const pinCaret = useRef(false);

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // Keep the caret at the very end after a keystroke reformats the string, so
    // grouping separators shifting around never yank it mid-word.
    useLayoutEffect(() => {
      if (!pinCaret.current) return;
      pinCaret.current = false;
      const el = inputRef.current;
      if (el && document.activeElement === el) {
        // After render `el.value === display`, so pinning to `display.length`
        // parks the caret at the very end (and keeps `display` a real dep).
        el.setSelectionRange(display.length, display.length);
      }
    }, [display]);

    const commitValue = useCallback(
      (nextCents: number | null) => {
        if (!isValueControlled) setUncontrolledValue(nextCents);
        onValueChange?.(nextCents, {
          currency: active.code,
          formatted: nextCents == null ? "" : formatCents(nextCents, formatter, fractionDigits),
          float: nextCents == null ? null : nextCents / 10 ** fractionDigits,
          locale: active.locale,
        });
      },
      [isValueControlled, onValueChange, active, formatter, fractionDigits],
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const el = event.target;
        const digits = el.value.replace(/[^0-9]/g, "");
        const pinEnd = () => {
          el.value = display;
          el.setSelectionRange(display.length, display.length);
        };

        // Overflow guard — reject and restore the canonical string.
        if (digits.length > MAX_DIGITS) {
          pinEnd();
          return;
        }

        const prevDigits = display.replace(/[^0-9]/g, "");
        const deleting = digits.length < prevDigits.length;
        let nextCents: number | null;
        if (digits === "") {
          nextCents = null;
        } else {
          // Live editing only clamps the ceiling; the floor is applied on blur so
          // values on their way up to `min` aren't fought mid-type.
          nextCents = clampCents(Number(digits), undefined, max);
          // Backspacing a lone/leading zero clears the field instead of sticking.
          if (deleting && nextCents === 0) nextCents = null;
        }

        // No net change → React won't rewrite the DOM value, so force the
        // canonical string + caret back ourselves (handles ceiling + leading 0s).
        if (nextCents === cents) {
          pinEnd();
          return;
        }

        pinCaret.current = true;
        commitValue(nextCents);
      },
      [display, cents, max, commitValue],
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        if (cents != null) {
          const clamped = clampCents(cents, min, max);
          if (clamped !== cents) commitValue(clamped);
        }
        onBlur?.(event);
      },
      [cents, min, max, commitValue, onBlur],
    );

    const handleCurrencyChange = useCallback(
      (code: string) => {
        if (code === activeCode) return;
        if (!isCurrencyControlled) setUncontrolledCurrency(code);
        const next = resolveActive(list, code);
        const nextFraction = resolveFractionDigits(next);
        const nextFmt = getFormatter(next.locale, nextFraction);
        const meta: CurrencyInputMeta = {
          currency: next.code,
          formatted: cents == null ? "" : formatCents(cents, nextFmt, nextFraction),
          float: cents == null ? null : cents / 10 ** nextFraction,
          locale: next.locale,
        };
        onCurrencyChange?.(code, meta);
        // Surface the currency swap to value listeners too — the integer amount is
        // unchanged, but the active currency/locale in `meta` now differs.
        onValueChange?.(cents ?? null, meta);
      },
      [activeCode, isCurrencyControlled, list, cents, onCurrencyChange, onValueChange],
    );

    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
    const singleCurrency = list.length <= 1;

    return (
      <div
        data-slot="currency-input"
        data-disabled={disabled ? "" : undefined}
        data-invalid={isInvalid ? "" : undefined}
        className={cn(
          "flex h-10 w-full items-stretch overflow-hidden rounded-lg border border-border bg-surface-inset text-fg shadow-xs",
          "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-base",
          isInvalid && "border-error focus-within:border-error focus-within:ring-error/40",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
      >
        {singleCurrency ? (
          <span
            data-slot="currency-input-prefix"
            aria-hidden="true"
            className="flex shrink-0 select-none items-center gap-1.5 border-e border-border px-3 text-sm"
          >
            <span className="font-medium text-fg">{active.symbol}</span>
            <span className="text-xs font-medium text-fg-tertiary">{active.code}</span>
          </span>
        ) : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                aria-label={selectorLabel}
                data-slot="currency-input-selector"
                className={cn(
                  "group/trigger flex shrink-0 select-none items-center gap-1.5 border-e border-border pe-2.5 ps-3 text-sm outline-none",
                  "transition-colors duration-150 hover:bg-surface-overlay focus-visible:bg-surface-overlay data-[state=open]:bg-surface-overlay motion-reduce:transition-none",
                )}
              >
                <span className="font-medium text-fg">{active.symbol}</span>
                <span className="text-xs font-medium text-fg-tertiary">{active.code}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-3.5 text-fg-tertiary transition-transform duration-200 ease-[var(--ease-out-quart)] group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="max-h-72 min-w-[16rem] overflow-y-auto"
              onCloseAutoFocus={(event) => event.preventDefault()}
            >
              <DropdownMenuLabel>Currency</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={activeCode} onValueChange={handleCurrencyChange}>
                {list.map((option) => (
                  <DropdownMenuRadioItem key={option.code} value={option.code}>
                    <span className="min-w-[2.5ch] font-medium text-fg">{option.symbol}</span>
                    <span className="font-medium">{option.code}</span>
                    {option.label ? (
                      <span className="ms-auto ps-6 text-xs text-fg-tertiary">{option.label}</span>
                    ) : null}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <input
          ref={setRef}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          value={display}
          placeholder={placeholder ?? zeroHint}
          aria-label={ariaLabel}
          aria-invalid={isInvalid ? true : ariaInvalid}
          data-slot="currency-input-field"
          className={cn(
            "min-w-0 flex-1 bg-transparent px-3 text-end text-sm text-fg tabular-nums",
            "outline-none placeholder:text-fg-tertiary disabled:pointer-events-none",
            "selection:bg-primary selection:text-primary-foreground",
            inputClassName,
          )}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={handleBlur}
          {...props}
        />
        {name ? <input type="hidden" name={name} value={cents ?? ""} readOnly /> : null}
      </div>
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";
