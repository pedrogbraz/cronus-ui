# __APP_NAME__

A [Next.js](https://nextjs.org) (App Router) app built with
[Kronus UI](https://www.npmjs.com/package/@kronus-ui/ui) — themeable, accessible React
components on Tailwind v4.

## Getting started

```sh
npm install   # or: pnpm install / yarn / bun install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and edit `app/page.tsx` — the page
hot-reloads as you save.

## How it's wired

- **`app/globals.css`** imports Tailwind and the Kronus token CSS, plus the required
  `@source "../node_modules/@kronus-ui/ui/dist/**/*.js";` line so Tailwind v4 emits the
  component utility classes (it skips `node_modules` by default).
- **`app/layout.tsx`** mounts `<KronusUIProvider>` (theme: Aurora) and the anti-flash
  `<KronusThemeScript>` so the right theme is applied before hydration.
- **`app/page.tsx`** is a sample dashboard using `Button`, `Card`, `Badge`, `Input`,
  `Metric`, and `Table` from `@kronus-ui/ui`.

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
