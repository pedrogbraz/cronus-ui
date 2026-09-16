# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| Scoreboard gerado por execução completa no kernel fixado, não editado à mão | atendido | `bunx playwright test -c playwright.audit.config.ts` com `CRONUS_BIN` no binário do SHA `1b465a2`: **784 passed**. O arquivo saiu de `bun run -F @cronus-ui/audit audit:scoreboard`, que lê `test-results/audit-geometry` (203 relatórios), `test-results/audit-pixel` (203) e `test-results/audit-report.json`. |
| `generatedAt` reflete a execução e os totais refletem o medido | atendido | `generatedAt: 2026-09-16`, `kernelRef: 1b465a2ecbac617561d07f4aaeba79eefb84fc5b`. Totais: geometria 203/0, lógica 195/0, pixel 200 pass / 3 diff. |

## Medições

1. **As duas plataformas concordam.** macOS local: 784 passed. Linux, run
   `35137909955` em modo `compare`: 784 passed. Mesmo número, mesmo kernel SHA.
2. **Geometria e lógica inalteradas** entre o scoreboard de 2026-09-15 e este:
   `{pass: 203, fail: 0}` e `{pass: 195, fail: 0}`.
3. **Dois `match` viraram `diff`:** `scroll-nav/default` de 0 para 11520px e
   `sheet/default` de 0 para 14216px. `autocomplete/default` segue em 1836px.

## Por que os dois `diff` não são regressão

Nenhum componente, token, CSS ou fixture mudou entre as duas medições — o diff
desta tarefa é de um arquivo só, e é o próprio scoreboard.
`parity.pixel.spec.ts` compara o canvas React contra o canvas Cronus na mesma
execução; o diretório de baseline dele é `test-results/audit-pixel-baseline`,
efêmero, então nenhuma imagem versionada participa da comparação.

O que mudou foi o ambiente medido: antes o canvas Cronus renderizava o layout
mobile, porque o iframe ficava em 640px, do lado errado do breakpoint
`max-width: 639.98px` do kernel; agora renderiza desktop em 1152px, como o
React. Nessas duas famílias o layout mobile casava com o React desktop por
acidente.

## Limites desta evidência

- **A execução foi em macOS.** O run do Linux confirma o mesmo total de 784
  passed, mas o job `audit` só publica `test-results` quando falha
  (`if: failure()`), então **não há como comparar os `diffPixels` das duas
  plataformas**. Os números de pixel deste arquivo são de macOS.
- **`diff` não é `fail`.** Os três `diff` não reprovam a suíte; são
  report-only. O gate continua verde com eles.
- **A causa dos dois `diff` novos não foi investigada.** Está afirmado que são
  divergências pré-existentes desmascaradas, com base em nenhum componente ter
  mudado — não em inspeção do render.
- O scoreboard descreve um instante. Qualquer mudança em componente, kernel ou
  fixture o desatualiza, e nada no repositório verifica isso mecanicamente.
