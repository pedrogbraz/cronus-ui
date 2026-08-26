"use client";

import { useTheme } from "@cronus-ui/theme";
import type { ThemeOverrides } from "@cronus-ui/tokens";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  Input,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@cronus-ui/ui";
import {
  Check,
  Code2,
  Copy,
  Dices,
  Download,
  Lock,
  LockOpen,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  Save,
  Share2,
  SlidersHorizontal,
  type Sparkles,
  Sun,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ICON_LIBRARIES,
  ICON_SHOWCASE,
  type IconLibraryId,
  LibraryIcon,
} from "../../lib/create/icon-libraries";
import {
  BASE_COLORS,
  BRAND_COLORS,
  CHART_PALETTES,
  CUSTOM_STYLE_NAME,
  configFromPreset,
  configToThemeOverrides,
  createSavedPreset,
  DEFAULT_CONFIG,
  decodeConfigParam,
  encodeConfigParam,
  FONT_CHOICES,
  findBaseColor,
  findBrandColor,
  findChartPalette,
  findFontChoice,
  makeShuffledConfig,
  markCustom,
  parsePresetCode,
  STYLE_PRESETS,
  serializeCreateCss,
  serializeCreateJson,
  serializeCreateProvider,
  serializePresetCode,
} from "../../lib/create/presets";
import type {
  BrandColor,
  ChartPalette,
  DesignConfig,
  Mode,
  StylePreset,
} from "../../lib/create/types";
import { SectionGlow } from "../showcase-ui";
import { LiftTile } from "./lift-card";
import { PreviewDashboard } from "./preview-dashboard";

const STORAGE_KEY = "cronus-ui-create-presets-v1";
type CodeTab = "install" | "provider" | "css" | "json";
type PackageManager = "bun" | "pnpm" | "npm" | "yarn";
type LockKey = "mode" | "base" | "brand" | "chart" | "heading" | "body" | "icon" | "radius";

const codeTabs: { id: CodeTab; label: string }[] = [
  { id: "install", label: "Install" },
  { id: "provider", label: "Provider" },
  { id: "css", label: "CSS vars" },
  { id: "json", label: "Preset JSON" },
];

const installCommands: Record<PackageManager, string> = {
  bun: "bun add @cronus-ui/ui @cronus-ui/theme @cronus-ui/tokens",
  pnpm: "pnpm add @cronus-ui/ui @cronus-ui/theme @cronus-ui/tokens",
  npm: "npm install @cronus-ui/ui @cronus-ui/theme @cronus-ui/tokens",
  yarn: "yarn add @cronus-ui/ui @cronus-ui/theme @cronus-ui/tokens",
};

const defaultLocks: Record<LockKey, boolean> = {
  mode: false,
  base: false,
  brand: false,
  chart: false,
  heading: false,
  body: false,
  icon: false,
  radius: false,
};

/**
 * One-shot, CSS-only entrance (Tailwind v4 `@starting-style`): the column
 * fades and rises into place on first paint. Stagger it with a `delay-*`
 * utility on the same element — during the delay the column simply holds its
 * starting (hidden) state, so the controls, preview, and rail land in
 * sequence. Pure CSS (zero JS, no hydration coupling — this route's
 * first-load budget is tight) and reduced-motion safe: the offsets collapse
 * and the transition is disabled.
 */
const ENTER =
  "transition-[opacity,translate] duration-300 ease-[cubic-bezier(.22,1,.36,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none motion-reduce:starting:translate-y-0 motion-reduce:starting:opacity-100";

/**
 * The studio re-themes the live tokens on every control change; the chrome
 * and preview surfaces tween their colors so re-theming feels liquid instead
 * of snapping. Colors only — hover lifts/shadows keep their own transitions.
 */
const LIQUID =
  "transition-colors duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none";

/**
 * Stable positional keys for the 5-step chart ramps so a palette change
 * recolors the same elements in place — letting each swatch tween via
 * {@link LIQUID} — instead of remounting them (palettes always carry exactly
 * five series colors; see `CHART_PALETTES`).
 */
const RAMP_STEPS = ["ramp-1", "ramp-2", "ramp-3", "ramp-4", "ramp-5"] as const;

/**
 * Micro pop-in for a freshly selected swatch dot: key the dot by its color and
 * this `@starting-style` scale/fade runs whenever the selection changes.
 * Reduced-motion safe (starting state collapses, transition disabled).
 */
const SWATCH_POP =
  "transition-[opacity,scale] duration-200 ease-[cubic-bezier(.22,1,.36,1)] starting:scale-50 starting:opacity-0 motion-reduce:transition-none motion-reduce:starting:scale-100 motion-reduce:starting:opacity-100";

