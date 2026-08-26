/**
 * Lightweight TOC metadata for component examples: slug → [{ id, title }].
 *
 * GENERATED from the `id`/`title` of every example in `lib/examples/<family>.tsx`.
 * It exists so the catalog can build the on-this-page table of contents WITHOUT
 * importing those heavy modules (recharts / forms / overlays previews).
 *
 * Regenerate + verify with `bun run check:example-sections` (it fails on drift).
 */

export interface ExampleSectionMeta {
  id: string;
  title: string;
}

export const EXAMPLE_SECTIONS: Record<string, ExampleSectionMeta[]> = {
  button: [
    { id: "variants", title: "Variants" },
    { id: "sizes", title: "Sizes" },
    { id: "with-icons", title: "With icons" },
    { id: "as-link", title: "As link" },
  ],
  "animated-button": [{ id: "spring-feedback", title: "Spring feedback" }],
  toggle: [
    { id: "default", title: "Default" },
    { id: "outline", title: "Outline variant" },
    { id: "sizes", title: "Sizes" },
  ],
  "toggle-group": [
    { id: "single", title: "Single" },
    { id: "multiple", title: "Multiple" },
  ],
  "copy-button": [
    { id: "default", title: "Default" },
    { id: "inline", title: "Inline with a value" },
  ],
  "button-group": [
    { id: "horizontal", title: "Horizontal" },
    { id: "vertical", title: "Vertical" },
  ],
  fab: [
    { id: "default", title: "Default" },
    { id: "speed-dial", title: "Speed dial" },
  ],
  "split-button": [
    { id: "default", title: "Default" },
    { id: "variants", title: "Variants" },
    { id: "loading", title: "Loading" },
  ],
  "mode-toggle": [
    { id: "morph", title: "Sun ⇄ moon morph" },
    { id: "sizes", title: "Sizes" },
    { id: "theme-provider", title: "Wired to a theme provider" },
  ],
  chip: [
    { id: "filters", title: "Filter chips" },
    { id: "variants", title: "Variants, colors & sizes" },
    { id: "dismissible", title: "Dismissible" },
  ],
  input: [
    { id: "default", title: "Default" },
    { id: "invalid-state", title: "Invalid state" },
    { id: "disabled", title: "Disabled" },
  ],
  textarea: [
    { id: "default", title: "Default" },
    { id: "invalid", title: "Invalid" },
  ],
  label: [{ id: "with-input", title: "With input" }],
  checkbox: [
    { id: "default", title: "Default" },
    { id: "disabled", title: "Disabled" },
  ],
  "radio-group": [{ id: "options", title: "Options" }],
  switch: [{ id: "default", title: "Default" }],
  select: [{ id: "grouped", title: "Grouped" }],
  combobox: [{ id: "single-select", title: "Single select" }],
  "multi-select": [
    { id: "default", title: "Default" },
    { id: "max-display", title: "Max display" },
  ],
  "tags-input": [{ id: "default", title: "Default" }],
  "input-group": [
    { id: "prefix-suffix", title: "Prefix & suffix" },
    { id: "icon-addon", title: "Leading icon" },
  ],
  "password-input": [
    { id: "default", title: "Default" },
    { id: "strength-meter", title: "Strength meter" },
  ],
  slider: [
    { id: "single-thumb", title: "Single thumb" },
    { id: "range", title: "Range" },
  ],
  field: [
    { id: "composition", title: "Composition" },
    { id: "with-error", title: "With error" },
  ],
  form: [{ id: "validated-form", title: "Validated form" }],
  "input-otp": [{ id: "six-digit", title: "6-digit" }],
  "file-dropzone": [{ id: "upload", title: "Upload" }],
  "number-input": [
    { id: "default", title: "Default" },
    { id: "precision-format", title: "Precision & formatting" },
  ],
  autocomplete: [
    { id: "default", title: "Default" },
    { id: "async", title: "Async suggestions" },
  ],
  stepper: [{ id: "wizard", title: "Wizard" }],
  "rich-text-editor": [{ id: "default", title: "Default" }],
  rating: [
    { id: "interactive", title: "Interactive" },
    { id: "read-only", title: "Read-only with a count" },
  ],
  "color-picker": [{ id: "swatches", title: "With swatches" }],
  "currency-input": [
    { id: "multi-currency", title: "Multi-currency" },
    { id: "single-currency", title: "Single currency" },
    { id: "limit", title: "Hard ceiling" },
  ],
  "phone-input": [
    { id: "default", title: "Default" },
    { id: "default-country", title: "Default country & value" },
    { id: "invalid", title: "Invalid" },
  ],
  "credit-card-input": [
    { id: "default", title: "Default" },
    { id: "brand-detection", title: "Brand detection" },
    { id: "error", title: "With error" },
  ],
  "floating-label-input": [
    { id: "default", title: "Default" },
    { id: "adornments", title: "With adornments" },
    { id: "invalid", title: "Invalid" },
  ],
  "signature-pad": [
    { id: "capture", title: "Capture a signature" },
    { id: "disabled", title: "Disabled" },
  ],
  "status-dot": [
    { id: "statuses", title: "Statuses" },
    { id: "on-avatar", title: "On an avatar" },
    { id: "pulse-sizes", title: "Pulse & sizes" },
  ],
  "image-zoom": [
    { id: "hover-to-zoom", title: "Hover to zoom" },
    { id: "zoom-scale", title: "Zoom scale" },
    { id: "zoom-state", title: "Custom image & zoom state" },
  ],
  "video-player": [
    { id: "default", title: "Default" },
    { id: "aspect-ratios", title: "Aspect ratios" },
    { id: "localized-labels", title: "Localized labels" },
  ],
  "description-list": [
    { id: "stacked", title: "Stacked" },
    { id: "horizontal", title: "Horizontal order summary" },
    { id: "striped", title: "Striped rows" },
    { id: "grid-cards", title: "Grid cards" },
  ],
  avatar: [
    { id: "image-fallback", title: "Image & fallback" },
    { id: "group", title: "Group" },
  ],
  "avatar-group": [
    { id: "overflow", title: "With overflow" },
    { id: "sizes", title: "Sizes" },
  ],
  badge: [
    { id: "variants", title: "Variants" },
    { id: "with-icon", title: "With icon" },
  ],
  card: [{ id: "anatomy", title: "Anatomy" }],
  table: [{ id: "basic", title: "Basic" }],
  "data-table": [
    { id: "basic", title: "Basic" },
    { id: "sortable", title: "Sortable" },
    { id: "search-filter", title: "Search & filter" },
    { id: "pagination", title: "Pagination" },
    { id: "selection-bulk", title: "Selection & bulk actions" },
    { id: "column-visibility", title: "Column visibility" },
    { id: "density", title: "Density" },
    { id: "loading", title: "Loading" },
    { id: "empty", title: "Empty" },
    { id: "error", title: "Error" },
  ],
  metric: [{ id: "stat-tiles", title: "Stat tiles" }],
  sparkline: [
    { id: "types", title: "Line, area & bar" },
    { id: "stat-cards", title: "In stat cards" },
  ],
  kbd: [{ id: "keys", title: "Keys" }],
  empty: [{ id: "empty-state", title: "Empty state" }],
  separator: [{ id: "horizontal-vertical", title: "Horizontal & vertical" }],
  skeleton: [{ id: "loading-card", title: "Loading card" }],
  "scroll-area": [{ id: "scrollable-list", title: "Scrollable list" }],
  "code-block": [
    { id: "default", title: "Default" },
    { id: "line-numbers", title: "Line numbers" },
  ],
  "code-tabs": [
    { id: "package-manager", title: "Package manager installer" },
    { id: "multi-language", title: "Multi-language snippet" },
  ],
  collapsible: [{ id: "default", title: "Default" }],
  "aspect-ratio": [
    { id: "default", title: "Default" },
    { id: "square", title: "Square" },
  ],
  "tree-view": [{ id: "file-tree", title: "File tree" }],
  "json-viewer": [
    { id: "api-response", title: "API response" },
    { id: "expanded-depth", title: "Expanded depth" },
  ],
  timeline: [{ id: "activity", title: "Activity" }],
  kanban: [{ id: "board", title: "Board" }],
  masonry: [{ id: "responsive-cards", title: "Responsive cards" }],
  heatmap: [{ id: "contributions", title: "Contributions" }],
  "comparison-slider": [{ id: "before-after", title: "Before & after" }],
  alert: [
    { id: "default", title: "Default" },
    { id: "variants", title: "Variants" },
    { id: "title-only", title: "Title only" },
  ],
  banner: [
    { id: "brand-promo", title: "Brand promo with a CTA" },
    { id: "dismissible", title: "Dismissible" },
  ],
  spinner: [{ id: "sizes", title: "Sizes" }],
  progress: [{ id: "determinate", title: "Determinate" }],
  "usage-meter": [
    { id: "linear", title: "Linear" },
    { id: "circular", title: "Circular" },
  ],
  sonner: [{ id: "toasts", title: "Toasts" }],
  "alert-dialog": [{ id: "confirm", title: "Confirm" }],
  "confirmation-dialog": [
    { id: "basic", title: "Basic" },
    { id: "destructive", title: "Destructive" },
    { id: "async", title: "Async confirm" },
  ],
  dialog: [{ id: "basic", title: "Basic" }],
  sheet: [{ id: "sides", title: "Sides" }],
  drawer: [{ id: "bottom-drawer", title: "Bottom drawer" }],
  popover: [{ id: "with-content", title: "With content" }],
  "notification-center": [{ id: "inbox", title: "Inbox" }],
  "hover-card": [{ id: "profile-preview", title: "Profile preview" }],
  tooltip: [{ id: "on-a-button", title: "On a button" }],
  "dropdown-menu": [{ id: "actions", title: "Actions" }],
  "context-menu": [{ id: "on-a-surface", title: "On a surface" }],
  command: [{ id: "command-palette", title: "Command palette" }],
  lightbox: [{ id: "gallery", title: "Gallery" }],
  tabs: [{ id: "three-tabs", title: "Three tabs" }],
  accordion: [{ id: "faq", title: "FAQ" }],
  breadcrumb: [{ id: "trail", title: "Trail" }],
  pagination: [{ id: "pager", title: "Pager" }],
  "navigation-menu": [{ id: "menu-bar", title: "Menu bar" }],
  menubar: [{ id: "menus", title: "Menus" }],
  sidebar: [{ id: "collapsible-nav", title: "Collapsible navigation" }],
  "app-shell": [{ id: "shell-layout", title: "Shell layout" }],
  resizable: [{ id: "split-panes", title: "Split panes" }],
  toolbar: [{ id: "formatting", title: "Formatting" }],
  "table-of-contents": [{ id: "scrollspy", title: "Scrollspy article" }],
  calendar: [{ id: "single-date", title: "Single date" }],
  countdown: [
    { id: "launch", title: "Launch countdown" },
    { id: "compact-complete", title: "Compact with completion" },
  ],
  "date-picker": [{ id: "pick-a-date", title: "Pick a date" }],
  "date-range-picker": [
    { id: "range", title: "Date range" },
    { id: "presets", title: "With presets" },
  ],
  scheduler: [{ id: "month-view", title: "Month view" }],
  "time-picker": [
    { id: "twelve-hour", title: "12-hour clock" },
    { id: "twenty-four-hour-seconds", title: "24-hour with seconds" },
    { id: "disabled", title: "Disabled" },
  ],
  chart: [
    { id: "bar-chart", title: "Bar chart" },
    { id: "pie-chart", title: "Donut chart" },
    { id: "radar-chart", title: "Radar chart" },
    { id: "radial-chart", title: "Radial bar gauge" },
  ],
  "glass-card": [{ id: "frosted-surface", title: "Frosted surface" }],
  "gradient-border": [
    { id: "with-glow", title: "With glow" },
    { id: "flat", title: "Flat" },
  ],
  "gradient-text": [{ id: "headline", title: "Headline" }],
  "spotlight-card": [{ id: "hover-spotlight", title: "Hover spotlight" }],
  "scroll-progress": [{ id: "reading-bar", title: "Reading bar & ring" }],
  "aurora-background": [{ id: "animated-backdrop", title: "Animated backdrop" }],
  "logo-carousel": [{ id: "hero-lockup", title: "Hero lockup" }],
  marquee: [
    { id: "logo-ticker", title: "Logo ticker" },
    { id: "testimonials", title: "Testimonial wall" },
  ],
  "morphing-popover": [
    { id: "feedback", title: "Feedback" },
    { id: "quick-actions", title: "Quick actions" },
  ],
  shimmer: [{ id: "loading-sheen", title: "Loading sheen" }],
  reveal: [{ id: "scroll-reveal", title: "Scroll reveal" }],
  "animated-number": [{ id: "count-up", title: "Count up" }],
  carousel: [{ id: "slides", title: "Slides" }],
  "segmented-control": [{ id: "single-select", title: "Single select" }],
  "text-effect": [{ id: "headline", title: "Headline" }],
  frame: [
    { id: "browser", title: "Browser chrome" },
    { id: "window", title: "Window chrome" },
  ],
  dock: [{ id: "app-dock", title: "App dock" }],
  "border-beam": [
    { id: "featured-card", title: "Featured card" },
    { id: "prompt-bar", title: "Prompt bar" },
    { id: "custom-colours", title: "Custom colours & reverse" },
  ],
  "flip-card": [
    { id: "hover", title: "Hover to flip" },
    { id: "click", title: "Click to flip" },
    { id: "controlled", title: "Controlled" },
  ],
  "tilt-card": [
    { id: "glare-parallax", title: "Glare & parallax" },
    { id: "payment-card", title: "Payment card" },
    { id: "subtle", title: "Subtle" },
  ],
  magnetic: [
    { id: "magnetic-cta", title: "Magnetic call-to-action" },
    { id: "icon-row", title: "Icon row" },
    { id: "field-tuning", title: "Strength & radius" },
  ],
  orbit: [
    { id: "constellation", title: "Integration constellation" },
    { id: "team-halo", title: "Team halo" },
  ],
  terminal: [
    { id: "install-session", title: "Install session" },
    { id: "static-log", title: "Static, chrome-less log" },
  ],
  ripple: [{ id: "pulse", title: "Pulse" }],
  meteors: [{ id: "field", title: "Shooting stars" }],
  "dot-pattern": [{ id: "field", title: "Dotted field" }],
  "grid-pattern": [{ id: "field", title: "Grid field" }],
  "retro-grid": [{ id: "floor", title: "Perspective floor" }],
  noise: [{ id: "grain", title: "Film grain" }],
  "light-rays": [{ id: "shafts", title: "Light shafts" }],
  "progressive-blur": [{ id: "edge", title: "Edge fade" }],
  "flickering-grid": [{ id: "signal", title: "Signal grid" }],
  "star-border": [{ id: "twinkle", title: "Twinkle border" }],
  "shiny-text": [{ id: "sheen", title: "Sheen" }],
  highlighter: [{ id: "mark", title: "Marker" }],
  "spinning-text": [{ id: "orbit", title: "Orbit" }],
  "sparkles-text": [{ id: "twinkle", title: "Sparkles" }],
  "typing-text": [{ id: "typewriter", title: "Typewriter" }],
  "word-rotate": [{ id: "cycle", title: "Word cycle" }],
  "scramble-text": [{ id: "decrypt", title: "Decrypt" }],
  "glare-hover": [{ id: "glare", title: "Pointer glare" }],
  "click-spark": [{ id: "burst", title: "Click burst" }],
  "animated-list": [{ id: "stagger", title: "Staggered list" }],
  "card-stack": [{ id: "fan", title: "Fanned stack" }],
  "pill-nav": [{ id: "pills", title: "Sliding pill" }],
  "expandable-tabs": [{ id: "icons", title: "Expanding tabs" }],
  "dynamic-island": [{ id: "live", title: "Live activity" }],
  confetti: [{ id: "burst", title: "Burst" }],
  particles: [{ id: "field", title: "Drifting field" }],
};

export function getExampleSections(slug: string): ExampleSectionMeta[] {
  return EXAMPLE_SECTIONS[slug] ?? [];
}
