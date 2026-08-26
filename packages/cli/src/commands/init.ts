import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { DEFAULT_CONFIG, hasConfig, type KronusUIConfig, writeConfig } from "../config.js";
import { Registry } from "../registry.js";
import { detectPackageManager, log, runInstall, writeItemFiles } from "../utils.js";

interface InitOptions {
  cwd: string;
  registry?: string;
  yes?: boolean;
  skipInstall?: boolean;
}

const BASE_DEPS = ["clsx", "tailwind-merge", "class-variance-authority", "@radix-ui/react-slot"];

export async function init(options: InitOptions): Promise<void> {
  const { cwd } = options;

  if (hasConfig(cwd) && !options.yes) {
    log.warn(`${"kronus-ui.json"} already exists. Re-run with --yes to overwrite.`);
    return;
  }

  const config: KronusUIConfig = {
    ...DEFAULT_CONFIG,
    registry: options.registry ?? DEFAULT_CONFIG.registry,
  };

  log.title("Initializing Kronus UI");
  await writeConfig(cwd, config);
  log.ok("Wrote kronus-ui.json");

  await mkdir(join(cwd, config.paths.ui), { recursive: true });
  await mkdir(join(cwd, config.paths.lib), { recursive: true });
  await mkdir(join(cwd, config.paths.blocks), { recursive: true });
  log.ok(`Created ${config.paths.ui}, ${config.paths.lib} and ${config.paths.blocks}`);

  // Pull the shared cn() helper from the registry.
  try {
    const registry = new Registry(config.registry);
    const [cn] = await registry.resolve(["cn"]);
    if (cn) {
      await writeItemFiles(cn, config, cwd, { overwrite: true });
      log.ok(`Added ${config.paths.lib}/cn.ts`);
    }
  } catch (err) {
    log.warn(`Could not fetch cn from registry (${(err as Error).message}). Add it later.`);
  }

  if (!options.skipInstall) {
    const pm = detectPackageManager(cwd);
    log.step(`Installing base dependencies with ${pm}…`);
    try {
      await runInstall(pm, BASE_DEPS, cwd);
      log.ok("Installed base dependencies");
    } catch (err) {
      log.warn(`Dependency install skipped: ${(err as Error).message}`);
    }
  }

  log.title("Next steps");
  log.step(
    "1. Add Kronus CSS variables or install @kronus-ui/tokens if your registry access allows it.",
  );
  log.step('2. In your global CSS:  @import "tailwindcss";  then import your Kronus token CSS.');
  log.step(
    "3. Wrap your app in <KronusUIProvider> from @kronus-ui/theme if you use the theme package.",
  );
  log.step("4. Add components:  npx kronus-ui add button card dialog");
}
