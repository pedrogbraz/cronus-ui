import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export type PackageManager = "bun" | "pnpm" | "yarn" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "bun.lock")) || existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installArgs(pm: PackageManager, deps: string[]): string[] {
  switch (pm) {
    case "bun":
      return ["add", ...deps];
    case "pnpm":
      return ["add", ...deps];
    case "yarn":
      return ["add", ...deps];
    default:
      return ["install", ...deps];
  }
}

export function runInstall(pm: PackageManager, deps: string[], cwd: string): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(pm, installArgs(pm, deps), { cwd, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolvePromise() : reject(new Error(`${pm} exited with code ${code}`)),
    );
  });
}
