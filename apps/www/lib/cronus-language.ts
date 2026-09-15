/** Native `.cronus` catalog — kernel emits HTML; this site documents how to run it. */
import { SCOREBOARD } from "./audit/scoreboard";

export const CRONUS_CATALOG_ORIGIN =
  process.env.NEXT_PUBLIC_CRONUS_CATALOG_ORIGIN ?? "http://127.0.0.1:5311";

export type CronusCatalogKind = "dedicated" | "stub";

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
  "Stub families parse and render a placeholder until they get a dedicated renderer.",
] as const;

/**
 * Families in the kernel registry (`FAMILY_TABLE` in cronus_ui_widgets.rs at
 * the pinned `cronus-kernel.ref`), read from the committed parity scoreboard.
 * Regenerate with `bun run audit:scoreboard -- --date <day>`.
 */
export const CRONUS_CATALOG_FAMILIES: CronusCatalogFamily[] = SCOREBOARD.families.flatMap(
  (item): CronusCatalogFamily[] => {
    if (item.status === "ported") return [{ family: item.family, kind: "dedicated" }];
    if (item.status === "stub") return [{ family: item.family, kind: "stub" }];
    return [];
  },
);

export const CRONUS_KERNEL_REF = SCOREBOARD.kernelRef;

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
