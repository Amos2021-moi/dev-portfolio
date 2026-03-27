import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Mark Osiemo | Dev Portfolio",
  description:
    "Computer Science student at South Eastern Kenya University (SEKU), passionate about building modern web applications and turning ideas into real digital products. Always learning, always building.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  author: {
    name: "Mark Amos Osiemo",
    email: "amosmark2332@gmail.com",
    github: "AMOS2021-MOI",
    bio: "Computer Science student at South Eastern Kenya University (SEKU), passionate about building modern web applications and turning ideas into real digital products. Always learning, always building.",
    title: "Full-Stack Developer & CS Student",
  },
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "Python",
  "Git",
  "Docker",
];

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/AMOS2021-MOI",
    icon: "github",
  },
  {
    label: "Email",
    href: "mailto:amosmark2332@gmail.com",
    icon: "mail",
  },
];