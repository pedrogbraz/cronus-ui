/**
 * Cronus design tokens — single source of truth.
 *
 * These TS objects mirror the CSS variables defined in `styles/tokens.css`.
 * They are consumed by the ThemeBuilder (to generate override snippets) and by
 * `@cronus-ui/theme` (to apply runtime overrides). Components NEVER read these
 * directly — they use semantic Tailwind utilities that resolve to the CSS vars.
 *
 * Values are cherry-picked from the premium Aurora language (cooud-workforce /
 * cooud-exchange) and the Neutral language (dashboard / refund / status).
 */

export type ThemeName = "aurora" | "neutral" | "midnight" | "sunset" | "emerald";
export type Mode = "light" | "dark";

export interface ThemeTokens {
  // Brand
  primary: string;
  primaryForeground: string;
  /**
   * Accessible variant of `primary` for use as small TEXT (links, labels, tinted
   * badge text) on `surface-base`. The brand `primary` is a FILL color (great as
   * `bg-primary` with `primaryForeground`) and is NOT legible as small text on
   * the base surface in light / bright-accent themes — e.g. sunset-light amber on
   * white is ~2:1. This token is the same hue tuned in lightness (darker in light
   * themes, lighter in very-dark ones) to clear WCAG AA (>=4.5:1) on `surface-base`.
   * Where `primary` already clears AA as text, this equals `primary`. Exposed as
   * the `text-primary-strong` utility. See CONTRACT.md.
   */
  primaryText: string;
  accent: string;
  accentForeground: string;
  // Surfaces (low → high elevation)
  surfaceBase: string;
  surfaceInset: string;
  surfaceRaised: string;
  surfaceOverlay: string;
  surfaceElevated: string;
  surfaceFloating: string;
  // Foreground / text
  fg: string;
  fgSecondary: string;
  fgTertiary: string;
  fgMuted: string;
  fgInverse: string;
  // Lines
  border: string;
  borderStrong: string;
  borderSoft: string;
  ring: string;
  // Semantic
  success: string;
  /**
   * Accessible variant of `success` for use as small TEXT (e.g. positive values
   * in a data viewer) on light surfaces. `success` is tuned as a status FILL /
   * icon color and reads marginally sub-AA as small text on the lightest light
   * surfaces (e.g. sunset-light green ~4.4:1 on `surface-inset`); this token is
   * the same hue darkened just enough to clear >=4.5:1 on both `surface-base` and
   * `surface-inset`. Where `success` already clears AA as text, this equals it.
   * Exposed as the `text-success-strong` utility.
   */
  successText: string;
  warning: string;
  /**
   * Accessible variant of `warning` for use as small TEXT (e.g. a "Perf" / "Beta"
   * tinted badge label). `warning` is tuned as a status FILL / icon color; as
   * small text on a same-hue `bg-warning/15` tint over the lightest surface it
   * lands at the AA edge in the light themes. This token is the same hue darkened
   * (light) just enough to clear >=4.6:1 on that tint; in the dark themes the raw
   * `warning` already clears AA as tint text, so this equals it. Exposed as the
   * `text-warning-strong` utility.
   */
  warningText: string;
  error: string;
  /**
   * Accessible variant of `error` for use as small TEXT (e.g. a destructive
   * tinted badge label) on a same-hue `bg-error/15` tint. `error` is a FILL /
   * icon color and reads sub-AA as small text on its own tint (both the light
   * tint over white and the dark tint over a raised surface). This token keeps
   * the hue and shifts lightness (darker in light, lighter in the near-black dark
   * themes) to clear >=4.6:1 on that tint. Where `error` already clears AA as tint
   * text (neutral-dark), this equals it. Exposed as the `text-error-strong`
   * utility.
   */
  errorText: string;
  info: string;
  /**
   * Accessible variant of `info` for use as small TEXT (e.g. numeric values in a
   * JSON viewer, a "Fix" tinted badge label) on a same-hue `bg-info/15` tint.
   * `info` is a FILL / icon color and reads sub-AA as small text on its own tint;
   * this token keeps the hue and shifts lightness (darker in light, lighter in
   * the dark themes) to clear >=4.6:1 on that tint. Where `info` already clears AA
   * as tint text, this equals it. Exposed as the `text-info-strong` utility.
   */
  infoText: string;
  // Shape
  radius: string;
  // Typography
  fontSans: string;
  fontDisplay: string;
  fontMono: string;
  // Data visualization
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  // Elevation
  shadowXs: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowGlow: string;
}

