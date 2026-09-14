"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  Download,
  Heart,
  House,
  Mail,
  Plus,
  Search,
  Settings,
  SquarePen,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { IconName, IconSetProps, SvgIconComponent } from "../icon-library-list";

const ICONS = {
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "chevron-down": ChevronDown,
  search: Search,
  check: Check,
  close: X,
  plus: Plus,
  heart: Heart,
  star: Star,
  settings: Settings,
  user: User,
  bell: Bell,
  home: House,
  mail: Mail,
  calendar: Calendar,
  trash: Trash2,
  download: Download,
  edit: SquarePen,
} satisfies Record<IconName, SvgIconComponent>;

/** Lucide renderer for the Create studio. Loaded only when Lucide is rendered. */
export default function LucideIcon({ name, className }: IconSetProps) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" />;
}
