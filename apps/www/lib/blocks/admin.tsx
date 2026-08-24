"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sparkline,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import {
  CalendarDays,
  ChevronRight,
  Download,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  UserPlus,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. User management — directory table with search, role filter & actions
 * ────────────────────────────────────────────────────────────────────────── */

interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  status: "Active" | "Invited" | "Suspended";
  statusVariant: "success" | "warning" | "destructive";
  lastActive: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "usr-01",
    name: "Ingrid Solberg",
    email: "ingrid@meridianhq.com",
    initials: "IS",
    role: "Owner",
    roleVariant: "primary",
    status: "Active",
    statusVariant: "success",
    lastActive: "2 minutes ago",
  },
  {
    id: "usr-02",
    name: "Marcus Chen",
    email: "marcus.chen@meridianhq.com",
    initials: "MC",
    role: "Admin",
    roleVariant: "info",
    status: "Active",
    statusVariant: "success",
    lastActive: "1 hour ago",
  },
  {
    id: "usr-03",
    name: "Amara Diallo",
    email: "amara.diallo@meridianhq.com",
    initials: "AD",
    role: "Editor",
    roleVariant: "secondary",
    status: "Active",
    statusVariant: "success",
    lastActive: "Yesterday",
  },
  {
    id: "usr-04",
    name: "Felix Weber",
    email: "felix.weber@meridianhq.com",
    initials: "FW",
    role: "Editor",
    roleVariant: "secondary",
    status: "Invited",
    statusVariant: "warning",
    lastActive: "Invite sent Jul 10",
  },
  {
    id: "usr-05",
    name: "Rosa Delgado",
    email: "rosa.delgado@meridianhq.com",
    initials: "RD",
    role: "Viewer",
    roleVariant: "secondary",
    status: "Active",
    statusVariant: "success",
    lastActive: "3 days ago",
  },
  {
    id: "usr-06",
    name: "Jonah Kaplan",
    email: "jonah.kaplan@meridianhq.com",
    initials: "JK",
    role: "Viewer",
    roleVariant: "secondary",
    status: "Suspended",
    statusVariant: "destructive",
    lastActive: "Apr 2, 2026",
  },
];

