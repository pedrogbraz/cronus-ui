import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@kronus-ui/ai-kit": src("../ai-kit/src/index.ts"),
      "@kronus-ui/stack": src("../stack/src/index.ts"),
      "@kronus-ui/stack/catalog": src("../stack/src/catalog.ts"),
      "@kronus-ui/stack/cli": src("../stack/src/cli.ts"),
      "@kronus-ui/stack/constants": src("../stack/src/constants.ts"),
      "@kronus-ui/stack/engine": src("../stack/src/engine.ts"),
      "@kronus-ui/stack/kickoff": src("../stack/src/kickoff.ts"),
      "@kronus-ui/stack/schema": src("../stack/src/schema.ts"),
      "@kronus-ui/stack/types": src("../stack/src/types.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
