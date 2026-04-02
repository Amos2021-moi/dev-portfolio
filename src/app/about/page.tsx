"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import {
  GraduationCap,
  Code2,
  Briefcase,
  Award,
  MapPin,
  Mail,
  GitBranch,
  Heart,
  Coffee,
  Gamepad2,
  Music,
  Book,
} from "lucide-react";

const timeline = [
  {
    year: "2024",
    title: "Built Full-Stack Portfolio Platform",
    description: "Built a production-grade developer portfolio with AI assistant, real-time analytics, and full admin dashboard using Next.js, PostgreSQL, and Gemini AI.",
    icon: Code2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    type: "project",
  },
  {
    year: "2024",
    title: "Started Learning Advanced TypeScript",
    description: "Deep-dived into TypeScript advanced patterns, generics, and type-safe full-stack development with Prisma ORM.",
    icon: Code2,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    type: "learning",
  },
  {
    year: "2023",
    title: "Enrolled at SEKU",
    description: "Started Computer Science degree at South Eastern Kenya University. Began combining academic knowledge with hands-on project building.",
    icon: GraduationCap,
    color: "text-green-500",
    bg: "bg-green-500/10",
    type: "education",
  },
  {
    year: "2023",
    title: "First Full-Stack Project",
    description: "Built my first complete full-stack application — a task management system with React, Node.js, and MongoDB.",
    icon: Briefcase,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    type: "project",
  },
  {
    year: "2022",
    title: "Started Web Development Journey",
    description: "Wrote my first lines of HTML and CSS. Fell in love with building things for the web and never stopped.",
    icon: Award,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    type: "milestone",
  },
];

const values = [
  { icon: Code2, label: "Clean Code", desc: "I believe in writing readable and maintainable code" },
  { icon: Heart, label: "User First", desc: "Every feature I build solves a real user problem" },
  { icon: Book, label: "Always Learning", desc: "Technology moves fast and I love keeping up" },
  { icon: Coffee, label: "Deep Focus", desc: "I do my best work with a coffee and deep concentration" },
];

const hobbies = [
  { icon: Code2, label: "Open Source" },
  { icon: Book, label: "Reading" },
  { icon: Music, label: "Music" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Coffee, label: "Coffee" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <p className="text-primary font-mono text-sm mb-2">About me</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Hi I am Mark
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {siteConfig.author.bio}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                Kenya, East Africa
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-primary" />
                SEKU — Computer Science
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary" />
                {siteConfig.author.email}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/#contact"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
              >
                Get In Touch
              </Link>
              <a
                href={"https://github.com/" + siteConfig.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-5 py-2.5 rounded-lg font-medium hover:bg-accent transition-colors text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                <GitBranch className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          {/* Avatar Card */}
          <div className="flex justify-center">
            <div
              className="relative w-64 h-64 rounded-2xl border overflow-hidden"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-6xl font-bold">
                  M
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 p-4 text-center"
                style={{ backgroundColor: "var(--color-background)" + "dd" }}
              >
                <p className="font-bold">{siteConfig.author.name}</p>
                <p className="text-xs text-muted-foreground">{siteConfig.author.title}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--color-muted)" }}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What I Believe In</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Core values that guide how I work and build.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background rounded-xl border p-6 text-center"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{v.label}</h3>
                  <p className="text-xs text-muted-foreground">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">My Journey</h2>
            <p className="text-muted-foreground">
              Key milestones in my development career.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-8 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: "var(--color-border)" }}
            />

            <div className="space-y-8">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex gap-6 pl-20"
                  >
                    {/* Icon */}
                    <div
                      className={"absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center border " + item.bg}
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <Icon className={"w-6 h-6 " + item.color} />
                    </div>

                    {/* Content */}
                    <div
                      className="flex-1 bg-background rounded-xl border p-5"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{item.title}</h3>
                        <span
                          className="text-xs font-mono px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: "var(--color-muted)",
                            color: "var(--color-muted-foreground)",
                          }}
                        >
                          {item.year}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Hobbies */}
      <section
        className="section-padding"
        style={{ backgroundColor: "var(--color-muted)" }}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Outside of Coding</h2>
            <p className="text-muted-foreground mb-8">
              When I am not building things, you can find me...
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {hobbies.map((h) => {
                const Icon = h.icon;
                return (
                  <div
                    key={h.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{h.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="text-2xl font-bold mb-4">Want to Work Together?</h2>
            <p className="text-muted-foreground mb-6">
              I am always open to interesting projects and collaborations.
              Let us build something great together!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/#contact"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Contact Me
              </Link>
              <Link
                href="/projects"
                className="border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
                style={{ borderColor: "var(--color-border)" }}
              >
                View My Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}