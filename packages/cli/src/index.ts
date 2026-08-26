#!/usr/bin/env node
import { Command } from "commander";
import { add } from "./commands/add.js";
import { addPageCommand } from "./commands/add-page.js";
import { aiAdd } from "./commands/ai.js";
import { compose } from "./commands/compose.js";
import { diff } from "./commands/diff.js";
import { init } from "./commands/init.js";
import { list } from "./commands/list.js";
import { themeAdd, themeSet } from "./commands/theme.js";
import { upgrade } from "./commands/upgrade.js";
import { CLI_VERSION } from "./config.js";

const program = new Command();

program
  .name("cronus-ui")
  .description("Add Cronus UI components to your project, shadcn-style.")
  .version(CLI_VERSION);

program
  .command("init")
  .description("Set up cronus-ui.json, the cn() helper, and base dependencies.")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option("-y, --yes", "overwrite an existing cronus-ui.json")
  .option("--skip-install", "do not install base dependencies")
  .action((opts) =>
    init({
      cwd: opts.cwd,
      registry: opts.registry,
      yes: opts.yes,
      skipInstall: opts.skipInstall,
    }),
  );

program
  .command("add")
  .description("Add one or more components (resolves dependencies).")
  .argument("[components...]", "component names")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option("-o, --overwrite", "overwrite existing files")
  .option("--skip-install", "do not install npm dependencies")
  .action((components, opts) =>
    add(components, {
      cwd: opts.cwd,
      registry: opts.registry,
      overwrite: opts.overwrite,
      skipInstall: opts.skipInstall,
    }),
  );

program
  .command("compose")
  .description(
    "Generate a full app from a validated template (pages + chrome from installed blocks).",
  )
  .argument("[template]", "app template name (e.g. store, landing)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option(
    "-m, --manifest <file>",
    "compose from an explicit manifest file instead of a bundled template",
  )
  .option("--pages <list>", "comma-separated route subset (e.g. /,products,login)")
  .option("--variant <pair...>", "block variant selection, e.g. --variant login=split (F2)")
  .option("-b, --brand <name>", "brand wordmark baked into chrome/hero")
  .option("-s, --seed <n>", "aesthetic PRNG seed (recorded for reproducibility)")
  .option("-o, --overwrite", "overwrite existing files")
  .option("--skip-install", "do not install npm dependencies")
  .option("--dry-run", "print the validated plan + per-file preview, write nothing")
  .option("-y, --yes", "non-interactive: pick the first template if none is given")
  .action((template, opts) =>
    compose(template, {
      cwd: opts.cwd,
      registry: opts.registry,
      manifest: opts.manifest,
      pages: opts.pages,
      variant: opts.variant,
      brand: opts.brand,
      seed: opts.seed,
      overwrite: opts.overwrite,
      skipInstall: opts.skipInstall,
      dryRun: opts.dryRun,
      yes: opts.yes,
    }),
  );

