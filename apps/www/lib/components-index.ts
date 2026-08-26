/**
 * Server-safe metadata for every documented component (no JSX).
 * Drives the sidebar, the /components overview grid, and static params.
 * The live examples (preview + code) live in `lib/examples/*` (client).
 */

export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  /** Override the named imports shown in the docs when they differ from `name`. */
  importName?: string;
  /**
   * `true` when the component's source module carries no `"use client"`
   * directive, so it can render inside React Server Components (any
   * interactive parts it composes stay client components underneath).
   */
  rsc?: boolean;
}

export interface ComponentCategory {
  slug: string;
  name: string;
  items: ComponentMeta[];
}

export const CATEGORIES: ComponentCategory[] = [
  {
    slug: "buttons",
    name: "Buttons",
    items: [
      {
        slug: "button",
        name: "Button",
        description: "Clickable action with variants, sizes and asChild.",
        rsc: true,
      },
      {
        slug: "animated-button",
        name: "AnimatedButton",
        description: "Motion-powered button with spring feedback.",
      },
      { slug: "toggle", name: "Toggle", description: "A two-state on/off button.", rsc: true },
      {
        slug: "toggle-group",
        name: "ToggleGroup",
        description: "A set of toggles, single or multiple.",
      },
      {
        slug: "copy-button",
        name: "CopyButton",
        description: "Copy text to the clipboard with success feedback.",
      },
      {
        slug: "button-group",
        name: "ButtonGroup",
        description: "Attaches a row or column of buttons into one segmented unit.",
        importName: "ButtonGroup",
        rsc: true,
      },
      {
        slug: "fab",
        name: "Fab",
        description: "Floating action button with an optional speed-dial of actions.",
        importName: "Fab",
      },
      {
        slug: "split-button",
        name: "SplitButton",
        description: "Primary action fused to a dropdown of secondary actions.",
        importName: "SplitButton",
        rsc: true,
      },
      {
        slug: "mode-toggle",
        name: "ModeToggle",
        description: "Animated sun ⇄ moon light/dark toggle icon-button.",
        importName: "ModeToggle",
      },
    ],
  },
  {
    slug: "forms",
    name: "Forms",
    items: [
      {
        slug: "input",
        name: "Input",
        description: "Single-line text field with invalid state.",
        rsc: true,
      },
      {
        slug: "input-group",
        name: "InputGroup",
        description:
          "A composable wrapper that fuses prefix/suffix addons to an Input into one bordered field.",
        importName: "InputGroup, InputGroupAddon",
        rsc: true,
      },
      {
        slug: "password-input",
        name: "PasswordInput",
        description: "A password field with a show/hide toggle and an optional strength meter.",
        importName: "PasswordInput",
      },
      {
        slug: "textarea",
        name: "Textarea",
        description: "Multi-line auto-sizing text field.",
        rsc: true,
      },
      {
        slug: "label",
        name: "Label",
        description: "Accessible label tied to a control.",
        rsc: true,
      },
      { slug: "checkbox", name: "Checkbox", description: "Binary choice with an indicator." },
      { slug: "radio-group", name: "RadioGroup", description: "Single choice among options." },
      { slug: "switch", name: "Switch", description: "Toggle a setting on or off." },
      { slug: "select", name: "Select", description: "Composable dropdown with groups." },
      {
        slug: "combobox",
        name: "Combobox",
        description: "Searchable single-select with autocomplete.",
      },
      {
        slug: "multi-select",
        name: "MultiSelect",
        description: "Pick multiple values shown as removable chips.",
      },
      {
        slug: "tags-input",
        name: "TagsInput",
        description: "Type and commit free-form tags as removable chips.",
        importName: "TagsInput",
      },
      { slug: "slider", name: "Slider", description: "Pick a value or a range." },
      {
        slug: "field",
        name: "Field",
        description: "Label + description + error layout.",
        rsc: true,
      },
      { slug: "form", name: "Form", description: "react-hook-form + zod integration." },
      { slug: "input-otp", name: "InputOTP", description: "One-time-code input with slots." },
      {
        slug: "file-dropzone",
        name: "FileDropzone",
        description: "Drag-and-drop file upload area.",
      },
      {
        slug: "number-input",
        name: "NumberInput",
        description: "Numeric field with steppers, clamping and keyboard control.",
      },
      {
        slug: "autocomplete",
        name: "Autocomplete",
        description: "Free-text input with sync or async suggestions.",
      },
      {
        slug: "stepper",
        name: "Stepper",
        description: "Multi-step wizard progress with optional clickable steps.",
        importName:
          "Stepper, StepperList, StepperItem, StepperIndicator, StepperSeparator, StepperTitle, StepperDescription",
      },
      {
        slug: "rich-text-editor",
        name: "RichTextEditor",
        description: "Tiptap WYSIWYG editor with a formatting toolbar and HTML output.",
        importName: "RichTextEditor",
      },
      {
        slug: "rating",
        name: "Rating",
        description: "Star rating input — interactive or read-only, with optional half stars.",
      },
      {
        slug: "color-picker",
        name: "ColorPicker",
        description:
          "OKLCH-native color input on a popover, with an area, hue slider and swatches.",
      },
      {
        slug: "currency-input",
        name: "CurrencyInput",
        description: "Money field with a currency selector and live thousand/decimal formatting.",
        importName: "CurrencyInput",
      },
      {
        slug: "phone-input",
        name: "PhoneInput",
        description: "International phone field with a country selector, emitting E.164.",
        importName: "PhoneInput",
      },
      {
        slug: "credit-card-input",
        name: "CreditCardInput",
        description: "Card number, expiry and CVC with brand detection and Luhn validation.",
        importName: "CreditCardInput",
      },
      {
        slug: "floating-label-input",
        name: "FloatingLabelInput",
        description: "Text field whose label floats above on focus or when filled.",
        importName: "FloatingLabelInput",
        rsc: true,
      },
      {
        slug: "signature-pad",
        name: "SignaturePad",
        description:
          "Canvas signature input with smoothed strokes, undo/clear, and data-URL output.",
        importName: "SignaturePad",
      },
      {
        slug: "chip",
        name: "Chip",
        description:
          "Interactive filter/selection chip — toggleable, dismissible, with icon and avatar slots.",
        rsc: true,
      },
    ],
  },
  {
    slug: "data-display",
    name: "Data Display",
    items: [
      { slug: "avatar", name: "Avatar", description: "User image with a fallback.", rsc: true },
      {
        slug: "avatar-group",
        name: "AvatarGroup",
        description: 'Overlapping avatar stack with a "+N" overflow chip.',
        importName: "AvatarGroup",
        rsc: true,
      },
      { slug: "badge", name: "Badge", description: "Small status / category label.", rsc: true },
      {
        slug: "card",
        name: "Card",
        description: "Surface that groups related content.",
        rsc: true,
      },
      { slug: "table", name: "Table", description: "Styled semantic table primitives.", rsc: true },
      {
        slug: "data-table",
        name: "DataTable",
        description:
          "TanStack table with sorting, search & faceted filters, pagination, row selection with bulk actions, column visibility, density, and loading/empty/error states.",
      },
      { slug: "metric", name: "Metric", description: "KPI value with trend delta.", rsc: true },
      {
        slug: "sparkline",
        name: "Sparkline",
        description: "Tiny inline line, area, or bar trend chart for stat tiles.",
        rsc: true,
      },
      {
        slug: "masonry",
        name: "Masonry",
        description: "A responsive CSS multi-column masonry layout for cards and images.",
        importName: "Masonry",
        rsc: true,
      },
      {
        slug: "comparison-slider",
        name: "ComparisonSlider",
        description: "Drag a divider to reveal a before/after comparison of two layers.",
        importName: "ComparisonSlider",
      },
      {
        slug: "heatmap",
        name: "Heatmap",
        description:
          "A calendar-style contribution heatmap that buckets daily activity into levels.",
        importName: "Heatmap",
        rsc: true,
      },
      { slug: "kbd", name: "Kbd", description: "Keyboard key hint.", rsc: true },
      { slug: "empty", name: "Empty", description: "Empty-state placeholder.", rsc: true },
      {
        slug: "separator",
        name: "Separator",
        description: "Visual divider between content.",
        rsc: true,
      },
      {
        slug: "skeleton",
        name: "Skeleton",
        description: "Loading placeholder shimmer.",
        rsc: true,
      },
      { slug: "scroll-area", name: "ScrollArea", description: "Custom-styled scroll container." },
      {
        slug: "code-block",
        name: "CodeBlock",
        description: "Source snippet with header, line numbers and copy.",
        rsc: true,
      },
      {
        slug: "code-tabs",
        name: "CodeTabs",
        description: "Tabbed code snippets with per-tab copy and a localStorage-synced tab choice.",
        importName: "CodeTabs",
      },
      {
        slug: "collapsible",
        name: "Collapsible",
        description: "Animated show/hide for a single section.",
        importName: "Collapsible, CollapsibleTrigger, CollapsibleContent",
      },
      {
        slug: "aspect-ratio",
        name: "AspectRatio",
        description: "Constrain content to a fixed width-to-height ratio.",
        rsc: true,
      },
      {
        slug: "tree-view",
        name: "TreeView",
        description: "Data-driven, accessible hierarchy with keyboard navigation.",
      },
      {
        slug: "timeline",
        name: "Timeline",
        description: "Vertical activity feed with dots, connectors, timestamps and descriptions.",
        importName:
          "Timeline, TimelineItem, TimelineDot, TimelineContent, TimelineTitle, TimelineTime, TimelineDescription",
        rsc: true,
      },
      {
        slug: "kanban",
        name: "Kanban",
        description: "Drag-and-drop board with cards that reorder and move across columns.",
      },
      {
        slug: "json-viewer",
        name: "JsonViewer",
        description: "Collapsible JSON tree with type-colored values and per-row copy.",
        importName: "JsonViewer",
      },
      {
        slug: "status-dot",
        name: "StatusDot",
        description: "Presence dot with pulse, optional label, and avatar-overlay anchoring.",
        rsc: true,
      },
      {
        slug: "image-zoom",
        name: "ImageZoom",
        description:
          "Inline hover/press zoom that magnifies product imagery and pans with the cursor.",
      },
      {
        slug: "video-player",
        name: "VideoPlayer",
        description:
          "Native video wrapped in token-styled custom controls: seek, volume, playback speed, and fullscreen.",
      },
      {
        slug: "description-list",
        name: "DescriptionList",
        description:
          "Semantic dl/dt/dd pairs in stacked, horizontal, or grid-card layouts for detail panes and order summaries.",
        rsc: true,
      },
    ],
  },
  {
    slug: "feedback",
    name: "Feedback",
    items: [
      {
        slug: "alert",
        name: "Alert",
        description: "Inline callout banner with semantic variants.",
        importName: "Alert, AlertTitle, AlertDescription",
        rsc: true,
      },
      {
        slug: "banner",
        name: "Banner",
        description: "Dismissible full-width announcement / promo bar with a CTA.",
        importName: "Banner",
      },
      {
        slug: "spinner",
        name: "Spinner",
        description: "Indeterminate loading indicator.",
        rsc: true,
      },
      { slug: "progress", name: "Progress", description: "Determinate progress bar.", rsc: true },
      {
        slug: "usage-meter",
        name: "UsageMeter",
        description: "Linear or circular quota / billing usage indicator with severity tones.",
        importName: "UsageMeter, UsageMeterLinear, UsageMeterCircular",
        rsc: true,
      },
      {
        slug: "sonner",
        name: "Toast",
        description: "Transient notifications via Sonner.",
        importName: "Toaster, toast",
      },
      { slug: "alert-dialog", name: "AlertDialog", description: "Confirm a destructive action." },
    ],
  },
  {
    slug: "overlays",
    name: "Overlays",
    items: [
      { slug: "dialog", name: "Dialog", description: "Modal dialog with header and footer." },
      { slug: "sheet", name: "Sheet", description: "Side-anchored panel." },
      { slug: "drawer", name: "Drawer", description: "Bottom drawer (vaul)." },
      { slug: "popover", name: "Popover", description: "Floating content anchored to a trigger." },
      {
        slug: "notification-center",
        name: "NotificationCenter",
        description: "Bell-trigger inbox with unread badge and a scrollable list.",
        importName: "NotificationCenter, NotificationList, NotificationRow",
      },
      { slug: "hover-card", name: "HoverCard", description: "Preview content on hover." },
      { slug: "tooltip", name: "Tooltip", description: "Short hint on hover or focus." },
      { slug: "dropdown-menu", name: "DropdownMenu", description: "Actions menu with submenus." },
      {
        slug: "context-menu",
        name: "ContextMenu",
        description: "Right-click menu with items, checkboxes and submenus.",
        importName:
          "ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator",
      },
      { slug: "command", name: "Command", description: "⌘K command palette (cmdk)." },
      {
        slug: "lightbox",
        name: "Lightbox",
        description: "Full-screen image gallery with thumbnails and keyboard navigation.",
        importName: "Lightbox",
      },
      {
        slug: "confirmation-dialog",
        name: "ConfirmationDialog",
        description: "Ergonomic AlertDialog wrapper for destructive actions with async confirm.",
        importName: "ConfirmationDialog",
      },
    ],
  },
  {
    slug: "navigation",
    name: "Navigation",
    items: [
      { slug: "tabs", name: "Tabs", description: "Switch between panels." },
      { slug: "accordion", name: "Accordion", description: "Collapsible content sections." },
      {
        slug: "breadcrumb",
        name: "Breadcrumb",
        description: "Hierarchical page trail.",
        rsc: true,
      },
      { slug: "pagination", name: "Pagination", description: "Navigate between pages.", rsc: true },
      {
        slug: "navigation-menu",
        name: "NavigationMenu",
        description: "Horizontal menu bar with disclosure panels.",
        importName:
          "NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink",
      },
      {
        slug: "menubar",
        name: "Menubar",
        description: "Desktop-style menu bar with File / Edit / View menus.",
        importName:
          "Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarShortcut",
      },
      {
        slug: "sidebar",
        name: "Sidebar",
        description: "Composable, collapsible app sidebar.",
        importName:
          "Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton",
      },
      {
        slug: "app-shell",
        name: "AppShell",
        description: "Sidebar + header + content layout in one step.",
        importName: "AppShell",
        rsc: true,
      },
      {
        slug: "resizable",
        name: "Resizable",
        description: "Draggable split panes for resizable layouts.",
        importName: "ResizablePanelGroup, ResizablePanel, ResizableHandle",
      },
      {
        slug: "toolbar",
        name: "Toolbar",
        description: "An accessible button toolbar with roving focus and grouped controls.",
        importName: "Toolbar, ToolbarButton, ToolbarSeparator, ToolbarGroup",
      },
      {
        slug: "table-of-contents",
        name: "TableOfContents",
        description: "Scrollspy on-this-page nav with an animated active indicator.",
        importName: "TableOfContents",
      },
    ],
  },
  {
    slug: "date-time",
    name: "Date & Time",
    items: [
      { slug: "calendar", name: "Calendar", description: "Date grid (react-day-picker)." },
      {
        slug: "countdown",
        name: "Countdown",
        description: "Ticking day/hour/minute/second tiles counting down to a target.",
        importName: "Countdown",
      },
      { slug: "date-picker", name: "DatePicker", description: "Popover-based date selection." },
      {
        slug: "date-range-picker",
        name: "DateRangePicker",
        description: "Start/end date selection with presets.",
      },
      {
        slug: "scheduler",
        name: "Scheduler",
        description: "Month-view event calendar that lays events onto day cells.",
      },
      {
        slug: "time-picker",
        name: "TimePicker",
        description: "Popover hour/minute (and optional second) selection, 12h or 24h.",
        importName: "TimePicker",
      },
    ],
  },
  {
    slug: "charts",
    name: "Charts",
    items: [
      {
        slug: "chart",
        name: "Chart",
        description: "Recharts wrapper with tokens.",
        importName: "ChartContainer, ChartTooltip, ChartTooltipContent",
      },
    ],
  },
  {
    slug: "premium",
    name: "Premium & Brand",
    items: [
      { slug: "glass-card", name: "GlassCard", description: "Frosted-glass surface.", rsc: true },
      {
        slug: "gradient-border",
        name: "GradientBorder",
        description: "Aurora gradient border.",
        rsc: true,
      },
      {
        slug: "gradient-text",
        name: "GradientText",
        description: "Gradient-clipped text.",
        rsc: true,
      },
      { slug: "spotlight-card", name: "SpotlightCard", description: "Cursor-following spotlight." },
      {
        slug: "scroll-progress",
        name: "ScrollProgress",
        description: "A bar or ring that tracks how far a scroll container has been read.",
        importName: "ScrollProgress",
      },
      {
        slug: "aurora-background",
        name: "AuroraBackground",
        description: "Animated aurora backdrop.",
        rsc: true,
      },
      {
        slug: "logo-carousel",
        name: "LogoCarousel",
        description: "Animated hero logo carousel with reduced-motion fallback.",
      },
      {
        slug: "marquee",
        name: "Marquee",
        description: "Seamless infinite scroller for logos, testimonials, or a ticker.",
        importName: "Marquee",
      },
      {
        slug: "morphing-popover",
        name: "MorphingPopover",
        description: "Trigger that morphs into a non-modal dialog surface.",
        importName:
          "MorphingPopover, MorphingPopoverTrigger, MorphingPopoverContent, MorphingPopoverClose, MorphingPopoverHeader, MorphingPopoverBody, MorphingPopoverFooter, MorphingPopoverButton",
      },
      { slug: "shimmer", name: "Shimmer", description: "Premium shimmer surface.", rsc: true },
      { slug: "reveal", name: "Reveal", description: "Scroll-into-view reveal wrapper." },
      {
        slug: "animated-number",
        name: "AnimatedNumber",
        description: "Number that springs to its target — counts up or down.",
      },
      {
        slug: "carousel",
        name: "Carousel",
        description: "Scroll-snap slide gallery with prev/next, dots and keyboard nav.",
        importName:
          "Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots",
      },
      {
        slug: "segmented-control",
        name: "SegmentedControl",
        description: "Single-select toggle row with a thumb that slides between options.",
        importName: "SegmentedControl, SegmentedControlItem",
      },
      {
        slug: "text-effect",
        name: "TextEffect",
        description: "Reveal text by staggering words or characters (fade / blur / slide).",
      },
      {
        slug: "frame",
        name: "Frame",
        description: "Browser/window chrome that frames a screenshot or product mockup.",
        importName: "Frame",
        rsc: true,
      },
      {
        slug: "dock",
        name: "Dock",
        description: "A macOS-style icon dock that magnifies items as the pointer nears.",
        importName: "Dock",
      },
      {
        slug: "border-beam",
        name: "BorderBeam",
        description: "An animated light beam that travels around an element's border.",
        importName: "BorderBeam",
        rsc: true,
      },
      {
        slug: "flip-card",
        name: "FlipCard",
        description: "A 3D card that flips between a front and a back face.",
        importName: "FlipCard, FlipCardFront, FlipCardBack",
      },
      {
        slug: "tilt-card",
        name: "TiltCard",
        description: "A card that tilts in 3D toward the pointer, with an optional glare.",
        importName: "TiltCard",
      },
      {
        slug: "magnetic",
        name: "Magnetic",
        description: "Wrapper whose content is gently pulled toward the cursor.",
        importName: "Magnetic",
      },
      {
        slug: "orbit",
        name: "Orbit",
        description: "Icons or avatars revolving around a nucleus on pure-CSS rings.",
        importName: "Orbit, OrbitRing, OrbitItem",
        rsc: true,
      },
      {
        slug: "terminal",
        name: "Terminal",
        description: "Animated terminal window that types a scripted shell session.",
        importName: "Terminal",
      },
      {
        slug: "ripple",
        name: "Ripple",
        description: "Concentric rings that expand from the centre of a surface.",
        importName: "Ripple",
        rsc: true,
      },
      {
        slug: "meteors",
        name: "Meteors",
        description: "A field of shooting-star trails drifting across a surface.",
        importName: "Meteors",
        rsc: true,
      },
      {
        slug: "dot-pattern",
        name: "DotPattern",
        description: "A faint SVG dotted field behind content.",
        importName: "DotPattern",
        rsc: true,
      },
      {
        slug: "grid-pattern",
        name: "GridPattern",
        description: "A faint SVG grid behind content.",
        importName: "GridPattern",
        rsc: true,
      },
      {
        slug: "retro-grid",
        name: "RetroGrid",
        description: "A receding perspective grid floor.",
        importName: "RetroGrid",
        rsc: true,
      },
      {
        slug: "noise",
        name: "Noise",
        description: "A still film-grain overlay.",
        importName: "Noise",
        rsc: true,
      },
      {
        slug: "light-rays",
        name: "LightRays",
        description: "Volumetric light shafts fanning across a surface.",
        importName: "LightRays",
        rsc: true,
      },
      {
        slug: "progressive-blur",
        name: "ProgressiveBlur",
        description: "A stacked backdrop-blur that fades content out toward an edge.",
        importName: "ProgressiveBlur",
        rsc: true,
      },
      {
        slug: "flickering-grid",
        name: "FlickeringGrid",
        description: "A grid of cells that independently flicker.",
        importName: "FlickeringGrid",
        rsc: true,
      },
      {
        slug: "star-border",
        name: "StarBorder",
        description: "Two sparkle heads chasing each other around a border.",
        importName: "StarBorder",
        rsc: true,
      },
      {
        slug: "shiny-text",
        name: "ShinyText",
        description: "A metallic sheen that sweeps across live text.",
        importName: "ShinyText",
        rsc: true,
      },
      {
        slug: "highlighter",
        name: "Highlighter",
        description: "A marker stroke that draws in behind a phrase.",
        importName: "Highlighter",
        rsc: true,
      },
      {
        slug: "spinning-text",
        name: "SpinningText",
        description: "A phrase laid out around a slowly rotating circle.",
        importName: "SpinningText",
        rsc: true,
      },
      {
        slug: "sparkles-text",
        name: "SparklesText",
        description: "Twinkling sparkles around a phrase.",
        importName: "SparklesText",
        rsc: true,
      },
      {
        slug: "typing-text",
        name: "TypingText",
        description: "A typewriter that types one or more phrases with a blinking caret.",
        importName: "TypingText",
      },
      {
        slug: "word-rotate",
        name: "WordRotate",
        description: "Cycles through a list of words with a vertical swap.",
        importName: "WordRotate",
      },
      {
        slug: "scramble-text",
        name: "ScrambleText",
        description: "Resolves a phrase by cycling random glyphs until it locks in.",
        importName: "ScrambleText",
      },
      {
        slug: "glare-hover",
        name: "GlareHover",
        description: "A diagonal glare that tracks the pointer across a surface.",
        importName: "GlareHover",
      },
      {
        slug: "click-spark",
        name: "ClickSpark",
        description: "Emits a burst of sparks from the pointer on click.",
        importName: "ClickSpark",
      },
      {
        slug: "animated-list",
        name: "AnimatedList",
        description: "Staggers list items in with a short rise and fade.",
        importName: "AnimatedList",
      },
      {
        slug: "card-stack",
        name: "CardStack",
        description: "A fanned stack of cards that cycles on click or keyboard.",
        importName: "CardStack",
      },
      {
        slug: "pill-nav",
        name: "PillNav",
        description: "A compact nav row whose active item is marked by a sliding pill.",
        importName: "PillNav",
      },
      {
        slug: "expandable-tabs",
        name: "ExpandableTabs",
        description: "Icon tabs where the active item expands to reveal its label.",
        importName: "ExpandableTabs",
      },
      {
        slug: "dynamic-island",
        name: "DynamicIsland",
        description: "A compact live-activity pill that morphs between views.",
        importName: "DynamicIsland",
      },
      {
        slug: "confetti",
        name: "Confetti",
        description: "Canvas confetti that bursts from the pointer.",
        importName: "Confetti",
      },
      {
        slug: "particles",
        name: "Particles",
        description: "A calm 2D particle field that drifts behind content.",
        importName: "Particles",
      },
    ],
  },
];

export const ALL_COMPONENTS: (ComponentMeta & { category: string })[] = CATEGORIES.flatMap((c) =>
  c.items.map((item) => ({ ...item, category: c.name })),
);

export function getComponentDisplayName(name: string) {
  return name.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

export function getComponentMeta(slug: string): (ComponentMeta & { category: string }) | undefined {
  return ALL_COMPONENTS.find((c) => c.slug === slug);
}

export const COMPONENT_SLUGS = ALL_COMPONENTS.map((c) => c.slug);

export const COMPONENT_COUNT = ALL_COMPONENTS.length;
