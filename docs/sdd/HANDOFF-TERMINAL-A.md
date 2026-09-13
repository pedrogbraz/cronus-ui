# HANDOFF — Terminal A / Cronus Audit Phase 3

**Date:** 2026-09-13  
**Kernel:** `/Users/pedrogbraz/projects/cooud/cronus-kernel` branch `feat/cronus-ui-tokens-button` @ `5e7e8d715800c4bdd4bf176570465cc3d6380e26`  
**UI:** `/Users/pedrogbraz/projects/cooud/cooud-ui` branch `feat/cronus-audit` @ `39022b29`  
**Not pushed.** Local commits only. PR bodies: `docs/sdd/PR-A.md`.

## Gate (Phase 3)

| Criterion | Result |
|---|---|
| 3 families language+logic+visual | **pass** — button, badge, input |
| ≥2 stubs fail | **pass** — `area-chart` → `CRONUS_AUDIT_STUB_RENDERER` (chart); `meteors` → fx |
| 12/12 cheats | **pass** — 8 source `.cronus` fail `cronus audit language`; cheats 6/7/8/10 are Playwright file+route tests |
| `/audit/button` human review | **pass** — split React \| Cronus iframe on `localhost:4747` |
| Pixel SoT | **pass on darwin** — 17 baselines, `maxDiffPixelRatio: 0.02`, canvas inside iframe. Linux not generated (CI job bootstraps). |
| `cargo test` | **290 passed**, 0 failed |
| bun audit unit | **14 passed** (`vitest --project audit`) |
| Playwright audit | **32 passed** |

## Evidence

```
# kernel
cd /Users/pedrogbraz/projects/cooud/cronus-kernel
cargo test
# test result: ok. 290 passed; 0 failed; 0 ignored

# language cheats 8/8
for f in ../cooud-ui/packages/audit/fixtures/_cheats/*.cronus; do
  ./target/debug/cronus audit language --source "$f"; echo $?
done
# all exit 1

# stubs
cronus audit all --source area-chart.cronus   # CRONUS_AUDIT_STUB_RENDERER chart, exit 1
cronus audit all --source meteors.cronus      # CRONUS_AUDIT_STUB_RENDERER fx, exit 1

# HTTP exclusive path (audit:dev / --audit-canvas)
curl -sD- "http://127.0.0.1:5176/audit/button/primary-md?preset=aurora&mode=light"
# 200
# x-cronus-engine: cronus-lang/0.1.0
# x-cronus-audit: 1
# <html lang="en" data-cronus-theme="aurora" data-cronus-mode="light">
# [data-audit-canvas] wrapping <button data-slot="button" …>
# zero <script>

curl -sD- "http://127.0.0.1:5176/api/audit/trigger"   # 404, no X-Cronus-Audit
curl -sD- "http://127.0.0.1:5176/.cronus/version"     # 404
curl -s "http://127.0.0.1:5176/audit/input/empty"
# <input data-slot="input" type="text" placeholder="Your name" />
# NOT <label data-slot="input"><input data-slot="input-control">

# UI
cd /Users/pedrogbraz/projects/cooud/cooud-ui
bunx vitest run --project audit     # 14 passed
bunx playwright test -c playwright.audit.config.ts
# 32 passed (harness 2 + cheats 4 + logic 9 + visual 17)
```

Human browser (`bun run audit:dev` → `http://localhost:4747/audit/button?fixture=primary-md`):

- Split: React left `button "Save profile"` (110×40), Cronus iframe right same label (112×40).
- Toolbar: fixture / preset / mode / dir. Changing preset rewrites iframe `src` (`preset=`).
- Cronus pane is `<iframe sandbox="allow-scripts" src="http://127.0.0.1:5176/audit/...">` — not `/components/button`, not srcdoc, not `@cronus-ui/ui`.
- UX screenshot (not a pixel baseline): `e2e/audit/harness-button.png` (untracked).

## Commits

Kernel `feat/cronus-ui-tokens-button`:

1. `eced46c` feat(cli): Cronus Audit language/logic + exclusive audit-canvas path
2. `b0e5851` feat(cli): logic_parity button variant matrix
3. `d33ab63` feat(ui): dedicated Badge and Input renderers
4. `5e7e8d7` fix(ui): read disabled/invalid from item config colon-pairs

UI `feat/cronus-audit`:

1. `4e71d1b` feat(audit): `@cronus-ui/audit` package + emit use-component
2. `83a0c3a` feat(www): `/audit` split + isolated previews
3. `479e7e5` test(audit): playwright.audit.config + harness-browser + route cheats
4. `f506f10` test(audit): visual+logic 3 families
5. `ec2b97c` chore(tokens): snapshot check
6. `39022b2` ci: job audit (`continue-on-error: true`)

## What I could not verify

- **Push / GitHub PRs.** Did not push. Kernel remote `cronusmaster/cronus-kernel` may be private; the UI CI job clones that SHA and is `continue-on-error: true` until the kernel commits are on the remote.
- **Linux pixel compare.** Only darwin baselines are committed. The `audit` job bootstraps linux on first green CI with snapshots present empty.
- **`gh` PR open.** See `docs/sdd/PR-A.md`.
- **Focus-visible pixel.** Explicitly out of v1 (logic-only: ring exists).
- **Cheat 5** is the kernel `dedicated_module_no_sidecar_assets` source rg, not a `.cronus` file.

## Next (Terminal B)

Worktree kernel **from SHA `5e7e8d7`**, not from `main`. One dedicated family per kernel PR; bump `CRONUS_KERNEL_REF` in the matching UI PR. Do not add stub families to `PORTED_FAMILIES`.
