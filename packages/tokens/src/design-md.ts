import {
  isLookName,
  isThemeName,
  type LookName,
  lookLabels,
  lookNames,
  type ThemeName,
  themeNames,
  themes,
} from "./tokens.js";

export type DesignFormat = "compact" | "extended";

export interface DesignContextOptions {
  /** Palette to emphasize. Defaults to Aurora (generated-product flag). */
  theme?: ThemeName;
  /** Material look to emphasize. Defaults to Default. */
  look?: LookName;
  /**
   * `compact` fits a system prompt (~80 lines). `extended` is the repo file.
   * @default "extended"
   */
  format?: DesignFormat;
}

const THEME_THESIS: Record<ThemeName, string> = {
  aurora: "Luminous sky on deep zinc — the flagship of generated product.",
  neutral: "Zero chroma, all contrast — docs and landing chrome, not the product skin.",
  midnight: "Indigo into violet on slate — atmospheric product, still one primary.",
  sunset: "Amber into rose on stone — warmth without a second CTA color.",
  emerald: "Phosphor green on near-black — fresh, still token-bound.",
};

const LOOK_THESIS: Record<LookName, string> = {
  default: "Soft radius, hairline borders, quiet shadow. The baseline material.",
  brutalist: "Radius 0, stamp shadows, 2px borders, uppercase labels. Geometry does the work.",
  glass:
    "Larger radius, frosted panes, blur behind outline chrome. Reduced-transparency drops the blur.",
};

/** Resolve and validate options. Unknown names throw so MCP/CLI fail loudly. */
export function resolveDesignContext(options: DesignContextOptions = {}): {
  theme: ThemeName;
  look: LookName;
  format: DesignFormat;
} {
  const theme = options.theme ?? "aurora";
  const look = options.look ?? "default";
  const format = options.format ?? "extended";
  if (!isThemeName(theme)) {
    throw new Error(
      `Unknown theme "${String(options.theme)}". Use one of: ${themeNames.join(", ")}.`,
    );
  }
  if (!isLookName(look)) {
    throw new Error(`Unknown look "${String(options.look)}". Use one of: ${lookNames.join(", ")}.`);
  }
  if (format !== "compact" && format !== "extended") {
    throw new Error(`Unknown format "${String(options.format)}". Use compact or extended.`);
  }
  return { theme, look, format };
}

function tokenTable(theme: ThemeName): string {
  const t = themes[theme].dark;
  const rows: [string, string, string, string][] = [
    ["Primary", t.primary, "--cronus-primary", "The one chromatic fill. Primary buttons, ring."],
    [
      "Primary fg",
      t.primaryForeground,
      "--cronus-primary-foreground",
      "Text/icon on primary. Never invent white.",
    ],
    ["Accent", t.accent, "--cronus-accent", "Supporting chroma. Not a second CTA."],
    ["Canvas", t.surfaceBase, "--cronus-surface-base", "Page background."],
    ["Raised", t.surfaceRaised, "--cronus-surface-raised", "Cards, bars."],
    ["Overlay", t.surfaceOverlay, "--cronus-surface-overlay", "Hover, chips, inset controls."],
    ["Floating", t.surfaceFloating, "--cronus-surface-floating", "Popovers, menus."],
    ["Foreground", t.fg, "--cronus-fg", "Headings, primary copy."],
    ["Secondary", t.fgSecondary, "--cronus-fg-secondary", "Body, supporting copy."],
    [
      "Tertiary",
      t.fgTertiary,
      "--cronus-fg-tertiary",
      "Hints the user must read. AA on surfaces. Not fg-muted.",
    ],
    ["Muted", t.fgMuted, "--cronus-fg-muted", "Decorative only. Never information."],
    ["Border", t.border, "--cronus-border", "Hairline structure. Prefer this over drop shadows."],
    ["Success", t.successText, "--cronus-success-text", "Status text: text-success-strong."],
    ["Warning", t.warningText, "--cronus-warning-text", "Status text: text-warning-strong."],
    ["Error", t.errorText, "--cronus-error-text", "Status text: text-error-strong."],
  ];
  const lines = [
    "| Name | Value | Token | Role |",
    "| --- | --- | --- | --- |",
    ...rows.map(
      ([name, value, token, role]) => `| ${name} | \`${value}\` | \`${token}\` | ${role} |`,
    ),
  ];
  return lines.join("\n");
}

