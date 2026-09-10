"use client";

import { Check, Copy } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useContext,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";

/** Language id — kept as a string alias (no shiki dependency). */
export type BundledLanguage = string;

type AiCodeBlockData = {
  language: string;
  filename: string;
  code: string;
};

type AiCodeBlockContextType = {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  data: AiCodeBlockData[];
  labels: Required<AiCodeBlockLabels>;
};

export type AiCodeBlockLabels = {
  copy?: string;
  copied?: string;
  selectFile?: string;
};

const DEFAULT_LABELS: Required<AiCodeBlockLabels> = {
  copy: "Copy",
  copied: "Copied",
  selectFile: "Select file",
};

const AiCodeBlockContext = createContext<AiCodeBlockContextType>({
  value: undefined,
  onValueChange: undefined,
  data: [],
  labels: DEFAULT_LABELS,
});

export type AiCodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  data: AiCodeBlockData[];
  labels?: AiCodeBlockLabels;
};

export function AiCodeBlock({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue,
  className,
  data,
  labels: labelsProp,
  ref,
  ...props
}: AiCodeBlockProps & { ref?: Ref<HTMLDivElement> }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? data[0]?.filename ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const onValueChange = (next: string) => {
    if (!isControlled) setUncontrolled(next);
    controlledOnValueChange?.(next);
  };
  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  return (
    <AiCodeBlockContext.Provider value={{ value, onValueChange, data, labels }}>
      <div
        ref={ref}
        data-slot="ai-code-block"
        className={cn(
          "grid size-full grid-rows-[auto_1fr] overflow-hidden rounded-md border border-border",
          className,
        )}
        {...props}
      />
    </AiCodeBlockContext.Provider>
  );
}

export type AiCodeBlockHeaderProps = HTMLAttributes<HTMLDivElement>;

export function AiCodeBlockHeader({
  className,
  ref,
  ...props
}: AiCodeBlockHeaderProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="ai-code-block-header"
      className={cn(
        "flex flex-row items-center border-b border-border bg-surface-overlay p-1",
        className,
      )}
      {...props}
    />
  );
}

type AiCodeBlockChildren = ReactNode | ((item: AiCodeBlockData) => ReactNode);

function renderCodeBlockItems(data: AiCodeBlockData[], children: AiCodeBlockChildren) {
  return typeof children === "function" ? data.map(children) : children;
}

export type AiCodeBlockFilesProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: AiCodeBlockChildren;
};

export function AiCodeBlockFiles({ className, children, ...props }: AiCodeBlockFilesProps) {
  const { data } = useContext(AiCodeBlockContext);
  return (
    <div
      data-slot="ai-code-block-files"
      className={cn("flex grow flex-row items-center gap-2", className)}
      {...props}
    >
      {renderCodeBlockItems(data, children)}
    </div>
  );
}

export type AiCodeBlockFilenameProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
};

export function AiCodeBlockFilename({
  className,
  value,
  children,
  ...props
}: AiCodeBlockFilenameProps) {
  const { value: activeValue } = useContext(AiCodeBlockContext);
  if (value !== activeValue) return null;

  return (
    <div
      data-slot="ai-code-block-filename"
      className={cn(
        "flex flex-grow items-center gap-2 bg-surface-overlay px-4 py-1.5 text-xs text-fg-tertiary",
        className,
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
    </div>
  );
}

export type AiCodeBlockSelectProps = ComponentProps<typeof Select> & {
  children: AiCodeBlockChildren;
  className?: string;
};

export function AiCodeBlockSelect({ children, className, ...props }: AiCodeBlockSelectProps) {
  const { value, onValueChange, data, labels } = useContext(AiCodeBlockContext);

  return (
    <Select value={value} onValueChange={onValueChange} {...props}>
      <SelectTrigger
        data-slot="ai-code-block-select"
        aria-label={labels.selectFile}
        className={cn(
          "h-auto w-fit border-none bg-transparent px-2 py-1 text-xs text-fg-tertiary shadow-none",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{renderCodeBlockItems(data, children)}</SelectContent>
    </Select>
  );
}

export type AiCodeBlockSelectItemProps = ComponentProps<typeof SelectItem>;

export function AiCodeBlockSelectItem({ className, ...props }: AiCodeBlockSelectItemProps) {
  return <SelectItem className={cn("text-xs", className)} {...props} />;
}

export type AiCodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
  /** Explicit payload. Defaults to the active file in `AiCodeBlock` data. */
  code?: string;
};

export function AiCodeBlockCopyButton({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  code: codeProp,
  ...props
}: AiCodeBlockCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { data, value, labels } = useContext(AiCodeBlockContext);
  const code = codeProp ?? data.find((item) => item.filename === value)?.code;

  const copyToClipboard = () => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText || !code) {
      return;
    }
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    }, onError);
  };

  const Icon = isCopied ? Check : Copy;

  return (
    <Button
      data-slot="ai-code-block-copy-button"
      aria-label={isCopied ? labels.copied : labels.copy}
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon className="size-3.5 text-fg-tertiary" />}
    </Button>
  );
}

export type AiCodeBlockBodyProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: AiCodeBlockChildren;
};

export function AiCodeBlockBody({ children, className, ...props }: AiCodeBlockBodyProps) {
  const { data } = useContext(AiCodeBlockContext);
  return (
    <div
      data-slot="ai-code-block-body"
      className={cn("overflow-auto bg-surface-base", className)}
      {...props}
    >
      {renderCodeBlockItems(data, children)}
    </div>
  );
}

export type AiCodeBlockItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  lineNumbers?: boolean;
};

export function AiCodeBlockItem({
  children,
  lineNumbers = false,
  className,
  value,
  ...props
}: AiCodeBlockItemProps) {
  const { value: activeValue } = useContext(AiCodeBlockContext);
  if (value !== activeValue) return null;

  return (
    <div
      data-slot="ai-code-block-item"
      data-line-numbers={lineNumbers || undefined}
      className={cn("mt-0 text-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type AiCodeBlockContentProps = HTMLAttributes<HTMLPreElement> & {
  language?: BundledLanguage;
  children: string;
};

export function AiCodeBlockContent({
  children,
  language,
  className,
  ref,
  ...props
}: AiCodeBlockContentProps & { ref?: Ref<HTMLPreElement> }) {
  return (
    <pre
      ref={ref}
      data-slot="ai-code-block-content"
      data-language={language}
      className={cn("overflow-auto p-4 font-mono text-sm text-fg", className)}
      {...props}
    >
      <code>{children}</code>
    </pre>
  );
}
