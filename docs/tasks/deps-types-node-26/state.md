# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

`@types/node` de `^22.10.0` para `^26.6.1` em 8 `package.json`, mais o
`bun.lock`. `bun.lock` resolve para `@types/node@26.6.1`, versão única.

Nenhuma correção de código foi necessária.

## Decisões

**8 workspaces, não 5.** Os PRs do Dependabot cobrem `apps/www`,
`packages/ai-kit`, `packages/cli`, `packages/mcp` e a raiz. Faltavam
`apps/pro`, `packages/audit`, `packages/create-cronus-app` e
`packages/create-cronus-stack`. Subir só os 5 deixaria duas versões de tipos de
Node no mesmo lockfile.

**26.6.1, não 26.4.1.** `@types/node` não usa `latest` como ponteiro da linha
atual: `latest` está em `22.20.3`. A seleção é por tag de TypeScript, e `ts6.0`
aponta `26.6.1`. O repositório usa TypeScript `^6.0.3`. Copiar o número do
Dependabot teria deixado a versão errada para o TypeScript em uso.

## Evidências

- `bun run typecheck`: **exit 0**, 20 de 20 tarefas turbo.
- `bun.lock`: uma única entrada, `"@types/node@26.6.1"`.
- Os 8 `package.json` com `"@types/node": "^26.6.1"`.
- `harness check --tier quick --task deps-types-node-26`: **passed**.

## Próximo passo

Revisão, `full`, `integrate`, push, confirmação na CI.
