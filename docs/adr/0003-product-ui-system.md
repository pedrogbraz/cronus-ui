# ADR 0003 — Categoria pública: product UI system

- **Status:** aceita
- **Data:** 2026-08-25
- **Decisor:** pedrogbraz
- **Relacionada:** —

## Contexto

Este repositório joga três jogos ao mesmo tempo: a linguagem visual da Cronus,
um clone de protocolo shadcn, e um gerador de stack. Os três são reais, e
nenhum deles é a categoria pública.

O mercado de 2026 já escolheu os vencedores de duas dessas partidas. shadcn/ui
ganhou o protocolo — registry, MCP, default dos agentes. HeroUI ganhou a lib
bonita. Bibliotecas de blocks competem em volume. Entrar nessa fila com “mais
um botão” é perder no critério que o mercado já fechou.

O que este repo realmente produz, e o que nenhum dos três jogos descreve sozinho,
é o loop que gera um app: compose de blocos validados, tema vivo, contrato de
autoria, upgrade que não apaga edição local. Isso é um sistema de UI de
produto, não um catálogo.

## Decisão

1. **Categoria pública: product UI system.** É isso que homepage, README, CLI,
   AI kit e MCP ensinam. Design system, registry e scaffolder são peças.
2. **Comparáveis oficiais:** shadcn/ui, HeroUI, Aceternity. Não MUI, não
   Chakra — o eixo não é “lib de componentes React”, é “como um produto sai
   do zero e continua editável”.
3. **Aurora** é o tema-bandeira do produto gerado. **Neutral** é o chrome das
   docs. Os dois convivem; não se misturam no discurso.
4. **CTA canônico:** `npx create-cronus-app my-app --template saas`. O default
   da CLI `create-cronus-app` pode permanecer `default` (não-breaking). Marketing
   e docs usam `saas`.
5. **Dual distribution permanece:** npm (`@cronus-ui/ui` + tokens + theme) e
   copy-in (`cronus-ui add` / `compose`). Uma fonte, dois modos de posse.
6. **A golden rule do compose é doutrina de produto**, não detalhe de
   implementação: uma página gerada é só imports de blocks instalados + um
   `<main>` que os empilha. Nenhum JSX de UI além desse wrapper. Todo pixel
   visível vem de um item do registry.
7. **Não competir em contagem de componentes neste trimestre.** Catálogo que
   já existe se mantém; inflar o número não é o objetivo.

## Alternativas consideradas

- **Ser “o shadcn da Cronus”** — descartada. shadcn já ganhou o protocolo.
  Copiar o posicionamento é entrar numa partida encerrada, com a desvantagem
  de ser o segundo.
- **Inflar o catálogo** — descartada. Block libraries já competem em volume.
  Mais um botão não move a categoria que escolhemos.
- **Gerar Vue/Svelte de verdade agora** — descartada. O loop create → compose
  → add-page → theme → upgrade ainda é o trabalho. Multiplicar frameworks
  antes disso dilui o produto.

## Consequências

**Boas:** homepage, docs, CLI, AI kit e MCP passam a ensinar o mesmo loop —
`create` → `compose` → `add-page` → `theme` → `upgrade`. O visitante entende
o que leva embora. Aurora/Neutral deixam de ser “dois temas iguais” no
discurso: um é o produto gerado, o outro é o chrome das docs.

**Ruins:** “quantos componentes vocês têm?” deixa de ser uma pergunta que
respondemos com orgulho. Quem chega procurando um clone de shadcn ou uma
lib tipo MUI vai achar o CTA estranho. Aceitamos.

**Aceitamos:** o default da CLI `create-cronus-app` permanece `default` até um
breaking change deliberado. Docs e marketing não precisam esperar.

## Revisitar quando

O trimestre acabar e a pergunta voltar a ser catálogo; ou quando alguém
propor Vue/Svelte real, um comparável fora de shadcn/HeroUI/Aceternity, ou
trocar o CTA canônico.
