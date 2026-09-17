# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| Nenhum arquivo-fonte importa marca de `lucide-react` | atendido | Varredura por regex de `import { … } from "lucide-react"` em todo `.tsx`, descartando `node_modules`, `.next/` e `dist/`: **0 arquivos**. |
| `typecheck`, `full`, `visual` e `audit` passam sem regenerar baseline | atendido | `typecheck` exit 0; `visual` 25 passed; `audit` 784 passed; `git status --porcelain e2e/` devolve **0**. |
| O bump é aplicado, ou a tarefa para e reporta o bloqueio com número | atendido pela segunda via | 54 de 172 testes `ui-rsc` falhando com 1.47.0. Revertido. |

## Medição do bloqueio

- `lucide-react@^1.46.0` resolve **1.47.0** no `bun.lock` — comportamento
  normal de semver, mas vale registrar que o número instalado não é o do
  `package.json`.
- `ui-rsc` com 1.47.0: **54 de 172 falhando**, todos
  `react.createContext is not a function`.
- `dist/esm/context.mjs` existe na 1.x e é reexportado pelo barril:
  `export { LucideProvider, useLucideContext } from './context.mjs'`.
- `package.json` da 1.47.0 **não tem campo `exports`** — sem condição
  `react-server`, sem subpath oficial.
- Depois de reverter para `^0.577.0`: `ui-rsc` **172 passed**.

## Erros meus no caminho, corrigidos

1. Calculei os caminhos relativos do módulo de glifos a partir de `apps/www` em
   vez de `apps/www/components`. Cinco imports quebraram; `typecheck` pegou.
2. Usei `awk` com faixa `/^import \{/,/from "lucide-react";/`, que captura
   imports não relacionados no meio. Deu 7 falsos positivos. Refiz com regex de
   AST sobre o bloco de import.

## Limites desta evidência

- **A prova de pixel é de macOS.** O gate compara `linux` na CI.
- **`ui-rsc` prova RSC sob o harness do Vitest**, com a condição de export
  `react-server` simulada. Não é um build Next.js real em produção; a falha é
  fortemente indicativa, não uma execução de servidor de verdade.
- **Não foi testado importar ícones da 1.x por caminho profundo**
  (`lucide-react/dist/esm/icons/...`), que poderia evitar o barril. Sem campo
  `exports`, isso seria acoplamento a estrutura interna do pacote — descartado
  sem medir.
- Não foi verificado se a 1.x declara `"use client"` em algum arquivo, o que
  mudaria a natureza do problema de incompatibilidade para fronteira de cliente.
