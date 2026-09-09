"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@cronus-ui/ui";
import type { McpSnippet } from "../../lib/mcp";
import { CodeBlock } from "./code-block";

export function McpClientTabs({ snippets }: { snippets: readonly McpSnippet[] }) {
  const first = snippets[0];
  if (!first) return null;

  return (
    <Tabs defaultValue={first.id} className="gap-3">
      <TabsList className="h-auto w-full flex-wrap justify-start overflow-x-auto">
        {snippets.map((snippet) => (
          <TabsTrigger key={snippet.id} value={snippet.id}>
            {snippet.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {snippets.map((snippet) => (
        <TabsContent key={snippet.id} value={snippet.id}>
          <p className="mb-3 text-sm text-fg-tertiary">{snippet.configPath}</p>
          <CodeBlock code={snippet.code} language={snippet.language} />
          {snippet.note ? (
            <p className="mt-3 text-sm leading-6 text-fg-secondary">{snippet.note}</p>
          ) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}
