/**
 * `.cronus` source per audit fixture, emitted at build time with the same
 * emitter the audit feeds to the kernel (`emitCronusApp`). No kernel needed.
 * Server-only (reads fixture JSON from disk).
 */
import { emitCronusApp } from "@cronus-ui/audit/emit";
import { listFixtures } from "@cronus-ui/audit/fixtures";

export interface CronusFixtureSource {
  id: string;
  source: string;
}

let byFamily: Map<string, CronusFixtureSource[]> | null = null;

function index(): Map<string, CronusFixtureSource[]> {
  if (byFamily) return byFamily;
  const map = new Map<string, CronusFixtureSource[]>();
  for (const fixture of listFixtures()) {
    const list = map.get(fixture.family) ?? [];
    list.push({ id: fixture.id, source: emitCronusApp([fixture]) });
    map.set(fixture.family, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.id.localeCompare(b.id));
  byFamily = map;
  return map;
}

export function cronusSourcesFor(family: string): CronusFixtureSource[] {
  return index().get(family) ?? [];
}
