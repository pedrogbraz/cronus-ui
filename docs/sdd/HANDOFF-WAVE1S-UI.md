# HANDOFF — Wave 1s UI (geometry parity)

**Date:** 2026-09-14  
**Worktree:** `/Users/pedrogbraz/projects/cooud/cooud-ui/.wt/ui-1s`  
**Branch:** `feat/wave1s-ui-geometry` (from `feat/cronus-audit` @ `99939c8d`)  
**Not pushed.** Local commit only.

This is the UI/audit half of Wave 1s. Three kernel agents fix geometry in parallel on other branches. **Do not read the red families below as UI regressions.** They are the measured React-vs-Cronus gap against the kernel that was running on 2026-09-14, before those merges.

`packages/ui` was not touched. No new dependencies. No meteors / sankey-chart.

## What changed

| file | change |
|---|---|
| `packages/audit/src/emit-cronus-fixture.ts` | `emitCronusComponent` emits `hourCycle:<n>` (or `hourCycle:"…"`), `filename:"…"`, `language:"…"` before `aria-label:` |
| `packages/audit/src/emit-cronus-fixture.test.ts` | 3 tests: placement/order, string + escaping, absent props (plus biome formatting of one pre-existing line) |
| `e2e/audit/geometry.spec.ts` | **new**: React-vs-Cronus geometry parity for 16 families |
| `playwright.audit.live.config.ts` | **new**: same `use`/viewport/colorScheme/snapshot settings, **no `webServer`**, baseURL `http://localhost:4747` |
| `playwright.audit.config.ts` | comment explaining the prebuild requirement |
| `package.json` | `test:audit` builds via turbo first; new `test:audit:live` |

### Emitter

The React fixtures already carried these props; the emitter dropped them. The kernel already reads the attrs.

- `time-picker/default` has `hourCycle: 24`. React shows `09:30`; the kernel showed `09:30 AM`.
- `code-block/default` has `filename: "index.ts"` and `language: "ts"`. The kernel renders `code-block-header` only when they're present.

A fresh `bun ../src/cli.ts emit` diffed against the main checkout's `app.cronus` (172 fixtures) changes **only** these two components:

```
CodeBlockDefault   + filename:"index.ts"
                   + language:"ts"
TimePickerDefault  + hourCycle:24
```

`cronus parse app.cronus` exits 0 (172 pages).

### Build order (`test:audit`)

www imports `@cronus-ui/audit` from `packages/audit/dist`. `bun run --filter @cronus-ui/www build` does not rebuild it, so `next start` could serve a stale React render. Now:

```
"test:audit": "turbo run build --filter=@cronus-ui/www && playwright test -c playwright.audit.config.ts"
```

`turbo run build --filter=@cronus-ui/www --dry=json` task graph:

```
@cronus-ui/www#build   deps: @cronus-ui/audit#build, @cronus-ui/stack#build, @cronus-ui/theme#build,
                             @cronus-ui/tokens#build, @cronus-ui/ui#build, cronus-ui-mcp#build
@cronus-ui/audit#build deps: @cronus-ui/tokens#build, @cronus-ui/ui#build
@cronus-ui/ui#build    deps: @cronus-ui/theme#build
@cronus-ui/theme#build deps: @cronus-ui/tokens#build
```

A real build in the worktree gave `Tasks: 7 successful, 7 total`, including `@cronus-ui/audit:build: cache miss, executing … tsc -p tsconfig.json`.

## Geometry spec design

For each family, `geometry.spec.ts` opens `/audit/{family}?fixture=default&preset=aurora&mode=dark` and waits for both canvases:

- React: `[data-audit-side="react"] [data-audit-canvas]`
- Cronus: the `[data-audit-canvas]` inside the iframe

It injects `FREEZE_CSS` into both documents (`page.addStyleTag` for React, `freezeFrame` for Cronus) and waits for `document.fonts.ready`. It then measures in a loop, two rAFs apart, until two consecutive reads match (at most 20 reads, no sleeps). This absorbs JS-driven motion that the CSS freeze doesn't stop.

Measured for every rendered `[data-slot]` element (document order):

- slot, tag
- rect relative to the canvas
- `fontSize`, `fontWeight`, `lineHeight`
- font class (`mono` vs `sans`, from `font-family`)
- `color` and `backgroundColor` as rgba, painted into a 1x1 2d canvas and read back (React computes `lab()`, the kernel `oklch()`)
- used border radius per corner, clamped to half the short side (`rounded-full` computes to `3.35544e+07px` in React and `9999px` in the kernel; both are a pill)
- border width per side
- visible text (`innerText`, whitespace-collapsed)

