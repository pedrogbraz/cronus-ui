# deps-types-node-26

Risco: normal

## Pedido

Subir `@types/node` de 22.10 para 26.x em todos os workspaces.

Escopo inicial: campo `devDependencies.@types/node` dos `package.json` e o
`bun.lock`.

## Análise

Cinco PRs do Dependabot parados desde 2026-08-26 pedem
`@types/node` 22.20.1 para 26.4.1: #106, #109, #111, #112 e #115.

Mas o repositório declara `@types/node` em **8** lugares, não em 5:

```
apps/pro, apps/www, packages/ai-kit, packages/audit, packages/cli,
packages/create-cronus-app, packages/create-cronus-stack, packages/mcp
```

Todos em `^22.10.0`. Subir só os 5 dos PRs deixaria três workspaces para trás e
duas versões de tipos de Node no mesmo `bun.lock`, que é a situação que
`RELEASE.md` chama de drift e que os testes de versão já barram noutros campos.

**A versão alvo não é a que o Dependabot propõe.** `@types/node` não usa o tag
`latest` como ponteiro da linha atual — `latest` está em `22.20.3`. A seleção é
por tag de TypeScript:

```
ts6.0 -> 26.6.1
```

O repositório usa TypeScript `^6.0.3`, então a versão correta é **26.6.1**, não
a 26.4.1 dos PRs. O alvo é o tag `ts6.0`, não o número do Dependabot.

Node local: `v26.8.2`. `engines.node` do repositório: `>=20`. Os tipos 26.x
alinham com o runtime em uso.

Risco: tipos são dev-only, não entram em bundle. Mas uma major de `@types/node`
muda assinaturas — quatro majors de uma vez (22 para 26) podem quebrar
`typecheck` em código que usa APIs de Node. Os pacotes mais expostos são
`cli`, `mcp`, `create-cronus-app` e `create-cronus-stack`, que fazem IO.

## Plano

1. Trocar `^22.10.0` por `^26.6.1` nos 8 `package.json`.
2. `bun install` para atualizar o `bun.lock`.
3. `bun run typecheck` isolado primeiro — é o portão que esta mudança pode
   quebrar, e falha nele é informação, não acidente.
4. `quick`, revisão, `full`, `integrate`, push, confirmação na CI.

Se o `typecheck` quebrar, corrigir o código de chamada, não baixar a versão dos
tipos. Se a quebra for grande, a tarefa para e reporta.

## Revisão

Alternativa considerada: subir só os 5 workspaces dos PRs. Rejeitada — deixa
drift de versão no mesmo lockfile e contraria a regra de lockstep que o
repositório já aplica a `CLI_VERSION`, `SERVER_VERSION` e `server.json`.

Alternativa considerada: usar 26.4.1, o número dos PRs. Rejeitada — 26.6.1 é o
que o tag `ts6.0` aponta, e é esse tag que casa com o TypeScript do
repositório. Seguir o número do Dependabot aqui seria copiar sem verificar.

Alternativa considerada: subir para a linha 25.x, mais perto da atual.
Rejeitada — o runtime local é Node 26 e o tag do TypeScript em uso aponta 26.

Problema encontrado no plano: o passo 3 roda `typecheck` antes do `full`, mas o
`full` roda `typecheck` de novo. A repetição é de propósito — isolar a falha
antes de gastar um `full` inteiro — e não deve ser lida como o portão.

## Validação

Premissa "são 8 lugares, não 5": verificada por `grep -rn '"@types/node"'` nos
`package.json` de raiz, `packages/*` e `apps/*`.

Premissa "`latest` não serve": verificada em `npm view @types/node dist-tags` —
`latest` aponta `22.20.3`, e `ts6.0` aponta `26.6.1`.

Premissa "26.6.1 é a mais recente da linha": verificada em
`npm view @types/node versions` — as três últimas 26.x são 26.5.1, 26.6.0 e
26.6.1.

Premissa "o runtime é Node 26": verificada, `node -v` devolve `v26.8.2`.

**Não validado ainda:** que `typecheck` passe depois da troca. É o passo 3 e é
condição de parada.

## Ajustes

Incorporado: o alvo passou de 26.4.1 para 26.6.1 depois de checar os dist-tags.
O plano original copiava o número do Dependabot.

Incorporado: o escopo passou de 5 para 8 workspaces, pelo mesmo motivo de
lockstep.

Escopo mantido fora: qualquer correção de código que o `typecheck` exija vai no
mesmo commit, porque separar deixaria um commit que não compila.

## Entrega

Critérios de aceitação:
- typecheck passa em todos os workspaces
- full passa, incluindo testes e portoes de drift

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
