# `@kronus-ui/ui` component authoring contract

Every component MUST follow this contract so the library stays consistent,
themeable, and tree-shakeable. Read this fully before writing a component.

## File layout
- One component family per file: `packages/ui/src/components/<name>.tsx`.
- Import the class merger: `import { cn } from "../lib/cn.js";` (note the `.js`).
- Export is wired centrally in `packages/ui/src/index.ts` — match the names there.

## Rules
1. **Semantic tokens only.** Use ONLY the token utilities below. This is
   what makes the whole library re-themeable.
   - **Forbidden, no exceptions:** Tailwind palette scales (`bg-zinc-900`,
     `text-gray-500`, `border-slate-200`) and raw hex in a component. They
     do not change when the theme changes.
   - **Allowed:** `text-white` and `bg-black` on a surface the component
     itself defines and controls (gradient, `color-mix`, overlay). Contrast
     is known at write time. Leave a comment next to the literal, as
     `button.tsx` does.
2. **Variants via CVA.** Use `class-variance-authority`:
   `const xVariants = cva(base, { variants, defaultVariants })`. Export the
   variants object (e.g. `buttonVariants`) alongside the component.
3. **Forward the `ref`.** Every interactive or leaf component accepts `ref`
   on the root, typed with the correct DOM element. In React 19 that is a
   regular prop: `function Foo({ ref, ...props }: FooProps)`. `forwardRef`
   is accepted in existing code, not in a new component.
4. **`data-slot="<name>"`** attribute on the root element of each component.
5. **`asChild` via `@radix-ui/react-slot`** for Button (and anything that should
   be able to render as a link).
6. **Accessibility:** real semantics, `focus-visible` ring, `aria-*` where
   relevant, `aria-busy`/`role` for Spinner/Skeleton. Disabled states use
   `disabled:opacity-50 disabled:pointer-events-none`.
7. **Focus ring pattern:** `outline-none focus-visible:ring-2
   focus-visible:ring-ring focus-visible:ring-offset-2
   focus-visible:ring-offset-surface-base`.
8. **TypeScript:** export a `XProps` type for components that take meaningful
   props. Use `verbatimModuleSyntax` — `import { type Foo }` / `export type`.
9. No client directive needed unless the component uses hooks/state. Leaf
   components (Button, Badge, Input, Card...) are server-safe — do NOT add
   `"use client"` to them.
10. **RTL-safe by default.** Anything directional uses logical utilities
    (`ps-*`/`pe-*`, `ms-*`/`me-*`, `start-*`/`end-*`, `text-start`/`text-end`,
    `rounded-s-*`/`rounded-e-*`, `border-s`/`border-e`) — never physical ones
    (`pl-*`, `left-*`, `text-left`, `rounded-l-*`...). If a transform is
    direction-sensitive and has no logical equivalent, add an explicit `rtl:`
    variant. Exception: styles keyed on a physical anchor (e.g. Radix
    `data-[side=left]`) stay physical — mark them with a comment.
11. **i18n.** No hardcoded user-facing strings inside components — expose a
    `labels` prop (or equivalent, e.g. `placeholder`) with English defaults.
    Locale-sensitive formatting goes through `Intl` or an injected locale
    (e.g. a `date-fns` `locale` prop), never a baked-in format.

## Token utility reference (resolve to `--kronus-*`, re-theme live)
Colors (use as `bg-*`, `text-*`, `border-*`, `ring-*`):
- `primary`, `primary-foreground`, `accent`, `accent-foreground`
- `surface-base`, `surface-inset`, `surface-raised`, `surface-overlay`,
  `surface-elevated`, `surface-floating`
- `fg`, `fg-secondary`, `fg-tertiary`, `fg-muted`, `fg-inverse`
  (text color = `text-fg`, `text-fg-secondary`, ...)
  - **`fg-muted` is for decorative / non-essential text only** — it does NOT
    meet WCAG AA (4.5:1) as small body text on every surface. Any
    information-bearing but de-emphasized text (labels, values, counts, hints
    the user must read) MUST use `fg-tertiary` or stronger. Reserve `fg-muted`
    for purely ornamental text (redundant annotations, watermark-style hints).
- `border`, `border-strong`, `border-soft`, `ring`
- `success`, `warning`, `error`, `info`
- **Accent/semantic AS TEXT:** `primary`, `success`, `warning`, `error`, and
  `info` are FILL colors and can read below WCAG AA (4.5:1) as small text — both
  on a plain surface in the bright/light themes AND, more subtly, as a same-hue
  label on their OWN `bg-<semantic>/15` tint (a badge chip). For links, labels,
  tinted-badge text, or syntax-highlighted values ALWAYS use the AA-tuned same-hue
  `*-strong` text variants, never the raw fill token:
  - `text-primary-strong` (token `primary-text`)
  - `text-success-strong` (token `success-text`)
  - `text-warning-strong` (token `warning-text`)
  - `text-error-strong` (token `error-text`)
  - `text-info-strong` (token `info-text`)

  Each is tuned to clear ≥4.5:1 on its WORST case (the `/15` tint over the
  lightest surface a badge lands on), so `bg-<semantic>/15 text-<semantic>-strong`
  is AA-safe on every theme/mode; where the raw color already clears AA as tint
  text, the variant equals it. Leave the raw fill tokens (`text-success`, etc.)
  only for icon/glyph fills, chart/sparkline strokes, and large decorative marks —
  NOT for small text. (Auditable: `node scripts/contrast.mjs` asserts every
  `*-strong` token on its `/15` tint across all 10 theme/modes.)

