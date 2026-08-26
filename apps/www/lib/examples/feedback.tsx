"use client";

import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Banner,
  Button,
  Progress,
  Spinner,
  Toaster,
  toast,
  UsageMeter,
  UsageMeterCircular,
} from "@cronus-ui/ui";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Info,
  Sparkles,
  Terminal,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ExampleList } from "../../components/docs/example-list";
import type { ExampleMap } from "./types";

// ── Progress: animate one bar in on mount ─────────────────────────────
function ProgressDemo() {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(66), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={30} aria-label="Storage used" />
      <Progress value={animated} aria-label="Upload progress" />
      <Progress value={100} aria-label="Sync complete" />
    </div>
  );
}

// ── Sonner: a single Toaster plus buttons that fire toasts ────────────
function ToastDemo() {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Event has been created.")}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success("Changes saved successfully.")}>
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.error("Something went wrong. Please try again.")}
        >
          Error
        </Button>
      </div>
    </>
  );
}

// ── Banner: a dismissible promo with a "show again" reset ─────────────
function BannerDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <Banner
        variant="info"
        open={open}
        onDismiss={() => setOpen(false)}
        icon={<Info aria-hidden="true" />}
        title="Scheduled maintenance"
        description="Dashboards may be briefly unavailable on Sunday at 02:00 UTC."
      />
      {open ? null : (
        <Button variant="outline" size="sm" className="self-start" onClick={() => setOpen(true)}>
          Show banner again
        </Button>
      )}
    </div>
  );
}

