import { handleMcpHttpRequest, handleMcpOptions } from "cronus-ui-mcp/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export function OPTIONS(): Response {
  return handleMcpOptions();
}

export function GET(request: Request): Promise<Response> {
  return handleMcpHttpRequest(request);
}

export function POST(request: Request): Promise<Response> {
  return handleMcpHttpRequest(request);
}

export function DELETE(request: Request): Promise<Response> {
  return handleMcpHttpRequest(request);
}
