"use client";

import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiCalendarLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiEditLine,
  RiHeartLine,
  RiHomeLine,
  RiMailLine,
  RiNotification3Line,
  RiSearchLine,
  RiSettings3Line,
  RiStarLine,
  RiUserLine,
} from "@remixicon/react";
import type { IconName, IconSetProps, SvgIconComponent } from "../icon-library-list";

const ICONS = {
  "arrow-right": RiArrowRightLine,
  "arrow-left": RiArrowLeftLine,
  "arrow-up": RiArrowUpLine,
  "arrow-down": RiArrowDownLine,
  "chevron-down": RiArrowDownSLine,
  search: RiSearchLine,
  check: RiCheckLine,
  close: RiCloseLine,
  plus: RiAddLine,
  heart: RiHeartLine,
  star: RiStarLine,
  settings: RiSettings3Line,
  user: RiUserLine,
  bell: RiNotification3Line,
  home: RiHomeLine,
  mail: RiMailLine,
  calendar: RiCalendarLine,
  trash: RiDeleteBinLine,
  download: RiDownloadLine,
  edit: RiEditLine,
} satisfies Record<IconName, SvgIconComponent>;

/** Remix renderer for the Create studio. Loaded only when Remix is rendered. */
export default function RemixIcon({ name, className }: IconSetProps) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
