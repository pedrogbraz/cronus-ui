#!/usr/bin/env node
// @ts-check
/**
 * contrast.mjs — a self-contained WCAG 2.x contrast-ratio calculator for the
 * Kronus design tokens.
 *
 * Colors in `src/tokens.ts` are authored in OKLCH (with some `oklch(... / a)`
 * alpha channels). To reason about WCAG contrast we need each color as an sRGB
 * relative luminance, so this module:
 *   1. parses `oklch(...)` / `#rrggbb[aa]` / `rgb[a](...)` into linear sRGB,
 *   2. flattens any alpha over a supplied opaque background (WCAG requires an
 *      opaque foreground/background pair),
 *   3. computes relative luminance and the (L1+0.05)/(L2+0.05) contrast ratio.
 *
 * The oklch → sRGB path uses the same CSS Color 4 / Björn Ottosson reference
 * matrices as `packages/tokens/scripts/build-tokens.ts`, so a color renders the
 * same luminance here as the sRGB-hex Figma export shows on screen.
 *
 * Usage:
 *   node scripts/contrast.mjs                 # run the token-audit report
 *   node scripts/contrast.mjs --self-check    # only run the parser fixtures
 *
 * Importable API (used by the audit + by ad-hoc checks):
 *   import { contrastRatio, parseColor, relativeLuminance } from "./contrast.mjs";
 *   contrastRatio("oklch(0.552 0.014 286)", "oklch(0.967 0.001 286)"); // → 4.42
 */

/**
 * @typedef {{ r: number, g: number, b: number, alpha: number }} Rgb
 *   Gamma-encoded sRGB channels in [0, 1] plus an alpha in [0, 1].
 */

/** WCAG AA thresholds. */
export const AA_TEXT = 4.5;
export const AA_LARGE = 3;

// ------------------------------------------------------------------ //
// Parsing: oklch / hex / rgb → gamma-encoded sRGB                     //
// ------------------------------------------------------------------ //

/**
 * oklch(L C H [/ alpha]) → gamma-encoded sRGB channels in [0, 1], via the
 * CSS Color 4 / Ottosson reference matrices (oklch → oklab → LMS³ → linear
 * sRGB → gamma). Out-of-gamut channels are clamped to [0, 1] before encoding —
 * the same pragmatic sRGB projection browsers apply on sRGB screens.
 *
 * @param {number} l Lightness in [0, 1].
 * @param {number} c Chroma (>= 0).
 * @param {number} h Hue in degrees.
 * @returns {[number, number, number]} sRGB channels in [0, 1].
 */
function oklchToSrgb(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const lm = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mm = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sm = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * lm - 3.3077115913 * mm + 0.2309699292 * sm,
    -1.2684380046 * lm + 2.6097574011 * mm - 0.3413193965 * sm,
    -0.0041960863 * lm - 0.7034186147 * mm + 1.707614701 * sm,
  ];
  return /** @type {[number, number, number]} */ (
    linear.map((channel) => {
      const clamped = Math.min(1, Math.max(0, channel));
      return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
    })
  );
}

/** `85%` → 0.85, `0.5` → 0.5. */
function parseUnit(raw) {
  return raw.endsWith("%") ? Number.parseFloat(raw) / 100 : Number.parseFloat(raw);
}

/** Expand a 3/4-digit hex to 6/8 digits, lowercase, no leading `#`. */
function expandHexDigits(digits) {
  const d = digits.toLowerCase();
  if (d.length === 6 || d.length === 8) return d;
  if (d.length === 3 || d.length === 4) return [...d].map((ch) => ch + ch).join("");
  throw new Error(`contrast: malformed hex color "#${digits}"`);
}

/**
 * Parse any token color string into gamma-encoded sRGB + alpha. Supports the
 * three syntaxes that appear in the tokens (oklch, hex, rgb/rgba); throws on
 * anything else so a typo can't silently pass as black.
 *
 * @param {string} raw
 * @returns {Rgb}
 */
