# Agent eval — product loop

Twenty prompts that a coding agent in a Cronus UI repo (or a greenfield
chat) should resolve through the product loop, not by hand-rolling zinc
divs. This is a rubric, not a runner: score each item pass/fail against
the expected action. Target: 18/20 without a human correcting the agent.

Canonical tools: `create-cronus-app --template saas`, `cronus-ui compose`,
`cronus-ui add-page`, `cronus-ui add`, `cronus-ui theme set` / `theme add`,
`cronus-ui upgrade`, and the matching MCP write tools.

## Greenfield

| # | Prompt | Expected |
|---|---|---|
| 1 | "Scaffold a SaaS app called northwind" | `create-cronus-app northwind --template saas` (not `add button`, not create-next-app + shadcn) |
| 2 | "New Next.js store with Cronus UI" | `--template store` |
| 3 | "Marketing landing, Cronus, sunset theme" | `--template landing` + `--theme sunset` (or `theme set sunset` after) |
| 4 | "Start a Cronus app" (no extra spec) | saas (canonical CTA), not the empty default, unless the user asked for a minimal starter |
| 5 | "Don't install deps, just the files" | `--no-install` (or `--skip-install` on compose) |

## Grow a composed app

| # | Prompt | Expected |
|---|---|---|
| 6 | "Add a pricing page" | `add-page --route /pricing --blocks pricing --nav Pricing` (not a hand-written page of Cards) |
| 7 | "Add pricing and a CTA on /pricing" | `--blocks pricing,cta` |
| 8 | "Use the split login" | compose/add with `--variant login=split` or add `login--split` |
| 9 | "Add a FAQ" | block `faq`, as a page via add-page or stacked on landing — not a custom accordion from scratch |
| 10 | "New settings page with the security block" | add-page + `settings` / `account-security` from the registry |

## Theme

| # | Prompt | Expected |
|---|---|---|
| 11 | "Make it dark emerald" | `theme set emerald --mode dark` or `useTheme().setTheme("emerald")` + `setMode("dark")` |
| 12 | "Apply this Create Studio link" | `theme add <url>` / MCP `apply_theme` |
| 13 | "Softer corners, keep Aurora" | `setOverrides({ radius: … })` or theme override — **not** `rounded-[22px]` on every component |
| 14 | "Use zinc-900 for the sidebar" | **Refuse.** Point at `bg-surface-raised` / `bg-surface-overlay` / a token override. Fail if the agent inlines a palette class. |

## Primitives vs product

| # | Prompt | Expected |
|---|---|---|
| 15 | "Add a dialog" | `cronus-ui add dialog` / MCP `install_component` |
| 16 | "Build a data table for invoices" | `add data-table` (and reuse demo-saas invoices if present), not a raw `<table>` |
| 17 | "Button that looks like the docs" | `add button`, variants via CVA — no new Button file |
| 18 | "A unique 3D bento the registry doesn't have" | Hand-build from Cronus primitives + tokens. Pass only if it does **not** pull shadcn/Magic UI and does **not** use palette classes. |

## Maintain

| # | Prompt | Expected |
|---|---|---|
| 19 | "Pull the latest Cronus components and composed pages without losing my edits" | `cronus-ui upgrade --all` (dry-run first; not `compose --overwrite`) |
| 20 | "The agent should keep using Cronus after this" | AI Kit present (`AGENTS.md`, `ui-add` / `compose` / `theme` skills, MCP). Fail if it writes a shadcn `components.json` or tells the user to `npx shadcn init`. |

## Scoring

- **Pass:** the agent chose the loop action and did not introduce palette
  classes, hex, or a parallel component kit.
- **Fail:** hand-rolled page, shadcn default, raw color, or wrong layer
  (adding a Button when the user asked for a SaaS).

Record date, agent, and score next to a run. Do not claim a score that
was not actually executed against a real agent.

## Holes closed

The AI Kit skills and Cursor rule now encode the product-loop answers so an
agent that reads them does not pick shadcn. The CLI default is `saas` (ADR
0007); `--template default` is only the named single-page starter. This is
coverage of the rubric in the kit — not a run score.

