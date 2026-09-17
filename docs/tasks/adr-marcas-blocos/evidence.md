# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| A ADR nomeia o custo medido de cada alternativa | atendido, com uma exceção declarada | Quatro alternativas, cada uma com o motivo do descarte. A de "ficar em 0.577" declara explicitamente que seu custo **não foi medido**. |
| A ADR sai como proposta | atendido | `- **Status:** proposta`, decisor `pedrogbraz`. |

## Números que entraram na ADR

- `lucide-react@1.46.0`: 4204 ícones, zero de marca, sem export alternativo.
- `typecheck` sob 1.46.0: exit 2, 16 erros em 9 arquivos.
- 6 marcas: `Github` 9, `Linkedin` 3, `Twitter`, `Slack`, `Figma`, `Chrome`.
- Três blocos afetados: `auth`, `integrations`, `marketing`.
- 40 linhas `from "lucide-react"` e 28 usos em JSX nesses três.
- 416 baselines: 31+31 `e2e/visual`, 177+177 `e2e/audit`.

Todos medidos na tarefa `deps-lucide-1` e reaproveitados aqui.

## Limites desta evidência

- **A ADR é um documento, não uma verificação.** `quick` e `full` provam que o
  repositório continua íntegro, não que a decisão é boa.
- **O custo da duplicação de `lucide-react` não foi medido.** A ADR usa isso
  como argumento fraco de propósito e marca para medir depois.
- **A afirmação sobre uso nominativo de marca não é opinião jurídica.** É o
  raciocínio que separa os dois regimes e está escrito como tal; não substitui
  avaliação de alguém com competência para dar essa opinião.
- **O custo de migrar os blocos é contagem estática.** 40 imports e 28 usos em
  JSX vêm de `grep`. Ninguém migrou um bloco para calibrar quanto tempo leva de
  fato, nem para descobrir se algum literal resiste à edição.
- A ADR não foi revisada por outra pessoa. `task review` registra a minha
  avaliação, não uma segunda opinião.
