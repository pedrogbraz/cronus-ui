"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CopyButton,
  Input,
  Label,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cronus-ui/ui";
import {
  Check,
  Download,
  Eye,
  KeyRound,
  Laptop,
  LogOut,
  type LucideIcon,
  MailCheck,
  Monitor,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Tablet,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Account security — 2FA setup + password & danger zone
 * ────────────────────────────────────────────────────────────────────────── */

const qrModules = [
  "#####...#####",
  "#...#.#.#...#",
  "#.#.#..##.#.#",
  "#...#.#.#...#",
  "#####.#.#####",
  "......#......",
  "#.#.#.#.#.#.#",
  "..#..##..#.#.",
  "#####.#.##..#",
  "#...#..##.#..",
  "#.#.#.#..###.",
  "#...##..#..##",
  "#####..#.#.#.",
];

const qrCells = qrModules.flatMap((row, y) =>
  row.split("").flatMap((cell, x) => (cell === "#" ? [{ x, y }] : [])),
);

const setupSteps = [
  {
    title: "Install an authenticator app",
    detail: "1Password, Google Authenticator, and Authy all work.",
  },
  {
    title: "Scan the QR code",
    detail: "Or enter the setup key below manually.",
  },
  {
    title: "Enter the 6-digit code",
    detail: "Confirm the first code to finish pairing.",
  },
];

const backupCodes = [
  "QK7M-4H2X",
  "8PWD-J3RT",
  "XN5C-U9LB",
  "M2FA-D6KQ",
  "7VGH-P0SZ",
  "RJ4E-W8YN",
  "B3TU-K5MC",
  "H9QX-A1DF",
];

export function AccountSecurityTwoFactorBlock() {
  return (
    <section
      aria-label="Two-factor authentication settings"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Card className="shadow-md">
        <CardContent className="flex flex-wrap items-center gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-fg">Two-factor authentication</span>
              <Badge variant="success">Enabled</Badge>
            </div>
            <p className="text-sm text-fg-secondary">
              Require a verification code in addition to your password at sign-in.
            </p>
          </div>
          <Switch defaultChecked aria-label="Toggle two-factor authentication" />
        </CardContent>
      </Card>

      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Authenticator app</CardTitle>
          <CardDescription>
            Pair an app that generates rotating 6-digit codes for this account.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pt-6 sm:flex-row">
          <div className="h-fit w-fit shrink-0 rounded-xl border border-border bg-surface-inset p-3">
            <svg
              viewBox="0 0 13 13"
              role="img"
              aria-label="QR code that pairs this account with an authenticator app"
              shapeRendering="crispEdges"
              className="block size-36 text-fg"
            >
              {qrCells.map((cell) => (
                <rect
                  key={`qr-${cell.x}-${cell.y}`}
                  x={cell.x}
                  y={cell.y}
                  width={1}
                  height={1}
                  fill="currentColor"
                />
              ))}
            </svg>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <ol className="flex flex-col gap-3">
              {setupSteps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-inset text-xs font-medium text-fg-secondary">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium text-fg">{step.title}</span>
                    <span className="text-xs text-fg-tertiary">{step.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-inset py-1 pe-1 ps-3">
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg-secondary">
                JBSW Y3DP EHPK 3PXP QK7M 30XA
              </code>
              <CopyButton
                value="JBSWY3DPEHPK3PXPQK7M30XA"
                size="icon-sm"
                copyLabel="Copy setup key"
                className="shrink-0"
              />
            </div>
          </div>
        </CardContent>

        <Separator className="my-6" />

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium text-fg">Backup codes</span>
              <p className="text-sm text-fg-secondary">
                Each code signs you in once if you lose your authenticator.
              </p>
            </div>
            <CopyButton
              value={backupCodes.join("\n")}
              variant="outline"
              size="icon-sm"
              copyLabel="Copy all backup codes"
            />
            <Button variant="outline" size="icon-sm">
              <Download className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Download backup codes</span>
            </Button>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {backupCodes.map((code) => (
              <li
                key={code}
                className="rounded-lg border border-border bg-surface-inset px-2 py-1.5 text-center font-mono text-xs text-fg-secondary"
              >
                {code}
              </li>
            ))}
          </ul>
        </CardContent>

        <Separator className="mt-6" />

        <CardFooter className="justify-between gap-3 py-5">
          <span className="text-xs text-fg-tertiary">
            8 of 8 codes left · Generated Jun 02, 2026
          </span>
          <Button variant="ghost" size="sm">
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Regenerate
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

const accountSecurityTwoFactorCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CopyButton,
  Separator,
  Switch,
} from "@cronus-ui/ui";
import { Download, RefreshCw, ShieldCheck } from "lucide-react";

const qrModules = [
  "#####...#####",
  "#...#.#.#...#",
  "#.#.#..##.#.#",
  "#...#.#.#...#",
  "#####.#.#####",
  "......#......",
  "#.#.#.#.#.#.#",
  "..#..##..#.#.",
  "#####.#.##..#",
  "#...#..##.#..",
  "#.#.#.#..###.",
  "#...##..#..##",
  "#####..#.#.#.",
];

const qrCells = qrModules.flatMap((row, y) =>
  row.split("").flatMap((cell, x) => (cell === "#" ? [{ x, y }] : [])),
);

const setupSteps = [
  {
    title: "Install an authenticator app",
    detail: "1Password, Google Authenticator, and Authy all work.",
  },
  {
    title: "Scan the QR code",
    detail: "Or enter the setup key below manually.",
  },
  {
    title: "Enter the 6-digit code",
    detail: "Confirm the first code to finish pairing.",
  },
];

const backupCodes = [
  "QK7M-4H2X",
  "8PWD-J3RT",
  "XN5C-U9LB",
  "M2FA-D6KQ",
  "7VGH-P0SZ",
  "RJ4E-W8YN",
  "B3TU-K5MC",
  "H9QX-A1DF",
];

export function AccountSecurityTwoFactorBlock() {
  return (
    <section
      aria-label="Two-factor authentication settings"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Card className="shadow-md">
        <CardContent className="flex flex-wrap items-center gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-fg">Two-factor authentication</span>
              <Badge variant="success">Enabled</Badge>
            </div>
            <p className="text-sm text-fg-secondary">
              Require a verification code in addition to your password at sign-in.
            </p>
          </div>
          <Switch defaultChecked aria-label="Toggle two-factor authentication" />
        </CardContent>
      </Card>

      <Card className="gap-0 pb-0 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Authenticator app</CardTitle>
          <CardDescription>
            Pair an app that generates rotating 6-digit codes for this account.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 pt-6 sm:flex-row">
          <div className="h-fit w-fit shrink-0 rounded-xl border border-border bg-surface-inset p-3">
            <svg
              viewBox="0 0 13 13"
              role="img"
              aria-label="QR code that pairs this account with an authenticator app"
              shapeRendering="crispEdges"
              className="block size-36 text-fg"
            >
              {qrCells.map((cell) => (
                <rect
                  key={\`qr-\${cell.x}-\${cell.y}\`}
                  x={cell.x}
                  y={cell.y}
                  width={1}
                  height={1}
                  fill="currentColor"
                />
              ))}
            </svg>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <ol className="flex flex-col gap-3">
              {setupSteps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-inset text-xs font-medium text-fg-secondary">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium text-fg">{step.title}</span>
                    <span className="text-xs text-fg-tertiary">{step.detail}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-inset py-1 pe-1 ps-3">
              <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg-secondary">
                JBSW Y3DP EHPK 3PXP QK7M 30XA
              </code>
              <CopyButton
                value="JBSWY3DPEHPK3PXPQK7M30XA"
                size="icon-sm"
                copyLabel="Copy setup key"
                className="shrink-0"
              />
            </div>
          </div>
        </CardContent>

        <Separator className="my-6" />

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-medium text-fg">Backup codes</span>
              <p className="text-sm text-fg-secondary">
                Each code signs you in once if you lose your authenticator.
              </p>
            </div>
            <CopyButton
              value={backupCodes.join("\\n")}
              variant="outline"
              size="icon-sm"
              copyLabel="Copy all backup codes"
            />
            <Button variant="outline" size="icon-sm">
              <Download className="size-3.5" aria-hidden="true" />
              <span className="sr-only">Download backup codes</span>
            </Button>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {backupCodes.map((code) => (
              <li
                key={code}
                className="rounded-lg border border-border bg-surface-inset px-2 py-1.5 text-center font-mono text-xs text-fg-secondary"
              >
                {code}
              </li>
            ))}
          </ul>
        </CardContent>

        <Separator className="mt-6" />

        <CardFooter className="justify-between gap-3 py-5">
          <span className="text-xs text-fg-tertiary">
            8 of 8 codes left · Generated Jun 02, 2026
          </span>
          <Button variant="ghost" size="sm">
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Regenerate
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}`;

export function AccountSecurityPasswordBlock() {
  return (
    <section
      aria-label="Password and account security"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Change password</CardTitle>
          <CardDescription>
            Choose a strong password you haven&apos;t used anywhere else.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="security-current-password">Current password</Label>
            <Input
              id="security-current-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="security-new-password">New password</Label>
            <Input
              id="security-new-password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
            />
            <Progress value={80} aria-label="Password strength: strong" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-fg-tertiary">Use 12+ characters with numbers and symbols.</span>
              <span className="font-medium text-success-strong">Strong</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="security-confirm-password">Confirm new password</Label>
            <Input
              id="security-confirm-password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Update password</Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardContent className="flex flex-wrap items-center gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-inset text-fg-secondary">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-fg">Recovery email</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <p className="truncate text-sm text-fg-secondary">m.castillo@fastmail.com</p>
          </div>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </CardContent>
      </Card>

      <Card className="border-error/30 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg text-error-strong">Danger zone</CardTitle>
          <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-medium text-fg">Delete this account</span>
            <p className="text-sm text-fg-secondary">
              Removes your workspace, products, and billing history for good.
            </p>
          </div>
          <Button variant="destructive">
            <Trash2 className="size-4" aria-hidden="true" />
            Delete account
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

const accountSecurityPasswordCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Progress,
} from "@cronus-ui/ui";
import { MailCheck, Trash2 } from "lucide-react";

export function AccountSecurityPasswordBlock() {
  return (
    <section
      aria-label="Password and account security"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Change password</CardTitle>
          <CardDescription>
            Choose a strong password you haven&apos;t used anywhere else.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="security-current-password">Current password</Label>
            <Input
              id="security-current-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="security-new-password">New password</Label>
            <Input
              id="security-new-password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
            />
            <Progress value={80} aria-label="Password strength: strong" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-fg-tertiary">Use 12+ characters with numbers and symbols.</span>
              <span className="font-medium text-success-strong">Strong</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="security-confirm-password">Confirm new password</Label>
            <Input
              id="security-confirm-password"
              type="password"
              placeholder="••••••••••••"
              autoComplete="new-password"
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Update password</Button>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <CardContent className="flex flex-wrap items-center gap-4">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-inset text-fg-secondary">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-fg">Recovery email</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <p className="truncate text-sm text-fg-secondary">m.castillo@fastmail.com</p>
          </div>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </CardContent>
      </Card>

      <Card className="border-error/30 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg text-error-strong">Danger zone</CardTitle>
          <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-medium text-fg">Delete this account</span>
            <p className="text-sm text-fg-secondary">
              Removes your workspace, products, and billing history for good.
            </p>
          </div>
          <Button variant="destructive">
            <Trash2 className="size-4" aria-hidden="true" />
            Delete account
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Sessions — active devices list + selectable table
 * ────────────────────────────────────────────────────────────────────────── */

interface DeviceSession {
  id: string;
  device: string;
  client: string;
  location: string;
  lastActive: string;
  icon: LucideIcon;
  current?: boolean;
}

const deviceSessions: DeviceSession[] = [
  {
    id: "ses-01",
    device: "MacBook Pro 16″",
    client: "Chrome 126 · macOS Sonoma",
    location: "San Francisco, US",
    lastActive: "Active now",
    icon: Laptop,
    current: true,
  },
  {
    id: "ses-02",
    device: "iPhone 15 Pro",
    client: "Cronus iOS 2.4.1",
    location: "San Francisco, US",
    lastActive: "25 minutes ago",
    icon: Smartphone,
  },
  {
    id: "ses-03",
    device: "Windows workstation",
    client: "Edge 126 · Windows 11",
    location: "Austin, US",
    lastActive: "Yesterday, 9:12 PM",
    icon: Monitor,
  },
  {
    id: "ses-04",
    device: "iPad Air",
    client: "Safari 17 · iPadOS 17",
    location: "Lisbon, PT",
    lastActive: "Jun 24, 2026",
    icon: Tablet,
  },
];

export function SessionsListBlock() {
  return (
    <Card className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Active sessions</CardTitle>
        <CardDescription>Devices currently signed in to your account.</CardDescription>
        <CardAction>
          <Badge variant="secondary">4 devices</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <ul className="flex flex-col">
          {deviceSessions.map((session) => {
            const Icon = session.icon;
            return (
              <li
                key={session.id}
                className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-4 sm:px-6"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-inset text-fg-secondary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-fg">{session.device}</span>
                    {session.current ? <Badge variant="success">This device</Badge> : null}
                  </div>
                  <span className="text-sm text-fg-secondary">{session.client}</span>
                  <span className="text-xs text-fg-tertiary">
                    {session.location} · {session.lastActive}
                  </span>
                </div>
                {session.current ? null : (
                  <Button variant="ghost" size="sm" className="text-error-strong">
                    Revoke
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">
          Revoking a session signs that device out immediately.
        </span>
        <Button variant="outline" size="sm">
          <LogOut className="size-3.5" aria-hidden="true" />
          Sign out all other sessions
        </Button>
      </CardFooter>
    </Card>
  );
}

const sessionsListCode = `import {
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
} from "@cronus-ui/ui";
import { Laptop, LogOut, type LucideIcon, Monitor, Smartphone, Tablet } from "lucide-react";

interface DeviceSession {
  id: string;
  device: string;
  client: string;
  location: string;
  lastActive: string;
  icon: LucideIcon;
  current?: boolean;
}

const deviceSessions: DeviceSession[] = [
  {
    id: "ses-01",
    device: "MacBook Pro 16″",
    client: "Chrome 126 · macOS Sonoma",
    location: "San Francisco, US",
    lastActive: "Active now",
    icon: Laptop,
    current: true,
  },
  {
    id: "ses-02",
    device: "iPhone 15 Pro",
    client: "Cronus iOS 2.4.1",
    location: "San Francisco, US",
    lastActive: "25 minutes ago",
    icon: Smartphone,
  },
  {
    id: "ses-03",
    device: "Windows workstation",
    client: "Edge 126 · Windows 11",
    location: "Austin, US",
    lastActive: "Yesterday, 9:12 PM",
    icon: Monitor,
  },
  {
    id: "ses-04",
    device: "iPad Air",
    client: "Safari 17 · iPadOS 17",
    location: "Lisbon, PT",
    lastActive: "Jun 24, 2026",
    icon: Tablet,
  },
];

export function SessionsListBlock() {
  return (
    <Card className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Active sessions</CardTitle>
        <CardDescription>Devices currently signed in to your account.</CardDescription>
        <CardAction>
          <Badge variant="secondary">4 devices</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <ul className="flex flex-col">
          {deviceSessions.map((session) => {
            const Icon = session.icon;
            return (
              <li
                key={session.id}
                className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-4 sm:px-6"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-inset text-fg-secondary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-fg">{session.device}</span>
                    {session.current ? <Badge variant="success">This device</Badge> : null}
                  </div>
                  <span className="text-sm text-fg-secondary">{session.client}</span>
                  <span className="text-xs text-fg-tertiary">
                    {session.location} · {session.lastActive}
                  </span>
                </div>
                {session.current ? null : (
                  <Button variant="ghost" size="sm" className="text-error-strong">
                    Revoke
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">
          Revoking a session signs that device out immediately.
        </span>
        <Button variant="outline" size="sm">
          <LogOut className="size-3.5" aria-hidden="true" />
          Sign out all other sessions
        </Button>
      </CardFooter>
    </Card>
  );
}`;

interface UserSession {
  id: string;
  device: string;
  client: string;
  location: string;
  lastActive: string;
  icon: LucideIcon;
  current?: boolean;
  selected?: boolean;
}

const sessions: UserSession[] = [
  {
    id: "ses-01",
    device: "MacBook Pro 16″",
    client: "Chrome 126 · macOS Sonoma",
    location: "San Francisco, US",
    lastActive: "Active now",
    icon: Laptop,
    current: true,
  },
  {
    id: "ses-02",
    device: "iPhone 15 Pro",
    client: "Cronus iOS 2.4.1",
    location: "San Francisco, US",
    lastActive: "25 minutes ago",
    icon: Smartphone,
    selected: true,
  },
  {
    id: "ses-03",
    device: "Windows workstation",
    client: "Edge 126 · Windows 11",
    location: "Austin, US",
    lastActive: "Yesterday, 9:12 PM",
    icon: Monitor,
    selected: true,
  },
  {
    id: "ses-04",
    device: "iPad Air",
    client: "Safari 17 · iPadOS 17",
    location: "Lisbon, PT",
    lastActive: "Jun 24, 2026",
    icon: Tablet,
  },
];

export function SessionsTableBlock() {
  return (
    <Card className="mx-auto w-full max-w-3xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Sessions</CardTitle>
        <CardDescription>Review and revoke access across your devices.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <LogOut className="size-3.5" aria-hidden="true" />
            Revoke selected
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 ps-4 sm:ps-6">
                <Checkbox aria-label="Select all sessions" />
              </TableHead>
              <TableHead>Device</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden sm:table-cell">Last active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const Icon = session.icon;
              return (
                <TableRow key={session.id}>
                  <TableCell className="ps-4 sm:ps-6">
                    <Checkbox
                      defaultChecked={session.selected}
                      aria-label={`Select ${session.device}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-inset text-fg-secondary">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="font-medium text-fg">{session.device}</span>
                        <span className="text-xs text-fg-tertiary">{session.client}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-fg-secondary md:table-cell">
                    {session.location}
                  </TableCell>
                  <TableCell className="hidden text-fg-secondary sm:table-cell">
                    {session.lastActive}
                  </TableCell>
                  <TableCell>
                    {session.current ? (
                      <Badge variant="success">This device</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="pe-4 text-end sm:pe-6">
                    {session.current ? null : (
                      <Button variant="ghost" size="sm" className="text-error-strong">
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">4 sessions · 2 selected</span>
        <span className="text-xs text-fg-tertiary">Sessions expire after 30 days idle.</span>
      </CardFooter>
    </Card>
  );
}

const sessionsTableCode = `import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cronus-ui/ui";
import { Laptop, LogOut, type LucideIcon, Monitor, Smartphone, Tablet } from "lucide-react";

interface UserSession {
  id: string;
  device: string;
  client: string;
  location: string;
  lastActive: string;
  icon: LucideIcon;
  current?: boolean;
  selected?: boolean;
}

const sessions: UserSession[] = [
  {
    id: "ses-01",
    device: "MacBook Pro 16″",
    client: "Chrome 126 · macOS Sonoma",
    location: "San Francisco, US",
    lastActive: "Active now",
    icon: Laptop,
    current: true,
  },
  {
    id: "ses-02",
    device: "iPhone 15 Pro",
    client: "Cronus iOS 2.4.1",
    location: "San Francisco, US",
    lastActive: "25 minutes ago",
    icon: Smartphone,
    selected: true,
  },
  {
    id: "ses-03",
    device: "Windows workstation",
    client: "Edge 126 · Windows 11",
    location: "Austin, US",
    lastActive: "Yesterday, 9:12 PM",
    icon: Monitor,
    selected: true,
  },
  {
    id: "ses-04",
    device: "iPad Air",
    client: "Safari 17 · iPadOS 17",
    location: "Lisbon, PT",
    lastActive: "Jun 24, 2026",
    icon: Tablet,
  },
];

export function SessionsTableBlock() {
  return (
    <Card className="mx-auto w-full max-w-3xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Sessions</CardTitle>
        <CardDescription>Review and revoke access across your devices.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <LogOut className="size-3.5" aria-hidden="true" />
            Revoke selected
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 ps-4 sm:ps-6">
                <Checkbox aria-label="Select all sessions" />
              </TableHead>
              <TableHead>Device</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden sm:table-cell">Last active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pe-4 text-end sm:pe-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => {
              const Icon = session.icon;
              return (
                <TableRow key={session.id}>
                  <TableCell className="ps-4 sm:ps-6">
                    <Checkbox
                      defaultChecked={session.selected}
                      aria-label={\`Select \${session.device}\`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-inset text-fg-secondary">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="font-medium text-fg">{session.device}</span>
                        <span className="text-xs text-fg-tertiary">{session.client}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-fg-secondary md:table-cell">
                    {session.location}
                  </TableCell>
                  <TableCell className="hidden text-fg-secondary sm:table-cell">
                    {session.lastActive}
                  </TableCell>
                  <TableCell>
                    {session.current ? (
                      <Badge variant="success">This device</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="pe-4 text-end sm:pe-6">
                    {session.current ? null : (
                      <Button variant="ghost" size="sm" className="text-error-strong">
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">4 sessions · 2 selected</span>
        <span className="text-xs text-fg-tertiary">Sessions expire after 30 days idle.</span>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. API keys — key list + create-key panel
 * ────────────────────────────────────────────────────────────────────────── */

interface ApiKey {
  id: string;
  name: string;
  /** Full key value used by the copy action — the UI only ever renders maskedKey. */
  secret: string;
  maskedKey: string;
  scopes: string[];
  created: string;
  lastUsed: string;
}

const apiKeys: ApiKey[] = [
  {
    id: "key-01",
    name: "Production storefront",
    secret: "ck_live_8f31c9a2e6b7d4059a2c4f2a",
    maskedKey: "ck_live_••••••••••••4f2a",
    scopes: ["orders:read", "products:write"],
    created: "Mar 12, 2026",
    lastUsed: "2 minutes ago",
  },
  {
    id: "key-02",
    name: "Zapier integration",
    secret: "ck_live_3d7e91f4b8a2c6501e839c1d",
    maskedKey: "ck_live_••••••••••••9c1d",
    scopes: ["orders:read"],
    created: "Jan 28, 2026",
    lastUsed: "3 hours ago",
  },
  {
    id: "key-03",
    name: "Staging sandbox",
    secret: "ck_test_5a2f8c1d9e4b76032c187b3e",
    maskedKey: "ck_test_••••••••••••7b3e",
    scopes: ["orders:read", "customers:read"],
    created: "Jun 02, 2026",
    lastUsed: "Jun 30, 2026",
  },
];

export function ApiKeysListBlock() {
  return (
    <Card className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">API keys</CardTitle>
        <CardDescription>Programmatic access to your Cronus workspace.</CardDescription>
        <CardAction>
          <Button variant="primary" size="sm">
            <Plus className="size-3.5" aria-hidden="true" />
            Create key
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <ul className="flex flex-col">
          {apiKeys.map((apiKey) => (
            <li
              key={apiKey.id}
              className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:px-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-fg">{apiKey.name}</span>
                {apiKey.scopes.map((scope) => (
                  <Badge key={scope} variant="secondary" className="font-mono text-xs">
                    {scope}
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="ms-auto text-error-strong">
                  Revoke
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1 rounded-lg border border-border bg-surface-inset py-1 pe-1 ps-3">
                  <code className="font-mono text-xs text-fg-secondary">{apiKey.maskedKey}</code>
                  <Button variant="ghost" size="icon-sm">
                    <Eye className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Reveal {apiKey.name} key</span>
                  </Button>
                  <CopyButton
                    value={apiKey.secret}
                    size="icon-sm"
                    copyLabel={`Copy ${apiKey.name} key`}
                  />
                </span>
                <span className="text-xs text-fg-tertiary">
                  Created {apiKey.created} · Last used {apiKey.lastUsed}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">3 active keys</span>
        <span className="text-xs text-fg-tertiary">Rotate keys at least every 90 days.</span>
      </CardFooter>
    </Card>
  );
}

const apiKeysListCode = `import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CopyButton,
  Separator,
} from "@cronus-ui/ui";
import { Eye, Plus } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  /** Full key value used by the copy action — the UI only ever renders maskedKey. */
  secret: string;
  maskedKey: string;
  scopes: string[];
  created: string;
  lastUsed: string;
}

const apiKeys: ApiKey[] = [
  {
    id: "key-01",
    name: "Production storefront",
    secret: "ck_live_8f31c9a2e6b7d4059a2c4f2a",
    maskedKey: "ck_live_••••••••••••4f2a",
    scopes: ["orders:read", "products:write"],
    created: "Mar 12, 2026",
    lastUsed: "2 minutes ago",
  },
  {
    id: "key-02",
    name: "Zapier integration",
    secret: "ck_live_3d7e91f4b8a2c6501e839c1d",
    maskedKey: "ck_live_••••••••••••9c1d",
    scopes: ["orders:read"],
    created: "Jan 28, 2026",
    lastUsed: "3 hours ago",
  },
  {
    id: "key-03",
    name: "Staging sandbox",
    secret: "ck_test_5a2f8c1d9e4b76032c187b3e",
    maskedKey: "ck_test_••••••••••••7b3e",
    scopes: ["orders:read", "customers:read"],
    created: "Jun 02, 2026",
    lastUsed: "Jun 30, 2026",
  },
];

export function ApiKeysListBlock() {
  return (
    <Card className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">API keys</CardTitle>
        <CardDescription>Programmatic access to your Cronus workspace.</CardDescription>
        <CardAction>
          <Button variant="primary" size="sm">
            <Plus className="size-3.5" aria-hidden="true" />
            Create key
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <ul className="flex flex-col">
          {apiKeys.map((apiKey) => (
            <li
              key={apiKey.id}
              className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:px-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-fg">{apiKey.name}</span>
                {apiKey.scopes.map((scope) => (
                  <Badge key={scope} variant="secondary" className="font-mono text-xs">
                    {scope}
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="ms-auto text-error-strong">
                  Revoke
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1 rounded-lg border border-border bg-surface-inset py-1 pe-1 ps-3">
                  <code className="font-mono text-xs text-fg-secondary">{apiKey.maskedKey}</code>
                  <Button variant="ghost" size="icon-sm">
                    <Eye className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Reveal {apiKey.name} key</span>
                  </Button>
                  <CopyButton
                    value={apiKey.secret}
                    size="icon-sm"
                    copyLabel={\`Copy \${apiKey.name} key\`}
                  />
                </span>
                <span className="text-xs text-fg-tertiary">
                  Created {apiKey.created} · Last used {apiKey.lastUsed}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">3 active keys</span>
        <span className="text-xs text-fg-tertiary">Rotate keys at least every 90 days.</span>
      </CardFooter>
    </Card>
  );
}`;

interface KeyScope {
  id: string;
  scope: string;
  description: string;
  defaultChecked?: boolean;
}

const keyScopes: KeyScope[] = [
  {
    id: "scope-orders-read",
    scope: "orders:read",
    description: "List and retrieve orders",
    defaultChecked: true,
  },
  {
    id: "scope-orders-write",
    scope: "orders:write",
    description: "Create refunds and updates",
  },
  {
    id: "scope-products-read",
    scope: "products:read",
    description: "Read catalog and pricing",
    defaultChecked: true,
  },
  {
    id: "scope-products-write",
    scope: "products:write",
    description: "Edit products and prices",
  },
  {
    id: "scope-customers-read",
    scope: "customers:read",
    description: "Read customer profiles",
  },
  {
    id: "scope-payouts-read",
    scope: "payouts:read",
    description: "Read payouts and balances",
  },
];

export function ApiKeysCreateBlock() {
  return (
    <section aria-label="Create API key" className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Create API key</CardTitle>
          <CardDescription>Scope the key to the smallest set of permissions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key-name">Key name</Label>
            <Input id="api-key-name" placeholder="e.g. CI deploy bot" />
          </div>
          <fieldset className="flex flex-col">
            <legend className="text-sm font-medium text-fg">Scopes</legend>
            <div className="grid gap-2 pt-3 sm:grid-cols-2">
              {keyScopes.map((scope) => (
                <Label
                  key={scope.id}
                  htmlFor={scope.id}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-surface-inset p-3 font-normal"
                >
                  <Checkbox
                    id={scope.id}
                    defaultChecked={scope.defaultChecked}
                    className="mt-0.5"
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-mono text-xs font-medium text-fg">{scope.scope}</span>
                    <span className="text-xs text-fg-tertiary">{scope.description}</span>
                  </span>
                </Label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key-expiry">Expires</Label>
            <Select defaultValue="90d">
              <SelectTrigger id="api-key-expiry" aria-label="Key expiry">
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">In 30 days</SelectItem>
                <SelectItem value="90d">In 90 days</SelectItem>
                <SelectItem value="1y">In 1 year</SelectItem>
                <SelectItem value="never">Never expires</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">
            <KeyRound className="size-4" aria-hidden="true" />
            Generate key
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-success/30 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-success/10 text-success">
              <Check className="size-4" aria-hidden="true" />
            </span>
            Key generated
          </CardTitle>
          <CardDescription>Your new key is ready to use.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-inset py-1 pe-1 ps-3">
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg">
              ck_live_8f2Km4Qw7Rt1Vx9Zc3Ln5Bd0Hs6J
            </code>
            <CopyButton
              value="ck_live_8f2Km4Qw7Rt1Vx9Zc3Ln5Bd0Hs6J"
              size="icon-sm"
              copyLabel="Copy API key"
              className="shrink-0"
            />
          </div>
          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Copy your key now</AlertTitle>
            <AlertDescription>
              For security, the full key is only shown once. Store it in your secrets manager.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </section>
  );
}

const apiKeysCreateCode = `import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CopyButton,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cronus-ui/ui";
import { Check, KeyRound, TriangleAlert } from "lucide-react";

interface KeyScope {
  id: string;
  scope: string;
  description: string;
  defaultChecked?: boolean;
}

const keyScopes: KeyScope[] = [
  {
    id: "scope-orders-read",
    scope: "orders:read",
    description: "List and retrieve orders",
    defaultChecked: true,
  },
  {
    id: "scope-orders-write",
    scope: "orders:write",
    description: "Create refunds and updates",
  },
  {
    id: "scope-products-read",
    scope: "products:read",
    description: "Read catalog and pricing",
    defaultChecked: true,
  },
  {
    id: "scope-products-write",
    scope: "products:write",
    description: "Edit products and prices",
  },
  {
    id: "scope-customers-read",
    scope: "customers:read",
    description: "Read customer profiles",
  },
  {
    id: "scope-payouts-read",
    scope: "payouts:read",
    description: "Read payouts and balances",
  },
];

export function ApiKeysCreateBlock() {
  return (
    <section aria-label="Create API key" className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-lg">Create API key</CardTitle>
          <CardDescription>Scope the key to the smallest set of permissions.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key-name">Key name</Label>
            <Input id="api-key-name" placeholder="e.g. CI deploy bot" />
          </div>
          <fieldset className="flex flex-col">
            <legend className="text-sm font-medium text-fg">Scopes</legend>
            <div className="grid gap-2 pt-3 sm:grid-cols-2">
              {keyScopes.map((scope) => (
                <Label
                  key={scope.id}
                  htmlFor={scope.id}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-surface-inset p-3 font-normal"
                >
                  <Checkbox
                    id={scope.id}
                    defaultChecked={scope.defaultChecked}
                    className="mt-0.5"
                  />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-mono text-xs font-medium text-fg">{scope.scope}</span>
                    <span className="text-xs text-fg-tertiary">{scope.description}</span>
                  </span>
                </Label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-key-expiry">Expires</Label>
            <Select defaultValue="90d">
              <SelectTrigger id="api-key-expiry" aria-label="Key expiry">
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">In 30 days</SelectItem>
                <SelectItem value="90d">In 90 days</SelectItem>
                <SelectItem value="1y">In 1 year</SelectItem>
                <SelectItem value="never">Never expires</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">
            <KeyRound className="size-4" aria-hidden="true" />
            Generate key
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-success/30 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-success/10 text-success">
              <Check className="size-4" aria-hidden="true" />
            </span>
            Key generated
          </CardTitle>
          <CardDescription>Your new key is ready to use.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-inset py-1 pe-1 ps-3">
            <code className="min-w-0 flex-1 truncate font-mono text-xs text-fg">
              ck_live_8f2Km4Qw7Rt1Vx9Zc3Ln5Bd0Hs6J
            </code>
            <CopyButton
              value="ck_live_8f2Km4Qw7Rt1Vx9Zc3Ln5Bd0Hs6J"
              size="icon-sm"
              copyLabel="Copy API key"
              className="shrink-0"
            />
          </div>
          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Copy your key now</AlertTitle>
            <AlertDescription>
              For security, the full key is only shown once. Store it in your secrets manager.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. Notification preferences — channel matrix + simple toggles
 * ────────────────────────────────────────────────────────────────────────── */

interface NotificationRule {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationGroup {
  id: string;
  label: string;
  rules: NotificationRule[];
}

const notificationGroups: NotificationGroup[] = [
  {
    id: "group-sales",
    label: "Sales",
    rules: [
      {
        id: "rule-new-order",
        label: "New order",
        description: "Every successful checkout.",
        email: true,
        push: true,
        sms: true,
      },
      {
        id: "rule-payout-sent",
        label: "Payout sent",
        description: "When a payout leaves your balance.",
        email: true,
        push: true,
        sms: false,
      },
      {
        id: "rule-refund-requested",
        label: "Refund requested",
        description: "A customer asks for their money back.",
        email: true,
        push: false,
        sms: false,
      },
    ],
  },
  {
    id: "group-team",
    label: "Team",
    rules: [
      {
        id: "rule-member-joined",
        label: "Member joined",
        description: "Someone accepts a workspace invite.",
        email: true,
        push: false,
        sms: false,
      },
      {
        id: "rule-mentions",
        label: "Mentions & comments",
        description: "Replies and @mentions on your work.",
        email: true,
        push: true,
        sms: false,
      },
    ],
  },
  {
    id: "group-security",
    label: "Security",
    rules: [
      {
        id: "rule-new-sign-in",
        label: "New sign-in",
        description: "A sign-in from an unrecognized device.",
        email: true,
        push: true,
        sms: true,
      },
      {
        id: "rule-password-changed",
        label: "Password changed",
        description: "Your password or 2FA settings change.",
        email: true,
        push: true,
        sms: true,
      },
    ],
  },
];

export function NotificationPreferencesMatrixBlock() {
  return (
    <Card className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Notification preferences</CardTitle>
        <CardDescription>Choose how you hear about activity, per channel.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,2.75rem)] gap-x-3 px-4 pb-2 sm:grid-cols-[minmax(0,1fr)_repeat(3,3.5rem)] sm:px-6">
          <span aria-hidden="true" />
          <span className="text-center text-xs font-medium text-fg-tertiary">Email</span>
          <span className="text-center text-xs font-medium text-fg-tertiary">Push</span>
          <span className="text-center text-xs font-medium text-fg-tertiary">SMS</span>
        </div>
        {notificationGroups.map((group) => (
          <div key={group.id}>
            <div className="border-t border-border bg-surface-inset px-4 py-2 sm:px-6">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                {group.label}
              </span>
            </div>
            {group.rules.map((rule) => (
              <div
                key={rule.id}
                className="grid grid-cols-[minmax(0,1fr)_repeat(3,2.75rem)] items-center gap-x-3 border-t border-border px-4 py-3 sm:grid-cols-[minmax(0,1fr)_repeat(3,3.5rem)] sm:px-6"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium text-fg">{rule.label}</span>
                  <span className="text-xs text-fg-tertiary">{rule.description}</span>
                </div>
                <span className="flex justify-center">
                  <Switch defaultChecked={rule.email} aria-label={`${rule.label} by email`} />
                </span>
                <span className="flex justify-center">
                  <Switch defaultChecked={rule.push} aria-label={`${rule.label} by push`} />
                </span>
                <span className="flex justify-center">
                  <Switch defaultChecked={rule.sms} aria-label={`${rule.label} by SMS`} />
                </span>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">SMS is reserved for critical alerts.</span>
        <Button variant="primary" size="sm">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  );
}

const notificationPreferencesMatrixCode = `import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Switch,
} from "@cronus-ui/ui";

interface NotificationRule {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationGroup {
  id: string;
  label: string;
  rules: NotificationRule[];
}

const notificationGroups: NotificationGroup[] = [
  {
    id: "group-sales",
    label: "Sales",
    rules: [
      {
        id: "rule-new-order",
        label: "New order",
        description: "Every successful checkout.",
        email: true,
        push: true,
        sms: true,
      },
      {
        id: "rule-payout-sent",
        label: "Payout sent",
        description: "When a payout leaves your balance.",
        email: true,
        push: true,
        sms: false,
      },
      {
        id: "rule-refund-requested",
        label: "Refund requested",
        description: "A customer asks for their money back.",
        email: true,
        push: false,
        sms: false,
      },
    ],
  },
  {
    id: "group-team",
    label: "Team",
    rules: [
      {
        id: "rule-member-joined",
        label: "Member joined",
        description: "Someone accepts a workspace invite.",
        email: true,
        push: false,
        sms: false,
      },
      {
        id: "rule-mentions",
        label: "Mentions & comments",
        description: "Replies and @mentions on your work.",
        email: true,
        push: true,
        sms: false,
      },
    ],
  },
  {
    id: "group-security",
    label: "Security",
    rules: [
      {
        id: "rule-new-sign-in",
        label: "New sign-in",
        description: "A sign-in from an unrecognized device.",
        email: true,
        push: true,
        sms: true,
      },
      {
        id: "rule-password-changed",
        label: "Password changed",
        description: "Your password or 2FA settings change.",
        email: true,
        push: true,
        sms: true,
      },
    ],
  },
];

export function NotificationPreferencesMatrixBlock() {
  return (
    <Card className="mx-auto w-full max-w-2xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Notification preferences</CardTitle>
        <CardDescription>Choose how you hear about activity, per channel.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,2.75rem)] gap-x-3 px-4 pb-2 sm:grid-cols-[minmax(0,1fr)_repeat(3,3.5rem)] sm:px-6">
          <span aria-hidden="true" />
          <span className="text-center text-xs font-medium text-fg-tertiary">Email</span>
          <span className="text-center text-xs font-medium text-fg-tertiary">Push</span>
          <span className="text-center text-xs font-medium text-fg-tertiary">SMS</span>
        </div>
        {notificationGroups.map((group) => (
          <div key={group.id}>
            <div className="border-t border-border bg-surface-inset px-4 py-2 sm:px-6">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                {group.label}
              </span>
            </div>
            {group.rules.map((rule) => (
              <div
                key={rule.id}
                className="grid grid-cols-[minmax(0,1fr)_repeat(3,2.75rem)] items-center gap-x-3 border-t border-border px-4 py-3 sm:grid-cols-[minmax(0,1fr)_repeat(3,3.5rem)] sm:px-6"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium text-fg">{rule.label}</span>
                  <span className="text-xs text-fg-tertiary">{rule.description}</span>
                </div>
                <span className="flex justify-center">
                  <Switch defaultChecked={rule.email} aria-label={\`\${rule.label} by email\`} />
                </span>
                <span className="flex justify-center">
                  <Switch defaultChecked={rule.push} aria-label={\`\${rule.label} by push\`} />
                </span>
                <span className="flex justify-center">
                  <Switch defaultChecked={rule.sms} aria-label={\`\${rule.label} by SMS\`} />
                </span>
              </div>
            ))}
          </div>
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="justify-between gap-3 py-5">
        <span className="text-xs text-fg-tertiary">SMS is reserved for critical alerts.</span>
        <Button variant="primary" size="sm">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  );
}`;

interface PreferenceToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PreferenceSection {
  id: string;
  label: string;
  toggles: PreferenceToggle[];
}

const preferenceSections: PreferenceSection[] = [
  {
    id: "section-activity",
    label: "Activity",
    toggles: [
      {
        id: "pref-sales",
        label: "Sales & payouts",
        description: "Order confirmations, payout receipts, and refunds.",
        enabled: true,
      },
      {
        id: "pref-reviews",
        label: "Product reviews",
        description: "When a customer leaves a rating or review.",
        enabled: true,
      },
      {
        id: "pref-comments",
        label: "Comments & mentions",
        description: "Replies to your posts and @mentions.",
        enabled: false,
      },
    ],
  },
  {
    id: "section-digest",
    label: "Digest & marketing",
    toggles: [
      {
        id: "pref-weekly",
        label: "Weekly summary",
        description: "Your store performance, every Monday morning.",
        enabled: true,
      },
      {
        id: "pref-product-news",
        label: "Product updates",
        description: "New Cronus features and improvements.",
        enabled: true,
      },
      {
        id: "pref-offers",
        label: "Tips & offers",
        description: "Occasional guides and promotional offers.",
        enabled: false,
      },
    ],
  },
];

export function NotificationPreferencesSimpleBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Email notifications</CardTitle>
        <CardDescription>Decide what lands in your inbox.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        {preferenceSections.map((section) => (
          <div key={section.id}>
            <div className="border-t border-border bg-surface-inset px-4 py-2 sm:px-6">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                {section.label}
              </span>
            </div>
            {section.toggles.map((toggle) => (
              <div
                key={toggle.id}
                className="flex items-center gap-4 border-t border-border px-4 py-4 sm:px-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Label htmlFor={toggle.id}>{toggle.label}</Label>
                  <span className="text-xs text-fg-tertiary">{toggle.description}</span>
                </div>
                <Switch id={toggle.id} defaultChecked={toggle.enabled} />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="py-5">
        <span className="text-xs text-fg-tertiary">
          Every email includes a one-click unsubscribe link.
        </span>
      </CardFooter>
    </Card>
  );
}

const notificationPreferencesSimpleCode = `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Separator,
  Switch,
} from "@cronus-ui/ui";

interface PreferenceToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PreferenceSection {
  id: string;
  label: string;
  toggles: PreferenceToggle[];
}

const preferenceSections: PreferenceSection[] = [
  {
    id: "section-activity",
    label: "Activity",
    toggles: [
      {
        id: "pref-sales",
        label: "Sales & payouts",
        description: "Order confirmations, payout receipts, and refunds.",
        enabled: true,
      },
      {
        id: "pref-reviews",
        label: "Product reviews",
        description: "When a customer leaves a rating or review.",
        enabled: true,
      },
      {
        id: "pref-comments",
        label: "Comments & mentions",
        description: "Replies to your posts and @mentions.",
        enabled: false,
      },
    ],
  },
  {
    id: "section-digest",
    label: "Digest & marketing",
    toggles: [
      {
        id: "pref-weekly",
        label: "Weekly summary",
        description: "Your store performance, every Monday morning.",
        enabled: true,
      },
      {
        id: "pref-product-news",
        label: "Product updates",
        description: "New Cronus features and improvements.",
        enabled: true,
      },
      {
        id: "pref-offers",
        label: "Tips & offers",
        description: "Occasional guides and promotional offers.",
        enabled: false,
      },
    ],
  },
];

export function NotificationPreferencesSimpleBlock() {
  return (
    <Card className="mx-auto w-full max-w-xl gap-0 pb-0 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Email notifications</CardTitle>
        <CardDescription>Decide what lands in your inbox.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-4">
        {preferenceSections.map((section) => (
          <div key={section.id}>
            <div className="border-t border-border bg-surface-inset px-4 py-2 sm:px-6">
              <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                {section.label}
              </span>
            </div>
            {section.toggles.map((toggle) => (
              <div
                key={toggle.id}
                className="flex items-center gap-4 border-t border-border px-4 py-4 sm:px-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Label htmlFor={toggle.id}>{toggle.label}</Label>
                  <span className="text-xs text-fg-tertiary">{toggle.description}</span>
                </div>
                <Switch id={toggle.id} defaultChecked={toggle.enabled} />
              </div>
            ))}
          </div>
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="py-5">
        <span className="text-xs text-fg-tertiary">
          Every email includes a one-click unsubscribe link.
        </span>
      </CardFooter>
    </Card>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const accountBlocks: BlockContentMap = {
  "account-security": {
    preview: <AccountSecurityTwoFactorBlock />,
    code: accountSecurityTwoFactorCode,
    variants: [
      {
        id: "two-factor",
        name: "Two-factor setup",
        description: "Status card plus QR pairing, setup key, and one-time backup codes.",
        appearance: "dark",
        preview: <AccountSecurityTwoFactorBlock />,
        code: accountSecurityTwoFactorCode,
      },
      {
        id: "password",
        name: "Password & danger zone",
        description: "Password change with strength meter, recovery email, and a danger zone.",
        appearance: "light",
        preview: <AccountSecurityPasswordBlock />,
        code: accountSecurityPasswordCode,
      },
    ],
  },
  sessions: {
    preview: <SessionsListBlock />,
    code: sessionsListCode,
    variants: [
      {
        id: "list",
        name: "Device list",
        description: "Signed-in devices with client, location, last activity, and revoke.",
        appearance: "dark",
        preview: <SessionsListBlock />,
        code: sessionsListCode,
      },
      {
        id: "table",
        name: "Selectable table",
        description: "Session table with bulk selection and a revoke-selected action.",
        appearance: "light",
        preview: <SessionsTableBlock />,
        code: sessionsTableCode,
      },
    ],
  },
  "api-keys": {
    preview: <ApiKeysListBlock />,
    code: apiKeysListCode,
    variants: [
      {
        id: "list",
        name: "Key list",
        description: "Masked keys with reveal and copy, scope badges, and usage metadata.",
        appearance: "dark",
        preview: <ApiKeysListBlock />,
        code: apiKeysListCode,
      },
      {
        id: "create",
        name: "Create key",
        description: "Scoped key creation with expiry and a one-time generated-key reveal.",
        appearance: "light",
        preview: <ApiKeysCreateBlock />,
        code: apiKeysCreateCode,
      },
    ],
  },
  "notification-preferences": {
    preview: <NotificationPreferencesMatrixBlock />,
    code: notificationPreferencesMatrixCode,
    variants: [
      {
        id: "matrix",
        name: "Channel matrix",
        description: "Per-event switches across email, push, and SMS, grouped by area.",
        appearance: "dark",
        preview: <NotificationPreferencesMatrixBlock />,
        code: notificationPreferencesMatrixCode,
      },
      {
        id: "simple",
        name: "Simple toggles",
        description: "Grouped email toggles with a plain-language description per row.",
        appearance: "light",
        preview: <NotificationPreferencesSimpleBlock />,
        code: notificationPreferencesSimpleCode,
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

export function AccountGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(accountBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function AccountView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(accountBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
