import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  type Browser,
  expect,
  type FrameLocator,
  type Locator,
  type Page,
  test,
} from "@playwright/test";
import { cronusFrame, FREEZE_CSS, freezeFrame } from "./audit-freeze";

/**
 * Wave 1s — React-vs-Cronus geometry parity.
 *
 * `parity.visual.spec.ts` only compares the Cronus iframe against its own PNG
 * baseline. This spec measures both panes of `/audit/{family}?fixture={id}` in
 * the same browser, for EVERY fixture of every family, and pairs every
 * `[data-slot]` element by slot + occurrence index: rect (relative to its
 * canvas), typography, colors (normalized through a 1x1 2d canvas so React
 * `lab()` and kernel `oklch()` compare as rgba), radius, border width and
 * visible text. Those checks fail the test.
 *
 * Report-only style props (fail only with AUDIT_STRICT_PROPS=1): effective
 * opacity, per-side border colors, box-shadow, background-image, outline,
 * letter-spacing, text-transform, visibility and, for svg/path/circle/rect
 * slots, fill/stroke/stroke-width. They are attached as a `audit-props`
 * annotation, printed as a table and written to
 * `test-results/audit-geometry/<family>-<fixture>.json`.
 *
 * Tolerances are fixed. Do not loosen them or skip a family to go green —
 * fix the kernel (or the fixture) instead.
 */

const RECT_TOLERANCE_PX = 1;
const COLOR_TOLERANCE = 2;
const OPACITY_TOLERANCE = 0.01;
const SETTLE_ATTEMPTS = 20;
const STRICT_PROPS = process.env.AUDIT_STRICT_PROPS === "1";

const REPO_ROOT = join(__dirname, "..", "..");
const FIXTURES_ROOT = join(REPO_ROOT, "packages", "audit", "fixtures");
const REPORT_DIR = join(REPO_ROOT, "test-results", "audit-geometry");

type Family = string;

interface AuditCase {
  family: Family;
  fixture: string;
}

/** Every fixture of every audited family (packages/audit/fixtures/<family>/<id>.json). */
const CASES: AuditCase[] = readdirSync(FIXTURES_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
  .map((entry) => entry.name)
  .sort()
  .flatMap((family) =>
    readdirSync(join(FIXTURES_ROOT, family))
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.slice(0, -".json".length))
      .sort()
      .map((fixture) => ({ family, fixture })),
  );

/** Lookup keyed by `family/fixture` first, then by `family`. */
function specFor<T>(table: Partial<Record<string, T>>, c: AuditCase): T | undefined {
  return table[`${c.family}/${c.fixture}`] ?? table[c.family];
}

/**
 * React-only slots that need a JS runtime the zero-JS audit kernel document
 * deliberately does not ship. Each entry must say why. Only the slot multiset
 * check skips these; everything that both sides render is still compared.
 */
const REACT_ONLY_SLOTS: Partial<Record<Family, Record<string, string>>> = {
  // Intentionally empty. Controls whose behaviour needs JS (copy, open/close,
  // navigation, playback) are emitted by the kernel as the same native element
  // with `disabled`, so every React slot is compared.
};

/**
 * Cronus-only slots that exist because the zero-JS kernel keeps floating content
 * in the canvas instead of portaling it. Each entry must say why.
 */
const CRONUS_ONLY_SLOTS: Partial<Record<Family, Record<string, string>>> = {
  "multi-select": {
    // React portals the popover to <body> and Radix positions it with JS. The
    // kernel has no popper, so a position:relative wrapper (same rect as the
    // trigger) anchors the absolutely positioned content under the trigger.
    "multi-select": "kernel-only anchor for in-canvas popover content (no JS popper)",
  },
};

interface PortalSpec {
  /** Slot the floating content rects are measured against, on both sides. */
  anchor: string;
  /** Content root slot; its whole [data-slot] subtree is anchor-relative. */
  root: string;
  /** Family slot prefix: matching slots outside the canvas (React portal) are anchor-relative too. */
  prefix: string;
  /** Ancestor containers of `root`, measured against `containerAnchor`; height exempt (see PORTAL). */
  containers: string[];
  containerAnchor: string;
  /** Selector that proves the React popover has mounted (React side only). */
  ready: string;
}

