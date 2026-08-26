import { ImageResponse } from "next/og";

export const alt = "Kronus Pro — The rest of the product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Aurora dark, hardcoded as sRGB — ImageResponse cannot resolve oklch tokens.
const aurora = {
  surfaceBase: "#071018",
  primary: "#5ec8ff",
  fg: "#e8f4ff",
  fgSecondary: "#9bb0c0",
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
        backgroundColor: aurora.surfaceBase,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -80,
          width: 640,
          height: 640,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(94,200,255,0.22), transparent 65%)",
        }}
      />
      <div style={{ display: "flex", fontSize: 28, color: aurora.primary, letterSpacing: 6 }}>
        KRONUS PRO
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 72,
          fontWeight: 400,
          color: aurora.fg,
          letterSpacing: -2,
          lineHeight: 1.05,
        }}
      >
        The rest of the product.
      </div>
      <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: aurora.fgSecondary }}>
        Mail · Chat · Finance — additive to OSS
      </div>
    </div>,
  );
}
