import type { Metadata } from "next";
import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
  SecondaryLink,
} from "../../../components/docs/documentation";
import { McpClientTabs } from "../../../components/docs/mcp-client-tabs";
import {
  MCP_CLIENTS,
  MCP_HTTP_SNIPPETS,
  MCP_HTTP_URL,
  MCP_READ_TOOLS,
  MCP_STDIO_COMMAND,
  MCP_STDIO_SNIPPETS,
  MCP_WRITE_TOOLS,
} from "../../../lib/mcp";

export const metadata: Metadata = {
  title: "MCP server",
  description:
    "Wire Cronus UI into Claude Code, Cursor, VS Code, Codex, Grok, OpenCode, Zed, v0, Lovable, Bolt, and other MCP clients. Hosted Streamable HTTP at /mcp, or local stdio with write tools.",
};

const curlProbe = `curl -s ${MCP_HTTP_URL}`;

export default function McpDocsPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="MCP server"
        description="Coding agents search the live registry, fetch source, and — on a local project — compose, add pages, install, theme, and upgrade. Two transports: hosted HTTP for cloud builders, stdio for IDEs that can spawn a process."
      >
        <PrimaryLink href="/mcp" native>
          Open /mcp
        </PrimaryLink>
        <SecondaryLink href="/llms.txt" native>
          llms.txt
        </SecondaryLink>
      </DocsHeader>

      <DocsSection
        title="Pick a transport"
        description="The hosted server is the same catalog as stdio. It cannot write files — there is no project on the other side of a URL."
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="border-b border-border px-4 py-3 text-left text-sm text-fg-secondary">
              Hosted Streamable HTTP versus local stdio.
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-raised text-xs uppercase tracking-wider text-fg-tertiary">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Transport
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Connect with
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Tools
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Use when
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <th
                  scope="row"
                  className="whitespace-nowrap px-4 py-3 align-top font-medium text-fg"
                >
                  Streamable HTTP
                </th>
                <td className="px-4 py-3 align-top text-fg">
                  <InlineCode>{MCP_HTTP_URL}</InlineCode>
                </td>
                <td className="px-4 py-3 align-top text-fg-secondary">Read-only catalog</td>
                <td className="px-4 py-3 align-top text-fg-secondary">
                  v0, Lovable, Replit, Bolt, Base44, or any client that takes a URL
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="whitespace-nowrap px-4 py-3 align-top font-medium text-fg"
                >
                  stdio
                </th>
                <td className="px-4 py-3 align-top text-fg">
                  <InlineCode>{MCP_STDIO_COMMAND}</InlineCode>
                </td>
                <td className="px-4 py-3 align-top text-fg-secondary">Read + write</td>
                <td className="px-4 py-3 align-top text-fg-secondary">
                  Claude Code, Cursor, VS Code, Codex, Grok CLI, OpenCode, Zed
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <DocCallout title="Greenfield is not an MCP tool">
            Scaffold with <InlineCode>npx create-cronus-app my-app --template saas</InlineCode>,
            then point the stdio server at that project. Write tools spawn the pinned{" "}
            <InlineCode>cronus-ui</InlineCode> CLI inside an already-inited app.
          </DocCallout>
        </div>
      </DocsSection>

      <DocsSection
        title="Hosted HTTP"
        description="Paste the URL into any client that speaks Streamable HTTP. No API key. This preview also serves the same handler at /mcp."
      >
        <McpClientTabs snippets={MCP_HTTP_SNIPPETS} />
        <p className="mt-6 text-sm leading-6 text-fg-secondary">
          A GET without the SSE Accept header returns a small JSON discovery document:
        </p>
        <div className="mt-3">
          <CodeBlock code={curlProbe} language="bash" />
        </div>
      </DocsSection>

      <DocsSection
        title="Local stdio"
        description="Full surface: search, install, compose, add-page, theme, upgrade. The process runs on your machine, so it can write the project."
      >
        <p className="mb-4 text-sm leading-6 text-fg-secondary">
          One command writes every project file. Restart the agent afterwards.
        </p>
        <div className="mb-6">
          <CodeBlock code="npx cronus-ui mcp init" language="bash" />
        </div>
        <McpClientTabs snippets={MCP_STDIO_SNIPPETS} />
        <p className="mt-6 text-sm leading-6 text-fg-secondary">
          Conductor and Kilo Code inherit the agent they wrap. A repo-root{" "}
          <InlineCode>.mcp.json</InlineCode> (stdio JSON above, the shape{" "}
          <InlineCode>create-cronus-app</InlineCode> already writes) is enough for Conductor Claude
          sessions. Kilo takes the same <InlineCode>command</InlineCode> +{" "}
          <InlineCode>args</InlineCode> as Cursor.
        </p>
      </DocsSection>

      <DocsSection
        title="Which client"
        description="Config file and transport for each host. VS Code is the one that does not use mcpServers."
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="border-b border-border px-4 py-3 text-left text-sm text-fg-secondary">
              MCP-capable clients and how they connect to Cronus UI.
            </caption>
            <thead>
              <tr className="border-b border-border bg-surface-raised text-xs uppercase tracking-wider text-fg-tertiary">
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Client
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Transport
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Config
                </th>
                <th scope="col" className="px-4 py-2.5 font-medium">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {MCP_CLIENTS.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-b-0">
                  <th
                    scope="row"
                    className="whitespace-nowrap px-4 py-3 align-top font-medium text-fg"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3 align-top text-fg-secondary">{row.transport}</td>
                  <td className="px-4 py-3 align-top text-fg-secondary">{row.config}</td>
                  <td className="px-4 py-3 align-top text-fg-secondary">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocsSection>

      <DocsSection
        title="Tools"
        description="Hosted HTTP exposes the read list. stdio adds the write list, which spawns cronus-ui@pinned inside the detected project root."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-medium text-fg">Read</h3>
            <ul className="mt-3 grid gap-1.5">
              {MCP_READ_TOOLS.map((name) => (
                <li key={name} className="font-mono text-sm text-fg-secondary">
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-medium text-fg">Write (stdio only)</h3>
            <ul className="mt-3 grid gap-1.5">
              {MCP_WRITE_TOOLS.map((name) => (
                <li key={name} className="font-mono text-sm text-fg-secondary">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DocsSection>
    </div>
  );
}
