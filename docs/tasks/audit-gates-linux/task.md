# audit-gates-linux

Risco: normal

## Pedido

Promover `visual` a gate de PR, consertar o job `visual-baselines-linux` e
determinar se `audit` pode virar gate.

Escopo inicial: `.github/workflows/ci.yml`. Sem mudança em código de componente,
token ou artefato gerado.

## Análise

Fatos medidos no run `35127021335` (`workflow_dispatch` sobre `main` em
`eacaa523`), o primeiro a executar os três jobs manuais.

1. **`visual` passa.** Rodou em modo `compare` contra os 31 PNGs versionados em
   `e2e/visual/__screenshots__/linux` e saiu **success**. Está pronto para
   virar gate: basta remover o `if` da linha 104.

2. **`visual-baselines-linux` falha em `oven-sh/setup-bun@v2`**, com todos os
   passos seguintes `skipped`. Causa raiz reproduzida localmente com
   `docker run mcr.microsoft.com/playwright:v1.61.0-noble`: a imagem
   (Ubuntu 24.04.4) **não traz `unzip`**, e a action precisa dele para extrair o
   bun. `curl`, `tar`, `node` e `npm` estão presentes.

3. **`audit` falha, e não por baseline.** O passo `Cronus Audit` rodou com
   `--update-snapshots`, então `parity.visual.spec.ts` não podia reprovar. O que
   reprovou foi `geometry.spec.ts`: **10 failed, 774 passed**. As famílias são
   `alert-dialog`, `card`, `confirmation-dialog`, `dialog`, `drawer`,
   `invite-dialog`, `lightbox`, `logo-carousel`, `sheet`, `video-player`.

4. **Essas 10 falhas são exclusivas do Linux.** `apps/www/lib/audit/scoreboard.json`,
   gerado em 2026-09-15 no mesmo `kernelRef` `1b465a2ecbac617561d07f4aaeba79eefb84fc5b`,
   registra `geometry: {pass: 203, fail: 0}`, e as 10 famílias aparecem
   individualmente como `geometry.status: "pass"` e `parity: "match"`. Mesmo
   código, mesmo kernel, plataforma diferente.

5. **A assinatura do delta aponta para largura de scrollbar.** Das 177 linhas de
   diferença agregadas, 153 são `Δ5,0,0,0` (93), `Δ0,0,10,0` (42) e `Δ10,0,0,0`
   (18) — uma diferença de 10px na largura e o deslocamento de 5px que a
   centralização produz. No `alert-dialog`, o overlay do React mede 625px e o do
   Cronus 635px. 7 das 10 famílias são overlay/modal, que travam rolagem.
   **Isto é hipótese, não fato verificado:** scrollbar no macOS é overlay e
   ocupa 0px, no Linux ocupa largura de layout, então uma diferença real de
   travamento de rolagem entre React e Cronus ficaria invisível em darwin e
   visível em Linux. Confirmar exige investigar o fixture, e não é esta tarefa.

6. **Consequência para o scoreboard:** se (5) se confirmar, o scoreboard de
   darwin está reportando paridade que não existe. Isso é achado próprio e
   precisa virar tarefa, não nota de rodapé.

7. **O bootstrap não produziu baselines.** O passo
   `Upload bootstrapped linux audit baselines` tem
   `if: steps.audit.outputs.mode == 'bootstrap'` sem `always()`, então o passo
   anterior falhar o pulou. O único artefato do run é `audit-diff-report`.
   O caminho para gerar as baselines é o `visual-baselines-linux`, que roda só
   `parity.visual.spec.ts` e portanto não é bloqueado pelas falhas de geometria.

## Plano

1. Consertar `visual-baselines-linux` removendo o bloco `container:` e o
   `HOME: /root`, e acrescentando `bunx playwright install --with-deps chromium`,
   como o job `audit` já faz.
2. Remover o `if: github.event_name == 'workflow_dispatch'` do job `visual`.
3. Manter o `if` do job `audit`, e **remover** seu `continue-on-error: true`,
   para que a execução manual reporte o vermelho real em vez de escondê-lo.
4. Reescrever os comentários que hoje dizem "Manual-only until Sprint 2" e
   descrevem gatilhos que deixam de valer. O comentário do `audit` passa a
   nomear o bloqueio real: 10 falhas de geometria exclusivas do Linux.
5. `harness check --tier quick`, revisão, `full`, `integrate`, push.
6. Confirmar num run de push que `visual` roda como gate e fica verde.
7. Disparar `visual-baselines-linux` já corrigido, baixar
   `audit-visual-baselines-linux` e commitar em `e2e/audit/__screenshots__/linux`
   — **em tarefa separada**, porque depende deste workflow já estar em `main`.

