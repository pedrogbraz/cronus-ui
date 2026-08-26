import { spawnSync } from "node:child_process";
import type { StackConfig } from "@kronus-ui/stack";

export const PACKAGE_MANAGERS = ["bun", "npm", "pnpm", "yarn"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const wrap = (open: number, close: number) => (s: string) =>
  useColor ? `\x1b[${open}m${s}\x1b[${close}m` : s;

export const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  red: wrap(31, 39),
  cyan: wrap(36, 39),
  magenta: wrap(35, 39),
};

export const log = {
  intro(): void {
    process.stdout.write(`\n${c.magenta(c.bold("create-kronus-stack"))}\n\n`);
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
  outro(name: string, pm: PackageManager, installed: boolean): void {
    const install = pm === "yarn" ? "yarn" : `${pm} install`;
    const dev = pm === "npm" ? "npm run dev" : `${pm} dev`;
    const lines = [
      "",
      `${c.green(c.bold("Done!"))} Your Kronus stack is ready in ${c.cyan(name)}.`,
      "",
      "Next steps:",
      `  ${c.dim("$")} cd ${name}`,
      ...(installed ? [] : [`  ${c.dim("$")} ${install}`]),
      `  ${c.dim("$")} ${dev}`,
      "",
      `Read ${c.cyan("KICKOFF.md")} before changing the generated stack.`,
      "",
    ];
    process.stdout.write(`${lines.join("\n")}\n`);
  },
};

export function packageManagerFromConfig(config: StackConfig): PackageManager {
  switch (config.packageManager) {
    case "pm-npm":
      return "npm";
    case "pm-pnpm":
      return "pnpm";
    default:
      return "bun";
  }
}

export function runCommand(command: string, args: string[], cwd: string): void {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (typeof result.status === "number" && result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} exited with code ${result.status}`);
  }
}
