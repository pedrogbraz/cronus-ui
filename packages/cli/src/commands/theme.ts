import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
import { CONFIG_FILE, hasConfig, readConfig, writeConfig } from "../config.js";
import { log, writeFileEnsured } from "../utils.js";

/** The theme presets shipped by @cronus-ui/theme. */
export const THEME_PRESETS = ["aurora", "neutral", "midnight", "sunset", "emerald"] as const;

/** The two color modes a preset can be pinned to. */
export const THEME_MODES = ["dark", "light"] as const;

/** Root-layout locations we probe, in priority order (relative to cwd). */
const LAYOUT_CANDIDATES = [
  "app/layout.tsx",
  "src/app/layout.tsx",
  "app/layout.jsx",
  "src/app/layout.jsx",
] as const;

/**
 * A layout only counts if it actually mounts the theme runtime — otherwise
 * rewriting attributes there would be pointless (and risk touching an unrelated
 * `layout.tsx`). Either the anti-flash script tag or the provider qualifies.
 */
const THEME_MARKERS = ["CronusThemeScript", "CronusUIProvider"];

interface ThemeSetOptions {
  name: string;
  mode?: string;
  cwd: string;
}

/**
 * Rewrite every `<attr>="…"` occurrence to `value`, preserving the original
 * quote style and only counting occurrences whose value actually changed (so a
 * re-run on an already-set attribute reports zero changes — idempotent).
 */
function rewriteAttr(
  source: string,
  attr: string,
  value: string,
): { content: string; changed: number } {
  let changed = 0;
  const re = new RegExp(`${attr}=(["'])(.*?)\\1`, "g");
  const content = source.replace(re, (match, quote: string, previous: string) => {
    if (previous === value) return match;
    changed += 1;
    return `${attr}=${quote}${value}${quote}`;
  });
  return { content, changed };
}

/** First existing candidate layout that mounts the Cronus theme runtime. */
async function findLayout(
  cwd: string,
): Promise<{ path: string; rel: string; content: string } | undefined> {
  for (const rel of LAYOUT_CANDIDATES) {
    const path = join(cwd, rel);
    if (!existsSync(path)) continue;
    const content = await readFile(path, "utf8");
    if (THEME_MARKERS.some((marker) => content.includes(marker))) {
      return { path, rel, content };
    }
  }
  return undefined;
}

export async function themeSet(options: ThemeSetOptions): Promise<void> {
  const { cwd, name } = options;

  if (!(THEME_PRESETS as readonly string[]).includes(name)) {
    log.err(`Unknown theme "${name}". Choose one of: ${THEME_PRESETS.join(", ")}.`);
    return;
  }
  if (options.mode !== undefined && !(THEME_MODES as readonly string[]).includes(options.mode)) {
    log.err(`Invalid mode "${options.mode}". Choose "${THEME_MODES.join('" or "')}".`);
    return;
  }
  const mode = options.mode;

  log.title(`Setting theme to ${name}${mode ? ` (${mode})` : ""}`);

  const layout = await findLayout(cwd);
  if (layout) {
    const theme = rewriteAttr(layout.content, "defaultThemeName", name);
    let next = theme.content;
    let changed = theme.changed;
    if (mode) {
      const colorMode = rewriteAttr(next, "defaultModeName", mode);
      next = colorMode.content;
      changed += colorMode.changed;
    }

    if (next !== layout.content) {
      await writeFile(layout.path, next, "utf8");
    }
    log.ok(`Updated ${layout.rel} (${changed} attribute(s) changed)`);
  } else {
    log.warn(
      "No app layout mounting <CronusThemeScript>/<CronusUIProvider> found — updating config only.",
    );
  }

  if (hasConfig(cwd)) {
    const config = await readConfig(cwd);
    // Preserve the current mode when --mode is omitted; fall back to "dark" only
    // when the config has never recorded a theme mode before.
    const nextMode = mode ?? config.theme?.mode ?? "dark";
    config.theme = { name, mode: nextMode };
    await writeConfig(cwd, config);
    log.ok(`Wrote theme to ${CONFIG_FILE}`);
  } else {
    log.step(`No ${CONFIG_FILE} — skipped config update.`);
  }

  log.title("Done");
}

