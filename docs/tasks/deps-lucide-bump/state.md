# Retomada

Estado: migração feita, **bump não aplicado**. Aguardando revisão e `full`.

## O que foi feito

Sete arquivos migrados para glifos locais, duas marcas — `Github` e `Linkedin`:

| Arquivo | Marcas |
|---|---|
| `apps/www/components/site-nav.tsx` | Github |
| `apps/www/components/home/site-footer.tsx` | Github |
| `apps/www/components/stack/option-icon.tsx` | Github |
| `apps/www/lib/examples/premium/flip-card.tsx` | Github, Linkedin |
| `apps/www/lib/examples/premium/magnetic.tsx` | Github, Linkedin |
| `apps/www/lib/examples/premium/orbit.tsx` | Github |
| `apps/pro/components/pro-footer.tsx` | Github |

Dois módulos novos: `apps/www/components/brand-glyphs.tsx` e
`apps/pro/components/brand/github-glyph.tsx`.

**Nenhum arquivo-fonte do repositório importa marca de `lucide-react`.**
Verificado por varredura de AST de import, não por `grep` de nome — o `grep`
confundia string de exibição com símbolo importado.

## O bump não foi aplicado

`lucide-react` 1.x **não é RSC-safe**.

Com 1.47.0 instalado, o project `ui-rsc` deu **54 de 172 testes falhando**,
todos com `react.createContext is not a function`.

Causa: a 1.x introduziu `dist/esm/context.mjs`, e o barril `lucide-react.mjs`
faz `export { LucideProvider, useLucideContext } from './context.mjs'`. Sob a
condição de export `react-server`, o React não fornece `createContext`. O pacote
**não declara campo `exports`**, então não existe entrada condicional nem
caminho alternativo.

Consequência se fosse aplicado: componentes de `packages/ui` que importam ícone
deixariam de renderizar como Server Component. O registry marca vários com
`rsc: true`, e o project `ui-rsc` existe exatamente para provar isso.

Revertido para `^0.577.0`. `ui-rsc` voltou a **172 passed**.

## Decisões

**A migração fica, mesmo sem o bump.** É independente da versão, cumpre a ADR
0008, e deixa o repositório pronto para o dia em que o bump for possível.

**Módulo compartilhado aqui, inline nos blocos.** A proibição de compartilhar
vinha do literal do bloco precisar ser autocontido. Nada destes sete é copiado
para o consumidor.

**`OptionIcon` novo em `option-icon.tsx`.** O mapa era
`Record<string, LucideIcon>`, e `LucideIcon` é o `ForwardRefExoticComponent` do
lucide; glifo local é função simples. O tipo novo aceita qualquer componente de
props SVG.

## Evidências

- Varredura de imports: **0 arquivos-fonte** importam marca.
- `bun run typecheck`: exit 0.
- `visual`: **25 passed**. `audit`: **784 passed**. Baselines alteradas: **0**.
- `ui-rsc` com 0.577: **172 passed**. Com 1.47.0: 54 falhas.
- `registry/` idêntico ao `HEAD` depois da reversão — 0 diferenças.
- `quick`: passed.

## Pendências

- Os 3 PRs (#108, #110, #117) seguem abertos, agora com motivo novo: RSC.
- Mover `lucide-react` para `peerDependencies` continua pendente. **Ganhou
  peso**: com a dependência em `peer`, o consumidor escolheria a versão, e o
  problema de RSC seria dele — não nosso.

## Próximo passo

Revisão, `full`, `integrate`, push, CI.
