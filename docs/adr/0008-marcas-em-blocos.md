# ADR 0008 — Ícones de marca: injetáveis na biblioteca, inline nos blocos

- **Status:** proposta
- **Data:** 2026-09-17
- **Decisor:** pedrogbraz
- **Relacionada:** ADR 0003 (product UI system)

## Contexto

`lucide-react` 1.x **removeu os ícones de marca**. O pacote traz 4204 ícones e
nenhum `Github` ou `Linkedin`, sem caminho de export alternativo. O motivo
declarado pela biblioteca é marca registrada.

Isso trava o bump — três PRs do Dependabot parados desde 2026-08-26 — e obriga a
decidir algo que o repositório nunca decidiu explicitamente: **quem fornece o
glifo de uma marca de terceiros no código que a gente distribui.**

O que quebra, medido com `lucide-react@1.46.0` instalado:

- `bun run typecheck`: exit 2, **16 erros em 9 arquivos**
- 6 marcas: `Github` (9 usos), `Linkedin` (3), `Twitter`, `Slack`, `Figma`,
  `Chrome`

Os 9 arquivos não são iguais. São três situações com contratos diferentes:

| Onde | Arquivos | O que é distribuído |
|---|---|---|
| `packages/ui` | 1 | pacote npm, entra no bundle do consumidor |
| `apps/www/lib/blocks` | 3 | **código copiado** para o projeto do consumidor |
| `apps/www` docs, exemplos, `apps/pro` | 5 | nada; roda só nos nossos sites |

**A biblioteca já foi resolvida.** `AuthorTooltip` passou a receber os glifos
por `icons?: Partial<AuthorTooltipIcons>`, com defaults neutros. Uma biblioteca
publicada não deve decidir qual marca registrada entra no bundle de quem
instala — é a mesma razão que o lucide deu.

Falta decidir os blocos. E eles são diferentes por três motivos.

**Um. Bloco não tem API.** O literal de código de cada bloco é copiado verbatim
para o projeto de quem instala — o `CONTRACT.md` chama de "the exact bytes
`cronus-ui add` writes". Depois do `add`, o arquivo é do consumidor: ele edita,
troca, remove.

**Dois. Módulo compartilhado não resolve.** O literal precisa ser autocontido, e
`rewriteImports` só retarget `../lib/<name>.js` de módulos `registry:lib`. Os
`registry:lib` vivem em `packages/ui/src/lib` e são **publicados no pacote npm**
— transformar glifos de marca em `registry:lib` os coloca exatamente onde a prop
`icons` acabou de tirar.

**Três. Prop em bloco contraria o ADR 0003.** A golden rule é que página gerada
é só import de blocos empilhados. Bloco que exige configuração para renderizar
deixa de ser ponto de partida e vira peça de montar.

## Precedente que já existe

O repositório **já vendoriza marca em código que vai para o consumidor**, em dois
lugares, sem ADR:

- `author-tooltip.tsx` carrega o glifo do X inline desde antes desta discussão.
  Continua carregando — virou o default de `icons.twitter`.
- `packages/create-cronus-app/templates/portfolio/components/ui/svgs/` vendoriza
  logos de tecnologia (`docker`, `kubernetes`, `java`, `python`, `golang`, …) em
  template entregue ao usuário.

Esta ADR decide se isso é política ou acidente.

## Decisão proposta

**Dois regimes, pela natureza do que é distribuído.**

**Biblioteca (`packages/ui`): injetável.** Nenhum componente publicado embute
marca de terceiro. Quem quer a marca passa por prop. Já implementado em
`AuthorTooltip`; vale para qualquer componente futuro.

**Blocos (`apps/www/lib/blocks`): SVG inline, duplicado no preview e no
literal.** O bloco é ponto de partida copiado, não dependência. Um bloco
"Integrations" sem logo de Slack e Figma não demonstra integração nenhuma — o
logo é o conteúdo, não decoração.

**Docs, exemplos e `apps/pro`: livre.** Não são distribuídos. Usar marca ou
ícone genérico é escolha de apresentação.

A distinção que sustenta os dois regimes: uso nominativo de logo para
identificar o serviço numa interface é prática corrente; **distribuir um
conjunto de ícones de marcas** é outra coisa, e foi disso que o lucide se
afastou. Bloco copiado está no primeiro caso. Pacote npm com glifos embutidos
se aproxima do segundo.

## Alternativas consideradas

**Ícone genérico em tudo.** Substituir por `ExternalLink`, `Puzzle`, `Globe`.
Custo zero de marca, e é o que a biblioteca já faz. Descartada para blocos: o
bloco `integrations` existe para mostrar integrações, e o de `marketing` mostra
perfis sociais. Sem logo, os dois viram placeholder — a demo deixa de demonstrar.

**Prop de ícone nos blocos.** Consistente com a biblioteca. Descartada por
contrariar o ADR 0003 e por não ter onde morar: o literal é autocontido.

**`registry:lib` de glifos de marca.** Resolveria a duplicação — um módulo,
`import { GithubGlyph } from "../lib/brand-glyphs.js"`, com `rewriteImports`
cuidando do caminho. Descartada porque `registry:lib` é publicado no pacote npm,
o que recria no pacote o problema que a prop `icons` resolveu.

**Ficar em `lucide-react@0.577` indefinidamente.** Não decide nada e funciona
hoje. Descartada por acumular: a biblioteca declara `lucide-react` em
`dependencies`, então quem instala `@cronus-ui/ui` e já usa lucide 1.x leva duas
cópias. **Este custo não foi medido** — é dedução do campo `dependencies`, não
medição de bundle. Medir antes de usar como argumento forte.

## Consequências

**Boas.** O bump do lucide destrava. O pacote npm para de embutir marca. Os
blocos continuam demonstrando o que prometem.

**Ruins.** Duplicação: cada glifo aparece duas vezes por bloco que o usa — uma
no preview, uma no literal — e o `registry:check` exige que as duas fiquem
idênticas. São **40 linhas de import** e **28 usos em JSX** nos três blocos.
`AGENTS.md` já avisa que replace global nessas faixas quebra o parse, porque
crase aninhada fecha a string externa. A migração é manual e por arquivo.

**Ruins.** Trocar glifo muda pixel: **416 baselines** — 31+31 em `e2e/visual`,
177+177 em `e2e/audit`. A regeneração precisa ser passo explícito de outra
tarefa, com o diff revisado, e não efeito colateral do bump. Regenerar baseline
"porque era esperado" é o hábito que torna gate de pixel inútil, e este
repositório já produziu um scoreboard que reportava paridade inexistente por
causa disso.

**Aceitamos.** Duplicação visível e verificada por gate, em vez de abstração
compartilhada que empurraria as marcas para dentro do pacote publicado.

**Não aceitamos.** Marca dentro de `packages/ui` ou de qualquer
`registry:lib`.

## Revisitar quando

- Alguém pedir para publicar um conjunto de ícones de marca como parte da
  biblioteca. Aí esta ADR é o "não" e precisa ser substituída, não contornada.
- O peso da duplicação de `lucide-react` no bundle do consumidor for medido. Se
  for grande, reforça mover `lucide-react` de `dependencies` para
  `peerDependencies` em `packages/ui` — decisão separada, com quebra para o
  consumidor.
- Um terceiro regime aparecer: hoje são três (publicado como pacote, publicado
  como cópia, não publicado). Um quarto exige reabrir a divisão.
