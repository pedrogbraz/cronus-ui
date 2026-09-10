"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Badge } from "./badge.js";
import { Button, type ButtonProps } from "./button.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";
import { Input, type InputProps } from "./input.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export type WebPreviewLabels = {
  urlPlaceholder: string;
  preview: string;
  console: string;
  consoleEmpty: string;
};

const DEFAULT_LABELS: WebPreviewLabels = {
  urlPlaceholder: "Enter URL...",
  preview: "Preview",
  console: "Console",
  consoleEmpty: "No console output",
};

export type WebPreviewContextValue = {
  url: string;
  setUrl: (url: string) => void;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
  labels: WebPreviewLabels;
};

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null);

function useWebPreview(): WebPreviewContextValue {
  const context = useContext(WebPreviewContext);
  if (!context) {
    throw new Error("WebPreview components must be used within a WebPreview");
  }
  return context;
}

export type WebPreviewProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
  labels?: Partial<WebPreviewLabels>;
};

export function WebPreview({
  className,
  ref,
  children,
  defaultUrl = "",
  onUrlChange,
  labels: labelsProp,
  ...props
}: WebPreviewProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

  const handleUrlChange = useCallback(
    (newUrl: string) => {
      setUrl(newUrl);
      onUrlChange?.(newUrl);
    },
    [onUrlChange],
  );

  const value = useMemo<WebPreviewContextValue>(
    () => ({
      url,
      setUrl: handleUrlChange,
      consoleOpen,
      setConsoleOpen,
      labels,
    }),
    [url, handleUrlChange, consoleOpen, labels],
  );

  return (
    <WebPreviewContext.Provider value={value}>
      <div
        ref={ref}
        data-slot="web-preview"
        className={cn(
          "flex size-full flex-col rounded-lg border border-border bg-surface-raised",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  );
}
WebPreview.displayName = "WebPreview";

export type WebPreviewNavigationProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
};

export function WebPreviewNavigation({
  className,
  ref,
  children,
  ...props
}: WebPreviewNavigationProps) {
  return (
    <div
      ref={ref}
      data-slot="web-preview-navigation"
      className={cn("flex items-center gap-1 border-b border-border p-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}
WebPreviewNavigation.displayName = "WebPreviewNavigation";

export type WebPreviewNavigationButtonProps = ButtonProps & {
  tooltip?: string;
};

export function WebPreviewNavigationButton({
  onClick,
  disabled,
  tooltip,
  children,
  className,
  ...props
}: WebPreviewNavigationButtonProps) {
  const button = (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      data-slot="web-preview-navigation-button"
      aria-label={tooltip}
      className={cn("size-8 p-0 hover:text-fg", className)}
      {...props}
    >
      {children}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
WebPreviewNavigationButton.displayName = "WebPreviewNavigationButton";

export type WebPreviewUrlProps = InputProps;

export function WebPreviewUrl({
  value,
  onChange,
  onKeyDown,
  placeholder,
  ...props
}: WebPreviewUrlProps) {
  const { url, setUrl, labels } = useWebPreview();
  const [inputValue, setInputValue] = useState(url);

  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleChange: InputProps["onChange"] = (event) => {
    setInputValue(event.target.value);
    onChange?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement;
      setUrl(target.value);
    }
    onKeyDown?.(event);
  };

  return (
    <Input
      data-slot="web-preview-url"
      className="h-8 flex-1 text-sm"
      onChange={onChange ?? handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder ?? labels.urlPlaceholder}
      aria-label={placeholder ?? labels.urlPlaceholder}
      type="url"
      value={value ?? inputValue}
      {...props}
    />
  );
}
WebPreviewUrl.displayName = "WebPreviewUrl";

export type WebPreviewBodyProps = ComponentProps<"iframe"> & {
  ref?: Ref<HTMLIFrameElement>;
  loading?: ReactNode;
};

export function WebPreviewBody({
  className,
  ref,
  loading,
  src,
  title,
  ...props
}: WebPreviewBodyProps) {
  const { url, labels } = useWebPreview();

  return (
    <div data-slot="web-preview-body" className="relative min-h-0 flex-1">
      <iframe
        ref={ref}
        className={cn("size-full", className)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        src={(src ?? url) || undefined}
        title={title ?? labels.preview}
        {...props}
      />
      {loading}
    </div>
  );
}
WebPreviewBody.displayName = "WebPreviewBody";

export type WebPreviewConsoleLog = {
  level: "log" | "warn" | "error";
  message: string;
  timestamp: Date;
};

export type WebPreviewConsoleProps = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  logs?: WebPreviewConsoleLog[];
};

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});

function logBadgeVariant(level: WebPreviewConsoleLog["level"]) {
  if (level === "error") return "destructive" as const;
  if (level === "warn") return "warning" as const;
  return "secondary" as const;
}

export function WebPreviewConsole({
  className,
  ref,
  logs = [],
  children,
  ...props
}: WebPreviewConsoleProps) {
  const { consoleOpen, setConsoleOpen, labels } = useWebPreview();

  return (
    <div
      ref={ref}
      data-slot="web-preview-console"
      className={cn("border-t border-border bg-surface-overlay/50 font-mono text-sm", className)}
      {...props}
    >
      <Collapsible open={consoleOpen} onOpenChange={setConsoleOpen}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex w-full items-center justify-between rounded-none p-4 text-start font-medium hover:bg-surface-overlay/50"
          >
            <span className="inline-flex items-center gap-2">
              {labels.console}
              <Badge variant="secondary">{logs.length}</Badge>
            </span>
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform duration-200",
                consoleOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="max-h-48 space-y-1 overflow-y-auto px-4 pb-4">
            {logs.length === 0 ? (
              <p className="text-fg-tertiary">{labels.consoleEmpty}</p>
            ) : (
              logs.map((log) => (
                <div
                  className={cn(
                    "flex items-start gap-2 text-xs",
                    log.level === "error" && "text-error-strong",
                    log.level === "warn" && "text-warning-strong",
                    log.level === "log" && "text-fg",
                  )}
                  key={`${log.timestamp.getTime()}-${log.level}-${log.message}`}
                >
                  <Badge variant={logBadgeVariant(log.level)} className="shrink-0">
                    {log.level}
                  </Badge>
                  <span className="text-fg-tertiary">{timeFormatter.format(log.timestamp)}</span>
                  <span className="min-w-0 break-words">{log.message}</span>
                </div>
              ))
            )}
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
WebPreviewConsole.displayName = "WebPreviewConsole";
