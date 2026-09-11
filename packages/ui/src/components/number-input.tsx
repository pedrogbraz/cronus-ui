"use client";

import { Minus, Plus } from "lucide-react";
import {
  type ChangeEvent,
  type FocusEvent,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Input } from "./input.js";

export interface NumberInputProps {
  /** Controlled value. Pair with `onValueChange`. Use `null` for empty. */
  value?: number | null;
  /** Initial value for uncontrolled usage. */
  defaultValue?: number | null;
  /** Called with the new value (or `null` when cleared) on every change. */
  onValueChange?: (value: number | null) => void;
  /** Minimum allowed value. The decrement stepper disables at this bound. */
  min?: number;
  /** Maximum allowed value. The increment stepper disables at this bound. */
  max?: number;
  /** Increment for steppers and Arrow keys. Defaults to `1`. */
  step?: number;
  /** Larger increment for PageUp / PageDown. Defaults to `step * 10`. */
  largeStep?: number;
  /** Number of decimal places to round and display the committed value to. */
  precision?: number;
  /** Custom formatter for the displayed value when not focused. */
  format?: (value: number) => string;
  /** Disables the input and both steppers. */
  disabled?: boolean;
  /** Marks the field as invalid (forwarded to the underlying Input). */
  invalid?: boolean;
  /** Placeholder shown when the field is empty. */
  placeholder?: string;
  /** Extra classes for the wrapper element. */
  className?: string;
  /** Extra classes for the underlying input. */
  inputClassName?: string;
  /** Accessible name for the spinbutton when there is no visible label. */
  "aria-label"?: string;
  /** ID of an element labelling the spinbutton. */
  "aria-labelledby"?: string;
  /** ID of an element describing the spinbutton. */
  "aria-describedby"?: string;
  /** Native id for the input. */
  id?: string;
  /** Native name for the input (form submission). */
  name?: string;
  /** Called when the input loses focus. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  labels?: Partial<NumberInputLabels>;
}

export interface NumberInputLabels {
  decrement: string;
  increment: string;
}

const DEFAULT_LABELS: NumberInputLabels = {
  decrement: "Decrement",
  increment: "Increment",
};

/** Round to the configured precision, avoiding float drift (e.g. 0.1 + 0.2). */
function roundTo(value: number, precision?: number): number {
  if (precision === undefined) return value;
  const factor = 10 ** precision;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function clamp(value: number, min?: number, max?: number): number {
  let next = value;
  if (min !== undefined) next = Math.max(next, min);
  if (max !== undefined) next = Math.min(next, max);
  return next;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value: valueProp,
      defaultValue = null,
      onValueChange,
      min,
      max,
      step = 1,
      largeStep,
      precision,
      format,
      disabled = false,
      invalid = false,
      placeholder,
      className,
      inputClassName,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
      id,
      name,
      onBlur,
      labels: labelsProp,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<number | null>(defaultValue);
    const value = isControlled ? valueProp : uncontrolledValue;

    // Local text mirrors keystrokes so partial entries ("-", "1.") stay editable.
    const [text, setText] = useState<string>(() =>
      value === null || value === undefined ? "" : String(value),
    );
    const [focused, setFocused] = useState(false);

    // Re-sync the visible text when the value changes from outside (controlled
    // updates, programmatic resets) without clobbering the user's in-progress
    // typing while the field is focused. We track the last value we mirrored so
    // our own commits don't trigger a redundant text rewrite.
    const lastSyncedValue = useRef(value);
    useEffect(() => {
      if (focused) return;
      if (value === lastSyncedValue.current) return;
      lastSyncedValue.current = value;
      setText(value === null || value === undefined ? "" : String(value));
    }, [value, focused]);

    const pageStep = largeStep ?? step * 10;

    const commit = useCallback(
      (next: number | null) => {
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    // Apply rounding + clamping, sync both the value and the visible text.
    const commitNumber = useCallback(
      (raw: number) => {
        const next = clamp(roundTo(raw, precision), min, max);
        setText(String(next));
        commit(next);
        return next;
      },
      [commit, precision, min, max],
    );

    const applyStep = useCallback(
      (delta: number) => {
        const base = value ?? clamp(0, min, max);
        commitNumber(base + delta);
      },
      [value, min, max, commitNumber],
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        setText(raw);
        if (raw === "") {
          // Clearing the field maps to null.
          commit(null);
          return;
        }
        if (raw === "-" || raw === "." || raw === "-.") {
          // Partial input ("-", ".", "-.") isn't a number yet. Keep the visible
          // text but don't re-commit the previous value on every keystroke — that
          // would fight the user mid-type. We wait for a valid number (or blur).
          return;
        }
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) {
          // Live updates use precision rounding but defer clamping to blur so the
          // user can finish typing values that transiently exceed a bound.
          commit(roundTo(parsed, precision));
        }
      },
      [commit, precision],
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        if (text === "" || text === "-" || text === "." || text === "-.") {
          setText("");
          commit(null);
        } else {
          const parsed = Number(text);
          if (Number.isNaN(parsed)) {
            // Reject unparseable residue, fall back to the last good value.
            setText(value === null || value === undefined ? "" : String(value));
          } else {
            commitNumber(parsed);
          }
        }
        onBlur?.(event);
      },
      [text, value, commit, commitNumber, onBlur],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            applyStep(step);
            break;
          case "ArrowDown":
            event.preventDefault();
            applyStep(-step);
            break;
          case "PageUp":
            event.preventDefault();
            applyStep(pageStep);
            break;
          case "PageDown":
            event.preventDefault();
            applyStep(-pageStep);
            break;
          case "Home":
            if (min !== undefined) {
              event.preventDefault();
              commitNumber(min);
            }
            break;
          case "End":
            if (max !== undefined) {
              event.preventDefault();
              commitNumber(max);
            }
            break;
        }
      },
      [disabled, step, pageStep, min, max, applyStep, commitNumber],
    );

    const atMin = value !== null && value !== undefined && min !== undefined && value <= min;
    const atMax = value !== null && value !== undefined && max !== undefined && value >= max;

    // While focused show raw keystrokes; otherwise show the formatted/committed value.
    const displayValue = focused
      ? text
      : value === null || value === undefined
        ? ""
        : format
          ? format(value)
          : precision !== undefined
            ? value.toFixed(precision)
            : String(value);

    return (
      <div
        data-slot="number-input"
        data-disabled={disabled ? "" : undefined}
        className={cn("flex items-center gap-1", className)}
      >
        <Button
          type="button"
          variant="outline"
          size="icon"
          tabIndex={-1}
          disabled={disabled || atMin}
          aria-label={labels.decrement}
          data-slot="number-input-decrement"
          className="shrink-0"
          onClick={() => applyStep(-step)}
        >
          <Minus aria-hidden="true" />
        </Button>
        <Input
          ref={ref}
          id={id}
          name={name}
          type="text"
          inputMode={precision !== undefined ? "decimal" : "numeric"}
          role="spinbutton"
          autoComplete="off"
          disabled={disabled}
          invalid={invalid}
          placeholder={placeholder}
          value={displayValue}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value ?? undefined}
          aria-valuetext={value !== null && value !== undefined ? displayValue : undefined}
          data-slot="number-input-field"
          className={cn("text-center", inputClassName)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          tabIndex={-1}
          disabled={disabled || atMax}
          aria-label={labels.increment}
          data-slot="number-input-increment"
          className="shrink-0"
          onClick={() => applyStep(step)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { DEFAULT_LABELS as numberInputDefaultLabels };
