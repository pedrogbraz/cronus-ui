"use client";

import { ChevronRight } from "lucide-react";
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

/**
 * A single node in a {@link TreeView}. Branches are nodes with a `children`
 * array (even an empty one renders an expandable branch); leaves omit it.
 */
export interface TreeNode {
  /** Stable, unique id used for selection + expansion state. */
  id: string;
  /** Visible label (text and/or inline markup). */
  label: ReactNode;
  /** Optional leading icon rendered before the label. */
  icon?: ReactNode;
  /** Child nodes. Presence (including `[]`) marks the node as a branch. */
  children?: TreeNode[];
  /** Disable selection + skip the node in keyboard navigation. */
  disabled?: boolean;
}

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The hierarchy to render. */
  data: TreeNode[];
  /** Controlled selected node id. */
  value?: string;
  /** Initial selected node id for the uncontrolled case. */
  defaultValue?: string;
  /** Called when the selection changes (controlled or not). */
  onValueChange?: (id: string) => void;
  /** Controlled set of expanded branch ids. */
  expandedIds?: string[];
  /** Initial expanded branch ids for the uncontrolled case. */
  defaultExpandedIds?: string[];
  /** Called whenever the expanded set changes (controlled or not). */
  onExpandedChange?: (ids: string[]) => void;
  /** Accessible label for the tree landmark. */
  "aria-label"?: string;
}

/** A flattened, currently-visible node carrying its depth + parentage. */
interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | undefined;
  isBranch: boolean;
}

/* ------------------------------------------------------------------ *
 * Context
 * ------------------------------------------------------------------ */

interface TreeViewContextValue {
  selectedId: string | undefined;
  expandedIds: Set<string>;
  /** Id owning the single roving tab stop (first enabled visible node). */
  rovingId: string | undefined;
  select: (id: string) => void;
  toggleExpanded: (id: string, force?: boolean) => void;
  /** Move roving focus relative to a node, per the WAI-ARIA tree pattern. */
  onItemKeyDown: (event: KeyboardEvent<HTMLDivElement>, flat: FlatNode) => void;
  register: (id: string, node: HTMLDivElement | null) => void;
}

const TreeViewContext = createContext<TreeViewContextValue | null>(null);

