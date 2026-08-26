import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";
import { FrameworkGrid } from "../../../components/docs/framework-grid";

const adapterContract = `// 1. Import tokens in the framework global CSS entry.
@import "tailwindcss";
@import "@cronus-ui/tokens/styles.css";

// 2. Wrap the root UI tree in CronusUIProvider.
<CronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
  {children}
</CronusUIProvider>

// 3. Add components through the registry.
pnpm dlx cronus-ui@latest add button card dialog form`;

const rscUsage = `// app/activity/page.tsx — a Server Component, no "use client" anywhere.
import { Badge } from "@cronus-ui/ui/badge";
import { Timeline, TimelineContent, TimelineItem, TimelineTitle } from "@cronus-ui/ui/timeline";
// Client components nest inside server markup and hydrate as islands:
import { CopyButton } from "@cronus-ui/ui/copy-button";

export default function ActivityPage() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineContent>
          <TimelineTitle>
            Deploy finished <Badge variant="success">live</Badge>
          </TimelineTitle>
          <CopyButton value="deploy-7f4c45f" />
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}`;

const rscNextConfig = `// next.config.ts — tree-shake barrel imports out of server bundles.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@cronus-ui/ui"],
  },
};

export default nextConfig;`;

export default function FrameworksPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Frameworks"
        title="Install once, keep framework behavior accessible"
        description="Each adapter keeps the same component contract while respecting the routing, hydration, and form behavior of the host framework."
      />

      <DocsSection
        title="Choose your framework"
        description="Create the app with the framework's official tool, then run cronus-ui init inside it. The init command is framework-agnostic and acts on the current directory."
      >
        <FrameworkGrid />
      </DocsSection>

      <DocsSection
        title="Adapter contract"
        description="Every framework path has the same three checkpoints: token CSS, provider placement, and registry component ownership."
      >
        <CodeBlock code={adapterContract} language="tsx" expandable />
      </DocsSection>

      <DocsSection
        title="React Server Components"
        description="Components wearing the Server Component badge in the docs ship without a use client directive — they render entirely inside React Server Components and add zero client JavaScript of their own."
      >
        <p className="text-sm leading-6 text-fg-secondary">
          In server files, prefer per-entry imports such as{" "}
          <InlineCode>@cronus-ui/ui/timeline</InlineCode> so only the rendered module is loaded.
          Interactive components are already marked <InlineCode>&quot;use client&quot;</InlineCode>{" "}
          internally, so you can nest them inside server markup freely — they hydrate as client
          islands while the rest of the page stays server-rendered.
        </p>
        <div className="mt-4">
          <CodeBlock code={rscUsage} language="tsx" expandable />
        </div>
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          If you keep the barrel import (<InlineCode>@cronus-ui/ui</InlineCode>), add the package to
          Next.js <InlineCode>optimizePackageImports</InlineCode> so server bundles stay
          tree-shaken:
        </p>
        <div className="mt-4">
          <CodeBlock code={rscNextConfig} language="ts" />
        </div>
      </DocsSection>

      <DocCallout title="Accessibility handoff" tone="success">
        Framework integrations must preserve visible focus, route transition focus, dialog
        dismissal, and form error announcements. This is part of the adapter checklist, not optional
        polish.
      </DocCallout>

      <DocsSection
        title="Laravel note"
        description="For Laravel, create the app first with the Laravel installer, then run Cronus UI inside the Vite/Inertia or Blade frontend workspace."
      >
        <p className="text-sm leading-6 text-fg-secondary">
          Start with <InlineCode>laravel new app</InlineCode>, choose the frontend stack, then run{" "}
          <InlineCode>cronus-ui init</InlineCode> inside the project. Server validation errors
          should map into <InlineCode>FieldError</InlineCode> or equivalent visible form feedback.
        </p>
      </DocsSection>
    </div>
  );
}
