import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type ParityFixture, parseParityFixture } from "./parity-fixture.js";

const here = dirname(fileURLToPath(import.meta.url));
export const FIXTURES_ROOT = join(here, "..", "fixtures");

export function listFixtureFiles(): string[] {
  const out: string[] = [];
  for (const family of readdirSync(FIXTURES_ROOT)) {
    if (family.startsWith("_")) continue;
    const dir = join(FIXTURES_ROOT, family);
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }
    for (const name of entries) {
      if (name.endsWith(".json")) out.push(join(dir, name));
    }
  }
  return out.sort();
}

export function listFixtures(): ParityFixture[] {
  return listFixtureFiles().map((file) => {
    const raw = JSON.parse(readFileSync(file, "utf8")) as unknown;
    return parseParityFixture(raw);
  });
}

export function getFixture(family: string, id: string): ParityFixture {
  const file = join(FIXTURES_ROOT, family, `${id}.json`);
  const raw = JSON.parse(readFileSync(file, "utf8")) as unknown;
  return parseParityFixture(raw);
}

export function fixturesForFamily(family: string): ParityFixture[] {
  return listFixtures().filter((f) => f.family === family);
}

export function componentNameOf(fixture: ParityFixture): string {
  return toPascal(fixture.family) + toPascal(fixture.id);
}

export function toPascal(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
