"use client";

import {
  Badge,
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  ConfirmationDialog,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  Lightbox,
  type LightboxImage,
  NotificationCenter,
  type NotificationItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@cronus-ui/ui";
import {
  CalendarDays,
  ClipboardPaste,
  Copy,
  CreditCard,
  Heart,
  HelpCircle,
  Keyboard,
  LifeBuoy,
  MessageSquare,
  Plus,
  Rocket,
  Scissors,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

function ActionsMenuDemo() {
  const [showStatusBar, setShowStatusBar] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User aria-hidden="true" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard aria-hidden="true" />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings aria-hidden="true" />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
          Show status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Users aria-hidden="true" />
            Invite team
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <UserPlus aria-hidden="true" />
              Email invite
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy aria-hidden="true" />
              Copy invite link
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);

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
        Open command palette
        <Badge variant="secondary" className="ml-1 font-mono text-[10px]">
          ⌘K
        </Badge>
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
            <CommandItem onSelect={() => setOpen(false)}>
              <Copy aria-hidden="true" />
              Copy link
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings aria-hidden="true" />
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Keyboard aria-hidden="true" />
              Keyboard shortcuts
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <LifeBuoy aria-hidden="true" />
              Help &amp; support
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function ContextMenuDemo() {
  const [bookmarked, setBookmarked] = useState(true);
  const [branch, setBranch] = useState("main");

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-36 w-full max-w-sm select-none items-center justify-center rounded-lg border border-dashed border-border text-sm text-fg-secondary">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <Scissors aria-hidden="true" />
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy aria-hidden="true" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPaste aria-hidden="true" />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={bookmarked} onCheckedChange={setBookmarked}>
          Bookmarked
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Users aria-hidden="true" />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <UserPlus aria-hidden="true" />
              Invite people
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy aria-hidden="true" />
              Copy link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuLabel>Branch</ContextMenuLabel>
        <ContextMenuRadioGroup value={branch} onValueChange={setBranch}>
          <ContextMenuRadioItem value="main">main</ContextMenuRadioItem>
          <ContextMenuRadioItem value="develop">develop</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "mention",
    title: "Ada mentioned you",
    description: "“@you can you review the payout rail PR?”",
    timestamp: "2m ago",
    icon: <MessageSquare aria-hidden="true" />,
  },
  {
    id: "star",
    title: "Your release hit 1,000 stars",
    description: "cronus-ui reached a new milestone.",
    timestamp: "1h ago",
    icon: <Heart aria-hidden="true" />,
  },
  {
    id: "invite",
    title: "New teammate joined",
    description: "Grace accepted your invite to Acme.",
    timestamp: "Yesterday",
    avatar: { fallback: "GR" },
    read: true,
  },
];

function NotificationCenterDemo() {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  return (
    <NotificationCenter
      notifications={items}
      onMarkAllRead={() => setItems((prev) => prev.map((item) => ({ ...item, read: true })))}
      onNotificationClick={(id) =>
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
      }
      footer={
        <Button variant="link" size="sm" className="h-auto px-0">
          View all notifications
        </Button>
      }
    />
  );
}

const LIGHTBOX_IMAGES: LightboxImage[] = [
  { src: "https://picsum.photos/seed/cronus1/800/600", alt: "Mountain ridge at dawn" },
  { src: "https://picsum.photos/seed/cronus2/800/600", alt: "Coastline from above" },
  { src: "https://picsum.photos/seed/cronus3/800/600", alt: "Forest canopy" },
  { src: "https://picsum.photos/seed/cronus4/800/600", alt: "City skyline at dusk" },
  { src: "https://picsum.photos/seed/cronus5/800/600", alt: "Desert dunes" },
  { src: "https://picsum.photos/seed/cronus6/800/600", alt: "Quiet harbour" },
];

function LightboxDemo() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {LIGHTBOX_IMAGES.map((image, i) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Open ${image.alt}`}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="overflow-hidden rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* biome-ignore lint/performance/noImgElement: docs example renders external picsum images directly */}
            <img src={image.src} alt={image.alt} className="aspect-[4/3] size-full object-cover" />
          </button>
        ))}
      </div>
      <Lightbox
        images={LIGHTBOX_IMAGES}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}

/**
 * Async confirm demo. `onConfirm` returns a promise, so the confirm button shows
 * a spinner and locks both actions while it settles — the dialog can't be
 * dismissed mid-flight. The first attempt rejects to surface the inline error
 * region (the dialog stays open); the retry resolves and closes it. Reopening
 * resets the demo so it's repeatable.
 */
function ConfirmationDialogAsyncDemo() {
  const [open, setOpen] = useState(false);
  const attemptRef = useRef(0);
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <ConfirmationDialog
        open={open}
        onOpenChange={(next) => {
          if (next) {
            attemptRef.current = 0;
            setDeleted(false);
          }
          setOpen(next);
        }}
        destructive
        trigger={<Button variant="outline">Delete workspace</Button>}
        title="Delete this workspace?"
        description="This permanently removes 3 projects and 128 files. This action can’t be undone."
        confirmLabel="Delete workspace"
        cancelLabel="Keep workspace"
        onConfirm={() =>
          new Promise<void>((resolve, reject) => {
            attemptRef.current += 1;
            window.setTimeout(() => {
              if (attemptRef.current === 1) {
                reject(
                  new Error("Couldn’t reach the server. Check your connection and try again."),
                );
              } else {
                setDeleted(true);
                resolve();
              }
            }, 1400);
          })
        }
      />
      <p className="text-xs text-fg-tertiary">
        {deleted
          ? "Workspace deleted."
          : "Confirm to see the pending spinner — the first attempt fails inline, the retry succeeds."}
      </p>
    </div>
  );
}

export const overlaysExamples: ExampleMap = {
  "confirmation-dialog": [
    {
      id: "basic",
      title: "Basic",
      description:
        "An ergonomic wrapper over AlertDialog for confirming an action. Pass a `trigger`, a `title`, and optional `description`; a custom `icon` fills the primary-tinted header badge.",
      code: `<ConfirmationDialog
  trigger={<Button>Publish article</Button>}
  icon={<Rocket aria-hidden="true" />}
  title="Publish this article?"
  description="It becomes visible to everyone on your blog immediately. You can unpublish it again at any time."
  confirmLabel="Publish"
/>`,
      preview: (
        <ConfirmationDialog
          trigger={<Button>Publish article</Button>}
          icon={<Rocket aria-hidden="true" />}
          title="Publish this article?"
          description="It becomes visible to everyone on your blog immediately. You can unpublish it again at any time."
          confirmLabel="Publish"
        />
      ),
    },
    {
      id: "destructive",
      title: "Destructive",
      description:
        "Set `destructive` to render a red confirm button and a warning-triangle badge — the pattern for irreversible actions like deleting an account.",
      code: `<ConfirmationDialog
  destructive
  trigger={<Button variant="outline">Delete account</Button>}
  title="Delete your account?"
  description="This permanently deletes your account and everything in it. This action cannot be undone."
  confirmLabel="Delete account"
  cancelLabel="Cancel"
/>`,
      preview: (
        <ConfirmationDialog
          destructive
          trigger={<Button variant="outline">Delete account</Button>}
          title="Delete your account?"
          description="This permanently deletes your account and everything in it. This action cannot be undone."
          confirmLabel="Delete account"
          cancelLabel="Cancel"
        />
      ),
    },
    {
      id: "async",
      title: "Async confirm",
      description:
        "When `onConfirm` returns a promise the confirm button shows a spinner and both actions lock until it settles — the dialog can’t be dismissed mid-flight. On reject it stays open and surfaces the error inline; on resolve it closes.",
      code: `function ConfirmationDialogAsyncDemo() {
  const [open, setOpen] = useState(false);
  const attemptRef = useRef(0);
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <ConfirmationDialog
        open={open}
        onOpenChange={(next) => {
          if (next) {
            attemptRef.current = 0;
            setDeleted(false);
          }
          setOpen(next);
        }}
        destructive
        trigger={<Button variant="outline">Delete workspace</Button>}
        title="Delete this workspace?"
        description="This permanently removes 3 projects and 128 files. This action can’t be undone."
        confirmLabel="Delete workspace"
        cancelLabel="Keep workspace"
        onConfirm={() =>
          new Promise<void>((resolve, reject) => {
            attemptRef.current += 1;
            window.setTimeout(() => {
              if (attemptRef.current === 1) {
                reject(new Error("Couldn’t reach the server. Check your connection and try again."));
              } else {
                setDeleted(true);
                resolve();
              }
            }, 1400);
          })
        }
      />
      <p className="text-xs text-fg-tertiary">
        {deleted
          ? "Workspace deleted."
          : "Confirm to see the pending spinner — the first attempt fails inline, the retry succeeds."}
      </p>
    </div>
  );
}`,
      preview: <ConfirmationDialogAsyncDemo />,
    },
  ],

  dialog: [
    {
      id: "basic",
      title: "Basic",
      description: "A modal dialog with a header, body, and footer rendered in a portal.",
      code: `<Dialog>
  <DialogTrigger asChild>
    <Button>Edit profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Update your display name. Changes are saved when you confirm.
      </DialogDescription>
    </DialogHeader>
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Ada Lovelace" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="ada" />
      </div>
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button>Save changes</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      preview: (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Edit profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Update your display name. Changes are saved when you confirm.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Ada Lovelace" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="ada" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Save changes</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ],

  sheet: [
    {
      id: "sides",
      title: "Sides",
      description: "A panel that slides in from any edge of the screen.",
      code: `{(["top", "right", "bottom", "left"] as const).map((side) => (
  <Sheet key={side}>
    <SheetTrigger asChild>
      <Button variant="outline" className="capitalize">
        {side}
      </Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle className="capitalize">{side} sheet</SheetTitle>
        <SheetDescription>
          This panel slides in from the {side} edge. Press Escape or click
          outside to dismiss it.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-2 px-4 py-2">
        <Label htmlFor={\`note-\${side}\`}>Quick note</Label>
        <Input id={\`note-\${side}\`} placeholder="Type something…" />
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button>Done</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
))}`,
      preview: (
        <div className="flex flex-wrap gap-2">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" className="capitalize">
                  {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle className="capitalize">{side} sheet</SheetTitle>
                  <SheetDescription>
                    This panel slides in from the {side} edge. Press Escape or click outside to
                    dismiss it.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-2 px-4 py-2">
                  <Label htmlFor={`note-${side}`}>Quick note</Label>
                  <Input id={`note-${side}`} placeholder="Type something…" />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>Done</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      ),
    },
  ],

  drawer: [
    {
      id: "bottom-drawer",
      title: "Bottom drawer",
      description:
        "A bottom-anchored sheet that drags up from the edge — touch-friendly on mobile.",
      code: `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <div className="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle>Move goal</DrawerTitle>
        <DrawerDescription>Set your daily activity target.</DrawerDescription>
      </DrawerHeader>
      <div className="px-4 py-6 text-center">
        <span className="font-display text-5xl font-semibold tracking-tight text-fg">
          350
        </span>
        <p className="mt-1 text-xs uppercase tracking-wider text-fg-tertiary">
          Calories / day
        </p>
      </div>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  </DrawerContent>
</Drawer>`,
      preview: (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Move goal</DrawerTitle>
                <DrawerDescription>Set your daily activity target.</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 py-6 text-center">
                <span className="font-display text-5xl font-semibold tracking-tight text-fg">
                  350
                </span>
                <p className="mt-1 text-xs uppercase tracking-wider text-fg-tertiary">
                  Calories / day
                </p>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      ),
    },
  ],

  popover: [
    {
      id: "with-content",
      title: "With content",
      description:
        "A floating surface anchored to a trigger — ideal for inline editors and pickers.",
      code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Dimensions</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80" align="start">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium text-fg">Dimensions</h4>
        <p className="text-sm text-fg-secondary">Set the dimensions for the layer.</p>
      </div>
      <div className="grid gap-3">
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-3">
          <Label htmlFor="height">Height</Label>
          <Input id="height" defaultValue="auto" className="col-span-2 h-8" />
        </div>
      </div>
    </div>
  </PopoverContent>
</Popover>`,
      preview: (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Dimensions</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-medium text-fg">Dimensions</h4>
                <p className="text-sm text-fg-secondary">Set the dimensions for the layer.</p>
              </div>
              <div className="grid gap-3">
                <div className="grid grid-cols-3 items-center gap-3">
                  <Label htmlFor="width">Width</Label>
                  <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-3">
                  <Label htmlFor="height">Height</Label>
                  <Input id="height" defaultValue="auto" className="col-span-2 h-8" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ],

  "notification-center": [
    {
      id: "inbox",
      title: "Inbox",
      description:
        "A bell-trigger inbox built on Popover. The badge counts unread items; clicking a row marks it read, and “Mark all read” clears them all. Pass an optional `footer` for a “View all” link.",
      code: `const INITIAL: NotificationItem[] = [
  {
    id: "mention",
    title: "Ada mentioned you",
    description: "“@you can you review the payout rail PR?”",
    timestamp: "2m ago",
    icon: <MessageSquare aria-hidden="true" />,
  },
  {
    id: "star",
    title: "Your release hit 1,000 stars",
    description: "cronus-ui reached a new milestone.",
    timestamp: "1h ago",
    icon: <Heart aria-hidden="true" />,
  },
  {
    id: "invite",
    title: "New teammate joined",
    description: "Grace accepted your invite to Acme.",
    timestamp: "Yesterday",
    avatar: { fallback: "GR" },
    read: true,
  },
];

function NotificationCenterDemo() {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL);

  return (
    <NotificationCenter
      notifications={items}
      onMarkAllRead={() => setItems((prev) => prev.map((i) => ({ ...i, read: true })))}
      onNotificationClick={(id) =>
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)))
      }
      footer={
        <Button variant="link" size="sm" className="h-auto px-0">
          View all notifications
        </Button>
      }
    />
  );
}`,
      preview: <NotificationCenterDemo />,
    },
  ],

  "hover-card": [
    {
      id: "profile-preview",
      title: "Profile preview",
      description: "A preview card that appears on hover or focus — great for profile mentions.",
      code: `<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link" className="px-0">
      @cronus
    </Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="flex gap-3">
      <span
        className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground"
        aria-hidden="true"
      >
        <Users className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-fg">Cronus</p>
        <p className="text-sm text-fg-secondary">
          The token-driven design system that themes itself.
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-fg-tertiary">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          Joined June 2026
        </div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`,
      preview: (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="px-0">
              @cronus
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex gap-3">
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground"
                aria-hidden="true"
              >
                <Users className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-fg">Cronus</p>
                <p className="text-sm text-fg-secondary">
                  The token-driven design system that themes itself.
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-fg-tertiary">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  Joined June 2026
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
    },
  ],

  tooltip: [
    {
      id: "on-a-button",
      title: "On a button",
      description: "A small label revealed on hover or focus, mounted inside a shared provider.",
      code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" size="icon" aria-label="Add to library">
        <Plus aria-hidden="true" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Add to library</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">
        <HelpCircle aria-hidden="true" />
        Need help?
      </Button>
    </TooltipTrigger>
    <TooltipContent>We usually reply within minutes.</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
      preview: (
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Add to library">
                  <Plus aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add to library</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <HelpCircle aria-hidden="true" />
                  Need help?
                </Button>
              </TooltipTrigger>
              <TooltipContent>We usually reply within minutes.</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
  ],

  "dropdown-menu": [
    {
      id: "actions",
      title: "Actions",
      description: "A rich menu with icons, shortcuts, a checkbox item, and a submenu.",
      code: `function ActionsMenu() {
  const [showStatusBar, setShowStatusBar] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User aria-hidden="true" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard aria-hidden="true" />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings aria-hidden="true" />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Show status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Users aria-hidden="true" />
            Invite team
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <UserPlus aria-hidden="true" />
              Email invite
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy aria-hidden="true" />
              Copy invite link
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
      preview: <ActionsMenuDemo />,
    },
  ],

  "context-menu": [
    {
      id: "on-a-surface",
      title: "On a surface",
      description:
        "A right-click menu on a target region — with shortcuts, a checkbox, a submenu and a radio group.",
      code: `function ContextMenuDemo() {
  const [bookmarked, setBookmarked] = useState(true);
  const [branch, setBranch] = useState("main");

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-36 w-full max-w-sm select-none items-center justify-center rounded-lg border border-dashed border-border text-sm text-fg-secondary">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem>
          <Scissors aria-hidden="true" />
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy aria-hidden="true" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <ClipboardPaste aria-hidden="true" />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={bookmarked} onCheckedChange={setBookmarked}>
          Bookmarked
        </ContextMenuCheckboxItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Users aria-hidden="true" />
            Share
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>
              <UserPlus aria-hidden="true" />
              Invite people
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy aria-hidden="true" />
              Copy link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuLabel>Branch</ContextMenuLabel>
        <ContextMenuRadioGroup value={branch} onValueChange={setBranch}>
          <ContextMenuRadioItem value="main">main</ContextMenuRadioItem>
          <ContextMenuRadioItem value="develop">develop</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}`,
      preview: <ContextMenuDemo />,
    },
  ],

  command: [
    {
      id: "command-palette",
      title: "Command palette",
      description: "A command palette with fuzzy search — open it with the button or ⌘K / Ctrl+K.",
      code: `function CommandPalette() {
  const [open, setOpen] = useState(false);

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
        Open command palette
        <Badge variant="secondary" className="ml-1 font-mono text-[10px]">
          ⌘K
        </Badge>
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
            <CommandItem onSelect={() => setOpen(false)}>
              <Copy aria-hidden="true" />
              Copy link
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setOpen(false)}>
              <Settings aria-hidden="true" />
              Settings
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <Keyboard aria-hidden="true" />
              Keyboard shortcuts
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <LifeBuoy aria-hidden="true" />
              Help &amp; support
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}`,
      preview: <CommandPaletteDemo />,
    },
  ],
  lightbox: [
    {
      id: "gallery",
      title: "Gallery",
      description:
        "A controlled full-screen gallery: clicking a thumbnail opens the lightbox at that image. Arrow keys (or the on-image controls and thumbnail strip) move between images, and the counter tracks position.",
      code: `function LightboxDemo() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const images = [
    { src: "/photos/1.jpg", alt: "Mountain ridge at dawn" },
    { src: "/photos/2.jpg", alt: "Coastline from above" },
    // …
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          >
            <img src={image.src} alt={image.alt} />
          </button>
        ))}
      </div>
      <Lightbox
        images={images}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}`,
      preview: <LightboxDemo />,
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function OverlaysExamples({ slug }: { slug: string }) {
  return <ExampleList examples={overlaysExamples[slug] ?? []} />;
}
