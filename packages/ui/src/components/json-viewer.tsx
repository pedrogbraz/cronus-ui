"use client";

import { ChevronRight } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { cn } from "../lib/cn.js";
import { CopyButton } from "./copy-button.js";

/* ------------------------------------------------------------------ *
 * Value helpers (pure + synchronous, so rendering is SSR-safe)
 * ------------------------------------------------------------------ */

/** A container value the tree can recurse into: object, array, Map, or Set. */
type BranchValue =
  | Record<string, unknown>
  | readonly unknown[]
  | ReadonlyMap<unknown, unknown>
  | ReadonlySet<unknown>;

/**
 * Built-ins that render as single leaf rows even though `typeof` calls them
 * objects: they have no useful enumerable properties, so recursing into them
 * would display — and copy — an empty `{}`.
 */
function isLeafObject(value: object): boolean {
  return (
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof URL ||
    value instanceof Error
  );
}

function isBranchValue(value: unknown): value is BranchValue {
  return typeof value === "object" && value !== null && !isLeafObject(value);
}

/**
 * The visible entries of a branch: index/value pairs for arrays and Sets,
 * indexed `[key, value]` pair tuples for Maps (keys can be arbitrary values,
 * so the pairs mirror the copied JSON exactly), and own enumerable
 * string-keyed entries (insertion order) for objects.
 */
function branchEntries(value: BranchValue): Array<[string, unknown]> {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index), item]);
  }
  if (value instanceof Map) {
    return [...value].map((pair, index) => [String(index), pair]);
  }
  if (value instanceof Set) {
    return [...value].map((item, index) => [String(index), item]);
  }
  return Object.entries(value);
}

/** Branch flavor — drives the wrapping tokens, child-key style, and summary noun. */
type BranchKind = "array" | "map" | "set" | "object";

function branchKind(value: BranchValue): BranchKind {
  if (Array.isArray(value)) return "array";
  if (value instanceof Map) return "map";
  if (value instanceof Set) return "set";
  return "object";
}

/** Collapsed-summary noun ([singular, plural]) per branch kind. */
const BRANCH_NOUNS: Record<BranchKind, readonly [string, string]> = {
  array: ["item", "items"],
  map: ["entry", "entries"],
  set: ["item", "items"],
  object: ["key", "keys"],
};

/**
 * Rebuild `value` as a plain JSON-serializable clone. Built-ins convert to
 * faithful forms instead of `{}`: Date → ISO 8601 string (invalid dates →
 * null, matching `JSON.stringify`), RegExp → its literal source, URL → its
 * href, Error → `"Name: message"`, Map → an array of `[key, value]` pairs,
 * Set → an array of its items. Ancestors are tracked in a `WeakSet` that is
 * entered before and left after each object, so genuine cycles become a
 * `"[Circular]"` token while mere shared references (the same object
 * appearing under two siblings) serialize normally. Bigints keep an `n`
 * suffix instead of throwing.
 */
function toSerializable(value: unknown, ancestors: WeakSet<object>): unknown {
  if (typeof value === "bigint") return `${value}n`;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  if (value instanceof RegExp || value instanceof Error) return String(value);
  if (value instanceof URL) return value.href;
  if (!isBranchValue(value)) return value;
  if (ancestors.has(value)) return "[Circular]";
  ancestors.add(value);
  let clone: unknown;
  if (Array.isArray(value)) {
    clone = value.map((item) => toSerializable(item, ancestors));
  } else if (value instanceof Map) {
    clone = [...value].map(([key, entry]) => [
      toSerializable(key, ancestors),
      toSerializable(entry, ancestors),
    ]);
  } else if (value instanceof Set) {
    clone = [...value].map((item) => toSerializable(item, ancestors));
  } else {
    clone = Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toSerializable(entry, ancestors)]),
    );
  }
  ancestors.delete(value);
  return clone;
}

/**
 * Serialize any value for the copy button. Falls back to `String(value)` for
 * values `JSON.stringify` cannot represent at the top level (undefined,
 * functions, symbols).
 */
function stringifyValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (typeof value === "bigint") return `${value}n`;
  const json = JSON.stringify(toSerializable(value, new WeakSet()), null, 2);
  return json ?? String(value);
}

/**
 * Map a primitive to its display text + semantic color token.
 *
 * De-emphasized values (`null`, `undefined`, functions/symbols) use
 * `fg-tertiary`, not `fg-muted`: they are meaningful data, and `fg-muted` fails
 * AA contrast on the inset surface (see CONTRACT.md).
 */
function formatPrimitive(value: unknown): { text: string; className: string } {
  if (value === null) return { text: "null", className: "text-fg-tertiary" };
  if (value === undefined) return { text: "undefined", className: "text-fg-tertiary" };
  switch (typeof value) {
    case "string":
      // JSON.stringify supplies the quotes and escapes embedded ones.
      // `text-*-strong` (the AA-tuned same-hue variants): the plain semantic
      // colors read ~4.4:1 as small code text on the lightest light surfaces.
      return { text: JSON.stringify(value), className: "text-success-strong" };
    case "number":
      return { text: String(value), className: "text-info-strong tabular-nums" };
    case "bigint":
      return { text: `${value}n`, className: "text-info-strong tabular-nums" };
    case "boolean":
      return { text: String(value), className: "text-warning-strong" };
    default:
      // Functions and symbols are not JSON; render a compact de-emphasized token.
      return {
        text: typeof value === "function" ? "ƒ ()" : String(value),
        className: "text-fg-tertiary italic",
      };
  }
}

/**
 * Display text, color token, and optional dim type hint for a leaf value —
 * primitives plus the leaf-rendered built-ins (Date, RegExp, URL, Error).
 */
function formatLeaf(value: unknown): { text: string; className: string; hint?: string } {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? { text: "Invalid Date", className: "text-fg-tertiary italic", hint: "Date" }
      : { text: value.toISOString(), className: "text-info-strong", hint: "Date" };
  }
  if (value instanceof RegExp) {
    // The literal form (`/ab+c/gi`) is self-describing — no hint needed.
    return { text: String(value), className: "text-success-strong" };
  }
  if (value instanceof URL) {
    return { text: JSON.stringify(value.href), className: "text-success-strong", hint: "URL" };
  }
  if (value instanceof Error) {
    // `String(error)` is "Name: message", so the name doubles as the hint.
    return { text: String(value), className: "text-error-strong" };
  }
  return formatPrimitive(value);
}

/**
 * Clipboard text for a leaf. Strings copy their raw contents and the
 * string-like built-ins copy their faithful string form (Date → ISO 8601,
 * URL → href, RegExp → literal, Error → `"Name: message"`) — the most useful
 * shapes to paste; the remaining primitives copy their display text, which
 * `String` produces directly without involving the tree serializer.
 */
function leafCopyText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Date) {
    // Matches serialization: an invalid Date is `null` in JSON.
    return Number.isNaN(value.getTime()) ? "null" : value.toISOString();
  }
  if (value instanceof RegExp || value instanceof Error) return String(value);
  if (value instanceof URL) return value.href;
  if (typeof value === "bigint") return `${value}n`;
  return String(value);
}

function copyLabelFor(name: string | undefined): string {
  return name === undefined ? "Copy value" : `Copy value of ${name}`;
}

/* ------------------------------------------------------------------ *
 * Row building blocks
 * ------------------------------------------------------------------ */

/** Punctuation ({}, [], commas, colons) in the tertiary foreground token. */
function Punct({ children }: { children: ReactNode }) {
  return <span className="text-fg-tertiary">{children}</span>;
}

/** Dim type hint (`Date`, `URL`, `Map(2)`, …) rendered before a value. */
function TypeHint({ children }: { children: string }) {
  return (
    <span data-slot="json-viewer-hint" className="text-fg-muted">
      {`${children} `}
    </span>
  );
}

