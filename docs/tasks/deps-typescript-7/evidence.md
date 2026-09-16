# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `typecheck` passa, ou a tarefa para e reporta a quebra | atendido pela segunda via | `bun run typecheck` com `typescript@7.0.2` saiu **exit 1** com 26 erros. A tarefa parou e reverteu. |
| Se aplicado, `full` passa | não se aplica | Não foi aplicado. |

## Medições

- `npm view typescript dist-tags`: `latest: 7.0.2`, `rc: 7.0.1-rc`,
  `next: 7.1.0-dev.20260916.1`.
- 13 workspaces declaram `typescript`, todos em `^6.0.3`. A ocorrência em
  `packages/stack/package.json:23` é keyword, não dependência.
- `@types/node` não tem tag `ts7.0`; os dist-tags param em `ts6.0`, que aponta
  `26.6.1`.
- Com `typescript@7.0.2`: 26 erros, sendo 20 `TS2339` e 6 `TS2694`, todos em
  `apps/www/lib/llms.ts`.
- Quatro arquivos importam `typescript` como biblioteca:
  `apps/www/lib/llms.ts`, `apps/www/scripts/build-props.ts`,
  `packages/cli/scripts/build-registry.ts` e
  `packages/cli/src/compose/data-slots.test.ts`.
- Após reversão, `bun.lock` resolve `"typescript@6.0.3"` e a árvore fica limpa.

## Limites desta evidência

- **Os 26 erros são piso, não teto.** `typecheck` cobre só o que está no
  `include` dos `tsconfig`. Três dos quatro consumidores da API estão fora dele
  e não foram exercitados sob TypeScript 7 — `build-props.ts` e
  `build-registry.ts` quebrariam em runtime, dentro de `props:check` e
  `registry:check`.
- Nenhum `full` foi executado sob TypeScript 7. A medição parou no `typecheck`,
  por decisão do plano.
- A afirmação de que portar é "projeto próprio" é julgamento sobre esforço, não
  medição. Ninguém tentou a port para dimensioná-la.
- Não foi verificado se existe pacote de compatibilidade que reexponha a API
  antiga sobre TypeScript 7.
