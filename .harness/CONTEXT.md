# Contexto sob demanda — cronus-ui

Objetivo deste arquivo: gastar contexto no arquivo certo, não no repositório
inteiro. São ~2.100 arquivos versionados e ~330k linhas. Não carregue isso.

`AGENTS.md` é o contrato do repositório e `CONTRACT.md` é o contrato de autoria
de componente. Os dois valem sempre. Este arquivo só diz **o que abrir**.

## O que ler (nesta ordem)

| Tarefa | Ler | Não ler |
|---|---|---|
| Componente novo ou alterado em `packages/ui` | `CONTRACT.md` + um componente vizinho + o teste dele | `registry/`, `apps/www` |
| Token, tema, cor | `packages/tokens/src/` + `docs/adr/0001-cores-literais.md` | os 212 componentes |
| "Por que a cor X não existe" | `packages/tokens` é a fonte; token faltando é bug de token | contornar com paleta |
| Look (`default`/`brutalist`/`glass`) | `docs/adr/0004-looks.md` | forkar componente |
| Página ou rota da doc | `apps/www/app/<rota>` + `apps/www/lib/` | `packages/ui` inteiro |
| CLI `cronus-ui` / registry | `packages/cli/src/` + `packages/cli/scripts/build-registry.ts` | `registry/` (é saída) |
| Scaffold de app | `packages/create-cronus-app/src/` + `docs/adr/0007-*.md` | os templates inteiros |
| Servidor MCP | `packages/mcp/src/` | |
| Paridade React × Cronus | `packages/audit/src/` + `docs/sdd/HANDOFF-WAVE1*-UI.md` da onda | as outras 19 ondas |
| Publicar versão | `RELEASE.md` | `docs/RELEASE_GOVERNANCE.md` (é postura-alvo, não estado) |

`docs/adr/` são decisões fechadas: não reabra sem ADR novo.
`docs/sdd/HANDOFF-*.md` são handoffs de onda e **têm cabeçalho obsoleto**
("Not pushed. Local commits only.") — as ondas a–r já estão na história.
Trate-os como registro de escopo, não como estado.

## Artefatos gerados — nunca edite à mão

| Artefato | Gerador | Portão |
|---|---|---|
| `registry/**` | `packages/cli/scripts/build-registry.ts` | `bun run registry:check` |
| `packages/tokens/styles/*` e `preset/index.d.ts` | `packages/tokens/scripts/build-tokens.ts` | `bun run tokens:check` |
| `apps/www/lib/props.generated.ts` | `apps/www/scripts/build-props.ts` | `bun run props:check` |
| `e2e/a11y/routes.generated.json` | `scripts/build-a11y-routes.mjs` | `bun run a11y:routes:check` |
| `scripts/contract-baseline.json` | `contract-check.mjs --baseline` | dívida só desce |
| `e2e/*/__screenshots__/**.png` | Playwright `--update-snapshots` | nunca invente PNG |

Editar um desses dá diff que o próximo build desfaz. Mexa na fonte e rode o
`:check` correspondente.

## Checks — não invente comando

O harness **nunca** usa shell. Uma tier é um argv, e `scripts/harness/check.mjs`
é quem sabe traduzir tier em comandos:

```
harness check --tier quick --task <id>   # lint + portões e testes do diff
harness check --tier full  --task <id>   # o job `gates` da CI, passo a passo
```

`full` inclui `quick`. Uma tarefa `--risk critical` ganha ainda a tier
`browser` (axe, contraste por tema, fluxos, regressão visual) depois do `full`.

O que isso implica no dia a dia:

- Não rode `bun run <script>` solto para declarar entrega. `quick` é retorno
  parcial; entrega exige `full` **e** revisão da versão atual.
- Playwright serve a saída construída com `next start`. A tier `browser` só
  funciona depois do `full`, que é quem constrói.
- Worktree nova nasce sem `node_modules`. O `check.mjs` roda
  `bun install --frozen-lockfile` sozinho na primeira vez. `--frozen-lockfile`
  é obrigatório: um `bun.lock` reescrito no meio do run muda o fingerprint e o
  harness anula o run inteiro como `invalidated`.
- `bun` é o gerenciador. `npm` e `pnpm` são recusados pelo `package.json`.

Fora das tiers de propósito: `bun run release`, `bun run security:audit` e
`bun run test:audit`. O primeiro publica, o segundo depende de rede, o terceiro
depende do binário do `cronus-kernel`, que não vive neste repositório.

## Worktree

Uma tarefa de escrita = uma worktree (`harness start`). Elas ficam em
`../.worktrees/cronus-ui-801dfb28e0/<id>`, fora do projeto.

Git worktree separa **arquivos**, não portas. `apps/www` usa :4747 e
`apps/pro` :4748 — dois worktrees rodando `dev` ou Playwright ao mesmo tempo
brigam pela mesma porta. Serialize, ou passe `PLAYWRIGHT_PORT` e
`PLAYWRIGHT_PRO_PORT`.

`harness finish --remove-worktree` recusa remover worktree com arquivos
ignorados, e `node_modules` é um deles. Use `finish` sem a flag.

## Evidência

`docs/tasks/<id>/evidence.md` aponta o commit medido e o `summary.json` do run
(`harness resume <id>` mostra o caminho). Não cole log inteiro no chat, e não
atribua um teste antigo a um commit novo.