export function CreateStudio() {
  const { mode: ambientMode, overrides: ambientOverrides, setMode, setOverrides } = useTheme();
  const initialThemeRef = useRef<{ mode: Mode; overrides: ThemeOverrides } | null>(null);
  const [config, setConfig] = useState<DesignConfig>(DEFAULT_CONFIG);
  const [savedPresets, setSavedPresets] = useState<StylePreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [codeOpen, setCodeOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [codeTab, setCodeTab] = useState<CodeTab>("install");
  const [packageManager, setPackageManager] = useState<PackageManager>("bun");
  const [locks, setLocks] = useState<Record<LockKey, boolean>>(defaultLocks);
  const [presetCode, setPresetCode] = useState("");
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  if (initialThemeRef.current === null) {
    initialThemeRef.current = { mode: ambientMode as Mode, overrides: ambientOverrides };
  }

  const allPresets = useMemo(() => [...STYLE_PRESETS, ...savedPresets], [savedPresets]);
  const overrides = useMemo(() => configToThemeOverrides(config), [config]);
  const selectedBrand = findBrandColor(config.brand);
  const selectedChart = findChartPalette(config.chart);
  const currentPreset = useMemo(() => createSavedPreset(config.style, config), [config]);
  const currentPresetCode = useMemo(() => serializePresetCode(currentPreset), [currentPreset]);
  const activeCode = useMemo(() => {
    if (codeTab === "install") return installCommands[packageManager];
    if (codeTab === "provider") return serializeCreateProvider(config);
    if (codeTab === "json") return serializeCreateJson(config);
    return serializeCreateCss(config);
  }, [codeTab, config, packageManager]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StylePreset[];
      if (Array.isArray(parsed)) setSavedPresets(parsed.filter((preset) => preset.custom));
    } catch {
      // Ignore malformed or blocked storage.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPresets));
    } catch {
      // Ignore quota / privacy mode failures.
    }
  }, [savedPresets]);

  // Hydrate from a shared `?c=` permalink exactly once on mount (guarded). The
  // `hydrated` flag gates the URL mirror below so it never overwrites an
  // incoming token before the decoded config has been committed.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    try {
      const token = new URLSearchParams(window.location.search).get("c");
      const shared = decodeConfigParam(token);
      if (shared) setConfig(shared);
    } catch {
      // Malformed permalink — fall back to the default config.
    }
    setHydrated(true);
  }, []);

  // Mirror the live config into the URL (`?c=`) without spamming history.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const token = encodeConfigParam(config);
      const url = new URL(window.location.href);
      if (token) {
        url.searchParams.set("c", token);
      } else {
        url.searchParams.delete("c");
      }
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
    } catch {
      // history / URL APIs unavailable in restricted previews.
    }
  }, [config, hydrated]);

  useEffect(() => {
    setMode(config.mode);
    setOverrides(overrides);
  }, [config.mode, overrides, setMode, setOverrides]);

  useEffect(() => {
    return () => {
      const initial = initialThemeRef.current;
      if (!initial) return;
      setMode(initial.mode);
      setOverrides(initial.overrides);
    };
  }, [setMode, setOverrides]);

  function patchConfig(patch: Partial<DesignConfig>) {
    setConfig((current) => markCustom({ ...current, ...patch }));
  }

  function applyPreset(preset: StylePreset) {
    setConfig(configFromPreset(preset));
  }

  function savePreset() {
    const name = presetName.trim();
    if (!name) return;
    const preset = createSavedPreset(name, config);
    setSavedPresets((current) => [preset, ...current].slice(0, 18));
    setConfig(configFromPreset(preset));
    setPresetName("");
  }

  function shuffle() {
    const shuffled = makeShuffledConfig(Date.now());
    setConfig((current) => ({
      ...shuffled,
      mode: locks.mode ? current.mode : shuffled.mode,
      baseColor: locks.base ? current.baseColor : shuffled.baseColor,
      brand: locks.brand ? current.brand : shuffled.brand,
      chart: locks.chart ? current.chart : shuffled.chart,
      headingFont: locks.heading ? current.headingFont : shuffled.headingFont,
      bodyFont: locks.body ? current.bodyFont : shuffled.bodyFont,
      iconLibrary: locks.icon ? current.iconLibrary : shuffled.iconLibrary,
      radius: locks.radius ? current.radius : shuffled.radius,
    }));
  }

  function toggleLock(key: LockKey) {
    setLocks((current) => ({ ...current, [key]: !current[key] }));
  }

  function importPreset() {
    try {
      const preset = parsePresetCode(presetCode);
      setSavedPresets((current) => [preset, ...current].slice(0, 18));
      setConfig(configFromPreset(preset));
      setPresetCode("");
      setImportError("");
      setLiveMessage("Preset imported");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Could not import preset.");
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setLiveMessage("Copied to clipboard");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable in restricted previews.
    }
  }

  async function copyPresetCode() {
    try {
      await navigator.clipboard.writeText(currentPresetCode);
      setCopied(true);
      setLiveMessage("Preset code copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable in restricted previews.
    }
  }

  async function shareLink() {
    try {
      const token = encodeConfigParam(config);
      const url = new URL(window.location.href);
      if (token) {
        url.searchParams.set("c", token);
      } else {
        url.searchParams.delete("c");
      }
      await navigator.clipboard.writeText(url.toString());
      setShareCopied(true);
      setLiveMessage("Share link copied");
      window.setTimeout(() => setShareCopied(false), 1600);
    } catch {
      // Clipboard / URL may be unavailable in restricted previews.
    }
  }

  return (
    <main
      id="main-content"
      className={cn("relative isolate min-h-[calc(100vh-4rem)] bg-surface-base text-fg", LIQUID)}
    >
      {/* Aurora-glass accent: a glowing hairline on the page's top edge + a
          soft aurora bloom bleeding down. It sits behind the translucent
          controls/toolbar chrome, so the backdrop-blur surfaces catch the same
          blue-glass shimmer as the site nav. `isolate` keeps the bloom's
          negative z-index above this page's own background. */}
      <SectionGlow />
      <span className="sr-only" aria-live="polite">
        {liveMessage}
      </span>
      <div className="grid min-h-[calc(100vh-4rem)] xl:grid-cols-[20rem_minmax(0,1fr)]">
        <aside
          className={cn(
            "hidden border-border/70 bg-surface-inset/80 p-5 backdrop-blur-xl xl:sticky xl:top-16 xl:block xl:h-[calc(100vh-4rem)] xl:overflow-y-auto xl:border-r",
            LIQUID,
          )}
        >
          {/* Entrance wrapper (not the aside itself) so the stagger's
              opacity/transform transition never fights the aside's color tween. */}
          <div className={ENTER}>
            <CreateControls
              idPrefix="create-desktop"
              config={config}
              allPresets={allPresets}
              selectedBrand={selectedBrand}
              locks={locks}
              presetName={presetName}
              onApplyPreset={applyPreset}
              onPatchConfig={patchConfig}
              onToggleLock={toggleLock}
              onPresetNameChange={setPresetName}
              onSavePreset={savePreset}
              onShuffle={shuffle}
              onGetCode={() => setCodeOpen(true)}
            />
          </div>
        </aside>

        <section className="min-w-0">
          <div
            className={cn(
              "sticky top-16 z-30 border-border/70 border-b bg-surface-base/82 px-4 py-3.5 backdrop-blur-xl sm:px-6",
              LIQUID,
            )}
          >
            <div className="mx-auto flex max-w-[100rem] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-border-soft transition-[background-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ backgroundColor: selectedBrand.swatch }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  {/* Rail-scale echo of the site-wide Eyebrow, completing the
                      eyebrow → title → lede rhythm the rest of the site uses. */}
                  <p className="mb-0.5 hidden items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-widest text-fg-tertiary sm:flex">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-fg-tertiary" />
                    Create studio
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="truncate font-display text-xl font-medium tracking-[-0.02em] text-fg sm:text-2xl">
                      Create a design system
                    </h1>
                    <Badge variant="secondary">{config.style}</Badge>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {selectedBrand.name}
                    </Badge>
                    <Badge variant="outline" className="hidden sm:inline-flex">
                      {selectedChart.name} charts
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-fg-secondary">
                    {findFontChoice(config.headingFont).name} headings ·{" "}
                    {findFontChoice(config.bodyFont).name} body · {config.radius}px radius
                  </p>
                </div>
              </div>
              <TooltipProvider delayDuration={250}>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5 rounded-xl border border-border-soft bg-surface-raised p-1 shadow-sm">
                    <IconAction
                      icon={RotateCcw}
                      label="Reset to default"
                      onClick={() => setConfig(DEFAULT_CONFIG)}
                    />
                    <IconAction
                      icon={config.mode === "dark" ? Sun : Moon}
                      label={
                        config.mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
                      }
                      onClick={() =>
                        patchConfig({ mode: config.mode === "dark" ? "light" : "dark" })
                      }
                    />
                    <IconAction
                      icon={focusMode ? Minimize2 : Maximize2}
                      label={focusMode ? "Exit focus preview" : "Focus the preview"}
                      active={focusMode}
                      onClick={() => setFocusMode((open) => !open)}
                    />
                    <span className="mx-0.5 h-5 w-px bg-border-soft" aria-hidden="true" />
                    <IconAction
                      icon={shareCopied ? Check : Share2}
                      label={shareCopied ? "Link copied" : "Copy a shareable link"}
                      active={shareCopied}
                      onClick={shareLink}
                    />
                  </div>
                  <Button variant="outline" onClick={shuffle}>
                    <Dices aria-hidden="true" />
                    Shuffle
                  </Button>
                  <Button variant="primary" onClick={() => setCodeOpen(true)}>
                    <Code2 aria-hidden="true" />
                    Get code
                  </Button>
                </div>
              </TooltipProvider>
            </div>
          </div>

          <div
            className={cn(
              "mx-auto grid max-w-[100rem] gap-6 px-4 py-6 pb-24 sm:px-6 xl:pb-6",
              focusMode ? "2xl:grid-cols-1" : "2xl:grid-cols-[minmax(0,1fr)_22rem]",
            )}
          >
            <div className={cn("min-w-0", ENTER, "delay-100")}>
              <div
                className={cn(
                  "overflow-hidden rounded-3xl border border-border-soft bg-surface-inset p-4 shadow-lg sm:p-6",
                  LIQUID,
                )}
              >
                <PreviewDashboard />
                <ComponentSampler config={config} />
              </div>
            </div>

            {focusMode ? null : (
              <div
                className={cn(
                  "grid gap-5 2xl:sticky 2xl:top-36 2xl:self-start",
                  ENTER,
                  "delay-200",
                )}
              >
                <TokenSummary config={config} />
                <IconLibraryShowcase iconLibrary={config.iconLibrary} />
                <PresetExchange
                  presetCode={presetCode}
                  error={importError}
                  onPresetCodeChange={setPresetCode}
                  onImport={importPreset}
                  onCopyPreset={copyPresetCode}
                />
              </div>
            )}
          </div>
        </section>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-border/70 border-t bg-surface-base/90 px-4 py-3 backdrop-blur-xl xl:hidden",
          LIQUID,
        )}
      >
        <div className={cn("mx-auto flex max-w-[100rem] items-center gap-2", ENTER, "delay-150")}>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setControlsOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={controlsOpen}
          >
            <SlidersHorizontal aria-hidden="true" />
            Controls
          </Button>
          <Button variant="outline" size="icon" onClick={shuffle} aria-label="Shuffle design">
            <Dices aria-hidden="true" />
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => setCodeOpen(true)}>
            <Code2 aria-hidden="true" />
            Get code
          </Button>
        </div>
      </div>

      <Drawer open={controlsOpen} onOpenChange={setControlsOpen}>
        <DrawerContent className="max-h-[88vh] xl:hidden">
          <DrawerHeader className="text-left">
            <DrawerTitle>Design controls</DrawerTitle>
            <DrawerDescription>
              Tune style, color, typography, and radius. The preview updates live.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">
            <CreateControls
              idPrefix="create-mobile"
              config={config}
              allPresets={allPresets}
              selectedBrand={selectedBrand}
              locks={locks}
              presetName={presetName}
              onApplyPreset={applyPreset}
              onPatchConfig={patchConfig}
              onToggleLock={toggleLock}
              onPresetNameChange={setPresetName}
              onSavePreset={savePreset}
              onShuffle={shuffle}
              onGetCode={() => {
                setControlsOpen(false);
                setCodeOpen(true);
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <CodeDialog
        open={codeOpen}
        onOpenChange={setCodeOpen}
        activeTab={codeTab}
        code={activeCode}
        copied={copied}
        packageManager={packageManager}
        presetJson={serializeCreateJson(config)}
        onPackageManagerChange={setPackageManager}
        onCopy={copyCode}
        onTabChange={setCodeTab}
      />
    </main>
  );
}

