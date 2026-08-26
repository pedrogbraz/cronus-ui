"use client";

import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { forwardRef, type ReactNode, useCallback, useEffect, useState } from "react";
import { cn } from "../lib/cn.js";
import { Separator } from "./separator.js";
import { Toggle } from "./toggle.js";

export interface RichTextEditorProps {
  /** Controlled HTML value. When provided, external changes are synced into the editor. */
  value?: string;
  /** Uncontrolled initial HTML content. Ignored once the editor has mounted. */
  defaultValue?: string;
  /** Called with the serialized HTML whenever the document changes. */
  onChange?: (html: string) => void;
  /** Placeholder shown while the document is empty. */
  placeholder?: string;
  /** Whether the content is editable. Defaults to `true`. */
  editable?: boolean;
  /** Extra classes for the editor shell (toolbar + content wrapper). */
  className?: string;
  /** Accessible label for the editable region. */
  "aria-label"?: string;
}

/** A single toolbar control: an icon button that runs an editor command. */
interface ToolbarButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolbarButton({
  label,
  icon,
  onClick,
  active = false,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <Toggle
      type="button"
      size="sm"
      className="size-8 px-0"
      aria-label={label}
      pressed={active}
      disabled={disabled}
      // Prevent the editor from losing its selection on mousedown so commands
      // act on the current range rather than a collapsed one.
      onMouseDown={(event) => event.preventDefault()}
      onPressedChange={onClick}
    >
      {icon}
    </Toggle>
  );
}

/** The formatting toolbar. Rendered disabled until the editor instance exists. */
function Toolbar({ editor }: { editor: Editor | null }) {
  // Re-render the toolbar on every editor transaction so active/disabled states
  // stay in sync with the current selection.
  const [, forceRender] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const update = () => forceRender((n) => n + 1);
    editor.on("transaction", update);
    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  const ready = editor?.isEditable ?? false;

  return (
    <div
      data-slot="rich-text-editor-toolbar"
      role="toolbar"
      aria-label="Text formatting"
      aria-controls="rich-text-editor-content"
      className="flex flex-wrap items-center gap-0.5 border-border border-b bg-surface-overlay/40 p-1.5"
    >
      <ToolbarButton
        label="Bold"
        icon={<Bold />}
        active={!!editor?.isActive("bold")}
        disabled={!ready || !editor?.can().chain().focus().toggleBold().run()}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        icon={<Italic />}
        active={!!editor?.isActive("italic")}
        disabled={!ready || !editor?.can().chain().focus().toggleItalic().run()}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Strikethrough"
        icon={<Strikethrough />}
        active={!!editor?.isActive("strike")}
        disabled={!ready || !editor?.can().chain().focus().toggleStrike().run()}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        label="Inline code"
        icon={<Code />}
        active={!!editor?.isActive("code")}
        disabled={!ready || !editor?.can().chain().focus().toggleCode().run()}
        onClick={() => editor?.chain().focus().toggleCode().run()}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        label="Heading 1"
        icon={<Heading1 />}
        active={!!editor?.isActive("heading", { level: 1 })}
        disabled={!ready}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        label="Heading 2"
        icon={<Heading2 />}
        active={!!editor?.isActive("heading", { level: 2 })}
        disabled={!ready}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="Heading 3"
        icon={<Heading3 />}
        active={!!editor?.isActive("heading", { level: 3 })}
        disabled={!ready}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        label="Bullet list"
        icon={<List />}
        active={!!editor?.isActive("bulletList")}
        disabled={!ready}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Ordered list"
        icon={<ListOrdered />}
        active={!!editor?.isActive("orderedList")}
        disabled={!ready}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="Blockquote"
        icon={<Quote />}
        active={!!editor?.isActive("blockquote")}
        disabled={!ready}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="Code block"
        icon={<SquareCode />}
        active={!!editor?.isActive("codeBlock")}
        disabled={!ready}
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
      />
      <ToolbarButton
        label="Horizontal rule"
        icon={<Minus />}
        disabled={!ready}
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      />

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        label="Undo"
        icon={<Undo2 />}
        disabled={!ready || !editor?.can().undo()}
        onClick={() => editor?.chain().focus().undo().run()}
      />
      <ToolbarButton
        label="Redo"
        icon={<Redo2 />}
        disabled={!ready || !editor?.can().redo()}
        onClick={() => editor?.chain().focus().redo().run()}
      />
    </div>
  );
}

/**
 * A Tiptap-based WYSIWYG editor with a Cronus-styled formatting toolbar.
 *
 * SSR: `immediatelyRender: false` keeps Tiptap from rendering on the server, so
 * Next.js (and other SSR setups) hydrate without a mismatch. Until the editor
 * mounts on the client, the toolbar renders disabled.
 *
 * Placeholder: implemented with a token-styled overlay driven by the editor's
 * empty state (no extra Tiptap extension, no new dependency).
 */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder,
      editable = true,
      className,
      "aria-label": ariaLabel,
    },
    ref,
  ) => {
    const handleUpdate = useCallback(
      ({ editor }: { editor: Editor }) => {
        onChange?.(editor.getHTML());
      },
      [onChange],
    );

    const editor = useEditor({
      // Critical for SSR: do not render the editor on the server.
      immediatelyRender: false,
      extensions: [StarterKit],
      content: value ?? defaultValue ?? "",
      editable,
      onUpdate: handleUpdate,
      editorProps: {
        attributes: {
          id: "rich-text-editor-content",
          role: "textbox",
          "aria-multiline": "true",
          ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
          class: cn(
            "min-h-40 w-full px-4 py-3 text-fg outline-none",
            "[&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:font-display [&_h1]:font-semibold [&_h1]:text-2xl",
            "[&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-xl",
            "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-lg",
            "[&_p]:my-2 [&_p:first-child]:mt-0",
            "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6",
            "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
            "[&_li]:my-0.5",
            "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
            "[&_blockquote]:my-3 [&_blockquote]:border-border [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:text-fg-secondary [&_blockquote]:italic",
            "[&_code]:rounded [&_code]:bg-surface-overlay [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
            "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-surface-overlay [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm",
            "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
            "[&_hr]:my-4 [&_hr]:border-border",
          ),
        },
      },
    });

    // Sync external (controlled) value changes into the editor without firing
    // onChange back out (emitUpdate: false avoids an update→onChange loop).
    useEffect(() => {
      if (!editor || value === undefined) return;
      if (value !== editor.getHTML()) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }, [editor, value]);

    // Keep the editable flag in sync if it changes after mount.
    useEffect(() => {
      if (editor && editor.isEditable !== editable) {
        editor.setEditable(editable);
      }
    }, [editor, editable]);

    const showPlaceholder = Boolean(placeholder) && (editor?.isEmpty ?? false);

    return (
      <div
        ref={ref}
        data-slot="rich-text-editor"
        className={cn(
          "flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface-base text-fg",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-base",
          className,
        )}
      >
        <Toolbar editor={editor} />
        <div data-slot="rich-text-editor-content-wrapper" className="relative">
          {showPlaceholder ? (
            <p
              aria-hidden="true"
              data-slot="rich-text-editor-placeholder"
              className="pointer-events-none absolute top-3 left-4 select-none text-fg-muted"
            >
              {placeholder}
            </p>
          ) : null}
          <EditorContent editor={editor} />
        </div>
      </div>
    );
  },
);
RichTextEditor.displayName = "RichTextEditor";