function identityBlock(): string {
  return `# Cronus UI — DESIGN.md

> Product UI system. Aurora is generated product. Neutral is docs chrome. Looks are material.

Cronus is not a component-count race. A generated page is installed blocks stacked in \`<main>\`. Taste lives in tokens, looks, and these rules — never in hex on a component.

- **Themes:** Aurora (flag), Neutral (chrome), Midnight, Sunset, Emerald.
- **Looks:** Default, Brutalist, Glass — orthogonal, via \`data-cronus-look\`.
- **Mode:** dark default. Light is first-class.
- **CTA:** \`npx create-cronus-app my-app --template saas\`.
`;
}

function rulesBlock(): string {
  return `## Rules

### Do

- One chromatic filled action per view (\`bg-primary text-primary-foreground\`). Outline/ghost stay hairline on transparent.
- Headings: weight 400, tracking \`-0.03em\` at 5xl+, \`-0.025em\` at 3xl/4xl, \`-0.02em\` at xl/2xl. No \`font-bold\`, no \`tracking-tight\`.
- \`font-semibold\` only on small labels, badges, and button text.
- Hierarchy with \`border-t border-border\`, not nested cards.
- One motion curve: \`cubic-bezier(.22,1,.36,1)\`. Gate animation on \`prefers-reduced-motion\`.
- Semantic tokens only: \`bg-surface-*\`, \`text-fg*\`, \`border-border\`, \`rounded-lg\`. Status text uses \`*-strong\`.
- Readable de-emphasis is \`text-fg-tertiary\`. \`text-fg-muted\` is ornament.
- Glass: frost outline/default chrome, not solid primary. Honour \`prefers-reduced-transparency\`.
- Docs/landing chrome stays Neutral + Default look. Generated product may use Aurora and any look.

### Don't

- No palette scales (\`bg-zinc-900\`, \`text-gray-500\`). No raw hex in components.
- No second accent as a competing CTA. Accent is supporting chroma.
- No \`font-bold\` on display type. No extra radius vocabulary beyond the scale.
- No decorative gradients on buttons or cards. Aurora glow is a surface, not a fill.
- Do not restyle docs chrome with the product theme. Dual identity is the point.
- Do not fork components per look. \`data-cronus-look\` restyles \`data-slot\`.
`;
}

function looksBlock(look: LookName): string {
  const lines = ["## Looks", ""];
  for (const name of lookNames) {
    const mark = name === look ? " **(active)**" : "";
    lines.push(
      `- **${lookLabels[name]}** (\`data-cronus-look="${name}"\`)${mark} — ${LOOK_THESIS[name]}`,
    );
  }
  lines.push(
    "",
    "Radius roles match the primitives (derived from `--cronus-radius`, Looks still win):",
    "",
    "| Role | Utility | Default | Brutalist | Glass |",
    "| --- | --- | --- | --- | --- |",
    "| Button | `rounded-lg` / `rounded-button` | radius | 0 | 18px |",
    "| Badge | `rounded-md` / `rounded-badge` | radius − 4px | 0 | 14px |",
    "| Card | `rounded-xl` / `rounded-card` | radius + 4px | 0 | 22px |",
    "| Input | `rounded-lg` | radius | 0 | 18px |",
    "| Pill | `rounded-full` / `rounded-pill` | 9999px | 0 | 9999px |",
    "",
  );
  return lines.join("\n");
}