/** Subset of tokens a consumer can override per-scope at runtime. */
export type ThemeOverrides = Partial<ThemeTokens>;

const fonts = {
  sans: '"SF Pro Text", Geist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  display: '"SF Pro Display", Geist, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono: '"SF Mono", "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace',
} as const;

const auroraDark: ThemeTokens = {
  primary: "oklch(0.685 0.169 237.3)", // sky-500 #0ea5e9
  primaryForeground: "oklch(0.145 0.005 285.8)",
  primaryText: "oklch(0.685 0.169 237.3)", // = primary — #00a6f4 clears 7.3:1 on the dark surface-base
  accent: "oklch(0.715 0.143 215.2)", // cyan-500 #06b6d4
  accentForeground: "oklch(0.145 0 0)",
  surfaceBase: "oklch(0.145 0.005 285.8)", // #09090b
  surfaceInset: "oklch(0.165 0.005 285.8)", // #0c0c0e
  surfaceRaised: "oklch(0.195 0.005 285.8)", // #111113
  surfaceOverlay: "oklch(0.235 0.006 285.9)", // #18181b
  surfaceElevated: "oklch(0.27 0.006 286)", // #1f1f23
  // Floating panels (popover, dropdown, hover-card, navigation viewport,
  // morphing-popover) sit DARK and rely on border + shadow for separation —
  // kept below `overlay` so item hover (surface-overlay) reads as a lighter
  // highlight on a near-black surface rather than a flat mid-grey panel.
  surfaceFloating: "oklch(0.2 0.006 286)", // #121216
  fg: "oklch(0.985 0.001 106.4)", // #fafaf9
  fgSecondary: "oklch(0.705 0.015 286)", // #a1a1aa
  fgTertiary: "oklch(0.62 0.014 286)", // #83838c — WCAG AA: >=4.5:1 over dark surfaces (base/inset/raised/overlay)
  fgMuted: "oklch(0.442 0.013 286)", // #52525b
  fgInverse: "oklch(0.235 0.006 285.9)",
  border: "oklch(1 0 0 / 0.1)",
  borderStrong: "oklch(1 0 0 / 0.14)",
  borderSoft: "oklch(1 0 0 / 0.06)",
  ring: "oklch(0.685 0.169 237.3)",
  success: "oklch(0.715 0.155 162.5)", // emerald #10b981
  successText: "oklch(0.715 0.155 162.5)", // = success — clears >=8:1 on the dark surfaces
  warning: "oklch(0.769 0.166 70.08)", // amber #f59e0b
  warningText: "oklch(0.769 0.166 70.08)", // = warning — clears >=6.5:1 on the dark tints
  error: "oklch(0.645 0.222 16.44)", // rose #f43f5e
  // Rose at L=0.645 reads ~4.3:1 as text on its own error/15 tint over a raised
  // dark surface — lighten (hue kept) to clear >=4.8:1 for legible tinted-badge text.
  errorText: "oklch(0.69 0.222 16.44)", // #ff4c6a
  info: "oklch(0.715 0.143 215.2)", // cyan #06b6d4
  infoText: "oklch(0.715 0.143 215.2)", // = info — clears >=6:1 on the dark tints
  radius: "14px",
  fontSans: fonts.sans,
  fontDisplay: fonts.display,
  fontMono: fonts.mono,
  chart1: "oklch(0.685 0.169 237.3)",
  chart2: "oklch(0.715 0.143 215.2)",
  chart3: "oklch(0.62 0.21 292)",
  chart4: "oklch(0.7 0.15 162)",
  chart5: "oklch(0.78 0.16 70)",
  shadowXs: "0 1px 2px rgba(0,0,0,0.20)",
  shadowSm: "0 2px 4px rgba(0,0,0,0.22)",
  shadowMd: "0 6px 12px rgba(0,0,0,0.24), 0 2px 4px rgba(0,0,0,0.16)",
  shadowLg: "0 12px 24px rgba(0,0,0,0.28), 0 4px 8px rgba(0,0,0,0.18)",
  shadowGlow: "0 12px 32px rgba(14,165,233,0.32)",
};

