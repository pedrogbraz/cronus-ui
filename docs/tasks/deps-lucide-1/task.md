# deps-lucide-1

Risco: normal

## Pedido

Subir `lucide-react` de 0.577 para 1.x nos três workspaces.

Escopo inicial: campo `lucide-react` dos `package.json`, `bun.lock`, e as
baselines visuais se os ícones mudarem de forma.

## Análise

Três PRs do Dependabot parados desde 2026-08-26 pedem `lucide-react`
0.577.0 para 1.41.0: #108, #110 e #117.

Estado verificado:

- `npm view lucide-react version`: **1.46.0**, mais recente que a 1.41.0 dos
  PRs.
- Três declarações, todas em `^0.577.0`: `apps/pro`, `apps/www` e
  `packages/ui`.
- Em `packages/ui` é **`dependencies`**, não `peerDependencies` nem
  `devDependencies`. É pacote publicado, então a versão vai junto para quem
  instala.
- **77 arquivos** de `packages/ui/src` importam de `lucide-react`.

Este grupo é diferente dos anteriores em dois pontos.

**Primeiro: entra no bundle de terceiros.** `AGENTS.md` regra 4 trata
dependência como peso para quem instala. Aqui não é adição, é atualização —
mas a major pode mudar o que é entregue.

**Segundo: pode mudar pixel.** Ícone é geometria desenhada. Uma major de
biblioteca de ícones pode alterar `stroke-width`, `viewBox`, contorno ou o
conjunto exportado. Os gates `visual` (31 baselines) e `audit`
(177 baselines) existem exatamente para isso, e é a primeira vez que eles
cobrem uma major de runtime desde que viraram gate.

Risco de a major não ser cosmética: `lucide-react` 1.x é a primeira major da
biblioteca. Mudança de nome de ícone ou de caminho de export quebraria
`typecheck` ou build nos 77 arquivos.

## Plano

1. Trocar `^0.577.0` por `^1.46.0` nos três `package.json`.
2. `bun install`.
3. `bun run typecheck` isolado — pega remoção ou renome de export.
4. `harness check --tier full` — cobre build, testes e portões de drift.
5. Rodar as suítes visuais localmente: `parity.visual.spec.ts` do audit e o
   projeto `visual`. **Medir, não regenerar.**
6. Decidir com o número na mão:
   - zero diff: entregar sem tocar baseline;
   - diff: reportar quantas famílias e quanto, e tratar regeneração como
     decisão explícita, não como consequência automática.
7. Revisão, `integrate`, push, CI.

## Revisão

Alternativa considerada: usar 1.41.0, o número dos PRs. Rejeitada pelo mesmo
motivo do grupo 2 — o alvo é a versão corrente da linha, e copiar o número do
Dependabot sem verificar já se mostrou errado uma vez nesta fila.

Alternativa considerada: regenerar as baselines junto com o bump, num commit
só. Rejeitada. Baseline regenerada no mesmo commit da causa apaga a evidência
do impacto: o diff mostra PNG novo e ninguém sabe se a mudança era esperada.
Medir primeiro, decidir depois.

Alternativa considerada: mover `lucide-react` para `peerDependencies` em
`packages/ui`, para o consumidor escolher a versão. É defensável para
biblioteca publicada e reduziria o peso, mas é mudança de contrato de
empacotamento, não atualização de versão. Rejeitada aqui, anotada.

Problema encontrado no plano: o passo 5 roda o gate `visual`, que compara
contra baselines de **darwin** localmente e de **linux** na CI. Um diff local
não prova diff na CI, nem o contrário. O passo 7 é que fecha isso.

## Validação

Premissa "1.46.0 é a corrente": verificada em `npm view lucide-react version`.

Premissa "são três declarações": verificada por `grep -rn '"lucide-react"'` nos
`package.json` de raiz, `packages/*` e `apps/*`.

Premissa "é `dependencies` em `packages/ui`": verificada lendo o
`package.json` do pacote — está em `dependencies`, não em peer nem dev.

Premissa "77 arquivos importam": verificada por
`grep -rl 'from "lucide-react"' packages/ui/src`.

**Não validado ainda:** se `typecheck` passa, se o build passa, e se algum
pixel muda. São os passos 3, 4 e 5.

## Ajustes

Incorporado: alvo 1.46.0 em vez de 1.41.0.

Incorporado: a separação entre medir impacto visual e regenerar baseline. O
escopo inicial dizia "as baselines visuais se os ícones mudarem de forma", o
que trata regeneração como automática; passa a ser decisão com número na mão.

Escopo mantido fora: mover a dependência para `peerDependencies`.

## Entrega

Critérios de aceitação:
- full passa
- O impacto visual e medido com os gates visual e audit antes de qualquer regeneracao de baseline

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
