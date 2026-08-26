"use client";

import { cn } from "@cronus-ui/ui";
import { aiBlocks } from "../../lib/blocks/ai";
import { applicationBlocks } from "../../lib/blocks/application";
import { billingBlocks } from "../../lib/blocks/billing";
import { commerceBlocks } from "../../lib/blocks/commerce";
import { contentBlocks } from "../../lib/blocks/content";
import { dashboardBlocks } from "../../lib/blocks/dashboard";
import { integrationsBlocks } from "../../lib/blocks/integrations";
import { marketingBlocks } from "../../lib/blocks/marketing";
import { notificationsBlocks } from "../../lib/blocks/notifications";
import { type BlockFamily, getBlockFamily } from "../../lib/blocks/registry";
import { resolveBlockVariationFrom } from "../../lib/blocks/resolve";
import type { BlockContentMap } from "../../lib/blocks/types";
import { waitlistBlocks } from "../../lib/blocks/waitlist";
import {
  blockLabel,
  stageRefs,
  type TemplateBlockRef,
  type TemplateCatalogEntry,
} from "../../lib/templates/catalog";

/**
 * Family maps needed to render every catalog stage. Keep this list in sync
 * with `TEMPLATE_CATALOG` block slugs — a missing family is skipped at runtime.
 */
const FAMILY_MAPS: Partial<Record<BlockFamily, BlockContentMap>> = {
  ai: aiBlocks,
  application: applicationBlocks,
  billing: billingBlocks,
  commerce: commerceBlocks,
  content: contentBlocks,
  dashboard: dashboardBlocks,
  integrations: integrationsBlocks,
  marketing: marketingBlocks,
  notifications: notificationsBlocks,
  waitlist: waitlistBlocks,
};

function previewFor(ref: TemplateBlockRef) {
  const family = getBlockFamily(ref.block);
  const map = family ? FAMILY_MAPS[family] : undefined;
  if (!map) return undefined;
  return resolveBlockVariationFrom(map, ref.block, ref.variant)?.variant.preview;
}

/**
 * Stacks the same block variants a compose manifest installs, inside the
 * template's theme/mode scope. Used by `/preview/t/[slug]` (full site and
 * embed thumbs) — live Cronus blocks, not screenshots.
 */
export function TemplateStage({ entry }: { entry: TemplateCatalogEntry }) {
  const refs = stageRefs(entry);

  return (
    <div
      data-slot="template-stage"
      data-template={entry.slug}
      data-cronus-theme={entry.theme}
      data-cronus-mode={entry.mode}
      className={cn(
        "min-h-svh bg-surface-base text-fg",
        entry.mode === "dark" ? "dark" : undefined,
      )}
    >
      {refs.map((ref) => {
        const preview = previewFor(ref);
        if (!preview) return null;
        return (
          <div key={blockLabel(ref)} data-slot="template-block" data-block={blockLabel(ref)}>
            {preview}
          </div>
        );
      })}
    </div>
  );
}