const auroraLight: ThemeTokens = {
  ...auroraDark,
  primaryForeground: "oklch(0.145 0.005 285.8)",
  // Sky-500 on white reads ~2.7:1 as text — darken (hue kept, chroma fitted to
  // sRGB gamut) to clear >=4.7:1 on its OWN primary/15 tint over white (the worst
  // surface a primary-strong badge/step-label lands on), not just surface-base.
  // Inherited by midnight/sunset/emerald light unless they override primary (they
  // do → each sets its own).
  primaryText: "oklch(0.515 0.12 237.3)", // #0070a3 — >=4.7:1 on the primary/15 tint
  accentForeground: "oklch(0.145 0 0)",
  surfaceBase: "oklch(1 0 0)", // #ffffff
  surfaceInset: "oklch(0.985 0 0)", // #fafafa
  surfaceRaised: "oklch(1 0 0)",
  surfaceOverlay: "oklch(0.967 0.001 286)", // #f4f4f5
  surfaceElevated: "oklch(1 0 0)",
  surfaceFloating: "oklch(1 0 0)",
  fg: "oklch(0.235 0.006 285.9)", // #18181b
  fgSecondary: "oklch(0.442 0.013 286)", // #52525b
  // Lowered from 0.552 → 0.54 so info-bearing tertiary text clears >=4.6:1 on the
  // lightest common surface (surface-overlay #f4f4f5), not just the ~4.4 it had.
  fgTertiary: "oklch(0.54 0.014 286)",
  fgMuted: "oklch(0.705 0.015 286)",
  fgInverse: "oklch(0.985 0.001 106.4)",
  border: "oklch(0 0 0 / 0.1)",
  borderStrong: "oklch(0 0 0 / 0.14)",
  borderSoft: "oklch(0 0 0 / 0.06)",
  shadowXs: "0 1px 2px rgba(16,24,40,0.06)",
  shadowSm: "0 2px 4px rgba(16,24,40,0.08)",
  shadowMd: "0 6px 12px rgba(16,24,40,0.10), 0 2px 4px rgba(16,24,40,0.06)",
  shadowLg: "0 12px 24px rgba(16,24,40,0.12), 0 4px 8px rgba(16,24,40,0.08)",
  shadowGlow: "0 12px 32px rgba(14,165,233,0.22)",
  success: "oklch(0.52 0.15 162)",
  // success at L=0.52 reads ~3.98:1 on its own success/15 tint over white — darken
  // to clear >=4.6:1 on that worst-case tint (and >=5.7:1 on surface-base/inset).
  successText: "oklch(0.48 0.15 162)", // #007642
  warning: "oklch(0.52 0.12 70)",
  warningText: "oklch(0.518 0.12 70)", // #935900 — clears >=4.6:1 on the warning/15 tint
  info: "oklch(0.52 0.16 235)",
  infoText: "oklch(0.49 0.16 235)", // #006aad — clears >=4.6:1 on the info/15 tint
  error: "oklch(0.55 0.2 25)",
  errorText: "oklch(0.531 0.2 25)", // #c61d28 — clears >=4.6:1 on the error/15 tint
};

