import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

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

export default defineConfig({
  resolve: {
    alias: {
      "@kronus-ui/ai-kit": aiKitSrc,
      "@kronus-ui/stack": stackSrc,
      "@kronus-ui/stack/catalog": stackSubpath("catalog"),
      "@kronus-ui/stack/cli": stackSubpath("cli"),
      "@kronus-ui/stack/constants": stackSubpath("constants"),
      "@kronus-ui/stack/engine": stackSubpath("engine"),
      "@kronus-ui/stack/kickoff": stackSubpath("kickoff"),
      "@kronus-ui/stack/schema": stackSubpath("schema"),
      "@kronus-ui/stack/types": stackSubpath("types"),
    },
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
        test: {
          name: "cli",
          root: "./packages/cli",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "create-kronus-app",
          root: "./packages/create-kronus-app",
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
        test: {
          name: "create-kronus-stack",
          root: "./packages/create-kronus-stack",
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
