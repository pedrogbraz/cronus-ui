# HANDOFF — Wave 1b UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1b`  
**Branch:** `feat/wave1b-audit-fixtures` (from `feat/cronus-audit` @ `c4fc6a21`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1b. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a fixtures/renderers were appended to, not rewritten.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| alert | `default` | title + description | `div` / `alert` (`role=status`, no `data-variant`) |
| alert | `destructive` | `variant: "destructive"` + title + description | `div` / `alert` (`role=alert`, no `data-variant`) |
| skeleton | `default` | `className: "h-4 w-32"` | `div` / `skeleton` (`aria-hidden`) |
| banner | `default` | `title`, `dismissible: false` | `section` / `banner` (static; ignore motion) |
| slider | `half` | `value: 50`, `aria-label` | `span` / `slider` (Radix Root, not `input[type=range]`) |
| radio-group | `default` | two `options`, one selected | `div` / `radio-group` (`role=radiogroup`) |
| chip | `default` | children `"Design"` | `span` / `chip` (non-interactive, no `data-size`) |
| avatar | `fallback` | children initials `"AL"` | `span` / `avatar` (`Avatar` + `AvatarFallback`) |
| card | `default` | title + description | `div` / `card` (`Card` + header/title/description) |
| empty | `default` | title `"No results"` | `div` / `empty` (`Empty` + `EmptyTitle`) |

Existing button / badge / input / wave 1a fixtures are unchanged.

## Code

- `renderReactFixture` maps all 9 families from `@cronus-ui/ui/{family}` (and subcomponents). Alert composes Title+Description; Banner uses `title` with `dismissible: false`; Slider maps number `value` to Radix `[value]`; RadioGroup maps `props.options` to items; Avatar uses Fallback initials; Card/Empty compose header/title. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (banner → `section`, slider/chip/avatar → `span`, …).
- `emitCronusComponent` emits radio-group `props.options` as extra `text "…"` lines. Slider `value:50` already emits as a colon-pair. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1b

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

- `alert-default-aurora-dark`
- `skeleton-default-aurora-dark`
- `banner-default-aurora-dark`
- `slider-half-aurora-dark`
- `radio-group-default-aurora-dark`
- `chip-default-aurora-dark`
- `avatar-fallback-aurora-dark`
- `card-default-aurora-dark`
- `empty-default-aurora-dark`

Logic specs: one test per family (tag + `data-slot`; slider is not `input[type=range]` and has no `slider-control`). Cronus side is written and may fail until the kernel ports land.
