"use client";

import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Calendar03Icon,
  Cancel01Icon,
  Delete02Icon,
  Download04Icon,
  Edit02Icon,
  FavouriteIcon,
  Home01Icon,
  Mail01Icon,
  Notification01Icon,
  Search01Icon,
  Settings01Icon,
  StarIcon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconName, IconSetProps } from "../icon-library-list";

const ICONS = {
  "arrow-right": ArrowRight01Icon,
  "arrow-left": ArrowLeft01Icon,
  "arrow-up": ArrowUp01Icon,
  "arrow-down": ArrowDown01Icon,
  "chevron-down": ArrowDown01Icon,
  search: Search01Icon,
  check: Tick02Icon,
  close: Cancel01Icon,
  plus: Add01Icon,
  heart: FavouriteIcon,
  star: StarIcon,
  settings: Settings01Icon,
  user: UserIcon,
  bell: Notification01Icon,
  home: Home01Icon,
  mail: Mail01Icon,
  calendar: Calendar03Icon,
  trash: Delete02Icon,
  download: Download04Icon,
  edit: Edit02Icon,
} satisfies Record<IconName, typeof ArrowRight01Icon>;

/** Hugeicons renderer for the Create studio. Hugeicons ships icon DATA, drawn via its wrapper. Loaded only when Hugeicons is rendered. */
export default function HugeiconsLibraryIcon({ name, className }: IconSetProps) {
  return <HugeiconsIcon icon={ICONS[name]} className={className} aria-hidden="true" />;
}
