---
name: compose
description: Scaffold or grow a Cronus UI product (create-cronus-app templates, cronus-ui compose, add-page). Use when the user wants a new app, a new page, a SaaS/store/landing, or to assemble blocks into routes — not when they only want a single primitive.
argument-hint: "[saas|store|landing|/route]"
allowed-tools: Bash, Read, Edit, Write
---

# Scaffold or grow a Cronus UI product

Cronus UI is a **product UI system**. Prefer assembling a validated app (templates →
pages of installed blocks) over hand-rolling screens or calling `cronus-ui add` for
every primitive. One control (button, dialog) is a different skill — defer to `ui-add`.

Request: `$ARGUMENTS`

## Product loop (preference order)

1. **New app** — scaffold a template.
2. **Grow** — add a page of installed blocks to an already-composed app.
3. **Theme** — `theme` skill / `npx cronus-ui theme set` / MCP `set_theme` (Create Studio → `apply_theme`).
4. **One piece** — `npx cronus-ui add <slug>` / MCP `install_component` (the `ui-add` skill).
5. **Hand-roll** only if the registry has no matching component or block — then with semantic tokens.
6. **Never** inline a Tailwind palette class (`bg-zinc-900`) or a raw hex.
7. **Upgrade / maintain** — use the `upgrade` skill. `npx cronus-ui upgrade --all --dry-run`
   first, then `npx cronus-ui upgrade --all`. Do NOT run `compose --overwrite` / `compose -o`
   to "upgrade" an existing app.

If the cronus-ui MCP server is connected, prefer its write tools (`compose_app`,
`add_page`, `set_theme`, `upgrade_components`) over shelling out. They spawn the same pinned CLI.

## 1. New app

Default marketing / product CTA is **`saas`**. The CLI default is `saas`. If the
user does **not** name a template, pass `--template saas` anyway so the command
is explicit. `--yes` / `-y` without `--template` also scaffolds saas. Use
`--template default` only when the user asked for a single-page starter.

Other composed templates: `store`, `landing`. Bundled (non-composed) starters:
`default`, `dashboard`, `marketing` — only when the user explicitly asks for a
minimal starter or those names.

```sh
npx create-cronus-app <name> --template saas
npx create-cronus-app <name> --template saas -y
npx create-cronus-app <name> --template store
npx create-cronus-app <name> --template landing --theme sunset
npx create-cronus-app <name> --template saas --no-install
```

Theme and mode belong on the **same** scaffold command (`DEFAULT_MODE` is already
`dark`; pass `--mode dark` only to be explicit):

```sh
npx create-cronus-app <name> --template landing --theme sunset
npx create-cronus-app <name> --template landing --theme sunset --mode dark
```

`--no-install` is a **create-cronus-app** flag (files only, skip `pm install`).
`cronus-ui compose` / `add` / `add-page` use `--skip-install`, not `--no-install`.
Do not mix them.

This scaffolds the project **and** composes the template (pages + chrome from registry
blocks). Do not recreate that tree by hand.

## 2. Existing inited project (`cronus-ui.json` already there)

```sh
npx cronus-ui compose saas
npx cronus-ui compose store --brand Acme -y
npx cronus-ui compose landing --variant login=split --dry-run
```

Real flags (do not invent others):

- `-y` / `--yes` — non-interactive (pick saas if none is given).
  **Always pass `-y` as an agent.** This is `cronus-ui compose`, not
  `create-cronus-app` — on scaffold, `-y` already defaults to saas; still pass
  `--template saas` as the canonical command.
- `-b, --brand <name>` — brand wordmark baked into chrome/hero.
- `--variant <slug>=<id>` — repeatable, e.g. `--variant login=split`.
- `--pages <list>` — comma-separated route subset, e.g. `--pages /,pricing`.
- `--skip-install` — do not install npm dependencies. Not `--no-install`.
- `--dry-run` — print the validated plan + per-file preview, write nothing.
- `-o, --overwrite` — replace existing generated files. Only for a fresh
  re-compose the user asked to replace — not how you pull template updates
  (use `upgrade --all`).
- `-r, --registry <source>` — registry URL or local directory.
- `-m, --manifest <file>` — compose from an explicit manifest instead of a bundled template.

MCP: `compose_app { "template": "saas", "brand": "Acme", "dryRun": false }`.

## 3. Grow by one page

```sh
npx cronus-ui add-page --route /pricing --blocks pricing,cta --nav Pricing
npx cronus-ui add-page --route /faq --blocks faq,cta --title FAQ --chrome site --dry-run
npx cronus-ui add-page --route /login --blocks login=split --nav Login
npx cronus-ui add-page --route /settings --blocks settings,account-security --nav Settings
```

The registry item is also `login--split`: `npx cronus-ui add login--split`.

Real flags:

- `--route <route>` — required, starts with `/` (e.g. `/faq`).
- `--blocks <list>` — required, comma-separated slugs, or `slug=variant` (`login=split`).
- `--nav <label>` — add the page to the chrome nav.
- `--title <title>` — page `<title>` (default: title-cased route).
- `--chrome <group>` — chrome group (default: the app's first group).
- `--app <name>` — which composed app to extend (required if the project has more than one).
- `--dry-run` / `--skip-install` / `-o, --overwrite` / `-r, --registry` / `-m, --manifest`.

MCP: `add_page { "route": "/pricing", "blocks": "pricing,cta", "nav": "Pricing" }`.
When the app was composed with `--manifest`, include `"manifest": "path/to.json"`.

Requires an already-composed app. If there isn't one, compose (or scaffold) first.

## Golden rule

Generated pages are **only** imports of installed blocks plus a `<main>` that stacks
them. Do **not** invent a new page architecture, extra layout chrome, or hand-written
sections beside the blocks. Every visible pixel comes from a registry item.

After compose / add-page, switch palette via the `theme` skill (`theme set`, not a look):

```sh
npx cronus-ui theme set sunset --mode dark
```

## Keep using Cronus (AI Kit)

If the project does not yet have the AI Kit (`AGENTS.md`, compose / ui-add /
theme / upgrade skills, MCP):

```sh
npx cronus-ui ai
```

Never write a shadcn `components.json` or run `shadcn init`.

## 4. One control → `ui-add`

If they asked for a single primitive or block (`button`, `dialog`, `data-table`, a
lone `hero`), stop and use the `ui-add` skill (`npx cronus-ui add <slug>` / MCP
`install_component`). Do not compose a whole app for a widget.

## 5. Tokens, if you must hand-roll

`bg-primary`, `text-fg`, `text-fg-secondary`, `border-border`, `rounded-lg`. Never
palette scales or hex. If they ask for `zinc-*` / `slate-*` / `gray-*`, refuse
and offer `bg-surface-*` or `setOverrides`.
