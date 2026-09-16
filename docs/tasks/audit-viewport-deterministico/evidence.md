# Evidências

Run de referência: `35135620195` (`workflow_dispatch` sobre
`task/audit-viewport-deterministico`).

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| Viewport do iframe Cronus igual nas duas plataformas | atendido | `window.innerWidth` do iframe medido em Chromium macOS e em Chromium Linux (container `mcr.microsoft.com/playwright:v1.61.0-noble`, servidores no host): **1152 e 1152**. Antes: 640 e 635. |
| `geometry.spec.ts` passa no Linux nas 10 famílias que falhavam | atendido | Passo `Cronus Audit` do job `audit`: **784 passed, 0 failed**. O run anterior `35127021335`, sem a correção, deu 10 failed / 774 passed. |
| `audit` só vira gate com verde medido | atendido | A promoção foi feita **depois** do run verde, no commit seguinte. O `if` de `workflow_dispatch` saiu; `continue-on-error` já não existia. |

## Medições que sustentam o diagnóstico

1. **Causa raiz.** `body` mede 1280px no macOS e 1270px no Linux, com
   `documentElement.clientWidth` 1280 nos dois — o `scrollbar-gutter: stable` de
   `apps/www/app/globals.css:90` custa 10px numa plataforma e 0 na outra. O
   split `md:grid-cols-2` repassa metade disso ao iframe.
2. **Mecanismo.** `matchMedia("(max-width: 639.98px)")` respondia `false` no
   macOS (iframe 640) e `true` no Linux (iframe 635). O `padding-inline`
   computado de `card-header` saía 24px contra 16px.
3. **Largura de painel sozinha não bastava.** Com viewport 2560 e gutter
   neutralizado só na página principal, a divergência caiu de 10/10 para 7/10.
   As 7 restantes são medidas numa página separada
   (`geometry.spec.ts:782`), que reservava a própria calha.
4. **Darwin não foi invalidado.** Kernel construído no SHA fixado `1b465a2`,
   `parity.visual.spec.ts --update-snapshots`: 177 passed, **0 arquivos
   alterados**.
5. **Os dois geradores de baseline convergiram.** `audit-baselines-linux` e
   `audit-visual-baselines-linux` saíram ambos com 621337B.

## Hipóteses falsificadas — não reintroduzir

- **Largura de scrollbar medida em `documentElement.clientWidth`**: dá 0 nas
  duas plataformas, com e sem overflow. A calha aparece na largura do `body`,
  não ali.
- **Divergência de fonte entre os lados**: os dois documentos medem o mesmo
  texto igual (macOS 180.71, Linux 175.06), e forçar outra fonte no macOS move
  React e Cronus **juntos** (376/376, 94.77/94.78).

## Limites desta evidência

- **O `audit` rodou em modo `bootstrap`, não `compare`.** Como
  `e2e/audit/__screenshots__/linux` não existia, `parity.visual.spec.ts` rodou
  com `--update-snapshots` e não podia reprovar. O verde de 784 é de
  `geometry.spec.ts` e `logic.spec.ts`; a metade visual ainda não foi comparada
  contra nada. O primeiro run em modo `compare` é que fecha essa lacuna.
- **As baselines linux são de bootstrap.** Gravam o comportamento atual, não o
  correto. Um defeito visual presente hoje virou referência.
- **Meu probe local não mede as famílias de overlay.** Ele acusa divergência
  também no macOS, onde o teste real passa: coordenada relativa ao canvas não
  serve para overlay `position: fixed`. Nenhuma conclusão sobre overlays veio
  dele — todas vieram da CI.
- `1152` é uma escolha, não um valor derivado. Qualquer largura entre 1025 e a
  do painel serviria; 1152 maximiza a distância das bordas do bucket.
