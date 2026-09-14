import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { PassThrough } from "node:stream";
import { fileURLToPath } from "node:url";
import * as React from "react";
import { type ComponentType, createElement as h, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { FLIGHT_SERVER_PATH, hasUseClient } from "../test/rsc-client-boundary.mjs";

/**
 * React Server Components gate for the server-safe primitives.
 *
 * `ssr.test.ts` uses `renderToString`, which runs the client build of React and
 * happily accepts function props — so a component without "use client" that
 * passes an event handler (or calls a hook) passes SSR and still crashes the
 * moment a Next.js Server Component renders it. This file renders through the
 * real Flight server under the `react-server` export condition (the Vitest
 * project `ui-rsc` sets it), with "use client" modules replaced by client
 * references, which is what Next does at the boundary.
 *
 * The component list is derived, not hand-maintained: every runtime export of
 * `index.ts` that comes from a file WITHOUT "use client" must render here with
 * no callbacks. A new server-safe primitive that needs props fails until it gets
 * an entry in PROPS.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const flight = createRequire(import.meta.url)(FLIGHT_SERVER_PATH) as {
  renderToPipeableStream: (
    model: ReactNode,
    manifest: unknown,
    options: { onError: (error: unknown) => void },
  ) => { pipe: (destination: NodeJS.WritableStream) => void };
};

// Resolve any client reference id to a module entry; the payload is never consumed.
const CLIENT_MANIFEST = new Proxy(
  {},
  { get: (_target, key) => ({ id: String(key), chunks: [], name: "*" }) },
);

function renderRsc(node: ReactNode): Promise<{ errors: string[]; payload: string }> {
  return new Promise((resolve) => {
    const errors: string[] = [];
    let payload = "";
    const sink = new PassThrough();
    sink.setEncoding("utf8");
    sink.on("data", (chunk: string) => {
      payload += chunk;
    });
    sink.on("end", () => resolve({ errors, payload }));
    flight
      .renderToPipeableStream(node, CLIENT_MANIFEST, {
        onError: (error) => {
          errors.push(error instanceof Error ? error.message.split("\n")[0] : String(error));
        },
      })
      .pipe(sink);
  });
}

/** `export { A, B } from "./components/x.js"` (runtime, not `export type`) → name → file. */
function barrelExports(): Map<string, string> {
  const barrel = readFileSync(join(HERE, "index.ts"), "utf8");
  const exports = new Map<string, string>();
  for (const match of barrel.matchAll(
    /^export\s+\{([^}]*)\}\s+from\s+"\.\/components\/([\w-]+)\.js";/gm,
  )) {
    for (const part of match[1].split(",")) {
      const spec = part.trim();
      if (!spec) continue;
      const [local, exported] = spec.split(/\s+as\s+/);
      exports.set((exported ?? local).trim(), match[2]);
    }
  }
  return exports;
}

const modules = import.meta.glob<Record<string, unknown>>("./components/*.{ts,tsx}");

/** Source path (relative to this file) of a barrel entry: `<file>.tsx` or `<file>.ts`. */
function sourceOf(file: string): string {
  const tsx = `./components/${file}.tsx`;
  return tsx in modules ? tsx : `./components/${file}.ts`;
}

const serverSafe = [...barrelExports()]
  .map(([name, file]) => [name, sourceOf(file)] as const)
  .filter(([, source]) => !hasUseClient(readFileSync(join(HERE, source), "utf8")))
  .filter(([name]) => /^[A-Z]/.test(name) && !/^[A-Z0-9_]+$/.test(name))
  .sort(([a], [b]) => a.localeCompare(b));

/**
 * Minimal REQUIRED props per export (no callbacks, ever). Anything not listed
 * renders with no props.
 */
const HEATMAP_DAYS = [
  { date: "2026-06-23", value: 1 },
  { date: "2026-06-24", value: 4 },
];

