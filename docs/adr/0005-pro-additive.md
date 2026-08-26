# ADR 0005 — Pro is an additive pack

- **Status:** aceita
- **Data:** 2026-08-26
- **Decisor:** pedrogbraz
- **Relacionada:** 0003, 0004

## Contexto

HeroUI Pro paywalls looks and extra components. Kronus already ships looks,
SaaS, compose, and upgrade as the engine (ADRs 0003–0004). Monetizing by
hiding Glass would contradict the category.

## Decisão

1. **OSS stays complete.** Tokens, looks, SaaS/store/landing, CLI, upgrade,
   AI Kit remain MIT. Pro never removes a row from that set.
2. **Pro is a pack of extra composed apps:** `mail`, `chat`, `finance`. Same
   compose engine, same preview loop.
3. **No Stripe in this cycle.** The Pro origin states the license is not billed yet.
4. **Figma Variables JSON stays in `@kronus-ui/tokens`.** Pro is the curated
   file plus a human at launch — not a gate on the JSON.
5. **CLI still composes the pack** in this open monorepo. Positioning is
   commercial, not a fake lock.

## Consequências

Visitantes veem o preview. Adopters scaffold. Quando publicar, a licença
Pro cobre o pack e o suporte. O motor não muda de lado.
