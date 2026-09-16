// Minimal ANSI helpers — no dependency needed. Colors are dropped when stdout
// is not a TTY or NO_COLOR is set, so piped/CI output stays clean.
const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;
const wrap = (open: number, close: number) => (s: string) =>
  useColor ? `[${open}m${s}[${close}m` : s;

export const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  red: wrap(31, 39),
  cyan: wrap(36, 39),
  magenta: wrap(35, 39),
};
