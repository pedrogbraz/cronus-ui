import type { ReactNode } from "react";
import { DocsShellLock } from "../../components/docs/docs-shell-lock";
import {
  DocumentationSidebar,
  MobileDocumentationNav,
} from "../../components/docs/documentation-nav";
import { SiteNav } from "../../components/site-nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-clip bg-surface-base text-fg">
      <DocsShellLock />
      <SiteNav />
      <div className="mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 overflow-clip px-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <DocumentationSidebar />
        <main
          id="main-content"
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
        >
          <div className="py-4 lg:hidden">
            <MobileDocumentationNav />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