Elements are paired by `slot#occurrence`. Assertions, with tolerances that are **not** to be loosened:

| check | tolerance |
|---|---|
| slot multiset | identical, except the allowlist below |
| rect x/y/w/h | ≤ 1px |
| font size / weight / line-height / font class | equal |
| color / background | ≤ 2/255 per channel |
| radius / border width | equal |
| text | equal |

Elements with no layout box (`getClientRects().length === 0`) are skipped. Example: the kernel's closed time-picker popover markup, which is `display:none`. DOM presence of closed content is the logic spec's job, not this one.

**Portals (multi-select).** React portals the popover to `<body>`; the kernel keeps it inside the canvas. On both sides these are measured relative to `multi-select-trigger`:

- the `[data-slot="multi-select-content"]` subtree
- any `[data-slot^="multi-select-"]` outside the canvas

The React side gates on `[role="option"], [data-slot="multi-select-content"]` being visible. That way a missing content slot shows up as a mismatch, not a timeout.

**Allowlist (React-only slots):**

| family | slot | why |
|---|---|---|
| code-block | `copy-button` | CopyButton needs `navigator.clipboard` (JS). The audit kernel document is zero-JS by contract, and `cronus_ui_code_block.rs` says "No copy button: it would need JS" (asserted in its tests). Only the slot is exempt; the header is still measured. |

On failure the spec prints a per-slot table (`slot#n | field | React | Cronus`) and puts it in the assertion message.

## How to run

```
cd /Users/pedrogbraz/projects/cooud/cooud-ui/.wt/ui-1s

# unit
bunx vitest run --project audit

# LIVE: against an already-running `bun run audit:dev` (www :4747, kernel :5176).
# Never starts or stops servers.
bun run test:audit:live e2e/audit/geometry.spec.ts
bun run test:audit:live e2e/audit/logic.spec.ts

# FULL: builds www + deps (incl. audit dist), boots its own servers on 4747/5176
# (reuseExistingServer:false). Do NOT run while a shared audit:dev is up.
bun run test:audit
bun run test:audit e2e/audit/geometry.spec.ts
```

Live caveat: `audit:dev` serves the **main checkout's** www and `app.cronus`. Until this branch is merged and `audit:dev` restarts, the emitter change (time-picker `hourCycle`, code-block header) isn't visible live.

## Live run results (2026-09-14)

Both runs used `playwright.audit.live.config.ts` against the shared www :4747 and kernel :5176. The kernel had no Wave 1s kernel fixes; www and `app.cronus` came from the main checkout.

- `e2e/audit/logic.spec.ts`: **169 passed** (1.4m)
- `e2e/audit/geometry.spec.ts`: **2 passed, 14 failed** (23.3s)

| family | result | mismatches | key deltas (React → Cronus) |
|---|---|---|---|
| logo-carousel | FAIL | 15 | root 288x96 → 432x66; items show initials `A`/`G` → full `Acme`/`Globex`; item weight 400 → 600; item bg transparent → surface; color alpha 179 → 255 |
| flip-card | FAIL | 9 | width 288 → 432; faces 288x2 (absolute) → 432x256; radius 22 → 18 |
| orbit | **PASS** | 0 | — |
| motion-presets | **PASS** | 0 | — |
| progressive-blur | FAIL | 1 | Cronus-only slot `progressive-blur-host` |
| input-otp | FAIL | 7 | line-height only: group 24px, slots 20px → `normal` (rects already within 1px) |
| time-picker | FAIL | 3 | text `09:30` → `09:30 AM` (fixed by this emitter; not live yet); bg transparent → `rgba(14,14,16)`; line-height 20px → normal |
| multi-select | FAIL | 10 | trigger: bg surface-inset → transparent, radius 14 → 0, border 1 → 0; React popover exposes only `multi-select-indicator` ×2; Cronus has `multi-select` wrapper + `multi-select-content` + `multi-select-item` ×2 (no indicator) |
| dock | FAIL | 16 | 122x62 → 120x60; border 1 → 0; bg alpha 179 → 255; radius 22/18 → 18/14; item bg `rgba(30,30,33)` → `rgba(107,107,107)`; item text `""` (icon-only) → `Home`/`Search` |
| form | FAIL | 6 | slot names: React `label` + `input` vs Cronus `form-label` + `form-control` (same rects); line-height |
| segmented-control | FAIL | 8 | height 42/32 → 39/29 (item line-height 20px → normal) |
| text-shimmer | FAIL | 2 | height 24 → 18 (line-height 24px → normal) |
| text-effect | FAIL | 3 | 432x24 block → 63.66x18; text `Headline Headline` (React sr + visual copy) → `Headline` |
| timeline | FAIL | 31 | content font 16 → 14px; title line-height 14 → 21px; rails/body 16 → 45 tall; dot y +6; connector 2 → 25 tall |
| code-block | FAIL | 11 | width 288 → 432; missing header/filename/language (fixed by this emitter; not live yet); root bg surface-raised → transparent; scroll y 74 → 25 |
| card-stack | FAIL | 9 | width 288 → 384; text `Card stack One Two` → `One Two`; radius 22 → 16; second item offset/scale differs (39.8,30.3 282x222 → 41.7,34 369x215) |

