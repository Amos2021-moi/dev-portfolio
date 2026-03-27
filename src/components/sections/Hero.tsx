"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, GitBranch, Mail, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { siteConfig, skills } from "@/lib/config";

const typingTexts = [
  "Full-Stack Developer",
  "CS Student at SEKU",
  "Next.js Enthusiast",
  "Problem Solver",
  "Open Source Contributor",
];

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = typingTexts[currentIndex];

      if (!isDeleting) {
        setCurrentText(current.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);

        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setCurrentText(current.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);

        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % typingTexts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [charIndex, currentIndex, isDeleting]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* Gradient Orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
        style={{ backgroundColor: "rgb(59 130 246 / 0.2)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
        style={{ backgroundColor: "rgb(168 85 247 / 0.2)", animationDelay: "3s" }}
      />

      <div className="container-max section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 w-fit"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground font-mono">
                Available for opportunities
              </span>
            </motion.div>

            {/* Heading */}
            <div className="flex flex-col gap-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground font-mono text-lg"
              >
                Hi there, I am
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                {siteConfig.author.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 h-10"
              >
                <Terminal className="w-5 h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-mono text-primary">
                  {currentText}
                  <span className="animate-pulse">|</span>
                </span>
              </motion.div>
            </div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground text-lg leading-relaxed max-w-lg"
            >
              {siteConfig.author.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/projects"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View My Work
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={"mailto:" + siteConfig.author.email}
                className="flex items-center gap-2 border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4"
            >
              
              <a
                href={"https://github.com/" + siteConfig.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <GitBranch className="w-5 h-5" />
                GitHub
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href={"mailto:" + siteConfig.author.email}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Download className="w-5 h-5" />
                Resume
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - Terminal Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass-dark rounded-2xl p-6 shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  mark@portfolio:~
                </span>
              </div>

              {/* Terminal Content */}
              <div className="font-mono text-sm space-y-2">
                <div className="flex gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-blue-400">whoami</span>
                </div>
                <div className="text-muted-foreground pl-4">
                  Mark Amos Osiemo — CS Student & Developer
                </div>

                <div className="flex gap-2 mt-3">
                  <span className="text-green-400">$</span>
                  <span className="text-blue-400">cat skills.txt</span>
                </div>
                <div className="pl-4 flex flex-wrap gap-2 mt-1">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs"
                      style={{ opacity: 0.8 }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <span className="text-green-400">$</span>
                  <span className="text-blue-400">git log --oneline</span>
                </div>
                <div className="pl-4 space-y-1 text-xs text-muted-foreground">
                  <div>
                    <span className="text-yellow-400">a1b2c3d</span> Built full-stack portfolio platform
                  </div>
                  <div>
                    <span className="text-yellow-400">e4f5g6h</span> Added AI assistant feature
                  </div>
                  <div>
                    <span className="text-yellow-400">i7j8k9l</span> Integrated GitHub API sync
                  </div>
                  <div>
                    <span className="text-yellow-400">m1n2o3p</span> Setup PostgreSQL database
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <span className="text-green-400">$</span>
                  <span className="animate-pulse text-white">_</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}