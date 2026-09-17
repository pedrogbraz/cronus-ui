# Retomada

Estado: implementado, aguardando revisão e `full`.

## O que foi feito

`packages/ui/package.json`:

| Campo | Antes | Depois |
|---|---|---|
| `dependencies` | `lucide-react: ^0.577.0` | ausente |
| `peerDependencies` | ausente | `^0.577.0` |
| `peerDependenciesMeta` | ausente | `{ optional: true }` |
| `devDependencies` | ausente | `^0.577.0` |

Mais entrada no `CHANGELOG`, marcada **BREAKING**.

## Por que opcional

77 dos ~212 componentes importam ícone. Os core **não**: `button`, `badge`,
`input`, `card`, `label` e `separator` têm zero ocorrências. Obrigar todo
consumidor a instalar `lucide-react` para usar um `Badge` contrariaria o padrão
do próprio pacote, que já tem 37 peers opcionais entre 41.

## A faixa é `^0.577.0`, e isso foi forçado por uma medição

Primeira tentativa: `^0.577.0 || ^1.0.0`. O `registry:check` **reprovou**:

```
Refusing to install invalid dependency spec from registry: lucide-react@^0.577.0 || ^1.0.0
```

`assertValidDependency` (`packages/cli/src/dependencies.ts:25`) valida todo spec
que o registry manda instalar contra `VALID_DEPENDENCY_RE`, que não admite
espaço. É guarda contra injeção de argumento — o comentário da função cita
`--registry=http://evil` e `-g`. Faixa composta não passa, e não deve passar.

Isso forçou a escolha certa. Declarar 1.x compatível contradiria o que
`deps-lucide-bump` mediu: ela quebra 54 de 172 testes RSC. `^0.577.0` é o que de
fato testamos.

**E não custa o objetivo.** O ganho do peer não vem da largura da faixa; vem de
parar de instalar uma segunda cópia. Com `dependencies`, quem usa lucide 1.x
recebia as duas. Com peer opcional, recebe só a sua.

## Evidências

- `bun run typecheck`: exit 0.
- `registry:check`: **OK** depois da faixa única.
- `package:smoke`: **OK**.
- `contract:check`: OK.
- `registry/accordion.json` segue com `lucide-react@^0.577.0` — as deps do
  registry são parseadas dos imports, não do manifesto.
- `quick`: passed.

## Pendências

- Alargar a faixa para admitir 1.x, quando o RSC estiver resolvido a montante.
- Os 3 PRs do lucide seguem abertos.

## Próximo passo

Revisão, `full`, `integrate`, push, CI.
