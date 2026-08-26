"use client";

import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Combobox,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToggleGroup,
  ToggleGroupItem,
} from "@cronus-ui/ui";
import {
  Download,
  FileQuestion,
  Inbox,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import { StatusPageBlock, statusPageCode } from "./status-page";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Page header — title, description, breadcrumb, actions (+ tabs variant)
 * ────────────────────────────────────────────────────────────────────────── */

export function PageHeaderBlock() {
  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-6 sm:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#projects"
              className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#aurora"
              className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Aurora
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">
              Project settings
            </h1>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="max-w-xl text-sm text-fg-secondary">
            Manage the configuration, members, and billing for the Aurora workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline">
            <Download className="size-4" aria-hidden="true" />
            Export
          </Button>
          <Button variant="primary">
            <Plus className="size-4" aria-hidden="true" />
            New deploy
          </Button>
        </div>
      </div>
    </header>
  );
}

const pageHeaderCode = `import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from "@cronus-ui/ui";
import { Download, Plus } from "lucide-react";

export function PageHeaderBlock() {
  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-6 sm:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#aurora">Aurora</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">
              Project settings
            </h1>
            <Badge variant="success">Active</Badge>
          </div>
          <p className="max-w-xl text-sm text-fg-secondary">
            Manage the configuration, members, and billing for the Aurora workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline">
            <Download className="size-4" aria-hidden="true" />
            Export
          </Button>
          <Button variant="primary">
            <Plus className="size-4" aria-hidden="true" />
            New deploy
          </Button>
        </div>
      </div>
    </header>
  );
}`;

export function PageHeaderTabsBlock() {
  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-6 sm:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#workspace"
              className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Workspace
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Billing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">Billing</h1>
            <Badge variant="primary">Pro plan</Badge>
          </div>
          <p className="max-w-xl text-sm text-fg-secondary">
            Review usage, invoices, and payment methods for your team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline">View invoices</Button>
          <Button variant="primary">Manage plan</Button>
        </div>
      </div>

      {/*
       * Each TabsTrigger emits `aria-controls` pointing at its panel, so the
       * matching TabsContent must exist in the DOM. `forceMount` keeps every
       * panel mounted (Radix hides the inactive ones) — this clears axe's
       * `aria-valid-attr-value` on the trigger.
       */}
      <Tabs defaultValue="overview">
        <TabsList aria-label="Billing sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        <TabsContent forceMount value="overview" className="text-sm text-fg-secondary">
          Plan, seats, and renewal date at a glance.
        </TabsContent>
        <TabsContent forceMount value="usage" className="text-sm text-fg-secondary">
          Metered usage for the current billing period.
        </TabsContent>
        <TabsContent forceMount value="invoices" className="text-sm text-fg-secondary">
          Download past invoices and receipts.
        </TabsContent>
        <TabsContent forceMount value="payment" className="text-sm text-fg-secondary">
          Manage cards and billing contacts.
        </TabsContent>
      </Tabs>
    </header>
  );
}

