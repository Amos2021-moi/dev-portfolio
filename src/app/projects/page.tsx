"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ExternalLink, GitBranch, Star, Search, Plus } from "lucide-react";
import Link from "next/link";

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
  views: number;
}

const categories = ["All", "Full Stack", "Frontend", "Backend", "AI"];

const gradients = [
  "from-blue-500 to-purple-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-pink-500",
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-yellow-500 to-orange-500",
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      );
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-2">My Work</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">All Projects</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A collection of projects I have built, from full-stack web apps
            to AI-powered tools and everything in between.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="container-max px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects or technologies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    activeCategory === cat
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                  color:
                    activeCategory === cat
                      ? "var(--color-primary-foreground)"
                      : "var(--color-muted-foreground)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container-max px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              {projects.length === 0
                ? "No projects yet. Add your first project!"
                : "No projects match your search."}
            </p>
            {projects.length === 0 && (
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add First Project
              </Link>
            )}
            {projects.length > 0 && (
              <button
                onClick={() => setSearch("")}
                className="text-primary hover:opacity-80 transition-opacity"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-background rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300"
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
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <Footer />
    </main>
  );
}