/* ------------------------------------------------------------------ *
 * `theme add` — apply a theme built in the Create Studio.
 *
 * The Studio (apps/www/app/create) shares a theme as a compact base64url
 * `?c=` permalink token or an exported JSON config. This section is a
 * dependency-free port of the Studio codec + token pipeline
 * (apps/www/lib/create/presets.ts) and of `serializeOverrides` from
 * @cronus-ui/tokens, so the published CLI can decode a link fully offline
 * and materialize the theme in a consumer project:
 *
 *   1. pin the layout to the "neutral" base preset + the theme's mode
 *      (exactly what the Studio's own provider export does), and
 *   2. write the computed `--cronus-*` overrides into the consumer's
 *      globals CSS inside BEGIN/END markers (re-runs replace the block).
 * ------------------------------------------------------------------ */

type StudioMode = (typeof THEME_MODES)[number];

/**
 * The Studio's design config — the seven fields that shape the generated
 * overrides plus the two freeform brand colors. (The Studio also tracks an
 * icon library, but that only drives its preview icons — no CSS — so the CLI
 * parses and ignores it.)
 */
interface StudioConfig {
  /** Display name ("Custom" unless the source carries one). */
  style: string;
  mode: StudioMode;
  baseColor: string;
  brand: string;
  chart: string;
  headingFont: string;
  bodyFont: string;
  /** Optional freeform CSS color overriding the brand's primary. */
  primaryColor?: string;
  /** Optional freeform CSS color overriding the brand's accent. */
  accentColor?: string;
  /** Corner radius in px (0–28). */
  radius: number;
}

/** A neutral surface ramp for one mode — 13 tokens, mirrors the Studio's BaseRamp. */
interface StudioRamp {
  surfaceBase: string;
  surfaceInset: string;
  surfaceRaised: string;
  surfaceOverlay: string;
  surfaceElevated: string;
  surfaceFloating: string;
  fg: string;
  fgSecondary: string;
  fgTertiary: string;
  fgMuted: string;
  border: string;
  borderStrong: string;
  borderSoft: string;
}

/** Every dark ramp shares the same white-alpha border trio. */
const DARK_BORDERS = {
  border: "oklch(1 0 0 / 0.1)",
  borderStrong: "oklch(1 0 0 / 0.16)",
  borderSoft: "oklch(1 0 0 / 0.06)",
} as const;

