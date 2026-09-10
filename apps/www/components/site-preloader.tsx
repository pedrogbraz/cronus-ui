"use client";

import { WordsPreloader } from "@cronus-ui/ui";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CronusMark } from "./brand/cronus-mark";

/**
 * Full-document splash on `/` — first visit and every reload. Client
 * navigations keep the root layout mounted, so the sequence does not replay.
 * Playwright sets `navigator.webdriver`; skip there so flows are not blocked.
 */
export function SitePreloader() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [show, setShow] = useState(onHome);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.webdriver) {
      setShow(false);
    }
  }, []);

  if (!onHome) return null;

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
          onComplete={() => setShow(false)}
        />
      ) : null}
    </AnimatePresence>
  );
}
