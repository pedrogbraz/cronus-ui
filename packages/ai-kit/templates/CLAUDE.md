# __APP_NAME__ — Claude Code

@AGENTS.md

## Claude Code specifics

The shared operating doctrine is imported above from `AGENTS.md` and applies to
every session. This file adds only what is specific to Claude Code.

- **Plan before risky changes.** Use plan mode for anything that touches shared
  contracts, data, migrations, auth, build/release config, or work classified
  P0/P1. Present the plan, get agreement, then execute. Don't plan trivial edits.
- **Prefer the project skills and subagents.** Reusable workflows live in
  `.claude/skills/` and subagents in `.claude/agents/`. Reach for them before
  improvising. For a pre-merge review, run the `code-review` skill for an inline
  review in the current session, or delegate to the `code-reviewer` subagent for
  a review in a fresh, isolated context — both apply the Code-Review and QA
  rubrics from `AGENTS.md`.
- **Keep commits AI-attribution-free.** No assistant or tool attribution in
  commit messages, PR descriptions, or code comments. Follow the git and PR
  rules in `AGENTS.md`.
- **Read before you write.** Open the file and map the blast radius before
  editing. Never edit a file you have not read in the current session.
- **Leave no debug residue.** Strip scratch logging and instrumentation from the
  final diff.
- **Report evidence honestly.** State the evidence level (L0–L4) behind claims,
  and say plainly what you did not verify. Don't call something "done" without
  the objective evidence the QA rubric requires.

## Kronus UI product loop

If this project uses Kronus UI (`kronus-ui.json`, or compose / ui-add / theme skills
under `.claude/skills/`), follow this loop — do not hand-roll screens or reach
for another component kit:

- New app: `npx create-kronus-app <name> --template saas`. Never omit `--template`
  (CLI default is an empty starter). Other composed templates: `store`, `landing`.
- New route: `npx kronus-ui add-page` or MCP `add_page`. Pages are installed
  blocks stacked in `<main>` — do not hand-write a page of Cards.
- One primitive: `npx kronus-ui add <slug>` (MCP `install_component`). Prefer the
  `compose`, `ui-add`, and `theme` skills when they exist.
- Theme: `npx kronus-ui theme set` / `useTheme`. Never `bg-zinc-*` or palette
  utilities.
- Upgrade: `npx kronus-ui upgrade --all --dry-run`, then `--all`. Refreshes
  installed items and composed pages. MCP `upgrade_components`.
- Never run shadcn init or write a shadcn `components.json`.

## Tools

- If `.mcp.json` registers the `kronus-ui` MCP server, use it to look up component
  and block metadata instead of guessing (`add_page`, `install_component`,
  `set_theme`, `upgrade_components`).
