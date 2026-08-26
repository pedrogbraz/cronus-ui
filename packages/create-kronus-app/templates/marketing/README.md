# __APP_NAME__

A landing site built with [Next.js](https://nextjs.org) (App Router) and
[Kronus UI](https://www.npmjs.com/package/@kronus-ui/ui) — themeable, accessible React
components on Tailwind v4.

> **Screenshot placeholder** — run `npm run dev`, open http://localhost:3000, and drop a
> capture here (e.g. `docs/screenshot.png`) so your repo landing page shows the site.

## Getting started

```sh
npm install   # or: pnpm install / yarn / bun install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the page hot-reloads as you save.

## What's inside

One landing page (`app/page.tsx`) composed from real sections under `components/`:

| Section | File | Contents |
| --- | --- | --- |
| Header | `site-header.tsx` | Sticky translucent nav with anchor links and the CTA. |
| Hero | `hero.tsx` | Announcement badge, display headline, CTAs, social proof. |
| Features | `feature-grid.tsx` | Six capability cards with gradient icon chips. |
| Pricing | `pricing.tsx` | Three tiers with a featured card. |
| Testimonials | `testimonials.tsx` | Quote cards in a responsive grid. |
| FAQ | `faq.tsx` | Single-open `Accordion`. |
| Waitlist | `waitlist-cta.tsx` | Email capture with a joined confirmation state. |
| Footer | `site-footer.tsx` | Brand, link columns, legal bar. |

Every section is standalone — delete what you don't need, reorder freely, and swap the
copy for your product.

## How it's wired

- **`app/globals.css`** imports Tailwind and the Kronus token CSS, plus the required
  `@source "../node_modules/@kronus-ui/ui/dist/**/*.js";` line so Tailwind v4 emits the
  component utility classes (it skips `node_modules` by default).
- **`app/layout.tsx`** mounts `<KronusUIProvider>` and the anti-flash `<KronusThemeScript>`
  so the right theme is applied before hydration.
- Only `waitlist-cta.tsx` is a client component — everything else renders on the server.

## Add more components

This app includes a `kronus-ui.json`, so you can pull any component from the registry:

```sh
npx kronus-ui add dialog tabs marquee
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
