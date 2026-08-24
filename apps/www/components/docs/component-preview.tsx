"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@cooud-ui/ui";
import type { Example } from "../../lib/examples/types";
import { PreviewFrame } from "../showcase-ui";
import { CodeBlock } from "./code-block";

export function ExampleBlock({ example }: { example: Example }) {
  return (
    <section id={example.id} className="scroll-mt-24">
      <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-fg">
        {example.title}
      </h2>
      {example.description && (
        <p className="mt-1.5 max-w-2xl text-sm text-fg-secondary">{example.description}</p>
      )}
      <div className="mt-4 flex flex-col gap-3">
        <PreviewFrame>{example.preview}</PreviewFrame>
        {example.install && <ExampleInstallation install={example.install} />}
        <CodeBlock code={example.code} expandable />
      </div>
    </section>
  );
}

const PACKAGE_MANAGERS = [
  { id: "pnpm", label: "pnpm", command: (packages: string) => `pnpm add ${packages}` },
  { id: "npm", label: "npm", command: (packages: string) => `npm install ${packages}` },
  { id: "yarn", label: "yarn", command: (packages: string) => `yarn add ${packages}` },
  { id: "bun", label: "bun", command: (packages: string) => `bun add ${packages}` },
] as const;

type InstallMetadata = NonNullable<Example["install"]>;

function ExampleInstallation({ install }: { install: InstallMetadata }) {
  const dependencies = install.dependencies?.filter(Boolean) ?? [];

  return (
    <section
      aria-labelledby={`${install.registryItem}-installation`}
      className="border-t border-border pt-5"
    >
      <div className="flex flex-col gap-1">
        <h3
          id={`${install.registryItem}-installation`}
          className="font-display text-lg font-medium text-fg"
        >
          Installation
        </h3>
        <p className="text-sm text-fg-secondary">
          Add the component with the CLI or copy the dependencies and source manually.
        </p>
      </div>

      <Tabs defaultValue="cli" className="mt-4 gap-4">
        <TabsList aria-label="Installation method" className="w-fit">
          <TabsTrigger value="cli">CLI</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        <TabsContent value="cli" className="mt-0 space-y-3">
          <p className="text-sm text-fg-secondary">
            Copy the registry item into your app with its source-owned dependencies.
          </p>
          <CodeBlock code={`npx cooud-ui add ${install.registryItem}`} language="bash" />
        </TabsContent>

        <TabsContent value="manual" className="mt-0 space-y-4">
          {dependencies.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-fg">Install the required dependencies:</p>
              <Tabs defaultValue="pnpm" className="gap-3">
                <TabsList aria-label="Package manager" className="w-fit overflow-x-auto">
                  {PACKAGE_MANAGERS.map((manager) => (
                    <TabsTrigger key={manager.id} value={manager.id}>
                      {manager.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {PACKAGE_MANAGERS.map((manager) => (
                  <TabsContent key={manager.id} value={manager.id} className="mt-0">
                    <CodeBlock code={manager.command(dependencies.join(" "))} language="bash" />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          <p className="text-sm text-fg-secondary">
            Copy and paste the following code into your project.
          </p>
        </TabsContent>
      </Tabs>
    </section>
  );
}
