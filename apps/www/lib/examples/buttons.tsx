"use client";

import { useTheme } from "@cronus-ui/theme";
import {
  AnimatedButton,
  Button,
  ButtonGroup,
  CopyButton,
  Fab,
  ModeToggle,
  Spinner,
  SplitButton,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "@cronus-ui/ui";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowRight,
  Bold,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Heart,
  Image,
  Italic,
  Pencil,
  Plus,
  Save,
  Send,
  Settings,
  Share2,
  Trash2,
  Underline,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

/* -------------------------------------------------------------------------- */
/*  Stateful demos                                                            */
/* -------------------------------------------------------------------------- */

function ToggleDemo() {
  const [bold, setBold] = useState(false);
  return (
    <Toggle pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
      <Bold />
      Bold
    </Toggle>
  );
}

function ToggleSizesDemo() {
  const [pressed, setPressed] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <Toggle size="sm" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (small)">
        <Bold />
      </Toggle>
      <Toggle size="md" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (medium)">
        <Bold />
      </Toggle>
      <Toggle size="lg" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (large)">
        <Bold />
      </Toggle>
    </div>
  );
}

function ToggleOutlineDemo() {
  const [italic, setItalic] = useState(false);
  return (
    <Toggle
      variant="outline"
      pressed={italic}
      onPressedChange={setItalic}
      aria-label="Toggle italic"
    >
      <Italic />
      Italic
    </Toggle>
  );
}