/** The Studio's 5 neutral base ramps (ids + values ported verbatim). */
const STUDIO_BASE_COLORS: Record<string, { light: StudioRamp; dark: StudioRamp }> = {
  neutral: {
    dark: {
      surfaceBase: "oklch(0.11 0 0)",
      surfaceInset: "oklch(0.13 0 0)",
      surfaceRaised: "oklch(0.16 0 0)",
      surfaceOverlay: "oklch(0.2 0 0)",
      surfaceElevated: "oklch(0.23 0 0)",
      surfaceFloating: "oklch(0.27 0 0)",
      fg: "oklch(0.93 0 0)",
      fgSecondary: "oklch(0.7 0 0)",
      fgTertiary: "oklch(0.62 0 0)",
      fgMuted: "oklch(0.44 0 0)",
      ...DARK_BORDERS,
    },
    light: {
      surfaceBase: "oklch(0.985 0 0)",
      surfaceInset: "oklch(0.97 0 0)",
      surfaceRaised: "oklch(1 0 0)",
      surfaceOverlay: "oklch(0.96 0 0)",
      surfaceElevated: "oklch(1 0 0)",
      surfaceFloating: "oklch(1 0 0)",
      fg: "oklch(0.145 0 0)",
      fgSecondary: "oklch(0.43 0 0)",
      fgTertiary: "oklch(0.556 0 0)",
      fgMuted: "oklch(0.705 0 0)",
      border: "oklch(0.915 0 0)",
      borderStrong: "oklch(0.86 0 0)",
      borderSoft: "oklch(0.94 0 0)",
    },
  },
  slate: {
    dark: {
      surfaceBase: "oklch(0.11 0.012 252)",
      surfaceInset: "oklch(0.13 0.013 252)",
      surfaceRaised: "oklch(0.16 0.014 252)",
      surfaceOverlay: "oklch(0.2 0.016 252)",
      surfaceElevated: "oklch(0.23 0.017 252)",
      surfaceFloating: "oklch(0.27 0.018 252)",
      fg: "oklch(0.93 0.006 252)",
      fgSecondary: "oklch(0.7 0.013 252)",
      fgTertiary: "oklch(0.62 0.016 252)",
      fgMuted: "oklch(0.44 0.016 252)",
      ...DARK_BORDERS,
    },
    light: {
      surfaceBase: "oklch(0.985 0.004 252)",
      surfaceInset: "oklch(0.97 0.006 252)",
      surfaceRaised: "oklch(1 0 0)",
      surfaceOverlay: "oklch(0.96 0.008 252)",
      surfaceElevated: "oklch(1 0 0)",
      surfaceFloating: "oklch(1 0 0)",
      fg: "oklch(0.145 0.014 252)",
      fgSecondary: "oklch(0.43 0.018 252)",
      fgTertiary: "oklch(0.556 0.016 252)",
      fgMuted: "oklch(0.705 0.014 252)",
      border: "oklch(0.915 0.008 252)",
      borderStrong: "oklch(0.86 0.012 252)",
      borderSoft: "oklch(0.94 0.006 252)",
    },
  },
  zinc: {
    dark: {
      surfaceBase: "oklch(0.11 0.005 286)",
      surfaceInset: "oklch(0.13 0.005 286)",
      surfaceRaised: "oklch(0.16 0.006 286)",
      surfaceOverlay: "oklch(0.2 0.006 286)",
      surfaceElevated: "oklch(0.23 0.006 286)",
      surfaceFloating: "oklch(0.27 0.006 286)",
      fg: "oklch(0.93 0.003 286)",
      fgSecondary: "oklch(0.705 0.015 286)",
      fgTertiary: "oklch(0.62 0.014 286)",
      fgMuted: "oklch(0.442 0.013 286)",
      ...DARK_BORDERS,
    },
    light: {
      surfaceBase: "oklch(0.985 0.001 286)",
      surfaceInset: "oklch(0.97 0.002 286)",
      surfaceRaised: "oklch(1 0 0)",
      surfaceOverlay: "oklch(0.967 0.003 286)",
      surfaceElevated: "oklch(1 0 0)",
      surfaceFloating: "oklch(1 0 0)",
      fg: "oklch(0.145 0.004 286)",
      fgSecondary: "oklch(0.43 0.008 286)",
      fgTertiary: "oklch(0.556 0.008 286)",
      fgMuted: "oklch(0.705 0.006 286)",
      border: "oklch(0.915 0.003 286)",
      borderStrong: "oklch(0.86 0.005 286)",
      borderSoft: "oklch(0.94 0.002 286)",
    },
  },
  stone: {
    dark: {
      surfaceBase: "oklch(0.11 0.006 70)",
      surfaceInset: "oklch(0.13 0.007 70)",
      surfaceRaised: "oklch(0.16 0.008 70)",
      surfaceOverlay: "oklch(0.2 0.009 70)",
      surfaceElevated: "oklch(0.23 0.01 70)",
      surfaceFloating: "oklch(0.27 0.011 70)",
      fg: "oklch(0.93 0.004 70)",
      fgSecondary: "oklch(0.7 0.009 70)",
      fgTertiary: "oklch(0.62 0.011 70)",
      fgMuted: "oklch(0.44 0.011 70)",
      ...DARK_BORDERS,
    },
    light: {
      surfaceBase: "oklch(0.985 0.003 70)",
      surfaceInset: "oklch(0.97 0.004 70)",
      surfaceRaised: "oklch(1 0 0)",
      surfaceOverlay: "oklch(0.96 0.006 70)",
      surfaceElevated: "oklch(1 0 0)",
      surfaceFloating: "oklch(1 0 0)",
      fg: "oklch(0.145 0.008 70)",
      fgSecondary: "oklch(0.43 0.012 70)",
      fgTertiary: "oklch(0.556 0.011 70)",
      fgMuted: "oklch(0.705 0.009 70)",
      border: "oklch(0.915 0.005 70)",
      borderStrong: "oklch(0.86 0.008 70)",
      borderSoft: "oklch(0.94 0.004 70)",
    },
  },
  gray: {
    dark: {
      surfaceBase: "oklch(0.11 0.006 252)",
      surfaceInset: "oklch(0.13 0.006 252)",
      surfaceRaised: "oklch(0.16 0.007 252)",
      surfaceOverlay: "oklch(0.2 0.008 252)",
      surfaceElevated: "oklch(0.23 0.008 252)",
      surfaceFloating: "oklch(0.27 0.009 252)",
      fg: "oklch(0.93 0.003 252)",
      fgSecondary: "oklch(0.7 0.008 252)",
      fgTertiary: "oklch(0.62 0.009 252)",
      fgMuted: "oklch(0.44 0.009 252)",
      ...DARK_BORDERS,
    },
    light: {
      surfaceBase: "oklch(0.985 0.002 252)",
      surfaceInset: "oklch(0.97 0.003 252)",
      surfaceRaised: "oklch(1 0 0)",
      surfaceOverlay: "oklch(0.96 0.004 252)",
      surfaceElevated: "oklch(1 0 0)",
      surfaceFloating: "oklch(1 0 0)",
      fg: "oklch(0.145 0.006 252)",
      fgSecondary: "oklch(0.43 0.009 252)",
      fgTertiary: "oklch(0.556 0.009 252)",
      fgMuted: "oklch(0.705 0.007 252)",
      border: "oklch(0.915 0.004 252)",
      borderStrong: "oklch(0.86 0.006 252)",
      borderSoft: "oklch(0.94 0.003 252)",
    },
  },
};

