/**
 * Preloaded (`node --import`) by the `ui-rsc` Vitest project. Applies the
 * "use client" boundary to dependencies Node loads directly (Radix, etc.), which
 * never pass through Vite's transform pipeline.
 */

import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { clientReferenceModule, FLIGHT_SERVER_PATH, hasUseClient } from "./rsc-client-boundary.mjs";

const FLIGHT_SERVER_URL = pathToFileURL(FLIGHT_SERVER_PATH).href;

registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (!url.startsWith("file:") || !url.includes("/node_modules/")) return result;
    if (result.format !== "module" && result.format !== "commonjs") return result;

    const source =
      result.source == null
        ? readFileSync(fileURLToPath(url), "utf8")
        : typeof result.source === "string"
          ? result.source
          : Buffer.from(result.source).toString("utf8");
    if (!hasUseClient(source)) return result;

    if (result.format === "module") {
      return {
        format: "module",
        source: clientReferenceModule(source, url, FLIGHT_SERVER_URL),
        shortCircuit: true,
      };
    }
    return {
      format: "commonjs",
      source: `module.exports = require(${JSON.stringify(FLIGHT_SERVER_PATH)}).createClientModuleProxy(${JSON.stringify(url)});`,
      shortCircuit: true,
    };
  },
});
