"use client";

import { motion } from "framer-motion";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  views: number;
  createdAt: string;
}

interface Message {
  id: string;
  data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  createdAt: string;
}

interface AnalyticsData {
  total: number;
  last30Days: number;
  last7Days: number;
  today: number;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/blog").then((r) => r.json()),
      fetch("/api/contact").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
    ])
      .then(([projectsData, postsData, messagesData, analyticsData]) => {
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setPosts(Array.isArray(postsData) ? postsData : []);
        setMessages(Array.isArray(messagesData) ? messagesData : []);
        setAnalytics(analyticsData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Total Projects",
      value: projects.length.toString(),
      change: projects.filter((p) => p.status === "ACTIVE").length + " active",
      trend: "up",
      icon: FolderKanban,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/projects",
    },
    {
      label: "Blog Posts",
      value: posts.length.toString(),
      change: posts.filter((p) => p.published).length + " published",
      trend: "up",
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-500/10",
      href: "/admin/blog",
    },
    {
      label: "Messages",
      value: messages.length.toString(),
      change: "Total received",
      trend: "up",
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      href: "/admin/messages",
    },
    {
      label: "Total Views",
      value: analytics
        ? analytics.total > 999
          ? (analytics.total / 1000).toFixed(1) + "k"
          : analytics.total.toString()
        : "0",
      change: "Today: " + (analytics?.today ?? 0),
      trend: "up",
      icon: Eye,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      href: "/admin/analytics",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your portfolio performance
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <Link href={stat.href}>
                <div
                  className="bg-background rounded-xl border p-6 hover:shadow-md transition-all duration-300 group"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + stat.bg}>
                      <Icon className={"w-5 h-5 " + stat.color} />
                    </div>
                    <Activity className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1" />
                  ) : (
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  )}
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-primary" />
              Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))
            ) : projects.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No projects yet.{" "}
                <Link href="/admin/projects/new" className="text-primary hover:opacity-80">
                  Add one
                </Link>
              </div>
            ) : (
              projects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="w-3 h-3" />
                      {project.views}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
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
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-primary hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No messages yet. Share your portfolio to get contacts!
              </div>
            ) : (
              messages.slice(0, 4).map((message) => (
                <div
                  key={message.id}
                  className="flex items-start justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                      {message.data?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {message.data?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {message.data?.subject || "No subject"}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(message.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-background rounded-xl border p-6"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/projects/new", icon: FolderKanban, label: "New Project" },
            { href: "/admin/blog/new", icon: FileText, label: "New Post" },
            { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
            { href: "/admin/analytics", icon: Eye, label: "Analytics" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-center"
                style={{ borderColor: "var(--color-border)" }}
              >
                <Icon className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}