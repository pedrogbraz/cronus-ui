/**
 * Icon-library DATA + renderer for the Cronus UI "Create" studio.
 *
 * Client component (`"use client"`): it renders React icon components from five
 * installed icon libraries so the studio can preview the SAME curated icons in
 * whichever library the user selects.
 *
 * Every import below is a TREE-SHAKEABLE named import — never `import *` — so the
 * `/create` bundle only pulls the ~20 icons we actually reference per library.
 * Each `IconName` is mapped to the exact, verified component (or, for Hugeicons,
 * the icon DATA passed to its `<HugeiconsIcon>` wrapper) in all five libraries.
 */

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
import type { ComponentType } from "react";
import { ICON_LIBRARIES, type IconLibraryId } from "./icon-library-list";

/* ------------------------------------------------------------------ *
 * 1. LIBRARIES — re-exported from the pure server-safe metadata module so
 *    every consumer has one import surface (`./icon-libraries`).
 * ------------------------------------------------------------------ */

export { ICON_LIBRARIES, type IconLibraryId };

/* ------------------------------------------------------------------ *
 * 2. ICON SET — ~20 common, universal icons that exist in ALL 5 libs.
 *    Each name maps to the exact verified component / data per library.
 *    Hugeicons exports icon DATA (passed to <HugeiconsIcon icon={...} />);
 *    the other four export React components rendered directly.
 * ------------------------------------------------------------------ */

/**
 * A directly-rendered icon component. All four non-Hugeicons libraries accept a
 * `className` + `aria-hidden` (Lucide/Tabler/Phosphor are forwardRef
 * components, Remix is a class component) — this prop shape covers them all.
 */
type SvgIconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/** Per-library entry: a direct component for 4 libs, icon data for Hugeicons. */
interface IconEntry {
  lucide: SvgIconComponent;
  tabler: SvgIconComponent;
  phosphor: SvgIconComponent;
  /** Hugeicons ships icon DATA, not components — rendered via its wrapper. */
  hugeicons: typeof ArrowRight01Icon;
  remix: SvgIconComponent;
}

const ICON_MAP = {
  "arrow-right": {
    lucide: ArrowRight,
    tabler: IconArrowRight,
    phosphor: PhArrowRight,
    hugeicons: ArrowRight01Icon,
    remix: RiArrowRightLine,
  },
  "arrow-left": {
    lucide: ArrowLeft,
    tabler: IconArrowLeft,
    phosphor: PhArrowLeft,
    hugeicons: ArrowLeft01Icon,
    remix: RiArrowLeftLine,
  },
  "arrow-up": {
    lucide: ArrowUp,
    tabler: IconArrowUp,
    phosphor: PhArrowUp,
    hugeicons: ArrowUp01Icon,
    remix: RiArrowUpLine,
  },
  "arrow-down": {
    lucide: ArrowDown,
    tabler: IconArrowDown,
    phosphor: PhArrowDown,
    hugeicons: ArrowDown01Icon,
    remix: RiArrowDownLine,
  },
  "chevron-down": {
    lucide: ChevronDown,
    tabler: IconChevronDown,
    phosphor: PhCaretDown,
    hugeicons: ArrowDown01Icon,
    remix: RiArrowDownSLine,
  },
  search: {
    lucide: Search,
    tabler: IconSearch,
    phosphor: PhMagnifyingGlass,
    hugeicons: Search01Icon,
    remix: RiSearchLine,
  },
  check: {
    lucide: Check,
    tabler: IconCheck,
    phosphor: PhCheck,
    hugeicons: Tick02Icon,
    remix: RiCheckLine,
  },
  close: {
    lucide: X,
    tabler: IconX,
    phosphor: PhX,
    hugeicons: Cancel01Icon,
    remix: RiCloseLine,
  },
  plus: {
    lucide: Plus,
    tabler: IconPlus,
    phosphor: PhPlus,
    hugeicons: Add01Icon,
    remix: RiAddLine,
  },
  heart: {
    lucide: Heart,
    tabler: IconHeart,
    phosphor: PhHeart,
    hugeicons: FavouriteIcon,
    remix: RiHeartLine,
  },
  star: {
    lucide: Star,
    tabler: IconStar,
    phosphor: PhStar,
    hugeicons: StarIcon,
    remix: RiStarLine,
  },
  settings: {
    lucide: Settings,
    tabler: IconSettings,
    phosphor: PhGear,
    hugeicons: Settings01Icon,
    remix: RiSettings3Line,
  },
  user: {
    lucide: User,
    tabler: IconUser,
    phosphor: PhUser,
    hugeicons: UserIcon,
    remix: RiUserLine,
  },
  bell: {
    lucide: Bell,
    tabler: IconBell,
    phosphor: PhBell,
    hugeicons: Notification01Icon,
    remix: RiNotification3Line,
  },
  home: {
    lucide: House,
    tabler: IconHome,
    phosphor: PhHouse,
    hugeicons: Home01Icon,
    remix: RiHomeLine,
  },
  mail: {
    lucide: Mail,
    tabler: IconMail,
    phosphor: PhEnvelope,
    hugeicons: Mail01Icon,
    remix: RiMailLine,
  },
  calendar: {
    lucide: Calendar,
    tabler: IconCalendar,
    phosphor: PhCalendar,
    hugeicons: Calendar03Icon,
    remix: RiCalendarLine,
  },
  trash: {
    lucide: Trash2,
    tabler: IconTrash,
    phosphor: PhTrash,
    hugeicons: Delete02Icon,
    remix: RiDeleteBinLine,
  },
  download: {
    lucide: Download,
    tabler: IconDownload,
    phosphor: PhDownload,
    hugeicons: Download04Icon,
    remix: RiDownloadLine,
  },
  edit: {
    lucide: SquarePen,
    tabler: IconPencil,
    phosphor: PhPencilSimple,
    hugeicons: Edit02Icon,
    remix: RiEditLine,
  },
} satisfies Record<string, IconEntry>;

export type IconName = keyof typeof ICON_MAP;

/** The ordered icons shown in the studio's live preview grid. */
export const ICON_SHOWCASE: IconName[] = Object.keys(ICON_MAP) as IconName[];

/* ------------------------------------------------------------------ *
 * 3. RENDERER — draw one icon in the selected library. Size via className
 *    (e.g. `size-5`); Hugeicons needs its wrapper, the rest render direct.
 * ------------------------------------------------------------------ */

export function LibraryIcon({
  library,
  name,
  className,
}: {
  library: IconLibraryId;
  name: IconName;
  className?: string;
}) {
  const entry = ICON_MAP[name];
  if (library === "hugeicons") {
    return <HugeiconsIcon icon={entry.hugeicons} className={className} aria-hidden="true" />;
  }
  const Icon = entry[library];
  return <Icon className={className} aria-hidden="true" />;
}
