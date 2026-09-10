"use client";

import { ImageIcon, Loader2, Mic, Paperclip, Plus, Send, Square, X } from "lucide-react";
import {
  type ChangeEvent,
  type ChangeEventHandler,
  Children,
  type ClipboardEventHandler,
  type ComponentProps,
  createContext,
  type FormEvent,
  type FormEventHandler,
  Fragment,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";
import { Textarea } from "./textarea.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

export type FileUIPart = {
  type: "file";
  url: string;
  mediaType: string;
  filename?: string;
};

export type PromptInputLabels = {
  upload?: string;
  removeAttachment?: string;
  unknownFile?: string;
  addAttachments?: string;
  submit?: string;
  stop?: string;
  placeholder?: string;
  speech?: string;
  speechStop?: string;
  errorAccept?: string;
  errorMaxFileSize?: string;
  errorMaxFiles?: string;
};

const DEFAULT_LABELS: Required<PromptInputLabels> = {
  upload: "Upload files",
  removeAttachment: "Remove attachment",
  unknownFile: "Unknown file",
  addAttachments: "Add photos or files",
  submit: "Submit",
  stop: "Stop",
  placeholder: "What would you like to know?",
  speech: "Voice input",
  speechStop: "Stop recording",
  errorAccept: "No files match the accepted types.",
  errorMaxFileSize: "All files exceed the maximum size.",
  errorMaxFiles: "Too many files. Some were not added.",
};

function fileMatchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token === "*/*") return true;
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    if (token.startsWith(".")) return name.endsWith(token);
    return type === token;
  });
}

function newId() {
  return crypto.randomUUID();
}

// ============================================================================
// Provider Context & Types
// ============================================================================

export type AttachmentsContext = {
  files: (FileUIPart & { id: string })[];
  add: (files: File[] | FileList) => void;
  remove: (id: string) => void;
  clear: () => void;
  openFileDialog: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
};

export type TextInputContext = {
  value: string;
  setInput: (v: string) => void;
  clear: () => void;
};

export type PromptInputControllerProps = {
  textInput: TextInputContext;
  attachments: AttachmentsContext;
  /** INTERNAL: Allows PromptInput to register its file input + "open" callback */
  __registerFileInput: (ref: RefObject<HTMLInputElement | null>, open: () => void) => void;
};

const PromptInputController = createContext<PromptInputControllerProps | null>(null);
const ProviderAttachmentsContext = createContext<AttachmentsContext | null>(null);

export const usePromptInputController = () => {
  const ctx = useContext(PromptInputController);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use usePromptInputController().",
    );
  }
  return ctx;
};

const useOptionalPromptInputController = () => useContext(PromptInputController);

export const useProviderAttachments = () => {
  const ctx = useContext(ProviderAttachmentsContext);
  if (!ctx) {
    throw new Error(
      "Wrap your component inside <PromptInputProvider> to use useProviderAttachments().",
    );
  }
  return ctx;
};

const useOptionalProviderAttachments = () => useContext(ProviderAttachmentsContext);

export type PromptInputProviderProps = PropsWithChildren<{
  initialInput?: string;
}>;

/**
 * Optional global provider that lifts PromptInput state outside of PromptInput.
 * If you don't use it, PromptInput stays fully self-managed.
 */
