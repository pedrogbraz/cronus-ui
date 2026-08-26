"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Progress,
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
} from "@kronus-ui/ui";
import { ArrowRight, Check, Database, FolderPlus, Rocket, Users } from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Welcome — get-started panel with quick-start actions
 * ────────────────────────────────────────────────────────────────────────── */

export function WelcomeBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Rocket className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-2xl">Welcome to Kronus, Mara</CardTitle>
            <p className="text-sm text-fg-secondary">
              Let&apos;s get your workspace ready — here&apos;s where to start.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <a
            href="#create-project"
            className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-overlay/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <FolderPlus className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-fg">Create your first project</p>
              <p className="text-sm text-fg-secondary">
                Spin up a workspace project to organize your work.
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <a
            href="#invite-team"
            className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-overlay/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-fg">Invite your team</p>
              <p className="text-sm text-fg-secondary">
                Bring teammates in to collaborate in real time.
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <a
            href="#connect-data"
            className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-overlay/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <Database className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-fg">Connect your data</p>
              <p className="text-sm text-fg-secondary">
                Sync a source so your dashboards come to life.
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost">Skip for now</Button>
          <Button variant="primary">Go to dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const welcomeCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kronus-ui/ui";
import { ArrowRight, Database, FolderPlus, Rocket, Users } from "lucide-react";

export function WelcomeBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-6 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Rocket className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-2xl">Welcome to Kronus, Mara</CardTitle>
            <p className="text-sm text-fg-secondary">
              Let&apos;s get your workspace ready — here&apos;s where to start.
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <a
            href="#create-project"
            className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-overlay/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <FolderPlus className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-fg">Create your first project</p>
              <p className="text-sm text-fg-secondary">
                Spin up a workspace project to organize your work.
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <a
            href="#invite-team"
            className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-overlay/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-fg">Invite your team</p>
              <p className="text-sm text-fg-secondary">
                Bring teammates in to collaborate in real time.
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <a
            href="#connect-data"
            className="group flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-overlay/40"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-overlay text-fg-secondary">
              <Database className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm font-medium text-fg">Connect your data</p>
              <p className="text-sm text-fg-secondary">
                Sync a source so your dashboards come to life.
              </p>
            </div>
            <ArrowRight
              className="size-4 shrink-0 text-fg-tertiary transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </CardContent>

        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost">Skip for now</Button>
          <Button variant="primary">Go to dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Setup wizard — multi-step setup flow with a stepper + form panel
 * ────────────────────────────────────────────────────────────────────────── */

export function SetupWizardBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-2xl gap-6 shadow-lg">
        <CardHeader>
          <Stepper value={1} orientation="horizontal">
            <StepperList>
              <StepperItem step={0}>
                <StepperIndicator />
                <StepperTitle>Account</StepperTitle>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={1}>
                <StepperIndicator />
                <StepperTitle>Workspace</StepperTitle>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={2}>
                <StepperIndicator />
                <StepperTitle>Team</StepperTitle>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={3}>
                <StepperIndicator />
                <StepperTitle>Done</StepperTitle>
              </StepperItem>
            </StepperList>
          </Stepper>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Set up your workspace</CardTitle>
            <p className="text-sm text-fg-secondary">
              Name your workspace and choose its address — you can change these later.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="wizard-workspace-name">Workspace name</Label>
            <Input id="wizard-workspace-name" placeholder="Acme Inc" autoComplete="organization" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="wizard-workspace-url">Workspace URL</Label>
            <div className="flex items-center rounded-lg border border-input bg-surface-base focus-within:ring-2 focus-within:ring-ring">
              <span className="pl-3 text-sm text-fg-tertiary">kronus.app/</span>
              <Input
                id="wizard-workspace-url"
                placeholder="acme"
                autoComplete="off"
                className="border-0 bg-transparent pl-1 focus-visible:ring-0"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <Button variant="outline">Back</Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-fg-tertiary">Step 2 of 4</span>
            <Button variant="primary">Continue</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

