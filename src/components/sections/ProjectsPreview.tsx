"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GitBranch, ExternalLink, Star } from "lucide-react";

const featuredProjects = [
  {
    title: "Dev Portfolio Platform",
    description:
      "A full-stack developer portfolio platform with AI assistant, project management, blog system, and analytics dashboard.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind"],
    githubUrl: "https://github.com/AMOS2021-MOI",
    liveUrl: "#",
    stars: 12,
    status: "Active",
    color: "from-blue-500/20 to-purple-500/20",
  },
  {
    title: "AI Chat Application",
    description:
      "Real-time chat application powered by OpenAI API with conversation history, multiple AI models support, and markdown rendering.",
    techStack: ["React", "Node.js", "Socket.io", "OpenAI", "MongoDB"],
    githubUrl: "https://github.com/AMOS2021-MOI",
    liveUrl: "#",
    stars: 8,
    status: "Completed",
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    title: "E-Commerce Dashboard",
    description:
      "Admin dashboard for e-commerce with real-time analytics, inventory management, order tracking, and payment integration.",
    techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Chart.js"],
    githubUrl: "https://github.com/AMOS2021-MOI",
    liveUrl: "#",
    stars: 15,
    status: "Completed",
    color: "from-orange-500/20 to-pink-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProjectsPreview() {
  return (
    <section className="section-padding bg-background">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-16"
        >
          <div>
            <p className="text-primary font-mono text-sm mb-2">
              What I have built
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity font-medium"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredProjects.map((project) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group relative bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative p-6 flex flex-col gap-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      project.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {project.status}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {project.stars}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <GitBranch className="w-4 h-4" />
                    Code
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}