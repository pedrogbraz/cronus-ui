# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

Em `quick()`, a condição do `typecheck` passou de `plan.typescript ||
plan.forceFull` para incluir `willTest` — verdadeiro sempre que a tier vai
rodar Vitest. Como `turbo.json` declara `"typecheck": {"dependsOn": ["^build"]}`,
essa é também a etapa que produz o `dist` dos pacotes do workspace.

O `--self-test` ganhou o caso `packages/ui/src/components/button.css`: `projects`
não vazio e `typescript` falso. É a combinação que quebrava.

## Decisões

Não chamamos `bun run build` direto em `quick`. Ele construiria também
`apps/www` e `apps/pro`, dois builds Next que a tier não precisa e que custam
~30s na primeira execução de uma worktree nova. O `typecheck` via turbo constrói
só o que os pacotes exigem.

O acoplamento ao `dependsOn` do `turbo.json` é implícito e está comentado no
código. É aceitável em `quick`, que é sinal parcial por definição. O `full` não
depende disso: ele chama `bun run build` explicitamente.

## Evidências

- `node scripts/harness/check.mjs --self-test`: ok, com o caso novo.
- `harness check --tier quick --task quick-build-deps`: passed. O log confirma
  `force_full=true` (o diff toca `scripts/`, que é regra de `FORCE_FULL`) e que
  `bun run typecheck` rodou antes de `bun run test`.

## Próximo passo

Revisão, `full`, `integrate` e `finish`.