/** Chevron-width placeholder that keeps leaf rows aligned with branch rows. */
function ControlSpacer() {
  return <span aria-hidden="true" className="size-5 shrink-0" />;
}

/** Property key (quoted for objects, bare index for arrays) plus its colon. */
function KeyLabel({ name, quoted }: { name: string; quoted: boolean }) {
  return (
    <>
      <span data-slot="json-viewer-key" className="text-fg-secondary">
        {quoted ? JSON.stringify(name) : name}
      </span>
      <Punct>{": "}</Punct>
    </>
  );
}

interface JsonRowProps {
  /** The leading control: a chevron button for branches, a spacer for leaves. */
  control: ReactNode;
  /**
   * Text written to the clipboard by the row's copy button — either the
   * ready string (leaves, O(1) to build) or a producer invoked on the first
   * copy (branches), so O(subtree) serialization never runs during render.
   */
  copyText: string | (() => string);
  /** Stable accessible name for the row's copy button. */
  copyLabel: string;
  children: ReactNode;
}

/**
 * One visual line of the tree. The copy button is always rendered (so it is
 * keyboard-reachable and the layout never shifts) but kept at `opacity-0`
 * until the row is hovered or anything inside the row holds focus.
 *
 * The copy button deliberately stays in the tab order: a leaf row has no
 * other focusable element, so `tabIndex={-1}` would make copying impossible
 * from the keyboard. The extra tab stop per row is the lesser harm until the
 * tree gets a proper roving-tabindex treatment.
 *
 * Branch payloads are produced lazily: the first activation cancels the copy
 * (CopyButton honors `defaultPrevented`), commits the serialized text
 * synchronously, and re-dispatches the click so the copy proceeds with the
 * real payload. The text is cached against its producer — which branches
 * memoize on their value — so it recomputes only when the data changes.
 */