/** Families whose floating content is portaled out of the React canvas. */
const PORTAL: Partial<Record<Family, PortalSpec>> = {
  "multi-select": {
    // Above the listbox React renders cmdk's search row (command-input-wrapper,
    // 41px). It filters with JS and is deliberately absent from the zero-JS
    // kernel (a non-filtering input would be a dead control). So the listbox,
    // options and indicators are measured against command-list and compared
    // exactly; popover-content / command are measured against the trigger and
    // compared for position (4px below the trigger), width, colours, radius and
    // border — only their height is exempt, because in React it includes that row.
    anchor: "command-list",
    root: "command-list",
    prefix: "multi-select-",
    containers: ["popover-content", "command"],
    containerAnchor: "multi-select-trigger",
    // cmdk CommandItem is role=option inside the Radix popover portal.
    ready: '[role="option"]',
  },
  "context-menu": {
    // Radix ContextMenu opens at the pointer: with the fixture's `open` prop and
    // no contextmenu event the virtual anchor is the viewport origin, so its
    // page position says nothing about the component. The content is portaled
    // to <body>, and ContextMenuTrigger (a bare Radix span) carries no
    // data-slot. So the content root is its own anchor: its size, colours,
    // radius and border, and every item's rect inside it, are compared exactly;
    // only the root's x/y (the pointer position) is 0,0 on both sides by construction.
    anchor: "context-menu-content",
    root: "context-menu-content",
    prefix: "context-menu-",
    containers: [],
    containerAnchor: "context-menu-content",
    ready: '[role="menu"]',
  },
  autocomplete: {
    // Radix popover + cmdk portal the list to <body>; the kernel keeps it in the
    // canvas, absolutely positioned 4px under the input. There is no cmdk search
    // row (the input is autocomplete-input itself), so no height-exempt
    // containers: everything is compared exactly against the input.
    anchor: "autocomplete-input",
    root: "autocomplete-content",
    prefix: "autocomplete-",
    containers: [],
    containerAnchor: "autocomplete-input",
    ready: '[role="option"]',
  },
};

interface ReadySpec {
  /** Wait for this selector inside the React pane before freezing. */
  selector?: string;
  /**
   * The React side keeps moving after FREEZE_CSS (JS-driven animation), so
   * measureSettled records the non-settling read as an annotation instead of throwing.
   */
  animates?: boolean;
  /** Why the entry exists. Required. */
  reason: string;
}

/**
 * Families (key `family` or `family/fixture`) whose React content mounts after
 * an entrance animation, or that legitimately never settle. Anything not listed
 * here must settle within SETTLE_ATTEMPTS reads, or measureSettled throws.
 */
const READY: Partial<Record<string, ReadySpec>> = {
  "funnel-chart": {
    selector: ".recharts-label-list text",
    reason: "recharts Funnel mounts its LabelList only once isAnimationActive finishes",
  },
};

interface OverlaySpec {
  /**
   * Viewport-fixed slots React portals to <body> (overlay scrim + content).
   * Their whole [data-slot] subtree is measured against the viewport origin.
   */
  roots: string[];
}

/**
 * Modal families: React renders `position: fixed` overlays (inset-0 scrim, a
 * centred / edge-pinned content panel) portaled out of the canvas. Their
 * geometry is a function of the viewport only, not of the canvas, and the two
 * panes do not share a viewport: the React page is 1280x900, the kernel
 * document lives in a (640x777) iframe. So the kernel is measured as usual and
 * React is measured in a second page whose viewport is exactly the kernel
 * iframe's window size. Both sides then report these subtrees against the
 * same-sized viewport origin, and every rect/typography/colour check applies
 * unchanged (no tolerance or field exemption). Same window width also means
 * the same `sm:` breakpoint state on both sides.
 *
 * Every fixture here is open by default (`defaultOpen` / `open` forced in
 * react-fixture-render.tsx), none renders a trigger, so the canvas is empty in
 * React; a kernel slot rendered in-flow in its canvas and not under a root
 * surfaces as "missing in React", which is the real difference.
 */
