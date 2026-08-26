import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsHeader,
  DocsSection,
  DocsTextLink,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";

const validatedFormCode = `"use client";

import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@cronus-ui/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

type Values = z.infer<typeof schema>;

export function SignInForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = (values: Values) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-5" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@cronus.dev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  );
}`;

const darkModeToggleCode = `"use client";

import { Button } from "@cronus-ui/ui";
import { useTheme } from "@cronus-ui/theme";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}`;

const setModeCode = `import { useTheme } from "@cronus-ui/theme";

function ModePicker() {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex gap-2">
      {(["light", "dark"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setMode(value)}
          aria-pressed={mode === value}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-fg-secondary aria-pressed:bg-surface-overlay aria-pressed:text-fg"
        >
          {value}
        </button>
      ))}
    </div>
  );
}`;

const toastCode = `"use client";

import { Button, Toaster, toast } from "@cronus-ui/ui";

export function SaveBar() {
  return (
    <>
      {/* Mount the Toaster once, near the app root. */}
      <Toaster />

      <div className="flex gap-2">
        <Button onClick={() => toast.success("Changes saved successfully.")}>
          Save
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Something went wrong. Please try again.")}
        >
          Trigger error
        </Button>
      </div>
    </>
  );
}`;

const confirmCode = `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@cronus-ui/ui";
import { Trash2 } from "lucide-react";

export function DeleteProjectButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 aria-hidden="true" />
          Delete project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the project and all of its data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yes, delete it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`;

const commandPaletteCode = `"use client";

import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Kbd,
} from "@cronus-ui/ui";
import { CalendarDays, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  // Open with ⌘K / Ctrl+K.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search
        <Kbd className="ml-1">⌘K</Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command palette"
        description="Search for a command to run."
      >
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => setOpen(false)}>
              <CalendarDays aria-hidden="true" />
              Calendar
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <User aria-hidden="true" />
              Search profile
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings aria-hidden="true" />
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}`;

export default function RecipesPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Recipes"
        description="Copy-paste solutions for the patterns teams build most often with Cronus UI: validated forms, theme toggles, toasts, confirmations, and a command palette."
      >
        <PrimaryLink href="/components">Browse components</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="A validated form"
        description="Wire React Hook Form to a Zod schema with zodResolver. Each FormField binds a control to a field; FormMessage renders the validation error and FormLabel stays linked for accessibility. Reach for this whenever a form needs typed values and inline error feedback."
      >
        <CodeBlock code={validatedFormCode} language="tsx" expandable />
        <DocCallout title="Validate as you type">
          Set <InlineCode>mode: &quot;onChange&quot;</InlineCode> on{" "}
          <InlineCode>useForm</InlineCode> so errors surface while the visitor edits instead of only
          on submit. The resolver infers types from the schema, so{" "}
          <InlineCode>z.infer&lt;typeof schema&gt;</InlineCode> keeps your handler fully typed.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="A dark-mode toggle"
        description="Flip between light and dark with the useTheme hook. It must be called inside a CronusUIProvider; toggleMode swaps the active mode and persists it through the provider's storageKey. Use this for the mode switch in a header or settings menu."
      >
        <CodeBlock code={darkModeToggleCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          To set a specific mode rather than toggle — for example a three-way light / dark / system
          control — call <InlineCode>setMode</InlineCode> directly.
        </p>
        <CodeBlock code={setModeCode} language="tsx" expandable />
        <DocCallout title="Avoid a flash of the wrong mode">
          Render <InlineCode>CronusThemeScript</InlineCode> in the document head so the saved mode
          applies before paint. See <DocsTextLink href="/docs/theming">Theming</DocsTextLink> for
          the full setup.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="Toast notifications"
        description="Mount a single <Toaster /> near the app root, then fire transient messages imperatively with toast.success(), toast.error(), or toast() from anywhere. Use toasts for non-blocking feedback after an action completes."
      >
        <CodeBlock code={toastCode} language="tsx" expandable />
        <DocCallout title="Mount the Toaster once" tone="success">
          Render <InlineCode>&lt;Toaster /&gt;</InlineCode> a single time in a shared layout. The{" "}
          <InlineCode>toast</InlineCode> function then works from any component — including event
          handlers and async callbacks — without prop drilling.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="Confirm a destructive action"
        description="Wrap a destructive trigger in an AlertDialog so the visitor must confirm before anything irreversible happens. Unlike a Dialog, an AlertDialog traps focus and expects an explicit confirm or cancel choice. Use it for delete, reset, or revoke flows."
      >
        <CodeBlock code={confirmCode} language="tsx" expandable />
        <DocCallout title="Run the action on confirm">
          Attach your handler to <InlineCode>AlertDialogAction</InlineCode>&apos;s{" "}
          <InlineCode>onClick</InlineCode>. <InlineCode>AlertDialogCancel</InlineCode> dismisses
          without side effects, and both buttons close the dialog automatically.
        </DocCallout>
      </DocsSection>

      <DocsSection
        title="A command palette"
        description="A CommandDialog opened by a button or the ⌘K / Ctrl+K shortcut, with grouped, searchable items. Use it as the keyboard-first way to jump between views and run actions across an app."
      >
        <CodeBlock code={commandPaletteCode} language="tsx" expandable />
        <DocCallout title="Hint the shortcut">
          Show the trigger key with a <InlineCode>Kbd</InlineCode> badge, and add a per-item{" "}
          <InlineCode>CommandShortcut</InlineCode> so frequent actions are discoverable. Each{" "}
          <InlineCode>CommandItem</InlineCode> takes an <InlineCode>onSelect</InlineCode> handler
          that fires on click or Enter.
        </DocCallout>
      </DocsSection>
    </div>
  );
}