export function PromptInputProvider({
  initialInput: initialTextInput = "",
  children,
}: PromptInputProviderProps) {
  const [textInput, setTextInput] = useState(initialTextInput);
  const clearInput = useCallback(() => setTextInput(""), []);

  const [attachmentsState, setAttachmentsState] = useState<(FileUIPart & { id: string })[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openRef = useRef<() => void>(() => {});

  const add = useCallback((files: File[] | FileList) => {
    const incoming = Array.from(files);
    if (incoming.length === 0) return;

    setAttachmentsState((prev) =>
      prev.concat(
        incoming.map((file) => ({
          id: newId(),
          type: "file" as const,
          url: URL.createObjectURL(file),
          mediaType: file.type,
          filename: file.name,
        })),
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setAttachmentsState((prev) => {
      const found = prev.find((f) => f.id === id);
      if (found?.url) URL.revokeObjectURL(found.url);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setAttachmentsState((prev) => {
      for (const f of prev) if (f.url) URL.revokeObjectURL(f.url);
      return [];
    });
  }, []);

  const openFileDialog = useCallback(() => {
    openRef.current?.();
  }, []);

  const attachments = useMemo<AttachmentsContext>(
    () => ({
      files: attachmentsState,
      add,
      remove,
      clear,
      openFileDialog,
      fileInputRef,
    }),
    [attachmentsState, add, remove, clear, openFileDialog],
  );

  const __registerFileInput = useCallback(
    (ref: RefObject<HTMLInputElement | null>, open: () => void) => {
      fileInputRef.current = ref.current;
      openRef.current = open;
    },
    [],
  );

  const controller = useMemo<PromptInputControllerProps>(
    () => ({
      textInput: {
        value: textInput,
        setInput: setTextInput,
        clear: clearInput,
      },
      attachments,
      __registerFileInput,
    }),
    [textInput, clearInput, attachments, __registerFileInput],
  );

  return (
    <PromptInputController.Provider value={controller}>
      <ProviderAttachmentsContext.Provider value={attachments}>
        {children}
      </ProviderAttachmentsContext.Provider>
    </PromptInputController.Provider>
  );
}

// ============================================================================
// Component Context & Hooks
// ============================================================================

const LocalAttachmentsContext = createContext<AttachmentsContext | null>(null);
const PromptInputLabelsContext = createContext<Required<PromptInputLabels>>(DEFAULT_LABELS);

export const usePromptInputAttachments = () => {
  const provider = useOptionalProviderAttachments();
  const local = useContext(LocalAttachmentsContext);
  const context = provider ?? local;
  if (!context) {
    throw new Error(
      "usePromptInputAttachments must be used within a PromptInput or PromptInputProvider",
    );
  }
  return context;
};

export type PromptInputAttachmentProps = HTMLAttributes<HTMLDivElement> & {
  data: FileUIPart & { id: string };
  className?: string;
};

export function PromptInputAttachment({ data, className, ...props }: PromptInputAttachmentProps) {
  const attachments = usePromptInputAttachments();
  const labels = useContext(PromptInputLabelsContext);

  const mediaType = data.mediaType?.startsWith("image/") && data.url ? "image" : "file";

  return (
    <div
      data-slot="prompt-input-attachment"
      className={cn(
        "group relative rounded-md border border-border",
        className,
        mediaType === "image" ? "h-14 w-14" : "h-8 w-auto max-w-full",
      )}
      key={data.id}
      {...props}
    >
      {mediaType === "image" ? (
        <img
          alt={data.filename || labels.unknownFile}
          className="size-full rounded-md object-cover"
          height={56}
          src={data.url}
          width={56}
        />
      ) : (
        <div className="flex size-full max-w-full cursor-pointer items-center justify-start gap-2 overflow-hidden px-2 text-fg-tertiary">
          <Paperclip className="size-4 shrink-0" />
          <Tooltip>
            <TooltipTrigger asChild>
              <h4 className="w-full min-w-0 flex-1 truncate text-start text-sm font-medium text-fg">
                {data.filename || labels.unknownFile}
              </h4>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px] text-xs">
              <p className="break-words font-medium text-sm">
                {data.filename || labels.unknownFile}
              </p>
              {data.mediaType ? <p className="text-fg-tertiary">{data.mediaType}</p> : null}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <Button
        aria-label={labels.removeAttachment}
        className="absolute -end-1.5 -top-1.5 size-6 rounded-full opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        onClick={() => attachments.remove(data.id)}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}

export type PromptInputAttachmentsProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: (attachment: FileUIPart & { id: string }) => ReactNode;
};

export function PromptInputAttachments({
  className,
  children,
  ...props
}: PromptInputAttachmentsProps) {
  const attachments = usePromptInputAttachments();
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setHeight(el.getBoundingClientRect().height);
    });
    ro.observe(el);
    setHeight(el.getBoundingClientRect().height);
    return () => ro.disconnect();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: remeasure when attachment count changes
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setHeight(el.getBoundingClientRect().height);
  }, [attachments.files.length]);

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="prompt-input-attachments"
      aria-live="polite"
      className={cn(
        "order-first overflow-hidden px-3 pt-2 transition-[height] duration-200 ease-[var(--ease-out-quart)]",
        className,
      )}
      style={{ height: attachments.files.length ? height : 0 }}
      {...props}
    >
      <div className="space-y-2 py-1" ref={contentRef}>
        <div className="flex flex-wrap gap-2">
          {attachments.files
            .filter((f) => !(f.mediaType?.startsWith("image/") && f.url))
            .map((file) => (
              <Fragment key={file.id}>{children(file)}</Fragment>
            ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {attachments.files
            .filter((f) => f.mediaType?.startsWith("image/") && f.url)
            .map((file) => (
              <Fragment key={file.id}>{children(file)}</Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}

export type PromptInputActionAddAttachmentsProps = ComponentProps<typeof DropdownMenuItem> & {
  label?: string;
};

export function PromptInputActionAddAttachments({
  label,
  ...props
}: PromptInputActionAddAttachmentsProps) {
  const attachments = usePromptInputAttachments();
  const labels = useContext(PromptInputLabelsContext);

  return (
    <DropdownMenuItem
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        attachments.openFileDialog();
      }}
    >
      <ImageIcon className="size-4" /> {label ?? labels.addAttachments}
    </DropdownMenuItem>
  );
}

export type PromptInputMessage = {
  text?: string;
  files?: FileUIPart[];
};

export type PromptInputProps = Omit<HTMLAttributes<HTMLFormElement>, "onSubmit" | "onError"> & {
  ref?: Ref<HTMLFormElement>;
  accept?: string;
  multiple?: boolean;
  globalDrop?: boolean;
  syncHiddenInput?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  onError?: (err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  labels?: PromptInputLabels;
};

export function PromptInput({
  className,
  accept,
  multiple,
  globalDrop,
  syncHiddenInput,
  maxFiles,
  maxFileSize,
  onError,
  onSubmit,
  children,
  labels: labelsProp,
  ref,
  ...props
}: PromptInputProps) {
  const controller = useOptionalPromptInputController();
  const usingProvider = !!controller;
  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const setFormRef = useCallback(
    (node: HTMLFormElement | null) => {
      formRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const [items, setItems] = useState<(FileUIPart & { id: string })[]>([]);
  const files = usingProvider ? controller.attachments.files : items;

  const openFileDialogLocal = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const matchesAccept = useCallback(
    (f: File) => {
      if (!accept || accept.trim() === "") return true;
      return fileMatchesAccept(f, accept);
    },
    [accept],
  );

  const addLocal = useCallback(
    (fileList: File[] | FileList) => {
      const incoming = Array.from(fileList);
      const accepted = incoming.filter((f) => matchesAccept(f));
      if (incoming.length && accepted.length === 0) {
        onError?.({
          code: "accept",
          message: labels.errorAccept,
        });
        return;
      }
      const withinSize = (f: File) => (maxFileSize ? f.size <= maxFileSize : true);
      const sized = accepted.filter(withinSize);
      if (accepted.length > 0 && sized.length === 0) {
        onError?.({
          code: "max_file_size",
          message: labels.errorMaxFileSize,
        });
        return;
      }

      setItems((prev) => {
        const capacity =
          typeof maxFiles === "number" ? Math.max(0, maxFiles - prev.length) : undefined;
        const capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
        if (typeof capacity === "number" && sized.length > capacity) {
          onError?.({
            code: "max_files",
            message: labels.errorMaxFiles,
          });
        }
        const next: (FileUIPart & { id: string })[] = [];
        for (const file of capped) {
          next.push({
            id: newId(),
            type: "file",
            url: URL.createObjectURL(file),
            mediaType: file.type,
            filename: file.name,
          });
        }
        return prev.concat(next);
      });
    },
    [
      matchesAccept,
      maxFiles,
      maxFileSize,
      onError,
      labels.errorAccept,
      labels.errorMaxFileSize,
      labels.errorMaxFiles,
    ],
  );

  const add = usingProvider
    ? (fileList: File[] | FileList) => controller.attachments.add(fileList)
    : addLocal;

  const remove = usingProvider
    ? (id: string) => controller.attachments.remove(id)
    : (id: string) =>
        setItems((prev) => {
          const found = prev.find((file) => file.id === id);
          if (found?.url) URL.revokeObjectURL(found.url);
          return prev.filter((file) => file.id !== id);
        });

  const clear = usingProvider
    ? () => controller.attachments.clear()
    : () =>
        setItems((prev) => {
          for (const file of prev) {
            if (file.url) URL.revokeObjectURL(file.url);
          }
          return [];
        });

  const openFileDialog = usingProvider
    ? () => controller.attachments.openFileDialog()
    : openFileDialogLocal;

  useEffect(() => {
    if (!usingProvider) return;
    controller.__registerFileInput(inputRef, () => inputRef.current?.click());
  }, [usingProvider, controller]);

  useEffect(() => {
    if (syncHiddenInput && inputRef.current && files.length === 0) {
      inputRef.current.value = "";
    }
  }, [files, syncHiddenInput]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    form.addEventListener("dragover", onDragOver);
    form.addEventListener("drop", onDrop);
    return () => {
      form.removeEventListener("dragover", onDragOver);
      form.removeEventListener("drop", onDrop);
    };
  }, [add]);

  useEffect(() => {
    if (!globalDrop) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        add(e.dataTransfer.files);
      }
    };
    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    };
  }, [add, globalDrop]);

  useEffect(
    () => () => {
      if (!usingProvider) {
        for (const f of files) {
          if (f.url) URL.revokeObjectURL(f.url);
        }
      }
    },
    [usingProvider, files],
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.currentTarget.files) add(event.currentTarget.files);
  };

  const convertBlobUrlToDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const ctx = useMemo<AttachmentsContext>(
    () => ({
      files: files.map((item) => ({ ...item, id: item.id })),
      add,
      remove,
      clear,
      openFileDialog,
      fileInputRef: inputRef,
    }),
    [files, add, remove, clear, openFileDialog],
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const text = usingProvider
      ? controller.textInput.value
      : (() => {
          const formData = new FormData(form);
          return (formData.get("message") as string) || "";
        })();

    if (!usingProvider) form.reset();

    Promise.all(
      files.map(async ({ id: _id, ...item }) => {
        if (item.url?.startsWith("blob:")) {
          return {
            ...item,
            url: await convertBlobUrlToDataUrl(item.url),
          };
        }
        return item;
      }),
    ).then((convertedFiles: FileUIPart[]) => {
      try {
        const result = onSubmit({ text, files: convertedFiles }, event);
        if (result instanceof Promise) {
          result
            .then(() => {
              clear();
              if (usingProvider) controller.textInput.clear();
            })
            .catch(() => {
              // Keep attachments on error so the user can retry.
            });
        } else {
          clear();
          if (usingProvider) controller.textInput.clear();
        }
      } catch {
        // Keep attachments on error so the user can retry.
      }
    });
  };

  const inner = (
    <>
      <input
        accept={accept}
        aria-label={labels.upload}
        className="hidden"
        multiple={multiple}
        onChange={handleChange}
        ref={inputRef}
        title={labels.upload}
        type="file"
      />
      <form
        ref={setFormRef}
        data-slot="prompt-input"
        className={cn("w-full", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <div
          data-slot="prompt-input-composer"
          className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-surface-inset shadow-xs transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out-quart)] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-base"
        >
          {children}
        </div>
      </form>
    </>
  );

  return (
    <PromptInputLabelsContext.Provider value={labels}>
      {usingProvider ? (
        inner
      ) : (
        <LocalAttachmentsContext.Provider value={ctx}>{inner}</LocalAttachmentsContext.Provider>
      )}
    </PromptInputLabelsContext.Provider>
  );
}

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputBody({ className, ...props }: PromptInputBodyProps) {
  return <div data-slot="prompt-input-body" className={cn("contents", className)} {...props} />;
}

export type PromptInputTextareaProps = ComponentProps<typeof Textarea>;

export function PromptInputTextarea({
  onChange,
  className,
  placeholder,
  ...props
}: PromptInputTextareaProps) {
  const controller = useOptionalPromptInputController();
  const attachments = usePromptInputAttachments();
  const labels = useContext(PromptInputLabelsContext);
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      if (isComposing || e.nativeEvent.isComposing) return;
      if (e.shiftKey) return;
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }

    if (e.key === "Backspace" && e.currentTarget.value === "" && attachments.files.length > 0) {
      e.preventDefault();
      const lastAttachment = attachments.files.at(-1);
      if (lastAttachment) attachments.remove(lastAttachment.id);
    }
  };

  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const pastedFiles: File[] = [];
    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }

    if (pastedFiles.length > 0) {
      event.preventDefault();
      attachments.add(pastedFiles);
    }
  };

  const controlledProps = controller
    ? {
        value: controller.textInput.value,
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          controller.textInput.setInput(e.currentTarget.value);
          onChange?.(e);
        },
      }
    : { onChange };

  return (
    <Textarea
      data-slot="prompt-input-textarea"
      className={cn(
        "max-h-48 min-h-16 resize-none rounded-none border-0 bg-transparent px-3 py-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0",
        className,
      )}
      name="message"
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder ?? labels.placeholder}
      {...props}
      {...controlledProps}
    />
  );
}

