# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

`AuthorTooltip` passa a receber os glifos por prop:

- `icons?: Partial<AuthorTooltipIcons>` em `AuthorTooltipProps`
- `AuthorTooltipIcons` exportado no barrel
- defaults: `twitter` mantém o `XIcon` já vendorizado; `github` e `linkedin`
  passam a `ExternalLink`
- dois testes novos: default e injeção parcial
- `registry/author-tooltip.json` e `apps/www/lib/props.generated.ts`
  regenerados
- entrada no `CHANGELOG` em `[Unreleased] / Changed`

**`lucide-react` continua em `^0.577.0`.** `ExternalLink` existe nas duas
versões, então a mudança independe do bump.

## O bump foi avaliado e não aplicado

Com `lucide-react@1.46.0`: `typecheck` exit 2, **16 erros, 9 arquivos**, sobre
6 marcas removidas — `Github` (9), `Linkedin` (3), `Twitter`, `Slack`, `Figma`,
`Chrome`. O pacote 1.46.0 traz 4204 ícones e nenhum de marca, sem export
alternativo.

Três dos 9 arquivos são blocos: `apps/www/lib/blocks/{auth,integrations,marketing}.tsx`.
O literal de código deles é o que `cronus-ui add` copia para o projeto de quem
instala — 40 imports de `lucide-react` e 28 usos em JSX, cada um em lockstep
entre preview e literal.

## Decisões

**Separar as três decisões.** Aplicar o bump junto teria misturado versão de
dependência, política de marca em bloco publicado e regeneração de 416
baselines (31+31 `e2e/visual`, 177+177 `e2e/audit`). Falha em qualquer uma
perderia a atribuição, e os gates ficariam vermelhos por motivo esperado —
regenerar baseline por isso é o hábito que torna gate de pixel inútil.

**Default muda o render.** `github` e `linkedin` deixam de mostrar a marca.
Está no `CHANGELOG`, não só no código.

## Correção de duas recomendações minhas

- Recomendei expor prop alegando risco de marca, sem ter visto que o mesmo
  arquivo já vendoriza o glifo do X (`author-tooltip.tsx:51`). O argumento era
  mais fraco do que apresentei.
- Recomendei vendorizar "6 glifos" quando são 40 imports e 28 usos em lockstep,
  mais 416 baselines. Opinei antes de medir, duas vezes.

## Evidências

- `bun run typecheck`: exit 0.
- `bunx vitest run --project ui-dom src/components/author-tooltip.test.tsx`:
  **7 passed**.
- `registry:check`, `props:check` e `contract:check`: OK depois de regenerar.
- `harness check --tier quick`: passed.

## Pendências

- Subir `lucide-react` para 1.x — depende de decidir as marcas dos blocos.
- Mover `lucide-react` de `dependencies` para `peerDependencies` em
  `packages/ui`: hoje quem instala e já usa lucide 1.x leva duas cópias, num
  repositório com budget de bundle gzipado. É quebra para o consumidor.
- Marcas nos blocos: merece ADR.
- Os 3 PRs (#108, #110, #117) seguem abertos.

## Próximo passo

Revisão, `full`, `integrate`.
