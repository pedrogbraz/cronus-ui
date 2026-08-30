import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { designMarkdown, isLookName, isThemeName } from "@cronus-ui/tokens";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * AI assistants we generate config FILES for. Codex CLI and Zed additionally
 * read the repo-root `AGENTS.md` natively, so they are covered by the doctrine
 * without a dedicated file (no separate entry needed).
 */
export const ASSISTANTS = ["claude", "cursor", "copilot", "windsurf", "gemini"] as const;
export type Assistant = (typeof ASSISTANTS)[number];
export const DEFAULT_ASSISTANTS: readonly Assistant[] = ASSISTANTS;

/**
 * Doctrine presets. `standard` = the generic base doctrine; the domain presets
 * append a specialized addendum (`AGENTS.<preset>.md`); `none` = no doctrine.
 */
export const DOCTRINE_PRESETS = ["standard", "fintech", "saas", "oss", "agency", "none"] as const;
export type DoctrinePreset = (typeof DOCTRINE_PRESETS)[number];
export const DEFAULT_PRESET: DoctrinePreset = "standard";

/** The curated Claude Code skills that ship with the kit. */
export const SKILLS = [
  "ui-add",
  "theme",
  "compose",
  "upgrade",
  "code-review",
  "ship-pr",
  "evidence-check",
] as const;
export type Skill = (typeof SKILLS)[number];
export const DEFAULT_SKILLS: readonly Skill[] = SKILLS;
const CRONUS_UI_SKILLS: ReadonlySet<Skill> = new Set(["ui-add", "theme", "compose", "upgrade"]);

export interface AiKitOptions {
  /** Absolute path of the (already scaffolded) project. */
  targetDir: string;
  /** Package name, substituted for the __APP_NAME__ token. */
  name: string;
  /** Which assistants to write config for. @default all */
  assistants?: readonly Assistant[];
  /** Which doctrine to ship. @default "standard" */
  preset?: DoctrinePreset;
  /** Which Claude Code skills to include. @default all */
  skills?: readonly Skill[];
  /** Whether to emit Cronus UI-specific rules/skills. @default true */
  includeCronusUi?: boolean;
  /**
   * Whether to emit the cronus-ui MCP config. Defaults to the legacy Claude
   * behavior unless explicitly selected by a stack scaffold.
   */
  cronusUiMcp?: boolean;
  /** Palette baked into DESIGN.md. Unknown names fall back to Aurora. */
  theme?: string;
  /** Look baked into DESIGN.md. Unknown names fall back to Default. */
  look?: string;
}

export interface AiKitResult {
  /** Relative paths written (fresh files only). */
  written: string[];
  /** Relative paths skipped because they already existed (never clobbered). */
  skipped: string[];
}

/** Replace template tokens (currently just the app name) in file content. */
function applyTokens(content: string, name: string): string {
  return content.replaceAll("__APP_NAME__", name);
}

/** Locate the bundled `templates` dir, whether running from `src` or `dist`. */
function templatesRoot(): string {
  const candidates = [join(HERE, "..", "templates"), join(HERE, "..", "..", "templates")];
  const found = candidates.find((p) => existsSync(join(p, "AGENTS.base.md")));
  if (!found) {
    throw new Error(
      `Could not locate @cronus-ui/ai-kit templates (looked in: ${candidates.join(", ")}).`,
    );
  }
  return found;
}

/**
 * Write the AI Kit into `targetDir`, honoring the chosen assistants, doctrine
 * preset, and skill set. Every write is **idempotent and non-destructive**: an
 * existing file is left untouched and reported under `skipped`, so re-running
 * against a project with hand-edited AI config never clobbers it.
 *
 * When `preset` is `"none"`, no doctrine (`AGENTS.md`) is written, so the
 * artifacts that reference it — `CLAUDE.md`, the doctrine Cursor rule, the
 * Copilot digest — are skipped too; only assistant-local tooling ships.
 *
 * When `includeCronusUi` is false, the generic doctrine/tooling remains, but
 * Cronus UI-specific rules and skills are not emitted.
 */
