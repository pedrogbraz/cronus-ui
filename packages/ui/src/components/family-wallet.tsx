"use client";

import { cva } from "class-variance-authority";
import { ArrowRight, ChevronLeft, Fingerprint, Plus } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type JSX,
  type ReactNode,
  type Ref,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../lib/cn.js";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./input-otp.js";

/** Skiper 21 height tween — cubic, 270ms, not a spring. */
const HEIGHT_TWEEN = { duration: 0.27, ease: [0.25, 1, 0.5, 1] as const };
/** Skiper 21 view cross-fade. */
const VIEW_TWEEN = { duration: 0.27, ease: [0.26, 0.08, 0.25, 1] as const };

const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base";

const VIEW = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96 },
} as const;

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^[+]?[0-9\s()-]{10,}$/;

export const familyWalletVariants = cva(
  "relative flex min-h-[28rem] w-full flex-col items-center justify-center p-5",
);

export type FamilyWalletMethod = "email" | "phone" | "passkey";
export type FamilyWalletView = "sign-in" | "otp" | "passkey" | "wallet";
export type FamilyWalletSocial = "google" | "discord" | "github" | "apple" | "farcaster";
export type FamilyWalletProvider = "metamask" | "coinbase" | "phantom" | "trust" | "other";

export interface FamilyWalletLabels {
  hint: string;
  trigger: string;
  signIn: string;
  close: string;
  back: string;
  email: string;
  phone: string;
  passkey: string;
  passkeyAction: string;
  passkeyWaiting: string;
  passkeyPrompt: string;
  continue: string;
  or: string;
  connectWallet: string;
  confirmEmail: string;
  confirmPhone: string;
  otpHint: string;
  verify: string;
  otp: string;
  noWallet: string;
  otherWallets: string;
  otherCount: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  wallets: Record<FamilyWalletProvider, string>;
  social: Record<FamilyWalletSocial, string>;
}

export interface FamilyWalletProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
  > {
  ref?: Ref<HTMLDivElement>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSocial?: (id: FamilyWalletSocial) => void;
  onContinue?: (method: FamilyWalletMethod, value: string) => void;
  onVerify?: (code: string) => void;
  onWallet?: (id: FamilyWalletProvider) => void;
  labels?: Partial<FamilyWalletLabels> & {
    wallets?: Partial<FamilyWalletLabels["wallets"]>;
    social?: Partial<FamilyWalletLabels["social"]>;
  };
}

const DEFAULT_LABELS: FamilyWalletLabels = {
  hint: "Click to open sign in",
  trigger: "Sign In",
  signIn: "Sign In",
  close: "Close",
  back: "Back",
  email: "Email",
  phone: "Phone",
  passkey: "Passkey",
  passkeyAction: "Login with passkey",
  passkeyWaiting: "Waiting for passkey",
  passkeyPrompt: "Please follow prompts to verify your passkey.",
  continue: "Continue",
  or: "Or",
  connectWallet: "Connect Wallet",
  confirmEmail: "Confirm Email",
  confirmPhone: "Confirm Phone",
  otpHint: "Enter the verification code sent to",
  verify: "Verify Code",
  otp: "Verification code",
  noWallet: "I Don't Have a Wallet",
  otherWallets: "Other Wallets",
  otherCount: "350+",
  emailPlaceholder: "yo@gxuri.me",
  phonePlaceholder: "+1 (555) 123-4567",
  wallets: {
    metamask: "Metamask",
    coinbase: "Coinbase",
    phantom: "Phantom",
    trust: "Trust Wallet",
    other: "Other Wallets",
  },
  social: {
    google: "Sign in with Google",
    discord: "Sign in with Discord",
    github: "Sign in with GitHub",
    apple: "Sign in with Apple",
    farcaster: "Sign in with Farcaster",
  },
};

