# deps-typescript-7

Risco: normal

## Pedido

Avaliar e, se passar, aplicar TypeScript 7.0.2 em todos os workspaces.

Escopo inicial: campo `typescript` dos `package.json` e o `bun.lock`. Correções
de tipo que a major exigir.

## Análise

Nove PRs do Dependabot parados desde 2026-07-14 pedem TypeScript 6.0.3 para
7.0.2: #83, #88, #89, #91, #97, #99, #100, #101 e #104.

Estado verificado:

- `npm view typescript version`: **7.0.2**, que é o tag `latest`.
- O repositório declara `typescript` em **13** workspaces, todos em `^6.0.3`.
  A ocorrência em `packages/stack/package.json:23` é **keyword**, não
  dependência — não conta.
- `AGENTS.md` declara a stack como "TypeScript 6".

Dois sinais de risco, e são o motivo de esta tarefa ser de avaliação antes de
aplicação:

1. **TypeScript 7 é a reescrita nativa.** Não é uma major incremental sobre a
   base em JavaScript; é outra implementação do compilador. Diferenças de
   comportamento não são exceção, são esperadas.
2. **`@types/node` não tem tag `ts7.0`.** Os dist-tags vão até `ts6.0`, que
   aponta `26.6.1` — a versão que a tarefa anterior acabou de aplicar. Não há
   pareamento vetado entre os tipos de Node em uso e o TypeScript 7.

O segundo sinal pesa mais que o primeiro. Subir o compilador para uma major que
o pacote de tipos mais usado do projeto ainda não marcou é aceitar um par não
testado pelo ecossistema.

Valor da mudança: baixo. TypeScript 6 funciona, `typecheck` passa em 20 de 20
tarefas, e nada no repositório pede recurso da 7.

Custo de errar: alto. `typecheck` é portão do `gates` e roda em todo PR. Uma
regressão sutil de inferência aparece como erro em código que não mudou.

## Plano

1. Trocar `^6.0.3` por `^7.0.2` nos 13 `package.json`.
2. `bun install`.
3. `bun run typecheck` isolado. **Este é o passo de decisão.**
4. Se passar: `quick`, revisão, `full`, `integrate`, push, CI.
5. Se quebrar: medir o tamanho da quebra — quantos erros, em quantos pacotes,
   de que categoria — reverter a worktree e **reportar**, sem aplicar.

Corrigir código para acomodar a major só entra em escopo se a quebra for
pequena e mecânica. Reescrita de tipos para caber num compilador novo é outra
tarefa, com outra decisão.

## Revisão

Alternativa considerada: aplicar só nos 9 workspaces dos PRs. Rejeitada pelo
mesmo motivo da tarefa anterior — deixaria duas versões de compilador no mesmo
`bun.lock`, e o compilador é a ferramenta que define o que é erro.

Alternativa considerada: não fazer nada e fechar os 9 PRs. Seria defensável
pelo custo/benefício, mas fechar sem medir é decidir por suposição. Medir é
barato: `typecheck` roda em segundos.

Alternativa considerada: subir para `7.0.1-rc` ou esperar `@types/node` marcar
`ts7.0`. Esperar é razoável e pode ser a conclusão desta tarefa — mas isso é o
resultado da medição, não uma premissa dela.

Problema encontrado no plano: o passo 5 fala em "reverter a worktree", mas o
`bun.lock` também muda. A reversão precisa cobrir `git checkout` dos
`package.json` **e** do `bun.lock`, senão a árvore fica suja e o `harness`
recusa a próxima operação.

## Validação

Premissa "7.0.2 é a `latest`": verificada em `npm view typescript dist-tags` —
`latest: 7.0.2`, `rc: 7.0.1-rc`, `next: 7.1.0-dev.20260916.1`.

Premissa "são 13 workspaces": verificada por `grep -rn '"typescript"'`, com a
ocorrência de `packages/stack` linha 23 identificada como keyword.

Premissa "não há tag `ts7.0` em `@types/node`": verificada — os dist-tags param
em `ts6.0`.

**Não validado, e é o ponto da tarefa:** se `typecheck` passa sob TypeScript 7.

## Ajustes

Incorporado: a tarefa deixou de ser "aplicar" e passou a ser "avaliar e, se
passar, aplicar", depois que a ausência do tag `ts7.0` apareceu. O critério de
aceitação admite explicitamente a saída "não aplicar".

Incorporado: a reversão do `bun.lock` junto com os `package.json`.

## Entrega

Critérios de aceitação:
- typecheck passa em todos os workspaces, ou a tarefa para e reporta a quebra
- Se aplicado, full passa

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
