"use client";

import { useEffect, useState, useRef } from "react";
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

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, " + p.opacity + ")";
        ctx.fill();
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "rgba(99, 102, 241, " + 0.15 * (1 - dist / 120) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

function ResumeButton() {
  const [url, setUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/resume")
      .then((res) => res.json())
      .then((data) => {
        if (data.exists && data.url) setUrl(data.url);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  if (!checked || !url) return null;

  return (
    <>
      <span className="text-muted-foreground">·</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        Resume
      </a>
    </>
  );
}

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
      <ParticleBackground />

      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ backgroundColor: "rgb(99 102 241 / 0.15)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ backgroundColor: "rgb(168 85 247 / 0.15)", animationDelay: "3s" }}
      />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground font-mono">
                Available for opportunities
              </span>
            </motion.div>

            <div className="flex flex-col gap-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground font-mono text-base"
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
                <Terminal className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-xl sm:text-2xl font-mono text-primary">
                  {currentText}
                  <span className="animate-pulse">|</span>
                </span>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground leading-relaxed max-w-lg"
            >
              {siteConfig.author.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/projects"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
              >
                View My Work
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={"mailto:" + siteConfig.author.email}
                className="flex items-center gap-2 border px-5 py-2.5 rounded-lg font-medium hover:bg-accent transition-colors text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 text-sm flex-wrap"
            >
              
              <a
                href={"https://github.com/" + siteConfig.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                GitHub
              </a>
              <span className="text-muted-foreground">·</span>
              <a
                href={"mailto:" + siteConfig.author.email}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <ResumeButton />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div
              className="rounded-2xl p-6 shadow-2xl border"
              style={{
                backgroundColor: "var(--color-background)",
                borderColor: "var(--color-border)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="flex items-center gap-2 mb-4 pb-3 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">
                  mark@portfolio:~
                </span>
              </div>

              <div className="font-mono text-sm space-y-3">
                <div className="flex gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-blue-400">whoami</span>
                </div>
                <div className="text-muted-foreground pl-4 text-xs">
                  Mark Amos Osiemo — CS Student & Developer
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-blue-400">cat skills.txt</span>
                </div>
                <div className="pl-4 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary/15 text-primary px-2 py-0.5 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <span className="text-green-400">$</span>
                  <span className="text-blue-400">git log --oneline</span>
                </div>
                <div className="pl-4 space-y-1 text-xs text-muted-foreground">
                  <div><span className="text-yellow-400">a1b2c3d</span> Built full-stack portfolio</div>
                  <div><span className="text-yellow-400">e4f5g6h</span> Added Gemini AI assistant</div>
                  <div><span className="text-yellow-400">i7j8k9l</span> Integrated GitHub API sync</div>
                  <div><span className="text-yellow-400">m1n2o3p</span> Setup Neon PostgreSQL</div>
                </div>
                <div className="flex gap-2">
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