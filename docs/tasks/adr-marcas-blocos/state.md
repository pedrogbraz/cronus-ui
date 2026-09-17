# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

Um arquivo: `docs/adr/0008-marcas-em-blocos.md`, status **proposta**.

Nenhuma mudança de código.

## A proposta

Dois regimes, pela natureza do que é distribuído:

| Onde | Regime | Motivo |
|---|---|---|
| `packages/ui` | injetável por prop | entra no bundle de quem instala |
| `apps/www/lib/blocks` | SVG inline, duplicado preview e literal | é código copiado, e o logo é o conteúdo |
| docs, exemplos, `apps/pro` | livre | não é distribuído |

A distinção que sustenta os dois primeiros: uso nominativo de logo para
identificar um serviço numa interface é prática corrente; **distribuir um
conjunto de ícones de marcas** é outra coisa, e foi disso que o lucide se
afastou.

## Por que status `proposta` e não `aceita`

As ADRs existentes nomeiam `pedrogbraz` como decisor. Esta envolve uso de marca
de terceiros em código distribuído. A autoria da decisão fica onde pertence.

## Precedentes que a ADR passa a reconhecer

O repositório já vendorizava marca em código entregue ao consumidor, sem ADR:
o glifo do X em `author-tooltip.tsx`, e os logos de tecnologia em
`create-cronus-app/templates/portfolio/components/ui/svgs/`. A ADR decide se
isso é política ou acidente.

## Custos registrados na ADR

Medidos: 40 linhas `from "lucide-react"` e 28 usos em JSX nos três blocos; 416
baselines expostas (31+31 `e2e/visual`, 177+177 `e2e/audit`).

**Não medido, e declarado como tal:** o peso da duplicação de `lucide-react` no
bundle de quem instala. É dedução do campo `dependencies`, não medição.

## Evidências

- `harness check --tier quick --task adr-marcas-blocos`: **passed**.
- Formato conferido contra `docs/adr/0002`: contexto, decisão, alternativas
  consideradas, consequências, revisitar quando.

## Pendências que a ADR destrava, se aceita

- Migrar os três blocos para SVG inline — tarefa própria.
- Regenerar as 416 baselines como passo explícito, com diff revisado.
- Então subir `lucide-react` para 1.x.

## Próximo passo

Revisão, `full`, `integrate`. A ADR fica como proposta até o decisor aceitar.
