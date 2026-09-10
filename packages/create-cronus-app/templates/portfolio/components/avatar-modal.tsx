"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useModal } from "@/hooks/use-modal";

interface AvatarModalProps {
  src: string;
  alt: string;
  fallback: string;
}

export function AvatarModal({ src, alt, fallback }: AvatarModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { open, close } = useModal(isOpen, setIsOpen);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "p" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        isOpen ? close() : open();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, open, close]);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            layoutId="avatar-image"
            onClick={open}
            className="cursor-zoom-in"
            style={{ borderRadius: "9999px" }}
          >
            <Avatar className="size-16 sm:size-20 md:size-24 border rounded-full shadow-lg ring-4 ring-muted shrink-0">
              <AvatarImage alt={alt} src={src} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          </motion.div>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          sideOffset={6}
          className="flex items-center gap-2 px-2.5 py-1.5"
        >
          <span className="text-xs whitespace-nowrap">View Profile</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted text-muted-foreground">
            P
          </span>
        </TooltipContent>
      </Tooltip>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={close}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                  style={{ zIndex: 9998 }}
                />

                <div
                  className="fixed inset-0 flex items-center justify-center"
                  style={{ zIndex: 9999 }}
                >
                  <motion.div
                    key="modal-image"
                    layoutId="avatar-image"
                    className="relative"
                    style={{ borderRadius: "16px" }}
                  >
                    <Image
                      src={src}
                      alt={alt}
                      width={384}
                      height={384}
                      className="size-72 sm:size-80 md:size-96 object-cover shadow-2xl"
                      style={{ borderRadius: "16px" }}
                      priority
                    />

                    <motion.button
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ delay: 0.18, duration: 0.15 }}
                      onClick={close}
                      className="absolute top-3 right-3 size-8 rounded-full bg-background border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="size-4" />
                    </motion.button>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
