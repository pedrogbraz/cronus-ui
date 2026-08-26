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
  CardTitle,
  Reveal,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@cronus-ui/ui";
import {
  CheckCircle2,
  CreditCard,
  FolderPlus,
  Info,
  MessageSquare,
  TriangleAlert,
  UserPlus,
  X,
  XCircle,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Notification panel — dropdown notifications list
 * ────────────────────────────────────────────────────────────────────────── */

export function NotificationPanelBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-0 p-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-border border-b p-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Notifications</CardTitle>
            <Badge variant="primary">3 new</Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-fg-secondary">
            Mark all read
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col p-0">
          <Reveal delay={0.04}>
            <div className="flex items-start gap-3 bg-surface-overlay/40 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>DL</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Devon Lane</span> commented on the Atlas
                  brief.
                </p>
                <span className="text-fg-tertiary text-xs">2m ago</span>
              </div>
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex items-start gap-3 bg-surface-overlay/40 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Mara Castillo</span> assigned you to Q3
                  roadmap.
                </p>
                <span className="text-fg-tertiary text-xs">18m ago</span>
              </div>
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex items-start gap-3 bg-surface-overlay/40 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Riley Kim</span> requested your review on PR
                  #482.
                </p>
                <span className="text-fg-tertiary text-xs">1h ago</span>
              </div>
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex items-start gap-3 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Jordan Pierce</span> shared a file with your
                  team.
                </p>
                <span className="text-fg-tertiary text-xs">3h ago</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex items-start gap-3 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Sasha Tran</span> closed the issue you
                  reported.
                </p>
                <span className="text-fg-tertiary text-xs">Yesterday</span>
              </div>
            </div>
          </Reveal>
        </CardContent>

        <CardFooter className="justify-center border-border border-t p-2">
          <Button variant="ghost" size="sm" className="w-full text-primary-strong">
            View all notifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const notificationPanelCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Reveal,
} from "@cronus-ui/ui";

export function NotificationPanelBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-sm gap-0 p-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-border border-b p-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Notifications</CardTitle>
            <Badge variant="primary">3 new</Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-fg-secondary">
            Mark all read
          </Button>
        </CardHeader>

        <CardContent className="flex flex-col p-0">
          <Reveal delay={0.04}>
            <div className="flex items-start gap-3 bg-surface-overlay/40 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>DL</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Devon Lane</span> commented on the Atlas brief.
                </p>
                <span className="text-fg-tertiary text-xs">2m ago</span>
              </div>
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex items-start gap-3 bg-surface-overlay/40 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Mara Castillo</span> assigned you to Q3 roadmap.
                </p>
                <span className="text-fg-tertiary text-xs">18m ago</span>
              </div>
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex items-start gap-3 bg-surface-overlay/40 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Riley Kim</span> requested your review on PR #482.
                </p>
                <span className="text-fg-tertiary text-xs">1h ago</span>
              </div>
              <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex items-start gap-3 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Jordan Pierce</span> shared a file with your team.
                </p>
                <span className="text-fg-tertiary text-xs">3h ago</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex items-start gap-3 px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-sm text-fg-secondary">
                  <span className="font-medium text-fg">Sasha Tran</span> closed the issue you reported.
                </p>
                <span className="text-fg-tertiary text-xs">Yesterday</span>
              </div>
            </div>
          </Reveal>
        </CardContent>

        <CardFooter className="justify-center border-border border-t p-2">
          <Button variant="ghost" size="sm" className="w-full text-primary-strong">
            View all notifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Activity feed — vertical timeline of events
 * ────────────────────────────────────────────────────────────────────────── */

export function ActivityFeedBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-md gap-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>

        <CardContent>
          <Timeline>
            <TimelineItem>
              <TimelineDot tone="primary" icon={<FolderPlus />} />
              <TimelineContent>
                <TimelineTitle>Mara created the project Atlas</TimelineTitle>
                <TimelineTime>2 minutes ago</TimelineTime>
                <TimelineDescription>
                  A new workspace was set up for the design team.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="default" icon={<UserPlus />} />
              <TimelineContent>
                <TimelineTitle>Devon invited 3 teammates</TimelineTitle>
                <TimelineTime>26 minutes ago</TimelineTime>
                <TimelineDescription>
                  Invitations were sent to riley, jordan and sasha.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="success" icon={<CreditCard />} />
              <TimelineContent>
                <TimelineTitle>Invoice INV-2026-006 was paid</TimelineTitle>
                <TimelineTime>1 hour ago</TimelineTime>
                <TimelineDescription>R$ 2.480,00 settled to your balance.</TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="default" icon={<MessageSquare />} />
              <TimelineContent>
                <TimelineTitle>Riley left feedback on the Q3 plan</TimelineTitle>
                <TimelineTime>4 hours ago</TimelineTime>
                <TimelineDescription>
                  Three comments were added to the roadmap doc.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="warning" icon={<TriangleAlert />} />
              <TimelineContent>
                <TimelineTitle>Storage is reaching its limit</TimelineTitle>
                <TimelineTime>Yesterday</TimelineTime>
                <TimelineDescription>
                  The team is using 92% of the available quota.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
}

