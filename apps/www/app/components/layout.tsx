import type { ReactNode } from "react";
import { DocsShellLock } from "../../components/docs/docs-shell-lock";
import { DocsSidebar } from "../../components/docs/docs-sidebar";
import { MobileComponentNav } from "../../components/docs/mobile-component-nav";
import { SiteNav } from "../../components/site-nav";

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-clip bg-surface-base text-fg">
      <DocsShellLock />
      <SiteNav />
      {/* Height-locked shell so only the article (and overflowing side rails)
          scroll. Sticky + window scroll made the rails travel then snap.
          `clip` (not hidden) is not a scroll container — hash/#target cannot
          drag this shell. */}
      <div className="mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 overflow-clip px-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <DocsSidebar />
        <main
          id="main-content"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
        >
          <div className="py-4 lg:hidden">
            <MobileComponentNav />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
