# HANDOFF — Wave 1t UI (geometry coverage for overlay families)

**Date:** 2026-09-14  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1t`  
**Branch:** `feat/wave1t-ui-overlays` (from `feat/cronus-audit` @ `af5c77c4`)  
**Not pushed.** Local commit only.

`packages/ui` was not touched. `packages/audit` was not touched (no fixture or render
change was needed, so the running www `packages/audit/dist` already serves what was
measured). No new dependencies.

## Problem

`e2e/audit/geometry.spec.ts` failed 8 families with "React canvas has no [data-slot]
elements", so nothing was compared:
alert-dialog, confirmation-dialog, context-menu, drawer, invite-dialog, lightbox, sheet, shiny-text.

## Root causes (live React DOM, aurora/dark)

| family | why the React canvas had no measurable slot |
|---|---|
| alert-dialog | Open by default, content portaled to `<body>` (`alert-dialog-overlay` + `alert-dialog-content`, `position: fixed`). The fixture renders no trigger, so the canvas is empty. |
| confirmation-dialog | Same: `AlertDialogContent` with `data-slot="confirmation-dialog"`, portaled. Trigger stripped by the fixture. |
| drawer | vaul `drawer-overlay` + bottom-pinned `drawer-content`, portaled. No trigger. |
| invite-dialog | `DialogContent` with `data-slot="invite-dialog"` + `dialog-overlay`, portaled. Trigger stripped. |
| lightbox | Full-viewport `dialog-content` wrapping `[data-slot=lightbox]` + `dialog-overlay`, portaled. |
| sheet | `sheet-overlay` + right-pinned `sheet-content`, portaled. No trigger. |
| context-menu | `context-menu-content` portaled. `ContextMenuTrigger` is the bare Radix span, **no data-slot**. The content is placed at the pointer; opened through `open` with no contextmenu event, that is the viewport origin (2,0). |
| shiny-text | Has a slot, but `<span data-slot="shiny-text" class="contents">`: `display: contents` gives no client rects, so `rendered()` dropped it. The painted box is the inner, slot-less span. |

None of these is a fixture-render bug. The dialogs are open by default on purpose, and the
logic spec asserts their content tags.

## Spec changes (`e2e/audit/geometry.spec.ts`)

Tolerances and compared fields are unchanged. Nothing is skipped.

1. **`OVERLAY` (alert-dialog, confirmation-dialog, drawer, invite-dialog, lightbox, sheet).**
   The React overlays are `position: fixed`, so their geometry depends only on the viewport,
   and the two panes do not share one: the React page is 1280x900, the kernel iframe window
   is 640x777. So:
   - the kernel is measured in the normal page;
   - React is measured in a second browser context whose viewport is exactly the kernel
     iframe's `innerWidth` x `innerHeight` (same `sm:` breakpoint state too).

   The `[data-slot]` subtrees of the listed roots (overlay + content) are measured against
   the viewport origin on both sides (`origin: "viewport"`). Everything else stays
   canvas-relative, so a kernel slot rendered in-flow in its canvas shows up as
   "missing in React" or as an origin mismatch. Readiness gate:
   `[role="dialog"], [role="alertdialog"]`.
   - Check: React alert-dialog content measures `64,321.5 512x134` (centred `max-w-lg` in 640 wide).
   - Check: the overlay measures `0,0 640x777`.
2. **`PORTAL` entry for context-menu.** The anchor is `context-menu-content` itself, because
   the pointer position is not a component property.
   - Root: size, colours, radius and border are compared exactly.
   - Items: compared against the root.
   - The root's own x/y is 0,0 on both sides by construction.
   - Ready: `[role="menu"]`.
3. **`display: contents` slots.** If a slot has `display: contents` and exactly one element
   child with a box, that child is the slot's rendered box: rect and computed style come from
   the child, while slot, tag and text stay the slot's. If there are zero or several boxed
   children, the slot is still not measured (no invented union box).
   - Affected React slots in `packages/ui`: `shiny-text` and `prompt-input-body` (prompt-input
     has no audit fixture).
   - Kernel: only `[data-slot=dock-item] > span` uses `contents`, and that span has no slot.
   - `dock` still passes.

## Live results (worktree spec vs running www :4747 / kernel :5176)

`bunx playwright test -c playwright.audit.live.config.ts e2e/audit/geometry.spec.ts --grep "(…) "`

| family | result | mismatches |
|---|---|---|
| alert-dialog | FAIL (real comparison) | 18 |
| confirmation-dialog | FAIL (real comparison) | 14 |
| context-menu | FAIL (real comparison) | 12 |
| drawer | FAIL (real comparison) | 14 |
| invite-dialog | FAIL (real comparison) | 26 |
| lightbox | FAIL (real comparison) | 19 |
| sheet | FAIL (real comparison) | 7 |
| shiny-text | FAIL (real comparison) | 1 |
| multi-select (regression) | PASS | 0 |
| dock (contents regression) | PASS | 0 |

`e2e/audit/logic.spec.ts`: **169 passed**.

## Kernel follow-ups (what must change to pass)

All coordinates are in a 640x777 viewport unless marked canvas / content-relative.

### alert-dialog
- Render `alert-dialog-overlay`: `div`, fixed `0,0 640x777`, `bg-black/50`.
- `alert-dialog-content`: `div`, fixed and centred at `64,321.5 512x134`.
  - `p-6`, `gap-4`, radius 18px, border 1px.
  - No wrapper `alert-dialog` slot and no trigger button in the canvas: React has neither.
- Children: only `alert-dialog-title` and `alert-dialog-action`. Drop `alert-dialog-description` ("Confirm") and `alert-dialog-cancel`.
  - `alert-dialog-title`: `h2`, `89,346.5 462x28`, line-height 28px.
  - `alert-dialog-action`: primary button `89,390.5 462x40`, 14px/500/20px, radius 14px, no border.
- **Fixture mapping:** `items[0]` is the action label (`"Confirm"`), not a description; the kernel shows "Continue".

### confirmation-dialog
- `alert-dialog-overlay`: fixed `0,0 640x777`.
- `confirmation-dialog`: `96,321.5 448x134` (max-w 448), border 1px.
- Children of `confirmation-dialog`:
  - `alert-dialog-header`: `121,346.5 398x28`, containing `alert-dialog-title` (`h2`). Replaces the kernel's `confirmation-dialog-title`.
  - `alert-dialog-footer`: `121,390.5 398x40`, containing:
    - `alert-dialog-cancel`: `335.64,390.5 79.36x40`.
    - `confirmation-dialog-confirm`: `423,390.5 96x40`, primary: bg `rgb(0,166,244)`, fg `rgb(10,10,12)`, radius 14px, no border, line-height 20px.

### drawer
- `drawer-overlay`: fixed `0,0 640x777`.
- `drawer-content`: bottom-pinned `0,667 640x110`.
  - bg surface-floating `rgb(22,22,25)`, border 1px, top radius.
  - Handle bar (no slot) above the header.
- `drawer-header` (new slot): `1,690 638x86`, `p-4`, containing:
  - `drawer-title`: `h2`, `17,706 606x28`, line-height 28px.
  - `drawer-description`: `p`, `17,740 606x20`, line-height 20px, text "Narrow the list." (the kernel currently emits it empty, so the `description` prop is dropped).
- No wrapper `drawer` slot and no trigger in the canvas.

### invite-dialog
- `dialog-overlay`: fixed `0,0 640x777`.
- `invite-dialog`: `96,232.5 448x312`, bg `rgb(22,22,25)`, radius 18px, border 1px.
- Subtree of `invite-dialog`:
  - `dialog-header` `121,257.5 398x54`:
    - `dialog-title` (`h2`) `121,257.5 398x28`. Replaces `invite-dialog-title`.
    - `dialog-description` (`p`) "Send an invitation to join this workspace." `121,291.5 398x20`.
  - `field` #0 `121,327.5 398x60`: `field-label` (`label`, 14px tall), then `input` `121,347.5 398x40`.
  - `field` #1 `121,403.5 398x60`: `field-label`, then `select-trigger` (`button`, role selector) `121,423.5 398x40`.
  - `dialog-footer` `121,479.5 398x40`:
    - `button` (Cancel) `326.53,479.5 79.36x40`.
    - `invite-dialog-send`: primary `413.89,479.5 105.11x40`, 14px/500/20px, bg `rgb(0,166,244)`, fg `rgb(10,10,12)`, radius 14px.
  - `dialog-close` `511,249.5 16x16`.

### lightbox
- `dialog-overlay`: fixed `0,0 640x777`.
- `dialog-content`: fixed `0,0 640x777`, `bg-black/95`, no radius or border.
- `lightbox`: inside `dialog-content`, `0,0 640x777`, color white.
- Children of `lightbox`:
  - `lightbox-counter`: `16,22 29x20`, 14px/20px, `rgba(255,255,255,0.7)`.
  - `lightbox-close`: `592,16 32x32`, white/70, **icon only** (no visible "Close" text; use aria-label).
  - `lightbox-image`: `img` `288,344.5 64x64`.
  - `lightbox-thumbnails`: `0,689 640x88`.
  - Remove `lightbox-caption` (React has none).
- Counter reads "1 / 2" in React (two `items`) and "1 / 1" in the kernel: the kernel must count `items`.
  - Note: image `{src,alt}` does not round-trip through emit (see `lightbox-fixture.tsx`), so the kernel needs a placeholder image per item.

### sheet
- The kernel `sheet-content` is a closed `popover` (`display: none`), so it has no box. React is open by default, so the kernel must render it open.
- `sheet-overlay`: fixed `0,0 640x777`.
- `sheet-content`: right-pinned `256,0 384x777` (`w-3/4 max-w-sm`), border-left 1px.
- Children of `sheet-content`:
  - `sheet-header` (new) `281,24 335x54`: `sheet-title` (`h2`) `281,24 335x28`, `sheet-description` (`p`) "Make changes to your profile here." `281,58 335x20`.
  - `sheet-close`: `608,16 16x16`.
- Drop `sheet-trigger`: React renders no trigger.

### context-menu (content-relative)
- `context-menu-content`: `128x74` (min-w 8rem, `p-1`), bg `rgb(22,22,25)`, radius 14px, border 1px. Currently the kernel renders it as `432x48`, transparent and unstyled.
- `context-menu-item` #0 `5,5 118x32`, #1 `5,37 118x32`: 14px/20px, radius 10px.
- The kernel's in-canvas trigger `<button>` is not measured, since neither side gives the trigger a slot.

### shiny-text
- Rect, typography and radius already match (`45.67x18`).
- The only delta is color. React paints `color: transparent` with a `background-clip: text` gradient (fg-tertiary → fg → fg-tertiary, `200%` background size); the kernel paints solid fg `rgb(250,250,249)`.
- Kernel: emit `color: transparent; background-clip: text` plus that gradient on the slot span.

## Proposals for `packages/ui` (not applied: read-only this wave)

- `context-menu.tsx`: wrap `ContextMenuTrigger` to add `data-slot="context-menu-trigger"`, the same way the content and items already carry slots. That would let geometry compare the trigger, which is currently unmeasured on both sides.
- `shiny-text.tsx` (optional): move `data-slot="shiny-text"` from the `display: contents` wrapper onto the painted `Comp` (keep the `<style>` sibling). The spec's contents rule makes this unnecessary for parity; it would only make the slot a real box for other tooling.

## Checks

- `bunx biome check e2e/audit/geometry.spec.ts`: clean.
- `bunx vitest run --project audit`: 6 files / 54 tests passed.
- `cd packages/audit && bunx tsc -p tsconfig.json --noEmit`: clean.
  - The fresh worktree first failed with TS2307 on `@cronus-ui/ui/*` because `packages/ui/dist` is gitignored and absent.
  - After a local `packages/ui` build (dist only; `@cronus-ui/theme` also unbuilt, so that build exits 2 but emits), it is clean.
  - The main checkout's tsc is clean.
