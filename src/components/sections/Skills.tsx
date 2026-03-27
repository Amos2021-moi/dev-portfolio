"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Globe,
  Layout,
  Server,
  Smartphone,
} from "lucide-react";

const skillCategories = [
  {
    icon: Layout,
    title: "Frontend",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    icon: Server,
    title: "Backend",
    color: "text-green-500",
    bg: "bg-green-500/10",
    skills: ["Node.js", "Express", "Next.js API", "REST APIs", "GraphQL"],
  },
  {
    icon: Database,
    title: "Database",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    skills: ["PostgreSQL", "Prisma ORM", "Redis", "MongoDB", "MySQL"],
  },
  {
    icon: Globe,
    title: "DevOps",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    skills: ["Docker", "GitHub Actions", "Vercel", "CI/CD", "Linux"],
  },
  {
    icon: Code2,
    title: "Languages",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    skills: ["TypeScript", "JavaScript", "Python", "SQL", "Bash"],
  },
  {
    icon: Smartphone,
    title: "Tools",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    skills: ["Git", "VS Code", "Postman", "Figma", "GitHub"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Skills() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-2">
            What I work with
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Skills &amp; Technologies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of technologies and tools I use to build modern,
            scalable, and performant web applications.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                variants={itemVariants}
                className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-colors duration-300 group"
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 ${category.bg} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}