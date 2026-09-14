# HANDOFF — Wave 1l UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1l`  
**Branch:** `feat/wave1l-audit-fixtures` (from `feat/cronus-audit` @ `6d9cdc56`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1l. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j/1k fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| particles | `default` | `children: Field`, size `className` | `div` / `particles` (children text; not a SURF-only fx layer) |
| sparkles-text | `default` | `children: Launch` | `span` / `sparkles-text` |
| noise | `default` | `children: Grain`, size `className` | `div` / `noise` |
| morphing-popover | `default` | `open`, `children: Open`, body in `options` | `div` / `morphing-popover-content` (controlled `open`; not `<details>`) |
| bouncy-accordion | `default` | two title `items`, `defaultValue: Type` | `div` / `bouncy-accordion` (string items → `{id, title, description}`) |
| typing-text | `default` | `text: Shipping` | `span` / `typing-text` (`reducedMotion="never"` so the phrase is visible) |
| word-rotate | `default` | `words: Design, System` | `span` / `word-rotate` |
| timeline | `default` | two event `items`, `aria-label` | `ol` / `timeline` (string items → `TimelineItem` + title) |
| tree-view | `default` | `src` + `README.md` `items`, `aria-label` | `div` / `tree-view` (client wrapper; nested `{id, label, children}`) |

Existing button / badge / input / wave 1a–1k fixtures are unchanged.

### Particles / sparkles-text / noise / typing-text / word-rotate

These compose from string `children` / `text` / `words` in `renderReactFixture`. Never pass functions from the server page.

- **particles** is a `div[data-slot=particles]` with children text. Fixture sizes it `h-32 w-72`. Distinguishable from a generic SURF fx layer: dedicated slot + visible children (not canvas-only).
- **sparkles-text** is a `span[data-slot=sparkles-text]`. Children must be a string.
- **noise** is a `div[data-slot=noise]` with children text. Fixture sizes it `h-32 w-72`.
- **typing-text** takes a string `text` (not `children`). Renderer forces `reducedMotion="never"` so the phrase is in the DOM immediately. `on*` handlers are not passed.
- **word-rotate** takes `words: string[]`. Emit writes each word as an extra `text "…"` line. Label is the first word.

### Morphing-popover / bouncy-accordion / timeline / tree-view

Nested objects / React nodes cannot round-trip through emit:

- **morphing-popover** is forced `open` (controlled, stays open). `onOpenChange` is stripped. Expect slot is the content `div[data-slot=morphing-popover-content]`, same pattern as popover — not a native `<details>`. Trigger label comes from `children`; body from `options`.
- **bouncy-accordion** maps string `items` to `{id, title, description}` (title reused as description; no icon nodes). `onValueChange` is stripped. `defaultValue` opens the first item.
- **timeline** maps string `items` to `TimelineItem` + `TimelineTitle`. Root is a real `<ol role="list">`, not a `<div>` / `<ul>`.
- **tree-view** needs nested `{id, label, children}`. `tree-view-fixture.tsx` treats the first `items` label as an expanded branch and the rest as leaves. `onValueChange` / `onExpandedChange` are stripped.

Client wrappers (nested data — never pass functions from the server page):

- `tree-view-fixture.tsx` — labels → tiny expanded tree

## Code

- `renderReactFixture` maps all 9 families. Tree-view goes through the client wrapper above. Particles / sparkles-text / noise / morphing-popover / bouncy-accordion / typing-text / word-rotate / timeline compose from string/number props. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (particles / noise / morphing-popover / bouncy-accordion / tree-view → `div`; sparkles-text / typing-text / word-rotate → `span`; timeline → `ol`).
- `emitCronusComponent` already emits `props.items` / `props.options` as extra `text "…"` lines. This wave also emits `props.words` the same way, and uses string `props.text` (or the first word) as the component label. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 120 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1l

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

- `particles-default-aurora-dark`
- `sparkles-text-default-aurora-dark`
- `noise-default-aurora-dark`
- `morphing-popover-default-aurora-dark`
- `bouncy-accordion-default-aurora-dark`
- `typing-text-default-aurora-dark`
- `word-rotate-default-aurora-dark`
- `timeline-default-aurora-dark`
- `tree-view-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. morphing-popover is not `<details>`. particles is not a SURF-only fx layer (dedicated slot + children text). timeline is an `<ol>`. sparkles-text / typing-text / word-rotate are `<span>`. Cronus side is written and may fail until the kernel ports land.
