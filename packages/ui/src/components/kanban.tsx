"use client";

import {
  type CollisionDetection,
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  type UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";

export interface KanbanItem {
  /** Stable identifier, unique across the whole board. */
  id: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface KanbanColumn {
  /** Stable identifier, unique across the whole board. */
  id: string;
  title: ReactNode;
  items: KanbanItem[];
}

export interface KanbanProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The board's columns and their cards (controlled). */
  columns: KanbanColumn[];
  /** Called with the next columns after a reorder/move. The consumer owns state. */
  onColumnsChange: (next: KanbanColumn[]) => void;
  /**
   * Render a card's body. Defaults to the item's title + description in a
   * Card-like tile. The drag handle and tile chrome are always provided.
   */
  renderItem?: (item: KanbanItem) => ReactNode;
}

/** Locate which column an id belongs to. The id may be an item or a column. */
function findColumnId(columns: KanbanColumn[], id: UniqueIdentifier): string | undefined {
  const idStr = String(id);
  if (columns.some((column) => column.id === idStr)) return idStr;
  return columns.find((column) => column.items.some((item) => item.id === idStr))?.id;
}

function getItem(columns: KanbanColumn[], id: UniqueIdentifier): KanbanItem | undefined {
  const idStr = String(id);
  for (const column of columns) {
    const found = column.items.find((item) => item.id === idStr);
    if (found) return found;
  }
  return undefined;
}

/**
 * Move/reorder an item into a target column at the index implied by `overId`.
 * Returns a new columns array (never mutates the input) or the same reference
 * when nothing would change.
 */
function moveItem(
  columns: KanbanColumn[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
): KanbanColumn[] {
  const fromColumnId = findColumnId(columns, activeId);
  const toColumnId = findColumnId(columns, overId);
  if (!fromColumnId || !toColumnId) return columns;

  const fromColumn = columns.find((column) => column.id === fromColumnId);
  const toColumn = columns.find((column) => column.id === toColumnId);
  if (!fromColumn || !toColumn) return columns;

  const fromIndex = fromColumn.items.findIndex((item) => item.id === String(activeId));
  if (fromIndex < 0) return columns;
  const moved = fromColumn.items[fromIndex];
  if (!moved) return columns;

  // Index of the card being hovered, or append to the end when hovering the
  // column itself (e.g. an empty column or the gap below the last card).
  const overIsColumn = toColumn.id === String(overId);
  const overIndex = overIsColumn
    ? toColumn.items.length
    : toColumn.items.findIndex((item) => item.id === String(overId));

  if (fromColumnId === toColumnId) {
    if (overIndex < 0 || overIndex === fromIndex) return columns;
    const nextItems = [...fromColumn.items];
    nextItems.splice(fromIndex, 1);
    // `overIndex` is computed against the original array; after removing the
    // moved card the same target index lands the card where it was hovered.
    nextItems.splice(overIndex, 0, moved);
    return columns.map((column) =>
      column.id === fromColumnId ? { ...column, items: nextItems } : column,
    );
  }

  const nextFrom = [...fromColumn.items];
  nextFrom.splice(fromIndex, 1);
  const insertAt = overIndex < 0 ? toColumn.items.length : overIndex;
  const nextTo = [...toColumn.items];
  nextTo.splice(insertAt, 0, moved);

  return columns.map((column) => {
    if (column.id === fromColumnId) return { ...column, items: nextFrom };
    if (column.id === toColumnId) return { ...column, items: nextTo };
    return column;
  });
}

function defaultRenderItem(item: KanbanItem): ReactNode {
  return (
    <>
      <span data-slot="kanban-card-title" className="block font-medium leading-snug text-fg">
        {item.title}
      </span>
      {item.description != null ? (
        <span
          data-slot="kanban-card-description"
          className="mt-1 block text-sm leading-snug text-fg-secondary"
        >
          {item.description}
        </span>
      ) : null}
    </>
  );
}

interface KanbanCardProps {
  item: KanbanItem;
  render: (item: KanbanItem) => ReactNode;
}

function KanbanCard({ item, render }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      data-slot="kanban-card"
      data-dragging={isDragging || undefined}
      style={style}
      className={cn(
        "group flex items-start gap-2 rounded-lg border border-border bg-surface-raised p-3 text-fg shadow-sm",
        "transition-[border-color,box-shadow] focus-within:border-border-strong",
        isDragging && "opacity-40",
      )}
    >
      <button
        type="button"
        data-slot="kanban-drag-handle"
        className={cn(
          "mt-0.5 shrink-0 cursor-grab touch-none rounded-md p-0.5 text-fg-muted",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-raised active:cursor-grabbing hover:text-fg [&_svg]:size-4",
        )}
        aria-label="Reordenar cartão"
        {...attributes}
        {...listeners}
      >
        <GripVertical aria-hidden="true" />
      </button>
      <div data-slot="kanban-card-body" className="min-w-0 flex-1">
        {render(item)}
      </div>
    </li>
  );
}

interface KanbanColumnViewProps {
  column: KanbanColumn;
  render: (item: KanbanItem) => ReactNode;
}

function KanbanColumnView({ column, render }: KanbanColumnViewProps) {
  // Make the whole column a droppable target so cards can be dropped into an
  // empty column (where there is no card to hover over).
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const itemIds = useMemo(() => column.items.map((item) => item.id), [column.items]);

  return (
    <section
      data-slot="kanban-column"
      aria-label={typeof column.title === "string" ? column.title : undefined}
      className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-surface-inset"
    >
      <header
        data-slot="kanban-column-header"
        className="flex items-center justify-between gap-2 px-3 py-2.5"
      >
        <h3
          data-slot="kanban-column-title"
          className="min-w-0 truncate font-display text-sm font-semibold text-fg"
        >
          {column.title}
        </h3>
        <Badge variant="secondary" data-slot="kanban-column-count">
          {column.items.length}
        </Badge>
      </header>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          data-slot="kanban-column-list"
          data-over={isOver || undefined}
          className={cn(
            "flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-b-xl p-2",
            "transition-colors data-[over]:bg-surface-overlay/60",
          )}
        >
          {column.items.map((item) => (
            <KanbanCard key={item.id} item={item} render={render} />
          ))}
        </ul>
      </SortableContext>
    </section>
  );
}

/**
 * A drag-and-drop board: columns of cards that reorder within a column and
 * move across columns. Controlled via `columns` / `onColumnsChange` — the
 * consumer owns state. SSR-safe (no effects run on the server).
 */
export const Kanban = forwardRef<HTMLDivElement, KanbanProps>(
  ({ columns, onColumnsChange, renderItem, className, ...props }, ref) => {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const render = renderItem ?? defaultRenderItem;

    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // Prefer pointer-within (precise over empty columns), falling back to the
    // closest corners so dropping near a card still resolves a target.
    const collisionDetection = useCallback<CollisionDetection>((args) => {
      const pointerCollisions = pointerWithin(args);
      return pointerCollisions.length > 0 ? pointerCollisions : closestCorners(args);
    }, []);

    const activeItem = activeId != null ? getItem(columns, activeId) : undefined;

    const handleDragStart = useCallback((event: DragStartEvent) => {
      setActiveId(event.active.id);
    }, []);

    const handleDragOver = useCallback(
      (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
        const fromColumnId = findColumnId(columns, active.id);
        const toColumnId = findColumnId(columns, over.id);
        // Only handle cross-column transfers live; same-column ordering is
        // committed on drop to avoid thrashing while hovering.
        if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;
        const next = moveItem(columns, active.id, over.id);
        if (next !== columns) onColumnsChange(next);
      },
      [columns, onColumnsChange],
    );

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;
        const next = moveItem(columns, active.id, over.id);
        if (next !== columns) onColumnsChange(next);
      },
      [columns, onColumnsChange],
    );

    const handleDragCancel = useCallback(() => {
      setActiveId(null);
    }, []);

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          ref={ref}
          data-slot="kanban"
          className={cn("flex w-full gap-4 overflow-x-auto pb-2", className)}
          {...props}
        >
          {columns.map((column) => (
            <KanbanColumnView key={column.id} column={column} render={render} />
          ))}
        </div>
        <DragOverlay>
          {activeItem ? (
            <div
              data-slot="kanban-card-overlay"
              className={cn(
                "flex w-72 items-start gap-2 rounded-lg border border-border-strong",
                "bg-surface-overlay p-3 text-fg shadow-lg ring-1 ring-ring/40",
              )}
            >
              <span className="mt-0.5 shrink-0 text-fg-muted [&_svg]:size-4">
                <GripVertical aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">{render(activeItem)}</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  },
);
Kanban.displayName = "Kanban";
