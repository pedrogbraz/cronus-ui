# smoke-vite

A minimal **external-consumer** fixture: a Vite + React app that imports
`@cronus-ui/ui` + `@cronus-ui/tokens` + `@cronus-ui/theme` exactly as a real consumer would,
and proves the published components render **styled** on Tailwind v4 (via the
first-party `@tailwindcss/vite` plugin).

This is not a workspace package — `@cronus-ui/*` are intentionally **absent** from
`dependencies`. The smoke runner injects them as locally-packed tarballs so the
test exercises the *published* artifact, never the workspace source.

## What it demonstrates

- `src/index.css` wires Tailwind v4 the way an external app must:
  ```css
  @import "tailwindcss";
  @import "@cronus-ui/tokens/styles.css";
  @source "../node_modules/@cronus-ui/ui/dist/**/*.js"; /* REQUIRED */
  ```
  The `@source` line is what makes Tailwind scan the shipped components (it skips
  `node_modules` by default), so their utility classes are emitted.
- `src/main.tsx` mounts `<CronusUIProvider>` (Aurora / dark).
- `src/App.tsx` renders `<Button>` + `<Card>` from `@cronus-ui/ui`.

## Run it via the smoke runner (recommended)

From the repo root:

```sh
SMOKE_FULL=1 node scripts/package-smoke.mjs
```

That packs the tarballs, installs them here, runs `vite build`, and asserts the
compiled CSS contains the component utility classes.

## Run it manually

```sh
# from the repo root, after `bun run build`:
npm pack ./packages/ui ./packages/tokens ./packages/theme --pack-destination /tmp/cronus
cd examples/smoke-vite
npm install /tmp/cronus/cronus-ui-*.tgz /tmp/cronus/cronus-tokens-*.tgz /tmp/cronus/cronus-theme-*.tgz
npm run build   # or: npm run dev
```
