"use client";

import { WordsPreloader } from "@cronus-ui/ui/words-preloader";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CronusMark } from "./brand/cronus-mark";

/**
 * Survives client navigations (the page remounts, this module does not) so
 * the splash does not replay when returning to `/`. A full reload resets it.
 */
let splashPlayed = false;

function clearSplashCover() {
  document.documentElement.removeAttribute("data-cronus-splash");
}

/**
 * Full-document splash on `/` — first visit and every reload. Mounted only
 * from the homepage so other routes do not pay for WordsPreloader. The first
 * paint cover is `data-cronus-splash` from the root layout script.
 * Playwright sets `navigator.webdriver`; skip there so flows are not blocked.
 */
export function SitePreloader() {
  const [show, setShow] = useState(() => {
    if (typeof navigator !== "undefined" && navigator.webdriver) return false;
    if (splashPlayed) return false;
    splashPlayed = true;
    return true;
  });

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.webdriver) {
      clearSplashCover();
      setShow(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <WordsPreloader
          words={["The innovation of interfaces.", "One system. The whole product follows."]}
          end={
            <CronusMark
              title="Cronus"
              className="h-16 w-32 text-fg sm:h-20 sm:w-40 lg:h-24 lg:w-48"
            />
          }
          onComplete={() => {
            clearSplashCover();
            setShow(false);
          }}
        />
      ) : null}
    </AnimatePresence>
  );
}
