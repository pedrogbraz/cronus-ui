import { ImageResponse } from "next/og";

export const alt = "Cronus Pro — The rest of the product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Neutral dark, hardcoded as sRGB — ImageResponse cannot resolve oklch tokens.
const neutral = {
  surfaceBase: "#1c1c1c",
  fg: "#e8e8e8",
  fgSecondary: "#a3a3a3",
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
        padding: 80,
        backgroundColor: neutral.surfaceBase,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: neutral.fgSecondary, letterSpacing: 6 }}>
        CRONUS PRO
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 72,
          fontWeight: 400,
          color: neutral.fg,
          letterSpacing: -2,
          lineHeight: 1.05,
        }}
      >
        The rest of the product.
      </div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: neutral.fgSecondary }}>
        Mail · Chat · Finance — additive to OSS
      </div>
    </div>,
  );
}
