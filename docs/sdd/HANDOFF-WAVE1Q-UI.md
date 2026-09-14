# HANDOFF — Wave 1q UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1q`  
**Branch:** `feat/wave1q-audit-fixtures` (from `feat/cronus-audit` @ `25f3a02b`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1q. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j/1k/1l/1m/1n/1o/1p fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| click-spark | `default` | `children: Spark`, size `className` | `div` / `click-spark` |
| glare-hover | `default` | `children: Glare`, size `className` | `div` / `glare-hover` |
| magnetic | `default` | `children: Pull`, size `className` | `div` / `magnetic` |
| dot-pattern | `default` | `children: Dots`, size `className` | `div` / `dot-pattern` |
| flickering-grid | `default` | `children: Flicker`, size `className` | `div` / `flickering-grid` |
| grid-pattern | `default` | `children: Grid`, size `className` | `div` / `grid-pattern` |
| highlighter | `default` | `children: Marked` | `span` / `highlighter` |
| scramble-text | `default` | `children: Decode` | `span` / `scramble-text` |
| spinning-text | `default` | `children: SPIN` | `div` / `spinning-text` |

Existing button / badge / input / wave 1a–1p fixtures are unchanged.

### Click-spark / glare-hover / magnetic

These compose from string/number props in `renderReactFixture`. Never pass functions from the server page.

- **click-spark** wraps a string child. `onPointerDown` is stripped. Fixture sizes it `w-72`.
- **glare-hover** wraps a string child. Mouse handlers (`onMouseMove` / `onMouseEnter` / `onMouseLeave`) are stripped. Fixture sizes it `w-72`.
- **magnetic** wraps a string child. Pointer handlers are stripped. Fixture sizes it `w-72`. Inner `magnetic-target` is internal.

### Dot-pattern / flickering-grid / grid-pattern

Decorative fields behind a string child. Fixture sizes them `w-72 min-h-32`. Nested SVG / cell markup never crosses emit.

### Highlighter / scramble-text / spinning-text

- **highlighter** wraps a string child (`span`).
- **scramble-text** children must be a string. There is no `static`/`idle` prop; `reducedMotion` is forced to `"never"` so the phrase stays resolved (kernel is static idle). Nested `sr-only` copy is internal.
- **spinning-text** children **must** be a string — the component omits `ReactNode` children. Assistive copy is `sr-only`; orbiting letters are `aria-hidden`.

All 9 have `@cronus-ui/ui/{family}` subpaths and are imported from those, not the barrel.

## Code

- `renderReactFixture` maps all 9 families from string/number props. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (highlighter / scramble-text → `span`; the other 7 → `div`).
- `emitCronusComponent` already emits string children as `label "…"`. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 165 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1q

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

- `click-spark-default-aurora-dark`
- `glare-hover-default-aurora-dark`
- `magnetic-default-aurora-dark`
- `dot-pattern-default-aurora-dark`
- `flickering-grid-default-aurora-dark`
- `grid-pattern-default-aurora-dark`
- `highlighter-default-aurora-dark`
- `scramble-text-default-aurora-dark`
- `spinning-text-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. highlighter and scramble-text are `<span>`. The other 7 are `<div>`. Cronus side is written and may fail until the kernel ports land.