Radius: `rounded-sm | rounded-md | rounded-lg | rounded-xl | rounded-2xl |
rounded-3xl` (all derived from `--kronus-radius`; default control surface =
`rounded-lg`).

Shadow: `shadow-xs | shadow-sm | shadow-md | shadow-lg | shadow-glow`.

Fonts: `font-sans | font-display | font-mono`.

Gradients: `bg-gradient-primary`, `bg-gradient-aurora`.

## Canonical example — Button
```tsx
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../lib/cn.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background,box-shadow,transform] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-xs",
        secondary:
          "bg-surface-overlay text-fg border border-border hover:border-border-strong",
        ghost: "text-fg-secondary hover:bg-surface-overlay hover:text-fg",
        outline: "border border-border text-fg hover:bg-surface-overlay",
        destructive: "bg-error text-white hover:opacity-90 shadow-xs",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
```

## Verification
Do NOT run `bun install` or builds — the orchestrator does that once at the
end to avoid races. Just write correct, idiomatic source files.

---

# Compose metadata contract (`registry/meta.json`, data-slots, brand tokens)

The app generator ("Kronus Compose") reads a generated, committed metadata sidecar
`registry/meta.json` next to `index.json`. It is produced by
`packages/cli/scripts/build-registry.ts` and gated by
`packages/cli/scripts/check-registry.ts` (the `registry:check` script). Everything
here is **deterministic**: a pure function of the source indexes + shipped block
sources, with stable key ordering and **no `Date`/timestamps/random**. A timestamp
would break the byte-compare in `registry:check`.

## `meta.json` shape
```jsonc
{
  "registryVersion": "0.4.0",
  "blocks": {
    "navbar": {
      "title": "Navbar",                 // from BLOCK_CATEGORIES[].items[].name
      "description": "…",                // from BLOCK_CATEGORIES[].items[].description
      "category": "marketing",           // the block category slug
      "exportName": "NavbarBlock",       // parsed from the SHIPPED source (see below)
      "kind": "chrome",                  // page | section | chrome | email
      "dataSlots": ["navbar-links"],     // @kronus:data slot names the block carries
      "brandTokens": [{ "token": "brand", "literal": "Kronus" }],
      "variants": [{ "id": "classic", "name": "…", "description": "…" }]
    }
  },
  "components": {
    "button": { "title": "Button", "category": "buttons", "description": "…", "rsc": true }
  },
  "apps": {
    // Bundled app templates read from packages/cli/templates/apps/*.json.
    // Empty ({}) until Milestone B adds them; the generator re-runs then.
    "store": { "title": "Store", "description": "…", "pages": 9 }
  }
}
```
Keys in `blocks`, `components` and `apps` are always **sorted ascending**, so meta
key order never depends on index authoring order or `readdir` order.

## `exportName` rule (what a generated page imports)
`exportName` is extracted from the **shipped block source** (the extracted
no-substitution template-literal text — i.e. the exact bytes `kronus-ui add` writes),
via `/export function (\w+)/`. This is deterministic and matches what actually lands
in the consumer project, so a generated page can `import { <exportName> } from …`.
- A generated page imports this name — so it must be **unique across all blocks**.
  `registry:check` fails on a duplicate `exportName`.
- A block whose shipped source has no `export function <Name>` fails the build.

## `kind` (semantic slot)
`kind ∈ { page | section | chrome | email }` drives the composer's slot validation:
- `page`   — a full-page surface a route can render alone (login, checkout, dashboard…).
- `section`— a stackable page section (hero, pricing, product-grid…). **Default.**
- `chrome` — layout furniture, only valid in a layout slot, never in a page (navbar, footer).
- `email`  — an email template, never rendered in an app route.

`kind` is an **explicit table**, never inferred at runtime: a per-slug override map
(`BLOCK_KIND`) wins, then a category default (`CATEGORY_KIND`, e.g. the whole `email`
category → `email`), then `section`. Change the kind of a block by editing that table.

