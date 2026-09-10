import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { DATA } from "@/data/resume";

export default function ContactSection() {
  return (
    <div className="p-8 sm:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div className="flex flex-col justify-between gap-8">
          <FadeIn>
            <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground mb-6">
              07 — Contact
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[0.95]">
              Let&apos;s build
              <br />
              <span className="text-muted-foreground font-normal italic">something.</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`mailto:${DATA.contact.email}`}
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/85 transition-colors"
              >
                Send email
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href={DATA.contact.social.X.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-accent hover:border-foreground/20 transition-colors"
              >
                DM on X
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.12}>
          <div className="flex flex-col gap-6 lg:pt-12">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Based in São Paulo. Open to product work, collaborations, and interesting problems. I
              read everything — no soliciting please.
            </p>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-1">
                Elsewhere
              </p>
              {Object.entries(DATA.contact.social)
                .filter(([k]) => k !== "email")
                .map(([name, social]) => {
                  const Icon = social.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
                  return (
                    <Link
                      key={name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3 border-b border-border/50 hover:border-foreground/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{name}</span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </Link>
                  );
                })}
            </div>

            <div className="pt-4 mt-auto">
              <p className="text-[10px] font-mono text-muted-foreground/30">
                {DATA.name} · {DATA.location} · {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
