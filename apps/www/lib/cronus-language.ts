/** Native `.cronus` catalog surface — kernel emits HTML, this site only documents it. */

export const CRONUS_CATALOG_ORIGIN =
  process.env.NEXT_PUBLIC_CRONUS_CATALOG_ORIGIN ?? "http://127.0.0.1:5311";

export type CronusCatalogKind = "dedicated" | "interact";

export interface CronusCatalogFamily {
  family: string;
  kind: CronusCatalogKind;
}

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
  { family: "hover-card", kind: "interact" },
  { family: "dropdown-menu", kind: "interact" },
  { family: "toast", kind: "interact" },
  { family: "metric", kind: "interact" },
  { family: "sheet", kind: "interact" },
  { family: "popover", kind: "interact" },
  { family: "date-picker", kind: "interact" },
  { family: "time-picker", kind: "interact" },
  { family: "rating", kind: "interact" },
  { family: "copy-button", kind: "interact" },
  { family: "combobox", kind: "interact" },
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
  use Save
  use Plan
}`;

export const CRONUS_CATALOG_RUN = `cd cronus-kernel/demos/cronus-ui-catalog
cronus run
# http://localhost:5311/     hero
# http://localhost:5311/kit  every declared widget`;
