"use client";

import { cn, Tabs, TabsContent, TabsList, TabsTrigger } from "@kronus-ui/ui";
import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";

const MANAGERS = [
  { id: "bun", label: "bun", cmd: (p: string) => `bun add ${p}` },
  { id: "npm", label: "npm", cmd: (p: string) => `npm install ${p}` },
  { id: "pnpm", label: "pnpm", cmd: (p: string) => `pnpm add ${p}` },
  { id: "yarn", label: "yarn", cmd: (p: string) => `yarn add ${p}` },
] as const;

const DEFAULT_MANAGER = "pnpm";

export function InstallTabs({ packages }: { packages: string }) {
  const [active, setActive] = useState<string>(DEFAULT_MANAGER);
  const [copied, setCopied] = useState(false);
  const command = (MANAGERS.find((manager) => manager.id === active) ?? MANAGERS[0]).cmd(packages);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <Tabs
      value={active}
      onValueChange={setActive}
      className="gap-0 overflow-hidden rounded-xl border border-border bg-surface-inset/80"
    >
      <div className="flex items-center justify-between border-b border-border/60 pr-2">
        <div className="flex items-center">
          <span className="grid size-9 place-items-center text-fg-tertiary">
            <Terminal className="size-4" aria-hidden="true" />
          </span>
          <TabsList
            aria-label="Package manager"
            className="h-auto w-fit gap-0 rounded-none bg-transparent p-0 text-fg-tertiary"
          >
            {MANAGERS.map((manager) => (
              <TabsTrigger
                key={manager.id}
                value={manager.id}
                className={cn(
                  "rounded-none px-3 py-2 text-sm font-normal text-fg-tertiary shadow-none transition-colors ring-offset-0 hover:text-fg-secondary focus-visible:ring-offset-surface-inset",
                  "data-[state=active]:bg-transparent data-[state=active]:font-medium data-[state=active]:text-fg data-[state=active]:shadow-none",
                )}
              >
                {manager.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy install command"
          className="grid size-8 place-items-center rounded-md text-fg-tertiary outline-none transition-colors hover:bg-surface-overlay hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </button>
      </div>
      {MANAGERS.map((manager) => (
        <TabsContent
          key={manager.id}
          value={manager.id}
          className="mt-0 overflow-x-auto px-4 py-3 font-mono text-sm"
        >
          <span className="text-primary">{manager.cmd(packages).split(" ")[0]}</span>
          <span className="text-fg-secondary">
            {" "}
            {manager.cmd(packages).split(" ").slice(1).join(" ")}
          </span>
        </TabsContent>
      ))}
    </Tabs>
  );
}