function useTreeView(): TreeViewContextValue {
  const context = useContext(TreeViewContext);
  if (context === null) {
    throw new Error("<TreeViewItem> must be used within <TreeView>.");
  }
  return context;
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function isBranchNode(node: TreeNode): boolean {
  return node.children !== undefined;
}

/**
 * Depth-first flatten of the visible nodes (a branch's children are included
 * only when the branch is expanded). Pure + synchronous so it is SSR-safe and
 * drives both rendering order and roving keyboard navigation from one source.
 */
function flattenVisible(
  data: TreeNode[],
  expandedIds: Set<string>,
  level = 1,
  parentId: string | undefined = undefined,
  out: FlatNode[] = [],
): FlatNode[] {
  for (const node of data) {
    const isBranch = isBranchNode(node);
    out.push({ node, level, parentId, isBranch });
    if (isBranch && expandedIds.has(node.id) && node.children) {
      flattenVisible(node.children, expandedIds, level + 1, node.id, out);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Root
 * ------------------------------------------------------------------ */

/**
 * A hierarchical, accessible tree (file-tree style). Data-driven via the
 * `data` prop, with controllable selection (`value`) and expansion
 * (`expandedIds`). Implements the WAI-ARIA tree pattern: `role="tree"` root,
 * `role="treeitem"` nodes with `aria-expanded`/`aria-selected`/`aria-level`,
 * `role="group"` child lists, a single roving tab stop, and full keyboard
 * navigation. SSR-safe (no DOM reads during render).
 */
export const TreeView = forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      data,
      value: valueProp,
      defaultValue,
      onValueChange,
      expandedIds: expandedProp,
      defaultExpandedIds,
      onExpandedChange,
      className,
      "aria-label": ariaLabel = "Tree",
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(defaultValue);
    const isSelectionControlled = valueProp !== undefined;
    const selectedId = isSelectionControlled ? valueProp : uncontrolledValue;

    const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<string>>(
      () => new Set(defaultExpandedIds),
    );
    const isExpansionControlled = expandedProp !== undefined;
    const expandedIds = useMemo(
      () => (isExpansionControlled ? new Set(expandedProp) : uncontrolledExpanded),
      [isExpansionControlled, expandedProp, uncontrolledExpanded],
    );

    // Registry of mounted treeitem nodes, used to move DOM focus on arrow keys.
    const itemsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const register = useCallback((id: string, node: HTMLDivElement | null) => {
      if (node === null) {
        itemsRef.current.delete(id);
      } else {
        itemsRef.current.set(id, node);
      }
    }, []);

    const select = useCallback(
      (id: string) => {
        if (!isSelectionControlled) {
          setUncontrolledValue(id);
        }
        onValueChange?.(id);
      },
      [isSelectionControlled, onValueChange],
    );

    const toggleExpanded = useCallback(
      (id: string, force?: boolean) => {
        const next = new Set(expandedIds);
        const shouldOpen = force ?? !next.has(id);
        if (shouldOpen) {
          next.add(id);
        } else {
          next.delete(id);
        }
        // No-op guard: avoid spurious change callbacks (e.g. ArrowRight on an
        // already-open branch, ArrowLeft on an already-closed leaf).
        if (next.size === expandedIds.size && shouldOpen === expandedIds.has(id)) {
          return;
        }
        if (!isExpansionControlled) {
          setUncontrolledExpanded(next);
        }
        onExpandedChange?.(Array.from(next));
      },
      [expandedIds, isExpansionControlled, onExpandedChange],
    );

    // Flattened visible list — the single source of truth for nav + roving.
    const flat = useMemo(() => flattenVisible(data, expandedIds), [data, expandedIds]);

    // Roving tab stop: the first enabled visible node, derived synchronously so
    // the tree is keyboard-reachable on first Tab without touching the DOM.
    const rovingId = useMemo(() => flat.find((item) => !item.node.disabled)?.node.id, [flat]);

    const focusId = useCallback((id: string | undefined) => {
      if (id === undefined) return;
      itemsRef.current.get(id)?.focus();
    }, []);

    const onItemKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>, item: FlatNode) => {
        const currentFlat = flattenVisible(data, expandedIds);
        const enabled = currentFlat.filter((entry) => !entry.node.disabled);
        const index = enabled.findIndex((entry) => entry.node.id === item.node.id);

        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            focusId(enabled[Math.min(index + 1, enabled.length - 1)]?.node.id);
            break;
          }
          case "ArrowUp": {
            event.preventDefault();
            focusId(enabled[Math.max(index - 1, 0)]?.node.id);
            break;
          }
          case "ArrowRight": {
            event.preventDefault();
            if (item.isBranch && !expandedIds.has(item.node.id)) {
              // Collapsed branch → expand it.
              toggleExpanded(item.node.id, true);
            } else if (item.isBranch) {
              // Open branch → move to its first (enabled) child.
              const childIndex = currentFlat.findIndex(
                (entry) => entry.parentId === item.node.id && !entry.node.disabled,
              );
              focusId(currentFlat[childIndex]?.node.id);
            }
            break;
          }
          case "ArrowLeft": {
            event.preventDefault();
            if (item.isBranch && expandedIds.has(item.node.id)) {
              // Open branch → collapse it.
              toggleExpanded(item.node.id, false);
            } else if (item.parentId !== undefined) {
              // Leaf or closed branch → move to parent.
              focusId(item.parentId);
            }
            break;
          }
          case "Home": {
            event.preventDefault();
            focusId(enabled[0]?.node.id);
            break;
          }
          case "End": {
            event.preventDefault();
            focusId(enabled[enabled.length - 1]?.node.id);
            break;
          }
          case "Enter":
          case " ": {
            event.preventDefault();
            select(item.node.id);
            break;
          }
          default:
            break;
        }
      },
      [data, expandedIds, focusId, toggleExpanded, select],
    );

    const contextValue = useMemo<TreeViewContextValue>(
      () => ({
        selectedId,
        expandedIds,
        rovingId,
        select,
        toggleExpanded,
        onItemKeyDown,
        register,
      }),
      [selectedId, expandedIds, rovingId, select, toggleExpanded, onItemKeyDown, register],
    );

    return (
      <TreeViewContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="tree"
          aria-label={ariaLabel}
          data-slot="tree-view"
          className={cn("flex w-full min-w-0 flex-col text-sm text-fg select-none", className)}
          {...props}
        >
          {data.map((node) => (
            <TreeViewItem key={node.id} node={node} level={1} parentId={undefined} />
          ))}
        </div>
      </TreeViewContext.Provider>
    );
  },
);
TreeView.displayName = "TreeView";

