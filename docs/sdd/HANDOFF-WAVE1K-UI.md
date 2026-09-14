# HANDOFF — Wave 1k UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1k`  
**Branch:** `feat/wave1k-audit-fixtures` (from `feat/cronus-audit` @ `4421452e`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1k. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| choropleth-chart | `default` | `label: Regions`, four region `items` | `div` / `choropleth-chart` (client wrapper; tiny `{id, name, value}`; not `<figure>`) |
| profit-loss-chart | `default` | `label: P/L`, three month `items` | `div` / `profit-loss-chart` (client wrapper; `{month, pnl}` series; not `<figure>`) |
| scroll-progress | `default` | `value: 40`, `aria-label` | `div` / `scroll-progress` (client wrapper; target scrolled to ~40%) |
| rich-text-editor | `default` | `placeholder`, `aria-label` | `div` / `rich-text-editor` (no Tiptap `onChange` from the server; not `textarea-control`) |
| confirmation-dialog | `default` | `defaultOpen`, `title: Delete project` | `div` / `confirmation-dialog` (Radix content; not native `<dialog>`) |
| invite-dialog | `default` | `open`, `label: Invite member` | `div` / `invite-dialog` (controlled `open`; not native `<dialog>`) |
| shimmer | `default` | `className: h-8 w-48` | `div` / `shimmer` |
| reveal | `default` | `children: Revealed` | `div` / `reveal` |
| text-shimmer | `default` | `children: Loading` | `p` / `text-shimmer` |

Existing button / badge / input / wave 1a–1j fixtures are unchanged.

### Charts

Reuse `chart-fixtures.tsx`. Both import the published subpath (`@cronus-ui/ui/choropleth-chart`, `@cronus-ui/ui/profit-loss-chart`) — the simple wrappers, not the visx `charts/` trees.

Nested objects cannot round-trip through emit:

- **choropleth-chart** uses four `{id, name, value}` regions whose `id`s match the SVG cell map (`nw`, `ne`, `c`, `se`).
- **profit-loss-chart** uses a 3-point `{month, pnl}` series (Jan −4, Feb 8, Mar 2).

### Scroll-progress / rich-text-editor / dialogs

- **scroll-progress** does not take a `value` prop — it tracks a scroll target. `scroll-progress-fixture.tsx` owns a tall overflow box and sets `scrollTop` to ~40% after layout. `value: 40` is still in the JSON so emit writes `value:40`.
- **rich-text-editor** is already `"use client"`. `onChange` is stripped; the server page never passes a Tiptap handler. Root is `div[data-slot=rich-text-editor]`. Tiptap is a contenteditable, not `<textarea>` / `textarea-control`.
- **confirmation-dialog** is forced `defaultOpen` with `title`. `onConfirm` / `onOpenChange` are stripped. Root is Radix `AlertDialogContent` with `data-slot=confirmation-dialog` (a `div`). Imported from the `@cronus-ui/ui` barrel — there is no `./confirmation-dialog` subpath export.
- **invite-dialog** is forced `open` (controlled, stays open). `onInvite` / `onOpenChange` / `trigger` are stripped. Root is Radix `DialogContent` with `data-slot=invite-dialog` (a `div`).

### Shimmer / reveal / text-shimmer

These three compose from string `children` (or a size `className`) in `renderReactFixture`. Never pass functions from the server page.

- **shimmer** is an `aria-hidden` `div[data-slot=shimmer]`. Fixture sizes it `h-8 w-48`.
- **reveal** is a `motion.div[data-slot=reveal]` with children text.
- **text-shimmer** defaults to `as="p"`, so the root tag is `p`. Children must be a string.

Client wrappers (data arrays / refs — never pass functions from the server page):

- `ChoroplethChartFixture` / `ProfitLossChartFixture` in `chart-fixtures.tsx`
- `scroll-progress-fixture.tsx` — target + 40% scroll

## Code

- `renderReactFixture` maps all 9 families. Choropleth / profit-loss / scroll-progress go through the client wrappers above. RTE / confirmation-dialog / invite-dialog / shimmer / reveal / text-shimmer compose from string/number props. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (eight → `div`, text-shimmer → `p`).
- `emitCronusComponent` already emits `props.items` as extra `text "…"` lines, plus string/number `value` and `aria-label`. Wave 1k fixtures use that for region names, P/L months, the 40 scroll value, RTE placeholder, dialog titles, and shimmer/reveal/text-shimmer labels. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 111 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1k

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

- `choropleth-chart-default-aurora-dark`
- `profit-loss-chart-default-aurora-dark`
- `scroll-progress-default-aurora-dark`
- `rich-text-editor-default-aurora-dark`
- `confirmation-dialog-default-aurora-dark`
- `invite-dialog-default-aurora-dark`
- `shimmer-default-aurora-dark`
- `reveal-default-aurora-dark`
- `text-shimmer-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. choropleth-chart / profit-loss-chart are not `<figure>` on React. rich-text-editor is not `textarea-control`. confirmation-dialog / invite-dialog are not native `<dialog>`. Cronus side is written and may fail until the kernel ports land.
