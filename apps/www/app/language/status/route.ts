import { NextResponse } from "next/server";
import { CRONUS_CATALOG_ORIGIN } from "../../../lib/cronus-language";

export async function GET() {
  try {
    const response = await fetch(`${CRONUS_CATALOG_ORIGIN}/kit`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) {
      return NextResponse.json({ up: false }, { status: 502 });
    }
    return NextResponse.json({ up: true, origin: CRONUS_CATALOG_ORIGIN });
  } catch {
    return NextResponse.json({ up: false, origin: CRONUS_CATALOG_ORIGIN }, { status: 502 });
  }
}
