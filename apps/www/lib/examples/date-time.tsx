"use client";

import {
  Button,
  Calendar,
  Countdown,
  DatePicker,
  type DateRange,
  DateRangePicker,
  Scheduler,
  type SchedulerEvent,
  TimePicker,
  type TimeValue,
} from "@cronus-ui/ui";
import { useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

// Fixed anchor date so SSR + client render the same labels (no hydration drift).
const RANGE_ANCHOR = new Date(2026, 5, 21);

// Fixed month + events so server and client render identically (no hydration drift).
const SCHEDULER_MONTH = new Date(2026, 5, 1);
const SCHEDULER_EVENTS: SchedulerEvent[] = [
  { id: "standup", title: "Team standup", date: new Date(2026, 5, 2), color: "primary" },
  { id: "design", title: "Design review", date: new Date(2026, 5, 9), color: "info" },
  { id: "ship", title: "v2 ship", date: new Date(2026, 5, 12), color: "success" },
  { id: "retro", title: "Sprint retro", date: new Date(2026, 5, 12), color: "warning" },
  { id: "1on1", title: "1:1 with Ada", date: new Date(2026, 5, 18), color: "primary" },
  { id: "launch", title: "Launch party", date: new Date(2026, 5, 24), color: "success" },
  { id: "oncall", title: "On-call handoff", date: new Date(2026, 5, 30), color: "error" },
];

function addDays(base: Date, days: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
}

/* -------------------------------------------------------------------------- */
/*  Stateful demos                                                            */
/* -------------------------------------------------------------------------- */

function CalendarDemo() {
  // Fixed initial date so server and client render identically (no hydration drift).
  const [date, setDate] = useState<Date | undefined>(() => new Date(2026, 5, 21));
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />;
}

function CountdownDemo() {
  // Target computed once per mount. Countdown is SSR-safe on its own — it
  // renders a stable "--" placeholder until mounted, so a live relative
  // target causes no hydration drift.
  const [target] = useState(() => Date.now() + (2 * 86_400 + 14 * 3_600 + 25 * 60 + 9) * 1_000);
  return <Countdown target={target} aria-label="Launch countdown" />;
}

function CountdownCompleteDemo() {
  const [target, setTarget] = useState(() => Date.now() + 15_000);
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Countdown
        compact
        target={target}
        onComplete={() => setDone(true)}
        aria-label="Offer ends in"
      />
      {done ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDone(false);
            setTarget(Date.now() + 15_000);
          }}
        >
          Restart
        </Button>
      ) : (
        <span className="text-sm text-fg-tertiary">Offer ends soon…</span>
      )}
    </div>
  );
}

function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <div className="flex flex-col gap-3">
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
      <span className="text-sm text-fg-tertiary">
        {date ? `Selected: ${date.toLocaleDateString()}` : "No date selected yet."}
      </span>
    </div>
  );
}

function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: RANGE_ANCHOR,
    to: addDays(RANGE_ANCHOR, 6),
  }));
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      numberOfMonths={1}
      aria-label="Pick a date range"
    />
  );
}

function DateRangePickerPresetsDemo() {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <DateRangePicker
      value={range}
      onValueChange={setRange}
      numberOfMonths={1}
      aria-label="Pick a reporting range"
      presets={[
        { label: "Last 7 days", range: { from: addDays(RANGE_ANCHOR, -6), to: RANGE_ANCHOR } },
        { label: "Last 30 days", range: { from: addDays(RANGE_ANCHOR, -29), to: RANGE_ANCHOR } },
        {
          label: "This week",
          range: { from: RANGE_ANCHOR, to: addDays(RANGE_ANCHOR, 6) },
        },
      ]}
    />
  );
}

function SchedulerDemo() {
  // Start on a fixed month so SSR + first client paint agree (no hydration drift).
  const [month, setMonth] = useState<Date>(() => SCHEDULER_MONTH);
  return (
    <Scheduler
      month={month}
      onMonthChange={setMonth}
      events={SCHEDULER_EVENTS}
      today={SCHEDULER_MONTH}
      className="max-w-2xl"
    />
  );
}