program
  .command("add-page")
  .description(
    "Add one page to an already-composed app (installs new blocks, updates the nav + composed record).",
  )
  .requiredOption("--route <route>", "route to add, e.g. /faq")
  .requiredOption("--blocks <list>", "comma-separated blocks, e.g. faq,cta (or login=split)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option("--chrome <group>", "chrome group for the page (default: the app's first group)")
  .option("--title <title>", "page <title> (default: Title-Cased route)")
  .option("--nav <label>", "nav label; adds the page to the chrome nav")
  .option("--app <name>", "which composed app to extend (required if the project has >1)")
  .option("-m, --manifest <file>", "reload the manifest from a file (for --manifest-composed apps)")
  .option("-o, --overwrite", "replace the page if the route already exists")
  .option("--skip-install", "do not install npm dependencies")
  .option("--dry-run", "print the plan + files that would be written, write nothing")
  .action((opts) =>
    addPageCommand({
      cwd: opts.cwd,
      route: opts.route,
      blocks: opts.blocks,
      chrome: opts.chrome,
      title: opts.title,
      nav: opts.nav,
      app: opts.app,
      manifest: opts.manifest,
      overwrite: opts.overwrite,
      skipInstall: opts.skipInstall,
      dryRun: opts.dryRun,
      registry: opts.registry,
    }),
  );

program
  .command("list")
  .alias("ls")
  .description("List all components available in the registry.")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .action((opts) => list({ cwd: opts.cwd, registry: opts.registry }));

program
  .command("diff")
  .description(
    "Show which installed components have drifted from the registry (run `cronus-ui upgrade` to merge updates without losing local edits).",
  )
  .argument("[components...]", "component names (default: all)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .action((components, opts) => diff(components, { cwd: opts.cwd, registry: opts.registry }));

program
  .command("upgrade")
  .description(
    "Upgrade installed components and composed pages/layouts to the current release, keeping your local edits.",
  )
  .argument("[components...]", "component names (or use --all)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("-r, --registry <source>", "registry URL or local directory")
  .option("-a, --all", "upgrade every component recorded in cronus-ui.json")
  .option("--dry-run", "print the per-file plan (fast-forward / merge / conflict), write nothing")
  .option("-y, --yes", "assume yes: write conflict markers and confirmed overwrites without asking")
  .option(
    "-o, --overwrite",
    "components installed before the manifest existed: replace local files with upstream",
  )
  .option(
    "-m, --manifest <file>",
    "reload composed apps from this manifest file (for --manifest-composed apps)",
  )
  .addHelpText(
    "after",
    `
How it works:
  Each component's installed release is recorded in cronus-ui.json ("installed").
  upgrade 3-way merges base (that release), local (your file) and upstream (the
  current release) with \`git merge-file --diff3\`, so upstream fixes land WITHOUT
  losing your edits. Clean merges are written; conflicts are written with markers
  only if you confirm (or --yes). Unresolved files get a ready-to-paste coding
  agent prompt in CRONUS-UPGRADE.md.

  \`upgrade --all\` also 3-way-merges composed pages and layouts against their
  \`.cronus-ui/base/<template>/\` snapshot (same decision matrix). Named
  \`upgrade button\` does not touch composed pages. Custom --manifest apps must
  re-supply --manifest.

Examples:
  cronus-ui upgrade --all --dry-run    preview the plan for everything installed
  cronus-ui upgrade button card        upgrade two components
  cronus-ui upgrade --all --yes        upgrade all, accept conflict markers`,
  )
  .action((components, opts) =>
    upgrade(components, {
      cwd: opts.cwd,
      registry: opts.registry,
      all: opts.all,
      dryRun: opts.dryRun,
      yes: opts.yes,
      overwrite: opts.overwrite,
      manifestPath: opts.manifest,
    }),
  );

const theme = program.command("theme").description("Manage the app's Cronus UI theme preset.");
theme
  .command("set")
  .description("Switch the theme preset (and optionally the color mode).")
  .argument("<name>", "theme preset (aurora, neutral, midnight, sunset, emerald)")
  .option("-m, --mode <mode>", "color mode (dark or light)")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .action((name, opts) => themeSet({ name, mode: opts.mode, cwd: opts.cwd }));
theme
  .command("add")
  .description(
    "Apply a theme built in the Create Studio (permalink URL, bare c= payload, or exported theme JSON file).",
  )
  .argument("<source>", "Create Studio permalink, c= payload, or path to a theme JSON export")
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option("--css <file>", "globals CSS file for the overrides block (default: auto-detect)")
  .option("--dry-run", "print what would be applied, write nothing")
  .action((source, opts) =>
    themeAdd({ source, cwd: opts.cwd, css: opts.css, dryRun: opts.dryRun }),
  );

program
  .command("ai")
  .description(
    "Add the AI Kit (AGENTS.md doctrine + Claude Code / Cursor / Copilot / Windsurf / Gemini config).",
  )
  .option("-c, --cwd <dir>", "working directory", process.cwd())
  .option(
    "-a, --assistants <list>",
    "comma-separated: claude, cursor, copilot, windsurf, gemini (or 'all'/'none')",
  )
  .option(
    "-p, --preset <name>",
    "doctrine preset: standard, fintech, saas, oss, agency, or none",
    "standard",
  )
  .option("-s, --skills <list>", "comma-separated Claude Code skills (or 'all'/'none')")
  .action((opts) =>
    aiAdd({
      cwd: opts.cwd,
      assistants: opts.assistants,
      preset: opts.preset,
      skills: opts.skills,
    }),
  );

program.parseAsync(process.argv);
