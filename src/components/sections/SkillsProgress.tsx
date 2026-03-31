"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const skillCategories = [
  {
    category: "Frontend",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    skills: [
      { name: "Next.js / React", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Framer Motion", level: 70 },
    ],
  },
  {
    category: "Backend",
    color: "from-green-500 to-teal-500",
    bg: "bg-green-500/10",
    skills: [
      { name: "Node.js / Express", level: 78 },
      { name: "REST APIs", level: 85 },
      { name: "PostgreSQL", level: 75 },
      { name: "Prisma ORM", level: 80 },
    ],
  },
  {
    category: "Tools & DevOps",
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    skills: [
      { name: "Git & GitHub", level: 88 },
      { name: "Docker", level: 60 },
      { name: "Vercel / CI-CD", level: 82 },
      { name: "Linux / Bash", level: 65 },
    ],
  },
  {
    category: "Languages",
    color: "from-orange-500 to-yellow-500",
    bg: "bg-orange-500/10",
    skills: [
      { name: "JavaScript", level: 88 },
      { name: "Python", level: 70 },
      { name: "SQL", level: 75 },
      { name: "HTML & CSS", level: 92 },
    ],
  },
];

function SkillBar({ name, level, color, delay }: {
  name: string;
  level: number;
  color: string;
  delay: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm text-muted-foreground font-mono">
          {animated ? level : 0}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--color-muted)" }}
      >
        <motion.div
          className={"h-full rounded-full bg-gradient-to-r " + color}
          initial={{ width: 0 }}
          animate={{ width: animated ? level + "%" : "0%" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

export default function SkillsProgress() {
  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="container-max">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-2">My expertise</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Skills & Proficiency
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A breakdown of my technical skills and proficiency levels across
            different areas of software development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat, catIndex) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: catIndex * 0.1 }}
              className="bg-background rounded-xl border p-6 space-y-5"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={"w-3 h-8 rounded-full bg-gradient-to-b " + cat.color}
                />
                <h3 className="font-bold text-lg">{cat.category}</h3>
              </div>
              {cat.skills.map((skill, i) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={cat.color}
                  delay={i * 100}
                />
              ))}
            </motion.div>
          ))}
        </div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
        >
          {[
            { label: "Projects Built", value: "10+" },
            { label: "Technologies", value: "20+" },
            { label: "GitHub Repos", value: "20+" },
            { label: "Years Learning", value: "2+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-background rounded-xl border p-6 text-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}