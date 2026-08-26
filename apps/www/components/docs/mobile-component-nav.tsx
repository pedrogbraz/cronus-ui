"use client";

import { Button, Sheet, SheetContent, SheetTitle, SheetTrigger } from "@cronus-ui/ui";
import { PanelLeft } from "lucide-react";
import { useState } from "react";
import { ComponentNavList } from "./docs-sidebar";

export function MobileComponentNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Browse components">
            <PanelLeft className="size-4" aria-hidden="true" />
            Browse components
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 max-w-[85vw] gap-0 overflow-y-auto"
          aria-label="Components"
        >
          <SheetTitle>Browse components</SheetTitle>
          <nav aria-label="Components" className="mt-4 text-sm">
            <ComponentNavList onNavigate={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
