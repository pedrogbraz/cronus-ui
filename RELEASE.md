# Releasing kronus-ui

This monorepo publishes **nine** packages. They are versioned in lockstep at
`0.x` and released **locally** (GitHub Actions was removed — see
[Future / not active](#future--not-active-ci-was-removed) below).

| Package                       | Name                  | Registry                     | `publishConfig`  | Notes                                      |
| ----------------------------- | --------------------- | ---------------------------- | ---------------- | ------------------------------------------ |
| `packages/tokens`             | `@kronus-ui/tokens`    | `https://registry.npmjs.org` | `access: public` | Design tokens + CSS bridge + TW preset     |
| `packages/theme`              | `@kronus-ui/theme`     | `https://registry.npmjs.org` | `access: public` | Runtime theming engine (depends tokens)    |
| `packages/ui`                 | `@kronus-ui/ui`        | `https://registry.npmjs.org` | `access: public` | React components                           |
| `packages/stack`              | `@kronus-ui/stack`     | `https://registry.npmjs.org` | `access: public` | Stack Builder catalog/resolver/artifacts   |
| `packages/ai-kit`             | `@kronus-ui/ai-kit`    | `https://registry.npmjs.org` | `access: public` | AI assistant doctrine, skills, and configs |
| `packages/cli`                | `kronus-ui`            | `https://registry.npmjs.org` | `access: public` | shadcn-style component installer (CLI)     |
| `packages/create-kronus-app`   | `create-kronus-app`    | `https://registry.npmjs.org` | `access: public` | App scaffold CLI                           |
| `packages/create-kronus-stack` | `create-kronus-stack`  | `https://registry.npmjs.org` | `access: public` | Stack Builder scaffold CLI                 |
| `packages/mcp`                | `kronus-ui-mcp`        | `https://registry.npmjs.org` | `access: public` | MCP server for registry discovery          |

`apps/www` (showcase) and `apps/pro` (Kronus Pro origin) are **not** published.

The active release tooling is intentionally pinned to public npmjs
(`https://registry.npmjs.org/`) so a developer machine's `.npmrc` cannot
redirect a release. Each package still carries `publishConfig.access: public` in
its tarball; the release script supplies `--registry=https://registry.npmjs.org/`
for npm availability checks, dry-runs, and real publishes.

## The release pipeline — `bun run release` (primary path)

Everything runs from your machine via [`scripts/release.mjs`](scripts/release.mjs),
wrapped by the root `release` script. It is **dry-run by default** and requires an
explicit `--publish` flag to actually push the tag and publish.

```sh
bun run release            # DRY-RUN (default): prints exactly what it would tag + publish
bun run release --publish  # really push the tag and publish the tarballs
```

In order, the script:

1. **Preflight** — asserts the git working tree is **clean** and that all nine
   publishable packages share the **same `version`**, that the `v<version>` tag
   does not already exist locally or on `origin`, and that none of the package
   versions already exist on npmjs. In real `--publish` mode it also aborts
   unless the checkout is local `main`, `HEAD` exactly matches `origin/main`, and
   `npm whoami` succeeds before any tag is created or pushed.
2. **Gate** — runs, in this order:
   `typecheck` · `lint` · `test` · `registry:check` · `tokens:check` ·
   `props:check` · `build`. Any failure aborts the release.
3. **Smoke** — runs `package:smoke` (packs each package with `npm pack --dry-run`,
   validates tarball structure, validates `bun pm pack` internal dependency pins,
   and dynamically `import()`s every built JS entry offline to prove it loads).
   Real `--publish` mode promotes this to `SMOKE_FULL=1 bun run package:smoke`,
   which also installs tarballs into consumer fixtures and runs the installed
   CLI/generator/MCP bins.
4. **Tag** — creates an annotated git tag `v<version>` at `HEAD` and pushes it to
   `origin` before publishing, so the CLI/MCP registries that point at the raw
   GitHub tag are resolvable before any package is public (only with `--publish`;
   a dry-run just prints the tag it would cut).
5. **Publish** — for each package in dependency order
   **`@kronus-ui/tokens` → `@kronus-ui/theme` → `@kronus-ui/ui` →
   `@kronus-ui/stack` → `@kronus-ui/ai-kit` → `kronus-ui` →
   `create-kronus-app` → `create-kronus-stack` → `kronus-ui-mcp`**:
   - packs it with `bun pm pack` (this rewrites `workspace:*` ranges to the
     concrete version **and** carries each package's `publishConfig`),
   - runs `npm publish <tarball> --registry=https://registry.npmjs.org/`, which
     honors the tarball's embedded `publishConfig.access: public` while forcing
     all nine packages to public npmjs regardless of local npm config.

   In a dry-run this step runs `npm publish --dry-run` (validates the tarball and
   prints the target registry) and leaves the packed tarballs in
   `.release-tarballs/` for inspection. With `--publish` it publishes for real.

> **Why `bun pm pack` and not a plain `npm publish` from each package dir?** In
> this Bun workspace `npm pack`/`npm publish` ship `workspace:*` dependency
> ranges **literally**, which is unresolvable for consumers. `bun pm pack`
> rewrites them to the concrete version. `npm publish <tarball>
> --registry=https://registry.npmjs.org/` is then used so the exact, correct
> bytes are what gets published to npmjs — while still honoring each package's
> `publishConfig.access: public`.

### Authentication

All nine packages publish to **public npm**, so one credential covers the whole
release. Be logged in to npmjs with publish rights for the `@kronus-ui` scope and
the unscoped package names (`kronus-ui`, `create-kronus-app`,
`create-kronus-stack`, `kronus-ui-mcp`), or have an `NPM_TOKEN` with those publish
rights in your user `~/.npmrc`. No repo-level `.npmrc` and no GitHub Packages
token are needed.

`--publish` checks `npm whoami --registry=https://registry.npmjs.org/` before it
can create or push the git tag. That proves a credential is present, not that
every package permission is correct. If npm later rejects a package publish,
earlier packages in the order may already be published, so fix the permission
and re-run only with an explicit recovery plan (a re-publish of an already
published version will error — bump the version if needed).

Before a real `--publish`, name the recovery plan in the release note or run log:
if the tag was pushed but no package was published, delete `vX.Y.Z` locally and
remotely; after the first npm package publishes, do **not** delete or unpublish by
default. Recover with a follow-up version and deprecate the bad version only if
needed.

## Exact release procedure

1. **Bump the version** in all nine publishable `package.json` files to the new
   `0.x` (they must match). Also bump `CLI_VERSION` in
   [`packages/cli/src/config.ts`](packages/cli/src/config.ts) and
   `SERVER_VERSION` in [`packages/mcp/src/version.ts`](packages/mcp/src/version.ts)
   to the same value — the CLI and MCP default registries are pinned to their own
   tag (`https://raw.githubusercontent.com/pedrogbraz/kronus-ui/vX.Y.Z/registry`),
   and tests fail if either runtime version drifts from `package.json`.
2. **Build:** `bun run build`.
3. **Gate + smoke (dry-run preflight):** `bun run release` — this runs the full
   gate, light `package:smoke`, and a publish/tag dry-run. Confirm the printed
   plan lists `vX.Y.Z` and the nine packages in the same order printed by
   `scripts/release.mjs`, with the expected registries.
4. **Merge and sync main:** merge the PR, check out local `main`, fetch `origin`,
   and make sure local `HEAD` equals `origin/main`. The real publish path refuses
   to run from a feature branch or stale local main.
5. **Push tag + publish:** `bun run release --publish`. This first re-runs the
   full gate, checks npm auth and confirms the GitHub repo is public before any
   tag mutation, runs
   `SMOKE_FULL=1 bun run package:smoke`, pushes `vX.Y.Z`, then publishes
   `@kronus-ui/tokens` → `@kronus-ui/theme` → `@kronus-ui/ui` →
   `@kronus-ui/stack` → `@kronus-ui/ai-kit` → `kronus-ui` →
   `create-kronus-app` → `create-kronus-stack` → `kronus-ui-mcp`.

   > `v0.1.0` already exists, so the stack-generator release line starts at
   > `v0.2.0`: all nine publishable packages must share `0.2.0`, and the
   > release cuts `v0.2.0` before any future `0.x` bump.

6. **Repo visibility is a hard preflight.** Before publishing, confirm
   `pedrogbraz/kronus-ui` is **public** so the CLI's pinned registry
   (`raw.githubusercontent.com/pedrogbraz/kronus-ui/vX.Y.Z/registry`) is reachable
   and `npx kronus-ui add <component>` resolves component sources from the tagged
   `vX.Y.Z` registry (not mutable `main`). The release script verifies this in
   preflight and aborts if it cannot prove public visibility.

> The `release` script prints a final summary plus the post-publish steps it did
> **not** do (cut a GitHub Release, generate SBOM / provenance). Keep this doc in
> sync with what `scripts/release.mjs` actually does.

## Publishing a single package by hand (fallback)

If you need to (re)publish one package outside the script, pack it with Bun first
so `workspace:*` is rewritten, then publish the tarball to npmjs (it carries its
own `publishConfig.access: public`):

```sh
bun run build

# all nine go to public npm — be logged in with @kronus-ui scope and unscoped-name rights:
npm login

cd packages/tokens && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/theme  && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/ui     && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/stack  && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/ai-kit && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/cli    && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/create-kronus-app && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/create-kronus-stack && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
cd packages/mcp    && bun pm pack && npm publish ./*.tgz --registry=https://registry.npmjs.org/ && rm ./*.tgz && cd -
```

Each package also runs `prepublishOnly` (`tsc -p tsconfig.json`) as a safety net,
so `dist` is rebuilt before any manual publish.

## Future / not active (CI was removed)

GitHub Actions was removed from this repo (account billing), so there is **no**
`.github/workflows/release.yml` anymore and **none** of the following runs today.
This section is retained as design intent for if/when hosted CI is restored.

When CI existed, a tagged `v*` push triggered an approval-gated `release.yml`
workflow that, after a required-reviewer approval in a protected `release`
environment, would: install with `bun install --frozen-lockfile`; validate every
publishable version against the tag; validate `NPM_TOKEN`; run the
release gates; build in dependency order; run the **full** package smoke
   (`SMOKE_FULL=1`, which packs all publishables, installs the runtime UI tarballs
   into the Next/Vite fixtures, builds them, asserts styled CSS was emitted, and
   runs the installed CLI/generator/MCP bins);
pack each package with
`bun pm pack`; generate a **CycloneDX SBOM**; emit a **build-provenance
attestation** (`actions/attest-build-provenance`, SLSA-style, OIDC-signed) over
every tarball; and `npm publish` in the same nine-package order used by
`scripts/release.mjs`.

> Tarball naming footgun (still relevant to manual packs): `@kronus-ui/ui` and
> `kronus-ui` both pack to `kronus-ui-<version>.tgz`. The local pipeline packs into
> a temporary `.release-tarballs/` one package at a time, so a stale tarball
> can't be selected by mistake.

The token scopes, branch/tag protection, the `release` environment with required
reviewers, CODEOWNERS, and the SHA-pinned, attested CI/CD are documented in
**[`docs/RELEASE_GOVERNANCE.md`](docs/RELEASE_GOVERNANCE.md)**. That doc reflects
the (now inactive) hosted-CI model; the **active** path is `bun run release`
above.
