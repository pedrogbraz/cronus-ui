/**
 * Fails (exit 1) when the committed `lib/props.generated.ts` has drifted from the
 * current @cronus-ui/ui component sources. Regenerates the props map in memory and
 * diffs the serialized module against the committed file.
 *
 * Run:  bun run apps/www/scripts/check-props.ts
 *       (wired as the "props:check" package script)
 */
import { readFile } from "node:fs/promises";
import { buildPropsMap, outFile, renderModule } from "./build-props.ts";

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const expected = await renderModule();
  const committed = await readIfExists(outFile);

  if (committed === null) {
    console.error("props:check FAILED — lib/props.generated.ts is missing.");
    console.error("\nRun `bun run -F @cronus-ui/www props` and commit the result.");
    process.exit(1);
  }

  if (committed !== expected) {
    console.error("props:check FAILED — lib/props.generated.ts is out of sync with packages/ui.");
    console.error("\nRun `bun run -F @cronus-ui/www props` and commit the result.");
    process.exit(1);
  }

  const componentCount = Object.keys(await buildPropsMap()).length;
  console.log(`props:check OK — ${componentCount} components in sync.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
