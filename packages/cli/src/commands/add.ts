import {
  CLI_VERSION,
  hasConfig,
  type InstalledRecord,
  readConfig,
  writeConfig,
} from "../config.js";
import { Registry, registrySourceVersion } from "../registry.js";
import {
  closestName,
  collectDependencies,
  detectPackageManager,
  log,
  recordDependencies,
  runInstall,
  writeItemFiles,
} from "../utils.js";

interface AddOptions {
  cwd: string;
  overwrite?: boolean;
  skipInstall?: boolean;
  registry?: string;
}

export async function add(names: string[], options: AddOptions): Promise<void> {
  const { cwd } = options;

  if (!hasConfig(cwd)) {
    log.err("No cronus-ui.json found. Run `cronus-ui init` first.");
    process.exitCode = 1;
    return;
  }
  if (names.length === 0) {
    log.err("Specify at least one component, e.g. `cronus-ui add button card`.");
    process.exitCode = 1;
    return;
  }

  const config = await readConfig(cwd);
  const registry = new Registry(options.registry ?? config.registry);

  // Validate requested names against the registry index up front so a typo gets
  // a "did you mean" hint instead of an opaque 404 from resolve(). If the index
  // itself cannot be read we fall through and let resolve() report the failure.
  try {
    const available = (await registry.index()).map((i) => i.name);
    const known = new Set(available);
    const unknown = names.filter((name) => !known.has(name));
    if (unknown.length > 0) {
      for (const name of unknown) {
        const suggestion = closestName(name, available);
        log.err(
          suggestion
            ? `Unknown item "${name}". Did you mean "${suggestion}"?`
            : `Unknown item "${name}".`,
        );
      }
      log.step("Run `cronus-ui list` to see all available items.");
      process.exitCode = 1;
      return;
    }
  } catch {
    // Index unavailable (e.g. offline local registry) — defer to resolve() below.
  }

  let items: Awaited<ReturnType<Registry["resolve"]>>;
  try {
    items = await registry.resolve(names);
  } catch (err) {
    log.err(`Failed to resolve from registry: ${(err as Error).message}`);
    process.exitCode = 1;
    return;
  }

  const requested = new Set(names);
  // Transitive registry items pulled in to satisfy a requested item's
  // registryDependencies. Blocks import the @cronus-ui/ui package rather than
  // copied source, so they never pull in components — only ui/lib items do.
  const pulledIn = items.filter(
    (i) => !requested.has(i.name) && (i.type === "registry:ui" || i.type === "registry:lib"),
  );
  const blockCount = items.filter(
    (i) => requested.has(i.name) && i.type === "registry:block",
  ).length;
  const componentCount = names.length - blockCount;
  const summary = [
    componentCount > 0 ? `${componentCount} component(s)` : null,
    blockCount > 0 ? `${blockCount} block(s)` : null,
  ]
    .filter(Boolean)
    .join(" and ");
  log.title(`Adding ${summary}`);
  if (pulledIn.length > 0) {
    log.step(`Pulling in dependencies: ${pulledIn.map((i) => i.name).join(", ")}`);
  }

  // The registry release these files come from — recorded in the install
  // manifest so `upgrade` can later fetch the exact merge base. Sources without
  // a version segment (e.g. a local dir) are pinned to the running CLI version.
  const sourceUsed = options.registry ?? config.registry;
  const installedVersion = registrySourceVersion(sourceUsed) ?? CLI_VERSION;
  const installed: Record<string, InstalledRecord> = { ...config.installed };
  let manifestChanged = false;

  const allWritten: string[] = [];
  const allSkipped: string[] = [];
  for (const item of items) {
    const { written, skipped } = await writeItemFiles(item, config, cwd, {
      overwrite: options.overwrite ?? false,
    });
    allWritten.push(...written);
    allSkipped.push(...skipped);
    // Only record an item whose files were ALL written this run. A partially
    // skipped item keeps older (possibly edited) files on disk — pinning it to
    // today's release would corrupt the 3-way merge base for `upgrade`.
    if (written.length === item.files.length && written.length > 0) {
      installed[item.name] = { version: installedVersion, files: written };
      manifestChanged = true;
    }
  }

  for (const path of allWritten) log.ok(`Added ${path}`);
  for (const path of allSkipped) log.warn(`Skipped ${path} (exists — use --overwrite)`);

  if (manifestChanged) {
    await writeConfig(cwd, { ...config, installed });
  }

  const deps = collectDependencies(items);
  await recordDependencies(cwd, deps);
  if (deps.length > 0 && !options.skipInstall) {
    const pm = detectPackageManager(cwd);
    log.step(`Installing ${deps.length} dependencies with ${pm}…`);
    try {
      await runInstall(pm, deps, cwd);
      log.ok("Installed dependencies");
    } catch (err) {
      log.warn(`Install failed: ${(err as Error).message}`);
      log.step(`Install manually: ${pm} add ${deps.join(" ")}`);
    }
  } else if (deps.length > 0) {
    log.step(`Dependencies to install: ${deps.join(" ")}`);
  }

  log.title(`Done — ${allWritten.length} file(s) written.`);
}