export type PromptInputHeaderProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputHeader({ className, ...props }: PromptInputHeaderProps) {
  return (
    <div
      data-slot="prompt-input-header"
      className={cn("order-first flex items-center gap-1 px-3 pt-2", className)}
      {...props}
    />
  );
}

export type PromptInputFooterProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputFooter({ className, ...props }: PromptInputFooterProps) {
  return (
    <div
      data-slot="prompt-input-footer"
      className={cn("flex items-center justify-between gap-1 px-2 pb-2", className)}
      {...props}
    />
  );
}

export type PromptInputToolsProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputTools({ className, ...props }: PromptInputToolsProps) {
  return (
    <div
      data-slot="prompt-input-tools"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

export type PromptInputButtonProps = ComponentProps<typeof Button>;

export function PromptInputButton({
  variant = "ghost",
  className,
  size,
  ...props
}: PromptInputButtonProps) {
  const newSize = size ?? (Children.count(props.children) > 1 ? "sm" : "icon-sm");

  return (
    <Button
      data-slot="prompt-input-button"
      className={cn(className)}
      size={newSize}
      type="button"
      variant={variant}
      {...props}
    />
  );
}

export type PromptInputActionMenuProps = ComponentProps<typeof DropdownMenu>;
export function PromptInputActionMenu(props: PromptInputActionMenuProps) {
  return <DropdownMenu {...props} />;
}

export type PromptInputActionMenuTriggerProps = PromptInputButtonProps;

export function PromptInputActionMenuTrigger({
  className,
  children,
  ...props
}: PromptInputActionMenuTriggerProps) {
  return (
    <DropdownMenuTrigger asChild>
      <PromptInputButton className={className} {...props}>
        {children ?? <Plus className="size-4" />}
      </PromptInputButton>
    </DropdownMenuTrigger>
  );
}

export type PromptInputActionMenuContentProps = ComponentProps<typeof DropdownMenuContent>;

export function PromptInputActionMenuContent({
  className,
  ...props
}: PromptInputActionMenuContentProps) {
  return (
    <DropdownMenuContent
      data-slot="prompt-input-action-menu-content"
      align="start"
      className={cn(className)}
      {...props}
    />
  );
}

export type PromptInputActionMenuItemProps = ComponentProps<typeof DropdownMenuItem>;

export function PromptInputActionMenuItem({ className, ...props }: PromptInputActionMenuItemProps) {
  return <DropdownMenuItem className={cn(className)} {...props} />;
}

export type PromptInputSubmitProps = ComponentProps<typeof Button> & {
  status?: ChatStatus;
};

export function PromptInputSubmit({
  className,
  variant = "primary",
  size = "icon-sm",
  status,
  children,
  ...props
}: PromptInputSubmitProps) {
  const labels = useContext(PromptInputLabelsContext);
  let Icon = <Send className="size-4" />;

  if (status === "submitted") {
    Icon = <Loader2 className="size-4 animate-spin" />;
  } else if (status === "streaming") {
    Icon = <Square className="size-4" />;
  } else if (status === "error") {
    Icon = <X className="size-4" />;
  }

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <Button
      data-slot="prompt-input-submit"
      aria-label={status === "streaming" ? labels.stop : labels.submit}
      className={cn(className)}
      size={size}
      type={isBusy ? "button" : "submit"}
      variant={variant}
      {...props}
    >
      {children ?? Icon}
    </Button>
  );
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognitionLike, ev: Event) => unknown) | null;
  onend: ((this: SpeechRecognitionLike, ev: Event) => unknown) | null;
  onresult: ((this: SpeechRecognitionLike, ev: SpeechRecognitionEventLike) => unknown) | null;
  onerror: ((this: SpeechRecognitionLike, ev: SpeechRecognitionErrorEventLike) => unknown) | null;
}

