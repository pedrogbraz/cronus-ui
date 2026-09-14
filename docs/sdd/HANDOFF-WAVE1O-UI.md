# HANDOFF — Wave 1o UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1o`  
**Branch:** `feat/wave1o-audit-fixtures` (from `feat/cronus-audit` @ `b64d00ff`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1o. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j/1k/1l/1m/1n fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| aspect-ratio | `default` | `children: Framed`, size `className` | `div` / `aspect-ratio` |
| frame | `default` | `children: Checkout`, `url: cronus.dev` | `div` / `frame` (content in `frame-content`) |
| flip-card | `default` | front/back `items`, `aria-label: Plan` | `div` / `flip-card` (also emits `flip-card-front` / `flip-card-back`) |
| countdown | `default` | past ISO `target`, `aria-label: Launch` | `div` / `countdown` (static zeros after mount) |
| animated-button | `default` | `children: Get started` | `button` / `animated-button` |
| card-stack | `default` | two item `items`, `aria-label: Stack` | `section` / `card-stack` |
| gauge-chart | `default` | `value: 72`, `label: Score` | `div` / `gauge-chart` (not `<figure>`; client wrapper) |
| funnel-chart | `default` | `label: Pipeline`, two stage `items` | `div` / `funnel-chart` (not `<figure>`; client wrapper) |
| candlestick-chart | `default` | `label: OHLC`, three date `items` | `div` / `candlestick-chart` (not `<figure>`; client wrapper) |

Existing button / badge / input / wave 1a–1n fixtures are unchanged.

### Aspect-ratio / frame / flip-card / countdown / animated-button / card-stack

These compose from string/number props in `renderReactFixture`. Never pass functions from the server page.

- **aspect-ratio** wraps a string child. Default CSS ratio is `16 / 9`. Fixture sizes it `w-72`.
- **frame** puts `children` in the content pane and `url` in the browser chrome. `variant` is left at the component default (`browser`) so emit style stays `frame`, not `frame+browser`.
- **flip-card** has no `@cronus-ui/ui/flip-card` subpath — imported from the `@cronus-ui/ui` barrel (same as TiltCard). Maps string `items` to `FlipCardFront` / `FlipCardBack`. `onFlippedChange` is stripped. Unflipped by default so the front face is the screenshot.
- **countdown** takes a string/number `target`. Fixture uses `2000-01-01T00:00:00.000Z` (already past) so after mount the tiles settle at `00` and never tick. `onComplete` and nested `labels` are stripped.
- **animated-button** children must be a string. `asChild` and motion `onDrag*` / `onAnimationStart` are stripped. React does **not** emit `data-variant`.
- **card-stack** maps string `items` to `{id, content}` (content reused as the id). Root is a real `<section>`. Nested `labels` is stripped.

### Gauge / funnel / candlestick

Nested objects cannot round-trip through emit:

- **gauge-chart** takes numeric `value` (and optional `label`). Recharts lives behind `chart-fixtures.tsx` (`"use client"`). Ready-made wrapper from `@cronus-ui/ui/gauge-chart`.
- **funnel-chart** maps string `items` to `{stage, value, key}` with decreasing values. Nested stage objects never cross emit.
- **candlestick-chart** holds a tiny static OHLC series (`Mon`/`Tue`/`Wed`). Nested `{date, open, high, low, close}` never crosses emit.

Logic locators query `[data-slot="gauge-chart"]` (etc.) on a `div`, never a `<figure>`.

Client wrappers (nested data — never pass functions from the server page):

- `chart-fixtures.tsx` — gauge (value) / funnel (stages) / candlestick (OHLC), plus prior-wave charts

## Code

- `renderReactFixture` maps all 9 families. Charts go through the client wrappers above. The other 6 compose from string/number props. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (aspect-ratio / frame / flip-card / countdown / gauge-chart / funnel-chart / candlestick-chart → `div`; animated-button → `button`; card-stack → `section`).
- `emitCronusComponent` already emits `props.items` as extra `text "…"` lines, plus string/number `value` and `aria-label`. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 147 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1o

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

# after kernel merge, generate the 9 new aurora/dark baselines
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts --update-snapshots
```

Do **not** invent PNG binaries. Visual specs added:

- `aspect-ratio-default-aurora-dark`
- `frame-default-aurora-dark`
- `flip-card-default-aurora-dark`
- `countdown-default-aurora-dark`
- `animated-button-default-aurora-dark`
- `card-stack-default-aurora-dark`
- `gauge-chart-default-aurora-dark`
- `funnel-chart-default-aurora-dark`
- `candlestick-chart-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. Charts assert `div`, not `<figure>`. card-stack is a `<section>`. animated-button is a `<button>`. Cronus side is written and may fail until the kernel ports land.
