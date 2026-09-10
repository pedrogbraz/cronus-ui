import Link from "next/link";
import { blockHref, type TemplateBlockRef } from "../../lib/templates/catalog";
import { ApiCode, ApiTable } from "../docs/api-table";

const BLOCK_REF_TYPE = "{ block: string; variant?: string }";

export function TemplateBlockStackTable({
  label,
  stack,
  id,
}: {
  label: string;
  stack: TemplateBlockRef[];
  id?: string;
}) {
  return (
    <ApiTable
      id={id}
      label={label}
      columns={["Block", "Variant", "Type"]}
      rows={stack.map((ref) => ({
        key: ref.variant ? `${ref.block}--${ref.variant}` : ref.block,
        cells: [
          <Link
            key={`${ref.block}-block`}
            href={blockHref({ block: ref.block })}
            className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ApiCode>{ref.block}</ApiCode>
          </Link>,
          ref.variant ? (
            <Link
              key={`${ref.block}-variant`}
              href={blockHref(ref)}
              className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ApiCode>{ref.variant}</ApiCode>
            </Link>
          ) : (
            <span key={`${ref.block}-variant`} className="text-fg-tertiary">
              —
            </span>
          ),
          <ApiCode key={`${ref.block}-type`} muted>
            {BLOCK_REF_TYPE}
          </ApiCode>,
        ],
      }))}
    />
  );
}
