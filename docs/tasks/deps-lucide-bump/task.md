# deps-lucide-bump

Risco: normal

## Pedido

Migrar os últimos consumidores de marca e avaliar o bump de `lucide-react`
para 1.x.

Escopo inicial: `apps/www` (`site-nav`, `site-footer`, `option-icon`, três
exemplos premium), `apps/pro/components/pro-footer`, `package.json` dos três
workspaces e `bun.lock`.

## Análise

Última etapa da cadeia que começou em `deps-lucide-1`. A biblioteca já recebe os
glifos por prop, os três blocos publicados já têm SVG inline, e a ADR 0008 já
decidiu o regime. Falta o bump e os consumidores que não são distribuídos.

Levantamento dos arquivos-fonte que ainda importam marca — `.next/` e
`packages/ui/dist/` são saída de build e foram descartados da contagem:

| Arquivo | Marcas |
|---|---|
| `apps/www/components/site-nav.tsx` | Github |
| `apps/www/components/home/site-footer.tsx` | Github |
| `apps/www/components/stack/option-icon.tsx` | Github |
| `apps/www/lib/examples/premium/flip-card.tsx` | Github, Linkedin |
| `apps/www/lib/examples/premium/magnetic.tsx` | Github, Linkedin |
| `apps/www/lib/examples/premium/orbit.tsx` | Github |
| `apps/pro/components/pro-footer.tsx` | Github |

São **7 arquivos** e **2 marcas**: `Github` e `Linkedin`. Menos que os 9 do
levantamento original porque os 3 blocos já saíram.

Pela ADR 0008 estes sete estão no regime **livre**: nada aqui é distribuído —
são páginas dos nossos próprios sites e exemplos de documentação. Marca ou
ícone genérico é escolha de apresentação.

Escolho **vendorizar a mesma geometria**, pelo mesmo motivo que funcionou na
tarefa anterior: mantém o pixel invariante e deixa as suítes visuais servirem
de prova em vez de custo. Trocar por ícone genérico mudaria o desenho e exigiria
decidir, baseline por baseline, se o diff era esperado.

Diferença em relação aos blocos: aqui **pode haver módulo compartilhado**. Nada
é copiado para o consumidor, então o argumento que proibiu compartilhamento nos
blocos não se aplica. `apps/www` ganha um módulo; `apps/pro` precisa do próprio,
porque um app não importa do outro.

`option-icon.tsx` merece atenção: é um mapa estático de string kebab do catálogo
para componente. A entrada de `Github` vira a referência do glifo local, não uma
tag JSX.

## Plano

1. Criar `apps/www/components/brand-glyphs.tsx` com `GithubGlyph` e
   `LinkedinGlyph`, mesma geometria já vendorizada nos blocos.
2. Criar o equivalente mínimo em `apps/pro`.
3. Migrar os 7 arquivos, removendo `Github`/`Linkedin` dos imports de
   `lucide-react` e mantendo os demais ícones.
4. Subir `lucide-react` para `^1.46.0` em `packages/ui`, `apps/www` e
   `apps/pro`.
5. `bun install`, `typecheck`, `lint`.
6. `full`, depois `visual` e `audit`. **Esperado: zero diff, nenhuma baseline
   regenerada.**
7. Revisão, `integrate`, push, confirmação na CI.

Se o passo 6 acusar diff, investigar antes de qualquer outra coisa — igual à
tarefa anterior, diff aqui significa erro de transcrição.

## Revisão

Alternativa considerada: ícone genérico nos sete, já que a ADR permite.
Rejeitada — mudaria o desenho e jogaria fora a propriedade que tornou a tarefa
anterior barata. O `site-nav` tem link para o repositório; um `ExternalLink` ali
comunica menos que o glifo do GitHub.

Alternativa considerada: inline em cada um dos sete, sem módulo compartilhado,
por simetria com os blocos. Rejeitada — a proibição nos blocos vinha do literal
precisar ser autocontido. Aqui não há literal, e duplicar sete vezes seria
cargo cult da regra anterior.

Alternativa considerada: fazer o bump e a migração em commits separados.
Rejeitada — separados, o commit da migração deixaria o repositório com glifos
locais e `lucide-react` 0.577 ainda importando as marcas em nenhum lugar, o que
não é estado errado, mas também não é verificável: só o bump prova que a
migração foi completa. Juntos, `typecheck` é a prova.

Problema encontrado no plano: o passo 4 sobe `lucide-react` em `packages/ui`,
que é `dependencies` de pacote publicado. Isso muda o que quem instala recebe.
Está dentro do pedido, mas merece registro — e não resolve a questão de mover
para `peerDependencies`, que continua pendente e é decisão separada.

## Validação

Premissa "são 7 arquivos e 2 marcas": medida por varredura dos imports de
`lucide-react` em `apps` e `packages`, descartando `.next/` e `dist/`.

Premissa "os blocos já saíram": verificada na tarefa `blocos-glifos-inline`,
que fechou com `audit` 784 passed e zero baseline alterada.

Premissa "`option-icon.tsx` usa mapa, não JSX": verificada — a linha é
`Github,` dentro de um import multi-linha, e o arquivo declara um mapa estático
de nome kebab para componente.

Premissa "1.46.0 é a corrente": verificada em `npm view lucide-react version`.

**Não validado ainda:** que o pixel fique idêntico depois do bump. É o passo 6.

## Ajustes

Incorporado: módulo compartilhado em vez de inline, depois de perceber que a
regra dos blocos não se aplica a código não distribuído.

Incorporado: bump e migração no mesmo commit, para que `typecheck` prove a
completude.

Escopo mantido fora: mover `lucide-react` para `peerDependencies` em
`packages/ui`.

## Resultado do bump

**Não aplicado.** `lucide-react` 1.x **não é RSC-safe**.

Com 1.47.0 instalado, o project `ui-rsc` do Vitest deu **54 de 172 testes
falhando**, todos com `react.createContext is not a function`.

Causa: a 1.x introduziu `dist/esm/context.mjs`, e o barril
`lucide-react.mjs` faz `export { LucideProvider, useLucideContext } from
'./context.mjs'`. Sob a condição de export `react-server`, o React não fornece
`createContext`. O pacote **não declara campo `exports`**, então não há entrada
condicional nem caminho alternativo para RSC.

Consequência: qualquer componente de `packages/ui` que importe um ícone deixaria
de renderizar como Server Component. O registry marca esses componentes com
`rsc: true` e o project `ui-rsc` existe para provar isso.

A migração dos sete arquivos **fica**, porque é independente da versão e deixa o
repositório pronto para o bump no dia em que ele for possível.

## Entrega

Critérios de aceitação:
- Nenhum arquivo-fonte importa marca de lucide-react
- typecheck, full, visual e audit passam sem regenerar baseline
- O bump é aplicado, ou a tarefa para e reporta o bloqueio com número

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
