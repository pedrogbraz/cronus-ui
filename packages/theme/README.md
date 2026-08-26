# @kronus-ui/theme

The Kronus UI runtime theming engine — a React provider and hook that apply
[`@kronus-ui/tokens`](../tokens) to your app and let you re-theme any subtree live.

Theming happens entirely through CSS custom properties: switching theme, toggling
light/dark, or overriding a token (radius, primary, border, …) updates the whole
subtree instantly **without re-rendering the components below it**. This is what
makes brand portals, per-tenant styling, and visual preview builders cheap.

You need this package if you render `@kronus-ui/ui` components and want runtime theme
control, mode switching, or token overrides. (It is also the only supported way to
inject the `--kronus-*` variables when running on Tailwind v3.)

## Install

> Published on npm under the `@kronus-ui` scope.

```sh
# npm
npm i @kronus-ui/theme @kronus-ui/tokens
# pnpm
pnpm add @kronus-ui/theme @kronus-ui/tokens
# bun
bun add @kronus-ui/theme @kronus-ui/tokens
```

### Prerequisites

- **React 19** (also works with React 18.3+) — `react` and `react-dom` are peer
  dependencies.
- [`@kronus-ui/tokens`](../tokens) — the token data this provider applies (installed
  alongside above; on Tailwind v4 also import `@kronus-ui/tokens/styles.css` once).

## Usage

Wrap your app at the framework root. Use `asRoot` so the theme/mode attributes
are written to `<html>` and the whole document is themed.

```tsx
// app/layout.tsx (Next.js App Router) — or your root component
import "@kronus-ui/tokens/styles.css";
import { KronusUIProvider } from "@kronus-ui/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
          {children}
        </KronusUIProvider>
      </body>
    </html>
  );
}
```

### Avoiding a flash of the wrong theme

When you use `asRoot` with a `storageKey`, the provider restores the saved
theme/mode from `localStorage` in an effect that runs **after** first paint — so
a returning visitor whose saved choice differs from the defaults briefly sees the
default theme before it swaps (a "flash of the wrong theme", or FOUC).

Render `<KronusThemeScript>` in your document `<head>` to apply the saved
theme/mode **before** paint. It emits one tiny inline script that reads the same
`storageKey` and sets the `data-kronus-theme` / `data-kronus-mode` attributes and
the `dark` class on `<html>` exactly as the provider does.

```tsx
// app/layout.tsx (Next.js App Router)
import { KronusThemeScript, KronusUIProvider } from "@kronus-ui/theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the script mutates <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <KronusThemeScript
          storageKey="kronus-ui-theme"
          defaultThemeName="aurora"
          defaultModeName="dark"
        />
      </head>
      <body>
        <KronusUIProvider asRoot storageKey="kronus-ui-theme">
          {children}
        </KronusUIProvider>
      </body>
    </html>
  );
}
```

Pass the **same** `storageKey` to both the script and the provider. Add
`suppressHydrationWarning` to `<html>` because the script changes those
attributes before hydration; without it React logs a hydration mismatch. For a
strict CSP, pass a `nonce` to `<KronusThemeScript nonce={nonce} />`.

### `useTheme`

Read and control the active theme from anywhere inside the provider.

```tsx
"use client";
import { useTheme } from "@kronus-ui/theme";

export function ThemeControls() {
  const { theme, mode, setTheme, setMode, toggleMode, setOverrides } = useTheme();

  return (
    <div>
      <button onClick={toggleMode}>Mode: {mode}</button>
      <button onClick={() => setTheme(theme === "aurora" ? "neutral" : "aurora")}>
        Theme: {theme}
      </button>
      {/* Re-theme the whole subtree at runtime — no component re-render: */}
      <button
        onClick={() =>
          setOverrides({
            radius: "16px",
            primary: "oklch(0.685 0.169 237.3)",
            fontDisplay: "Inter, sans-serif",
          })
        }
      >
        Apply brand theme
      </button>
    </div>
  );
}
```

Calling `useTheme()` outside a `<KronusUIProvider>` throws.

## API

### `<KronusUIProvider>`

| Prop               | Type             | Default    | Description                                                                 |
| ------------------ | ---------------- | ---------- | --------------------------------------------------------------------------- |
| `defaultThemeName` | `ThemeName`      | `"aurora"` | Initial theme (`"aurora"` \| `"neutral"` \| `"midnight"` \| `"sunset"` \| `"emerald"`). |
| `defaultModeName`  | `Mode`           | `"dark"`   | Initial mode (`"light"` \| `"dark"`).                                       |
| `overrides`        | `ThemeOverrides` | —          | Seed per-scope token overrides (initial value only; later use `setOverrides`). |
| `asRoot`           | `boolean`        | `false`    | Write attributes to `<html>` (whole document) instead of a wrapper `<div>`. |
| `storageKey`       | `string`         | —          | Persist the theme/mode choice to `localStorage` under this key.             |
| `className`        | `string`         | —          | Extra classes for the wrapper `<div>` (ignored when `asRoot`).              |

When `asRoot` is `false`, the provider renders a `<div>` that themes only its
subtree — useful for previews and isolated brand sections.

> `overrides` is reactive: change its **content** (e.g. from a controlled
> parent) and the themed element updates. A re-render that passes a new object of
> equal content does not loop or reset live overrides. `setOverrides` from
> `useTheme` still drives uncontrolled changes.

### `<KronusThemeScript>`

Inline anti-FOUC head script (see [Avoiding a flash of the wrong
theme](#avoiding-a-flash-of-the-wrong-theme)).

| Prop               | Type        | Default    | Description                                                       |
| ------------------ | ----------- | ---------- | ----------------------------------------------------------------- |
| `storageKey`       | `string`    | —          | Required. The same key passed to `<KronusUIProvider storageKey>`.  |
| `defaultThemeName` | `ThemeName` | `"aurora"` | Theme applied when storage is empty or unreadable.                |
| `defaultModeName`  | `Mode`      | `"dark"`   | Mode applied when storage is empty or unreadable.                 |
| `nonce`            | `string`    | —          | CSP nonce forwarded to the inline `<script>`.                     |

### `useTheme(): ThemeContextValue`

Returns `{ theme, mode, overrides, setTheme, setMode, toggleMode, setOverrides }`.
`ThemeName`, `Mode`, and `ThemeOverrides` come from [`@kronus-ui/tokens`](../tokens).

## How it works

`overrides` are converted to a `{ "--kronus-*": value }` style object
(via `@kronus-ui/tokens`) and set on the themed element; the `@kronus-ui/tokens` Tailwind
bridge maps utilities like `bg-primary` and `rounded-lg` onto those variables.
Because everything resolves through CSS variables, overriding a token restyles the
subtree with no React re-render of the components it contains.

## Related packages

- [`@kronus-ui/tokens`](../tokens) — the token source this provider applies.
- [`@kronus-ui/ui`](../ui) — the components that render against the applied tokens.
- See the [docs site](../../apps/www) for the live theme builder.

## License

MIT
