// @ts-nocheck
"use client";

export function SideBento() {
  return (
    <>
      <Side align="left" />
      <Side align="right" />
    </>
  );
}

function Side({ align }: { align: "left" | "right" }) {
  const inward = align === "left" ? "right" : "left";

  return (
    <div
      className={`pointer-events-none fixed top-0 hidden h-full w-[26vw] flex-col gap-5 p-4 lg:flex ${align === "left" ? "left-0" : "right-0"}`}
    >
      <BentoBox size="sm" align={inward} />
      <MiniRow align={inward} />
      <Separator />
      <Triangle align={inward} />
      <BentoBox size="md" align={inward} />
      <Separator />
      <MiniRow align={inward} />
      <BentoBox size="lg" align={inward} />
      <Separator />
      <Triangle align={inward} />
      <BentoBox size="sm" align={inward} />
    </div>
  );
}

function BentoBox({ size, align }: { size: "sm" | "md" | "lg"; align: "left" | "right" }) {
  const heights = {
    sm: "h-14",
    md: "h-24",
    lg: "h-32",
  };

  return (
    <div
      className={`
        ${heights[size]}
        w-full
        border border-border
        rounded-xl
        bg-muted/30
        backdrop-blur-md
        ${align === "right" ? "ml-auto -mr-6.5" : "mr-auto -ml-6.5"}
      `}
    />
  );
}

function MiniRow({ align }: { align: "left" | "right" }) {
  return (
    <div className={`flex gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className="w-6 h-6 border border-border rounded-md bg-muted/40" />
      <div className="w-10 h-6 border border-border rounded-md bg-muted/40" />
      <div className="w-4 h-6 border border-border rounded-md bg-muted/40" />
    </div>
  );
}

function Triangle({ align }: { align: "left" | "right" }) {
  return (
    <div className={`${align === "right" ? "ml-auto mr-4" : "mr-auto ml-4"}`}>
      <div
        className="w-0 h-0 border-t-8 border-b-8 border-t-transparent border-b-transparent border-border"
        style={{
          borderLeftWidth: align === "right" ? "14px" : "0",
          borderRightWidth: align === "left" ? "14px" : "0",
        }}
      />
    </div>
  );
}

function Separator() {
  return (
    <div className="relative w-full h-4 border-x border-border">
      <div
        className="absolute inset-0 opacity-40
        bg-[repeating-linear-gradient(315deg,var(--color-border)_0,var(--color-border)_1px,transparent_1px,transparent_6px)]"
      />
    </div>
  );
}
