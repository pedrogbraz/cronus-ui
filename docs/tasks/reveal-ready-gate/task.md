# reveal-ready-gate

Risco: light

## Pedido

Eliminar o flake de `geometry.spec.ts › reveal/default` com um gate `READY`.

Escopo inicial: somente a tabela `READY` em `e2e/audit/geometry.spec.ts`.

## Análise

Mensagem exata da falha, capturada em execução real:

```
Error: React did not settle after 20 frames (2 rAF per read)
diff n-2→n-1: reveal#0.y: 24.05 -> 24.03
diff n-1→n: reveal#0.y: 24.03 -> 24.02
```

Não é divergência entre React e Cronus. É o lado React que não estabiliza:
`reveal#0.y` converge assintoticamente em centésimos de pixel.

Mecanismo:

1. `measureSettled` (`geometry.spec.ts:531`) exige **igualdade exata** entre
   duas leituras consecutivas — compara `JSON.stringify(read)` — com orçamento
   de `SETTLE_ATTEMPTS = 20`.
2. `packages/ui/src/components/reveal.tsx` anima com `motion/react`:
   `initial="hidden"`, `animate={inView ? "visible" : "hidden"}`,
   `transition={{ delay }}`.
3. `FREEZE_CSS` zera `animation` e `transition` de CSS. Essa animação roda em
   **JS**, então não é alcançada.
4. A cauda do easing produz deltas de 0,01–0,02px que podem sobreviver às 20
   leituras.

Reprodução: **não falha isolado** — 6 de 6 passaram. Falha na suíte completa de
geometria: 2 de 4 execuções. `playwright.audit.config.ts` declara
`fullyParallel: false` e `workers: 1`, então os testes compartilham navegador e a
carga acumulada desloca o instante em que a medição começa.

O conserto já existe no repositório e só não foi aplicado aqui. `geometry.spec.ts`
tem a tabela `READY` para exatamente isso, hoje com `funnel-chart` e
`slide-up-text` — ambas famílias de animação em JS. `reveal` é omissão.

E o seletor já está escrito e provado para a mesma família em
`parity.pixel.spec.ts:109`:

```
[data-slot="reveal"][style*="opacity: 1"][style*="transform: none"]
```

com o comentário que explica por que funciona: motion escreve `transform: none`
por último. O seletor só casa quando a animação acabou.

Contexto que agrava: o `audit` virou gate de PR na tarefa
`audit-gates-linux`, e `playwright.audit.config.ts` declara `retries: 0`. Um
flake de ~25% a 50% na suíte avermelha PR sem motivo.

Risco: `light`. Uma entrada numa tabela de espera de teste. Nenhum componente,
token ou artefato gerado muda.

## Plano

1. Acrescentar `reveal` à tabela `READY` com o seletor já provado no pixel spec
   e um `reason` que registre a causa medida.
2. Rodar a suíte de geometria repetidas vezes. A taxa observada antes era de 2
   falhas em 4 execuções, então uma sequência limpa de 6 é sinal razoável.
3. Rodar a suíte completa do audit uma vez, para confirmar que nenhuma outra
   família mudou de resultado.
4. `quick`, revisão, `full`, `integrate`, push.

## Revisão

Alternativa considerada: aumentar `SETTLE_ATTEMPTS`. A convergência é
assintótica, então mais quadros só reduzem a probabilidade — não eliminam. E
tornaria a suíte mais lenta para todas as 203 famílias. Rejeitada.

Alternativa considerada: dar tolerância a `measureSettled`, aceitando delta
menor que, digamos, 0,05px como estável. Resolveria a classe inteira, mas muda o
contrato de medição de **todas** as famílias para consertar uma, e passaria a
aceitar como parada legítima qualquer deriva pequena — inclusive deriva real.
Rejeitada por desproporção e por enfraquecer o gate.

Alternativa considerada: `animates: true` em vez de `selector`. O campo existe e
faria `measureSettled` registrar anotação em vez de lançar. Mas isso tolera a
leitura instável e mede um estado intermediário; o `selector` elimina a cauda.
Rejeitada.

Alternativa considerada: dar `retries: 1` ao projeto de audit. Esconderia este
flake e todos os futuros, inclusive instabilidade que indica defeito real.
Rejeitada.

Problema encontrado no plano: uma sequência limpa de execuções **não prova**
ausência de flake, só reduz a chance de ele passar despercebido. O critério de
aceitação precisa ser lido assim, e o limite tem de ficar em `evidence.md`.

## Validação

Premissa "o React é quem não estabiliza": medida na mensagem do erro, que nomeia
`React did not settle` e mostra a série 24.05 → 24.03 → 24.02.

Premissa "é animação em JS, fora do alcance do FREEZE_CSS": verificada em
`reveal.tsx`, que usa `motion/react` com `animate` e `transition`, e em
`audit-freeze.ts`, cujo CSS só zera `animation` e `transition`.

Premissa "o seletor funciona": ele já é usado em produção pelo
`parity.pixel.spec.ts` para esta mesma família, e o pixel spec não é flaky para
`reveal`.

Premissa "não reproduz isolado": medida, 6 de 6 execuções isoladas passaram.

Premissa "reproduz na suíte": medida, 2 falhas em 4 execuções completas.

## Ajustes

Incorporado: o registro de que uma sequência limpa é evidência fraca por
natureza, e de qual era a taxa de falha antes, para que o número tenha
referência.

Escopo mantido fora: as outras 13 famílias que estão em `REACT_MOTION` no pixel
spec e ausentes de `READY` no geometry — `area-chart`, `bar-chart`, `chart`,
`composed-chart`, `gauge-chart`, `line-chart`, `pie-chart`, `profit-loss-chart`,
`radar-chart`, `ring-chart`, `scatter-chart`, `card-stack` e
`morphing-popover`. Nenhuma delas foi observada instável. Acrescentar entradas
sem flake medido seria inventar espera, e cada uma exigiria seu próprio seletor
e sua própria prova.

## Entrega

Critérios de aceitação:
- A suite de geometria passa em execucoes repetidas, sem falha de reveal
- Nenhuma outra familia muda de resultado

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
