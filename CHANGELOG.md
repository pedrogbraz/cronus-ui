# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Sign out on the gold path.** saas/admin chrome `SessionUser` calls Better-Auth
  `signOut` and sends the browser to `/login`. Compact header gets the same
  action as an icon button.

## [0.6.7] — 2026-08-31

### Added

- **Password reset gold path.** saas `/forgot-password` shows the sent state
  with the email the user typed (not Mara). `/reset-password` sets a new
  password from the Better-Auth token. `sendResetPassword` logs the URL like
  invite. Admin gets the same two pages so the split-login link is not a 404.

## [0.6.6] — 2026-08-31

### Added

- **Signup split.** Visual pair of `login--split`: two-column brand panel
  beside the create-account form, workspace copy, no social buttons, no
  Polar trial. saas compose installs it; store stays on the classic card.

## [0.6.5] — 2026-08-31

### Fixed

- **First-run gold path.** Loopback on any port is a trusted Better-Auth
  origin, so signup works when Next picks something other than `:3000`. A
  stale session cookie no longer traps the shell: middleware stops bouncing
  cookie-holders off `/login`, and the shell layout redirects unsigned-in
  visitors after a real `getSession`.

## [0.6.4] — 2026-08-31

### Added

- **Members list on the gold path.** saas `/team` lists Better-Auth org
  members of the active workspace. After invite accept, the invitee appears
  on the same list; another workspace does not. No new blocks.

## [0.6.3] — 2026-08-31

### Added

- **Items write on the gold path.** saas/admin home creates and deletes
  workspace-scoped items through server actions. Members of the same org see
  the same list; another workspace does not. No new blocks.

## [0.6.2] — 2026-08-31

### Added

- **Authenticated gold path.** The default stack is Next + Cronus + SQLite +
  Drizzle + Better-Auth. `create-cronus-app --template saas` (and `admin`)
  writes the data layer, login/signup/forgot-password talk to Better-Auth,
  middleware protects the shell, and the home page queries SQLite.
- **Workspace gold path.** saas/admin (and the stack Better-Auth emit) create a
  default organization on signup, wire `WorkspaceSwitcher` and `InviteDialog`
  to Better-Auth, log invite URLs with `console.info`, and scope `items` to
  the active workspace. No new blocks.
- **Invite accept loop.** Gold-path apps emit `/accept-invitation`, keep the
  invite id across login/signup, and the generated chrome shows the session
  user instead of demo-saas `USER`.

### Changed

- **Auth blocks.** Login, signup, and forgot-password are real forms via the
  `auth-adapter` lib (demo success in the gallery; gold-path apps replace the
  adapter).
- **Generated saas is installable.** Compose records registry npm pins
  (`lucide-react@^0.577.0`, `recharts`, …) into package.json even with
  `--no-install`. Chrome customization runs the F3 lib rewrite, so
  `app-shell-chrome` imports `@/lib/demo-saas` instead of `../lib/demo-saas.js`.
  Drizzle sqlite `db:push` creates the `data/` directory before opening the file.
  Generated SQLite apps pin `better-sqlite3@^12` so `npm install` satisfies
  Better-Auth's optional peer (13.x conflicts under npm 11).

## [0.6.1] — 2026-08-30

### Added

- **Drizzle + SQLite (and Better-Auth) in create-cronus-stack.** Next +
  `orm-drizzle` now writes a real client, schema, `drizzle.config.ts`, and
  `db:push` / `db:generate` / `db:studio`. SQLite is zero-ops (`better-sqlite3`,
  `file:./data/app.db`). Postgres and MySQL get the matching driver. Better-Auth
  on that same Drizzle path emits `lib/auth.ts`, the React client, and
  `app/api/auth/[...all]`. Other ORMs and Clerk stay kickoff.
- **InviteDialog and WorkspaceSwitcher.** Product chrome primitives in
  `@cronus-ui/ui` (Dialog + email/role invite; dropdown workspace switcher).
  `app-shell-chrome` hosts both.
