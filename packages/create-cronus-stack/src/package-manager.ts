import type { StackConfig } from "@cronus-ui/stack";

export const PACKAGE_MANAGERS = ["bun", "npm", "pnpm", "yarn"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export function packageManagerFromConfig(config: StackConfig): PackageManager {
  switch (config.packageManager) {
    case "pm-npm":
      return "npm";
    case "pm-pnpm":
      return "pnpm";
    default:
      return "bun";
  }
}
