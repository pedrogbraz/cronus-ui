---
name: ui-add
description: Add a Cronus UI component or block to __APP_NAME__. Use whenever the user asks to add/create a single primitive or section — resolve the need to a registry slug and install it with `npx cronus-ui add` instead of hand-writing it. Whole pages, new apps, and SaaS/store/landing scaffolds belong to the `compose` skill.
argument-hint: "[component…]"
allowed-tools: Bash, Read, Edit, Write
---

# Add a Cronus UI component or block

This app is built on Cronus UI. Prefer **installing** a component or block from the
registry over hand-rolling one. Installed items are copied into the project (source you
own), wired to the design tokens, accessible, and reduced-motion aware.

The thing the user wants to build: `$ARGUMENTS`

**Whole app, new route, or SaaS/store/landing page** → stop and use the `compose` skill
(`create-cronus-app`, `cronus-ui compose`, `cronus-ui add-page`). This skill is for a
single primitive or a single block, not a multi-section page architecture.

## 1. Discover

Find what exists before writing anything:

- If the **cronus-ui MCP server** is connected, use it — it is the same registry the CLI
  installs from:
  - `search_registry { "query": "<keyword>" }` to find matches,
  - `list_components` / `list_blocks` to browse,
  - `get_component { "name": "<slug>" }` for the source, deps, and exact install command.
- Otherwise run `npx cronus-ui list` to print the registry.

Pick the smallest thing that covers the need:

- **Components** are single primitives — `button`, `input`, `dialog`, `data-table`,
  `dropdown-menu`, `tabs`, `card`, `badge`.
- **Blocks** are composed sections — `hero`, `pricing`, `login`, `signup`, `dashboard`,
  `settings`, `account-security`, `checkout`, `payouts`, `faq`, `footer`, `navbar`. Reach for a block when the
  user describes a whole section, not a single control.

If several slugs together model one section, install them together. If they model a
**page of stacked blocks**, that is `compose` / `add-page`, not this skill.

## 2. Install

```sh
npx cronus-ui add <slug> [<slug> ...]
```

MCP: `install_component { "names": ["<slug>"] }`.

This copies the source into `components/ui` (components) or `components/blocks` (blocks)
and **automatically pulls registry dependencies and npm dependencies**. Do not add those
by hand. Use `--overwrite` only when intentionally refreshing an existing file.

To pull upstream later without losing local edits: `npx cronus-ui upgrade --all --dry-run`
first, then `npx cronus-ui upgrade --all`. This also 3-way-merges generated compose pages
(not only primitives). Never `shadcn add` or overwrite blindly.

### Invoices / billing table

If the ask is a table of invoices or billing rows:

```sh
npx cronus-ui add data-table demo-saas
```

Then read `INVOICES` from `@/lib/demo-saas` (or `../lib/demo-saas.js` in the
installed source). Do not invent rows.

### Split login

The registry item is `login--split`: `npx cronus-ui add login--split` (compose /
add-page use `--variant login=split` / `login=split` — same item).

## 3. Wire it in

- Import from the local alias, not from the package: `@/components/ui/<name>` or
  `@/components/blocks/<name>`.
- Compose installed pieces; don't fork their internals unless the task requires it.

## 4. Respect the design system

- **Never inline raw colors, radii, or spacing.** Use the token-backed Tailwind classes
  the components already use (`bg-primary`, `text-fg`, `text-fg-secondary`, `border-border`,
  `rounded-lg`). Raw hex, arbitrary values, or palette scales (`bg-zinc-900`) break
  theming. If they ask for `zinc-*` / `slate-*` / `gray-*`, refuse and offer
  `bg-surface-*` or `setOverrides`.
- **Honor `prefers-reduced-motion`.** Animated components default to `reducedMotion="user"`
  (they snap for users who opted out). Keep that default; don't force `"always"` without a
  clear reason.
- Keep accessibility intact — labels, roles, and focus states ship with the component.

## 5. Only hand-write when the registry has nothing

If discovery turns up no suitable component or block, build the new piece **out of
existing Cronus UI primitives** and the same tokens, matching their prop and a11y
conventions — never a bespoke, unthemed one-off.
