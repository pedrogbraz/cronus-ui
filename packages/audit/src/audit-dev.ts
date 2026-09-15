/**
 * Human UX: next dev :4747 + `cronus run --audit-canvas 5176`.
 * Pixel SoT does not use this script — see playwright.audit.config.ts.
 */
import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { emitCronusApp, emitsSourceBlock } from "./emit-cronus-fixture.js";
import { listFixtures } from "./fixture-catalog.js";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");
const monorepo = join(pkgRoot, "../..");

function cronusBin(): string {
  if (process.env.CRONUS_BIN) return process.env.CRONUS_BIN;
  const kernel = process.env.CRONUS_KERNEL_ROOT ?? join(homedir(), "projects/cooud/cronus-kernel");
  const debug = join(kernel, "target/debug/cronus");
  const release = join(kernel, "target/release/cronus");
  if (existsSync(debug)) return debug;
  if (existsSync(release)) return release;
  return "cronus";
}

function emitFixtures(): string {
  const outDir = join(pkgRoot, "cronus-fixtures");
  mkdirSync(outDir, { recursive: true });
  const src = emitCronusApp(listFixtures());
  if (emitsSourceBlock(src)) {
    throw new Error("emitCronusApp emitted source");
  }
  const file = join(outDir, "app.cronus");
  writeFileSync(file, src);
  return outDir;
}

const children: ChildProcess[] = [];

function run(command: string, args: string[], cwd: string, extraEnv: NodeJS.ProcessEnv = {}) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  children.push(child);
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${command} exited ${code}`);
      process.exit(code);
    }
  });
}

function shutdown() {
  for (const child of children) {
    child.kill("SIGTERM");
  }
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});
process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});

// www imports @cronus-ui/audit and @cronus-ui/ui from their `dist`, so building
// only packages/audit would leave a stale ui/tokens dist and render old React.
// `@cronus-ui/audit...` = audit plus every workspace dependency (ui, tokens, …).
console.log("  audit:dev: turbo run build --filter=@cronus-ui/audit... (audit + ui/tokens deps)");
const built = spawnSync("bunx", ["turbo", "run", "build", "--filter=@cronus-ui/audit..."], {
  cwd: monorepo,
  stdio: "inherit",
});
if (built.status !== 0) {
  console.error("audit:dev: dependency build failed; not starting www/kernel");
  process.exit(built.status ?? 1);
}

const fixturesDir = emitFixtures();
const bin = cronusBin();

console.log("");
console.log("  Cronus Audit (dev)");
console.log("    www     http://localhost:4747/audit/button");
console.log("    kernel  http://127.0.0.1:5176/audit/button/primary-md");
console.log(`    cronus  ${bin}`);
console.log("");

run("bun", ["run", "--filter", "@cronus-ui/www", "dev"], monorepo);
run(bin, ["run", "--audit-canvas", "5176"], fixturesDir, {
  CRONUS_AUDIT: "1",
});
