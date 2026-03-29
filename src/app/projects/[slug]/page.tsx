"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ExternalLink, GitBranch, Star, Calendar, Eye } from "lucide-react";
import { useViewCounter } from "@/hooks/useViewCounter";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  stars: number;
  views: number;
  status: string;
  featured: boolean;
  createdAt: string;
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useViewCounter("project", project?.id);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        const found = Array.isArray(data)
          ? data.find((p: Project) => p.slug === params.slug)
          : null;
        if (found) {
          setProject(found);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container-max px-4 sm:px-6 lg:px-8 pt-32 pb-24 max-w-4xl">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !project) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container-max section-padding pt-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you are looking for does not exist yet.
          </p>
          <Link
            href="/projects"
            className="text-primary hover:opacity-80 transition-opacity flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container-max px-4 sm:px-6 lg:px-8 pt-32 pb-24 max-w-4xl">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6" />

          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
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
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                {project.stars} stars
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {project.title}
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            {project.description}
          </p>

          <div
            className="flex flex-wrap items-center gap-6 py-4 border-t border-b text-sm text-muted-foreground"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {project.views} views
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                <GitBranch className="w-4 h-4" />
                View Source Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {project.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              {project.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tech Stack */}
        {project.techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-muted text-muted-foreground px-4 py-2 rounded-lg text-sm font-mono border"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-8 rounded-xl border text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="text-xl font-bold mb-2">
            Interested in working together?
          </h3>
          <p className="text-muted-foreground mb-4">
            I am always open to new projects and collaborations.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Get In Touch
          </Link>
        </motion.div>

      </div>

      <Footer />
    </main>
  );
}