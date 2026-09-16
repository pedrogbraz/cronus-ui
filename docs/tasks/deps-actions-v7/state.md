# Retomada

Estado: implementado, aguardando revisão, `full` e confirmação na CI.

## O que foi feito

`.github/workflows/ci.yml`: 13 trocas de `@v4` por `@v7` — 7 em
`actions/checkout`, 6 em `actions/upload-artifact`. Nenhum outro arquivo.

## Decisões

**Não mesclei os PRs #80 e #81.** As branches são de 2026-07-14 contra um trunk
que andou mais de 55 commits, e ambas estão com `mergeable: UNKNOWN`. O
resultado seria idêntico a uma troca de tag, sem passar pelo ciclo do harness.
O Dependabot fecha o próprio PR quando vê a dependência na versão alvo.

**Não fixei as actions por SHA.** É o que `docs/RELEASE_GOVERNANCE.md` §1 pede e
continua pendente, mas é política de supply chain, não atualização de versão.
Num commit só, as duas mudanças se esconderiam.

## Erro corrigido no caminho

O plano dizia "12 ocorrências, 6 de cada". Errado: são **13** — 7 de `checkout`
e 6 de `upload-artifact`. Contei mal na primeira leitura do `grep`. Corrigi o
plano e refiz `task ready` antes de commitar.

## Evidências

- YAML reparseado depois da troca: válido, 13 passos `actions/*`.
- `harness check --tier quick --task deps-actions-v7`: **passed**.
- Nenhuma ocorrência de `actions/checkout@v4` ou `actions/upload-artifact@v4`
  restante.

## Próximo passo

Revisão, `full`, `integrate`, push e run real da CI.
