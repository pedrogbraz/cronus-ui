"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAudioContext, playSound } from "@/lib/sound-engine";
import { switchOffSound } from "@/lib/switch-off";

export function SoundToggle({ className }: { className?: string }) {
  const [muted, setMuted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMuted(localStorage.getItem("cronus-portfolio-muted") === "true");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cronus-portfolio-muted", muted ? "true" : "false");
    const ctx = getAudioContext();
    if (muted) {
      ctx.suspend();
    }
  }, [muted, hydrated]);

  const toggle = useCallback(async () => {
    const ctx = getAudioContext();

    if (muted) {
      await ctx.resume();
      setMuted(false);
    } else {
      await playSound(switchOffSound.dataUri, { volume: 0.25 }).catch(() => {});
      setMuted(true);
    }
  }, [muted]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "s" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        toggle();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggle]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggle}
          className={`relative flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all ${className ?? ""}`}
        >
          <Volume2
            className={`h-3.5 w-3.5 absolute transition-all ${
              muted ? "scale-0 rotate-90" : "scale-100 rotate-0"
            }`}
          />
          <VolumeX
            className={`h-3.5 w-3.5 absolute transition-all ${
              muted ? "scale-100 rotate-0" : "scale-0 -rotate-90"
            }`}
          />
        </button>
      </TooltipTrigger>

      <TooltipContent
        side="bottom"
        sideOffset={6}
        className="flex items-center gap-2 px-2.5 py-1.5"
      >
        <span className="text-xs whitespace-nowrap">{muted ? "Unmute Sound" : "Mute Sound"}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground">
          S
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
