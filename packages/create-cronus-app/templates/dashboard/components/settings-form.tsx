"use client";

import { Button } from "@cronus-ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cronus-ui/ui/card";
import { Field, FieldDescription, FieldLabel } from "@cronus-ui/ui/field";
import { Input } from "@cronus-ui/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cronus-ui/ui/select";
import { Separator } from "@cronus-ui/ui/separator";
import { Switch } from "@cronus-ui/ui/switch";
import { Textarea } from "@cronus-ui/ui/textarea";
import { Check } from "lucide-react";
import { useState } from "react";

const NOTIFICATIONS = [
  {
    id: "notify-orders",
    label: "New orders",
    description: "Get notified when a new order comes in.",
    defaultChecked: true,
  },
  {
    id: "notify-digest",
    label: "Weekly digest",
    description: "A summary of your workspace, every Monday.",
    defaultChecked: true,
  },
  {
    id: "notify-mentions",
    label: "Mentions",
    description: "When a teammate mentions you in a comment.",
    defaultChecked: false,
  },
] as const;

/**
 * Profile + workspace preference forms. The submit is a demo — replace the
 * `onSubmit` with a server action or API call.
 */
export function SettingsForm() {
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="flex max-w-3xl flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Profile</CardTitle>
          <CardDescription>How you appear across the workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="settings-name">Full name</FieldLabel>
            <Input id="settings-name" name="name" defaultValue="Alex Costa" autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-email">Email</FieldLabel>
            <Input
              id="settings-email"
              name="email"
              type="email"
              defaultValue="alex@example.com"
              autoComplete="email"
            />
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel htmlFor="settings-bio">Bio</FieldLabel>
            <Textarea
              id="settings-bio"
              name="bio"
              rows={3}
              placeholder="A short description for your profile."
            />
            <FieldDescription>Shown on your public profile.</FieldDescription>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Workspace</CardTitle>
          <CardDescription>Defaults applied to everyone in this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="settings-language">Language</FieldLabel>
            <Select defaultValue="en" name="language">
              <SelectTrigger id="settings-language" className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="settings-timezone">Timezone</FieldLabel>
            <Select defaultValue="utc" name="timezone">
              <SelectTrigger id="settings-timezone" className="w-full">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="sao-paulo">America/São Paulo</SelectItem>
                <SelectItem value="new-york">America/New York</SelectItem>
                <SelectItem value="london">Europe/London</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Notifications</CardTitle>
          <CardDescription>Choose what you want to hear about.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {NOTIFICATIONS.map((item, index) => (
            <div key={item.id}>
              {index > 0 ? <Separator className="my-4" /> : null}
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <label htmlFor={item.id} className="text-sm font-medium text-fg">
                    {item.label}
                  </label>
                  <span className="text-sm text-fg-secondary">{item.description}</span>
                </div>
                <Switch id={item.id} name={item.id} defaultChecked={item.defaultChecked} />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end gap-3">
          {saved ? (
            <span role="status" className="inline-flex items-center gap-1.5 text-sm text-success">
              <Check className="size-4" aria-hidden="true" />
              Saved
            </span>
          ) : null}
          <Button type="submit" variant="primary">
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
