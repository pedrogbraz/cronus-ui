import { c } from "./ansi.js";
import { outroLines } from "./outro.js";
import type { PackageManager } from "./package-manager.js";
import type { TemplateName } from "./scaffold-options.js";

export const log = {
  intro(): void {
    process.stdout.write(`\n${c.magenta(c.bold("create-cronus-app"))}\n\n`);
  },
  step(msg: string): void {
    process.stdout.write(`${c.cyan("›")} ${msg}\n`);
  },
  ok(msg: string): void {
    process.stdout.write(`${c.green("✓")} ${msg}\n`);
  },
  warn(msg: string): void {
    process.stdout.write(`${c.yellow("!")} ${msg}\n`);
  },
  error(msg: string): void {
    process.stderr.write(`${c.red("✗")} ${msg}\n`);
  },
  outro(
    name: string,
    pm: PackageManager,
    installed: boolean,
    template?: TemplateName,
    dbPushed = false,
  ): void {
    process.stdout.write(`${outroLines(name, pm, installed, template, dbPushed).join("\n")}\n`);
  },
};

/**
 * A single-select TTY prompt: prints a numbered list and returns the option the
 * user picks (by number or name), the default on empty input, or the default
 * verbatim when stdin is not a TTY (piped/CI) so scaffolding never blocks.
 */
export async function promptSelect<T extends string>(
  label: string,
  options: readonly T[],
  defaultValue: T,
  hints?: Partial<Record<T, string>>,
): Promise<T> {
  if (!process.stdin.isTTY) return defaultValue;
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    process.stdout.write(`${c.bold(label)}\n`);
    options.forEach((opt, i) => {
      const marker = opt === defaultValue ? c.green("●") : c.dim("○");
      const hint = hints?.[opt] ? `  ${c.dim(hints[opt] as string)}` : "";
      process.stdout.write(`  ${marker} ${c.cyan(String(i + 1))} ${opt}${hint}\n`);
    });
    const answer = (
      await rl.question(`${c.dim(`(1-${options.length} or name, default ${defaultValue})`)} `)
    ).trim();
    if (!answer) return defaultValue;
    const asNum = Number.parseInt(answer, 10);
    if (Number.isInteger(asNum) && asNum >= 1 && asNum <= options.length) {
      return options[asNum - 1] as T;
    }
    const byName = options.find((o) => o === answer.toLowerCase());
    return byName ?? defaultValue;
  } finally {
    rl.close();
  }
}

/**
 * A yes/no TTY prompt. Returns `defaultValue` on empty input or when stdin is
 * not a TTY (piped/CI), so scaffolding never blocks on a confirmation.
 */
export async function promptConfirm(label: string, defaultValue = true): Promise<boolean> {
  if (!process.stdin.isTTY) return defaultValue;
  const { createInterface } = await import("node:readline/promises");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const hint = defaultValue ? "Y/n" : "y/N";
    const answer = (await rl.question(`${c.bold(label)} ${c.dim(`(${hint})`)} `))
      .trim()
      .toLowerCase();
    if (!answer) return defaultValue;
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

// npm's package-name rules (the spec subset we care about): optionally scoped,
