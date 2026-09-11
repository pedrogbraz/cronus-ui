"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "./command.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

/** A single dialling country shown in the selector. */
export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code, e.g. `"BR"`. Used as the stable key. */
  code: string;
  /** Human-readable country name, e.g. `"Brazil"`. */
  name: string;
  /** International dialling code without the `+`, e.g. `"55"`. */
  dialCode: string;
  /** Flag emoji rendered in the trigger and list, e.g. `"🇧🇷"`. */
  flag: string;
  /**
   * Digit group sizes for the national number, e.g. `[2, 5, 4]` renders
   * `11 98765 4321`. Extra digits beyond the pattern become a trailing group.
   */
  format?: number[];
}

const BRAZIL: PhoneCountry = {
  code: "BR",
  name: "Brazil",
  dialCode: "55",
  flag: "🇧🇷",
  format: [2, 5, 4],
};

/**
 * A compact, sensible default of ~20 common dialling countries with Brazil
 * first. Pass your own list via the `countries` prop to override or extend it.
 */
export const DEFAULT_PHONE_COUNTRIES: PhoneCountry[] = [
  BRAZIL,
  { code: "US", name: "United States", dialCode: "1", flag: "🇺🇸", format: [3, 3, 4] },
  { code: "PT", name: "Portugal", dialCode: "351", flag: "🇵🇹", format: [3, 3, 3] },
  { code: "GB", name: "United Kingdom", dialCode: "44", flag: "🇬🇧", format: [4, 3, 3] },
  { code: "ES", name: "Spain", dialCode: "34", flag: "🇪🇸", format: [3, 3, 3] },
  { code: "FR", name: "France", dialCode: "33", flag: "🇫🇷", format: [1, 2, 2, 2, 2] },
  { code: "DE", name: "Germany", dialCode: "49", flag: "🇩🇪", format: [3, 4, 4] },
  { code: "IT", name: "Italy", dialCode: "39", flag: "🇮🇹", format: [3, 3, 4] },
  { code: "NL", name: "Netherlands", dialCode: "31", flag: "🇳🇱", format: [1, 4, 4] },
  { code: "MX", name: "Mexico", dialCode: "52", flag: "🇲🇽", format: [2, 4, 4] },
  { code: "AR", name: "Argentina", dialCode: "54", flag: "🇦🇷", format: [2, 4, 4] },
  { code: "CL", name: "Chile", dialCode: "56", flag: "🇨🇱", format: [1, 4, 4] },
  { code: "CO", name: "Colombia", dialCode: "57", flag: "🇨🇴", format: [3, 3, 4] },
  { code: "CA", name: "Canada", dialCode: "1", flag: "🇨🇦", format: [3, 3, 4] },
  { code: "AU", name: "Australia", dialCode: "61", flag: "🇦🇺", format: [3, 3, 3] },
  { code: "JP", name: "Japan", dialCode: "81", flag: "🇯🇵", format: [2, 4, 4] },
  { code: "IN", name: "India", dialCode: "91", flag: "🇮🇳", format: [5, 5] },
  { code: "CN", name: "China", dialCode: "86", flag: "🇨🇳", format: [3, 4, 4] },
  { code: "ZA", name: "South Africa", dialCode: "27", flag: "🇿🇦", format: [2, 3, 4] },
  { code: "AE", name: "United Arab Emirates", dialCode: "971", flag: "🇦🇪", format: [2, 3, 4] },
  { code: "NG", name: "Nigeria", dialCode: "234", flag: "🇳🇬", format: [3, 3, 4] },
  { code: "PH", name: "Philippines", dialCode: "63", flag: "🇵🇭", format: [3, 3, 4] },
];

/** E.164 caps the full number (country code + national) at 15 digits. */
const E164_MAX_DIGITS = 15;

/** Guaranteed-defined fallback for when a code can't be resolved (e.g. empty list). */
const FALLBACK_COUNTRY: PhoneCountry = BRAZIL;

const digitsOf = (input?: string): string => (input ?? "").replace(/\D+/g, "");

const maxNationalDigits = (country: PhoneCountry): number =>
  Math.max(0, E164_MAX_DIGITS - country.dialCode.length);

/** Group a run of digits into space-separated chunks per the country pattern. */
function formatNational(digits: string, groups?: number[]): string {
  if (!groups || groups.length === 0) {
    return digits;
  }
  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) {
      break;
    }
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  if (index < digits.length) {
    parts.push(digits.slice(index));
  }
  return parts.join(" ");
}

/** Placeholder mask derived from the grouping pattern, e.g. `00 00000 0000`. */
function maskFromFormat(groups?: number[]): string | undefined {
  if (!groups || groups.length === 0) {
    return undefined;
  }
  return groups.map((size) => "0".repeat(size)).join(" ");
}

/** Map a caret position expressed in digit-count onto the formatted string. */
function caretForDigitIndex(formatted: string, digitIndex: number): number {
  if (digitIndex <= 0) {
    return 0;
  }
  let seen = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (formatted.charCodeAt(i) >= 48 && formatted.charCodeAt(i) <= 57) {
      seen += 1;
      if (seen === digitIndex) {
        return i + 1;
      }
    }
  }
  return formatted.length;
}

