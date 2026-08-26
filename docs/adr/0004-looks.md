# ADR 0004 — Looks: material language orthogonal to theme

- **Status:** aceita
- **Data:** 2026-08-26
- **Decisor:** pedrogbraz
- **Relacionada:** 0003

## Contexto

Tema (Aurora / Neutral / Midnight / Sunset / Emerald) é paleta. Mode é
claro/escuro. O mercado (HeroUI Pro) vende um terceiro eixo — Brutalism, Glass,
Mauve — como “premium themes”, um catálogo à parte.

Cronus já re-tema via tokens. Copiar o paywall de looks é a partida errada:
o motor já existe. O que faltava era nomear o eixo e aplicá-lo com
`data-cronus-look`, sem forkar CVA nem um segundo registry.

## Decisão

1. **Look é material, não paleta.** `default` | `brutalist` | `glass` | `mauve`.
   Radius, borda, sombra, blur, transform de label. A paleta continua no tema.
2. **Orthogonal.** Qualquer look × qualquer tema × qualquer mode. Glass +
   Midnight e Brutalist + Sunset são válidos.
3. **Aplicação via atributo.** `data-cronus-look` num subtree. O chrome das
   docs permanece `default` (Neutral). Apps gerados opt-in no `<html>`.
4. **Sem fork de componente.** Looks restilizam `data-slot` + tokens existentes.
   Não há `ButtonBrutalist`.
5. **OSS neste ciclo.** Os quatro looks entram no motor. Pro, se existir, não é
   “pagar para ter Glass” — é o loop de produto (templates, Figma, suporte,
   looks extras depois).

## Alternativas consideradas

- **Paywall nos looks, estilo HeroUI Pro** — descartada agora. Esconder o motor
  de tokens enfraquece a categoria da ADR 0003.
- **Fork CVA por look** — descartada. Quadruplica o catálogo e quebra upgrade.
- **Só radius no Create Studio** — insuficiente. Brutalist e Glass não são um
  slider de canto.

## Consequências

**Boas:** a homepage demonstra o motor; um adopter escreve
`data-cronus-look="glass"` e o app segue. Contraste e reduced-transparency
continuam no CSS do look.

**Ruins:** Glass translúcido em cima de paleta clara precisa de cuidado AA;
`prefers-reduced-transparency` desliga o blur.

**Aceitamos:** o nome é **Mauve**, não “Mouve”. Brutalist, não “Brutalism” como
marca de terceiro.
