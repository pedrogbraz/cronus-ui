# ADR 0006 — Pro is a separate origin

- **Status:** aceita
- **Data:** 2026-08-26
- **Decisor:** pedrogbraz
- **Relacionada:** 0003, 0005

## Contexto

HeroUI splits `heroui.com` (OSS) from `heroui.pro`. Magic UI splits
`magicui.design` from `pro.magicui.design`. A `/pro` route on the Neutral docs
chrome keeps the visitor inside the catalog site and undersells the pack.

## Decisão

1. **Cronus Pro is its own Next app** (`apps/pro`, port 4748). Aurora dark is
   the product identity (ADR 0003). Docs chrome stays on `apps/www`.
2. **See Pro / Explore Pro leave the OSS origin** via `NEXT_PUBLIC_PRO_URL`
   (dev: `http://localhost:4748`, prod name: `https://cronusui.pro`). `/pro` on
   www redirects there so bookmarks still work.
3. **Pricing is Maker ($199) and Studio ($299), one-time perpetual.** Web only.
   No Mobile/Super SKU — Cronus does not ship React Native.
4. **Still not billed.** Cards look like checkout; the action says the license
   opens at first public release. No Stripe.
5. **Live previews stay on OSS.** The Pro site iframes
   `{OSS}/preview/t/{mail,chat,finance}?embed=1`.

## Consequências

Dois `next start` no Playwright. DNS de `cronusui.pro` é deploy, não este
repositório. ADR 0005 (additive pack, looks livres) continua válida.