- **admin and docs compose templates.** OSS product apps from idle blocks —
  admin console (overview, users, analytics, board, audit) and a docs/content
  site (changelog, guides, article, FAQ, about). Not `landing-docs`.
- **upgrade skill.** The AI Kit ships `upgrade` as a first-class skill. Agents
  run `diff` → `upgrade --all --dry-run` → `upgrade --all` instead of
  `compose --overwrite`. `AGENTS.md` now states the product loop (compose →
  add-page → theme → upgrade) for Codex/Zed. Looks vs themes is explicit in
  the theme skill.
- **saas activation loop.** Canonical `saas` now includes `/forgot-password`,
  `/welcome`, `/setup`, and `/checklist` from existing blocks.

### Changed

- **Stack Builder honesty.** Options the generator does not write files for
  show a Prompt badge. Catalog skills are the real AI Kit skills (`ui-add`,
  `theme`, `compose`, `upgrade`, …), not dummy frontend/db packs.

## [0.6.0] — 2026-08-28

### Fixed

- **CurrencyInput.** Opening the selector no longer scroll-locks the document
  (Radix modal dropdown was unsticking the site header and shoving the sidebar).
  The default list is a full ISO 4217 set, not just BRL/USD/EUR.
- **Overlay scroll-lock.** DropdownMenu, ContextMenu, and Popover default to
  `modal={false}` so a menu cannot freeze the document. The site header is
  `position: fixed` (with a spacer) so Dialog / Command / AlertDialog / Sheet
  RemoveScroll can no longer unstick the navbar. `scrollbar-gutter: stable` on
  `html` stops the page from jumping when the scrollbar hides.
- **Meteors.** Keyframes were overwriting `-rotate-45`, so streaks slid
  sideways as horizontal dashes. They now fall diagonally from the top and
  burst as they leave the bottom.
- **Premium demos.** Icon wells, BorderBeam, and TiltCard examples dropped the
  `bg-gradient-primary` rainbow (and hex amber→pink) for surface / fg tokens.
- **Candlestick (Default).** Wicks and bodies render again — Recharts 3 never
  injected `yAxis.scale` into Scatter shapes, so every candle bailed out.
  Hover no longer paints a second date over the x-axis ticks.