interface SpeechRecognitionEventLike extends Event {
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

export type PromptInputSpeechButtonProps = ComponentProps<typeof PromptInputButton> & {
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  onTranscriptionChange?: (text: string) => void;
};

export function PromptInputSpeechButton({
  className,
  textareaRef,
  onTranscriptionChange,
  ...props
}: PromptInputSpeechButtonProps) {
  const labels = useContext(PromptInputLabelsContext);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionCtor =
      (
        window as unknown as {
          SpeechRecognition?: new () => SpeechRecognitionLike;
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const speechRecognition = new SpeechRecognitionCtor();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";

    speechRecognition.onstart = () => setIsListening(true);
    speechRecognition.onend = () => setIsListening(false);
    speechRecognition.onresult = (event) => {
      let finalTranscript = "";
      const results = Array.from(event.results);
      for (const result of results) {
        if (result.isFinal) finalTranscript += result[0].transcript;
      }
      if (finalTranscript && textareaRef?.current) {
        const textarea = textareaRef.current;
        const currentValue = textarea.value;
        const newValue = currentValue + (currentValue ? " " : "") + finalTranscript;
        textarea.value = newValue;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        onTranscriptionChange?.(newValue);
      }
    };
    speechRecognition.onerror = () => setIsListening(false);

    recognitionRef.current = speechRecognition;
    setRecognition(speechRecognition);

    return () => {
      recognitionRef.current?.stop();
    };
  }, [textareaRef, onTranscriptionChange]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;
    if (isListening) recognition.stop();
    else recognition.start();
  }, [recognition, isListening]);

