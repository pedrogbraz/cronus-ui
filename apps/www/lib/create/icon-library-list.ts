import type { ComponentType } from "react";

/**
 * Pure, server-safe icon-library METADATA for the Cronus UI "Create" studio.
 *
 * NO "use client", NO icon imports — just the selectable library ids + display
 * names, the curated icon names, and the shared types. Each library's icon
 * components/data live in `./icon-sets/<id>.tsx`, loaded on demand by the
 * `"use client"` sibling `icon-libraries.tsx`, which re-exports everything here so
 * callers have a single import surface.
 *
 * Keeping this list pure lets server-safe modules (`presets.ts`, `types.ts`)
 * validate / default `iconLibrary` without pulling any icon runtime — or a
 * client boundary — into RSC pages like `app/docs/theming`.
 */

export const ICON_LIBRARIES = [
  { id: "lucide", name: "Lucide" },
  { id: "tabler", name: "Tabler" },
  { id: "phosphor", name: "Phosphor" },
  { id: "hugeicons", name: "Hugeicons" },
  { id: "remix", name: "Remix" },
] as const;

export type IconLibraryId = (typeof ICON_LIBRARIES)[number]["id"];

/**
 * ~20 common, universal icons that exist in ALL 5 libraries, in showcase order.
 * Every `./icon-sets/<id>.tsx` maps each name to its verified component / data
 * (checked by `satisfies Record<IconName, …>`).
 */
export const ICON_NAMES = [
  "arrow-right",
  "arrow-left",
  "arrow-up",
  "arrow-down",
  "chevron-down",
  "search",
  "check",
  "close",
  "plus",
  "heart",
  "star",
  "settings",
  "user",
  "bell",
  "home",
  "mail",
  "calendar",
  "trash",
  "download",
  "edit",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/**
 * A directly-rendered icon component. All four non-Hugeicons libraries accept a
 * `className` + `aria-hidden` (Lucide/Tabler/Phosphor are forwardRef
 * components, Remix is a class component) — this prop shape covers them all.
 */
export type SvgIconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/** Props of every per-library renderer in `./icon-sets/<id>.tsx`. */
export interface IconSetProps {
  name: IconName;
  className?: string;
}
