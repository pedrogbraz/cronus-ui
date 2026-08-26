/**
 * @kronus-ui/ai-kit — the AI Kit generator + templates, shared by
 * `create-kronus-app` (scaffold time) and the `kronus-ui` CLI (`kronus-ui ai`).
 * One source of truth for the doctrine, skills, and per-assistant config.
 */
export type {
  AiKitOptions,
  AiKitResult,
  Assistant,
  DoctrinePreset,
  Skill,
} from "./ai-kit.js";
export {
  ASSISTANTS,
  DEFAULT_ASSISTANTS,
  DEFAULT_PRESET,
  DEFAULT_SKILLS,
  DOCTRINE_PRESETS,
  parseList,
  SKILLS,
  writeAiKit,
} from "./ai-kit.js";
