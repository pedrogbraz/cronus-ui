import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import pc from "picocolors";
import { hasConfig, readConfig } from "../config.js";
import { Registry } from "../registry.js";
import { log, resolveSafeDest, rewriteImports, targetDir } from "../utils.js";

interface DiffOptions {
  cwd: string;
  registry?: string;
}

/** Report which installed components have drifted from the registry. */
export async function diff(names: string[], options: DiffOptions): Promise<void> {
  const { cwd } = options;
  if (!hasConfig(cwd)) {
    log.err("No kronus-ui.json found. Run `kronus-ui init` first.");
    process.exitCode = 1;
    return;
  }
  const config = await readConfig(cwd);
  const registry = new Registry(options.registry ?? config.registry);

  const targets = names.length > 0 ? names : (await registry.index()).map((i) => i.name);
  let changed = 0;

  for (const name of targets) {
    let item: Awaited<ReturnType<Registry["item"]>>;
    try {
      item = await registry.item(name);
    } catch {
      log.warn(`${name}: not in registry`);
      continue;
    }
    for (const file of item.files) {
      let dest: string;
      try {
        dest = resolveSafeDest(cwd, targetDir(config, file.target), file.path);
      } catch (err) {
        log.warn(`${name}: ${(err as Error).message}`);
        continue;
      }
      if (!existsSync(dest)) continue; // not installed locally
      const local = await readFile(dest, "utf8");
      const upstream = rewriteImports(file.content, config);
      if (local.trim() === upstream.trim()) {
        log.ok(`${pc.dim(name)} up to date`);
      } else {
        changed += 1;
        log.warn(`${name} differs from registry (${file.path})`);
      }
    }
  }

  if (changed === 0) log.title("Everything is up to date.");
  else
    log.title(
      `${changed} component(s) differ. Run \`kronus-ui upgrade\` to merge upstream updates without losing your edits.`,
    );
}
