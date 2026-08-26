import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import {
  ASSISTANTS,
  type Assistant,
  DOCTRINE_PRESETS,
  type DoctrinePreset,
  parseList,
  SKILLS,
  type Skill,
  writeAiKit,
} from "@kronus-ui/ai-kit";
import { log } from "../utils.js";

interface AiOptions {
  cwd: string;
  assistants?: string;
  preset?: string;
  skills?: string;
}

/** Read the project name from `<cwd>/package.json`, falling back to the dir name. */
async function projectName(cwd: string): Promise<string> {
  try {
    const raw = await readFile(join(cwd, "package.json"), "utf8");
    const parsed = JSON.parse(raw) as { name?: unknown };
    if (typeof parsed.name === "string" && parsed.name.trim() !== "") return parsed.name;
  } catch {
    // No/invalid package.json — fall back to the directory basename below.
  }
  return basename(cwd);
}

/**
 * Scaffold the Kronus UI AI Kit (AGENTS.md doctrine + Claude Code / Cursor /
 * Copilot config) into the project. Writes are idempotent: existing files are
 * left untouched, so re-running only fills in what is missing.
 */
export async function aiAdd(options: AiOptions): Promise<void> {
  const { cwd } = options;

  let assistants: readonly Assistant[];
  let skills: readonly Skill[];
  try {
    assistants = parseList(options.assistants, ASSISTANTS, "assistant");
    skills = parseList(options.skills, SKILLS, "skill");
  } catch (err) {
    log.err((err as Error).message);
    process.exitCode = 1;
    return;
  }

  const preset: DoctrinePreset = options.preset ? (options.preset as DoctrinePreset) : "standard";
  if (!DOCTRINE_PRESETS.includes(preset)) {
    log.err(`Unknown preset "${options.preset}". Use one of: ${DOCTRINE_PRESETS.join(", ")}.`);
    process.exitCode = 1;
    return;
  }

  const name = await projectName(cwd);

  log.title(`Adding the Kronus UI AI Kit to ${name}`);
  log.step(`Assistants: ${assistants.join(", ")} · doctrine: ${preset}`);

  const { written, skipped } = writeAiKit({ targetDir: cwd, name, assistants, preset, skills });

  for (const path of written) log.ok(`Wrote ${path}`);
  if (skipped.length > 0) {
    log.step(`Skipped ${skipped.length} existing file(s) (idempotent — never clobbered):`);
    for (const path of skipped) log.step(`  ${path}`);
  }

  if (written.length === 0) {
    log.title("Nothing to do — the AI Kit is already in place.");
  } else {
    log.title(`Done — ${written.length} file(s) written.`);
  }
}
