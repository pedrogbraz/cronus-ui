# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| Os três blocos não importam mais marca de `lucide-react`, no preview e no literal | atendido | `typecheck` exit 0 sem os símbolos; nenhuma das 40 linhas `from "lucide-react"` menciona as 6 marcas. |
| `visual` e `audit` provam zero diff de pixel | atendido | `--project=visual`: **25 passed**. Audit completo: **784 passed**. `git status --porcelain e2e/` devolve **0**. |
| `registry:check` passa com preview e literal em lockstep | atendido | Passou depois de `bun run -F cronus-ui registry`. O gate é byte-compare entre as duas metades. |

## Como o pixel ficou invariante

A geometria não foi redesenhada. Foi extraída do `lucide-react@0.577.0`
instalado, por `renderToStaticMarkup`, e reproduzida com o mesmo envelope:

```
viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor"
stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
```

A única diferença de markup em relação ao que o lucide emite é a ausência de
`class="lucide lucide-<nome>"`. Verifiquei antes que nenhum CSS do repositório
e nenhum teste em `e2e/` seleciona `.lucide`.

## Limites desta evidência

- **A prova é de macOS.** As baselines comparadas localmente são as de
  `darwin`; o gate compara `linux` na CI. Zero diff local não garante zero diff
  lá. Só o run de push fecha isso, e ele vem depois do `integrate`.
- **`aria-hidden="true"` é mudança de markup, não só de lint.** Ele não
  existia antes no elemento `svg` — o atributo chegava do chamador. Não afeta
  pixel, mas afeta a árvore de acessibilidade quando o chamador não passa nada.
  Nenhum teste de axe foi executado nesta tarefa.
- **Duplicação aceita e não medida.** Cada glifo existe agora em várias cópias
  por arquivo. A ADR 0008 aceitou isso; ninguém mediu quanto cresceu o bundle
  de `apps/www` nem o tamanho dos arquivos do registry.
- **A inconsistência de tipo entre os três arquivos não foi resolvida.**
  `auth` usa `React.SVGProps`, os outros dois `SVGProps` importado.
- O trabalho foi feito por três agentes, um por arquivo, e revisado por leitura
  do diff e pelos gates — não linha a linha.
