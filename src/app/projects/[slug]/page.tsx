"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ExternalLink, GitBranch, Star, Calendar, Eye } from "lucide-react";

const projects: Record<string, {
  title: string;
  description: string;
  fullDescription: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  stars: number;
  views: number;
  status: string;
  date: string;
  color: string;
  features: string[];
}> = {
  "dev-portfolio-platform": {
    title: "Dev Portfolio Platform",
    description: "A full-stack developer portfolio platform with AI assistant, project management, blog system, and analytics dashboard.",
    fullDescription: `This platform is a comprehensive developer portfolio solution built with Next.js 14, TypeScript, and PostgreSQL. It features a dynamic project management system, an AI-powered assistant that answers visitor questions, a full blog platform with markdown support, and a detailed analytics dashboard.

The platform is designed to be both a personal brand showcase and a foundation for future SaaS expansion. It includes JWT authentication with 2FA support, role-based access control, and a rich text editor for content management.`,
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Framer Motion", "OpenAI"],
    githubUrl: "https://github.com/AMOS2021-MOI",
    liveUrl: "#",
    stars: 12,
    views: 340,
    status: "Active",
    date: "2024-01-01",
    color: "from-blue-500 to-purple-500",
    features: [
      "Dynamic project management with full CRUD operations",
      "AI assistant trained on your projects",
      "Blog platform with markdown support",
      "Analytics dashboard with visitor tracking",
      "JWT authentication with 2FA support",
      "GitHub integration for auto-syncing repo data",
      "Newsletter system with subscriber management",
      "PWA with offline mode support",
    ],
  },
  "ai-chat-application": {
    title: "AI Chat Application",
    description: "Real-time chat application powered by OpenAI API with conversation history and multiple AI models support.",
    fullDescription: `A modern real-time chat application that leverages the power of OpenAI API to provide intelligent responses. The app supports multiple AI models, maintains conversation history, and renders markdown in responses.

Built with React and Node.js, it uses Socket.io for real-time communication and MongoDB for storing conversation history. The UI is clean and minimal with support for code highlighting in AI responses.`,
    techStack: ["React", "Node.js", "Socket.io", "OpenAI", "MongoDB", "Tailwind CSS"],
    githubUrl: "https://github.com/AMOS2021-MOI",
    liveUrl: "#",
    stars: 8,
    views: 210,
    status: "Completed",
    date: "2023-11-15",
    color: "from-green-500 to-teal-500",
    features: [
      "Real-time messaging with Socket.io",
      "Multiple AI model support",
      "Conversation history persistence",
      "Markdown and code highlighting",
      "Responsive mobile-first design",
      "Message streaming for faster responses",
    ],
  },
  "e-commerce-dashboard": {
    title: "E-Commerce Dashboard",
    description: "Admin dashboard for e-commerce with real-time analytics, inventory management, and Stripe payment integration.",
    fullDescription: `A comprehensive admin dashboard for e-commerce businesses. It provides real-time analytics, inventory management, order tracking, and integrated payment processing via Stripe.

The dashboard features interactive charts built with Chart.js, a product management system with image uploads, and automated email notifications for orders. It also includes a customer management system and detailed sales reports.`,
    techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Chart.js", "Prisma"],
    githubUrl: "https://github.com/AMOS2021-MOI",
    liveUrl: "#",
    stars: 15,
    views: 520,
    status: "Completed",
    date: "2023-09-20",
    color: "from-orange-500 to-pink-500",
    features: [
      "Real-time sales analytics and charts",
      "Inventory management with low stock alerts",
      "Order tracking and management",
      "Stripe payment integration",
      "Customer management system",
      "Automated email notifications",
      "PDF report generation",
      "Role-based access control",
    ],
  },
};

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects[params.slug];

  if (!project) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container-max section-padding pt-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you are looking for does not exist.
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
          {/* Gradient Bar */}
          <div className={"h-1 w-24 rounded-full bg-gradient-to-r mb-6 " + project.color} />

          {/* Status & Stars */}
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor:
                  project.status === "Active"
                    ? "rgb(34 197 94 / 0.1)"
                    : "rgb(59 130 246 / 0.1)",
                color:
                  project.status === "Active"
                    ? "rgb(34 197 94)"
                    : "rgb(59 130 246)",
              }}
            >
              {project.status}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              {project.stars} stars
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Meta */}
          <div
            className="flex flex-wrap items-center gap-6 py-4 border-t border-b text-sm text-muted-foreground"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(project.date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {project.views.toLocaleString()} views
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
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
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Demo
            </a>
          </div>
        </motion.div>

        {/* Full Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">About This Project</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {project.fullDescription}
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="space-y-3">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
  
        <Footer />
      </main>
  );
}