interface StudioBrand {
  /** Vivid values for dark mode. */
  primary: string;
  accent: string;
  /** Darker, foreground-safe values for light mode. */
  primaryLight: string;
  accentLight: string;
  primaryForeground: string;
}

/** The Studio's 8 brand colors. */
const STUDIO_BRANDS: Record<string, StudioBrand> = {
  sky: {
    primary: "oklch(0.685 0.169 237.3)",
    accent: "oklch(0.715 0.143 215.2)",
    primaryLight: "oklch(0.54 0.165 245)",
    accentLight: "oklch(0.55 0.13 218)",
    primaryForeground: "oklch(0.145 0 0)",
  },
  violet: {
    primary: "oklch(0.66 0.2 292)",
    accent: "oklch(0.7 0.16 305)",
    primaryLight: "oklch(0.52 0.21 292)",
    accentLight: "oklch(0.55 0.18 305)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  emerald: {
    primary: "oklch(0.715 0.155 162.5)",
    accent: "oklch(0.74 0.14 174)",
    primaryLight: "oklch(0.54 0.13 163)",
    accentLight: "oklch(0.56 0.115 175)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  amber: {
    primary: "oklch(0.769 0.166 70.08)",
    accent: "oklch(0.81 0.145 84)",
    primaryLight: "oklch(0.58 0.13 62)",
    accentLight: "oklch(0.62 0.12 78)",
    primaryForeground: "oklch(0.205 0.04 70)",
  },
  rose: {
    primary: "oklch(0.645 0.222 16.44)",
    accent: "oklch(0.7 0.18 358)",
    primaryLight: "oklch(0.53 0.2 18)",
    accentLight: "oklch(0.55 0.17 0)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  blue: {
    primary: "oklch(0.62 0.19 259)",
    accent: "oklch(0.68 0.16 248)",
    primaryLight: "oklch(0.5 0.2 261)",
    accentLight: "oklch(0.54 0.17 250)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  orange: {
    primary: "oklch(0.7 0.19 41)",
    accent: "oklch(0.75 0.16 55)",
    primaryLight: "oklch(0.56 0.18 38)",
    accentLight: "oklch(0.58 0.155 52)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  teal: {
    primary: "oklch(0.72 0.12 190)",
    accent: "oklch(0.76 0.11 200)",
    primaryLight: "oklch(0.55 0.1 190)",
    accentLight: "oklch(0.57 0.095 200)",
    primaryForeground: "oklch(0.985 0 0)",
  },
};

/** The Studio's 4 chart palettes — exactly 5 series colors each. */
const STUDIO_CHARTS: Record<string, readonly [string, string, string, string, string]> = {
  brand: [
    "oklch(0.685 0.169 237.3)",
    "oklch(0.715 0.143 215.2)",
    "oklch(0.66 0.2 292)",
    "oklch(0.72 0.12 190)",
    "oklch(0.62 0.19 259)",
  ],
  neutral: [
    "oklch(0.3 0 0)",
    "oklch(0.44 0 0)",
    "oklch(0.58 0 0)",
    "oklch(0.72 0 0)",
    "oklch(0.85 0 0)",
  ],
  vivid: [
    "oklch(0.645 0.222 16.44)",
    "oklch(0.7 0.19 41)",
    "oklch(0.769 0.166 70.08)",
    "oklch(0.715 0.155 162.5)",
    "oklch(0.66 0.2 292)",
  ],
  warm: [
    "oklch(0.82 0.13 88)",
    "oklch(0.769 0.166 70.08)",
    "oklch(0.71 0.18 50)",
    "oklch(0.67 0.2 32)",
    "oklch(0.64 0.21 12)",
  ],
};

