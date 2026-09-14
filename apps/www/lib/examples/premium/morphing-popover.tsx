"use client";

import {
  Button,
  MorphingPopover,
  MorphingPopoverBody,
  MorphingPopoverButton,
  MorphingPopoverClose,
  MorphingPopoverContent,
  MorphingPopoverFooter,
  MorphingPopoverTrigger,
} from "@cronus-ui/ui";
import {
  ArrowRight,
  Copy,
  MessageSquarePlus,
  Pencil,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useId, useState } from "react";
import { ExampleList } from "../../../components/docs/example-list";
import type { Example } from "../types";

/**
 * Feedback popover: the trigger morphs into a small dialog with an accessible
 * textarea (labelled via a visually-bound `<label>`) and a footer that pairs a
 * Close with a submit. Submit is local-only — it flips to a thank-you state and
 * auto-closes, demonstrating controlled open state without leaving the demo
 * frame.
 */
function MorphingPopoverFeedbackDemo() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const fieldId = useId();

  return (
    <MorphingPopover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setSent(false);
      }}
      reducedMotion="never"
      className="flex min-h-[15rem] w-full items-start justify-center pt-8"
    >
      <MorphingPopoverTrigger>
        <MessageSquarePlus aria-hidden="true" className="size-4" />
        Feedback
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Send feedback" className="w-[22rem]">
        {sent ? (
          <MorphingPopoverBody className="items-center gap-1 py-10 text-center">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <p className="text-sm font-medium text-fg">Thanks for the note!</p>
            <p className="text-xs text-fg-tertiary">We read every message.</p>
          </MorphingPopoverBody>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setNote("");
              window.setTimeout(() => setOpen(false), 1200);
            }}
          >
            <label htmlFor={fieldId} className="sr-only">
              Your feedback
            </label>
            <textarea
              id={fieldId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Add feedback"
              className="block w-full resize-none bg-transparent px-4 pt-4 text-sm text-fg outline-none placeholder:text-fg-tertiary"
            />
            <MorphingPopoverFooter className="justify-between border-t-0 px-3 pb-3 pt-1">
              <MorphingPopoverClose />
              <Button type="submit" size="sm" variant="outline" disabled={note.trim().length === 0}>
                Submit
              </Button>
            </MorphingPopoverFooter>
          </form>
        )}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

/**
 * Quick-actions menu: the trigger morphs into a compact menu of
 * {@link MorphingPopoverButton} rows with leading lucide icons. Each row closes
 * the surface on activation via the local `setOpen`.
 */
function MorphingPopoverQuickActionsDemo() {
  const [open, setOpen] = useState(false);
  const actions = [
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "duplicate", label: "Duplicate", icon: Copy },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <MorphingPopover
      open={open}
      onOpenChange={setOpen}
      reducedMotion="never"
      className="flex min-h-[15rem] w-full items-start justify-center pt-8"
    >
      <MorphingPopoverTrigger>
        Actions
        <ArrowRight aria-hidden="true" className="size-4" />
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Quick actions" className="w-56">
        <MorphingPopoverBody className="gap-0.5 p-1.5">
          {actions.map(({ id, label, icon: Icon }) => (
            <MorphingPopoverButton key={id} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" />
              {label}
            </MorphingPopoverButton>
          ))}
          <div className="my-1 h-px bg-border" />
          <MorphingPopoverButton
            onClick={() => setOpen(false)}
            className="text-fg-secondary hover:text-fg"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </MorphingPopoverButton>
        </MorphingPopoverBody>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

export const examples: Example[] = [
  {
    id: "feedback",
    title: "Feedback",
    description:
      "The trigger physically morphs into a small non-modal dialog instead of fading in beside it. Inside: an accessible, labelled textarea and a footer that pairs Close with a submit. Focus moves into the surface on open and returns to the trigger on close; Escape and outside-click both dismiss. Submit is local-only — it flips to a thank-you state and auto-closes. Honours reduced-motion.",
    install: {
      registryItem: "morphing-popover",
      dependencies: ["motion"],
    },
    code: `function FeedbackPopover() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const fieldId = useId();

  return (
    <MorphingPopover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setSent(false);
      }}
    >
      <MorphingPopoverTrigger>
        <MessageSquarePlus aria-hidden="true" className="size-4" />
        Feedback
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Send feedback" className="w-[22rem]">
        {sent ? (
          <MorphingPopoverBody className="items-center gap-1 py-10 text-center">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            <p className="text-sm font-medium text-fg">Thanks for the note!</p>
            <p className="text-xs text-fg-tertiary">We read every message.</p>
          </MorphingPopoverBody>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              setNote("");
              window.setTimeout(() => setOpen(false), 1200);
            }}
          >
            <label htmlFor={fieldId} className="sr-only">
              Your feedback
            </label>
            <textarea
              id={fieldId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="Add feedback"
              className="block w-full resize-none bg-transparent px-4 pt-4 text-sm text-fg outline-none placeholder:text-fg-tertiary"
            />
            <MorphingPopoverFooter className="justify-between border-t-0 px-3 pb-3 pt-1">
              <MorphingPopoverClose />
              <Button type="submit" size="sm" variant="outline" disabled={note.trim().length === 0}>
                Submit
              </Button>
            </MorphingPopoverFooter>
          </form>
        )}
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}`,
    preview: <MorphingPopoverFeedbackDemo />,
  },
  {
    id: "quick-actions",
    title: "Quick actions",
    description:
      "A poppy menu: the trigger morphs into a compact list of MorphingPopoverButton rows with leading lucide icons. Each row closes the surface on activation. Full keyboard + screen-reader support comes from the dialog wiring (aria-haspopup/expanded/controls, focus trap-in/return).",
    install: {
      registryItem: "morphing-popover",
      dependencies: ["motion"],
    },
    code: `function QuickActions() {
  const [open, setOpen] = useState(false);
  const actions = [
    { id: "edit", label: "Edit", icon: Pencil },
    { id: "duplicate", label: "Duplicate", icon: Copy },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <MorphingPopover open={open} onOpenChange={setOpen}>
      <MorphingPopoverTrigger>
        Actions
        <ArrowRight aria-hidden="true" className="size-4" />
      </MorphingPopoverTrigger>
      <MorphingPopoverContent aria-label="Quick actions" className="w-56">
        <MorphingPopoverBody className="gap-0.5 p-1.5">
          {actions.map(({ id, label, icon: Icon }) => (
            <MorphingPopoverButton key={id} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" />
              {label}
            </MorphingPopoverButton>
          ))}
          <div className="my-1 h-px bg-border" />
          <MorphingPopoverButton
            onClick={() => setOpen(false)}
            className="text-fg-secondary hover:text-fg"
          >
            <Trash2 aria-hidden="true" />
            Delete
          </MorphingPopoverButton>
        </MorphingPopoverBody>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}`,
    preview: <MorphingPopoverQuickActionsDemo />,
  },
];

/** Stacked list view for `/components/morphing-popover`; loaded on its own by the premium family. */
export default function MorphingPopoverExamples() {
  return <ExampleList examples={examples} />;
}
