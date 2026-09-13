import { z } from "zod";

/**
 * Parity fixture schema.
 *
 * `expect.attrs` lists only attributes the React component already emits.
 * `data-size` is NOT CONTRACT (React Button does not set it) — the kernel may
 * still emit it; compare must ignore it.
 */
export const ParityFixtureSchema = z.object({
  id: z.string().min(1),
  family: z.string().min(1),
  state: z.string().optional(),
  props: z.record(z.string(), z.unknown()).default({}),
  expect: z.object({
    slot: z.string().min(1),
    tag: z.string().optional(),
    attrs: z.record(z.string(), z.string()).optional(),
  }),
});

export type ParityFixture = z.infer<typeof ParityFixtureSchema>;

export function parseParityFixture(input: unknown): ParityFixture {
  const parsed = ParityFixtureSchema.parse(input);
  if (parsed.expect.attrs && "data-size" in parsed.expect.attrs) {
    const { "data-size": _ignored, ...rest } = parsed.expect.attrs;
    return { ...parsed, expect: { ...parsed.expect, attrs: rest } };
  }
  return parsed;
}