export const feedbackExamples: ExampleMap = {
  alert: [
    {
      id: "default",
      title: "Default",
      description: "An inline callout with an icon, title, and description.",
      code: `<Alert>
  <Terminal aria-hidden="true" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>`,
      preview: (
        <Alert className="max-w-md">
          <Terminal aria-hidden="true" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
        </Alert>
      ),
    },
    {
      id: "variants",
      title: "Variants",
      description: "Semantic variants tint the surface, border, and icon for each intent.",
      code: `<div className="flex flex-col gap-4">
  <Alert variant="info">
    <Info aria-hidden="true" />
    <AlertTitle>New version available</AlertTitle>
    <AlertDescription>A new release is ready to install.</AlertDescription>
  </Alert>
  <Alert variant="success">
    <CircleCheck aria-hidden="true" />
    <AlertTitle>Payment received</AlertTitle>
    <AlertDescription>Your subscription is now active.</AlertDescription>
  </Alert>
  <Alert variant="warning">
    <TriangleAlert aria-hidden="true" />
    <AlertTitle>Storage almost full</AlertTitle>
    <AlertDescription>You've used 92% of your quota.</AlertDescription>
  </Alert>
  <Alert variant="destructive">
    <CircleAlert aria-hidden="true" />
    <AlertTitle>Unable to save changes</AlertTitle>
    <AlertDescription>Check your connection and try again.</AlertDescription>
  </Alert>
</div>`,
      preview: (
        <div className="flex max-w-md flex-col gap-4">
          <Alert variant="info">
            <Info aria-hidden="true" />
            <AlertTitle>New version available</AlertTitle>
            <AlertDescription>A new release is ready to install.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <CircleCheck aria-hidden="true" />
            <AlertTitle>Payment received</AlertTitle>
            <AlertDescription>Your subscription is now active.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert aria-hidden="true" />
            <AlertTitle>Storage almost full</AlertTitle>
            <AlertDescription>You've used 92% of your quota.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>Unable to save changes</AlertTitle>
            <AlertDescription>Check your connection and try again.</AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: "title-only",
      title: "Title only",
      description: "Drop the icon and description for a compact, single-line callout.",
      code: `<Alert variant="info">
  <AlertTitle>Your trial ends in 3 days.</AlertTitle>
</Alert>`,
      preview: (
        <Alert variant="info" className="max-w-md">
          <AlertTitle>Your trial ends in 3 days.</AlertTitle>
        </Alert>
      ),
    },
  ],

  banner: [
    {
      id: "brand-promo",
      title: "Brand promo with a CTA",
      description:
        "A full-width announcement bar. The `brand` variant is a solid gradient promo fill carrying white text; the icon, action, and close button all inherit `currentColor`.",
      code: `<Banner
  variant="brand"
  icon={<Sparkles aria-hidden="true" />}
  title="Cronus UI 1.0 is here."
  description="60+ themeable components, now stable."
  action={
    <Button size="sm" variant="secondary">
      Read the announcement
      <ArrowRight aria-hidden="true" />
    </Button>
  }
/>`,
      preview: (
        <Banner
          variant="brand"
          className="rounded-lg border"
          icon={<Sparkles aria-hidden="true" />}
          title="Cronus UI 1.0 is here."
          description="60+ themeable components, now stable."
          action={
            <Button size="sm" variant="secondary">
              Read the announcement
              <ArrowRight aria-hidden="true" />
            </Button>
          }
        />
      ),
    },
    {
      id: "dismissible",
      title: "Dismissible",
      description:
        "Banners collapse away when dismissed (honouring reduced-motion). Drive `open` + `onDismiss` to control visibility — here a button brings it back.",
      code: `function BannerDemo() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <Banner
        variant="info"
        open={open}
        onDismiss={() => setOpen(false)}
        icon={<Info aria-hidden="true" />}
        title="Scheduled maintenance"
        description="Dashboards may be briefly unavailable on Sunday at 02:00 UTC."
      />
      {open ? null : (
        <Button variant="outline" size="sm" className="self-start" onClick={() => setOpen(true)}>
          Show banner again
        </Button>
      )}
    </div>
  );
}`,
      preview: <BannerDemo />,
    },
  ],

  spinner: [
    {
      id: "sizes",
      title: "Sizes",
      description: "An accessible loading indicator in three sizes.",
      code: `<div className="flex items-center gap-6">
  <Spinner size="sm" aria-label="Loading small" />
  <Spinner size="md" aria-label="Loading medium" />
  <Spinner size="lg" aria-label="Loading large" />
</div>`,
      preview: (
        <div className="flex items-center gap-6">
          <Spinner size="sm" aria-label="Loading small" />
          <Spinner size="md" aria-label="Loading medium" />
          <Spinner size="lg" aria-label="Loading large" />
        </div>
      ),
    },
  ],

  progress: [
    {
      id: "determinate",
      title: "Determinate",
      description: "Determinate progress bars — the middle bar animates in on mount.",
      code: `function ProgressDemo() {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(66), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress value={30} aria-label="Storage used" />
      <Progress value={animated} aria-label="Upload progress" />
      <Progress value={100} aria-label="Sync complete" />
    </div>
  );
}`,
      preview: <ProgressDemo />,
    },
  ],

  "usage-meter": [
    {
      id: "linear",
      title: "Linear",
      description:
        "A horizontal quota bar with a label and a value / max readout. The `auto` tone shades the fill from primary to warning to error as usage climbs.",
      code: `<div className="flex w-full max-w-sm flex-col gap-6">
  <UsageMeter label="Tokens" value={186_400} max={250_000} unit="tokens" />
  <UsageMeter label="Seats" value={18} max={20} />
  <UsageMeter label="Storage" value={48} max={50} unit="GB" />
</div>`,
      preview: (
        <div className="flex w-full max-w-sm flex-col gap-6">
          <UsageMeter label="Tokens" value={186_400} max={250_000} unit="tokens" />
          <UsageMeter label="Seats" value={18} max={20} />
          <UsageMeter label="Storage" value={48} max={50} unit="GB" />
        </div>
      ),
    },
    {
      id: "circular",
      title: "Circular",
      description: "An SVG ring for compact, at-a-glance quota — here three API-request budgets.",
      code: `<div className="flex flex-wrap items-center gap-8">
  <UsageMeterCircular label="API requests" value={6_200} max={10_000} />
  <UsageMeterCircular label="Bandwidth" value={172} max={200} unit="GB" tone="warning" />
  <UsageMeterCircular label="Builds" value={95} max={100} />
</div>`,
      preview: (
        <div className="flex flex-wrap items-center gap-8">
          <UsageMeterCircular label="API requests" value={6_200} max={10_000} />
          <UsageMeterCircular label="Bandwidth" value={172} max={200} unit="GB" tone="warning" />
          <UsageMeterCircular label="Builds" value={95} max={100} />
        </div>
      ),
    },
  ],

  sonner: [
    {
      id: "toasts",
      title: "Toasts",
      description: "Mount one Toaster, then fire transient notifications imperatively via toast().",
      code: `function ToastDemo() {
  return (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Event has been created.")}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success("Changes saved successfully.")}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error("Something went wrong. Please try again.")}>
          Error
        </Button>
      </div>
    </>
  );
}`,
      preview: <ToastDemo />,
    },
  ],

  "alert-dialog": [
    {
      id: "confirm",
      title: "Confirm",
      description: "A focus-trapping confirmation for destructive or irreversible actions.",
      code: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">
      <Trash2 aria-hidden="true" />
      Delete account
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This permanently deletes your account and removes all associated data. This action
        cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Yes, delete it</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      preview: (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 aria-hidden="true" />
              Delete account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes your account and removes all associated data. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Yes, delete it</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ],
};

/**
 * Default-export view for this family. Imported lazily per-slug by the
 * `/components/[slug]` detail route, so visiting one component only loads this
 * family chunk (not the whole catalog).
 */
export default function FeedbackExamples({ slug }: { slug: string }) {
  return <ExampleList examples={feedbackExamples[slug] ?? []} />;
}
