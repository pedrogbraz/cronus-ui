"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Marquee,
  Separator,
} from "@cronus-ui/ui";
import {
  Aperture,
  ArrowRight,
  Box,
  Command,
  Eye,
  Feather,
  Gem,
  Globe,
  Hexagon,
  Layers,
  Link2,
  Mail,
  MessagesSquare,
  Quote,
  Rocket,
  Share2,
  Sparkles,
  Sprout,
  Triangle,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { BlockGalleryBody } from "../../components/blocks/block-gallery-body";
import { BlockViewBody } from "../../components/blocks/block-view-body";
import { getBlockMeta } from "../blocks-index";
import { getBlockContentVariantsFrom, resolveBlockVariationFrom } from "./resolve";
import type { BlockContentMap } from "./types";

/* ──────────────────────────────────────────────────────────────────────────
 * 1. Blog — featured grid + editorial list
 * ────────────────────────────────────────────────────────────────────────── */

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  mark: string;
  date: string;
  readTime: string;
  art: string;
}

const featuredPost: BlogPost = {
  id: "density",
  category: "Engineering",
  title: "Designing for density: how we rebuilt the Aurora dashboard grid",
  excerpt:
    "Eighteen months of customer sessions taught us that power users don't want less on screen — they want better hierarchy. This is the system that got us there.",
  author: "Amara Okafor",
  initials: "AO",
  mark: "Aa",
  date: "Jul 10, 2026",
  readTime: "12 min read",
  art: "from-primary/40 via-info/20 to-transparent",
};

const gridPosts: BlogPost[] = [
  {
    id: "tokens",
    category: "Design systems",
    title: "A practical guide to design tokens at scale",
    excerpt: "Naming, aliasing, and the governance that keeps forty squads on one palette.",
    author: "Priya Natarajan",
    initials: "PN",
    mark: "Tk",
    date: "Jul 8, 2026",
    readTime: "9 min read",
    art: "from-info/40 via-primary/15 to-transparent",
  },
  {
    id: "dark-mode",
    category: "Engineering",
    title: "Shipping dark mode without shipping regressions",
    excerpt: "Semantic tokens, visual tests, and a two-week bake kept 214 screens honest.",
    author: "Marcus Chen",
    initials: "MC",
    mark: "Dk",
    date: "Jul 2, 2026",
    readTime: "7 min read",
    art: "from-success/35 via-info/20 to-transparent",
  },
  {
    id: "northwind",
    category: "Customer stories",
    title: "How Northwind cut onboarding time by 40%",
    excerpt: "The retail analytics team replaced four internal tools with one workspace.",
    author: "Elena Fischer",
    initials: "EF",
    mark: "Nw",
    date: "Jun 26, 2026",
    readTime: "6 min read",
    art: "from-warning/35 via-primary/15 to-transparent",
  },
  {
    id: "tables",
    category: "Accessibility",
    title: "The anatomy of an accessible data table",
    excerpt: "Focus order, header scopes, and the screen-reader script we test each release.",
    author: "Sofia Ramos",
    initials: "SR",
    mark: "Ax",
    date: "Jun 19, 2026",
    readTime: "11 min read",
    art: "from-primary/35 via-success/20 to-transparent",
  },
  {
    id: "release",
    category: "Product",
    title: "Aurora 2.4: workflows, webhooks, and a faster editor",
    excerpt: "Automations graduate from beta, plus a rebuilt canvas that renders 3× faster.",
    author: "Daniel Osei",
    initials: "DO",
    mark: "2.4",
    date: "Jun 12, 2026",
    readTime: "5 min read",
    art: "from-info/35 via-warning/15 to-transparent",
  },
  {
    id: "pricing",
    category: "Growth",
    title: "Pricing experiments we ran so you don't have to",
    excerpt: "A year of experiments on trials, seats, and annual switches — with raw numbers.",
    author: "Hannah Blake",
    initials: "HB",
    mark: "Pr",
    date: "Jun 5, 2026",
    readTime: "8 min read",
    art: "from-success/30 via-primary/20 to-transparent",
  },
];

