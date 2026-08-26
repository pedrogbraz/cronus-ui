# Release & Supply-Chain Governance

This document records the target repository governance for releases. The current
release path is local and is documented in [`RELEASE.md`](../RELEASE.md);
GitHub Actions release automation is **not active**. CI/CD workflow references
below are retained as the posture to restore when hosted CI comes back.

Related files:

- `.github/workflows/ci.yml` — target quality gates on every PR/push to `main`
  when hosted CI is restored.
- `.github/workflows/release.yml` — future approval-gated publish on `v*` tags;
  not active today.
- `.github/CODEOWNERS` — target required reviewers per area.
- `RELEASE.md` — what gets published, where, and how to publish manually.

---

## 1. Supply-chain hardening target

### Pinned, reproducible toolchain

- **Bun must stay pinned** to `1.3.14` in workflows — the same version as
  `packageManager` in the root `package.json`. CI must never use `bun-version:
  latest` (non-reproducible).
- **Every GitHub Action must be pinned by full commit SHA**, not by a mutable tag.
  A mutable tag (e.g. `@v4`) can be silently re-pointed at malicious code; a
  SHA cannot. Each pin carries a trailing `# vX.Y.Z` comment for readability.

Current action pins:

| Action                                | SHA                                        | Tag      |
| ------------------------------------- | ------------------------------------------ | -------- |
| `actions/checkout`                    | `11bd71901bbe5b1630ceea73d27597364c9af683` | v4.2.2   |
| `oven-sh/setup-bun`                   | `735343b667d3e6f658f44d0eca948eb6282f2b76` | v2.0.2   |
| `actions/setup-node`                  | `39370e3970a6d050c480ffad4ff0ed4d3fdee5af` | v4.1.0   |
| `anchore/sbom-action`                 | `e22c389904149dbc22b58101806040fa8d37a610` | v0.24.0  |
| `actions/attest-build-provenance`     | `ef244123eb79f2f7a7e75d99086184180e6d0018` | v1.4.4   |
| `actions/upload-artifact`             | `ea165f8d65b6e75b540449e92b4886f43607fa02` | v4.6.2   |

> **Updating a pin:** bump the SHA *and* the comment together. Resolve a tag to
> its SHA with `gh api repos/<owner>/<repo>/git/refs/tags/<tag> --jq '.object.sha'`
> (deref annotated tags via `git/tags/<sha>`). Prefer Dependabot's
> `package-ecosystem: github-actions` to keep pins current with PRs.

### Least-privilege permissions

- Future workflows should declare `permissions: contents: read` at the **workflow top
  level**, dropping the default broad token scope.
- A restored `release.yml` `publish` job should widen to exactly what it needs:
  `packages: write` (publish), `id-token: write` (OIDC for attestation),
  `attestations: write` (store the attestation). Nothing more.

### Provenance & SBOM

A restored release job should **pack first, then attest, then publish the same bytes**:

1. `bun pm pack` each publishable package into a package-specific
   `dist-artifacts/<package>/*.tgz` directory (kept apart to avoid tarball-name
   collisions — see below).
2. `anchore/sbom-action` writes a CycloneDX SBOM (`sbom.cyclonedx.json`).
3. `actions/attest-build-provenance` signs a SLSA-style provenance attestation
   over each tarball via OIDC (no long-lived signing key).
4. `npm publish <tarball>` ships the attested bytes: all nine packages
   (`@cronus-ui/tokens`, `@cronus-ui/theme`, `@cronus-ui/ui`, `@cronus-ui/stack`,
   `@cronus-ui/ai-kit`, `cronus-ui`, `create-cronus-app`, `create-cronus-stack`, and
   `cronus-ui-mcp`) to public npm.

The separate per-package artifact directories are intentional: `@cronus-ui/ui`
and `cronus-ui` both pack to `cronus-ui-<version>.tgz`.

When attestation is restored, consumers can verify provenance with:

```sh
gh attestation verify <tarball-or-oci-ref> --owner cronus
```

---

## 2. Target CI quality gates (`ci.yml`)

When hosted CI is restored, every PR and every push to `main` should run these
steps **in order**; any failure (except `audit`) blocks the merge:

1. `typecheck`
2. `lint`
3. `test`
4. `registry:check` — the CLI registry is in sync with source.
5. `tokens:check` — generated tokens match their source of truth.
6. `check:example-sections` — docs TOC metadata is in sync.
7. `build`
8. `package:smoke` with `SMOKE_FULL=1` — validates tarball structure for all
   publishables, packs all publishables, installs the runtime UI tarballs into
   the consumer fixtures (`examples/smoke-next/`, `examples/smoke-vite/`), builds
   them, asserts styled CSS is emitted, and runs the installed CLI/generator/MCP
   bins from tarballs.
