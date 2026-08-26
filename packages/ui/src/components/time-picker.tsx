"use client";

import { Clock } from "lucide-react";
import {
  forwardRef,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

/**
 * A time picker that pairs a `Button` trigger (Clock icon + formatted value) with
 * a `Popover` holding scrollable hour / minute (and optional second) columns.
 *
 * - **Value model**: controlled or uncontrolled via a `{ hours, minutes, seconds }`
 *   object (24-hour `hours`) or a `"HH:mm"` / `"HH:mm:ss"` string; `onChange`
 *   always emits the normalized object.
 * - **12h / 24h**: `hourCycle` swaps a 0–23 hour column for a 1–12 column plus an
 *   AM/PM column. `minuteStep` / `secondStep` set each column's granularity.
 * - **Keyboard**: each column is an ARIA `listbox` — Arrow Up/Down (wrapping),
 *   Home/End, PageUp/PageDown, type digits to jump to a value, and Enter to
 *   confirm & close. Selection is committed on move/click; focus roves between
 *   columns with Tab.
 * - **Performance / a11y**: the active option is centered with `scrollIntoView`
 *   (instant on open, smooth after — and always instant under
 *   `prefers-reduced-motion: reduce`); the type-to-jump buffer's only timer is
 *   cleared on unmount. No `setState` runs on scroll.
 */
export interface TimeValue {
  /** Hours in 24-hour form, 0–23. */
  hours: number;
  /** Minutes, 0–59. */
  minutes: number;
  /** Seconds, 0–59 (only surfaced when `showSeconds` is set). */
  seconds?: number;
}

export interface TimePickerProps {
  /** Controlled value — a `{ hours, minutes, seconds }` object (24h `hours`) or a `"HH:mm"` / `"HH:mm:ss"` string. */
  value?: TimeValue | string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: TimeValue | string;
  /** Fired with the normalized `{ hours, minutes, seconds }` whenever the time changes. */
  onChange?: (value: TimeValue) => void;
  /** `12` renders a 1–12 hour column plus an AM/PM column; `24` renders a 0–23 column. @default 12 */
  hourCycle?: 12 | 24;
  /** Granularity of the minute column, in minutes. @default 1 */
  minuteStep?: number;
  /** Render a seconds column. @default false */
  showSeconds?: boolean;
  /** Granularity of the seconds column, in seconds. @default 1 */
  secondStep?: number;
  /** Text shown on the trigger when no value is set. @default "Select time" */
  placeholder?: string;
  /** Disable the trigger and the whole panel. */
  disabled?: boolean;
  /** Accessible name for the trigger when there is no visible label. */
  "aria-label"?: string;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Extra classes for the popover panel. */
  contentClassName?: string;
  /** Native id for the trigger. */
  id?: string;
  /** Popover alignment relative to the trigger. @default "start" */
  align?: "start" | "center" | "end";
}

/** Vertical fade so the scroll columns read like a wheel without fragile spacer math. */
const COLUMN_FADE = "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)";

function clampInt(value: number, min: number, max: number): number {
  const rounded = Math.round(value);
  return rounded < min ? min : rounded > max ? max : rounded;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Parse `"HH:mm"` or `"HH:mm:ss"` into a normalized `TimeValue`, or `null`. */
function parseTimeString(input: string): TimeValue | null {
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(input.trim());
  if (!match) return null;
  return {
    hours: clampInt(Number(match[1]), 0, 23),
    minutes: clampInt(Number(match[2]), 0, 59),
    seconds: match[3] !== undefined ? clampInt(Number(match[3]), 0, 59) : 0,
  };
}

/** Coerce any accepted input into a clamped `TimeValue`, or `undefined` when unset/invalid. */
function normalize(value: TimeValue | string | undefined): TimeValue | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string") return parseTimeString(value) ?? undefined;
  return {
    hours: clampInt(value.hours ?? 0, 0, 23),
    minutes: clampInt(value.minutes ?? 0, 0, 59),
    seconds: clampInt(value.seconds ?? 0, 0, 59),
  };
}

function formatTime(time: TimeValue, hourCycle: 12 | 24, showSeconds: boolean): string {
  const secondPart = showSeconds ? `:${pad2(time.seconds ?? 0)}` : "";
  if (hourCycle === 24) {
    return `${pad2(time.hours)}:${pad2(time.minutes)}${secondPart}`;
  }
  const period = time.hours < 12 ? "AM" : "PM";
  const hour12 = time.hours % 12 === 0 ? 12 : time.hours % 12;
  return `${pad2(hour12)}:${pad2(time.minutes)}${secondPart} ${period}`;
}

/** Convert a 1–12 clock hour + period into a 0–23 hour. */
function to24Hour(hour12: number, period: "AM" | "PM"): number {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

function buildMinuteRange(step: number): number[] {
  const safe = Math.max(1, Math.floor(step));
  const out: number[] = [];
  for (let i = 0; i < 60; i += safe) out.push(i);
  return out;
}

interface ColumnOption {
  value: number | string;
  label: string;
}

interface TimeColumnProps {
  /** Accessible name for the listbox. */
  label: string;
  /** Short visible header above the column. */
  header: string;
  options: ColumnOption[];
  selected: number | string | null;
  kind: "number" | "period";
  disabled?: boolean;
  onSelect: (value: number | string) => void;
  onConfirm?: () => void;
}

/** One scrollable, single-select column rendered as an ARIA listbox. */
function TimeColumn({
  label,
  header,
  options,
  selected,
  kind,
  disabled,
  onSelect,
  onConfirm,
}: TimeColumnProps) {
  const baseId = useId();
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const didScrollRef = useRef(false);
  const bufferRef = useRef("");
  const bufferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The only timer in the component — reset the type-to-jump buffer and always
  // clear it on unmount so nothing fires after the popover closes.
  useEffect(() => {
    return () => {
      if (bufferTimerRef.current !== null) clearTimeout(bufferTimerRef.current);
    };
  }, []);

  // Center the active option: instant on first paint (open), smooth afterwards,
  // and always instant when the user prefers reduced motion.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `selected` is the intended re-run trigger; the ref reads happen at effect time.
  useEffect(() => {
    const node = selectedRef.current;
    if (!node) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView?.({
      block: "center",
      behavior: !didScrollRef.current || prefersReduced ? "auto" : "smooth",
    });
    didScrollRef.current = true;
  }, [selected]);

  const commitByIndex = (index: number) => {
    const option = options[index];
    if (option) onSelect(option.value);
  };

  const move = (delta: number) => {
    const length = options.length;
    const current = selected === null ? -1 : options.findIndex((o) => o.value === selected);
    const start = current < 0 ? (delta > 0 ? -1 : 0) : current;
    const next = (((start + delta) % length) + length) % length;
    commitByIndex(next);
  };

  const jumpByTyping = (key: string) => {
    if (kind === "period") {
      const lower = key.toLowerCase();
      if (lower === "a") onSelect("AM");
      else if (lower === "p") onSelect("PM");
      return;
    }
    if (!/^\d$/.test(key)) return;
    if (bufferTimerRef.current !== null) clearTimeout(bufferTimerRef.current);
    bufferRef.current = (bufferRef.current + key).slice(-2);
    const target = Number(bufferRef.current);
    // Exact match when present, otherwise the nearest available (respects step).
    let best = options[0];
    let bestDiff = Number.POSITIVE_INFINITY;
    for (const option of options) {
      const diff = Math.abs((option.value as number) - target);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = option;
      }
    }
    if (best) onSelect(best.value);
    bufferTimerRef.current = setTimeout(() => {
      bufferRef.current = "";
    }, 900);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "PageDown":
        event.preventDefault();
        move(5);
        break;
      case "PageUp":
        event.preventDefault();
        move(-5);
        break;
      case "Home":
        event.preventDefault();
        commitByIndex(0);
        break;
      case "End":
        event.preventDefault();
        commitByIndex(options.length - 1);
        break;
      case "Enter":
        event.preventDefault();
        onConfirm?.();
        break;
      default:
        jumpByTyping(event.key);
    }
  };

  const activeId = selected !== null ? `${baseId}-${selected}` : undefined;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-fg-tertiary">
        {header}
      </span>
      <div
        role="listbox"
        aria-label={label}
        aria-activedescendant={activeId}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        data-slot="time-picker-column"
        className="h-48 w-16 space-y-1 overflow-y-auto overscroll-contain rounded-lg px-1 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-floating [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: COLUMN_FADE, WebkitMaskImage: COLUMN_FADE }}
      >
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard is handled once on the parent listbox; options only commit on click and expose state via aria-selected.
            // biome-ignore lint/a11y/useFocusableInteractive: WAI-ARIA activedescendant listbox — the listbox owns focus/tabindex and manages options via aria-activedescendant; options are intentionally not tab stops.
            <div
              key={String(option.value)}
              id={`${baseId}-${option.value}`}
              role="option"
              aria-selected={isSelected}
              ref={isSelected ? selectedRef : undefined}
              onClick={disabled ? undefined : () => onSelect(option.value)}
              data-slot="time-picker-option"
              className={cn(
                "flex h-9 scroll-my-2 items-center justify-center rounded-md text-sm tabular-nums transition-colors duration-150 motion-reduce:transition-none",
                disabled ? "cursor-default" : "cursor-pointer",
                isSelected
                  ? "bg-[color-mix(in_oklch,var(--cronus-primary),black_30%)] font-semibold text-white shadow-xs"
                  : "text-fg-secondary hover:bg-surface-overlay hover:text-fg",
              )}
            >
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
TimeColumn.displayName = "TimeColumn";

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      hourCycle = 12,
      minuteStep = 1,
      showSeconds = false,
      secondStep = 1,
      placeholder = "Select time",
      disabled = false,
      "aria-label": ariaLabel,
      className,
      contentClassName,
      id,
      align = "start",
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = useState<TimeValue | undefined>(() =>
      normalize(defaultValue),
    );

    const currentValue = isControlled ? normalize(valueProp) : uncontrolled;
    const isSet = currentValue !== undefined;
    const time: TimeValue = currentValue ?? { hours: 0, minutes: 0, seconds: 0 };

    const commit = (next: TimeValue) => {
      const normalized = normalize(next) ?? { hours: 0, minutes: 0, seconds: 0 };
      if (!isControlled) setUncontrolled(normalized);
      onChange?.(normalized);
    };

    const period: "AM" | "PM" = time.hours < 12 ? "AM" : "PM";
    const hour12 = time.hours % 12 === 0 ? 12 : time.hours % 12;

    const hourValues =
      hourCycle === 24
        ? Array.from({ length: 24 }, (_, i) => i)
        : [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const hourOptions: ColumnOption[] = hourValues.map((v) => ({ value: v, label: pad2(v) }));
    const minuteOptions: ColumnOption[] = buildMinuteRange(minuteStep).map((v) => ({
      value: v,
      label: pad2(v),
    }));
    const secondOptions: ColumnOption[] = buildMinuteRange(secondStep).map((v) => ({
      value: v,
      label: pad2(v),
    }));

    const selectedHour = !isSet ? null : hourCycle === 24 ? time.hours : hour12;
    const selectedMinute = isSet ? time.minutes : null;
    const selectedSecond = isSet ? (time.seconds ?? 0) : null;
    const selectedPeriod = isSet ? period : null;

    const handleHour = (value: number | string) => {
      const h = value as number;
      commit({ ...time, hours: hourCycle === 24 ? h : to24Hour(h, period) });
    };
    const handleMinute = (value: number | string) => {
      commit({ ...time, minutes: value as number });
    };
    const handleSecond = (value: number | string) => {
      commit({ ...time, seconds: value as number });
    };
    const handlePeriod = (value: number | string) => {
      commit({ ...time, hours: to24Hour(hour12, value as "AM" | "PM") });
    };

    const handleNow = () => {
      const now = new Date();
      commit({
        hours: now.getHours(),
        minutes:
          Math.floor(now.getMinutes() / Math.max(1, Math.floor(minuteStep))) *
          Math.max(1, Math.floor(minuteStep)),
        seconds: showSeconds
          ? Math.floor(now.getSeconds() / Math.max(1, Math.floor(secondStep))) *
            Math.max(1, Math.floor(secondStep))
          : 0,
      });
    };

    const display = formatTime(time, hourCycle, showSeconds);
    const closePanel = () => setOpen(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            variant="outline"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-label={ariaLabel ? (isSet ? `${ariaLabel}: ${display}` : ariaLabel) : undefined}
            data-slot="time-picker"
            className={cn("w-[240px] justify-start gap-2 font-normal", className)}
          >
            <Clock className="size-4 shrink-0 text-fg-tertiary" />
            <span className={cn("tabular-nums", !isSet && "text-fg-muted")}>
              {isSet ? display : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          aria-label={ariaLabel ?? "Choose a time"}
          data-slot="time-picker-content"
          className={cn("w-auto p-3", contentClassName)}
        >
          <div className="flex items-stretch justify-center gap-1">
            <TimeColumn
              label="Hour"
              header="Hr"
              kind="number"
              options={hourOptions}
              selected={selectedHour}
              disabled={disabled}
              onSelect={handleHour}
              onConfirm={closePanel}
            />
            <TimeColumn
              label="Minute"
              header="Min"
              kind="number"
              options={minuteOptions}
              selected={selectedMinute}
              disabled={disabled}
              onSelect={handleMinute}
              onConfirm={closePanel}
            />
            {showSeconds ? (
              <TimeColumn
                label="Second"
                header="Sec"
                kind="number"
                options={secondOptions}
                selected={selectedSecond}
                disabled={disabled}
                onSelect={handleSecond}
                onConfirm={closePanel}
              />
            ) : null}
            {hourCycle === 12 ? (
              <TimeColumn
                label="AM or PM"
                header="AM/PM"
                kind="period"
                options={[
                  { value: "AM", label: "AM" },
                  { value: "PM", label: "PM" },
                ]}
                selected={selectedPeriod}
                disabled={disabled}
                onSelect={handlePeriod}
                onConfirm={closePanel}
              />
            ) : null}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-soft pt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={handleNow}
              data-slot="time-picker-now"
            >
              Now
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={closePanel}
              data-slot="time-picker-done"
            >
              Done
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);
TimePicker.displayName = "TimePicker";
