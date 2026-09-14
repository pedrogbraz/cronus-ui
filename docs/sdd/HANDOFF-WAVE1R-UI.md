# HANDOFF — Wave 1r UI (audit fixtures)

**Date:** 2026-09-14  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1r`  
**Branch:** `feat/wave1r-audit-fixtures` (from `feat/cronus-audit` @ `a35ea43b`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1r. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j/1k/1l/1m/1n/1o/1p/1q fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| gradient-border | `default` | `children: Border`, size `className` | `div` / `gradient-border` |
| light-rays | `default` | `children: Rays`, size `className` | `div` / `light-rays` |
| orbit | `default` | items `A`/`B`/`C`, `aria-label: Orbit`, size `className` | `div` / `orbit` |
| progressive-blur | `default` | `children: Blur`, size `className` | `div` / `progressive-blur` |
| retro-grid | `default` | `children: Grid`, size `className` | `div` / `retro-grid` |
| ripple | `default` | `children: Pulse`, size `className` | `div` / `ripple` |
| motion-presets | `default` | items `fade-in` / `fade-in-up` / `scale-in` | `div` / `motion-presets` |

Existing button / badge / input / wave 1a–1q fixtures are unchanged.

### Gradient-border / light-rays / retro-grid / ripple

These compose from string/number props in `renderReactFixture`. Never pass functions from the server page.

- **gradient-border** wraps a string child. Fixture sizes it `w-72 p-6`.
- **light-rays** wraps a string child. Fixture sizes it `w-72 min-h-32`. Nested ray markup never crosses emit.
- **retro-grid** wraps a string child. Fixture sizes it `w-72 min-h-32`. Nested floor markup never crosses emit.
- **ripple** wraps a string child. Fixture sizes it `w-72 min-h-32`. Nested rings never cross emit.

All four have `@cronus-ui/ui/{family}` subpaths and are imported from those, not the barrel.

### Orbit

Needs `Orbit` + `OrbitRing` + `OrbitItem`. String `items` become `OrbitItem`s around a nucleus label (`children` if present, else `aria-label`). Fixture sizes the stage `size-72`; the ring radius is `128` (the UI comment for that stage size). Functions are stripped — only strings reach the tree. Subpath `@cronus-ui/ui/orbit`.

### Progressive-blur

The slot lives on `ProgressiveBlur` itself (`data-slot="progressive-blur"`), which is an overlay. The renderer wraps it in a `relative min-h-32` box (fixture `className` is `w-72`) so the band has something to cover. Children stay on the wrapper; functions are not passed. Subpath `@cronus-ui/ui/progressive-blur`.

### Motion-presets

`packages/ui/src/components/motion-presets.ts` is **not a component** — it exports `springSoft` / `fadeIn` / `fadeInUp` / `scaleIn` and has no `data-slot`. Do **not** render those as JSX, import `@cronus-ui/ui/motion-presets`, or import framer-motion / `motion/react`.

The React SoT is a static demo in `renderReactFixture`:

```
div[data-slot="motion-presets"]
  div[data-slot="motion-preset"][data-preset="fade-in"]
  div[data-slot="motion-preset"][data-preset="fade-in-up"]
  div[data-slot="motion-preset"][data-preset="scale-in"]
```

Kernel will match this DOM. Fixture `items` drive the preset list.

## Code

- `renderReactFixture` maps all 7 families from string/number/`string[]` props. These 7 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 7 → `div`.
- `emitCronusComponent` already emits string children as `label "…"` and `props.items` as extra `text "…"` lines. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 172 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1r

# unit (must stay green)
bunx vitest run --project audit

# regenerate Cronus app (no `source`, no `stack react`)
bun run --filter @cronus-ui/audit emit
# or: cd packages/audit && bun src/cli.ts emit

# keep dist current (gitignored)
bunx turbo run build --filter=@cronus-ui/audit

# e2e — Cronus assertions / visual baselines wait on kernel merge
bunx playwright test -c playwright.audit.config.ts e2e/audit/logic.spec.ts
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts

# after kernel merge, generate the 7 new aurora/dark baselines
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts --update-snapshots
```

Do **not** invent PNG binaries. Visual specs added:

- `gradient-border-default-aurora-dark`
- `light-rays-default-aurora-dark`
- `orbit-default-aurora-dark`
- `progressive-blur-default-aurora-dark`
- `retro-grid-default-aurora-dark`
- `ripple-default-aurora-dark`
- `motion-presets-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. All 7 are `<div>`. Cronus side is written and may fail until the kernel ports land.
