/**
 * Unit tests for the Kronus Stack Builder engine + kickoff.
 *
 * Pure functions, node environment — no DOM, no I/O. These lock down the
 * cross-category constraints the UI relies on, so a regression here means the
 * builder would let users build an invalid stack.
 */

import { describe, expect, it } from "vitest";
import { catalog } from "./catalog";
import { defaultSelection, randomize, resolve, select, toggleMulti } from "./engine";
import {
  generateCommand,
  generateKickoff,
  generateStackJson,
  sanitizeProjectName,
} from "./kickoff";
import type { Selection } from "./types";

/** Find an option's resolution within a resolved category. */
function ro(res: ReturnType<typeof resolve>, catId: string, optId: string) {
  const opt = res.categories[catId]?.options.find((o) => o.option.id === optId);
  if (!opt) throw new Error(`option ${optId} not found in ${catId}`);
  return opt;
}

const base = (over: Record<string, string | string[] | boolean> = {}): Selection => ({
  ...defaultSelection(catalog),
  ...over,
});

describe("catalog integrity", () => {
  it("has globally unique option ids", () => {
    const ids = catalog.flatMap((c) => c.options.map((o) => o.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("the default selection is valid", () => {
    expect(resolve(catalog, defaultSelection(catalog)).valid).toBe(true);
  });
});

describe("database / orm constraints", () => {
  it("Database None disables every ORM and forces ORM to None", () => {
    const res = resolve(catalog, base({ database: "db-none", orm: "orm-drizzle" }));
    expect(ro(res, "orm", "orm-drizzle").available).toBe(false);
    expect(ro(res, "orm", "orm-prisma").available).toBe(false);
    expect(ro(res, "orm", "orm-mongoose").available).toBe(false);
    // cascade: orm fell back to None.
    expect(res.selection.orm).toBe("orm-none");
    expect(res.valid).toBe(true);
  });

  it("Database None disables hosted DB Setup providers (only Basic stays)", () => {
    const res = resolve(catalog, base({ database: "db-none" }));
    expect(ro(res, "dbSetup", "dbsetup-turso").available).toBe(false);
    expect(ro(res, "dbSetup", "dbsetup-neon").available).toBe(false);
    expect(ro(res, "dbSetup", "dbsetup-basic").available).toBe(true);
    expect(res.selection.dbSetup).toBe("dbsetup-basic");
  });

  it("ORM (non-None) requires a database", () => {
    const res = resolve(catalog, base({ database: "db-none", orm: "orm-drizzle" }));
    expect(ro(res, "orm", "orm-drizzle").reason).toMatch(/requires a sql database/i);
  });

  it("Mongoose requires MongoDB and conflicts with SQL dbs", () => {
    const withPg = resolve(catalog, base({ database: "db-postgres" }));
    expect(ro(withPg, "orm", "orm-mongoose").available).toBe(false);
    expect(ro(withPg, "orm", "orm-mongoose").reason).toMatch(/mongo/i);

    const withMongo = resolve(catalog, base({ database: "db-mongodb" }));
    expect(ro(withMongo, "orm", "orm-mongoose").available).toBe(true);
  });

  it("Drizzle/Prisma are SQL-only and conflict with MongoDB", () => {
    const res = resolve(catalog, base({ database: "db-mongodb" }));
    expect(ro(res, "orm", "orm-drizzle").available).toBe(false);
    expect(ro(res, "orm", "orm-prisma").available).toBe(false);
    expect(ro(res, "orm", "orm-drizzle").reason).toMatch(/sql-only/i);
  });
});

describe("db setup providers", () => {
  it("Neon requires PostgreSQL", () => {
    expect(
      ro(resolve(catalog, base({ database: "db-sqlite" })), "dbSetup", "dbsetup-neon").available,
    ).toBe(false);
    expect(
      ro(resolve(catalog, base({ database: "db-postgres" })), "dbSetup", "dbsetup-neon").available,
    ).toBe(true);
  });

  it("Turso & D1 require SQLite; Atlas requires MongoDB", () => {
    const sqlite = resolve(catalog, base({ database: "db-sqlite" }));
    expect(ro(sqlite, "dbSetup", "dbsetup-turso").available).toBe(true);
    expect(ro(sqlite, "dbSetup", "dbsetup-d1").available).toBe(true);
    expect(ro(sqlite, "dbSetup", "dbsetup-atlas").available).toBe(false);

    const mongo = resolve(catalog, base({ database: "db-mongodb" }));
    expect(ro(mongo, "dbSetup", "dbsetup-atlas").available).toBe(true);
  });

  it("PlanetScale requires Postgres or MySQL (not SQLite)", () => {
    expect(
      ro(resolve(catalog, base({ database: "db-mysql" })), "dbSetup", "dbsetup-planetscale")
        .available,
    ).toBe(true);
    expect(
      ro(resolve(catalog, base({ database: "db-postgres" })), "dbSetup", "dbsetup-planetscale")
        .available,
    ).toBe(true);
    expect(
      ro(resolve(catalog, base({ database: "db-sqlite" })), "dbSetup", "dbsetup-planetscale")
        .available,
    ).toBe(false);
  });
});

describe("convex (all-in-one backend)", () => {
  it("selecting Convex disables DB / ORM / DB-Setup and forces them to None/Basic", () => {
    const res = resolve(
      catalog,
      base({ backend: "backend-convex", database: "db-postgres", orm: "orm-drizzle" }),
    );
    expect(ro(res, "database", "db-postgres").available).toBe(false);
    expect(ro(res, "orm", "orm-drizzle").available).toBe(false);
    expect(res.selection.database).toBe("db-none");
    expect(res.selection.orm).toBe("orm-none");
    expect(res.selection.dbSetup).toBe("dbsetup-basic");
    expect(res.valid).toBe(true);
    expect(ro(res, "database", "db-postgres").reason).toMatch(/convex/i);
  });
});

describe("fullstack meta-frameworks", () => {
  it("Fullstack Next requires Next.js and disables dedicated backends", () => {
    // Not available without Next web.
    const onSvelte = resolve(catalog, base({ web: "web-svelte" }));
    expect(ro(onSvelte, "backend", "backend-fullstack-next").available).toBe(false);

    // Available with Next; and then dedicated backends are off.
    const res = resolve(catalog, base({ web: "web-next", backend: "backend-fullstack-next" }));
    expect(ro(res, "backend", "backend-fullstack-next").available).toBe(true);
    expect(ro(res, "backend", "backend-hono").available).toBe(false);
    expect(ro(res, "backend", "backend-express").available).toBe(false);
  });

  it("Fullstack TanStack requires TanStack Start", () => {
    expect(
      ro(resolve(catalog, base({ web: "web-next" })), "backend", "backend-fullstack-tanstack")
        .available,
    ).toBe(false);
    expect(
      ro(
        resolve(catalog, base({ web: "web-tanstack-start" })),
        "backend",
        "backend-fullstack-tanstack",
      ).available,
    ).toBe(true);
  });
});

describe("runtime / backend constraints", () => {
  it("Elysia requires Bun", () => {
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-node" })), "backend", "backend-elysia")
        .available,
    ).toBe(false);
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-node" })), "backend", "backend-elysia").reason,
    ).toMatch(/bun/i);
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-bun" })), "backend", "backend-elysia").available,
    ).toBe(true);
  });

  it("Express requires Node and conflicts with Cloudflare Workers", () => {
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-bun" })), "backend", "backend-express")
        .available,
    ).toBe(false);
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-cloudflare" })), "backend", "backend-express")
        .available,
    ).toBe(false);
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-node" })), "backend", "backend-express")
        .available,
    ).toBe(true);
  });

  it("Deploy Cloudflare requires the Cloudflare Workers runtime", () => {
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-node" })), "deploy", "deploy-cloudflare")
        .available,
    ).toBe(false);
    expect(
      ro(resolve(catalog, base({ runtime: "runtime-cloudflare" })), "deploy", "deploy-cloudflare")
        .available,
    ).toBe(true);
  });
});

