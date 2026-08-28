#!/usr/bin/env node
import { existsSync, readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  ASSISTANTS,
  type Assistant,
  DEFAULT_PRESET,
  DOCTRINE_PRESETS,
  type DoctrinePreset,
  parseList,
  SKILLS,
  type Skill,
  writeAiKit,
  writeDesignDocuments,
} from "@cronus-ui/ai-kit";
import { composeTemplate } from "./compose.js";
import { runInstall, scaffold } from "./scaffold.js";
import {
  c,
  DEFAULT_MODE,
  DEFAULT_TEMPLATE,
  DEFAULT_THEME,
  dirNameFromProjectName,
  isComposedTemplate,
  isValidProjectName,
  log,
  MODES,
  type ModeName,
  PACKAGE_MANAGERS,
  type PackageManager,
  promptConfirm,
  promptSelect,
  TEMPLATE_APPEARANCE,
  TEMPLATE_HINTS,
  TEMPLATES,
  type TemplateName,
  THEME_HINTS,
  THEMES,
  type Theme,
} from "./utils.js";
import { CREATE_VERSION } from "./version.js";

export const HELP = `${c.bold("create-cronus-app")} — scaffold a Next.js + Cronus UI app.

${c.bold("Usage")}
  create-cronus-app [project-name] [options]

${c.bold("Options")}
  --template <name>          Starter template (default: ${DEFAULT_TEMPLATE}).
                             Bundled: default, dashboard, marketing.
                             Composed: store, landing, saas, landing-* flavors, and Pro pack (mail, chat, finance).
  --theme <${THEMES.join("|")}>
                             Theme preset to bake in (default: ${DEFAULT_THEME})
  --mode <${MODES.join("|")}>            Default color mode (default: ${DEFAULT_MODE})
  --ai / --no-ai             Include (or skip) the AI Kit: skills, rules & doctrine.
                             DESIGN.md still ships with --no-ai.
  --assistants <${ASSISTANTS.join(",")}|all|none>
                             Which assistants to configure (default: all).
                             Codex CLI and Zed read the root AGENTS.md natively.
  --preset <${DOCTRINE_PRESETS.join("|")}>
                             Which engineering doctrine to ship (default: standard)
  --skills <name,...|all|none>
                             Which Claude Code skills to include (default: all)
  --pm <bun|npm|pnpm|yarn>   Package manager to install with (auto-detected otherwise)
  --no-install               Skip installing dependencies
  -y, --yes                  Accept defaults; skip interactive prompts
  -h, --help                 Show this help
  -v, --version              Show the version

${c.bold("Examples")}
  npx create-cronus-app my-app --template saas
  npx create-cronus-app my-app --template landing-studio
  npx create-cronus-app my-app --template mail
  npx create-cronus-app my-app --template dashboard
  npx create-cronus-app my-app --theme sunset --mode light
  npx create-cronus-app my-app --ai --assistants claude,cursor --preset fintech
  npx create-cronus-app my-app --no-ai --pm pnpm --yes
`;

interface ParsedCli {
  /** Project name from positional arg, or undefined to prompt. */
  name?: string;
  pm?: PackageManager;
  install: boolean;
  /** Template from `--template`, or undefined to prompt. */
  template?: TemplateName;
  /** Theme from `--theme`, or undefined to prompt. */
  theme?: Theme;
  /** Mode from `--mode`, or undefined to prompt. */
  mode?: ModeName;
  /** `--yes`: accept defaults, skip prompts (also implied when not a TTY). */
  yes: boolean;
  /** AI Kit: true (`--ai`) / false (`--no-ai`) / undefined (decide later). */
  ai?: boolean;
  /** Assistants to configure (defaults to all). */
  assistants?: readonly Assistant[];
  /** Doctrine preset (defaults to "standard"). */
  preset?: DoctrinePreset;
  /** Claude Code skills to include (defaults to all). */
  skills?: readonly Skill[];
}

/**
 * Parse argv into options. Throws a friendly Error on bad input (unknown flag,
 * invalid `--pm`) so the caller can print and exit non-zero.
 */
