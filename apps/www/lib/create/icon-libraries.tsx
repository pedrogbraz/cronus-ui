/**
 * Icon-library renderer for the Cronus UI "Create" studio.
 *
 * Client component (`"use client"`): it previews the SAME curated icons in
 * whichever of the five installed icon libraries the user selects.
 *
 * Each library lives in its own `./icon-sets/<id>.tsx` module behind
 * `next/dynamic`, so `/create` only loads the library that is actually
 * rendered; picking another library fetches that set on demand. Inside a set,
 * imports stay TREE-SHAKEABLE named imports (never `import *`).
 */

"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  ICON_LIBRARIES,
  ICON_NAMES,
  type IconLibraryId,
  type IconName,
  type IconSetProps,
} from "./icon-library-list";

export { ICON_LIBRARIES, type IconLibraryId, type IconName };

/** The ordered icons shown in the studio's live preview grid. */
export const ICON_SHOWCASE: IconName[] = [...ICON_NAMES];

const ICON_SETS: Record<IconLibraryId, ComponentType<IconSetProps>> = {
  lucide: dynamic(() => import("./icon-sets/lucide")),
  tabler: dynamic(() => import("./icon-sets/tabler")),
  phosphor: dynamic(() => import("./icon-sets/phosphor")),
  hugeicons: dynamic(() => import("./icon-sets/hugeicons")),
  remix: dynamic(() => import("./icon-sets/remix")),
};

/** Draw one icon in the selected library. Size via className (e.g. `size-5`). */
export function LibraryIcon({
  library,
  name,
  className,
}: {
  library: IconLibraryId;
  name: IconName;
  className?: string;
}) {
  const Icon = ICON_SETS[library];
  return <Icon name={name} className={className} />;
}
