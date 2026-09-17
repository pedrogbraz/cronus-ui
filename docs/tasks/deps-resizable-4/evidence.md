# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `typecheck`, testes e gates passam, ou a tarefa para e reporta | atendido pela segunda via | `typecheck` exit 2 com 4 erros; `resizable.test.tsx` 6 de 6 falharam. A tarefa parou e reverteu. |
| Nenhuma baseline regenerada sem decisão explícita | atendido | Nenhuma suíte visual foi executada e nenhuma baseline foi tocada. |

## Medições

- Versão corrente: **4.12.4**. Os PRs #107 e #116 pedem 4.12.3.
- Uma declaração (`packages/ui/package.json`, `dependencies`), um consumidor
  (`packages/ui/src/components/resizable.tsx`), um exemplo
  (`apps/www/lib/examples/navigation.tsx`).
- Exports da 4.12.4: `Group`, `Panel`, `Separator`, `isCoarsePointer`,
  `useDefaultLayout`, `useGroupCallbackRef`, `useGroupRef`,
  `usePanelCallbackRef`, `usePanelRef`. `PanelGroup` e `PanelResizeHandle`
  não existem.
- Erros de tipo: `TS2305` em `PanelResizeHandle`, `TS2724` em `PanelGroup`, e
  dois `TS2339` em `ResizableHandleProps` — estes dois são cascata, porque o
  tipo é derivado do import que sumiu. `SeparatorProps` **tem** `className`.
- Atributos emitidos pela 4.12.4: `data-disabled`, `data-group`, `data-panel`,
  `data-separator`, `data-testid`.
- Atributos que `resizable.tsx` consome e que não existem mais:
  `data-panel-group-direction`, `data-resize-handle-state`,
  `data-panel-resize-handle-id`.
- Após reversão: `bun.lock` em `"react-resizable-panels@2.1.9"`, `typecheck`
  exit 0, árvore limpa.

## Limites desta evidência

- **Nenhum gate visual foi executado sob a 4.x.** A medição parou no
  `typecheck` e nos testes unitários, por decisão do plano. O efeito real da
  major sobre geometria, pixel e paridade com o kernel continua desconhecido.
- **Os 4 erros de tipo são piso.** Com os imports corrigidos, outros erros
  podem aparecer — em props de `Group` e `Panel` que ninguém exercitou.
- Não foi verificado se a 4.x escreve `aria-valuenow` por conta própria, o que
  decide o destino de `ensureSplitterValues`.
- Não foi procurado guia de migração oficial da 2.x para a 4.x; a comparação
  saiu dos exports e do bundle, não da documentação do autor.
