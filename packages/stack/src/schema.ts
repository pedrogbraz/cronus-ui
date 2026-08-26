import { catalog } from "./catalog.js";
import { STACK_BUILDER_GENERATOR, STACK_CREATE_ALIAS, STACK_CREATE_PACKAGE } from "./constants.js";
import type { Category } from "./types.js";

type JsonSchema = Record<string, unknown>;

export const STACK_SCHEMA_VERSION = 1;
export const STACK_SCHEMA_ID = "https://cronus.dev/schema/stack-1.json";
export const STACK_GENERATOR_PACKAGE = STACK_CREATE_PACKAGE;

export const STACK_BUILDER_METADATA = {
  name: "Cronus Stack Builder",
  statusLabel: "Stable",
  route: "/stack",
  docsRoute: "/docs/stack-builder",
  schemaId: STACK_SCHEMA_ID,
  schemaVersion: STACK_SCHEMA_VERSION,
  generatorPackage: STACK_GENERATOR_PACKAGE,
  generatorCreateAlias: STACK_CREATE_ALIAS,
  generatorPackageExistsInRepo: true,
  generatorTruth:
    "This repository ships create-cronus-stack; bun create cronus-stack@latest resolves to that generator package after publish.",
  artifacts: ["Scaffolding command", "KICKOFF.md", "stack.json"],
} as const;

function categorySchema(category: Category): JsonSchema {
  if (category.kind === "toggle") {
    return {
      type: "boolean",
      description: category.description ?? category.title,
    };
  }

  const optionIds = category.options.map((option) => option.id);

  if (category.kind === "multi") {
    return {
      type: "array",
      description: category.description ?? category.title,
      uniqueItems: true,
      items: {
        type: "string",
        enum: optionIds,
      },
    };
  }

  return {
    type: "string",
    description: category.description ?? category.title,
    enum: optionIds,
  };
}

const stackProperties = Object.fromEntries(
  catalog.map((category) => [category.id, categorySchema(category)]),
);

export const STACK_SCHEMA: JsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: STACK_SCHEMA_ID,
  title: "Cronus Stack Builder snapshot",
  description: "A machine-readable snapshot emitted by the Cronus Stack Builder.",
  type: "object",
  additionalProperties: false,
  required: ["$schema", "version", "name", "generator", "stack"],
  properties: {
    $schema: {
      const: STACK_SCHEMA_ID,
      description: "Schema identifier for this Stack Builder snapshot.",
    },
    version: {
      const: STACK_SCHEMA_VERSION,
      description: "Schema version for the emitted stack.json file.",
    },
    name: {
      type: "string",
      pattern: "^[a-z0-9]([a-z0-9-]{0,62}[a-z0-9])?$",
      description: "Sanitized project slug.",
    },
    generator: {
      const: STACK_BUILDER_GENERATOR,
      description: "The product surface that emitted this snapshot.",
    },
    stack: {
      type: "object",
      additionalProperties: false,
      required: catalog.map((category) => category.id),
      properties: stackProperties,
    },
  },
};

export const STACK_SCHEMA_EXAMPLE = {
  $schema: STACK_SCHEMA_ID,
  version: STACK_SCHEMA_VERSION,
  name: "my-cronus-app",
  generator: STACK_BUILDER_GENERATOR,
  stack: {
    web: "web-next",
    backend: "backend-none",
    runtime: "runtime-bun",
    api: "api-none",
    database: "db-none",
    orm: "orm-none",
    dbSetup: "dbsetup-basic",
    auth: "auth-none",
    payments: "pay-none",
    ui: "ui-cronus",
    assistants: ["ai-claude-code"],
    mcp: [],
    skills: [],
    vibe: false,
    deploy: "deploy-none",
    packageManager: "pm-bun",
    addons: [],
    naming: "naming-kebab",
    structure: "structure-src",
    importAlias: "import-alias",
    commitStyle: "commit-conventional",
    tsStrict: "ts-strict",
    git: true,
    install: true,
  },
} as const;

export const STACK_SCHEMA_FIELD_SUMMARY = [
  {
    field: "$schema",
    description: "Pins the snapshot to the current Stack Builder schema.",
  },
  {
    field: "version",
    description: "Version number for migrations when the snapshot contract changes.",
  },
  {
    field: "name",
    description: "Sanitized project slug used by the preview command and kickoff docs.",
  },
  {
    field: "generator",
    description: `Always ${STACK_BUILDER_GENERATOR} for artifacts emitted by this builder.`,
  },
  {
    field: "stack",
    description: "Resolved category selections after all requires, conflicts, and defaults apply.",
  },
] as const;