/** The Studio's 6 font choices — id → CSS font-family stack. */
const STUDIO_FONTS: Record<string, string> = {
  geist: 'Geist, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
  inter: 'Inter, "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  system:
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif',
  grotesk: '"Space Grotesk", "SF Pro Display", Inter, system-ui, sans-serif',
  serif: 'Charter, "Iowan Old Style", "New York", Georgia, ui-serif, serif',
  mono: '"SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
};

/** The Studio's DEFAULT_CONFIG (the "Nova" look) — fields omitted from a permalink mean these. */
const STUDIO_DEFAULTS: Omit<StudioConfig, "style" | "primaryColor" | "accentColor"> = {
  mode: "dark",
  baseColor: "neutral",
  brand: "sky",
  chart: "brand",
  headingFont: "grotesk",
  bodyFont: "inter",
  radius: 14,
};

/**
 * Ported subset of the @cronus-ui/tokens `cssVarMap` — exactly the tokens a
 * Studio theme overrides. Key order here IS the emitted CSS order.
 */
const STUDIO_CSS_VARS = {
  primary: "--cronus-primary",
  primaryForeground: "--cronus-primary-foreground",
  accent: "--cronus-accent",
  accentForeground: "--cronus-accent-foreground",
  surfaceBase: "--cronus-surface-base",
  surfaceInset: "--cronus-surface-inset",
  surfaceRaised: "--cronus-surface-raised",
  surfaceOverlay: "--cronus-surface-overlay",
  surfaceElevated: "--cronus-surface-elevated",
  surfaceFloating: "--cronus-surface-floating",
  fg: "--cronus-fg",
  fgSecondary: "--cronus-fg-secondary",
  fgTertiary: "--cronus-fg-tertiary",
  fgMuted: "--cronus-fg-muted",
  border: "--cronus-border",
  borderStrong: "--cronus-border-strong",
  borderSoft: "--cronus-border-soft",
  ring: "--cronus-ring",
  info: "--cronus-info",
  radius: "--cronus-radius",
  fontDisplay: "--cronus-font-display",
  fontSans: "--cronus-font-sans",
  fontMono: "--cronus-font-mono",
  chart1: "--cronus-chart-1",
  chart2: "--cronus-chart-2",
  chart3: "--cronus-chart-3",
  chart4: "--cronus-chart-4",
  chart5: "--cronus-chart-5",
  shadowGlow: "--cronus-shadow-glow",
} as const;

type StudioTokenKey = keyof typeof STUDIO_CSS_VARS;
type StudioOverrides = Record<StudioTokenKey, string>;

/** The base preset `theme add` pins under the overrides — mirrors the Studio's provider export. */
const STUDIO_BASE_THEME = "neutral";

/**
 * Selector for the generated block. The tokens stylesheet sets theme values on
 * `[data-cronus-theme]` and mode values on `[data-cronus-theme][data-cronus-mode]`
 * (specificity 0,2,0), so a bare `:root` block would lose to the mode block.
 * `:root[data-cronus-theme]` ties that specificity and wins by source order —
 * the consumer's globals rules always follow their `@import`s.
 */
const OVERRIDES_SELECTOR = ":root[data-cronus-theme]";

export const OVERRIDES_BEGIN =
  "/* cronus-ui theme overrides — BEGIN (generated by `cronus-ui theme add`; re-runs replace this block) */";
export const OVERRIDES_END = "/* cronus-ui theme overrides — END */";

/** Globals-CSS locations probed (relative to cwd) when `--css` is not given. */
const CSS_CANDIDATES = [
  "app/globals.css",
  "src/app/globals.css",
  "styles/globals.css",
  "app/global.css",
  "src/styles/globals.css",
] as const;

/** Safety-net lookup: the config is validated upstream, but never index blindly. */
function studioEntry<T>(record: Record<string, T>, id: string, label: string): T {
  const entry = record[id];
  if (!entry) throw new Error(`Unknown ${label}: "${id}".`);
  return entry;
}

/** `id` if it names a known entry (own key only — no prototype hits), else undefined. */
function pickKnownId(id: unknown, known: Record<string, unknown>): string | undefined {
  return typeof id === "string" && Object.hasOwn(known, id) ? id : undefined;
}

function requireKnownId(id: unknown, known: Record<string, unknown>, label: string): string {
  const picked = pickKnownId(id, known);
  if (!picked) {
    const got = typeof id === "string" ? `"${id}"` : "missing";
    throw new Error(`Unknown ${label}: ${got}. Known: ${Object.keys(known).join(", ")}.`);
  }
  return picked;
}

