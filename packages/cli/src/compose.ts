/**
 * Public library entry for programmatic composition (consumed by
 * `create-cronus-app`'s post-scaffold step). Re-exports the pure apply core so a
 * scaffolder can generate an app template into a freshly-created project without
 * shelling out to the CLI.
 */
export {
  type ComposeAppOptions,
  type ComposeAppResult,
  composeApp,
  listTemplates,
  loadTemplate,
} from "./commands/compose.js";
export type { AppManifest } from "./compose/manifest.js";
export type { ComposeChoiceInput } from "./compose/plan.js";
