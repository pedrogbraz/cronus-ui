"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { forwardRef, type HTMLAttributes, useCallback, useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";

/** Token-colour key for an event chip. Maps to surface/foreground utilities. */
export type SchedulerEventColor = "primary" | "success" | "warning" | "error" | "info";

export interface SchedulerEvent {
  /** Stable identity used as the React key and passed back to callbacks. */
  id: string;
  /** Short label rendered inside the chip (truncated when it overflows). */
  title: string;
  /** Day the event belongs to. Only the calendar date is considered. */
  date: Date;
  /** Token colour for the chip. Defaults to `"primary"`. */
  color?: SchedulerEventColor;
}

/**
 * Token classes per event colour. Mirrors the soft `bg-…/15 text-…-strong`
 * treatment used by `Badge` so chips read as quiet, on-brand pills that still
 * clear WCAG AA (the `*-strong` text variant is AA-tuned for the 15% tint).
 */
const EVENT_CHIP_CLASSES: Record<SchedulerEventColor, string> = {
  primary: "bg-primary/15 text-primary-strong",
  success: "bg-success/15 text-success-strong",
  warning: "bg-warning/15 text-warning-strong",
  error: "bg-error/15 text-error-strong",
  info: "bg-info/15 text-info-strong",
};

/** Max chips rendered per day before collapsing the rest into `+N more`. */
const MAX_VISIBLE_EVENTS = 3;

export interface SchedulerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled visible month. Provide together with `onMonthChange`. */
  month?: Date;
  /** Initial visible month for the uncontrolled case. Defaults to "today". */
  defaultMonth?: Date;
  /** Called with the first day of the next visible month on Prev/Today/Next. */
  onMonthChange?: (month: Date) => void;
  /** Events to lay out across the grid. Bucketed by calendar day. */
  events?: SchedulerEvent[];
  /** Fired when an event chip is activated. */
  onEventClick?: (event: SchedulerEvent) => void;
  /** Fired when a day cell (not a chip) is activated, with that day's date. */
  onDayClick?: (date: Date) => void;
  /**
   * The day to highlight as "today". Optional and defaulting to `undefined` so
   * server render and first client paint are deterministic — pass a stable
   * Date (or compute one in an effect) to light up the current day without a
   * hydration mismatch.
   */
  today?: Date;
  /**
   * Locale-aware start of the week (0 = Sunday … 6 = Saturday). Defaults to
   * `0`, matching the Sun…Sat header.
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Accessible label for the grid. Defaults to "Event calendar". */
  ariaLabel?: string;
}

/** Key into an events-by-day map. Pure date math — no time zone surprises. */
function dayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/**
 * Month-view event calendar. Distinct from the date-picker `Calendar`: it lays
 * events onto day cells rather than selecting a date. The visible month is
 * controllable (`month`/`defaultMonth` + `onMonthChange`); everything rendered
 * is derived from props so the component is SSR-safe (the only client-only
 * concern, "today" highlighting, is opt-in via the `today` prop).
 */
