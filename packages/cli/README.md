# cronus-ui (CLI)

Add Cronus UI to a project: copy components in, compose an app from validated
blocks, switch theme, and upgrade without losing local edits.

```sh
npx cronus-ui init
npx cronus-ui add button card
npx cronus-ui compose saas --brand Acme
npx cronus-ui add-page --route /faq --blocks faq,cta --nav FAQ
npx cronus-ui theme set aurora --mode dark
npx cronus-ui upgrade --all --dry-run
npx cronus-ui list
npx cronus-ui diff
npx cronus-ui ai
```

The canonical product start is `npx create-cronus-app my-app --template saas`,
which scaffolds and then composes. This CLI is what that path calls, and what
you keep using after.

## Commands & flags

| Command | Args | Flags |
| --- | --- | --- |
| `init` | — | `-c, --cwd <dir>` · `-r, --registry <source>` · `-y, --yes` · `--skip-install` |
| `add` | `[components...]` | `-c, --cwd <dir>` · `-r, --registry <source>` · `-o, --overwrite` · `--skip-install` |
| `compose` | `[template]` | `-c, --cwd <dir>` · `-r, --registry <source>` · `-m, --manifest <file>` · `--pages <list>` · `--variant <pair...>` · `-b, --brand <name>` · `-s, --seed <n>` · `-o, --overwrite` · `--skip-install` · `--dry-run` · `-y, --yes` |
| `add-page` | — | `--route <route>` (required) · `--blocks <list>` (required) · `-c, --cwd <dir>` · `-r, --registry <source>` · `--chrome <group>` · `--title <title>` · `--nav <label>` · `--app <name>` · `-m, --manifest <file>` · `-o, --overwrite` · `--skip-install` · `--dry-run` |
| `list` (`ls`) | — | `-c, --cwd <dir>` · `-r, --registry <source>` |
| `diff` | `[components...]` | `-c, --cwd <dir>` · `-r, --registry <source>` |
| `upgrade` | `[components...]` | `-c, --cwd <dir>` · `-r, --registry <source>` · `-a, --all` · `--dry-run` · `-y, --yes` · `-o, --overwrite` |
| `theme set` | `<name>` | `-m, --mode <mode>` · `-c, --cwd <dir>` |
| `theme add` | `<source>` | `-c, --cwd <dir>` · `--css <file>` · `--dry-run` |
| `ai` | — | `-c, --cwd <dir>` · `-a, --assistants <list>` · `-p, --preset <name>` · `-s, --skills <list>` |

Notes that match the commander surface:

- `compose [template]` — bundled names include `store`, `landing`, `saas`. `--pages` is a comma-separated route subset (e.g. `/,products,login`). `--variant` is repeatable (`login=split`). `--dry-run` prints the validated plan and writes nothing. `-y` picks the first template when none is given.
- `add-page` grows an already-composed app. `--blocks` is comma-separated (`faq,cta` or `login=split`). `--app` is required when the project has more than one composed app.
- `theme set <name>` — `aurora`, `neutral`, `midnight`, `sunset`, `emerald`. `--mode` is `dark` or `light`.
- `theme add <source>` — a Create Studio permalink, a bare `c=` payload, or a path to an exported theme JSON file.
- `upgrade` 3-way merges each installed file against the release recorded in `cronus-ui.json`. `-a, --all` upgrades every recorded component and 3-way-merges composed pages/layouts against `.cronus-ui/base`. `-o, --overwrite` replaces files installed before the manifest existed. Unresolved files get a prompt in `CRONUS-UPGRADE.md`.
- `ai --assistants` is comma-separated `claude`, `cursor`, `copilot`, `windsurf`, `gemini` (or `all` / `none`). `--preset` is `standard` (default), `fintech`, `saas`, `oss`, `agency`, or `none`. `--skills` is comma-separated Claude Code skills (or `all` / `none`).

## How it works

- The registry (`registry/*.json`) is generated from the real `@cronus-ui/ui` sources by
  `packages/cli/scripts/build-registry.ts` — each item carries its source, its npm
  `dependencies`, and its `registryDependencies` (other components it imports),
  derived by parsing imports.
- The default registry is pinned to the CLI package version (`v0.6.15` here), not
  mutable `main`, so a published CLI reads the registry snapshot it was released
  with. Use `-r, --registry ./registry` when testing local registry changes before
  a release tag exists.
- `init` installs only the base copy dependencies used by generated components
  (`clsx`, `tailwind-merge`, `class-variance-authority`, and Radix Slot). It does
  not install the public Cronus token and theme packages unless you add them
  separately for runtime theming.
- `add` resolves the transitive closure of `registryDependencies`, writes the files
  into your project, and **rewrites imports to your aliases**:
  `../lib/cn.js → @/lib/cn`, `./button.js → @/components/ui/button`.
- It then installs the collected npm dependencies with your package manager
  (bun / pnpm / yarn / npm, auto-detected).
- `compose` generates pages that are only imports of installed blocks plus a
  `<main>` that stacks them. Visible UI comes from registry items, not from
  composer-emitted JSX.

## Config (`cronus-ui.json`)

```json
{
  "aliases": {
    "ui": "@/components/ui",
    "lib": "@/lib",
    "blocks": "@/components/blocks"
  },
  "paths": {
    "ui": "components/ui",
    "lib": "lib",
    "blocks": "components/blocks"
  },
  "registry": "https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v0.6.15/registry"
}
```

Point `-r, --registry <path-or-url>` at a local `registry/` directory for offline use
or testing. Regenerate the registry after changing components:
`bun run -F cronus-ui registry`. Verify it is in sync locally with
`bun run -F cronus-ui registry:check`.
