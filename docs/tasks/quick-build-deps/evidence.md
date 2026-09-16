# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| Diff que seleciona projects sem tocar TypeScript ainda constrói antes de testar | atendido | `classify(["packages/ui/src/components/button.css"])` devolve `projects` não vazio e `typescript` falso; com a nova condição `willTest`, `bun run typecheck` — e portanto `^build` — passa a rodar nesse caso. |
| O self-test cobre o caso e passa | atendido | `node scripts/harness/check.mjs --self-test` imprime `self-test ok` com as duas asserções novas. |

## Limites desta evidência

- O caso é provado por `classify()` e pela condição, não por uma execução real
  de `quick` sobre um diff só de CSS. O run desta tarefa caiu em
  `force_full=true`, porque tocar `scripts/` é regra de `FORCE_FULL`.
- A correção depende de `turbo.json` manter
  `"typecheck": {"dependsOn": ["^build"]}`. Nada aqui verifica mecanicamente
  esse acoplamento; ele está comentado no código.
