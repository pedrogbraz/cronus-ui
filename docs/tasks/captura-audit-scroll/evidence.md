# Evidências

| Critério | Resultado | Como foi demonstrado |
|---|---|---|
| `scroll-nav` e `sheet` voltam a 0 diff pixels | atendido | `AUDIT_STRICT_PIXELS=1` nas duas famílias: ambas passam. Relatórios: `diffPixels: 0`, `size` `480x1198` e `384x777`, com `react` e `cronus` iguais. |
| Iframe Cronus continua 1152 no macOS e no Linux | atendido | Medido nas duas plataformas depois da mudança: `innerWidth` 1152 e 1152; página do overlay com `clientWidth` 1152 nas duas; calha 0 nas duas. |
| Suíte completa continua verde | atendido | `bunx playwright test -c playwright.audit.config.ts`: **784 passed**. |

## Cadeia causal, fechada

1. `shoot()` (`parity.pixel.spec.ts:290`) usa `fullPage: true` quando a região
   não cabe no viewport.
2. `fullPage` só captura além do viewport se o documento puder crescer.
3. A tarefa `audit-viewport-deterministico` declarou `html{overflow:hidden}` na
   rota `/audit`, fixando o documento na altura do viewport.
4. O canvas do `scroll-nav` tem 1198px; o iframe fica em `top: 160` num viewport
   de 900. Toda captura do lado Cronus saía com `900 − 160 = 740`; a do React,
   noutro offset, com 716.
5. O diff reportado era exatamente isso: `480 × (740−716) = 11520`, idêntico; e
   `384 × (777−740) = 14208` dos 14216 do `sheet`, com 8px de antialiasing.
6. Os canvases nunca divergiram: medidos em 2560×900, React `[480,1198]` e
   Cronus `[480,1198]`.
7. Zerar a largura da scrollbar sem proibir rolagem satisfaz o requisito de
   paridade do overlay e devolve o `fullPage`. Scoreboard volta de
   `185 match / 1 diff` → `183 / 3` → **`185 / 1`**.

## Correção de afirmação anterior

O commit `ccfda113` ("regenera o scoreboard depois da correção do viewport")
afirma na mensagem que `scroll-nav` e `sheet` eram divergência real
desmascarada, e que o Cronus casava com o React "por acidente". **Isso é
falso.** Era artefato de captura, causado pela minha própria mudança. A
afirmação foi feita sem medir a causa — o `evidence.md` daquela tarefa já
registrava "a causa dos dois `diff` novos não foi investigada", e eu deveria ter
parado nesse limite em vez de narrar um mecanismo.

## Limites desta evidência

- **`reveal/default` é instável e continua instável.** Falhou 1 de 3 execuções
  aqui e 1 de 4 no estado anterior — preexistente, não regressão. Com o `audit`
  promovido a gate e `retries: 0` na config, isso vai avermelhar PR sem motivo.
  Não foi corrigido nesta tarefa.
- **Regiões mais altas que o viewport continuam dependendo de `fullPage`.**
  Funciona, mas é frágil: qualquer mudança futura que impeça o documento de
  crescer reintroduz exatamente este bug. Costurar capturas seria mais robusto e
  é outra tarefa.
- A validação de pixel foi em **macOS**. O job `audit` só publica
  `test-results` quando falha, então os `diffPixels` do Linux continuam não
  comparáveis.
- Esconder a scrollbar muda a rota para humanos: rola, mas sem indicador
  visível.
