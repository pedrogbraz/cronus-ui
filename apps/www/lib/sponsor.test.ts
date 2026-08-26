import { describe, expect, it } from "vitest";
import {
  clampSponsorAmount,
  formatSponsorAmount,
  GITHUB_SPONSORS_URL,
  sponsorCheckoutUrl,
} from "./sponsor";

describe("sponsor checkout", () => {
  it("formats USD without a machine locale", () => {
    expect(formatSponsorAmount(5)).toBe("$5");
    expect(formatSponsorAmount(15)).toBe("$15");
  });

  it("clamps to the public one-time range", () => {
    expect(clampSponsorAmount(0)).toBe(1);
    expect(clampSponsorAmount(12.4)).toBe(12);
    expect(clampSponsorAmount(99_999)).toBe(10_000);
  });

  it("builds a GitHub Sponsors one-time URL with the amount", () => {
    const href = sponsorCheckoutUrl(12);
    expect(href.startsWith(`${GITHUB_SPONSORS_URL}/sponsorships?`)).toBe(true);
    expect(href).toContain("frequency=one-time");
    expect(href).toContain("amount=12");
    expect(href).toContain("preview=false");
  });
});
