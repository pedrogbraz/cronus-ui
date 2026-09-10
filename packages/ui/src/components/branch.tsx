"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";

export type BranchRole = "system" | "user" | "assistant" | "data";

type BranchContextType = {
  currentBranch: number;
  totalBranches: number;
  goToPrevious: () => void;
  goToNext: () => void;
  branches: ReactElement[];
  setBranches: (branches: ReactElement[]) => void;
  labels: Required<BranchLabels>;
};

export type BranchLabels = {
  previous?: string;
  next?: string;
  page?: string;
};

const DEFAULT_LABELS: Required<BranchLabels> = {
  previous: "Previous branch",
  next: "Next branch",
  page: "{current} of {total}",
};

const BranchContext = createContext<BranchContextType | null>(null);

const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("Branch components must be used within Branch");
  }
  return context;
};

export type BranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number;
  onBranchChange?: (branchIndex: number) => void;
  labels?: BranchLabels;
};

export function Branch({
  defaultBranch = 0,
  onBranchChange,
  className,
  labels: labelsProp,
  ref,
  ...props
}: BranchProps & { ref?: Ref<HTMLDivElement> }) {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);
  const [branches, setBranches] = useState<ReactElement[]>([]);
  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  const handleBranchChange = (newBranch: number) => {
    setCurrentBranch(newBranch);
    onBranchChange?.(newBranch);
  };

  const goToPrevious = () => {
    if (currentBranch <= 0) return;
    handleBranchChange(currentBranch - 1);
  };

  const goToNext = () => {
    if (currentBranch >= branches.length - 1) return;
    handleBranchChange(currentBranch + 1);
  };

  return (
    <BranchContext.Provider
      value={{
        currentBranch,
        totalBranches: branches.length,
        goToPrevious,
        goToNext,
        branches,
        setBranches,
        labels,
      }}
    >
      <div
        ref={ref}
        data-slot="branch"
        className={cn("grid w-full gap-2 [&>div]:pb-0", className)}
        {...props}
      />
    </BranchContext.Provider>
  );
}

export type BranchMessagesProps = HTMLAttributes<HTMLDivElement>;

export function BranchMessages({ children, className, ...props }: BranchMessagesProps) {
  const { currentBranch, setBranches, branches } = useBranch();
  const childrenArray = Array.isArray(children) ? children : [children];

  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray as ReactElement[]);
    }
  }, [childrenArray, branches, setBranches]);

  return (
    <div data-slot="branch-messages" className={className} {...props}>
      {childrenArray.map((branch, index) => (
        <div
          className={cn(
            "grid gap-2 overflow-hidden [&>div]:pb-0",
            index === currentBranch ? "block" : "hidden",
          )}
          key={(branch as ReactElement)?.key ?? index}
        >
          {branch}
        </div>
      ))}
    </div>
  );
}

export type BranchSelectorProps = HTMLAttributes<HTMLDivElement> & {
  from?: BranchRole;
};

export function BranchSelector({
  className,
  from = "assistant",
  ref,
  ...props
}: BranchSelectorProps & { ref?: Ref<HTMLDivElement> }) {
  const { totalBranches } = useBranch();

  if (totalBranches <= 1) {
    return null;
  }

  return (
    <div
      ref={ref}
      data-slot="branch-selector"
      className={cn(
        "flex items-center gap-2 self-end px-10",
        from === "assistant" ? "justify-start" : "justify-end",
        className,
      )}
      {...props}
    />
  );
}

export type BranchPreviousProps = ComponentProps<typeof Button>;

export function BranchPrevious({ className, children, ...props }: BranchPreviousProps) {
  const { goToPrevious, totalBranches, currentBranch, labels } = useBranch();

  return (
    <Button
      data-slot="branch-previous"
      aria-label={labels.previous}
      className={cn(
        "size-7 shrink-0 rounded-full text-fg-tertiary transition-colors",
        "hover:bg-surface-overlay hover:text-fg",
        className,
      )}
      disabled={totalBranches <= 1 || currentBranch <= 0}
      onClick={goToPrevious}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronLeft aria-hidden className="size-3.5 rtl:rotate-180" />}
    </Button>
  );
}

export type BranchNextProps = ComponentProps<typeof Button>;

export function BranchNext({ className, children, ...props }: BranchNextProps) {
  const { goToNext, totalBranches, currentBranch, labels } = useBranch();

  return (
    <Button
      data-slot="branch-next"
      aria-label={labels.next}
      className={cn(
        "size-7 shrink-0 rounded-full text-fg-tertiary transition-colors",
        "hover:bg-surface-overlay hover:text-fg",
        className,
      )}
      disabled={totalBranches <= 1 || currentBranch >= totalBranches - 1}
      onClick={goToNext}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronRight aria-hidden className="size-3.5 rtl:rotate-180" />}
    </Button>
  );
}

export type BranchPageProps = HTMLAttributes<HTMLSpanElement>;

export function BranchPage({
  className,
  ref,
  ...props
}: BranchPageProps & { ref?: Ref<HTMLSpanElement> }) {
  const { currentBranch, totalBranches, labels } = useBranch();
  const text = labels.page
    .replace("{current}", String(currentBranch + 1))
    .replace("{total}", String(totalBranches));

  return (
    <span
      ref={ref}
      data-slot="branch-page"
      className={cn("text-xs font-medium tabular-nums text-fg-tertiary", className)}
      {...props}
    >
      {text}
    </span>
  );
}
