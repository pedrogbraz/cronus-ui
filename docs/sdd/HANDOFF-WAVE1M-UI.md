# HANDOFF — Wave 1m UI (audit fixtures)

**Date:** 2026-09-13  
**Worktree:** `/Users/pedrogbraz/projects/cooud/.wt/ui-1m`  
**Branch:** `feat/wave1m-audit-fixtures` (from `feat/cronus-audit` @ `e6874f26`)  
**Not pushed.** Local commits only.

This is the UI/audit half of Wave 1m. Kernel ports land in parallel — **do not claim these families ported**. Fixtures, React renderers, emit, and specs are in; Cronus-side e2e may stay red until kernel merge.

`packages/ui` was not touched. CONTRACT is read-only this wave. Wave 1a/1b/1c/1d/1e/1f/1g/1h/1i/1j/1k/1l fixtures/renderers were appended to, not rewritten. No meteors / sankey fixture. **sonner already has fixtures — toast is a separate kernel extra, not a duplicate.**

## Fixtures

JSON under `packages/audit/fixtures/`. Catalog is scanned automatically.

| family | fixture id | props | React tag / slot |
|---|---|---|---|
| tilt-card | `default` | `children: Hover me`, size `className` | `div` / `tilt-card` |
| star-border | `default` | `children: Twinkle`, size `className` | `div` / `star-border` |
| glass-card | `default` | `children: Frosted`, size `className` | `div` / `glass-card` |
| terminal | `default` | `title: zsh`, two command `items` | `div` / `terminal` (also emits `terminal-screen`; client wrapper; `{type, text}` lines) |
| video-player | `default` | dummy `src`, `aria-label: Launch video` | `div` / `video-player` (no real media) |
| text-effect | `default` | `children: Headline` | `p` / `text-effect` (`trigger="mount"`, `reducedMotion="always"`) |
| spotlight-card | `default` | `children: Spotlight`, size `className` | `div` / `spotlight-card` |
| animated-list | `default` | two item `items` | `ul` / `animated-list` (`reducedMotion="always"`) |
| toast | `default` | `children: Saved` | `div` / `toast` (visible toast-like node; not toaster-only empty) |

Existing button / badge / input / wave 1a–1l fixtures are unchanged.

### Tilt-card / star-border / glass-card / spotlight-card

These compose from string `children` in `renderReactFixture`. Pointer handlers (`onMouseMove` / `onMouseEnter` / `onMouseLeave`) are stripped — never pass functions from the server page. Fixture sizes them `w-72`.

`TiltCard` has no `./tilt-card` subpath export in `packages/ui/package.json`; it is imported from the `@cronus-ui/ui` barrel (same pattern as confirmation-dialog).

### Terminal / video-player / text-effect / animated-list

Nested objects / React nodes cannot round-trip through emit:

- **terminal** maps string `items` to `{type, text}` lines (even index → `input`, odd → `output`). `motionPreference="never"` so the finished transcript is in the DOM immediately (no typing animation). Logic spec accepts `data-slot="terminal"` **or** `data-slot="terminal-screen"`.
- **video-player** takes a dummy `src` (`/audit-video.mp4`). No real media file is required; the chrome (play overlay + controls) is enough for the slot. `onPlay` / `onPause` are stripped.
- **text-effect** children must be a string. Default `as` is `"p"`. Renderer forces `trigger="mount"` and `reducedMotion="always"` so the phrase is fully visible (no in-view wait, no stagger).
- **animated-list** maps string `items` to keyed `<span>` children. Root is a real `<ul>`. `reducedMotion="always"` so items are visible on first paint.

### Toast (kernel extra)

**Not a duplicate of sonner.** The sonner family already mounts `<Toaster />` (`data-slot="toaster"`). A Toaster-only tree is empty — sonner toasts do not emit `data-slot="toast"`.

`toast-fixture.tsx` is a client wrapper that:

1. Calls `toast()` so the kernel extra exercises the imperative API.
2. Renders a **visible** static `div[data-slot="toast"]` with the fixture message (`Saved`). Toaster is **not** mounted here.

Logic spec asserts the toast node is visible and is not toaster-only empty.

Client wrappers (nested data / `toast()` — never pass functions from the server page):

- `terminal-fixture.tsx` — labels → `{type, text}` lines, static transcript
- `toast-fixture.tsx` — `toast()` + visible `data-slot="toast"`

## Code

- `renderReactFixture` maps all 9 families. Terminal / toast go through the client wrappers above. Tilt-card / star-border / glass-card / video-player / text-effect / spotlight-card / animated-list compose from string/number props. These 9 never throw.
- `expectedTag` / `FAMILY_TAGS` cover all 9 (tilt-card / star-border / glass-card / terminal / video-player / spotlight-card / toast → `div`; text-effect → `p`; animated-list → `ul`).
- `emitCronusComponent` already emits `props.items` as extra `text "…"` lines, plus string `children` / `title` / `aria-label` as the label. Never emits `source`.
- Generated `packages/audit/cronus-fixtures/app.cronus` (gitignored) is `component X { }` + `page { use X }`. 129 fixtures after this wave.

## Test commands

```
cd /Users/pedrogbraz/projects/cooud/.wt/ui-1m

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

- `tilt-card-default-aurora-dark`
- `star-border-default-aurora-dark`
- `glass-card-default-aurora-dark`
- `terminal-default-aurora-dark`
- `video-player-default-aurora-dark`
- `text-effect-default-aurora-dark`
- `spotlight-card-default-aurora-dark`
- `animated-list-default-aurora-dark`
- `toast-default-aurora-dark`

Logic specs: one test per family using the actual `data-slot` from the table. terminal has `terminal` **or** `terminal-screen`. video-player has `video-player`. toast is a visible `div[data-slot=toast]`, not toaster-only empty. animated-list is a `<ul>`. text-effect is a `<p>`. Cronus side is written and may fail until the kernel ports land.