const PROPS: Record<string, Record<string, unknown>> = {
  AuthorTooltip: { author: { name: "Ada Lovelace", avatar: "/ada.png", role: "Engineer" } },
  Heatmap: { data: HEATMAP_DAYS },
  HeatmapChart: { data: HEATMAP_DAYS },
  Sparkline: { data: [3, 5, 4, 8] },
  Suggestion: { suggestion: "Summarize this thread" },
  SunburstChart: {
    data: [
      {
        name: "Root",
        children: [
          { name: "A", value: 3 },
          { name: "B", value: 2 },
        ],
      },
    ],
  },
  TodoItem: { id: "todo-1", title: "Ship the RSC gate", completed: false },
  ToolHeader: { type: "tool-search", state: "output-available" },
  ToolInput: { input: { query: "rsc" } },
};

/**
 * Exports from files without "use client" that still cannot render from a
 * Server Component today. A different defect class from the event-handler one
 * this gate was written for: client-only code runs inside the server file
 * (recharts calls `createContext` at import; ToolInput hands a render function
 * to a client component). Each entry must keep failing with its message — once
 * one is fixed the test goes red, and the entry has to be removed.
 */
const RECHARTS_IMPORT = /createContext\) is not a function/;
const KNOWN_RSC_FAILURES: Record<string, RegExp> = {
  BarChart: RECHARTS_IMPORT,
  FunnelChart: RECHARTS_IMPORT,
  GaugeChart: RECHARTS_IMPORT,
  LineChart: RECHARTS_IMPORT,
  PieChart: RECHARTS_IMPORT,
  ProfitLossChart: RECHARTS_IMPORT,
  RadarChart: RECHARTS_IMPORT,
  RingChart: RECHARTS_IMPORT,
  SankeyChart: RECHARTS_IMPORT,
  ScatterChart: RECHARTS_IMPORT,
  ToolInput: /Functions are not valid as a child of Client Components/,
};

function isComponent(value: unknown): value is ComponentType<Record<string, unknown>> {
  return (
    typeof value === "function" ||
    (typeof value === "object" && value !== null && "$$typeof" in value)
  );
}

/** Imports and renders one export; returns the failure text, or "" when it renders. */
async function renderExport(name: string, source: string): Promise<string> {
  let mod: Record<string, unknown>;
  try {
    mod = await modules[source]();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
  const Component = mod[name];
  if (!isComponent(Component)) return ""; // a non-component runtime export (e.g. a const map)
  const { errors, payload } = await renderRsc(h(Component, PROPS[name] ?? null));
  if (errors.length > 0) return errors.join("\n");
  return payload.length > 0 ? "" : "empty Flight payload";
}

describe("RSC harness", () => {
  it("runs the react-server build of React (hooks are not exported)", () => {
    expect((React as Record<string, unknown>).useState).toBeUndefined();
  });

  it("rejects an event handler passed from a server component", async () => {
    const { errors } = await renderRsc(
      h("button", { type: "button", onClick: () => undefined }, "x"),
    );
    expect(errors.join("\n")).toMatch(/Event handlers cannot be passed to Client Component props/);
  });

  it('serializes a "use client" component as a client reference', async () => {
    const tooltip = await modules["./components/tooltip.tsx"]();
    const { errors, payload } = await renderRsc(h(tooltip.Tooltip as ComponentType, null));
    expect(errors).toEqual([]);
    expect(payload).toContain("tooltip.tsx");
  });

  it("derives a non-trivial list of server-safe exports", () => {
    expect(serverSafe.length).toBeGreaterThan(50);
    const listed = [...Object.keys(PROPS), ...Object.keys(KNOWN_RSC_FAILURES)];
    const unknown = listed.filter((name) => !serverSafe.some(([n]) => n === name));
    expect(unknown).toEqual([]);
  });
});

describe("server-safe primitives render as React Server Components", () => {
  it.each(serverSafe)("%s (%s)", async (name, source) => {
    const failure = await renderExport(name, source);
    const known = KNOWN_RSC_FAILURES[name];
    if (known) {
      expect(failure, `${name} renders as RSC now — remove it from KNOWN_RSC_FAILURES`).toMatch(
        known,
      );
      return;
    }
    expect(failure, `${name} from ${source}`).toBe("");
  });
});
