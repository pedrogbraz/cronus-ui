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

const families = [
  {
    title: "Auth",
    count: 5,
    description: "Login, sign-up, forgot-password, two-factor code, and magic-link flows.",
  },
  {
    title: "Marketing",
    count: 8,
    description:
      "Hero, pricing, feature grid, CTA, testimonials, FAQ, footer, and navbar sections.",
  },
  {
    title: "Application",
    count: 3,
    description: "Stat cards, a settings panel, and a team-members list for app shells.",
  },
  {
    title: "Onboarding",
    count: 3,
    description: "A welcome panel, a setup wizard, and a setup checklist.",
  },
  {
    title: "Dashboard",
    count: 1,
    description: "A full application shell with sidebar nav, KPI cards, a chart, and a table.",
  },
  {
    title: "Billing",
    count: 5,
    description: "Subscription, plan selection, payment methods, usage, and a cancel flow.",
  },
  {
    title: "Commerce",
    count: 4,
    description: "Checkout, creator payouts, a product grid, and an invoice receipt.",
  },
  {
    title: "AI & Chat",
    count: 3,
    description: "A chat thread, a prompt box, and a formatted AI response card.",
  },
  {
    title: "Notifications",
    count: 3,
    description: "A notification panel, an activity feed, and a toast stack.",
  },
  {
    title: "Email",
    count: 3,
    description: "Branded welcome, receipt, and verify email templates.",
  },
  {
    title: "States",
    count: 4,
    description: "Not-found, error, success, and maintenance full-page states.",
  },
  {
    title: "Feedback",
    count: 3,
    description: "An NPS survey, a feedback form, and a contact form.",
  },
  {
    title: "Page sections",
    count: 3,
    description: "A page header, a filter bar, and empty/error states.",
  },
] as const;

const installCode = `npx kronus-ui add login`;

const installManyCode = `# Add several blocks in one run
npx kronus-ui add login signup pricing dashboard`;

const composeCode = `import { LoginBlock } from "@/components/blocks/login";

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-base p-6">
      {/* Installed source — edit the copy, swap the data, restyle with tokens. */}
      <LoginBlock />
    </main>
  );
}`;

export default function BlocksPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Blocks"
        description="Larger, composed UI sections — auth cards, dashboards, pricing tables, and more — built from Kronus UI primitives and ready to drop into a page."
      >
        <PrimaryLink href="/blocks">Browse blocks</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="What blocks are"
        description="A component is a single primitive — a Button, an Input, a Card. A block is a larger, opinionated section composed from those primitives: a centered login card, a KPI dashboard, a three-tier pricing grid. Blocks import the @kronus-ui/ui package directly, so you get a working section in one command instead of wiring primitives together by hand."
      >
        <p className="text-sm leading-6 text-fg-secondary">
          There are 13 families covering roughly 48 blocks today, from auth and marketing to
          billing, commerce, and AI. Preview each one — with its variants and source — in the live
          catalog.
        </p>
        <div className="mt-4">
          <PrimaryLink href="/blocks">Browse blocks</PrimaryLink>
        </div>
      </DocsSection>

      <DocsSection
        title="Families"
        description="Blocks are grouped into families by the surface they serve. Each family ships a handful of blocks, many with multiple variants."
      >
        <DocsGrid columns={2}>
          {families.map((family) => (
            <DocsCard
              key={family.title}
              title={family.title}
              description={family.description}
              badge={`${family.count} blocks`}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Install a block"
        description="Use the same add command you use for components. Blocks are registry:block items, so the CLI writes the source straight into your app and installs the npm packages it needs."
      >
        <CodeBlock code={installCode} language="bash" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          This writes <InlineCode>components/blocks/login.tsx</InlineCode> and installs the
          block&apos;s dependencies (<InlineCode>@kronus-ui/ui</InlineCode> plus any extras like{" "}
          <InlineCode>lucide-react</InlineCode>). Unlike components, a block imports{" "}
          <InlineCode>@kronus-ui/ui</InlineCode> rather than vendoring each primitive — so adding a
          block never floods your tree with copied component files. The written file is yours to
          edit.
        </p>
        <CodeBlock code={installManyCode} language="bash" expandable />
      </DocsSection>

      <DocsSection
        title="Compose and customize"
        description="A block is plain source you own. Import it where you need it, then change whatever you like — rewrite the copy, swap in your data, or restyle it. Because blocks consume the same semantic tokens as every component, they re-theme automatically with the rest of your app."
      >
        <CodeBlock code={composeCode} language="tsx" expandable />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          Restyling rarely means touching the block — change a token through your theme and the
          block follows. See <DocsTextLink href="/docs/theming">Theming</DocsTextLink> for how
          tokens and presets work.
        </p>
      </DocsSection>

      <DocCallout title="Block or component?">
        Reach for a <strong>component</strong> when you need a single primitive to compose your own
        layout, and a <strong>block</strong> when you want a whole section — a login screen, a
        pricing page, a dashboard — in one step. Every block re-themes through the same semantic
        tokens, so it adopts your brand without edits.
      </DocCallout>
    </div>
  );
}