const neutralLight: ThemeTokens = {
  primary: "oklch(0.205 0 0)",
  primaryForeground: "oklch(0.985 0 0)",
  primaryText: "oklch(0.205 0 0)", // = primary — near-black, clears >=17:1 as text
  accent: "oklch(0.96 0 0)",
  accentForeground: "oklch(0.205 0 0)",
  surfaceBase: "oklch(0.985 0 0)",
  surfaceInset: "oklch(0.97 0 0)",
  surfaceRaised: "oklch(1 0 0)",
  surfaceOverlay: "oklch(0.96 0 0)",
  surfaceElevated: "oklch(1 0 0)",
  surfaceFloating: "oklch(1 0 0)",
  fg: "oklch(0.145 0 0)",
  fgSecondary: "oklch(0.43 0 0)",
  // Lowered from 0.556 → 0.53 so tertiary text clears >=4.6:1 on the lightest
  // common surface (surface-overlay #f2f2f2), up from ~4.2.
  fgTertiary: "oklch(0.53 0 0)",
  fgMuted: "oklch(0.705 0 0)",
  fgInverse: "oklch(0.985 0 0)",
  border: "oklch(0.915 0 0)",
  borderStrong: "oklch(0.86 0 0)",
  borderSoft: "oklch(0.94 0 0)",
  ring: "oklch(0.705 0 0)",
  success: "oklch(0.52 0.15 162)",
  // Darkened to clear >=4.6:1 on its own success/15 tint over white (the lightest
  // surface a badge lands on), not just surface-inset.
  successText: "oklch(0.48 0.15 162)", // #007642
  warning: "oklch(0.52 0.12 70)",
  warningText: "oklch(0.518 0.12 70)", // #935900 — clears >=4.6:1 on the warning/15 tint
  error: "oklch(0.55 0.2 25)",
  errorText: "oklch(0.531 0.2 25)", // #c61d28 — clears >=4.6:1 on the error/15 tint
  info: "oklch(0.52 0.16 235)",
  infoText: "oklch(0.49 0.16 235)", // #006aad — clears >=4.6:1 on the info/15 tint
  radius: "14px",
  fontSans: fonts.sans,
  fontDisplay: fonts.display,
  fontMono: fonts.mono,
  chart1: "oklch(0.3 0 0)",
  chart2: "oklch(0.44 0 0)",
  chart3: "oklch(0.58 0 0)",
  chart4: "oklch(0.72 0 0)",
  chart5: "oklch(0.85 0 0)",
  shadowXs: "0 1px 2px rgba(16,24,40,0.05)",
  shadowSm: "0 1px 3px rgba(16,24,40,0.08)",
  shadowMd: "0 4px 8px rgba(16,24,40,0.08), 0 2px 4px rgba(16,24,40,0.04)",
  shadowLg: "0 12px 24px rgba(16,24,40,0.10), 0 4px 8px rgba(16,24,40,0.06)",
  shadowGlow: "0 0 0 4px oklch(0.705 0 0 / 0.18)",
};

const neutralDark: ThemeTokens = {
  ...neutralLight,
  primary: "oklch(0.93 0 0)",
  primaryForeground: "oklch(0.11 0 0)",
  primaryText: "oklch(0.93 0 0)", // = primary — near-white, clears >=16:1 on the dark base
  accent: "oklch(0.27 0 0)",
  accentForeground: "oklch(0.93 0 0)",
  surfaceBase: "oklch(0.11 0 0)",
  surfaceInset: "oklch(0.13 0 0)",
  surfaceRaised: "oklch(0.16 0 0)",
  surfaceOverlay: "oklch(0.2 0 0)",
  surfaceElevated: "oklch(0.23 0 0)",
  surfaceFloating: "oklch(0.165 0 0)", // #121212 — dark floating panel (below overlay so item hover lifts)
  fg: "oklch(0.93 0 0)",
  fgSecondary: "oklch(0.7 0 0)",
  fgTertiary: "oklch(0.62 0 0)",
  fgMuted: "oklch(0.44 0 0)",
  fgInverse: "oklch(0.11 0 0)",
  border: "oklch(1 0 0 / 0.1)",
  borderStrong: "oklch(1 0 0 / 0.16)",
  borderSoft: "oklch(1 0 0 / 0.06)",
  ring: "oklch(0.55 0 0)",
  success: "oklch(0.715 0.155 162.5)",
  successText: "oklch(0.715 0.155 162.5)", // = success — clears >=8:1 on the dark surfaces
  warning: "oklch(0.769 0.166 70.08)",
  warningText: "oklch(0.769 0.166 70.08)", // = warning — clears >=7:1 on the dark tints
  info: "oklch(0.715 0.143 215.2)",
  infoText: "oklch(0.715 0.143 215.2)", // = info — clears >=6.6:1 on the dark tints
  error: "oklch(0.704 0.191 22.216)",
  errorText: "oklch(0.704 0.191 22.216)", // = error — this lighter-hued rose clears >=5.6:1 on its dark tint
  shadowGlow: "0 0 0 4px oklch(0.6 0 0 / 0.3)",
};

