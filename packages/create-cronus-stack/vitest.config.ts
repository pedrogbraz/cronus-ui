import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@cronus-ui/ai-kit": src("../ai-kit/src/index.ts"),
      "@cronus-ui/stack": src("../stack/src/index.ts"),
      "@cronus-ui/stack/catalog": src("../stack/src/catalog.ts"),
      "@cronus-ui/stack/cli": src("../stack/src/cli.ts"),
      "@cronus-ui/stack/constants": src("../stack/src/constants.ts"),
      "@cronus-ui/stack/engine": src("../stack/src/engine.ts"),
      "@cronus-ui/stack/kickoff": src("../stack/src/kickoff.ts"),
      "@cronus-ui/stack/schema": src("../stack/src/schema.ts"),
      "@cronus-ui/stack/types": src("../stack/src/types.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
