/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Markdown from "react-markdown";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { DATA } from "@/data/resume";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof DATA.projects)[number];
  index: number;
}) {
  const [imgErr, setImgErr] = useState(false);
  const links = project.links as readonly { type: string; href: string }[];

  return (
    <motion.article
      className="group relative flex flex-col h-full border border-border rounded-xl overflow-hidden bg-card"
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.07)" }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
    >
      <div className="relative overflow-hidden bg-muted" style={{ paddingBottom: "52%" }}>
        <div className="absolute inset-0">
          {project.video ? (
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : project.image && !imgErr ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-black text-muted-foreground/10">
                {project.title[0]}
              </span>
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-background/90 backdrop-blur-sm border border-border">
          <span className="text-[10px] font-mono font-bold text-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {links.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {links.map((l, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg bg-background/92 backdrop-blur-sm border border-border text-foreground shadow-sm"
              >
                <ArrowUpRight className="w-2.5 h-2.5" />
                {l.type}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-foreground leading-tight">{project.title}</h3>
            <time className="text-[10px] font-mono text-muted-foreground">{project.dates}</time>
          </div>

          <span className="text-muted-foreground flex-none mt-0.5" aria-hidden="true">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed flex-1">
          <Markdown>{project.description}</Markdown>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {project.technologies.map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  return (
    <div className="p-8 sm:p-12">
      <FadeIn>
        <div className="flex items-end justify-between mb-8">
          <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground">
            05 — Projects
          </p>
          <span className="text-[10px] font-mono text-muted-foreground/40">
            {DATA.projects.length} built
          </span>
        </div>
      </FadeIn>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch" staggerDelay={0.07}>
        {DATA.projects.map((p, i) => (
          <StaggerItem key={p.title} className="h-full">
            <ProjectCard project={p} index={i} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
