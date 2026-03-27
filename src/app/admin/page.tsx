"use client";

import { motion } from "framer-motion";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Total Projects",
    value: "12",
    change: "+2 this month",
    trend: "up",
    icon: FolderKanban,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    href: "/admin/projects",
  },
  {
    label: "Blog Posts",
    value: "8",
    change: "+1 this week",
    trend: "up",
    icon: FileText,
    color: "text-green-500",
    bg: "bg-green-500/10",
    href: "/admin/blog",
  },
  {
    label: "Messages",
    value: "24",
    change: "+5 today",
    trend: "up",
    icon: MessageSquare,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    href: "/admin/messages",
  },
  {
    label: "Total Views",
    value: "3.2k",
    change: "-3% this week",
    trend: "down",
    icon: Eye,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    href: "/admin",
  },
];

const recentProjects = [
  { title: "Dev Portfolio Platform", status: "Active", views: 340, date: "2024-01-01" },
  { title: "AI Chat Application", status: "Completed", views: 210, date: "2023-11-15" },
  { title: "E-Commerce Dashboard", status: "Completed", views: 520, date: "2023-09-20" },
  { title: "Task Management App", status: "Active", views: 180, date: "2023-08-10" },
];

const recentMessages = [
  { name: "John Doe", email: "john@example.com", subject: "Project Collaboration", date: "2024-01-20" },
  { name: "Jane Smith", email: "jane@example.com", subject: "Freelance Work", date: "2024-01-19" },
  { name: "Bob Johnson", email: "bob@example.com", subject: "Job Opportunity", date: "2024-01-18" },
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

export default function AdminDashboard() {
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
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500" />
                    )}
                    <span
                      className="text-xs"
                      style={{ color: stat.trend === "up" ? "rgb(34 197 94)" : "rgb(239 68 68)" }}
                    >
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
            {recentProjects.map((project) => (
              <div
                key={project.title}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{project.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {new Date(project.date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <p className="text-sm font-medium">{project.views} views</p>
                                      <span className={`text-xs px-2 py-1 rounded-full ${project.status === "Active" ? "bg-green-500/10 text-green-700" : "bg-gray-500/10 text-gray-700"}`}>
                                        {project.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
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
                              {recentMessages.map((message) => (
                                <div
                                  key={message.email}
                                  className="p-4 hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="text-sm font-medium">{message.name}</p>
                                      <p className="text-xs text-muted-foreground">{message.email}</p>
                                      <p className="text-xs text-muted-foreground mt-1">{message.subject}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{message.date}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    );
                  }