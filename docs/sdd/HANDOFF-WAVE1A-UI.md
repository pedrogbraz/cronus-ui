# HANDOFF — Wave 1a UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-fixtures`  
**Branch:** `feat/wave1a-audit-fixtures` (from `feat/cronus-audit` @ `4c982936`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1a. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| label | `default` | children `"Email"` | `label` / `label` |
| textarea | `empty` | placeholder, `aria-label` | `textarea` / `textarea` |
| textarea | `invalid` | same + `invalid: true` | `textarea` / `textarea` (`aria-invalid`) |
| checkbox | `off` | `aria-label` | `button` / `checkbox` (Radix, not `input`) |
| checkbox | `on` | `checked: true` | `button` / `checkbox` |
| switch | `off` | `aria-label` | `button` / `switch` (not `input`) |
| switch | `on` | `checked: true` | `button` / `switch` |
| spinner | `default` | (component default) | `svg` / `spinner` (`role=status`) |
| separator | `horizontal` | `orientation: "horizontal"` | `div` / `separator` (decorative) |
| kbd | `default` | children `"⌘K"` | `kbd` / `kbd` |
| toggle | `off` | children `"Bold"` | `button` / `toggle` (no `data-size` / `data-variant`) |
| toggle | `on` | `pressed: true` | `button` / `toggle` |
| progress | `half` | `value: 50`, `aria-label` | `div` / `progress` (Radix progressbar) |

Existing button / badge / input fixtures are unchanged.

## Code

- `renderReactFixture` maps all 9 families from `@cronus-ui/ui/{family}`. Checkbox/Switch get `checked`; Toggle gets `pressed`; Progress gets `value`; Spinner is default. These 9 never throw.
- `expectedTag` covers all 9 (checkbox/switch/toggle → `button`, spinner → `svg`, …).
- `emitCronusComponent` emits `checked:true` / `pressed:true` / `value:50` the same way input emits `disabled:true`. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-fixtures

# unit (must stay green)
bunx vitest run --project audit

# regenerate Cronus app (no `source`, no `stack react`)
bun run --filter @cronus-ui/audit emit
# or: cd packages/audit && bun src/cli.ts emit

# e2e — Cronus assertions / visual baselines wait on kernel merge
bunx playwright test -c playwright.audit.config.ts e2e/audit/logic.spec.ts
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts

# after kernel merge, generate the 9 new aurora/dark baselines
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts --update-snapshots
```

Do **not** invent PNG binaries. Visual specs added:

- `label-default-aurora-dark`
- `textarea-empty-aurora-dark`
- `checkbox-off-aurora-dark`
- `switch-off-aurora-dark`
- `spinner-default-aurora-dark`
- `separator-horizontal-aurora-dark`
- `kbd-default-aurora-dark`
- `toggle-off-aurora-dark`
- `progress-half-aurora-dark`

Logic specs: one test per family (tag + `data-slot`, no `*-control`). Cronus side is written and may fail until the kernel ports land.
