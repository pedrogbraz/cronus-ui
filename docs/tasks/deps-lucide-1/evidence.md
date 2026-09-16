# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `AuthorTooltip` aceita `icons`, tipo exportado no barrel | atendido | `icons?: Partial<AuthorTooltipIcons>` em `AuthorTooltipProps`; `AuthorTooltipIcons` no `export type` de `packages/ui/src/index.ts`. |
| Teste cobre default e injeção | atendido | Dois casos novos em `author-tooltip.test.tsx`; arquivo com **7 passed**. |
| `full` passa, com `props:check` e `registry:check` em dia | atendido | Os dois falharam após a mudança de API, foram regenerados, e passaram. `contract:check` nunca falhou. |
| Avaliação do bump registrada; `lucide-react` em `^0.577.0` | atendido | Números abaixo. `bun.lock` resolve `"lucide-react@0.577.0"`. |

## Medições do bump, feito e revertido

- `lucide-react` corrente: **1.46.0**. Os PRs pedem 1.41.0.
- Com 1.46.0 instalado: **4204** arquivos de ícone, **zero** com `github` ou
  `linkedin`. Sem export alternativo.
- `bun run typecheck` com 1.46.0: **exit 2, 16 erros, 9 arquivos**.
  Marcas ausentes: `Github` 9, `Linkedin` 3, `Twitter` 1, `Slack` 1, `Figma` 1,
  `Chrome` 1.
- Blocos afetados e seu conteúdo de marca:
  `auth.tsx` (Chrome, Github), `integrations.tsx` (Figma, Github, Slack),
  `marketing.tsx` (Github, Linkedin, Twitter).
- Custo em lockstep nos blocos: **40** linhas `from "lucide-react"` e **28**
  usos em JSX.
- Baselines expostas a troca de glifo: `e2e/visual` 31 darwin + 31 linux;
  `e2e/audit` 177 darwin + 177 linux.
- `ExternalLink` existe em 1.46.0, verificado por `Object.keys` do módulo.

## Limites desta evidência

- **Mudança visível de render não foi medida em pixel.** Os defaults de
  `github` e `linkedin` deixam de ser a marca. Nenhuma suíte visual foi
  executada nesta tarefa para quantificar o efeito em `AuthorTooltip`; o
  `full` cobre build, tipos, testes e drift, não screenshot.
- **Os 16 erros do bump são piso.** `typecheck` cobre só o que está no
  `include` dos `tsconfig`. Scripts e literais de bloco podem esconder mais
  usos que só apareceriam em runtime.
- A afirmação de que módulo compartilhado não serve para os blocos vem da
  leitura do `CONTRACT.md` e de `rewriteImports`, não de uma tentativa.
- Nenhuma medição foi feita sobre o impacto de mover `lucide-react` para
  `peerDependencies`. O argumento das duas cópias é dedução do campo
  `dependencies`, não medição de bundle.
