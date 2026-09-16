# scoreboard-pos-correcao

Risco: light

## Pedido

Regerar `apps/www/lib/audit/scoreboard.json` a partir de uma execução real
posterior à correção do viewport.

Escopo inicial: somente `apps/www/lib/audit/scoreboard.json`. Nenhuma mudança de
código, workflow ou baseline.

## Análise

O scoreboard versionado tem `generatedAt: 2026-09-15` e foi produzido **antes**
da tarefa `audit-viewport-deterministico`. Ele registra
`totals.geometry: {pass: 203, fail: 0}` — números medidos num ambiente em que o
iframe do Cronus ficava a 0,02px do breakpoint `max-width: 639.98px` do kernel.
No Linux, o mesmo código dava 10 falhas.

Depois da correção, o viewport é 1152px nas duas plataformas e o run
`35137909955` reportou 784 passed, 0 failed em modo `compare`. O scoreboard atual
descreve um mundo que não existe mais: os mesmos totais, medidos por acidente de
plataforma, hoje valem de verdade — mas o arquivo não prova isso, porque a
execução que o gerou é anterior.

Entradas que o gerador consome (`packages/audit/src/scoreboard-cli.ts`):

- `test-results/audit-geometry/*.json` — relatório por fixture, escrito por
  `geometry.spec.ts:43`
- `test-results/audit-pixel/*.json` — escrito por `parity.pixel.spec.ts:47`
- `test-results/audit-report.json` — reporter JSON do Playwright, configurado em
  `playwright.audit.config.ts:68`
- `e2e/audit/logic.spec.ts` — mapeia título de teste para família
- `cronus-kernel.ref` — o SHA fixado
- `$CRONUS_KERNEL_DIR/src/cronus_ui_widgets.rs` — tabela de famílias do kernel

Logo, regerar exige uma execução local completa do audit, não uma edição.

O binário do kernel no SHA fixado `1b465a2ecbac617561d07f4aaeba79eefb84fc5b` já
foi construído para esta tarefa, fora do repositório, em worktree própria com
`CARGO_TARGET_DIR` próprio — o `AGENTS.md` do kernel exige isso para que uma
árvore não execute o binário de outra.

Riscos:

- A execução local é em **macOS**, e o gate roda em **Linux**. Se os dois
  divergirem, o scoreboard volta a descrever só uma plataforma. A correção
  anterior existe justamente para que não divirjam, mas isso precisa ser dito no
  arquivo de evidência, não presumido.
- `scoreboard.json` é lido por `apps/www` e por `scoreboard.test.ts`. Um arquivo
  com schema inválido quebra build e teste — o `full` cobre isso.

## Plano

1. Emitir os fixtures e subir o canvas do kernel com o binário do SHA fixado.
2. Rodar o audit completo (`playwright.audit.config.ts`), gerando
   `test-results/audit-geometry`, `test-results/audit-pixel` e
   `test-results/audit-report.json`.
3. Rodar `bun run -F @cronus-ui/audit audit:scoreboard -- --date <hoje>` com
   `CRONUS_KERNEL_DIR` apontando para a worktree do SHA fixado.
4. Conferir o diff: `generatedAt`, `kernelRef` e totais. Qualquer queda de
   `pass` é achado, não ruído — investigar antes de commitar.
5. `quick`, revisão, `full`, `integrate`.

## Revisão

Alternativa considerada: editar `generatedAt` à mão e manter os totais. É o
caminho rápido e é exatamente o que o arquivo não pode ser — um scoreboard que
afirma medição sem medição é pior que um desatualizado, porque o desatualizado
ao menos tem data honesta. Rejeitada.

Alternativa considerada: gerar a partir de artefatos da CI, que é a plataforma
do gate. Seria melhor evidência, mas o job `audit` só publica `test-results`
quando falha (`if: failure()`), e num run verde não há artefato. Mudar o
workflow para publicar sempre é mexer em portão numa tarefa de dado. Rejeitada
aqui e anotada como possível melhoria.

Problema encontrado no plano: o passo 3 usa `--date <hoje>`, mas o gerador é
determinístico **de propósito** e recebe a data como entrada para não depender
de relógio. Passar a data da execução é correto; passar qualquer outra
falsificaria a evidência. Vale registrar para que ninguém "conserte" o diff
reusando a data antiga.

## Validação

Premissa "o arquivo é anterior à correção": verificada em
`apps/www/lib/audit/scoreboard.json`, `generatedAt: 2026-09-15`, contra os
commits `234cf860` e `812acb31` desta semana.

Premissa "o gerador lê execução real, não a tabela do kernel": verificada no
cabeçalho de `scoreboard-cli.ts`, que lista os três diretórios de
`test-results/` como entrada, e em `scoreboard.ts`, que descreve o arquivo como
"pure merge of the audit outputs".

Premissa "o kernel fixado está disponível": verificada. Binário construído em
worktree detached no SHA `1b465a2ecbac617561d07f4aaeba79eefb84fc5b`,
`cargo build` com 0 erros.

Premissa "os totais atuais valem de verdade agora": sustentada pelo run
`35137909955`, 784 passed em modo `compare` no Linux. A execução local vai dizer
se o macOS concorda.

## Ajustes

Incorporado: a nota de que a data é entrada do gerador e não pode ser reusada
para maquiar o diff.

Incorporado: tratar queda de `pass` no passo 4 como achado a investigar, em vez
de aceitar o novo número por ser o mais recente.

Escopo mantido fora: publicar `test-results` na CI mesmo em run verde, que seria
a fonte ideal para este arquivo. É mudança de workflow e merece tarefa própria.

## Entrega

Critérios de aceitação:
- O scoreboard e gerado por uma execucao completa do audit no kernel fixado 1b465a2, nao editado a mao
- O campo generatedAt reflete a data da execucao e os totais refletem o resultado medido

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