/*
 * Brand presets — each spreads the matching Aurora base (keeping its WCAG-tuned
 * surface / fg / border ramps) and overrides ONLY the brand-relative tokens:
 * primary, accent, their foregrounds, ring, the chart ramp, the brand-hued glow,
 * and a hue-matched info/success tint. This keeps a11y proven while making each
 * preset visually distinct.
 */

// Midnight — deep indigo → violet, premium dark-first.
const midnightDark: ThemeTokens = {
  ...auroraDark,
  primary: "oklch(0.55 0.205 280)", // indigo #6158e4
  primaryForeground: "oklch(0.985 0.005 285)",
  // Indigo at L=0.596 reads only ~4.25:1 on the raised dark surface (and ~3.7:1 on
  // a primary/15 tint over it) — lighten further (hue kept) to clear >=4.8:1 on the
  // raised surface and the primary/15 tint, the worst surfaces a badge/link lands on.
  primaryText: "oklch(0.665 0.205 280)", // #807dff — >=4.8:1 on surface-raised + primary/15 tint
  accent: "oklch(0.53 0.2 292)", // violet #734ad3
  accentForeground: "oklch(0.985 0.005 285)",
  ring: "oklch(0.55 0.205 280)",
  info: "oklch(0.62 0.16 280)", // indigo-tinted info
  // Indigo-tinted info at L=0.62 reads ~4:1 on its own info/15 tint over a raised
  // surface — lighten (hue kept) to clear >=4.7:1 on that tint as small text.
  infoText: "oklch(0.68 0.16 280)", // #878af8
  chart1: "oklch(0.55 0.205 280)",
  chart2: "oklch(0.6 0.2 295)",
  chart3: "oklch(0.66 0.2 300)", // #a76ef8
  chart4: "oklch(0.62 0.19 268)",
  chart5: "oklch(0.7 0.16 315)",
  shadowGlow: "0 12px 32px rgba(97,88,228,0.34)",
};

const midnightLight: ThemeTokens = {
  ...auroraLight,
  primary: "oklch(0.55 0.205 280)",
  primaryForeground: "oklch(0.985 0.005 285)",
  // Indigo clears >=5.2:1 on white but only ~4.26:1 on its own primary/15 tint —
  // darken (hue kept) to clear >=4.6:1 on that tint; overrides the inherited sky value.
  primaryText: "oklch(0.528 0.205 280)", // #5b51dc — >=4.6:1 on the primary/15 tint
  accent: "oklch(0.53 0.2 292)",
  accentForeground: "oklch(0.985 0.005 285)",
  ring: "oklch(0.55 0.205 280)",
  info: "oklch(0.5 0.17 280)",
  infoText: "oklch(0.5 0.17 280)", // = info — this darker indigo info clears >=5:1 on its own info/15 tint
  chart1: "oklch(0.55 0.205 280)",
  chart2: "oklch(0.6 0.2 295)",
  chart3: "oklch(0.66 0.2 300)",
  chart4: "oklch(0.62 0.19 268)",
  chart5: "oklch(0.7 0.16 315)",
  shadowGlow: "0 12px 32px rgba(97,88,228,0.24)",
};

