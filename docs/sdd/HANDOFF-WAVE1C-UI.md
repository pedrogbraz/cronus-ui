# HANDOFF — Wave 1c UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1c`  
**Branch:** `feat/wave1c-audit-fixtures` (from `feat/cronus-audit` @ `8e72efce`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1c. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b fixtures/renderers were appended to, not rewritten.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| field | `default` | label + description | `div` / `field` (`Field` + `FieldLabel` + `FieldDescription`) |
| input-group | `default` | addon `"$"`, placeholder, items `["$"]` | `div` / `input-group` (`InputGroup` + addon + `Input`; not a label wrapper) |
| rating | `default` | `value: 3`, `aria-label` | `div` / `rating` (`role=slider`; no radio inputs) |
| copy-button | `default` | `value: "cronus-ui"`, `aria-label: "Copy"` | `button` / `copy-button` |
| fab | `default` | `label: "Create"` | `div` / `fab` (wrapper; no speed-dial / motion) |
| toggle-group | `default` | two `items`, one selected | `div` / `toggle-group` (`ToggleGroup` + `ToggleGroupItem`) |
| metric | `default` | label + value | `div` / `metric` (`Metric` + `MetricLabel` + `MetricValue`) |
| avatar-group | `default` | two initials | `div` / `avatar-group` (`AvatarGroup` of `Avatar` + `AvatarFallback`) |
| button-group | `default` | two labels | `div` / `button-group` (`role=group`, `Button` children) |

Existing button / badge / input / wave 1a / wave 1b fixtures are unchanged.

## Code

- `renderReactFixture` maps all 9 families from `@cronus-ui/ui/{family}` (and subcomponents). Field composes Label+Description; InputGroup composes addon+Input; Rating is a controlled slider; CopyButton uses `value` + `aria-label`; Fab uses `label` with a static plus icon and no `actions`; ToggleGroup maps `props.items` to items (`type="single"`, one selected); Metric composes Label+Value; AvatarGroup maps initials to Avatar+Fallback; ButtonGroup maps items to Button children. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (copy-button → `button`, the rest → `div`).
- `emitCronusComponent` emits `props.options` and `props.items` as extra `text "…"` lines (same as radio-group). Numeric `value:3` already emits as a colon-pair; string values emit quoted. `props.label` is used as the Cronus label. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1c

# unit (must stay green)
bunx vitest run --project audit

# regenerate Cronus app (no `source`, no `stack react`)
bun run --filter @cronus-ui/audit emit
# or: cd packages/audit && bun src/cli.ts emit

# keep dist current (gitignored)
bun run --filter @cronus-ui/audit build
# or: cd packages/audit && bun run build

# e2e — Cronus assertions / visual baselines wait on kernel merge
bunx playwright test -c playwright.audit.config.ts e2e/audit/logic.spec.ts
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts

# after kernel merge, generate the 9 new aurora/dark baselines
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts --update-snapshots
```

Do **not** invent PNG binaries. Visual specs added:

- `field-default-aurora-dark`
- `input-group-default-aurora-dark`
- `rating-default-aurora-dark`
- `copy-button-default-aurora-dark`
- `fab-default-aurora-dark`
- `toggle-group-default-aurora-dark`
- `metric-default-aurora-dark`
- `avatar-group-default-aurora-dark`
- `button-group-default-aurora-dark`

Logic specs: one test per family (tag + `data-slot`; rating is `role=slider` and not a radiogroup / radio inputs; input-group has no `*-control` and is not a `<label>` wrapper). Cronus side is written and may fail until the kernel ports land.
