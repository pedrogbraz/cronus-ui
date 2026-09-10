import { useCallback, useEffect } from "react";
import { dropLeatherSound } from "@/lib/drop-leather";
import { getAudioContext, isMuted, playSound } from "@/lib/sound-engine";
import { switchOffSound } from "@/lib/switch-off";

interface UseModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

export function useModal(
  isOpen: boolean,
  setOpen: (value: boolean) => void,
  options?: UseModalOptions,
) {
  const onOpen = options?.onOpen;
  const onClose = options?.onClose;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const open = useCallback(async () => {
    setOpen(true);
    if (!isMuted()) {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") await ctx.resume();
      setTimeout(() => {
        playSound(dropLeatherSound.dataUri, { volume: 0.2 }).catch(() => {});
      }, 80);
    }
    onOpen?.();
  }, [setOpen, onOpen]);

  const close = useCallback(async () => {
    setOpen(false);
    if (!isMuted()) {
      const ctx = getAudioContext();
      if (ctx.state === "suspended") await ctx.resume();
      setTimeout(() => {
        playSound(switchOffSound.dataUri, { volume: 0.2 }).catch(() => {});
      }, 60);
    }
    onClose?.();
  }, [setOpen, onClose]);

  return { open, close };
}