const OVERLAY: Partial<Record<Family, OverlaySpec>> = {
  "alert-dialog": { roots: ["alert-dialog-overlay", "alert-dialog-content"] },
  // ConfirmationDialog is AlertDialogContent with data-slot="confirmation-dialog".
  "confirmation-dialog": { roots: ["alert-dialog-overlay", "confirmation-dialog"] },
  // Radix Dialog (fixture forces defaultOpen, no trigger): overlay + centred content.
  dialog: { roots: ["dialog-overlay", "dialog-content"] },
  // vaul Drawer: overlay + bottom-pinned content (shouldScaleBackground=false).
  drawer: { roots: ["drawer-overlay", "drawer-content"] },
  // InviteDialog is DialogContent with data-slot="invite-dialog".
  "invite-dialog": { roots: ["dialog-overlay", "invite-dialog"] },
  // Lightbox is a full-viewport DialogContent wrapping [data-slot=lightbox].
  lightbox: { roots: ["dialog-overlay", "dialog-content"] },
  sheet: { roots: ["sheet-overlay", "sheet-content"] },
};

/** Proves a React modal has mounted (Radix Dialog / AlertDialog / vaul). */
const OVERLAY_READY = '[role="dialog"], [role="alertdialog"]';

interface SvgPaint {
  fill: string;
  stroke: string;
  strokeWidth: string;
}

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
  // Report-only (AUDIT_STRICT_PROPS=1 makes them fail).
  /** Product of `opacity` from the box up to the canvas (or the document root). */
  opacity: number;
  /** top, right, bottom, left — rgba. */
  borderColors: number[][];
  boxShadow: string;
  backgroundImage: string;
  outlineStyle: string;
  outlineWidth: string;
  outlineColor: number[];
  letterSpacing: string;
  textTransform: string;
  visibility: string;
  /** Only for svg / path / circle / rect slots. */
  svg: SvgPaint | null;
}

async function freezeReact(page: Page): Promise<void> {
  await page.addStyleTag({ content: FREEZE_CSS });
}

