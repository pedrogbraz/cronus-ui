"use client";

import { UploadCloud } from "lucide-react";
import { type DragEvent, forwardRef, type ReactNode, useState } from "react";
import { cn } from "../lib/cn.js";

export interface FileDropzoneLabels {
  upload: string;
  drop: string;
  browse: string;
}

const DEFAULT_LABELS: FileDropzoneLabels = {
  upload: "Upload files",
  drop: "Drag & drop or",
  browse: "browse",
};

export interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  /**
   * Accessible name for the file input. Defaults to `"Upload files"` so the
   * control is never nameless.
   */
  "aria-label"?: string;
  /** IDs of element(s) that describe the dropzone (e.g. accepted types). */
  "aria-describedby"?: string;
  /** Override the default English strings. */
  labels?: Partial<FileDropzoneLabels>;
}

/**
 * A drag-and-drop file picker.
 *
 * The whole surface is a `<label>` that wraps a single visually-hidden
 * `<input type="file">` — the only interactive, labelable control. That keeps
 * the widget natively accessible: clicking anywhere opens the picker, the input
 * is keyboard-focusable and Enter/Space open the picker for free, and there is
 * no nested-interactive (no `role="button"` around the input). Drag-and-drop is
 * layered on the label; drops are forwarded to `onFiles` just like picks.
 */
export const FileDropzone = forwardRef<HTMLLabelElement, FileDropzoneProps>(
  (
    {
      onFiles,
      accept,
      multiple = false,
      disabled = false,
      className,
      children,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      labels: labelsProp,
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const inputLabel = ariaLabel ?? labels.upload;
    const [dragging, setDragging] = useState(false);

    const emit = (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      onFiles(Array.from(fileList));
    };

    const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setDragging(true);
    };

    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;
      setDragging(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDragging(false);
      if (disabled) return;
      emit(event.dataTransfer.files);
    };

    return (
      <label
        ref={ref}
        data-slot="file-dropzone"
        aria-disabled={disabled || undefined}
        data-dragging={dragging}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-inset px-6 py-10 text-center text-sm text-fg-secondary transition-colors hover:border-border-strong data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/5",
          // Move the focus ring onto the label when the hidden input is
          // keyboard-focused, so the whole surface shows focus.
          "outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-surface-base",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label={inputLabel}
          aria-describedby={ariaDescribedBy}
          className="sr-only"
          onChange={(event) => {
            emit(event.target.files);
            event.target.value = "";
          }}
        />
        {children ?? (
          <>
            <UploadCloud className="size-6 text-fg-muted" aria-hidden />
            <span>
              {labels.drop} <span className="font-medium text-fg">{labels.browse}</span>
            </span>
          </>
        )}
      </label>
    );
  },
);
FileDropzone.displayName = "FileDropzone";