function typeBlock(): string {
  return `## Type

- **Sans / UI:** SF Pro Text, Geist, system-ui.
- **Display:** SF Pro Display, Geist. Weight 400 on headings.
- **Mono:** SF Mono, JetBrains Mono — IDs, commands, code. Never marketing headlines.

| Role | Size | Weight | Tracking | Line |
| --- | --- | --- | --- | --- |
| Display | 3rem–3.75rem | 400 | −0.03em | ~1.08 |
| Heading | 1.5rem–2.25rem | 400 | −0.025em | 1.2 |
| Body | 1rem | 400 | 0 | 1.5–1.75 |
| Small | 0.875rem | 400 | 0 | 1.5 |
| Label / button | 0.75–0.875rem | 500–600 | 0 | 1.25 |
`;
}

function layoutBlock(): string {
  return `## Layout & elevation

- Page max-width ~80rem (7xl). Section padding 4–8. Section gaps large; element gaps 8–12px.
- Elevation is hairline borders and surface steps (base → raised → overlay → floating), not stacked drop shadows.
- \`shadow-glow\` is Aurora brand atmosphere, not card chrome.
- Density: product apps compact; marketing landings airy. Do not mix both on one screen.
`;
}

function componentsBlock(theme: ThemeName): string {
  const t = themes[theme].dark;
  return `## Component recipes

Use Cronus primitives. These are the visual contracts, not new components.

1. **Primary button.** \`bg-primary text-primary-foreground rounded-lg\`. One per view. Padding ~10×16 at sm.
2. **Outline button.** Transparent fill, \`border-border\`, \`text-fg\`. Hover \`border-border-strong\`.
3. **Card.** \`bg-surface-raised border-border rounded-xl\`. No inner nested card for hierarchy — use a top border.
4. **Input.** \`bg-surface-inset border-border rounded-lg text-fg\`. Focus ring \`ring-ring\`.
5. **Badge.** Small, \`font-medium\`. Status uses \`text-success-strong\` / \`text-error-strong\`, not the fill token as type.
6. **Nav.** Neutral chrome on docs. Product apps may inherit the baked theme. Links \`text-fg-secondary\`, hover \`text-fg\`.
7. **Hero (generated).** Display heading + one primary CTA + one outline. Product screenshot or composed blocks as the picture — no stock photo.

Primary on ${theme}: \`${t.primary}\` on \`${t.surfaceBase}\`.
`;
}

function promptsBlock(theme: ThemeName, look: LookName): string {
  return `## Agent prompts

Paste this file (compact) before the task. Then:

1. **SaaS dashboard.** Theme \`${theme}\`, look \`${look}\`. App shell, metric row, chart, table. One primary button ("New"). Hairline cards. No gradients on chrome.
2. **Marketing hero.** Neutral chrome if this is docs; Aurora if generated product. Heading weight 400, tracking −0.03em. Two pill CTAs: primary + outline.
3. **Settings form.** Field + Label + Input + FormMessage. Invalid state \`text-error-strong\` and \`role="alert"\`. No custom red.
4. **Pricing row.** Two cards, one featured \`border-border-strong\`. Prices with a fixed \`Intl.NumberFormat("en-US")\`.
5. **Empty state.** Heading + tertiary hint + one primary action. No illustration unless it is a Cronus primitive.

Acceptance: semantic tokens only, one primary fill, AA copy, reduced-motion path, no nested cards.
`;
}

function cssSnippet(theme: ThemeName): string {
  const t = themes[theme].dark;
  return `## Quick CSS (dark ${theme})

\`\`\`css
:root, [data-cronus-theme="${theme}"] {
  --cronus-primary: ${t.primary};
  --cronus-primary-foreground: ${t.primaryForeground};
  --cronus-surface-base: ${t.surfaceBase};
  --cronus-surface-raised: ${t.surfaceRaised};
  --cronus-fg: ${t.fg};
  --cronus-fg-secondary: ${t.fgSecondary};
  --cronus-fg-tertiary: ${t.fgTertiary};
  --cronus-border: ${t.border};
  --cronus-radius: ${t.radius};
}
\`\`\`

Prefer \`@import "@cronus-ui/tokens/styles.css"\` plus \`data-cronus-theme\` / \`data-cronus-look\` over copying this block.
`;
}

