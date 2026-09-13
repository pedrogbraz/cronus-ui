export interface LayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutBoxDelta {
  ok: boolean;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export function compareLayoutBox(a: LayoutBox, b: LayoutBox, maxPx = 2): LayoutBoxDelta {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  const dw = Math.abs(a.width - b.width);
  const dh = Math.abs(a.height - b.height);
  return {
    ok: dx <= maxPx && dy <= maxPx && dw <= maxPx && dh <= maxPx,
    dx,
    dy,
    dw,
    dh,
  };
}
