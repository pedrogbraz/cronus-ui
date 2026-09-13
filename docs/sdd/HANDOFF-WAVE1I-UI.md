# HANDOFF — Wave 1i UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1i`  
**Branch:** `feat/wave1i-audit-fixtures` (from `feat/cronus-audit` @ `def98c54`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1i. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| app-shell | `default` | title `Acme`, `aria-label`, two nav `items` | `div` / `app-shell-content` (client wrapper; SidebarProvider lives inside AppShell) |
| table-of-contents | `default` | `aria-label`, two heading `items` | `nav` / `table-of-contents` (string items → `{id, label}`; file has 1 intentional NUL as `ID_SEPARATOR`) |
| form | `default` | `label: Email`, placeholder | `div` / `form-item` (see rhf note below) |
| signature-pad | `default` | `aria-label` | `div` / `signature-pad` (no `onChange`) |
| resizable | `default` | `aria-label`, two panel `items` | `div` / `resizable-panel-group` (group + 2 panels + handle; `h-32 w-72`) |
| scheduler | `default` | `label: June 2026`, `defaultMonth`, two event `items` | `div` / `scheduler` (client wrapper; `{id, title, date}` from labels) |
| alert-dialog | `default` | `defaultOpen`, title, action `items` | `div` / `alert-dialog-content` (Radix; not native `<dialog>`) |
| lightbox | `default` | `open`, two alt `items` | `div` / `lightbox` (client wrapper; Radix Dialog; not native `<dialog>`) |
| notification-center | `default` | `open`, title, two `items` | `div` / `notification-center` (client wrapper clicks the bell; PopoverContent) |

Existing button / badge / input / wave 1a–1h fixtures are unchanged.

### Form (react-hook-form skipped)

`Form` + `FormField` + `FormLabel` / `FormControl` require `useForm` and pass handlers (`control`, `render`, field callbacks). That is too heavy for the server-page renderer (never pass functions from the server page).

The fixture renders `FormItem` + `Label` + `Input` inside `<form data-slot="form">`. Expect slot is `form-item` (the real React slot). Logic asserts a native `<form>` on the React side and `form-item` on both; it does not require rhf `form-control` / `form-label`. Kernel may emit either `form-item` or `form`.

### App-shell / resizable

- **app-shell** needs a `sidebar` React node emit cannot hold. `app-shell-fixture.tsx` composes `Sidebar` + header + body, clips to `h-56 w-80`, and sets `enableKeyboardShortcut: false`. Expect slot is the real `app-shell-content` `div` (not a synthetic `data-slot=app-shell` wrap). Kernel may wrap with `data-slot=app-shell`; logic queries `app-shell-content`.
- **resizable** expect slot is `resizable-panel-group` (the React slot). A kernel wrapper `data-slot=resizable` is OK as long as the group slot is present.

### Overlays

- **alert-dialog** is Radix (`div[role=alertdialog]`), **lightbox** is Radix Dialog wrapping a `div[data-slot=lightbox]`. React must not render a native `<dialog>`. Content portals, so logic locators query the slot globally (same as drawer/sheet).
- **lightbox** images need `src` emit cannot hold. `lightbox-fixture.tsx` uses a tiny SVG data URL; alts come from `items`. `open` is forced; no `onOpenChange`.
- **notification-center** does not forward `open` / `defaultOpen` to its inner Popover. `notification-center-fixture.tsx` maps string `items` to `{id, title, read}` and clicks `[data-slot="notification-trigger"]` once after mount. No `onMarkAllRead` / `onNotificationClick`.

### Scheduler / TOC

- **scheduler** events need `Date` objects. `scheduler-fixture.tsx` pins `defaultMonth` / `today` to June 2026 and places the first item on the 15th, the second on the 20th. No month/event/day handlers.
- **table-of-contents** maps string `items` to `{id, label}` (slug from the label). Root is `<nav>`. `packages/ui/.../table-of-contents.tsx` contains one NUL (`ID_SEPARATOR = "\0"`) — `rg -a` if grepping.

Client wrappers (nodes / Dates / open-on-click — never pass functions from the server page):

- `app-shell-fixture.tsx` — Sidebar + header/body
- `scheduler-fixture.tsx` — event objects + stable month
- `lightbox-fixture.tsx` — image objects + `open`
- `notification-center-fixture.tsx` — notification objects + click to open

## Code

- `renderReactFixture` maps all 9 families. App-shell / scheduler / lightbox / notification-center go through the client wrappers above. TOC / form / signature-pad / resizable / alert-dialog compose from string `items` (or title / aria-label). These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (table-of-contents → `nav`, the rest → `div`).
- `emitCronusComponent` already emits `props.options` and `props.items` as extra `text "…"` lines, plus string/number `value` and `aria-label`. Wave 1i fixtures use that for nav labels, TOC headings, the email placeholder, panel names, event titles, the confirm action, image alts, and notification titles. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 93 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1i

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

- `app-shell-default-aurora-dark`
- `table-of-contents-default-aurora-dark`
- `form-default-aurora-dark`
- `signature-pad-default-aurora-dark`
- `resizable-default-aurora-dark`
- `scheduler-default-aurora-dark`
- `alert-dialog-default-aurora-dark`
- `lightbox-default-aurora-dark`
- `notification-center-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. alert-dialog / lightbox are not native `<dialog>` on React (Radix). form is `form-item` inside a `<form>`. App-shell queries `app-shell-content`. TOC is a `nav`. Cronus side is written and may fail until the kernel ports land.
