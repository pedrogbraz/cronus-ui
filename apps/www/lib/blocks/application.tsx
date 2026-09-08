"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
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
  Label,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from "@cronus-ui/ui";
import { BRAND, KPIS, type Role, TEAM, USER } from "@cronus-ui/ui/demo-saas";
import {
  Activity,
  DollarSign,
  MoreHorizontal,
  Trash2,
  TrendingDown,
  UserMinus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Stats — dashboard KPI row
 * ────────────────────────────────────────────────────────────────────────── */

const STAT_ICONS = [DollarSign, Users, Activity, TrendingDown] as const;

export function StatsBlock() {
  const stats = KPIS.map((kpi, i) => ({
    ...kpi,
    icon: STAT_ICONS[i] ?? DollarSign,
    hint: "vs. last month",
  }));

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
      {stats.map(({ label, value, delta, trend, icon: Icon, hint }) => (
        <Card key={label} className="gap-4 py-5">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <MetricDelta trend={trend}>{delta}</MetricDelta>
            </div>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl">{value}</MetricValue>
              <span className="text-xs text-fg-tertiary">{hint}</span>
            </Metric>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const statsCode = `import {
  Card,
  CardContent,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
} from "@cronus-ui/ui";
import { KPIS } from "../lib/demo-saas.js";
import { Activity, DollarSign, TrendingDown, Users } from "lucide-react";

const STAT_ICONS = [DollarSign, Users, Activity, TrendingDown] as const;

export function StatsBlock() {
  const stats = KPIS.map((kpi, i) => ({
    ...kpi,
    icon: STAT_ICONS[i] ?? DollarSign,
    hint: "vs. last month",
  }));

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
      {stats.map(({ label, value, delta, trend, icon: Icon, hint }) => (
        <Card key={label} className="gap-4 py-5">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <MetricDelta trend={trend}>{delta}</MetricDelta>
            </div>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl">{value}</MetricValue>
              <span className="text-xs text-fg-tertiary">{hint}</span>
            </Metric>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 1b. Stats / empty — same KPI grid, no values yet
 * ────────────────────────────────────────────────────────────────────────── */

export function StatsEmptyBlock() {
  const stats = KPIS.map((kpi, i) => ({
    label: kpi.label,
    icon: STAT_ICONS[i] ?? DollarSign,
  }));

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
      {stats.map(({ label, icon: Icon }) => (
        <Card key={label} className="gap-4 py-5">
          <CardContent className="flex flex-col gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl text-fg-tertiary">—</MetricValue>
              <span className="text-xs text-fg-tertiary">No data yet</span>
            </Metric>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const statsEmptyCode = `import { Card, CardContent, Metric, MetricLabel, MetricValue } from "@cronus-ui/ui";
import { KPIS } from "../lib/demo-saas.js";
import { Activity, DollarSign, TrendingDown, Users } from "lucide-react";

const STAT_ICONS = [DollarSign, Users, Activity, TrendingDown] as const;

export function StatsEmptyBlock() {
  const stats = KPIS.map((kpi, i) => ({
    label: kpi.label,
    icon: STAT_ICONS[i] ?? DollarSign,
  }));

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-4">
      {stats.map(({ label, icon: Icon }) => (
        <Card key={label} className="gap-4 py-5">
          <CardContent className="flex flex-col gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl text-fg-tertiary">—</MetricValue>
              <span className="text-xs text-fg-tertiary">No data yet</span>
            </Metric>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}`;

export function StatsCompactBlock() {
  const stats = [
    { label: "Net revenue", value: "$128.4k", delta: "+18.2%", trend: "up" as const },
    { label: "New accounts", value: "1,482", delta: "+9.7%", trend: "up" as const },
    { label: "Expansion", value: "$24.1k", delta: "+4.1%", trend: "up" as const },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="font-display text-lg">Growth snapshot</CardTitle>
          <p className="mt-1 text-sm text-fg-secondary">Last 30 days</p>
        </div>
        <Badge variant="success">On track</Badge>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend }) => (
          <Metric key={label} className="gap-1.5">
            <MetricLabel>{label}</MetricLabel>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <MetricValue className="text-3xl">{value}</MetricValue>
              <MetricDelta trend={trend}>{delta}</MetricDelta>
            </div>
          </Metric>
        ))}
      </CardContent>
    </Card>
  );
}

const statsCompactCode = `import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
} from "@cronus-ui/ui";

export function StatsCompactBlock() {
  const stats = [
    { label: "Net revenue", value: "$128.4k", delta: "+18.2%", trend: "up" as const },
    { label: "New accounts", value: "1,482", delta: "+9.7%", trend: "up" as const },
    { label: "Expansion", value: "$24.1k", delta: "+4.1%", trend: "up" as const },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="font-display text-lg">Growth snapshot</CardTitle>
          <p className="mt-1 text-sm text-fg-secondary">Last 30 days</p>
        </div>
        <Badge variant="success">On track</Badge>
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend }) => (
          <Metric key={label} className="gap-1.5">
            <MetricLabel>{label}</MetricLabel>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <MetricValue className="text-3xl">{value}</MetricValue>
              <MetricDelta trend={trend}>{delta}</MetricDelta>
            </div>
          </Metric>
        ))}
      </CardContent>
    </Card>
  );
}`;

export function StatsPipelineBlock() {
  const stats = [
    {
      label: "Trials started",
      value: "2,184",
      delta: "+16.8%",
      trend: "up" as const,
      icon: Users,
    },
    {
      label: "Qualified demos",
      value: "642",
      delta: "+7.4%",
      trend: "up" as const,
      icon: Activity,
    },
    {
      label: "Paid upgrades",
      value: "238",
      delta: "+11.1%",
      trend: "up" as const,
      icon: DollarSign,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">Activation funnel</CardTitle>
        <p className="text-sm text-fg-secondary">Weekly product-led conversion</p>
      </CardHeader>
      <CardContent className="grid gap-0 overflow-hidden rounded-xl border border-border sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend, icon: Icon }, index) => (
          <div
            key={label}
            className="flex flex-col gap-4 border-border bg-surface-raised p-5 sm:border-l sm:first:border-l-0"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-fg-tertiary">Step {index + 1}</span>
            </div>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl">{value}</MetricValue>
            </Metric>
            <MetricDelta trend={trend}>{delta}</MetricDelta>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const statsPipelineCode = `import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Metric,
  MetricDelta,
  MetricLabel,
  MetricValue,
} from "@cronus-ui/ui";
import { Activity, DollarSign, Users } from "lucide-react";

export function StatsPipelineBlock() {
  const stats = [
    {
      label: "Trials started",
      value: "2,184",
      delta: "+16.8%",
      trend: "up" as const,
      icon: Users,
    },
    {
      label: "Qualified demos",
      value: "642",
      delta: "+7.4%",
      trend: "up" as const,
      icon: Activity,
    },
    {
      label: "Paid upgrades",
      value: "238",
      delta: "+11.1%",
      trend: "up" as const,
      icon: DollarSign,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-lg">Activation funnel</CardTitle>
        <p className="text-sm text-fg-secondary">Weekly product-led conversion</p>
      </CardHeader>
      <CardContent className="grid gap-0 overflow-hidden rounded-xl border border-border sm:grid-cols-3">
        {stats.map(({ label, value, delta, trend, icon: Icon }, index) => (
          <div
            key={label}
            className="flex flex-col gap-4 border-border bg-surface-raised p-5 sm:border-l sm:first:border-l-0"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-fg-tertiary">Step {index + 1}</span>
            </div>
            <Metric className="gap-1.5">
              <MetricLabel>{label}</MetricLabel>
              <MetricValue className="text-3xl">{value}</MetricValue>
            </Metric>
            <MetricDelta trend={trend}>{delta}</MetricDelta>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Settings — account settings panel
 * ────────────────────────────────────────────────────────────────────────── */

interface Preference {
  id: string;
  label: string;
  description: string;
}

const preferences: Preference[] = [
  {
    id: "pref-product",
    label: "Product updates",
    description: "News about features and improvements.",
  },
  {
    id: "pref-security",
    label: "Security alerts",
    description: "Get notified about new sign-ins and suspicious activity.",
  },
  {
    id: "pref-digest",
    label: "Weekly digest",
    description: "A summary of your workspace activity, every Monday.",
  },
];

const OWNER = TEAM.find((m) => m.email === USER.email);

export function SettingsBlock() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "pref-product": true,
    "pref-security": true,
    "pref-digest": false,
  });

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Card className="mx-auto w-full max-w-xl shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Account settings</CardTitle>
        <p className="text-sm text-fg-secondary">
          Manage your profile and notification preferences.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Profile */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Profile
          </h3>
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
              <AvatarFallback>{USER.initials}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-name">Full name</Label>
              <Input id="settings-name" defaultValue={USER.name} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" type="email" defaultValue={USER.email} />
            </div>
          </div>
        </section>

        <Separator />

        {/* Preferences */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Preferences
          </h3>
          <div className="flex flex-col gap-4">
            {preferences.map(({ id, label, description }) => (
              <div key={id} className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={id}>{label}</Label>
                  <p className="text-sm text-fg-secondary">{description}</p>
                </div>
                <Switch
                  id={id}
                  checked={enabled[id]}
                  onCheckedChange={() => toggle(id)}
                  aria-label={label}
                />
              </div>
            ))}
          </div>
        </section>
      </CardContent>

      <Separator />

      <CardFooter className="justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save changes</Button>
      </CardFooter>
    </Card>
  );
}

const settingsCode = `"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Switch,
} from "@cronus-ui/ui";
import { TEAM, USER } from "../lib/demo-saas.js";
import { useState } from "react";

interface Preference {
  id: string;
  label: string;
  description: string;
}

const preferences: Preference[] = [
  {
    id: "pref-product",
    label: "Product updates",
    description: "News about features and improvements.",
  },
  {
    id: "pref-security",
    label: "Security alerts",
    description: "Get notified about new sign-ins and suspicious activity.",
  },
  {
    id: "pref-digest",
    label: "Weekly digest",
    description: "A summary of your workspace activity, every Monday.",
  },
];

const OWNER = TEAM.find((m) => m.email === USER.email);

export function SettingsBlock() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "pref-product": true,
    "pref-security": true,
    "pref-digest": false,
  });

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <Card className="mx-auto w-full max-w-xl shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Account settings</CardTitle>
        <p className="text-sm text-fg-secondary">
          Manage your profile and notification preferences.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Profile */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Profile
          </h3>
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {OWNER?.avatar ? <AvatarImage src={OWNER.avatar} alt={USER.name} /> : null}
              <AvatarFallback>{USER.initials}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-name">Full name</Label>
              <Input id="settings-name" defaultValue={USER.name} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" type="email" defaultValue={USER.email} />
            </div>
          </div>
        </section>

        <Separator />

        {/* Preferences */}
        <section className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary">
            Preferences
          </h3>
          <div className="flex flex-col gap-4">
            {preferences.map(({ id, label, description }) => (
              <div key={id} className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={id}>{label}</Label>
                  <p className="text-sm text-fg-secondary">{description}</p>
                </div>
                <Switch
                  id={id}
                  checked={enabled[id]}
                  onCheckedChange={() => toggle(id)}
                  aria-label={label}
                />
              </div>
            ))}
          </div>
        </section>
      </CardContent>

      <Separator />

      <CardFooter className="justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Save changes</Button>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2b. Settings / workspace — name, slug, defaults, danger zone
 * ────────────────────────────────────────────────────────────────────────── */

export function SettingsWorkspaceBlock() {
  return (
    <section
      aria-label="Workspace settings"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Workspace</CardTitle>
          <CardDescription>Name, URL, and mark for this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-name">Workspace name</Label>
            <Input id="settings-workspace-name" defaultValue={BRAND} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-slug">URL</Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-s-lg border border-e-0 border-border bg-surface-overlay px-3 text-sm text-fg-tertiary">
                app.cronus.dev/
              </span>
              <Input
                id="settings-workspace-slug"
                className="rounded-s-none"
                defaultValue={BRAND.toLowerCase()}
                spellCheck={false}
              />
            </div>
            <p className="text-sm text-fg-secondary">
              Used in invite links and the workspace switcher.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Defaults</CardTitle>
          <CardDescription>Applied to everyone in this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="settings-workspace-language" aria-label="Workspace language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-timezone">Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger id="settings-workspace-timezone" aria-label="Workspace timezone">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="sao-paulo">America/São Paulo</SelectItem>
                <SelectItem value="new-york">America/New York</SelectItem>
                <SelectItem value="london">Europe/London</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </CardFooter>
      </Card>

      <Card className="border-error/30 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg text-error-strong">Danger zone</CardTitle>
          <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium text-fg">Transfer ownership</span>
              <p className="text-sm text-fg-secondary">
                Hand this workspace to another owner. You become an admin.
              </p>
            </div>
            <Button variant="outline">Transfer</Button>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium text-fg">Delete this workspace</span>
              <p className="text-sm text-fg-secondary">
                Removes members, items, and billing history for good.
              </p>
            </div>
            <Button variant="destructive">
              <Trash2 className="size-4" aria-hidden="true" />
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

const settingsWorkspaceCode = `"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@cronus-ui/ui";
import { BRAND } from "../lib/demo-saas.js";
import { Trash2 } from "lucide-react";

export function SettingsWorkspaceBlock() {
  return (
    <section
      aria-label="Workspace settings"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Workspace</CardTitle>
          <CardDescription>Name, URL, and mark for this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-name">Workspace name</Label>
            <Input id="settings-workspace-name" defaultValue={BRAND} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-slug">URL</Label>
            <div className="flex">
              <span className="inline-flex items-center rounded-s-lg border border-e-0 border-border bg-surface-overlay px-3 text-sm text-fg-tertiary">
                app.cronus.dev/
              </span>
              <Input
                id="settings-workspace-slug"
                className="rounded-s-none"
                defaultValue={BRAND.toLowerCase()}
                spellCheck={false}
              />
            </div>
            <p className="text-sm text-fg-secondary">Used in invite links and the workspace switcher.</p>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Defaults</CardTitle>
          <CardDescription>Applied to everyone in this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="settings-workspace-language" aria-label="Workspace language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="settings-workspace-timezone">Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger id="settings-workspace-timezone" aria-label="Workspace timezone">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="sao-paulo">America/São Paulo</SelectItem>
                <SelectItem value="new-york">America/New York</SelectItem>
                <SelectItem value="london">Europe/London</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </CardFooter>
      </Card>

      <Card className="border-error/30 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg text-error-strong">Danger zone</CardTitle>
          <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium text-fg">Transfer ownership</span>
              <p className="text-sm text-fg-secondary">
                Hand this workspace to another owner. You become an admin.
              </p>
            </div>
            <Button variant="outline">Transfer</Button>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium text-fg">Delete this workspace</span>
              <p className="text-sm text-fg-secondary">
                Removes members, items, and billing history for good.
              </p>
            </div>
            <Button variant="destructive">
              <Trash2 className="size-4" aria-hidden="true" />
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Team — team-members list
 * ────────────────────────────────────────────────────────────────────────── */

const ROLE_VARIANT: Record<Role, "primary" | "info" | "secondary"> = {
  Owner: "primary",
  Admin: "info",
  Member: "secondary",
};

export function TeamBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 py-0 shadow-md">
      <CardHeader className="items-center px-6 py-5">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg">Team members</CardTitle>
          <p className="text-sm text-fg-secondary">Invite and manage your workspace teammates.</p>
        </div>
        <Button variant="primary" size="sm" className="col-start-2 row-span-2 self-center">
          <Users className="size-4" aria-hidden="true" />
          Invite
        </Button>
      </CardHeader>

      <Separator />

      <ul className="flex flex-col">
        {TEAM.map((member, i) => (
          <li
            key={member.id}
            className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-overlay/60 ${
              i !== TEAM.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <Avatar>
              {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-fg">{member.name}</span>
              <span className="truncate text-sm text-fg-secondary">{member.email}</span>
            </div>

            <Badge variant={ROLE_VARIANT[member.role]}>{member.role}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`}>
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="size-4" aria-hidden="true" />
                  Change role
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error focus:text-error">
                  <UserMinus className="size-4" aria-hidden="true" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const teamCode = `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
} from "@cronus-ui/ui";
import { TEAM, type Role } from "../lib/demo-saas.js";
import { MoreHorizontal, UserMinus, Users } from "lucide-react";

const ROLE_VARIANT: Record<Role, "primary" | "info" | "secondary"> = {
  Owner: "primary",
  Admin: "info",
  Member: "secondary",
};

export function TeamBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 py-0 shadow-md">
      <CardHeader className="items-center px-6 py-5">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg">Team members</CardTitle>
          <p className="text-sm text-fg-secondary">Invite and manage your workspace teammates.</p>
        </div>
        <Button variant="primary" size="sm" className="col-start-2 row-span-2 self-center">
          <Users className="size-4" aria-hidden="true" />
          Invite
        </Button>
      </CardHeader>

      <Separator />

      <ul className="flex flex-col">
        {TEAM.map((member, i) => (
          <li
            key={member.id}
            className={\`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-overlay/60 \${
              i !== TEAM.length - 1 ? "border-b border-border" : ""
            }\`}
          >
            <Avatar>
              {member.avatar ? <AvatarImage src={member.avatar} alt={member.name} /> : null}
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-fg">{member.name}</span>
              <span className="truncate text-sm text-fg-secondary">{member.email}</span>
            </div>

            <Badge variant={ROLE_VARIANT[member.role]}>{member.role}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={\`Actions for \${member.name}\`}>
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{member.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="size-4" aria-hidden="true" />
                  Change role
                </DropdownMenuItem>
                <DropdownMenuItem className="text-error focus:text-error">
                  <UserMinus className="size-4" aria-hidden="true" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3b. Team / empty — no teammates yet, same chrome as the member list
 * ────────────────────────────────────────────────────────────────────────── */

export function TeamEmptyBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 py-0 shadow-md">
      <CardHeader className="items-center px-6 py-5">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg">Team members</CardTitle>
          <p className="text-sm text-fg-secondary">Invite and manage your workspace teammates.</p>
        </div>
        <Button variant="primary" size="sm" className="col-start-2 row-span-2 self-center">
          <Users className="size-4" aria-hidden="true" />
          Invite
        </Button>
      </CardHeader>

      <Separator />

      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-surface-overlay text-fg-secondary">
          <Users className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-fg">No teammates yet</p>
          <p className="text-sm text-fg-secondary">Invite someone to share this workspace.</p>
        </div>
      </div>
    </Card>
  );
}

const teamEmptyCode = `import { Button, Card, CardHeader, CardTitle, Separator } from "@cronus-ui/ui";
import { Users } from "lucide-react";

export function TeamEmptyBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 py-0 shadow-md">
      <CardHeader className="items-center px-6 py-5">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-display text-lg">Team members</CardTitle>
          <p className="text-sm text-fg-secondary">Invite and manage your workspace teammates.</p>
        </div>
        <Button variant="primary" size="sm" className="col-start-2 row-span-2 self-center">
          <Users className="size-4" aria-hidden="true" />
          Invite
        </Button>
      </CardHeader>

      <Separator />

      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-surface-overlay text-fg-secondary">
          <Users className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-fg">No teammates yet</p>
          <p className="text-sm text-fg-secondary">Invite someone to share this workspace.</p>
        </div>
      </div>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const applicationBlocks: BlockContentMap = {
  stats: {
    preview: <StatsBlock />,
    code: statsCode,
    variants: [
      {
        id: "kpi-grid",
        name: "KPI grid",
        description: "Four-card dashboard metrics with icons, deltas, and contextual hints.",
        appearance: "dark",
        preview: <StatsBlock />,
        code: statsCode,
      },
      {
        id: "empty",
        name: "Empty",
        description: "The same KPI grid with em dashes and no-data hints.",
        appearance: "light",
        preview: <StatsEmptyBlock />,
        code: statsEmptyCode,
      },
      {
        id: "compact-summary",
        name: "Compact summary",
        description: "A single-card metric summary for dense dashboards and overview panels.",
        appearance: "light",
        preview: <StatsCompactBlock />,
        code: statsCompactCode,
      },
      {
        id: "pipeline-funnel",
        name: "Pipeline funnel",
        description: "A segmented stats card for activation, pipeline, or conversion steps.",
        appearance: "dark",
        preview: <StatsPipelineBlock />,
        code: statsPipelineCode,
      },
    ],
  },
  settings: {
    preview: <SettingsBlock />,
    code: settingsCode,
    variants: [
      {
        id: "account",
        name: "Account",
        description: "Profile photo, name, email, and notification preferences.",
        appearance: "dark",
        preview: <SettingsBlock />,
        code: settingsCode,
      },
      {
        id: "workspace",
        name: "Workspace",
        description: "Workspace name, slug, language and timezone defaults, and a danger zone.",
        appearance: "dark",
        preview: <SettingsWorkspaceBlock />,
        code: settingsWorkspaceCode,
      },
    ],
  },
  team: {
    preview: <TeamBlock />,
    code: teamCode,
    variants: [
      {
        id: "list",
        name: "Member list",
        description: "Avatars, roles, and a per-member action menu.",
        appearance: "dark",
        preview: <TeamBlock />,
        code: teamCode,
      },
      {
        id: "empty",
        name: "Empty",
        description: "No teammates yet, with the same chrome and an Invite action.",
        appearance: "light",
        preview: <TeamEmptyBlock />,
        code: teamEmptyCode,
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

export function ApplicationGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(applicationBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function ApplicationView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(applicationBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
