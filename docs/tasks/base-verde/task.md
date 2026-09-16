# base-verde

Risco: normal

## Pedido

Trazer a base local para o trabalho vivo do PR #121 e deixar o portão full verde

Escopo inicial: Merge de origin/feat/cronus-audit na base, mais as correcoes
mecanicas necessarias para lint e testes passarem. Sem mudanca de comportamento
de componente.

## Análise

Fatos verificados em `main` no commit `dec20160`, com `bun install` feito:

1. `main` está 1 commit à frente e **47 atrás** de `origin/feat/cronus-audit`
   (`git rev-list --left-right --count`). O PR #121 está aberto e `MERGEABLE`,
   com 100 arquivos. Todo o trabalho recente do projeto vive nessa branch:
   scoreboard de paridade, fixtures de novas famílias, a migração de rule 10 do
   `CONTRACT.md` para utilitários lógicos, e o pin do `cronus-kernel`. Qualquer
   tarefa nova que saia de `main` nasce em conflito com ela.

2. `bun run lint` sai 1 na base. São 3 erros, todos de categoria `format`, em
   `e2e/audit/logic.spec.ts`, `packages/audit/src/emit-cronus-fixture.test.ts` e
   `packages/audit/src/react-fixture-render.tsx` — arquivos que entraram pelo
   merge do PR #120. Os outros 22 diagnósticos são `warning`/`info` e não
   reprovam. Não há regra desligada nem código a reescrever: é drift de
   formatação.

3. `bun run test` sai 1: 25 testes falham em 2 arquivos
   (`packages/theme/src/theme-script.test.tsx`,
   `packages/ui/src/components/code-tabs.test.tsx`), todos com o mesmo
   `TypeError: Cannot read properties of undefined (reading 'clear')` ao tocar
   `window.localStorage`. Os outros 255 arquivos passam.

4. Causa raiz de (3), confirmada isoladamente: jsdom 29 lança
   `SecurityError: localStorage is not available for opaque origins`. O Vitest
   4 passa `url: "http://localhost:3000"` por padrão e o `window.location.href`
   dentro do teste confirma esse valor, mas `typeof window.localStorage` é
   `"undefined"` mesmo assim — o descritor existe no `window` e o getter lança,
   então a propriedade não sobrevive à cópia para o global. O
   `vitest.config.ts` não declara `environmentOptions` em nenhum dos projects
   jsdom (`ui-dom`, `theme-dom`, `audit-dom`).

5. `bun run typecheck` passa (20/20 tarefas turbo). O problema é só lint e
   ambiente de teste.

6. A CI não pegou nada disso porque `.github/workflows/ci.yml` está em
   `on: workflow_dispatch:` desde `4e417ba3` — nenhum gate roda em push ou PR.

Dependências: nenhuma externa. O merge é local; o `cronus-kernel` só é exigido
por `test:audit`, que está fora das tiers do harness de propósito.

Riscos:

- O merge pode revelar falhas além das duas conhecidas. Se isso acontecer, a
  tarefa para e reporta em vez de crescer de escopo.
- Corrigir (2) e (4) direto em `main`, antes do merge, criaria conflito com o
  PR #121, que toca os mesmos quatro arquivos. Por isso a ordem é merge
  primeiro, correção depois.
- A tier `browser` (axe, contraste, fluxos, visual) ainda não foi exercida
  neste repositório e as baselines visuais de `e2e/audit` estão ~90% ausentes.
  Ela não entra nesta tarefa; risco `normal` não a aciona.

## Plano

1. `harness start base-verde` e trabalhar só na worktree da tarefa.
2. `git merge --no-ff origin/feat/cronus-audit` na branch `task/base-verde`.
   Se houver conflito, resolver apenas conflito textual; qualquer decisão de
   produto vira pendência e a tarefa para.
3. `bun run format` sobre os arquivos com drift, e conferir que o diff atinge
   só os três arquivos do fato (2).
4. Em `vitest.config.ts`, declarar `environmentOptions` com uma `url` de origem
   concreta nos três projects jsdom, com comentário dizendo por que a origem
   opaca não serve. Não mexer nos projects `node`.
5. `harness check --tier quick --task base-verde` como leitura parcial.
6. Commitar em passos revisados: o merge, depois as correções.
7. `harness task review base-verde` e `harness check --tier full --task
   base-verde` no commit final.
8. `harness integrate base-verde` e `harness finish base-verde`.

Arquivos afetados fora do merge: `vitest.config.ts` e os três arquivos de
formatação. Nenhum componente de `packages/ui/src/components` muda de
comportamento.

## Revisão

O plano foi avaliado contra três alternativas.

Corrigir lint e jsdom em `main` sem o merge seria menor, mas conflita com o PR
#121 nos mesmos arquivos e deixa a base 47 commits atrás — resolve o sintoma e
piora a causa. Rejeitado.

Fazer o merge sem corrigir nada seria honesto quanto ao escopo, mas o
`harness integrate` exige um `full` verde, então a tarefa não teria como
terminar. As duas metades são inseparáveis por construção do harness.

Desligar os testes que falham, ou baixar o gate, é o que o `AGENTS.md` proíbe
explicitamente e não seria entrega.

Problema encontrado no próprio plano: o passo 3 usa `bun run format`, que
escreve arquivos. Se rodasse dentro de um check do harness, o run seria
`invalidated` por mudança de conteúdo durante a execução. Ele é um passo de
edição manual, antes do commit, nunca um check — está correto como escrito,
mas merecia a nota.

## Validação

Premissa crítica 1 — "a origem opaca é a causa". Validada fora do Vitest:
`new JSDOM("<p>")` lança `SecurityError: localStorage is not available for
opaque origins` no acesso, e `new JSDOM("<p>", {url:"http://localhost/"})` não
lança. jsdom instalado é 29.1.1, o mesmo que `bun.lock` fixa.

Premissa crítica 2 — "só três arquivos têm drift de formatação". Validada pelo
relatório JSON do Biome: `{"info":12,"warning":10,"error":3}`, e os três erros
são `category: "format"` nos três caminhos citados.

Premissa crítica 3 — "o merge é limpo". O GitHub reporta o PR #121 como
`MERGEABLE`. Isso não é garantia de merge local sem conflito, então o passo 2
trata conflito como caso previsto, não como surpresa.

Premissa crítica 4 — "typecheck já passa". Validada: `bun run typecheck` saiu 0
com 20 tarefas turbo bem-sucedidas.

Decisão necessária que **não** pertence a esta tarefa: se o PR #121 deve ser
fechado no GitHub por push da base integrada, ou merged pela interface. A
tarefa integra só na base local e não faz push.

## Ajustes

Incorporado ao plano após a revisão: a ordem merge-primeiro-correção-depois,
que não estava explícita no escopo inicial e é o que evita o conflito com o PR
#121.

Incorporado: a nota de que `bun run format` é passo de edição, não check, para
que ninguém o promova a entrada de `checks` e transforme todo run em
`invalidated`.

Escopo reduzido deliberadamente: a tier `browser` e as baselines visuais
ausentes de `e2e/audit` ficam fora. São trabalho real, mas outro — registrar
como pendência em `evidence.md` é mais honesto que anexá-las aqui.

## Entrega

Critérios de aceitação:
- bun run lint sai 0 na base integrada
- bun run test sai 0: nenhum arquivo de teste falha por localStorage indisponivel
- harness check --tier full passa no commit exato que sera integrado
- Nenhum push, publish ou merge no GitHub e feito pela tarefa

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
