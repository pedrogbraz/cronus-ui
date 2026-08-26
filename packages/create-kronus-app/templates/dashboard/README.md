# __APP_NAME__

A multi-page dashboard built with [Next.js](https://nextjs.org) (App Router) and
[Kronus UI](https://www.npmjs.com/package/@kronus-ui/ui) — themeable, accessible React
components on Tailwind v4.

> **Screenshot placeholder** — run `npm run dev`, open http://localhost:3000, and drop a
> capture here (e.g. `docs/screenshot.png`) so your repo landing page shows the app.

## Getting started

```sh
npm install   # or: pnpm install / yarn / bun install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the pages hot-reload as you save.

## What's inside

| Route | File | Contents |
| --- | --- | --- |
| `/` | `app/page.tsx` | KPI metric cards, a revenue bar chart, and a searchable, sortable orders `DataTable`. |
| `/settings` | `app/settings/page.tsx` | Profile, workspace, and notification forms (`Field`, `Input`, `Select`, `Switch`). |

The persistent chrome lives in `components/dashboard-shell.tsx`: an `AppShell` with an
icon-collapsible `Sidebar` (route-aware via `usePathname`) and a sticky topbar with a
light/dark toggle.

## How it's wired

- **`app/globals.css`** imports Tailwind and the Kronus token CSS, plus the required
  `@source "../node_modules/@kronus-ui/ui/dist/**/*.js";` line so Tailwind v4 emits the
  component utility classes (it skips `node_modules` by default).
- **`app/layout.tsx`** mounts `<KronusUIProvider>` and the anti-flash `<KronusThemeScript>`
  so the right theme is applied before hydration, then wraps every page in the shell.
- **`components/revenue-chart.tsx`** shows the `ChartContainer` + recharts pattern — the
  chart colors come from your theme tokens (`--color-chart-*`).
- **`components/orders-table.tsx`** shows the `DataTable` pattern — column defs via
  `@tanstack/react-table`, sortable headers via `DataTableColumnHeader`.

## Add more components

This app includes a `kronus-ui.json`, so you can pull any component from the registry:

```sh
npx kronus-ui add dialog tabs dropdown-menu
```

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start the dev server. |
| `build` | Production build. |
| `start` | Serve the production build. |

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
