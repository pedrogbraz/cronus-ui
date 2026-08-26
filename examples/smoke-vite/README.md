# smoke-vite

A minimal **external-consumer** fixture: a Vite + React app that imports
`@kronus-ui/ui` + `@kronus-ui/tokens` + `@kronus-ui/theme` exactly as a real consumer would,
and proves the published components render **styled** on Tailwind v4 (via the
first-party `@tailwindcss/vite` plugin).

This is not a workspace package — `@kronus-ui/*` are intentionally **absent** from
`dependencies`. The smoke runner injects them as locally-packed tarballs so the
test exercises the *published* artifact, never the workspace source.

## What it demonstrates

- `src/index.css` wires Tailwind v4 the way an external app must:
  ```css
  @import "tailwindcss";
  @import "@kronus-ui/tokens/styles.css";
  @source "../node_modules/@kronus-ui/ui/dist/**/*.js"; /* REQUIRED */
  ```
  The `@source` line is what makes Tailwind scan the shipped components (it skips
  `node_modules` by default), so their utility classes are emitted.
- `src/main.tsx` mounts `<KronusUIProvider>` (Aurora / dark).
- `src/App.tsx` renders `<Button>` + `<Card>` from `@kronus-ui/ui`.

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
npm pack ./packages/ui ./packages/tokens ./packages/theme --pack-destination /tmp/kronus
cd examples/smoke-vite
npm install /tmp/kronus/kronus-ui-*.tgz /tmp/kronus/kronus-tokens-*.tgz /tmp/kronus/kronus-theme-*.tgz
npm run build   # or: npm run dev
```
