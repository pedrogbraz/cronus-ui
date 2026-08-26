# @kronus-ui/ui

The Kronus UI component library — a themeable, accessible, shadcn-class set of
React components built on Radix UI, [CVA](https://cva.style/), and Tailwind v4.

Components are unstyled at the structural level and rendered against semantic
[`@kronus-ui/tokens`](../tokens) (`bg-primary`, `text-fg-secondary`, `rounded-lg`,
`shadow-glow`, …), so the entire library re-themes from one token change — and can
be re-themed live by [`@kronus-ui/theme`](../theme). Every component uses `forwardRef`,
carries `data-slot` hooks, and ships visible `focus-visible` rings.

Reach for this package when you want production-ready Kronus components as a managed
dependency. Prefer to own the source instead? Copy components into your project
with `npx kronus-ui add` (see [Copy-in option](#copy-in-option-cli)).

## Install

> Published on npm under the `@kronus-ui` scope.
> Install all three packages:

```sh
# npm
npm i @kronus-ui/ui @kronus-ui/tokens @kronus-ui/theme
# pnpm
pnpm add @kronus-ui/ui @kronus-ui/tokens @kronus-ui/theme
# bun
bun add @kronus-ui/ui @kronus-ui/tokens @kronus-ui/theme
```

`@kronus-ui/ui` renders against the token bridge and runtime provider, so install
[`@kronus-ui/tokens`](../tokens) and [`@kronus-ui/theme`](../theme) alongside it.

### Prerequisites

- **React 19** (also works with React 18.3+) — `react` and `react-dom` are peers.
- **Tailwind v4** (or v3) configured with the `@kronus-ui/tokens` bridge or preset.
- A few heavy, component-specific packages are **optional** peers — install them
  only for the components you use. See
  [Optional peer dependencies](#optional-peer-dependencies).

### Optional peer dependencies

Most components work out of the box. A handful sit on top of a heavy
third-party library that is only needed by that component, so those libraries
are declared as **optional peer dependencies** and are *not* installed with
`@kronus-ui/ui`. Install the matching package(s) only when you import the
component:

| Component(s)                     | Package(s)                                              | Install                                                 |
| -------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `Chart`                          | `recharts`                                              | `npm i recharts`                                        |
| `RichTextEditor`                 | `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`    | `npm i @tiptap/react @tiptap/pm @tiptap/starter-kit`    |
| `Kanban`                         | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities` |
| `DataTable`                      | `@tanstack/react-table`                                 | `npm i @tanstack/react-table`                           |
| `Calendar`                       | `react-day-picker`                                      | `npm i react-day-picker`                                |
| `DatePicker`, `DateRangePicker`  | `react-day-picker`, `date-fns`                          | `npm i react-day-picker date-fns`                       |
| `Scheduler`                      | `date-fns`                                              | `npm i date-fns`                                        |
| `Form`                           | `react-hook-form`, `zod`, `@hookform/resolvers`         | `npm i react-hook-form zod @hookform/resolvers`         |

Importing one of these components without its peer installed fails at
build/bundle time with a module-not-found error for the missing package —
installing the package(s) from the table fixes it.

> Using the CLI instead (`npx kronus-ui add <slug>`)? Nothing changes for you:
> the registry tracks each component's real imports and `add` installs them.

### Wire up styling

Tailwind does not scan `node_modules` by default, so the utility classes baked
into the shipped components must be opted back into content detection — otherwise
the markup is correct but **no CSS is generated**.

**Tailwind v4** — in your global stylesheet:

```css
@import "tailwindcss";
@import "@kronus-ui/tokens/styles.css";

/* REQUIRED: emit the utilities used inside the shipped components. */
@source "../node_modules/@kronus-ui/ui/dist/**/*.js";
```

**Tailwind v3** — in `tailwind.config.js`:

```js
import kronusPreset from "@kronus-ui/tokens/preset";

export default {
  presets: [kronusPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    // REQUIRED: keep the utilities used inside the shipped components.
    "./node_modules/@kronus-ui/ui/dist/**/*.js",
  ],
};
```

See [`@kronus-ui/tokens`](../tokens) for the full Tailwind v3/v4 setup details.

## Usage

Wrap the app in the provider once, then import components anywhere.

```tsx
// app/layout.tsx — or your root
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

```tsx
// any component
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@kronus-ui/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ship it</CardTitle>
        <Badge>New</Badge>
      </CardHeader>
      <CardContent>
        <Button variant="primary">Get started</Button>
      </CardContent>
    </Card>
  );
}
```

### Subpath imports

Every component is also exposed as its own entry point for finer-grained imports,
e.g. `import { Button } from "@kronus-ui/ui/button"`. The `cn` class-merge helper used
by every component is available at `import { cn } from "@kronus-ui/ui/cn"`.

## Components

Foundations and forms — Button, Input, Label, Badge, Card, Separator, Skeleton,
Spinner, Textarea, Checkbox, Switch, RadioGroup, Select, Slider, Toggle, Field,
Form (react-hook-form + zod), InputOTP, FileDropzone, NumberInput, Combobox,
MultiSelect, SegmentedControl, Autocomplete.

Overlays and navigation — Dialog, Sheet, AlertDialog, DropdownMenu, Popover,
MorphingPopover, HoverCard, Tooltip, Tabs, Accordion, Collapsible, Drawer, Toast
(Sonner), Command palette, NavigationMenu, Breadcrumb, Pagination, Sidebar,
AppShell.

Data and display — Table, DataTable (TanStack), Avatar, Progress, ScrollArea,
Calendar, DatePicker, DateRangePicker, Chart (Recharts), Empty, Metric, Kbd,
CodeBlock, CopyButton, Carousel.

Premium and brand — GlassCard, GradientBorder, GradientText, SpotlightCard,
AuroraBackground, Shimmer, AnimatedButton, AnimatedNumber, Reveal, TextEffect,
LogoCarousel, and motion presets — the Aurora layer of glass, gradients, springs,
and scroll reveals.

Browse them all, with live previews and props, on the [docs site](../../apps/www).

## Theming

Components consume semantic tokens only — never raw colors — so they re-theme
with the active theme/mode and with any runtime override. Switch theme or override
tokens through [`@kronus-ui/theme`](../theme):

```tsx
const { setTheme, setMode, setOverrides } = useTheme();
setOverrides({ radius: "20px", primary: "#7c3aed" }); // re-themes the subtree, no re-render
```

The OKLCH token scale and the two built-in themes (Aurora, Neutral) live in
[`@kronus-ui/tokens`](../tokens).

## Testing

`@kronus-ui/ui/testing` ships first-class helpers for testing apps built on
Kronus UI with [Testing Library](https://testing-library.com/) under jsdom
(Vitest or Jest). The subpath is not part of the main barrel, so test helpers
can never leak into an app bundle.

```sh
npm i -D @testing-library/react vitest-axe
```

Both are **optional peer dependencies** — only `@kronus-ui/ui/testing` uses
them, never the runtime components, and `vitest-axe` is only required if you
call `expectNoA11yViolations`.

```tsx
import { expectNoA11yViolations, findDialog, renderWithKronus } from "@kronus-ui/ui/testing";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";

it("invite dialog works and stays accessible in every theme", async () => {
  const user = userEvent.setup();
  const { baseElement, rerenderWithTheme } = renderWithKronus(<InvitePanel />, {
    theme: "aurora",
    mode: "dark",
  });

  await user.click(screen.getByRole("button", { name: "Invite teammate" }));
  await findDialog("Invite teammate"); // portaled to document.body — still found
  await expectNoA11yViolations(baseElement);

  rerenderWithTheme("neutral", "light"); // remounts the scope in the new theme
  expect(screen.getByRole("button", { name: "Invite teammate" })).toBeVisible();
});
```

- `renderWithKronus(ui, { theme?, mode?, ...rtlOptions })` — Testing Library's
  `render` with the UI wrapped in a scoped `KronusUIProvider`. The theme lands
  on a wrapper `<div data-kronus-theme data-kronus-mode>` (never on `<html>`), so
  tests can't bleed theme state into each other. Returns the usual render
  result plus `rerenderWithTheme(theme, mode?)`, which remounts the scope under
  another theme/mode.
- `findDialog(name?)` / `findTooltip(text?)` — async queries scoped to
  `document.body`, so they find Radix surfaces that render through portals
  (outside the container `render` returns).
- `expectNoA11yViolations(baseElement, axeOptions?)` — runs axe-core and fails
  with the formatted violations, the same gate this library's own component
  suite runs. Pass `baseElement` (not `container`) so portaled overlays are
  included in the scan.

> Radix overlays portal to `document.body`, outside the themed wrapper div —
> assert on their behavior and accessibility here, and cover theme-dependent
> visuals with your app-level (`asRoot`) provider in the browser.

## Copy-in option (CLI)

Prefer to own the component source, shadcn-style? The `kronus-ui` CLI copies the
real component sources into your project and rewrites imports to your aliases:

```sh
npx kronus-ui init                     # write kronus-ui.json + the cn() helper
npx kronus-ui add button card dialog   # copy components in (resolves dependencies)
npx kronus-ui add dashboard            # also pulls full-page blocks
```

Both distribution modes share one source of truth. See the
[CLI README](../cli/README.md) for commands and configuration.

## Related packages

- [`@kronus-ui/tokens`](../tokens) — the OKLCH design tokens these components render against.
- [`@kronus-ui/theme`](../theme) — the runtime provider + `useTheme` hook.
- [`kronus-ui`](../cli) — the CLI for copying components into your project.

## License

MIT
