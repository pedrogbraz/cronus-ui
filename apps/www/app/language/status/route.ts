import { NextResponse } from "next/server";
import { CRONUS_CATALOG_ORIGIN } from "../../../lib/cronus-language";

/** Probe for the local kernel catalog. "Not running" is a normal answer, not a 5xx. */
export async function GET() {
  try {
    const response = await fetch(`${CRONUS_CATALOG_ORIGIN}/kit`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    return NextResponse.json({ up: response.ok });
  } catch {
    return NextResponse.json({ up: false });
  }
}