// Sunset — warm amber → rose, energetic.
const sunsetDark: ThemeTokens = {
  ...auroraDark,
  primary: "oklch(0.78 0.16 65)", // amber #fc9f30
  primaryForeground: "oklch(0.24 0.05 55)",
  primaryText: "oklch(0.78 0.16 65)", // = primary — amber clears >=9:1 on the dark base
  accent: "oklch(0.585 0.22 18)", // rose #e01f47
  accentForeground: "oklch(0.99 0.01 40)",
  ring: "oklch(0.78 0.16 65)",
  success: "oklch(0.74 0.16 130)", // warm-leaning green to fit the palette
  successText: "oklch(0.74 0.16 130)", // = success — clears >=8:1 on the dark surfaces
  info: "oklch(0.72 0.13 55)", // amber-tinted info
  infoText: "oklch(0.72 0.13 55)", // = info — clears >=5.6:1 on the dark tints
  chart1: "oklch(0.78 0.16 65)",
  chart2: "oklch(0.7 0.19 40)",
  chart3: "oklch(0.585 0.22 18)", // #e01f47
  chart4: "oklch(0.82 0.16 85)",
  chart5: "oklch(0.66 0.18 4)",
  shadowGlow: "0 12px 32px rgba(252,159,48,0.34)",
};

const sunsetLight: ThemeTokens = {
  ...auroraLight,
  primary: "oklch(0.78 0.16 65)",
  primaryForeground: "oklch(0.24 0.05 55)",
  // Amber at L=0.78 is only ~2:1 on white — darken (hue kept, chroma fitted to
  // gamut) to clear >=4.7:1 on its OWN primary/15 tint over white (the worst
  // surface a primary-strong badge/step-label lands on), not just surface-base.
  primaryText: "oklch(0.54 0.129 65)", // #a05b00 — >=4.7:1 on the primary/15 tint
  accent: "oklch(0.585 0.22 18)",
  accentForeground: "oklch(0.99 0.01 40)",
  ring: "oklch(0.78 0.16 65)",
  success: "oklch(0.55 0.15 130)",
  // Darkened so the warm-green text clears >=4.6:1 on its own success/15 tint over
  // white (the worst case), not just surface-inset.
  successText: "oklch(0.5 0.15 130)", // #457200
  info: "oklch(0.55 0.13 55)",
  infoText: "oklch(0.52 0.13 55)", // #a05000 — clears >=4.6:1 on the info/15 tint
  chart1: "oklch(0.7 0.16 60)",
  chart2: "oklch(0.62 0.19 40)",
  chart3: "oklch(0.585 0.22 18)",
  chart4: "oklch(0.76 0.16 85)",
  chart5: "oklch(0.58 0.18 4)",
  shadowGlow: "0 12px 32px rgba(252,159,48,0.24)",
};

// Emerald — fresh green → teal.
const emeraldDark: ThemeTokens = {
  ...auroraDark,
  primary: "oklch(0.74 0.16 160)", // green #23c987
  primaryForeground: "oklch(0.2 0.04 160)",
  primaryText: "oklch(0.74 0.16 160)", // = primary — green clears >=9:1 on the dark base
  accent: "oklch(0.76 0.12 185)", // teal #3bcabb
  accentForeground: "oklch(0.2 0.04 185)",
  ring: "oklch(0.74 0.16 160)",
  info: "oklch(0.74 0.12 185)", // teal-tinted info
  infoText: "oklch(0.74 0.12 185)", // = info — clears >=6.4:1 on the dark tints
  chart1: "oklch(0.74 0.16 160)",
  chart2: "oklch(0.76 0.12 185)",
  chart3: "oklch(0.68 0.15 145)",
  chart4: "oklch(0.7 0.13 200)",
  chart5: "oklch(0.8 0.15 130)",
  shadowGlow: "0 12px 32px rgba(35,201,135,0.34)",
};