const setupWizardCode = `import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
} from "@kronus-ui/ui";

export function SetupWizardBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-2xl gap-6 shadow-lg">
        <CardHeader>
          <Stepper value={1} orientation="horizontal">
            <StepperList>
              <StepperItem step={0}>
                <StepperIndicator />
                <StepperTitle>Account</StepperTitle>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={1}>
                <StepperIndicator />
                <StepperTitle>Workspace</StepperTitle>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={2}>
                <StepperIndicator />
                <StepperTitle>Team</StepperTitle>
                <StepperSeparator />
              </StepperItem>
              <StepperItem step={3}>
                <StepperIndicator />
                <StepperTitle>Done</StepperTitle>
              </StepperItem>
            </StepperList>
          </Stepper>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Set up your workspace</CardTitle>
            <p className="text-sm text-fg-secondary">
              Name your workspace and choose its address — you can change these later.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="wizard-workspace-name">Workspace name</Label>
            <Input id="wizard-workspace-name" placeholder="Acme Inc" autoComplete="organization" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="wizard-workspace-url">Workspace URL</Label>
            <div className="flex items-center rounded-lg border border-input bg-surface-base focus-within:ring-2 focus-within:ring-ring">
              <span className="pl-3 text-sm text-fg-tertiary">kronus.app/</span>
              <Input
                id="wizard-workspace-url"
                placeholder="acme"
                autoComplete="off"
                className="border-0 bg-transparent pl-1 focus-visible:ring-0"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <Button variant="outline">Back</Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-fg-tertiary">Step 2 of 4</span>
            <Button variant="primary">Continue</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Setup checklist — progress bar + per-item actions
 * ────────────────────────────────────────────────────────────────────────── */

export function SetupChecklistBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-6 shadow-lg">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Finish setting up</CardTitle>
            <p className="text-sm text-fg-secondary">
              Complete these steps to get the most out of Kronus.
            </p>
          </div>
          <Badge variant="secondary">2 of 5</Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-fg">40% complete</span>
              <span className="text-fg-tertiary">2 of 5 complete</span>
            </div>
            <Progress value={40} aria-label="Setup progress: 2 of 5 complete" />
          </div>

          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg-tertiary line-through">
                  Verify your email
                </p>
                <p className="text-sm text-fg-tertiary">Your email address is confirmed.</p>
              </div>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg-tertiary line-through">
                  Create your first project
                </p>
                <p className="text-sm text-fg-tertiary">
                  You created the project &ldquo;Atlas&rdquo;.
                </p>
              </div>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <Checkbox aria-label="Invite a teammate" className="shrink-0" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg">Invite a teammate</p>
                <p className="text-sm text-fg-secondary">
                  Collaborate with your team in real time.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Start
              </Button>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <Checkbox aria-label="Add a payment method" className="shrink-0" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg">Add a payment method</p>
                <p className="text-sm text-fg-secondary">
                  Keep your workspace active after the trial.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Start
              </Button>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <Checkbox aria-label="Install the CLI" className="shrink-0" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg">Install the CLI</p>
                <p className="text-sm text-fg-secondary">Ship from your terminal in seconds.</p>
              </div>
              <Button variant="outline" size="sm">
                Start
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

const setupChecklistCode = `import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Progress,
} from "@kronus-ui/ui";
import { Check } from "lucide-react";

export function SetupChecklistBlock() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <Card className="w-full max-w-xl gap-6 shadow-lg">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle className="font-display text-xl">Finish setting up</CardTitle>
            <p className="text-sm text-fg-secondary">
              Complete these steps to get the most out of Kronus.
            </p>
          </div>
          <Badge variant="secondary">2 of 5</Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-fg">40% complete</span>
              <span className="text-fg-tertiary">2 of 5 complete</span>
            </div>
            <Progress value={40} aria-label="Setup progress: 2 of 5 complete" />
          </div>

          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg-tertiary line-through">
                  Verify your email
                </p>
                <p className="text-sm text-fg-tertiary">Your email address is confirmed.</p>
              </div>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="size-3.5" aria-hidden="true" strokeWidth={2.5} />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg-tertiary line-through">
                  Create your first project
                </p>
                <p className="text-sm text-fg-tertiary">
                  You created the project &ldquo;Atlas&rdquo;.
                </p>
              </div>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <Checkbox aria-label="Invite a teammate" className="shrink-0" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg">Invite a teammate</p>
                <p className="text-sm text-fg-secondary">
                  Collaborate with your team in real time.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Start
              </Button>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <Checkbox aria-label="Add a payment method" className="shrink-0" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg">Add a payment method</p>
                <p className="text-sm text-fg-secondary">
                  Keep your workspace active after the trial.
                </p>
              </div>
              <Button variant="outline" size="sm">
                Start
              </Button>
            </li>

            <li className="flex items-center gap-3 rounded-xl border border-border p-3">
              <Checkbox aria-label="Install the CLI" className="shrink-0" />
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-sm font-medium text-fg">Install the CLI</p>
                <p className="text-sm text-fg-secondary">Ship from your terminal in seconds.</p>
              </div>
              <Button variant="outline" size="sm">
                Start
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const onboardingBlocks: BlockContentMap = {
  welcome: { preview: <WelcomeBlock />, code: welcomeCode },
  "setup-wizard": { preview: <SetupWizardBlock />, code: setupWizardCode },
  "setup-checklist": { preview: <SetupChecklistBlock />, code: setupChecklistCode },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function OnboardingGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(onboardingBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function OnboardingView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(onboardingBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
