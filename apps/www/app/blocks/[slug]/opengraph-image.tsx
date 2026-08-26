import { ImageResponse } from "next/og";
import { getBlockMeta } from "../../../lib/blocks-index";

export const alt = "Kronus UI block";
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

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getBlockMeta(slug);
  const name = meta?.name ?? "Kronus UI";
  const description = meta?.description ?? "The product UI system that themes itself";
  const kicker = meta ? `Block · ${meta.category}` : "Block";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: neutral.surfaceBase,
        position: "relative",
        padding: 72,
      }}
    >
      {/* Ambient wash — achromatic, so the card matches the neutral theme. */}
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -180,
          width: 780,
          height: 640,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06), transparent 65%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -280,
          left: -160,
          width: 720,
          height: 600,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 65%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            display: "flex",
            backgroundImage: `linear-gradient(135deg, ${neutral.primary}, ${neutral.accent})`,
          }}
        />
        <div style={{ display: "flex", fontSize: 34, fontWeight: 400, color: neutral.fg }}>
          Kronus UI
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: neutral.accent,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 88,
            fontWeight: 400,
            color: neutral.fg,
            letterSpacing: -3,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 32,
            lineHeight: 1.4,
            color: neutral.fgSecondary,
          }}
        >
          {description.length > 140 ? `${description.slice(0, 137)}…` : description}
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            padding: "14px 26px",
            borderRadius: 14,
            border: `1px solid ${neutral.border}`,
            backgroundColor: neutral.chipBg,
            fontSize: 28,
            color: neutral.fg,
          }}
        >
          {`npx kronus-ui add ${slug}`}
        </div>
      </div>
    </div>,
    size,
  );
}