## Data-slot contract (`@kronus:data`)
A data-slot is a **marker-delimited data const** (never JSX) that the composer may
replace wholesale. Both the preview component **and** its code template literal in the
block family file (`apps/www/lib/blocks/*.tsx`) MUST carry the markers **identically**
(lockstep) — the literal must stay a `NoSubstitutionTemplateLiteral` or `build-registry`
breaks:
```ts
/* @kronus:data navbar-links */
const NAVBAR_LINKS = [{ label: "Features", href: "#features" }];
/* @kronus:data-end */
```
- The set of slots each block must carry is the explicit `BLOCK_DATA_SLOTS` table in
  `build-registry.ts` (Phase 1: `navbar → navbar-links`, `footer → footer-links`).
- **Build gate:** if a block declares a data-slot, its shipped source MUST contain
  both `/* @kronus:data <name> */` and `/* @kronus:data-end */`, or `registry:check` fails.
- Only the body **between** the markers is ever rewritten; the markers stay put.
- The composer replaces the delimited const only — it never edits JSX. This is what
  keeps "generated pages = imports of blocks + `<main>` stacking them" true.

## Brand-token contract (`brandTokens`)
A brand token declares `{ token, literal }` where `literal` is a **plain string that
occurs verbatim in the shipped block source** (e.g. the `Kronus` wordmark in navbar/footer).
- The set is the explicit `BLOCK_BRAND_TOKENS` table in `build-registry.ts`.
- **Build gate:** the `literal` MUST be present verbatim in the shipped source, or
  `registry:check` fails. This proves the anchor exists before the composer replaces it.
- The composer replaces the literal with the app's `--brand` value deterministically.

## Shared demo-data libs (`registry:lib`)
Cohesive demo data lives in **pure-TS `registry:lib` modules** under
`packages/ui/src/lib/`, published alongside `cn`:
- `demo-store.ts` — storefront dataset: `BRAND`, `PRODUCTS`, `CART`, `ORDERS`,
  `REVIEWS`, `RATING_DISTRIBUTION`, `RATING_SUMMARY`, `USER`, `productById`.
- `demo-saas.ts` — SaaS dashboard dataset: `BRAND`, `USER`, `TEAM`, `KPIS`,
  `REVENUE_SERIES`, `ACTIVITY`, `INVOICES`, `USAGE_METERS`, `PLANS`,
  `CURRENT_PLAN_ID`, `planById`.

Rules:
- These modules are **PURE data** — zero React/hooks/JSX — so they are RSC-safe
  and ship as `type: "registry:lib"`, `files[0].target: "lib"`. Keep them that way.
- The registry set of shared libs is the `LIB_MODULES` table in `build-registry.ts`
  (`cn`, `demo-store`, `demo-saas`). A lib's npm `dependencies` are **parsed from its
  own imports** (pure data → none); a lib may depend on another lib via `../lib/<name>.js`.
- **Single source of truth.** The block preview and its code literal both read the
  SAME data. In the family file:
  - the **preview** imports from the package export
    `import { PRODUCTS } from "@kronus-ui/ui/demo-store";` (see below), and
  - the **code literal** carries `import { PRODUCTS } from "../lib/demo-store.js";`
    (kept a `NoSubstitutionTemplateLiteral`). `build-registry` records `demo-store` as
    a `registryDependency` (resolved transitively at `add`/`compose`); `rewriteImports`
    retargets `../lib/<name>.js` → the consumer's `lib` alias.
- **Migrating a block is behaviour-preserving:** replace its inline data array with an
  import of the SAME values from the lib — do not invent new data (visual snapshots +
  preview↔literal byte-equality must stay green).

### Import paths (memorize)
- **Preview (showcase-relative):** `@kronus-ui/ui/demo-store` / `@kronus-ui/ui/demo-saas`
  (package subpath exports; resolves to `packages/ui/src/lib/*` — the single source).
- **Code literal (shipped block source):** `../lib/demo-store.js` / `../lib/demo-saas.js`
  (`build-registry` extracts only the literal; `rewriteImports` rewrites it).

### Brand
The app brand reaches every **visible** surface through the **brandTokens literal-
replacement** path: at compose time `rewriteChromeBlock` runs `replaceBrandLiteral` over
the installed chrome copies (navbar/footer/hero), swapping the shipped `"Kronus"` literal
for the app's `--brand`. There is **no generated `lib/brand.ts`** — compose does not
override the demo datasets' brand.

The demo libs (`demo-store`/`demo-saas`) export their own **standalone `BRAND` default**
(`"Aurora Audio"` / `"Northwind"`) — the demo store/app **name** used when the dataset is
consumed on its own (`kronus-ui add demo-store`). It is a demo default, not a compose
override; compose leaves it untouched.

## Editing a block family file
Any edit to `apps/www/lib/blocks/*.tsx` that touches a block with markers/brand tokens
must change the **preview component AND its code template literal identically**, and
keep the code literal a `NoSubstitutionTemplateLiteral`. Run `bun run -F kronus-ui registry`
and commit `registry/` (including `meta.json`), then `bun run registry:check` must pass.
