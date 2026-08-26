import { Fragment, createElement as h, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/accordion.js";
import { Alert, AlertDescription, AlertTitle } from "./components/alert.js";
import { AnimatedNumber } from "./components/animated-number.js";
import { Avatar, AvatarFallback } from "./components/avatar.js";
import { Badge } from "./components/badge.js";
import { Button } from "./components/button.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/card.js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./components/carousel.js";
import { Checkbox } from "./components/checkbox.js";
import { type ColumnDef, DataTable } from "./components/data-table.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./components/dialog.js";
import { Input } from "./components/input.js";
import { Label } from "./components/label.js";
import { Metric, MetricDelta, MetricLabel, MetricValue } from "./components/metric.js";
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "./components/morphing-popover.js";
import { Popover, PopoverContent, PopoverTrigger } from "./components/popover.js";
import { Progress } from "./components/progress.js";
import { RadioGroup, RadioGroupItem } from "./components/radio-group.js";
import { SegmentedControl, SegmentedControlItem } from "./components/segmented-control.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/select.js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./components/sheet.js";
import { Slider } from "./components/slider.js";
import { Switch } from "./components/switch.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs.js";
import { TextEffect } from "./components/text-effect.js";
import { Textarea } from "./components/textarea.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/tooltip.js";

/**
 * Server-rendering smoke gate for the @kronus-ui/ui public surface.
 *
 * This runs in the Node ("ui") vitest project — a real server-side environment
 * (no DOM) — so `renderToString` here mirrors what Next.js / RSC consumers do
 * when they render a page on the server. A component that reaches for `window`,
 * `document`, a layout effect's DOM, or a hook in a way that's unsafe at render
 * time will THROW here, and that throw fails CI.
 *
 * Why `createElement` and not JSX: the file is intentionally `.test.ts` (not
 * `.test.tsx`) so vitest picks it up in the Node `ui` project — the project
 * that actually has no DOM. The `.ts` transform does not parse JSX literals, so
 * elements are constructed with the `h` (createElement) alias instead. Behaviour
 * is identical; only the syntax differs.
 *
 * Coverage bias: we deliberately favour the components with real SSR risk —
 * anything using hooks/refs/motion/`useId`/portals — and render a *valid*
 * instance of each (correct required props, children, and any context provider
 * the component needs). Overlay components (Dialog/Sheet/Popover/Tooltip/
 * MorphingPopover) render in their default-closed state: the SSR-relevant part
 * is the trigger + provider wiring; their content is portalled only once opened
 * in a browser, so we mount the closed root (the realistic server output).
 *
 * The assertion for every case is the same two-part contract:
 *   (a) renderToString does NOT throw, and
 *   (b) it returns non-empty markup.
 */

/** Render to a string; surfaces the throw with the case label if it fails. */
function renderCase(label: string, node: ReactNode): string {
  try {
    return renderToString(h(Fragment, null, node));
  } catch (err) {
    throw new Error(
      `SSR threw while rendering "${label}": ${err instanceof Error ? (err.stack ?? err.message) : String(err)}`,
    );
  }
}

type Person = { id: number; name: string; role: string };

const DATA_TABLE_ROWS: Person[] = [
  { id: 1, name: "Ada Lovelace", role: "Engineer" },
  { id: 2, name: "Alan Turing", role: "Researcher" },
];

const DATA_TABLE_COLUMNS: ColumnDef<Person, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];

/**
 * Each entry is a representative, VALID instance of one public component (or a
 * small composition where the component only makes sense with its parts).
 * `min` is the minimum markup length we expect so an "empty string but no
 * throw" regression (e.g. a component that bails to `null` on the server) is
 * still caught.
 */