/**
 * Split an E.164 (or bare national) string into a country + national number.
 * When the input starts with `+`, the country is resolved by the longest
 * matching dial code, preferring the currently-selected country so that
 * countries sharing a dial code (e.g. US/CA on `1`) don't snap around.
 */
function splitPhone(
  raw: string | undefined,
  countries: PhoneCountry[],
  preferredCode: string,
): { code: string; national: string } {
  const trimmed = (raw ?? "").trim();
  const digits = digitsOf(trimmed);
  if (!trimmed.startsWith("+")) {
    return { code: preferredCode, national: digits };
  }
  const preferred = countries.find((c) => c.code === preferredCode);
  if (preferred && digits.startsWith(preferred.dialCode)) {
    return { code: preferred.code, national: digits.slice(preferred.dialCode.length) };
  }
  let match: PhoneCountry | undefined;
  for (const country of countries) {
    if (
      digits.startsWith(country.dialCode) &&
      (!match || country.dialCode.length > match.dialCode.length)
    ) {
      match = country;
    }
  }
  if (match) {
    return { code: match.code, national: digits.slice(match.dialCode.length) };
  }
  return { code: preferred?.code ?? countries[0]?.code ?? preferredCode, national: digits };
}

export interface PhoneInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "type"
  > {
  /** Controlled value as an E.164 string (e.g. `"+5511987654321"`). Pair with `onChange`. */
  value?: string;
  /** Initial E.164 (or bare national) value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the full E.164 string on every edit; empty string when no number is entered. */
  onChange?: (value: string) => void;
  /** ISO 3166-1 alpha-2 code selected on first render. Defaults to `"BR"`. */
  defaultCountry?: string;
  /** Overrides the built-in country list. Order controls the list order. */
  countries?: PhoneCountry[];
  /** Marks the field invalid (red border/ring + `aria-invalid`). */
  invalid?: boolean;
  /** Placeholder for the country search box inside the selector. */
  searchPlaceholder?: string;
  /** Message shown when no country matches the search. */
  emptyText?: string;
  /** Accessible name for the whole control and the number field. Defaults to `"Phone number"`. */
  label?: string;
  /** Accessible name for the country selector trigger. Defaults to `"Select country"`. */
  countryLabel?: string;
  /** Extra classes for the country selector popover. */
  contentClassName?: string;
  /** Name for a hidden input carrying the E.164 value, so the field submits inside a form. */
  name?: string;
}

