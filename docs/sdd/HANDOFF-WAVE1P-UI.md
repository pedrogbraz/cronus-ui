# HANDOFF — Wave 1p UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1p`  
**Branch:** `feat/wave1p-audit-fixtures` (from `feat/cronus-audit` @ `99867062`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1p. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j/1k/1l/1m/1n/1o fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| logo-carousel | `default` | two item `items`, `aria-label: Logos`, size `className` | `ul` / `logo-carousel` (items emit `logo-carousel-item`) |
| dynamic-island | `default` | two view `items` (`Idle` / `Active`) | `div` / `dynamic-island` |
| image-zoom | `default` | `children: Zoom`, size `className` | `button` / `image-zoom` |
| aurora-background | `default` | `children: Aurora`, size `className` | `div` / `aurora-background` |
| border-beam | `default` | `children: Beam`, size `className` | `div` / `border-beam` |
| confetti | `default` | `children: Celebrate`, size `className` | `div` / `confetti` (canvas is internal) |
| composed-chart | `default` | `label: Mix`, three month `items` | `div` / `composed-chart` (not `<figure>`; client wrapper) |
| heatmap-chart | `default` | `label: Activity`, four value `items` | `div` / `heatmap-chart` (not `<figure>`; client wrapper) |
| chart | `default` | `label: Series`, three value `items` | `div` / `chart` (not `<figure>`; client wrapper) |

Existing button / badge / input / wave 1a–1o fixtures are unchanged.

### Logo-carousel / dynamic-island / image-zoom / aurora-background / border-beam / confetti

These compose from string/number props in `renderReactFixture`. Never pass functions from the server page.

- **logo-carousel** maps string `items` to `{id, label}` (label reused as the id). `motionPreference` is forced to `"never"` so the grid does not cycle. `aria-label` is forwarded as the component's `ariaLabel` prop. Fixture sizes it `w-72`.
- **dynamic-island** maps string `items` to `{id, label, content}` (content is the label string). `defaultValue` is the first view. `onValueChange` is stripped.
- **image-zoom** children must be a string. Nested `labels` and `onZoomChange` are stripped. Fixture sizes it `w-72`.
- **aurora-background** wraps a string child. Fixture sizes it `w-72 min-h-32`.
- **border-beam** has no `@cronus-ui/ui/border-beam` subpath — imported from the `@cronus-ui/ui` barrel (same as TiltCard / FlipCard). Wraps a string child. Fixture sizes it `w-72 p-6`.
- **confetti** children must be a string. The canvas is internal — do **not** pass burst functions. `onPointerDown` is stripped. `fireOnMount` stays at the component default (`false`) so screenshots stay still. Fixture sizes it `w-72 min-h-32`.

### Composed / heatmap-chart / chart

Nested objects cannot round-trip through emit:

- **composed-chart** maps string `items` to `{date, desktop, mobile}` plus a mixed area/bar series. Nested series objects never cross emit.
- **heatmap-chart** maps string `items` to `{date, value}` (values parsed from the strings). Nested day objects never cross emit. The catalog alias wraps `Heatmap` and the root slot is `heatmap-chart`, not `heatmap`.
- **chart** is `ChartContainer` (`data-slot="chart"`) with a tiny Recharts bar series. Nested `config` never crosses emit.

Logic locators query `[data-slot="composed-chart"]` / `[data-slot="heatmap-chart"]` / `[data-slot="chart"]` on a `div`, never a `<figure>`.

Client wrappers (nested data — never pass functions from the server page):

- `chart-fixtures.tsx` — composed (mix) / heatmap-chart (days) / chart (`ChartContainer`), plus prior-wave charts

`@cronus-ui/audit` declares `recharts` so `ChartFixture` can feed `ChartContainer` without a phantom import.

## Code

- `renderReactFixture` maps all 9 families. Charts go through the client wrappers above. The other 6 compose from string/number props. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (logo-carousel → `ul`; image-zoom → `button`; dynamic-island / aurora-background / border-beam / confetti / composed-chart / heatmap-chart / chart → `div`).
- `emitCronusComponent` already emits `props.items` as extra `text "…"` lines, plus string/number `value` and `aria-label`. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 156 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1p

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

- `logo-carousel-default-aurora-dark`
- `dynamic-island-default-aurora-dark`
- `image-zoom-default-aurora-dark`
- `aurora-background-default-aurora-dark`
- `border-beam-default-aurora-dark`
- `confetti-default-aurora-dark`
- `composed-chart-default-aurora-dark`
- `heatmap-chart-default-aurora-dark`
- `chart-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. Charts assert `div`, not `<figure>`. logo-carousel is a `<ul>`. image-zoom is a `<button>`. Cronus side is written and may fail until the kernel ports land.