describe("ui library", () => {
  it("Kronus UI requires a React web frontend (disabled on Svelte)", () => {
    const svelte = resolve(catalog, base({ web: "web-svelte" }));
    expect(ro(svelte, "ui", "ui-kronus").available).toBe(false);
    expect(ro(svelte, "ui", "ui-kronus").reason).toMatch(/react/i);
    // cascade pushed ui off Kronus onto an available choice.
    expect(svelte.selection.ui).not.toBe("ui-kronus");

    const next = resolve(catalog, base({ web: "web-next" }));
    expect(ro(next, "ui", "ui-kronus").available).toBe(true);
  });

  it("Tailwind-only / None stay available without React", () => {
    const astro = resolve(catalog, base({ web: "web-astro" }));
    expect(ro(astro, "ui", "ui-tailwind").available).toBe(true);
    expect(ro(astro, "ui", "ui-none").available).toBe(true);
  });
});

describe("select() cascade", () => {
  it("switching Database to None cascades ORM to None in one call", () => {
    const start = base({ web: "web-next", database: "db-postgres", orm: "orm-drizzle" });
    expect(resolve(catalog, start).selection.orm).toBe("orm-drizzle");
    const next = select(catalog, start, "database", "db-none");
    expect(next.orm).toBe("orm-none");
    expect(next.dbSetup).toBe("dbsetup-basic");
  });

  it("toggleMulti adds and removes a multi option", () => {
    const start = base();
    const added = toggleMulti(catalog, start, "mcp", "mcp-postgres");
    expect(added.mcp).toContain("mcp-postgres");
    const removed = toggleMulti(catalog, added, "mcp", "mcp-postgres");
    expect(removed.mcp).not.toContain("mcp-postgres");
  });
});

