# HANDOFF — Wave 1n UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1n`  
**Branch:** `feat/wave1n-audit-fixtures` (from `feat/cronus-audit` @ `7ee6fdc6`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1n. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j/1k/1l/1m fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture. **code-block is `code-block.tsx`, not `ai-code-block.tsx`.**

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| carousel | `default` | two slide `items`, `aria-label: Slides`, size `className` | `div` / `carousel` |
| code-block | `default` | `code: const n = 1;`, `language: ts`, `filename: index.ts` | `div` / `code-block` |
| description-list | `default` | even/odd term-details `items` | `dl` / `description-list` |
| kanban | `default` | even/odd column-card `items`, `aria-label: Board` | `div` / `kanban` (also emits `kanban-column`; client wrapper) |
| json-viewer | `default` | `data: { name, ok }`, `aria-label: Payload` | `div` / `json-viewer` (root already has the family slot — no wrap) |
| animated-number | `default` | `value: 1234`, `aria-label: Count` | `span` / `animated-number` (`locale="en-US"`, `reducedMotion="always"`) |
| marquee | `default` | two item `items`, size `className` | `div` / `marquee` (`motionPreference="never"`) |
| gradient-text | `default` | `children: Aurora` | `span` / `gradient-text` |
| shiny-text | `default` | `children: Sheen` | `span` / `shiny-text` |

Existing button / badge / input / wave 1a–1m fixtures are unchanged.

### Carousel / code-block / description-list / marquee / gradient-text / shiny-text / animated-number

These compose from string/number props in `renderReactFixture`. Never pass functions from the server page.

- **carousel** maps string `items` to `CarouselItem` slides plus previous/next chrome. `labels.goToSlide` is not passed (it is a function).
- **code-block** takes the `code` string (not `ai-code-block`). Emit uses `code` as the label and an extra `text "…"` line.
- **description-list** pairs even/odd `items` into `DescriptionItem` term/details. Root is a real `<dl>`.
- **marquee** maps string `items` to `<span>` children. Renderer forces `motionPreference="never"` so the row is static for screenshots.
- **gradient-text** / **shiny-text** children must be a string. Shiny-text's slot lives on a `span.contents` wrapper — logic spec asserts the tag, not visibility of that node.
- **animated-number** takes numeric `value`. `format` is stripped. Renderer forces `locale="en-US"` (no env locale) and `reducedMotion="always"` so the settled value is in the DOM on first paint.

### Kanban / json-viewer

Nested objects / callbacks cannot round-trip through emit:

- **kanban** needs `{id, title, items}` columns and a required `onColumnsChange`. `kanban-fixture.tsx` pairs even/odd `items` as column title + card title and owns `useState` for the callback. React already emits `data-slot="kanban"` on the board root — **no extra family wrapper**. Logic spec accepts Cronus `kanban` **or** `kanban-column`.
- **json-viewer** already emits `data-slot="json-viewer"` on the root — **no wrap**. Fixture `data` is a small JSON object (`{ name: "Ada", ok: true }`). `defaultExpandedDepth` is left at the component default (1) so Infinity never crosses the RSC boundary.

Client wrappers (nested data / required callbacks — never pass functions from the server page):

- `kanban-fixture.tsx` — labels → two columns with one card each, local `onColumnsChange`

## Code

- `renderReactFixture` maps all 9 families. Kanban goes through the client wrapper above. The other 8 compose from string/number/JSON props. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (carousel / code-block / kanban / json-viewer / marquee → `div`; description-list → `dl`; animated-number / gradient-text / shiny-text → `span`).
- `emitCronusComponent` already emits `props.items` as extra `text "…"` lines. This wave also emits string `props.code` as the label and an extra `text "…"` line. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 138 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1n

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

- `carousel-default-aurora-dark`
- `code-block-default-aurora-dark`
- `description-list-default-aurora-dark`
- `kanban-default-aurora-dark`
- `json-viewer-default-aurora-dark`
- `animated-number-default-aurora-dark`
- `marquee-default-aurora-dark`
- `gradient-text-default-aurora-dark`
- `shiny-text-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. kanban has `kanban` **or** `kanban-column`. description-list is a `<dl>`. animated-number / gradient-text / shiny-text are `<span>`. Cronus side is written and may fail until the kernel ports land.
