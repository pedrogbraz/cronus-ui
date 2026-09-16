# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `typecheck` passa em todos os workspaces | atendido | `bun run typecheck` com **exit 0** e 20 de 20 tarefas turbo. Nenhum `error TS`. |
| `full` passa, incluindo testes e portões de drift | atendido | Tier `full` do harness, que roda o job `gates` passo a passo. |

## Medições

- `npm view @types/node dist-tags`: `latest` em `22.20.3`, `ts6.0` em
  `26.6.1`. O alvo vem do tag de TypeScript, não de `latest`.
- `npm view @types/node versions`: as três últimas da linha são `26.5.1`,
  `26.6.0` e `26.6.1`.
- `grep -rn '"@types/node"'`: 8 declarações, todas em `^22.10.0` antes e
  `^26.6.1` depois.
- `bun.lock` depois do `bun install`: uma única entrada resolvida,
  `"@types/node@26.6.1"`.
- `node -v`: `v26.8.2`.

## Limites desta evidência

- **Tipos são apagados na compilação.** `typecheck` verde prova que o código
  compila contra as novas assinaturas; não prova nada sobre comportamento em
  runtime. Quatro majors de distância (22 para 26) podem esconder mudança de
  contrato que só um teste de runtime pegaria.
- Os pacotes que mais fazem IO — `cli`, `mcp`, `create-cronus-app` e
  `create-cronus-stack` — têm testes, e eles rodam no `full`. Mas a cobertura
  deles não foi auditada nesta tarefa.
- `@types/node` é `devDependency` em todos os 8, então não entra no bundle de
  quem instala. A mudança não afeta o peso publicado.
- Medido em macOS, Node `v26.8.2`. A CI roda Linux com Bun 1.3.14.