export function parseCli(argv: string[]): ParsedCli {
  // `node:util` parseArgs has no built-in `--no-foo` negation, so we declare an
  // explicit `no-install` flag rather than rely on a `--no-install` convention.
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      template: { type: "string" },
      theme: { type: "string" },
      mode: { type: "string" },
      ai: { type: "boolean", default: false },
      "no-ai": { type: "boolean", default: false },
      assistants: { type: "string" },
      preset: { type: "string" },
      skills: { type: "string" },
      pm: { type: "string" },
      "no-install": { type: "boolean", default: false },
      yes: { type: "boolean", short: "y", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });

  if (values.help) return { install: true, yes: false, name: "--help" };
  if (values.version) return { install: true, yes: false, name: "--version" };

  const pm = values.pm;
  if (pm !== undefined && !PACKAGE_MANAGERS.includes(pm as PackageManager)) {
    throw new Error(`Unknown --pm "${pm}". Use one of: ${PACKAGE_MANAGERS.join(", ")}.`);
  }

  const template = values.template;
  if (template !== undefined && !TEMPLATES.includes(template as TemplateName)) {
    throw new Error(`Unknown --template "${template}". Use one of: ${TEMPLATES.join(", ")}.`);
  }

  const theme = values.theme;
  if (theme !== undefined && !THEMES.includes(theme as Theme)) {
    throw new Error(`Unknown --theme "${theme}". Use one of: ${THEMES.join(", ")}.`);
  }

  const mode = values.mode;
  if (mode !== undefined && !MODES.includes(mode as ModeName)) {
    throw new Error(`Unknown --mode "${mode}". Use one of: ${MODES.join(", ")}.`);
  }

  const preset = values.preset;
  if (preset !== undefined && !DOCTRINE_PRESETS.includes(preset as DoctrinePreset)) {
    throw new Error(`Unknown --preset "${preset}". Use one of: ${DOCTRINE_PRESETS.join(", ")}.`);
  }

  // `parseList` validates each token and expands "all"/empty to the full set.
  const assistants = parseList(values.assistants, ASSISTANTS, "assistant");
  const skills = parseList(values.skills, SKILLS, "skill");

  return {
    name: positionals[0],
    pm: pm as PackageManager | undefined,
    install: !values["no-install"],
    template: template as TemplateName | undefined,
    theme: theme as Theme | undefined,
    mode: mode as ModeName | undefined,
    yes: values.yes,
    ai: values["no-ai"] ? false : values.ai ? true : undefined,
    assistants,
    preset: (preset as DoctrinePreset | undefined) ?? DEFAULT_PRESET,
    skills,
  };
}

/** Prompt for a project name on the TTY; falls back to the default when piped. */
async function promptName(defaultName: string): Promise<string> {
  if (!process.stdin.isTTY) return defaultName;
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (
      await rl.question(`${c.bold("Project name")} ${c.dim(`(${defaultName})`)} `)
    ).trim();
    return answer || defaultName;
  } finally {
    rl.close();
  }
}

/** Detect a package manager from the npm user-agent (set when run via npx/pnpm dlx). */
function detectPackageManager(): PackageManager {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("bun")) return "bun";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  return "npm";
}

