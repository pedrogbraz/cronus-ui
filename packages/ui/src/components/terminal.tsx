"use client";

import {
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";
import { CopyButton } from "./copy-button.js";

/**
 * Grapheme segmenter so char-by-char typing never splits a user-perceived
 * character. Slicing by UTF-16 code units shatters emoji (✅, 🇧🇷) and complex
 * scripts mid-glyph; segmenting by grapheme types each cluster as one unit.
 * Null on platforms without `Intl.Segmenter`, where we fall back to code
 * points (still safe for surrogate pairs).
 */
const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function segmentGraphemes(text: string): string[] {
  if (graphemeSegmenter) {
    return Array.from(graphemeSegmenter.segment(text), (segment) => segment.segment);
  }
  return Array.from(text);
}

/** One line of the terminal script. */
export interface TerminalLine {
  /**
   * `"input"` lines render behind the prompt and type in char-by-char with a
   * blinking block cursor; `"output"` lines fade in whole, like a command's
   * result being printed.
   */
  type: "input" | "output";
  /** The line's text, rendered verbatim (whitespace is preserved). */
  text: string;
  /**
   * Milliseconds to wait before this line starts — before typing begins for
   * inputs, before the reveal for outputs. Defaults to 400 for inputs (the
   * prompt sits with a blinking cursor, like a person pausing) and 150 for
   * outputs (a beat of "execution time").
   */
  delay?: number;
}

/**
 * Whether the session animates. `"respect"` (default) honours the visitor's
 * `prefers-reduced-motion` setting — reduced-motion visitors get the full
 * transcript instantly. `"always"` forces the animation (e.g. a showcase that
 * must demonstrate it); `"never"` always renders the finished transcript.
 */
export type TerminalMotionPreference = "respect" | "always" | "never";

export interface TerminalProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The scripted session, played from first to last. */
  lines: TerminalLine[];
  /** Title shown centered in the chrome bar (e.g. `"zsh"` or a file path). */
  title?: string;
  /** Render the macOS-style chrome bar (three dots + title). Defaults to `true`. */
  chrome?: boolean;
  /** Prompt glyph rendered before each input line. Defaults to `"$"`. */
  prompt?: string;
  /** Milliseconds per typed character. Defaults to `30`. */
  typingSpeed?: number;
  /** Restart the script from the top after it finishes. Defaults to `false`. */
  loop?: boolean;
  /** Milliseconds the finished transcript rests before a loop restarts. Defaults to `2000`. */
  loopDelay?: number;
  /**
   * Show a copy button that copies the joined `input` commands (one per line,
   * without the prompt) — the exact text a reader wants to paste into their
   * own shell. Defaults to `true`; hidden automatically when the script has
   * no input lines.
   */
  copyButton?: boolean;
  /**
   * Whether the typing animation plays vs. honours `prefers-reduced-motion`:
   * `"respect"` (default), `"always"` (force motion), or `"never"` (always
   * static).
   */
  motionPreference?: TerminalMotionPreference;
}

const DEFAULT_TYPING_SPEED = 30;
const DEFAULT_LOOP_DELAY = 2000;
const DEFAULT_INPUT_DELAY = 400;
const DEFAULT_OUTPUT_DELAY = 150;

/**
 * Fixed (not per-instance) keyframe names are safe here because every
 * instance declares the exact same frames — later identical declarations are
 * no-ops. Output lines rise-and-fade in; `both` keeps them visible after the
 * animation so finished lines never flicker. The blinking cursor reuses the
 * theme's `animate-caret-blink` utility.
 */
const TERMINAL_KEYFRAMES =
  "@keyframes cronus-terminal-fade{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:none}}";

interface TerminalProgress {
  /** Lines `0..revealed-1` are fully shown; `lines[revealed]` is the active line. */
  revealed: number;
  /** Graphemes typed of the active input line. */
  typedChars: number;
}

function finitePositive(value: number, fallback: number): number {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

interface TerminalRowProps {
  line: TerminalLine;
  prompt: string;
  /** Graphemes to show; `undefined` renders the whole line. */
  typedChars?: number;
  /** Blinking block cursor after the shown text (active input line only). */
  showCursor?: boolean;
  /** Play the output fade-in (only while the script is animating). */
  reveal?: boolean;
}

/**
 * One rendered line. Input lines carry the prompt in `text-fg-tertiary` and
 * the command in `text-fg`; output lines print flush-left in
 * `text-fg-secondary`, matching a real shell.
 */
function TerminalRow({
  line,
  prompt,
  typedChars,
  showCursor = false,
  reveal = false,
}: TerminalRowProps) {
  const isInput = line.type === "input";
  const graphemes = useMemo(() => segmentGraphemes(line.text), [line.text]);
  const shown = typedChars === undefined ? line.text : graphemes.slice(0, typedChars).join("");

  return (
    <div
      data-slot="terminal-line"
      data-line-type={line.type}
      className={cn(
        "flex gap-2",
        !isInput &&
          reveal &&
          "[animation:cronus-terminal-fade_240ms_ease-out_both] motion-reduce:[animation:none]",
      )}
    >
      {isInput ? (
        <span data-slot="terminal-prompt" className="select-none text-fg-tertiary">
          {prompt}
        </span>
      ) : null}
      <span
        className={cn(
          "min-w-0 flex-1 whitespace-pre-wrap break-words",
          isInput ? "text-fg" : "text-fg-secondary",
        )}
      >
        {shown}
        {showCursor ? (
          <span
            data-slot="terminal-cursor"
            className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] rounded-[1px] bg-fg animate-caret-blink"
          />
        ) : null}
      </span>
    </div>
  );
}

