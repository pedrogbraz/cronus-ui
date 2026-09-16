# deps-lucide-1

Risco: normal

## Pedido

Avaliar `lucide-react` 1.x e, na biblioteca publicada, tornar os ícones de
marca injetáveis.

Escopo inicial: `packages/ui/src/components/author-tooltip.tsx`, o barrel, e o
registro da avaliação do bump. **A atualização de versão não entra.**

## Análise

Três PRs do Dependabot pedem `lucide-react` 0.577.0 para 1.41.0: #108, #110 e
#117. A versão corrente da linha é **1.46.0**.

A avaliação foi feita e produziu o motivo de não aplicar agora.

**lucide 1.x removeu os ícones de marca.** O pacote traz 4204 ícones e nenhum
`Github` ou `Linkedin`, sem caminho de export alternativo. Com o bump aplicado,
`bun run typecheck` deu **exit 2, 16 erros, 9 arquivos**, em 6 marcas:

| Ícone | Ocorrências |
|---|---|
| `Github` | 9 |
| `Linkedin` | 3 |
| `Twitter`, `Slack`, `Figma`, `Chrome` | 1 cada |

Distribuição: 1 arquivo em `packages/ui`, 1 em `apps/pro`, 5 em docs e exemplos
de `apps/www`, e **3 em `apps/www/lib/blocks`** — `auth`, `integrations` e
`marketing`.

Os blocos são o problema. Eles não são documentação: o literal de código de cada
bloco é o que o `cronus-ui add` copia para o projeto de quem instala. Somam
**40 linhas de import de `lucide-react`** e **28 usos em JSX**, cada um exigindo
edição em lockstep entre o preview e o literal — e `AGENTS.md` avisa que replace
global nessas faixas quebra o parse.

Um módulo compartilhado não resolve: o literal precisa ser autocontido, e
`rewriteImports` só retarget `../lib/<name>.js` de módulos `registry:lib`.
Transformar ícones de marca em `registry:lib` significa publicá-los no pacote,
que é o oposto do que se quer decidir.

E trocar glifo muda pixel: 31 baselines `e2e/visual` e 177 `e2e/audit`, vezes
duas plataformas.

## Plano

1. Em `packages/ui/src/components/author-tooltip.tsx`, expor
   `icons?: Partial<AuthorTooltipIcons>` com defaults que preservam o render
   atual onde possível.
2. Exportar o tipo no barrel.
3. Teste do comportamento observável: default e injeção.
4. `props:check` e `registry:check` regenerados, porque a API pública mudou.
5. `quick`, revisão, `full`, `integrate`.
6. Registrar a avaliação do bump em `evidence.md`, com os números, para que a
   próxima tentativa não recomece do zero.

`lucide-react` permanece em `^0.577.0`. `ExternalLink` existe nas duas versões,
então esta mudança não depende do bump.

## Revisão

A recomendação mudou duas vezes durante a tarefa, e as duas vezes por ter
opinado antes de medir. Fica registrado:

- Recomendei expor prop alegando risco de marca registrada, **sem ter visto**
  que o mesmo arquivo já vendoriza um glifo do X (`XIcon`, linha 51). O
  argumento de marca era mais fraco do que apresentei.
- Recomendei vendorizar os seis glifos dizendo "6 glifos", quando são 40
  imports e 28 usos em lockstep, mais a regeneração de 416 baselines.

Alternativa considerada: aplicar o bump e vendorizar as marcas em tudo.
Rejeitada por juntar três decisões independentes num commit — versão de
dependência, política de marca em bloco publicado, e regeneração de baseline.
Falha em qualquer uma perde a atribuição. Pior: os gates `visual` e `audit`
ficariam vermelhos por motivo esperado, e regenerar baseline "porque era
esperado" é o hábito que torna gate de pixel inútil. Foi esse hábito que
produziu o scoreboard que reportava paridade inexistente.

Alternativa considerada: ficar em 0.577 e não fazer nada. Rejeitada — a
biblioteca publica `lucide-react` como `dependencies`, então quem instala
`@cronus-ui/ui` e já usa lucide 1.x leva duas cópias, num repositório que
mantém budget de bundle gzipado por entrada. Tornar os ícones injetáveis é o
primeiro passo que reduz esse acoplamento.

Problema encontrado no plano: o passo 1 diz "defaults que preservam o render
atual onde possível". Para `twitter` preserva — `XIcon` continua. Para `github`
e `linkedin` **não preserva**: o default passa a ser um glifo neutro. É mudança
visível e precisa estar no `CHANGELOG`, não só no código.

## Validação

Premissa "lucide 1.x removeu as marcas": medida. 4204 arquivos de ícone no
pacote 1.46.0, zero com github ou linkedin.

Premissa "16 erros em 9 arquivos": medida com o bump aplicado, depois revertido.

Premissa "os blocos são copiados para o consumidor": verificada no
`CONTRACT.md`, seção de metadados de compose — o literal é "the exact bytes
`cronus-ui add` writes".

Premissa "`ExternalLink` existe nas duas versões": verificada em 1.46.0 por
`Object.keys` do módulo. Em 0.577 é usada por código existente do repositório.

Premissa "`XIcon` já é vendorizado": verificada, `author-tooltip.tsx` linha 51.

## Ajustes

Incorporado: o bump saiu do escopo. A tarefa entrega a mudança de API e o
registro da avaliação.

Incorporado: a nota de que o default de `github` e `linkedin` muda o render, e
precisa de entrada no `CHANGELOG`.

Escopo mantido fora, cada um com motivo:

- **Subir `lucide-react`**: exige decidir as marcas dos blocos primeiro.
- **Mover `lucide-react` para `peerDependencies`**: é o que de fato tira a
  opinião da biblioteca sobre a versão, mas é quebra para o consumidor e merece
  decisão própria.
- **Marcas nos blocos**: merece ADR, porque decide o que um bloco publicado
  coloca no projeto de terceiros.

## Entrega

Critérios de aceitação:
- `AuthorTooltip` aceita `icons` e o tipo é exportado no barrel
- Teste cobre o default e a injeção
- `full` passa, com `props:check` e `registry:check` em dia
- A avaliação do bump fica registrada com números, e `lucide-react` continua em `^0.577.0`

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