const pageHeaderTabsCode = `import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cronus-ui/ui";

export function PageHeaderTabsBlock() {
  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-border bg-surface-raised p-6 sm:p-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#workspace">Workspace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Billing</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-fg">Billing</h1>
            <Badge variant="primary">Pro plan</Badge>
          </div>
          <p className="max-w-xl text-sm text-fg-secondary">
            Review usage, invoices, and payment methods for your team.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline">View invoices</Button>
          <Button variant="primary">Manage plan</Button>
        </div>
      </div>

      {/* forceMount keeps every panel in the DOM so each trigger's aria-controls resolves. */}
      <Tabs defaultValue="overview">
        <TabsList aria-label="Billing sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        <TabsContent forceMount value="overview" className="text-sm text-fg-secondary">
          Plan, seats, and renewal date at a glance.
        </TabsContent>
        <TabsContent forceMount value="usage" className="text-sm text-fg-secondary">
          Metered usage for the current billing period.
        </TabsContent>
        <TabsContent forceMount value="invoices" className="text-sm text-fg-secondary">
          Download past invoices and receipts.
        </TabsContent>
        <TabsContent forceMount value="payment" className="text-sm text-fg-secondary">
          Manage cards and billing contacts.
        </TabsContent>
      </Tabs>
    </header>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Filter bar — search, filters, view toggle, result count
 * ────────────────────────────────────────────────────────────────────────── */

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
];

const ownerOptions = [
  { label: "Mara Castillo", value: "mara" },
  { label: "Devon Lane", value: "devon" },
  { label: "Priya Sharma", value: "priya" },
  { label: "Aiko Tanaka", value: "aiko" },
];

export function FilterBarBlock() {
  return (
    <section
      aria-label="Project filters"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label htmlFor="filter-bar-search" className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search projects</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <Input id="filter-bar-search" placeholder="Search projects..." className="pl-9" />
        </label>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full sm:w-44">
            <Select defaultValue="active">
              <SelectTrigger aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-52">
            <Combobox
              options={ownerOptions}
              defaultValue="mara"
              placeholder="Owner"
              searchPlaceholder="Search owners..."
              emptyText="No owner found."
              aria-label="Filter by owner"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <ToggleGroup type="single" defaultValue="grid" variant="outline" aria-label="View layout">
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="size-4" aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="size-4" aria-hidden="true" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-fg-tertiary">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Filters
          </span>
          <Badge variant="secondary" className="gap-1.5 pr-1">
            Status: Active
            <button
              type="button"
              aria-label="Remove status filter"
              className="rounded-sm outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </Badge>
          <Badge variant="secondary" className="gap-1.5 pr-1">
            Owner: Mara Castillo
            <button
              type="button"
              aria-label="Remove owner filter"
              className="rounded-sm outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        </div>
        <span className="text-sm text-fg-tertiary">12 projects</span>
      </div>
    </section>
  );
}

const filterBarCode = `import {
  Badge,
  Combobox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from "@cronus-ui/ui";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
];

const ownerOptions = [
  { label: "Mara Castillo", value: "mara" },
  { label: "Devon Lane", value: "devon" },
  { label: "Priya Sharma", value: "priya" },
  { label: "Aiko Tanaka", value: "aiko" },
];

