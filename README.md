# Cronus UI

[![@cronus-ui/ui on npm](https://img.shields.io/npm/v/@cronus-ui/ui?label=%40cronus-ui%2Fui&color=0ea5e9)](https://www.npmjs.com/package/@cronus-ui/ui)
[![npm downloads](https://img.shields.io/npm/dm/@cronus-ui/ui?color=0ea5e9)](https://www.npmjs.com/package/@cronus-ui/ui)
[![cronus-ui CLI](https://img.shields.io/npm/v/cronus-ui?label=cronus-ui&color=0ea5e9)](https://www.npmjs.com/package/cronus-ui)
[![license](https://img.shields.io/npm/l/@cronus-ui/ui?color=0ea5e9)](LICENSE)
[![sponsor](https://img.shields.io/badge/sponsor-coffee-0ea5e9)](https://github.com/sponsors/pedrogbraz)

Cronus UI is a **product UI system** — the Cronus design language, a live theme
runtime, and a compose path that turns validated blocks into apps. Dual
distribution: install `@cronus-ui/ui` from npm, or copy the source in with the
CLI. Canonical start: `npx create-cronus-app my-app --template saas`.

Aurora is the flagship theme of generated product; Neutral is the docs chrome.

> **v0.6.18** — OSS at [aicronus.com](https://aicronus.com), Cronus Pro at
> [iacronus.com](https://iacronus.com). Canonical start:
> `npx create-cronus-app my-app --template saas`. See
> [ADR 0003](docs/adr/0003-product-ui-system.md).

## Monorepo layout

```
packages/
  tokens/   @cronus-ui/tokens   — source-of-truth tokens (TS) + CSS-var bridge + Tailwind v4 @theme
  theme/    @cronus-ui/theme    — <CronusUIProvider> + useTheme (runtime theming, CSS-var only, no re-render)
  ui/       @cronus-ui/ui       — components (Radix + CVA + cn)
  stack/    @cronus-ui/stack    — Stack Builder catalog, resolver, schema, KICKOFF artifacts
  ai-kit/   @cronus-ui/ai-kit   — assistant doctrine, skills, and config templates
  cli/      cronus-ui           — copy-in installer, compose, theme, upgrade
  create-cronus-app/ create-cronus-app      — Next.js + Cronus UI app scaffold
  create-cronus-stack/ create-cronus-stack  — Stack Builder scaffold generator
  mcp/      cronus-ui-mcp       — MCP server for registry discovery
apps/
  www/      @cronus-ui/www      — OSS docs and landing (aicronus.com, :4747 locally)
  pro/      @cronus-ui/pro      — Cronus Pro origin (iacronus.com, :4748 locally)
```

### Which package do I need?

| You want…                                          | Install                                | Docs                                    |
| -------------------------------------------------- | -------------------------------------- | --------------------------------------- |
| Ready-made Cronus components                        | `@cronus-ui/ui` (+ `tokens` + `theme`)     | [packages/ui](packages/ui/README.md)    |
| Runtime theming — switch theme/mode, override tokens | `@cronus-ui/theme` (+ `tokens`)          | [packages/theme](packages/theme/README.md) |
| Just the design tokens / Tailwind preset           | `@cronus-ui/tokens`                        | [packages/tokens](packages/tokens/README.md) |
| Stack Builder core artifacts                       | `@cronus-ui/stack`                         | [packages/stack](packages/stack/README.md) |
| AI assistant doctrine, skills, and rules           | `@cronus-ui/ai-kit`                        | [packages/ai-kit](packages/ai-kit/README.md) |
| To own the component source (copy-in, shadcn-style) | `npx cronus-ui add <component>`        | [packages/cli](packages/cli/README.md)  |
| To scaffold a new app                              | `npx create-cronus-app my-app --template saas` | [packages/create-cronus-app](packages/create-cronus-app/README.md) |
| To scaffold a runnable default stack + KICKOFF     | `bun create cronus-stack@latest my-app`    | [packages/create-cronus-stack](packages/create-cronus-stack/README.md) |
| To expose the registry through MCP                 | `npx cronus-ui-mcp`                        | [packages/mcp](packages/mcp/README.md) |

Most apps install all three library packages — `@cronus-ui/ui` renders against the
`@cronus-ui/tokens` bridge and the `@cronus-ui/theme` provider.

## Quickstart

```sh
bun install
bun run build       # turbo: builds all packages and the docs app
bun run www         # OSS landing + docs at http://localhost:4747
bun run pro         # Cronus Pro at http://localhost:4748
bun run lint        # biome
```

## Install (external consumer)

```sh
npx create-cronus-app my-app --template saas
```

That scaffolds a composed SaaS app (Aurora). The `create-cronus-app` CLI default
template remains `default` so existing invocations do not break; marketing and
these docs use `saas`.

To consume the library without the scaffolder, install the three runtime
packages from public npm (published under the `@cronus-ui` scope — see
[RELEASE.md](RELEASE.md)):

```sh
npm i @cronus-ui/ui @cronus-ui/tokens @cronus-ui/theme
# peers (provide what you don't already have):
npm i react react-dom
```

Then wire up styling. **Tailwind v4 and v3 are configured differently** — pick the
one your app uses.

### Tailwind v4 (CSS-first)

In your global stylesheet (e.g. `app/globals.css` / `src/index.css`):

```css
@import "tailwindcss";
@import "@cronus-ui/tokens/styles.css";

/* REQUIRED. Tailwind v4 does not scan node_modules by default, so the utility
   classes baked into the shipped components (dist/**/*.js) would never be
   emitted and your components would render unstyled. This @source opts the
   published package back into content detection. Adjust the relative path so it
   resolves to your node_modules from this CSS file. */
@source "../node_modules/@cronus-ui/ui/dist/**/*.js";
```

That's it — no PostCSS config beyond the standard `@tailwindcss/postcss` (or the
Vite plugin). The `@import "@cronus-ui/tokens/styles.css"` line brings in the Aurora
theme tokens and the `@theme inline` bridge that maps `bg-primary`, `rounded-lg`,
`text-fg-secondary`, `shadow-glow`, etc. onto the runtime `--cronus-*` variables.

### Tailwind v3 (config JS)

Consume the `@cronus-ui/tokens/preset` (it maps `bg-primary`, `rounded-lg`, `shadow-glow`,
… onto the `--cronus-*` variables) and add the package `dist` to `content[]` so the
component classes survive purging:

```js
// tailwind.config.js
import cronusPreset from "@cronus-ui/tokens/preset";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [cronusPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    // REQUIRED: keep the utilities used inside the shipped components.
    "./node_modules/@cronus-ui/ui/dist/**/*.js",
  ],
};
```

```css
/* your global stylesheet */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> **v3 does not import `@cronus-ui/tokens/styles.css`.** That file is Tailwind v4-only
> (it uses `@theme inline` / `@utility`, which the v3 PostCSS engine can't parse).
> On v3 the `--cronus-*` runtime variables are injected for you by
> `<CronusUIProvider>` from `@cronus-ui/theme` (see below) — the preset is what connects
> the utility classes to those variables.

> Why the extra `@source` (v4) / `content` (v3) entry on both paths? The components
> ship as pre-compiled JS with their Tailwind class strings inline (e.g.
> `class="inline-flex … bg-primary rounded-lg …"`). Tailwind only emits CSS for
> classes it finds while scanning content, and it skips `node_modules` unless you
> opt in. Without this line the markup is correct but **no styles are generated**.

## Using it in your app

```tsx
// layout.tsx (or your root)
import { CronusUIProvider } from "@cronus-ui/theme";
<CronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">{children}</CronusUIProvider>

// anywhere
import { Button, Card, Badge } from "@cronus-ui/ui";
<Button variant="primary">Ship it</Button>
```

### Customize everything (runtime)
```tsx
const { setTheme, setMode, setOverrides } = useTheme();
setOverrides({ radius: "20px", primary: "#7c3aed", border: "..." }); // re-themes the whole subtree, no re-render
```

Two end-to-end consumer fixtures live under [`examples/`](examples/): a Next.js App
Router app (`examples/smoke-next`) and a Vite + React app (`examples/smoke-vite`).
`bun run package:smoke` validates package shape, built imports, and the real
release packer's internal dependency pins. `SMOKE_FULL=1 bun run package:smoke`
also packs tarballs, installs the runtime UI packages into those fixtures, builds
them, and asserts the component utility classes show up in the compiled CSS —
proof that an external install renders *styled*.

## Or copy-paste, shadcn-style (you own the code)

```sh
npx cronus-ui init
npx cronus-ui add button card dialog
npx cronus-ui compose saas --brand Acme
npx cronus-ui add-page --route /faq --blocks faq,cta --nav FAQ
npx cronus-ui theme set aurora --mode dark
npx cronus-ui upgrade --all --dry-run
```

The registry under `registry/` is generated from the real component sources by
`packages/cli` — see [packages/cli/README.md](packages/cli/README.md). Both
distribution modes (npm package + CLI registry) share one source of truth.

## Publishing

Nine packages publish to public npm in lockstep from `v0.2.0` onward:
`@cronus-ui/tokens`,
`@cronus-ui/theme`, `@cronus-ui/ui`, `@cronus-ui/stack`, `@cronus-ui/ai-kit`,
`cronus-ui`, `create-cronus-app`, `create-cronus-stack`, and `cronus-ui-mcp` (all
with `access: public`) — see [RELEASE.md](RELEASE.md). Run `bun run release` for
the default dry-run, and only run `bun run release --publish` when you intend to
publish and tag. A real publish needs npm rights for the `@cronus-ui` scope and
the unscoped package names.

## Components

**Wave 0 — foundation:** Button · Input · Label · Badge · Card (+ Header/Title/
Description/Action/Content/Footer) · Separator · Skeleton · Spinner.

**Wave 1 — forms:** Textarea · Checkbox · Switch · RadioGroup · Select (composable)
· Slider · Toggle · ToggleGroup · Field · Form (react-hook-form + zod) · InputOTP ·
FileDropzone.

**Wave 2 — overlays & navigation:** Dialog · Sheet · AlertDialog · DropdownMenu ·
Popover · HoverCard · Tooltip · Tabs · Accordion · Drawer (vaul) · Toast (sonner) ·
Command palette (cmdk, ⌘K).

**Wave 3 — data & display:** Table · DataTable (TanStack) · Pagination · Avatar ·
Progress · ScrollArea · Calendar · DatePicker · Chart (Recharts) · Empty · Metric ·
Kbd · Breadcrumb.

**Wave 4 — premium & brand:** GlassCard · GradientBorder · GradientText ·
SpotlightCard · AuroraBackground · Shimmer · AnimatedButton (motion) · Reveal ·
LogoCarousel · motion presets. The premium Aurora layer (glass, gradients,
springs, scroll reveals, rotating brand surfaces).

## Conventions
See `CONTRACT.md` — semantic tokens (no palette scales, no raw hex), CVA
variants, forwarded `ref`, `data-slot`, `focus-visible` rings. This is what
keeps the library re-themeable.

## Roadmap

Waves 0–4 (foundation through premium/brand) are done. The CLI, registry,
public npm packages, and compose generator have shipped.

Shipped: compose as the default path (`--template saas` in marketing; the CLI
default remains `default` until a breaking 0.6), add-page, 3-way upgrade of
components and composed pages, agent kit + MCP, and a public compare against
shadcn/ui, HeroUI, and Aceternity.

Still not this quarter: inflating component count.

Reserved: `create-cronus-app` `DEFAULT_TEMPLATE` → `saas` is a breaking change
for 0.6. A live Cursor/Claude 20-prompt eval is for a human — no score claimed
here.