/** Runs inside the page/frame. Must be self-contained (serialized by Playwright). */
function measureInPage(
  canvas: Element,
  opts: { portal: PortalSpec | null; overlay: OverlaySpec | null },
): Measured[] {
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
  // Colors inside compound values (shadows, gradients, fill) → rgba(r,g,b,a);
  // px lengths → whole px. Gradients are then compared as strings.
  const colorFn = /(?:rgba?|hsla?|hwb|oklab|oklch|lab|lch|color)\([^()]*\)|#[0-9a-f]{3,8}\b/gi;
  const normalize = (value: string) =>
    value
      .replace(colorFn, (m) => `rgba(${rgba(m).join(",")})`)
      .replace(/\btransparent\b/g, "rgba(0,0,0,0)")
      .replace(/-?\d*\.?\d+(?:e[-+]?\d+)?px/gi, (m) => `${Math.round(Number.parseFloat(m))}px`)
      .replace(/\s+/g, " ")
      .trim();
  const SVG_TAGS = new Set(["svg", "path", "circle", "rect"]);

  // A `display: contents` slot generates no box of its own: what paints is its
  // content. When exactly one element child has a box (e.g. ShinyText's
  // <span data-slot="shiny-text" class="contents"><style/><span>…</span></span>),
  // that child IS the slot's rendered box, so rect and computed style come from
  // it while slot/tag/text stay the slot's. Zero or several boxed children stay
  // unmeasured (no invented union box).
  const boxOf = (el: Element): Element | null => {
    if (el.getClientRects().length > 0) return el;
    if (getComputedStyle(el).display !== "contents") return null;
    const boxed = Array.from(el.children).filter((child) => child.getClientRects().length > 0);
    return boxed.length === 1 ? (boxed[0] ?? null) : null;
  };

  const effectiveOpacity = (box: Element): number => {
    let product = 1;
    for (let node: Element | null = box; node; node = node.parentElement) {
      product *= Number.parseFloat(getComputedStyle(node).opacity) || 0;
      if (node === canvas) break;
    }
    return round(product);
  };

  const describe = (
    el: Element,
    origin: { left: number; top: number },
    originName: string,
  ): Measured => {
    const box = boxOf(el) ?? el;
    const r = box.getBoundingClientRect();
    const cs = getComputedStyle(box);
    // Used radius, not the specified one: `rounded-full` computes to 3.35544e+07px
    // in React and `9999px` in the kernel, but both clamp to half the short side.
    const cap = Math.min(r.width, r.height) / 2;
    const usedRadius = (value: string) =>
      `${round(Math.min(Number.parseFloat(value) || 0, cap))}px`;
    const tag = el.tagName.toLowerCase();
    return {
      slot: el.getAttribute("data-slot") ?? "",
      tag,
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
      opacity: effectiveOpacity(box),
      borderColors: [
        cs.borderTopColor,
        cs.borderRightColor,
        cs.borderBottomColor,
        cs.borderLeftColor,
      ].map(rgba),
      boxShadow: normalize(cs.boxShadow),
      backgroundImage: normalize(cs.backgroundImage),
      outlineStyle: cs.outlineStyle,
      outlineWidth: normalize(cs.outlineWidth),
      outlineColor: rgba(cs.outlineColor),
      letterSpacing: normalize(cs.letterSpacing),
      textTransform: cs.textTransform,
      visibility: cs.visibility,
      svg: SVG_TAGS.has(tag)
        ? {
            fill: normalize(cs.fill).replace(/url\([^)]*\)/g, "url"),
            stroke: normalize(cs.stroke).replace(/url\([^)]*\)/g, "url"),
            strokeWidth: normalize(cs.strokeWidth),
          }
        : null,
    };
  };

  const canvasRect = canvas.getBoundingClientRect();
  const portal = opts.portal;
  const portalRoots = portal
    ? Array.from(doc.querySelectorAll(`[data-slot="${portal.root}"]`))
    : [];
  const containerEls = portal
    ? portal.containers.flatMap((slot) =>
        Array.from(doc.querySelectorAll(`[data-slot="${slot}"]`)).filter((el) =>
          portalRoots.some((root) => el.contains(root)),
        ),
      )
    : [];
  const inPortal = (el: Element) =>
    portalRoots.some((root) => root.contains(el)) || containerEls.includes(el);
  const isFloating = (el: Element) =>
    inPortal(el) ||
    (!!portal &&
      !canvas.contains(el) &&
      (el.getAttribute("data-slot") ?? "").startsWith(portal.prefix));

  // Geometry parity is about rendered boxes: an element with no layout box
  // (display:none, closed popover markup) has nothing to measure on either side.
  // DOM presence of closed content is the logic spec's job, not this one.
  const rendered = (el: Element) => boxOf(el) !== null;

  const overlayRoots = opts.overlay
    ? opts.overlay.roots.flatMap((slot) =>
        Array.from(doc.querySelectorAll(`[data-slot="${slot}"]`)),
      )
    : [];
  const inOverlay = (el: Element) => overlayRoots.some((root) => root.contains(el));

  const out: Measured[] = [];
  for (const el of Array.from(canvas.querySelectorAll("[data-slot]"))) {
    if (inPortal(el) || inOverlay(el) || !rendered(el)) continue;
    out.push(describe(el, canvasRect, "canvas"));
  }
  if (opts.overlay) {
    // Viewport-fixed modal content (see OVERLAY): React portals it to <body>,
    // the kernel may keep it in the canvas. Either way it is measured against
    // the viewport origin of a same-sized window.
    for (const el of Array.from(doc.querySelectorAll("[data-slot]"))) {
      if (!inOverlay(el) || !rendered(el)) continue;
      out.push(describe(el, { left: 0, top: 0 }, "viewport"));
    }
  }
  if (portal) {
    // Floating content: React portals it to <body>, the kernel keeps it in the
    // canvas. Measure both sides against the same anchors so placement is comparable.
    const originOf = (slot: string) => {
      const el =
        canvas.querySelector(`[data-slot="${slot}"]`) ?? doc.querySelector(`[data-slot="${slot}"]`);
      return el
        ? { rect: el.getBoundingClientRect(), name: slot }
        : { rect: canvasRect, name: `canvas(no-${slot})` };
    };
    const contentOrigin = originOf(portal.anchor);
    const containerOrigin = originOf(portal.containerAnchor);
    for (const el of Array.from(doc.querySelectorAll("[data-slot]"))) {
      if (!isFloating(el) || !rendered(el)) continue;
      const origin = containerEls.includes(el) ? containerOrigin : contentOrigin;
      out.push(describe(el, origin.rect, origin.name));
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

/** Field-level differences between two consecutive reads (for settle errors). */
function readDiff(before: Measured[], after: Measured[]): string {
  const a = occurrenceKeys(before);
  const b = occurrenceKeys(after);
  const out: string[] = [];
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    const x = a.get(key);
    const y = b.get(key);
    if (!x || !y) {
      out.push(`${key}: ${x ? "removed" : "added"}`);
      continue;
    }
    for (const field of Object.keys(x) as (keyof Measured)[]) {
      const xv = JSON.stringify(x[field]);
      const yv = JSON.stringify(y[field]);
      if (xv !== yv) out.push(`${key}.${field}: ${xv} -> ${yv}`);
    }
  }
  const shown = out.slice(0, 12).join("; ");
  return out.length > 12 ? `${shown}; (+${out.length - 12} more)` : shown || "(no field diff)";
}

/**
 * Measure until two consecutive reads are identical, so JS-driven motion
 * (not stopped by FREEZE_CSS) has settled. Bounded, frame-based — no sleeps.
 * Throws when it does not settle, unless READY marks the case as animating.
 */
async function measureSettled(
  canvas: Locator,
  portal: PortalSpec | null,
  overlay: OverlaySpec | null,
  ready: ReadySpec | undefined,
  side: string,
): Promise<Measured[]> {
  await canvas.evaluate((el) => el.ownerDocument.fonts.ready.then(() => undefined));
  const reads: Measured[][] = [];
  let previous = "";
  for (let i = 0; i < SETTLE_ATTEMPTS; i++) {
    await nextFrames(canvas);
    const read = await canvas.evaluate(measureInPage, { portal, overlay });
    const key = JSON.stringify(read);
    if (key === previous) return read;
    previous = key;
    reads.push(read);
    if (reads.length > 3) reads.shift();
  }
  const [r0, r1, r2] = reads.length === 3 ? reads : [reads[0], reads[0], reads[1]];
  const diffs = [
    `diff n-2→n-1: ${readDiff(r0 ?? [], r1 ?? [])}`,
    `diff n-1→n: ${readDiff(r1 ?? [], r2 ?? [])}`,
  ].join("\n");
  const message = `${side} did not settle after ${SETTLE_ATTEMPTS} frames (2 rAF per read)\n${diffs}`;
  if (ready?.animates) {
    test.info().annotations.push({
      type: "audit-unsettled",
      description: `${message}\nallowed by READY: ${ready.reason}`,
    });
    return reads[reads.length - 1] ?? [];
  }
  throw new Error(message);
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

type Row = [key: string, field: string, react: string, cronus: string];

function formatTable(rows: Row[]): string {
  const header: Row = ["slot#n", "field", "React", "Cronus"];
  const widths = header.map((h, i) =>
    Math.min(48, Math.max(h.length, ...rows.map((row) => (row[i] ?? "").length))),
  );
  const line = (cells: string[]) =>
    `| ${cells.map((cell, i) => cell.slice(0, 48).padEnd(widths[i] ?? 0)).join(" | ")} |`;
  return [line(header), line(widths.map((w) => "-".repeat(w))), ...rows.map(line)].join("\n");
}

const SIDES = ["top", "right", "bottom", "left"] as const;

/**
 * Visible shadow layers only. Tailwind composes `box-shadow` from ring/shadow
 * variables that default to transparent zero-size layers, while the kernel
 * writes `none`; both paint nothing, so invisible layers are dropped.
 */
function visibleShadow(shadow: string): string {
  if (shadow === "none") return "none";
  const layers: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < shadow.length; i++) {
    const ch = shadow[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) {
      layers.push(shadow.slice(start, i).trim());
      start = i + 1;
    }
  }
  layers.push(shadow.slice(start).trim());
  const visible = layers.filter((layer) => {
    const alpha = /rgba?\([^)]*?,\s*([\d.]+)\s*\)/.exec(layer)?.[1];
    if (alpha !== undefined && Number.parseFloat(alpha) === 0) return false;
    const lengths = (layer.replace(/rgba?\([^)]*\)/g, "").match(/-?[\d.]+px/g) ?? []).map((v) =>
      Number.parseFloat(v),
    );
    return lengths.some((v) => v !== 0);
  });
  return visible.length > 0 ? visible.join(", ") : "none";
}