export function parseColor(raw) {
  const value = raw.trim();

  const ok = value.match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+(-?[\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?)\s*)?\)$/i,
  );
  if (ok?.[1] !== undefined && ok[2] !== undefined && ok[3] !== undefined) {
    const l = parseUnit(ok[1]);
    const c = Number.parseFloat(ok[2]);
    const h = Number.parseFloat(ok[3]);
    const [r, g, b] = oklchToSrgb(l, c, h);
    return { r, g, b, alpha: ok[4] === undefined ? 1 : parseUnit(ok[4]) };
  }

  const hex = value.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hex?.[1] !== undefined) {
    const d = expandHexDigits(hex[1]);
    const channel = (i) => Number.parseInt(d.slice(i, i + 2), 16) / 255;
    return {
      r: channel(0),
      g: channel(2),
      b: channel(4),
      alpha: d.length === 8 ? channel(6) : 1,
    };
  }

  const rgb = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (rgb?.[1] !== undefined && rgb[2] !== undefined && rgb[3] !== undefined) {
    return {
      r: Number.parseInt(rgb[1], 10) / 255,
      g: Number.parseInt(rgb[2], 10) / 255,
      b: Number.parseInt(rgb[3], 10) / 255,
      alpha: rgb[4] === undefined ? 1 : Number.parseFloat(rgb[4]),
    };
  }

  throw new Error(`contrast: unsupported color syntax "${raw}"`);
}

/** gamma-encoded sRGB channel [0,1] → hex byte pair. */
function channelHex(value01) {
  return Math.round(value01 * 255)
    .toString(16)
    .padStart(2, "0");
}

/**
 * Any token color → `#rrggbb` (alpha dropped — used only for reporting; the
 * ratio math flattens alpha separately over a real background).
 * @param {string} raw
 * @returns {string}
 */
export function toHex(raw) {
  const { r, g, b } = parseColor(raw);
  return `#${channelHex(r)}${channelHex(g)}${channelHex(b)}`;
}

// ------------------------------------------------------------------ //
// Alpha flatten + luminance + ratio                                   //
// ------------------------------------------------------------------ //

/**
 * Composite a (possibly translucent) foreground over an OPAQUE background,
 * returning the resulting opaque sRGB color. WCAG requires opaque colors on
 * both sides; a semi-transparent border/tint must be resolved against what
 * sits behind it before a ratio is meaningful.
 *
 * @param {Rgb} fg
 * @param {Rgb} bg Must be opaque (alpha 1); its alpha is ignored.
 * @returns {Rgb}
 */
export function flattenOver(fg, bg) {
  const a = fg.alpha;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    alpha: 1,
  };
}

/** Linearize one gamma-encoded sRGB channel (WCAG 2.x). */
function linearizeChannel(channel) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/**
 * WCAG relative luminance of an opaque sRGB color.
 * @param {Rgb} rgb
 * @returns {number}
 */
