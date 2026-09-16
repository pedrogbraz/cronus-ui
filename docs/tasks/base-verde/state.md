# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

1. `git merge --no-ff origin/feat/cronus-audit` na branch `task/base-verde`.
   **Zero conflitos.** Traz os 47 commits do PR #121.
2. `vitest.config.ts`: os três projects jsdom (`ui-dom`, `theme-dom`,
   `audit-dom`) passam a compartilhar um `jsdomEnvironment` que declara
   `execArgv: ["--no-experimental-webstorage"]`.

## Decisões

**O drift de formatação não precisou de correção.** Os três arquivos com erro
`format` em `main` já estavam formatados em `origin/feat/cronus-audit`. O merge
resolveu o fato (2) da análise sozinho. `bun run lint` passou a sair 0 sem
nenhuma edição nossa.

**A hipótese da origem opaca estava errada e foi descartada com medição.** A
análise apostava em `environmentOptions.jsdom.url`, porque jsdom 29 recusa
`localStorage` em origem opaca. Aplicada, a `url` passou a valer dentro do
teste (`window.location.href === "http://localhost:4747/"`) e os 25 testes
continuaram falhando. Uma sonda na jsdom pura mostrou que, com `url`, ela expõe
`localStorage` normalmente — logo a jsdom nunca foi o problema.

A causa real é outra: Node 26 define `localStorage` e `sessionStorage` em
`globalThis`, inertes sem `--localstorage-file`. O `getWindowKeys` do Vitest
pula qualquer chave que já exista no global a menos que esteja na lista interna
dele, e nenhuma das duas chaves de storage está nessa lista. A implementação
funcional da jsdom perdia para a inerte do Node. Desligar os globais do Node
devolve os nomes à jsdom.

A mudança de `url` foi revertida: não era a correção, e um diff que carrega
código que não resolve nada mente sobre a causa.

## Evidências

- `harness check --tier quick --task base-verde`: **passed**.
- `bunx vitest run`: 265 arquivos, 2366 testes, **0 falhas**. Antes da correção
  eram 25 falhas em 2 arquivos.
- `bunx biome check .`: 0 erros (12 `info`, nenhum `warning` bloqueante).

## Pendências (fora do escopo desta tarefa)

- A tier `browser` nunca foi exercida neste repositório.
- As baselines visuais de `e2e/audit` cobrem ~17 de ~172 blocos de teste.
- `.github/workflows/ci.yml` continua em `on: workflow_dispatch:`, então nenhum
  gate roda em push ou PR.
- O job `audit` da CI ainda tem `continue-on-error: true`, contra a instrução
  registrada em `docs/sdd/PR-A.md`.
- `docs/sdd/` não tem índice e os 20 handoffs carregam cabeçalho obsoleto.

## Próximo passo

`harness task review base-verde`, depois `harness check --tier full
--task base-verde`, depois `integrate` e `finish` no checkout principal.