function compactMarkdown(theme: ThemeName, look: LookName): string {
  const t = themes[theme].dark;
  return `# Cronus UI — DESIGN.md (compact)

**${theme}** — ${THEME_THESIS[theme]}
**${look}** — ${LOOK_THESIS[look]}

Aurora = generated product. Neutral = docs chrome. Looks (default/brutalist/glass) are material, not palettes.

## Tokens (${theme} dark)

- canvas \`${t.surfaceBase}\` · raised \`${t.surfaceRaised}\` · fg \`${t.fg}\` · secondary \`${t.fgSecondary}\` · tertiary \`${t.fgTertiary}\`
- primary \`${t.primary}\` / on-primary \`${t.primaryForeground}\` — **only filled chromatic action**
- border \`${t.border}\` · radius \`${t.radius}\` (button \`rounded-lg\`, card \`rounded-xl\`, pill \`rounded-full\`)

## Do

- One \`bg-primary\` button per view. Outline stays hairline.
- Headings weight 400, negative tracking by size. No bold display. No \`tracking-tight\`.
- \`text-fg-tertiary\` for readable mute. \`text-fg-muted\` is decoration.
- Status text: \`text-*-strong\`. No hex, no \`bg-zinc-*\`.
- Motion: \`cubic-bezier(.22,1,.36,1)\`. Honour reduced-motion / reduced-transparency.

## Don't

- Second accent CTA. Nested cards. Gradients on buttons. \`font-bold\` headings. Forking components per look.

## Look

\`data-cronus-look="${look}"\`. Default: hairline + quiet shadow. Brutalist: radius 0, stamp, uppercase. Glass: frost outline chrome, not solid primary.

## Prompt

Build with Cronus primitives only. Theme \`${theme}\`, look \`${look}\`. One primary fill. Hairline elevation. Paste this file before the task.
`;
}

function extendedMarkdown(theme: ThemeName, look: LookName): string {
  const otherThemes = themeNames.filter((name) => name !== theme);
  return `${identityBlock()}
## Active context

- **Theme:** ${theme} — ${THEME_THESIS[theme]}
- **Look:** ${look} — ${LOOK_THESIS[look]}
- Light mode is first-class; tables below are the dark side (the usual generated default).

Other palettes: ${otherThemes.join(", ")}. Switch with \`npx cronus-ui theme set <name>\` or MCP \`set_theme\`. Apply a look with \`data-cronus-look\` on \`<html>\` or a subtree.

## Color (${theme} dark)

${tokenTable(theme)}

${looksBlock(look)}
${typeBlock()}
${layoutBlock()}
${componentsBlock(theme)}
${rulesBlock()}
${promptsBlock(theme, look)}
${cssSnippet(theme)}
## Files

- Repo taste: this file (\`DESIGN.md\`). Compact prompt: \`DESIGN.compact.md\`.
- Engineering doctrine: \`AGENTS.md\`. Component contract: Cronus \`CONTRACT.md\` (tokens, CVA, ref, data-slot, focus ring).
- Live: \`/themes\`, \`/llms/docs/design.md\`. MCP: \`get_design_context\`.
- Snapshot: \`theme set\` does not rewrite this file (writes never clobber). Delete it and re-run \`cronus-ui ai\`, or fetch MCP \`get_design_context\`.
`;
}

/**
 * Agent-readable visual taste for Cronus UI. Values come from {@link themes}
 * so this file cannot drift from the token source.
 */
export function designMarkdown(options: DesignContextOptions = {}): string {
  const { theme, look, format } = resolveDesignContext(options);
  return format === "compact" ? compactMarkdown(theme, look) : extendedMarkdown(theme, look);
}
