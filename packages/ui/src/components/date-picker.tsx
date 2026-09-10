"use client";

import { format, type Locale } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import type { Matcher } from "react-day-picker";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Calendar } from "./calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

/**
 * A single-date picker: a button-styled trigger that opens a calendar popover.
 *
 * - **Value** works controlled (`value` + `onValueChange`) or uncontrolled
 *   (`defaultValue`). Picking a day commits the value, closes the popover and
 *   returns focus to the trigger.
 * - **Open state** follows the same pattern (`open` / `defaultOpen` /
 *   `onOpenChange`) so the popover can also be driven externally.
 * - **Forms:** when `name` is set, the selection is mirrored into a hidden
 *   input serialized as a local ISO `yyyy-MM-dd` date (no UTC day-shifting).
 * - **Display** is locale-aware via a `date-fns` `locale` and `dateFormat`,
 *   with a `formatValue` escape hatch for fully custom labels.
 * - The trigger accepts standard button attributes (`id`, `aria-describedby`,
 *   `aria-invalid`, ...) so it composes with `FormControl` Slot injection.
 */
export interface DatePickerProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "defaultValue" | "onChange" | "disabled" | "name"
  > {
  /** Controlled selected date. Pair with `onValueChange`. */
  value?: Date;
  /** Initial date for uncontrolled usage. */
  defaultValue?: Date;
  /** Called with the new date (`undefined` when deselected) on every selection change. */
  onValueChange?: (date: Date | undefined) => void;
  /**
   * Legacy change callback, fired with the same payload as `onValueChange`.
   *
   * @deprecated Use `onValueChange` — this alias matches the family naming
   * (`DateRangePicker`, `CurrencyInput`) and will be removed in a major.
   */
  onChange?: (date: Date | undefined) => void;
  /** Controlled open state of the calendar popover. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called whenever the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Text shown on the trigger when no date is selected. */
  placeholder?: string;
  /** Disables the trigger entirely. */
  disabled?: boolean;
  /** Marks the trigger invalid (error border/ring + `aria-invalid`). */
  invalid?: boolean;
  /** Earliest selectable day (inclusive). */
  min?: Date;
  /** Latest selectable day (inclusive). */
  max?: Date;
  /** Extra non-selectable days, merged with `min`/`max`. */
  disabledDates?: Matcher | Matcher[];
  /** `date-fns` locale used for both the trigger label and the calendar. */
  locale?: Locale;
  /** `date-fns` format token for the trigger label. */
  dateFormat?: string;
  /** Full override for the trigger label. Wins over `dateFormat`/`locale`. */
  formatValue?: (date: Date) => string;
  /** Form field name — renders a hidden input with the local `yyyy-MM-dd` date. */
  name?: string;
  /** Alignment of the popover against the trigger. */
  align?: ComponentPropsWithoutRef<typeof PopoverContent>["align"];
  /** Extra classes for the popover content. */
  contentClassName?: string;
}

function toMatcherList(
  min: Date | undefined,
  max: Date | undefined,
  disabledDates: Matcher | Matcher[] | undefined,
): Matcher[] {
  const matchers: Matcher[] = [];
  if (min) matchers.push({ before: min });
  if (max) matchers.push({ after: max });
  if (Array.isArray(disabledDates)) matchers.push(...disabledDates);
  else if (disabledDates !== undefined) matchers.push(disabledDates);
  return matchers;
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange,
      onChange,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      placeholder = "Pick a date",
      disabled = false,
      invalid = false,
      min,
      max,
      disabledDates,
      locale,
      dateFormat = "PPP",
      formatValue,
      name,
      align = "start",
      className,
      contentClassName,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<Date | undefined>(defaultValue);
    const isValueControlled = valueProp !== undefined;
    const value = isValueControlled ? valueProp : uncontrolledValue;

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const isOpenControlled = openProp !== undefined;
    const open = isOpenControlled ? openProp : uncontrolledOpen;

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isOpenControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isOpenControlled, onOpenChange],
    );

    const commit = useCallback(
      (next: Date | undefined) => {
        if (!isValueControlled) setUncontrolledValue(next);
        onValueChange?.(next);
        onChange?.(next);
      },
      [isValueControlled, onValueChange, onChange],
    );

    // Committing a day is a terminal action for a single-date picker, so the
    // popover closes right away (Radix then restores focus to the trigger).
    const handleSelect = useCallback(
      (next: Date | undefined) => {
        commit(next);
        setOpen(false);
      },
      [commit, setOpen],
    );

    const disabledMatcher = useMemo(
      () => toMatcherList(min, max, disabledDates),
      [min, max, disabledDates],
    );

    const label = useMemo(() => {
      if (!value) return placeholder;
      return formatValue ? formatValue(value) : format(value, dateFormat, { locale });
    }, [value, placeholder, formatValue, dateFormat, locale]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid ? true : ariaInvalid}
            data-slot="date-picker-trigger"
            className={cn(
              "w-[240px] justify-start gap-2 font-normal",
              "aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/30",
              !value && "text-fg-tertiary",
              className,
            )}
            {...props}
          >
            <CalendarIcon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        {/* Names the popover dialog for assistive tech (axe: aria-dialog-name). */}
        <PopoverContent
          align={align}
          aria-label={placeholder}
          data-slot="date-picker-content"
          className={cn("w-auto p-0", contentClassName)}
        >
          {/*
            v9+ split the old fromDate/toDate: startMonth/endMonth clamp the
            navigation while the before/after matchers (from toMatcherList)
            keep out-of-bounds days disabled within the boundary months.
          */}
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            defaultMonth={value}
            startMonth={min}
            endMonth={max}
            disabled={disabledMatcher.length > 0 ? disabledMatcher : undefined}
            locale={locale}
            autoFocus
          />
        </PopoverContent>
        {/* Local calendar date, not `toISOString()` — UTC would shift the day. */}
        {name ? (
          <input
            type="hidden"
            name={name}
            value={value ? format(value, "yyyy-MM-dd") : ""}
            readOnly
          />
        ) : null}
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";