const emeraldLight: ThemeTokens = {
  ...auroraLight,
  primary: "oklch(0.74 0.16 160)",
  primaryForeground: "oklch(0.2 0.04 160)",
  // Green at L=0.74 is only ~2:1 on white — darken (hue kept, chroma fitted to
  // gamut) to clear >=4.6:1 on its OWN primary/15 tint over white (the worst
  // surface a primary-strong badge/step-label lands on), not just surface-base.
  primaryText: "oklch(0.515 0.121 160)", // #007c4f — >=4.6:1 on the primary/15 tint
  accent: "oklch(0.76 0.12 185)",
  accentForeground: "oklch(0.2 0.04 185)",
  ring: "oklch(0.74 0.16 160)",
  success: "oklch(0.52 0.14 160)",
  // Darkened to clear >=4.6:1 on its own success/15 tint over white (the worst
  // case), not just surface-inset.
  successText: "oklch(0.485 0.14 160)", // #007642
  info: "oklch(0.52 0.11 185)",
  infoText: "oklch(0.49 0.11 185)", // #007469 — clears >=4.6:1 on the info/15 tint
  chart1: "oklch(0.6 0.15 160)",
  chart2: "oklch(0.62 0.11 185)",
  chart3: "oklch(0.55 0.14 145)",
  chart4: "oklch(0.58 0.12 200)",
  chart5: "oklch(0.68 0.14 130)",
  shadowGlow: "0 12px 32px rgba(35,201,135,0.22)",
};

export const themes: Record<ThemeName, Record<Mode, ThemeTokens>> = {
  aurora: { light: auroraLight, dark: auroraDark },
  neutral: { light: neutralLight, dark: neutralDark },
  midnight: { light: midnightLight, dark: midnightDark },
  sunset: { light: sunsetLight, dark: sunsetDark },
  emerald: { light: emeraldLight, dark: emeraldDark },
};

export const themeNames: ThemeName[] = ["aurora", "neutral", "midnight", "sunset", "emerald"];
export const modes: Mode[] = ["light", "dark"];
export const defaultTheme: ThemeName = "aurora";
export const defaultMode: Mode = "dark";

/**
 * Material language — orthogonal to {@link ThemeName} (palette) and {@link Mode}.
 * Applied via `data-cronus-look` on any subtree. Docs chrome stays `default`.
 */
export type LookName = "default" | "brutalist" | "glass" | "mauve";
export const lookNames: LookName[] = ["default", "brutalist", "glass", "mauve"];
export const defaultLook: LookName = "default";
export const lookLabels: Record<LookName, string> = {
  default: "Default",
  brutalist: "Brutalist",
  glass: "Glass",
  mauve: "Mauve",
};

/** Maps a ThemeTokens key to its runtime CSS custom property name. */
export const cssVarMap: Record<keyof ThemeTokens, string> = {
  primary: "--cronus-primary",
  primaryForeground: "--cronus-primary-foreground",
  primaryText: "--cronus-primary-text",
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
  fgInverse: "--cronus-fg-inverse",
  border: "--cronus-border",
  borderStrong: "--cronus-border-strong",
  borderSoft: "--cronus-border-soft",
  ring: "--cronus-ring",
  success: "--cronus-success",
  successText: "--cronus-success-text",
  warning: "--cronus-warning",
  warningText: "--cronus-warning-text",
  error: "--cronus-error",
  errorText: "--cronus-error-text",
  info: "--cronus-info",
  infoText: "--cronus-info-text",
  radius: "--cronus-radius",
  fontSans: "--cronus-font-sans",
  fontDisplay: "--cronus-font-display",
  fontMono: "--cronus-font-mono",
  chart1: "--cronus-chart-1",
  chart2: "--cronus-chart-2",
  chart3: "--cronus-chart-3",
  chart4: "--cronus-chart-4",
  chart5: "--cronus-chart-5",
  shadowXs: "--cronus-shadow-xs",
  shadowSm: "--cronus-shadow-sm",
  shadowMd: "--cronus-shadow-md",
  shadowLg: "--cronus-shadow-lg",
  shadowGlow: "--cronus-shadow-glow",
};

/** Convert a (partial) token set into a `{ "--cronus-*": value }` style object. */
export function tokensToCssVars(tokens: ThemeOverrides): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of Object.keys(tokens) as (keyof ThemeTokens)[]) {
    const value = tokens[key];
    if (value != null) out[cssVarMap[key]] = value;
  }
  return out;
}

/** Render overrides as a copy-pasteable CSS block (used by the ThemeBuilder). */
export function serializeOverrides(tokens: ThemeOverrides, selector = ":root"): string {
  const vars = tokensToCssVars(tokens);
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

export const fontStacks = fonts;
