# lucide-peer-dep

Risco: normal

## Pedido

Mover `lucide-react` de `dependencies` para `peerDependencies` em
`packages/ui`.

Escopo inicial: `packages/ui/package.json`, `devDependencies` para build local,
e o `CHANGELOG`.

## Análise

Pendência levantada em `deps-lucide-1` e que ganhou peso em `deps-lucide-bump`.

Hoje `packages/ui` declara `lucide-react` em `dependencies`. Isso faz a
biblioteca **impor a versão** a quem instala. Duas consequências medidas nas
tarefas anteriores:

**Peso.** Quem instala `@cronus-ui/ui` e já usa `lucide-react` 1.x acaba com
duas cópias em `node_modules` — a 0.577 aninhada sob o pacote e a 1.x na raiz.
Os componentes daqui resolvem a aninhada, o código do consumidor resolve a da
raiz, e as duas entram no bundle final. Num repositório que mantém
`bundle:check` com budget gzipado por entrada, isso é o oposto do que se quer.

**Compatibilidade.** `deps-lucide-bump` mediu que `lucide-react` 1.x não é
RSC-safe: o barril reexporta `LucideProvider` de `context.mjs`, e sob a condição
`react-server` o React não fornece `createContext`. Com a dependência em `peer`,
**a escolha de versão passa a ser do consumidor** — e com ela o problema. Hoje
nós o carregamos por ele.

O repositório já usa o padrão, e em escala: **41 `peerDependencies`**, das quais
**37 estão em `peerDependenciesMeta` como opcionais**. `@dnd-kit`, `@tiptap`,
`recharts`, `three`, `@visx/*` — todos peers opcionais de componentes
específicos. `lucide-react` é exatamente o mesmo caso.

Medição que decide se o peer é obrigatório ou opcional:

- **77** dos ~212 componentes importam `lucide-react`.
- Os componentes core **não** importam: `button`, `badge`, `input`, `card`,
  `label` e `separator` têm zero ocorrências.

Logo: **peer opcional**, como os outros 37. Quem instala só o `Button` não
precisa de `lucide-react`; quem usa um componente com ícone instala.

Fato que reduz o risco: as dependências declaradas em `registry/*.json` são
**parseadas dos imports de cada componente**, não lidas do manifesto.
`registry/button.json` lista só `@radix-ui/react-slot` e
`class-variance-authority` — nenhum lucide. Então quem copia componente pelo
`cronus-ui add` continua recebendo a declaração correta, independentemente desta
mudança. `registry:check` prova isso.

Risco: é **quebra para quem instala pelo npm**. Um consumidor que hoje recebe
`lucide-react` transitivamente passa a precisar instalá-lo. Em `0.x` isso é
aceitável, mas exige entrada no `CHANGELOG` — não pode sair silencioso.

## Plano

1. Remover `lucide-react` de `dependencies`.
2. Acrescentar em `peerDependencies` com faixa larga o bastante para não travar
   o consumidor numa major.
3. Marcar `optional: true` em `peerDependenciesMeta`, como os outros 37.
4. Acrescentar em `devDependencies`, para que build, testes e o site local
   continuem resolvendo.
5. `bun install`, `typecheck`, `lint`.
6. `full` — cobre `package:smoke`, que valida estrutura e fixação de
   dependências dos pacotes publicáveis, e `registry:check`.
7. Entrada no `CHANGELOG` em `[Unreleased] / Changed`, marcada como quebra.
8. Revisão, `integrate`, push, CI.

## Revisão

Alternativa considerada: peer **obrigatório**, sem `optional: true`. Rejeitada
pela medição — 135 dos ~212 componentes não importam ícone, e obrigar todo
consumidor a instalar `lucide-react` para usar um `Badge` contraria o padrão
que o próprio pacote já segue com 37 peers opcionais.

Alternativa considerada: manter em `dependencies` e só alargar a faixa para
`^0.577.0 || ^1.0.0`. Aliviaria a duplicação sem quebrar ninguém. Rejeitada
porque não resolve a compatibilidade: a biblioteca continuaria escolhendo, e
com 1.x escolhida o RSC quebra — para o consumidor, dentro do nosso código.

Alternativa considerada: adiar até `lucide-react` corrigir o RSC. Rejeitada —
as duas razões desta mudança são independentes do bug da 1.x. A duplicação
existe hoje, com 0.577.

Problema encontrado no plano: o passo 2 fala em "faixa larga o bastante", o que
é vago. Concretamente, a faixa precisa admitir a 0.577 que usamos e a 1.x que o
consumidor pode querer — e isso significa declarar compatibilidade com uma
major que **sabemos** quebrar em RSC. A faixa deve incluir as duas, e o
`CHANGELOG` deve dizer que 1.x não é RSC-safe, para o consumidor escolher
informado em vez de descobrir em produção.

## Validação

Premissa "77 de ~212 componentes importam": medida por
`grep -rl 'from "lucide-react"' packages/ui/src`.

Premissa "os core não importam": medida — `button`, `badge`, `input`, `card`,
`label` e `separator` devolvem 0.

Premissa "o padrão de peer opcional já existe": medida no próprio
`package.json` — 41 peers, 37 em `peerDependenciesMeta`.

Premissa "o registry não lê o manifesto": verificada em `registry/button.json`,
que não declara `lucide-react` embora o pacote o tenha em `dependencies`.

Premissa "1.x não é RSC-safe": medida em `deps-lucide-bump` — 54 de 172 testes
`ui-rsc` falhando.

**Não validado ainda:** que `package:smoke` aceite a nova forma. É o passo 6.

## Ajustes

Incorporado: peer **opcional** em vez de obrigatório, depois da contagem dos
componentes core.

Incorporado: a faixa precisa incluir a 1.x, e o `CHANGELOG` precisa avisar que
ela não é RSC-safe. Declarar compatibilidade sem o aviso empurraria para o
consumidor um problema que já medimos.

## Entrega

Critérios de aceitação:
- lucide-react sai de dependencies e entra em peerDependencies
- full passa, incluindo package:smoke e registry:check
- O registry continua declarando lucide-react para quem copia componente

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