/** Report-only style props for one matched pair. */
function compareStyleProps(key: string, r: Measured, c: Measured): Row[] {
  const rows: Row[] = [];
  const diff = (field: string, rv: string, cv: string) => {
    rows.push([key, field, rv, cv]);
  };
  if (Math.abs(r.opacity - c.opacity) > OPACITY_TOLERANCE) {
    diff("opacity", String(r.opacity), String(c.opacity));
  }
  const rWidths = r.border.split(" ").map((v) => Number.parseFloat(v) || 0);
  const cWidths = c.border.split(" ").map((v) => Number.parseFloat(v) || 0);
  SIDES.forEach((side, i) => {
    // A side's color is invisible without width on both sides; width parity is
    // already a hard check.
    if ((rWidths[i] ?? 0) === 0 || (cWidths[i] ?? 0) === 0) return;
    const rc = r.borderColors[i] ?? [];
    const cc = c.borderColors[i] ?? [];
    if (colorDelta(rc, cc) > COLOR_TOLERANCE) {
      diff(`borderColor.${side}`, fmtColor(rc), fmtColor(cc));
    }
  });
  const rShadow = visibleShadow(r.boxShadow);
  const cShadow = visibleShadow(c.boxShadow);
  if (rShadow !== cShadow) diff("boxShadow", rShadow, cShadow);
  if (r.backgroundImage !== c.backgroundImage) {
    diff("backgroundImage", r.backgroundImage, c.backgroundImage);
  }
  if (r.outlineStyle !== c.outlineStyle) diff("outlineStyle", r.outlineStyle, c.outlineStyle);
  if (r.outlineStyle !== "none" || c.outlineStyle !== "none") {
    if (r.outlineWidth !== c.outlineWidth) diff("outlineWidth", r.outlineWidth, c.outlineWidth);
    if (colorDelta(r.outlineColor, c.outlineColor) > COLOR_TOLERANCE) {
      diff("outlineColor", fmtColor(r.outlineColor), fmtColor(c.outlineColor));
    }
  }
  if (r.letterSpacing !== c.letterSpacing) diff("letterSpacing", r.letterSpacing, c.letterSpacing);
  if (r.textTransform !== c.textTransform) diff("textTransform", r.textTransform, c.textTransform);
  if (r.visibility !== c.visibility) diff("visibility", r.visibility, c.visibility);
  if (r.svg && c.svg) {
    if (r.svg.fill !== c.svg.fill) diff("fill", r.svg.fill, c.svg.fill);
    if (r.svg.stroke !== c.svg.stroke) diff("stroke", r.svg.stroke, c.svg.stroke);
    if (r.svg.strokeWidth !== c.svg.strokeWidth) {
      diff("strokeWidth", r.svg.strokeWidth, c.svg.strokeWidth);
    }
  }
  return rows;
}

