import { type BlockMeta, getBlockVariantMetas } from "../../lib/blocks-index";
import { formatTsLiteral } from "../../lib/format-ts-literal";
import { ApiCode, ApiFieldTable, ApiTable } from "../docs/api-table";
import { CodeBlock } from "../docs/code-block";

const VARIANT_TYPE = "{ id: string; name: string; description: string }[]";

export function BlockApiReference({ meta }: { meta: BlockMeta }) {
  const variants = getBlockVariantMetas(meta.slug);
  const variantIds = meta.variants?.map((variant) => variant.id);

  return (
    <section aria-labelledby="api" className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <div>
          <h2
            id="api"
            className="scroll-mt-24 font-display text-xl font-normal tracking-[-0.02em] text-fg"
          >
            API Reference
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-fg-secondary">
            Catalog metadata for this block. Install copies the source into your project.
          </p>
        </div>

        <CodeBlock code={`npx cronus-ui add ${meta.slug}`} language="bash" />

        <ApiFieldTable
          label={`${meta.name} fields`}
          rows={[
            {
              name: "slug",
              type: "string",
              required: true,
              defaultValue: formatTsLiteral(meta.slug),
              description: "Registry item id. Passed to cronus-ui add.",
            },
            {
              name: "name",
              type: "string",
              required: true,
              defaultValue: formatTsLiteral(meta.name),
              description: "Display name shown in the gallery.",
            },
            {
              name: "description",
              type: "string",
              required: true,
              defaultValue: formatTsLiteral(meta.description),
              description: "Short summary of what the block covers.",
            },
            {
              name: "variants",
              type: VARIANT_TYPE,
              defaultValue: variantIds?.length ? formatTsLiteral(variantIds) : undefined,
              description:
                "Alternate layouts. Install a look with npx cronus-ui add <slug>--<id>. Omitted when the block has a single default.",
            },
          ]}
        />

        <div>
          <h3 className="font-display text-lg font-normal tracking-[-0.02em] text-fg">Variants</h3>
          <p className="mt-2 max-w-2xl text-sm text-fg-secondary">
            {meta.variants?.length
              ? "Every published look for this block."
              : "This block ships a single default layout."}
          </p>
          <div className="mt-4">
            <ApiTable
              label={`${meta.name} variants`}
              columns={["Id", "Name", "Description"]}
              rows={variants.map((variant) => ({
                key: variant.id,
                cells: [
                  <ApiCode key={`${variant.id}-id`}>{variant.id}</ApiCode>,
                  <span key={`${variant.id}-name`} className="text-fg">
                    {variant.name}
                  </span>,
                  <span
                    key={`${variant.id}-description`}
                    className="text-sm leading-relaxed text-fg-secondary"
                  >
                    {variant.description}
                  </span>,
                ],
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
