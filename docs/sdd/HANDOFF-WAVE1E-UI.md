# HANDOFF — Wave 1e UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1e`  
**Branch:** `feat/wave1e-audit-fixtures` (from `feat/cronus-audit` @ `421f55d0`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1e. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d fixtures/renderers were appended to, not rewritten.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| command | `default` | label, placeholder, two `items` | `div` / `command` (`Command` + `Input` + `List` + `Item`s) |
| menubar | `default` | trigger children, `defaultOpen`, two `items` | `div` / `menubar` (`Menubar` + `Menu` + `Trigger` + `Content` + `Item`s) |
| context-menu | `default` | trigger children, `open`, two `items` | `div` / `context-menu-content` (portaled, always-open; no right-click) |
| drawer | `default` | `defaultOpen`, title + description | `div` / `drawer-content` (portaled; vaul, not native `<dialog>`) |
| sheet | `default` | `defaultOpen`, title + description | `div` / `sheet-content` (portaled; Radix Dialog, not native `<dialog>`) |
| calendar | `default` | label + `defaultMonth: "2026-06-01"` | `div` / `calendar` (**wrapper** — DayPicker has class `"calendar"` only, no `data-slot`) |
| date-picker | `default` | placeholder, `defaultOpen`, `value: "2026-06-15"` | `button` / `date-picker-trigger` (not `input[type=date]`; popover open so content is in the tree) |
| time-picker | `default` | placeholder, `value: "09:30"`, `hourCycle: 24` | `button` / `time-picker` (trigger; no `open` API) |
| date-range-picker | `default` | placeholder + `aria-label` | `button` / `date-range-picker-trigger` (no `open`/`defaultOpen` API; trigger only) |

Existing button / badge / input / wave 1a / 1b / 1c / 1d fixtures are unchanged.

### Calendar `data-slot`

`Calendar` is react-day-picker `DayPicker`. Its props type does not extend `HTMLAttributes`, so the component cannot take `data-slot`. The audit renderer wraps it:

```tsx
<div data-slot="calendar">
  <Calendar mode="single" defaultMonth={june2026} selected={june2026} />
</div>
```

Logic locators must query that wrapper, not a class-only `.calendar` node.

### Overlays

- **context-menu / drawer / sheet** content is portaled to `document.body`. Logic locators query `[data-slot="…"]` on the page (same as popover / dropdown-menu in wave 1d), not under `[data-audit-side="react"]`.
- **menubar** `expect.slot` is the in-tree root (`menubar`). Content is still forced open via Root `defaultValue` matching `MenubarMenu value` (Radix Menu has no `defaultOpen`).
- **context-menu** Root accepts `open` (not `defaultOpen`). Renderer forces `open` so items are in the DOM without a right-click.
- **date-picker** has `defaultOpen`; renderer opens it. **time-picker** and **date-range-picker** do not expose open state — fixtures are the trigger.

Client wrappers (Dates are not RSC-serializable; no event handlers on the server page):

- `calendar-fixture.tsx` — parses `defaultMonth` ISO `YYYY-MM-DD` to a local `Date`
- `date-picker-fixture.tsx` — parses `value` ISO to `defaultValue` and forces `defaultOpen`

`TimePicker` is imported from the `@cronus-ui/ui` barrel: `package.json` has no `./time-picker` subpath export (the component is barrel-exported). Do not treat that as a kernel port.

## Code

- `renderReactFixture` maps all 9 families from `@cronus-ui/ui/{family}` (TimePicker from the barrel). Command composes Input/List/Items; Menubar composes Menu/Trigger/Content/Items with `defaultValue="file"`; ContextMenu forces `open` with Items; Drawer/Sheet force `defaultOpen` plus Title; Calendar/DatePicker go through the client wrappers above; TimePicker takes a string `value`; DateRangePicker is the closed trigger. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (date-picker / time-picker / date-range-picker → `button`, the rest → `div`).
- `emitCronusComponent` already emits `props.options` and `props.items` as extra `text "…"` lines. Wave 1e fixtures use that for command / menubar / context-menu items. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 57 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1e

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

- `command-default-aurora-dark`
- `menubar-default-aurora-dark`
- `context-menu-default-aurora-dark`
- `drawer-default-aurora-dark`
- `sheet-default-aurora-dark`
- `calendar-default-aurora-dark`
- `date-picker-default-aurora-dark`
- `time-picker-default-aurora-dark`
- `date-range-picker-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. date-picker is `date-picker-trigger` (a `button`), not `input[type=date]`. drawer/sheet content is a `div`, not a native `<dialog>`. Cronus side is written and may fail until the kernel ports land.
