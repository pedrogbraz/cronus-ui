import {
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";
import { FrameworkGrid } from "../../../components/docs/framework-grid";
import { PackageManagerTabs } from "../../../components/docs/package-manager-tabs";
import { INSTALL_OPTIONS } from "../../../lib/docs";

/**
 * Heavy, component-specific libraries that ship as OPTIONAL peer dependencies
 * of the @kronus-ui/ui npm package — installed only by consumers who import the
 * matching component. CLI installs are unaffected (add installs per-item deps).
 */
const OPTIONAL_PEERS = [
  { components: "Chart", install: "npm i recharts" },
  { components: "RichTextEditor", install: "npm i @tiptap/react @tiptap/pm @tiptap/starter-kit" },
  { components: "Kanban", install: "npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities" },
  { components: "DataTable", install: "npm i @tanstack/react-table" },
  { components: "Calendar", install: "npm i react-day-picker" },
  { components: "DatePicker, DateRangePicker", install: "npm i react-day-picker date-fns" },
  { components: "Scheduler", install: "npm i date-fns" },
  { components: "Form", install: "npm i react-hook-form zod @hookform/resolvers" },
] as const;

export default function InstallationPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Installation"
        title="Install Kronus UI in the path that matches your project"
        description="New product: scaffold a composed SaaS. Existing app: run the CLI. Create Studio is for designing a visual preset first."
      />

      <div className="mt-8">
        <DocCallout title="Recommended for a new product">
          Scaffold with <InlineCode>npx create-kronus-app@latest my-app --template saas</InlineCode>
          . Use Create Studio when you want to design a visual preset before you generate setup
          snippets.
        </DocCallout>
      </div>

      <DocsSection
        title="Scaffold a SaaS app"
        description="create-kronus-app composes a Next.js app from validated blocks (auth, dashboard shell, billing), wires the theme, and ships the AI Kit."
      >
        <PackageManagerTabs command="create" description="Scaffold a SaaS app" />
      </DocsSection>

      <DocsSection title="Starting point">
        <DocsGrid>
          {INSTALL_OPTIONS.map((option) => (
            <DocsCard
              key={option.title}
              title={option.title}
              description={option.description}
              href={option.href}
              action={option.action}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Use Create"
        description="Build your preset visually, preview the result, save it locally, and generate the command for your stack."
      >
        <PrimaryLink href="/create">Open Create</PrimaryLink>
      </DocsSection>

      <DocsSection
        title="Use the CLI"
        description="Create the app with your framework's official tool, then run init inside it. The CLI is framework-agnostic and acts on the current directory."
      >
        <PackageManagerTabs command="init" description="Initialize the current project" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Works in any project — including <InlineCode>next</InlineCode>,{" "}
          <InlineCode>vite</InlineCode>, <InlineCode>tanstack-start</InlineCode>,{" "}
          <InlineCode>react-router</InlineCode>, <InlineCode>astro</InlineCode>, and{" "}
          <InlineCode>laravel</InlineCode> apps.
        </p>
      </DocsSection>

      <DocsSection
        title="Add components"
        description="After init, copy components from the registry into your app. Imports are rewritten to your local aliases."
      >
        <PackageManagerTabs command="add" description="Copy components into your app" />
      </DocsSection>

      <DocsSection
        title="Optional peer dependencies (npm package)"
        description="Using @kronus-ui/ui as a managed npm dependency instead of the CLI? A few heavy, component-specific libraries are optional peers and are not installed automatically — add them only when you import the component. CLI users skip this: add installs each item's dependencies."
      >
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-inset/60 text-xs uppercase tracking-wider text-fg-tertiary">
                <th className="px-4 py-2.5 font-medium">Component(s)</th>
                <th className="px-4 py-2.5 font-medium">Install</th>
              </tr>
            </thead>
            <tbody>
              {OPTIONAL_PEERS.map((row) => (
                <tr key={row.components} className="border-b border-border/60 last:border-b-0">
                  <td className="px-4 py-3 text-fg-secondary">{row.components}</td>
                  <td className="px-4 py-3">
                    <InlineCode>{row.install}</InlineCode>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocsSection>

      <DocsSection
        title="Choose your framework"
        description="Each adapter documents where the provider, token import, and accessibility handoff should live."
      >
        <FrameworkGrid />
      </DocsSection>
    </div>
  );
}