9. `bundle:check` with strict budgets.
10. `test:a11y`
11. `test:e2e`
12. `audit` — dependency vulnerability scan. **Currently non-blocking**
   (`continue-on-error: true`). The runtime PostCSS advisory is resolved
   (`overrides: { postcss: ">=8.5.10" }`); the only remaining advisories are
   dev-server bugs in `vite`/`esbuild` pulled transitively by `vitest` —
   never reached by `vitest run` in CI and never shipped to consumers.

> **Make `audit` a hard gate** once the dev-only `vite`/`esbuild` advisories
> clear upstream: remove `continue-on-error: true` from the Audit step in
> `ci.yml`. Track the advisories here and flip the gate in the same PR that
> clears them.

All gate steps invoke **root `package.json` scripts** by name (`bun run <name>`),
so the gate definition lives with the code, not hard-coded in YAML.

---

## 3. Branch protection — `main`

Configure in **Settings → Branches → Branch protection rules** for `main`:

- **Require a pull request before merging.**
  - Require approvals: **at least 1**.
  - **Require review from Code Owners** (activates `.github/CODEOWNERS`).
  - Dismiss stale approvals when new commits are pushed.
- **Require status checks to pass before merging**, and **require branches to be
  up to date**. Required check: the CI **`build`** job
  (typecheck → lint → test → registry:check → tokens:check →
  check:example-sections → build → full package:smoke → bundle:check →
  a11y → e2e). `audit` is intentionally **not** required until the dev-only
  `vite`/`esbuild` advisories clear.
- **Require linear history** (no merge commits → clean, bisectable `main`).
- **Require signed commits** (recommended).
- **Do not allow force pushes**; **do not allow deletions**.
- **Include administrators** (no bypass) — recommended once the org is stable.

> CODEOWNERS only becomes a *merge gate* when "Require review from Code Owners"
> is enabled here. Without it, owners are merely auto-requested.

---

## 4. Tag protection — `v*`

Tags are a privileged release surface. Today the local release script creates and
pushes `v*` tags only in `--publish` mode; if hosted release automation is
restored, tags also become the publish trigger and must be locked down.

Configure in **Settings → Tags → Tag protection rules**:

- Add a protection rule for the pattern **`v*`**. Only repo admins (or a
  designated release team) may create/push/delete `v*` tags. This prevents an
  arbitrary contributor from triggering a publish by pushing a tag.

Combined with the future `release` environment (below), this gives **two
independent gates** before any package is published: who can create the tag, and
who must approve the deployment.

---

## 5. Future `release` environment (manual approval gate)

When hosted release automation is restored, the `publish` job should run in
`environment: name: release`. Configure in
**Settings → Environments → `release`**:

- **Required reviewers:** add the release approver(s) / team. The publish job
  **pauses** after the tag triggers it and runs **nothing** until a required
  reviewer approves the deployment. This is the hard "no publish without
  approval" gate the workflow relies on.
- **Deployment branches and tags:** restrict to **`v*` tags only**
  (Selected branches and tags → add tag rule `v*`). The release job must never
  run from an arbitrary branch.
- **Environment secrets:** store publish secrets here so they are only exposed
  to the approved `release` deployment, never to PR/CI runs:
  - `NPM_TOKEN` — for all nine packages on public npm (the scoped
    `@cronus-ui/*` packages and the unscoped `cronus-ui`, `create-cronus-app`,
    `create-cronus-stack`, and `cronus-ui-mcp` packages). The release workflow
    validates this secret before any package publish step runs.
- **Wait timer (optional):** a short delay gives a window to cancel a bad release.

---

## 6. Operational prerequisites for the owner (one-time)

These are **not** code changes — they are account/settings actions that must
exist for releases to be reproducible **and** approved:

1. **Own the `@cronus-ui` scope on npmjs** (and have publish rights) so the
   scoped `@cronus-ui/*` packages can publish with `access: public`; otherwise
   the scoped publishes are rejected.
2. **Own the unscoped npm names `cronus-ui`, `create-cronus-app`,
   `create-cronus-stack`, and `cronus-ui-mcp`** on npmjs, and add an `NPM_TOKEN`
   as a `release`-environment secret.
3. **Enable** branch protection (§3) and tag protection (§4). Enable the future
   `release` environment with required reviewers (§5) only when hosted release
   automation is restored.
4. **Replace the placeholder owners** in `.github/CODEOWNERS` (`@pedrogbraz`)
   with the real `cronus` org teams/handles once the org exists.
5. **Clear the remaining dev-only `vite`/`esbuild` advisories** (bump `vitest`
   when upstream ships a fix), then make `audit` a blocking gate in `ci.yml` (§2).

Until §1–§2 are done, a local real publish will not succeed end-to-end. Until
§3–§5 are done, repository governance is advisory rather than enforced by
GitHub settings.