  return (
    <PromptInputButton
      aria-label={isListening ? labels.speechStop : labels.speech}
      aria-pressed={isListening}
      className={cn(
        "relative transition-all duration-200",
        isListening && "animate-pulse bg-surface-overlay text-fg",
        className,
      )}
      disabled={!recognition}
      onClick={toggleListening}
      {...props}
    >
      <Mic className="size-4" />
    </PromptInputButton>
  );
}

export type PromptInputModelSelectProps = ComponentProps<typeof Select>;

export function PromptInputModelSelect({ ...props }: PromptInputModelSelectProps) {
  return <Select data-slot="prompt-input-model-select" {...props} />;
}

export type PromptInputModelSelectTriggerProps = ComponentProps<typeof SelectTrigger>;

export function PromptInputModelSelectTrigger({
  className,
  ...props
}: PromptInputModelSelectTriggerProps) {
  return (
    <SelectTrigger
      className={cn(
        "h-auto w-fit border-none bg-transparent px-2 py-1 text-xs font-medium text-fg-tertiary shadow-none hover:bg-surface-overlay hover:text-fg",
        className,
      )}
      {...props}
    />
  );
}

export type PromptInputModelSelectValueProps = ComponentProps<typeof SelectValue>;

export function PromptInputModelSelectValue(props: PromptInputModelSelectValueProps) {
  return <SelectValue {...props} />;
}

