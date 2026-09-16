# Retomada

Estado: implementado e medido verde, aguardando revisão e `full`.

## O que foi feito

Dois commits.

**`fix(audit)`** — três mudanças, porque largura de painel sozinha não bastava:

1. `cronus-pane.tsx`: iframe de `w-full` para `w-[1152px]`. Largura fixa em px
   não depende de calha, painel nem plataforma. 1152 fica acima do breakpoint de
   1024 do kernel — mesmo bucket do React — e a 128px da borda mais próxima.
2. `app/audit/layout.tsx` e `audit-split.tsx`: a rota deixou de rolar
   (`scrollbar-gutter:auto;overflow:hidden` no `html`) e os painéis passaram a
   rolar por dentro. É o que faz a página separada do overlay ter `clientWidth`
   igual ao próprio viewport.
3. `playwright.audit.config.ts`: viewport de 1280 para 2560, para o iframe caber
   sem recorte.

**`ci(audit)`** — `audit` vira gate e entram as 177 baselines de
`e2e/audit/__screenshots__/linux`.

## Decisões

**As baselines de darwin não foram tocadas, e isso foi medido, não assumido.**
O plano previa regenerá-las. Construí o kernel no SHA fixado `1b465a2` e rodei
`parity.visual.spec.ts --update-snapshots`: **0 arquivos alterados**. No macOS o
iframe já estava em 640px, que é bucket desktop, e 1152px é o mesmo bucket. A
preocupação registrada na Revisão do plano estava errada.

**As baselines linux vieram do bootstrap do próprio job `audit`**, não do
`visual-baselines-linux`, para que baseline e comparação saiam do mesmo
ambiente. Os dois artefatos saíram idênticos em bytes (621337B), o que confirma
que o conserto anterior do `visual-baselines-linux` já o alinhou ao gate.

**`visual-baselines-linux` continua manual.** Ele reescreve baselines
versionadas; nenhum PR deve fazer isso.

## Evidências

- Run `35135620195` na branch: `audit` **success**, `Cronus Audit` com
  **784 passed, 0 failed**. Antes: 10 failed / 774 passed.
- `innerWidth` do iframe Cronus: **1152 no macOS e 1152 no Linux**. Antes: 640
  contra 635.
- Regeneração de darwin com o kernel `1b465a2`: 177 passed, 0 arquivos
  alterados.
- Os cinco jobs do run: `gates`, `browser`, `visual`, `audit` e
  `visual-baselines-linux` — todos **success**.

## Erro cometido no caminho

A primeira rodada de validação local mediu contra um servidor antigo, do
checkout principal, que continuou ocupando a porta 4747 — o `pkill -f 'next
start'` não pegou o processo. As conclusões daquela rodada eram inválidas.
Refiz depois de matar pelo PID e conferir o `cwd` do processo que escuta.

## Próximo passo

Revisão, `full`, `integrate`, push, e confirmar num run de push que `audit` roda
como gate em modo `compare`.
