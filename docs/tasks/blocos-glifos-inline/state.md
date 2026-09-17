# Retomada

Estado: implementado e provado, aguardando revisão e `full`.

## O que foi feito

Três blocos migrados para glifos de marca inline, em preview e literal:

| Bloco | Marcas | Imports alterados | Call sites | Literais com glifo |
|---|---|---|---|---|
| `auth` | Chrome, Github | 5 | 16 JSX | 4 |
| `integrations` | Figma, Github, Slack | 2 | 6 referências de valor | 1 |
| `marketing` | Github, Linkedin, Twitter | 3 | 12 JSX | 2 |

`registry/` regenerado: `footer`, `footer--mega`, `integrations`, `login`,
`login--social-first`.

`lucide-react` continua em `^0.577.0`.

## A decisão que tornou isto barato

Os 6 ícones ainda existem na 0.577 instalada. Extraí a geometria por
`renderToStaticMarkup` e vendorizei **exatamente** o que já renderiza. O pixel
vira invariante, e as suítes visuais deixam de ser custo e viram prova.

A ADR 0008 listava 416 baselines como pior consequência. **Nenhuma foi tocada.**

## Correção que apliquei sobre o trabalho dos agentes

Os três agentes resolveram `lint/a11y/noSvgWithoutTitle` com
`// biome-ignore`. Funciona, mas colocaria **25 comentários de supressão dentro
do código copiado para o consumidor**. Substituí por `aria-hidden="true"` antes
do `{...props}`: satisfaz a regra pelo markup, não por supressão, e o spread
deixa o chamador sobrescrever. Verifiquei antes que as duas formas passam no
biome.

Dois agentes sinalizaram essa escolha explicitamente em vez de escondê-la, o
que é o motivo de ter sido possível corrigir.

## Inconsistência que sobrou

`auth` usa `React.SVGProps<SVGSVGElement>`; `integrations` e `marketing` usam
`SVGProps<SVGSVGElement>` com `import type { SVGProps } from "react"`. As duas
compilam — `typecheck` deu exit 0. Não uniformizei: o literal `magicLinkCode`
não tem import de `react`, e a forma com import exigiria acrescentar um.

## Evidências

- `bun run typecheck`: **exit 0**, zero erros.
- `registry:check`, `contract:check`, `check:example-sections`: **OK**.
- `bunx playwright test --project=visual`: **25 passed**.
- Suíte completa do audit: **784 passed**.
- `git status --porcelain e2e/`: **0** — nenhuma baseline alterada.
- `quick`: passed.

## Próximo passo

Revisão, `full`, `integrate`. Depois, o bump do `lucide-react` com os 5
arquivos restantes.
