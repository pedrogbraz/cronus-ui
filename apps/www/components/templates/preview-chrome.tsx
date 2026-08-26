import { CopyButton } from "@kronus-ui/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { TemplateCatalogEntry } from "../../lib/templates/catalog";

/**
 * Compact overlay for the full-page live stage. Hidden in `?embed=1` thumbs.
 * Sits top-left so centered marketing heroes stay clear.
 */
export function PreviewChrome({ entry }: { entry: TemplateCatalogEntry }) {
  return (
    <div className="pointer-events-none fixed left-3 top-3 z-50 sm:left-4 sm:top-4">
      <div className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-1 rounded-full border border-border bg-surface-raised/85 p-1 shadow-sm backdrop-blur">
        <Link
          href={`/templates/${entry.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-surface-overlay focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="size-3.5 text-fg-tertiary" aria-hidden="true" />
          {entry.name}
        </Link>
        <span className="hidden pr-1 text-xs text-fg-tertiary sm:inline">Live preview</span>
        <CopyButton
          value={entry.command}
          size="icon-sm"
          className="shrink-0 text-fg-tertiary hover:text-fg"
          copyLabel={`Copy ${entry.name} scaffold command`}
        />
      </div>
    </div>
  );
}
