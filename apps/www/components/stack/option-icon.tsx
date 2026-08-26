import { cn } from "@kronus-ui/ui";
import {
  Accessibility,
  AppWindow,
  Atom,
  AtSign,
  BookOpen,
  Bot,
  Box,
  CaseSensitive,
  CircleDollarSign,
  CircleSlash,
  Cloud,
  Component,
  Container,
  CreditCard,
  Database,
  Dog,
  Droplets,
  Feather,
  Flame,
  FlaskConical,
  Folder,
  FolderTree,
  GitCommitHorizontal,
  GitFork,
  Github,
  GitMerge,
  Globe,
  Hexagon,
  Layers,
  Layout,
  Leaf,
  type LucideIcon,
  Mountain,
  MousePointer2,
  Package,
  Paintbrush,
  Plane,
  Plug,
  PlugZap,
  Puzzle,
  Rabbit,
  Rocket,
  Route,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Smartphone,
  Sparkles,
  Terminal,
  Triangle,
  Wand,
  WandSparkles,
  Wind,
  Zap,
} from "lucide-react";

/**
 * Static map from the catalog's `icon` string (a lucide-react kebab name) to the
 * concrete icon component. A static map (rather than lucide's lazy `DynamicIcon`)
 * keeps the option grid free of per-card layout shift / loading flashes and is
 * fully tree-shakeable. Every name used in `lib/stack/catalog.ts` is covered;
 * unknown names fall back to {@link Puzzle}.
 */
const ICONS: Record<string, LucideIcon> = {
  accessibility: Accessibility,
  "app-window": AppWindow,
  atom: Atom,
  "at-sign": AtSign,
  "book-open": BookOpen,
  "case-sensitive": CaseSensitive,
  folder: Folder,
  "folder-tree": FolderTree,
  "git-commit": GitCommitHorizontal,
  bot: Bot,
  box: Box,
  "circle-dollar-sign": CircleDollarSign,
  "circle-slash": CircleSlash,
  cloud: Cloud,
  component: Component,
  container: Container,
  "credit-card": CreditCard,
  database: Database,
  dog: Dog,
  droplets: Droplets,
  feather: Feather,
  flame: Flame,
  "flask-conical": FlaskConical,
  "git-fork": GitFork,
  "git-merge": GitMerge,
  github: Github,
  globe: Globe,
  hexagon: Hexagon,
  layers: Layers,
  layout: Layout,
  leaf: Leaf,
  mountain: Mountain,
  "mouse-pointer-2": MousePointer2,
  package: Package,
  paintbrush: Paintbrush,
  plane: Plane,
  plug: Plug,
  "plug-zap": PlugZap,
  rabbit: Rabbit,
  rocket: Rocket,
  route: Route,
  server: Server,
  settings: Settings,
  shield: Shield,
  "shield-alert": ShieldAlert,
  "shield-check": ShieldCheck,
  siren: Siren,
  smartphone: Smartphone,
  sparkles: Sparkles,
  terminal: Terminal,
  triangle: Triangle,
  wand: Wand,
  "wand-sparkles": WandSparkles,
  wind: Wind,
  zap: Zap,
};

/** Resolve a catalog icon name to its lucide component (defaults to {@link Puzzle}). */
export function optionIcon(name: string | undefined): LucideIcon {
  return (name && ICONS[name]) || Puzzle;
}

export interface OptionIconProps {
  /** Catalog icon name (a lucide kebab id); falls back to {@link Puzzle}. */
  name: string | undefined;
  /** Whether the owning option is currently selected (drives the accent fill). */
  selected: boolean;
}

/**
 * The rounded icon tile shown at the top-left of an {@link OptionCard}. The tile
 * itself stays a single consistent neutral surface in every state — only the icon
 * colour shifts (to full `fg` when selected, warming on hover otherwise), so the
 * grid reads calm and uniform. Purely presentational; size/colour live here so
 * every card's tile is identical.
 *
 * Transitions are a short colour tween only (no transform, no glow) so there is
 * never layout shift inside the grid.
 */
export function OptionIcon({ name, selected }: OptionIconProps) {
  const Icon = optionIcon(name);
  return (
    <span
      data-slot="option-icon"
      data-selected={selected || undefined}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-overlay transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] [&_svg]:size-4.5 motion-reduce:transition-none",
        selected ? "text-fg" : "text-fg-secondary group-hover/option:text-fg",
      )}
    >
      <Icon aria-hidden="true" />
    </span>
  );
}
