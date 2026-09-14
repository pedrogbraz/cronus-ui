import { expect, type FrameLocator, type Locator, type Page, test } from "@playwright/test";
import { cronusFrame, FREEZE_CSS, freezeFrame } from "./audit-freeze";

/**
 * Wave 1s — React-vs-Cronus geometry parity.
 *
 * `parity.visual.spec.ts` only compares the Cronus iframe against its own PNG
 * baseline. This spec measures both panes of `/audit/{family}` in the same
 * browser and pairs every `[data-slot]` element by slot + occurrence index:
 * rect (relative to its canvas), typography, colors (normalized through a 1x1
 * 2d canvas so React `lab()` and kernel `oklch()` compare as rgba), radius,
 * border width and visible text.
 *
 * Tolerances are fixed. Do not loosen them or skip a family to go green —
 * fix the kernel (or the fixture) instead.
 */

const RECT_TOLERANCE_PX = 1;
const COLOR_TOLERANCE = 2;
const SETTLE_ATTEMPTS = 20;

const FAMILIES = [
  "logo-carousel",
  "flip-card",
  "orbit",
  "motion-presets",
  "progressive-blur",
  "input-otp",
  "time-picker",
  "multi-select",
  "dock",
  "form",
  "segmented-control",
  "text-shimmer",
  "text-effect",
  "timeline",
  "code-block",
  "card-stack",
] as const;

type Family = (typeof FAMILIES)[number];

/**
 * React-only slots that need a JS runtime the zero-JS audit kernel document
 * deliberately does not ship. Each entry must say why. Only the slot multiset
 * check skips these; everything that both sides render is still compared.
 */
const REACT_ONLY_SLOTS: Partial<Record<Family, Record<string, string>>> = {
  "code-block": {
    // CopyButton writes to navigator.clipboard on click. The audit kernel document
    // is zero-JS by contract (src/ui/audit_layout.rs), and cronus_ui_code_block.rs
    // documents "No copy button: it would need JS" (asserted by its tests).
    // Only the slot is exempt: the header it sits in is still measured, so the
    // missing 32px button still shows up through filename/language placement.
    "copy-button": "clipboard copy needs a JS runtime; kernel audit document ships zero JS",
  },
};

interface PortalSpec {
  /** Slot the floating rects are measured against, on both sides. */
  anchor: string;
  /** Content root slot; its whole [data-slot] subtree is anchor-relative. */
  root: string;
  /** Family slot prefix: matching slots outside the canvas (React portal) are anchor-relative too. */
  prefix: string;
  /** Selector that proves the React popover has mounted (React side only). */
  ready: string;
}

/** Families whose floating content is portaled out of the React canvas. */
const PORTAL: Partial<Record<Family, PortalSpec>> = {
  "multi-select": {
    anchor: "multi-select-trigger",
    root: "multi-select-content",
    prefix: "multi-select-",
    // cmdk CommandItem is role=option inside the Radix popover portal.
    ready: '[role="option"], [data-slot="multi-select-content"]',
  },
};

interface Measured {
  slot: string;
  tag: string;
  /** "canvas" or the anchor slot the rect is relative to. */
  origin: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  font: "mono" | "sans";
  color: number[];
  background: number[];
  radius: string;
  border: string;
  text: string;
}

async function freezeReact(page: Page): Promise<void> {
  await page.addStyleTag({ content: FREEZE_CSS });
}