function ToggleGroupSingleDemo() {
  const [align, setAlign] = useState("left");
  return (
    <ToggleGroup
      type="single"
      value={align}
      onValueChange={(value) => {
        if (value) setAlign(value);
      }}
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function ToggleGroupMultipleDemo() {
  const [formats, setFormats] = useState<string[]>(["bold"]);
  return (
    <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function SplitButtonSaveDemo() {
  const [status, setStatus] = useState("Draft saved 2 minutes ago");
  return (
    <div className="flex flex-col items-start gap-3">
      <SplitButton
        icon={<Save />}
        onClick={() => setStatus("Saved just now")}
        items={[
          {
            icon: <FileText />,
            label: "Save as draft",
            onSelect: () => setStatus("Saved to drafts"),
          },
          { icon: <Copy />, label: "Save a copy", onSelect: () => setStatus("Copy saved") },
          {
            icon: <Trash2 />,
            label: "Discard changes",
            destructive: true,
            onSelect: () => setStatus("Changes discarded"),
          },
        ]}
      >
        Save
      </SplitButton>
      <p className="text-sm text-fg-tertiary">{status}</p>
    </div>
  );
}

function SplitButtonPublishDemo() {
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const publish = () => {
    setLoading(true);
    setPublished(false);
    setTimeout(() => {
      setLoading(false);
      setPublished(true);
    }, 1400);
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <SplitButton
        icon={<Send />}
        loading={loading}
        onClick={publish}
        menuLabel="Publishing options"
        items={[
          { icon: <CalendarClock />, label: "Schedule for later" },
          { icon: <FileText />, label: "Save as draft" },
        ]}
      >
        {loading ? "Publishing…" : "Publish"}
      </SplitButton>
      <p className="text-sm text-fg-tertiary">
        {published ? "Your post is live." : "Ready when you are."}
      </p>
    </div>
  );
}

function ModeToggleDemo() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  return (
    <div className="flex items-center gap-4">
      <ModeToggle mode={mode} onModeChange={setMode} />
      <span className="text-sm text-fg-secondary">
        Current mode: <span className="font-medium text-fg">{mode}</span>
      </span>
    </div>
  );
}

function ModeToggleSizesDemo() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  return (
    <div className="flex items-center gap-3">
      <ModeToggle size="sm" mode={mode} onModeChange={setMode} />
      <ModeToggle size="md" mode={mode} onModeChange={setMode} />
    </div>
  );
}

function ModeToggleThemeDemo() {
  const { mode, setMode } = useTheme();
  return <ModeToggle mode={mode} onModeChange={setMode} />;
}

/* -------------------------------------------------------------------------- */
/*  Examples                                                                  */
/* -------------------------------------------------------------------------- */

export const buttonsExamples: ExampleMap = {
  button: [
    {
      id: "variants",
      title: "Variants",
      description: "Six visual styles, from the primary call-to-action down to a subtle link.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="destructive">Destructive</Button>
  <Button variant="link">Link</Button>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      ),
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Three text sizes plus square icon sizes for toolbar-style actions.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button size="icon" aria-label="Settings">
    <Settings />
  </Button>
  <Button size="icon-sm" aria-label="Settings">
    <Settings />
  </Button>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Settings">
            <Settings />
          </Button>
          <Button size="icon-sm" aria-label="Settings">
            <Settings />
          </Button>
        </div>
      ),
    },
    {
      id: "with-icons",
      title: "With icons",
      description:
        "Icons sit inline with the label. Use a Spinner for loading state and disable to block input.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <Button>
    <Download />
    Download
  </Button>
  <Button variant="secondary">
    Continue
    <ArrowRight />
  </Button>
  <Button variant="outline">
    <Heart />
    Like
  </Button>
  <Button disabled>
    <Heart />
    Disabled
  </Button>
  <Button disabled>
    <Spinner size="sm" aria-hidden="true" />
    Saving
  </Button>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <Download />
            Download
          </Button>
          <Button variant="secondary">
            Continue
            <ArrowRight />
          </Button>
          <Button variant="outline">
            <Heart />
            Like
          </Button>
          <Button disabled>
            <Heart />
            Disabled
          </Button>
          <Button disabled>
            <Spinner size="sm" aria-hidden="true" />
            Saving
          </Button>
        </div>
      ),
    },
    {
      id: "as-link",
      title: "As link",
      description:
        "Use `asChild` to render the button styles on another element, such as an anchor.",
      code: `<Button asChild>
  <a href="/docs">
    Read the docs
    <ArrowRight />
  </a>
</Button>`,
      preview: (
        <Button asChild>
          <a href="/docs">
            Read the docs
            <ArrowRight />
          </a>
        </Button>
      ),
    },
  ],

  "animated-button": [
    {
      id: "spring-feedback",
      title: "Spring feedback",
      description:
        "Drop-in replacement for Button that lifts on hover and presses in on tap with a snappy spring.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <AnimatedButton variant="primary">Primary</AnimatedButton>
  <AnimatedButton variant="outline">Outline</AnimatedButton>
  <AnimatedButton variant="secondary">
    <Download />
    Download
  </AnimatedButton>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <AnimatedButton variant="primary">Primary</AnimatedButton>
          <AnimatedButton variant="outline">Outline</AnimatedButton>
          <AnimatedButton variant="secondary">
            <Download />
            Download
          </AnimatedButton>
        </div>
      ),
    },
  ],

  toggle: [
    {
      id: "default",
      title: "Default",
      description: "A two-state button. Control it with `pressed` and `onPressedChange`.",
      code: `const [bold, setBold] = useState(false);

return (
  <Toggle pressed={bold} onPressedChange={setBold} aria-label="Toggle bold">
    <Bold />
    Bold
  </Toggle>
);`,
      preview: <ToggleDemo />,
    },
    {
      id: "outline",
      title: "Outline variant",
      description: "The outline variant keeps a visible border in both states.",
      code: `const [italic, setItalic] = useState(false);

return (
  <Toggle
    variant="outline"
    pressed={italic}
    onPressedChange={setItalic}
    aria-label="Toggle italic"
  >
    <Italic />
    Italic
  </Toggle>
);`,
      preview: <ToggleOutlineDemo />,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Toggles come in three sizes to match surrounding controls.",
      code: `const [pressed, setPressed] = useState(true);

return (
  <div className="flex items-center gap-3">
    <Toggle size="sm" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (small)">
      <Bold />
    </Toggle>
    <Toggle size="md" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (medium)">
      <Bold />
    </Toggle>
    <Toggle size="lg" pressed={pressed} onPressedChange={setPressed} aria-label="Bold (large)">
      <Bold />
    </Toggle>
  </div>
);`,
      preview: <ToggleSizesDemo />,
    },
  ],

  "toggle-group": [
    {
      id: "single",
      title: "Single",
      description:
        'With `type="single"` exactly one item is selected at a time — ideal for text alignment.',
      code: `const [align, setAlign] = useState("left");

return (
  <ToggleGroup
    type="single"
    value={align}
    onValueChange={(value) => {
      if (value) setAlign(value);
    }}
  >
    <ToggleGroupItem value="left" aria-label="Align left">
      <AlignLeft />
    </ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center">
      <AlignCenter />
    </ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right">
      <AlignRight />
    </ToggleGroupItem>
  </ToggleGroup>
);`,
      preview: <ToggleGroupSingleDemo />,
    },
    {
      id: "multiple",
      title: "Multiple",
      description:
        'With `type="multiple"` any number of items can be active — perfect for text formatting.',
      code: `const [formats, setFormats] = useState<string[]>(["bold"]);

return (
  <ToggleGroup type="multiple" value={formats} onValueChange={setFormats}>
    <ToggleGroupItem value="bold" aria-label="Bold">
      <Bold />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Italic">
      <Italic />
    </ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Underline">
      <Underline />
    </ToggleGroupItem>
  </ToggleGroup>
);`,
      preview: <ToggleGroupMultipleDemo />,
    },
  ],

  "copy-button": [
    {
      id: "default",
      title: "Default",
      description:
        "An icon button that writes `value` to the clipboard and swaps to a check for a moment. It manages its own copied state.",
      code: `<CopyButton value="npm install @cronus-ui/ui" />`,
      preview: <CopyButton value="npm install @cronus-ui/ui" />,
    },
    {
      id: "inline",
      title: "Inline with a value",
      description:
        "Drop it next to a value the user might copy, such as an API key or command. Use `copyLabel` / `copiedLabel` to localise the accessible text, and the outline variant to sit flush with a field.",
      code: `<div className="flex items-center gap-2">
  <code className="rounded bg-surface-inset px-2 py-1 font-mono text-sm">cronus_sk_live_…a1b2</code>
  <CopyButton
    value="cronus_sk_live_a1b2"
    variant="outline"
    copyLabel="Copy API key"
    copiedLabel="API key copied"
  />
</div>`,
      preview: (
        <div className="flex items-center gap-2">
          <code className="rounded bg-surface-inset px-2 py-1 font-mono text-sm">
            cronus_sk_live_…a1b2
          </code>
          <CopyButton
            value="cronus_sk_live_a1b2"
            variant="outline"
            copyLabel="Copy API key"
            copiedLabel="API key copied"
          />
        </div>
      ),
    },
  ],

  "button-group": [
    {
      id: "horizontal",
      title: "Horizontal",
      description:
        "Wrap a row of buttons in `ButtonGroup` and they fuse into one segmented control — shared edges collapse and inner radii flatten.",
      code: `<ButtonGroup>
  <Button variant="outline">
    <ChevronLeft />
    Prev
  </Button>
  <Button variant="outline">Page 1</Button>
  <Button variant="outline">
    Next
    <ChevronRight />
  </Button>
</ButtonGroup>`,
      preview: (
        <ButtonGroup>
          <Button variant="outline">
            <ChevronLeft />
            Prev
          </Button>
          <Button variant="outline">Page 1</Button>
          <Button variant="outline">
            Next
            <ChevronRight />
          </Button>
        </ButtonGroup>
      ),
    },
    {
      id: "vertical",
      title: "Vertical",
      description:
        'Set `orientation="vertical"` to stack the buttons into a single column segmented unit.',
      code: `<ButtonGroup orientation="vertical">
  <Button variant="outline">
    <AlignLeft />
    Left
  </Button>
  <Button variant="outline">
    <AlignCenter />
    Center
  </Button>
  <Button variant="outline">
    <AlignRight />
    Right
  </Button>
</ButtonGroup>`,
      preview: (
        <ButtonGroup orientation="vertical">
          <Button variant="outline">
            <AlignLeft />
            Left
          </Button>
          <Button variant="outline">
            <AlignCenter />
            Center
          </Button>
          <Button variant="outline">
            <AlignRight />
            Right
          </Button>
        </ButtonGroup>
      ),
    },
  ],
  fab: [
    {
      id: "default",
      title: "Default",
      description:
        "A single floating action button. Positioning is left to you — here it's pinned to the bottom-right of a relative demo box.",
      code: `<div className="relative h-64 rounded-xl border border-border">
  <Fab
    icon={<Plus />}
    label="New item"
    className="absolute bottom-4 right-4"
  />
</div>`,
      preview: (
        <div className="relative h-64 w-full rounded-xl border border-border">
          <Fab icon={<Plus />} label="New item" className="absolute bottom-4 right-4" />
        </div>
      ),
    },
    {
      id: "speed-dial",
      title: "Speed dial",
      description:
        "Pass `actions` to turn the FAB into a speed-dial: clicking it reveals a vertical stack of smaller round buttons, each with its own label chip. The main glyph rotates while open.",
      code: `<div className="relative h-64 rounded-xl border border-border">
  <Fab
    icon={<Plus />}
    label="Create"
    className="absolute bottom-4 right-4"
    actions={[
      { icon: <Pencil />, label: "Write a note" },
      { icon: <Image />, label: "Upload an image" },
      { icon: <Upload />, label: "Import a file" },
    ]}
  />
</div>`,
      preview: (
        <div className="relative h-64 w-full rounded-xl border border-border">
          <Fab
            icon={<Plus />}
            label="Create"
            className="absolute bottom-4 right-4"
            actions={[
              { icon: <Pencil />, label: "Write a note" },
              { icon: <Image />, label: "Upload an image" },
              { icon: <Upload />, label: "Import a file" },
            ]}
          />
        </div>
      ),
    },
  ],

  "split-button": [
    {
      id: "default",
      title: "Default",
      description:
        "A primary action fused to a menu of related secondaries. Clicking the left segment runs the default action; the chevron opens declarative `items`, including a destructive row.",
      code: `const [status, setStatus] = useState("Draft saved 2 minutes ago");

return (
  <div className="flex flex-col items-start gap-3">
    <SplitButton
      icon={<Save />}
      onClick={() => setStatus("Saved just now")}
      items={[
        { icon: <FileText />, label: "Save as draft", onSelect: () => setStatus("Saved to drafts") },
        { icon: <Copy />, label: "Save a copy", onSelect: () => setStatus("Copy saved") },
        {
          icon: <Trash2 />,
          label: "Discard changes",
          destructive: true,
          onSelect: () => setStatus("Changes discarded"),
        },
      ]}
    >
      Save
    </SplitButton>
    <p className="text-sm text-fg-tertiary">{status}</p>
  </div>
);`,
      preview: <SplitButtonSaveDemo />,
    },
    {
      id: "variants",
      title: "Variants",
      description:
        "Both segments share `Button`'s variants and collapse their inner edges into one seamless control — a single hairline seam reads cleanly across every tone.",
      code: `<div className="flex flex-wrap items-center gap-3">
  <SplitButton
    variant="primary"
    items={[
      { icon: <Copy />, label: "Duplicate" },
      { icon: <Share2 />, label: "Share" },
    ]}
  >
    Primary
  </SplitButton>
  <SplitButton
    variant="secondary"
    items={[
      { icon: <Copy />, label: "Duplicate" },
      { icon: <Share2 />, label: "Share" },
    ]}
  >
    Secondary
  </SplitButton>
  <SplitButton
    variant="outline"
    items={[
      { icon: <Copy />, label: "Duplicate" },
      { icon: <Share2 />, label: "Share" },
    ]}
  >
    Outline
  </SplitButton>
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-3">
          <SplitButton
            variant="primary"
            items={[
              { icon: <Copy />, label: "Duplicate" },
              { icon: <Share2 />, label: "Share" },
            ]}
          >
            Primary
          </SplitButton>
          <SplitButton
            variant="secondary"
            items={[
              { icon: <Copy />, label: "Duplicate" },
              { icon: <Share2 />, label: "Share" },
            ]}
          >
            Secondary
          </SplitButton>
          <SplitButton
            variant="outline"
            items={[
              { icon: <Copy />, label: "Duplicate" },
              { icon: <Share2 />, label: "Share" },
            ]}
          >
            Outline
          </SplitButton>
        </div>
      ),
    },
    {
      id: "loading",
      title: "Loading",
      description:
        "Set `loading` to swap the primary icon for a spinner and disable both segments while the action is in flight — perfect for publish or submit flows.",
      code: `const [loading, setLoading] = useState(false);
const [published, setPublished] = useState(false);

const publish = () => {
  setLoading(true);
  setPublished(false);
  setTimeout(() => {
    setLoading(false);
    setPublished(true);
  }, 1400);
};

return (
  <div className="flex flex-col items-start gap-3">
    <SplitButton
      icon={<Send />}
      loading={loading}
      onClick={publish}
      menuLabel="Publishing options"
      items={[
        { icon: <CalendarClock />, label: "Schedule for later" },
        { icon: <FileText />, label: "Save as draft" },
      ]}
    >
      {loading ? "Publishing…" : "Publish"}
    </SplitButton>
    <p className="text-sm text-fg-tertiary">
      {published ? "Your post is live." : "Ready when you are."}
    </p>
  </div>
);`,
      preview: <SplitButtonPublishDemo />,
    },
  ],
  "mode-toggle": [
    {
      id: "morph",
      title: "Sun ⇄ moon morph",
      description:
        "Fully controlled: the button reports the opposite mode via `onModeChange` while the sun scales into a crescent moon with pure CSS transitions (instant under reduced motion).",
      code: `const [mode, setMode] = useState<"light" | "dark">("light");

return <ModeToggle mode={mode} onModeChange={setMode} />;`,
      preview: <ModeToggleDemo />,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Two square footprints — `sm` for dense toolbars, `md` for headers.",
      code: `const [mode, setMode] = useState<"light" | "dark">("dark");

return (
  <div className="flex items-center gap-3">
    <ModeToggle size="sm" mode={mode} onModeChange={setMode} />
    <ModeToggle size="md" mode={mode} onModeChange={setMode} />
  </div>
);`,
      preview: <ModeToggleSizesDemo />,
    },
    {
      id: "theme-provider",
      title: "Wired to a theme provider",
      description:
        "The component never touches the DOM root — hand it your provider's mode. This one is live: it drives the whole docs site through `useTheme` from `@cronus-ui/theme`.",
      code: `const { mode, setMode } = useTheme();

return <ModeToggle mode={mode} onModeChange={setMode} />;`,
      preview: <ModeToggleThemeDemo />,
    },
  ],
};

/**
 * Default-export view for the buttons family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function ButtonsExamples({ slug }: { slug: string }) {
  return <ExampleList examples={buttonsExamples[slug] ?? []} />;
}