export type PromptInputModelSelectContentProps = ComponentProps<typeof SelectContent>;

export function PromptInputModelSelectContent(props: PromptInputModelSelectContentProps) {
  return <SelectContent {...props} />;
}

export type PromptInputModelSelectItemProps = ComponentProps<typeof SelectItem>;

export function PromptInputModelSelectItem({
  className,
  ...props
}: PromptInputModelSelectItemProps) {
  return <SelectItem className={cn(className)} {...props} />;
}

export type PromptInputHoverCardProps = ComponentProps<typeof HoverCard>;

export function PromptInputHoverCard({
  openDelay = 0,
  closeDelay = 0,
  ...props
}: PromptInputHoverCardProps) {
  return <HoverCard openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}

export type PromptInputHoverCardTriggerProps = ComponentProps<typeof HoverCardTrigger>;

export function PromptInputHoverCardTrigger(props: PromptInputHoverCardTriggerProps) {
  return <HoverCardTrigger {...props} />;
}

export type PromptInputHoverCardContentProps = ComponentProps<typeof HoverCardContent>;

export function PromptInputHoverCardContent({
  align = "start",
  ...props
}: PromptInputHoverCardContentProps) {
  return <HoverCardContent align={align} {...props} />;
}

export type PromptInputTabsListProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputTabsList({ className, ...props }: PromptInputTabsListProps) {
  return <div data-slot="prompt-input-tabs-list" className={cn(className)} {...props} />;
}

