"use client";

import { ArrowDownIcon } from "lucide-react";
import {
  createContext,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type UIEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button, type ButtonProps } from "./button.js";

const BOTTOM_THRESHOLD_PX = 40;

export type ConversationStickContextValue = {
  isAtBottom: boolean;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};

type ConversationInternalContextValue = ConversationStickContextValue & {
  registerScrollElement: (el: HTMLElement | null) => void;
  setIsAtBottom: (value: boolean) => void;
};

const ConversationContext = createContext<ConversationInternalContextValue | null>(null);

function useConversationContext(component: string): ConversationInternalContextValue {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(`${component} must be used within a Conversation`);
  }
  return context;
}

export type ConversationProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
};

export function Conversation({ className, ref, children, ...props }: ConversationProps) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const scrollRef = useRef<HTMLElement | null>(null);

  const registerScrollElement = useCallback((el: HTMLElement | null) => {
    scrollRef.current = el;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el || typeof el.scrollTo !== "function") return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const value = useMemo<ConversationInternalContextValue>(
    () => ({
      isAtBottom,
      setIsAtBottom,
      scrollToBottom,
      registerScrollElement,
    }),
    [isAtBottom, scrollToBottom, registerScrollElement],
  );

  return (
    <ConversationContext.Provider value={value}>
      <div
        ref={ref}
        data-slot="conversation"
        className={cn("relative min-h-0 flex-1 overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    </ConversationContext.Provider>
  );
}
Conversation.displayName = "Conversation";

export type ConversationContentProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
};

export function ConversationContent({
  className,
  ref,
  children,
  onScroll,
  ...props
}: ConversationContentProps) {
  const { isAtBottom, setIsAtBottom, registerScrollElement } =
    useConversationContext("ConversationContent");
  const localRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(isAtBottom);
  isAtBottomRef.current = isAtBottom;

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      registerScrollElement(node);
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref, registerScrollElement],
  );

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      setIsAtBottom(distance <= BOTTOM_THRESHOLD_PX);
      onScroll?.(event);
    },
    [onScroll, setIsAtBottom],
  );

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const stickIfNeeded = () => {
      if (!isAtBottomRef.current || typeof el.scrollTo !== "function") return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    };

    const mutationObserver = new MutationObserver(stickIfNeeded);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(stickIfNeeded);
      resizeObserver.observe(el);
      for (const child of el.children) {
        resizeObserver.observe(child);
      }
    }

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div
      ref={setRefs}
      data-slot="conversation-content"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className={cn("flex flex-col gap-4 overflow-y-auto p-4", className)}
      onScroll={handleScroll}
      {...props}
    >
      {children}
    </div>
  );
}
ConversationContent.displayName = "ConversationContent";

export type ConversationEmptyStateLabels = {
  title: string;
  description: string;
};

const DEFAULT_EMPTY_LABELS: ConversationEmptyStateLabels = {
  title: "No messages yet",
  description: "Start a conversation to see messages here",
};

export type ConversationEmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  title?: string;
  description?: string;
  icon?: ReactNode;
  labels?: Partial<ConversationEmptyStateLabels>;
};

export function ConversationEmptyState({
  className,
  ref,
  title,
  description,
  icon,
  labels: labelsProp,
  children,
  ...props
}: ConversationEmptyStateProps) {
  const labels = { ...DEFAULT_EMPTY_LABELS, ...labelsProp };
  const resolvedTitle = title ?? labels.title;
  const resolvedDescription = description ?? labels.description;

  return (
    <div
      ref={ref}
      data-slot="conversation-empty-state"
      className={cn(
        "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {icon ? <div className="text-fg-tertiary">{icon}</div> : null}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-fg">{resolvedTitle}</h3>
            {resolvedDescription ? (
              <p className="text-sm text-fg-tertiary">{resolvedDescription}</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
ConversationEmptyState.displayName = "ConversationEmptyState";

export type ConversationScrollButtonLabels = {
  scrollToBottom: string;
};

const DEFAULT_SCROLL_LABELS: ConversationScrollButtonLabels = {
  scrollToBottom: "Scroll to bottom",
};

export type ConversationScrollButtonProps = ButtonProps & {
  labels?: Partial<ConversationScrollButtonLabels>;
};

export function ConversationScrollButton({
  className,
  labels: labelsProp,
  onClick,
  ...props
}: ConversationScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useConversationContext("ConversationScrollButton");
  const labels = { ...DEFAULT_SCROLL_LABELS, ...labelsProp };

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      scrollToBottom("smooth");
    },
    [onClick, scrollToBottom],
  );

  if (isAtBottom) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      data-slot="conversation-scroll-button"
      aria-label={labels.scrollToBottom}
      className={cn(
        // inset-inline-start + opposing translate centers in both directions
        "absolute inset-inline-start-1/2 bottom-4 -translate-x-1/2 rounded-full rtl:translate-x-1/2",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <ArrowDownIcon className="size-4" />
    </Button>
  );
}
ConversationScrollButton.displayName = "ConversationScrollButton";