const SOCIALS: FamilyWalletSocial[] = ["google", "discord", "github", "apple", "farcaster"];
const WALLETS: FamilyWalletProvider[] = ["metamask", "coinbase", "phantom", "trust", "other"];
const METHODS: FamilyWalletMethod[] = ["email", "phone", "passkey"];

function IconGoogle() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"
      />
    </svg>
  );
}

function IconDiscord() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.2 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"
      />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
      />
    </svg>
  );
}

function IconApple() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
      />
    </svg>
  );
}

function IconWallet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("size-5", className)} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z"
      />
    </svg>
  );
}

function WalletMark({ id }: { id: FamilyWalletProvider }) {
  const gid = `family-wallet-trust-${useId().replace(/:/g, "")}`;
  if (id === "coinbase") {
    return (
      <svg viewBox="0 0 20 20" className="size-6" aria-hidden="true">
        <circle
          cx="10"
          cy="10"
          r="10"
          fill="#0852FF" /* contract-ok: Coinbase mark the component paints */
        />
        <rect
          rx="27%"
          width="20"
          height="20"
          fill="#0852FF" /* contract-ok: Coinbase mark the component paints */
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.0001 17C13.8661 17 17.0001 13.866 17.0001 10C17.0001 6.13401 13.8661 3 10.0001 3C6.13413 3 3.00012 6.13401 3.00012 10C3.00012 13.866 6.13413 17 10.0001 17ZM8.25012 7.71429C7.95427 7.71429 7.71441 7.95414 7.71441 8.25V11.75C7.71441 12.0459 7.95427 12.2857 8.25012 12.2857H11.7501C12.046 12.2857 12.2858 12.0459 12.2858 11.75V8.25C12.2858 7.95414 12.046 7.71429 11.7501 7.71429H8.25012Z"
          fill="white"
        />
      </svg>
    );
  }
  if (id === "phantom") {
    return (
      <span
        className="flex size-6 items-center justify-center rounded-full bg-[#AB9EF2]" // contract-ok: Phantom mark the component paints
      >
        <svg viewBox="0 0 593 493" className="size-4" aria-hidden="true">
          <path
            fill="#FFFDF8" /* contract-ok: Phantom mark the component paints */
            d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z"
          />
        </svg>
      </span>
    );
  }
  if (id === "trust") {
    return (
      <svg viewBox="0 0 24 24" className="size-8" aria-hidden="true">
        <path
          fill="#0500FF" /* contract-ok: Trust Wallet mark the component paints */
          d="M3.9 5.6 12 3v18c-5.786-2.4-8.1-7-8.1-9.6z"
        />
        <path fill={`url(#${gid})`} d="M20.1 5.6 12 3v18c5.786-2.4 8.1-7 8.1-9.6z" />
        <defs>
          <linearGradient id={gid} x1="17.948" x2="11.967" y1="1.74" y2="20.797">
            <stop
              offset=".02"
              stopColor="#00F" /* contract-ok: Trust Wallet mark the component paints */
            />
            <stop
              offset=".08"
              stopColor="#0094FF" /* contract-ok: Trust Wallet mark the component paints */
            />
            <stop
              offset=".16"
              stopColor="#48FF91" /* contract-ok: Trust Wallet mark the component paints */
            />
            <stop
              offset=".42"
              stopColor="#0094FF" /* contract-ok: Trust Wallet mark the component paints */
            />
            <stop
              offset=".68"
              stopColor="#0038FF" /* contract-ok: Trust Wallet mark the component paints */
            />
            <stop
              offset=".9"
              stopColor="#0500FF" /* contract-ok: Trust Wallet mark the component paints */
            />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (id === "other") {
    return (
      <span className="flex size-9 items-center justify-center rounded-lg border border-fg/10 bg-surface-inset text-fg-tertiary">
        <IconWallet className="size-5 opacity-45" />
      </span>
    );
  }
  return (
    <svg viewBox="0 0 256 240" className="size-6" aria-hidden="true">
      <path
        fill="#E17726" /* contract-ok: Metamask mark the component paints */
        d="M250.066 0 140.219 81.279l20.427-47.9z"
      />
      <path
        fill="#E27625" /* contract-ok: Metamask mark the component paints */
        d="m6.191.096 89.181 33.289 19.396 48.528zM205.86 172.858l48.551.924-16.968 57.642-59.243-16.311zm-155.721 0 27.557 42.255-59.143 16.312-16.865-57.643z"
      />
      <path
        fill="#E27625" /* contract-ok: Metamask mark the component paints */
        d="m112.131 69.552 1.984 64.083-59.371-2.701 16.888-25.478.214-.245zm31.123-.715 40.9 36.376.212.244 16.888 25.478-59.358 2.7zM79.435 173.044l32.418 25.259-37.658 18.181zm97.136-.004 5.131 43.445-37.553-18.184z"
      />
      <path
        fill="#D5BFB2" /* contract-ok: Metamask mark the component paints */
        d="m144.978 195.922 38.107 18.452-35.447 16.846.368-11.134zm-33.967.008-2.909 23.974.239 11.303-35.53-16.833z"
      />
      <path
        fill="#233447" /* contract-ok: Metamask mark the component paints */
        d="m100.007 141.999 9.958 20.928-33.903-9.932zm55.985.002 24.058 10.994-34.014 9.929z"
      />
      <path
        fill="#CC6228" /* contract-ok: Metamask mark the component paints */
        d="m82.026 172.83-5.48 45.04-29.373-44.055zm91.95.001 34.854.984-29.483 44.057zm28.136-44.444-25.365 25.851-19.557-8.937-9.363 19.684-6.138-33.849zm-148.237 0 60.435 2.749-6.139 33.849-9.365-19.681-19.453 8.935z"
      />
      <path
        fill="#E27525" /* contract-ok: Metamask mark the component paints */
        d="m52.166 123.082 28.698 29.121.994 28.749zm151.697-.052-29.746 57.973 1.12-28.8zm-90.956 1.826 1.155 7.27 2.854 18.111-1.835 55.625-8.675-44.685-.003-.462zm30.171-.101 6.521 35.96-.003.462-8.697 44.797-.344-11.205-1.357-44.862z"
      />
      <path
        fill="#F5841F" /* contract-ok: Metamask mark the component paints */
        d="m177.788 151.046-.971 24.978-30.274 23.587-6.12-4.324 6.86-35.335zm-99.471 0 30.399 8.906 6.86 35.335-6.12 4.324-30.275-23.589z"
      />
      <path
        fill="#C0AC9D" /* contract-ok: Metamask mark the component paints */
        d="m67.018 208.858 38.732 18.352-.164-7.837 3.241-2.845h38.334l3.358 2.835-.248 7.831 38.487-18.29-18.728 15.476-22.645 15.553h-38.869l-22.63-15.617z"
      />
      <path
        fill="#161616" /* contract-ok: Metamask mark the component paints */
        d="m142.204 193.479 5.476 3.869 3.209 25.604-4.644-3.921h-36.476l-4.556 4 3.104-25.681 5.478-3.871z"
      />
      <path
        fill="#763E1A" /* contract-ok: Metamask mark the component paints */
        d="M242.814 2.25 256 41.807l-8.235 39.997 5.864 4.523-7.935 6.054 5.964 4.606-7.897 7.191 4.848 3.511-12.866 15.026-52.77-15.365-.457-.245-38.027-32.078zm-229.628 0 98.326 72.777-38.028 32.078-.457.245-52.77 15.365-12.866-15.026 4.844-3.508-7.892-7.194 5.952-4.601-8.054-6.071L6.085 41.809 0 41.809z"
      />
      <path
        fill="#F5841F" /* contract-ok: Metamask mark the component paints */
        d="m180.392 103.99 55.913 16.279 18.165 55.986h-47.924l-33.02.416 24.014-46.808zm-104.784 0-17.151 25.873 24.017 46.808-33.005-.416H1.631l18.063-55.985zm87.776-70.878-15.639 42.239-3.319 57.06-1.27 17.885-.101 45.688h-30.111l-.098-45.602-1.274-17.986-3.32-57.045-15.637-42.239z"
      />
    </svg>
  );
}

const SOCIAL_ICON: Record<FamilyWalletSocial, () => JSX.Element> = {
  google: IconGoogle,
  discord: IconDiscord,
  github: IconGithub,
  apple: IconApple,
  farcaster: IconX,
};

function MovingBorder({
  children,
  duration = 3000,
  rx,
  ry,
  ...props
}: {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
} & ComponentPropsWithoutRef<"svg">) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const path = pathRef.current;
    if (!path || typeof path.getTotalLength !== "function") return;
    const length = path.getTotalLength();
    if (!length) return;
    progress.set(((length / duration) * time) % length);
  });

  const x = useTransform(progress, (value) => pathRef.current?.getPointAtLength(value)?.x ?? 0);
  const y = useTransform(progress, (value) => pathRef.current?.getPointAtLength(value)?.y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute size-full"
        width="100%"
        height="100%"
        aria-hidden="true"
        {...props}
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0, // contract-ok: traveling blob is keyed on SVG path coordinates
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
}

