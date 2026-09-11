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
import { ALL_BLOCKS, BLOCK_CATEGORIES } from "../../../lib/blocks-index";

const installCode = `npx cronus-ui add login`;

const installManyCode = `# Add several blocks in one run
npx cronus-ui add login signup pricing dashboard`;

const composeCode = `import { LoginBlock } from "@/components/blocks/login";

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-surface-base p-6">
      {/* Installed source — edit the copy, swap the data, restyle with tokens. */}
      <LoginBlock />
    </main>
  );
}`;

function familyPreview(names: string[]): string {
  const shown = names.slice(0, 5);
  const rest = names.length - shown.length;
  return rest > 0 ? `${shown.join(", ")}, and ${rest} more.` : `${shown.join(", ")}.`;
}

export default function BlocksPage() {
  const familyCount = BLOCK_CATEGORIES.length;
  const blockCount = ALL_BLOCKS.length;

  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="Documentation"
        title="Blocks"
        description="Larger, composed UI sections — auth cards, dashboards, pricing tables, and more — built from Cronus UI primitives and ready to drop into a page."
      >
        <PrimaryLink href="/blocks">Browse blocks</PrimaryLink>
      </DocsHeader>

      <DocsSection
        title="What blocks are"
        description="A component is a single primitive — a Button, an Input, a Card. A block is a larger, opinionated section composed from those primitives: a centered login card, a KPI dashboard, a three-tier pricing grid. Blocks import the @cronus-ui/ui package directly, so you get a working section in one command instead of wiring primitives together by hand."
      >
        <p className="text-sm leading-6 text-fg-secondary">
          There are {familyCount} families covering {blockCount} blocks, from auth and marketing to
          billing, commerce, admin, and store. Preview each one — with its variants and source — in
          the live catalog.
        </p>
        <div className="mt-4">
          <PrimaryLink href="/blocks">Browse blocks</PrimaryLink>
        </div>
      </DocsSection>

      <DocsSection
        title="Families"
        description="Blocks are grouped into families by the surface they serve. Counts come from the live index, not a hand-written list."
      >
        <DocsGrid columns={2}>
          {BLOCK_CATEGORIES.map((family) => (
            <DocsCard
              key={family.slug}
              title={family.name}
              description={familyPreview(family.items.map((item) => item.name))}
              badge={`${family.items.length} ${family.items.length === 1 ? "block" : "blocks"}`}
              href={`/blocks/${family.items[0].slug}`}
              action="Preview"
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
          block&apos;s dependencies (<InlineCode>@cronus-ui/ui</InlineCode> plus any extras like{" "}
          <InlineCode>lucide-react</InlineCode>). Unlike components, a block imports{" "}
          <InlineCode>@cronus-ui/ui</InlineCode> rather than vendoring each primitive — so adding a
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
