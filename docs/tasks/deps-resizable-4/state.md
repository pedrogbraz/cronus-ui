# Retomada

Estado: avaliado. **Não aplicado.** Aguardando revisão e `full`.

## Resultado

`react-resizable-panels` 4.x **reescreveu a API e o contrato de DOM**. A tarefa
previa essa saída e parou nela: nenhuma mudança de dependência foi commitada.

Com `react-resizable-panels@4.12.4`:

- `bun run typecheck`: **exit 2, 4 erros**
- `resizable.test.tsx`: **6 de 6 falharam**, com
  `Error: Element type is invalid: expected a string ... but got: undefined`

## Os três exports sumiram

| 2.1.9 | 4.12.4 |
|---|---|
| `PanelGroup` | `Group` |
| `Panel` | `Panel` |
| `PanelResizeHandle` | `Separator` |

Exports da 4.12.4: `Group`, `Panel`, `Separator`, `isCoarsePointer`,
`useDefaultLayout`, `useGroupCallbackRef`, `useGroupRef`,
`usePanelCallbackRef`, `usePanelRef`.

## O que torna isto uma reescrita, não um rename

`resizable.tsx` não consome só os componentes. Ele depende de **três atributos
de DOM** que a 4.x não emite mais:

| Atributo usado | Para quê | Existe na 4.x? |
|---|---|---|
| `data-panel-group-direction` | 4 seletores Tailwind que giram a geometria no eixo vertical | não |
| `data-resize-handle-state` | realce durante o arraste (`=drag`) | não |
| `data-panel-resize-handle-id` | `querySelector` do remendo de ARIA | não |

A 4.x emite `data-disabled`, `data-group`, `data-panel`, `data-separator` e
`data-testid`.

Some junto o motivo do remendo: `ensureSplitterValues` existe porque a 2.x
"paints `role="separator"` immediately but only writes `aria-valuenow` after it
measures layout". Com o seletor morto, o remendo não roda — e se a 4.x corrigiu
o comportamento, ele deixa de ser necessário. As duas hipóteses precisam de
medição.

Portar significa: renomear 3 imports, substituir 3 contratos de atributo,
reescrever os seletores Tailwind do handle, decidir o destino do remendo de
ARIA, e só então medir geometria, pixel e visual contra o kernel.

## Decisão

Não aplicar. É porte de camada de integração de um componente, com verificação
de acessibilidade e três gates de pixel depois. Merece tarefa própria.

## Evidências

- `react-resizable-panels@4.12.4` resolvido no `bun.lock` durante o teste;
  revertido para `2.1.9` depois.
- `typecheck` depois da reversão: **exit 0**. Árvore limpa.

## Pendências

- Os 2 PRs (#107, #116) seguem abertos.
- Porte para a 4.x: tarefa própria.
- `ensureSplitterValues` pode ter virado desnecessário mesmo na 2.x — não foi
  verificado.

## Próximo passo

Revisão, `full`, `integrate`. O commit é só documentação.