/** Runs inside the page/frame. Must be self-contained (serialized by Playwright). */
function measureInPage(canvas: Element, opts: { portal: PortalSpec | null }): Measured[] {
  const doc = canvas.ownerDocument;
  const paint = doc.createElement("canvas");
  paint.width = 1;
  paint.height = 1;
  const ctx = paint.getContext("2d", { willReadFrequently: true });

  const rgba = (value: string): number[] => {
    if (!ctx) return [-1, -1, -1, -1];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data);
  };
  const round = (n: number) => Math.round(n * 100) / 100;
  const text = (el: Element) =>
    ((el as HTMLElement).innerText ?? el.textContent ?? "").replace(/\s+/g, " ").trim();

  const describe = (el: Element, origin: DOMRect, originName: string): Measured => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    // Used radius, not the specified one: `rounded-full` computes to 3.35544e+07px
    // in React and `9999px` in the kernel, but both clamp to half the short side.
    const cap = Math.min(r.width, r.height) / 2;
    const usedRadius = (value: string) =>
      `${round(Math.min(Number.parseFloat(value) || 0, cap))}px`;
    return {
      slot: el.getAttribute("data-slot") ?? "",
      tag: el.tagName.toLowerCase(),
      origin: originName,
      x: round(r.left - origin.left),
      y: round(r.top - origin.top),
      w: round(r.width),
      h: round(r.height),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      font: /mono|menlo|consolas|courier|monaco/i.test(cs.fontFamily) ? "mono" : "sans",
      color: rgba(cs.color),
      background: rgba(cs.backgroundColor),
      radius: [
        cs.borderTopLeftRadius,
        cs.borderTopRightRadius,
        cs.borderBottomRightRadius,
        cs.borderBottomLeftRadius,
      ]
        .map(usedRadius)
        .join(" "),
      border: [
        cs.borderTopWidth,
        cs.borderRightWidth,
        cs.borderBottomWidth,
        cs.borderLeftWidth,
      ].join(" "),
      text: text(el),
    };
  };

  const canvasRect = canvas.getBoundingClientRect();
  const portal = opts.portal;
  const portalRoots = portal
    ? Array.from(doc.querySelectorAll(`[data-slot="${portal.root}"]`))
    : [];
  const inPortal = (el: Element) => portalRoots.some((root) => root.contains(el));
  const isFloating = (el: Element) =>
    inPortal(el) ||
    (!!portal &&
      !canvas.contains(el) &&
      (el.getAttribute("data-slot") ?? "").startsWith(portal.prefix));

  // Geometry parity is about rendered boxes: an element with no layout box
  // (display:none, closed popover markup) has nothing to measure on either side.
  // DOM presence of closed content is the logic spec's job, not this one.
  const rendered = (el: Element) => el.getClientRects().length > 0;

  const out: Measured[] = [];
  for (const el of Array.from(canvas.querySelectorAll("[data-slot]"))) {
    if (inPortal(el) || !rendered(el)) continue;
    out.push(describe(el, canvasRect, "canvas"));
  }
  if (portal) {
    // Floating content: React portals it to <body>, the kernel keeps it in the
    // canvas. Measure both against the trigger so placement is comparable.
    const anchor = canvas.querySelector(`[data-slot="${portal.anchor}"]`);
    const anchorRect = anchor ? anchor.getBoundingClientRect() : canvasRect;
    const anchorName = anchor ? portal.anchor : "canvas(no-anchor)";
    for (const el of Array.from(doc.querySelectorAll("[data-slot]"))) {
      if (!isFloating(el) || !rendered(el)) continue;
      out.push(describe(el, anchorRect, anchorName));
    }
  }
  return out;
}

async function nextFrames(locator: Locator): Promise<void> {
  await locator.evaluate(
    (el) =>
      new Promise<void>((resolve) => {
        const win = el.ownerDocument.defaultView ?? window;
        win.requestAnimationFrame(() => win.requestAnimationFrame(() => resolve()));
      }),
  );
}

/**
 * Measure until two consecutive reads are identical, so JS-driven motion
 * (not stopped by FREEZE_CSS) has settled. Bounded, frame-based — no sleeps.
 */
async function measureSettled(canvas: Locator, portal: PortalSpec | null): Promise<Measured[]> {
  await canvas.evaluate((el) => el.ownerDocument.fonts.ready.then(() => undefined));
  let previous = "";
  let last: Measured[] = [];
  for (let i = 0; i < SETTLE_ATTEMPTS; i++) {
    await nextFrames(canvas);
    last = await canvas.evaluate(measureInPage, { portal });
    const key = JSON.stringify(last);
    if (key === previous) return last;
    previous = key;
  }
  return last;
}

function occurrenceKeys(items: Measured[]): Map<string, Measured> {
  const counts = new Map<string, number>();
  const map = new Map<string, Measured>();
  for (const item of items) {
    const n = counts.get(item.slot) ?? 0;
    counts.set(item.slot, n + 1);
    map.set(`${item.slot}#${n}`, item);
  }
  return map;
}

function colorDelta(a: number[], b: number[]): number {
  return Math.max(...a.map((v, i) => Math.abs(v - (b[i] ?? 0))));
}

const fmtRect = (m: Measured) => `${m.x},${m.y} ${m.w}x${m.h}`;
const fmtColor = (c: number[]) => `rgba(${c.join(",")})`;

