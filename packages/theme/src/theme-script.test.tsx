import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CronusThemeScript } from "./theme-script.js";

function scriptText(storageKey: string, props?: { defaultThemeName?: "aurora" | "neutral" }) {
  const { container, unmount } = render(<CronusThemeScript storageKey={storageKey} {...props} />);
  const el = container.querySelector("script");
  const text = el?.textContent ?? "";
  unmount();
  return { el, text };
}

/** Execute the emitted IIFE source in the jsdom global scope, as a browser would. */
function runScript(source: string) {
  // The script is the very source the component emits; running it verifies its runtime effect.
  new Function(source)();
}

afterEach(() => {
  localStorage.clear();
  const d = document.documentElement;
  delete d.dataset.cronusTheme;
  delete d.dataset.cronusMode;
  d.classList.remove("dark");
});

describe("CronusThemeScript — emitted markup", () => {
  it("renders a <script> referencing the storage key and the root dataset/class logic", () => {
    const { el, text } = scriptText("cronus-ui-theme");

    expect(el).not.toBeNull();
    expect(el?.tagName).toBe("SCRIPT");
    expect(text).toContain(JSON.stringify("cronus-ui-theme"));
    expect(text).toContain("document.documentElement");
    expect(text).toContain("dataset.cronusTheme");
    expect(text).toContain("dataset.cronusMode");
    expect(text).toContain('classList.toggle("dark"');
    expect(text).toContain("localStorage.getItem");
    // Defaults baked in for the empty-storage path.
    expect(text).toContain(JSON.stringify("aurora"));
    expect(text).toContain(JSON.stringify("dark"));
  });

  it("encodes the storage key safely so quotes can't break out of the script", () => {
    const evil = 'k";attacker()//';
    const { text } = scriptText(evil);

    // The raw key never appears unescaped; only its JSON.stringify form does.
    expect(text).toContain(JSON.stringify(evil));
    expect(text).not.toContain('getItem("k";attacker');
  });

  it("forwards the nonce to the <script> for CSP", () => {
    const { container } = render(<CronusThemeScript storageKey="k" nonce="abc123" />);
    expect(container.querySelector("script")?.getAttribute("nonce")).toBe("abc123");
  });
});

describe("CronusThemeScript — IIFE behavior in jsdom", () => {
  it("applies the SAVED theme/mode from localStorage to <html>", () => {
    localStorage.setItem("k", JSON.stringify({ theme: "neutral", mode: "light" }));
    const { text } = scriptText("k");

    // Run the inline script body exactly as a browser would at parse time.
    runScript(text);

    const d = document.documentElement;
    expect(d.dataset.cronusTheme).toBe("neutral");
    expect(d.dataset.cronusMode).toBe("light");
    expect(d.classList.contains("dark")).toBe(false);
  });

  it("toggles the dark class on when the saved mode is dark", () => {
    localStorage.setItem("k", JSON.stringify({ theme: "aurora", mode: "dark" }));
    const { text } = scriptText("k");

    runScript(text);

    const d = document.documentElement;
    expect(d.dataset.cronusTheme).toBe("aurora");
    expect(d.dataset.cronusMode).toBe("dark");
    expect(d.classList.contains("dark")).toBe(true);
  });

  it("falls back to the defaults when storage is empty", () => {
    const { text } = scriptText("k", { defaultThemeName: "neutral" });

    runScript(text);

    const d = document.documentElement;
    expect(d.dataset.cronusTheme).toBe("neutral");
    expect(d.dataset.cronusMode).toBe("dark");
    expect(d.classList.contains("dark")).toBe(true);
  });

  it("falls back to the defaults when storage is malformed (try/catch)", () => {
    localStorage.setItem("k", "{not json");
    const { text } = scriptText("k");

    expect(() => runScript(text)).not.toThrow();

    const d = document.documentElement;
    expect(d.dataset.cronusTheme).toBe("aurora");
    expect(d.dataset.cronusMode).toBe("dark");
  });
});