/**
 * An animated terminal window that replays a scripted shell session. Input
 * lines type in char-by-char behind a `$` prompt with a blinking block
 * cursor; output lines fade in whole after a beat of "execution time". The
 * script is driven by a single chain of `setTimeout`s (one live timer at any
 * moment, fully cleaned up on unmount/restart) that advances a tiny
 * `{ revealed, typedChars }` state — no per-frame work, no layout thrash.
 *
 * **SSR-safe:** the server (and the hydration pass) renders the *finished*
 * transcript, so no-JS readers and crawlers see the real content and there is
 * no hydration mismatch. A layout effect flips to the animated state before
 * first paint, so animated visitors never see a flash of the full transcript.
 *
 * **Reduced motion:** `prefers-reduced-motion` (or
 * {@link TerminalProps.motionPreference} `"never"`) renders everything
 * instantly — no typing, no cursor, no fades — and the preference is tracked
 * live via `matchMedia`.
 *
 * **No layout shift:** an invisible copy of the finished transcript sits
 * in-flow as a sizer and the animation plays in an absolutely-positioned
 * overlay, so the window is final-size from the first frame and looping never
 * collapses the page.
 *
 * **Accessibility:** the animated pane is `aria-hidden`; assistive tech gets
 * the complete transcript immediately from a visually-hidden `<pre>` (no
 * live-region spam, no half-typed announcements). The scrollable body is
 * keyboard-focusable with a visible focus ring, and the copy button copies
 * the joined input commands.
 */
