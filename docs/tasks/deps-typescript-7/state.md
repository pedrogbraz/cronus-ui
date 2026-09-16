# Retomada

Estado: avaliado. **Não aplicado.** Aguardando revisão e `full`.

## Resultado

TypeScript 7.0.2 **quebra o repositório**. A tarefa previa essa saída e parou
nela: nenhuma mudança de dependência foi commitada.

`bun run typecheck` com `typescript@7.0.2`: **exit 1**, 26 erros.

Todos os 26 num único arquivo, `apps/www/lib/llms.ts`, e todos da mesma
natureza — a API de compilador do TypeScript deixou de existir:

| Código | Ocorrências | Significado |
|---|---|---|
| `TS2339` | 20 | propriedade não existe no módulo |
| `TS2694` | 6 | namespace sem o membro exportado |

Membros ausentes: `createSourceFile`, `isIdentifier`, `isStringLiteral`,
`isPropertyAssignment`, `isObjectLiteralExpression`, `isVariableStatement`,
`isNoSubstitutionTemplateLiteral`, `isTypeReferenceNode`,
`isTemplateExpression`, `isArrayLiteralExpression`.

## O raio é maior que os 26 erros

`typecheck` só cobre o que está no `include` dos `tsconfig`. Quatro arquivos
importam `typescript` como biblioteca:

```
apps/www/lib/llms.ts                     (falhou no typecheck)
apps/www/scripts/build-props.ts          (gera props.generated.ts)
packages/cli/scripts/build-registry.ts   (gera registry/)
packages/cli/src/compose/data-slots.test.ts
```

Os dois geradores alimentam `props:check` e `registry:check`, que são passos do
job `gates`. Eles não aparecem no `typecheck` porque são scripts fora do
`include`, mas quebrariam em **runtime**, com o gate vermelho e a causa a um
nível de distância do erro.

`build-registry.ts` é o que o `CONTRACT.md` descreve como dependente de
`NoSubstitutionTemplateLiteral` — ou seja, análise de AST, exatamente a
superfície que sumiu.

## Decisão

Não aplicar. Não é quebra mecânica: é portar ferramental de AST para outra
implementação de compilador. Isso é projeto próprio, com decisão própria.

Sinal que já estava no plano e se confirmou: `@types/node` não publica tag
`ts7.0`. O ecossistema ainda não pareou os dois.

## Evidências

- `typescript@7.0.2` resolvido no `bun.lock` durante o teste; revertido para
  `typescript@6.0.3` depois.
- `bun run typecheck`: exit 1, 26 erros.
- Árvore limpa após a reversão: `package.json` dos 13 workspaces e `bun.lock`
  voltaram ao estado anterior.

## Recomendação

Deixar os 9 PRs do Dependabot abertos, ou fechá-los com o motivo registrado.
Reabrir quando `@types/node` publicar `ts7.0` **e** houver tarefa para portar os
quatro consumidores da API.

## Próximo passo

Revisão, `full`, `integrate`. O commit desta tarefa é só documentação.
