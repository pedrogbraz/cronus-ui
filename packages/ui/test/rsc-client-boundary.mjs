/**
 * rsc-client-boundary.mjs — makes a plain Node/Vitest process behave like a
 * React Server Components bundler at the "use client" boundary.
 *
 * Under the `react-server` export condition, React's server build is loaded and
 * the Flight server (`react-server-dom-webpack/server`) serializes the tree the
 * way Next.js does. What a bundler adds on top is the client boundary: a module
 * that starts with "use client" is never executed on the server, it becomes a
 * set of client references. This file reproduces exactly that step, so a server
 * component that renders a client component is serialized (props checked for
 * serializability) instead of running client-only code on the server.
 *
 * The Flight server is not a declared dependency of @cronus-ui/ui. The copy
 * vendored by Next (resolved through apps/www, the workspace that owns `next`)
 * is the same implementation Next uses at runtime — no new dependency.
 */

import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const WWW_PACKAGE_JSON = join(HERE, "../../../apps/www/package.json");

/** Absolute path of Next's vendored Flight server (node build). */
export const FLIGHT_SERVER_PATH = join(
  dirname(createRequire(WWW_PACKAGE_JSON).resolve("next/package.json")),
  "dist/compiled/react-server-dom-webpack/server.node.js",
);

// Leading whitespace and comments may precede the directive; nothing else may.
const USE_CLIENT = /^(?:\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["']/;

export function hasUseClient(source) {
  return USE_CLIENT.test(source);
}

/** Runtime export names of an ES module source (TS or JS). Type-only exports are skipped. */
export function exportNames(source) {
  const names = new Set();
  const declaration =
    /^export\s+(?:declare\s+)?(?:async\s+)?(?:function\*?|const|let|var|class|enum)\s+([A-Za-z_$][\w$]*)/gm;
  for (const match of source.matchAll(declaration)) names.add(match[1]);

  const list = /^export\s+(type\s+)?\{([^}]*)\}/gm;
  for (const match of source.matchAll(list)) {
    if (match[1]) continue;
    for (const part of match[2].split(",")) {
      const spec = part.replace(/\/\/[^\n]*/g, "").trim();
      if (!spec || spec.startsWith("type ")) continue;
      const [local, exported] = spec.split(/\s+as\s+/);
      names.add((exported ?? local).trim());
    }
  }

  if (/^export\s+default\b/m.test(source)) names.add("default");
  return [...names];
}

/**
 * Replacement source for a "use client" ES module: every export becomes a Flight
 * client reference, which is what a bundler hands the server renderer.
 */
export function clientReferenceModule(source, moduleId, flightSpecifier) {
  const names = exportNames(source);
  if (names.length === 0) {
    throw new Error(`"use client" module has no parseable runtime exports: ${moduleId}`);
  }
  const lines = [
    `import flight from ${JSON.stringify(flightSpecifier)};`,
    `const ID = ${JSON.stringify(moduleId)};`,
    "const ref = (name) => flight.registerClientReference(function () {",
    '  throw new Error("client reference " + name + " (" + ID + ") was called on the server");',
    "}, ID, name);",
  ];
  for (const name of names) {
    lines.push(
      name === "default"
        ? 'export default ref("default");'
        : `export const ${name} = ref(${JSON.stringify(name)});`,
    );
  }
  return `${lines.join("\n")}\n`;
}

/** Vite plugin: applies the boundary to modules Vitest transforms itself (workspace source). */
export function rscClientBoundaryPlugin() {
  return {
    name: "cronus-rsc-client-boundary",
    enforce: "pre",
    transform(code, id) {
      const file = id.split("?")[0];
      if (!/\.[cm]?[jt]sx?$/.test(file) || !hasUseClient(code)) return null;
      return { code: clientReferenceModule(code, file, FLIGHT_SERVER_PATH), map: null };
    },
  };
}
