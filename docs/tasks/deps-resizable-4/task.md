# deps-resizable-4

Risco: normal

## Pedido

Avaliar e, se passar, aplicar `react-resizable-panels` 4.x.

Escopo inicial: `packages/ui/package.json`, `bun.lock` e `resizable.tsx` se a
major exigir.

## Análise

Dois PRs do Dependabot parados desde 2026-08-26 pedem
`react-resizable-panels` 2.1.9 para 4.12.3: #107 e #116. A versão corrente é
**4.12.4**.

Estado verificado:

- Uma única declaração: `packages/ui/package.json`, em `dependencies`.
- Um único consumidor: `packages/ui/src/components/resizable.tsx`, mais o teste
  ao lado.
- A superfície usada são três exports: `Panel`, `PanelGroup` e
  `PanelResizeHandle`.
- Existe fixture de audit: `packages/audit/fixtures/resizable/default.json`.

Este é o grupo mais bem coberto da fila, e o motivo é o inverso do
`lucide-react`. Lá o problema era o alcance — 9 arquivos, blocos publicados,
marca registrada. Aqui o alcance é um arquivo, e o risco é de **comportamento**:
duas majors de distância num componente cujo output é geometria.

É exatamente o caso para o qual os gates foram armados nesta sessão.
`geometry.spec.ts` compara caixa por caixa contra o kernel, `parity.pixel` compara
imagem, e `e2e/visual` compara a galeria. Se a 4.x mudar tamanho de handle,
`flex` do painel ou atributo ARIA, três gates independentes acusam.

`resizable.tsx` já carrega uma adaptação à biblioteca: `ensureSplitterValues`
existe porque "react-resizable-panels paints `role="separator"` immediately but
only writes" os valores depois. Esse tipo de remendo é o primeiro a quebrar numa
major — o comportamento que ele compensa pode ter sido corrigido a montante.

## Plano

1. Trocar `^2.1.9` por `^4.12.4` em `packages/ui/package.json`.
2. `bun install`.
3. `bun run typecheck` — pega mudança de assinatura nos três exports.
4. `bunx vitest run --project ui-dom src/components/resizable.test.tsx` — pega
   mudança de comportamento observável, incluindo os atributos que
   `ensureSplitterValues` remenda.
5. `harness check --tier full`.
6. Suítes de pixel e geometria do audit para a família `resizable`, e o projeto
   `visual`. **Medir, não regenerar.**
7. Decidir com número na mão. Diferença de geometria é resultado, não ruído:
   pode significar que a major mudou o layout, e nesse caso a pergunta é se o
   novo layout é o desejado — não se a baseline deve ser reescrita.

Se o passo 3 ou 4 quebrar de forma não mecânica, a tarefa para e reporta, como
em `deps-typescript-7`.

## Revisão

Alternativa considerada: usar 4.12.3, o número dos PRs. Rejeitada pelo padrão já
estabelecido nesta fila — o alvo é a versão corrente, e copiar o número do
Dependabot sem verificar já levou a alvo errado no grupo do `@types/node`.

Alternativa considerada: pular as suítes visuais e confiar no `full`. Rejeitada.
O `full` roda `gates`, que não inclui `visual` nem `audit`. Um componente de
geometria é precisamente onde o `full` sozinho não vê.

Alternativa considerada: remover `ensureSplitterValues` junto, caso a 4.x
corrija o comportamento. Rejeitada para este commit — é limpeza que depende de
observação, e misturá-la ao bump confunde a atribuição se algo quebrar. Vira
pendência se a medição indicar que o remendo virou inútil.

Problema encontrado no plano: o passo 6 roda as suítes visuais contra baselines
de **darwin** local, enquanto o gate compara **linux** na CI. Verde local não
garante verde na CI. Só o run de push fecha isso, e ele vem depois do
`integrate` — ou seja, a confirmação final é posterior à entrega.

## Validação

Premissa "4.12.4 é a corrente": verificada em
`npm view react-resizable-panels version`.

Premissa "uma declaração, um consumidor": verificada por `grep -rn` nos
`package.json` e por `grep -rl` em `packages/ui/src`.

Premissa "a superfície usada são três exports": verificada nas linhas 5 a 9 de
`resizable.tsx`.

Premissa "há fixture de audit": verificada,
`packages/audit/fixtures/resizable/default.json`.

Premissa "`ensureSplitterValues` compensa comportamento da biblioteca":
verificada no comentário da linha 75 do próprio arquivo.

**Não validado ainda:** se `typecheck`, testes e gates passam sob 4.x. São os
passos 3 a 6.

## Ajustes

Incorporado: o alvo 4.12.4 em vez de 4.12.3.

Incorporado: os passos 6 e 7, separando medir de regenerar. Sem eles, o padrão
seria rodar o `full`, ver verde e entregar — sem tocar nos gates que cobrem
justamente o risco desta major.

Escopo mantido fora: remover `ensureSplitterValues`.

## Entrega

Critérios de aceitação:
- typecheck, testes e os gates de geometria e pixel passam, ou a tarefa para e reporta
- Nenhuma baseline e regenerada sem decisao explicita

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