### Cross-cutting kernel finding

Almost every family shows `lineHeight: 24px` (React) vs `normal` (Cronus) on containers. React inherits Tailwind preflight's `html { line-height: 1.5 }`; the kernel audit document sets no base `line-height`. That alone explains the height deltas in segmented-control, text-shimmer and part of timeline. It's a kernel `audit_stylesheet` / base-reset fix, not a per-family one.

### Sample tables

```
[geometry] segmented-control: 8 mismatch(es)
| slot#n                    | field         | React             | Cronus            |
| segmented-control#0       | rect Δ0,0,0,3 | 24,24 123.88x42   | 24,24 123.88x39   |
| segmented-control#0       | lineHeight    | 24px              | normal            |
| segmented-control-item#0  | rect Δ0,0,0,3 | 29,29 49.31x32    | 29,29 49.31x29    |
| segmented-control-item#0  | lineHeight    | 20px              | normal            |
| segmented-control-thumb#0 | rect Δ0,0,0,3 | 29,29 49.31x32    | 29,29 49.31x29    |
| segmented-control-thumb#0 | lineHeight    | 20px              | normal            |
| segmented-control-item#1  | rect Δ0,0,0,3 | 82.31,29 60.56x32 | 82.31,29 60.56x29 |
| segmented-control-item#1  | lineHeight    | 20px              | normal            |

[geometry] code-block: 11 mismatch(es)
| slot#n                | field            | React                      | Cronus          |
| code-block#0          | rect Δ0,0,144,49 | 24,24 288x105.75           | 24,24 432x56.75 |
| code-block#0          | lineHeight       | 24px                       | normal          |
| code-block#0          | background       | rgba(21,21,23,255)         | rgba(0,0,0,0)   |
| code-block#0          | text             | "index.ts ts const n = 1;" | "const n = 1;"  |
| code-block-header#0   | slot             | div 25,25 286x49           | —               |
| code-block-filename#0 | slot             | span 41,41 57.8x16         | —               |
| code-block-language#0 | slot             | span 106.8,38 28.92x22     | —               |
| code-block-scroll#0   | rect Δ0,49,144,0 | 25,74 286x54.75            | 25,25 430x54.75 |
| code-block-scroll#0   | lineHeight       | 24px                       | normal          |
| code-block-pre#0      | rect Δ0,49,144,0 | 25,74 286x54.75            | 25,25 430x54.75 |
| code-block-code#0     | rect Δ0,49,144,0 | 41,90 254x22.75            | 41,41 398x22.75 |
```

The full tables for every family print in the Playwright output of `bun run test:audit:live e2e/audit/geometry.spec.ts`.

## Known expected failures pending kernel merge

- **All 14 red families** until the Wave 1s kernel geometry branches merge and the kernel restarts.
- **time-picker text / code-block header** until this branch merges and `audit:dev` re-emits `app.cronus`.
- **Probably fixture-side, not kernel:** `className` widths (`w-72` → 288px) apparently don't reach Cronus (logo-carousel, flip-card, code-block, card-stack render 432/384 wide). The emitter doesn't carry `className`, by design. Kernel agents should match the fixture width in the renderer or agree on an attr. Don't loosen the spec.
- **form slot names** (`label`/`input` vs `form-label`/`form-control`) and **multi-select popover slots** are naming/contract decisions. They need a human call on which side is the SoT before either side changes.
