"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
  Separator,
  Textarea,
} from "@cronus-ui/ui";
import {
  ArrowUp,
  ChevronDown,
  Copy,
  Paperclip,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Chat thread — assistant conversation card
 * ────────────────────────────────────────────────────────────────────────── */

export function ChatThreadBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-md gap-0 overflow-hidden p-0 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-border p-4">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="flex flex-1 items-center gap-2">
            <span className="font-medium text-sm">Cronus Assistant</span>
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          </div>
          <Button variant="ghost" size="sm">
            Clear
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex items-start justify-end gap-2">
            <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-primary-foreground text-sm">
              How do I theme a Cronus component?
            </div>
            <Avatar className="size-7">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-start gap-2">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </span>
            <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-surface-overlay px-3 py-2 text-sm">
              Wrap your app in CronusUIProvider and override the design tokens you want to change.
            </div>
          </div>

          <div className="flex items-start justify-end gap-2">
            <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-primary-foreground text-sm">
              Can I do it per-route?
            </div>
            <Avatar className="size-7">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-start gap-2">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface-overlay px-3 py-3">
              <span
                className="size-1.5 rounded-full bg-fg-tertiary animate-bounce [animation-delay:0ms]"
                aria-hidden="true"
              />
              <span
                className="size-1.5 rounded-full bg-fg-tertiary animate-bounce [animation-delay:150ms]"
                aria-hidden="true"
              />
              <span
                className="size-1.5 rounded-full bg-fg-tertiary animate-bounce [animation-delay:300ms]"
                aria-hidden="true"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-2 border-t border-border p-3">
          <Input placeholder="Message Cronus Assistant…" className="flex-1" />
          <Button variant="primary" size="icon" aria-label="Send message">
            <ArrowUp className="size-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const chatThreadCode = `import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Input,
} from "@cronus-ui/ui";
import { ArrowUp, Sparkles } from "lucide-react";

export function ChatThreadBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-md gap-0 overflow-hidden p-0 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3 border-b border-border p-4">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div className="flex flex-1 items-center gap-2">
            <span className="font-medium text-sm">Cronus Assistant</span>
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          </div>
          <Button variant="ghost" size="sm">
            Clear
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex items-start justify-end gap-2">
            <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-primary-foreground text-sm">
              How do I theme a Cronus component?
            </div>
            <Avatar className="size-7">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-start gap-2">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </span>
            <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-surface-overlay px-3 py-2 text-sm">
              Wrap your app in CronusUIProvider and override the design tokens you want to change.
            </div>
          </div>

          <div className="flex items-start justify-end gap-2">
            <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-primary-foreground text-sm">
              Can I do it per-route?
            </div>
            <Avatar className="size-7">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex items-start gap-2">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface-overlay px-3 py-3">
              <span
                className="size-1.5 rounded-full bg-fg-tertiary animate-bounce [animation-delay:0ms]"
                aria-hidden="true"
              />
              <span
                className="size-1.5 rounded-full bg-fg-tertiary animate-bounce [animation-delay:150ms]"
                aria-hidden="true"
              />
              <span
                className="size-1.5 rounded-full bg-fg-tertiary animate-bounce [animation-delay:300ms]"
                aria-hidden="true"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-2 border-t border-border p-3">
          <Input placeholder="Message Cronus Assistant…" className="flex-1" />
          <Button variant="primary" size="icon" aria-label="Send message">
            <ArrowUp className="size-4" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Prompt box — standalone AI composer
 * ────────────────────────────────────────────────────────────────────────── */

export function PromptBoxBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="flex w-full max-w-xl flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Summarize
          </Button>
          <Button variant="outline" size="sm">
            Translate
          </Button>
          <Button variant="outline" size="sm">
            Write code
          </Button>
          <Button variant="outline" size="sm">
            Brainstorm
          </Button>
        </div>

        <Card className="gap-3 p-3 shadow-lg">
          <Textarea
            placeholder="Ask anything…"
            className="min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Attach file">
                <Paperclip className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Badge variant="secondary" className="rounded-sm">
                  Cronus · Fast
                </Badge>
                <ChevronDown className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <Button variant="primary" size="icon" aria-label="Send prompt">
              <ArrowUp className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