export const Scheduler = forwardRef<HTMLDivElement, SchedulerProps>(
  (
    {
      className,
      month: monthProp,
      defaultMonth,
      onMonthChange,
      events = [],
      onEventClick,
      onDayClick,
      today,
      weekStartsOn = 0,
      ariaLabel = "Event calendar",
      ...props
    },
    ref,
  ) => {
    // Controlled/uncontrolled visible month, mirroring the house idiom.
    const [uncontrolledMonth, setUncontrolledMonth] = useState<Date>(
      () => defaultMonth ?? new Date(),
    );
    const isControlled = monthProp !== undefined;
    const month = isControlled ? monthProp : uncontrolledMonth;

    const goToMonth = useCallback(
      (next: Date) => {
        if (!isControlled) setUncontrolledMonth(next);
        onMonthChange?.(next);
      },
      [isControlled, onMonthChange],
    );

    const handlePrev = useCallback(() => goToMonth(subMonths(month, 1)), [goToMonth, month]);
    const handleNext = useCallback(() => goToMonth(addMonths(month, 1)), [goToMonth, month]);
    const handleToday = useCallback(
      () => goToMonth(startOfMonth(today ?? new Date())),
      [goToMonth, today],
    );

    // The visible month padded to whole weeks (leading/trailing adjacent days),
    // chunked into rows of seven so the grid can wrap each week in a `row`.
    const weeks = useMemo(() => {
      const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn });
      const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn });
      const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
      const rows: Date[][] = [];
      for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
      return rows;
    }, [month, weekStartsOn]);

    // Weekday header labels, rotated to honour `weekStartsOn`. Derived from the
    // first rendered row so labels always line up with their columns.
    const weekdayLabels = useMemo(() => (weeks[0] ?? []).map((day) => format(day, "EEE")), [weeks]);

    // Bucket events by calendar day for O(1) lookup while rendering cells.
    const eventsByDay = useMemo(() => {
      const map = new Map<string, SchedulerEvent[]>();
      for (const event of events) {
        const key = dayKey(event.date);
        const bucket = map.get(key);
        if (bucket) bucket.push(event);
        else map.set(key, [event]);
      }
      return map;
    }, [events]);

    return (
      <div
        ref={ref}
        data-slot="scheduler"
        className={cn("w-full rounded-xl border border-border bg-surface-base text-fg", className)}
        {...props}
      >
        {/* Header: visible month + Prev / Today / Next controls. */}
        <div className="flex items-center justify-between gap-2 border-b border-border p-3">
          <h2 data-slot="scheduler-title" className="text-sm font-semibold text-fg">
            {format(month, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Previous month"
              onClick={handlePrev}
            >
              <ChevronLeft />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Next month"
              onClick={handleNext}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        {/* A native <table> gives the calendar grid table/row/columnheader/cell
            semantics for free — axe-valid and no explicit ARIA roles to fight. */}
        <table data-slot="scheduler-grid" aria-label={ariaLabel} className="w-full table-fixed">
          <thead data-slot="scheduler-weekdays">
            <tr>
              {weekdayLabels.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="border-b border-border px-2 py-1.5 text-center text-xs font-normal text-fg-tertiary"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0]?.toISOString()}>
                {week.map((day) => {
                  const inMonth = isSameMonth(day, month);
                  const isToday = today != null && isSameDay(day, today);
                  const dayEvents = eventsByDay.get(dayKey(day)) ?? [];
                  const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
                  const overflowCount = dayEvents.length - visibleEvents.length;

                  return (
                    <td
                      key={day.toISOString()}
                      aria-label={format(day, "EEEE, MMMM d, yyyy")}
                      aria-current={isToday ? "date" : undefined}
                      onClick={() => onDayClick?.(day)}
                      onKeyDown={(e) => {
                        // Only the cell itself (not a focused chip) toggles the day.
                        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onDayClick?.(day);
                        }
                      }}
                      className={cn(
                        "h-24 min-w-0 cursor-pointer border-r border-b border-border p-1.5 align-top outline-none transition-colors last:border-r-0",
                        "hover:bg-surface-overlay focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                        inMonth ? "text-fg" : "text-fg-tertiary",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                          isToday && "bg-primary text-white",
                          !inMonth && "text-fg-tertiary",
                        )}
                      >
                        {format(day, "d")}
                      </span>

                      <span className="mt-1 flex flex-col gap-0.5">
                        {visibleEvents.map((event) => (
                          <button
                            key={event.id}
                            type="button"
                            data-slot="scheduler-event"
                            title={event.title}
                            onClick={(e) => {
                              // Don't also trigger the day cell behind the chip.
                              e.stopPropagation();
                              onEventClick?.(event);
                            }}
                            className={cn(
                              "truncate rounded px-1.5 py-0.5 text-left text-xs font-medium outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                              EVENT_CHIP_CLASSES[event.color ?? "primary"],
                            )}
                          >
                            {event.title}
                          </button>
                        ))}
                        {overflowCount > 0 && (
                          <span
                            data-slot="scheduler-event-overflow"
                            className="px-1.5 text-xs font-medium text-fg-tertiary"
                          >
                            +{overflowCount} more
                          </span>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);
Scheduler.displayName = "Scheduler";
