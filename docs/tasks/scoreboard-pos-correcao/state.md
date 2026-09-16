# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

Um arquivo: `apps/www/lib/audit/scoreboard.json`, regerado — não editado.

Execução completa de `playwright.audit.config.ts` em macOS, com o binário do
kernel construído no SHA fixado `1b465a2ecbac617561d07f4aaeba79eefb84fc5b`, em
worktree própria e `CARGO_TARGET_DIR` próprio. Resultado: **784 passed**, os
mesmos 784 que o Linux reportou no run `35137909955`.

Depois, `bun run -F @cronus-ui/audit audit:scoreboard -- --date 2026-09-16`, com
`CRONUS_KERNEL_DIR` apontando para essa worktree.

## Achado

Geometria e lógica não mudaram: `203 pass / 0 fail` e `195 pass / 0 fail`.

Pixel mudou, e isso é achado, não ruído:

| Família | Antes | Agora |
|---|---|---|
| `autocomplete/default` | diff 1836px | diff 1836px |
| `scroll-nav/default` | pass, 0px | **diff, 11520px** |
| `sheet/default` | pass, 0px | **diff, 14216px** |

`parity.match` cai de 185 para 183.

**Não é regressão.** Nenhum componente, token ou CSS mudou entre as duas
medições. `parity.pixel.spec.ts` compara React contra Cronus ao vivo — o
baseline dele fica em `test-results/`, que é efêmero, então não há baseline
velha envolvida. O que mudou é que o Cronus deixou de renderizar o layout mobile
num iframe de 640px e passou a renderizar desktop em 1152px, como o React. Nas
duas famílias, o layout mobile casava com o React desktop por acidente; o
desktop não casa. A divergência sempre existiu e estava mascarada.

Isto é a mesma classe de problema que a investigação anterior descreveu: o
scorederivado de darwin reportava paridade que não existia.

## Decisões

A data foi passada como entrada (`--date 2026-09-16`), que é como o gerador é
determinístico. Reusar a data antiga para encolher o diff falsificaria a
evidência.

Os dois `diff` novos **não** foram investigados nem corrigidos: estão fora do
escopo desta tarefa, que é de dado. Viram pendência.

## Evidências

- `harness check --tier quick --task scoreboard-pos-correcao`: **passed**.
- Execução local: 784 passed, `test-results/audit-geometry` com 203 relatórios e
  `test-results/audit-pixel` com 203.
- `generatedAt: 2026-09-16`, `kernelRef: 1b465a2ecbac617561d07f4aaeba79eefb84fc5b`.

## Pendências

- `scroll-nav` e `sheet`: divergência real de pixel entre React e Cronus,
  11520px e 14216px, agora visível. Merece tarefa própria.
- `autocomplete`: 1836px, dívida anterior, intocada.
- O job `audit` da CI só publica `test-results` quando falha, então o scoreboard
  não pode ser gerado a partir da plataforma do gate. Publicar sempre seria
  melhor fonte para este arquivo.

## Próximo passo

Revisão, `full`, `integrate`.
