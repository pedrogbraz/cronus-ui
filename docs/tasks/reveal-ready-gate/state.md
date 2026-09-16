# Retomada

Estado: implementado e medido, aguardando revisão e `full`.

## O que foi feito

Uma entrada na tabela `READY` de `e2e/audit/geometry.spec.ts`, para a família
`reveal`, com o seletor que `parity.pixel.spec.ts` já usa nesta mesma família:

```
[data-slot="reveal"][style*="opacity: 1"][style*="transform: none"]
```

Nenhuma outra linha mudou.

## Evidências

| | Antes | Depois |
|---|---|---|
| Geometria isolada (`-g reveal`) | 6/6 passaram | — |
| Suíte de geometria completa | **2 falhas em 4** | **6 execuções, 203 passed cada** |
| Suíte completa do audit | — | **784 passed** |

Mensagem que identificou a causa:

```
React did not settle after 20 frames (2 rAF per read)
diff n-2→n-1: reveal#0.y: 24.05 -> 24.03
diff n-1→n: reveal#0.y: 24.03 -> 24.02
```

## Decisões

Usei `selector`, não `animates: true`. O campo `animates` existe e faria
`measureSettled` registrar anotação em vez de lançar — mas isso tolera a leitura
instável e mede um estado intermediário. O `selector` elimina a cauda.

Não acrescentei entradas para as outras 13 famílias que estão em `REACT_MOTION`
no pixel spec e ausentes de `READY` no geometry. Nenhuma foi observada
instável; inventar espera sem flake medido é ruído, e cada uma exigiria seu
próprio seletor e sua própria prova.

## Pendências

- As 13 famílias acima seguem sem gate: `area-chart`, `bar-chart`, `chart`,
  `composed-chart`, `gauge-chart`, `line-chart`, `pie-chart`,
  `profit-loss-chart`, `radar-chart`, `ring-chart`, `scatter-chart`,
  `card-stack`, `morphing-popover`. São flakes latentes possíveis, não
  confirmados.
- `playwright.audit.config.ts` segue com `retries: 0` no audit. É a escolha
  certa para não esconder instabilidade, mas significa que qualquer flake futuro
  avermelha PR direto.

## Próximo passo

Revisão, `full`, `integrate`, push.
