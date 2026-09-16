# captura-audit-scroll

Risco: normal

## Pedido

Restaurar a captura correta do pixel spec sem reintroduzir a calha de scrollbar.

Escopo inicial: `apps/www/app/audit/layout.tsx` e `audit-split.tsx`, mais o que a
medição exigir em `parity.pixel.spec.ts`.

## Análise

O pedido original era "consertar a captura com a opção 1" — rolar a região para
dentro da vista em vez de usar `fullPage`. A leitura do código mostrou que o
diagnóstico anterior estava incompleto e que a opção 1 trata sintoma.

Fatos:

1. `shoot()` (`parity.pixel.spec.ts:290`) recorta a página e só usa
   `fullPage: true` quando a região não cabe no viewport. O comentário do
   próprio spec explica a escolha: `fullPage` faz o viewport crescer, o iframe
   acompanha, e conteúdo centrado no viewport sai da caixa medida.
2. `fullPage` só funciona se o **documento puder crescer**. Na tarefa
   `audit-viewport-deterministico` eu declarei `html{overflow:hidden}` na rota
   `/audit`. Com isso o documento passou a ter exatamente a altura do viewport,
   e `fullPage` deixou de capturar qualquer coisa além de 900px.
3. O canvas do `scroll-nav` tem **1198px** de altura, nos dois lados — medido:
   React `[480,1198]` e Cronus `[480,1198]` no viewport 2560×900. Não é
   divergência de componente.
4. O iframe Cronus fica em `top: 160`, `bottom: 937`, contra viewport de 900.
   `900 − 160 = 740`, que é exatamente a altura de toda captura do lado Cronus.
   O React é recortado noutro offset e sai com 716.
5. A aritmética do diff fecha inteira: `scroll-nav` 480 × (740−716) = **11520**,
   idêntico ao reportado; `sheet` 384 × (777−740) = 14208 contra 14216, com 8px
   de antialiasing.
6. Antes da minha mudança, `scroll-nav` e `sheet` marcavam `pass, 0px`. O
   documento crescia, `fullPage` capturava os 1198 dos dois lados, e as imagens
   batiam.

Conclusão: **a captura não estava quebrada; eu a quebrei.** O `overflow:hidden`
foi introduzido para que a página separada do overlay não reservasse calha de
scrollbar, o que é um requisito legítimo — mas ele resolve isso com um efeito
colateral que desarma o `fullPage`.

O requisito real é mais estreito do que `overflow:hidden`: a scrollbar não pode
**ocupar largura de layout**. Não é preciso proibir a rolagem para isso.
`scrollbar-width: none` mais `::-webkit-scrollbar{display:none}` zeram a largura
mantendo o documento rolável e crescível.

Riscos:

- Esconder a scrollbar muda a rota para humanos: dá para rolar, mas sem
  indicador visível. A rota é interna (`robots: noindex`).
- Se a largura escondida não for realmente 0 no Linux, a paridade de overlay
  volta a quebrar. Precisa ser medido nas duas plataformas, não presumido.

## Plano

1. Trocar `html{scrollbar-gutter:auto;overflow:hidden}` por regra que zera a
   largura da scrollbar sem proibir rolagem.
2. Desfazer o `h-screen`/`overflow-hidden` do `audit-split.tsx`, devolvendo o
   documento rolável que o `shoot` espera.
3. Medir nas duas plataformas: `innerWidth` do iframe Cronus e `clientWidth` da
   página do overlay precisam continuar iguais.
4. Rodar o pixel spec em modo estrito para `scroll-nav` e `sheet`: esperado 0
   diff.
5. Rodar a suíte completa do audit. Nenhuma outra família pode regredir.
6. Regenerar o scoreboard, porque os números de pixel mudam.
7. `quick`, revisão, `full`, `integrate`, push e confirmar na CI.

Se o passo 3 ou o 5 não fechar, a tarefa para e reporta — a opção 1 volta à mesa
como plano B, agora com o diagnóstico correto.

## Revisão

**Não implementei a opção 1 como pedida, e isso precisa ser dito.** Rolar a
região para dentro da vista não resolve `scroll-nav`: o canvas tem 1198px e o
viewport 900. Nenhuma rolagem faz caber. A opção 1 exigiria recortar os dois
lados numa altura comum menor que a região, o que trocaria um artefato por uma
perda silenciosa de cobertura — a suíte compararia só a parte de cima de um
canvas alto e continuaria dizendo "pass".

Alternativa considerada: manter `overflow:hidden` e reescrever `shoot` para
costurar várias capturas do tamanho do viewport. Cobre a região inteira e é
correto, mas é reescrever o caminho de medição de um gate para consertar um
problema que eu mesmo criei e que sai com três linhas de CSS. Rejeitada por
desproporção.

Alternativa considerada: reverter a tarefa `audit-viewport-deterministico`
inteira. Jogaria fora a correção do breakpoint, que é real e está medida.
Rejeitada.

Problema encontrado no plano: o passo 6 regenera o scoreboard, e o scoreboard
atual foi commitado com uma mensagem minha afirmando que `scroll-nav` e `sheet`
eram divergência real desmascarada. Isso está errado e o commit já está em
`main`. A correção do registro precisa entrar em `evidence.md`, não só nos
números.

## Validação

Premissa "o canvas tem 1198 nos dois lados": medida no viewport 2560×900 —
React `[480,1198]`, Cronus `[480,1198]`.

Premissa "740 é recorte do viewport": medida. Iframe `top: 160`, viewport 900,
`900 − 160 = 740`, e as duas famílias, com clips de larguras diferentes (480 e
384), saem ambas com 740 de altura.

Premissa "o diff é só a diferença de altura": medida pela aritmética exata de
11520 e pela aproximação de 8px em 14216.

Premissa "antes passava": o scoreboard de 2026-09-15 registra `scroll-nav` e
`sheet` como `pass` com `diffPixels: 0`.

Premissa "aumentar a altura do viewport não resolve": medida. A 1200px de
altura o conteúdo React do `scroll-nav` vai a 1348 enquanto o kernel fica em
1198 — vira divergência de verdade.

**Não validado ainda:** que zerar a largura da scrollbar mantenha a paridade de
overlay no Linux. É o passo 3 e é condição de parada.

## Ajustes

Incorporado: o escopo deixou de ser `parity.pixel.spec.ts` e passou a ser a
regra CSS que eu introduzi. O spec não tem defeito.

Incorporado: a correção do registro sobre o commit `ccfda113`, cuja mensagem
afirma causa errada.

Escopo mantido fora: costurar capturas para regiões mais altas que o viewport.
É melhoria real do spec — hoje uma região muito alta depende de `fullPage` — mas
é outra tarefa.

## Entrega

Critérios de aceitação:
- scroll-nav e sheet voltam a 0 diff pixels
- O iframe Cronus continua medindo 1152 no macOS e no Linux
- A suite completa do audit continua verde

Demonstrar cada critério e registrar limitações em evidence.md. Etapas não exigem aprovações humanas adicionais quando a autorização já existe.