/* ------------------------------------------------------------------ *
 * Item (internal — the tree is rendered from `data`, not composed by hand)
 * ------------------------------------------------------------------ */

interface TreeViewItemProps {
  node: TreeNode;
  level: number;
  parentId: string | undefined;
}

function TreeViewItem({ node, level, parentId }: TreeViewItemProps) {
  const { selectedId, expandedIds, rovingId, select, toggleExpanded, onItemKeyDown, register } =
    useTreeView();

  const isBranch = isBranchNode(node);
  const isExpanded = isBranch && expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isDisabled = node.disabled === true;
  const flatSelf: FlatNode = { node, level, parentId, isBranch };

  const setRef = useCallback(
    (el: HTMLDivElement | null) => register(node.id, el),
    [register, node.id],
  );

  return (
    <div data-slot="tree-view-item" className="min-w-0">
      <div
        ref={setRef}
        role="treeitem"
        aria-level={level}
        aria-selected={isSelected}
        aria-expanded={isBranch ? isExpanded : undefined}
        aria-disabled={isDisabled || undefined}
        data-slot="tree-view-item-trigger"
        data-state={isExpanded ? "open" : "closed"}
        data-selected={isSelected || undefined}
        // Roving tabindex: exactly one node (the first enabled one) owns the tab
        // stop; arrow keys move focus and shift the tab stop with it.
        tabIndex={!isDisabled && node.id === rovingId ? 0 : -1}
        // Indent by depth. Inline padding keeps the focus ring spanning the full
        // row width while the content still reads as nested.
        style={{ paddingInlineStart: `${(level - 1) * 1 + 0.5}rem` }}
        className={cn(
          "flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2",
          "transition-[background,color] duration-150 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
          "text-fg-secondary hover:bg-surface-overlay hover:text-fg",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          isSelected && "bg-surface-overlay font-medium text-fg",
          isDisabled && "pointer-events-none opacity-50",
        )}
        onClick={() => {
          if (isDisabled) return;
          if (isBranch) {
            toggleExpanded(node.id);
          }
          select(node.id);
        }}
        onKeyDown={(event) => {
          if (isDisabled) return;
          onItemKeyDown(event, flatSelf);
        }}
      >
        {isBranch ? (
          <ChevronRight
            aria-hidden="true"
            data-slot="tree-view-chevron"
            className={cn(
              "size-4 shrink-0 text-fg-tertiary transition-transform duration-200 ease-[var(--ease-out-quart)] motion-reduce:transition-none",
              isExpanded && "rotate-90",
            )}
          />
        ) : (
          // Spacer keeps leaf labels aligned with branch labels.
          <span aria-hidden="true" className="size-4 shrink-0" />
        )}
        {node.icon ? (
          <span
            aria-hidden="true"
            data-slot="tree-view-icon"
            className="flex size-4 shrink-0 items-center justify-center text-fg-tertiary [&_svg]:size-4"
          >
            {node.icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate">{node.label}</span>
      </div>

      {isBranch && isExpanded && node.children ? (
        // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA tree pattern nests child treeitems in a role="group"; <fieldset> would be semantically wrong (these are tree nodes, not form controls).
        <div role="group" data-slot="tree-view-group" className="flex flex-col">
          {node.children.map((child) => (
            <TreeViewItem key={child.id} node={child} level={level + 1} parentId={node.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
