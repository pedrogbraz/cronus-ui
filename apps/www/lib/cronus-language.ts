/** Native `.cronus` catalog — kernel emits HTML; this site documents how to run it. */

export const CRONUS_CATALOG_ORIGIN =
  process.env.NEXT_PUBLIC_CRONUS_CATALOG_ORIGIN ?? "http://127.0.0.1:5311";

export type CronusCatalogKind = "dedicated" | "interact";

export interface CronusCatalogFamily {
  family: string;
  kind: CronusCatalogKind;
}

export const CRONUS_HOW_IT_WORKS = [
  {
    step: "1",
    title: "You declare",
    body: "A .cronus file names the app, theme, pages, and widgets. No JSX, no HTML, no CSS, no template blocks.",
  },
  {
    step: "2",
    title: "The kernel emits",
    body: "cronus run parses the file and serves HTML, --cronus-* tokens, and motion. React never loads.",
  },
  {
    step: "3",
    title: "The browser shows product UI",
    body: "style:button+primary+md becomes a CONTRACT button. style:primary without button+ is still the legacy Obsidian button — always write the family.",
  },
] as const;

export const CRONUS_RULES = [
  "Never paste JSX, HTML, CSS, template, or style_block into .cronus.",
  "Always write style:<family>+<variant> (button+primary). style:primary alone hijacks Obsidian.",
  "Open the kit at 127.0.0.1, not localhost — the kernel binds IPv4 only.",
  "Charts and FX stay off the shelf until they have a dedicated renderer.",
] as const;

/** Families declared in `cronus-kernel/demos/cronus-ui-catalog/app.cronus`. */
export const CRONUS_CATALOG_FAMILIES: CronusCatalogFamily[] = [
  { family: "button", kind: "dedicated" },
  { family: "badge", kind: "dedicated" },
  { family: "input", kind: "dedicated" },
  { family: "label", kind: "dedicated" },
  { family: "textarea", kind: "dedicated" },
  { family: "checkbox", kind: "dedicated" },
  { family: "switch", kind: "dedicated" },
  { family: "spinner", kind: "dedicated" },
  { family: "separator", kind: "dedicated" },
  { family: "kbd", kind: "dedicated" },
  { family: "toggle", kind: "dedicated" },
  { family: "progress", kind: "dedicated" },
  { family: "alert", kind: "dedicated" },
  { family: "skeleton", kind: "dedicated" },
  { family: "banner", kind: "dedicated" },
  { family: "slider", kind: "dedicated" },
  { family: "radio-group", kind: "dedicated" },
  { family: "chip", kind: "dedicated" },
  { family: "avatar", kind: "dedicated" },
  { family: "card", kind: "dedicated" },
  { family: "empty", kind: "dedicated" },
  { family: "select", kind: "dedicated" },
  { family: "dialog", kind: "dedicated" },
  { family: "tabs", kind: "dedicated" },
  { family: "accordion", kind: "dedicated" },
  { family: "table", kind: "dedicated" },
  { family: "pagination", kind: "dedicated" },
  { family: "breadcrumb", kind: "dedicated" },
  { family: "tooltip", kind: "dedicated" },
  { family: "password-input", kind: "dedicated" },
  { family: "number-input", kind: "dedicated" },
  { family: "hover-card", kind: "dedicated" },
  { family: "dropdown-menu", kind: "dedicated" },
  { family: "toast", kind: "interact" },
  { family: "metric", kind: "dedicated" },
  { family: "sheet", kind: "dedicated" },
  { family: "popover", kind: "dedicated" },
  { family: "date-picker", kind: "dedicated" },
  { family: "time-picker", kind: "dedicated" },
  { family: "rating", kind: "dedicated" },
  { family: "copy-button", kind: "dedicated" },
  { family: "combobox", kind: "dedicated" },
];

export const CRONUS_CATALOG_SOURCE = `app "CronusUICatalog" {
  port 5311
}

style {
  theme dark
  preset aurora
}

component Save layout:inline style:button+primary+md {
  label "Save"
}

component Plan layout:stack style:select {
  label "Plan"
  item "Free"
  item "Pro"
}

page "/" type:custom {
  title "Cronus UI"
  section hero {
    badge "Language"
    title "Native catalog"
    subtitle "Declare widgets. The kernel emits HTML."
    cta "Open kit" -> "/kit" primary
  }
}

page "/kit" type:components {
  title "Kit"
}`;

export const CRONUS_CATALOG_RUN = `# Terminal 1 — kernel catalog (IPv4)
cd cronus-kernel
cargo build
cd demos/cronus-ui-catalog
../../target/debug/cronus run

# http://127.0.0.1:5311/      landing
# http://127.0.0.1:5311/kit   every declared widget

# Terminal 2 — this docs site
cd cooud-ui
bun run www

# http://127.0.0.1:4747/language`;
