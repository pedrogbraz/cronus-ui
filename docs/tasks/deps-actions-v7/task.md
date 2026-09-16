# deps-actions-v7

Risco: light

## Pedido

Atualizar `actions/checkout` e `actions/upload-artifact` de v4 para v7.

Escopo inicial: somente `.github/workflows/ci.yml`.

## Análise

Dois PRs do Dependabot parados desde 2026-07-14: #81 (`actions/checkout` 4→7) e
#80 (`actions/upload-artifact` 4→7). São os dois mais antigos da fila de 20.

Estado verificado:

- `actions/checkout` release mais recente: **v7.0.1**
- `actions/upload-artifact` release mais recente: **v7.0.1**
- `ci.yml` usa `actions/checkout@v4` em 7 lugares e
  `actions/upload-artifact@v4` em 6 lugares — 13 no total.

Os dois PRs estão com `mergeable: UNKNOWN` e as branches são de julho, contra um
trunk que andou mais de 55 commits desde então. Mesclar branch velha aqui é pior
que refazer a mudança: o diff é uma troca de tag em 13 linhas.

O Dependabot fecha o próprio PR quando detecta a dependência já na versão alvo,
então não é preciso fechá-los à mão.

Por que este grupo primeiro: é o de menor risco da fila. Não toca código de
produto, não entra em bundle, e a validação é o próprio run da CI — o mesmo
instrumento que os outros grupos vão precisar.

Risco real da mudança: `upload-artifact` mudou de comportamento entre major
versions no passado — v4 quebrou a concatenação de artefatos de mesmo nome que a
v3 permitia. Uma quebra equivalente na v7 afetaria os passos de bootstrap de
baseline, que publicam `audit-baselines-linux` e
`audit-visual-baselines-linux`. Esses passos só rodam em caminho de bootstrap ou
falha, que um run verde **não exercita**.

## Plano

1. Trocar as 13 ocorrências de `@v4` por `@v7` em `ci.yml`.
2. `quick`, revisão, `full`, `integrate`, push.
3. Confirmar num run de push que os cinco jobs seguem verdes.
4. Registrar em `evidence.md` que os passos de upload condicionais não foram
   exercitados por esse run.

## Revisão

Alternativa considerada: mesclar os PRs #80 e #81 pelo GitHub. Rejeitada — as
branches são de julho, `mergeable` é `UNKNOWN`, e o resultado seria idêntico a
uma troca de tag feita aqui, só que sem passar pelo ciclo do harness e sem
evidência local.

Alternativa considerada: fixar as actions por SHA em vez de tag, como
`docs/RELEASE_GOVERNANCE.md` §1 pede. É a postura correta e está pendente, mas é
mudança de política de segurança da supply chain, não atualização de versão.
Misturar as duas coisas num commit esconderia as duas. Rejeitada e anotada.

Problema encontrado no plano: o passo 3 valida `checkout` nos cinco jobs, mas
valida `upload-artifact` em **nenhum** — todos os usos dele são condicionais
(`if: failure()` ou modo bootstrap). Um run verde não prova que a v7 funciona
ali. O critério de aceitação precisa ser lido com essa limitação, e ela vai para
`evidence.md` em vez de ficar implícita.

## Validação

Premissa "v7 existe nas duas actions": verificada via
`gh api repos/<action>/releases/latest` — `v7.0.1` nas duas.

Premissa "são 13 ocorrências": contei 12 na primeira leitura e estava errado.
Verificado por `grep -c` depois da troca: **7** de `checkout` e **6** de
`upload-artifact`.

Premissa "os PRs estão parados e não mesclam limpo": verificada em
`gh pr list` — #80 e #81 de 2026-07-14, ambos `mergeable: UNKNOWN`.

**Não validado:** que `upload-artifact@v7` preserve o comportamento dos passos
condicionais. Só um run que entre em bootstrap ou em falha exercita isso.

## Ajustes

Incorporado: o registro explícito de que o run verde não cobre
`upload-artifact`, em vez de tratar "cinco jobs verdes" como prova completa.

Escopo mantido fora: fixar actions por SHA, que é o que
`RELEASE_GOVERNANCE.md` §1 pede e continua pendente.

## Entrega

Critérios de aceitação:
- Os cinco jobs continuam verdes num run real
- Nenhum passo de upload ou checkout muda de comportamento observavel

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
