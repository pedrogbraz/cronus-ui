"use client";

import { cva } from "class-variance-authority";
import { ArrowDownUp, ChevronDown, Equal } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { NumberFlow } from "./number-flow.js";

/** Skiper 22 layout spring — same bounce as 3 / 75 so width and presence read. */
const SPRING = { type: "spring" as const, bounce: 0.16 };

const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base";

/** Skiper 22 demo rates (ETH → USD / AAVE). Keep byte-stable. */
const DEFAULT_USD_PER_FROM = 3445.86;
const DEFAULT_TO_PER_FROM = 10.87;
const DEFAULT_BALANCE = 111.82;

export const tokenSwapVariants = cva(
  "flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl px-4 py-10 text-white bg-[#131313]", // contract-ok: Aave swap chrome the component paints
);

export interface TokenSwapAsset {
  name: string;
  symbol: string;
  icon?: ReactNode;
  /** Spendable balance. Read on the from-asset for Max and validation. */
  balance?: number;
}

export interface TokenSwapLabels {
  use: string;
  using: string;
  max: string;
  clear: string;
  amount: string;
  /** `{symbol}` is replaced with the from-asset symbol. */
  notEnough: string;
  /** `{symbol}` is replaced with the to-asset symbol. */
  receive: string;
}

export interface TokenSwapProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "defaultValue" | "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  ref?: Ref<HTMLDivElement>;
  from?: TokenSwapAsset;
  to?: TokenSwapAsset;
  /** USD per 1 unit of the from-asset. */
  usdPerFrom?: number;
  /** To-asset units received per 1 unit of the from-asset. */
  toPerFrom?: number;
  locale?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (amount: string, parsed: number) => void;
  labels?: Partial<TokenSwapLabels>;
}

const DEFAULT_LABELS: TokenSwapLabels = {
  use: "Use",
  using: "Using",
  max: "Max",
  clear: "Clear",
  amount: "Amount",
  notEnough: "Not Enough {symbol}",
  receive: "Receive {symbol}",
};

function sanitizeAmount(raw: string): string {
  let next = raw.replace(/[^\d.]/g, "");
  const dot = next.indexOf(".");
  if (dot !== -1) {
    next = `${next.slice(0, dot + 1)}${next.slice(dot + 1).replace(/\./g, "")}`;
  }
  if (next.startsWith(".")) next = `0${next}`;
  return next;
}

function parseAmount(raw: string): number {
  if (raw === "" || raw === ".") return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function formatFixed(value: number, locale: string, min: number, max: number): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(value);
}

function fillTemplate(template: string, symbol: string): string {
  return template.replaceAll("{symbol}", symbol);
}

function FlowGlyphs({
  text,
  className,
  reduce,
}: {
  text: string;
  className?: string;
  reduce: boolean;
}) {
  const chars = Array.from(text);
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {chars.map((char, index) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: glyphs are positional; char+index is identity for this string.
          key={`${index}-${char}`}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={reduce ? { duration: 0 } : SPRING}
          className={cn("inline-block", className)}
        >
          {char}
        </motion.span>
      ))}
    </AnimatePresence>
  );
}

function MorphWidth({
  value,
  reduce,
  className,
  children,
}: {
  value: string;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  const innerRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    void value;
    const el = innerRef.current;
    if (!el) return;
    const apply = () => {
      const next = el.scrollWidth;
      setWidth(next > 0 ? next : "auto");
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value]);

  return (
    <motion.span
      className={cn("inline-flex overflow-hidden", className)}
      initial={false}
      animate={{ width }}
      transition={reduce ? { duration: 0 } : SPRING}
    >
      <span ref={innerRef} className="inline-flex whitespace-nowrap">
        {children}
      </span>
    </motion.span>
  );
}

function EthMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 41 41" className={className} aria-hidden="true">
      <circle
        cx="20.5171"
        cy="20.4634"
        r="20.1069"
        fill="#6D7FF9" /* contract-ok: ETH mark the component paints */
      />
      <path
        d="M20.5148 9.28857L20.3477 9.85672V26.3431L20.5148 26.51L28.1676 21.9864L20.5148 9.28857Z"
        fill="#C6C6C6" /* contract-ok: ETH mark the component paints */
      />
      <path d="M20.5161 9.28857L12.8633 21.9864L20.5161 26.51V18.508V9.28857Z" fill="white" />
      <path
        d="M20.5122 27.9573L20.418 28.0721V33.945L20.5122 34.2201L28.1695 23.436L20.5122 27.9573Z"
        fill="#C6C6C6" /* contract-ok: ETH mark the component paints */
      />
      <path d="M20.5161 34.2201V27.9573L12.8633 23.436L20.5161 34.2201Z" fill="white" />
      <path d="M20.5137 26.5093L28.1669 21.9855L20.5137 18.5068V26.5093Z" fill="white" />
      <path
        d="M12.8633 21.9855L20.5165 26.5093V18.5068L12.8633 21.9855Z"
        fill="#C6C6C6" /* contract-ok: ETH mark the component paints */
      />
    </svg>
  );
}

