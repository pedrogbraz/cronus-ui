# audit-viewport-deterministico

Risco: normal

## Pedido

Tornar a largura do viewport do canvas Cronus determinística entre plataformas
e promover `audit` a gate se ficar verde.

Escopo inicial: `cronus-pane.tsx`, `audit-split.tsx`, `app/audit/layout.tsx`,
`playwright.audit.config.ts`, baselines linux de `e2e/audit` e o job `audit` no
`ci.yml`.

## Análise

Causa raiz das 10 falhas, já medida na investigação anterior e registrada em
`docs/tasks/audit-gates-linux/evidence.md`:

1. `apps/www/app/globals.css:90` declara `html { scrollbar-gutter: stable }`. No
   Linux a scrollbar é clássica e come 10px; no macOS headless é overlay e come
   0. Medido na árvore real: `body` tem 1280px no macOS e 1270px no Linux.
2. O split é `md:grid-cols-2`, então cada painel fica 640px no macOS e 635px no
   Linux, e o iframe do Cronus herda isso.
3. O CSS do kernel tem breakpoints em **640, 768 e 1024**
   (`max-width: 639.98px`, `min-width: 40rem`, `max-width: 768px`,
   `min-width: 64rem`, `max-width: 1024px`). 640 cai do lado desktop de
   639.98; 635 cai do lado mobile. Medido:
   `matchMedia("(max-width: 639.98px)").matches` é `false` no macOS e `true` no
   Linux.
4. O painel React não está num iframe: renderiza no documento de 1280px e
   avalia os breakpoints contra 1280. Por isso é estável entre plataformas
   enquanto o Cronus não é.

Fatos novos medidos para esta tarefa:

5. **Um painel ≥1024 resolve só 3 das 10.** Com viewport 2560 e gutter
   neutralizado, a divergência React × Cronus no Linux cai de 10/10 para 7/10.
   `card`, `logo-carousel` e `video-player` alinham; as 7 famílias de overlay
   não.
6. **As 7 de overlay não dependem da largura do painel.** `geometry.spec.ts:782`
   (`measureReactOverlay`) mede o React numa **página nova** cujo viewport é o
   `innerWidth` do iframe. O overlay é `position: fixed; inset: 0`, então mede o
   viewport cru dessa página — que reserva a própria calha de 10px no Linux.
   Neutralizar o gutter só na página principal não alcança essa segunda página.
7. **`2xl:` não existe em `packages/ui/src`** (0 ocorrências; `xl:` 9, `lg:` 40,
   `md:` 41) e o canvas React tem `width: 480` fixo
   (`apps/www/components/audit/audit-canvas.tsx:7`). Alargar o viewport do
   Playwright de 1280 para 2560 mantém os mesmos buckets de media query para o
   React, porque `xl:` (1280) casa nos dois.
8. O canvas Cronus também é fixo: `[data-audit-canvas] { width: 480px }` no CSS
   do kernel. Nenhuma das duas telas muda de tamanho com a largura do painel.

Riscos:

- **Invalida todas as baselines visuais de audit.** São 177 PNGs em `darwin`. A
  mudança de bucket altera o render do Cronus de propósito, então elas precisam
  ser regeneradas nas duas plataformas.
- A rota `/audit` é usada por humanos. Tirar a rolagem da página muda a
  experiência; os painéis passam a rolar por dentro.
- **Não há garantia de verde.** Sobram diferenças de métrica de texto entre
  plataformas em caixas dimensionadas por conteúdo (`alert-dialog-cancel` 79.4
  contra 75.4, `dialog button` 123.4 contra 117.3). Elas podem se cancelar
  quando React e Cronus rodam na mesma plataforma, ou não. Só medindo depois.

## Plano

1. `cronus-pane.tsx`: trocar `w-full` do iframe por largura fixa em px acima de
   1024. Largura fixa não depende de calha, de painel nem de plataforma.