export const Terminal = forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      lines,
      title,
      chrome = true,
      prompt = "$",
      typingSpeed = DEFAULT_TYPING_SPEED,
      loop = false,
      loopDelay = DEFAULT_LOOP_DELAY,
      copyButton = true,
      motionPreference = "respect",
      className,
      ...props
    },
    ref,
  ) => {
    const [mounted, setMounted] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [progress, setProgress] = useState<TerminalProgress>({ revealed: 0, typedChars: 0 });

    const safeTypingSpeed = Math.max(finitePositive(typingSpeed, DEFAULT_TYPING_SPEED), 1);
    const safeLoopDelay = finitePositive(loopDelay, DEFAULT_LOOP_DELAY);

    // Content signature: identity-stable across parent re-renders (an inline
    // `lines={[...]}` literal must NOT restart the session every render), yet
    // changes whenever the script's content actually changes.
    const signature = useMemo(
      () => lines.map((line) => `${line.type}${line.text}${line.delay ?? ""}`).join(""),
      [lines],
    );

    // The engine reads lines through a ref at tick time so a same-content,
    // new-identity array never restarts (nor stales) a running session. This
    // effect is declared BEFORE the engine effect so the ref is fresh by the
    // time a signature change re-runs the script.
    const linesRef = useRef(lines);
    useEffect(() => {
      linesRef.current = lines;
    });

    // Mount + reduced-motion resolve in ONE layout effect (before first
    // client paint): the SSR/hydration render shows the finished transcript,
    // and by the time the browser paints we already know whether to animate —
    // reduced-motion visitors never see content clear, animated visitors
    // never see it flash.
    useLayoutEffect(() => {
      setMounted(true);
      if (typeof window.matchMedia !== "function") return;
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(query.matches);
      const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    }, []);

    const animate =
      motionPreference === "never"
        ? false
        : motionPreference === "always"
          ? mounted
          : mounted && !reducedMotion;

    // The script engine: a chain of setTimeouts advancing one shared timer.
    // biome-ignore lint/correctness/useExhaustiveDependencies: `signature` stands in for `lines` (restart on content change, not identity change); the line data itself is read from `linesRef` at tick time.
    useEffect(() => {
      if (!animate) return;
      let disposed = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const run = (index: number) => {
        if (disposed) return;
        const script = linesRef.current;
        setProgress({ revealed: Math.min(index, script.length), typedChars: 0 });
        if (index >= script.length) {
          if (loop && script.length > 0) {
            timer = setTimeout(() => run(0), safeLoopDelay);
          }
          return;
        }
        const line = script[index];
        if (!line) return;
        const wait =
          line.delay ?? (line.type === "input" ? DEFAULT_INPUT_DELAY : DEFAULT_OUTPUT_DELAY);
        if (line.type === "output") {
          // Outputs reveal atomically after their delay; the fade is CSS.
          timer = setTimeout(() => run(index + 1), wait);
          return;
        }
        const graphemes = segmentGraphemes(line.text);
        const typeChar = (count: number) => {
          if (disposed) return;
          setProgress({ revealed: index, typedChars: count });
          if (count >= graphemes.length) {
            run(index + 1);
            return;
          }
          timer = setTimeout(() => typeChar(count + 1), safeTypingSpeed);
        };
        timer = setTimeout(() => typeChar(graphemes.length > 0 ? 1 : 0), wait);
      };

      run(0);
      return () => {
        disposed = true;
        if (timer !== undefined) clearTimeout(timer);
      };
    }, [animate, signature, loop, safeLoopDelay, safeTypingSpeed]);

    const totalLines = lines.length;
    const revealedCount = animate ? Math.min(progress.revealed, totalLines) : totalLines;
    const activeLine = animate ? lines[progress.revealed] : undefined;
    const finished = revealedCount >= totalLines;

    const copyValue = useMemo(
      () =>
        lines
          .filter((line) => line.type === "input")
          .map((line) => line.text)
          .join("\n"),
      [lines],
    );
    const showCopy = copyButton && copyValue.length > 0;

    const transcript = useMemo(
      () =>
        lines
          .map((line) => (line.type === "input" ? `${prompt} ${line.text}` : line.text))
          .join("\n"),
      [lines, prompt],
    );

    const regionLabel = title ? `Terminal, ${title}` : "Terminal";

    return (
      <div
        ref={ref}
        data-slot="terminal"
        data-state={!animate ? "static" : finished ? "done" : "animating"}
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-surface-inset text-fg shadow-sm",
          className,
        )}
        {...props}
      >
        <style>{TERMINAL_KEYFRAMES}</style>
        {chrome ? (
          <div
            data-slot="terminal-chrome"
            className="flex items-center gap-2 border-b border-border bg-surface-raised px-4 py-2.5"
          >
            {/* Decorative macOS traffic lights — status tokens, never raw hex. */}
            <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-error/80" />
              <span className="size-2.5 rounded-full bg-warning/80" />
              <span className="size-2.5 rounded-full bg-success/80" />
            </div>
            <span
              data-slot="terminal-title"
              className="min-w-0 flex-1 select-none truncate text-center text-xs font-medium text-fg-tertiary"
            >
              {title}
            </span>
            {showCopy ? (
              <CopyButton
                value={copyValue}
                size="icon-sm"
                aria-label="Copy commands"
                className="-mr-1.5 shrink-0"
              />
            ) : (
              // Balances the traffic lights so the title stays centered.
              <span aria-hidden="true" className="w-10 shrink-0" />
            )}
          </div>
        ) : null}

        <div className="relative">
          {!chrome && showCopy ? (
            <CopyButton
              value={copyValue}
              size="icon-sm"
              aria-label="Copy commands"
              className="absolute right-2 top-2 z-10 shrink-0 bg-surface-overlay/80 backdrop-blur-sm"
            />
          ) : null}
          {/*
            The body is keyboard-focusable so long transcripts constrained by a
            height utility can still be scrolled without a pointer (WCAG 2.1.1);
            the aria-label names the region for AT users who focus it.
          */}
          <section
            data-slot="terminal-body"
            // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region is intentionally focusable so keyboard users can scroll it.
            tabIndex={0}
            aria-label={regionLabel}
            className="relative overflow-auto font-mono text-sm leading-relaxed tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            {/* The real content for assistive tech: complete, immediate, once. */}
            <pre data-slot="terminal-transcript" className="sr-only">
              {transcript}
            </pre>
            <div aria-hidden="true" className="relative p-4">
              {/* In-flow sizer: reserves the finished transcript's dimensions so
                  typing and loop resets never shift the layout around it. */}
              <div data-slot="terminal-sizer" className="invisible">
                {lines.map((line, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: script lines are positional and stable.
                  <TerminalRow key={index} line={line} prompt={prompt} />
                ))}
              </div>
              <div data-slot="terminal-screen" className="absolute inset-0 overflow-hidden p-4">
                {lines.slice(0, revealedCount).map((line, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: script lines are positional and stable.
                  <TerminalRow key={index} line={line} prompt={prompt} reveal={animate} />
                ))}
                {activeLine?.type === "input" ? (
                  <TerminalRow
                    line={activeLine}
                    prompt={prompt}
                    typedChars={progress.typedChars}
                    showCursor
                  />
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  },
);
Terminal.displayName = "Terminal";
