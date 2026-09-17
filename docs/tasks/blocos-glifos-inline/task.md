# blocos-glifos-inline

Risco: normal

## Pedido

Migrar os três blocos para glifos de marca inline, implementando a ADR 0008.

Escopo inicial: `apps/www/lib/blocks/auth.tsx`, `integrations.tsx`,
`marketing.tsx` e o registry regenerado. **Sem subir `lucide-react`.**

## Análise

A ADR 0008 foi aceita: blocos publicados levam SVG inline, porque o literal de
código é copiado verbatim para o projeto de quem instala e um bloco de
integrações sem logo não demonstra integração.

Descoberta que muda o custo: **os 6 ícones de marca ainda existem no
`lucide-react@0.577.0` instalado**. Confirmado para `Github`, `Linkedin`,
`Slack`, `Figma`, `Chrome` e `Twitter`.

A geometria de cada um foi extraída por `renderToStaticMarkup`. Todos
compartilham o mesmo envelope:

```
viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
```

Se o glifo inline reproduzir o mesmo envelope e o mesmo conteúdo, **o pixel não
muda**. As 416 baselines que a ADR listou como pior consequência não precisam
ser regeneradas.

Isso inverte o papel das suítes visuais nesta tarefa. Elas deixam de ser o
custo e viram a **prova**: se `visual` ou `audit` acusarem diff, é erro de
transcrição do path, não baseline envelhecida. Nenhuma baseline é regenerada
aqui, em nenhuma hipótese.

Licença: `lucide-react` é ISC, então copiar a geometria é permitido. A questão
de marca é outra e a ADR 0008 já a decidiu.

Alcance medido: 40 linhas `from "lucide-react"` e 28 usos em JSX nos três
arquivos, cada um em lockstep entre preview e literal.

## Plano

1. Definir o formato do glifo, igual nos três arquivos e dentro dos literais:
   um componente por marca, aceitando `props` de `SVGProps<SVGSVGElement>`,
   reproduzindo o envelope acima.
2. Migrar um arquivo por vez, preview e literal em lockstep.
3. `bun run -F cronus-ui registry` e `registry:check` — o gate prova o lockstep
   por byte-compare.
4. `typecheck`, `lint`, `test`.
5. `visual` e `audit` locais. **Esperado: zero diff.**
6. `quick`, revisão, `full`, `integrate`.

Se o passo 5 acusar diff, investigar o path antes de qualquer outra coisa. A
tarefa não regenera baseline.

## Revisão

Alternativa considerada: escrever glifos novos, desenhados por nós. Rejeitada —
qualquer diferença de geometria vira diff de pixel, e aí perde-se a capacidade
de distinguir erro de transcrição de mudança intencional. Copiar a geometria
que já está renderizando hoje mantém o pixel como invariante e transforma as
suítes em prova.

Alternativa considerada: um componente compartilhado importado pelos três
blocos. Rejeitada pela ADR 0008 — o literal precisa ser autocontido, e um
`registry:lib` de glifos os publicaria no pacote npm.

Alternativa considerada: migrar os três arquivos em paralelo com agentes.
**Aceita**, com a condição de um agente por arquivo. Os três arquivos são
independentes e nenhum outro é tocado; o risco de conflito é zero. O risco real
é outro: `AGENTS.md` avisa que replace global dentro dos literais quebra o
parse, porque crase aninhada fecha a string externa. A instrução de cada agente
precisa proibir replace global e exigir edição por ocorrência.

Problema encontrado no plano: o passo 5 roda `visual` e `audit` contra
baselines de **darwin**, enquanto o gate compara **linux** na CI. Zero diff
local não garante zero diff na CI. A confirmação final é o run de push, e ele
vem depois do `integrate`.

## Validação

Premissa "os 6 ícones existem na 0.577": medida — `require("lucide-react")` no
`packages/ui` devolve os seis.

Premissa "o envelope é o mesmo nos seis": medida por `renderToStaticMarkup`,
que devolveu atributos idênticos para os seis.

Premissa "o literal é copiado verbatim": verificada no `CONTRACT.md`.

Premissa "40 imports e 28 usos": medida por `grep -c`.

**Não validado ainda:** que o pixel fique idêntico. É o passo 5 e é a prova da
tarefa.

## Ajustes

Incorporado: as suítes visuais passam de custo a prova, depois que a existência
dos ícones na 0.577 apareceu. O plano original previa regenerar 416 baselines.

Incorporado: a proibição explícita de replace global dentro dos literais, na
instrução dos agentes.

Escopo mantido fora: subir `lucide-react`, e corrigir os 5 arquivos de docs,
exemplos e `apps/pro`. Vão na tarefa seguinte, junto com o bump.

## Entrega

Critérios de aceitação:
- Os tres blocos nao importam mais marca de lucide-react, no preview e no literal
- visual e audit provam zero diff de pixel; se houver diff, e erro de path e nao baseline velha
- registry:check passa com preview e literal em lockstep

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