- **Neutral charts.** Neutral was inheriting Aurora's sky/cyan `--cronus-chart-*`
  from `:root`, so docs charts looked chromatic on a zero-chroma theme. Neutral
  now ships its own zinc ramp. Chart-1 is the darkest series in both modes
  (same as the Motion engine's zinc-800 / zinc-600 scatter rings).

### Changed

- **Public origins.** OSS canonical is `https://aicronus.com` (`www` redirects
  to apex). Cronus Pro is `https://iacronus.com`. Override with
  `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_OSS_URL` / `NEXT_PUBLIC_PRO_URL`.
- **Scatter (Motion).** Same 24-month sessions/conversions as the docs preview:
  offset rings (fill + gap + stroke), hover dim/blur, clip-reveal enter.
  Neutral dark `--cronus-chart-1/2` is zinc-dark, so rings read as hollow
  outlines instead of glowing white discs.
- **Composed (Motion).** Thirty daily points — units as bars, run-rate as area,
  revenue as a Catmull-Rom line. Clip-reveal, hover dim, date pill, crosshair.
- **Live line (Motion).** Stream uses wall-clock timestamps so the line fills
  the window; the live pill uses tooltip tokens (no black box); X ticks are
  local HH:MM:SS.
- **Bar (Motion).** Grouped revenue/profit preview matches the docs pattern:
  round caps, hover dims other months to 22%, tooltip with thousands separators.
  Stacked uses a 3px segment gap instead of stacked pills.
- **Choropleth (Motion).** Loads a world FeatureCollection (not two fake
  rectangles), zoom +/- , and a country-name tooltip.
- **GitHub.** Repo `pedrogbraz/cronus-ui` is public. The CLI registry is
  `https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v0.6.0/registry`.
- **compose -y.** With no template name, compose picks `saas`, not the
  lexicographic first bundled app (`chat`).
- **Button.** Dropped the `gradient` variant. Primary is the token pair
  (`bg-primary` / `text-primary-foreground`) — white on Neutral dark, like the
  homepage CTA. Outline is a hairline on a transparent fill.
- **Homepage.** Editorial landing: centered hero, display serif, two pill CTAs,
  three product cards, a CLI/code section, and catalog signals with traveling
  token beams. Theming, looks, and the catalog follow.
- **Site chrome.** Primary nav is Docs, Components, Blocks, Templates, Create.
  Themes, Stack, Changelog, and Pro moved out of the bar — Pro is an
  announcement strip plus a dismissible corner card, not a tenth link. See Pro
  leaves this origin for Cronus Pro (`apps/pro`, :4748 / iacronus.com).

### Removed

- **Mauve look.** Dropped from the material axis — it was a tint, not a
  material. Looks are Default, Brutalist, and Glass.

### Added

- **Public release line.** GitHub `pedrogbraz/cronus-ui` is public. npm lockstep
  `0.6.0` for `@cronus-ui/tokens`, `theme`, `ui`, `stack`, `ai-kit`, `cronus-ui`,
  `create-cronus-app`, `create-cronus-stack`, and `cronus-ui-mcp`. The CLI
  default registry is the `v0.6.0` tag.
- **Catalog tags + MCP match.** Every component, block, variant, and compose
  app now ships Hydra-ready tags in `registry/meta.json`: short description,
  design style, palette, motion, and intents. MCP `list_catalog` dumps the
  compact cards (no source). `match_catalog` runs the two-query path
  (`login` × `smooth`) from a free-text prompt so an agent does not need the
  docs in context. Resource `cronus-ui://catalog/tags`.
- **Chart docs.** Named chart pages now include Installation (Default vs Motion), Usage, the Motion subcomponent API (nested in On this page), extra customizations, data format, theming, and peer dependencies — not only Default/Motion previews. `/llms/components/<chart>.md` mirrors the same sections.
- **Charts catalog.** Every named chart ships two visuals on the same page:
  Default (ready-made) and Motion (clip-reveal, crosshair, date pill). Motion
  pieces import from `@cronus-ui/ui/charts`. The low-level `Chart` primitive
  stays. Listed under Components → Charts.
- **DESIGN.md.** Agent-readable taste: Aurora vs Neutral, looks, one primary
  CTA, hairline elevation. Emitted by `create-cronus-app` (including `--no-ai`),
  `cronus-ui ai`, and compose. Compact + extended. MCP `get_design_context`.
  Live at `/docs/design` and `/llms/docs/design.md`. Named radius roles
  (`rounded-button` / `badge` / `card` / `pill`) follow the primitives.
- **Sponsor (optional coffee).** `/sponsor` is a Buy Me a Coffee-style picker:
  Coffee $5, Lunch $15, a working day $50, or a custom USD amount. Checkout is
  GitHub Sponsors (one-time, any amount) unless `NEXT_PUBLIC_SPONSOR_URL` points
  at another rail. OSS stays free — this is not a paywall. Homepage band +
  footer + command palette.
- **Cronus Pro origin.** `apps/pro` is a second Next app (port 4748) — not
  `/pro` on the docs nav. Maker $199 / Studio $299 perpetual (not billed yet).
  OSS CTAs and `/pro` redirect to `NEXT_PUBLIC_PRO_URL`. The Pro landing
  matches the OSS editorial (centered hero, pack cards, section ticks) — no
  rays, grid, or particles. Chrome is Neutral, same palette as the OSS
  landing; pack previews keep their own themes.
- **Cronus Pro pack (additive).** Mail, chat, and finance compose apps — extra
  products, not a paywall on the engine. Looks, SaaS, store, landing, and
  upgrade stay OSS. License is not billed yet.
- **Looks (Default, Brutalist, Glass).** A material axis orthogonal to
  theme and mode: `data-cronus-look` restyles radius, border, shadow, and
  glass surfaces from existing tokens — no forked components. Homepage
  stage at `#looks`. Docs chrome stays Default. Glass in light is a pastel
  field (info / warning washes) behind a frosted pane; dark keeps the
  chromatic blobs. The live-theming specimen on `#theming` is a Neutral
  glass pane on the landing surface. Theme chips recolor the catalog
  inside (buttons, chart, badges), not the pane.
- **Catalog thumbs.** `/components` and `/blocks` cards use the same 16/10
  scaled-screenshot chrome as `/templates` — product miniatures (login, hero,
  dashboard, charts), not a name on a dotted grid. Cheap Cronus primitives
  plus token-painted charts/tables; the page still never imports example
  families or `lib/blocks/*`. Live previews stay on the slug routes.
- **Live template previews.** `/templates` cards render the composed site
  (themed Cronus blocks, not screenshots). Click through for Preview / Code
  plus device frames; **Open Preview** is the full page at `/preview/t/[slug]`.
- **Named landing pages as compose apps.** Twelve `landing-*` templates
  (`studio`, `ops`, `secure`, `care`, `shop`, `docs`, `premium`, `agents`,
  `coverage`, `broadcast`, `agency`, `glass`) sit next to `landing` in
  `create-cronus-app` and `cronus-ui compose`. Each is a distinctive stack of
  existing blocks + variants and a baked theme/mode — original Cronus pages,
  not copies of third-party registries. `npx create-cronus-app my-app
  --template landing-studio`.
- **Motion harvest (originals, no new deps).** 26 premium primitives
  ported as Cronus implementations — CSS/canvas/`motion` only, semantic
  tokens, reduced-motion, `data-slot`. Surfaces: Ripple, Meteors,
  DotPattern, GridPattern, RetroGrid, Noise, LightRays, ProgressiveBlur,
  FlickeringGrid, StarBorder, ShinyText, Highlighter, SpinningText,
  SparklesText, TypingText, WordRotate, ScrambleText, GlareHover,
  ClickSpark, AnimatedList, CardStack, PillNav, ExpandableTabs,
  DynamicIsland, Confetti, Particles. Ideas drawn from Magic UI, React
  Bits (free), beUI and Fancy; no Pro/paid source, no gsap/three/ogl.
- **Compose data: more storefront blocks on `demo-store`.** `product-detail`
  (gallery + minimal), `checkout`, `product-grid--showcase`, `invoice`,
  `order-tracking` (delivered) now import the shared catalog instead of
  re-inlining product names, prices, and order ids. The anti-inline-mock
  allowlist grew with them. Variants that tell a different story
  (`checkout--one-page` / `--multi-step`, `invoice--receipt`,
  `order-tracking--delayed`) stay local.
- **Composed-page 3-way upgrade on `upgrade --all`.** Generated pages and
  layouts merge against `.cronus-ui/base` (base snapshot vs local vs new
  render). Blocks the re-plan newly requires are installed (no overwrite).
  `add-page` routes are kept. Never deletes user files. Pass `--manifest`
  for custom compose apps. Snapshot dir is the `composed{}` key.
- **Public compare includes Aceternity.** `/docs/compare` is four-way
  (Cronus, shadcn/ui, HeroUI, Aceternity) on the product-loop axis, not
  component count. Homepage and getting-started teach compose → add-page →
  upgrade; the catalog is no longer the first CTA.
- **MCP `upgrade_components` / `add_page` take `manifest`.** Custom compose
  apps keep provenance on the agent path (`--manifest`). Upgrade copy covers
  composed pages, not only primitives.
- **Signup name from `demo-saas`.** `signup` (split-proof, with-plan) reads
  `USER.name` instead of inlining it. Growth plan copy stays local.
- **MCP `add_page` takes `app`.** Forwards `--app` when a project has more
  than one composed app.
- **Agent-facing loop on `/llms.txt`.** The summary and command fences include
  add-page and `upgrade --all`; they no longer lead with component counts.
  Homepage catalog H2 dropped the count. Stack Builder’s Cronus option is
  “product UI system”, not “shadcn-class design system”.

## [0.5.0] — 2026-07-13

### Added

- **App-generator: installable block variants + `--variant`.** Every block
  variant (`login--split`, `checkout--one-page`, …) is now a real registry item
  (51 of them). A manifest `{block,variant}` ref or a repeatable
  `--variant <slug>=<v>` flag composes the same app with a different look;
  unknown / ineffective / chrome-slot overrides fail loud.
- **App-generator: the SaaS template.** A new `app-shell` chrome block (sidebar +
  header) drives an `(app)` route group; `create-cronus-app --template saas` opens
  straight on a composed dashboard behind the shell (analytics, team, billing,
  settings, split-variant login).
- **App-generator: `add-page`.** `cronus-ui add-page` grows a composed app by one
  page (installs new blocks incl. a new chrome group's chrome, updates nav,
  refreshes the base snapshot, provenance-checked manifest reload, `--dry-run`).
- **App-generator: shared demo-data libs.** Blocks can depend on a `registry:lib`
  (`demo-store` / `demo-saas`, exported via the `@cronus-ui/ui` subpath) — pure-TS
  single sources of truth with tested dataset invariants. `cronus-ui add`/compose
  installs the lib transitively; 8 coherent blocks (cart, order-history, reviews,
  product-grid, billing, …) now read their data from it. An anti-inline-mock
  gate (deriving the forbidden set from the lib) keeps migrated blocks honest.
- **`rsc:smoke` gate** proving every block item (incl. all 51 variants + the
  shell) compiles as a React Server Component page.

### Note

- The bundled app manifests stay bundled (not migrated to `registry:app`); a
  full catalog-data reconciliation (unifying the remaining blocks' divergent
  mock data) is a follow-up. The visible app brand flows through the brandTokens
  chrome path.

## [0.4.0] — 2026-07-13

### Added

- **Cronus Compose — the app generator (Phase 1).** `cronus-ui compose <template>`
  and `npx create-cronus-app --template store|landing` build a full multi-page
  Next.js app by composing validated registry blocks. The generator is data,
  not codegen: every generated page is only imports of installed blocks plus a
  `<main>` that stacks them (the golden rule), so many similar apps generate
  without drift. It reuses the validated CLI core (`Registry.resolve`,
  `writeItemFiles`, the install manifest) verbatim and adds a pure, deterministic
  planner/renderer. Ships `store` (9-page storefront) and `landing` bundled
  manifests, `--dry-run` sitemap preview, and a `.cronus-ui/` base snapshot for
  future 3-way page upgrades. **No new package.**
- **`registry/meta.json` sidecar.** A deterministic (timestamp-free, key-sorted)
  metadata index generated alongside the registry: per block the
  title/description/category plus the extracted `exportName`, `kind`, data-slots
  and brand tokens; per component the title/category/`rsc`; and an `apps` section
  for the bundled templates. `registry:check` gains fail-loud gates for meta
  sync, unique block export names, required data-slot/brand markers, and
  app-template block references.
- **MCP tools enriched with metadata.** `search_registry`, `list_blocks`,
  `list_components` and `get_component` now surface each item's
  description/category from `meta.json` (with graceful fallback for registries
  that ship none), and search matches description + category.
- **`rsc:smoke` gate.** Proves the whole block catalog is safe to compose into
  React Server Component pages — installs every block and `next build`s one bare
  RSC page per block. All 73 blocks pass; the five interactive blocks already
  carry `use client`.

## [0.3.0] — 2026-07-13

### Breaking

- **`@cronus-ui/ui`: heavy leaf-only libraries are now optional peer dependencies.**
  `recharts` (`Chart`), `@tiptap/react` / `@tiptap/pm` / `@tiptap/starter-kit`
  (`RichTextEditor`), `@dnd-kit/core` / `@dnd-kit/sortable` / `@dnd-kit/utilities`
  (`Kanban`), `@tanstack/react-table` (`DataTable`), `react-day-picker`
  (`Calendar`, `DatePicker`, `DateRangePicker`), and `date-fns` (`DatePicker`,
  `DateRangePicker`, `Scheduler`) moved from `dependencies` to optional
  `peerDependencies`, so they are no longer installed automatically with the
  package. **npm-package consumers** importing those components must now install
  the matching peer(s) themselves (see "Optional peer dependencies" in the
  `@cronus-ui/ui` README for the component → package table). All other components
  are unaffected. **CLI/registry users are unaffected** — `npx cronus-ui add <slug>`
  derives each item's npm dependencies from its real imports and installs them.

### Added

- **4 new block families — 17 new blocks (56 → 73), every one CLI-installable
  with a paste-exact code literal:**
  - **Store**: `product-detail` (standard / gallery / minimal),
    `cart` (page / drawer), `order-tracking` (in-transit / delivered / delayed),
    `order-history` (table / cards), `reviews` (summary / compact).
  - **Account**: `account-security` (two-factor / password & danger zone),
    `sessions` (device list / selectable table), `api-keys` (list / create),
    `notification-preferences` (channel matrix / simple toggles).
  - **Admin**: `user-management` (table / cards), `analytics`
    (traffic overview / engagement cohorts), `kanban-board`
    (sprint / compact WIP), `audit-log` (timeline / table).
  - **Content**: `blog` (featured grid / editorial list), `blog-post`
    (article / with sidebar), `logo-cloud` (trust grid / dual marquee),
    `about` (story / values).
- **29 new variants on existing key blocks** — `login` (+3: split panel,
  social-first, minimal), `signup` (+2: split with proof, with plan summary),
  `cta` (+2), `navbar` (+2), `footer` (+2), `checkout` (+2: one-page,
  multi-step), `product-grid` (+2: with filters, editorial showcase), and
  `invoice` (+1: receipt).
- **5 new components** (each CLI-installable and exported with its own entry
  point): `Chip` (interactive filter/selection chip with accessible dismissal),
  `StatusDot` (presence indicator with live-region announcements),
  `ImageZoom` (cursor-panning hover/press zoom with controlled state),
  `VideoPlayer` (token-styled native video controls with focus hand-off), and
  `DescriptionList` (semantic `dl`/`dt`/`dd` in three layouts).
- Docs examples for all five new components, including a captions-track video
  demo and a striped description-list example.

### Fixed

- `Slider` no longer forwards `aria-label`/`aria-labelledby` onto its role-less
  root, which tripped axe `aria-prohibited-attr` (serious, WCAG 2 A) on every
  labeled slider; thumbs keep their accessible names.
- The `pricing` toggle/usage variants and the `feature-grid` bento variant now
  ship code literals that fully reproduce their previews (they previously
  rendered placeholder comments with unused imports), and the `testimonials`
  literal compiles under `strict` TypeScript.
- Classic `login`/`signup`/`otp`/`magic-link` link text moved to the AA-safe
  `text-primary-strong` token.

## [0.2.0] — 2026-07-07

### Added

- **9 new components** — `Marquee`, `AvatarGroup`, `Banner`, `TagsInput`, `Sparkline`,
  `InputGroup`, `PasswordInput`, `ButtonGroup`, and `Masonry` (each CLI-installable
  via `npx cronus-ui add <slug>`).
- **10 new premium components** — three payments-grade inputs `CurrencyInput`
  (currency selector + live minor-unit formatting), `PhoneInput` (country selector,
  emits E.164) and `CreditCardInput` (brand detection + Luhn, display-only/PCI-safe);
  `TimePicker` (12h/24h popover), `FloatingLabelInput`; and premium motion showpieces
  `BorderBeam` (animated perimeter light), `FlipCard` (3D front/back), `TiltCard`
  (pointer-driven 3D tilt), `SplitButton`, and `ConfirmationDialog`. All tokenized,
  reduced-motion-safe, axe-tested, and CLI-installable via `npx cronus-ui add <slug>`.
- **Chart breadth** — donut, radar, and radial-bar-gauge examples on the `Chart`
  page (recharts composed inside `ChartContainer`, tokenized, code-split).
- **Blocks: 8 new families / many new blocks.** A dedicated **Auth** family
  (Login, Sign Up, Forgot Password, Two-Factor Code, Magic Link); **Onboarding**
  (Welcome, Setup Wizard, Setup Checklist); **AI & Chat** (Chat Thread, Prompt
  Box, AI Response); **Notifications** (Notification Panel, Activity Feed, Toast
  Stack); **Email** (Welcome, Receipt, Verify); **States** (Not Found, Error,
  Success, Maintenance); **Feedback** (NPS Survey, Feedback Form, Contact Form);
  plus new **Marketing** (Testimonials, FAQ, Footer, Navbar) and **Billing**
  (Manage Subscription, Payment Method, Usage Dashboard, Cancel Flow) blocks.
  The blocks catalog grew from ~17 to ~48 blocks across 13 families.

### Changed

- **Redesigned the `/blocks` and `/components` catalogs** — a stat header, a
  sticky toolbar with live text search + category filter chips (with counts), a
  fuller card grid, and a live result count. The `/components` default view keeps
  its anchor-linkable category sections.
- Fixed the `Marquee` `motionPreference` semantics (`"always"` now always scrolls;
  default is `"respect"`) and its loop travel (one copy + gap → correct px/sec
  speed and a seamless seam).

### Fixed

- **Accessibility** — labelled the toast dismiss buttons (`button-name`), named
  the setup-checklist progress bar (`aria-progressbar-name`), and gave the
  donut/radar/radial chart demos a proper image role + text alternative
  (`svg-img-alt` / `aria-hidden-focus`). The a11y test suite now also scans the
  batch-5 components and a representative block from each new family.

## [0.1.0] — 2026-06-23

The first public release of **Cronus UI** — a themeable, accessible, shadcn-class
React component library that is the Cronus design language. Distributed two ways:
as installable packages and as copy-paste registry items you own.

### Added

- **`@cronus-ui/ui` component library** — a catalog of themeable, accessible React
  components built on Radix primitives, `class-variance-authority` variants, and
  Tailwind utility classes, each exposed as its own subpath export for granular
  imports. Covers the full surface a product app needs, grouped into:
  - **Buttons & actions** — Button (incl. gradient/animated variants), Toggle,
    ToggleGroup, SegmentedControl.
  - **Forms** — Input, Textarea, Label, Field, Form (react-hook-form + zod),
    Checkbox, Switch, RadioGroup, Select, Combobox, Autocomplete, MultiSelect,
    Slider, NumberInput, InputOTP, FileDropzone.
  - **Data display** — Table, DataTable (TanStack Table) with sorting, filtering,
    pagination and CSV export, Avatar, Badge, Card, Metric, Kbd, Empty,
    CodeBlock, CopyButton.
  - **Feedback** — Progress, Skeleton, Spinner, Shimmer, Toast (Sonner),
    AnimatedNumber.
  - **Overlays** — Dialog, Sheet, Drawer (Vaul), AlertDialog, Popover,
    MorphingPopover, HoverCard, Tooltip, DropdownMenu, Command palette (cmdk).
  - **Navigation & layout** — Tabs, Accordion, Collapsible, Breadcrumb,
    Pagination, NavigationMenu, ScrollArea, Sidebar, AppShell, Carousel.
  - **Date & time** — Calendar, DatePicker, DateRangePicker.
  - **Charts** — Chart primitives built on Recharts.
  - **Premium & brand** — GlassCard, GradientBorder, GradientText, SpotlightCard,
    AuroraBackground, LogoCarousel, Reveal, TextEffect, and motion presets — the
    Aurora layer of glass, gradients, springs, and scroll reveals.
- **`@cronus-ui/tokens` design tokens** — the source-of-truth design tokens in
  TypeScript, an OKLCH-based color system with light/dark modes, and a CSS
  variable bridge that exposes every token as a runtime `--cronus-*` variable.
  Ships a Tailwind v4 `@theme` stylesheet plus a Tailwind v3 preset, so utilities
  like `bg-primary`, `rounded-lg`, `text-fg-secondary`, and `shadow-glow` resolve
  to the live tokens on either Tailwind version.
- **`@cronus-ui/theme` runtime theming** — `<CronusUIProvider>` and the `useTheme`
  hook for runtime theming. Switch themes and light/dark modes, or override
  individual tokens (radius, primary, border, …) and re-theme an entire subtree
  by writing CSS variables — no React re-render.
- **`cronus-ui` CLI with a registry installer** — copy-paste components into your
  own codebase, shadcn-style, and own the source. `npx cronus-ui init` scaffolds
  the config and `cn()` helper; `npx cronus-ui add <component>` resolves
  dependencies and rewrites imports to your path aliases; `list` and `diff` round
  out the workflow. The registry is generated from the real component sources, so
  the package and copy-paste distribution modes share one source of truth.
- **Installable blocks** — 13 ready-made, composed UI sections shipped as
  `registry:block` items and installable the same way via `npx cronus-ui add
  <slug>`: `hero`, `pricing`, `feature-grid`, `cta`, `stats`, `login`,
  `settings`, `team`, `dashboard`, `billing`, `page-header`, `filter-bar`, and
  `empty-state`. The CLI scaffolds a dedicated blocks directory and routes block
  files to it.
- **Documentation & showcase site** — a HeroUI-style showcase (`apps/www`) that
  documents every component and block with live, themeable previews and surfaces
  the matching `cronus-ui add` command on each page.

### Changed

- Aligned the Badge variant lexicon with the shared destructive variant naming
  while preserving the existing `error` alias for backward compatibility.
- Interactive Radix-based components are now explicitly marked as client
  components so they behave correctly in server-rendered (RSC) apps.
- Tokens now emit a per-mode `color-scheme`, ship `@property`-backed color
  cross-fades, and scope the reduced-motion reset to the relevant subtree.

### Fixed

- Form controls expose reactive `aria-invalid` styling and meet placeholder
  contrast requirements.
- Colored button variants use white labels for legible contrast.
- The NavigationMenu panel no longer clips its content, with tightened padding;
  in the showcase the disclosure is contained within the preview frame.
- Accordion and Collapsible animate their height; DropdownMenu, Select, Popover,
  HoverCard, and Tooltip use fluid pop animations.
- DatePicker labels its popover for screen readers.
- AnimatedNumber keeps its live announce region so its value remains accessible.

### Security

- Neutralized CSV formula (spreadsheet) injection in the DataTable export, so
  exported cell values cannot be interpreted as formulas when opened in a
  spreadsheet application.
- The CLI validates registry dependency names and suggests the closest match on
  an unknown `add`, preventing typo-driven resolution of unintended entries.
- Added a published vulnerability disclosure policy (`.github/SECURITY.md`).
- Added Dependabot coverage and documented dependency audit as a release
  governance follow-up to surface vulnerable dependencies early.

### Quality & tooling

- Licensed the project under the MIT License.
- Added a jsdom component-test harness (Vitest + Testing Library) with hundreds
  of tests across the catalog — render, interaction, `aria-invalid`, and
  open-state overlay behavior (focus, escape) — plus automated accessibility
  assertions (axe), an SSR smoke test across components, and a coverage gate.
- Added an end-to-end check that fails on console errors and hydration warnings.
- Added per-entry gzipped bundle budgets for the published `@cronus-ui/ui` so a
  dependency or code-size regression is caught at build time.

[Unreleased]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.7...HEAD
[0.6.7]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.6...v0.6.7
[0.6.6]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.5...v0.6.6
[0.6.5]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.4...v0.6.5
[0.6.4]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/pedrogbraz/cronus-ui/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/pedrogbraz/cronus-ui/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/pedrogbraz/cronus-ui/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/pedrogbraz/cronus-ui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/pedrogbraz/cronus-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/pedrogbraz/cronus-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/pedrogbraz/cronus-ui/releases/tag/v0.1.0
