"use client";

import { ChevronsUpDown } from "lucide-react";
import { type Ref, useCallback, useState } from "react";
import { cn } from "../lib/cn.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

export interface WorkspaceItem {
  id: string;
  name: string;
  initials?: string;
  image?: string;
}

export interface WorkspaceSwitcherLabels {
  /** Accessible name for the trigger. @default "Switch workspace" */
  label?: string;
}

const DEFAULT_LABELS: Required<WorkspaceSwitcherLabels> = {
  label: "Switch workspace",
};

function workspaceInitials(workspace: WorkspaceItem): string {
  if (workspace.initials) {
    return workspace.initials;
  }
  const parts = workspace.name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return `${first}${second}`.toUpperCase();
  }
  return workspace.name.slice(0, 2).toUpperCase();
}

export interface WorkspaceSwitcherProps {
  workspaces: readonly WorkspaceItem[];
  /** Controlled selected workspace id. Pair with `onValueChange`. */
  value?: string;
  /** Uncontrolled initial workspace id. Defaults to the first workspace. */
  defaultValue?: string;
  /** Called with the selected workspace id. */
  onValueChange?: (id: string) => void;
  /** Override any subset of the built-in English strings. */
  labels?: WorkspaceSwitcherLabels;
  className?: string;
  /** Forwarded to the trigger button. */
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Compact workspace/org switcher for app chrome. The trigger shows the current
 * workspace avatar, name, and a chevron; the menu lists every workspace with
 * the selected row marked as a radio item (`menuitemradio`).
 *
 * Controlled via `value`/`onValueChange` or uncontrolled via `defaultValue`.
 * Renders nothing when `workspaces` is empty. Keyboard access is owned by the
 * underlying (non-modal) dropdown menu.
 */
export function WorkspaceSwitcher({
  workspaces,
  value,
  defaultValue,
  onValueChange,
  labels,
  className,
  ref,
}: WorkspaceSwitcherProps) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(() => defaultValue ?? workspaces[0]?.id ?? "");
  const selectedId = isControlled ? value : uncontrolled;

  const handleChange = useCallback(
    (id: string) => {
      if (!isControlled) {
        setUncontrolled(id);
      }
      onValueChange?.(id);
    },
    [isControlled, onValueChange],
  );

  if (workspaces.length === 0) {
    return null;
  }

  const current = workspaces.find((workspace) => workspace.id === selectedId) ?? workspaces[0];
  if (!current) {
    return null;
  }

  const triggerLabel = `${resolvedLabels.label}, ${current.name}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          ref={ref}
          type="button"
          data-slot="workspace-switcher"
          aria-label={triggerLabel}
          className={cn(
            "flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-fg outline-none hover:bg-surface-overlay focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50",
            className,
          )}
        >
          <WorkspaceAvatar workspace={current} />
          <span className="min-w-0 flex-1 truncate text-start font-medium">{current.name}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-fg-tertiary" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-slot="workspace-switcher-content"
        align="start"
        className="min-w-56"
      >
        <DropdownMenuRadioGroup value={current.id} onValueChange={handleChange}>
          {workspaces.map((workspace) => (
            <DropdownMenuRadioItem key={workspace.id} value={workspace.id} className="gap-2">
              <WorkspaceAvatar workspace={workspace} />
              <span className="min-w-0 flex-1 truncate text-start">{workspace.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function WorkspaceAvatar({ workspace }: { workspace: WorkspaceItem }) {
  return (
    <Avatar className="size-6">
      {workspace.image ? <AvatarImage src={workspace.image} alt="" /> : null}
      <AvatarFallback className="text-xs">{workspaceInitials(workspace)}</AvatarFallback>
    </Avatar>
  );
}
