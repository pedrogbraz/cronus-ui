# quick-build-deps

Risco: light

## Pedido

Garantir que a tier quick construa as dependencias antes de rodar Vitest

Escopo inicial: Somente scripts/harness/check.mjs e seu self-test

## Análise

Descoberto durante a tarefa `base-verde`: 21 arquivos de teste falham com
`Failed to resolve entry for package "@cronus-ui/ai-kit"` quando o Vitest roda
sem os pacotes do workspace construídos. Não é bug de teste — o job `gates` da
CI roda `bun run build` antes de `bun run test` exatamente por isso, e a tier
`full` reproduz essa ordem.

A tier `quick` não reproduz. Ela roda, nesta ordem: `ensureInstall`, `lint`,
portões de drift, `typecheck` (só se o diff tocou TypeScript) e então o Vitest
escopado.

O build chega até lá por acaso: `turbo.json` declara
`"typecheck": {"dependsOn": ["^build"]}`, então `bun run typecheck` constrói as
dependências de cada pacote. Enquanto o diff tocar `.ts`/`.tsx`, funciona.

O caso que quebra: um diff que seleciona um project Vitest **sem** tocar
TypeScript. `plan.projects` é derivado de prefixo de caminho e `plan.typescript`
de extensão, então são independentes. Editar `packages/ui/src/foo.css` dá
`projects = ["ui", "ui-dom"]` e `typescript = false` — o Vitest roda sem build e
falha por resolução, não por regressão. Um verde que depende de qual extensão o
diff tocou não é sinal, é ruído.

Risco `light`: a mudança é numa condição de um script de verificação, não em
código publicado. Nenhum componente, token ou artefato gerado é afetado.

## Plano

1. Em `quick()`, calcular `willTest` e usar isso, não só `plan.typescript`,
   como condição do `typecheck`.
2. Comentar por que o `typecheck` é também o passo de build, para que ninguém
   o remova por parecer redundante com o `full`.
3. Estender o `--self-test` com o caso do arquivo CSS: `projects` não vazio e
   `typescript` falso.
4. `harness check --tier quick`, revisão, `full`, `integrate`, `finish`.

## Revisão

Alternativa considerada: chamar `bun run build` explicitamente em `quick`. É
mais direto de ler, mas constrói também `apps/www` e `apps/pro` — dois Next
builds que a tier `quick` não precisa, e que na primeira execução de uma
worktree nova custam ~30s antes de qualquer sinal. `typecheck` via turbo
constrói só o que os pacotes exigem.

Alternativa considerada: derivar `plan.typescript` de `plan.projects`. Junta
duas perguntas diferentes num campo só — "o diff mexeu em tipos" e "o diff
mexeu em algo testável" — e o `--self-test` perderia a capacidade de distinguir
as duas. Rejeitado.

Problema encontrado no plano: depender de `dependsOn: ["^build"]` é acoplamento
implícito ao `turbo.json`. Se alguém remover esse `dependsOn`, a tier `quick`
volta a falhar do mesmo jeito e o comentário do passo 2 é a única defesa. Isso
é aceitável para `quick`, que é sinal parcial por definição — mas não seria
para `full`, e o `full` de fato chama `bun run build` explicitamente.

## Validação

A premissa central foi medida na tarefa anterior, não suposta: com os pacotes
não construídos, `bunx vitest run` reportou 24 arquivos com falha, 21 deles com
mensagem de resolução de pacote; depois de `bun run build`, os mesmos 21
passaram e sobraram apenas os 2 arquivos do defeito real de `localStorage`.

A premissa de que `typecheck` constrói foi verificada em `turbo.json`:
`"typecheck": {"dependsOn": ["^build"]}`.

A premissa de que `projects` e `typescript` são independentes é verificável no
próprio `classify()`: um deriva de prefixo de caminho, o outro de extensão. O
novo caso do `--self-test` passa a provar isso mecanicamente.

## Ajustes

Incorporado: o comentário explicando que o `typecheck` também é o passo de
build, porque sem ele a linha parece redundante e é candidata a remoção.

Incorporado: o caso de teste com `.css`, que é a forma mais barata de impedir
que a condição regrida silenciosamente.

## Entrega

Critérios de aceitação:
- Um diff que seleciona projects Vitest sem tocar TypeScript ainda constroi os pacotes antes de testar
- O self-test cobre esse caso e passa

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
