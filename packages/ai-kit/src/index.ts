/**
 * @cronus-ui/ai-kit — the AI Kit generator + templates, shared by
 * `create-cronus-app` (scaffold time) and the `cronus-ui` CLI (`cronus-ui ai`).
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
  writeDesignDocuments,
} from "./ai-kit.js";
export type { McpEditor, McpEditorFile, WriteMcpConfigsOptions } from "./mcp-configs.js";
export {
  DEFAULT_MCP_EDITORS,
  MCP_EDITOR_FILES,
  MCP_EDITORS,
  writeMcpConfigs,
} from "./mcp-configs.js";
