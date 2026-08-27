import { CodeBlock } from "../../../components/docs/code-block";
import {
  DocsCard,
  DocsGrid,
  DocsHeader,
  DocsSection,
  InlineCode,
} from "../../../components/docs/documentation";
import { PackageManagerTabs } from "../../../components/docs/package-manager-tabs";

const cliCommands = [
  {
    title: "init",
    description:
      "Writes cronus-ui.json, the cn() helper, and base dependencies. Flags: --cwd, --registry, --yes, --skip-install.",
    badge: "setup",
  },
  {
    title: "add",
    description:
      "Copies components or blocks, resolves registry + npm deps, rewrites imports. Flags: --overwrite, --skip-install, --cwd, --registry.",
    badge: "daily",
  },
  {
    title: "compose",
    description:
      "Generates a full app from a template (saas, store, landing, landing-*, mail, chat, finance). -y without a name composes saas. Pages are block imports plus a main landmark. Flags: --manifest, --pages, --variant, --brand, --seed, --overwrite, --skip-install, --dry-run, --yes.",
    badge: "product",
  },
  {
    title: "add-page",
    description:
      "Adds one route to a composed app: installs new blocks, updates nav, refreshes the base snapshot. Required: --route, --blocks. Also: --chrome, --title, --nav, --app, --manifest, --overwrite, --dry-run.",
    badge: "product",
  },
  {
    title: "list",
    description: "Prints registry items (alias ls). Flags: --cwd, --registry.",
    badge: "inspect",
  },
  {
    title: "diff",
    description:
      "Shows which installed files drifted from the registry. Run upgrade to merge. Flags: --cwd, --registry.",
    badge: "audit",
  },
  {
    title: "upgrade",
    description:
      "3-way merge with git merge-file --diff3 of installed components and of generated pages/layouts from compose (.cronus-ui/base vs local vs new render). Clean merges write; conflicts write markers if you confirm. Unresolved files get a prompt in CRONUS-UPGRADE.md. Flags: --all, --dry-run, --yes, --overwrite, --manifest.",
    badge: "maintain",
  },
  {
    title: "theme set",
    description:
      "Switch the preset (aurora, neutral, midnight, sunset, emerald) and optionally --mode dark|light.",
    badge: "theme",
  },
  {
    title: "theme add",
    description:
      "Apply a Create Studio permalink, a bare c= payload, or an exported theme JSON. Flags: --css, --dry-run.",
    badge: "theme",
  },
  {
    title: "ai",
    description:
      "Writes the AI Kit: AGENTS.md doctrine plus Claude / Cursor / Copilot / Windsurf / Gemini config. Flags: --assistants, --preset, --skills.",
    badge: "agents",
  },
] as const;

const inspectCommands = `npx cronus-ui@latest list
npx cronus-ui@latest diff button`;

const addPageExample = `npx cronus-ui@latest add-page --route /faq --blocks faq,cta --nav FAQ
npx cronus-ui@latest add-page --route /faq --blocks faq,cta --dry-run`;

const upgradeExample = `npx cronus-ui@latest upgrade --all --dry-run
npx cronus-ui@latest upgrade button card
npx cronus-ui@latest upgrade --all --yes`;

const themeExample = `npx cronus-ui@latest theme set aurora
npx cronus-ui@latest theme set midnight --mode light
npx cronus-ui@latest theme add ./my-theme.json`;

const aiExample = `npx cronus-ui@latest ai
npx cronus-ui@latest ai --assistants claude,cursor --preset saas --skills all`;

const composeDryRun = `npx cronus-ui@latest compose saas --dry-run
npx cronus-ui@latest compose store --variant login=split --brand Acme`;

const config = `{
  "aliases": {
    "ui": "@/components/ui",
    "lib": "@/lib",
    "blocks": "@/components/blocks"
  },
  "paths": {
    "ui": "components/ui",
    "lib": "lib",
    "blocks": "components/blocks"
  },
  "registry": "https://raw.githubusercontent.com/pedrogbraz/cronus-ui/v0.5.0/registry",
  "theme": {
    "name": "aurora",
    "mode": "dark"
  },
  "installed": {},
  "composed": {}
}`;

