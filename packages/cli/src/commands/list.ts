import pc from "picocolors";
import { DEFAULT_CONFIG, hasConfig, readConfig } from "../config.js";
import { Registry } from "../registry.js";
import { log } from "../utils.js";

interface ListOptions {
  cwd: string;
  registry?: string;
}

export async function list(options: ListOptions): Promise<void> {
  const source = options.registry
    ? options.registry
    : hasConfig(options.cwd)
      ? (await readConfig(options.cwd)).registry
      : DEFAULT_CONFIG.registry;

  const registry = new Registry(source);
  let index: Awaited<ReturnType<Registry["index"]>>;
  try {
    index = await registry.index();
  } catch (err) {
    log.err(`Failed to read registry index: ${(err as Error).message}`);
    process.exitCode = 1;
    return;
  }

  const ui = index.filter((i) => i.type === "registry:ui").map((i) => i.name);
  const lib = index.filter((i) => i.type === "registry:lib").map((i) => i.name);

  log.title(`Kronus UI registry — ${index.length} items`);
  if (lib.length > 0) console.log(`${pc.dim("lib")}  ${lib.join(", ")}`);
  console.log(`${pc.dim("ui")}   ${ui.join(", ")}`);
}
