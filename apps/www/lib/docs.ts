export type DocNavItem = {
  label: string;
  href: string;
  description: string;
  status?: "new" | "beta";
  indicator?: boolean;
};

export type PackageManagerId = "pnpm" | "npm" | "yarn" | "bun";

export type PackageManagerCommand = {
  id: PackageManagerId;
  label: string;
  init: string;
  add: string;
  create: string;
  compose: string;
  addPage: string;
  upgrade: string;
};

export const DOC_NAV_SECTIONS: { heading: string; items: DocNavItem[] }[] = [
  {
    heading: "Sections",
    items: [
      {
        label: "Introduction",
        href: "/docs",
        description:
          "Product UI system: compose a themed SaaS from validated blocks, dual distribution, live theme.",
      },
      {
        label: "Getting started",
        href: "/docs/getting-started",
        description:
          "Zero to a composed SaaS: scaffold, provider, theme, add-page, upgrade, or init into an existing app.",
      },
      {
        label: "Compare",
        href: "/docs/compare",
        description:
          "Cronus UI next to shadcn/ui, HeroUI, and Aceternity — distribution, theming, compose, and a11y gates.",
        status: "new",
      },
      {
        label: "Components",
        href: "/components",
        description: "Browse the production component catalog.",
      },
      {
        label: "Blocks",
        href: "/docs/blocks",
        description: "Copy-paste composed sections, the families, and the add flow.",
      },
      {
        label: "Installation",
        href: "/docs/installation",
        description: "Scaffold a SaaS, use Create, the CLI, or an existing app.",
      },
      {
        label: "Theming",
        href: "/docs/theming",
        description: "Tokens, presets, runtime overrides, and dark mode.",
      },
      {
        label: "Design",
        href: "/docs/design",
        description:
          "DESIGN.md — visual taste for agents: Aurora vs Neutral, looks, one primary CTA.",
        status: "new",
      },
      {
        label: "Styling",
        href: "/docs/styling",
        description: "Override, extend, and re-skin components with className, CVA, and data-slot.",
      },
      {
        label: "CLI",
        href: "/docs/cli",
        description: "init, add, compose, add-page, diff, upgrade, theme, ai.",
      },
      {
        label: "Stack Builder",
        href: "/docs/stack-builder",
        description:
          "Stack picker with a runnable default scaffold command, KICKOFF.md, and stack.json schema.",
      },
      {
        label: "RTL",
        href: "/docs/rtl",
        description: "Direction, spacing, keyboard behavior, and locale checks.",
      },
      {
        label: "Registry",
        href: "/docs/registry",
        description: "How registry items are generated, resolved, and copied.",
      },
      {
        label: "Forms",
        href: "/docs/forms",
        description: "React Hook Form, Zod, accessible fields, and validation states.",
      },
      {
        label: "Charts",
        href: "/docs/charts",
        description:
          "ChartContainer catalog: area, line, live, bar, donut, radar, gauge, composed, candle, funnel, scatter, sankey, P/L.",
      },
      {
        label: "Recipes",
        href: "/docs/recipes",
        description: "Copy-paste patterns: validated forms, theme toggle, toasts, and more.",
      },
      {
        label: "Accessibility",
        href: "/docs/accessibility",
        description: "Keyboard, focus, screen reader, contrast, and framework notes.",
      },
      {
        label: "Frameworks",
        href: "/docs/frameworks",
        description: "Next.js, Vite, TanStack Start, React Router, Astro, and Laravel.",
        status: "new",
      },
      {
        label: "Changelog",
        href: "/changelog",
        description: "Released, in-development, and planned changes.",
        indicator: true,
      },
    ],
  },
];