function AaveMark({ className, maskId }: { className?: string; maskId: string }) {
  return (
    <svg viewBox="0 0 45 45" className={className} aria-hidden="true">
      <mask
        id={maskId}
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="45"
        height="45"
      >
        <path d="M44.6772 0.960938H0.677246V44.9609H44.6772V0.960938Z" fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d="M44.6772 22.9724C44.6772 10.8003 34.8378 0.960938 22.6887 0.960938C10.5397 0.960938 0.677246 10.8003 0.677246 22.9724C0.677246 35.1446 10.5166 44.984 22.6887 44.984C34.8609 44.984 44.6772 35.1215 44.6772 22.9724Z"
          fill="#9391F7" /* contract-ok: AAVE mark the component paints */
        />
        <path
          d="M18.5767 24.0349C20.4707 23.7347 21.741 21.9562 21.4408 20.0622C21.1405 18.1683 19.362 16.8979 17.4681 17.1982C15.5741 17.4984 14.3038 19.2769 14.604 21.1709C14.9274 23.0648 16.7059 24.3352 18.5767 24.0349ZM27.6308 24.0349C29.5248 23.7347 30.7951 21.9562 30.4948 20.0622C30.1946 18.1683 28.4161 16.8979 26.5221 17.1982C24.6282 17.4984 23.3578 19.2769 23.6581 21.1709C23.9584 23.0648 25.7368 24.3352 27.6308 24.0349Z"
          fill="white"
        />
        <path
          d="M22.5513 6.34277C13.1508 6.34277 5.52881 14.1034 5.52881 23.6656H9.87107C9.87107 16.4824 15.5067 10.685 22.5282 10.685C29.5729 10.685 35.1855 16.5055 35.1855 23.6656H39.5277C39.5739 14.1034 31.9519 6.34277 22.5513 6.34277Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

/**
 * Aave-style token swap (Skiper 22). Type an amount: digits fade in, the USD
 * readout grows, Max morphs Use → Using, and the receive side rolls via
 * {@link NumberFlow}. Over-balance swaps the USD row for an error.
 */
export function TokenSwap({
  ref,
  from: fromProp,
  to: toProp,
  usdPerFrom = DEFAULT_USD_PER_FROM,
  toPerFrom = DEFAULT_TO_PER_FROM,
  locale = "en-US",
  value: valueProp,
  defaultValue = "",
  onValueChange,
  labels: labelsProp,
  className,
  ...props
}: TokenSwapProps) {
  const reduce = !!useReducedMotion();
  const aaveMaskId = useId();
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const amount = valueProp !== undefined ? valueProp : uncontrolled;
  const parsed = parseAmount(amount);

  const from: TokenSwapAsset = {
    name: "Ethereum",
    symbol: "ETH",
    balance: DEFAULT_BALANCE,
    ...fromProp,
  };
  const to: TokenSwapAsset = {
    name: "Aave",
    symbol: "AAVE",
    ...toProp,
  };
  const balance = from.balance ?? 0;
  const usingMax = parsed >= balance && parsed > 0;
  const insufficient = parsed > balance;
  const usd = parsed * usdPerFrom;
  const receive = parsed * toPerFrom;
  const usdText = formatFixed(usd, locale, 2, 2);
  const prefix = `${usingMax ? labels.using : labels.use} `;
  const displayAmount = amount === "" ? "0" : amount;
  const transition = reduce ? { duration: 0 } : SPRING;

  const setAmount = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next, parseAmount(next));
  };

  const fromIcon = from.icon ?? <EthMark className="size-10" />;
  const toIcon = to.icon ?? <AaveMark className="size-10" maskId={aaveMaskId} />;

  return (
    <div ref={ref} data-slot="token-swap" className={cn(tokenSwapVariants(), className)} {...props}>
      <div
        className={cn(
          "relative flex w-full max-w-[300px] flex-col items-center justify-center gap-5 rounded-3xl border px-3 py-3 sm:max-w-[350px]",
          "border-[#303030]/50 bg-[#121212]", // contract-ok: Aave swap chrome the component paints
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {fromIcon}
            <div>
              <h2 className="text-base font-semibold">{from.name}</h2>
              <p
                className="text-sm whitespace-nowrap text-[#7d7d7d]" // contract-ok: Aave swap muted caption, AA on #121212
              >
                {` ${formatFixed(balance, locale, 0, 2)} ${from.symbol}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label={`${usingMax ? labels.using : labels.use} ${labels.max}`}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold transition-colors",
              FOCUS,
              "bg-[#222] hover:bg-[#333]", // contract-ok: Aave swap chrome the component paints
            )}
            onClick={() =>
              setAmount(
                new Intl.NumberFormat("en-US", {
                  useGrouping: false,
                  maximumFractionDigits: 8,
                }).format(balance),
              )
            }
          >
            <MorphWidth value={prefix} reduce={reduce}>
              <span className="inline-block whitespace-nowrap">{prefix}</span>
            </MorphWidth>
            {labels.max}
          </button>
        </div>
        <div
          className="w-full border-t border-[#303030]/50" // contract-ok: Aave swap chrome the component paints
        />
        <div className="mb-6 flex w-full flex-col items-center justify-center gap-4">
          <div className="relative w-full overflow-hidden text-center">
            <input
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              aria-label={labels.amount}
              aria-invalid={insufficient || undefined}
              onChange={(event) => setAmount(sanitizeAmount(event.target.value))}
              className={cn(
                "inset-0 w-full cursor-pointer text-center text-[45px] font-semibold tracking-tight text-transparent caret-transparent outline-none focus:caret-white",
                FOCUS,
              )}
            />
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <FlowGlyphs
                text={displayAmount}
                reduce={reduce}
                className="text-[45px] font-semibold tracking-tight"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-center gap-2" aria-live="polite">
            <AnimatePresence initial={false}>
              {insufficient ? (
                <motion.p
                  key="err"
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
                  transition={transition}
                  style={{ transformOrigin: "center bottom" }}
                  className="w-max whitespace-nowrap text-center text-lg font-semibold tracking-tight text-error-strong"
                >
                  {fillTemplate(labels.notEnough, from.symbol)}
                </motion.p>
              ) : (
                <motion.div
                  key="usd"
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
                  transition={transition}
                  style={{ transformOrigin: "center top" }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="sr-only">{`$${usdText}`}</span>
                  <div
                    className="rounded-full bg-[#222] p-1" // contract-ok: Aave swap chrome the component paints
                  >
                    <Equal className="size-5" aria-hidden="true" />
                  </div>
                  <MorphWidth
                    value={`$${usdText}`}
                    reduce={reduce}
                    className="items-center justify-between text-lg font-semibold tracking-tight"
                  >
                    <span className="flex" aria-hidden="true">
                      <span>$</span>
                      <FlowGlyphs text={usdText} reduce={reduce} />
                    </span>
                  </MorphWidth>
                  <ArrowDownUp className="size-5" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div
          className={cn(
            "absolute -bottom-6 rounded-full border p-1.5",
            "border-[#303030]/50 bg-[#121212]", // contract-ok: Aave swap chrome the component paints
          )}
        >
          <ChevronDown className="size-5 opacity-50" aria-hidden="true" />
        </div>
      </div>

      <div
        className={cn(
          "flex w-full max-w-[300px] flex-col items-start justify-start gap-5 rounded-3xl border px-3 py-3 sm:max-w-[350px]",
          "border-[#303030]/50 bg-[#121212]", // contract-ok: Aave swap chrome the component paints
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {toIcon}
            <div>
              <h2 className="text-base font-semibold">{to.name}</h2>
              <p
                className="text-sm whitespace-nowrap text-[#7d7d7d]" // contract-ok: Aave swap muted caption, AA on #121212
              >
                {` ${fillTemplate(labels.receive, to.symbol)}`}
              </p>
            </div>
          </div>
          <p className="rounded-full pe-2 text-lg font-semibold">
            <NumberFlow
              value={receive}
              locale={locale}
              minimumFractionDigits={2}
              maximumFractionDigits={3}
              reducedMotion={reduce ? "always" : "user"}
            />
          </p>
        </div>
      </div>

      <button
        type="button"
        className={cn(
          "w-full max-w-[300px] rounded-full py-2 text-white/60 transition-colors sm:max-w-[350px]",
          FOCUS,
          "bg-[#222] hover:bg-[#333]", // contract-ok: Aave swap chrome the component paints
        )}
        onClick={() => setAmount("")}
      >
        {labels.clear}
      </button>
    </div>
  );
}
