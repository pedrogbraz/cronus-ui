import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { emitCronusApp } from "./emit-cronus-fixture.js";
import { listFixtures } from "./fixture-catalog.js";
import { codesOf, scanSourceLanguage } from "./source-language-scan.js";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");

function main(args: string[]): number {
  const cmd = args[0] ?? "help";
  if (cmd === "emit") {
    const fixtures = listFixtures();
    const cronus = emitCronusApp(fixtures);
    if (cronus.includes("source")) {
      console.error("emitCronusApp must never emit source");
      return 1;
    }
    const outDir = join(pkgRoot, "cronus-fixtures");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "app.cronus"), cronus);
    console.log(`wrote ${join(outDir, "app.cronus")} (${fixtures.length} fixtures)`);
    return 0;
  }
  if (cmd === "language") {
    const sourceIdx = args.indexOf("--source");
    const file = sourceIdx >= 0 ? args[sourceIdx + 1] : undefined;
    if (!file) {
      console.error("usage: bun src/cli.ts language --source <file>");
      return 2;
    }
    const source = readFileSync(file, "utf8");
    const findings = scanSourceLanguage(source);
    if (findings.length === 0) {
      console.log("pass");
      return 0;
    }
    console.log(JSON.stringify(findings, null, 2));
    return 1;
  }
  if (cmd === "cheats") {
    const dir = join(pkgRoot, "fixtures/_cheats");
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".cronus"))
      .sort();
    let failed = 0;
    for (const name of files) {
      const source = readFileSync(join(dir, name), "utf8");
      const codes = codesOf(scanSourceLanguage(source));
      if (codes.length === 0) {
        console.error(`${name}: expected language fail, got pass`);
        failed += 1;
      } else {
        console.log(`${name}: ${codes.join(",")}`);
      }
    }
    return failed === 0 ? 0 : 1;
  }
  console.error("usage: bun src/cli.ts <emit|language|cheats>");
  return 2;
}

process.exit(main(process.argv.slice(2)));
