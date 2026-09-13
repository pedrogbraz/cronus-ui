import { parseAuditOrigin } from "@cronus-ui/audit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = parseAuditOrigin(process.env.CRONUS_AUDIT_ORIGIN);
  if (!origin) {
    return NextResponse.json({ ok: false });
  }
  const src = new URL(request.url).searchParams.get("src") ?? `${origin}/audit/button/primary-md`;
  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return NextResponse.json({ ok: false });
  }
  if (target.origin !== origin) {
    return NextResponse.json({ ok: false });
  }
  try {
    const res = await fetch(target, { cache: "no-store", signal: AbortSignal.timeout(2000) });
    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
