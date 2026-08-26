/**
 * Curated design DATA for the Kronus UI "Create" studio.
 *
 * Pure, server-safe data — NO "use client". These are the cohesive presets and
 * palettes a user picks from. Ramps are tuned to mirror the lightness scale of
 * `@kronus-ui/tokens` (dark surfaces ~0.11→0.31, light surfaces ~0.96→1, fg dark
 * ~0.93/0.7/0.62/0.44, fg light ~0.145/0.43/0.556/0.705) with each base ramp's
 * own hue + chroma applied, and harmonious brand / chart values throughout.
 */

import type { ThemeOverrides } from "@kronus-ui/tokens";
import { ICON_LIBRARIES, type IconLibraryId } from "./icon-library-list";
import type {
  BaseColor,
  BrandColor,
  ChartPalette,
  DesignConfig,
  FontChoice,
  Mode,
  StylePreset,
} from "./types";

/* ------------------------------------------------------------------ *
 * 1. BASE COLORS — 5 neutral ramps (light + dark BaseRamp each).
 *    Lightness scale follows tokens.ts; only hue (H) + chroma (C) vary.
 * ------------------------------------------------------------------ */

export const BASE_COLORS: BaseColor[] = [
  {
    id: "neutral",
    name: "Neutral",
    swatch: "oklch(0.556 0 0)",
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
      border: "oklch(1 0 0 / 0.1)",
      borderStrong: "oklch(1 0 0 / 0.16)",
      borderSoft: "oklch(1 0 0 / 0.06)",
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
  {
    id: "slate",
    name: "Slate",
    swatch: "oklch(0.554 0.018 252)",
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
      border: "oklch(1 0 0 / 0.1)",
      borderStrong: "oklch(1 0 0 / 0.16)",
      borderSoft: "oklch(1 0 0 / 0.06)",
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
  {
    id: "zinc",
    name: "Zinc",
    swatch: "oklch(0.552 0.008 286)",
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
      border: "oklch(1 0 0 / 0.1)",
      borderStrong: "oklch(1 0 0 / 0.16)",
      borderSoft: "oklch(1 0 0 / 0.06)",
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
  {
    id: "stone",
    name: "Stone",
    swatch: "oklch(0.553 0.012 70)",
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
      border: "oklch(1 0 0 / 0.1)",
      borderStrong: "oklch(1 0 0 / 0.16)",
      borderSoft: "oklch(1 0 0 / 0.06)",
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
  {
    id: "gray",
    name: "Gray",
    swatch: "oklch(0.555 0.009 252)",
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
      border: "oklch(1 0 0 / 0.1)",
      borderStrong: "oklch(1 0 0 / 0.16)",
      borderSoft: "oklch(1 0 0 / 0.06)",
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
];

/* ------------------------------------------------------------------ *
 * 2. BRAND COLORS — 8 brand colors.
 *    primary/accent: vivid for dark. primaryLight/accentLight: darker,
 *    foreground-safe on light surfaces.
 * ------------------------------------------------------------------ */

export const BRAND_COLORS: BrandColor[] = [
  {
    id: "sky",
    name: "Sky",
    swatch: "oklch(0.685 0.169 237.3)",
    primary: "oklch(0.685 0.169 237.3)",
    accent: "oklch(0.715 0.143 215.2)",
    primaryLight: "oklch(0.54 0.165 245)",
    accentLight: "oklch(0.55 0.13 218)",
    primaryForeground: "oklch(0.145 0 0)",
  },
  {
    id: "violet",
    name: "Violet",
    swatch: "oklch(0.66 0.2 292)",
    primary: "oklch(0.66 0.2 292)",
    accent: "oklch(0.7 0.16 305)",
    primaryLight: "oklch(0.52 0.21 292)",
    accentLight: "oklch(0.55 0.18 305)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  {
    id: "emerald",
    name: "Emerald",
    swatch: "oklch(0.715 0.155 162.5)",
    primary: "oklch(0.715 0.155 162.5)",
    accent: "oklch(0.74 0.14 174)",
    primaryLight: "oklch(0.54 0.13 163)",
    accentLight: "oklch(0.56 0.115 175)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  {
    id: "amber",
    name: "Amber",
    swatch: "oklch(0.769 0.166 70.08)",
    primary: "oklch(0.769 0.166 70.08)",
    accent: "oklch(0.81 0.145 84)",
    primaryLight: "oklch(0.58 0.13 62)",
    accentLight: "oklch(0.62 0.12 78)",
    primaryForeground: "oklch(0.205 0.04 70)",
  },
  {
    id: "rose",
    name: "Rose",
    swatch: "oklch(0.645 0.222 16.44)",
    primary: "oklch(0.645 0.222 16.44)",
    accent: "oklch(0.7 0.18 358)",
    primaryLight: "oklch(0.53 0.2 18)",
    accentLight: "oklch(0.55 0.17 0)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  {
    id: "blue",
    name: "Blue",
    swatch: "oklch(0.62 0.19 259)",
    primary: "oklch(0.62 0.19 259)",
    accent: "oklch(0.68 0.16 248)",
    primaryLight: "oklch(0.5 0.2 261)",
    accentLight: "oklch(0.54 0.17 250)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  {
    id: "orange",
    name: "Orange",
    swatch: "oklch(0.7 0.19 41)",
    primary: "oklch(0.7 0.19 41)",
    accent: "oklch(0.75 0.16 55)",
    primaryLight: "oklch(0.56 0.18 38)",
    accentLight: "oklch(0.58 0.155 52)",
    primaryForeground: "oklch(0.985 0 0)",
  },
  {
    id: "teal",
    name: "Teal",
    swatch: "oklch(0.72 0.12 190)",
    primary: "oklch(0.72 0.12 190)",
    accent: "oklch(0.76 0.11 200)",
    primaryLight: "oklch(0.55 0.1 190)",
    accentLight: "oklch(0.57 0.095 200)",
    primaryForeground: "oklch(0.985 0 0)",
  },
];

/* ------------------------------------------------------------------ *
 * 3. CHART PALETTES — 4 palettes, each exactly 5 OKLCH series colors.
 * ------------------------------------------------------------------ */

export const CHART_PALETTES: ChartPalette[] = [
  {
    id: "brand",
    name: "Brand",
    colors: [
      "oklch(0.685 0.169 237.3)", // sky
      "oklch(0.715 0.143 215.2)", // cyan
      "oklch(0.66 0.2 292)", // violet
      "oklch(0.72 0.12 190)", // teal
      "oklch(0.62 0.19 259)", // blue
    ],
  },
  {
    id: "neutral",
    name: "Neutral",
    colors: [
      "oklch(0.3 0 0)",
      "oklch(0.44 0 0)",
      "oklch(0.58 0 0)",
      "oklch(0.72 0 0)",
      "oklch(0.85 0 0)",
    ],
  },
  {
    id: "vivid",
    name: "Vivid",
    colors: [
      "oklch(0.645 0.222 16.44)", // rose/red
      "oklch(0.7 0.19 41)", // orange
      "oklch(0.769 0.166 70.08)", // amber
      "oklch(0.715 0.155 162.5)", // emerald
      "oklch(0.66 0.2 292)", // violet
    ],
  },
  {
    id: "warm",
    name: "Warm",
    colors: [
      "oklch(0.82 0.13 88)", // pale amber
      "oklch(0.769 0.166 70.08)", // amber
      "oklch(0.71 0.18 50)", // orange
      "oklch(0.67 0.2 32)", // deep orange
      "oklch(0.64 0.21 12)", // rose
    ],
  },
];

/* ------------------------------------------------------------------ *
 * 4. FONTS — ids + labels only; the real stacks are wired elsewhere.
 * ------------------------------------------------------------------ */

export const FONT_IDS = ["geist", "inter", "system", "grotesk", "serif", "mono"] as const;

export const FONT_LABELS: Record<string, string> = {
  geist: "Geist",
  inter: "Inter",
  system: "System",
  grotesk: "Space Grotesk",
  serif: "Serif",
  mono: "Mono",
};

export const FONT_CHOICES: FontChoice[] = [
  {
    id: "geist",
    name: "Geist",
    stack: 'Geist, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
  },
  {
    id: "inter",
    name: "Inter",
    stack: 'Inter, "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  {
    id: "system",
    name: "System",
    stack:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif',
  },
  {
    id: "grotesk",
    name: "Space Grotesk",
    stack: '"Space Grotesk", "SF Pro Display", Inter, system-ui, sans-serif',
  },
  {
    id: "serif",
    name: "Editorial Serif",
    stack: 'Charter, "Iowan Old Style", "New York", Georgia, ui-serif, serif',
  },
  {
    id: "mono",
    name: "Mono",
    stack: '"SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
  },
];

/* ------------------------------------------------------------------ *
 * 5. STYLE PRESETS — 6 cohesive named "looks".
 * ------------------------------------------------------------------ */

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "nova",
    name: "Nova",
    description:
      "A modern dark workspace — clean neutral surfaces lit by a luminous sky-blue brand.",
    config: {
      mode: "dark",
      baseColor: "neutral",
      brand: "sky",
      chart: "brand",
      headingFont: "grotesk",
      bodyFont: "inter",
      iconLibrary: "lucide",
      radius: 14,
    },
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Premium and atmospheric — cool slate depths with a vivid violet glow.",
    config: {
      mode: "dark",
      baseColor: "slate",
      brand: "violet",
      chart: "vivid",
      headingFont: "geist",
      bodyFont: "geist",
      iconLibrary: "phosphor",
      radius: 16,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Light, quiet, and precise — neutral paper surfaces with a calm blue accent.",
    config: {
      mode: "light",
      baseColor: "neutral",
      brand: "blue",
      chart: "neutral",
      headingFont: "inter",
      bodyFont: "inter",
      iconLibrary: "lucide",
      radius: 8,
    },
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description:
      "Raw and high-contrast — hard zinc edges, monospace type, and a bold orange punch.",
    config: {
      mode: "light",
      baseColor: "zinc",
      brand: "orange",
      chart: "vivid",
      headingFont: "mono",
      bodyFont: "mono",
      iconLibrary: "tabler",
      radius: 0,
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Warm and literary — stone paper, serif headlines, and a refined rose highlight.",
    config: {
      mode: "light",
      baseColor: "stone",
      brand: "rose",
      chart: "warm",
      headingFont: "serif",
      bodyFont: "inter",
      iconLibrary: "hugeicons",
      radius: 12,
    },
  },
  {
    id: "terminal",
    name: "Terminal",
    description:
      "A focused command-line aesthetic — deep neutral black with phosphor-emerald accents.",
    config: {
      mode: "dark",
      baseColor: "neutral",
      brand: "emerald",
      chart: "neutral",
      headingFont: "mono",
      bodyFont: "mono",
      iconLibrary: "remix",
      radius: 4,
    },
  },
];

/* ------------------------------------------------------------------ *
 * 6. DEFAULT CONFIG — the Nova look, fully spelled out.
 * ------------------------------------------------------------------ */

export const DEFAULT_CONFIG: DesignConfig = {
  style: "Nova",
  mode: "dark",
  baseColor: "neutral",
  brand: "sky",
  chart: "brand",
  headingFont: "grotesk",
  bodyFont: "inter",
  iconLibrary: "lucide",
  radius: 14,
};

export const CUSTOM_STYLE_NAME = "Custom";

export function findBaseColor(id: string): BaseColor {
  return BASE_COLORS.find((item) => item.id === id) ?? first(BASE_COLORS, "base colors");
}

export function findBrandColor(id: string): BrandColor {
  return BRAND_COLORS.find((item) => item.id === id) ?? first(BRAND_COLORS, "brand colors");
}

export function findChartPalette(id: string): ChartPalette {
  return CHART_PALETTES.find((item) => item.id === id) ?? first(CHART_PALETTES, "chart palettes");
}

export function findFontChoice(id: string): FontChoice {
  return FONT_CHOICES.find((item) => item.id === id) ?? first(FONT_CHOICES, "font choices");
}

export function configFromPreset(preset: StylePreset): DesignConfig {
  return {
    style: preset.name,
    ...preset.config,
  };
}

export function markCustom(config: DesignConfig): DesignConfig {
  return { ...config, style: CUSTOM_STYLE_NAME };
}

export function configToThemeOverrides(config: DesignConfig): ThemeOverrides {
  const base = findBaseColor(config.baseColor);
  const brand = findBrandColor(config.brand);
  const chart = findChartPalette(config.chart);
  const display = findFontChoice(config.headingFont);
  const body = findFontChoice(config.bodyFont);
  const mono = findFontChoice("mono");
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
    fontDisplay: display.stack,
    fontSans: body.stack,
    fontMono: mono.stack,
    chart1: chart.colors[0],
    chart2: chart.colors[1],
    chart3: chart.colors[2],
    chart4: chart.colors[3],
    chart5: chart.colors[4],
    shadowGlow: `0 18px 58px color-mix(in oklch, ${primary} 32%, transparent)`,
  };
}

export function serializeCreateCss(config: DesignConfig, selector = ":root"): string {
  const overrides = configToThemeOverrides(config);
  const cssVars: Record<string, string> = {
    "--kronus-primary": overrides.primary ?? "",
    "--kronus-primary-foreground": overrides.primaryForeground ?? "",
    "--kronus-accent": overrides.accent ?? "",
    "--kronus-accent-foreground": overrides.accentForeground ?? "",
    "--kronus-surface-base": overrides.surfaceBase ?? "",
    "--kronus-surface-inset": overrides.surfaceInset ?? "",
    "--kronus-surface-raised": overrides.surfaceRaised ?? "",
    "--kronus-surface-overlay": overrides.surfaceOverlay ?? "",
    "--kronus-surface-elevated": overrides.surfaceElevated ?? "",
    "--kronus-surface-floating": overrides.surfaceFloating ?? "",
    "--kronus-fg": overrides.fg ?? "",
    "--kronus-fg-secondary": overrides.fgSecondary ?? "",
    "--kronus-fg-tertiary": overrides.fgTertiary ?? "",
    "--kronus-fg-muted": overrides.fgMuted ?? "",
    "--kronus-border": overrides.border ?? "",
    "--kronus-border-strong": overrides.borderStrong ?? "",
    "--kronus-border-soft": overrides.borderSoft ?? "",
    "--kronus-ring": overrides.ring ?? "",
    "--kronus-radius": overrides.radius ?? "",
    "--kronus-font-display": overrides.fontDisplay ?? "",
    "--kronus-font-sans": overrides.fontSans ?? "",
    "--kronus-font-mono": overrides.fontMono ?? "",
    "--kronus-chart-1": overrides.chart1 ?? "",
    "--kronus-chart-2": overrides.chart2 ?? "",
    "--kronus-chart-3": overrides.chart3 ?? "",
    "--kronus-chart-4": overrides.chart4 ?? "",
    "--kronus-chart-5": overrides.chart5 ?? "",
  };
  const lines = Object.entries(cssVars)
    .filter(([, value]) => value.length > 0)
    .map(([key, value]) => `  ${key}: ${value};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

export function serializeCreateProvider(config: DesignConfig): string {
  const overrides = configToThemeOverrides(config);
  const body = JSON.stringify(overrides, null, 2)
    .replace(/"([^"]+)":/g, "$1:")
    .replace(/"/g, '"');

  return `import { KronusUIProvider } from "@kronus-ui/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <KronusUIProvider
      asRoot
      defaultThemeName="neutral"
      defaultModeName="${config.mode}"
      overrides={${body}}
    >
      {children}
    </KronusUIProvider>
  );
}`;
}

export function serializeCreateJson(config: DesignConfig): string {
  return JSON.stringify(config, null, 2);
}

export function createSavedPreset(name: string, config: DesignConfig): StylePreset {
  const now = new Date().toISOString();
  return {
    id: `custom-${slugify(name)}-${Date.now().toString(36)}`,
    name: name.trim(),
    description: "Saved from Create Studio.",
    version: 1,
    custom: true,
    createdAt: now,
    config: {
      mode: config.mode,
      baseColor: config.baseColor,
      brand: config.brand,
      chart: config.chart,
      headingFont: config.headingFont,
      bodyFont: config.bodyFont,
      iconLibrary: config.iconLibrary,
      primaryColor: config.primaryColor,
      accentColor: config.accentColor,
      radius: config.radius,
    },
  };
}

export function serializePresetCode(preset: StylePreset): string {
  const json = JSON.stringify({ ...preset, version: 1 });
  if (typeof btoa === "undefined") {
    return json;
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `kronus:${btoa(binary)}`;
}

export function parsePresetCode(value: string): StylePreset {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Paste a preset code or JSON preset.");
  }

  const raw = trimmed.startsWith("{")
    ? trimmed
    : decodePresetPayload(trimmed.replace(/^kronus:/, ""));
  const parsed = JSON.parse(raw) as Partial<StylePreset>;

  if (!parsed.name || !parsed.config) {
    throw new Error("Preset is missing a name or config.");
  }

  const config = parsed.config;
  assertId(config.baseColor, BASE_COLORS, "base color");
  assertId(config.brand, BRAND_COLORS, "brand");
  assertId(config.chart, CHART_PALETTES, "chart palette");
  assertId(config.headingFont, FONT_CHOICES, "heading font");
  assertId(config.bodyFont, FONT_CHOICES, "body font");
  if (config.mode !== "light" && config.mode !== "dark") {
    throw new Error("Preset mode must be light or dark.");
  }
  if (!Number.isFinite(config.radius) || config.radius < 0 || config.radius > 28) {
    throw new Error("Preset radius must be between 0 and 28.");
  }
  // Optional for backward compatibility — older codes predate icon libraries.
  const iconLibrary = isIconLibraryId(config.iconLibrary)
    ? config.iconLibrary
    : DEFAULT_CONFIG.iconLibrary;

  return {
    id: parsed.id || `imported-${slugify(parsed.name)}-${Date.now().toString(36)}`,
    name: parsed.name,
    description: parsed.description || "Imported preset.",
    version: 1,
    custom: true,
    createdAt: parsed.createdAt || new Date().toISOString(),
    config: {
      mode: config.mode,
      baseColor: config.baseColor,
      brand: config.brand,
      chart: config.chart,
      headingFont: config.headingFont,
      bodyFont: config.bodyFont,
      iconLibrary,
      primaryColor: config.primaryColor,
      accentColor: config.accentColor,
      radius: config.radius,
    },
  };
}

/** Type guard: is `value` one of the known icon-library ids? */
function isIconLibraryId(value: unknown): value is IconLibraryId {
  return typeof value === "string" && ICON_LIBRARIES.some((lib) => lib.id === value);
}

/* ------------------------------------------------------------------ *
 * 7. SHAREABLE PERMALINK — encode the 7 core fields (by stable id)
 *    into a compact base64url `?c=` token. Defaults are omitted to keep
 *    the link short; decode is fully guarded + validated.
 * ------------------------------------------------------------------ */

/** Compact shape stored in the `?c=` token. Keys are short; defaults are dropped. */
interface PermalinkPayload {
  m?: Mode; // mode
  b?: string; // baseColor id
  r?: string; // brand id
  c?: string; // chart id
  h?: string; // headingFont id
  y?: string; // bodyFont id
  i?: string; // iconLibrary id
  d?: number; // radius
}

/**
 * Encode the current config into a compact base64url token. Only the core
 * fields are encoded, by their stable ids — never raw objects — and any field
 * equal to {@link DEFAULT_CONFIG} is omitted so a default config yields "".
 */
export function encodeConfigParam(config: DesignConfig): string {
  const payload: PermalinkPayload = {};
  if (config.mode !== DEFAULT_CONFIG.mode) payload.m = config.mode;
  if (config.baseColor !== DEFAULT_CONFIG.baseColor) payload.b = config.baseColor;
  if (config.brand !== DEFAULT_CONFIG.brand) payload.r = config.brand;
  if (config.chart !== DEFAULT_CONFIG.chart) payload.c = config.chart;
  if (config.headingFont !== DEFAULT_CONFIG.headingFont) payload.h = config.headingFont;
  if (config.bodyFont !== DEFAULT_CONFIG.bodyFont) payload.y = config.bodyFont;
  if (config.iconLibrary !== DEFAULT_CONFIG.iconLibrary) payload.i = config.iconLibrary;
  if (config.radius !== DEFAULT_CONFIG.radius) payload.d = config.radius;

  if (Object.keys(payload).length === 0) return "";
  return base64UrlEncode(JSON.stringify(payload));
}

/**
 * Decode a `?c=` token back into a full {@link DesignConfig}. Every id is
 * validated against the known lists; anything malformed or unknown is ignored
 * and falls back to the default for that field. Returns null only if the token
 * is unusable and contributes nothing on top of defaults.
 */
export function decodeConfigParam(token: string | null | undefined): DesignConfig | null {
  if (!token) return null;
  let payload: PermalinkPayload;
  try {
    payload = JSON.parse(base64UrlDecode(token)) as PermalinkPayload;
  } catch {
    return null;
  }
  if (!payload || typeof payload !== "object") return null;

  const config: DesignConfig = { ...DEFAULT_CONFIG, style: CUSTOM_STYLE_NAME };
  let applied = false;

  if (payload.m === "light" || payload.m === "dark") {
    config.mode = payload.m;
    applied = true;
  }
  applied = applyKnownId(payload.b, BASE_COLORS, (id) => (config.baseColor = id)) || applied;
  applied = applyKnownId(payload.r, BRAND_COLORS, (id) => (config.brand = id)) || applied;
  applied = applyKnownId(payload.c, CHART_PALETTES, (id) => (config.chart = id)) || applied;
  applied = applyKnownId(payload.h, FONT_CHOICES, (id) => (config.headingFont = id)) || applied;
  applied = applyKnownId(payload.y, FONT_CHOICES, (id) => (config.bodyFont = id)) || applied;
  applied =
    applyKnownId(payload.i, ICON_LIBRARIES, (id) => {
      config.iconLibrary = id as IconLibraryId;
    }) || applied;
  const radius = payload.d;
  if (typeof radius === "number" && Number.isFinite(radius) && radius >= 0 && radius <= 28) {
    config.radius = radius;
    applied = true;
  }

  if (!applied) return null;
  return matchStyle(config);
}

/** If `style` ends up matching a known preset's config exactly, name it. */
function matchStyle(config: DesignConfig): DesignConfig {
  const match = STYLE_PRESETS.find(
    (preset) =>
      preset.config.mode === config.mode &&
      preset.config.baseColor === config.baseColor &&
      preset.config.brand === config.brand &&
      preset.config.chart === config.chart &&
      preset.config.headingFont === config.headingFont &&
      preset.config.bodyFont === config.bodyFont &&
      preset.config.iconLibrary === config.iconLibrary &&
      preset.config.radius === config.radius,
  );
  return match ? { ...config, style: match.name } : config;
}

function applyKnownId(
  id: string | undefined,
  items: readonly { id: string }[],
  set: (id: string) => void,
): boolean {
  if (id && items.some((item) => item.id === id)) {
    set(id);
    return true;
  }
  return false;
}

function base64UrlEncode(value: string): string {
  if (typeof btoa === "undefined") return "";
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  if (typeof atob === "undefined") {
    throw new Error("Permalink decode is unavailable in this environment.");
  }
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function makeShuffledConfig(seed = Date.now()): DesignConfig {
  const pick = <T>(items: readonly T[], offset: number, label: string) => {
    const item = items[(seed + offset) % items.length];
    return item ?? first(items, label);
  };
  const radii = [0, 4, 8, 12, 14, 16, 20, 24] as const;

  return {
    style: CUSTOM_STYLE_NAME,
    mode: pick(["dark", "light"] as const, 0, "modes"),
    baseColor: pick(BASE_COLORS, 7, "base colors").id,
    brand: pick(BRAND_COLORS, 13, "brand colors").id,
    chart: pick(CHART_PALETTES, 19, "chart palettes").id,
    headingFont: pick(FONT_CHOICES, 23, "font choices").id,
    bodyFont: pick(
      FONT_CHOICES.filter((font) => font.id !== "mono"),
      29,
      "body font choices",
    ).id,
    iconLibrary: pick(ICON_LIBRARIES, 31, "icon libraries").id,
    radius: radii[seed % radii.length] ?? 14,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);
}

function assertId(id: string | undefined, items: { id: string }[], label: string) {
  if (!id || !items.some((item) => item.id === id)) {
    throw new Error(`Unknown ${label}: ${id ?? "missing"}.`);
  }
}

function first<T>(items: readonly T[], label: string): T {
  const item = items[0];
  if (!item) {
    throw new Error(`Create studio has no ${label} configured.`);
  }
  return item;
}

function decodePresetPayload(value: string): string {
  if (typeof atob === "undefined") {
    throw new Error("Preset code import is unavailable in this environment.");
  }
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
