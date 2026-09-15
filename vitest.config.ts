import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { rscClientBoundaryPlugin } from "./packages/ui/test/rsc-client-boundary.mjs";

/**
 * Root Vitest config (Vitest 4 `projects`). One project per package, plus a
 * dedicated jsdom project for React component render tests.
 *
 * Convention: `*.test.ts` = Node-env logic, `*.test.tsx` = jsdom component test
 * (Testing Library + vitest-axe via packages/ui/vitest.setup.ts).
 * Test files live next to their sources and are excluded from each package's
 * tsconfig "include", so they never land in `dist`.
 */

// Resolve workspace packages to SOURCE in tests, so consumers don't need a prior
// build before Vitest can import them.
const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const aiKitSrc = src("./packages/ai-kit/src/index.ts");
const stackSrc = src("./packages/stack/src/index.ts");
const stackSubpath = (name: string) => src(`./packages/stack/src/${name}.ts`);
const workspaceAliases = {
  "@cronus-ui/ai-kit": aiKitSrc,
  "@cronus-ui/stack": stackSrc,
  "@cronus-ui/stack/catalog": stackSubpath("catalog"),
  "@cronus-ui/stack/cli": stackSubpath("cli"),
  "@cronus-ui/stack/constants": stackSubpath("constants"),
  "@cronus-ui/stack/engine": stackSubpath("engine"),
  "@cronus-ui/stack/kickoff": stackSubpath("kickoff"),
  "@cronus-ui/stack/schema": stackSubpath("schema"),
  "@cronus-ui/stack/types": stackSubpath("types"),
};

export default defineConfig({
  resolve: {
    alias: workspaceAliases,
  },
  test: {
    projects: [
      {
        test: {
          name: "tokens",
          root: "./packages/tokens",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        resolve: { alias: workspaceAliases },
        test: {
          name: "cli",
          root: "./packages/cli",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "create-cronus-app",
          root: "./packages/create-cronus-app",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "stack",
          root: "./packages/stack",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        resolve: { alias: workspaceAliases },
        test: {
          name: "create-cronus-stack",
          root: "./packages/create-cronus-stack",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "ai-kit",
          root: "./packages/ai-kit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "mcp",
          root: "./packages/mcp",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "ui",
          root: "./packages/ui",
          environment: "node",
          include: ["src/**/*.test.ts"],
          exclude: ["**/node_modules/**", "src/**/*.rsc.test.ts"],
        },
      },
      {
        // React Server Components render of the server-safe primitives. Runs the
        // react-server build of React (export condition) through the Flight
        // server, with "use client" modules turned into client references —
        // see packages/ui/test/rsc-client-boundary.mjs.
        plugins: [rscClientBoundaryPlugin()],
        ssr: {
          resolve: {
            conditions: ["react-server", "module", "node", "development|production"],
            externalConditions: ["react-server"],
          },
        },
        test: {
          name: "ui-rsc",
          root: "./packages/ui",
          environment: "node",
          include: ["src/**/*.rsc.test.ts"],
          execArgv: [
            "--conditions=react-server",
            "--import",
            src("./packages/ui/test/rsc-register-hooks.mjs"),
          ],
        },
      },
      {
        test: {
          name: "ui-dom",
          root: "./packages/ui",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        test: {
          name: "theme-dom",
          root: "./packages/theme",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        test: {
          name: "www",
          root: "./apps/www",
          environment: "node",
          include: ["lib/**/*.test.{ts,tsx}"],
        },
      },
      {
        test: {
          name: "audit",
          root: "./packages/audit",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "audit-dom",
          root: "./packages/audit",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["../ui/vitest.setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      // Measure the component-library surface — the code adopters actually run.
      include: ["packages/ui/src/components/**/*.{ts,tsx}"],
      exclude: ["**/*.test.*", "**/*.stories.*", "**/motion-presets.ts"],
      reporter: ["text-summary", "json-summary", "html"],
      reportsDirectory: "./coverage",
      // Ratchet floor — set just under the current measured coverage (lines
      // ~73%, branches ~57%) so deleting tests or shipping untested code fails
      // CI. Raise as coverage climbs.
      thresholds: { lines: 70, functions: 67, statements: 68, branches: 52 },
    },
  },
});
