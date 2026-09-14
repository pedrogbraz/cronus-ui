# HANDOFF — Wave 1d UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1d`  
**Branch:** `feat/wave1d-audit-fixtures` (from `feat/cronus-audit` @ `3da5aa59`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1d. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c fixtures/renderers were appended to, not rewritten.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| combobox | `default` | placeholder, `aria-label`, two `options` | `button` / `combobox-trigger` (no `<select>`; Combobox owns open state, so the list stays closed) |
| stepper | `default` | label + two `items` titles | `div` / `stepper` (`Stepper` + `StepperList` + `StepperItem`/`Indicator`/`Title`) |
| input-otp | `default` | `maxLength: 6`, `aria-label` | `input` / `input-otp` (hidden OTP input; `InputOTP` + `Group` + 6 `Slot`s) |
| file-dropzone | `default` | `aria-label` | `label` / `file-dropzone` (no `file-dropzone-control`) |
| popover | `default` | trigger children, `defaultOpen`, content `options` | `div` / `popover-content` (portaled; Trigger `Button` + Content) |
| hover-card | `default` | trigger children, `open`, content `options` | `div` / `hover-card-content` (portaled; Trigger + Content) |
| dropdown-menu | `default` | trigger children, `defaultOpen`, two `items` | `div` / `dropdown-menu-content` (portaled; Trigger `Button` + Content + Items) |
| collapsible | `default` | trigger children, `defaultOpen`, content `options` | `div` / `collapsible-content` (in-tree; Trigger + Content) |
| mode-toggle | `default` | `mode: "light"`, `aria-label` | `button` / `mode-toggle` (`onModeChange` no-op) |

Existing button / badge / input / wave 1a / 1b / 1c fixtures are unchanged.

For overlays, `expect.slot` is the **content** slot React actually emits (`popover-content`, `hover-card-content`, `dropdown-menu-content`, `collapsible-content`), not an invented family wrapper. Logic locators for the three portaled families query `[data-slot="…"]` on the page (Radix Portal to `document.body`); collapsible stays under `[data-audit-side="react"]`.

## Code

- `renderReactFixture` maps all 9 families from `@cronus-ui/ui/{family}` (and subcomponents). Combobox maps string `options` to `{label,value}`; Stepper composes two titled items; InputOTP uses `maxLength` 6 with six slots; FileDropzone gets a no-op `onFiles`; Popover/DropdownMenu/Collapsible force `defaultOpen`; HoverCard forces `open`; ModeToggle is controlled `light` with a no-op `onModeChange`. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (combobox / mode-toggle → `button`, file-dropzone → `label`, input-otp → `input` because `data-slot="input-otp"` is on the hidden `<input>`, the rest → `div`).
- `emitCronusComponent` already emits `props.options` and `props.items` as extra `text "…"` lines. Wave 1d fixtures use that (combobox options, stepper titles, overlay/dropdown/collapsible copy). Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 48 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1d

# unit (must stay green)
bunx vitest run --project audit

# regenerate Cronus app (no `source`, no `stack react`)
bun run --filter @cronus-ui/audit emit
# or: cd packages/audit && bun src/cli.ts emit

# keep dist current (gitignored)
bun run --filter @cronus-ui/audit build
# or: bunx turbo run build --filter=@cronus-ui/audit

# e2e — Cronus assertions / visual baselines wait on kernel merge
bunx playwright test -c playwright.audit.config.ts e2e/audit/logic.spec.ts
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts

# after kernel merge, generate the 9 new aurora/dark baselines
bunx playwright test -c playwright.audit.config.ts e2e/audit/parity.visual.spec.ts --update-snapshots
```

Do **not** invent PNG binaries. Visual specs added:

- `combobox-default-aurora-dark`
- `stepper-default-aurora-dark`
- `input-otp-default-aurora-dark`
- `file-dropzone-default-aurora-dark`
- `popover-default-aurora-dark`
- `hover-card-default-aurora-dark`
- `dropdown-menu-default-aurora-dark`
- `collapsible-default-aurora-dark`
- `mode-toggle-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table (combobox is not a `<select>`; file-dropzone has no `file-dropzone-control`). Cronus side is written and may fail until the kernel ports land.
