import type { ReactNode } from "react";

export type BlockVariantAppearance = "dark" | "light";

/** One selectable variation for a block detail page. */
export interface BlockVariant {
  /** Stable id used by the block detail variant picker. */
  id: string;
  /** User-facing variation name. */
  name: string;
  /** Short description that explains when to use this variation. */
  description: string;
  /** Preferred gallery appearance used by the family filter and thumbnail theme. */
  appearance?: BlockVariantAppearance;
  /** The rendered block (composed from @cronus-ui/ui). */
  preview: ReactNode;
  /** The full source shown in the Usage code block (should match `preview`). */
  code: string;
}

/** A block's default live preview plus the exact source that renders it. */
export interface BlockContent extends Omit<BlockVariant, "id" | "name" | "description"> {
  /** Optional selectable variations for this block family. */
  variants?: readonly BlockVariant[];
}

/** slug → block content. */
export type BlockContentMap = Readonly<Record<string, BlockContent>>;
