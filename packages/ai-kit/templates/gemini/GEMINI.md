# __APP_NAME__ — Gemini CLI

@AGENTS.md

## Gemini specifics

The shared operating doctrine is imported above from `AGENTS.md` and applies to
every session. This file adds only what is specific to Gemini CLI.

- Follow the doctrine in `AGENTS.md`. It is the single source of truth for how
  work gets done here; when this file and `AGENTS.md` disagree, `AGENTS.md` wins.
- Prefer the project's existing conventions and patterns over your own defaults.
  Read the surrounding code before adding anything new.
- Report evidence honestly. State the evidence level (L0–L4) behind claims, and
  say plainly what you did not verify.
- Keep commits free of AI attribution — none in commit messages, PR bodies, or
  code comments.

## Kronus UI product loop

When this project uses Kronus UI (`kronus-ui.json`, `KICKOFF.md` / `stack.json`):

- New app: `npx create-kronus-app <name> --template saas`. Never omit `--template`
  (CLI default is an empty starter). Other composed templates: `store`, `landing`.
- New route: `npx kronus-ui add-page` or MCP `add_page`. Pages are installed
  blocks stacked in `<main>` — do not hand-write a page of Cards.
- One primitive: `npx kronus-ui add <slug>` (MCP `install_component`).
- Theme: `npx kronus-ui theme set` / `useTheme`. Never `bg-zinc-*` or palette
  utilities.
- Upgrade: `npx kronus-ui upgrade --all --dry-run`, then `--all`. Refreshes
  installed items and composed pages. MCP `upgrade_components`.
- Never run shadcn init or write a shadcn `components.json`.
