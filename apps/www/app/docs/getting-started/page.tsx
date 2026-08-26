import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocCallout,
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  DocsTextLink,
  InlineCode,
  PrimaryLink,
} from "../../../components/docs/documentation";

const createAppCode = `npx create-kronus-app my-app --template saas`;

const scaffoldProviderCode = `import { KronusThemeScript, KronusUIProvider } from "@kronus-ui/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <KronusThemeScript
          storageKey="theme"
          defaultThemeName="aurora"
          defaultModeName="dark"
        />
      </head>
      <body>
        <KronusUIProvider
          asRoot
          defaultThemeName="aurora"
          defaultModeName="dark"
          storageKey="theme"
        >
          {children}
        </KronusUIProvider>
      </body>
    </html>
  );
}`;

const existingProviderCode = `import "@kronus-ui/tokens/styles.css";
import { KronusThemeScript, KronusUIProvider } from "@kronus-ui/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <KronusThemeScript
          storageKey="theme"
          defaultThemeName="aurora"
          defaultModeName="dark"
        />
      </head>
      <body>
        <KronusUIProvider
          asRoot
          defaultThemeName="aurora"
          defaultModeName="dark"
          storageKey="theme"
        >
          {children}
        </KronusUIProvider>
      </body>
    </html>
  );
}`;

const themeSetCode = `npx kronus-ui theme set aurora
npx kronus-ui theme set midnight --mode light`;

const addPageCode = `npx kronus-ui add-page --route /faq --blocks faq,cta --nav FAQ`;

const upgradeCode = `npx kronus-ui upgrade --all --dry-run
npx kronus-ui upgrade --all`;

const initCode = `npx kronus-ui@latest init`;

const addButtonCode = `npx kronus-ui add button`;

const useButtonCode = `import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-base">
      <Button>Get started</Button>
    </main>
  );
}`;

const addBlockCode = `npx kronus-ui add login`;

const useBlockCode = `import { LoginBlock } from "@/components/blocks/login";

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-base p-6">
      {/* Installed source — yours to edit, restyle, and wire up. */}
      <LoginBlock />
    </main>
  );
}`;

const nextSteps = [
  {
    title: "Compare",
    description:
      "Kronus UI next to shadcn/ui, HeroUI, and Aceternity — distribution, theming, compose, a11y.",
    href: "/docs/compare",
    action: "Read the comparison",
  },
  {
    title: "CLI",
    description: "init, add, compose, add-page, list, diff, upgrade, theme, and ai.",
    href: "/docs/cli",
    action: "Read CLI docs",
  },
  {
    title: "Theming",
    description: "Tokens, presets, runtime overrides, and flash-free dark mode.",
    href: "/docs/theming",
    action: "Theme the system",
  },
  {
    title: "Blocks",
    description: "Composed sections — auth, dashboards, pricing — ready to drop into a page.",
    href: "/docs/blocks",
    action: "Read about blocks",
  },
  {
    title: "Components",
    description: "Browse the full catalog of primitives, with live previews and props.",
    href: "/components",
    action: "Browse components",
  },
] as const;

