import { describe, expect, it } from "vitest";
import { parseAuditOrigin } from "./dual-preview-url.js";

describe("parseAuditOrigin", () => {
  it("allows exact 127.0.0.1 and localhost http", () => {
    expect(parseAuditOrigin("http://127.0.0.1:5176")).toBe("http://127.0.0.1:5176");
    expect(parseAuditOrigin("http://localhost:5176")).toBe("http://localhost:5176");
  });

  it("rejects substring localhost and non-http", () => {
    expect(parseAuditOrigin("http://evil-localhost.example")).toBeNull();
    expect(parseAuditOrigin("https://127.0.0.1:5176")).toBeNull();
    expect(parseAuditOrigin("http://0.0.0.0:5176")).toBeNull();
  });
});