export const PACKAGE_MANAGERS: PackageManagerCommand[] = [
  {
    id: "pnpm",
    label: "pnpm",
    init: "pnpm dlx cronus-ui@latest init",
    add: "pnpm dlx cronus-ui@latest add button card dialog",
    create: "pnpm dlx create-cronus-app@latest my-app --template saas",
    compose: "pnpm dlx cronus-ui@latest compose saas",
    addPage: "pnpm dlx cronus-ui@latest add-page --route /faq --blocks faq,cta --nav FAQ",
    upgrade: "pnpm dlx cronus-ui@latest upgrade --all --dry-run",
  },
  {
    id: "npm",
    label: "npm",
    init: "npx cronus-ui@latest init",
    add: "npx cronus-ui@latest add button card dialog",
    create: "npx create-cronus-app@latest my-app --template saas",
    compose: "npx cronus-ui@latest compose saas",
    addPage: "npx cronus-ui@latest add-page --route /faq --blocks faq,cta --nav FAQ",
    upgrade: "npx cronus-ui@latest upgrade --all --dry-run",
  },
  {
    id: "yarn",
    label: "yarn",
    init: "yarn dlx cronus-ui@latest init",
    add: "yarn dlx cronus-ui@latest add button card dialog",
    create: "yarn dlx create-cronus-app@latest my-app --template saas",
    compose: "yarn dlx cronus-ui@latest compose saas",
    addPage: "yarn dlx cronus-ui@latest add-page --route /faq --blocks faq,cta --nav FAQ",
    upgrade: "yarn dlx cronus-ui@latest upgrade --all --dry-run",
  },
  {
    id: "bun",
    label: "bun",
    init: "bunx cronus-ui@latest init",
    add: "bunx cronus-ui@latest add button card dialog",
    create: "bunx create-cronus-app@latest my-app --template saas",
    compose: "bunx cronus-ui@latest compose saas",
    addPage: "bunx cronus-ui@latest add-page --route /faq --blocks faq,cta --nav FAQ",
    upgrade: "bunx cronus-ui@latest upgrade --all --dry-run",
  },
];

export const INSTALL_OPTIONS = [
  {
    title: "Scaffold a SaaS app",
    description:
      "npx create-cronus-app my-app --template saas — a Next.js product composed from validated blocks, with theme and AI Kit.",
    href: "/docs/getting-started",
    action: "Get started",
  },
  {
    title: "Use Cronus Create",
    description:
      "Build a preset visually, save it, and generate the setup snippets for your stack.",
    href: "/create",
    action: "Open Create",
  },
  {
    title: "Use Stack Builder",
    description:
      "Compose an app stack and export a runnable default scaffold command, KICKOFF.md, and stack.json.",
    href: "/stack",
    action: "Open Stack Builder",
  },
  {
    title: "Use the CLI",
    description: "init, add, compose, add-page, diff, upgrade, theme, and ai — inside any project.",
    href: "/docs/cli",
    action: "Read CLI docs",
  },
  {
    title: "Choose your framework",
    description: "Add tokens, providers, and components to an app you already created.",
    href: "/docs/frameworks",
    action: "Choose framework",
  },
] as const;

export const FRAMEWORKS = [
  {
    slug: "next",
    name: "Next.js",
    command: "npx create-next-app@latest app && cd app && npx cronus-ui@latest init",
    description: "App Router, RSC-safe provider placement, metadata, and route-level themes.",
    checks: [
      "Provider in app/layout.tsx",
      "tokens imported in globals.css",
      "focus restores on navigation",
    ],
  },
  {
    slug: "vite",
    name: "Vite",
    command: "npm create vite@latest app && cd app && npx cronus-ui@latest init",
    description: "SPA setup with a root provider, CSS token import, and fast registry adds.",
    checks: ["Provider wraps <App />", "semantic tokens in src/index.css", "keyboard traps tested"],
  },
  {
    slug: "tanstack-start",
    name: "TanStack Start",
    command: "npm create @tanstack/start@latest app && cd app && npx cronus-ui@latest init",
    description:
      "File routes, server functions, and persistent theme state across route transitions.",
    checks: [
      "Root route owns provider",
      "pending UI keeps accessible names",
      "router focus handoff",
    ],
  },
  {
    slug: "react-router",
    name: "React Router",
    command: "npx create-react-router@latest app && cd app && npx cronus-ui@latest init",
    description: "Framework mode with route modules, loader-friendly forms, and progressive UX.",
    checks: ["Root.tsx owns provider", "forms expose field errors", "links keep visible focus"],
  },
  {
    slug: "astro",
    name: "Astro",
    command: "npm create astro@latest app && cd app && npx cronus-ui@latest init",
    description: "Island components with shared CSS tokens and isolated interactive surfaces.",
    checks: [
      "client islands import UI only where needed",
      "no duplicate provider trees",
      "static content remains semantic",
    ],
  },
  {
    slug: "laravel",
    name: "Laravel",
    command: "laravel new app && cd app && npx cronus-ui@latest init",
    description: "Blade or Inertia setup with Vite, shared token CSS, and server-rendered forms.",
    checks: [
      "Vite entry imports tokens",
      "Blade/Inertia root owns provider",
      "server errors map to FieldError",
    ],
  },
] as const;

