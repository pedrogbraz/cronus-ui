import { ImageResponse } from "next/og";
import { getComponentDisplayName, getComponentMeta } from "../../../lib/components-index";

export const alt = "Kronus UI component";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Aurora dark tokens, hardcoded — Satori cannot resolve the `--kronus-*` CSS
// variables. Source of truth: packages/tokens/src/tokens.ts (auroraDark).
const aurora = {
  surfaceBase: "#09090b",
  primary: "#0ea5e9",
  accent: "#06b6d4",
  fg: "#fafaf9",
  fgSecondary: "#a1a1aa",
  border: "rgba(255,255,255,0.10)",
  chipBg: "rgba(255,255,255,0.06)",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getComponentMeta(slug);
  const name = meta ? getComponentDisplayName(meta.name) : "Kronus UI";
  const description = meta?.description ?? "The product UI system that themes itself";
  const kicker = meta ? `Component · ${meta.category}` : "Component";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: aurora.surfaceBase,
        position: "relative",
        padding: 72,
      }}
    >
      {/* Aurora glows */}
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -180,
          width: 780,
          height: 640,
          display: "flex",
          backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.26), transparent 65%)",
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
          backgroundImage: "radial-gradient(circle, rgba(6,182,212,0.20), transparent 65%)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            display: "flex",
            backgroundImage: `linear-gradient(135deg, ${aurora.primary}, ${aurora.accent})`,
          }}
        />
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: aurora.fg }}>
          Kronus UI
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: aurora.accent,
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
            fontWeight: 700,
            color: aurora.fg,
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
            color: aurora.fgSecondary,
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
            border: `1px solid ${aurora.border}`,
            backgroundColor: aurora.chipBg,
            fontSize: 28,
            color: aurora.fg,
          }}
        >
          {`npx kronus-ui add ${slug}`}
        </div>
      </div>
    </div>,
    size,
  );
}