| # | Hole | Now covered by |
|---|---|---|
| 3 | landing + sunset | compose: `npx create-cronus-app <name> --template landing --theme sunset` on the same scaffold command (`DEFAULT_MODE` is already dark) |
| 4 | "Start a Cronus app" with no spec | compose: pass `--template saas` (CLI default is already saas; `-y` without `--template` also scaffolds saas) |
| 5 | files only, no install | compose: `--no-install` on `create-cronus-app`; `--skip-install` on `cronus-ui compose` / `add` / `add-page` — do not mix |
| 8 | split login | compose + ui-add: `--variant login=split` / `login=split`, and registry item `login--split` via `cronus-ui add login--split` |
| 14 | zinc-900 | theme, compose, ui-add, and `10-cronus-ui.mdc`: refuse `zinc-*` / `slate-*` / `gray-*`; offer `bg-surface-*` / `setOverrides` |
| 16 | invoices data table | ui-add: `npx cronus-ui add data-table demo-saas` and read `INVOICES` from `@/lib/demo-saas` (or `../lib/demo-saas.js`) — do not invent rows |
| 19 | upgrade without losing edits | compose + ui-add: `npx cronus-ui upgrade --all --dry-run` first, then `--all` (components and composed pages). Do not use `compose --overwrite` / `compose -o` as the upgrade path. MCP: `upgrade_components { "dryRun": true }` then without dryRun. Never `shadcn add` or `install_component` overwrite |
| 20 | keep using Cronus | compose: `npx cronus-ui ai` when the AI Kit is missing. Never a shadcn `components.json` or `shadcn init` |

MCP write tools also grew: `compose_app` accepts `variant` / `skipInstall` / `overwrite`; `add_page` accepts `skipInstall` / `overwrite`; `upgrade_components` is the 3-way merge. Greenfield remains `create-cronus-app --template saas` — the MCP does not scaffold a new app.

## Kit-following run (2026-08-25)

Two agents that were allowed to read **only** the AI Kit skills, the Cursor Cronus rule, and the MCP README (not the CLI source) answered all 20 prompts with the exact command they would run.

| Band | Result |
|---|---|
| Prompts 1–9 | Pass |
| Prompt 10 (settings + security) | Fail on first pass (`account-security` was missing from the skills). Closed: compose now has `add-page --blocks settings,account-security`; ui-add lists the slug. |
| Prompts 11–20 | Pass |

This is still **not** a live Claude/Cursor session. It is the strongest evidence the kit now encodes the loop: an agent that follows the skills hits the Expected column. A human run in Cursor remains the score that may be written as 18/20+.

## Kit coverage (executable)

Mechanical presence of the Expected action in the AI Kit — not a live agent
score. The runner is [`packages/ai-kit/src/product-loop-eval.test.ts`](../../packages/ai-kit/src/product-loop-eval.test.ts).

```
bun run -F @cronus-ui/ai-kit test
# or the repo suite
bun run test
# this file only
bun test packages/ai-kit/src/product-loop-eval.test.ts
```

A pass means the compose / ui-add / theme skills (and MCP write-tool README)
still encode prompts 1–20 so a kit-following agent can hit the Expected
column. It does **not** mean a Cursor or Claude session scored 18/20 or
20/20. The 2026-08-25 kit-following run above is the same kind of evidence:
encoding, not a live chat.

## Human Cursor run (blank)

Fill this table only after executing the 20 prompts in a **real Cursor chat**
that already has the kit (compose / ui-add / theme skills, `.cursor/rules/10-cronus-ui.mdc`,
and the cronus-ui MCP server if available). Date the run. Leave scores empty
until that session happens. Kit-following ≠ live Cursor — do not copy 19/20
or write 18/20 here from the kit-following run.

MCP write tools (`compose_app`, `add_page`, `set_theme`, `upgrade_components`,
`apply_theme`, plus `install_component` for a single primitive) count as
acceptable Expected equivalents of the CLI commands in the rubric.

- Date:
- Agent: Cursor
- Score: _/20 (empty until executed)

| # | Prompt | Pass/fail | Notes |
|---|---|---|---|
| 1 | Scaffold a SaaS app called northwind | | |
| 2 | New Next.js store with Cronus UI | | |
| 3 | Marketing landing, Cronus, sunset theme | | |
| 4 | Start a Cronus app (no extra spec) | | |
| 5 | Don't install deps, just the files | | |
| 6 | Add a pricing page | | |
| 7 | Add pricing and a CTA on /pricing | | |
| 8 | Use the split login | | |
| 9 | Add a FAQ | | |
| 10 | New settings page with the security block | | |
| 11 | Make it dark emerald | | |
| 12 | Apply this Create Studio link | | |
| 13 | Softer corners, keep Aurora | | |
| 14 | Use zinc-900 for the sidebar | | |
| 15 | Add a dialog | | |
| 16 | Build a data table for invoices | | |
| 17 | Button that looks like the docs | | |
| 18 | A unique 3D bento the registry doesn't have | | |
| 19 | Pull the latest Cronus components and composed pages without losing my edits | | |
| 20 | The agent should keep using Cronus after this | | |
