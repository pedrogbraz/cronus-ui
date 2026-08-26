"use client";

import { cn, Tabs, TabsContent, TabsList, TabsTrigger } from "@cronus-ui/ui";
import { ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  appearanceLabel,
  blockHref,
  blockLabel,
  hasLivePreview,
  previewPath,
  scaffoldCommands,
  stageRefs,
  type TemplateCatalogEntry,
} from "../../lib/templates/catalog";
import { CodeBlock } from "../docs/code-block";
import { CommandChip } from "./command-chip";

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, number | "100%"> = {
  desktop: "100%",
  tablet: 768,
  mobile: 390,
};

const DEVICES: { id: Device; label: string; icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop preview", icon: Monitor },
  { id: "tablet", label: "Tablet preview", icon: Tablet },
  { id: "mobile", label: "Mobile preview", icon: Smartphone },
];

export function TemplateDetail({ entry }: { entry: TemplateCatalogEntry }) {
  const live = hasLivePreview(entry);
  const [device, setDevice] = useState<Device>("desktop");
  const commands = scaffoldCommands(entry.slug);
  const stack = stageRefs(entry);

  return (
    <Tabs defaultValue={live ? "preview" : "code"} className="gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          <TabsTrigger value="preview" disabled={!live}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap items-center gap-2">
          {live ? (
            <>
              <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-surface-inset p-1">
                {DEVICES.map((item) => {
                  const Icon = item.icon;
                  const active = device === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={item.label}
                      aria-pressed={active}
                      onClick={() => setDevice(item.id)}
                      className={cn(
                        "grid size-8 place-items-center rounded-md outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-surface-floating text-fg shadow-xs"
                          : "text-fg-tertiary hover:text-fg",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
              <Link
                href={previewPath(entry.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-inset px-3.5 py-2 text-sm font-medium text-fg outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring"
              >
                Open Preview
                <ExternalLink className="size-3.5 text-fg-tertiary" aria-hidden="true" />
              </Link>
            </>
          ) : null}
        </div>
      </div>

      <TabsContent value="preview">
        {live ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-inset">
            <div className="flex justify-center">
              <iframe
                src={previewPath(entry.slug, true)}
                title={`${entry.name} preview`}
                className="h-[min(72vh,44rem)] border-0 bg-surface-base"
                style={{ width: DEVICE_WIDTH[device], maxWidth: "100%" }}
              />
            </div>
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-surface-inset px-6 py-16 text-center text-sm text-fg-secondary">
            This starter has no live stage — scaffold it locally to explore the page.
          </p>
        )}
      </TabsContent>

      <TabsContent value="code" className="flex flex-col gap-10">
        <section>
          <h2 className="font-display text-xl font-normal tracking-[-0.02em] text-fg">Scaffold</h2>
          <p className="mt-2 text-sm text-fg-secondary">
            One command. Theme baked in as {appearanceLabel(entry)}.
          </p>
          <div className="mt-4">
            <Tabs defaultValue="bun" className="gap-3">
              <TabsList className="overflow-x-auto">
                {commands.map((item) => (
                  <TabsTrigger key={item.id} value={item.id}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {commands.map((item) => (
                <TabsContent key={item.id} value={item.id}>
                  <CodeBlock code={item.command} language="bash" />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {stack.length > 0 ? (
          <section>
            <h2 className="font-display text-xl font-normal tracking-[-0.02em] text-fg">
              Block stack
            </h2>
            <p className="mt-2 text-sm text-fg-secondary">
              The same variants compose installs, in page order. Open a block to copy its source.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {stack.map((ref) => (
                <li key={blockLabel(ref)}>
                  <Link
                    href={blockHref(ref)}
                    className="inline-flex rounded-full border border-border bg-surface-inset px-3 py-1.5 font-mono text-xs text-fg-secondary outline-none transition-colors duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:border-border-strong hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {blockLabel(ref)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CodeBlock
                code={`npx cronus-ui add ${stack.map(blockLabel).join(" ")}`}
                language="bash"
              />
            </div>
          </section>
        ) : null}

        <div className="rounded-2xl border border-border bg-surface-raised p-6">
          <CommandChip command={entry.command} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
