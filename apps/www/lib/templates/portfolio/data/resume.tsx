// @ts-nocheck
import { HomeIcon } from "lucide-react";
import { Icons } from "../components/icons";
import { Docker } from "../components/ui/svgs/docker";
import { Golang } from "../components/ui/svgs/golang";
import { Java } from "../components/ui/svgs/java";
import { NextjsIconDark } from "../components/ui/svgs/nextjsIconDark";
import { Nodejs } from "../components/ui/svgs/nodejs";
import { Postgresql } from "../components/ui/svgs/postgresql";
import { Python } from "../components/ui/svgs/python";
import { ReactLight } from "../components/ui/svgs/reactLight";
import { Typescript } from "../components/ui/svgs/typescript";

const favicon = (domain: string) => `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export const DATA = {
  name: "Pedro Gontijo",
  initials: "PG",
  url: "https://github.com/pedrogbraz",
  location: "São Paulo, SP",
  locationLink: "https://www.google.com/maps/place/S%C3%A3o+Paulo,+SP",
  title: "Co-Founder",
  pronouns: "he/him",
  status: "Building Cooud",
  timezone: "America/Sao_Paulo",
  timezoneLabel: "BRT",
  description:
    "Co-Founder at Cooud. 19, born in São Paulo. I design product UI systems and ship full-stack software — from design tokens to Java and Go APIs.",
  summary:
    "I'm Pedro, 19, born and raised in São Paulo capital. I started shipping before college — a lighting storefront, auth APIs, payment flows — and now I [co-found Cooud](/#work), where we build Cronus UI. I've interned at [Bank of America and Itaú](/#work), study software at [FIAP](/#education), and learned in public through [Rocketseat](/#education). I care about craft, systems that stay out of the way, and interfaces that feel inevitable.",
  avatarUrl: "https://github.com/pedrogbraz.png",
  skills: [
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Typescript", icon: Typescript },
    { name: "Node.js", icon: Nodejs },
    { name: "Java", icon: Java },
    { name: "Go", icon: Golang },
    { name: "Python", icon: Python },
    { name: "Postgres", icon: Postgresql },
    { name: "Docker", icon: Docker },
  ],
  navbar: [{ href: "/", icon: HomeIcon, label: "Home" }],
  contact: {
    email: "hello@pedrogbraz.dev",
    tel: "+55 11 98888-0000",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/pedrogbraz",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/pedrogbraz",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/pedrogbraz",
        icon: Icons.x,
        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "https://youtube.com/@pedrogbraz",
        icon: Icons.youtube,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:hello@pedrogbraz.dev",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [
    {
      company: "Cooud",
      href: "https://aicronus.com",
      badges: [] as string[],
      location: "São Paulo, SP",
      title: "Co-Founder",
      logoUrl: "https://github.com/pedrogbraz.png",
      start: "March 2025",
      end: "Present",
      description:
        "Co-founding Cooud and shipping Cronus UI — a product UI system with tokens, a shadcn-compatible registry, and a compose path for SaaS. Own the design language, the component contract, and the public docs at aicronus.com.",
    },
    {
      company: "Bank of America",
      href: "https://www.bankofamerica.com",
      badges: [] as string[],
      location: "São Paulo, SP",
      title: "Software Engineering Intern",
      logoUrl: favicon("bankofamerica.com"),
      start: "January 2025",
      end: "June 2025",
      description:
        "Worked on internal tooling for the São Paulo technology org: dashboards for ops metrics, TypeScript services around trade support workflows, and accessibility fixes on a React admin used by operations teams.",
    },
    {
      company: "Itaú Unibanco",
      href: "https://www.itau.com.br",
      badges: [] as string[],
      location: "São Paulo, SP",
      title: "Engineering Intern",
      logoUrl: favicon("itau.com.br"),
      start: "July 2024",
      end: "December 2024",
      description:
        "Joined a junior engineering program on the retail digital channel. Built Java APIs for account-status reads, wrote integration tests, and shipped a small Next.js console the squad used to replay failed requests.",
    },
    {
      company: "Thermoluz",
      href: "https://github.com/pedrogbraz/e-commerce-thermoluz",
      badges: [] as string[],
      location: "Remote",
      title: "Frontend Developer",
      logoUrl: favicon("github.com"),
      start: "January 2024",
      end: "June 2024",
      description:
        "Designed and shipped a storefront for a lighting brand: catalog, cart, and checkout in Next.js. Handled responsive layout, product imagery, and the first version of the order flow.",
    },
  ],
  education: [
    {
      school: "FIAP",
      href: "https://www.fiap.com.br",
      degree: "Análise e Desenvolvimento de Sistemas",
      logoUrl: favicon("fiap.com.br"),
      start: "2024",
      end: "2028",
    },
    {
      school: "Rocketseat",
      href: "https://www.rocketseat.com.br",
      degree: "Ignite — React, Node.js, and product fundamentals",
      logoUrl: favicon("rocketseat.com.br"),
      start: "2023",
      end: "2024",
    },
    {
      school: "Amazon Web Services",
      href: "https://aws.amazon.com/certification/",
      degree: "AWS Certified Cloud Practitioner",
      logoUrl: favicon("aws.amazon.com"),
      start: "2025",
      end: "2025",
    },
    {
      school: "Oracle",
      href: "https://education.oracle.com",
      degree: "Oracle Certified Professional, Java SE",
      logoUrl: favicon("oracle.com"),
      start: "2025",
      end: "2025",
    },
  ],
  projects: [
    {
      title: "Nimbus Desk",
      href: "",
      dates: "Jan 2026 – Present",
      active: true,
      description:
        "An ops console for a fictional last-mile team in São Paulo. Live routes, exception queues, and a night-mode board the warehouse actually leaves open.",
      technologies: ["Next.js", "TypeScript", "React", "Tailwind", "PostgreSQL"],
      links: [] as { type: string; href: string }[],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
      video: "",
    },
    {
      title: "Lume",
      href: "",
      dates: "Aug 2025 – Dec 2025",
      active: false,
      description:
        "A local-first notes app for FIAP classes: folders that match the semester, offline first, and a highlighter that survives a dead battery on the metrô.",
      technologies: ["Next.js", "TypeScript", "SQLite", "Tailwind"],
      links: [] as { type: string; href: string }[],
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=400&fit=crop",
      video: "",
    },
    {
      title: "Relay",
      href: "",
      dates: "Mar 2025 – Jul 2025",
      active: false,
      description:
        "Split bills among friends without a spreadsheet. Pix-shaped flows, merchant vs. person accounts, and an authorization step before anything moves.",
      technologies: ["Java", "Spring", "PostgreSQL", "React"],
      links: [] as { type: string; href: string }[],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
      video: "",
    },
    {
      title: "Atelier",
      href: "",
      dates: "Sep 2024 – Feb 2025",
      active: false,
      description:
        "Booking pages for small studios in Vila Madalena. Calendar, deposits, and a public profile that does not look like a Google Form.",
      technologies: ["React", "TypeScript", "Node.js", "Postgres"],
      links: [] as { type: string; href: string }[],
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
      video: "",
    },
  ],
  community: [
    {
      title: "Cronus UI public launch",
      dates: "June 2026",
      location: "São Paulo, SP",
      description:
        "Shipped the first public version of Cronus UI and the docs site. Wrote the component contract, the registry, and the compose path that scaffolds a SaaS from blocks.",
      image: "https://github.com/pedrogbraz.png",
      win: "Open source",
      links: [{ title: "Source", href: "https://github.com/pedrogbraz/cronus-ui" }],
    },
    {
      title: "FIAP Tech Week",
      dates: "October 2025",
      location: "São Paulo, SP",
      description:
        "Short campus talk on design tokens and why a product UI system is not a component dump. Live-coded a theme switch without restyling a single screen by hand.",
      image: favicon("fiap.com.br"),
      links: [] as { title: string; href: string }[],
    },
    {
      title: "Itaú Dev Challenge",
      dates: "June 2025",
      location: "São Paulo, SP",
      description:
        "Weekend challenge on a simplified banking API: transactions, validation, and a Java service with tests. Repo lives at pedrogbraz/desafio-itau-junior.",
      image: favicon("itau.com.br"),
      links: [{ title: "Source", href: "https://github.com/pedrogbraz/desafio-itau-junior" }],
    },
    {
      title: "São Paulo Frontend",
      dates: "March 2025",
      location: "São Paulo, SP",
      description:
        "Local meetup lightning talk on shipping a design system from a two-person company: tokens first, variants in CVA, and never inventing a color that is not in the theme.",
      image: favicon("meetup.com"),
      links: [] as { title: string; href: string }[],
    },
    {
      title: "Rocketseat NLW Unite",
      dates: "April 2024",
      location: "Remote · Brazil",
      description:
        "Week-long build of an event check-in product with React. First time I treated a UI as a system instead of a pile of screens.",
      image: favicon("rocketseat.com.br"),
      win: "NLW",
      links: [{ title: "Source", href: "https://github.com/pedrogbraz/nlw-unite-reactjs" }],
    },
  ],
};
