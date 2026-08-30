"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AppShell,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  TableOfContents,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  WorkspaceSwitcher,
} from "@cronus-ui/ui";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Calendar,
  Home,
  Inbox,
  Italic,
  Search,
  Settings,
  Underline,
} from "lucide-react";
import { useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

const WORKSPACES = [
  { id: "cronus", name: "Cronus", initials: "CR" },
  { id: "northwind", name: "Northwind", initials: "NW" },
  { id: "acme", name: "Acme", initials: "AC" },
];

function WorkspaceSwitcherDemo() {
  const [workspaceId, setWorkspaceId] = useState("cronus");
  return (
    <div className="w-56">
      <WorkspaceSwitcher
        workspaces={WORKSPACES}
        value={workspaceId}
        onValueChange={setWorkspaceId}
      />
    </div>
  );
}

function MenubarDemo() {
  const [showFullPath, setShowFullPath] = useState(true);
  const [profile, setProfile] = useState("benoit");

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print…
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showFullPath} onCheckedChange={setShowFullPath}>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={profile} onValueChange={setProfile}>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="evil-rabbit">Evil Rabbit</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function ToolbarDemo() {
  const [marks, setMarks] = useState({ bold: true, italic: false, underline: false });
  const [align, setAlign] = useState<"left" | "center" | "right">("left");

  const toggle = (mark: keyof typeof marks) =>
    setMarks((prev) => ({ ...prev, [mark]: !prev[mark] }));

  return (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold" pressed={marks.bold} onClick={() => toggle("bold")}>
          <Bold aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic" pressed={marks.italic} onClick={() => toggle("italic")}>
          <Italic aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Underline"
          pressed={marks.underline}
          onClick={() => toggle("underline")}
        >
          <Underline aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton
          aria-label="Align left"
          pressed={align === "left"}
          onClick={() => setAlign("left")}
        >
          <AlignLeft aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Align center"
          pressed={align === "center"}
          onClick={() => setAlign("center")}
        >
          <AlignCenter aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton
          aria-label="Align right"
          pressed={align === "right"}
          onClick={() => setAlign("right")}
        >
          <AlignRight aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  );
}

const TOC_DEMO_SECTIONS = [
  {
    id: "toc-demo-overview",
    label: "Overview",
    body: "A scrollspy table of contents keeps the link for the section you are reading highlighted, with an indicator bar that glides to the active row.",
  },
  {
    id: "toc-demo-install",
    label: "Installation",
    body: "Install the package from npm, or copy the component straight into your project with the CLI.",
  },
  {
    id: "toc-demo-cli",
    label: "With the CLI",
    depth: 1,
    body: "npx cronus-ui add table-of-contents drops the source file into your components directory.",
  },
  {
    id: "toc-demo-manual",
    label: "Manual setup",
    depth: 1,
    body: "Prefer vendoring? Copy the file and keep full ownership — it has zero extra dependencies.",
  },
  {
    id: "toc-demo-theming",
    label: "Theming",
    body: "Every color flows from semantic tokens, so the nav follows your theme in light and dark mode.",
  },
  {
    id: "toc-demo-api",
    label: "API reference",
    body: "Pass items for full control, or point selector and containerId at your article to auto-discover headings.",
  },
];

function TableOfContentsDemo() {
  return (
    <div className="flex w-full max-w-2xl gap-6">
      <TableOfContents
        items={TOC_DEMO_SECTIONS}
        containerId="toc-demo-article"
        offset={12}
        className="w-44 shrink-0 self-start"
      />
      {/* A named <section> is a scrollable region; it must be keyboard-focusable
          (axe scrollable-region-focusable) so users can scroll it with the arrow keys. */}
      <section
        id="toc-demo-article"
        aria-label="Article content"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be keyboard-focusable (WCAG / axe scrollable-region-focusable)
        tabIndex={0}
        className="h-64 flex-1 overflow-y-auto rounded-xl border border-border bg-surface-inset p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
      >
        {TOC_DEMO_SECTIONS.map((section) => (
          <section key={section.id} className="mb-6 last:mb-0 last:min-h-56">
            <h3 id={section.id} className="text-sm font-semibold text-fg">
              {section.label}
            </h3>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-fg-secondary">
              {section.body}
            </p>
          </section>
        ))}
      </section>
    </div>
  );
}

export const navigationExamples: ExampleMap = {
  tabs: [
    {
      id: "three-tabs",
      title: "Three tabs",
      description: "Switch between related panels of content within a single surface.",
      code: `<Tabs defaultValue="account" className="w-full max-w-md">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
  </TabsList>
  <TabsContent value="account" className="pt-4">
    <p className="text-sm text-fg-secondary">
      Manage your account details and public profile.
    </p>
  </TabsContent>
  <TabsContent value="password" className="pt-4">
    <p className="text-sm text-fg-secondary">
      Change your password and configure two-factor authentication.
    </p>
  </TabsContent>
  <TabsContent value="team" className="pt-4">
    <p className="text-sm text-fg-secondary">
      Invite teammates and manage their roles and permissions.
    </p>
  </TabsContent>
</Tabs>`,
      preview: (
        <Tabs defaultValue="account" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="pt-4">
            <p className="text-sm text-fg-secondary">
              Manage your account details and public profile.
            </p>
          </TabsContent>
          <TabsContent value="password" className="pt-4">
            <p className="text-sm text-fg-secondary">
              Change your password and configure two-factor authentication.
            </p>
          </TabsContent>
          <TabsContent value="team" className="pt-4">
            <p className="text-sm text-fg-secondary">
              Invite teammates and manage their roles and permissions.
            </p>
          </TabsContent>
        </Tabs>
      ),
    },
  ],

  accordion: [
    {
      id: "faq",
      title: "FAQ",
      description: "Single-open, collapsible disclosure panels for FAQs and dense content.",
      code: `<Accordion type="single" collapsible className="w-full max-w-md">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It follows the WAI-ARIA disclosure pattern and is fully keyboard
      navigable.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it themeable?</AccordionTrigger>
    <AccordionContent>
      Absolutely. Every color, radius, and shadow flows from semantic design
      tokens.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger>Is it animated?</AccordionTrigger>
    <AccordionContent>
      Yes — content expands and collapses with a smooth height transition.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
      preview: (
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It follows the WAI-ARIA disclosure pattern and is fully keyboard navigable.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it themeable?</AccordionTrigger>
            <AccordionContent>
              Absolutely. Every color, radius, and shadow flows from semantic design tokens.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes — content expands and collapses with a smooth height transition.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
  ],

  breadcrumb: [
    {
      id: "trail",
      title: "Trail",
      description: "Shows the path to the current page, with the active page as plain text.",
      code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Button</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
      preview: (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Button</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ),
    },
  ],

  pagination: [
    {
      id: "pager",
      title: "Pager",
      description: "Navigate paginated content with previous, page links, an ellipsis, and next.",
      code: `<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
      preview: (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ),
    },
  ],

  "navigation-menu": [
    {
      id: "menu-bar",
      title: "Menu bar",
      description:
        "A horizontal menu bar with a disclosure panel of links and a flat link, fully keyboard navigable.",
      code: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[22rem] gap-1">
          <li>
            <NavigationMenuLink href="#">
              <span className="font-medium text-fg">Analytics</span>
              <span className="text-fg-tertiary">Real-time dashboards and reports.</span>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink href="#">
              <span className="font-medium text-fg">Automations</span>
              <span className="text-fg-tertiary">Wire up rules and workflows.</span>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
        Docs
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
      preview: (
        // Reserve vertical room + top-align so the disclosure panel (an absolute
        // viewport) opens *inside* the preview frame instead of being clipped.
        <div className="flex min-h-[16rem] w-full items-start justify-center pt-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[22rem] gap-1">
                    <li>
                      <NavigationMenuLink href="#">
                        <span className="font-medium text-fg">Analytics</span>
                        <span className="text-fg-tertiary">Real-time dashboards and reports.</span>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink href="#">
                        <span className="font-medium text-fg">Automations</span>
                        <span className="text-fg-tertiary">Wire up rules and workflows.</span>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                  Docs
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ),
    },
  ],

  menubar: [
    {
      id: "menus",
      title: "Menus",
      description:
        "A desktop-style menu bar with File / Edit / View menus — shortcuts, a checkbox and a radio group.",
      code: `function MenubarDemo() {
  const [showFullPath, setShowFullPath] = useState(true);
  const [profile, setProfile] = useState("benoit");

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print…
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showFullPath} onCheckedChange={setShowFullPath}>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={profile} onValueChange={setProfile}>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="evil-rabbit">Evil Rabbit</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}`,
      preview: <MenubarDemo />,
    },
  ],

  sidebar: [
    {
      id: "collapsible-nav",
      title: "Collapsible navigation",
      description:
        "A composable app sidebar with grouped menu items, a header and footer. Use the trigger to collapse it to icons.",
      code: `<SidebarProvider className="!min-h-0 h-full">
  <Sidebar collapsible="icon" className="!h-full">
    <SidebarHeader>
      <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Home">
                <Home />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Inbox">
                <Inbox />
                <span>Inbox</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Calendar">
                <Calendar />
                <span>Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Settings">
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
  <div className="flex flex-1 flex-col gap-3 p-4">
    <SidebarTrigger />
    <p className="text-sm text-fg-secondary">Toggle the sidebar with the button above.</p>
  </div>
</SidebarProvider>`,
      preview: (
        <div className="h-[28rem] w-full overflow-hidden rounded-xl border border-border">
          <SidebarProvider className="!min-h-0 h-full">
            <Sidebar collapsible="icon" className="!h-full">
              <SidebarHeader>
                <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="Home">
                          <Home />
                          <span>Home</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Inbox">
                          <Inbox />
                          <span>Inbox</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Calendar">
                          <Calendar />
                          <span>Calendar</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <SidebarTrigger />
              <p className="text-sm text-fg-secondary">Toggle the sidebar with the button above.</p>
            </div>
          </SidebarProvider>
        </div>
      ),
    },
  ],

  "app-shell": [
    {
      id: "shell-layout",
      title: "Shell layout",
      description:
        "AppShell composes a sidebar, a sticky header and a content region in one step. It never renders a <main> — the route owns that landmark.",
      code: `<AppShell
  header={
    <>
      <SidebarTrigger />
      <span className="text-sm font-medium text-fg">Dashboard</span>
    </>
  }
  sidebar={
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Home">
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Search">
                  <Search />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  }
>
  <div className="p-6 text-sm text-fg-secondary">Your page content goes here.</div>
</AppShell>`,
      preview: (
        <div className="h-[28rem] w-full overflow-hidden rounded-xl border border-border [&_[data-slot=app-shell-content]]:!min-h-0 [&_[data-slot=sidebar-wrapper]]:!min-h-0 [&_[data-slot=sidebar]]:!h-full">
          <AppShell
            className="h-full"
            header={
              <>
                <SidebarTrigger />
                <span className="text-sm font-medium text-fg">Dashboard</span>
              </>
            }
            sidebar={
              <Sidebar collapsible="icon">
                <SidebarHeader>
                  <span className="px-2 text-sm font-semibold text-fg">Acme Inc.</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive tooltip="Home">
                            <Home />
                            <span>Home</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton tooltip="Search">
                            <Search />
                            <span>Search</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
              </Sidebar>
            }
          >
            <div className="p-6 text-sm text-fg-secondary">Your page content goes here.</div>
          </AppShell>
        </div>
      ),
    },
  ],

  "workspace-switcher": [
    {
      id: "basic",
      title: "Basic",
      description:
        "A compact workspace switcher. The trigger shows the current avatar, name, and chevron; picking another row calls `onValueChange` with that workspace id.",
      code: `function WorkspaceSwitcherDemo() {
  const [workspaceId, setWorkspaceId] = useState("cronus");
  const workspaces = [
    { id: "cronus", name: "Cronus", initials: "CR" },
    { id: "northwind", name: "Northwind", initials: "NW" },
    { id: "acme", name: "Acme", initials: "AC" },
  ];

  return (
    <div className="w-56">
      <WorkspaceSwitcher
        workspaces={workspaces}
        value={workspaceId}
        onValueChange={setWorkspaceId}
      />
    </div>
  );
}`,
      preview: <WorkspaceSwitcherDemo />,
    },
    {
      id: "sidebar",
      title: "In a sidebar",
      description:
        "Drop the switcher under a brand row in `SidebarHeader`. The trigger stretches to the sidebar width.",
      code: `<SidebarProvider>
  <Sidebar collapsible="none">
    <SidebarHeader>
      <span className="px-2 text-sm font-semibold text-fg">Cronus</span>
      <WorkspaceSwitcher
        workspaces={[
          { id: "cronus", name: "Cronus", initials: "CR" },
          { id: "northwind", name: "Northwind", initials: "NW" },
          { id: "acme", name: "Acme", initials: "AC" },
        ]}
        defaultValue="cronus"
      />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <Home />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`,
      preview: (
        <div className="h-[22rem] w-full overflow-hidden rounded-xl border border-border [&_[data-slot=sidebar-wrapper]]:!min-h-0 [&_[data-slot=sidebar]]:!h-full">
          <SidebarProvider className="min-h-0 h-full">
            <Sidebar collapsible="none" className="h-full">
              <SidebarHeader>
                <span className="px-2 text-sm font-semibold text-fg">Cronus</span>
                <WorkspaceSwitcher workspaces={WORKSPACES} defaultValue="cronus" />
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive>
                          <Home />
                          <span>Home</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </div>
      ),
    },
  ],

  resizable: [
    {
      id: "split-panes",
      title: "Split panes",
      description:
        "Drag the divider to resize. A horizontal group nests a vertical one for a three-pane layout.",
      code: `<ResizablePanelGroup
  direction="horizontal"
  className="h-48 max-w-2xl rounded-lg border border-border"
>
  <ResizablePanel defaultSize={35} minSize={20}>
    <div className="flex h-full items-center justify-center p-4 text-sm text-fg-secondary">
      Sidebar
    </div>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={65}>
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-4 text-sm text-fg-secondary">
          Content
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center p-4 text-sm text-fg-secondary">
          Console
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </ResizablePanel>
</ResizablePanelGroup>`,
      preview: (
        <ResizablePanelGroup
          direction="horizontal"
          className="h-48 max-w-2xl rounded-lg border border-border"
        >
          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="flex h-full items-center justify-center p-4 text-sm text-fg-secondary">
              Sidebar
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60}>
                <div className="flex h-full items-center justify-center p-4 text-sm text-fg-secondary">
                  Content
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={40}>
                <div className="flex h-full items-center justify-center p-4 text-sm text-fg-secondary">
                  Console
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      ),
    },
  ],
  toolbar: [
    {
      id: "formatting",
      title: "Formatting",
      description:
        'An accessible `role="toolbar"` with roving tabindex — Tab moves in, then the arrow keys move between buttons. Toggle buttons reflect `aria-pressed`, and a separator splits the text marks from the alignment group.',
      code: `function ToolbarDemo() {
  const [marks, setMarks] = useState({ bold: true, italic: false, underline: false });
  const [align, setAlign] = useState("left");

  return (
    <Toolbar aria-label="Formatting">
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold" pressed={marks.bold}>
          <Bold aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic" pressed={marks.italic}>
          <Italic aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline" pressed={marks.underline}>
          <Underline aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Align left" pressed={align === "left"}>
          <AlignLeft aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Align center" pressed={align === "center"}>
          <AlignCenter aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton aria-label="Align right" pressed={align === "right"}>
          <AlignRight aria-hidden="true" />
        </ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  );
}`,
      preview: <ToolbarDemo />,
    },
  ],
  "table-of-contents": [
    {
      id: "scrollspy",
      title: "Scrollspy article",
      description:
        "An IntersectionObserver tracks the section being read — the active link gains aria-current and the indicator bar glides to its row. Clicking a link smooth-scrolls the container (instant under reduced motion).",
      code: `const sections = [
  { id: "overview", label: "Overview" },
  { id: "install", label: "Installation" },
  { id: "cli", label: "With the CLI", depth: 1 },
  { id: "manual", label: "Manual setup", depth: 1 },
  { id: "theming", label: "Theming" },
  { id: "api", label: "API reference" },
];

<div className="flex gap-6">
  <TableOfContents
    items={sections}
    containerId="article"
    offset={12}
    className="w-44 shrink-0 self-start"
  />
  <section
    id="article"
    aria-label="Article content"
    tabIndex={0}
    className="h-64 flex-1 overflow-y-auto rounded-xl border border-border p-5"
  >
    {sections.map((section) => (
      <section key={section.id} className="mb-6 last:mb-0 last:min-h-56">
        <h3 id={section.id} className="text-sm font-semibold text-fg">
          {section.label}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-fg-secondary">…</p>
      </section>
    ))}
  </section>
</div>`,
      preview: <TableOfContentsDemo />,
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function NavigationExamples({ slug }: { slug: string }) {
  return <ExampleList examples={navigationExamples[slug] ?? []} />;
}
