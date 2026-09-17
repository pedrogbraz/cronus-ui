# adr-marcas-blocos

Risco: light

## Pedido

Escrever ADR que decide como blocos publicados tratam ícones de marca.

Escopo inicial: `docs/adr/0008-*.md` apenas. Nenhuma mudança de código.

## Análise

A tarefa `deps-lucide-1` mediu o problema e parou nele. `lucide-react` 1.x
removeu os ícones de marca: 4204 ícones no pacote, nenhum `Github` ou
`Linkedin`, sem export alternativo. Enquanto essa decisão não existir, o bump
fica travado.

O que está travado, medido:

- 6 marcas ausentes: `Github` (9 usos), `Linkedin` (3), `Twitter`, `Slack`,
  `Figma`, `Chrome`.
- 3 blocos: `auth` (Chrome, Github), `integrations` (Figma, Github, Slack),
  `marketing` (Github, Linkedin, Twitter).
- 40 linhas `from "lucide-react"` e 28 usos em JSX nesses três arquivos.
- 416 baselines expostas: 31+31 `e2e/visual`, 177+177 `e2e/audit`.

A biblioteca já foi resolvida: `AuthorTooltip` recebe os glifos por
`icons?: Partial<AuthorTooltipIcons>`. Falta o caso dos blocos, que é
diferente por três motivos.

**Um.** Bloco não é componente com API. O literal de código é copiado verbatim
para o projeto de quem instala — `CONTRACT.md` chama de "the exact bytes
`cronus-ui add` writes". Depois do `add`, o código é do consumidor.

**Dois.** Módulo compartilhado não resolve. O literal precisa ser autocontido, e
`rewriteImports` só retarget `../lib/<name>.js` de módulos `registry:lib`. Os
`registry:lib` (`cn`, `demo-store`, `demo-saas`) vivem em `packages/ui/src/lib`
e são **publicados no pacote npm** — transformar glifos de marca em
`registry:lib` os coloca no pacote, que é o que a prop `icons` acabou de
evitar.

**Três.** Prop de ícone em bloco contraria o ADR 0003: a "golden rule" é que
página gerada é só import de blocos empilhados. Bloco que exige configuração
deixa de ser ponto de partida.

Precedentes no repositório, que a ADR precisa reconhecer:

- `author-tooltip.tsx` vendorizava o glifo do X inline. Continua vendorizando —
  virou o default de `icons.twitter`.
- `packages/create-cronus-app/templates/portfolio/components/ui/svgs/` vendoriza
  logos de tecnologia (`docker`, `kubernetes`, `java`, `python`, …) em template
  entregue ao usuário.

Ou seja: o repositório já vendoriza marca em código que vai para o consumidor.
A ADR decide se isso é política ou acidente.

## Plano

1. Escrever `docs/adr/0008-marcas-em-blocos.md` no formato das existentes:
   contexto, decisão, alternativas consideradas, consequências, revisitar
   quando.
2. Cada alternativa com o custo **medido**, não estimado.
3. Status `proposta`, não `aceita` — o decisor é o dono do repositório.
4. `quick`, revisão, `full`, `integrate`.

## Revisão

Alternativa considerada: aceitar a ADR direto, já com a decisão tomada.
Rejeitada — as ADRs existentes nomeiam `pedrogbraz` como decisor, e esta
envolve uso de marca de terceiros em código distribuído. Escrever como
`proposta` mantém a autoria da decisão onde ela pertence.

Alternativa considerada: pular a ADR e aplicar direto a opção que eu
recomendaria. Rejeitada pelo mesmo motivo, e porque `AGENTS.md` diz que
decisões vivem em `docs/adr/` e não se reabrem sem ADR nova. Mudar o que blocos
publicados colocam no projeto de terceiros é exatamente esse tipo de decisão.

Problema encontrado no plano: o passo 2 promete custo medido para "cada
alternativa", mas uma delas — manter `0.577` para sempre — tem custo que não
medi: quanto pesa a duplicação de `lucide-react` no bundle de quem instala. A
ADR precisa declarar isso como não medido em vez de estimar.

## Validação

Premissa "4204 ícones, zero de marca": medida na tarefa `deps-lucide-1`.

Premissa "40 imports e 28 usos JSX": medida por `grep -c` nos três blocos.

Premissa "o literal é copiado verbatim": verificada no `CONTRACT.md`.

Premissa "`registry:lib` é publicado": verificada em `build-registry.ts`,
`LIB_MODULES`, e no fato de `cn` viver em `packages/ui/src/lib`.

Premissa "existe precedente de marca vendorizada": verificada em
`author-tooltip.tsx` e nos SVGs do template `portfolio`.

**Não medido:** o peso da duplicação de `lucide-react` no bundle do consumidor.

## Ajustes

Incorporado: status `proposta` em vez de `aceita`.

Incorporado: declarar explicitamente qual custo não foi medido, em vez de
preencher com estimativa.

## Entrega

Critérios de aceitação:
- A ADR nomeia o custo medido de cada alternativa, nao so a preferida
- A ADR sai como proposta, para o decisor aceitar

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