export const ACCESSIBILITY_CHECKS = [
  {
    title: "Keyboard",
    description:
      "Every interactive primitive has a visible focus state and expected arrow-key behavior.",
  },
  {
    title: "Screen readers",
    description:
      "Dialogs, sheets, command menus, forms, and toasts expose names, descriptions, and live states.",
  },
  {
    title: "Contrast",
    description:
      "Theme presets are validated against semantic foreground/background pairs before release.",
  },
  {
    title: "Framework handoff",
    description:
      "Each adapter documents where focus should move after navigation, submit, and dismiss actions.",
  },
] as const;

export const CHANGELOG_ENTRIES = [
  {
    date: "2026-09-02",
    version: "v0.6.19",
    status: "Released",
    title: "upgrade re-emits gold-path owned files",
    summary:
      "cronus-ui upgrade --all on saas and admin rewrites compose always-true adapters and panels so CLI gold-path fixes reach existing apps.",
    items: ["saas/admin upgrade --all re-emits items, members, invite-member, session-user"],
  },
  {
    date: "2026-09-02",
    version: "v0.6.18",
    status: "Released",
    title: "upgrade keeps gold-path home",
    summary:
      "cronus-ui upgrade --all on saas and admin no longer restores catalog dashboard/stats on the shell home.",
    items: ["saas/admin upgrade re-applies ItemsPanel on (shell)/page.tsx"],
  },
  {
    date: "2026-09-02",
    version: "v0.6.17",
    status: "Released",
    title: "upgrade keeps gold-path layout and team",
    summary:
      "cronus-ui upgrade --all on saas and admin no longer restores an unauthenticated catalog layout or TeamBlock on /team.",
    items: ["saas/admin upgrade re-applies session gate and MembersPanel"],
  },
  {
    date: "2026-09-01",
    version: "v0.6.16",
    status: "Released",
    title: "upgrade keeps gold-path chrome",
    summary:
      "cronus-ui upgrade --all on saas and admin no longer restores Mara, WORKSPACES, or a demo InviteDialog on app-shell-chrome.",
    items: ["saas/admin upgrade re-applies WorkspaceMenu, InviteMember, SessionUser"],
  },
  {
    date: "2026-09-01",
    version: "v0.6.15",
    status: "Released",
    title: "Invite-aware login copy",
    summary:
      "create-cronus-app --template saas (and admin) /login?invitation= shows Join the workspace on classic and split login. Default welcome copy is unchanged.",
    items: ["login classic and split show Join the workspace when ?invitation= is present"],
  },
  {
    date: "2026-09-01",
    version: "v0.6.14",
    status: "Released",
    title: "add-page keeps gold-path chrome",
    summary:
      "cronus-ui add-page --nav on saas and admin grows the sidebar without restoring Mara, WORKSPACES, or a demo InviteDialog.",
    items: ["saas/admin add-page --nav re-applies WorkspaceMenu, InviteMember, SessionUser"],
  },
  {
    date: "2026-09-01",
    version: "v0.6.13",
    status: "Released",
    title: "Invite-aware signup copy",
    summary:
      "create-cronus-app --template saas (and admin) /signup?invitation= shows Join the workspace on classic and split signup. Default create copy is unchanged.",
    items: ["signup classic and split show Join the workspace when ?invitation= is present"],
  },
  {
    date: "2026-09-01",
    version: "v0.6.12",
    status: "Released",
    title: "Home nav is Items",
    summary:
      "create-cronus-app --template saas (and admin) labels `/` as Items in the sidebar, matching the live ItemsPanel heading.",
    items: ["saas and admin nav for / is Items, not Dashboard/Overview"],
  },
  {
    date: "2026-09-01",
    version: "v0.6.11",
    status: "Released",
    title: "Gold-path home is items",
    summary:
      "create-cronus-app --template saas (and admin) opens on the live ItemsPanel after signup. Catalog dashboard and stats stay installed, not rendered on /.",
    items: [
      "saas/admin / renders ItemsPanel only",
      "Dashboard and stats blocks remain in the project for the catalog",
    ],
  },
  {
    date: "2026-09-01",
    version: "v0.6.10",
    status: "Released",
    title: "Invite link and admin signup",
    summary:
      "create-cronus-app --template saas copies the invite URL in the dialog and lists pending invites on /team. admin compose installs signup--split so first-run and invite accept are not a 404.",
    items: [
      "InviteDialog stays open with a copyable URL when onInvite returns { url }",
      "admin /signup uses signup--split; /users stays catalog demo",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.9",
    status: "Released",
    title: "Forgot-password split",
    summary:
      "create-cronus-app --template saas (and admin) installs forgot-password--split: brand panel beside the reset form, sent state with the typed email. /reset-password stays the token form.",
    items: [
      "saas and admin /forgot-password use the split variant",
      "/reset-password stays the token form",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.8",
    status: "Released",
    title: "Sign out on the gold path",
    summary:
      "create-cronus-app --template saas (and admin) signs out from the chrome: SessionUser calls Better-Auth signOut and sends the browser to /login.",
    items: [
      "Sidebar footer SessionUser has a Sign out action",
      "Compact header gets the same action as an icon button",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.7",
    status: "Released",
    title: "Password reset gold path",
    summary:
      "create-cronus-app --template saas (and admin) completes forgot-password: sent state uses the typed email, /reset-password sets a new password from the Better-Auth token.",
    items: [
      "Request form switches to sent with the email the user typed",
      "forgot-password--reset reads the token and sets the new password",
      "Admin gets /forgot-password and /reset-password so split-login is not a 404",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.6",
    status: "Released",
    title: "Signup split on saas",
    summary:
      "create-cronus-app --template saas ships /signup in the same split chrome as /login. Workspace copy, no Polar trial; store stays on the classic card.",
    items: [
      "New signup--split variant pairs login--split",
      "saas compose installs the variant; store keeps classic signup",
      "No social buttons, no 14-day trial copy",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.5",
    status: "Released",
    title: "First-run gold path",
    summary:
      "create-cronus-app --template saas signs up on whatever port Next prints. A stale session cookie no longer traps the shell.",
    items: [
      "Loopback on any port is a trusted Better-Auth origin",
      "Shell layout redirects unsigned-in visitors after a real getSession",
      "Middleware no longer bounces cookie-holders off /login",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.4",
    status: "Released",
    title: "Members list on the gold path",
    summary:
      "create-cronus-app --template saas lists Better-Auth org members on /team. After invite accept, the invitee appears; another workspace does not.",
    items: [
      "saas /team emits MembersPanel scoped to the active org",
      "Invite from the team page uses the same InviteMember as chrome",
      "DashboardBlock, stats, and billing stay the catalog demo",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.3",
    status: "Released",
    title: "Items write on the gold path",
    summary:
      "create-cronus-app --template saas creates and deletes workspace-scoped items. Members of the same org see the same list; another workspace does not.",
    items: [
      "saas and admin emit create/delete server actions scoped to the active org",
      "ItemsPanel lists tenant data; DashboardBlock stays the catalog demo",
      "Invitee sees the same items; a second workspace does not",
    ],
  },
  {
    date: "2026-08-31",
    version: "v0.6.2",
    status: "Released",
    title: "Authenticated gold path",
    summary:
      "create-cronus-app --template saas signs up, creates a workspace, and accepts invites. SQLite + Drizzle + Better-Auth, chrome from the session.",
    items: [
      "saas and admin compose SQLite, Drizzle, Better-Auth, and protected shell",
      "Login, signup, and forgot-password are real forms via auth-adapter",
      "Signup creates a workspace; WorkspaceSwitcher and InviteDialog talk to Better-Auth",
      "Invitee signs up from /accept-invitation and joins the same org",
      "Compose records registry npm pins even with --no-install; drizzle-kit creates data/",
    ],
  },
  {
    date: "2026-08-30",
    version: "v0.6.1",
    status: "Released",
    title: "Runnable stack, admin/docs, chrome",
    summary:
      "create-cronus-stack emits Drizzle + SQLite and Better-Auth; InviteDialog and WorkspaceSwitcher land in the app shell; admin and docs compose from idle blocks.",
    items: [
      "Next + Drizzle + SQLite is a real scaffold; Better-Auth rides the same Drizzle path",
      "InviteDialog and WorkspaceSwitcher in @cronus-ui/ui, wired into app-shell-chrome",
      "OSS compose templates admin and docs — not landing-docs",
      "upgrade skill and the compose → add-page → theme → upgrade loop",
      "saas grows to 11 pages (forgot-password, welcome, setup, checklist)",
      "Stack Builder Prompt badge for options the generator does not write",
    ],
  },
  {
    date: "2026-08-28",
    version: "v0.6.0",
    status: "Released",
    title: "Looks, Neutral chrome, Cronus Pro",
    summary: "Material looks, Neutral landings, and an additive Pro origin — the engine stays OSS.",
    items: [
      "Looks: Default, Brutalist, Glass via data-cronus-look (Mauve is gone)",
      "DESIGN.md taste file for agents (compact + extended, MCP get_design_context)",
      "Charts catalog: AreaChart, LineChart, LiveLine, Bar, Composed, Candlestick, Funnel, Gauge, Pie, Ring, Radar, Scatter, Sankey, P/L, Choropleth, Sunburst, HeatmapChart",
      "OSS and Pro landings share Neutral chrome; Aurora stays the generated-product flag",
      "Cronus Pro at :4748 — mail, chat, finance pack, Maker/Studio list, not billed yet",
      "compose -y with no template name composes saas, not lexicographic first",
    ],
  },
  {
    date: "2026-07-13",
    version: "v0.5.0",
    status: "Released",
    title: "App generator matures",
    summary:
      "Block variants, a SaaS template, add-page, and shared demo-store / demo-saas libs — compose a product, then grow it one route at a time.",
    items: [
      "Installable block variants and a repeatable --variant flag on compose",
      "create-cronus-app --template saas: app-shell chrome, dashboard, team, billing, settings, split login",
      "cronus-ui add-page grows a composed app (blocks, nav, base snapshot, --dry-run)",
      "Shared demo-store / demo-saas libs as registry:lib, installed transitively with add/compose",
    ],
  },
  {
    date: "2026-07-13",
    version: "v0.4.0",
    status: "Released",
    title: "Cronus Compose",
    summary:
      "Generate a multi-page Next.js app from validated registry blocks. Every page is imports plus a <main> that stacks them.",
    items: [
      "cronus-ui compose <template> and create-cronus-app --template store|landing",
      "Bundled store and landing manifests, --dry-run sitemap preview, .cronus-ui/ base snapshot",
      "registry/meta.json sidecar and MCP search/list/get enriched from it",
    ],
  },
  {
    date: "2026-07-13",
    version: "v0.3.0",
    status: "Released",
    title: "Optional peers, 17 blocks, 5 components",
    summary:
      "Heavy leaf libraries moved to optional peerDependencies of @cronus-ui/ui. CLI add still installs per-item deps. Catalog grew.",
    items: [
      "recharts, tiptap, dnd-kit, tanstack-table, react-day-picker, and date-fns are optional peers",
      "17 new blocks across store, account, admin, and content families (56 → 73)",
      "Chip, StatusDot, ImageZoom, VideoPlayer, and DescriptionList",
    ],
  },
  {
    date: "2026-07-07",
    version: "v0.2.0",
    status: "Released",
    title: "Stack Builder, generators, and release hardening",
    summary:
      "Promoted Stack Builder into the publishable package set, added app and stack generators, refreshed the homepage, and hardened the local v0.2 release path.",
    items: [
      "Nine publishables in lockstep: tokens, theme, UI, stack, AI Kit, CLI, create-cronus-app, create-cronus-stack, and MCP",
      "Stack Builder docs, schema metadata, KICKOFF.md, stack.json, and create-cronus-stack scaffold output",
      "Full package smoke coverage for runtime installs, installed bins, scaffold checks, and tarball dependency pins",
    ],
  },
  {
    date: "2026-06-23",
    version: "v0.1.0",
    status: "Released",
    title: "Foundation component waves",
    summary:
      "Published the initial component catalog, token package, theme provider, registry generator, and showcase app.",
    items: [
      "Foundation, forms, overlays, navigation, data, display, and premium components",
      "CLI registry generated from source components",
      "Semantic token contract for runtime theming",
    ],
  },
  {
    date: "Next",
    version: "Next",
    status: "Planned",
    title: "Registry app manifests and catalog-data reconciliation",
    summary:
      "Bundled app templates stay in-repo for now. Next is migrating them to registry:app and unifying remaining block mock data onto shared libs.",
    items: [
      "registry:app manifests for store, landing, saas, and named landing-* flavors",
      "Catalog-data reconciliation for blocks still on divergent mocks",
    ],
  },
] as const;
