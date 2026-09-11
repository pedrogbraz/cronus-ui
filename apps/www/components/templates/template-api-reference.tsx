import { formatTsLiteral } from "../../lib/format-ts-literal";
import { stageRefs, type TemplateCatalogEntry, templatePath } from "../../lib/templates/catalog";
import { ApiFieldTable } from "../docs/api-table";
import { TemplateBlockStackTable } from "./template-block-stack-table";

export function TemplateApiReference({ entry }: { entry: TemplateCatalogEntry }) {
  const stack = stageRefs(entry);

  return (
    <section aria-labelledby="api" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div>
          <h2
            id="api"
            className="scroll-mt-24 font-display text-xl font-normal tracking-[-0.02em] text-fg"
          >
            API Reference
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-fg-secondary">
            Catalog contract for this template. Defaults are this page's live entry.
          </p>
        </div>

        <ApiFieldTable
          label={`${entry.name} fields`}
          rows={[
            {
              name: "slug",
              type: "string",
              required: true,
              defaultValue: formatTsLiteral(entry.slug),
              description: "Catalog id. Passed to create-cronus-app --template.",
            },
            {
              name: "command",
              type: "string",
              required: true,
              defaultValue: formatTsLiteral(entry.command),
              description: "Scaffold command for this template.",
            },
            {
              name: "kind",
              type: '"product" | "landing" | "starter"',
              required: true,
              defaultValue: formatTsLiteral(entry.kind),
              description: "Product app, marketing landing, or starter.",
            },
            {
              name: "path",
              type: '"gold" | "compose" | "showcase"',
              required: true,
              defaultValue: formatTsLiteral(templatePath(entry)),
              description:
                "Gold path (saas/admin) vs composed catalog vs bundled showcase. Not a scaffold flag.",
            },
            {
              name: "theme",
              type: '"aurora" | "neutral" | "midnight" | "sunset" | "emerald"',
              required: true,
              defaultValue: formatTsLiteral(entry.theme),
              description: "Default theme token pack.",
            },
            {
              name: "mode",
              type: '"dark" | "light"',
              required: true,
              defaultValue: formatTsLiteral(entry.mode),
              description: "Default color mode.",
            },
            {
              name: "chrome",
              type: "{ navbar?: string; footer?: string }",
              required: true,
              defaultValue: formatTsLiteral(entry.chrome),
              description: "Optional navbar and footer block slugs wrapping the stage.",
            },
            {
              name: "blocks",
              type: "TemplateBlockRef[]",
              required: true,
              defaultValue: formatTsLiteral(entry.blocks),
              description: "Home-page stack of catalog blocks ({ block, variant? }).",
            },
            {
              name: "customStage",
              type: "boolean",
              defaultValue:
                entry.customStage === undefined ? undefined : formatTsLiteral(entry.customStage),
              description: "Full custom stage instead of a stack of catalog blocks.",
            },
            {
              name: "inside",
              type: "string[]",
              required: true,
              defaultValue: formatTsLiteral(entry.inside),
              description: "What's included in the scaffold.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-normal tracking-[-0.02em] text-fg">
            Catalog stack
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-fg-secondary">
            Navbar, page blocks, and footer in the order the composed home page stacks them.
          </p>
          <div className="mt-4">
            {stack.length > 0 ? (
              <TemplateBlockStackTable
                id="api-block-stack"
                label={`${entry.name} catalog stack`}
                stack={stack}
              />
            ) : (
              <p className="text-sm text-fg-secondary">
                {entry.customStage
                  ? "Custom stage — not composed from catalog blocks."
                  : "Empty block stack."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