/**
 * An international phone input: a searchable country selector (flag + dial code)
 * fused to a national-number field that auto-groups digits for the selected
 * country and emits the composed E.164 string via `onChange`.
 *
 * Behavior & performance: digit grouping is computed with a lightweight
 * per-country pattern (no libphonenumber). The caret is preserved across
 * reformatting via a `useLayoutEffect` that reads a ref set during `onChange` —
 * no timers, intervals, or RAF are scheduled. Country selection and typing both
 * flow through `onChange`, so controlled and uncontrolled usage both work; a
 * synchronising effect keeps controlled state aligned without loops.
 *
 * Accessibility: the root is a labelled `role="group"`; the trigger is a
 * `role="combobox"` (expanded state announced) and the number field is a
 * labelled `type="tel"` input, which is the forwarded ref. Every transition
 * degrades under `prefers-reduced-motion: reduce`.
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      defaultCountry = "BR",
      countries = DEFAULT_PHONE_COUNTRIES,
      invalid = false,
      disabled = false,
      placeholder,
      searchPlaceholder = "Search country…",
      emptyText = "No country found.",
      label = "Phone number",
      countryLabel = "Select country",
      className,
      contentClassName,
      name,
      id,
      autoComplete = "tel-national",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      ...props
    },
    ref,
  ) => {
    const countryMap = useMemo(
      () => new Map(countries.map((country) => [country.code, country])),
      [countries],
    );

    const isControlled = value !== undefined;

    // Seed internal state once from `value`/`defaultValue`; later controlled
    // updates flow through the sync effect below. Lazy initialisers run only on
    // the first render, so this never reacts to prop changes.
    const seed = () => {
      const parsed = splitPhone(value ?? defaultValue, countries, defaultCountry);
      const resolved = countryMap.get(parsed.code) ?? FALLBACK_COUNTRY;
      return {
        code: resolved.code,
        national: parsed.national.slice(0, maxNationalDigits(resolved)),
      };
    };

    const [open, setOpen] = useState(false);
    const [countryCode, setCountryCode] = useState(() => seed().code);
    const [national, setNational] = useState(() => seed().national);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const caretRef = useRef<number | null>(null);
    const focusInputOnCloseRef = useRef(false);

    const country = countryMap.get(countryCode) ?? FALLBACK_COUNTRY;
    const maxDigits = maxNationalDigits(country);
    const formattedValue = formatNational(national, country.format);
    const e164 = national ? `+${country.dialCode}${national}` : "";

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    // Keep internal state aligned with a controlled `value` without re-render loops.
    // biome-ignore lint/correctness/useExhaustiveDependencies: only re-sync when the controlled value changes.
    useEffect(() => {
      if (!isControlled) {
        return;
      }
      const parsed = splitPhone(value, countries, countryCode);
      const nextCountry = countryMap.get(parsed.code) ?? FALLBACK_COUNTRY;
      setCountryCode(nextCountry.code);
      setNational(parsed.national.slice(0, maxNationalDigits(nextCountry)));
    }, [value, isControlled]);

    // Restore the caret after a reformat (runs before paint; no scheduled work).
    useLayoutEffect(() => {
      const node = inputRef.current;
      if (node && caretRef.current !== null && document.activeElement === node) {
        node.setSelectionRange(caretRef.current, caretRef.current);
      }
      caretRef.current = null;
    });

    const emit = useCallback(
      (code: string, nationalDigits: string) => {
        const dialCode = countryMap.get(code)?.dialCode ?? "";
        onChange?.(nationalDigits ? `+${dialCode}${nationalDigits}` : "");
      },
      [countryMap, onChange],
    );

    const handleNationalChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const el = event.target;
        const caret = el.selectionStart ?? el.value.length;
        const digitsBeforeCaret = digitsOf(el.value.slice(0, caret)).length;
        const nextDigits = digitsOf(el.value).slice(0, maxDigits);
        caretRef.current = caretForDigitIndex(
          formatNational(nextDigits, country.format),
          digitsBeforeCaret,
        );
        setNational(nextDigits);
        emit(countryCode, nextDigits);
      },
      [country.format, maxDigits, countryCode, emit],
    );

    const handleSelectCountry = useCallback(
      (code: string) => {
        const next = countryMap.get(code);
        if (!next) {
          return;
        }
        const clamped = national.slice(0, maxNationalDigits(next));
        setCountryCode(code);
        setNational(clamped);
        emit(code, clamped);
        focusInputOnCloseRef.current = true;
        setOpen(false);
      },
      [national, countryMap, emit],
    );

    return (
      // biome-ignore lint/a11y/useSemanticElements: a fused two-control field; role="group" associates the country selector with the number input without <fieldset>'s flex/min-width layout quirks.
      <div
        data-slot="phone-input"
        role="group"
        aria-label={ariaLabel ?? label}
        aria-labelledby={ariaLabelledby}
        aria-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        className={cn(
          "flex h-10 w-full items-center rounded-lg border border-border bg-surface-inset text-fg",
          "transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-base",
          invalid && "border-error focus-within:ring-error focus-within:ring-offset-surface-base",
          disabled && "opacity-50",
          className,
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-label={`${countryLabel}. ${country.name}, +${country.dialCode}`}
              disabled={disabled}
              data-slot="phone-input-country"
              className={cn(
                "flex h-full shrink-0 items-center gap-1.5 rounded-s-lg pe-2 ps-3 text-sm outline-none",
                "text-fg-secondary transition-colors duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
                "hover:bg-surface-overlay focus-visible:bg-surface-overlay disabled:pointer-events-none",
              )}
            >
              <span aria-hidden="true" className="text-base leading-none">
                {country.flag}
              </span>
              <span className="tabular-nums">+{country.dialCode}</span>
              <ChevronDown
                aria-hidden="true"
                data-open={open || undefined}
                className="size-3.5 text-fg-tertiary transition-transform duration-200 ease-[var(--ease-out-quart)] data-[open]:rotate-180 motion-reduce:transition-none"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={8}
            data-slot="phone-input-content"
            onCloseAutoFocus={(event) => {
              if (focusInputOnCloseRef.current) {
                event.preventDefault();
                focusInputOnCloseRef.current = false;
                inputRef.current?.focus();
              }
            }}
            className={cn("w-[280px] p-0", contentClassName)}
          >
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                {countries.map((item) => {
                  const isSelected = item.code === countryCode;
                  return (
                    <CommandItem
                      key={item.code}
                      value={`${item.name} +${item.dialCode} ${item.code}`}
                      onSelect={() => handleSelectCountry(item.code)}
                    >
                      <span aria-hidden="true" className="text-base leading-none">
                        {item.flag}
                      </span>
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="shrink-0 text-fg-tertiary tabular-nums">
                        +{item.dialCode}
                      </span>
                      <Check
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 text-primary",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {isSelected ? <span className="sr-only">, selected</span> : null}
                    </CommandItem>
                  );
                })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />

        <input
          ref={setRef}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          disabled={disabled}
          aria-label={ariaLabelledby ? undefined : (ariaLabel ?? label)}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-invalid={invalid || undefined}
          data-slot="phone-input-field"
          placeholder={placeholder ?? maskFromFormat(country.format)}
          value={formattedValue}
          onChange={handleNationalChange}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-fg outline-none",
            "placeholder:text-fg-tertiary disabled:pointer-events-none",
            "selection:bg-primary selection:text-primary-foreground",
          )}
          {...props}
        />

        {name ? <input type="hidden" name={name} value={e164} /> : null}
      </div>
    );
  },
);
PhoneInput.displayName = "PhoneInput";