function compareFamily(family: Family, react: Measured[], cronus: Measured[]): string[] {
  const allow = REACT_ONLY_SLOTS[family] ?? {};
  const problems: string[] = [];
  const rows: string[][] = [];
  const reactKeys = occurrenceKeys(react);
  const cronusKeys = occurrenceKeys(cronus);
  const keys = [...new Set([...reactKeys.keys(), ...cronusKeys.keys()])];

  for (const key of keys) {
    const r = reactKeys.get(key);
    const c = cronusKeys.get(key);
    if (!r || !c) {
      const slot = (r ?? c)?.slot ?? key;
      if (r && !c && slot in allow) continue;
      problems.push(`${key}: ${r ? "missing in Cronus" : "missing in React"}`);
      rows.push([
        key,
        "slot",
        r ? `${r.tag} ${fmtRect(r)}` : "—",
        c ? `${c.tag} ${fmtRect(c)}` : "—",
      ]);
      continue;
    }
    const diff = (field: string, rv: string, cv: string) => {
      problems.push(`${key}.${field}`);
      rows.push([key, field, rv, cv]);
    };
    if (r.tag !== c.tag) diff("tag", r.tag, c.tag);
    if (r.origin !== c.origin) diff("origin", r.origin, c.origin);
    const dx = Math.abs(r.x - c.x);
    const dy = Math.abs(r.y - c.y);
    const dw = Math.abs(r.w - c.w);
    const dh = Math.abs(r.h - c.h);
    if (Math.max(dx, dy, dw, dh) > RECT_TOLERANCE_PX) {
      diff(`rect Δ${round1(dx)},${round1(dy)},${round1(dw)},${round1(dh)}`, fmtRect(r), fmtRect(c));
    }
    if (r.fontSize !== c.fontSize) diff("fontSize", r.fontSize, c.fontSize);
    if (r.fontWeight !== c.fontWeight) diff("fontWeight", r.fontWeight, c.fontWeight);
    if (r.lineHeight !== c.lineHeight) diff("lineHeight", r.lineHeight, c.lineHeight);
    if (r.font !== c.font) diff("font", r.font, c.font);
    if (colorDelta(r.color, c.color) > COLOR_TOLERANCE)
      diff("color", fmtColor(r.color), fmtColor(c.color));
    if (colorDelta(r.background, c.background) > COLOR_TOLERANCE)
      diff("background", fmtColor(r.background), fmtColor(c.background));
    if (r.radius !== c.radius) diff("radius", r.radius, c.radius);
    if (r.border !== c.border) diff("border", r.border, c.border);
    if (r.text !== c.text) diff("text", JSON.stringify(r.text), JSON.stringify(c.text));
  }

  if (problems.length > 0) {
    const header = ["slot#n", "field", "React", "Cronus"];
    const widths = header.map((h, i) =>
      Math.min(48, Math.max(h.length, ...rows.map((row) => (row[i] ?? "").length))),
    );
    const line = (cells: string[]) =>
      `| ${cells.map((cell, i) => cell.slice(0, 48).padEnd(widths[i] ?? 0)).join(" | ")} |`;
    const table = [line(header), line(widths.map((w) => "-".repeat(w))), ...rows.map(line)];
    console.log(`\n[geometry] ${family}: ${problems.length} mismatch(es)\n${table.join("\n")}`);
    problems.unshift(table.join("\n"));
  }
  return problems;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

async function openBothPanes(
  page: Page,
  family: Family,
): Promise<{ react: Locator; frame: FrameLocator; cronus: Locator }> {
  await page.goto(`/audit/${family}?fixture=default&preset=aurora&mode=dark`);
  const react = page.locator('[data-audit-side="react"] [data-audit-canvas]');
  const frame = cronusFrame(page);
  const cronus = frame.locator("[data-audit-canvas]");
  await expect(react).toBeVisible();
  await expect(cronus).toBeVisible();
  const portal = PORTAL[family];
  if (portal) {
    // Gate on the React popover having mounted, not on a specific slot name:
    // a missing content slot must surface as a parity mismatch, not a timeout.
    await expect(page.locator(portal.ready).first()).toBeVisible();
  }
  await freezeReact(page);
  await freezeFrame(frame);
  return { react, frame, cronus };
}

test.describe("geometry parity (React vs Cronus)", () => {
  for (const family of FAMILIES) {
    test(`${family} default aurora/dark`, async ({ page }) => {
      const { react, cronus } = await openBothPanes(page, family);
      const portal = PORTAL[family] ?? null;
      const reactMeasured = await measureSettled(react, portal);
      const cronusMeasured = await measureSettled(cronus, portal);
      expect(reactMeasured.length, "React canvas has no [data-slot] elements").toBeGreaterThan(0);
      const problems = compareFamily(family, reactMeasured, cronusMeasured);
      expect(problems, problems[0] ?? "").toEqual([]);
    });
  }
});
