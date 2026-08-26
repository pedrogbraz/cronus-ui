# create-cronus-app

Scaffold a production-ready **Next.js + Cronus UI** app in one command.

```sh
npx create-cronus-app my-app --template saas
```

That is the gold path: a composed multi-page SaaS product — split login/signup,
sidebar-shell dashboard, analytics, team, billing, and settings — built from
validated registry blocks (the generator's golden rule: pages only import and
stack installed blocks).

You get Next.js 16 (App Router) + React 19 + Tailwind v4 with
[`@cronus-ui/ui`](https://www.npmjs.com/package/@cronus-ui/ui), `@cronus-ui/tokens`,
and `@cronus-ui/theme` already wired — themeable, accessible components and an
anti-flash theme script.

The CLI default remains `--template default` (a single-page starter). Pass
`--template saas` when you want the full product.

## Usage

```sh
create-cronus-app [project-name] [options]
```

If you omit the project name, you are prompted (default: `my-cronus-app`).
Interactive runs also prompt for template, theme, mode, and the AI Kit.

### Options

| Flag | Description |
| --- | --- |
| `--template <name>` | Starter template. CLI default: `default`. Bundled: `default`, `dashboard`, `marketing`. Composed: `store`, `landing`, `saas`, plus `landing-*` flavors (studio, ops, secure, care, shop, docs, premium, agents, coverage, broadcast, agency, glass). |
| `--theme <aurora\|neutral\|midnight\|sunset\|emerald>` | Theme preset to bake in (default: `aurora`). |
| `--mode <dark\|light>` | Default color mode (default: `dark`). |
| `--ai` / `--no-ai` | Include or skip the AI Kit (skills, rules & doctrine). |
| `--assistants <claude,cursor,copilot,windsurf,gemini\|all\|none>` | Assistants to configure (default: all). Codex CLI and Zed read the root `AGENTS.md` natively. |
| `--preset <standard\|fintech\|saas\|oss\|agency\|none>` | Engineering doctrine to ship (default: `standard`). |
| `--skills <ui-add,theme,compose,code-review,ship-pr,evidence-check\|all\|none>` | Claude Code skills to include (default: all). |
| `--pm <bun\|npm\|pnpm\|yarn>` | Package manager to install with (auto-detected otherwise). |
| `--no-install` | Skip installing dependencies. |
| `-y`, `--yes` | Accept defaults; skip interactive prompts. |
| `-h`, `--help` | Show help. |
| `-v`, `--version` | Show the version. |

There are no other flags.

### Templates

`default`, `dashboard`, and `marketing` copy a bundled directory.

`store`, `landing`, `saas`, the `landing-*` flavors, and the Pro pack
(`mail`, `chat`, `finance`) have **no** bundled template dir. They scaffold
the `default` base, then compose pages + chrome from validated registry
blocks (the same engine as `npx cronus-ui compose <template>`). OSS keeps
saas/store/landing; the Pro pack is additive.

| Template | What you get |
| --- | --- |
| `default` | Single-page starter — metrics, table & cards. The CLI default (`--yes` without `--template` lands here). |
| `dashboard` | Bundled multi-page app — sidebar shell, KPIs, chart, data table, settings. |
| `marketing` | Bundled landing site — hero, features, pricing, testimonials, FAQ, waitlist. |
| `store` | Composed storefront — 9 navigable pages, real nav, from validated blocks. |
| `landing` | Composed marketing page — hero, features, pricing, testimonials, FAQ, CTA. |
| `saas` | Composed SaaS product — split auth + sidebar-shell dashboard, analytics, team, billing, settings. **Recommended for a full product.** |
| `landing-studio` | Dark AI studio — atmosphere hero, marquee, bento, stats, pricing. Midnight dark. |
| `landing-ops` | Workflow product — split hero, logos, features, integrations. |
| `landing-secure` | Infra/security — compact hero, metrics, usage pricing, split FAQ. Midnight dark. |
| `landing-care` | Healthcare conversion — waitlist hero, bento, proof. Emerald light. |
| `landing-shop` | Storefront — compact hero + editorial product showcase. Sunset light. |
| `landing-docs` | Developer tool — compact hero, logos, features, integrations. |
| `landing-premium` | Full SaaS marketing — split hero, toggle pricing, FAQ. Aurora light. |
| `landing-agents` | Automation — split hero, marquee, bento, stats. Emerald light. |
| `landing-coverage` | Services — hero, stats, testimonial grid, FAQ. Sunset light. |
| `landing-broadcast` | Studio/show — atmosphere hero, marquee, features, pricing. |
| `landing-agency` | Agency — split hero, about, services, stats. Midnight dark. |
| `landing-glass` | Glass dark — atmosphere hero, bento, split FAQ, split CTA. |
| `mail` | **Pro.** Inbox — notification panel, activity feed, compose, preferences. Midnight dark. |
| `chat` | **Pro.** Assistant — chat thread, prompt box, replies, settings. Aurora dark. |
| `finance` | **Pro.** Money — payouts, invoices, billing, analytics. Emerald light. |

### AI Kit

`--ai` writes the kit; `--no-ai` skips it. If you pass neither, an interactive
run prompts (default **yes**). `--yes` accepts that default, so
`npx create-cronus-app my-app -y` **does** include the kit — pass `--no-ai` to
skip it. `--assistants`, `--preset`, and `--skills` only take effect when the
kit is written.

### Examples

```sh
# Gold path — composed SaaS product.
npx create-cronus-app my-app --template saas

# Same, non-interactive, skip the AI Kit, install with pnpm.
npx create-cronus-app my-app --template saas --no-ai --pm pnpm --yes

# Bundled dashboard starter.
npx create-cronus-app my-app --template dashboard

# Theme + mode (any template).
npx create-cronus-app my-app --template saas --theme aurora --mode dark

# AI Kit for a subset of assistants.
npx create-cronus-app my-app --template saas --ai --assistants claude,cursor --preset fintech

# Files only; install later yourself.
npx create-cronus-app my-app --template saas --no-install
```

## What you get

A `--template saas` app (after compose) looks like:

```
my-app/
├─ app/
│  ├─ globals.css           # Tailwind v4 + Cronus tokens + the @source opt-in
│  ├─ layout.tsx            # <CronusUIProvider> + anti-flash <CronusThemeScript>
│  ├─ (bare)/login          # split-variant sign-in
│  ├─ (bare)/signup
│  └─ (shell)/              # dashboard (/), analytics, team, billing, settings
├─ components/blocks/       # installed registry blocks; pages only stack them
├─ cronus-ui.json            # so `npx cronus-ui add` / add-page / compose work here
├─ next.config.mjs
├─ postcss.config.mjs
├─ tsconfig.json
└─ package.json
```

`default` is the single-page starter (`app/page.tsx` only). `store` and
`landing` compose the same way as `saas`, with their own routes and chrome.

After scaffolding:

```sh
cd my-app
npm install   # if you used --no-install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to grow

Composed apps (`saas` / `store` / `landing`) grow with `add-page`, not by
hand-wiring routes. Switch theme or preview upgrades at any time:

```sh
npx cronus-ui add-page --route /pricing --blocks pricing,cta --nav Pricing
npx cronus-ui theme set aurora --mode dark
npx cronus-ui upgrade --all --dry-run
```

Every app still has a `cronus-ui.json`, so individual components work too:

```sh
npx cronus-ui add dialog table tabs
```

Started from `default`, `dashboard`, or `marketing` and want a multi-page
product? Compose one onto the project:

```sh
npx cronus-ui compose saas
```

## License

MIT