export function relativeLuminance(rgb) {
  const r = linearizeChannel(rgb.r);
  const g = linearizeChannel(rgb.g);
  const b = linearizeChannel(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * WCAG contrast ratio between a foreground and background color string. Both
 * are flattened onto `pageBg` first (the opaque surface the pair ultimately
 * sits on) so translucent tints/borders resolve correctly; when the background
 * is already opaque, `pageBg` is unused for it.
 *
 * @param {string} fg Foreground color string.
 * @param {string} bg Background color string (may be translucent, e.g. a tint).
 * @param {string} [pageBg] Opaque surface behind everything. Defaults to `bg`
 *   when `bg` is opaque, else white.
 * @returns {number} Contrast ratio in [1, 21].
 */
export function contrastRatio(fg, bg, pageBg) {
  const bgColor = parseColor(bg);
  const base = pageBg ? parseColor(pageBg) : bgColor.alpha === 1 ? bgColor : parseColor("#ffffff");
  const bgOpaque = bgColor.alpha === 1 ? bgColor : flattenOver(bgColor, base);
  const fgOpaque = flattenOver(parseColor(fg), bgOpaque);
  const l1 = relativeLuminance(fgOpaque);
  const l2 = relativeLuminance(bgOpaque);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Round a ratio to two decimals for display. */
export function fmt(ratio) {
  return ratio.toFixed(2);
}

// ------------------------------------------------------------------ //
// Self-check — validate the parser against annotated token pairs      //
// ------------------------------------------------------------------ //

/**
 * The oklch values in tokens.ts are annotated with their sRGB hex; validating
 * a handful of them proves the oklch parser matches the documented colors, and
 * a few known contrast pairs prove the ratio math against hand-computed values.
 */
const HEX_FIXTURES = [
  { oklch: "oklch(1 0 0)", hex: "#ffffff" },
  { oklch: "oklch(0 0 0)", hex: "#000000" },
  { oklch: "oklch(0.55 0.205 280)", hex: "#6158e4" }, // midnight primary (build-tokens fixture)
  { oklch: "oklch(0.685 0.169 237.3)", hex: "#00a6f4" }, // aurora primary, gamut-clamped (build-tokens fixture)
  { oklch: "oklch(0.556 0 0)", hex: "#737373" }, // neutral-light fg-tertiary — matches the a11y-sweep fg exactly
];

const RATIO_FIXTURES = [
  // Canonical WCAG anchors.
  { fg: "#000000", bg: "#ffffff", expected: 21, tol: 0.01 },
  { fg: "#ffffff", bg: "#ffffff", expected: 1, tol: 0.01 },
  { fg: "#777777", bg: "#ffffff", expected: 4.48, tol: 0.05 },
  // Alpha flatten: 50% black over white == solid #808080-ish grey over white.
  {
    fg: "rgba(0,0,0,0.5)",
    bg: "#ffffff",
    expected: contrastRatioSolidGrey(),
    tol: 0.05,
  },
];

/** Solid-grey reference for the alpha-flatten fixture (0.5 black on white). */
function contrastRatioSolidGrey() {
  const half = { r: 0.5, g: 0.5, b: 0.5, alpha: 1 };
  const white = { r: 1, g: 1, b: 1, alpha: 1 };
  const l1 = relativeLuminance(half);
  const l2 = relativeLuminance(white);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/** Run parser + ratio fixtures; returns a list of failure strings (empty = ok). */
export function selfCheck() {
  const problems = [];
  for (const { oklch, hex } of HEX_FIXTURES) {
    const actual = toHex(oklch);
    // ±2/channel absorbs rounding + gamut-clamp differences between tools.
    const a = parseColor(actual);
    const b = parseColor(hex);
    const off = Math.max(Math.abs(a.r - b.r), Math.abs(a.g - b.g), Math.abs(a.b - b.b));
    if (off > 2 / 255) {
      problems.push(`oklch parse: ${oklch} → ${actual}, expected ~${hex}`);
    }
  }
  for (const { fg, bg, expected, tol } of RATIO_FIXTURES) {
    const actual = contrastRatio(fg, bg);
    if (Math.abs(actual - expected) > tol) {
      problems.push(`ratio: ${fg} on ${bg} → ${fmt(actual)}, expected ${expected.toFixed(2)}`);
    }
  }
  return problems;
}

// ------------------------------------------------------------------ //
// Token audit — read src/tokens.ts and report the AA-critical pairs   //
// ------------------------------------------------------------------ //

/**
 * The token→surface pairs the a11y sweep can flag as TEXT, each asserted at the
 * WCAG AA text threshold (4.5:1):
 *  - `fgTertiary`/`fgSecondary` on the LIGHTEST common surfaces they can land on
 *    (surface-overlay is the worst — slightly off-white in the light themes).
 *  - The accent/semantic TEXT tokens (`primaryText`, `successText`, `infoText`,
 *    `warningText`, `errorText`) on `surface-base` — these are the AA-tuned
 *    variants of the raw FILL tokens, which are intentionally too bright to read
 *    as text on the base surface in the light themes (that is why the `*-strong`
 *    text variants exist).
 * `fgMuted` is deliberately absent — it is the intentional faint / decorative
 * token and is not held to AA as body text (see CONTRACT.md).
 */
const AUDIT_PAIRS = [
  { fg: "fgTertiary", bgs: ["surfaceOverlay", "surfaceRaised", "surfaceBase"], threshold: AA_TEXT },
  { fg: "fgSecondary", bgs: ["surfaceOverlay", "surfaceBase"], threshold: AA_TEXT },
  { fg: "primaryText", bgs: ["surfaceBase"], threshold: AA_TEXT, label: "primary-strong-text" },
  {
    fg: "successText",
    bgs: ["surfaceBase", "surfaceInset"],
    threshold: AA_TEXT,
    label: "success-strong-text",
  },
  {
    fg: "errorText",
    bgs: ["surfaceBase", "surfaceInset"],
    threshold: AA_TEXT,
    label: "error-strong-text",
  },
  {
    fg: "warningText",
    bgs: ["surfaceBase", "surfaceInset"],
    threshold: AA_TEXT,
    label: "warning-strong-text",
  },
  {
    fg: "infoText",
    bgs: ["surfaceBase", "surfaceInset"],
    threshold: AA_TEXT,
    label: "info-strong-text",
  },
];

/**
 * The tinted-BADGE pairs: each `*-strong` TEXT token rendered on its OWN same-hue
 * `bg-<semantic>/15` tint, flattened over the WORST (lightest) surface a badge
 * lands on. This is the residual failure class the `*-strong` tokens close: a
 * semantic color read as text on a same-hue tint of itself. The tint is the RAW
 * FILL token at 15% alpha (badge/scheduler chips use a `bg-<semantic>/15` class),
 * so the FOREGROUND is `<semantic>Text` and the BACKGROUND is `<semantic>` at 0.15.
 *
 * Worst surface per mode: both light and dark use `surface-raised` — the lightest
 * opaque panel a badge realistically sits on, so the palest tint (lowest contrast).
 */
const TINT_PAIRS = [
  { fg: "primaryText", tint: "primary", label: "primary-strong / primary·15" },
  { fg: "successText", tint: "success", label: "success-strong / success·15" },
  { fg: "warningText", tint: "warning", label: "warning-strong / warning·15" },
  { fg: "errorText", tint: "error", label: "error-strong / error·15" },
  { fg: "infoText", tint: "info", label: "info-strong / info·15" },
];

/** The RAW semantic at 15% alpha as a css string, for flatten-over-surface. */
function tint15(raw) {
  return raw.replace(/^oklch\(([^)]*)\)$/i, "oklch($1 / 0.15)");
}

async function runAudit() {
  const { themes, themeNames, modes } = await import("../packages/tokens/src/tokens.ts");
  const rows = [];
  for (const theme of themeNames) {
    for (const mode of modes) {
      const t = themes[theme][mode];
      // Tinted-badge worst case: `*Text` on `<semantic>/15` over surface-raised.
      for (const { fg, tint, label } of TINT_PAIRS) {
        const worstSurface = t.surfaceRaised;
        const ratio = contrastRatio(t[fg], tint15(t[tint]), worstSurface);
        const flatBg = flattenOver(parseColor(tint15(t[tint])), parseColor(worstSurface));
        const bgHex = toHex(
          `rgb(${Math.round(flatBg.r * 255)},${Math.round(flatBg.g * 255)},${Math.round(flatBg.b * 255)})`,
        );
        rows.push({
          theme,
          mode,
          pair: label,
          fgHex: toHex(t[fg]),
          bgHex,
          ratio,
          threshold: AA_TEXT,
          pass: ratio >= AA_TEXT,
        });
      }
      for (const { fg, bgs, threshold, label } of AUDIT_PAIRS) {
        for (const bg of bgs) {
          const ratio = contrastRatio(t[fg], t[bg]);
          rows.push({
            theme,
            mode,
            pair: `${label ?? fg} / ${bg}`,
            fgHex: toHex(t[fg]),
            bgHex: toHex(t[bg]),
            ratio,
            threshold,
            pass: ratio >= threshold,
          });
        }
      }
    }
  }
  const fails = rows.filter((r) => !r.pass);
  const header = `theme        mode   pair                              fg       bg       ratio  thr  ok`;
  const line = (r) =>
    `${r.theme.padEnd(12)} ${r.mode.padEnd(6)} ${r.pair.padEnd(33)} ${r.fgHex} ${r.bgHex} ${fmt(r.ratio).padStart(5)} ${String(r.threshold).padStart(4)}  ${r.pass ? "✓" : "✗"}`;
  console.log(header);
  for (const r of fails.length ? fails : rows) console.log(line(r));
  console.log(`\n${fails.length} failing pair(s) of ${rows.length} audited.`);
  return fails.length;
}

// ------------------------------------------------------------------ //
// CLI                                                                 //
// ------------------------------------------------------------------ //

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;

if (isMain) {
  const problems = selfCheck();
  if (problems.length > 0) {
    console.error("contrast: self-check FAILED:");
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log("contrast: self-check passed (parser + ratio fixtures).\n");
  if (!process.argv.includes("--self-check")) {
    const failing = await runAudit();
    process.exit(failing > 0 ? 1 : 0);
  }
}