function requireRadius(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 28) {
    throw new Error("Theme radius must be a number between 0 and 28.");
  }
  return value;
}

/**
 * The freeform primary/accent colors land verbatim in the consumer's CSS, so
 * gate them to a plausible CSS color: short, no `;`/`{`/`}`/`*` (rules out
 * declaration breakouts and comment tricks) and no `url(`.
 */
function isSafeCssColor(value: string): boolean {
  return value.length <= 64 && /^[a-z0-9#%(),./\s-]+$/i.test(value) && !/url\s*\(/i.test(value);
}

function requireOptionalCssColor(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new Error(`Theme ${field} must be a string CSS color.`);
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!isSafeCssColor(trimmed)) {
    throw new Error(
      `Theme ${field} does not look like a plain CSS color: ${JSON.stringify(value)}`,
    );
  }
  return trimmed;
}

/**
 * Decode a Studio permalink token (the `?c=` value): base64url → JSON with the
 * Studio's short keys (m/b/r/c/h/y/i/d). Mirrors the Studio's own decode —
 * unknown or malformed fields fall back to the defaults — but errors when
 * nothing applies, since "apply the defaults" is never what the user meant.
 */
function configFromPermalinkToken(rawToken: string): StudioConfig {
  const token = rawToken.trim().replace(/^c=/, "");
  let payload: Record<string, unknown>;
  try {
    if (!token || !/^[A-Za-z0-9_-]+$/.test(token)) throw new Error("not base64url");
    const parsed: unknown = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("not an object");
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    throw new Error(
      "Could not decode the payload — expected the base64url `c=` token from a Create Studio permalink (…/create?c=…), a theme JSON file, or that file's path.",
    );
  }

  const config: StudioConfig = { style: "Custom", ...STUDIO_DEFAULTS };
  let applied = false;
  if (payload.m === "light" || payload.m === "dark") {
    config.mode = payload.m;
    applied = true;
  }
  const baseColor = pickKnownId(payload.b, STUDIO_BASE_COLORS);
  if (baseColor) {
    config.baseColor = baseColor;
    applied = true;
  }
  const brand = pickKnownId(payload.r, STUDIO_BRANDS);
  if (brand) {
    config.brand = brand;
    applied = true;
  }
  const chart = pickKnownId(payload.c, STUDIO_CHARTS);
  if (chart) {
    config.chart = chart;
    applied = true;
  }
  const headingFont = pickKnownId(payload.h, STUDIO_FONTS);
  if (headingFont) {
    config.headingFont = headingFont;
    applied = true;
  }
  const bodyFont = pickKnownId(payload.y, STUDIO_FONTS);
  if (bodyFont) {
    config.bodyFont = bodyFont;
    applied = true;
  }
  const radius = payload.d;
  if (typeof radius === "number" && Number.isFinite(radius) && radius >= 0 && radius <= 28) {
    config.radius = radius;
    applied = true;
  }
  // `i` (icon library) is preview-only in the Studio — nothing to write here.
  if (!applied) {
    throw new Error(
      "The payload decodes but carries no theme settings — customize the theme in the Create Studio so the URL shows `?c=…`, then copy the link again.",
    );
  }
  return config;
}

/**
 * Parse an exported theme JSON. Accepts both shapes the Studio produces: the
 * "Export JSON" config (fields at the top level) and a saved preset
 * (`{ name, config: { … } }`). Unlike the permalink path this validates
 * strictly — a hand-edited file should fail loudly, not half-apply.
 */
