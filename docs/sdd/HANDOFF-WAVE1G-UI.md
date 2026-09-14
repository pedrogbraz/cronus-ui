# HANDOFF — Wave 1g UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1g`  
**Branch:** `feat/wave1g-audit-fixtures` (from `feat/cronus-audit` @ `1d26386f`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1g. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f fixtures/renderers were appended to, not rewritten. No meteors fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| radar-chart | `default` | label + three metric `items` | `div` / `radar-chart` (not `<figure>`; client wrapper, tiny static series) |
| scatter-chart | `default` | label + three point `items` | `div` / `scatter-chart` (same) |
| ring-chart | `default` | label + two slice `items` | `div` / `ring-chart` (same; two slices like pie) |
| phone-input | `default` | E.164 `value`, `aria-label` | `div` / `phone-input` (`role=group`; not `*-control`) |
| currency-input | `default` | minor-unit `value: 12345`, `aria-label` | `div` / `currency-input` |
| color-picker | `default` | oklch `value`, `aria-label` | `button` / `color-picker-trigger` (client wrapper clicks open) |
| scroll-area | `default` | `aria-label` + twelve `items` | `div` / `scroll-area` (`h-32 w-48`, enough children to scroll) |
| toolbar | `default` | `aria-label` + two `items` | `div` / `toolbar` (`Toolbar` + `ToolbarButton`) |
| status-dot | `default` | `status: online` | `span` / `status-dot` (`role=status`) |

Existing button / badge / input / wave 1a–1f fixtures are unchanged.

### Charts

Ready-made wrappers from `@cronus-ui/ui/{radar,scatter,ring}-chart` (the `data-slot` components). Nested `{metric, desktop}` / `{x, y}` rows cannot round-trip through emit (only string `items`/`options` become `text "…"`), so the client wrappers ignore extra JSON and hold a 3-point / 2-slice series.

Logic locators query `[data-slot="radar-chart"]` (etc.) on a `div`, never a `<figure>`.

### Phone / currency / color-picker

- **phone-input** and **currency-input** have no package subpath export — imported from the `@cronus-ui/ui` barrel (same as TimePicker). `value` is passed as `defaultValue` so the server page never supplies handlers.
- **color-picker** does not expose `open` / `defaultOpen`. `color-picker-fixture.tsx` is a client wrapper that clicks the trigger once after mount. Expect slot is the trigger button.

### Scroll / toolbar / status-dot

- **scroll-area** maps string `items` into a short list inside `h-32 w-48`.
- **toolbar** maps `items` to `ToolbarButton` children. Root is `role="toolbar"`.
- **status-dot** is `status="online"` on the `role="status"` span.

Client wrappers (data arrays / open click — never pass functions from the server page):

- `chart-fixtures.tsx` — radar / scatter / ring (plus wave 1f area / bar / line / pie / sparkline)
- `color-picker-fixture.tsx` — click-to-open

## Code

- `renderReactFixture` maps all 9 families. Charts/color-picker go through the client wrappers above. PhoneInput / CurrencyInput take string/number `defaultValue`. ScrollArea / Toolbar compose from string `items`. StatusDot is `status=online`. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (color-picker → `button`, status-dot → `span`, the rest → `div`).
- `emitCronusComponent` already emits `props.options` and `props.items` as extra `text "…"` lines, plus string/number `value` and `aria-label`. Wave 1g fixtures use that for chart labels, scroll rows, toolbar buttons, phone E.164, currency cents, and the oklch string. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 75 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1g

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

- `radar-chart-default-aurora-dark`
- `scatter-chart-default-aurora-dark`
- `ring-chart-default-aurora-dark`
- `phone-input-default-aurora-dark`
- `currency-input-default-aurora-dark`
- `color-picker-default-aurora-dark`
- `scroll-area-default-aurora-dark`
- `toolbar-default-aurora-dark`
- `status-dot-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. Charts are `div` with `data-slot`, not `<figure>`. Phone is `role=group` and not `*-control`. Color-picker is the trigger `button`. Cronus side is written and may fail until the kernel ports land.