export type PromptInputTabProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputTab({ className, ...props }: PromptInputTabProps) {
  return <div data-slot="prompt-input-tab" className={cn(className)} {...props} />;
}

export type PromptInputTabLabelProps = HTMLAttributes<HTMLHeadingElement>;

export function PromptInputTabLabel({ className, ...props }: PromptInputTabLabelProps) {
  return (
    <h3
      data-slot="prompt-input-tab-label"
      className={cn("mb-2 px-3 text-xs font-medium text-fg-tertiary", className)}
      {...props}
    />
  );
}

export type PromptInputTabBodyProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputTabBody({ className, ...props }: PromptInputTabBodyProps) {
  return (
    <div data-slot="prompt-input-tab-body" className={cn("space-y-1", className)} {...props} />
  );
}

export type PromptInputTabItemProps = HTMLAttributes<HTMLDivElement>;

export function PromptInputTabItem({ className, ...props }: PromptInputTabItemProps) {
  return (
    <div
      data-slot="prompt-input-tab-item"
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-xs hover:bg-surface-overlay",
        className,
      )}
      {...props}
    />
  );
}

export type PromptInputCommandProps = ComponentProps<typeof Command>;

export function PromptInputCommand({ className, ...props }: PromptInputCommandProps) {
  return <Command className={cn(className)} {...props} />;
}

export type PromptInputCommandInputProps = ComponentProps<typeof CommandInput>;

export function PromptInputCommandInput({ className, ...props }: PromptInputCommandInputProps) {
  return <CommandInput className={cn(className)} {...props} />;
}

export type PromptInputCommandListProps = ComponentProps<typeof CommandList>;

export function PromptInputCommandList({ className, ...props }: PromptInputCommandListProps) {
  return <CommandList className={cn(className)} {...props} />;
}

export type PromptInputCommandEmptyProps = ComponentProps<typeof CommandEmpty>;

export function PromptInputCommandEmpty({ className, ...props }: PromptInputCommandEmptyProps) {
  return <CommandEmpty className={cn(className)} {...props} />;
}

export type PromptInputCommandGroupProps = ComponentProps<typeof CommandGroup>;

export function PromptInputCommandGroup({ className, ...props }: PromptInputCommandGroupProps) {
  return <CommandGroup className={cn(className)} {...props} />;
}

export type PromptInputCommandItemProps = ComponentProps<typeof CommandItem>;

export function PromptInputCommandItem({ className, ...props }: PromptInputCommandItemProps) {
  return <CommandItem className={cn(className)} {...props} />;
}

export type PromptInputCommandSeparatorProps = ComponentProps<typeof CommandSeparator>;

export function PromptInputCommandSeparator({
  className,
  ...props
}: PromptInputCommandSeparatorProps) {
  return <CommandSeparator className={cn(className)} {...props} />;
}
