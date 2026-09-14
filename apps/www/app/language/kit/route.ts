import { NextResponse } from "next/server";
import { CRONUS_CATALOG_ORIGIN } from "../../../lib/cronus-language";

export async function GET() {
  try {
    const response = await fetch(`${CRONUS_CATALOG_ORIGIN}/kit`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      return new NextResponse("Kernel catalog is not running.", {
        status: 502,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    const html = await response.text();
    return new NextResponse(html, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch {
    return new NextResponse("Kernel catalog is not running on 127.0.0.1:5311.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
