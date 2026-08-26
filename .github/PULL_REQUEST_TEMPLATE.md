## What

<!-- What does this PR change? One PR = one concern. -->

## Why

<!-- The problem it solves. Link the issue if there is one: Fixes #123 -->

## Screenshots

<!-- Required for any visual change (components, blocks, showcase pages):
     before/after, light + dark where relevant. Delete this section for
     non-visual changes. -->

## Checklist

- [ ] `bun run build` + `bun run lint` + `bun run typecheck` + `bun run test` pass locally
- [ ] Drift gates pass: `bun run registry:check`, `bun run tokens:check`, `bun run props:check`, `bun run check:example-sections`
- [ ] `BUNDLE_CHECK_STRICT=1 bun run bundle:check` passes (www changes)
- [ ] Component changes follow [`CONTRACT.md`](https://github.com/pedrogbraz/kronus-ui/blob/main/CONTRACT.md) (semantic tokens only, CVA variants, `data-slot`, a11y)
- [ ] New behavior is covered by tests (vitest / Playwright where it applies)
- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
