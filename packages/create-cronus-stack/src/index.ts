#!/usr/bin/env node
import { existsSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { argv } from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
  CLI_FLAGS,
  catalog,
  flagValue,
  resolveStackFlags,
  type StackFlagValues,
  sanitizeProjectName,
} from "@cronus-ui/stack";
import { assertWritableTarget, initGit, runInstall, scaffoldStack } from "./scaffold.js";
import { c, log, packageManagerFromConfig } from "./utils.js";
import { CREATE_STACK_VERSION } from "./version.js";

const STACK_FLAG_OPTIONS = Object.fromEntries(
  CLI_FLAGS.map(({ flag }) => [flag, { type: "string" as const }]),
);

export function stackFlagHelpLines(): string {
  return CLI_FLAGS.map(({ catId, flag, kind }) => {
    const category = catalog.find((candidate) => candidate.id === catId);
    const values = category?.options.map((option) => flagValue(option.id)).join("|") ?? "value";
    const suffix = kind === "multi" ? " — comma-separated list or none" : "";
    return `  --${flag} <${values}>${suffix}`;
  }).join("\n");
}

const HELP = `${c.bold("create-cronus-stack")} — scaffold from the Cronus Stack Builder.

${c.bold("Usage")}
  create-cronus-stack [project-name] [options]
  bun create cronus-stack@latest [project-name] [options]

${c.bold("Stack flags")}
${stackFlagHelpLines()}
  --vibe
  --git / --no-git
  --install / --no-install
  -y, --yes                  Accept defaults
  -h, --help                 Show this help
  -v, --version              Show the version

${c.bold("Examples")}
  bun create cronus-stack@latest my-app --yes --no-install
  bun create cronus-stack@latest admin --web next --ui cronus --ai claude-code,cursor
`;

interface ParsedCli {
  name: string;
  yes: boolean;
  help: boolean;
  version: boolean;
  values: StackFlagValues;
}

export function parseCli(args: string[]): ParsedCli {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      ...STACK_FLAG_OPTIONS,
      vibe: { type: "boolean", default: false },
      git: { type: "boolean", default: false },
      "no-git": { type: "boolean", default: false },
      install: { type: "boolean", default: false },
      "no-install": { type: "boolean", default: false },
      yes: { type: "boolean", short: "y", default: false },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "v", default: false },
    },
  });

  return {
    name: sanitizeProjectName(positionals[0] ?? "my-cronus-app"),
    yes: values.yes === true,
    help: values.help === true,
    version: values.version === true,
    values: values as StackFlagValues,
  };
}

async function main(): Promise<void> {
  const parsed = parseCli(process.argv.slice(2));
  if (parsed.help) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  if (parsed.version) {
    process.stdout.write(`${CREATE_STACK_VERSION}\n`);
    return;
  }

  log.intro();

  if (!parsed.yes && process.stdin.isTTY) {
    log.warn("Using Stack Builder defaults. Pass flags or -y to skip this notice.");
  }

  const config = resolveStackFlags(parsed.values, { catalog });
  const targetDir = join(process.cwd(), parsed.name);
  assertWritableTarget(targetDir);

  log.step(`Scaffolding into ${c.cyan(parsed.name)}…`);
  const result = scaffoldStack({ targetDir, projectName: parsed.name, config, catalog });
  log.ok(`Created ${result.fileCount} files.`);
  for (const note of result.unsupported) log.warn(note);

  if (config.git === true) {
    try {
      log.step("Initializing git repository…");
      initGit(targetDir);
      log.ok("Git initialized.");
    } catch (err) {
      log.warn(`Git init failed (${(err as Error).message}).`);
    }
  }

  const pm = packageManagerFromConfig(config);
  if (config.install === true) {
    try {
      log.step(`Installing dependencies with ${c.cyan(pm)}…`);
      runInstall(pm, targetDir);
      log.ok("Dependencies installed.");
    } catch (err) {
      log.warn(`Install failed (${(err as Error).message}). Install manually later.`);
    }
  }

  log.outro(parsed.name, pm, config.install === true);
}

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
