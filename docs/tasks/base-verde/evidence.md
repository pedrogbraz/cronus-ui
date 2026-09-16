# Evidências

Branch medida: `task/base-verde`. O commit exato de cada run está no
`summary.json` correspondente; `harness resume base-verde` imprime o caminho
dos registros, que vivem em `.git/dev-harness/runs/` e não são versionados.

## Critérios de aceitação

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `bun run lint` sai 0 na base integrada | atendido | `bunx biome check --reporter=json .` retornou `{"info":12}` — zero `error`, zero `warning`. Em `main` eram 3 erros de `format`. |
| `bun run test` sai 0, sem falha por `localStorage` | atendido | `bunx vitest run`: 265 arquivos, 2366 testes, 0 falhas. Antes: 25 falhas em `code-tabs.test.tsx` (18) e `theme-script.test.tsx` (7). |
| `harness check --tier full` passa no commit integrado | atendido | Run registrado pelo harness na tier `full`, vinculado à tarefa. O harness recusa integrar com `full` ausente, antigo ou de conteúdo diferente, então a integração é ela própria a prova. |
| Nenhum push, publish ou merge no GitHub | atendido | Só houve `git merge` local e `harness integrate`, que altera apenas a branch base local. O PR #121 segue aberto no GitHub. |

## Medições intermediárias que mudaram o diagnóstico

Registradas porque contradizem a análise original do plano.

1. **O drift de formatação não existia na branch do PR #121.** Os três arquivos
   com erro `format` em `main` já estavam corretos em `origin/feat/cronus-audit`.
   O merge zerou o lint sem edição nossa.

2. **21 arquivos de teste falharam logo após o merge por resolução de pacote**
   (`Failed to resolve entry for package "@cronus-ui/ai-kit"`), não por bug. Os
   testes novos que vieram no merge exigem os pacotes construídos. `bun run
   build` antes de `vitest` derrubou os 21 — que é exatamente a ordem do job
   `gates` da CI e a ordem da tier `full`.

3. **A hipótese da origem opaca da jsdom era falsa.** Com
   `environmentOptions.jsdom.url` aplicada, `window.location.href` passou a ser
   `http://localhost:4747/` dentro do teste e as 25 falhas permaneceram. Em
   jsdom pura com `url`, `typeof window.localStorage` é `"object"`. A causa é
   Node 26 definir `localStorage` em `globalThis`: o Vitest não copia a
   propriedade da jsdom quando a chave já existe no global e não está na lista
   interna dele. A mudança de `url` foi revertida.

## Limites desta evidência

- A tier `browser` (axe, contraste por tema, fluxos, regressão visual) **não
  foi executada**. Risco `normal` não a aciona, e ela nunca rodou neste
  repositório. Nada aqui afirma que essas verificações passam.
- `bun run test:audit` não foi executado: depende do binário do `cronus-kernel`,
  que não vive neste repositório.
- `bun run release` e `bun run security:audit` não foram executados, por
  decisão de escopo — o primeiro publica, o segundo depende de rede.
- As baselines visuais de `e2e/audit` cobrem ~17 dos ~172 blocos de teste. A
  metade visual das ondas 1a–1r continua **escrita e não provada**.
- Medido em macOS (`darwin`), com Bun 1.4.2 e Node 26.8.2. A CI fixa Bun 1.3.14
  em Linux. O `full` local não substitui a CI nessa plataforma.
