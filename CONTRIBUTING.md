# Contributing to Cronus UI

Thanks for helping build Cronus UI. This guide covers the dev setup, the quality
gates every change must pass, and what we expect from PRs.

## Prerequisites

- [Bun](https://bun.sh) `1.3.14` (the repo's package manager — see `packageManager` in `package.json`)
- Node.js `>= 20`

## Setup

```sh
git clone https://github.com/pedrogbraz/cronus-ui.git
cd cronus-ui
bun install
bun run build        # turbo builds every package + www + pro
bun run www          # showcase dev server → http://localhost:4747
bun run pro          # Cronus Pro origin → http://localhost:4748
```

The monorepo layout: publishable packages live in `packages/*`
(`ui`, `tokens`, `theme`, `stack`, `cli`, `mcp`, `ai-kit`, `create-cronus-app`,
`create-cronus-stack`), the showcase/docs app is `apps/www`, Cronus Pro is
`apps/pro`, and the CLI's component registry is generated into `registry/`.

## Quality gates

CI (`.github/workflows/ci.yml`) runs the full battery on every PR — the same
scripts you can run locally. A PR must be green on all of them:

```sh
bun run build                       # turbo build of all packages + www + pro
bun run lint                        # biome check .
bun run typecheck                   # tsc across the workspaces
bun run test                        # vitest unit tests
bun run registry:check              # CLI registry in sync with packages/ui
bun run tokens:check                # generated token CSS in sync with tokens.ts
bun run props:check                 # docs Props tables in sync with the source
bun run check:example-sections      # docs example sections in sync
BUNDLE_CHECK_STRICT=1 bun run bundle:check   # www bundle-size budgets
```

Browser gates (run against the **built** app, so `bun run build` first):

```sh
bunx playwright install chromium    # once
bun run test:a11y                   # axe-core scans of the core routes
bun run test:contrast               # per-theme color-contrast sweep (all 10 theme×mode combos)
bun run test:e2e                    # behavioral flows
bunx playwright test --project=visual   # screenshot regression (see below)
```

### Per-theme contrast

`e2e/a11y/contrast-themes.spec.ts` is a contrast-only axe sweep that runs over a
curated, representative set of routes across **all 10 theme×mode combos**
(aurora/neutral/midnight/sunset/emerald × light/dark). It exists because the
broad a11y gate (`test:a11y`) only scans the default aurora/dark theme, so light
mode and the other themes would otherwise be ungated for contrast. Run it with
`bun run test:contrast` (after `bun run build`); it fails on any WCAG-AA
`color-contrast` violation with the failing fg/bg colors, ratio, and target.

### Visual regression

`e2e/visual/components.visual.spec.ts` screenshots a curated set of component
galleries (~15 components in aurora/dark, plus a button/card/input smoke across
the other themes and light mode). Baselines are **per-platform** under
`e2e/visual/__screenshots__/<platform>/` because font rasterization differs
across OSes:

- **`darwin/`** (macOS, committed) — after an intentional visual change,
  regenerate and commit the changed PNGs alongside the code:

  ```sh
  bunx turbo build --filter=@cronus-ui/www
  bunx playwright test --project=visual --update-snapshots
  ```

- **`linux/`** (CI) — while this directory is missing, the CI `visual` job runs
  in *bootstrap* mode: it generates baselines, uploads them as the
  `visual-baselines-linux` artifact, and passes with a notice. To arm the gate,
  download that artifact from a green run on `main`, extract it into
  `e2e/visual/__screenshots__/linux/`, and commit. From then on CI compares
  against the committed baselines and fails on any diff (the
  expected/actual/diff images land in the `visual-diff-report` artifact).

The suite runs against the **built** app, disables animations
(`reducedMotion` + an injected freeze stylesheet), and pins `deviceScaleFactor`
to 1 — a retina Mac and CI produce same-density pixels for their own platform.

## Writing or changing a component

Read [`CONTRACT.md`](./CONTRACT.md) first — it is the authoring contract and
CI enforces most of it. The short version:

- **Semantic tokens only.** Never raw Tailwind colors or hex values; use the
  `--cronus-*`-backed utilities (`bg-surface-raised`, `text-fg-secondary`, ...).
- Variants via **CVA**, exported alongside the component.
- **`forwardRef`** on interactive elements, `data-slot="<name>"` on the root.
- Accessibility is non-negotiable: real semantics, the shared focus-ring
  pattern, `aria-*` where relevant.
- Export `XProps` types; no `"use client"` on server-safe leaf components.

A new component also needs:

1. An entry in `apps/www/lib/components-index.ts` (drives the sidebar, the
   overview grid, and static params).
2. Live examples in `apps/www/lib/examples/`.
3. Regenerated artifacts (see below).

## Regenerating artifacts

Generated files are committed; the `*:check` gates fail if they drift.

```sh
bun run -F cronus-ui registry            # rebuild the CLI registry from packages/ui
bun run -F @cronus-ui/tokens tokens:generate   # rebuild token CSS from tokens.ts
bun run -F @cronus-ui/www props          # rebuild the docs Props tables
```

## Commit style

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(ui): add SplitButton
fix(www): correct Combobox example section
docs: clarify theming overrides
chore(ci): bump playwright
```

Common scopes: `ui`, `tokens`, `theme`, `stack`, `cli`, `mcp`, `www`, `ci`.

## Pull requests

- Keep PRs small and focused — one concern per PR.
- Explain **what** changed and **why** in the description.
- Visual changes (components, blocks, showcase pages) need before/after
  screenshots.
- All CI gates above must be green; run the battery locally before pushing.
- New behavior needs tests (vitest for logic, Playwright for flows/a11y where
  it applies).

For bugs and feature ideas, use the issue templates. For security issues,
follow [`.github/SECURITY.md`](./.github/SECURITY.md) — do not open a public
issue.

## License

By contributing you agree that your contributions are licensed under the
repository's [MIT License](./LICENSE).