function PasskeyOrb({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden bg-transparent p-[6px] text-xl"
      style={{ borderRadius: 30 }}
    >
      <div className="absolute inset-0" style={{ borderRadius: "calc(30px * 0.96)" }}>
        <MovingBorder duration={1500} rx="30%" ry="30%">
          <div
            className="h-20 w-20 opacity-80 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)]" // contract-ok: Family passkey orb the component paints
          />
        </MovingBorder>
      </div>
      <div
        className="relative flex size-20 items-center justify-center border-[3px] border-surface-overlay bg-surface-overlay text-fg outline outline-[3px] outline-surface-inset"
        style={{ borderRadius: "calc(30px * 0.96)" }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Family wallet (Skiper 21). A Sign In trigger opens a rounded vaul drawer
 * with socials, Email/Phone/Passkey, OTP, a waiting-passkey orb, and a wallet
 * list. Inner views pop-layout while the shell height tweens to the measured
 * content (270ms cubic).
 */
export function FamilyWallet({
  ref,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSocial,
  onContinue,
  onVerify,
  onWallet,
  labels: labelsProp,
  className,
  ...props
}: FamilyWalletProps) {
  const reduce = !!useReducedMotion();
  const pillId = useId();
  const labels: FamilyWalletLabels = {
    ...DEFAULT_LABELS,
    ...labelsProp,
    wallets: { ...DEFAULT_LABELS.wallets, ...labelsProp?.wallets },
    social: { ...DEFAULT_LABELS.social, ...labelsProp?.social },
  };
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : uncontrolled;
  const [view, setView] = useState<FamilyWalletView>("sign-in");
  const [method, setMethod] = useState<FamilyWalletMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const measureRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(388);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
    if (!next) {
      setView("sign-in");
      setOtp("");
    }
  };

  useLayoutEffect(() => {
    void view;
    void method;
    void open;
    const el = measureRef.current;
    if (!el) return;
    const apply = () => {
      const next = el.scrollHeight;
      if (next > 0) setHeight(next);
    };
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [view, method, open]);

  const heightTween = reduce ? { duration: 0 } : HEIGHT_TWEEN;
  const viewTween = reduce ? { duration: 0 } : VIEW_TWEEN;
  const destination = method === "phone" ? phone : email;
  const canContinue =
    method === "passkey"
      ? true
      : method === "phone"
        ? PHONE_RE.test(phone.trim())
        : EMAIL_RE.test(email.trim());

  const goContinue = () => {
    if (method === "passkey") {
      onContinue?.("passkey", "");
      setView("passkey");
      return;
    }
    if (!canContinue) return;
    onContinue?.(method, destination);
    setView("otp");
  };

  const roundBtn = cn(
    "flex size-8 items-center justify-center rounded-full bg-surface-base text-fg transition-transform focus:scale-95 active:scale-75",
    FOCUS,
  );

  return (
    <div
      ref={ref}
      data-slot="family-wallet"
      className={cn(familyWalletVariants(), className)}
      {...props}
    >
      {labels.hint ? (
        <p className="absolute inset-x-0 top-12 mx-auto max-w-[12ch] text-center text-xs uppercase leading-tight text-fg-tertiary opacity-40 after:absolute after:start-1/2 after:top-full after:h-16 after:w-px after:-translate-x-1/2 after:bg-gradient-to-b after:from-transparent after:to-fg after:content-[''] rtl:after:translate-x-1/2">
          {labels.hint}
        </p>
      ) : null}

      <DrawerPrimitive.Root open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
        <DrawerPrimitive.Trigger asChild>
          <button
            type="button"
            data-slot="family-wallet-trigger"
            tabIndex={open ? -1 : undefined}
            className={cn("rounded-full bg-surface-overlay px-4 py-2 text-fg", FOCUS)}
          >
            {labels.trigger}
          </button>
        </DrawerPrimitive.Trigger>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-surface-base/80 backdrop-blur-sm" />
          <DrawerPrimitive.Content
            data-slot="family-wallet-drawer"
            className="fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-[361px] overflow-hidden rounded-[36px] bg-surface-base text-fg outline-none"
          >
            <DrawerPrimitive.Title className="sr-only">{labels.signIn}</DrawerPrimitive.Title>
            <motion.div
              initial={false}
              animate={{ height, transition: heightTween }}
              className="overflow-hidden"
            >
              <DrawerPrimitive.Close asChild>
                <button
                  type="button"
                  aria-label={labels.close}
                  className={cn(roundBtn, "absolute end-6 top-5 z-10")}
                >
                  <Plus className="size-4 rotate-45 opacity-45" aria-hidden="true" />
                </button>
              </DrawerPrimitive.Close>
              <div ref={measureRef} className="bg-surface-inset">
                <AnimatePresence initial={false} mode="popLayout">
                  {view === "otp" ? (
                    <motion.div key="otp" {...VIEW} transition={viewTween}>
                      <div className="flex items-center justify-between gap-3 px-6 py-6 text-center text-xl font-medium">
                        <button
                          type="button"
                          aria-label={labels.back}
                          className={roundBtn}
                          onClick={() => setView("sign-in")}
                        >
                          <ChevronLeft className="size-4 opacity-45" aria-hidden="true" />
                        </button>
                        <h2 className="select-none">
                          {method === "phone" ? labels.confirmPhone : labels.confirmEmail}
                        </h2>
                        <span className="size-8 opacity-0" />
                      </div>
                      <div className="space-y-6 px-6 text-center">
                        <div>
                          <p className="text-fg-tertiary">{labels.otpHint}</p>
                          <p className="font-medium">{destination}</p>
                        </div>
                        <div className="space-y-4">
                          <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={setOtp}
                            aria-label={labels.otp}
                            containerClassName="flex w-full justify-between gap-3"
                          >
                            <InputOTPGroup className="flex w-full justify-between gap-3">
                              {Array.from({ length: 6 }, (_, index) => (
                                <InputOTPSlot
                                  // biome-ignore lint/suspicious/noArrayIndexKey: OTP slots are positional.
                                  key={index}
                                  index={index}
                                  className="h-11 w-full rounded-xl border-none bg-surface-overlay first:rounded-xl last:rounded-xl data-[active=true]:ring-fg/20"
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                          <button
                            type="button"
                            className={cn(
                              "mb-6 w-full rounded-full py-3 font-semibold text-white bg-[#22c55e] transition-colors", // contract-ok: Family Verify fill the component paints
                              FOCUS,
                            )}
                            onClick={() => onVerify?.(otp)}
                          >
                            {labels.verify}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : view === "passkey" ? (
                    <motion.div key="passkey" {...VIEW} transition={viewTween}>
                      <div className="flex items-center justify-between gap-3 px-6 py-6 text-center text-xl font-medium">
                        <button
                          type="button"
                          aria-label={labels.back}
                          className={roundBtn}
                          onClick={() => setView("sign-in")}
                        >
                          <ChevronLeft className="size-4 opacity-45" aria-hidden="true" />
                        </button>
                        <h2 className="select-none">{labels.passkey}</h2>
                        <span className="size-8 opacity-0" />
                      </div>
                      <div className="flex flex-col items-center justify-center space-y-6 px-6 text-center">
                        <PasskeyOrb>
                          <Fingerprint className="size-8 opacity-45" aria-hidden="true" />
                        </PasskeyOrb>
                        <div>
                          <h3 className="text-xl font-medium">{labels.passkeyWaiting}</h3>
                          <p className="mt-1 max-w-[16rem] text-pretty text-sm text-fg-tertiary">
                            {labels.passkeyPrompt}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={cn(
                            "mb-6 w-full rounded-full py-3 font-semibold text-white bg-[#4EAFFF] transition-colors", // contract-ok: Family Connect Wallet fill the component paints
                            FOCUS,
                          )}
                          onClick={() => setView("sign-in")}
                        >
                          {labels.continue}
                        </button>
                      </div>
                    </motion.div>
                  ) : view === "wallet" ? (
                    <motion.div key="wallet" {...VIEW} transition={viewTween}>
                      <div className="flex items-center justify-between gap-3 px-6 py-6 text-center text-xl font-medium">
                        <button
                          type="button"
                          aria-label={labels.back}
                          className={roundBtn}
                          onClick={() => setView("sign-in")}
                        >
                          <ChevronLeft className="size-4 opacity-45" aria-hidden="true" />
                        </button>
                        <h2 className="select-none">{labels.connectWallet}</h2>
                        <span className="size-8 opacity-0" />
                      </div>
                      <div className="space-y-2 px-6 pb-6">
                        {WALLETS.map((id) => (
                          <button
                            key={id}
                            type="button"
                            className={cn(
                              "flex h-[3.75rem] w-full cursor-pointer items-center justify-between rounded-2xl bg-surface-overlay px-4 hover:bg-surface-raised",
                              FOCUS,
                            )}
                            onClick={() => onWallet?.(id)}
                          >
                            {id === "other" ? (
                              <span className="flex items-center gap-3">
                                <span className="text-lg font-medium">{labels.otherWallets}</span>
                                <span className="rounded-full border border-fg/10 bg-surface-inset px-2 py-1 text-xs font-medium text-fg-tertiary">
                                  {labels.otherCount}
                                </span>
                              </span>
                            ) : (
                              <span className="text-lg font-medium">{labels.wallets[id]}</span>
                            )}
                            <WalletMark id={id} />
                          </button>
                        ))}
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center justify-center gap-2 pb-3 pt-6 font-medium text-fg-tertiary hover:text-fg",
                            FOCUS,
                          )}
                          onClick={() => onWallet?.("other")}
                        >
                          <IconWallet />
                          {labels.noWallet}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="sign-in" {...VIEW} transition={viewTween}>
                      <h2 className="px-6 py-6 text-center text-xl font-medium">
                        <span className="select-none">{labels.signIn}</span>
                      </h2>
                      <div className="flex flex-col gap-4 pt-2">
                        <div className="flex flex-col gap-2 px-6">
                          <div className="flex w-full items-center justify-center gap-2">
                            {SOCIALS.map((id) => {
                              const Icon = SOCIAL_ICON[id];
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  aria-label={labels.social[id]}
                                  className={cn(
                                    "flex h-12 w-full items-center justify-center rounded-xl bg-surface-overlay transition-all duration-200 ease-out active:scale-95 hover:bg-surface-raised",
                                    FOCUS,
                                  )}
                                  onClick={() => onSocial?.(id)}
                                >
                                  <Icon />
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex h-12 w-full items-center rounded-2xl bg-surface-overlay px-1">
                            <div className="relative mx-auto flex w-full items-center">
                              {METHODS.map((id) => {
                                const active = method === id;
                                return (
                                  <button
                                    key={id}
                                    type="button"
                                    aria-label={`Select ${labels[id]}`}
                                    className={cn(
                                      "relative flex h-10 w-full cursor-pointer items-center justify-center px-3 py-1.5 text-center text-base transition-colors duration-200 ease-out",
                                      active ? "text-fg" : "text-fg-tertiary",
                                      FOCUS,
                                    )}
                                    onClick={() => setMethod(id)}
                                  >
                                    {active ? (
                                      <motion.span
                                        layoutId={`${pillId}-tab`}
                                        className="absolute inset-0 rounded-xl bg-fg/5"
                                      />
                                    ) : null}
                                    <span className="relative select-none">{labels[id]}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex h-12 w-full items-center justify-start gap-3 overflow-hidden rounded-2xl bg-surface-overlay pe-1 ps-4 text-base">
                            <div className="flex w-full items-center justify-start">
                              {method === "passkey" ? (
                                <div className="flex items-center gap-3">
                                  <Fingerprint
                                    className="size-6 text-fg-tertiary"
                                    aria-hidden="true"
                                  />
                                  <span className="w-full text-base font-medium opacity-50">
                                    {labels.passkeyAction}
                                  </span>
                                </div>
                              ) : (
                                <input
                                  type={method === "phone" ? "tel" : "email"}
                                  placeholder={
                                    method === "phone"
                                      ? labels.phonePlaceholder
                                      : labels.emailPlaceholder
                                  }
                                  value={method === "phone" ? phone : email}
                                  onChange={(event) =>
                                    method === "phone"
                                      ? setPhone(event.target.value)
                                      : setEmail(event.target.value)
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") goContinue();
                                  }}
                                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-fg-tertiary disabled:cursor-not-allowed disabled:opacity-50"
                                />
                              )}
                            </div>
                            <button
                              type="button"
                              aria-label={labels.continue}
                              disabled={!canContinue}
                              className={cn(
                                "flex h-10 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-all duration-200 ease-out",
                                FOCUS,
                                canContinue
                                  ? "cursor-pointer bg-[#4EAFFF] text-white hover:bg-[#4EAFFF]/90 active:scale-95" // contract-ok: Family Connect Wallet fill the component paints
                                  : "cursor-not-allowed bg-surface-inset text-fg-tertiary",
                              )}
                              onClick={goContinue}
                            >
                              <ArrowRight className="size-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4 px-6 pb-6">
                          <div className="relative">
                            <div className="absolute inset-0 flex h-10 items-center">
                              <span className="w-full rounded-full border-t border-border opacity-20" />
                            </div>
                            <div className="relative flex h-10 justify-center text-xs uppercase">
                              <span className="flex items-center justify-center bg-surface-inset px-2 font-medium text-fg-tertiary">
                                {labels.or}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={cn(
                              "flex h-12 w-full cursor-pointer select-none items-center justify-center gap-2 rounded-full text-base font-semibold text-white bg-[#4EAFFF] transition-all duration-200 ease-out hover:bg-[#4EAFFF]/80 focus:scale-95 active:scale-95", // contract-ok: Family Connect Wallet fill the component paints
                              FOCUS,
                            )}
                            onClick={() => setView("wallet")}
                          >
                            <IconWallet />
                            {labels.connectWallet}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    </div>
  );
}