export function FilterBarBlock() {
  return (
    <section
      aria-label="Project filters"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label htmlFor="filter-bar-search" className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search projects</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <Input id="filter-bar-search" placeholder="Search projects..." className="pl-9" />
        </label>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="w-full sm:w-44">
            <Select defaultValue="active">
              <SelectTrigger aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-52">
            <Combobox
              options={ownerOptions}
              defaultValue="mara"
              placeholder="Owner"
              searchPlaceholder="Search owners..."
              emptyText="No owner found."
              aria-label="Filter by owner"
            />
          </div>
        </div>

        <ToggleGroup type="single" defaultValue="grid" variant="outline" aria-label="View layout">
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="size-4" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="size-4" aria-hidden="true" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-fg-tertiary">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            Filters
          </span>
          <Badge variant="secondary" className="gap-1.5 pr-1">
            Status: Active
            <button type="button" aria-label="Remove status filter" className="rounded-sm hover:text-fg">
              <X className="size-3" aria-hidden="true" />
            </button>
          </Badge>
          <Badge variant="secondary" className="gap-1.5 pr-1">
            Owner: Mara Castillo
            <button type="button" aria-label="Remove owner filter" className="rounded-sm hover:text-fg">
              <X className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        </div>
        <span className="text-sm text-fg-tertiary">12 projects</span>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Empty state — empty list / error (404)
 * ────────────────────────────────────────────────────────────────────────── */

export function EmptyStateBlock() {
  return (
    <Empty className="bg-surface-raised">
      <EmptyIcon>
        <Inbox aria-hidden="true" />
      </EmptyIcon>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        Create your first project to start shipping. You can invite teammates and connect a
        repository at any time.
      </EmptyDescription>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Import existing
        </Button>
        <Button variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New project
        </Button>
      </EmptyContent>
    </Empty>
  );
}

const emptyStateCode = `import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@cronus-ui/ui";
import { Inbox, Plus } from "lucide-react";

export function EmptyStateBlock() {
  return (
    <Empty className="bg-surface-raised">
      <EmptyIcon>
        <Inbox aria-hidden="true" />
      </EmptyIcon>
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        Create your first project to start shipping. You can invite teammates and connect a
        repository at any time.
      </EmptyDescription>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Import existing
        </Button>
        <Button variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New project
        </Button>
      </EmptyContent>
    </Empty>
  );
}`;

export function EmptyStateErrorBlock() {
  return (
    <Empty className="border-error/30 bg-surface-raised">
      <EmptyIcon className="bg-error/15 text-error">
        <FileQuestion aria-hidden="true" />
      </EmptyIcon>
      <EmptyTitle>Something went wrong</EmptyTitle>
      <EmptyDescription>
        We couldn&apos;t load this page. The link may be broken or the resource may have been moved.
        Try again, or head back to your dashboard.
      </EmptyDescription>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Back to dashboard
        </Button>
        <Button variant="primary" size="sm">
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}

const emptyStateErrorCode = `import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyIcon,
  EmptyTitle,
} from "@cronus-ui/ui";
import { FileQuestion, RefreshCw } from "lucide-react";

export function EmptyStateErrorBlock() {
  return (
    <Empty className="border-error/30 bg-surface-raised">
      <EmptyIcon className="bg-error/15 text-error">
        <FileQuestion aria-hidden="true" />
      </EmptyIcon>
      <EmptyTitle>Something went wrong</EmptyTitle>
      <EmptyDescription>
        We couldn&apos;t load this page. The link may be broken or the resource may have been
        moved. Try again, or head back to your dashboard.
      </EmptyDescription>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Back to dashboard
        </Button>
        <Button variant="primary" size="sm">
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      </EmptyContent>
    </Empty>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const pageBlocks: BlockContentMap = {
  "page-header": {
    preview: <PageHeaderBlock />,
    code: pageHeaderCode,
    variants: [
      {
        id: "with-actions",
        name: "Title and actions",
        description:
          "Breadcrumb, title with status badge, supporting copy, and primary/secondary actions.",
        appearance: "dark",
        preview: <PageHeaderBlock />,
        code: pageHeaderCode,
      },
      {
        id: "with-tabs",
        name: "Title and tabs",
        description: "Adds a section tab row beneath the header for switching detail views.",
        appearance: "light",
        preview: <PageHeaderTabsBlock />,
        code: pageHeaderTabsCode,
      },
    ],
  },
  "filter-bar": {
    preview: <FilterBarBlock />,
    code: filterBarCode,
    variants: [
      {
        id: "toolbar",
        name: "Search and filters",
        description:
          "Search input, status select, owner combobox, list/grid toggle, removable filter chips, and a result count.",
        appearance: "dark",
        preview: <FilterBarBlock />,
        code: filterBarCode,
      },
    ],
  },
  "empty-state": {
    preview: <EmptyStateBlock />,
    code: emptyStateCode,
    variants: [
      {
        id: "empty",
        name: "Empty list",
        description: "A friendly empty list with an illustration, guidance, and creation CTAs.",
        appearance: "dark",
        preview: <EmptyStateBlock />,
        code: emptyStateCode,
      },
      {
        id: "error",
        name: "Error / not found",
        description: "An error state for failed loads or 404s, with retry and recovery actions.",
        appearance: "light",
        preview: <EmptyStateErrorBlock />,
        code: emptyStateErrorCode,
      },
    ],
  },
  "status-page": {
    preview: <StatusPageBlock />,
    code: statusPageCode,
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function PageGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(pageBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function PageView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(pageBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
