# HANDOFF — Wave 1h UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1h`  
**Branch:** `feat/wave1h-audit-fixtures` (from `feat/cronus-audit` @ `e0ed075f`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1h. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g fixtures/renderers were appended to, not rewritten.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| tags-input | `default` | placeholder, `aria-label`, two tag `items` | `div` / `tags-input` (not `<select>` / `*-control`; `defaultValue` from items) |
| autocomplete | `default` | placeholder, `aria-label`, `value: "L"`, three city `options` | `div` / `autocomplete` (client wrapper focuses to open; not `<select>`) |
| multi-select | `default` | placeholder, `aria-label`, `defaultOpen`, two `options` | `div` / `multi-select-trigger` (`role=combobox`; not `<select>`) |
| credit-card-input | `default` | `label`, Visa-test `value` as `defaultNumber` | `div` / `credit-card-input` (barrel import; no `onChange`) |
| floating-label-input | `default` | `label: Email`, filled `value` | `div` / `floating-label-input` (barrel import; `defaultValue`) |
| split-button | `default` | children `Save`, `aria-label`, `defaultOpen`, two `items` | `div` / `split-button` (`role=group`; no `onClick`) |
| pill-nav | `default` | `aria-label` + two `items` | `nav` / `pill-nav` |
| dock | `default` | `aria-label` + two `items` | `div` / `dock` (client wrapper; icons are static SVG) |
| workspace-switcher | `default` | `aria-label` + two workspace `items` | `button` / `workspace-switcher` (client wrapper; `{id, name}` from labels) |

Existing button / badge / input / wave 1a–1g fixtures are unchanged.

### Tags / autocomplete / multi-select

These three must not render a native `<select>` or a `*-control` slot. Logic locators query the real `data-slot` from the table.

- **tags-input** maps string `items` to `defaultValue`. Root is the field wrapper `div`.
- **autocomplete** has no `open` / `defaultOpen`. `autocomplete-fixture.tsx` focuses the input after mount; a non-empty `value` (`"L"`) makes `onFocus` open the list.
- **multi-select** trigger is a `div[role=combobox]` (`data-slot="multi-select-trigger"`). `defaultOpen` is forced in the renderer. Options are `{label, value}` from strings.

### Credit card / floating label / split-button

- **credit-card-input** and **floating-label-input** / **split-button** have no package subpath export — imported from the `@cronus-ui/ui` barrel (same as PhoneInput). `value` is passed as `defaultNumber` / `defaultValue` so the server page never supplies handlers.
- **split-button** maps string `items` to `{id, label}` with no `onSelect` / `onClick`. Menu is `defaultOpen`.

### Pill-nav / dock / workspace-switcher

- **pill-nav** maps string `items` to `{value, label}`. Root is `<nav>`.
- **dock** needs `icon` React nodes emit cannot hold. `dock-fixture.tsx` draws a static SVG per label.
- **workspace-switcher** needs `{id, name}[]`. `workspace-switcher-fixture.tsx` derives ids from the string `items`. Expect slot is the trigger `button`.

Client wrappers (data arrays / open-on-focus — never pass functions from the server page):

- `autocomplete-fixture.tsx` — focus to open
- `dock-fixture.tsx` — static glyphs
- `workspace-switcher-fixture.tsx` — workspace objects from names

## Code

- `renderReactFixture` maps all 9 families. Autocomplete/dock/workspace-switcher go through the client wrappers above. TagsInput / MultiSelect / PillNav compose from string `items`/`options`. CreditCardInput / FloatingLabelInput / SplitButton take string `default*` values. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (pill-nav → `nav`, workspace-switcher → `button`, the rest → `div`).
- `emitCronusComponent` already emits `props.options` and `props.items` as extra `text "…"` lines, plus string/number `value` and `aria-label`. Wave 1h fixtures use that for tags, cities, frameworks, the test PAN, the email, split-button actions, pill/dock labels, and workspace names. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 84 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1h

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

- `tags-input-default-aurora-dark`
- `autocomplete-default-aurora-dark`
- `multi-select-default-aurora-dark`
- `credit-card-input-default-aurora-dark`
- `floating-label-input-default-aurora-dark`
- `split-button-default-aurora-dark`
- `pill-nav-default-aurora-dark`
- `dock-default-aurora-dark`
- `workspace-switcher-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. tags-input / autocomplete / multi-select are not native `<select>` and not `*-control`. Pill-nav is a `nav`. Workspace-switcher is the trigger `button`. Cronus side is written and may fail until the kernel ports land.
