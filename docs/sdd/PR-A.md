# PR bodies — Trem A (Cronus Audit)

Not opened on GitHub. Copy when pushing.

## Kernel → `feat/cronus-ui-tokens-button`

**Title:** `feat(cli): Cronus Audit language/logic + exclusive audit-canvas + Badge/Input`

Local commits: `eced46c`, `b0e5851`, `d33ab63`, `5e7e8d7`.

`cronus audit` is now language/logic/visual/all; dump-text HTML is `legacy` (permanent `.html` alias). `--audit-canvas` binds `127.0.0.1` and handles `/audit/*` before `handle_request_inner`, so `page.config.source` is 404. `PORTED_FAMILIES` = button, badge, input with dedicated renderers (interact skipped). Input is `<input data-slot="input">`.

## UI → `feat/cronus-audit`

**Title:** `feat(audit): Cronus Audit harness v1 (button/badge/input)`

Local commits: `4e71d1b` … `39022b2`.

`@cronus-ui/audit` third-line package, `/audit/[slug]` split (React canvas + Cronus iframe to `127.0.0.1:5176`), `playwright.audit.config.ts` (not the shared a11y/e2e/visual config), darwin visual baselines, CI job `audit` timeout 25 min **continue-on-error: true** on this first PR.

`CRONUS_KERNEL_REF=5e7e8d715800c4bdd4bf176570465cc3d6380e26`

Next PR that touches the `audit` job must drop `continue-on-error`.