export function UserManagementTableBlock() {
  return (
    <Card aria-label="User management" className="mx-auto w-full max-w-5xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Team members</CardTitle>
        <CardDescription>Manage roles and access for the Meridian workspace.</CardDescription>
        <CardAction>
          <Button variant="gradient" size="sm">
            <UserPlus className="size-4" aria-hidden="true" />
            Invite member
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name or email…"
            aria-label="Search members"
            className="ps-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>

      <CardContent className="px-0 pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4 sm:ps-6">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="ps-4 sm:ps-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-fg">{member.name}</span>
                      <span className="truncate text-xs text-fg-tertiary">{member.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.roleVariant}>{member.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.statusVariant}>{member.status}</Badge>
                </TableCell>
                <TableCell className="text-fg-secondary">{member.lastActive}</TableCell>
                <TableCell className="pe-4 text-end sm:pe-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                        <span className="sr-only">Actions for {member.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      <DropdownMenuItem>Reset password</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-error-strong">
                        Suspend account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator />

      <CardFooter className="flex-wrap justify-between gap-3 py-4">
        <span className="text-sm text-fg-tertiary">Showing 6 of 24 members</span>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#previous" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-1" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-2">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-3">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-4">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}

const userManagementTableCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  status: "Active" | "Invited" | "Suspended";
  statusVariant: "success" | "warning" | "destructive";
  lastActive: string;
}

const teamMembers: TeamMember[] = [
  { id: "usr-01", name: "Ingrid Solberg", email: "ingrid@meridianhq.com", initials: "IS", role: "Owner", roleVariant: "primary", status: "Active", statusVariant: "success", lastActive: "2 minutes ago" },
  { id: "usr-02", name: "Marcus Chen", email: "marcus.chen@meridianhq.com", initials: "MC", role: "Admin", roleVariant: "info", status: "Active", statusVariant: "success", lastActive: "1 hour ago" },
  { id: "usr-03", name: "Amara Diallo", email: "amara.diallo@meridianhq.com", initials: "AD", role: "Editor", roleVariant: "secondary", status: "Active", statusVariant: "success", lastActive: "Yesterday" },
  { id: "usr-04", name: "Felix Weber", email: "felix.weber@meridianhq.com", initials: "FW", role: "Editor", roleVariant: "secondary", status: "Invited", statusVariant: "warning", lastActive: "Invite sent Jul 10" },
  { id: "usr-05", name: "Rosa Delgado", email: "rosa.delgado@meridianhq.com", initials: "RD", role: "Viewer", roleVariant: "secondary", status: "Active", statusVariant: "success", lastActive: "3 days ago" },
  { id: "usr-06", name: "Jonah Kaplan", email: "jonah.kaplan@meridianhq.com", initials: "JK", role: "Viewer", roleVariant: "secondary", status: "Suspended", statusVariant: "destructive", lastActive: "Apr 2, 2026" },
];

export function UserManagementTableBlock() {
  return (
    <Card aria-label="User management" className="mx-auto w-full max-w-5xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Team members</CardTitle>
        <CardDescription>Manage roles and access for the Meridian workspace.</CardDescription>
        <CardAction>
          <Button variant="gradient" size="sm">
            <UserPlus className="size-4" aria-hidden="true" />
            Invite member
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search by name or email…"
            aria-label="Search members"
            className="ps-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by role">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>

      <CardContent className="px-0 pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4 sm:ps-6">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="ps-4 sm:ps-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium text-fg">{member.name}</span>
                      <span className="truncate text-xs text-fg-tertiary">{member.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.roleVariant}>{member.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={member.statusVariant}>{member.status}</Badge>
                </TableCell>
                <TableCell className="text-fg-secondary">{member.lastActive}</TableCell>
                <TableCell className="pe-4 text-end sm:pe-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                        <span className="sr-only">Actions for {member.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      <DropdownMenuItem>Reset password</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-error-strong">
                        Suspend account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator />

      <CardFooter className="flex-wrap justify-between gap-3 py-4">
        <span className="text-sm text-fg-tertiary">Showing 6 of 24 members</span>
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#previous" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-1" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-2">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-3">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#page-4">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#next" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}`;

const smallTeam: TeamMember[] = [
  {
    id: "usr-11",
    name: "Priya Raman",
    email: "priya@lumastack.io",
    initials: "PR",
    role: "Owner",
    roleVariant: "primary",
    status: "Active",
    statusVariant: "success",
    lastActive: "Online now",
  },
  {
    id: "usr-12",
    name: "Diego Fuentes",
    email: "diego@lumastack.io",
    initials: "DF",
    role: "Admin",
    roleVariant: "info",
    status: "Active",
    statusVariant: "success",
    lastActive: "45 minutes ago",
  },
  {
    id: "usr-13",
    name: "Hana Yoshida",
    email: "hana@lumastack.io",
    initials: "HY",
    role: "Editor",
    roleVariant: "secondary",
    status: "Invited",
    statusVariant: "warning",
    lastActive: "Invite sent Jul 11",
  },
  {
    id: "usr-14",
    name: "Sam Whitfield",
    email: "sam@lumastack.io",
    initials: "SW",
    role: "Viewer",
    roleVariant: "secondary",
    status: "Active",
    statusVariant: "success",
    lastActive: "2 days ago",
  },
];

export function UserManagementCardsBlock() {
  return (
    <section aria-label="User management" className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold text-fg">Team members</h2>
          <p className="text-sm text-fg-secondary">4 of 10 seats used on the Starter plan.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search members…"
              aria-label="Search members"
              className="ps-9 sm:w-56"
            />
          </div>
          <Button variant="gradient" size="sm">
            <UserPlus className="size-4" aria-hidden="true" />
            Invite member
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {smallTeam.map((member) => (
          <Card key={member.id} className="gap-4 py-5 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-fg">{member.name}</span>
                  <span className="truncate text-xs text-fg-tertiary">{member.email}</span>
                </div>
              </div>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" aria-hidden="true" />
                      <span className="sr-only">Actions for {member.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Change role</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-error-strong">
                      Remove from team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-1.5">
              <Badge variant={member.roleVariant}>{member.role}</Badge>
              <Badge variant={member.statusVariant}>{member.status}</Badge>
            </CardContent>
            <Separator />
            <CardFooter className="justify-between">
              <span className="text-xs text-fg-tertiary">Last active</span>
              <span className="text-xs font-medium text-fg-secondary">{member.lastActive}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

const userManagementCardsCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Separator,
} from "@cooud-ui/ui";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  roleVariant: "primary" | "info" | "secondary";
  status: "Active" | "Invited" | "Suspended";
  statusVariant: "success" | "warning" | "destructive";
  lastActive: string;
}

const smallTeam: TeamMember[] = [
  { id: "usr-11", name: "Priya Raman", email: "priya@lumastack.io", initials: "PR", role: "Owner", roleVariant: "primary", status: "Active", statusVariant: "success", lastActive: "Online now" },
  { id: "usr-12", name: "Diego Fuentes", email: "diego@lumastack.io", initials: "DF", role: "Admin", roleVariant: "info", status: "Active", statusVariant: "success", lastActive: "45 minutes ago" },
  { id: "usr-13", name: "Hana Yoshida", email: "hana@lumastack.io", initials: "HY", role: "Editor", roleVariant: "secondary", status: "Invited", statusVariant: "warning", lastActive: "Invite sent Jul 11" },
  { id: "usr-14", name: "Sam Whitfield", email: "sam@lumastack.io", initials: "SW", role: "Viewer", roleVariant: "secondary", status: "Active", statusVariant: "success", lastActive: "2 days ago" },
];

export function UserManagementCardsBlock() {
  return (
    <section aria-label="User management" className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold text-fg">Team members</h2>
          <p className="text-sm text-fg-secondary">4 of 10 seats used on the Starter plan.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search members…"
              aria-label="Search members"
              className="ps-9 sm:w-56"
            />
          </div>
          <Button variant="gradient" size="sm">
            <UserPlus className="size-4" aria-hidden="true" />
            Invite member
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {smallTeam.map((member) => (
          <Card key={member.id} className="gap-4 py-5 shadow-xs">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-fg">{member.name}</span>
                  <span className="truncate text-xs text-fg-tertiary">{member.email}</span>
                </div>
              </div>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" aria-hidden="true" />
                      <span className="sr-only">Actions for {member.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Change role</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-error-strong">
                      Remove from team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-1.5">
              <Badge variant={member.roleVariant}>{member.role}</Badge>
              <Badge variant={member.statusVariant}>{member.status}</Badge>
            </CardContent>
            <Separator />
            <CardFooter className="justify-between">
              <span className="text-xs text-fg-tertiary">Last active</span>
              <span className="text-xs font-medium text-fg-secondary">{member.lastActive}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Analytics — KPI metrics, traffic trend & engagement cohorts
 * ────────────────────────────────────────────────────────────────────────── */

interface OverviewKpi {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  /** Tone override for deltas where the trend direction flips the sentiment. */
  deltaClassName?: string;
  tone: "primary" | "success" | "warning" | "info";
  series: number[];
}

interface BreakdownRow {
  id: string;
  label: string;
  value: string;
  share: number;
}

const overviewKpis: OverviewKpi[] = [
  {
    label: "Page views",
    value: "1.24M",
    delta: "+18.2%",
    trend: "up",
    tone: "primary",
    series: [86, 92, 88, 97, 104, 99, 112, 118, 115, 124],
  },
  {
    label: "Unique visitors",
    value: "312.4k",
    delta: "+9.6%",
    trend: "up",
    tone: "info",
    series: [58, 61, 60, 64, 66, 63, 68, 70, 69, 72],
  },
  {
    label: "Avg. session",
    value: "4m 32s",
    delta: "+12s",
    trend: "up",
    tone: "success",
    series: [238, 241, 246, 244, 252, 250, 258, 262, 266, 272],
  },
  {
    label: "Bounce rate",
    value: "38.1%",
    delta: "-2.4%",
    trend: "down",
    // A falling bounce rate is an improvement: keep the down arrow, show it as success.
    deltaClassName: "text-success-strong",
    tone: "warning",
    series: [44, 43, 43, 42, 41, 42, 40, 39, 39, 38],
  },
];

const trafficSeries = [
  24100, 25800, 24900, 26400, 27200, 26100, 28900, 30400, 29800, 31500, 30900, 32800, 34100, 33200,
  35600, 34800, 36900, 38200, 37400, 39800, 38900, 41200, 40500, 42800, 41900, 44100, 43600, 45900,
  46800, 47900,
];

const topPages: BreakdownRow[] = [
  { id: "home", label: "/", value: "284,912", share: 100 },
  { id: "pricing", label: "/pricing", value: "191,204", share: 67 },
  { id: "docs", label: "/docs/getting-started", value: "121,880", share: 43 },
  { id: "blog", label: "/blog/series-b", value: "98,414", share: 35 },
  { id: "changelog", label: "/changelog", value: "64,206", share: 23 },
];

const topReferrers: BreakdownRow[] = [
  { id: "google", label: "google.com", value: "142,310", share: 100 },
  { id: "github", label: "github.com", value: "87,650", share: 62 },
  { id: "twitter", label: "x.com", value: "56,982", share: 40 },
  { id: "newsletter", label: "Newsletter", value: "41,225", share: 29 },
  { id: "producthunt", label: "producthunt.com", value: "18,940", share: 13 },
];

const breakdownLists = [
  { id: "pages", title: "Top pages", caption: "By views", rows: topPages },
  { id: "referrers", title: "Top referrers", caption: "By sessions", rows: topReferrers },
];

export function AnalyticsOverviewBlock() {
  return (
    <section
      aria-label="Analytics overview"
      className="mx-auto flex w-full max-w-6xl flex-col gap-4"
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Analytics</h2>
          <p className="text-sm text-fg-secondary">
            Product and marketing traffic across meridianhq.com.
          </p>
        </div>
        <Badge variant="success">Live</Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewKpis.map((kpi) => (
          <Card key={kpi.label} className="gap-0 py-5">
            <CardContent className="flex items-end justify-between gap-3">
              <Metric className="gap-1.5">
                <MetricLabel>{kpi.label}</MetricLabel>
                <MetricValue className="text-2xl">{kpi.value}</MetricValue>
                <MetricDelta trend={kpi.trend} className={kpi.deltaClassName}>
                  {kpi.delta}
                </MetricDelta>
              </Metric>
              <Sparkline
                data={kpi.series}
                type="line"
                area
                tone={kpi.tone}
                width={96}
                height={40}
                className="h-10 w-24 shrink-0"
                aria-label={`${kpi.label} trend over the last 10 weeks`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Traffic overview</CardTitle>
          <CardDescription>Daily sessions · Jun 14 – Jul 13</CardDescription>
          <CardAction>
            <Select defaultValue="30d">
              <SelectTrigger className="w-36" aria-label="Date range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Sparkline
            data={trafficSeries}
            type="line"
            area
            tone="primary"
            width={720}
            height={176}
            strokeWidth={2}
            preserveAspectRatio="none"
            className="h-44 w-full"
            aria-label="Daily sessions, last 30 days, rising from 24,100 to 47,900"
          />
          <div className="flex items-center justify-between text-xs text-fg-tertiary">
            <span>Jun 14</span>
            <span>Jun 21</span>
            <span>Jun 28</span>
            <span>Jul 5</span>
            <span>Jul 13</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {breakdownLists.map((list) => (
          <Card key={list.id} className="gap-0">
            <CardHeader>
              <CardTitle className="font-display text-base">{list.title}</CardTitle>
              <CardDescription>{list.caption}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-5">
              {list.rows.map((row) => (
                <div key={row.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-fg">{row.label}</span>
                    <span className="shrink-0 tabular-nums text-fg-secondary">{row.value}</span>
                  </div>
                  <Progress
                    value={row.share}
                    aria-label={`${row.label} share of traffic`}
                    className="h-1.5"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const analyticsOverviewCode = `import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sparkline,
} from "@cooud-ui/ui";

interface OverviewKpi {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  /** Tone override for deltas where the trend direction flips the sentiment. */
  deltaClassName?: string;
  tone: "primary" | "success" | "warning" | "info";
  series: number[];
}

interface BreakdownRow {
  id: string;
  label: string;
  value: string;
  share: number;
}

const overviewKpis: OverviewKpi[] = [
  { label: "Page views", value: "1.24M", delta: "+18.2%", trend: "up", tone: "primary", series: [86, 92, 88, 97, 104, 99, 112, 118, 115, 124] },
  { label: "Unique visitors", value: "312.4k", delta: "+9.6%", trend: "up", tone: "info", series: [58, 61, 60, 64, 66, 63, 68, 70, 69, 72] },
  { label: "Avg. session", value: "4m 32s", delta: "+12s", trend: "up", tone: "success", series: [238, 241, 246, 244, 252, 250, 258, 262, 266, 272] },
  // A falling bounce rate is an improvement: keep the down arrow, show it as success.
  { label: "Bounce rate", value: "38.1%", delta: "-2.4%", trend: "down", deltaClassName: "text-success-strong", tone: "warning", series: [44, 43, 43, 42, 41, 42, 40, 39, 39, 38] },
];

const trafficSeries = [
  24100, 25800, 24900, 26400, 27200, 26100, 28900, 30400, 29800, 31500, 30900, 32800,
  34100, 33200, 35600, 34800, 36900, 38200, 37400, 39800, 38900, 41200, 40500, 42800,
  41900, 44100, 43600, 45900, 46800, 47900,
];

const topPages: BreakdownRow[] = [
  { id: "home", label: "/", value: "284,912", share: 100 },
  { id: "pricing", label: "/pricing", value: "191,204", share: 67 },
  { id: "docs", label: "/docs/getting-started", value: "121,880", share: 43 },
  { id: "blog", label: "/blog/series-b", value: "98,414", share: 35 },
  { id: "changelog", label: "/changelog", value: "64,206", share: 23 },
];

const topReferrers: BreakdownRow[] = [
  { id: "google", label: "google.com", value: "142,310", share: 100 },
  { id: "github", label: "github.com", value: "87,650", share: 62 },
  { id: "twitter", label: "x.com", value: "56,982", share: 40 },
  { id: "newsletter", label: "Newsletter", value: "41,225", share: 29 },
  { id: "producthunt", label: "producthunt.com", value: "18,940", share: 13 },
];

const breakdownLists = [
  { id: "pages", title: "Top pages", caption: "By views", rows: topPages },
  { id: "referrers", title: "Top referrers", caption: "By sessions", rows: topReferrers },
];

export function AnalyticsOverviewBlock() {
  return (
    <section
      aria-label="Analytics overview"
      className="mx-auto flex w-full max-w-6xl flex-col gap-4"
    >
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-semibold text-fg">Analytics</h2>
          <p className="text-sm text-fg-secondary">
            Product and marketing traffic across meridianhq.com.
          </p>
        </div>
        <Badge variant="success">Live</Badge>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewKpis.map((kpi) => (
          <Card key={kpi.label} className="gap-0 py-5">
            <CardContent className="flex items-end justify-between gap-3">
              <Metric className="gap-1.5">
                <MetricLabel>{kpi.label}</MetricLabel>
                <MetricValue className="text-2xl">{kpi.value}</MetricValue>
                <MetricDelta trend={kpi.trend} className={kpi.deltaClassName}>
                  {kpi.delta}
                </MetricDelta>
              </Metric>
              <Sparkline
                data={kpi.series}
                type="line"
                area
                tone={kpi.tone}
                width={96}
                height={40}
                className="h-10 w-24 shrink-0"
                aria-label={kpi.label + " trend over the last 10 weeks"}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Traffic overview</CardTitle>
          <CardDescription>Daily sessions · Jun 14 – Jul 13</CardDescription>
          <CardAction>
            <Select defaultValue="30d">
              <SelectTrigger className="w-36" aria-label="Date range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Sparkline
            data={trafficSeries}
            type="line"
            area
            tone="primary"
            width={720}
            height={176}
            strokeWidth={2}
            preserveAspectRatio="none"
            className="h-44 w-full"
            aria-label="Daily sessions, last 30 days, rising from 24,100 to 47,900"
          />
          <div className="flex items-center justify-between text-xs text-fg-tertiary">
            <span>Jun 14</span>
            <span>Jun 21</span>
            <span>Jun 28</span>
            <span>Jul 5</span>
            <span>Jul 13</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {breakdownLists.map((list) => (
          <Card key={list.id} className="gap-0">
            <CardHeader>
              <CardTitle className="font-display text-base">{list.title}</CardTitle>
              <CardDescription>{list.caption}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-5">
              {list.rows.map((row) => (
                <div key={row.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-fg">{row.label}</span>
                    <span className="shrink-0 tabular-nums text-fg-secondary">{row.value}</span>
                  </div>
                  <Progress
                    value={row.share}
                    aria-label={row.label + " share of traffic"}
                    className="h-1.5"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

interface RetentionStat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  tone: "primary" | "success" | "info";
  series: number[];
}

interface CohortRow {
  id: string;
  label: string;
  users: string;
  cells: number[];
  week8: string;
}

const retentionStats: RetentionStat[] = [
  {
    label: "Day-1 retention",
    value: "68.4%",
    delta: "+3.1%",
    trend: "up",
    tone: "success",
    series: [61, 62, 64, 63, 65, 66, 67, 68],
  },
  {
    label: "Day-7 retention",
    value: "42.9%",
    delta: "+1.8%",
    trend: "up",
    tone: "primary",
    series: [38, 39, 41, 40, 41, 42, 42, 43],
  },
  {
    label: "Day-30 retention",
    value: "27.6%",
    delta: "-0.4%",
    trend: "down",
    tone: "info",
    series: [29, 28, 29, 28, 28, 27, 28, 27],
  },
];

const cohortWeeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

const cohorts: CohortRow[] = [
  { id: "apr-06", label: "Apr 6", users: "2,418", cells: [4, 3, 3, 2, 2, 2, 1, 1], week8: "31%" },
  { id: "apr-13", label: "Apr 13", users: "2,733", cells: [4, 3, 3, 3, 2, 2, 2, 1], week8: "33%" },
  { id: "apr-20", label: "Apr 20", users: "2,204", cells: [4, 4, 3, 3, 2, 2, 2, 2], week8: "36%" },
  { id: "apr-27", label: "Apr 27", users: "3,012", cells: [4, 4, 3, 3, 3, 2, 2, 2], week8: "38%" },
  { id: "may-04", label: "May 4", users: "2,890", cells: [4, 4, 3, 3, 3, 3, 2, 2], week8: "41%" },
  { id: "may-11", label: "May 11", users: "3,247", cells: [4, 4, 4, 3, 3, 3, 3, 2], week8: "44%" },
];

const heatLevels = [
  "bg-surface-inset",
  "bg-primary/15",
  "bg-primary/35",
  "bg-primary/60",
  "bg-primary",
];

function heatCellClass(level: number) {
  return `h-7 rounded-sm ${heatLevels[level] ?? "bg-surface-inset"}`;
}

const cohortGridClass = "grid grid-cols-[5rem_repeat(8,minmax(0,1fr))_4rem] items-center gap-1.5";

export function AnalyticsEngagementBlock() {
  return (
    <section
      aria-label="Engagement analytics"
      className="mx-auto flex w-full max-w-5xl flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {retentionStats.map((stat) => (
          <Card key={stat.label} className="gap-0 py-5">
            <CardContent className="flex items-end justify-between gap-3">
              <Metric className="gap-1.5">
                <MetricLabel>{stat.label}</MetricLabel>
                <MetricValue className="text-2xl">{stat.value}</MetricValue>
                <MetricDelta trend={stat.trend}>{stat.delta}</MetricDelta>
              </Metric>
              <Sparkline
                data={stat.series}
                type="line"
                area
                tone={stat.tone}
                width={96}
                height={40}
                className="h-10 w-24 shrink-0"
                aria-label={`${stat.label} trend over the last 8 weeks`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="font-display text-base">Weekly cohort retention</CardTitle>
          <CardDescription>
            Share of each signup cohort active in the weeks after joining.
          </CardDescription>
          <CardAction>
            <Select defaultValue="all">
              <SelectTrigger className="w-44" aria-label="Filter by plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All workspaces</SelectItem>
                <SelectItem value="paid">Paid workspaces</SelectItem>
                <SelectItem value="free">Free workspaces</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-5">
          <div className="flex min-w-[34rem] flex-col gap-1.5">
            <div className={`${cohortGridClass} pb-1`}>
              <span className="text-xs font-medium text-fg-tertiary">Cohort</span>
              {cohortWeeks.map((week) => (
                <span key={week} className="text-center text-xs font-medium text-fg-tertiary">
                  {week}
                </span>
              ))}
              <span className="text-end text-xs font-medium text-fg-tertiary">Retained</span>
            </div>
            {cohorts.map((cohort) => (
              <div key={cohort.id} className={cohortGridClass}>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-fg">{cohort.label}</span>
                  <span className="text-xs text-fg-tertiary">{cohort.users}</span>
                </div>
                {cohort.cells.map((level, week) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length, never-reordered week buckets; the cohort id keeps the key unique across rows
                    key={`${cohort.id}-w${week + 1}`}
                    className={heatCellClass(level)}
                    aria-hidden="true"
                  />
                ))}
                <span className="text-end text-xs font-medium tabular-nums text-fg-secondary">
                  {cohort.week8}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-3 pt-5">
          <span className="text-xs text-fg-tertiary">
            Each row follows one weekly signup cohort through its first 8 weeks.
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fg-tertiary">Less</span>
            <span className="size-3 rounded-sm bg-surface-inset" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary/15" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary/35" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary/60" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary" aria-hidden="true" />
            <span className="text-xs text-fg-tertiary">More</span>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}

const analyticsEngagementCode = `import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sparkline,
} from "@cooud-ui/ui";

interface RetentionStat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  tone: "primary" | "success" | "info";
  series: number[];
}

interface CohortRow {
  id: string;
  label: string;
  users: string;
  cells: number[];
  week8: string;
}

const retentionStats: RetentionStat[] = [
  { label: "Day-1 retention", value: "68.4%", delta: "+3.1%", trend: "up", tone: "success", series: [61, 62, 64, 63, 65, 66, 67, 68] },
  { label: "Day-7 retention", value: "42.9%", delta: "+1.8%", trend: "up", tone: "primary", series: [38, 39, 41, 40, 41, 42, 42, 43] },
  { label: "Day-30 retention", value: "27.6%", delta: "-0.4%", trend: "down", tone: "info", series: [29, 28, 29, 28, 28, 27, 28, 27] },
];

const cohortWeeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

const cohorts: CohortRow[] = [
  { id: "apr-06", label: "Apr 6", users: "2,418", cells: [4, 3, 3, 2, 2, 2, 1, 1], week8: "31%" },
  { id: "apr-13", label: "Apr 13", users: "2,733", cells: [4, 3, 3, 3, 2, 2, 2, 1], week8: "33%" },
  { id: "apr-20", label: "Apr 20", users: "2,204", cells: [4, 4, 3, 3, 2, 2, 2, 2], week8: "36%" },
  { id: "apr-27", label: "Apr 27", users: "3,012", cells: [4, 4, 3, 3, 3, 2, 2, 2], week8: "38%" },
  { id: "may-04", label: "May 4", users: "2,890", cells: [4, 4, 3, 3, 3, 3, 2, 2], week8: "41%" },
  { id: "may-11", label: "May 11", users: "3,247", cells: [4, 4, 4, 3, 3, 3, 3, 2], week8: "44%" },
];

const heatLevels = [
  "bg-surface-inset",
  "bg-primary/15",
  "bg-primary/35",
  "bg-primary/60",
  "bg-primary",
];

function heatCellClass(level: number) {
  return "h-7 rounded-sm " + (heatLevels[level] ?? "bg-surface-inset");
}

const cohortGridClass = "grid grid-cols-[5rem_repeat(8,minmax(0,1fr))_4rem] items-center gap-1.5";

export function AnalyticsEngagementBlock() {
  return (
    <section
      aria-label="Engagement analytics"
      className="mx-auto flex w-full max-w-5xl flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {retentionStats.map((stat) => (
          <Card key={stat.label} className="gap-0 py-5">
            <CardContent className="flex items-end justify-between gap-3">
              <Metric className="gap-1.5">
                <MetricLabel>{stat.label}</MetricLabel>
                <MetricValue className="text-2xl">{stat.value}</MetricValue>
                <MetricDelta trend={stat.trend}>{stat.delta}</MetricDelta>
              </Metric>
              <Sparkline
                data={stat.series}
                type="line"
                area
                tone={stat.tone}
                width={96}
                height={40}
                className="h-10 w-24 shrink-0"
                aria-label={stat.label + " trend over the last 8 weeks"}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="font-display text-base">Weekly cohort retention</CardTitle>
          <CardDescription>
            Share of each signup cohort active in the weeks after joining.
          </CardDescription>
          <CardAction>
            <Select defaultValue="all">
              <SelectTrigger className="w-44" aria-label="Filter by plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All workspaces</SelectItem>
                <SelectItem value="paid">Paid workspaces</SelectItem>
                <SelectItem value="free">Free workspaces</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-x-auto pt-5">
          <div className="flex min-w-[34rem] flex-col gap-1.5">
            <div className={cohortGridClass + " pb-1"}>
              <span className="text-xs font-medium text-fg-tertiary">Cohort</span>
              {cohortWeeks.map((week) => (
                <span key={week} className="text-center text-xs font-medium text-fg-tertiary">
                  {week}
                </span>
              ))}
              <span className="text-end text-xs font-medium text-fg-tertiary">Retained</span>
            </div>
            {cohorts.map((cohort) => (
              <div key={cohort.id} className={cohortGridClass}>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-fg">{cohort.label}</span>
                  <span className="text-xs text-fg-tertiary">{cohort.users}</span>
                </div>
                {cohort.cells.map((level, week) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static, never-reordered week buckets
                    key={cohort.id + "-w" + (week + 1)}
                    className={heatCellClass(level)}
                    aria-hidden="true"
                  />
                ))}
                <span className="text-end text-xs font-medium tabular-nums text-fg-secondary">
                  {cohort.week8}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-3 pt-5">
          <span className="text-xs text-fg-tertiary">
            Each row follows one weekly signup cohort through its first 8 weeks.
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-fg-tertiary">Less</span>
            <span className="size-3 rounded-sm bg-surface-inset" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary/15" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary/35" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary/60" aria-hidden="true" />
            <span className="size-3 rounded-sm bg-primary" aria-hidden="true" />
            <span className="text-xs text-fg-tertiary">More</span>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Kanban board — sprint columns with labels, assignees & WIP limits
 * ────────────────────────────────────────────────────────────────────────── */

interface BoardLabel {
  text: string;
  variant: "info" | "success" | "warning" | "destructive" | "secondary";
}

interface BoardAssignee {
  name: string;
  initials: string;
}

interface BoardCard {
  id: string;
  title: string;
  labels: BoardLabel[];
  due: string;
  comments: number;
  assignees: BoardAssignee[];
}

interface BoardColumn {
  id: string;
  name: string;
  cards: BoardCard[];
}

const boardColumns: BoardColumn[] = [
  {
    id: "backlog",
    name: "Backlog",
    cards: [
      {
        id: "task-118",
        title: "Migrate billing webhooks to the v2 event schema",
        labels: [{ text: "Backend", variant: "info" }],
        due: "Jul 21",
        comments: 3,
        assignees: [{ name: "Devon Lane", initials: "DL" }],
      },
      {
        id: "task-117",
        title: "Design empty states for the reports page",
        labels: [{ text: "Design", variant: "secondary" }],
        due: "Jul 22",
        comments: 1,
        assignees: [{ name: "Hana Yoshida", initials: "HY" }],
      },
      {
        id: "task-116",
        title: "Spike: evaluate ClickHouse for event analytics",
        labels: [{ text: "Data", variant: "warning" }],
        due: "Jul 24",
        comments: 5,
        assignees: [{ name: "Marcus Chen", initials: "MC" }],
      },
    ],
  },
  {
    id: "in-progress",
    name: "In progress",
    cards: [
      {
        id: "task-112",
        title: "Rework onboarding checklist with progress tracking",
        labels: [
          { text: "Frontend", variant: "info" },
          { text: "Growth", variant: "success" },
        ],
        due: "Jul 15",
        comments: 8,
        assignees: [
          { name: "Ingrid Solberg", initials: "IS" },
          { name: "Rosa Delgado", initials: "RD" },
        ],
      },
      {
        id: "task-111",
        title: "Fix duplicated invoice emails on plan change",
        labels: [{ text: "Bug", variant: "destructive" }],
        due: "Jul 14",
        comments: 12,
        assignees: [{ name: "Marcus Chen", initials: "MC" }],
      },
      {
        id: "task-109",
        title: "SSO with Okta for enterprise workspaces",
        labels: [{ text: "Backend", variant: "info" }],
        due: "Jul 17",
        comments: 6,
        assignees: [
          { name: "Devon Lane", initials: "DL" },
          { name: "Felix Weber", initials: "FW" },
        ],
      },
    ],
  },
  {
    id: "in-review",
    name: "In review",
    cards: [
      {
        id: "task-107",
        title: "Audit-log export to CSV and S3",
        labels: [{ text: "Backend", variant: "info" }],
        due: "Jul 14",
        comments: 4,
        assignees: [{ name: "Amara Diallo", initials: "AD" }],
      },
      {
        id: "task-105",
        title: "New pricing page copy and A/B experiment",
        labels: [{ text: "Growth", variant: "success" }],
        due: "Jul 15",
        comments: 9,
        assignees: [
          { name: "Hana Yoshida", initials: "HY" },
          { name: "Ingrid Solberg", initials: "IS" },
        ],
      },
    ],
  },
  {
    id: "done",
    name: "Done",
    cards: [
      {
        id: "task-102",
        title: "Rate-limit the public REST API per workspace",
        labels: [{ text: "Backend", variant: "info" }],
        due: "Jul 11",
        comments: 7,
        assignees: [{ name: "Marcus Chen", initials: "MC" }],
      },
      {
        id: "task-099",
        title: "Dark-mode audit for the settings screens",
        labels: [{ text: "Design", variant: "secondary" }],
        due: "Jul 10",
        comments: 2,
        assignees: [{ name: "Rosa Delgado", initials: "RD" }],
      },
    ],
  },
];

export function KanbanBoardBlock() {
  return (
    <section aria-label="Sprint board" className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold text-fg">Sprint 24 · Growth squad</h2>
          <p className="text-sm text-fg-secondary">Jul 7 – Jul 18 · 10 tasks across 4 stages</p>
        </div>
        <Button variant="gradient" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New task
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {boardColumns.map((column) => (
          <div key={column.id} className="flex flex-col gap-3 rounded-2xl bg-surface-inset p-3">
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-semibold text-fg">{column.name}</h3>
              <Badge variant="secondary">{column.cards.length}</Badge>
              <Button variant="ghost" size="icon-sm" className="ms-auto">
                <Plus className="size-4" aria-hidden="true" />
                <span className="sr-only">Add task to {column.name}</span>
              </Button>
            </div>
            <ul className="flex flex-col gap-3">
              {column.cards.map((card) => (
                <li
                  key={card.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-xs"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {card.labels.map((label) => (
                      <Badge key={label.text} variant={label.variant}>
                        {label.text}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm font-medium leading-snug text-fg">{card.title}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-fg-tertiary">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {card.due}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="size-3.5" aria-hidden="true" />
                        {card.comments}
                        <span className="sr-only">comments</span>
                      </span>
                    </div>
                    <div className="flex -space-x-2">
                      <span className="sr-only">
                        {`Assigned to ${card.assignees.map((person) => person.name).join(", ")}`}
                      </span>
                      {card.assignees.map((assignee) => (
                        <Avatar
                          key={assignee.initials}
                          className="size-6 border-2 border-surface-raised"
                        >
                          <AvatarFallback className="text-[10px]">
                            {assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

const kanbanBoardCode = `import { Avatar, AvatarFallback, Badge, Button } from "@cooud-ui/ui";
import { CalendarDays, MessageSquare, Plus } from "lucide-react";

interface BoardLabel {
  text: string;
  variant: "info" | "success" | "warning" | "destructive" | "secondary";
}

interface BoardAssignee {
  name: string;
  initials: string;
}

interface BoardCard {
  id: string;
  title: string;
  labels: BoardLabel[];
  due: string;
  comments: number;
  assignees: BoardAssignee[];
}

interface BoardColumn {
  id: string;
  name: string;
  cards: BoardCard[];
}

const boardColumns: BoardColumn[] = [
  {
    id: "backlog",
    name: "Backlog",
    cards: [
      { id: "task-118", title: "Migrate billing webhooks to the v2 event schema", labels: [{ text: "Backend", variant: "info" }], due: "Jul 21", comments: 3, assignees: [{ name: "Devon Lane", initials: "DL" }] },
      { id: "task-117", title: "Design empty states for the reports page", labels: [{ text: "Design", variant: "secondary" }], due: "Jul 22", comments: 1, assignees: [{ name: "Hana Yoshida", initials: "HY" }] },
      { id: "task-116", title: "Spike: evaluate ClickHouse for event analytics", labels: [{ text: "Data", variant: "warning" }], due: "Jul 24", comments: 5, assignees: [{ name: "Marcus Chen", initials: "MC" }] },
    ],
  },
  {
    id: "in-progress",
    name: "In progress",
    cards: [
      { id: "task-112", title: "Rework onboarding checklist with progress tracking", labels: [{ text: "Frontend", variant: "info" }, { text: "Growth", variant: "success" }], due: "Jul 15", comments: 8, assignees: [{ name: "Ingrid Solberg", initials: "IS" }, { name: "Rosa Delgado", initials: "RD" }] },
      { id: "task-111", title: "Fix duplicated invoice emails on plan change", labels: [{ text: "Bug", variant: "destructive" }], due: "Jul 14", comments: 12, assignees: [{ name: "Marcus Chen", initials: "MC" }] },
      { id: "task-109", title: "SSO with Okta for enterprise workspaces", labels: [{ text: "Backend", variant: "info" }], due: "Jul 17", comments: 6, assignees: [{ name: "Devon Lane", initials: "DL" }, { name: "Felix Weber", initials: "FW" }] },
    ],
  },
  {
    id: "in-review",
    name: "In review",
    cards: [
      { id: "task-107", title: "Audit-log export to CSV and S3", labels: [{ text: "Backend", variant: "info" }], due: "Jul 14", comments: 4, assignees: [{ name: "Amara Diallo", initials: "AD" }] },
      { id: "task-105", title: "New pricing page copy and A/B experiment", labels: [{ text: "Growth", variant: "success" }], due: "Jul 15", comments: 9, assignees: [{ name: "Hana Yoshida", initials: "HY" }, { name: "Ingrid Solberg", initials: "IS" }] },
    ],
  },
  {
    id: "done",
    name: "Done",
    cards: [
      { id: "task-102", title: "Rate-limit the public REST API per workspace", labels: [{ text: "Backend", variant: "info" }], due: "Jul 11", comments: 7, assignees: [{ name: "Marcus Chen", initials: "MC" }] },
      { id: "task-099", title: "Dark-mode audit for the settings screens", labels: [{ text: "Design", variant: "secondary" }], due: "Jul 10", comments: 2, assignees: [{ name: "Rosa Delgado", initials: "RD" }] },
    ],
  },
];

export function KanbanBoardBlock() {
  return (
    <section aria-label="Sprint board" className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold text-fg">Sprint 24 · Growth squad</h2>
          <p className="text-sm text-fg-secondary">Jul 7 – Jul 18 · 10 tasks across 4 stages</p>
        </div>
        <Button variant="gradient" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New task
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {boardColumns.map((column) => (
          <div key={column.id} className="flex flex-col gap-3 rounded-2xl bg-surface-inset p-3">
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-semibold text-fg">{column.name}</h3>
              <Badge variant="secondary">{column.cards.length}</Badge>
              <Button variant="ghost" size="icon-sm" className="ms-auto">
                <Plus className="size-4" aria-hidden="true" />
                <span className="sr-only">Add task to {column.name}</span>
              </Button>
            </div>
            <ul className="flex flex-col gap-3">
              {column.cards.map((card) => (
                <li
                  key={card.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-xs"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {card.labels.map((label) => (
                      <Badge key={label.text} variant={label.variant}>
                        {label.text}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm font-medium leading-snug text-fg">{card.title}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-fg-tertiary">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3.5" aria-hidden="true" />
                        {card.due}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="size-3.5" aria-hidden="true" />
                        {card.comments}
                        <span className="sr-only">comments</span>
                      </span>
                    </div>
                    <div className="flex -space-x-2">
                      <span className="sr-only">
                        {"Assigned to " + card.assignees.map((person) => person.name).join(", ")}
                      </span>
                      {card.assignees.map((assignee) => (
                        <Avatar
                          key={assignee.initials}
                          className="size-6 border-2 border-surface-raised"
                        >
                          <AvatarFallback className="text-[10px]">
                            {assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}`;

interface CompactTask {
  code: string;
  title: string;
  tag: string;
  tagVariant: "info" | "success" | "warning" | "destructive" | "secondary";
  assignee: string;
  assigneeName: string;
}

interface CompactColumn {
  id: string;
  name: string;
  wipLimit: number;
  tasks: CompactTask[];
}

const compactColumns: CompactColumn[] = [
  {
    id: "todo",
    name: "Todo",
    wipLimit: 6,
    tasks: [
      {
        code: "MER-201",
        title: "Improve webhook retry backoff",
        tag: "Backend",
        tagVariant: "info",
        assignee: "DL",
        assigneeName: "Devon Lane",
      },
      {
        code: "MER-198",
        title: "CSV import for the contacts page",
        tag: "Frontend",
        tagVariant: "info",
        assignee: "HY",
        assigneeName: "Hana Yoshida",
      },
      {
        code: "MER-195",
        title: "Refresh empty-state illustrations",
        tag: "Design",
        tagVariant: "secondary",
        assignee: "RD",
        assigneeName: "Rosa Delgado",
      },
      {
        code: "MER-190",
        title: "Tighten password policy defaults",
        tag: "Security",
        tagVariant: "warning",
        assignee: "MC",
        assigneeName: "Marcus Chen",
      },
    ],
  },
  {
    id: "in-progress",
    name: "In progress",
    wipLimit: 4,
    tasks: [
      {
        code: "MER-188",
        title: "Usage-based billing alerts",
        tag: "Billing",
        tagVariant: "success",
        assignee: "IS",
        assigneeName: "Ingrid Solberg",
      },
      {
        code: "MER-186",
        title: "Fix timezone drift in scheduled reports",
        tag: "Bug",
        tagVariant: "destructive",
        assignee: "MC",
        assigneeName: "Marcus Chen",
      },
      {
        code: "MER-183",
        title: "Move search to a typo-tolerant index",
        tag: "Backend",
        tagVariant: "info",
        assignee: "DL",
        assigneeName: "Devon Lane",
      },
      {
        code: "MER-181",
        title: "Keyboard navigation for the command menu",
        tag: "Frontend",
        tagVariant: "info",
        assignee: "FW",
        assigneeName: "Felix Weber",
      },
    ],
  },
  {
    id: "in-review",
    name: "In review",
    wipLimit: 3,
    tasks: [
      {
        code: "MER-179",
        title: "Role-based access for API tokens",
        tag: "Security",
        tagVariant: "warning",
        assignee: "AD",
        assigneeName: "Amara Diallo",
      },
      {
        code: "MER-176",
        title: "Consolidate transactional email templates",
        tag: "Backend",
        tagVariant: "info",
        assignee: "RD",
        assigneeName: "Rosa Delgado",
      },
    ],
  },
];

export function KanbanBoardCompactBlock() {
  return (
    <section aria-label="Team board" className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold text-fg">Platform team · Week 29</h2>
          <p className="text-sm text-fg-secondary">10 tasks in flight · WIP limits enforced</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add task
        </Button>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {compactColumns.map((column) => (
          <div key={column.id} className="flex flex-col gap-3 rounded-2xl bg-surface-inset p-3">
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-semibold text-fg">{column.name}</h3>
              <span className="text-xs font-medium tabular-nums text-fg-tertiary">
                {column.tasks.length}/{column.wipLimit}
              </span>
              {column.tasks.length >= column.wipLimit ? (
                <Badge variant="warning">At WIP limit</Badge>
              ) : null}
              <Button variant="ghost" size="icon-sm" className="ms-auto">
                <Plus className="size-4" aria-hidden="true" />
                <span className="sr-only">Add task to {column.name}</span>
              </Button>
            </div>
            <ul className="flex flex-col gap-2">
              {column.tasks.map((task) => (
                <li
                  key={task.code}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-3 py-2 shadow-xs"
                >
                  <span className="shrink-0 font-mono text-xs text-fg-tertiary">{task.code}</span>
                  <p className="min-w-0 flex-1 truncate text-sm text-fg">{task.title}</p>
                  <Badge variant={task.tagVariant} className="hidden sm:inline-flex">
                    {task.tag}
                  </Badge>
                  <Avatar className="size-5 shrink-0">
                    <AvatarFallback className="text-[9px]">{task.assignee}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Assigned to {task.assigneeName}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

const kanbanBoardCompactCode = `import { Avatar, AvatarFallback, Badge, Button } from "@cooud-ui/ui";
import { Plus } from "lucide-react";

interface CompactTask {
  code: string;
  title: string;
  tag: string;
  tagVariant: "info" | "success" | "warning" | "destructive" | "secondary";
  assignee: string;
  assigneeName: string;
}

interface CompactColumn {
  id: string;
  name: string;
  wipLimit: number;
  tasks: CompactTask[];
}

const compactColumns: CompactColumn[] = [
  {
    id: "todo",
    name: "Todo",
    wipLimit: 6,
    tasks: [
      { code: "MER-201", title: "Improve webhook retry backoff", tag: "Backend", tagVariant: "info", assignee: "DL", assigneeName: "Devon Lane" },
      { code: "MER-198", title: "CSV import for the contacts page", tag: "Frontend", tagVariant: "info", assignee: "HY", assigneeName: "Hana Yoshida" },
      { code: "MER-195", title: "Refresh empty-state illustrations", tag: "Design", tagVariant: "secondary", assignee: "RD", assigneeName: "Rosa Delgado" },
      { code: "MER-190", title: "Tighten password policy defaults", tag: "Security", tagVariant: "warning", assignee: "MC", assigneeName: "Marcus Chen" },
    ],
  },
  {
    id: "in-progress",
    name: "In progress",
    wipLimit: 4,
    tasks: [
      { code: "MER-188", title: "Usage-based billing alerts", tag: "Billing", tagVariant: "success", assignee: "IS", assigneeName: "Ingrid Solberg" },
      { code: "MER-186", title: "Fix timezone drift in scheduled reports", tag: "Bug", tagVariant: "destructive", assignee: "MC", assigneeName: "Marcus Chen" },
      { code: "MER-183", title: "Move search to a typo-tolerant index", tag: "Backend", tagVariant: "info", assignee: "DL", assigneeName: "Devon Lane" },
      { code: "MER-181", title: "Keyboard navigation for the command menu", tag: "Frontend", tagVariant: "info", assignee: "FW", assigneeName: "Felix Weber" },
    ],
  },
  {
    id: "in-review",
    name: "In review",
    wipLimit: 3,
    tasks: [
      { code: "MER-179", title: "Role-based access for API tokens", tag: "Security", tagVariant: "warning", assignee: "AD", assigneeName: "Amara Diallo" },
      { code: "MER-176", title: "Consolidate transactional email templates", tag: "Backend", tagVariant: "info", assignee: "RD", assigneeName: "Rosa Delgado" },
    ],
  },
];

export function KanbanBoardCompactBlock() {
  return (
    <section aria-label="Team board" className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-lg font-semibold text-fg">Platform team · Week 29</h2>
          <p className="text-sm text-fg-secondary">10 tasks in flight · WIP limits enforced</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add task
        </Button>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {compactColumns.map((column) => (
          <div key={column.id} className="flex flex-col gap-3 rounded-2xl bg-surface-inset p-3">
            <div className="flex items-center gap-2 px-1">
              <h3 className="text-sm font-semibold text-fg">{column.name}</h3>
              <span className="text-xs font-medium tabular-nums text-fg-tertiary">
                {column.tasks.length}/{column.wipLimit}
              </span>
              {column.tasks.length >= column.wipLimit ? (
                <Badge variant="warning">At WIP limit</Badge>
              ) : null}
              <Button variant="ghost" size="icon-sm" className="ms-auto">
                <Plus className="size-4" aria-hidden="true" />
                <span className="sr-only">Add task to {column.name}</span>
              </Button>
            </div>
            <ul className="flex flex-col gap-2">
              {column.tasks.map((task) => (
                <li
                  key={task.code}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface-raised px-3 py-2 shadow-xs"
                >
                  <span className="shrink-0 font-mono text-xs text-fg-tertiary">{task.code}</span>
                  <p className="min-w-0 flex-1 truncate text-sm text-fg">{task.title}</p>
                  <Badge variant={task.tagVariant} className="hidden sm:inline-flex">
                    {task.tag}
                  </Badge>
                  <Avatar className="size-5 shrink-0">
                    <AvatarFallback className="text-[9px]">{task.assignee}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Assigned to {task.assigneeName}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Audit log — day-grouped security timeline & filterable event table
 * ────────────────────────────────────────────────────────────────────────── */

interface AuditEvent {
  id: string;
  actor: string;
  initials: string;
  action: string;
  object: string;
  detail: string;
  time: string;
  severity: "Critical" | "Warning" | "Info";
  severityVariant: "destructive" | "warning" | "secondary";
}

interface AuditDay {
  id: string;
  label: string;
  events: AuditEvent[];
}

const auditDays: AuditDay[] = [
  {
    id: "jul-13",
    label: "Today · July 13, 2026",
    events: [
      {
        id: "evt-901",
        actor: "Ingrid Solberg",
        initials: "IS",
        action: "changed the role of",
        object: "Felix Weber",
        detail: "Viewer → Admin · Settings → Members",
        time: "14:32",
        severity: "Warning",
        severityVariant: "warning",
      },
      {
        id: "evt-897",
        actor: "Marcus Chen",
        initials: "MC",
        action: "rotated the API key",
        object: "prod-billing-service",
        detail: "Previous key revoked immediately",
        time: "11:05",
        severity: "Info",
        severityVariant: "secondary",
      },
      {
        id: "evt-894",
        actor: "Meridian Security",
        initials: "MS",
        action: "blocked 5 failed sign-in attempts for",
        object: "jonah.kaplan@meridianhq.com",
        detail: "IP 203.0.113.42 · London, United Kingdom",
        time: "09:47",
        severity: "Critical",
        severityVariant: "destructive",
      },
    ],
  },
  {
    id: "jul-12",
    label: "Yesterday · July 12, 2026",
    events: [
      {
        id: "evt-882",
        actor: "Amara Diallo",
        initials: "AD",
        action: "exported customer data from",
        object: "Contacts",
        detail: "12,408 rows · CSV",
        time: "17:21",
        severity: "Warning",
        severityVariant: "warning",
      },
      {
        id: "evt-871",
        actor: "Rosa Delgado",
        initials: "RD",
        action: "signed in from a new device in",
        object: "São Paulo, Brazil",
        detail: "Chrome on macOS · IP 198.51.100.9",
        time: "10:12",
        severity: "Info",
        severityVariant: "secondary",
      },
      {
        id: "evt-868",
        actor: "Ingrid Solberg",
        initials: "IS",
        action: "enforced two-factor authentication for",
        object: "all members",
        detail: "Grace period ends July 19",
        time: "08:30",
        severity: "Info",
        severityVariant: "secondary",
      },
    ],
  },
  {
    id: "jul-11",
    label: "July 11, 2026",
    events: [
      {
        id: "evt-859",
        actor: "Marcus Chen",
        initials: "MC",
        action: "deleted the webhook endpoint",
        object: "hooks.legacy.meridianhq.com",
        detail: "Endpoint had been failing for 14 days",
        time: "16:44",
        severity: "Warning",
        severityVariant: "warning",
      },
      {
        id: "evt-855",
        actor: "Felix Weber",
        initials: "FW",
        action: "accepted the invitation to",
        object: "Meridian HQ",
        detail: "Invited by Ingrid Solberg",
        time: "09:02",
        severity: "Info",
        severityVariant: "secondary",
      },
    ],
  },
];

export function AuditLogTimelineBlock() {
  return (
    <Card aria-label="Audit log" className="mx-auto w-full max-w-3xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Audit log</CardTitle>
        <CardDescription>Security-relevant activity across the Meridian workspace.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download className="size-4" aria-hidden="true" />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 py-6">
        {auditDays.map((day) => (
          <section key={day.id} aria-label={day.label} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h3 className="shrink-0 text-xs font-medium uppercase tracking-wider text-fg-tertiary">
                {day.label}
              </h3>
              <Separator className="flex-1" />
            </div>
            <div className="relative">
              <span className="absolute inset-y-2 start-4 w-px bg-border" aria-hidden="true" />
              <ol className="flex flex-col gap-5">
                {day.events.map((event) => (
                  <li key={event.id} className="flex items-start gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="text-xs">{event.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-sm leading-snug text-fg-secondary">
                        <span className="font-medium text-fg">{event.actor}</span> {event.action}{" "}
                        <span className="font-medium text-fg">{event.object}</span>
                      </p>
                      <p className="text-xs text-fg-tertiary">{event.detail}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={event.severityVariant}>{event.severity}</Badge>
                      <span className="text-xs tabular-nums text-fg-tertiary">{event.time}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </CardContent>

      <Separator />

      <CardFooter className="flex-wrap justify-between gap-3 py-4">
        <span className="text-xs text-fg-tertiary">Showing the last 3 days · 8 events</span>
        <Button variant="ghost" size="sm">
          View full log
        </Button>
      </CardFooter>
    </Card>
  );
}

const auditLogTimelineCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@cooud-ui/ui";
import { Download } from "lucide-react";

interface AuditEvent {
  id: string;
  actor: string;
  initials: string;
  action: string;
  object: string;
  detail: string;
  time: string;
  severity: "Critical" | "Warning" | "Info";
  severityVariant: "destructive" | "warning" | "secondary";
}

interface AuditDay {
  id: string;
  label: string;
  events: AuditEvent[];
}

const auditDays: AuditDay[] = [
  {
    id: "jul-13",
    label: "Today · July 13, 2026",
    events: [
      { id: "evt-901", actor: "Ingrid Solberg", initials: "IS", action: "changed the role of", object: "Felix Weber", detail: "Viewer → Admin · Settings → Members", time: "14:32", severity: "Warning", severityVariant: "warning" },
      { id: "evt-897", actor: "Marcus Chen", initials: "MC", action: "rotated the API key", object: "prod-billing-service", detail: "Previous key revoked immediately", time: "11:05", severity: "Info", severityVariant: "secondary" },
      { id: "evt-894", actor: "Meridian Security", initials: "MS", action: "blocked 5 failed sign-in attempts for", object: "jonah.kaplan@meridianhq.com", detail: "IP 203.0.113.42 · London, United Kingdom", time: "09:47", severity: "Critical", severityVariant: "destructive" },
    ],
  },
  {
    id: "jul-12",
    label: "Yesterday · July 12, 2026",
    events: [
      { id: "evt-882", actor: "Amara Diallo", initials: "AD", action: "exported customer data from", object: "Contacts", detail: "12,408 rows · CSV", time: "17:21", severity: "Warning", severityVariant: "warning" },
      { id: "evt-871", actor: "Rosa Delgado", initials: "RD", action: "signed in from a new device in", object: "São Paulo, Brazil", detail: "Chrome on macOS · IP 198.51.100.9", time: "10:12", severity: "Info", severityVariant: "secondary" },
      { id: "evt-868", actor: "Ingrid Solberg", initials: "IS", action: "enforced two-factor authentication for", object: "all members", detail: "Grace period ends July 19", time: "08:30", severity: "Info", severityVariant: "secondary" },
    ],
  },
  {
    id: "jul-11",
    label: "July 11, 2026",
    events: [
      { id: "evt-859", actor: "Marcus Chen", initials: "MC", action: "deleted the webhook endpoint", object: "hooks.legacy.meridianhq.com", detail: "Endpoint had been failing for 14 days", time: "16:44", severity: "Warning", severityVariant: "warning" },
      { id: "evt-855", actor: "Felix Weber", initials: "FW", action: "accepted the invitation to", object: "Meridian HQ", detail: "Invited by Ingrid Solberg", time: "09:02", severity: "Info", severityVariant: "secondary" },
    ],
  },
];

export function AuditLogTimelineBlock() {
  return (
    <Card aria-label="Audit log" className="mx-auto w-full max-w-3xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Audit log</CardTitle>
        <CardDescription>
          Security-relevant activity across the Meridian workspace.
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download className="size-4" aria-hidden="true" />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 py-6">
        {auditDays.map((day) => (
          <section key={day.id} aria-label={day.label} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h3 className="shrink-0 text-xs font-medium uppercase tracking-wider text-fg-tertiary">
                {day.label}
              </h3>
              <Separator className="flex-1" />
            </div>
            <div className="relative">
              <span className="absolute inset-y-2 start-4 w-px bg-border" aria-hidden="true" />
              <ol className="flex flex-col gap-5">
                {day.events.map((event) => (
                  <li key={event.id} className="flex items-start gap-3">
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="text-xs">{event.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-sm leading-snug text-fg-secondary">
                        <span className="font-medium text-fg">{event.actor}</span> {event.action}{" "}
                        <span className="font-medium text-fg">{event.object}</span>
                      </p>
                      <p className="text-xs text-fg-tertiary">{event.detail}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={event.severityVariant}>{event.severity}</Badge>
                      <span className="text-xs tabular-nums text-fg-tertiary">{event.time}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </CardContent>

      <Separator />

      <CardFooter className="flex-wrap justify-between gap-3 py-4">
        <span className="text-xs text-fg-tertiary">Showing the last 3 days · 8 events</span>
        <Button variant="ghost" size="sm">
          View full log
        </Button>
      </CardFooter>
    </Card>
  );
}`;

interface AuditRow {
  id: string;
  event: string;
  detail: string;
  type: string;
  typeVariant: "info" | "success" | "warning" | "destructive" | "secondary";
  actor: string;
  initials: string;
  ip: string;
  time: string;
}

const auditRows: AuditRow[] = [
  {
    id: "row-901",
    event: "member.role_updated",
    detail: "Felix Weber · Viewer → Admin",
    type: "Members",
    typeVariant: "info",
    actor: "Ingrid Solberg",
    initials: "IS",
    ip: "172.64.18.24",
    time: "Jul 13, 14:32",
  },
  {
    id: "row-897",
    event: "api_key.rotated",
    detail: "prod-billing-service",
    type: "API keys",
    typeVariant: "secondary",
    actor: "Marcus Chen",
    initials: "MC",
    ip: "198.51.100.77",
    time: "Jul 13, 11:05",
  },
  {
    id: "row-894",
    event: "auth.login_blocked",
    detail: "5 failed attempts · jonah.kaplan@meridianhq.com",
    type: "Auth",
    typeVariant: "destructive",
    actor: "Meridian Security",
    initials: "MS",
    ip: "203.0.113.42",
    time: "Jul 13, 09:47",
  },
  {
    id: "row-882",
    event: "data.export_created",
    detail: "Contacts · 12,408 rows · CSV",
    type: "Data",
    typeVariant: "warning",
    actor: "Amara Diallo",
    initials: "AD",
    ip: "92.118.30.6",
    time: "Jul 12, 17:21",
  },
  {
    id: "row-871",
    event: "auth.new_device",
    detail: "Chrome on macOS · São Paulo, Brazil",
    type: "Auth",
    typeVariant: "secondary",
    actor: "Rosa Delgado",
    initials: "RD",
    ip: "198.51.100.9",
    time: "Jul 12, 10:12",
  },
  {
    id: "row-868",
    event: "workspace.2fa_enforced",
    detail: "All members · grace period ends July 19",
    type: "Security",
    typeVariant: "success",
    actor: "Ingrid Solberg",
    initials: "IS",
    ip: "172.64.18.24",
    time: "Jul 12, 08:30",
  },
  {
    id: "row-859",
    event: "webhook.deleted",
    detail: "hooks.legacy.meridianhq.com",
    type: "API keys",
    typeVariant: "warning",
    actor: "Marcus Chen",
    initials: "MC",
    ip: "198.51.100.77",
    time: "Jul 11, 16:44",
  },
];

export function AuditLogTableBlock() {
  return (
    <Card aria-label="Audit log" className="mx-auto w-full max-w-5xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Audit events</CardTitle>
        <CardDescription>
          Every privileged action in the workspace, retained for 365 days.
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-5 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search events, actors, or IP addresses…"
            aria-label="Search audit events"
            className="ps-9"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter by event type">
              <SelectValue placeholder="All event types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="api">API keys</SelectItem>
              <SelectItem value="data">Data exports</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="30d">
            <SelectTrigger className="w-full sm:w-40" aria-label="Date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardContent className="px-0 pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4 sm:ps-6">Event</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>IP address</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="ps-4 sm:ps-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={row.typeVariant}>{row.type}</Badge>
                      <span className="font-mono text-xs text-fg">{row.event}</span>
                    </div>
                    <span className="text-xs text-fg-tertiary">{row.detail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">{row.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-fg">{row.actor}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-fg-secondary">{row.ip}</TableCell>
                <TableCell className="text-fg-secondary">{row.time}</TableCell>
                <TableCell className="pe-4 text-end sm:pe-6">
                  <Button variant="ghost" size="icon-sm">
                    <ChevronRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">View details for {row.event}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator />

      <CardFooter className="flex-wrap justify-between gap-3 py-4">
        <span className="text-sm text-fg-tertiary">1,284 events in the last 30 days</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

const auditLogTableCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cooud-ui/ui";
import { ChevronRight, Download, Search } from "lucide-react";

interface AuditRow {
  id: string;
  event: string;
  detail: string;
  type: string;
  typeVariant: "info" | "success" | "warning" | "destructive" | "secondary";
  actor: string;
  initials: string;
  ip: string;
  time: string;
}

const auditRows: AuditRow[] = [
  { id: "row-901", event: "member.role_updated", detail: "Felix Weber · Viewer → Admin", type: "Members", typeVariant: "info", actor: "Ingrid Solberg", initials: "IS", ip: "172.64.18.24", time: "Jul 13, 14:32" },
  { id: "row-897", event: "api_key.rotated", detail: "prod-billing-service", type: "API keys", typeVariant: "secondary", actor: "Marcus Chen", initials: "MC", ip: "198.51.100.77", time: "Jul 13, 11:05" },
  { id: "row-894", event: "auth.login_blocked", detail: "5 failed attempts · jonah.kaplan@meridianhq.com", type: "Auth", typeVariant: "destructive", actor: "Meridian Security", initials: "MS", ip: "203.0.113.42", time: "Jul 13, 09:47" },
  { id: "row-882", event: "data.export_created", detail: "Contacts · 12,408 rows · CSV", type: "Data", typeVariant: "warning", actor: "Amara Diallo", initials: "AD", ip: "92.118.30.6", time: "Jul 12, 17:21" },
  { id: "row-871", event: "auth.new_device", detail: "Chrome on macOS · São Paulo, Brazil", type: "Auth", typeVariant: "secondary", actor: "Rosa Delgado", initials: "RD", ip: "198.51.100.9", time: "Jul 12, 10:12" },
  { id: "row-868", event: "workspace.2fa_enforced", detail: "All members · grace period ends July 19", type: "Security", typeVariant: "success", actor: "Ingrid Solberg", initials: "IS", ip: "172.64.18.24", time: "Jul 12, 08:30" },
  { id: "row-859", event: "webhook.deleted", detail: "hooks.legacy.meridianhq.com", type: "API keys", typeVariant: "warning", actor: "Marcus Chen", initials: "MC", ip: "198.51.100.77", time: "Jul 11, 16:44" },
];

export function AuditLogTableBlock() {
  return (
    <Card aria-label="Audit log" className="mx-auto w-full max-w-5xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Audit events</CardTitle>
        <CardDescription>
          Every privileged action in the workspace, retained for 365 days.
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 pt-5 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-tertiary"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search events, actors, or IP addresses…"
            aria-label="Search audit events"
            className="ps-9"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter by event type">
              <SelectValue placeholder="All event types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="members">Members</SelectItem>
              <SelectItem value="api">API keys</SelectItem>
              <SelectItem value="data">Data exports</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="30d">
            <SelectTrigger className="w-full sm:w-40" aria-label="Date range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardContent className="px-0 pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-4 sm:ps-6">Event</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>IP address</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="ps-4 sm:ps-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={row.typeVariant}>{row.type}</Badge>
                      <span className="font-mono text-xs text-fg">{row.event}</span>
                    </div>
                    <span className="text-xs text-fg-tertiary">{row.detail}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">{row.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-fg">{row.actor}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-fg-secondary">{row.ip}</TableCell>
                <TableCell className="text-fg-secondary">{row.time}</TableCell>
                <TableCell className="pe-4 text-end sm:pe-6">
                  <Button variant="ghost" size="icon-sm">
                    <ChevronRight className="size-4" aria-hidden="true" />
                    <span className="sr-only">View details for {row.event}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Separator />

      <CardFooter className="flex-wrap justify-between gap-3 py-4">
        <span className="text-sm text-fg-tertiary">1,284 events in the last 30 days</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const adminBlocks: BlockContentMap = {
  "user-management": {
    preview: <UserManagementTableBlock />,
    code: userManagementTableCode,
    variants: [
      {
        id: "table",
        name: "Directory table",
        description:
          "A searchable member table with a role filter, status badges, row actions and pagination.",
        appearance: "dark",
        preview: <UserManagementTableBlock />,
        code: userManagementTableCode,
      },
      {
        id: "cards",
        name: "Member cards",
        description: "A card grid with the same member actions — a better fit for small teams.",
        appearance: "light",
        preview: <UserManagementCardsBlock />,
        code: userManagementCardsCode,
      },
    ],
  },
  analytics: {
    preview: <AnalyticsOverviewBlock />,
    code: analyticsOverviewCode,
    variants: [
      {
        id: "overview",
        name: "Traffic overview",
        description:
          "KPI metrics with sparklines, a 30-day traffic trend and top pages and referrers breakdowns.",
        appearance: "dark",
        preview: <AnalyticsOverviewBlock />,
        code: analyticsOverviewCode,
      },
      {
        id: "engagement",
        name: "Engagement cohorts",
        description:
          "Retention stat cards plus a weekly cohort heat grid built from token-colored cells.",
        appearance: "light",
        preview: <AnalyticsEngagementBlock />,
        code: analyticsEngagementCode,
      },
    ],
  },
  "kanban-board": {
    preview: <KanbanBoardBlock />,
    code: kanbanBoardCode,
    variants: [
      {
        id: "default",
        name: "Sprint board",
        description:
          "Four columns of labeled cards with assignees, due dates, comment counts and add actions.",
        appearance: "dark",
        preview: <KanbanBoardBlock />,
        code: kanbanBoardCode,
      },
      {
        id: "compact",
        name: "Compact WIP board",
        description:
          "A dense single-line task list with per-column WIP limits and at-limit indicators.",
        appearance: "light",
        preview: <KanbanBoardCompactBlock />,
        code: kanbanBoardCompactCode,
      },
    ],
  },
  "audit-log": {
    preview: <AuditLogTimelineBlock />,
    code: auditLogTimelineCode,
    variants: [
      {
        id: "timeline",
        name: "Day-grouped timeline",
        description:
          "A grouped-by-day security feed with actor avatars, emphasized names and severity badges.",
        appearance: "dark",
        preview: <AuditLogTimelineBlock />,
        code: auditLogTimelineCode,
      },
      {
        id: "table",
        name: "Filterable table",
        description:
          "A filterable event table with type badges, actors, IP addresses and detail affordances.",
        appearance: "light",
        preview: <AuditLogTableBlock />,
        code: auditLogTableCode,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function AdminGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(adminBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function AdminView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(adminBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