export default function GettingStartedPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Getting started"
        description="From an empty folder to a composed SaaS: scaffold the product, keep the provider, switch theme, grow it with add-page, then pull updates without losing edits. Already have an app? init and add."
      >
        <PrimaryLink href="/docs/cli">Read the CLI</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="1. Scaffold a SaaS app"
        description="One command generates a Next.js app composed from validated blocks — auth, an app-shell dashboard, billing, settings — plus the theme runtime and AI Kit. Generated pages are block imports plus a main landmark that stacks them."
      >
        <CodeBlock code={createAppCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Prefer another package manager? Use{" "}
          <InlineCode>pnpm dlx create-kronus-app@latest my-app --template saas</InlineCode>,{" "}
          <InlineCode>yarn dlx create-kronus-app@latest my-app --template saas</InlineCode>, or{" "}
          <InlineCode>bunx create-kronus-app@latest my-app --template saas</InlineCode>. Templates{" "}
          <InlineCode>store</InlineCode> and <InlineCode>landing</InlineCode> compose the same way.
          See <DocsTextLink href="/docs/installation">Installation</DocsTextLink> for Create Studio
          and existing apps.
        </p>
      </DocsSection>

      <DocsSection
        title="2. The provider is already in the scaffold"
        description="The generated app already imports the tokens stylesheet and wraps the tree in KronusUIProvider. You only add this yourself when wiring an existing app."
      >
        <CodeBlock code={scaffoldProviderCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Tokens are imported in <InlineCode>globals.css</InlineCode> via{" "}
          <InlineCode>@import "@kronus-ui/tokens/styles.css"</InlineCode>.{" "}
          <InlineCode>KronusThemeScript</InlineCode> in the document head applies the saved mode
          before paint. See <DocsTextLink href="/docs/theming">Theming</DocsTextLink> for the full
          no-FOUC setup.
        </p>
      </DocsSection>

      <DocsSection
        title="3. Switch the theme"
        description="Aurora is the default on generated products. theme set rewrites the layout attributes and kronus-ui.json. Presets: aurora, neutral, midnight, sunset, emerald."
      >
        <CodeBlock code={themeSetCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Override individual tokens at runtime, or build a look visually in Create and apply it
          with <InlineCode>npx kronus-ui theme add</InlineCode>. See{" "}
          <DocsTextLink href="/docs/theming">Theming</DocsTextLink> and{" "}
          <DocsTextLink href="/docs/styling">Styling</DocsTextLink> for the full API.
        </p>
      </DocsSection>

      <DocsSection
        title="4. Add a page"
        description="add-page grows an already-composed app by one route: installs new blocks, updates chrome nav, and records the page in kronus-ui.json."
      >
        <CodeBlock code={addPageCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          <InlineCode>--route</InlineCode> and <InlineCode>--blocks</InlineCode> are required. Add{" "}
          <InlineCode>--nav</InlineCode> to list the page in the shell,{" "}
          <InlineCode>--dry-run</InlineCode> to preview. Full flags live on{" "}
          <DocsTextLink href="/docs/cli">CLI</DocsTextLink>.
        </p>
      </DocsSection>

      <DocsSection
        title="5. Pull updates without losing edits"
        description="upgrade 3-way-merges installed source and generated pages/layouts against .kronus-ui/base. add-page routes are kept. Never use compose --overwrite to pull updates."
      >
        <CodeBlock code={upgradeCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Dry-run first, then apply. If the app was composed from a custom manifest, pass{" "}
          <InlineCode>--manifest</InlineCode>. Do not run{" "}
          <InlineCode>compose --overwrite</InlineCode> to upgrade — that wipes page edits. Full
          flags live on <DocsTextLink href="/docs/cli">CLI</DocsTextLink>.
        </p>
      </DocsSection>

      <DocsSection
        title="6. Already have an app?"
        description="Run init inside the project, wrap the root with the provider, then add a component or a block. The CLI is framework-agnostic and acts on the current directory."
      >
        <CodeBlock code={initCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          init writes <InlineCode>kronus-ui.json</InlineCode>, installs base dependencies, and wires{" "}
          <InlineCode>cn()</InlineCode>. Import tokens and wrap the tree yourself:
        </p>
        <CodeBlock code={existingProviderCode} language="tsx" expandable />
        <DocCallout title="Put it at the root">
          The provider belongs at the very top of your tree — the layout in Next.js, the root route
          in TanStack Start or React Router, or wherever your app mounts.
        </DocCallout>
        <p className="mt-4 text-sm leading-6 text-fg-secondary">Then copy source with add:</p>
        <CodeBlock code={addButtonCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          This writes <InlineCode>components/ui/button.tsx</InlineCode>. Import it from your aliases
          — it is already styled by the tokens the provider supplies.
        </p>
        <CodeBlock code={useButtonCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          A block is a whole section composed from primitives. Same command, different folder:
        </p>
        <CodeBlock code={addBlockCode} language="bash" expandable />
        <CodeBlock code={useBlockCode} language="tsx" expandable />
        <div className="mt-4">
          <PrimaryLink href="/blocks">Browse blocks</PrimaryLink>
        </div>
      </DocsSection>

      <DocsSection
        title="Where to go next"
        description="You have a composed product, or a themed app with a component and a block. Deepen each part."
      >
        <DocsGrid columns={2}>
          {nextSteps.map((step) => (
            <DocsCard
              key={step.title}
              title={step.title}
              description={step.description}
              href={step.href}
              action={step.action}
            />
          ))}
        </DocsGrid>
      </DocsSection>
    </div>
  );
}