export function BlogGridBlock() {
  return (
    <section aria-label="Blog" className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-widest text-fg-tertiary">
            Aurora Journal
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-fg">
            Latest from the journal
          </h2>
          <p className="text-fg-secondary">
            Essays on design systems, engineering, and the craft of calm software.
          </p>
        </div>
        <Button variant="outline">
          View all posts
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </header>

      <Card className="gap-0 overflow-hidden py-0 shadow-lg">
        <a href="#featured-post" className="grid lg:grid-cols-[1.1fr_1fr]">
          <div
            className={`relative flex min-h-56 items-center justify-center bg-gradient-to-br ${featuredPost.art}`}
          >
            <span aria-hidden="true" className="font-display text-8xl font-semibold text-fg-muted">
              {featuredPost.mark}
            </span>
            <div className="absolute start-4 top-4">
              <Badge variant="primary">Featured</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <Badge variant="secondary" className="w-fit">
              {featuredPost.category}
            </Badge>
            <h3 className="font-display text-2xl font-semibold leading-snug text-fg">
              {featuredPost.title}
            </h3>
            <p className="text-sm leading-6 text-fg-secondary">{featuredPost.excerpt}</p>
            <div className="mt-auto flex items-center gap-3 pt-2">
              <Avatar className="size-9">
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  {featuredPost.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">{featuredPost.author}</span>
                <span className="text-xs text-fg-tertiary">
                  {featuredPost.date} · {featuredPost.readTime}
                </span>
              </div>
            </div>
          </div>
        </a>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gridPosts.map((post) => (
          <Card key={post.id} className="gap-0 overflow-hidden py-0 shadow-xs">
            <a href="#blog-post" className="flex h-full flex-col">
              <div
                className={`flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${post.art}`}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-5xl font-semibold text-fg-muted"
                >
                  {post.mark}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <Badge variant="secondary" className="w-fit">
                  {post.category}
                </Badge>
                <h3 className="font-display text-base font-semibold leading-snug text-fg">
                  {post.title}
                </h3>
                <p className="text-sm leading-6 text-fg-secondary">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-2.5 pt-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                      {post.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-fg-tertiary">
                    {post.author} · {post.date} · {post.readTime}
                  </span>
                </div>
              </div>
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}

const blogGridCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
} from "@cronus-ui/ui";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  mark: string;
  date: string;
  readTime: string;
  art: string;
}

const featuredPost: BlogPost = {
  id: "density",
  category: "Engineering",
  title: "Designing for density: how we rebuilt the Aurora dashboard grid",
  excerpt:
    "Eighteen months of customer sessions taught us that power users don't want less on screen — they want better hierarchy. This is the system that got us there.",
  author: "Amara Okafor",
  initials: "AO",
  mark: "Aa",
  date: "Jul 10, 2026",
  readTime: "12 min read",
  art: "from-primary/40 via-info/20 to-transparent",
};

const gridPosts: BlogPost[] = [
  {
    id: "tokens",
    category: "Design systems",
    title: "A practical guide to design tokens at scale",
    excerpt: "Naming, aliasing, and the governance that keeps forty squads on one palette.",
    author: "Priya Natarajan",
    initials: "PN",
    mark: "Tk",
    date: "Jul 8, 2026",
    readTime: "9 min read",
    art: "from-info/40 via-primary/15 to-transparent",
  },
  {
    id: "dark-mode",
    category: "Engineering",
    title: "Shipping dark mode without shipping regressions",
    excerpt: "Semantic tokens, visual tests, and a two-week bake kept 214 screens honest.",
    author: "Marcus Chen",
    initials: "MC",
    mark: "Dk",
    date: "Jul 2, 2026",
    readTime: "7 min read",
    art: "from-success/35 via-info/20 to-transparent",
  },
  {
    id: "northwind",
    category: "Customer stories",
    title: "How Northwind cut onboarding time by 40%",
    excerpt: "The retail analytics team replaced four internal tools with one workspace.",
    author: "Elena Fischer",
    initials: "EF",
    mark: "Nw",
    date: "Jun 26, 2026",
    readTime: "6 min read",
    art: "from-warning/35 via-primary/15 to-transparent",
  },
  {
    id: "tables",
    category: "Accessibility",
    title: "The anatomy of an accessible data table",
    excerpt: "Focus order, header scopes, and the screen-reader script we test each release.",
    author: "Sofia Ramos",
    initials: "SR",
    mark: "Ax",
    date: "Jun 19, 2026",
    readTime: "11 min read",
    art: "from-primary/35 via-success/20 to-transparent",
  },
  {
    id: "release",
    category: "Product",
    title: "Aurora 2.4: workflows, webhooks, and a faster editor",
    excerpt: "Automations graduate from beta, plus a rebuilt canvas that renders 3× faster.",
    author: "Daniel Osei",
    initials: "DO",
    mark: "2.4",
    date: "Jun 12, 2026",
    readTime: "5 min read",
    art: "from-info/35 via-warning/15 to-transparent",
  },
  {
    id: "pricing",
    category: "Growth",
    title: "Pricing experiments we ran so you don't have to",
    excerpt: "A year of experiments on trials, seats, and annual switches — with raw numbers.",
    author: "Hannah Blake",
    initials: "HB",
    mark: "Pr",
    date: "Jun 5, 2026",
    readTime: "8 min read",
    art: "from-success/30 via-primary/20 to-transparent",
  },
];

export function BlogGridBlock() {
  return (
    <section aria-label="Blog" className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-widest text-fg-tertiary">
            Aurora Journal
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-fg">
            Latest from the journal
          </h2>
          <p className="text-fg-secondary">
            Essays on design systems, engineering, and the craft of calm software.
          </p>
        </div>
        <Button variant="outline">
          View all posts
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </header>

      <Card className="gap-0 overflow-hidden py-0 shadow-lg">
        <a href="#featured-post" className="grid lg:grid-cols-[1.1fr_1fr]">
          <div
            className={\`relative flex min-h-56 items-center justify-center bg-gradient-to-br \${featuredPost.art}\`}
          >
            <span
              aria-hidden="true"
              className="font-display text-8xl font-semibold text-fg-muted"
            >
              {featuredPost.mark}
            </span>
            <div className="absolute start-4 top-4">
              <Badge variant="primary">Featured</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <Badge variant="secondary" className="w-fit">
              {featuredPost.category}
            </Badge>
            <h3 className="font-display text-2xl font-semibold leading-snug text-fg">
              {featuredPost.title}
            </h3>
            <p className="text-sm leading-6 text-fg-secondary">{featuredPost.excerpt}</p>
            <div className="mt-auto flex items-center gap-3 pt-2">
              <Avatar className="size-9">
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  {featuredPost.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">{featuredPost.author}</span>
                <span className="text-xs text-fg-tertiary">
                  {featuredPost.date} · {featuredPost.readTime}
                </span>
              </div>
            </div>
          </div>
        </a>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gridPosts.map((post) => (
          <Card key={post.id} className="gap-0 overflow-hidden py-0 shadow-xs">
            <a href="#blog-post" className="flex h-full flex-col">
              <div
                className={\`flex aspect-[16/9] items-center justify-center bg-gradient-to-br \${post.art}\`}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-5xl font-semibold text-fg-muted"
                >
                  {post.mark}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <Badge variant="secondary" className="w-fit">
                  {post.category}
                </Badge>
                <h3 className="font-display text-base font-semibold leading-snug text-fg">
                  {post.title}
                </h3>
                <p className="text-sm leading-6 text-fg-secondary">{post.excerpt}</p>
                <div className="mt-auto flex items-center gap-2.5 pt-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                      {post.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-fg-tertiary">
                    {post.author} · {post.date} · {post.readTime}
                  </span>
                </div>
              </div>
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}`;

const listPosts: BlogPost[] = [
  {
    id: "density",
    category: "Engineering",
    title: "Designing for density: how we rebuilt the Aurora dashboard grid",
    excerpt:
      "Eighteen months of customer sessions taught us that power users don't want less on screen — they want better hierarchy. This is the system that got us there.",
    author: "Amara Okafor",
    initials: "AO",
    mark: "Aa",
    date: "Jul 10, 2026",
    readTime: "12 min read",
    art: "from-primary/40 via-info/20 to-transparent",
  },
  {
    id: "tokens",
    category: "Design systems",
    title: "A practical guide to design tokens at scale",
    excerpt:
      "Naming is governance: aliases, semantic layers, and the review rules that let forty squads ship from one palette without collisions.",
    author: "Priya Natarajan",
    initials: "PN",
    mark: "Tk",
    date: "Jul 8, 2026",
    readTime: "9 min read",
    art: "from-info/40 via-primary/15 to-transparent",
  },
  {
    id: "tables",
    category: "Accessibility",
    title: "The anatomy of an accessible data table",
    excerpt:
      "Focus order, header scopes, and the screen-reader walkthrough we run on every release. Accessible tables are not harder — they are decided earlier.",
    author: "Sofia Ramos",
    initials: "SR",
    mark: "Ax",
    date: "Jun 19, 2026",
    readTime: "11 min read",
    art: "from-primary/35 via-success/20 to-transparent",
  },
  {
    id: "pricing",
    category: "Growth",
    title: "Pricing experiments we ran so you don't have to",
    excerpt:
      "Twelve months of experiments on trials, seat tiers, and annual switching — including the two tests that backfired and what they taught us.",
    author: "Hannah Blake",
    initials: "HB",
    mark: "Pr",
    date: "Jun 5, 2026",
    readTime: "8 min read",
    art: "from-success/30 via-primary/20 to-transparent",
  },
];

export function BlogListBlock() {
  return (
    <section aria-label="Blog" className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-fg-tertiary">
          The Aurora Journal
        </p>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-fg">
          Notes on building calm software
        </h2>
        <p className="max-w-md text-fg-secondary">
          Long-form writing from the team — published monthly, no fluff, no filler.
        </p>
      </header>

      <div className="flex flex-col">
        {listPosts.map((post, index) => (
          <article key={post.id}>
            {index > 0 ? <Separator className="my-8" /> : null}
            <a href="#blog-post" className="group grid gap-5 sm:grid-cols-[auto_1fr]">
              <div
                className={`hidden size-28 items-center justify-center rounded-2xl bg-gradient-to-br sm:flex ${post.art}`}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-semibold text-fg-muted"
                >
                  {post.mark}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-fg-tertiary">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold leading-snug text-fg transition-colors group-hover:text-primary-strong">
                  {post.title}
                </h3>
                <p className="leading-7 text-fg-secondary">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                        {post.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-fg-secondary">{post.author}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-strong">
                    Read article
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

const blogListCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Separator,
} from "@cronus-ui/ui";
import { ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  initials: string;
  mark: string;
  date: string;
  readTime: string;
  art: string;
}

const listPosts: BlogPost[] = [
  {
    id: "density",
    category: "Engineering",
    title: "Designing for density: how we rebuilt the Aurora dashboard grid",
    excerpt:
      "Eighteen months of customer sessions taught us that power users don't want less on screen — they want better hierarchy. This is the system that got us there.",
    author: "Amara Okafor",
    initials: "AO",
    mark: "Aa",
    date: "Jul 10, 2026",
    readTime: "12 min read",
    art: "from-primary/40 via-info/20 to-transparent",
  },
  {
    id: "tokens",
    category: "Design systems",
    title: "A practical guide to design tokens at scale",
    excerpt:
      "Naming is governance: aliases, semantic layers, and the review rules that let forty squads ship from one palette without collisions.",
    author: "Priya Natarajan",
    initials: "PN",
    mark: "Tk",
    date: "Jul 8, 2026",
    readTime: "9 min read",
    art: "from-info/40 via-primary/15 to-transparent",
  },
  {
    id: "tables",
    category: "Accessibility",
    title: "The anatomy of an accessible data table",
    excerpt:
      "Focus order, header scopes, and the screen-reader walkthrough we run on every release. Accessible tables are not harder — they are decided earlier.",
    author: "Sofia Ramos",
    initials: "SR",
    mark: "Ax",
    date: "Jun 19, 2026",
    readTime: "11 min read",
    art: "from-primary/35 via-success/20 to-transparent",
  },
  {
    id: "pricing",
    category: "Growth",
    title: "Pricing experiments we ran so you don't have to",
    excerpt:
      "Twelve months of experiments on trials, seat tiers, and annual switching — including the two tests that backfired and what they taught us.",
    author: "Hannah Blake",
    initials: "HB",
    mark: "Pr",
    date: "Jun 5, 2026",
    readTime: "8 min read",
    art: "from-success/30 via-primary/20 to-transparent",
  },
];

export function BlogListBlock() {
  return (
    <section aria-label="Blog" className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-fg-tertiary">
          The Aurora Journal
        </p>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-fg">
          Notes on building calm software
        </h2>
        <p className="max-w-md text-fg-secondary">
          Long-form writing from the team — published monthly, no fluff, no filler.
        </p>
      </header>

      <div className="flex flex-col">
        {listPosts.map((post, index) => (
          <article key={post.id}>
            {index > 0 ? <Separator className="my-8" /> : null}
            <a href="#blog-post" className="group grid gap-5 sm:grid-cols-[auto_1fr]">
              <div
                className={\`hidden size-28 items-center justify-center rounded-2xl bg-gradient-to-br sm:flex \${post.art}\`}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-semibold text-fg-muted"
                >
                  {post.mark}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-fg-tertiary">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span>{post.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-display text-2xl font-semibold leading-snug text-fg transition-colors group-hover:text-primary-strong">
                  {post.title}
                </h3>
                <p className="leading-7 text-fg-secondary">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                        {post.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-fg-secondary">{post.author}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-strong">
                    Read article
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 2. Blog post — article + article with sidebar
 * ────────────────────────────────────────────────────────────────────────── */

export function BlogPostArticleBlock() {
  return (
    <article aria-label="Blog post" className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg-tertiary">
          <Badge variant="primary">Engineering</Badge>
          <span>Jul 10, 2026</span>
          <span aria-hidden="true">·</span>
          <span>12 min read</span>
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
          Designing for density: how we rebuilt the Aurora dashboard grid
        </h1>
        <p className="text-lg leading-8 text-fg-secondary">
          Power users never asked for less on screen — they asked for better hierarchy. This is the
          layout system that finally delivered both.
        </p>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-surface-overlay text-sm text-fg-secondary">
              AO
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">Amara Okafor</span>
            <span className="text-xs text-fg-tertiary">Co-founder &amp; CEO, Aurora</span>
          </div>
        </div>
      </header>

      <div
        aria-hidden="true"
        className="flex aspect-[2/1] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 via-info/20 to-transparent"
      >
        <span className="font-display text-8xl font-semibold text-fg-muted">Aa</span>
      </div>

      <div className="flex flex-col gap-5">
        <p className="leading-7 text-fg-secondary">
          When we sat down with our hundred most active teams last spring, one theme kept surfacing:
          nobody asked us to remove information from the dashboard. They asked us to make it easier
          to scan. The distinction sounds subtle, but it inverted how we thought about layout for
          the better part of a year.
        </p>
        <h2 className="pt-2 font-display text-2xl font-semibold text-fg">
          Hierarchy beats whitespace
        </h2>
        <p className="leading-7 text-fg-secondary">
          Whitespace is a tool, not a goal. Our first prototypes doubled every margin and tested
          terribly — sessions got longer, not shorter. What moved the numbers was contrast between
          levels: one loud metric, a quiet supporting row, and gridlines that only appear when the
          eye needs a rail.
        </p>
        <blockquote className="border-s-2 border-primary ps-5 font-display text-xl italic leading-relaxed text-fg">
          “Density is not the enemy of clarity. Vagueness is.”
        </blockquote>
        <p className="leading-7 text-fg-secondary">
          The new grid leans on{" "}
          <code className="rounded-md bg-surface-inset px-1.5 py-0.5 font-mono text-sm text-fg">
            grid-auto-flow: dense
          </code>{" "}
          and a pair of density tokens, so every card negotiates space with its neighbors instead of
          hoarding a fixed slot.
        </p>
        <h2 className="pt-2 font-display text-2xl font-semibold text-fg">
          What changed for customers
        </h2>
        <p className="leading-7 text-fg-secondary">
          Median time-to-first-insight fell from 34 seconds to 19 across the beta cohort, and
          support tickets about the export button dropped to zero. The full pattern library ships in
          Aurora 2.4 — free on every plan.
        </p>
      </div>

      <Separator />

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-fg-secondary">Share this article</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <Share2 aria-hidden="true" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="outline" size="icon-sm">
            <Mail aria-hidden="true" />
            <span className="sr-only">Share by email</span>
          </Button>
          <Button variant="outline" size="icon-sm">
            <Link2 aria-hidden="true" />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </footer>
    </article>
  );
}

const blogPostArticleCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Separator,
} from "@cronus-ui/ui";
import { Link2, Mail, Share2 } from "lucide-react";

export function BlogPostArticleBlock() {
  return (
    <article aria-label="Blog post" className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg-tertiary">
          <Badge variant="primary">Engineering</Badge>
          <span>Jul 10, 2026</span>
          <span aria-hidden="true">·</span>
          <span>12 min read</span>
        </div>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
          Designing for density: how we rebuilt the Aurora dashboard grid
        </h1>
        <p className="text-lg leading-8 text-fg-secondary">
          Power users never asked for less on screen — they asked for better hierarchy. This is
          the layout system that finally delivered both.
        </p>
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-surface-overlay text-sm text-fg-secondary">
              AO
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-fg">Amara Okafor</span>
            <span className="text-xs text-fg-tertiary">Co-founder &amp; CEO, Aurora</span>
          </div>
        </div>
      </header>

      <div
        aria-hidden="true"
        className="flex aspect-[2/1] items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 via-info/20 to-transparent"
      >
        <span className="font-display text-8xl font-semibold text-fg-muted">Aa</span>
      </div>

      <div className="flex flex-col gap-5">
        <p className="leading-7 text-fg-secondary">
          When we sat down with our hundred most active teams last spring, one theme kept
          surfacing: nobody asked us to remove information from the dashboard. They asked us to
          make it easier to scan. The distinction sounds subtle, but it inverted how we thought
          about layout for the better part of a year.
        </p>
        <h2 className="pt-2 font-display text-2xl font-semibold text-fg">
          Hierarchy beats whitespace
        </h2>
        <p className="leading-7 text-fg-secondary">
          Whitespace is a tool, not a goal. Our first prototypes doubled every margin and tested
          terribly — sessions got longer, not shorter. What moved the numbers was contrast
          between levels: one loud metric, a quiet supporting row, and gridlines that only appear
          when the eye needs a rail.
        </p>
        <blockquote className="border-s-2 border-primary ps-5 font-display text-xl italic leading-relaxed text-fg">
          “Density is not the enemy of clarity. Vagueness is.”
        </blockquote>
        <p className="leading-7 text-fg-secondary">
          The new grid leans on{" "}
          <code className="rounded-md bg-surface-inset px-1.5 py-0.5 font-mono text-sm text-fg">
            grid-auto-flow: dense
          </code>{" "}
          and a pair of density tokens, so every card negotiates space with its neighbors instead
          of hoarding a fixed slot.
        </p>
        <h2 className="pt-2 font-display text-2xl font-semibold text-fg">
          What changed for customers
        </h2>
        <p className="leading-7 text-fg-secondary">
          Median time-to-first-insight fell from 34 seconds to 19 across the beta cohort, and
          support tickets about the export button dropped to zero. The full pattern library ships
          in Aurora 2.4 — free on every plan.
        </p>
      </div>

      <Separator />

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-fg-secondary">Share this article</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm">
            <Share2 aria-hidden="true" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="outline" size="icon-sm">
            <Mail aria-hidden="true" />
            <span className="sr-only">Share by email</span>
          </Button>
          <Button variant="outline" size="icon-sm">
            <Link2 aria-hidden="true" />
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </footer>
    </article>
  );
}`;

const tocItems = [
  { id: "hierarchy", label: "Hierarchy beats whitespace", active: true },
  { id: "grid", label: "A grid that earns its keep", active: false },
  { id: "tokens", label: "Density tokens", active: false },
  { id: "results", label: "What changed for customers", active: false },
] as const;

function tocLinkClass(active: boolean) {
  return active
    ? "border-s-2 border-primary py-1 ps-3 text-sm font-medium text-primary-strong"
    : "border-s-2 border-transparent py-1 ps-3 text-sm text-fg-secondary transition-colors hover:text-fg";
}

export function BlogPostSidebarBlock() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article aria-label="Blog post" className="flex flex-col gap-8">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-tertiary">
            <Badge variant="primary">Engineering</Badge>
            <span>Jul 10, 2026</span>
            <span aria-hidden="true">·</span>
            <span>12 min read</span>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
            Designing for density: how we rebuilt the Aurora dashboard grid
          </h1>
          <p className="text-lg leading-8 text-fg-secondary">
            Power users never asked for less on screen — they asked for better hierarchy. This is
            the layout system that finally delivered both.
          </p>
        </header>

        <div className="flex flex-col gap-5">
          <p className="leading-7 text-fg-secondary">
            Nobody asked us to remove information from the dashboard — they asked us to make it
            easier to scan. That distinction inverted how we thought about layout for the better
            part of a year.
          </p>
          <h2 id="hierarchy" className="pt-2 font-display text-2xl font-semibold text-fg">
            Hierarchy beats whitespace
          </h2>
          <p className="leading-7 text-fg-secondary">
            Our first prototypes doubled every margin and tested terribly. What moved the numbers
            was contrast between levels: one loud metric, a quiet supporting row, and gridlines that
            only appear when the eye needs a rail.
          </p>
          <h2 id="grid" className="pt-2 font-display text-2xl font-semibold text-fg">
            A grid that earns its keep
          </h2>
          <p className="leading-7 text-fg-secondary">
            Cards no longer hoard fixed slots. Each widget declares a minimum footprint and a
            preferred one, and the layout engine negotiates the rest — no more half-empty rows below
            the fold.
          </p>
          <h2 id="tokens" className="pt-2 font-display text-2xl font-semibold text-fg">
            Density tokens
          </h2>
          <p className="leading-7 text-fg-secondary">
            A single{" "}
            <code className="rounded-md bg-surface-inset px-1.5 py-0.5 font-mono text-sm text-fg">
              data-density
            </code>{" "}
            attribute cascades through every component, retuning spacing, type scale, and row height
            together.
          </p>
          <h2 id="results" className="pt-2 font-display text-2xl font-semibold text-fg">
            What changed for customers
          </h2>
          <p className="leading-7 text-fg-secondary">
            Median time-to-first-insight fell from 34 seconds to 19, and tickets about the export
            button dropped to zero. The pattern library ships in Aurora 2.4 — free on every plan.
          </p>
        </div>
      </article>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <Card className="gap-4 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-fg-tertiary">
              On this page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-label="Table of contents" className="flex flex-col gap-1">
              {tocItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={tocLinkClass(item.active)}>
                  {item.label}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="gap-4 shadow-xs">
          <CardHeader>
            <CardTitle className="font-display text-base">Get the next essay</CardTitle>
            <CardDescription>One long-form piece a month, straight to your inbox.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  AO
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">Amara Okafor</span>
                <span className="text-xs text-fg-tertiary">Co-founder &amp; CEO, Aurora</span>
              </div>
            </div>
            <Label htmlFor="post-newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="post-newsletter-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
            <Button variant="primary" className="w-full">
              Subscribe
            </Button>
            <p className="text-xs text-fg-tertiary">One email a month. Unsubscribe anytime.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

const blogPostSidebarCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@cronus-ui/ui";

const tocItems = [
  { id: "hierarchy", label: "Hierarchy beats whitespace", active: true },
  { id: "grid", label: "A grid that earns its keep", active: false },
  { id: "tokens", label: "Density tokens", active: false },
  { id: "results", label: "What changed for customers", active: false },
] as const;

function tocLinkClass(active: boolean) {
  return active
    ? "border-s-2 border-primary py-1 ps-3 text-sm font-medium text-primary-strong"
    : "border-s-2 border-transparent py-1 ps-3 text-sm text-fg-secondary transition-colors hover:text-fg";
}

export function BlogPostSidebarBlock() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article aria-label="Blog post" className="flex flex-col gap-8">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-tertiary">
            <Badge variant="primary">Engineering</Badge>
            <span>Jul 10, 2026</span>
            <span aria-hidden="true">·</span>
            <span>12 min read</span>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
            Designing for density: how we rebuilt the Aurora dashboard grid
          </h1>
          <p className="text-lg leading-8 text-fg-secondary">
            Power users never asked for less on screen — they asked for better hierarchy. This
            is the layout system that finally delivered both.
          </p>
        </header>

        <div className="flex flex-col gap-5">
          <p className="leading-7 text-fg-secondary">
            Nobody asked us to remove information from the dashboard — they asked us to make it
            easier to scan. That distinction inverted how we thought about layout for the better
            part of a year.
          </p>
          <h2 id="hierarchy" className="pt-2 font-display text-2xl font-semibold text-fg">
            Hierarchy beats whitespace
          </h2>
          <p className="leading-7 text-fg-secondary">
            Our first prototypes doubled every margin and tested terribly. What moved the
            numbers was contrast between levels: one loud metric, a quiet supporting row, and
            gridlines that only appear when the eye needs a rail.
          </p>
          <h2 id="grid" className="pt-2 font-display text-2xl font-semibold text-fg">
            A grid that earns its keep
          </h2>
          <p className="leading-7 text-fg-secondary">
            Cards no longer hoard fixed slots. Each widget declares a minimum footprint and a
            preferred one, and the layout engine negotiates the rest — no more half-empty rows
            below the fold.
          </p>
          <h2 id="tokens" className="pt-2 font-display text-2xl font-semibold text-fg">
            Density tokens
          </h2>
          <p className="leading-7 text-fg-secondary">
            A single{" "}
            <code className="rounded-md bg-surface-inset px-1.5 py-0.5 font-mono text-sm text-fg">
              data-density
            </code>{" "}
            attribute cascades through every component, retuning spacing, type scale, and row
            height together.
          </p>
          <h2 id="results" className="pt-2 font-display text-2xl font-semibold text-fg">
            What changed for customers
          </h2>
          <p className="leading-7 text-fg-secondary">
            Median time-to-first-insight fell from 34 seconds to 19, and tickets about the
            export button dropped to zero. The pattern library ships in Aurora 2.4 — free on
            every plan.
          </p>
        </div>
      </article>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <Card className="gap-4 shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-medium uppercase tracking-wide text-fg-tertiary">
              On this page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav aria-label="Table of contents" className="flex flex-col gap-1">
              {tocItems.map((item) => (
                <a key={item.id} href={\`#\${item.id}\`} className={tocLinkClass(item.active)}>
                  {item.label}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="gap-4 shadow-xs">
          <CardHeader>
            <CardTitle className="font-display text-base">Get the next essay</CardTitle>
            <CardDescription>One long-form piece a month, straight to your inbox.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-surface-overlay text-xs text-fg-secondary">
                  AO
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-fg">Amara Okafor</span>
                <span className="text-xs text-fg-tertiary">Co-founder &amp; CEO, Aurora</span>
              </div>
            </div>
            <Label htmlFor="post-newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="post-newsletter-email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
            />
            <Button variant="primary" className="w-full">
              Subscribe
            </Button>
            <p className="text-xs text-fg-tertiary">One email a month. Unsubscribe anytime.</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 3. Logo cloud — trust grid + dual marquee
 * ────────────────────────────────────────────────────────────────────────── */

const cloudLogos = [
  { name: "Northwind", icon: Hexagon },
  { name: "Vertex", icon: Triangle },
  { name: "Lumina", icon: Zap },
  { name: "Fathom", icon: Waves },
  { name: "Polaris", icon: Globe },
  { name: "Halcyon", icon: Feather },
  { name: "Driftline", icon: Layers },
  { name: "Basalt", icon: Box },
  { name: "Cascade", icon: Aperture },
  { name: "Emberly", icon: Command },
] as const;

export function LogoCloudGridBlock() {
  return (
    <section
      aria-label="Customers"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 py-8"
    >
      <p className="text-sm font-medium uppercase tracking-widest text-fg-tertiary">
        Trusted by 4,000+ product teams
      </p>
      <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {cloudLogos.map((logo) => (
          <li
            key={logo.name}
            className="flex items-center justify-center gap-2 text-fg-tertiary transition-colors hover:text-fg-secondary"
          >
            <logo.icon className="size-5" aria-hidden="true" />
            <span className="font-display text-lg font-semibold tracking-tight">{logo.name}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-fg-secondary">
        From seed-stage startups to public companies in 60 countries.
      </p>
    </section>
  );
}

const logoCloudGridCode = `import {
  Aperture,
  Box,
  Command,
  Feather,
  Globe,
  Hexagon,
  Layers,
  Triangle,
  Waves,
  Zap,
} from "lucide-react";

const cloudLogos = [
  { name: "Northwind", icon: Hexagon },
  { name: "Vertex", icon: Triangle },
  { name: "Lumina", icon: Zap },
  { name: "Fathom", icon: Waves },
  { name: "Polaris", icon: Globe },
  { name: "Halcyon", icon: Feather },
  { name: "Driftline", icon: Layers },
  { name: "Basalt", icon: Box },
  { name: "Cascade", icon: Aperture },
  { name: "Emberly", icon: Command },
] as const;

export function LogoCloudGridBlock() {
  return (
    <section
      aria-label="Customers"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 py-8"
    >
      <p className="text-sm font-medium uppercase tracking-widest text-fg-tertiary">
        Trusted by 4,000+ product teams
      </p>
      <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {cloudLogos.map((logo) => (
          <li
            key={logo.name}
            className="flex items-center justify-center gap-2 text-fg-tertiary transition-colors hover:text-fg-secondary"
          >
            <logo.icon className="size-5" aria-hidden="true" />
            <span className="font-display text-lg font-semibold tracking-tight">{logo.name}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-fg-secondary">
        From seed-stage startups to public companies in 60 countries.
      </p>
    </section>
  );
}`;

const marqueeRowTop = cloudLogos.slice(0, 5);
const marqueeRowBottom = cloudLogos.slice(5);

export function LogoCloudMarqueeBlock() {
  return (
    <section
      aria-label="Customers"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 py-8"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
          The teams shipping with Aurora
        </h2>
        <p className="text-sm text-fg-secondary">
          4,000+ product teams run their design systems on Aurora.
        </p>
      </div>
      <div className="flex w-full flex-col gap-5">
        <Marquee gap="3.5rem" repeat={3} speed={32}>
          {marqueeRowTop.map((logo) => (
            <span key={logo.name} className="flex items-center gap-2 text-fg-tertiary">
              <logo.icon className="size-5" aria-hidden="true" />
              <span className="font-display text-lg font-semibold tracking-tight">{logo.name}</span>
            </span>
          ))}
        </Marquee>
        <Marquee direction="right" gap="3.5rem" repeat={3} speed={26}>
          {marqueeRowBottom.map((logo) => (
            <span key={logo.name} className="flex items-center gap-2 text-fg-tertiary">
              <logo.icon className="size-5" aria-hidden="true" />
              <span className="font-display text-lg font-semibold tracking-tight">{logo.name}</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

const logoCloudMarqueeCode = `import { Marquee } from "@cronus-ui/ui";
import {
  Aperture,
  Box,
  Command,
  Feather,
  Globe,
  Hexagon,
  Layers,
  Triangle,
  Waves,
  Zap,
} from "lucide-react";

const cloudLogos = [
  { name: "Northwind", icon: Hexagon },
  { name: "Vertex", icon: Triangle },
  { name: "Lumina", icon: Zap },
  { name: "Fathom", icon: Waves },
  { name: "Polaris", icon: Globe },
  { name: "Halcyon", icon: Feather },
  { name: "Driftline", icon: Layers },
  { name: "Basalt", icon: Box },
  { name: "Cascade", icon: Aperture },
  { name: "Emberly", icon: Command },
] as const;

const marqueeRowTop = cloudLogos.slice(0, 5);
const marqueeRowBottom = cloudLogos.slice(5);

export function LogoCloudMarqueeBlock() {
  return (
    <section
      aria-label="Customers"
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 py-8"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
          The teams shipping with Aurora
        </h2>
        <p className="text-sm text-fg-secondary">
          4,000+ product teams run their design systems on Aurora.
        </p>
      </div>
      <div className="flex w-full flex-col gap-5">
        <Marquee gap="3.5rem" repeat={3} speed={32}>
          {marqueeRowTop.map((logo) => (
            <span key={logo.name} className="flex items-center gap-2 text-fg-tertiary">
              <logo.icon className="size-5" aria-hidden="true" />
              <span className="font-display text-lg font-semibold tracking-tight">
                {logo.name}
              </span>
            </span>
          ))}
        </Marquee>
        <Marquee direction="right" gap="3.5rem" repeat={3} speed={26}>
          {marqueeRowBottom.map((logo) => (
            <span key={logo.name} className="flex items-center gap-2 text-fg-tertiary">
              <logo.icon className="size-5" aria-hidden="true" />
              <span className="font-display text-lg font-semibold tracking-tight">
                {logo.name}
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * 4. About — story + values
 * ────────────────────────────────────────────────────────────────────────── */

const storyStats = [
  { label: "Founded in Copenhagen", value: "2019" },
  { label: "Teammates in 12 countries", value: "48" },
  { label: "Teams building on Aurora", value: "4,000+" },
  { label: "Uptime, trailing 12 months", value: "99.99%" },
] as const;

const milestones = [
  {
    year: "2019",
    title: "A weekend prototype",
    description:
      "Aurora begins as a side project — a faster way to ship internal dashboards without fighting the front end.",
  },
  {
    year: "2021",
    title: "Seed round",
    description:
      "A $4.5M seed led by Meridian Ventures turns the prototype into a product — and a team of nine.",
  },
  {
    year: "2023",
    title: "Aurora 2.0",
    description:
      "A rebuilt editor, live theming, and multiplayer editing bring in the first 1,000 paying teams.",
  },
  {
    year: "2025",
    title: "Series B",
    description:
      "$32M to go deeper on the platform, open the Lisbon hub, and keep the free tier generous.",
  },
  {
    year: "2026",
    title: "4,000 teams and counting",
    description: "Aurora powers products at startups and public companies in 60 countries.",
  },
] as const;

export function AboutStoryBlock() {
  return (
    <section aria-label="About Aurora" className="mx-auto flex w-full max-w-4xl flex-col gap-12">
      <header className="flex max-w-2xl flex-col gap-4">
        <Badge variant="primary" className="w-fit">
          Our story
        </Badge>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
          We believe great software should feel calm, not clever.
        </h2>
        <p className="text-lg leading-8 text-fg-secondary">
          Aurora started with a simple frustration: the tools teams relied on every day demanded
          more attention than the work itself. We build the opposite.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {storyStats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-display text-3xl font-semibold text-fg">{stat.value}</span>
            <span className="text-sm text-fg-secondary">{stat.label}</span>
          </div>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardContent className="flex flex-col gap-6">
          <Quote className="size-8 text-primary" aria-hidden="true" />
          <blockquote className="font-display text-2xl font-medium leading-snug text-fg">
            “We don’t ship features to win demos. We ship them so a designer in Lagos or a PM in
            Porto ends the day a little less tired.”
          </blockquote>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-surface-overlay text-sm text-fg-secondary">
                AO
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Amara Okafor</span>
              <span className="text-xs text-fg-tertiary">Co-founder &amp; CEO</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <h3 className="font-display text-xl font-semibold text-fg">Milestones</h3>
        <ol className="flex flex-col">
          {milestones.map((milestone, index) => (
            <li key={milestone.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary"
                />
                {index < milestones.length - 1 ? (
                  <span aria-hidden="true" className="w-px flex-1 bg-border" />
                ) : null}
              </div>
              <div className="flex flex-col gap-1 pb-8">
                <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                  {milestone.year}
                </span>
                <span className="font-medium text-fg">{milestone.title}</span>
                <p className="text-sm leading-6 text-fg-secondary">{milestone.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const aboutStoryCode = `import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
} from "@cronus-ui/ui";
import { Quote } from "lucide-react";

const storyStats = [
  { label: "Founded in Copenhagen", value: "2019" },
  { label: "Teammates in 12 countries", value: "48" },
  { label: "Teams building on Aurora", value: "4,000+" },
  { label: "Uptime, trailing 12 months", value: "99.99%" },
] as const;

const milestones = [
  {
    year: "2019",
    title: "A weekend prototype",
    description:
      "Aurora begins as a side project — a faster way to ship internal dashboards without fighting the front end.",
  },
  {
    year: "2021",
    title: "Seed round",
    description:
      "A $4.5M seed led by Meridian Ventures turns the prototype into a product — and a team of nine.",
  },
  {
    year: "2023",
    title: "Aurora 2.0",
    description:
      "A rebuilt editor, live theming, and multiplayer editing bring in the first 1,000 paying teams.",
  },
  {
    year: "2025",
    title: "Series B",
    description:
      "$32M to go deeper on the platform, open the Lisbon hub, and keep the free tier generous.",
  },
  {
    year: "2026",
    title: "4,000 teams and counting",
    description: "Aurora powers products at startups and public companies in 60 countries.",
  },
] as const;

export function AboutStoryBlock() {
  return (
    <section aria-label="About Aurora" className="mx-auto flex w-full max-w-4xl flex-col gap-12">
      <header className="flex max-w-2xl flex-col gap-4">
        <Badge variant="primary" className="w-fit">
          Our story
        </Badge>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
          We believe great software should feel calm, not clever.
        </h2>
        <p className="text-lg leading-8 text-fg-secondary">
          Aurora started with a simple frustration: the tools teams relied on every day demanded
          more attention than the work itself. We build the opposite.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {storyStats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-display text-3xl font-semibold text-fg">{stat.value}</span>
            <span className="text-sm text-fg-secondary">{stat.label}</span>
          </div>
        ))}
      </div>

      <Card className="shadow-lg">
        <CardContent className="flex flex-col gap-6">
          <Quote className="size-8 text-primary" aria-hidden="true" />
          <blockquote className="font-display text-2xl font-medium leading-snug text-fg">
            “We don’t ship features to win demos. We ship them so a designer in Lagos or a PM in
            Porto ends the day a little less tired.”
          </blockquote>
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-surface-overlay text-sm text-fg-secondary">
                AO
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-fg">Amara Okafor</span>
              <span className="text-xs text-fg-tertiary">Co-founder &amp; CEO</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <h3 className="font-display text-xl font-semibold text-fg">Milestones</h3>
        <ol className="flex flex-col">
          {milestones.map((milestone, index) => (
            <li key={milestone.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary"
                />
                {index < milestones.length - 1 ? (
                  <span aria-hidden="true" className="w-px flex-1 bg-border" />
                ) : null}
              </div>
              <div className="flex flex-col gap-1 pb-8">
                <span className="text-xs font-medium uppercase tracking-wide text-fg-tertiary">
                  {milestone.year}
                </span>
                <span className="font-medium text-fg">{milestone.title}</span>
                <p className="text-sm leading-6 text-fg-secondary">{milestone.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}`;

const companyValues = [
  {
    icon: Gem,
    title: "Craft over shortcuts",
    description: "Details are the product. We sweat empty states, error copy, and 60fps.",
  },
  {
    icon: Eye,
    title: "Default to transparency",
    description: "Roadmap, pricing, postmortems — public. Trust compounds faster than features.",
  },
  {
    icon: Rocket,
    title: "Ship, then sharpen",
    description: "Real usage beats internal debate. Release small, watch closely, iterate weekly.",
  },
  {
    icon: Users,
    title: "Customers in the room",
    description: "Every project starts and ends with a customer call. Opinions lose to evidence.",
  },
  {
    icon: MessagesSquare,
    title: "Strong opinions, loosely held",
    description: "Argue hard, decide once, commit fully — no relitigating in the hallway.",
  },
  {
    icon: Sprout,
    title: "Leave it better",
    description: "Every file, doc, and process we touch should be clearer when we leave it.",
  },
] as const;

export function AboutValuesBlock() {
  return (
    <section aria-label="Our values" className="mx-auto flex w-full max-w-5xl flex-col gap-12">
      <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <Badge variant="primary">How we work</Badge>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
          The values we hire, build, and ship by
        </h2>
        <p className="text-lg leading-8 text-fg-secondary">
          Six principles that outlive any roadmap. They decide what we build — and what we politely
          decline to.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companyValues.map((value) => (
          <Card key={value.title} className="shadow-xs">
            <CardContent className="flex flex-col gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <value.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-base font-semibold text-fg">{value.title}</h3>
              <p className="text-sm leading-6 text-fg-secondary">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <figure className="flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          <div
            aria-hidden="true"
            className="col-span-2 row-span-2 rounded-2xl bg-gradient-to-br from-primary/40 via-info/20 to-transparent"
          />
          <div
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-2xl bg-surface-inset"
          >
            <Users className="size-8 text-fg-muted" aria-hidden="true" />
          </div>
          <div
            aria-hidden="true"
            className="aspect-square rounded-2xl bg-gradient-to-br from-info/35 to-success/20"
          />
          <div
            aria-hidden="true"
            className="aspect-square rounded-2xl bg-gradient-to-br from-warning/30 to-primary/20"
          />
          <div
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-2xl bg-surface-inset"
          >
            <Sparkles className="size-8 text-fg-muted" aria-hidden="true" />
          </div>
        </div>
        <figcaption className="text-xs text-fg-tertiary">
          Life at Aurora — team offsite, Lisbon · June 2026
        </figcaption>
      </figure>
    </section>
  );
}

const aboutValuesCode = `import { Badge, Card, CardContent } from "@cronus-ui/ui";
import { Eye, Gem, MessagesSquare, Rocket, Sparkles, Sprout, Users } from "lucide-react";

const companyValues = [
  {
    icon: Gem,
    title: "Craft over shortcuts",
    description: "Details are the product. We sweat empty states, error copy, and 60fps.",
  },
  {
    icon: Eye,
    title: "Default to transparency",
    description: "Roadmap, pricing, postmortems — public. Trust compounds faster than features.",
  },
  {
    icon: Rocket,
    title: "Ship, then sharpen",
    description: "Real usage beats internal debate. Release small, watch closely, iterate weekly.",
  },
  {
    icon: Users,
    title: "Customers in the room",
    description: "Every project starts and ends with a customer call. Opinions lose to evidence.",
  },
  {
    icon: MessagesSquare,
    title: "Strong opinions, loosely held",
    description: "Argue hard, decide once, commit fully — no relitigating in the hallway.",
  },
  {
    icon: Sprout,
    title: "Leave it better",
    description: "Every file, doc, and process we touch should be clearer when we leave it.",
  },
] as const;

export function AboutValuesBlock() {
  return (
    <section aria-label="Our values" className="mx-auto flex w-full max-w-5xl flex-col gap-12">
      <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <Badge variant="primary">How we work</Badge>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
          The values we hire, build, and ship by
        </h2>
        <p className="text-lg leading-8 text-fg-secondary">
          Six principles that outlive any roadmap. They decide what we build — and what we
          politely decline to.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companyValues.map((value) => (
          <Card key={value.title} className="shadow-xs">
            <CardContent className="flex flex-col gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <value.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-base font-semibold text-fg">{value.title}</h3>
              <p className="text-sm leading-6 text-fg-secondary">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <figure className="flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-3">
          <div
            aria-hidden="true"
            className="col-span-2 row-span-2 rounded-2xl bg-gradient-to-br from-primary/40 via-info/20 to-transparent"
          />
          <div
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-2xl bg-surface-inset"
          >
            <Users className="size-8 text-fg-muted" aria-hidden="true" />
          </div>
          <div
            aria-hidden="true"
            className="aspect-square rounded-2xl bg-gradient-to-br from-info/35 to-success/20"
          />
          <div
            aria-hidden="true"
            className="aspect-square rounded-2xl bg-gradient-to-br from-warning/30 to-primary/20"
          />
          <div
            aria-hidden="true"
            className="flex aspect-square items-center justify-center rounded-2xl bg-surface-inset"
          >
            <Sparkles className="size-8 text-fg-muted" aria-hidden="true" />
          </div>
        </div>
        <figcaption className="text-xs text-fg-tertiary">
          Life at Aurora — team offsite, Lisbon · June 2026
        </figcaption>
      </figure>
    </section>
  );
}`;

/* ──────────────────────────────────────────────────────────────────────────
 * Block map
 * ────────────────────────────────────────────────────────────────────────── */

export const contentBlocks: BlockContentMap = {
  blog: {
    preview: <BlogGridBlock />,
    code: blogGridCode,
    variants: [
      {
        id: "grid",
        name: "Featured grid",
        description: "A featured hero post above a responsive three-column post grid.",
        appearance: "dark",
        preview: <BlogGridBlock />,
        code: blogGridCode,
      },
      {
        id: "list",
        name: "Editorial list",
        description: "An editorial list layout with larger typography and horizontal cards.",
        appearance: "light",
        preview: <BlogListBlock />,
        code: blogListCode,
      },
    ],
  },
  "blog-post": {
    preview: <BlogPostArticleBlock />,
    code: blogPostArticleCode,
    variants: [
      {
        id: "article",
        name: "Article",
        description: "A single-column article with token-styled prose and a share row.",
        appearance: "dark",
        preview: <BlogPostArticleBlock />,
        code: blogPostArticleCode,
      },
      {
        id: "with-sidebar",
        name: "With sidebar",
        description: "The article beside a sticky table of contents and a newsletter card.",
        appearance: "light",
        preview: <BlogPostSidebarBlock />,
        code: blogPostSidebarCode,
      },
    ],
  },
  "logo-cloud": {
    preview: <LogoCloudGridBlock />,
    code: logoCloudGridCode,
    variants: [
      {
        id: "grid",
        name: "Trust grid",
        description: "A quiet responsive grid of customer wordmarks under a trust heading.",
        appearance: "dark",
        preview: <LogoCloudGridBlock />,
        code: logoCloudGridCode,
      },
      {
        id: "marquee",
        name: "Dual marquee",
        description: "Two counter-scrolling, pause-on-hover marquee rows of customer wordmarks.",
        appearance: "light",
        preview: <LogoCloudMarqueeBlock />,
        code: logoCloudMarqueeCode,
      },
    ],
  },
  about: {
    preview: <AboutStoryBlock />,
    code: aboutStoryCode,
    variants: [
      {
        id: "story",
        name: "Story",
        description: "Mission statement, stats row, founder quote, and a milestone timeline.",
        appearance: "dark",
        preview: <AboutStoryBlock />,
        code: aboutStoryCode,
      },
      {
        id: "values",
        name: "Values",
        description: "A values card grid with icons and a token-built culture collage.",
        appearance: "light",
        preview: <AboutValuesBlock />,
        code: aboutValuesCode,
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Lazily-loaded detail views                                                */
/*                                                                            */
/*  These are imported per-slug via next/dynamic by the block detail routes,  */
/*  so visiting a block only loads this family chunk (not the other family).  */
/* -------------------------------------------------------------------------- */

export function ContentGallery({ slug }: { slug: string }) {
  const variants = getBlockContentVariantsFrom(contentBlocks, slug);
  const meta = getBlockMeta(slug);
  if (!variants || !meta) {
    return <div className="p-20 text-fg-tertiary">Unknown block: {slug}</div>;
  }
  return <BlockGalleryBody slug={slug} meta={meta} variants={variants} />;
}

export function ContentView({ slug, variant }: { slug: string; variant: string }) {
  const resolved = resolveBlockVariationFrom(contentBlocks, slug, variant);
  if (!resolved || resolved.variant.id !== variant) {
    return (
      <div className="p-20 text-fg-tertiary">
        Unknown block variation: {slug}/{variant}
      </div>
    );
  }
  return <BlockViewBody slug={slug} resolved={resolved} />;
}
