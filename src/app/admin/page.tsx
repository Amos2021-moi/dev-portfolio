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
  Bell,
  X,
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

interface Notification {
  id: string;
  type: "message" | "view" | "subscriber";
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/blog").then((r) => r.json()),
      fetch("/api/contact").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
      fetch("/api/newsletter").then((r) => r.json()),
    ])
      .then(([projectsData, postsData, messagesData, analyticsData, subscribersData]) => {
        const proj = Array.isArray(projectsData) ? projectsData : [];
        const post = Array.isArray(postsData) ? postsData : [];
        const msgs = Array.isArray(messagesData) ? messagesData : [];
        const subs = Array.isArray(subscribersData) ? subscribersData : [];

        setProjects(proj);
        setPosts(post);
        setMessages(msgs);
        setAnalytics(analyticsData);

        const notifs: Notification[] = [];

        msgs.slice(0, 3).forEach((m: Message) => {
          notifs.push({
            id: m.id,
            type: "message",
            title: "New message from " + (m.data?.name || "someone"),
            desc: m.data?.subject || "No subject",
            time: m.createdAt,
            read: false,
          });
        });

        subs.slice(0, 2).forEach((s: { id: string; email: string; createdAt: string }) => {
          notifs.push({
            id: s.id,
            type: "subscriber",
            title: "New newsletter subscriber",
            desc: s.email,
            time: s.createdAt,
            read: false,
          });
        });

        proj.slice(0, 2).forEach((p: Project) => {
          if (p.views > 0) {
            notifs.push({
              id: p.id + "-view",
              type: "view",
              title: "Project getting views",
              desc: p.title + " has " + p.views + " views",
              time: p.createdAt,
              read: true,
            });
          }
        });

        notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setNotifications(notifs.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m ago";
    if (hours < 24) return hours + "h ago";
    return days + "d ago";
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your portfolio performance
          </p>
        </div>

        {/* Live Bell Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border hover:bg-accent transition-colors"
            style={{ borderColor: "var(--color-border)" }}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-12 w-80 bg-background rounded-xl border shadow-xl z-50"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div
                className="flex items-center justify-between p-4 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary hover:opacity-80 transition-opacity"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-start gap-3 p-4 border-b hover:bg-muted/30 transition-colors"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                        style={{
                          backgroundColor:
                            notif.type === "message"
                              ? "rgb(168 85 247 / 0.15)"
                              : notif.type === "subscriber"
                              ? "rgb(34 197 94 / 0.15)"
                              : "rgb(59 130 246 / 0.15)",
                        }}
                      >
                        {notif.type === "message" ? "💬" : notif.type === "subscriber" ? "📧" : "👁️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notif.desc}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {timeAgo(notif.time)}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
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
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Projects with LIVE view counts */}
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
              projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{project.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgb(59 130 246 / 0.1)",
                        color: "rgb(59 130 246)",
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      {project.views} views
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
                No messages yet. Share your portfolio!
              </div>
            ) : (
              messages.slice(0, 5).map((message) => (
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
                    {timeAgo(message.createdAt)}
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