# HANDOFF — Wave 1j UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1j`  
**Branch:** `feat/wave1j-audit-fixtures` (from `feat/cronus-audit` @ `0a0b92f5`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1j. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| segmented-control | `default` | `value: Day`, `aria-label`, two `items` | `div` / `segmented-control` (`role=radiogroup`; items are `button`, not `<input type=radio>`) |
| usage-meter | `default` | `value: 40`, `label: Tokens`, `aria-label` | `div` / `usage-meter` (`max` defaults to 100; no `formatValue`) |
| masonry | `default` | `aria-label`, four child `items` | `div` / `masonry` (`columns={2}`; children are labelled tiles) |
| heatmap | `default` | `aria-label`, 14-number `data` array | `div` / `heatmap` (client wrapper maps values → `{date, value}`) |
| comparison-slider | `default` | `aria-label`, `items` Before/After | `div` / `comparison-slider` (client wrapper; before/after nodes) |
| code-tabs | `default` | `aria-label`, two tab `items` | `div` / `code-tabs` (`{label, code}` from strings; no `onLabelChange`) |
| expandable-tabs | `default` | `aria-label`, two `items` | `div` / `expandable-tabs` (client wrapper; icons are static SVG) |
| live-line-chart | `default` | `label: Live`, three tick `items` | `div` / `live-line-chart` (client wrapper in `chart-fixtures.tsx`; not `<figure>`) |
| sunburst-chart | `default` | `label: Traffic`, two `items` | `div` / `sunburst-chart` (client wrapper in `chart-fixtures.tsx`; nested data; not `<figure>`) |

Existing button / badge / input / wave 1a–1i fixtures are unchanged.

### Segmented-control / usage-meter / masonry / code-tabs

These four compose from string `items` (or `value` / `label`) in `renderReactFixture`. Never pass functions from the server page.

- **segmented-control** maps string `items` to `SegmentedControlItem`. Selection is `defaultValue` (from `props.value`). Root is a `div[role=radiogroup]`. Items are `button[role=radio]` — React must not render `input[type=radio]`.
- **usage-meter** uses `value: 40` against `max: 100`. `formatValue` is stripped. Root is the outer `div[data-slot=usage-meter]` (the `role=meter` lives on the track).
- **masonry** maps string `items` to several child tiles. `columns` is a number (2). Root is the real `data-slot=masonry` `div`.
- **code-tabs** maps string `items` to `{label, code: "<label> install", language: "bash"}`. No `onLabelChange`. Root is Radix `Tabs` with `data-slot=code-tabs` (a `div`).

### Heatmap / comparison-slider / expandable-tabs

Nested objects / React nodes cannot round-trip through emit:

- **heatmap** is the contribution calendar (`@cronus-ui/ui/heatmap`), not `heatmap-chart`. `heatmap-fixture.tsx` maps a number `data` array onto `{date, value}` starting 2026-06-01. Fallback is 14 values.
- **comparison-slider** needs `before` / `after` nodes. `comparison-slider-fixture.tsx` paints two labelled surfaces from `items`. No `onPositionChange`.
- **expandable-tabs** needs `icon` React nodes. `expandable-tabs-fixture.tsx` draws a static SVG per label, same pattern as dock.

### Charts

Reuse `chart-fixtures.tsx`. Both import the published subpath (`@cronus-ui/ui/live-line-chart`, `@cronus-ui/ui/sunburst-chart`) — the simple wrappers, not the visx `charts/` trees.

- **live-line-chart** uses a 3-point `{tick, value}` series. `interval={86_400_000}` so the live timer does not mutate visual snapshots. `isAnimationActive` is already false on the line.
- **sunburst-chart** uses a tiny nested `{name, value, children}` tree (Desktop/Chrome/Safari + Mobile/iOS).

Client wrappers (data arrays / React nodes — never pass functions from the server page):

- `heatmap-fixture.tsx` — values → days
- `comparison-slider-fixture.tsx` — before/after surfaces
- `expandable-tabs-fixture.tsx` — static glyphs
- `LiveLineChartFixture` / `SunburstChartFixture` in `chart-fixtures.tsx`

## Code

- `renderReactFixture` maps all 9 families. Heatmap / comparison-slider / expandable-tabs / live-line / sunburst go through the client wrappers above. Segmented-control / usage-meter / masonry / code-tabs compose from string `items` (or `value` / `label`). These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (all → `div`).
- `emitCronusComponent` already emits `props.options` and `props.items` as extra `text "…"` lines, plus string/number `value` and `aria-label`. Wave 1j fixtures use that for range labels, the 40 usage value, masonry tiles, before/after, tab labels, live ticks, and sunburst names. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 102 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1j

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

- `segmented-control-default-aurora-dark`
- `usage-meter-default-aurora-dark`
- `masonry-default-aurora-dark`
- `heatmap-default-aurora-dark`
- `comparison-slider-default-aurora-dark`
- `code-tabs-default-aurora-dark`
- `expandable-tabs-default-aurora-dark`
- `live-line-chart-default-aurora-dark`
- `sunburst-chart-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. live-line-chart / sunburst-chart are not `<figure>` on React. segmented-control is not `input[type=radio]`. Cronus side is written and may fail until the kernel ports land.