async function main(): Promise<void> {
  const parsed = parseCli(process.argv.slice(2));

  if (parsed.name === "--help") {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  if (parsed.name === "--version") {
    process.stdout.write(`${CREATE_VERSION}\n`);
    return;
  }

  log.intro();

  const name = parsed.name ?? (await promptName("my-cronus-app"));

  if (!isValidProjectName(name)) {
    log.error(
      `"${name}" is not a valid package name. Use lowercase letters, digits, "-", "_", "." ` +
        `(optionally scoped, e.g. @scope/name).`,
    );
    process.exitCode = 1;
    return;
  }

  const dirName = dirNameFromProjectName(name);
  const targetDir = join(process.cwd(), dirName);
  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    log.error(`Directory "${dirName}" already exists and is not empty.`);
    process.exitCode = 1;
    return;
  }

  // Template + theme + mode: an explicit flag wins; otherwise prompt on a TTY
  // (unless --yes), and fall back to the ship defaults when piped/CI.
  const template =
    parsed.template ??
    (parsed.yes
      ? DEFAULT_TEMPLATE
      : await promptSelect("Template", TEMPLATES, DEFAULT_TEMPLATE, TEMPLATE_HINTS));
  const appearance = TEMPLATE_APPEARANCE[template];
  const theme =
    parsed.theme ??
    (parsed.yes
      ? (appearance?.theme ?? DEFAULT_THEME)
      : await promptSelect("Theme", THEMES, appearance?.theme ?? DEFAULT_THEME, THEME_HINTS));
  const mode =
    parsed.mode ??
    (parsed.yes
      ? (appearance?.mode ?? DEFAULT_MODE)
      : await promptSelect("Default mode", MODES, appearance?.mode ?? DEFAULT_MODE));

  log.step(`Scaffolding into ${c.cyan(dirName)}…`);
  const { fileCount } = scaffold({ targetDir, name, theme, mode, template });
  log.ok(
    `Created ${fileCount} files (${c.cyan(template)} template, ${c.cyan(theme)} theme, ${mode} mode).`,
  );

  // Cronus Compose: store/landing scaffold the `default` base above, then generate
  // their pages + chrome from validated registry blocks. The blocks pull npm deps
  // (e.g. lucide-react) that the base package.json lacks, so let compose record +
  // install them via `pm add` when installing is enabled; a following `--no-install`
  // scaffold records nothing (matching `cronus-ui add --no-install`).
  if (isComposedTemplate(template)) {
    log.step(`Composing the ${c.cyan(template)} app from validated blocks…`);
    const composed = await composeTemplate({
      targetDir,
      template,
      brand: name,
      skipInstall: !parsed.install,
    });
    if (composed.ok) {
      log.ok(
        `Composed ${composed.pageCount} page(s) from ${composed.blockCount} validated block(s).`,
      );
    } else {
      log.warn(
        `Skipped composition (${composed.reason}). The ${c.cyan("default")} app was scaffolded; ` +
          `run ${c.cyan(`npx cronus-ui compose ${template}`)} once the registry ships meta.json.`,
      );
    }
  }

  // AI Kit: skills, rules & doctrine for Claude Code / Cursor / Copilot.
  const wantAi =
    parsed.ai ??
    (parsed.yes
      ? true
      : await promptConfirm("Add the AI Kit (skills, rules & doctrine for AI assistants)?", true));
  if (wantAi) {
    const assistants = parsed.assistants ?? ASSISTANTS;
    const preset = parsed.preset ?? DEFAULT_PRESET;
    const skills = parsed.skills ?? SKILLS;
    const { written } = writeAiKit({
      targetDir,
      name,
      assistants,
      preset,
      skills,
      theme,
    });
    log.ok(
      `AI Kit added — ${written.length} files for ${assistants.join(", ")} (${preset} doctrine).`,
    );
  } else {
    const { written } = writeDesignDocuments(targetDir, { theme });
    if (written.length > 0) {
      log.ok("DESIGN.md added (visual taste).");
    }
  }

  const pm = parsed.pm ?? detectPackageManager();

  if (parsed.install) {
    log.step(`Installing dependencies with ${c.cyan(pm)}…`);
    try {
      runInstall(pm, targetDir);
      log.ok("Dependencies installed.");
    } catch (err) {
      log.warn(`Install failed (${(err as Error).message}). Install manually later.`);
    }
  }

  log.outro(dirName, pm, parsed.install, template);
}

/** True when this module is the process entry point (not imported by a test). */
function isEntrypoint(): boolean {
  const entry = argv[1];
  if (!entry) return false;
  return existsSync(entry) && fileURLToPath(import.meta.url) === realpathSync(entry);
}

if (isEntrypoint()) {
  main().catch((err: unknown) => {
    log.error((err as Error).message);
    process.exitCode = 1;
  });
}
