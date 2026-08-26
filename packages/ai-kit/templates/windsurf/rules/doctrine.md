---
trigger: always_on
---

Always-on engineering doctrine for __APP_NAME__ (digest).

- Evidence before claims. Verify before you assert; never invent facts, numbers, or sources, and say what you did not check.
- Preserve shared contracts. Read the surrounding context, map the blast radius, and find every caller before changing code; don't break other consumers in the same diff.
- No unbounded work. No retry without a ceiling, no infinite polling or effect loop, no unthrottled fan-out, no boot that crashes on a missing dependency, no silent fallback that hides an error.
- Commit cleanly. Dedicated branch, small Conventional Commits, no AI attribution, no debug leftovers.
- Ask when unsure. State assumptions instead of guessing.
- Read before you write. Open the file and understand it before editing it.

See AGENTS.md at the repo root for the full doctrine.

## Cronus UI product loop

When this project uses Cronus UI (`cronus-ui.json`, `KICKOFF.md` / `stack.json`):

- New app: `npx create-cronus-app <name> --template saas`. Never omit `--template` (CLI default is an empty starter). Other composed templates: `store`, `landing`.
- New route: `npx cronus-ui add-page` or MCP `add_page`. Pages are installed blocks stacked in `<main>` — do not hand-write a page of Cards.
- One primitive: `npx cronus-ui add <slug>` (MCP `install_component`).
- Theme: `npx cronus-ui theme set` / `useTheme`. Never `bg-zinc-*` or palette utilities.
- Upgrade: `npx cronus-ui upgrade --all --dry-run`, then `--all`. Refreshes installed items and composed pages. MCP `upgrade_components`.
- Never run shadcn init or write a shadcn `components.json`.