function JsonRow({ control, copyText, copyLabel, children }: JsonRowProps) {
  const [cache, setCache] = useState<{ produce: () => string; text: string } | null>(null);
  const resolved =
    typeof copyText === "string" ? copyText : cache?.produce === copyText ? cache.text : null;

  return (
    <div data-slot="json-viewer-row" className="group/row flex items-start gap-1">
      {control}
      <span className="min-w-0 flex-1 break-words">{children}</span>
      <CopyButton
        value={resolved ?? ""}
        copyLabel={copyLabel}
        onClick={(event) => {
          if (typeof copyText === "string" || resolved !== null) return;
          event.preventDefault();
          const button = event.currentTarget;
          flushSync(() => setCache({ produce: copyText, text: copyText() }));
          button.click();
        }}
        variant="ghost"
        size="icon-sm"
        className="mt-0.5 size-5 shrink-0 rounded-md opacity-0 transition-opacity duration-150 focus-visible:opacity-100 group-focus-within/row:opacity-100 group-hover/row:opacity-100 motion-reduce:transition-none [&_svg]:size-3"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Recursive nodes
 * ------------------------------------------------------------------ */

interface JsonNodeProps {
  /** Property key (objects) or index (arrays); undefined for the root value. */
  name?: string;
  /** Whether the key renders quoted (object keys) or bare (array indices). */
  quotedName: boolean;
  value: unknown;
  /** 0-based depth of this node; the root value is depth 0. */
  depth: number;
  defaultExpandedDepth: number;
  /** Object ancestry of this node, used to break rendering on cycles. */
  ancestors: readonly object[];
  /** Last sibling — suppresses the trailing comma. */
  isLast: boolean;
}

function JsonNode(props: JsonNodeProps) {
  const { value, ancestors } = props;
  if (isBranchValue(value)) {
    if (ancestors.includes(value)) {
      return <JsonCircularLeaf {...props} />;
    }
    return <JsonBranch {...props} value={value} />;
  }
  return <JsonLeaf {...props} />;
}

/** A value that references one of its own ancestors — never recurse into it. */
function JsonCircularLeaf({ name, quotedName, isLast }: JsonNodeProps) {
  return (
    <JsonRow control={<ControlSpacer />} copyText="[Circular]" copyLabel={copyLabelFor(name)}>
      {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
      <span data-slot="json-viewer-value" className="text-fg-tertiary italic">
        {"[Circular]"}
      </span>
      {!isLast && <Punct>,</Punct>}
    </JsonRow>
  );
}

function JsonLeaf({ name, quotedName, value, isLast }: JsonNodeProps) {
  const { text, className, hint } = formatLeaf(value);
  return (
    <JsonRow
      control={<ControlSpacer />}
      copyText={leafCopyText(value)}
      copyLabel={copyLabelFor(name)}
    >
      {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
      {hint !== undefined && <TypeHint>{hint}</TypeHint>}
      <span data-slot="json-viewer-value" className={cn("break-all", className)}>
        {text}
      </span>
      {!isLast && <Punct>,</Punct>}
    </JsonRow>
  );
}

interface JsonBranchProps extends JsonNodeProps {
  value: BranchValue;
}

function JsonBranch({
  name,
  quotedName,
  value,
  depth,
  defaultExpandedDepth,
  ancestors,
  isLast,
}: JsonBranchProps) {
  // Expansion is per branch and uncontrolled, seeded from the depth budget, so
  // toggling one node re-renders only its own subtree.
  const [expanded, setExpanded] = useState(depth < defaultExpandedDepth);
  const entries = useMemo(() => branchEntries(value), [value]);
  // Serialization is deferred to the copy handler (see JsonRow) — memoized on
  // the value so JsonRow's cache invalidates exactly when the data changes.
  const getCopyText = useCallback(() => stringifyValue(value), [value]);
  const childAncestors = useMemo(() => [...ancestors, value], [ancestors, value]);

  const kind = branchKind(value);
  const count = entries.length;
  // Maps and Sets copy as arrays, so they display with array brackets too;
  // the dim `Map(n)`/`Set(n)` hint carries the real type.
  const [openToken, closeToken] = kind === "object" ? ["{", "}"] : ["[", "]"];
  const hint = kind === "map" ? `Map(${count})` : kind === "set" ? `Set(${count})` : null;
  const noun = BRANCH_NOUNS[kind][count === 1 ? 0 : 1];

  // Empty containers have nothing to expand — render them as a single leaf row.
  if (count === 0) {
    return (
      <JsonRow control={<ControlSpacer />} copyText={getCopyText} copyLabel={copyLabelFor(name)}>
        {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
        {hint !== null && <TypeHint>{hint}</TypeHint>}
        <Punct>
          {openToken}
          {closeToken}
        </Punct>
        {!isLast && <Punct>,</Punct>}
      </JsonRow>
    );
  }

  return (
    <div data-slot="json-viewer-branch">
      <JsonRow
        control={
          <button
            type="button"
            data-slot="json-viewer-toggle"
            data-state={expanded ? "open" : "closed"}
            aria-expanded={expanded}
            // Stable accessible name; the open/closed state is conveyed by
            // `aria-expanded`, not by mutating the label.
            aria-label={`Toggle ${name ?? "root"}`}
            onClick={() => setExpanded((previous) => !previous)}
            className={cn(
              "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md text-fg-tertiary outline-none",
              "transition-[background,color] duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
              "hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            )}
          >
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "size-3.5 transition-transform duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
                expanded && "rotate-90",
              )}
            />
          </button>
        }
        copyText={getCopyText}
        copyLabel={copyLabelFor(name)}
      >
        {name !== undefined && <KeyLabel name={name} quoted={quotedName} />}
        {hint !== null && <TypeHint>{hint}</TypeHint>}
        <Punct>{openToken}</Punct>
        {!expanded && (
          <>
            <span
              data-slot="json-viewer-summary"
              // The child count is information-bearing, so it uses `fg-tertiary`
              // (AA-safe on the inset surface) rather than the decorative `fg-muted`.
              className="text-fg-tertiary tabular-nums"
            >{` … ${count} ${noun} `}</span>
            <Punct>{closeToken}</Punct>
            {!isLast && <Punct>,</Punct>}
          </>
        )}
      </JsonRow>

      {expanded && (
        <>
          {/* Indent guide: the left border sits under the chevron's center. */}
          <div data-slot="json-viewer-children" className="ml-2.5 border-border border-l pl-3.5">
            {entries.map(([childName, childValue], index) => (
              <JsonNode
                key={childName}
                name={childName}
                quotedName={kind === "object"}
                value={childValue}
                depth={depth + 1}
                defaultExpandedDepth={defaultExpandedDepth}
                ancestors={childAncestors}
                isLast={index === count - 1}
              />
            ))}
          </div>
          <div data-slot="json-viewer-closer" className="flex items-start gap-1">
            <ControlSpacer />
            <span className="min-w-0 flex-1">
              <Punct>{closeToken}</Punct>
              {!isLast && <Punct>,</Punct>}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Root
 * ------------------------------------------------------------------ */

export interface JsonViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** The value to render. Objects and arrays become collapsible branches. */
  data: unknown;
  /**
   * How many levels start expanded — a mount-time default, not a controlled
   * value. Expansion state is uncontrolled per branch and seeded once when a
   * branch first mounts, so later changes to this prop leave already-mounted
   * branches untouched. The root value is depth 0, so the default of 1 shows
   * the root's entries with every nested branch collapsed. Pass
   * `Number.POSITIVE_INFINITY` to expand everything.
   */
  defaultExpandedDepth?: number;
}

/**
 * A collapsible JSON tree viewer. Any `unknown` value renders as a recursive,
 * monospaced tree: objects and arrays become branches with a real chevron
 * `<button>` (`aria-expanded`, focus ring) and a muted child-count summary
 * while collapsed; primitives are colored purely by semantic tokens (strings
 * `text-success-strong`, numbers `text-info-strong` + `tabular-nums`, booleans
 * `text-warning-strong`, null/undefined `text-fg-tertiary`), keys use
 * `text-fg-secondary` and punctuation `text-fg-tertiary`, with `border-border`
 * indent guides.
 *
 * Non-plain built-ins render faithfully instead of as empty objects: Date
 * (ISO 8601), RegExp (literal), URL (href), and Error ("Name: message") are
 * leaves with a dim type hint where the text alone is ambiguous, while Map
 * and Set are branches — a `Map(n)`/`Set(n)` hint plus indexed `[key, value]`
 * pairs (Map) or items (Set), exactly the shape their copied JSON takes.
 *
 * Expansion state lives per branch (seeded from `defaultExpandedDepth`), so
 * toggling a node only re-renders its own subtree, and collapsed subtrees are
 * not mounted at all. Every row reveals a clipboard button on hover or focus
 * — string-like leaves copy their raw contents, everything else copies
 * pretty-printed JSON, and branch payloads are serialized lazily on the first
 * copy rather than during render. Both rendering and serialization are
 * cycle-safe: values that reference their own ancestors render/serialize as a
 * `"[Circular]"` token instead of recursing forever. Fully keyboard operable
 * (chevrons and copy buttons are native buttons), reduced-motion safe, and
 * SSR-safe (no DOM reads, no time- or random-dependent output).
 */
export const JsonViewer = forwardRef<HTMLDivElement, JsonViewerProps>(
  ({ data, defaultExpandedDepth = 1, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="json-viewer"
      className={cn(
        "overflow-x-auto rounded-xl border border-border bg-surface-inset p-4 font-mono text-fg text-sm leading-6",
        className,
      )}
      {...props}
    >
      <JsonNode
        value={data}
        quotedName={false}
        depth={0}
        defaultExpandedDepth={defaultExpandedDepth}
        ancestors={[]}
        isLast
      />
    </div>
  ),
);
JsonViewer.displayName = "JsonViewer";