function configFromJsonFile(raw: string, rel: string): StudioConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`${rel} is not valid JSON.`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${rel} must contain a JSON object (a Create Studio theme export).`);
  }
  const record = parsed as Record<string, unknown>;
  const nested = record.config;
  const body =
    nested && typeof nested === "object" && !Array.isArray(nested)
      ? (nested as Record<string, unknown>)
      : record;

  const styleRaw = body.style ?? record.name;
  const style = typeof styleRaw === "string" && styleRaw.trim() ? styleRaw.trim() : "Custom";
  const mode = body.mode;
  if (mode !== "light" && mode !== "dark") {
    throw new Error('Theme mode must be "light" or "dark".');
  }

  const config: StudioConfig = {
    style,
    mode,
    baseColor: requireKnownId(body.baseColor, STUDIO_BASE_COLORS, "base color"),
    brand: requireKnownId(body.brand, STUDIO_BRANDS, "brand color"),
    chart: requireKnownId(body.chart, STUDIO_CHARTS, "chart palette"),
    headingFont: requireKnownId(body.headingFont, STUDIO_FONTS, "heading font"),
    bodyFont: requireKnownId(body.bodyFont, STUDIO_FONTS, "body font"),
    radius: requireRadius(body.radius),
  };
  const primaryColor = requireOptionalCssColor(body.primaryColor, "primaryColor");
  if (primaryColor) config.primaryColor = primaryColor;
  const accentColor = requireOptionalCssColor(body.accentColor, "accentColor");
  if (accentColor) config.accentColor = accentColor;
  return config;
}

/** Resolve the `<source>` argument: permalink URL, theme JSON path, or bare token. */
async function resolveStudioSource(
  source: string,
  cwd: string,
): Promise<{ config: StudioConfig; origin: string }> {
  const trimmed = source.trim();
  if (!trimmed) {
    throw new Error("Pass a Create Studio permalink, a `c=` payload, or a theme JSON file.");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    let url: URL;
    try {
      url = new URL(trimmed);
    } catch {
      throw new Error(`Not a valid URL: ${trimmed}`);
    }
    const token = url.searchParams.get("c");
    if (!token) {
      throw new Error(
        "The link has no `?c=` payload. In the Create Studio the URL gains `?c=…` as soon as you customize the theme — copy it after tweaking.",
      );
    }
    return { config: configFromPermalinkToken(token), origin: "Create Studio permalink" };
  }

  const filePath = isAbsolute(trimmed) ? trimmed : join(cwd, trimmed);
  if (existsSync(filePath) || /\.json$/i.test(trimmed)) {
    if (!existsSync(filePath)) throw new Error(`Theme file not found: ${trimmed}`);
    const raw = await readFile(filePath, "utf8");
    return { config: configFromJsonFile(raw, trimmed), origin: trimmed };
  }

  return { config: configFromPermalinkToken(trimmed), origin: "c= payload" };
}

/** Port of the Studio's `configToThemeOverrides` — config → the 29 override tokens. */
function computeStudioOverrides(config: StudioConfig): StudioOverrides {
  const base = studioEntry(STUDIO_BASE_COLORS, config.baseColor, "base color");
  const brand = studioEntry(STUDIO_BRANDS, config.brand, "brand color");
  const chart = studioEntry(STUDIO_CHARTS, config.chart, "chart palette");
  const display = studioEntry(STUDIO_FONTS, config.headingFont, "heading font");
  const body = studioEntry(STUDIO_FONTS, config.bodyFont, "body font");
  const mono = studioEntry(STUDIO_FONTS, "mono", "font");
  const ramp = config.mode === "dark" ? base.dark : base.light;
  const primary =
    config.primaryColor?.trim() || (config.mode === "dark" ? brand.primary : brand.primaryLight);
  const accent =
    config.accentColor?.trim() || (config.mode === "dark" ? brand.accent : brand.accentLight);

  return {
    ...ramp,
    primary,
    accent,
    primaryForeground: brand.primaryForeground,
    accentForeground: brand.primaryForeground,
    ring: primary,
    info: accent,
    radius: `${config.radius}px`,
    fontDisplay: display,
    fontSans: body,
    fontMono: mono,
    chart1: chart[0],
    chart2: chart[1],
    chart3: chart[2],
    chart4: chart[3],
    chart5: chart[4],
    shadowGlow: `0 18px 58px color-mix(in oklch, ${primary} 32%, transparent)`,
  };
}

/** Port of `serializeOverrides` from @cronus-ui/tokens, framed by the markers. */
function serializeStudioOverrides(overrides: StudioOverrides): string {
  const lines = (Object.keys(STUDIO_CSS_VARS) as StudioTokenKey[]).map(
    (key) => `  ${STUDIO_CSS_VARS[key]}: ${overrides[key]};`,
  );
  return `${OVERRIDES_BEGIN}\n${OVERRIDES_SELECTOR} {\n${lines.join("\n")}\n}\n${OVERRIDES_END}`;
}

/** Replace an existing marked block, else append one — idempotent by content. */
function upsertOverridesBlock(source: string, framedBlock: string): string {
  const begin = source.indexOf(OVERRIDES_BEGIN);
  const end = source.indexOf(OVERRIDES_END);
  if (begin !== -1 && end !== -1 && end > begin) {
    return source.slice(0, begin) + framedBlock + source.slice(end + OVERRIDES_END.length);
  }
  const sep = source.length === 0 ? "" : source.endsWith("\n") ? "\n" : "\n\n";
  return `${source}${sep}${framedBlock}\n`;
}

function resolveCssTarget(
  cwd: string,
  cssOption?: string,
): { path: string; rel: string } | undefined {
  if (cssOption) {
    return { path: isAbsolute(cssOption) ? cssOption : join(cwd, cssOption), rel: cssOption };
  }
  for (const rel of CSS_CANDIDATES) {
    const path = join(cwd, rel);
    if (existsSync(path)) return { path, rel };
  }
  return undefined;
}

interface ThemeAddOptions {
  source: string;
  cwd: string;
  /** Globals CSS file for the overrides block (relative to cwd); default: auto-detect. */
  css?: string;
  /** Print everything that would be applied, write nothing. */
  dryRun?: boolean;
}

export async function themeAdd(options: ThemeAddOptions): Promise<void> {
  const { cwd, dryRun = false } = options;

  let config: StudioConfig;
  let origin: string;
  try {
    ({ config, origin } = await resolveStudioSource(options.source, cwd));
  } catch (error) {
    log.err(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }

  const overrides = computeStudioOverrides(config);
  const framedBlock = serializeStudioOverrides(overrides);
  const tokenKeys = Object.keys(STUDIO_CSS_VARS) as StudioTokenKey[];

  log.title(`${dryRun ? "Previewing" : "Applying"} Create Studio theme "${config.style}"`);
  log.step(`Source: ${origin}`);
  log.step(
    `Base theme "${STUDIO_BASE_THEME}", ${config.mode} mode, ${tokenKeys.length} token overrides:`,
  );
  log.step(tokenKeys.join(", "));

  // 1. Pin the layout to the base preset + the theme's mode (same mechanism as `theme set`).
  const layout = await findLayout(cwd);
  if (layout) {
    const theme = rewriteAttr(layout.content, "defaultThemeName", STUDIO_BASE_THEME);
    const colorMode = rewriteAttr(theme.content, "defaultModeName", config.mode);
    const changed = theme.changed + colorMode.changed;
    if (dryRun) {
      log.step(`Would update ${layout.rel} (${changed} attribute(s))`);
    } else {
      if (colorMode.content !== layout.content) {
        await writeFile(layout.path, colorMode.content, "utf8");
      }
      log.ok(`Updated ${layout.rel} (${changed} attribute(s) changed)`);
    }
  } else {
    log.warn(
      "No app layout mounting <CronusThemeScript>/<CronusUIProvider> found — skipped the theme/mode attributes.",
    );
  }

  // 2. The marked overrides block in the globals CSS.
  const cssTarget = resolveCssTarget(cwd, options.css);
  if (!cssTarget) {
    log.warn(
      `No globals CSS found (looked for ${CSS_CANDIDATES.join(", ")}). Re-run with --css <file>, or paste this block yourself:`,
    );
    console.log(`\n${framedBlock}\n`);
  } else if (dryRun) {
    log.step(`Would write this block to ${cssTarget.rel} (replacing any previous one):`);
    console.log(`\n${framedBlock}\n`);
  } else {
    const current = existsSync(cssTarget.path) ? await readFile(cssTarget.path, "utf8") : "";
    const hadBlock = current.includes(OVERRIDES_BEGIN);
    const next = upsertOverridesBlock(current, framedBlock);
    if (next !== current) await writeFileEnsured(cssTarget.path, next);
    log.ok(
      hadBlock
        ? `Replaced the override block in ${cssTarget.rel}`
        : `Wrote the override block to ${cssTarget.rel}`,
    );
  }

  // 3. cronus-ui.json — the same record `theme set` keeps.
  if (hasConfig(cwd)) {
    if (dryRun) {
      log.step(
        `Would record theme { name: "${STUDIO_BASE_THEME}", mode: "${config.mode}" } in ${CONFIG_FILE}`,
      );
    } else {
      const projectConfig = await readConfig(cwd);
      projectConfig.theme = { name: STUDIO_BASE_THEME, mode: config.mode };
      await writeConfig(cwd, projectConfig);
      log.ok(`Wrote theme to ${CONFIG_FILE}`);
    }
  } else {
    log.step(`No ${CONFIG_FILE} — skipped config update.`);
  }

  log.title(dryRun ? "Dry run — nothing written" : "Done");
}
