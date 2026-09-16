# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

Um único arquivo mudou: `.github/workflows/ci.yml`.

1. `visual` perdeu o `if: github.event_name == 'workflow_dispatch'` e virou gate
   de `pull_request` e `push` para `main`.
2. `visual-baselines-linux` perdeu o bloco `container:` e o `HOME: /root`, e
   ganhou `bunx playwright install --with-deps chromium`.
3. `audit` perdeu o `continue-on-error: true` e manteve o `if`.
4. Os comentários de cabeçalho e de cada job foram reescritos: os antigos diziam
   "Manual-only until Sprint 2" e descreviam gatilhos que deixaram de valer.

## Decisões

**`audit` não foi promovido, contra o pedido original.** O run `35127021335` foi
a primeira execução real do job e `geometry.spec.ts` deu 10 failed / 774 passed
no Linux. As 10 famílias constam como `geometry.status: "pass"` em
`apps/www/lib/audit/scoreboard.json`, no mesmo `kernelRef` `1b465a2`. Mesmo
código, plataforma diferente. Promover hoje pintaria todo PR de vermelho; evitar
isso exigiria manter `continue-on-error`, que é portão que não barra nada.

**O `continue-on-error` saiu mesmo com o job continuando manual.** Execução
manual precisa reportar o próprio vermelho, senão o job mente sobre o estado.

**O container saiu em vez de ganhar `apt-get install unzip`.** A causa imediata
da falha é `unzip` ausente na imagem `noble`, mas consertar só isso entregaria
um job que roda e produz baseline inutilizável: quem compara é o `audit`, em
`ubuntu-latest`. Fixar a pilha gráfica dos dois lados é defensável e merece ADR.

## Evidências

- `harness check --tier quick --task audit-gates-linux`: **passed**.
- YAML reparseado após a edição: `visual` sem `if`, `audit` com `if` e sem
  `continue-on-error`, nenhum job com `container`, e o passo
  `Install Playwright Chromium` presente em `visual-baselines-linux`.

## Pendências

- Commitar `e2e/audit/__screenshots__/linux`. Depende deste workflow estar em
  `main` para o `visual-baselines-linux` corrigido poder ser disparado.
- Investigar a divergência darwin × Linux das 10 famílias. Achado novo; se a
  hipótese de largura de scrollbar se confirmar, o scoreboard de darwin está
  reportando paridade que não existe.

## Próximo passo

Revisão, `full`, `integrate`, push, e confirmar `visual` verde como gate.
