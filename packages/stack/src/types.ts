/**
 * The Cronus Stack Builder model — a Better-T-Stack-class stack configurator.
 *
 * The whole builder is driven by a single declarative {@link Catalog}: a list of
 * {@link Category}, each holding {@link Option}s that wire up to each other via
 * `requires` / `conflicts` / `implies` / `recommends`. The pure resolver in
 * `engine.ts` turns a {@link Selection} (what the user picked) into a fully
 * resolved, valid {@link StackConfig} plus per-option availability.
 *
 * Option ids are GLOBALLY UNIQUE (e.g. "db-none", "orm-drizzle", "web-next") so
 * cross-category constraints can reference them directly.
 */

/** A short status flag rendered as a pill on an option. */
export type Badge = "beta" | "new" | "experimental" | "gated";

/**
 * How a category is selected:
 *  - "single": exactly one option id (radio).
 *  - "multi":  zero or more option ids (checkboxes).
 *  - "toggle": a boolean (on/off switch).
 */
export type CategoryKind = "single" | "multi" | "toggle";

/** A single choice inside a category. */
export interface Option {
  /** Globally unique id, e.g. "orm-drizzle". */
  id: string;
  /** Human label, e.g. "Drizzle". */
  name: string;
  /** One-line description shown under the label. */
  description: string;
  /** Optional lucide-react icon name, e.g. "database". */
  icon?: string;
  /** Optional status pill. */
  badge?: Badge;
  /** Option ids that must ALL be selected for this option to be available. */
  requires?: string[];
  /** Option ids that, if any is selected, make this option unavailable. */
  conflicts?: string[];
  /** Option ids auto-selected when this option is selected. */
  implies?: string[];
  /** Option ids surfaced as soft suggestions (no hard effect on validity). */
  recommends?: string[];
}

/** A group of related options (one builder row / column). */
export interface Category {
  /** Stable category id, e.g. "orm". Also the {@link Selection} key. */
  id: string;
  /** Human title, e.g. "ORM". */
  title: string;
  /** One-line description of what the category controls. */
  description?: string;
  /** Selection semantics. */
  kind: CategoryKind;
  /** The options (for "toggle" categories this is empty / ignored). */
  options: Option[];
  /**
   * When true a "single" category may resolve to no selection (rare). Most
   * single categories always hold a value (their default).
   */
  optional?: boolean;
  /**
   * The builder section this category is displayed under, e.g. "Framework",
   * "Data", "Conventions". Categories with the same group render together beneath
   * one section header, in catalog order.
   */
  group?: string;
  /**
   * Render style for a "single" category:
   *  - "cards" (default): the icon-card grid — for choices that benefit from an
   *    icon + description (frameworks, databases, …).
   *  - "segmented": a compact inline pill row — for simple, self-evident choices
   *    (naming convention, directory layout, …) where a big card would be noise.
   */
  layout?: "cards" | "segmented";
}

/** The full, ordered taxonomy. */
export type Catalog = Category[];

/**
 * Raw user selection keyed by category id.
 *  - "single" -> option id string.
 *  - "multi"  -> array of option ids.
 *  - "toggle" -> boolean.
 */
export type Selection = Record<string, string | string[] | boolean>;

/**
 * A fully resolved stack — the canonical config consumed by `kickoff.ts`.
 * Same shape as {@link Selection} but guaranteed valid and complete (every
 * single/toggle category present, every value available).
 */
export type StackConfig = Selection;

/** Resolution metadata for one option in one category. */
export interface ResolvedOption {
  /** The underlying option definition. */
  option: Option;
  /** Whether the option may currently be selected. */
  available: boolean;
  /** Short, human reason it is unavailable (only set when `available` is false). */
  reason?: string;
  /** Whether this option is currently selected. */
  selected: boolean;
}

/** Resolved state for one category. */
export interface ResolvedCategory {
  category: Category;
  options: ResolvedOption[];
  /** The resolved value (string | string[] | boolean) for this category. */
  value: string | string[] | boolean;
}

/** A validation note attached to the resolved stack. */
export interface ResolutionIssue {
  /** Category the issue belongs to. */
  categoryId: string;
  /** Severity: "error" blocks validity; "info" is advisory. */
  level: "error" | "info";
  /** Human message. */
  message: string;
}

/** The complete output of `resolve()`. */
export interface Resolution {
  /** The (auto-corrected) selection used to produce this resolution. */
  selection: Selection;
  /** Per-category resolved state, keyed by category id. */
  categories: Record<string, ResolvedCategory>;
  /** True when there are no "error"-level issues. */
  valid: boolean;
  /** All issues found during resolution. */
  issues: ResolutionIssue[];
}