function CreateControls({
  idPrefix,
  config,
  allPresets,
  selectedBrand,
  locks,
  presetName,
  onApplyPreset,
  onPatchConfig,
  onToggleLock,
  onPresetNameChange,
  onSavePreset,
  onShuffle,
  onGetCode,
}: {
  idPrefix: string;
  config: DesignConfig;
  allPresets: StylePreset[];
  selectedBrand: BrandColor;
  locks: Record<LockKey, boolean>;
  presetName: string;
  onApplyPreset: (preset: StylePreset) => void;
  onPatchConfig: (patch: Partial<DesignConfig>) => void;
  onToggleLock: (key: LockKey) => void;
  onPresetNameChange: (value: string) => void;
  onSavePreset: () => void;
  onShuffle: () => void;
  onGetCode: () => void;
}) {
  const baseName = findBaseColor(config.baseColor).name;
  return (
    <>
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-2xl border border-border-soft bg-surface-raised px-3.5 py-3 shadow-sm",
          "transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
        )}
      >
        <span
          className="pointer-events-none absolute -right-10 -top-12 -z-10 size-32 rounded-full opacity-25 blur-2xl transition-[opacity,background-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
          style={{ backgroundColor: selectedBrand.swatch }}
          aria-hidden="true"
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset ring-border-soft transition-[background-color] duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{ backgroundColor: selectedBrand.swatch }}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold text-fg">{config.style}</p>
              <p className="truncate text-xs text-fg-tertiary">
                <span className="capitalize">{baseName}</span> · design system
              </p>
            </div>
          </div>
          <Badge
            variant={config.style === CUSTOM_STYLE_NAME ? "warning" : "primary"}
            className="capitalize"
          >
            {config.mode}
          </Badge>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <ControlRow title="Style" hint="Start from a curated look" htmlFor={`${idPrefix}-style`}>
          <Select
            value={config.style}
            onValueChange={(name) => {
              const preset = allPresets.find((item) => item.name === name);
              if (preset) onApplyPreset(preset);
            }}
          >
            <SelectTrigger id={`${idPrefix}-style`} aria-label="Style preset">
              <SelectValue placeholder="Pick a style">
                <SwatchOption swatch={selectedBrand.swatch} label={config.style} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {config.style === CUSTOM_STYLE_NAME ? (
                <SelectItem value={CUSTOM_STYLE_NAME}>
                  <SwatchOption swatch={selectedBrand.swatch} label={CUSTOM_STYLE_NAME} />
                </SelectItem>
              ) : null}
              {allPresets.map((preset) => (
                <SelectItem key={preset.id} value={preset.name}>
                  <SwatchOption
                    swatch={findBrandColor(preset.config.brand).swatch}
                    label={preset.name}
                  />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlRow>

        <ControlSection label="Color">
          <ControlRow
            title="Mode"
            hint="Light or dark surfaces"
            htmlFor={`${idPrefix}-mode`}
            action={
              <LockToggle
                active={locks.mode}
                label="Lock mode during shuffle"
                onClick={() => onToggleLock("mode")}
              />
            }
          >
            <Select
              value={config.mode}
              onValueChange={(mode) => onPatchConfig({ mode: mode as Mode })}
            >
              <SelectTrigger id={`${idPrefix}-mode`} aria-label="Mode" className="capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark" className="capitalize">
                  Dark
                </SelectItem>
                <SelectItem value="light" className="capitalize">
                  Light
                </SelectItem>
              </SelectContent>
            </Select>
          </ControlRow>

          <ControlRow
            title="Base"
            hint="Neutral surfaces, text, and borders"
            htmlFor={`${idPrefix}-base`}
            action={
              <LockToggle
                active={locks.base}
                label="Lock base color during shuffle"
                onClick={() => onToggleLock("base")}
              />
            }
          >
            <SwatchSelect
              id={`${idPrefix}-base`}
              label="Base color"
              items={BASE_COLORS}
              value={config.baseColor}
              onValueChange={(baseColor) => onPatchConfig({ baseColor })}
            />
          </ControlRow>

          <ControlRow
            title="Brand"
            hint="Primary, accent, and focus ring"
            htmlFor={`${idPrefix}-brand`}
            action={
              <LockToggle
                active={locks.brand}
                label="Lock brand during shuffle"
                onClick={() => onToggleLock("brand")}
              />
            }
          >
            <SwatchSelect
              id={`${idPrefix}-brand`}
              label="Brand color"
              items={BRAND_COLORS}
              value={config.brand}
              onValueChange={(brand) =>
                onPatchConfig({ brand, primaryColor: undefined, accentColor: undefined })
              }
            />
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced" className="border-b-0">
                <AccordionTrigger className="rounded-md px-1 py-2 text-xs text-fg-tertiary hover:text-fg-secondary hover:no-underline data-[state=open]:text-fg-secondary">
                  Advanced color
                </AccordionTrigger>
                <AccordionContent className="grid gap-2 px-0.5 pb-1">
                  <CssValueInput
                    id={`${idPrefix}-primary`}
                    label="Primary"
                    value={config.primaryColor ?? selectedBrand.swatch}
                    onChange={(primaryColor) => onPatchConfig({ primaryColor })}
                  />
                  <CssValueInput
                    id={`${idPrefix}-accent`}
                    label="Accent"
                    value={config.accentColor ?? selectedBrand.accent}
                    onChange={(accentColor) => onPatchConfig({ accentColor })}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ControlRow>

          <ControlRow
            title="Chart"
            hint="Data-visualization series"
            htmlFor={`${idPrefix}-chart`}
            action={
              <LockToggle
                active={locks.chart}
                label="Lock chart palette during shuffle"
                onClick={() => onToggleLock("chart")}
              />
            }
          >
            <Select value={config.chart} onValueChange={(chart) => onPatchConfig({ chart })}>
              <SelectTrigger id={`${idPrefix}-chart`} aria-label="Chart palette">
                <SelectValue placeholder="Pick a palette">
                  <PaletteOption palette={findChartPalette(config.chart)} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CHART_PALETTES.map((palette) => (
                  <SelectItem key={palette.id} value={palette.id}>
                    <PaletteOption palette={palette} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ControlRow>
        </ControlSection>

        <ControlSection label="Typography">
          <FontSelect
            id={`${idPrefix}-heading`}
            label="Heading"
            value={config.headingFont}
            onValueChange={(headingFont) => onPatchConfig({ headingFont })}
            locked={locks.heading}
            onToggleLock={() => onToggleLock("heading")}
          />
          <FontSelect
            id={`${idPrefix}-body`}
            label="Body"
            value={config.bodyFont}
            onValueChange={(bodyFont) => onPatchConfig({ bodyFont })}
            locked={locks.body}
            onToggleLock={() => onToggleLock("body")}
          />
        </ControlSection>

        <ControlSection label="Icons">
          <ControlRow
            title="Library"
            hint="The icon set used across the UI"
            htmlFor={`${idPrefix}-icon-library`}
            action={
              <LockToggle
                active={locks.icon}
                label="Lock icon library during shuffle"
                onClick={() => onToggleLock("icon")}
              />
            }
          >
            <Select
              value={config.iconLibrary}
              onValueChange={(value) => onPatchConfig({ iconLibrary: value as IconLibraryId })}
            >
              <SelectTrigger id={`${idPrefix}-icon-library`} aria-label="Icon library">
                <SelectValue>
                  <IconLibraryOption library={config.iconLibrary} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ICON_LIBRARIES.map((library) => (
                  <SelectItem key={library.id} value={library.id}>
                    <IconLibraryOption library={library.id} name={library.name} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ControlRow>
        </ControlSection>

        <ControlSection label="Shape">
          <ControlRow
            title="Radius"
            hint="Corner roundness, in pixels"
            htmlFor={`${idPrefix}-radius`}
            action={
              <LockToggle
                active={locks.radius}
                label="Lock radius during shuffle"
                onClick={() => onToggleLock("radius")}
              />
            }
          >
            <Select
              value={String(config.radius)}
              onValueChange={(value) => {
                const parsed = Number.parseInt(value, 10);
                onPatchConfig({ radius: Number.isNaN(parsed) ? DEFAULT_CONFIG.radius : parsed });
              }}
            >
              <SelectTrigger id={`${idPrefix}-radius`} aria-label="Corner radius">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {radiusOptions(config.radius).map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {radiusLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ControlRow>
        </ControlSection>

        <Separator className="bg-border-soft" />

        <ControlSection label="Save">
          <div className="grid gap-2">
            <div className="flex gap-2">
              <Input
                id={`${idPrefix}-preset-name`}
                value={presetName}
                onChange={(event) => onPresetNameChange(event.target.value)}
                placeholder="My design system"
                aria-label="Preset name"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={onSavePreset}
                disabled={!presetName.trim()}
                aria-label="Save preset"
              >
                <Save aria-hidden="true" />
              </Button>
            </div>
            <p className="px-0.5 text-xs text-fg-secondary">
              Stored in this browser. Share the link to send it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onShuffle}>
              <Dices aria-hidden="true" />
              Shuffle
            </Button>
            <Button variant="primary" onClick={onGetCode}>
              <Code2 aria-hidden="true" />
              Get code
            </Button>
          </div>
        </ControlSection>
      </div>
    </>
  );
}

function IconAction({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Sparkles;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          aria-label={label}
          aria-pressed={active}
          className={active ? "bg-surface-overlay text-fg hover:bg-surface-overlay" : undefined}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** A thin section caption — hushed and uppercase — used to give the control
 *  stack rhythm (Color / Typography / Icons / Shape) without cards. Mirrors
 *  the site-wide `Eyebrow` (hushed dot + widest tracking) at rail scale so
 *  the studio reads in the same eyebrow → title → lede register as the home. */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 px-0.5 text-[0.6875rem] font-medium uppercase tracking-widest text-fg-tertiary">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-fg-tertiary" />
      {children}
    </p>
  );
}

/** Groups related control rows under a hushed caption with an even rhythm, so
 *  the panel reads as a handful of calm sections instead of identical blocks. */
function ControlSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <SectionLabel>{label}</SectionLabel>
      {children}
    </section>
  );
}

/** A single, lightweight control row: a tight, scannable label (with an
 *  optional muted hint that surfaces on hover) and an integrated lock action,
 *  with the control rendered directly below for an even vertical rhythm. */
function ControlRow({
  title,
  hint,
  htmlFor,
  action,
  children,
}: {
  title: string;
  hint?: string;
  htmlFor?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="group/row grid gap-2">
      <div className="flex min-h-7 items-center justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-2">
          <Label htmlFor={htmlFor} className="shrink-0 text-[0.8125rem] font-medium text-fg">
            {title}
          </Label>
          {hint ? (
            <span className="hidden min-w-0 truncate text-xs text-fg-secondary opacity-0 transition-opacity duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-focus-within/row:opacity-100 group-hover/row:opacity-100 sm:block">
              {hint}
            </span>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

function LockToggle({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  const Icon = active ? Lock : LockOpen;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-7 place-items-center rounded-md outline-none",
        "transition-[color,background-color,opacity,scale] duration-200 ease-[cubic-bezier(.22,1,.36,1)] active:scale-90 motion-reduce:active:scale-100",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-inset",
        active
          ? "bg-surface-overlay text-fg"
          : "text-fg-secondary hover:bg-surface-overlay hover:text-fg",
      )}
    >
      <Icon
        className="size-3.5 transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)]"
        aria-hidden="true"
      />
    </button>
  );
}

const RADIUS_OPTIONS = [0, 4, 8, 12, 14, 16, 20, 24] as const;

/** Discrete radius choices for the select, always including the current value. */
function radiusOptions(current: number): number[] {
  const values = new Set<number>(RADIUS_OPTIONS);
  values.add(current);
  return [...values].sort((a, b) => a - b);
}

function radiusLabel(value: number): string {
  if (value === 0) return "0px · Sharp";
  if (value <= 8) return `${value}px · Tight`;
  if (value <= 16) return `${value}px · Soft`;
  return `${value}px · Round`;
}

/** A swatch dot + label, shared by the trigger value and the list items. The
 *  dot is keyed by its color so picking a new swatch remounts it and the
 *  {@link SWATCH_POP} `@starting-style` scale-in runs — a small "it took"
 *  confirmation in the trigger. */
function SwatchOption({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span
        key={swatch}
        className={cn("size-4 shrink-0 rounded-full border border-border-soft", SWATCH_POP)}
        style={{ backgroundColor: swatch }}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

/** Sample glyphs in a given library + its name, for the icon-library select. */
const ICON_OPTION_SAMPLES = ["search", "heart", "settings", "bell"] as const;

function IconLibraryOption({ library, name }: { library: IconLibraryId; name?: string }) {
  const label = name ?? ICON_LIBRARIES.find((item) => item.id === library)?.name ?? library;
  return (
    <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <span className="truncate">{label}</span>
      <span className="flex shrink-0 items-center gap-1.5 text-fg-tertiary">
        {ICON_OPTION_SAMPLES.map((iconName) => (
          <LibraryIcon key={iconName} library={library} name={iconName} className="size-4" />
        ))}
      </span>
    </span>
  );
}

/** The chart palette's five-dot ramp + name. The dots share the swatch pop-in
 *  (keyed by color), so choosing a palette lands with the same micro-feedback
 *  as the base/brand swatches. */
function PaletteOption({ palette }: { palette: ChartPalette }) {
  return (
    <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <span className="truncate">{palette.name}</span>
      <span className="flex shrink-0 -space-x-1">
        {palette.colors.map((color) => (
          <span
            key={color}
            className={cn("size-3.5 rounded-full border border-surface-floating", SWATCH_POP)}
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
        ))}
      </span>
    </span>
  );
}

function SwatchSelect({
  id,
  label,
  items,
  value,
  onValueChange,
}: {
  id: string;
  label: string;
  items: { id: string; name: string; swatch: string }[];
  value: string;
  onValueChange: (id: string) => void;
}) {
  const active = items.find((item) => item.id === value) ?? items[0];
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} aria-label={label}>
        <SelectValue placeholder={label}>
          {active ? <SwatchOption swatch={active.swatch} label={active.name} /> : null}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            <SwatchOption swatch={item.swatch} label={item.name} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CssValueInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs text-fg-tertiary">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value.trim() || undefined)}
        className="font-mono text-xs"
      />
    </div>
  );
}

function FontSelect({
  id,
  label,
  value,
  onValueChange,
  locked,
  onToggleLock,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (id: string) => void;
  locked: boolean;
  onToggleLock: () => void;
}) {
  const active = findFontChoice(value);
  return (
    <div className="grid gap-2">
      <div className="flex min-h-7 items-center justify-between gap-2">
        <Label htmlFor={id} className="text-[0.8125rem] font-medium text-fg">
          {label}
        </Label>
        <LockToggle
          active={locked}
          label={`Lock ${label.toLowerCase()} font during shuffle`}
          onClick={onToggleLock}
        />
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} aria-label={`${label} font`}>
          <SelectValue placeholder={`${label} font`}>
            <span className="truncate" style={{ fontFamily: active.stack }}>
              {active.name}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {FONT_CHOICES.map((font) => (
            <SelectItem key={font.id} value={font.id}>
              <span style={{ fontFamily: font.stack }}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ComponentSampler({ config }: { config: DesignConfig }) {
  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-3">
      <Card className={LIQUID}>
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
          <CardDescription>Inputs, toggles, radios, and button states.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sampler-name">Workspace</Label>
            <Input id="sampler-name" defaultValue="Cronus Growth" />
          </div>
          <div
            className={cn("flex items-center justify-between border-t border-border pt-3", LIQUID)}
          >
            <Label htmlFor="sampler-switch">Auto-save</Label>
            <Switch id="sampler-switch" defaultChecked />
          </div>
          <div
            className={cn("flex items-center gap-2 border-t border-border pt-3 text-sm", LIQUID)}
          >
            <Checkbox id="sampler-emails" defaultChecked />
            <Label htmlFor="sampler-emails" className="text-sm">
              Email weekly reports
            </Label>
          </div>
          <RadioGroup defaultValue="balanced" className="grid grid-cols-3 gap-2">
            {["fast", "balanced", "safe"].map((value) => (
              <div
                key={value}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-inset px-2 py-2 text-xs capitalize",
                  LIQUID,
                )}
              >
                <RadioGroupItem id={`sampler-${value}`} value={value} />
                <Label htmlFor={`sampler-${value}`} className="text-xs capitalize">
                  {value}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex gap-2">
            <Button variant="primary" className="flex-1">
              Primary
            </Button>
            <Button variant="outline" className="flex-1">
              Outline
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={LIQUID}>
        <CardHeader>
          <CardTitle className="text-base">Data surface</CardTitle>
          <CardDescription>Tables, progress, and status colors.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-fg-secondary">Migration progress</span>
              <span className="font-mono text-fg tabular-nums">72%</span>
            </div>
            <Progress value={72} aria-label="Migration progress" />
          </div>
          <div className={cn("overflow-hidden rounded-lg border border-border", LIQUID)}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Use</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Primary", "Ready", "Actions"],
                  ["Surface", "Ready", "Layouts"],
                  ["Chart", "Draft", "Analytics"],
                ].map(([token, status, use]) => (
                  <TableRow key={token}>
                    <TableCell className="font-medium">{token}</TableCell>
                    <TableCell>
                      <Badge variant={status === "Ready" ? "success" : "warning"}>{status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-fg-secondary">{use}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className={LIQUID}>
        <CardHeader>
          <CardTitle className="text-base">Navigation & type</CardTitle>
          <CardDescription>Tabs, disclosure, and typography scale.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className={cn("border-t border-border pt-3", LIQUID)}>
              <p className="font-display text-2xl font-medium tracking-[-0.02em] text-fg">Aa</p>
              <p className="text-sm text-fg-secondary">
                {findFontChoice(config.headingFont).name} with {config.radius}px corners.
              </p>
            </TabsContent>
            <TabsContent value="tokens" className={cn("border-t border-border pt-3", LIQUID)}>
              <div className="flex gap-2">
                {RAMP_STEPS.slice(0, findChartPalette(config.chart).colors.length).map(
                  (step, index) => (
                    <span
                      key={step}
                      className={cn("h-10 flex-1 rounded-md", LIQUID)}
                      style={{ backgroundColor: findChartPalette(config.chart).colors[index] }}
                      aria-hidden="true"
                    />
                  ),
                )}
              </div>
            </TabsContent>
          </Tabs>
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Preset contract</AccordionTrigger>
              <AccordionContent>
                Style presets bundle mode, color ramps, typography, charts, and radius into one
                reusable system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

/** Shared rail-card shell — mirrors the redesigned controls: a soft hairline
 *  border, raised surface, and a calm title row with optional trailing slot. */
function RailCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border-soft bg-surface-raised p-4 shadow-sm",
        "transition-[background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </section>
  );
}

function RailCardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-sm font-semibold text-fg">{title}</h2>
        <p className="mt-0.5 truncate text-xs text-fg-tertiary">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function IconLibraryShowcase({ iconLibrary }: { iconLibrary: IconLibraryId }) {
  const libraryName = ICON_LIBRARIES.find((item) => item.id === iconLibrary)?.name ?? iconLibrary;
  return (
    <RailCard>
      <RailCardHeader
        title="Icons"
        description="Common glyphs in the chosen library."
        action={<Badge variant="secondary">{libraryName}</Badge>}
      />
      <div className="mt-4 grid grid-cols-5 gap-1.5 sm:grid-cols-7 2xl:grid-cols-5">
        {ICON_SHOWCASE.map((name) => (
          <LiftTile
            key={name}
            title={name}
            className={cn(
              "grid aspect-square place-items-center rounded-xl border border-border-soft bg-surface-inset text-fg-secondary",
              "transition-[color,border-color,background-color,box-shadow] duration-[250ms] ease-[cubic-bezier(.22,1,.36,1)]",
              "hover:border-border hover:bg-surface-overlay hover:text-fg hover:shadow-sm",
            )}
          >
            <LibraryIcon library={iconLibrary} name={name} className="size-5" />
          </LiftTile>
        ))}
      </div>
    </RailCard>
  );
}

function TokenSummary({ config }: { config: DesignConfig }) {
  const colors = findChartPalette(config.chart).colors;
  const summaryRows: { label: string; value: string }[] = [
    { label: "Base", value: findBaseColor(config.baseColor).name },
    { label: "Brand", value: findBrandColor(config.brand).name },
    { label: "Heading", value: findFontChoice(config.headingFont).name },
    { label: "Body", value: findFontChoice(config.bodyFont).name },
    {
      label: "Icons",
      value: ICON_LIBRARIES.find((item) => item.id === config.iconLibrary)?.name ?? "Lucide",
    },
    { label: "Radius", value: `${config.radius}px` },
  ];
  return (
    <RailCard>
      <RailCardHeader
        title="System bundle"
        description="Saved as one reusable preset."
        action={<Badge variant="primary">{config.mode}</Badge>}
      />
      <dl className="mt-4 divide-y divide-border border-t border-border">
        {summaryRows.map((row) => (
          <SummaryRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-widest text-fg-tertiary">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-fg-tertiary" />
          Chart ramp
        </p>
        <Badge variant="outline">{findChartPalette(config.chart).name}</Badge>
      </div>
      <div className="mt-2 flex gap-1.5">
        {RAMP_STEPS.slice(0, colors.length).map((step, index) => (
          <span
            key={step}
            className={cn("h-9 flex-1 rounded-lg ring-1 ring-inset ring-border-soft", LIQUID)}
            style={{ backgroundColor: colors[index] }}
            aria-hidden="true"
          />
        ))}
      </div>
    </RailCard>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-2.5 text-sm", LIQUID)}>
      <dt className="text-fg-tertiary">{label}</dt>
      <dd className="truncate font-medium capitalize text-fg">{value}</dd>
    </div>
  );
}

function PresetExchange({
  presetCode,
  error,
  onPresetCodeChange,
  onImport,
  onCopyPreset,
}: {
  presetCode: string;
  error: string;
  onPresetCodeChange: (value: string) => void;
  onImport: () => void;
  onCopyPreset: () => void;
}) {
  return (
    <RailCard>
      <RailCardHeader
        title="Preset exchange"
        description="Copy this system or open one from a code."
        action={
          <Button variant="outline" size="icon-sm" onClick={onCopyPreset} aria-label="Copy preset">
            <Copy aria-hidden="true" />
          </Button>
        }
      />
      <div className="mt-4 grid gap-3">
        <Textarea
          value={presetCode}
          onChange={(event) => onPresetCodeChange(event.target.value)}
          placeholder="Paste cronus: preset code or JSON"
          rows={4}
          className="resize-none font-mono text-xs"
          aria-label="Preset import code"
        />
        {error ? <p className="text-xs text-error">{error}</p> : null}
        <Button variant="outline" onClick={onImport} disabled={!presetCode.trim()}>
          <Download aria-hidden="true" />
          Open preset
        </Button>
      </div>
    </RailCard>
  );
}

function CodeDialog({
  open,
  onOpenChange,
  activeTab,
  code,
  copied,
  packageManager,
  presetJson,
  onPackageManagerChange,
  onCopy,
  onTabChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: CodeTab;
  code: string;
  copied: boolean;
  packageManager: PackageManager;
  presetJson: string;
  onPackageManagerChange: (pm: PackageManager) => void;
  onCopy: () => void;
  onTabChange: (tab: CodeTab) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-border border-b p-6 pr-12">
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="size-5 text-fg-tertiary" aria-hidden="true" />
            Get code
          </DialogTitle>
          <DialogDescription>
            Install Cronus UI, wire the provider, or copy the exact CSS variables for this preset.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as CodeTab)}
          className="min-h-0 gap-0"
        >
          <div className="flex flex-col gap-3 border-border border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="max-w-full overflow-x-auto">
              {codeTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="outline" onClick={onCopy}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              Copy
            </Button>
          </div>

          <TabsContent value="install" className="min-h-0">
            <div className="border-border border-b px-4 py-3">
              <Tabs
                value={packageManager}
                onValueChange={(value) => onPackageManagerChange(value as PackageManager)}
              >
                <TabsList aria-label="Package manager" className="h-auto flex-wrap gap-1">
                  {(["bun", "pnpm", "npm", "yarn"] as const).map((pm) => (
                    <TabsTrigger
                      key={pm}
                      value={pm}
                      className="rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium ring-offset-surface-base data-[state=active]:border-border-strong data-[state=active]:bg-surface-raised data-[state=active]:text-fg"
                    >
                      {pm}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <CodeBlock code={code} />
          </TabsContent>

          <TabsContent value="provider" className="min-h-0">
            <CodeBlock code={code} />
          </TabsContent>

          <TabsContent value="css" className="min-h-0">
            <CodeBlock code={code} />
          </TabsContent>

          <TabsContent value="json" className="min-h-0">
            <CodeBlock code={presetJson} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="max-h-[56vh] overflow-auto bg-surface-inset p-5 font-mono text-xs leading-relaxed text-fg-secondary">
      <code>{code}</code>
    </pre>
  );
}
