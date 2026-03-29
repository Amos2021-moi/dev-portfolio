"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GitBranch, ExternalLink, Star } from "lucide-react";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  stars: number;
  status: string;
  featured: boolean;
}

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

const gradients = [
  "from-blue-500 to-purple-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-pink-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-yellow-500 to-orange-500",
];

export default function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        const featured = all.filter((p: Project) => p.featured);
        const toShow = featured.length > 0 ? featured.slice(0, 3) : all.slice(0, 3);
        setProjects(toShow);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-background rounded-xl border p-6 animate-pulse"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="h-4 bg-muted rounded mb-4 w-3/4" />
                <div className="h-3 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded mb-2 w-5/6" />
                <div className="h-3 bg-muted rounded w-4/6" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              No projects yet. Add your first project in the admin dashboard!
            </p>
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Add First Project
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group relative bg-background rounded-xl border hover:border-primary/50 transition-all duration-300 overflow-hidden"
                style={{ borderColor: "var(--color-border)" }}
              >
                {/* Gradient Top Bar */}
                <div
                  className={"h-1 w-full bg-gradient-to-r " + gradients[index % gradients.length]}
                />

                <div className="p-6 flex flex-col gap-4">
                  {/* Status & Stars */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          project.status === "ACTIVE"
                            ? "rgb(34 197 94 / 0.1)"
                            : "rgb(59 130 246 / 0.1)",
                        color:
                          project.status === "ACTIVE"
                            ? "rgb(34 197 94)"
                            : "rgb(59 130 246)",
                      }}
                    >
                      {project.status}
                    </span>
                    {project.stars > 0 && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {project.stars}
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <Link href={"/projects/" + project.slug}>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors cursor-pointer">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div
                    className="flex items-center gap-4 pt-2 border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        <GitBranch className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    <Link
                      href={"/projects/" + project.slug}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm ml-auto"
                    >
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
}