import { ImageResponse } from "next/og";

export const alt = "Kronus UI — The product UI system that themes itself";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Neutral dark tokens, hardcoded as sRGB — ImageResponse renders through Satori,
// which resolves neither the `--kronus-*` CSS variables nor `oklch()`.
// Source of truth: packages/tokens/src/tokens.ts (neutralDark); the hex below is
// the exact sRGB conversion of each oklch value, noted per line.
const neutral = {
  surfaceBase: "#040404", // oklch(0.11 0 0)
  primary: "#e8e8e8", // oklch(0.93 0 0)
  accent: "#262626", // oklch(0.27 0 0)
  fg: "#e8e8e8", // oklch(0.93 0 0)
  fgSecondary: "#9e9e9e", // oklch(0.7 0 0)
  border: "rgba(255,255,255,0.10)", // oklch(1 0 0 / 0.1)
  chipBg: "rgba(255,255,255,0.06)", // oklch(1 0 0 / 0.06)
};

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: neutral.surfaceBase,
        position: "relative",
      }}
    >
      {/* Ambient wash — achromatic, so the card matches the neutral theme. */}
      <div
        style={{
          position: "absolute",
          top: -220,
          left: -160,
          width: 760,
          height: 620,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07), transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -240,
          right: -140,
          width: 760,
          height: 620,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 65%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 24,
            display: "flex",
            backgroundImage: `linear-gradient(135deg, ${neutral.primary}, ${neutral.accent})`,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 400,
            color: neutral.fg,
            letterSpacing: -4,
          }}
        >
          Kronus UI
        </div>
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 36,
          color: neutral.fgSecondary,
        }}
      >
        The product UI system that themes itself
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 48,
          padding: "14px 28px",
          borderRadius: 14,
          border: `1px solid ${neutral.border}`,
          backgroundColor: neutral.chipBg,
          fontSize: 26,
          color: neutral.fgSecondary,
        }}
      >
        Compose · live theme · 3-way upgrade · React · Tailwind v4
      </div>
    </div>,
    size,
  );
}