export default function CliPage() {
  return (
    <div className="py-10">
      <DocsHeader
        eyebrow="CLI"
        title="Install, compose, theme, and upgrade from the terminal"
        description="The cronus-ui CLI is the shadcn-style path for apps that own their source. New product? Scaffold with create-cronus-app, then use these commands inside the repo."
      />

      <DocsSection title="Initialize a project">
        <PackageManagerTabs command="init" description="Select your package manager" />
      </DocsSection>

      <DocsSection title="Add components">
        <PackageManagerTabs command="add" description="Copy components into your app" />
      </DocsSection>

      <DocsSection
        title="Compose an app"
        description="compose generates pages and chrome from a bundled template (saas, store, landing, landing-*, mail, chat, finance) or --manifest. -y with no name composes saas. Each page is imports of installed blocks plus a main landmark that stacks them."
      >
        <PackageManagerTabs command="compose" description="Compose a template" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          <InlineCode>--dry-run</InlineCode> prints the plan and per-file preview without writing.{" "}
          <InlineCode>--variant login=split</InlineCode> selects a block variant.{" "}
          <InlineCode>--brand</InlineCode> bakes a wordmark into chrome.
        </p>
        <CodeBlock code={composeDryRun} language="bash" />
      </DocsSection>

      <DocsSection
        title="Add a page"
        description="Grows an already-composed app. Required: --route and --blocks. Updates chrome nav when you pass --nav."
      >
        <CodeBlock code={addPageExample} language="bash" />
      </DocsSection>

      <DocsSection
        title="Theme"
        description="theme set switches a shipped preset. theme add applies a Create Studio export."
      >
        <CodeBlock code={themeExample} language="bash" />
      </DocsSection>

      <DocsSection
        title="Upgrade without losing edits"
        description="Each add records the release in cronus-ui.json installed. upgrade 3-way-merges that base, your file, and upstream with git merge-file --diff3. Composed pages and layouts use the same merge against .cronus-ui/base (snapshot vs local vs new render); add-page routes are kept and user files are never deleted. Custom compose apps take --manifest. Clean merges write; conflicts write markers only if you confirm (or --yes). Unresolved files get a ready-to-paste agent prompt in CRONUS-UPGRADE.md."
      >
        <CodeBlock code={upgradeExample} language="bash" />
      </DocsSection>

      <DocsSection
        title="Inspect the registry"
        description="List available items, or diff a copied component against the registry version to spot local drift."
      >
        <CodeBlock code={inspectCommands} language="bash" />
      </DocsSection>

      <DocsSection
        title="AI Kit"
        description="Writes AGENTS.md doctrine and per-assistant config. Presets: standard, fintech, saas, oss, agency, or none. Assistants: claude, cursor, copilot, windsurf, gemini (or all / none)."
      >
        <CodeBlock code={aiExample} language="bash" />
      </DocsSection>

      <DocsSection
        title="Command surface"
        description="The commands exported by cronus-ui. Flags match --help — nothing extra."
      >
        <DocsGrid columns={2}>
          {cliCommands.map((command) => (
            <DocsCard
              key={command.title}
              title={command.title}
              description={command.description}
              badge={command.badge}
            />
          ))}
        </DocsGrid>
      </DocsSection>

      <DocsSection
        title="Config"
        description="cronus-ui.json keeps aliases explicit and pins the registry to a release tag — never main/registry. add fills installed; compose fills composed."
      >
        <CodeBlock code={config} language="json" />
        <p className="mt-4 text-sm leading-6 text-fg-secondary">
          <InlineCode>installed</InlineCode> records each item&apos;s version and files so upgrade
          has a merge base. <InlineCode>composed</InlineCode> records each generated app (plan
          version, choices, files) so add-page can extend it and upgrade can 3-way-merge pages
          against <InlineCode>.cronus-ui/base</InlineCode>. Use{" "}
          <InlineCode>--registry ./registry</InlineCode> for offline testing against a local
          registry build.
        </p>
      </DocsSection>
    </div>
  );
}