2. `app/audit/layout.tsx` e `audit-split.tsx`: a rota deixa de rolar
   (`overflow: hidden` no `html`, contêiner em altura de tela) e os painéis
   passam a rolar por dentro. Isso faz a página do overlay ter `clientWidth`
   igual ao próprio viewport, que é o que o fato (6) exige.
3. `playwright.audit.config.ts`: viewport de 1280 para 2560, para o iframe de
   largura fixa caber no painel sem recorte.
4. Medir, no container Linux e no macOS, que o `innerWidth` do iframe é o mesmo
   número nas duas plataformas e que as 10 famílias param de divergir.
5. Só então: regenerar as baselines visuais, promover `audit` a gate e
   confirmar num run real.

Se o passo 4 não ficar verde, a tarefa para antes do 5, e o gate não sai.

## Revisão

Alternativa considerada: manter o viewport em 1280 e deixar o iframe de largura
fixa transbordar o painel de 640px. Evitaria mexer na config do Playwright, mas
`parity.visual.spec.ts` fotografa o canvas, e um canvas dentro de um iframe
recortado pelo painel é convite a screenshot cortada. Rejeitada.

Alternativa considerada: escalar o iframe com `transform: scale()` para caber
visualmente mantendo o viewport interno grande. A geometria não seria afetada,
porque `getBoundingClientRect` dentro do iframe ignora transform do pai — mas a
screenshot seria capturada escalada. Rejeitada pelo mesmo motivo.

Alternativa considerada: empilhar os painéis verticalmente, cada um em largura
cheia. Resolveria bucket e calha de uma vez, mas destrói a comparação lado a
lado, que é a razão de existir da página. Rejeitada.

Problema encontrado no plano: o passo 5 fala em "regenerar as baselines", mas
`visual-baselines-linux` gera só as de Linux. As 177 de `darwin` também ficam
inválidas e precisam ser regeneradas localmente, senão o `test:audit` local
passa a mentir. Isso precisa entrar no passo 5, não ficar implícito.

## Validação

Premissa "a calha é a origem dos 10px": medida na árvore real do DOM. `body`
1280 no macOS e 1270 no Linux, com `documentElement.clientWidth` 1280 nos dois.

Premissa "o breakpoint é o mecanismo": medida. `matchMedia` do kernel responde
`false` no macOS (iframe 640) e `true` no Linux (iframe 635), e o
`padding-inline` computado de `card-header` sai 24px contra 16px.

Premissa "largura de painel sozinha não basta": medida. 10/10 divergentes hoje,
7/10 com viewport 2560 e gutter neutralizado.

Premissa "o gutter neutralizado iguala o iframe": medida. Com a neutralização,
`innerWidth` do iframe é 1280 nas duas plataformas.

Premissa "alargar o viewport não muda o React": verificada por contagem —
`2xl:` não aparece em `packages/ui/src`, e ambos 1280 e 2560 casam `xl:`.

Duas hipóteses anteriores foram **falsificadas** por medição e não devem ser
reintroduzidas: largura de scrollbar medida em `documentElement.clientWidth`
(dá 0 nas duas plataformas) e divergência de fonte entre os lados (os dois
documentos medem o mesmo texto igual, e forçar outra fonte move os dois juntos).

## Ajustes

Incorporado: a mudança virou duas, não uma. A largura fixa do iframe sozinha
não alcança a página separada do overlay; sem tirar a rolagem da rota, as 7
famílias de overlay continuam falhando.

Incorporado: regenerar também as baselines de `darwin`, que o plano original
tratava como intocadas.

Incorporado: a condição de parada explícita no passo 4. O critério de aceitação
proíbe promover o gate sem verde medido.

## Entrega

Critérios de aceitação:
- O viewport do iframe Cronus mede o mesmo valor em macOS e Linux
- geometry.spec.ts passa no Linux para as 10 familias que falhavam, medido antes de qualquer promocao
- audit so vira gate se o run real ficar verde; se sobrar falha, o gate nao sai e a falha e reportada

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
