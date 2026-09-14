"use client";

import {
  ArrowDown as PhArrowDown,
  ArrowLeft as PhArrowLeft,
  ArrowRight as PhArrowRight,
  ArrowUp as PhArrowUp,
  Bell as PhBell,
  Calendar as PhCalendar,
  CaretDown as PhCaretDown,
  Check as PhCheck,
  Download as PhDownload,
  Envelope as PhEnvelope,
  Gear as PhGear,
  Heart as PhHeart,
  House as PhHouse,
  MagnifyingGlass as PhMagnifyingGlass,
  PencilSimple as PhPencilSimple,
  Plus as PhPlus,
  Star as PhStar,
  Trash as PhTrash,
  User as PhUser,
  X as PhX,
} from "@phosphor-icons/react";
import type { IconName, IconSetProps, SvgIconComponent } from "../icon-library-list";

const ICONS = {
  "arrow-right": PhArrowRight,
  "arrow-left": PhArrowLeft,
  "arrow-up": PhArrowUp,
  "arrow-down": PhArrowDown,
  "chevron-down": PhCaretDown,
  search: PhMagnifyingGlass,
  check: PhCheck,
  close: PhX,
  plus: PhPlus,
  heart: PhHeart,
  star: PhStar,
  settings: PhGear,
  user: PhUser,
  bell: PhBell,
  home: PhHouse,
  mail: PhEnvelope,
  calendar: PhCalendar,
  trash: PhTrash,
  download: PhDownload,
  edit: PhPencilSimple,
} satisfies Record<IconName, SvgIconComponent>;

/** Phosphor renderer for the Create studio. Loaded only when Phosphor is rendered. */
export default function PhosphorIcon({ name, className }: IconSetProps) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