const promptBoxCode = `import { Badge, Button, Card, Textarea } from "@cronus-ui/ui";
import { ArrowUp, ChevronDown, Paperclip } from "lucide-react";

export function PromptBoxBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="flex w-full max-w-xl flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Summarize
          </Button>
          <Button variant="outline" size="sm">
            Translate
          </Button>
          <Button variant="outline" size="sm">
            Write code
          </Button>
          <Button variant="outline" size="sm">
            Brainstorm
          </Button>
        </div>

        <Card className="gap-3 p-3 shadow-lg">
          <Textarea
            placeholder="Ask anything…"
            className="min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Attach file">
                <Paperclip className="size-4" aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Badge variant="secondary" className="rounded-sm">
                  Cronus · Fast
                </Badge>
                <ChevronDown className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <Button variant="primary" size="icon" aria-label="Send prompt">
              <ArrowUp className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. AI response — assistant answer card
 * ────────────────────────────────────────────────────────────────────────── */

export function AiResponseBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-lg gap-4 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="flex-1 font-medium text-sm">Cronus Assistant</span>
          <Badge variant="secondary">Answer</Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary">
            Cronus UI ships themeable components built on design tokens, so you can restyle the
            whole system without touching component code. The essentials:
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-fg-secondary">
            <li>Every color, radius, and shadow is driven by a CSS variable token.</li>
            <li>Swap a theme by overriding those tokens at any DOM scope.</li>
            <li>The CLI copies source into your repo so you stay in control.</li>
          </ul>

          <div className="flex flex-col gap-2">
            <span className="font-medium text-fg-tertiary text-xs uppercase tracking-wide">
              Sources
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-5 shrink-0 rounded bg-surface-overlay" aria-hidden="true" />
              <span className="flex-1 truncate">Theming guide</span>
              <span className="text-fg-tertiary text-xs">cronus-ui.dev</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-5 shrink-0 rounded bg-surface-overlay" aria-hidden="true" />
              <span className="flex-1 truncate">Design tokens reference</span>
              <span className="text-fg-tertiary text-xs">cronus-ui.dev</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-5 shrink-0 rounded bg-surface-overlay" aria-hidden="true" />
              <span className="flex-1 truncate">CLI: add a component</span>
              <span className="text-fg-tertiary text-xs">cronus-ui.dev</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Good response">
              <ThumbsUp className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Bad response">
              <ThumbsDown className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="size-4" aria-hidden="true" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto">
              <RefreshCw className="size-4" aria-hidden="true" />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const aiResponseCode = `import { Badge, Button, Card, CardContent, CardHeader, Separator } from "@cronus-ui/ui";
import { Copy, RefreshCw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

export function AiResponseBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-lg gap-4 shadow-lg">
        <CardHeader className="flex flex-row items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="flex-1 font-medium text-sm">Cronus Assistant</span>
          <Badge variant="secondary">Answer</Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-fg-secondary">
            Cronus UI ships themeable components built on design tokens, so you can restyle the whole
            system without touching component code. The essentials:
          </p>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-fg-secondary">
            <li>Every color, radius, and shadow is driven by a CSS variable token.</li>
            <li>Swap a theme by overriding those tokens at any DOM scope.</li>
            <li>The CLI copies source into your repo so you stay in control.</li>
          </ul>

          <div className="flex flex-col gap-2">
            <span className="font-medium text-fg-tertiary text-xs uppercase tracking-wide">
              Sources
            </span>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-5 shrink-0 rounded bg-surface-overlay" aria-hidden="true" />
              <span className="flex-1 truncate">Theming guide</span>
              <span className="text-fg-tertiary text-xs">cronus-ui.dev</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-5 shrink-0 rounded bg-surface-overlay" aria-hidden="true" />
              <span className="flex-1 truncate">Design tokens reference</span>
              <span className="text-fg-tertiary text-xs">cronus-ui.dev</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="size-5 shrink-0 rounded bg-surface-overlay" aria-hidden="true" />
              <span className="flex-1 truncate">CLI: add a component</span>
              <span className="text-fg-tertiary text-xs">cronus-ui.dev</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Good response">
              <ThumbsUp className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Bad response">
              <ThumbsDown className="size-4" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="size-4" aria-hidden="true" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" className="ml-auto">
              <RefreshCw className="size-4" aria-hidden="true" />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const aiBlocks: BlockContentMap = {
  "chat-thread": { preview: <ChatThreadBlock />, code: chatThreadCode },
  "prompt-box": { preview: <PromptBoxBlock />, code: promptBoxCode },
  "ai-response": { preview: <AiResponseBlock />, code: aiResponseCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function AiGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(aiBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function AiView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(aiBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