## Revisão

O pedido original era promover `visual` **e** `audit` a gates. `audit` não vai.
Promovê-lo hoje tornaria todo PR vermelho por 10 falhas que já existem na base,
e a única forma de evitar isso seria manter `continue-on-error`, que é um gate
que não barra nada. Entregar um portão que não barra seria pior que não
entregar: passaria a afirmar uma garantia inexistente. O bloqueio fica nomeado
no comentário do job e reportado, para decisão explícita.

Alternativa considerada para o fato (2): instalar `unzip` com `apt-get` e manter
o container. É o menor diff e atende ao pedido literal. Rejeitada porque o job
geraria baselines dentro de um container enquanto quem as compara — o job
`audit` — roda em `ubuntu-latest`. Duas pilhas gráficas, antialiasing diferente:
a baseline reprovaria no próprio gate que deveria alimentar. Um job verde
produzindo artefato inutilizável é pior que um job vermelho, porque para de
avisar.

Alternativa considerada: mover `audit` para dentro do mesmo container, fixando a
pilha gráfica dos dois lados. Protege contra a imagem do runner mudar fonte ou
antialiasing e é defensável a longo prazo. Rejeitada aqui por colocar um job
sobre a infraestrutura que está comprovadamente quebrada, e por divergir do job
`visual`, que compara em `ubuntu-latest` e está verde — o repositório já elegeu
`ubuntu-latest` como ambiente de referência de pixel. Se a instabilidade do
runner aparecer, mover os dois é mudança coerente e merece ADR.

Alternativa considerada para o fato (7): acrescentar `always()` ao upload do
bootstrap do `audit`. Resolveria a coleta de baselines sem depender do outro
job. Rejeitada por ser redundante: `visual-baselines-linux` existe exatamente
para isso, roda só o spec visual e vai estar consertado nesta mesma tarefa.

Problema encontrado no plano: o passo 6 prova que `visual` roda como gate, não
que ele detecta regressão. Nada aqui exercita um diff visual de verdade. Vale
registrar como limite, não como cobertura.

## Validação

Premissa "`visual` passa em compare": medida. Job `visual` do run
`35127021335`, conclusão **success**, com 31 PNGs versionados em
`e2e/visual/__screenshots__/linux`.

Premissa "falta `unzip` na imagem": medida localmente, não deduzida do log.
`docker run --rm --user root mcr.microsoft.com/playwright:v1.61.0-noble` com
`command -v` sobre `unzip curl tar node npm` devolveu `unzip MISSING` e os
demais presentes, em `Ubuntu 24.04.4 LTS`.

Premissa "as 10 falhas são de geometria, não de snapshot": medida. O resumo do
passo é `10 failed / 774 passed`, e os 10 títulos vêm de
`e2e/audit/geometry.spec.ts:869:9`.

Premissa "as 10 passam em darwin": medida em `apps/www/lib/audit/scoreboard.json`,
`kernelRef` idêntico, `totals.geometry.fail: 0`, e cada uma das 10 com
`geometry.status: "pass"`.

Premissa "o kernel constrói na CI": medida. `Checkout cronus-kernel at pinned
SHA` e `Build kernel` concluíram `success`; `cronus-kernel` é público e o SHA
existe.

**Não validado, e declarado como hipótese:** que a causa das 10 falhas seja
largura de scrollbar. A assinatura do delta é consistente com isso, mas nenhuma
medição aqui isola a causa.

## Ajustes

Incorporado: `audit` sai do escopo de promoção. O plano original previa
promovê-lo; o fato (3) derrubou isso, e forçar o critério seria fabricar verde.

Incorporado: remover `continue-on-error` mesmo mantendo o job manual, para que o
vermelho conhecido apareça em vez de ser mascarado.

Incorporado: o conserto do `visual-baselines-linux` deixou de ser "instalar
unzip" e passou a ser "alinhar o ambiente ao do gate", depois que o fato (2)
mostrou que o job estava errado por desenho, não só quebrado.

Escopo movido para fora: commitar as baselines linux (depende deste workflow já
estar em `main`) e investigar a divergência darwin × Linux, que é achado novo e
merece tarefa própria.

## Entrega

Critérios de aceitação:
- O job `visual` roda em `pull_request` e `push` para `main`, sem `if` de `workflow_dispatch`, e um run real de push o confirma verde em modo `compare`
- O job `visual-baselines-linux` roda até o fim e publica o artefato `audit-visual-baselines-linux`
- O job `audit` não tem mais `continue-on-error`, e seu comentário nomeia o bloqueio real em vez de "until linux audit baselines are committed"
- Nenhum gate é promovido com falha conhecida mascarada

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
