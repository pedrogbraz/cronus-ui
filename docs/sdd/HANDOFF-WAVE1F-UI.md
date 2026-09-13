# HANDOFF — Wave 1f UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1f`  
**Branch:** `feat/wave1f-audit-fixtures` (from `feat/cronus-audit` @ `596d4929`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1f. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e fixtures/renderers were appended to, not rewritten.

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| area-chart | `default` | label + three month `items` | `div` / `area-chart` (not `<figure>`; client wrapper, tiny static series) |
| bar-chart | `default` | label + three month `items` | `div` / `bar-chart` (same) |
| line-chart | `default` | label + three month `items` | `div` / `line-chart` (same) |
| sparkline | `default` | `data: [4, 8, 6, 10, 7]`, `aria-label` | `svg` / `sparkline` (not `<figure>`) |
| pie-chart | `default` | label + two slice `items` | `div` / `pie-chart` (not `<figure>`; client wrapper, two slices) |
| data-table | `default` | label + two name `items` | `div` / `data-table` (client wrapper; columns+rows hardcoded) |
| sidebar | `default` | `aria-label` + two menu `items` | `aside` / `sidebar` (`SidebarProvider` + `Sidebar` + `Content` + menu) |
| sonner | `default` | `aria-label` | `div` / `toaster` (family slug stays `sonner`; slot is `toaster`) |
| navigation-menu | `default` | trigger children + two `items` | `nav` / `navigation-menu` (`NavigationMenu` + `List` + `Item` + `Trigger`) |

Existing button / badge / input / wave 1a–1e fixtures are unchanged.

### Charts

Ready-made wrappers from `@cronus-ui/ui/{area,bar,line,pie}-chart` (the `data-slot` components). Nested `{date, desktop}` rows cannot round-trip through emit (only string `items`/`options` become `text "…"`), so the client wrappers ignore extra JSON and hold a 3-point series. Sparkline JSON **does** carry `data: [4, 8, 6, 10, 7]` — emit skips the number array; the wrapper reads it.

Logic locators query `[data-slot="area-chart"]` (etc.) on a `div`/`svg`, never a `<figure>`.

### Data table / sidebar

- **data-table** `ColumnDef`s are not serializable as Cronus props. `data-table-fixture.tsx` hardcodes two columns (`Name`, `Role`) and two rows. Extra fixture props are ignored.
- **sidebar** needs `SidebarProvider` context. Wrapper is compact (`h-56`, `collapsible="none"`) so the audit canvas is not `100svh`. `data-slot="sidebar"` is on the `<aside>`.

### Sonner / navigation-menu

- **sonner** family slug is `sonner`; React `expect.slot` is `toaster` on the in-tree wrapper `div`. No toast is fired (that would be a function from the server page).
- **navigation-menu** composes `List` + `Item` + `Trigger` in `renderReactFixture` (already `"use client"`). Root is a Radix `<nav>`.

Client wrappers (data arrays / table columns / sidebar context — never pass functions from the server page):

- `chart-fixtures.tsx` — area / bar / line / pie / sparkline
- `data-table-fixture.tsx` — columns + two rows
- `sidebar-fixture.tsx` — provider + content + menu labels

## Code

- `renderReactFixture` maps all 9 families. Charts/table/sidebar go through the client wrappers above. Sonner renders `<Toaster />` from `@cronus-ui/ui/sonner`. NavigationMenu is composed from string `children`/`items`. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (sparkline → `svg`, sidebar → `aside`, navigation-menu → `nav`, sonner → `div`, the rest → `div`).
- `emitCronusComponent` already emits `props.options` and `props.items` as extra `text "…"` lines. Wave 1f fixtures use that for chart month/slice labels, table names, sidebar items, and nav triggers. Sparkline numbers stay in JSON `data` and are not emitted. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 66 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1f

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

- `area-chart-default-aurora-dark`
- `bar-chart-default-aurora-dark`
- `line-chart-default-aurora-dark`
- `sparkline-default-aurora-dark`
- `pie-chart-default-aurora-dark`
- `data-table-default-aurora-dark`
- `sidebar-default-aurora-dark`
- `sonner-default-aurora-dark`
- `navigation-menu-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. Charts are `div`/`svg` with `data-slot`, not `<figure>`. Sonner is `toaster`. Data-table is `data-table`. Cronus side is written and may fail until the kernel ports land.