describe("randomize()", () => {
  it("produces a valid selection for many seeds", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const sel = randomize(catalog, seed);
      const res = resolve(catalog, sel);
      expect(
        res.valid,
        `seed ${seed} produced an invalid stack: ${JSON.stringify(res.issues)}`,
      ).toBe(true);
    }
  });

  it("is deterministic for a given seed", () => {
    expect(randomize(catalog, 7)).toEqual(randomize(catalog, 7));
  });
});

describe("generateCommand", () => {
  it("includes the right flags and a sanitized slug", () => {
    const cmd = generateCommand(
      base({ web: "web-next", database: "db-postgres", orm: "orm-drizzle" }),
      "My App!!",
    );
    expect(cmd).toContain("bun create kronus-stack@latest my-app --yes");
    expect(cmd).toContain("--web next");
    expect(cmd).toContain("--database postgres");
    expect(cmd).toContain("--orm drizzle");
    expect(cmd).toContain("--ui kronus");
    expect(cmd).toContain("--git");
  });

  it("emits multi categories as comma-separated lists", () => {
    const sel = toggleMulti(catalog, base(), "mcp", "mcp-postgres");
    const cmd = generateCommand(sel, "demo");
    expect(cmd).toMatch(/--ai claude-code/);
    expect(cmd).toMatch(/--mcp [a-z0-9,-]*postgres/);
  });
});

describe("sanitizeProjectName (security)", () => {
  it("strips shell metacharacters and injection attempts", () => {
    expect(sanitizeProjectName("foo; rm -rf /")).toBe("foo-rm-rf");
    expect(sanitizeProjectName("$(whoami)")).toBe("whoami");
    expect(sanitizeProjectName("../../etc/passwd")).toBe("etc-passwd");
    expect(sanitizeProjectName("a`b`c")).toBe("a-b-c");
    expect(sanitizeProjectName('app" --evil')).toBe("app-evil");
  });

  it("produces only [a-z0-9-] with no leading/trailing dashes", () => {
    const out = sanitizeProjectName("  --Hello_World 2026!  ");
    expect(out).toMatch(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/);
    expect(out).toBe("hello-world-2026");
  });

  it("falls back to a safe default when nothing usable remains", () => {
    expect(sanitizeProjectName("!!!")).toBe("my-kronus-app");
    expect(sanitizeProjectName("")).toBe("my-kronus-app");
  });

  it("the sanitized name reaches the command unbroken", () => {
    const cmd = generateCommand(base(), "evil; cat /etc/passwd");
    expect(cmd).toContain("kronus-stack@latest evil-cat-etc-passwd --yes");
    expect(cmd).not.toContain(";");
    expect(cmd).not.toContain("/etc/passwd");
  });
});

describe("generateKickoff & generateStackJson", () => {
  it("includes the resolved stack and a Kronus UI contract when UI=Kronus", () => {
    const md = generateKickoff(base({ web: "web-next" }), "my-app");
    expect(md).toContain("# KICKOFF — my-app");
    expect(md).toContain("Kronus UI contract");
    expect(md).toContain("@kronus-ui/ui");
    expect(md).toContain("Definition of Done");
  });

  it("omits the Kronus UI contract when UI is not Kronus", () => {
    const md = generateKickoff(base({ web: "web-svelte", ui: "ui-tailwind" }), "site");
    expect(md).not.toContain("Kronus UI contract");
  });

  it("stack.json is valid JSON carrying the sanitized name and stack", () => {
    const json = JSON.parse(generateStackJson(base({ web: "web-next" }), "Hello World"));
    expect(json.name).toBe("hello-world");
    expect(json.version).toBe(1);
    expect(json.stack.ui).toBe("ui-kronus");
  });
});
