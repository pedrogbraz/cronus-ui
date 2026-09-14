"use client";

import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBell,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconDownload,
  IconHeart,
  IconHome,
  IconMail,
  IconPencil,
  IconPlus,
  IconSearch,
  IconSettings,
  IconStar,
  IconTrash,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import type { IconName, IconSetProps, SvgIconComponent } from "../icon-library-list";

const ICONS = {
  "arrow-right": IconArrowRight,
  "arrow-left": IconArrowLeft,
  "arrow-up": IconArrowUp,
  "arrow-down": IconArrowDown,
  "chevron-down": IconChevronDown,
  search: IconSearch,
  check: IconCheck,
  close: IconX,
  plus: IconPlus,
  heart: IconHeart,
  star: IconStar,
  settings: IconSettings,
  user: IconUser,
  bell: IconBell,
  home: IconHome,
  mail: IconMail,
  calendar: IconCalendar,
  trash: IconTrash,
  download: IconDownload,
  edit: IconPencil,
} satisfies Record<IconName, SvgIconComponent>;

/** Tabler renderer for the Create studio. Loaded only when Tabler is rendered. */
export default function TablerIcon({ name, className }: IconSetProps) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
