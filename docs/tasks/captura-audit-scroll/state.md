# Retomada

Estado: implementado e medido, aguardando revisão e `full`.

## O que foi feito

Não implementei a opção 1 como pedida. A leitura do código mostrou que a captura
não tinha defeito — eu a tinha quebrado na tarefa anterior.

Duas mudanças, desfazendo o efeito colateral e mantendo o requisito real:

1. `app/audit/layout.tsx`: `html{scrollbar-gutter:auto;overflow:hidden}` vira
   `html{scrollbar-gutter:auto;scrollbar-width:none}` mais
   `html::-webkit-scrollbar{display:none}`. A scrollbar deixa de ocupar largura
   sem que a rolagem seja proibida.
2. `audit-split.tsx`: volta a `min-h-screen`, sem `overflow-hidden` no
   contêiner nem `overflow-auto` nos painéis.

E o scoreboard regenerado a partir da execução nova.

## Por que a opção 1 não foi implementada

Rolar a região para dentro da vista não resolve o `scroll-nav`: o canvas tem
1198px e o viewport 900. Nenhuma rolagem faz caber. A opção 1 exigiria recortar
os dois lados numa altura comum menor que a região — trocaria um artefato por
perda silenciosa de cobertura, com a suíte comparando só a parte de cima de um
canvas alto e ainda dizendo "pass".

A causa real era outra: `shoot()` cai em `fullPage` para regiões mais altas que
o viewport, e `fullPage` precisa de um documento que possa crescer. O
`overflow:hidden` que eu declarei fixou o documento na altura do viewport.

## Evidências

- `scroll-nav` e `sheet`: **0 diff pixels**, capturando tamanho cheio —
  `480x1198` e `384x777`, com `react` e `cronus` idênticos no relatório.
- Suíte completa do audit: **784 passed**.
- Scoreboard: de `185 match / 1 diff` (antes da minha regressão) para
  `183 / 3` (com ela) e de volta a **`185 match / 1 diff`**. Sobra o
  `autocomplete/default` em 1836px, que é dívida anterior e real.
- Nas duas plataformas, depois da mudança: `innerWidth` do iframe **1152**,
  calha **0**, documento voltando a crescer, e página do overlay medindo
  **1152**. A correção do breakpoint continua de pé.

## Achado separado: `reveal/default` é instável

Durante a validação, `geometry.spec.ts › reveal/default` falhou 1 de 3 vezes.
Conferi que **não é regressão**: no estado anterior, que ainda tinha
`overflow:hidden`, falhou 1 de 4.

Isso importa porque o `audit` agora é gate de PR e
`playwright.audit.config.ts` declara `retries: 0`. Uma instabilidade de ~25%
vai avermelhar PR sem motivo. Vira pendência.

## Correção do registro

O commit `ccfda113` afirma que `scroll-nav` e `sheet` eram "divergência real
aparecendo" e que o Cronus "casava com o React desktop por acidente". **Está
errado.** Os canvases sempre casaram; o que mudou foi a captura. O commit já
está em `main` e não dá para reescrevê-lo; a correção fica registrada aqui e em
`evidence.md`.

## Próximo passo

Revisão, `full`, `integrate`, push e confirmação na CI.
