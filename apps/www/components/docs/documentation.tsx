import { Badge, Button, cn } from "@cooud-ui/ui";
import { ArrowRight, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function DocsHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-border/60 pb-10">
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-tertiary">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-4xl font-display text-4xl font-medium tracking-[-0.025em] text-fg sm:text-5xl sm:tracking-[-0.03em]">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-fg-secondary">{description}</p>
      {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
    </header>
  );
}

export function DocsSection({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-10">
      <div className="max-w-3xl">
        <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-fg">{title}</h2>
        {description ? (
          <p className="mt-3 text-base leading-7 text-fg-secondary">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function DocsCard({
  title,
  description,
  href,
  action,
  badge,
  children,
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
  badge?: string;
  children?: ReactNode;
}) {
  const body = (
    <div
      className={cn(
        "group flex h-full flex-col rounded-xl border border-border bg-surface-raised p-5 transition-[transform,border-color] duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]",
        href
          ? "hover:-translate-y-1 hover:border-border-strong focus-within:ring-2 focus-within:ring-ring"
          : "",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-base font-semibold text-fg">{title}</h3>
        {badge ? (
          <Badge variant="secondary" className="shrink-0">
            {badge}
          </Badge>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-fg-secondary">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
      {href && action ? (
        <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-fg">
          {action}
          <ArrowRight className="size-3.5 transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0.5" />
        </span>
      ) : null}
    </div>
  );

  if (!href) {
    return body;
  }

  return (
    <Link
      href={href}
      className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base"
    >
      {body}
    </Link>
  );
}

export function DocsGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 }) {
  return (
    <div className={cn("grid gap-4", columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
      {children}
    </div>
  );
}

export function DocCallout({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: "info" | "success";
}) {
  const Icon = tone === "success" ? CheckCircle2 : Info;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm leading-6",
        tone === "success"
          ? "border-success/30 bg-success/10 text-fg-secondary"
          : "border-info/30 bg-info/10 text-fg-secondary",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "success" ? "text-success-strong" : "text-info-strong",
        )}
      />
      <div>
        <p className="font-medium text-fg">{title}</p>
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-surface-overlay px-1.5 py-0.5 font-mono text-[0.86em] text-fg">
      {children}
    </code>
  );
}

export function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2 text-sm text-fg-secondary">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-fg-tertiary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