interface Comparison {
  /** Hard mismatches (first entry is the printed table when non-empty). */
  problems: string[];
  rows: Row[];
  /** Report-only style prop mismatches. */
  propRows: Row[];
}

function compareCase(c: AuditCase, react: Measured[], cronus: Measured[]): Comparison {
  const { family } = c;
  const allow = REACT_ONLY_SLOTS[family] ?? {};
  const cronusAllow = CRONUS_ONLY_SLOTS[family] ?? {};
  const heightExempt = new Set(PORTAL[family]?.containers ?? []);
  const problems: string[] = [];
  const rows: Row[] = [];
  const propRows: Row[] = [];
  const reactKeys = occurrenceKeys(react);
  const cronusKeys = occurrenceKeys(cronus);
  const keys = [...new Set([...reactKeys.keys(), ...cronusKeys.keys()])];

  for (const key of keys) {
    const r = reactKeys.get(key);
    const cr = cronusKeys.get(key);
    if (!r || !cr) {
      const slot = (r ?? cr)?.slot ?? key;
      if (r && !cr && slot in allow) continue;
      if (cr && !r && slot in cronusAllow) continue;
      problems.push(`${key}: ${r ? "missing in Cronus" : "missing in React"}`);
      rows.push([
        key,
        "slot",
        r ? `${r.tag} ${fmtRect(r)}` : "—",
        cr ? `${cr.tag} ${fmtRect(cr)}` : "—",
      ]);
      continue;
    }
    const diff = (field: string, rv: string, cv: string) => {
      problems.push(`${key}.${field}`);
      rows.push([key, field, rv, cv]);
    };
    if (r.tag !== cr.tag) diff("tag", r.tag, cr.tag);
    if (r.origin !== cr.origin) diff("origin", r.origin, cr.origin);
    const dx = Math.abs(r.x - cr.x);
    const dy = Math.abs(r.y - cr.y);
    const dw = Math.abs(r.w - cr.w);
    const dh = heightExempt.has(r.slot) ? 0 : Math.abs(r.h - cr.h);
    if (Math.max(dx, dy, dw, dh) > RECT_TOLERANCE_PX) {
      diff(
        `rect Δ${round1(dx)},${round1(dy)},${round1(dw)},${round1(dh)}`,
        fmtRect(r),
        fmtRect(cr),
      );
    }
    if (r.fontSize !== cr.fontSize) diff("fontSize", r.fontSize, cr.fontSize);
    if (r.fontWeight !== cr.fontWeight) diff("fontWeight", r.fontWeight, cr.fontWeight);
    if (r.lineHeight !== cr.lineHeight) diff("lineHeight", r.lineHeight, cr.lineHeight);
    if (r.font !== cr.font) diff("font", r.font, cr.font);
    if (colorDelta(r.color, cr.color) > COLOR_TOLERANCE)
      diff("color", fmtColor(r.color), fmtColor(cr.color));
    if (colorDelta(r.background, cr.background) > COLOR_TOLERANCE)
      diff("background", fmtColor(r.background), fmtColor(cr.background));
    if (r.radius !== cr.radius) diff("radius", r.radius, cr.radius);
    if (r.border !== cr.border) diff("border", r.border, cr.border);
    if (r.text !== cr.text) diff("text", JSON.stringify(r.text), JSON.stringify(cr.text));
    propRows.push(...compareStyleProps(key, r, cr));
  }

  const label = `${c.family}/${c.fixture}`;
  if (problems.length > 0) {
    const table = formatTable(rows);
    console.log(`\n[geometry] ${label}: ${problems.length} mismatch(es)\n${table}`);
    problems.unshift(table);
  }
  if (propRows.length > 0) {
    console.log(
      `\n[geometry:props] ${label}: ${propRows.length} style prop mismatch(es)${STRICT_PROPS ? "" : " (report-only)"}\n${formatTable(propRows)}`,
    );
  }
  return { problems, rows, propRows };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function writeReport(c: AuditCase, result: Comparison): void {
  mkdirSync(REPORT_DIR, { recursive: true });
  const toJson = ([slot, field, react, cronus]: Row) => ({ slot, field, react, cronus });
  writeFileSync(
    join(REPORT_DIR, `${c.family}-${c.fixture}.json`),
    `${JSON.stringify(
      {
        family: c.family,
        fixture: c.fixture,
        strictProps: STRICT_PROPS,
        mismatches: result.rows.map(toJson),
        propMismatches: result.propRows.map(toJson),
      },
      null,
      2,
    )}\n`,
  );
}

const auditPath = (c: AuditCase) =>
  `/audit/${c.family}?fixture=${c.fixture}&preset=aurora&mode=dark`;

/**
 * OVERLAY families: open the same audit page in a window of the kernel
 * iframe's size and measure the React modal there (see OVERLAY).
 */
async function measureReactOverlay(
  browser: Browser,
  baseURL: string | undefined,
  c: AuditCase,
  overlay: OverlaySpec,
  viewport: { width: number; height: number },
): Promise<Measured[]> {
  const context = await browser.newContext({
    baseURL,
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });
  try {
    const page = await context.newPage();
    await page.goto(auditPath(c));
    const react = page.locator('[data-audit-side="react"] [data-audit-canvas]');
    await expect(react).toBeAttached();
    await expect(page.locator(OVERLAY_READY).first()).toBeVisible();
    await freezeReact(page);
    return await measureSettled(react, null, overlay, specFor(READY, c), "React");
  } finally {
    await context.close();
  }
}

/**
 * Families whose React layout depends on viewport units (AppShell content is
 * `min-h-svh`). The kernel canvas lives in the audit iframe, so React is measured
 * in a second page whose viewport height equals the iframe window (width stays
 * the page's, keeping both panes on the desktop breakpoint), canvas-relative.
 * All checks stay unchanged.
 */
const VIEWPORT_MATCHED = new Set<Family>(["app-shell"]);

async function measureReactInViewport(
  browser: Browser,
  baseURL: string | undefined,
  c: AuditCase,
  portal: PortalSpec | null,
  viewport: { width: number; height: number },
): Promise<Measured[]> {
  const context = await browser.newContext({
    baseURL,
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "dark",
  });
  try {
    const page = await context.newPage();
    await page.goto(auditPath(c));
    const react = page.locator('[data-audit-side="react"] [data-audit-canvas]');
    await expect(react).toBeVisible();
    await freezeReact(page);
    return await measureSettled(react, portal, null, specFor(READY, c), "React");
  } finally {
    await context.close();
  }
}

async function openBothPanes(
  page: Page,
  c: AuditCase,
): Promise<{ react: Locator; frame: FrameLocator; cronus: Locator }> {
  await page.goto(auditPath(c));
  const react = page.locator('[data-audit-side="react"] [data-audit-canvas]');
  const frame = cronusFrame(page);
  const cronus = frame.locator("[data-audit-canvas]");
  await expect(react).toBeVisible();
  await expect(cronus).toBeVisible();
  const portal = PORTAL[c.family];
  if (portal) {
    // Gate on the React popover having mounted, not on a specific slot name:
    // a missing content slot must surface as a parity mismatch, not a timeout.
    await expect(page.locator(portal.ready).first()).toBeVisible();
  }
  const ready = specFor(READY, c)?.selector;
  if (ready) {
    await expect(page.locator(`[data-audit-side="react"] ${ready}`).first()).toBeVisible();
  }
  await freezeReact(page);
  await freezeFrame(frame);
  return { react, frame, cronus };
}

test.describe("geometry parity (React vs Cronus)", () => {
  for (const c of CASES) {
    test(`${c.family}/${c.fixture}`, async ({ page, browser, baseURL }) => {
      const { react, cronus } = await openBothPanes(page, c);
      const portal = PORTAL[c.family] ?? null;
      const overlay = OVERLAY[c.family] ?? null;
      const ready = specFor(READY, c);
      const cronusMeasured = await measureSettled(cronus, portal, overlay, ready, "Cronus");
      const reactMeasured = overlay
        ? await measureReactOverlay(
            browser,
            baseURL,
            c,
            overlay,
            await cronus.evaluate((el) => {
              const win = el.ownerDocument.defaultView ?? window;
              return { width: win.innerWidth, height: win.innerHeight };
            }),
          )
        : VIEWPORT_MATCHED.has(c.family)
          ? await measureReactInViewport(browser, baseURL, c, portal, {
              // Keep the page width: React's sidebar switches to its mobile sheet
              // below 768px (JS useIsMobile) while the zero-JS kernel stays
              // desktop. Only the height drives `svh`, so match that one.
              width: page.viewportSize()?.width ?? 1280,
              height: await cronus.evaluate(
                (el) => (el.ownerDocument.defaultView ?? window).innerHeight,
              ),
            })
          : await measureSettled(react, portal, null, ready, "React");
      expect(reactMeasured.length, "React canvas has no [data-slot] elements").toBeGreaterThan(0);
      const result = compareCase(c, reactMeasured, cronusMeasured);
      writeReport(c, result);
      if (result.propRows.length > 0) {
        test.info().annotations.push({
          type: "audit-props",
          description: `${result.propRows.length} style prop mismatch(es)${STRICT_PROPS ? "" : " (report-only; AUDIT_STRICT_PROPS=1 fails)"}\n${formatTable(result.propRows)}`,
        });
      }
      expect(result.problems, result.problems[0] ?? "").toEqual([]);
      if (STRICT_PROPS) {
        expect(
          result.propRows.map(([key, field]) => `${key}.${field}`),
          formatTable(result.propRows),
        ).toEqual([]);
      }
    });
  }
});