const CASES: ReadonlyArray<{ label: string; node: ReactNode; min?: number }> = [
  // ── Foundation / display ──────────────────────────────────────────
  { label: "Button", node: h(Button, null, "Save profile") },
  { label: "Button asChild", node: h(Button, { asChild: true }, h("a", { href: "/x" }, "Link")) },
  { label: "Badge", node: h(Badge, { variant: "primary" }, "New") },
  {
    label: "Alert",
    node: h(
      Alert,
      { variant: "info" },
      h(AlertTitle, null, "Heads up"),
      h(AlertDescription, null, "Something happened."),
    ),
  },
  {
    label: "Card",
    node: h(
      Card,
      null,
      h(CardHeader, null, h(CardTitle, null, "Title"), h(CardDescription, null, "Description")),
      h(CardContent, null, "Body"),
    ),
  },
  { label: "Avatar", node: h(Avatar, null, h(AvatarFallback, null, "AL")) },
  {
    label: "Metric",
    node: h(
      Metric,
      null,
      h(MetricLabel, null, "Revenue"),
      h(MetricValue, null, "R$ 12.430"),
      h(MetricDelta, { trend: "up" }, "+12%"),
    ),
  },
  { label: "Progress", node: h(Progress, { value: 42 }) },

  // ── Forms (hooks/refs) ────────────────────────────────────────────
  { label: "Input", node: h(Input, { defaultValue: "hello", placeholder: "Name" }) },
  { label: "Textarea", node: h(Textarea, { defaultValue: "multi\nline" }) },
  {
    label: "Label + Checkbox",
    node: h(Fragment, null, h(Checkbox, { id: "agree" }), h(Label, { htmlFor: "agree" }, "Agree")),
  },
  { label: "Switch", node: h(Switch, { "aria-label": "Toggle" }) },
  { label: "Slider", node: h(Slider, { defaultValue: [40], "aria-label": "Volume" }) },
  {
    label: "RadioGroup",
    node: h(
      RadioGroup,
      { defaultValue: "a" },
      h(RadioGroupItem, { value: "a", id: "ra" }),
      h(RadioGroupItem, { value: "b", id: "rb" }),
    ),
  },

  // ── Overlays — render closed (trigger + provider is the SSR surface) ─
  {
    label: "Dialog (closed)",
    node: h(
      Dialog,
      null,
      h(DialogTrigger, null, "Open dialog"),
      h(DialogContent, null, h(DialogTitle, null, "Title"), h(DialogDescription, null, "Desc")),
    ),
  },
  {
    label: "Sheet (closed)",
    node: h(
      Sheet,
      null,
      h(SheetTrigger, null, "Open sheet"),
      h(SheetContent, null, h(SheetTitle, null, "Title"), h(SheetDescription, null, "Desc")),
    ),
  },
  {
    label: "Popover (closed)",
    node: h(
      Popover,
      null,
      h(PopoverTrigger, null, "Open popover"),
      h(PopoverContent, null, "Content"),
    ),
  },
  {
    label: "Tooltip (closed)",
    node: h(Tooltip, null, h(TooltipTrigger, null, "Hover me"), h(TooltipContent, null, "Tip")),
  },

  // ── Disclosure / navigation (Radix + useId) ───────────────────────
  {
    label: "Accordion",
    node: h(
      Accordion,
      { type: "single", collapsible: true },
      h(
        AccordionItem,
        { value: "item-1" },
        h(AccordionTrigger, null, "Section one"),
        h(AccordionContent, null, "Panel one"),
      ),
    ),
  },
  {
    label: "Tabs",
    node: h(
      Tabs,
      { defaultValue: "a" },
      h(TabsList, null, h(TabsTrigger, { value: "a" }, "A"), h(TabsTrigger, { value: "b" }, "B")),
      h(TabsContent, { value: "a" }, "Panel A"),
      h(TabsContent, { value: "b" }, "Panel B"),
    ),
  },
  {
    label: "Select (closed)",
    node: h(
      Select,
      null,
      h(SelectTrigger, null, h(SelectValue, { placeholder: "Pick one" })),
      h(SelectContent, null, h(SelectItem, { value: "a" }, "Option A")),
    ),
  },

  // ── Premium / animated (motion, useId, layout) ────────────────────
  {
    label: "AnimatedNumber",
    node: h(AnimatedNumber, { value: 1234, locale: "en-US" }),
    // It must render its formatted initial value on the server (no flash).
    min: 4,
  },
  {
    label: "TextEffect (mount trigger)",
    node: h(TextEffect, { trigger: "mount", per: "word" }, "Ship it"),
    // aria-label carries the whole string even when units are split.
    min: 4,
  },
  {
    label: "SegmentedControl",
    node: h(
      SegmentedControl,
      { defaultValue: "list", "aria-label": "View" },
      h(SegmentedControlItem, { value: "list" }, "List"),
      h(SegmentedControlItem, { value: "grid" }, "Grid"),
    ),
  },
  {
    label: "MorphingPopover (closed)",
    node: h(
      MorphingPopover,
      null,
      h(MorphingPopoverTrigger, null, "Add"),
      h(MorphingPopoverContent, null, "Body"),
    ),
  },
  {
    label: "Carousel",
    node: h(
      Carousel,
      null,
      h(CarouselContent, null, h(CarouselItem, null, "Slide 1"), h(CarouselItem, null, "Slide 2")),
      h(CarouselPrevious, null),
      h(CarouselNext, null),
    ),
  },

  // ── Data-heavy (TanStack Table, many hooks) ───────────────────────
  {
    label: "DataTable (tiny dataset)",
    node: h(DataTable<Person, unknown>, {
      columns: DATA_TABLE_COLUMNS,
      data: DATA_TABLE_ROWS,
      searchable: true,
      pagination: true,
    }),
    // Should render the two seeded rows' cell text.
    min: 20,
  },
];

describe("SSR smoke (renderToString) — public components render on the server", () => {
  it.each(CASES)("$label renders without throwing and emits markup", ({ label, node, min }) => {
    const html = renderCase(label, node);
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThanOrEqual(min ?? 1);
  });

  it("DataTable SSR markup includes the seeded row data", () => {
    const html = renderCase(
      "DataTable content",
      h(DataTable<Person, unknown>, { columns: DATA_TABLE_COLUMNS, data: DATA_TABLE_ROWS }),
    );
    expect(html).toContain("Ada Lovelace");
    expect(html).toContain("Researcher");
  });

  it("AnimatedNumber renders its formatted initial value (no zero-flash)", () => {
    const html = renderCase(
      "AnimatedNumber initial",
      h(AnimatedNumber, { value: 1234, locale: "en-US" }),
    );
    // en-US grouping → "1,234"; assert the grouped value made it into the SSR string.
    expect(html).toContain("1,234");
  });

  it("TextEffect exposes the full string to assistive tech in its SSR output", () => {
    const html = renderCase(
      "TextEffect label",
      h(TextEffect, { trigger: "mount" }, "Kronus ships fast"),
    );
    // The split (animated) units are aria-hidden; the whole string is exposed
    // once via a visually-hidden sr-only span, so AT reads clean text on the
    // server-rendered DOM (no per-word chatter, no missing label).
    expect(html).toContain('class="sr-only">Kronus ships fast<');
    expect(html).toContain('aria-hidden="true"');
  });
});
