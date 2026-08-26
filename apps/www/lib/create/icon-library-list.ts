/**
 * Pure, server-safe icon-library METADATA for the Cronus UI "Create" studio.
 *
 * NO "use client", NO icon imports — just the selectable library ids + display
 * names and their id type. The actual icon components/data and the React
 * renderer live in the `"use client"` sibling `icon-libraries.tsx`, which
 * re-exports everything here so callers have a single import surface.
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