function TimePickerDemo() {
  // Fixed initial value keeps SSR + first client paint identical (no hydration drift).
  const [time, setTime] = useState<TimeValue | undefined>(() => ({ hours: 9, minutes: 30 }));
  return (
    <div className="flex flex-col gap-3">
      <TimePicker value={time} onChange={setTime} aria-label="Meeting time" />
      <span className="text-sm text-fg-tertiary">
        {time
          ? `Selected ${String(time.hours).padStart(2, "0")}:${String(time.minutes).padStart(2, "0")}`
          : "No time selected yet."}
      </span>
    </div>
  );
}

function TimePicker24Demo() {
  const [time, setTime] = useState<TimeValue | undefined>(() => ({
    hours: 14,
    minutes: 45,
    seconds: 0,
  }));
  return (
    <TimePicker
      value={time}
      onChange={setTime}
      hourCycle={24}
      minuteStep={5}
      showSeconds
      aria-label="Broadcast start"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Examples                                                                  */
/* -------------------------------------------------------------------------- */

export const dateTimeExamples: ExampleMap = {
  calendar: [
    {
      id: "single-date",
      title: "Single date",
      description: "A controlled calendar in single-select mode. Click a day to update the value.",
      code: `// Fixed initial date keeps SSR + client identical (avoids hydration drift).
const [date, setDate] = useState<Date | undefined>(() => new Date(2026, 5, 21));

return (
  <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
);`,
      preview: <CalendarDemo />,
    },
  ],
  countdown: [
    {
      id: "launch",
      title: "Launch countdown",
      description:
        "Days / hours / minutes / seconds tiles ticking toward a target `Date`, ISO string, or epoch-ms number. SSR-safe: a stable `--` placeholder renders until mount, then changed digits slide in (instant under reduced motion).",
      code: `// Target computed once per mount. Countdown is SSR-safe on its own — it
// renders a stable "--" placeholder until mounted, so a live relative
// target causes no hydration drift.
const [target] = useState(() => Date.now() + (2 * 86_400 + 14 * 3_600 + 25 * 60 + 9) * 1_000);

return <Countdown target={target} aria-label="Launch countdown" />;`,
      preview: <CountdownDemo />,
    },
    {
      id: "compact-complete",
      title: "Compact with completion",
      description:
        '`compact` shrinks the tiles for banners and toolbars, and `onComplete` fires exactly once at zero (re-arming if the target moves back into the future). Localize the captions with `labels`, e.g. `labels={{ days: "dias", hours: "horas" }}`.',
      code: `const [target, setTarget] = useState(() => Date.now() + 15_000);
const [done, setDone] = useState(false);

return (
  <div className="flex items-center gap-4">
    <Countdown compact target={target} onComplete={() => setDone(true)} aria-label="Offer ends in" />
    {done ? (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setDone(false);
          setTarget(Date.now() + 15_000);
        }}
      >
        Restart
      </Button>
    ) : (
      <span className="text-sm text-fg-tertiary">Offer ends soon…</span>
    )}
  </div>
);`,
      preview: <CountdownCompleteDemo />,
    },
  ],
  "date-picker": [
    {
      id: "pick-a-date",
      title: "Pick a date",
      description: "A popover-based picker. Pass `value` and `onChange` to control the selection.",
      code: `const [date, setDate] = useState<Date | undefined>();

return (
  <div className="flex flex-col gap-3">
    <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
    <span className="text-sm text-fg-tertiary">
      {date ? \`Selected: \${date.toLocaleDateString()}\` : "No date selected yet."}
    </span>
  </div>
);`,
      preview: <DatePickerDemo />,
    },
  ],
  "date-range-picker": [
    {
      id: "range",
      title: "Date range",
      description:
        "A controlled start/end selection in a popover. Pass `value` and `onValueChange`; both ends are optional so an in-progress selection is valid.",
      code: `const [range, setRange] = useState<DateRange | undefined>(() => ({
  from: new Date(2026, 5, 21),
  to: new Date(2026, 5, 27),
}));

return (
  <DateRangePicker
    value={range}
    onValueChange={setRange}
    numberOfMonths={1}
    aria-label="Pick a date range"
  />
);`,
      preview: <DateRangePickerDemo />,
    },
    {
      id: "presets",
      title: "With presets",
      description:
        "Add a `presets` column of named shortcuts beside the calendar — ideal for reporting ranges like the last 7 or 30 days.",
      code: `const [range, setRange] = useState<DateRange | undefined>();

return (
  <DateRangePicker
    value={range}
    onValueChange={setRange}
    numberOfMonths={1}
    aria-label="Pick a reporting range"
    presets={[
      { label: "Last 7 days", range: { from: addDays(today, -6), to: today } },
      { label: "Last 30 days", range: { from: addDays(today, -29), to: today } },
      { label: "This week", range: { from: today, to: addDays(today, 6) } },
    ]}
  />
);`,
      preview: <DateRangePickerPresetsDemo />,
    },
  ],
  scheduler: [
    {
      id: "month-view",
      title: "Month view",
      description:
        "A month-grid calendar that lays events onto day cells. Drive the visible month with `month`/`onMonthChange`, pass token-coloured `events`, and opt into a `today` highlight. Days overflowing three events collapse into a `+N more` row.",
      code: `const events: SchedulerEvent[] = [
  { id: "standup", title: "Team standup", date: new Date(2026, 5, 2), color: "primary" },
  { id: "design", title: "Design review", date: new Date(2026, 5, 9), color: "info" },
  { id: "ship", title: "v2 ship", date: new Date(2026, 5, 12), color: "success" },
  { id: "retro", title: "Sprint retro", date: new Date(2026, 5, 12), color: "warning" },
  { id: "launch", title: "Launch party", date: new Date(2026, 5, 24), color: "success" },
];

// Fixed month keeps SSR + client identical (avoids hydration drift).
const [month, setMonth] = useState<Date>(() => new Date(2026, 5, 1));

return (
  <Scheduler
    month={month}
    onMonthChange={setMonth}
    events={events}
    today={new Date(2026, 5, 1)}
    className="max-w-2xl"
  />
);`,
      preview: <SchedulerDemo />,
    },
  ],
  "time-picker": [
    {
      id: "twelve-hour",
      title: "12-hour clock",
      description:
        "A controlled picker with a `Clock` trigger and scrollable hour / minute / AM–PM wheels. Pass `value` and `onChange`; the callback always emits a normalized `{ hours, minutes, seconds }` (24-hour `hours`).",
      code: `// Fixed initial value keeps SSR + client identical (avoids hydration drift).
const [time, setTime] = useState<TimeValue | undefined>(() => ({ hours: 9, minutes: 30 }));

return (
  <div className="flex flex-col gap-3">
    <TimePicker value={time} onChange={setTime} aria-label="Meeting time" />
    <span className="text-sm text-fg-tertiary">
      {time
        ? \`Selected \${String(time.hours).padStart(2, "0")}:\${String(time.minutes).padStart(2, "0")}\`
        : "No time selected yet."}
    </span>
  </div>
);`,
      preview: <TimePickerDemo />,
    },
    {
      id: "twenty-four-hour-seconds",
      title: "24-hour with seconds",
      description:
        "Set `hourCycle={24}` for a 0–23 column (no AM/PM), tune column granularity with `minuteStep`, and reveal a seconds wheel with `showSeconds`.",
      code: `const [time, setTime] = useState<TimeValue | undefined>(() => ({
  hours: 14,
  minutes: 45,
  seconds: 0,
}));

return (
  <TimePicker
    value={time}
    onChange={setTime}
    hourCycle={24}
    minuteStep={5}
    showSeconds
    aria-label="Broadcast start"
  />
);`,
      preview: <TimePicker24Demo />,
    },
    {
      id: "disabled",
      title: "Disabled",
      description:
        "Set `disabled` to lock the trigger and the whole panel while still displaying its current value — useful for read-only or gated slots.",
      code: `<TimePicker defaultValue="08:00" disabled aria-label="Locked slot" />`,
      preview: <TimePicker defaultValue="08:00" disabled aria-label="Locked slot" />,
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function DateTimeExamples({ slug }: { slug: string }) {
  return <ExampleList examples={dateTimeExamples[slug] ?? []} />;
}
