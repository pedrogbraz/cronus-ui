---
name: upgrade
description: Pull upstream Cronus UI components and composed pages into __APP_NAME__ without losing local edits. Use when the user wants to update, refresh, or sync installed Cronus items — not when they want a new app, page, or theme.
argument-hint: "[--all|component…]"
allowed-tools: Bash, Read, Edit, Write
---

# Upgrade Cronus UI without losing local edits

Installed Cronus files are source you own. Pulling a newer registry is a **3-way
merge** of base + local + upstream — local edits survive. This is the maintain
step of the product loop (compose → add-page → theme → upgrade).

Request: `$ARGUMENTS`

Requires `cronus-ui.json`. New apps, new routes, and palette/look changes belong
to `compose` / `add-page` / `theme`.

## Protocol

Inspect, dry-run, then write. Always in that order:

```sh
npx cronus-ui diff
npx cronus-ui upgrade --all --dry-run
npx cronus-ui upgrade --all
```

- `diff` reports which installed files drifted from the current registry. Writes
  nothing.
- `--dry-run` prints the per-file plan (`fast-forward` / `merge` / `conflict`)
  and writes nothing.
- `--all` upgrades every recorded component **and** 3-way-merges composed
  pages/layouts against `.cronus-ui/base`. Named `upgrade button` upgrades that
  component only — it does **not** touch composed pages.

If the cronus-ui MCP server is connected, prefer its write tool over shelling
out. Dry-run first:

```
upgrade_components { "dryRun": true }
```

then `upgrade_components` without `dryRun` (defaults to `--all` when `names` is
omitted). Named `upgrade_components { "names": ["button"] }` does not upgrade
composed pages.

When the app was composed with `--manifest`, re-supply it:

```sh
npx cronus-ui upgrade --all --dry-run --manifest path/to.json
npx cronus-ui upgrade --all --manifest path/to.json
```

MCP: `upgrade_components { "dryRun": true, "manifest": "path/to.json" }`.

## How the merge works

Each file is merged as base (the release recorded in `cronus-ui.json` /
`.cronus-ui/base/<template>/`) + local (the file on disk) + upstream (the
current registry) via `git merge-file --diff3`. Clean merges are written.
Conflicts are never silently clobbered.

- Markers are the `git merge-file --diff3` form (`LOCAL (your edits)`,
  `BASE (…)`, `UPSTREAM (…)`).
- Unresolved files get a ready-to-paste agent prompt in `CRONUS-UPGRADE.md`.
  Read that file, resolve markers, keep local intent and upstream fixes, then
  delete the report.

`-y` / `--yes` writes conflict markers without asking. Do not pass it unless
the user wants markers on disk.

## Real flags (do not invent others)

- `-a, --all` — every recorded component **and** composed pages/layouts.
- `--dry-run` — print the plan, write nothing.
- `-y, --yes` — write conflict markers / confirmed overwrites without asking.
- `-o, --overwrite` — only for files installed before the manifest existed
  (legacy 2-way replace). Not how you pull template updates.
- `-m, --manifest <file>` — required when the app was composed with `--manifest`.
- `-r, --registry <source>` · `-c, --cwd <dir>`.

```sh
npx cronus-ui upgrade button
npx cronus-ui upgrade button card
npx cronus-ui upgrade --all --yes
```

The named forms do **not** refresh composed pages. Use `--all` when the user
wants components **and** pages.

## Never

- Do **not** run `compose --overwrite` / `compose -o` to "upgrade". That
  replaces generated pages and wipes local edits. `--overwrite` on compose is
  only for a fresh re-compose the user asked to replace.
- Do **not** run `shadcn add` or `shadcn init`. Never write a shadcn
  `components.json`.
- Do **not** use `cronus-ui add --overwrite` / MCP `install_component` with
  `overwrite` to pull upstream — that is a 2-way replace. Prefer this skill.