const activityFeedCode = `import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@cronus-ui/ui";
import { CreditCard, FolderPlus, MessageSquare, TriangleAlert, UserPlus } from "lucide-react";

export function ActivityFeedBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-md gap-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>

        <CardContent>
          <Timeline>
            <TimelineItem>
              <TimelineDot tone="primary" icon={<FolderPlus />} />
              <TimelineContent>
                <TimelineTitle>Mara created the project Atlas</TimelineTitle>
                <TimelineTime>2 minutes ago</TimelineTime>
                <TimelineDescription>
                  A new workspace was set up for the design team.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="default" icon={<UserPlus />} />
              <TimelineContent>
                <TimelineTitle>Devon invited 3 teammates</TimelineTitle>
                <TimelineTime>26 minutes ago</TimelineTime>
                <TimelineDescription>
                  Invitations were sent to riley, jordan and sasha.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="success" icon={<CreditCard />} />
              <TimelineContent>
                <TimelineTitle>Invoice INV-2026-006 was paid</TimelineTitle>
                <TimelineTime>1 hour ago</TimelineTime>
                <TimelineDescription>R$ 2.480,00 settled to your balance.</TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="default" icon={<MessageSquare />} />
              <TimelineContent>
                <TimelineTitle>Riley left feedback on the Q3 plan</TimelineTitle>
                <TimelineTime>4 hours ago</TimelineTime>
                <TimelineDescription>
                  Three comments were added to the roadmap doc.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot tone="warning" icon={<TriangleAlert />} />
              <TimelineContent>
                <TimelineTitle>Storage is reaching its limit</TimelineTitle>
                <TimelineTime>Yesterday</TimelineTime>
                <TimelineDescription>
                  The team is using 92% of the available quota.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Toast stack — stacked toast notifications showcase
 * ────────────────────────────────────────────────────────────────────────── */

export function ToastStackBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="flex max-w-sm flex-col gap-3">
        <Reveal delay={0.04}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">Payment received</p>
              <p className="text-fg-secondary text-sm">Your invoice was settled successfully.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dismiss"
              className="-mr-1 -mt-1 size-7 text-fg-tertiary"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <XCircle className="mt-0.5 size-5 shrink-0 text-error" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">Upload failed</p>
              <p className="text-fg-secondary text-sm">The file exceeds the 25 MB limit.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dismiss"
              className="-mr-1 -mt-1 size-7 text-fg-tertiary"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">Storage almost full</p>
              <p className="text-fg-secondary text-sm">You are using 92% of your quota.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dismiss"
              className="-mr-1 -mt-1 size-7 text-fg-tertiary"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">New version available</p>
              <p className="text-fg-secondary text-sm">Refresh to update to the latest build.</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Dismiss"
              className="-mr-1 -mt-1 size-7 text-fg-tertiary"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

const toastStackCode = `import { Button, Reveal } from "@cronus-ui/ui";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";

export function ToastStackBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="flex max-w-sm flex-col gap-3">
        <Reveal delay={0.04}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">Payment received</p>
              <p className="text-fg-secondary text-sm">Your invoice was settled successfully.</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Dismiss" className="-mr-1 -mt-1 size-7 text-fg-tertiary">
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <XCircle className="mt-0.5 size-5 shrink-0 text-error" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">Upload failed</p>
              <p className="text-fg-secondary text-sm">The file exceeds the 25 MB limit.</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Dismiss" className="-mr-1 -mt-1 size-7 text-fg-tertiary">
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">Storage almost full</p>
              <p className="text-fg-secondary text-sm">You are using 92% of your quota.</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Dismiss" className="-mr-1 -mt-1 size-7 text-fg-tertiary">
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-lg">
            <Info className="mt-0.5 size-5 shrink-0 text-info" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-medium text-fg text-sm">New version available</p>
              <p className="text-fg-secondary text-sm">Refresh to update to the latest build.</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Dismiss" className="-mr-1 -mt-1 size-7 text-fg-tertiary">
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const notificationsBlocks: BlockContentMap = {
  "notification-panel": { preview: <NotificationPanelBlock />, code: notificationPanelCode },
  "activity-feed": { preview: <ActivityFeedBlock />, code: activityFeedCode },
  "toast-stack": { preview: <ToastStackBlock />, code: toastStackCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function NotificationsGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(notificationsBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function NotificationsView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(notificationsBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
