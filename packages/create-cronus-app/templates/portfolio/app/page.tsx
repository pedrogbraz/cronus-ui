"use client";

import { ArrowUpRight, Clock, Code2, Link2, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { AvatarModal } from "@/components/avatar-modal";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import ContactSection from "@/components/section/contact-section";
import Footer from "@/components/section/footer";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import { SideDecorations } from "@/components/side-decoration";
import { SeparatorPro } from "@/components/ui/seperatorpro";
import { DATA } from "@/data/resume";

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-2 h-full">
          <div className="border-r border-border" />
          <div />
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

const DELAY = 0.05;

function LocalTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-US", {
        timeZone: DATA.timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(t);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <span>
      {time} <span className="text-muted-foreground">{"//"}</span> {DATA.timezoneLabel}
    </span>
  );
}

const detailItems = [
  {
    icon: Code2,
    label: "role",
    value: `${DATA.work[0].title} @${DATA.work[0].company}`,
  },
  {
    icon: Clock,
    label: "local time",
    value: null,
    valueNode: <LocalTime />,
  },
  {
    icon: MapPin,
    label: "location",
    value: DATA.location,
  },
  {
    icon: User,
    label: "pronouns",
    value: DATA.pronouns,
  },
  {
    icon: Link2,
    label: "website",
    value: DATA.url.replace("https://", ""),
    href: DATA.url,
  },
  {
    icon: Phone,
    label: "phone",
    value: DATA.contact.tel,
    href: `tel:${DATA.contact.tel.replace(/[^\d+]/g, "")}`,
  },
];

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-10 overflow-hidden">
      <SideDecorations>
        <section id="hero">
          <div className="mx-auto pt-8 w-full max-w-2xl px-4 space-y-6">
            <div className="flex flex-row items-center gap-4">
              <FadeIn delay={DELAY * 2}>
                <AvatarModal src={DATA.avatarUrl} alt={DATA.name} fallback={DATA.initials} />
              </FadeIn>

              <div className="flex flex-col gap-2 min-w-0">
                <FadeIn delay={DELAY}>
                  <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tighter text-foreground sm:text-3xl lg:text-4xl">
                    Hi, I&apos;m {DATA.name.split(" ")[0]}
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[0.7em] w-[0.7em] text-sky-500 translate-y-0.5"
                      aria-label="Verified"
                    >
                      <path
                        fill="currentColor"
                        d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
                      />
                    </svg>
                  </h1>
                </FadeIn>

                <SeparatorPro variant="dots" className="w-24 opacity-50" />

                <FadeIn delay={DELAY * 2}>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                    {DATA.description}
                  </p>
                </FadeIn>
              </div>
            </div>

            <FadeIn delay={DELAY * 3}>
              <div className="flex items-start justify-between gap-4">
                <div />

                <FadeIn delay={DELAY * 1.5} className="pb-4">
                  <div className="flex items-center gap-2 pt-1 whitespace-nowrap text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {DATA.status}
                  </div>
                </FadeIn>
              </div>

              <div className="border border-border rounded-xl overflow-hidden mt-3">
                <div className="grid grid-cols-2">
                  {detailItems.map((item, i) => {
                    const Icon = item.icon;
                    const isLastRow = i >= detailItems.length - 2;
                    const isLeftCol = i % 2 === 0;

                    const inner = (
                      <div className="flex items-center gap-3 px-4 py-3 group">
                        <div className="size-7 rounded-lg border border-border flex items-center justify-center shrink-0">
                          <Icon className="size-3.5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.valueNode ?? item.value}
                          </p>
                        </div>

                        {item.href && (
                          <ArrowUpRight className="size-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                        )}
                      </div>
                    );

                    return (
                      <div
                        key={item.label}
                        className={[
                          !isLastRow ? "border-b border-border" : "",
                          isLeftCol ? "border-r border-border" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {item.href ? (
                          <Link
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="block hover:bg-muted/50 transition-colors"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <div>{inner}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </SideDecorations>

      <SeparatorPro variant="default" className="max-w-2xl mx-auto w-full px-4" />

      <section id="about">
        <div className="flex flex-col gap-y-4 max-w-2xl mx-auto px-4">
          <FadeIn delay={DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </FadeIn>

          <SeparatorPro variant="dots" className="w-full opacity-40" />

          <FadeIn delay={DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </FadeIn>
        </div>
      </section>

      <SeparatorPro variant="dots" className="max-w-2xl mx-auto w-full px-4" />

      <section id="work">
        <div className="flex flex-col gap-y-6 max-w-2xl mx-auto px-4">
          <FadeIn delay={DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </FadeIn>

          <SeparatorPro variant="dots" className="w-full opacity-40" />

          <FadeIn delay={DELAY * 6}>
            <WorkSection />
          </FadeIn>
        </div>
      </section>

      <SeparatorPro variant="wave" className="max-w-2xl mx-auto w-full px-4" />

      <section id="education">
        <div className="flex flex-col gap-y-6 max-w-2xl mx-auto px-4">
          <FadeIn delay={DELAY * 7}>
            <h2 className="text-xl font-bold">Education</h2>
          </FadeIn>

          <SeparatorPro variant="dots" className="w-full opacity-40" />

          <Stagger className="flex flex-col gap-0">
            {DATA.education.map((education, index) => (
              <Fragment key={education.school}>
                <StaggerItem>
                  <Link
                    href={education.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-3 justify-between group min-w-0 py-3"
                  >
                    <div className="flex items-center gap-x-3 flex-1 min-w-0">
                      {education.logoUrl ? (
                        <Image
                          src={education.logoUrl}
                          alt={education.school}
                          width={40}
                          height={40}
                          className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border object-contain flex-none"
                        />
                      ) : (
                        <div className="size-8 md:size-10 border rounded-full bg-muted flex-none" />
                      )}

                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="font-semibold flex items-center gap-2 truncate">
                          {education.school}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {education.degree}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground shrink-0">
                      {education.start} - {education.end}
                    </div>
                  </Link>
                </StaggerItem>

                {index < DATA.education.length - 1 && (
                  <SeparatorPro variant="default" className="opacity-30" />
                )}
              </Fragment>
            ))}
          </Stagger>
        </div>
      </section>

      <SeparatorPro variant="default" className="max-w-2xl mx-auto w-full px-4" />

      <section id="skills">
        <div className="flex flex-col gap-y-4 max-w-2xl mx-auto px-4">
          <FadeIn delay={DELAY * 8}>
            <h2 className="text-xl font-bold">Skills</h2>
          </FadeIn>

          <SeparatorPro variant="dots" className="w-full opacity-40" />

          <Stagger className="flex flex-wrap gap-2">
            {DATA.skills.map((skill) => (
              <StaggerItem key={skill.name}>
                <div className="border bg-background border-border rounded-xl h-8 px-4 flex items-center gap-2">
                  {skill.icon && <skill.icon className="size-4" />}
                  <span className="text-sm font-medium whitespace-nowrap">{skill.name}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <SeparatorPro variant="dots" className="max-w-2xl mx-auto w-full px-4" />

      <section id="projects" className="max-w-2xl mx-auto w-full px-4">
        <FadeIn delay={DELAY * 9}>
          <ProjectsSection />
        </FadeIn>
      </section>

      <SeparatorPro variant="wave" className="max-w-2xl mx-auto w-full px-4" />

      <section id="community" className="max-w-2xl mx-auto w-full px-4">
        <FadeIn delay={DELAY * 10}>
          <HackathonsSection />
        </FadeIn>
      </section>

      <SeparatorPro variant="wave" className="max-w-2xl mx-auto w-full px-4" />

      <section id="contact">
        <SectionWrapper>
          <FadeIn delay={DELAY * 11}>
            <ContactSection />
          </FadeIn>
        </SectionWrapper>
      </section>
      <Footer />
    </main>
  );
}
