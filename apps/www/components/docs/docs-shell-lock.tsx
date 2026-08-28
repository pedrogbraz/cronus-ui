"use client";

import { useLayoutEffect } from "react";

/**
 * The docs/components shell owns its own column scrollers. `html { overflow-x:
 * clip }` leaves overflow-y visible, so descendant columns still inflate the
 * document's scrollHeight and the window becomes the scroller — the rails then
 * ride the page. Lock the root only while this shell is mounted.
 */
export function DocsShellLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: root.style.overflow,
      htmlOverscroll: root.style.overscrollBehavior,
      htmlScrollBehavior: root.style.scrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    root.classList.add("docs-shell");
    root.style.overflow = "clip";
    root.style.overscrollBehavior = "none";
    root.style.scrollBehavior = "auto";
    body.style.overflow = "clip";
    body.style.overscrollBehavior = "none";

    const pinRoot = () => {
      if (root.scrollTop !== 0) root.scrollTop = 0;
      if (body.scrollTop !== 0) body.scrollTop = 0;
    };
    pinRoot();
    window.addEventListener("scroll", pinRoot, { capture: true, passive: true });
    window.addEventListener("hashchange", pinRoot);

    return () => {
      window.removeEventListener("scroll", pinRoot, { capture: true });
      window.removeEventListener("hashchange", pinRoot);
      root.classList.remove("docs-shell");
      root.style.overflow = previous.htmlOverflow;
      root.style.overscrollBehavior = previous.htmlOverscroll;
      root.style.scrollBehavior = previous.htmlScrollBehavior;
      body.style.overflow = previous.bodyOverflow;
      body.style.overscrollBehavior = previous.bodyOverscroll;
    };
  }, []);

  return null;
}
