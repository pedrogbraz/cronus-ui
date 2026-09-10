"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;

      setProgress(scrolled);
      setShow(scrollTop > 200);
    };

    window.addEventListener("scroll", update);
    update();

    return () => window.removeEventListener("scroll", update);
  }, []);

  const size = 46;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="relative size-11.5"
          >
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={stroke}
                fill="none"
                className="text-muted-foreground/20"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="currentColor"
                strokeWidth={stroke}
                fill="none"
                strokeLinecap="round"
                className="text-foreground transition-[stroke-dashoffset] duration-200"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur-md shadow-sm hover:bg-muted transition">
              <ArrowUp className="size-4 text-foreground" />
            </div>
          </button>
        </TooltipTrigger>

        <TooltipContent side="left">Scroll to top</TooltipContent>
      </Tooltip>
    </div>
  );
}