export function writeAiKit(options: AiKitOptions): AiKitResult {
  const {
    targetDir,
    name,
    assistants = DEFAULT_ASSISTANTS,
    preset = DEFAULT_PRESET,
    skills = DEFAULT_SKILLS,
    includeCronusUi = true,
  } = options;
  const theme = isThemeName(options.theme) ? options.theme : undefined;
  const look = isLookName(options.look) ? options.look : undefined;
  const root = templatesRoot();
  const written: string[] = [];
  const skipped: string[] = [];

  const withDoctrine = preset !== "none";
  const wants = (a: Assistant) => assistants.includes(a);
  const wantsCronusUiMcp = options.cronusUiMcp ?? (includeCronusUi && wants("claude"));
  const enabledSkills = includeCronusUi
    ? skills
    : skills.filter((skill) => !CRONUS_UI_SKILLS.has(skill));

  /** Write `content` to `rel` unless it already exists. Tokens are substituted. */
  const emit = (rel: string, content: string): void => {
    const dest = join(targetDir, rel);
    if (existsSync(dest)) {
      skipped.push(rel);
      return;
    }
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, applyTokens(content, name));
    written.push(rel);
  };

  /** Copy a template file verbatim (token-substituted) to `rel`. */
  const emitTemplate = (templateRel: string, rel: string): void => {
    emit(rel, readFileSync(join(root, templateRel), "utf8"));
  };

  // AGENTS.md — the shared source of truth: the base doctrine plus the chosen
  // domain preset's addendum (standard = base only; none = no doctrine at all).
  if (withDoctrine) {
    let doctrine = readFileSync(join(root, "AGENTS.base.md"), "utf8");
    if (preset !== "standard") {
      doctrine += `\n\n${readFileSync(join(root, `AGENTS.${preset}.md`), "utf8")}`;
    }
    emit("AGENTS.md", doctrine);
  }

  if (includeCronusUi) {
    emit("DESIGN.md", designMarkdown({ format: "extended", theme, look }));
    emit("DESIGN.compact.md", designMarkdown({ format: "compact", theme, look }));
  }

  if (wantsCronusUiMcp) {
    emitTemplate("mcp.json", ".mcp.json");
  }

  // Claude Code — the doctrine-referencing CLAUDE.md only ships with a doctrine.
  if (wants("claude")) {
    if (withDoctrine) emitTemplate("CLAUDE.md", "CLAUDE.md");
    emitTemplate("claude/settings.json", ".claude/settings.json");
    if (withDoctrine)
      emitTemplate("claude/agents/code-reviewer.md", ".claude/agents/code-reviewer.md");
    for (const skill of enabledSkills) {
      emitTemplate(`claude/skills/${skill}/SKILL.md`, `.claude/skills/${skill}/SKILL.md`);
    }
  }

  // Cursor — the design-system rule applies only to Cronus UI stacks; doctrine is generic.
  if (wants("cursor")) {
    if (withDoctrine) emitTemplate("cursor/rules/00-doctrine.mdc", ".cursor/rules/00-doctrine.mdc");
    if (includeCronusUi)
      emitTemplate("cursor/rules/10-cronus-ui.mdc", ".cursor/rules/10-cronus-ui.mdc");
  }

  // GitHub Copilot — a digest of the doctrine.
  if (wants("copilot") && withDoctrine) {
    emitTemplate("github/copilot-instructions.md", ".github/copilot-instructions.md");
  }

  // Windsurf — an always-on rules file that digests the doctrine.
  if (wants("windsurf") && withDoctrine) {
    emitTemplate("windsurf/rules/doctrine.md", ".windsurf/rules/doctrine.md");
  }

  // Gemini CLI — a GEMINI.md that @-imports the shared AGENTS.md doctrine.
  if (wants("gemini") && withDoctrine) {
    emitTemplate("gemini/GEMINI.md", "GEMINI.md");
  }

  return { written, skipped };
}

/**
 * Taste files only — compose uses this so a generated app gets DESIGN.md
 * without rewriting the whole AI Kit.
 */
export function writeDesignDocuments(
  targetDir: string,
  context: { theme?: string; look?: string } = {},
): AiKitResult {
  return writeAiKit({
    targetDir,
    name: "app",
    assistants: [],
    preset: "none",
    skills: [],
    includeCronusUi: true,
    cronusUiMcp: false,
    theme: context.theme,
    look: context.look,
  });
}

/**
 * Parse a comma-separated `--assistants`/`--skills` value (or the literal
 * "all" / "none"). Returns the full set for "all"/empty, an empty set for
 * "none", validates each token against `valid`, and throws a friendly Error
 * naming the bad token.
 */
export function parseList<T extends string>(
  raw: string | undefined,
  valid: readonly T[],
  label: string,
): readonly T[] {
  const normalized = raw?.trim();
  if (normalized === undefined || normalized === "" || normalized === "all") return valid;
  if (normalized === "none") return [];
  const picked = normalized
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const item of picked) {
    if (!valid.includes(item as T)) {
      throw new Error(
        `Unknown ${label} "${item}". Use one or more of: ${valid.join(", ")} (or "all"/"none").`,
      );
    }
  }
  return picked as T[];
}
