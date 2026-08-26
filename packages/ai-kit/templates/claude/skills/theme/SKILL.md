---
name: theme
description: Preview or switch the Kronus UI theme in __APP_NAME__. Use when the user wants to change the look, try a preset, toggle dark/light, or tweak brand color or radius — set the theme via the CLI, MCP, or useTheme, and never by inlining raw colors.
argument-hint: "[preset]"
allowed-tools: Read, Edit, Bash
---

# Preview or switch the app theme

Kronus UI is themed entirely through CSS custom properties driven by the active preset,
mode, and any token overrides. Changing them re-skins the whole app instantly — no
per-component edits, no raw colors.

Request: `$ARGUMENTS`

## Presets and modes

- Presets: **`aurora`** (default), **`neutral`**, **`midnight`**, **`sunset`**,
  **`emerald`**.
- Modes: **`light`**, **`dark`** (default `dark`).

## Switch a baked-in preset (do this first)

```sh
npx kronus-ui theme set aurora
npx kronus-ui theme set sunset --mode dark
npx kronus-ui theme set neutral --mode light
```

`theme set` rewrites `defaultThemeName` / `defaultModeName` on the layout and records
the choice in `kronus-ui.json`.

MCP: `set_theme { "name": "sunset", "mode": "dark" }`. Use this for the five shipped
presets.

## Apply a Create Studio theme

```sh
npx kronus-ui theme add <permalink|c=payload|file.json>
npx kronus-ui theme add https://kronus-ui.dev/studio?c=... --dry-run
```

MCP: `apply_theme { "source": "<permalink|c=payload|file.json>", "dryRun": false }`.
Prefer `apply_theme` for Studio permalinks; `set_theme` is only the baked-in presets.

## Set the app default by editing the layout (only if the CLI is not an option)

Edit `app/layout.tsx`. The `defaultThemeName` / `defaultModeName` on **`<KronusThemeScript>`**
and **`<KronusUIProvider>`** must match, and both must use the same `storageKey`:

```tsx
<KronusThemeScript storageKey="theme" defaultThemeName="midnight" defaultModeName="dark" />
...
<KronusUIProvider asRoot storageKey="theme" defaultThemeName="midnight" defaultModeName="dark">
```

Also update the `theme` block in `kronus-ui.json` so newly added components scaffold with
the same default. Keep `suppressHydrationWarning` on `<html>` and keep `<KronusThemeScript>`
in `<head>` — it applies the persisted theme before first paint (anti-flash).

## Change the theme at runtime

Inside a client component under the provider, use `useTheme()`:

```tsx
const { theme, mode, setTheme, setMode, toggleMode, setOverrides } = useTheme();
setTheme("emerald");   // switch preset
toggleMode();          // flip dark/light
setOverrides({ primary: "...", radius: "..." });
```

Runtime changes persist to `localStorage[storageKey]` and are re-applied on next load by
`<KronusThemeScript>`.

## Override individual tokens (brand color, radius, border)

Do this through the token system, never with hardcoded values:

- Runtime, whole app: `useTheme().setOverrides({ primary: "...", radius: "...", border: "..." })`
  — a `Partial<ThemeTokens>`; the entire subtree updates via CSS variables.
- A themed subtree / live preview: render a nested `<KronusUIProvider asRoot={false} overrides={...}>`.
  `asRoot={false}` themes only that subtree, leaving the rest of the app on the app default.

## Rules

- **Never inline raw colors** (`#hex`, `rgb(...)`, arbitrary Tailwind values, palette
  scales like `bg-zinc-900`). Use token-backed classes (`bg-primary`, `text-fg`,
  `text-fg-secondary`, `border-border`, `rounded-lg`) or `setOverrides`.
- If the user asks for `zinc-*` / `slate-*` / `gray-*`, refuse. Offer `bg-surface-*`
  or `setOverrides`.
- Theme changes must not introduce motion; respect `prefers-reduced-motion`.
- When previewing, prefer a subtree provider so you can compare against the current app
  theme without committing a global change.
