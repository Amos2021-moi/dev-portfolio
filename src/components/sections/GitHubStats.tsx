"use client";

import { motion } from "framer-motion";
import { GitBranch, Star, Users, BookOpen, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  avatarUrl: string;
  profileUrl: string;
  name: string;
  bio: string;
  location: string;
}

interface Repo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  url: string;
  updatedAt: string;
  topics: string[];
}

interface Language {
  name: string;
  count: number;
  color: string;
}

// Default empty grid for loading state
const emptyContributions = Array.from({ length: 52 }, () => Array(7).fill(0));

function getContributionColor(count: number): string {
  if (count === 0) return "var(--color-muted)";
  if (count === 1) return "hsl(221.2 83.2% 70%)";
  if (count === 2) return "hsl(221.2 83.2% 60%)";
  if (count === 3) return "hsl(221.2 83.2% 50%)";
  return "hsl(221.2 83.2% 40%)";
}

export default function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  // --- UPDATED: State for real contributions ---
  const [contributions, setContributions] = useState<number[][]>(emptyContributions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.topRepos) setRepos(data.topRepos);
        if (data.languages) setLanguages(data.languages);
        // --- UPDATED: Set contributions from API ---
        if (data.contributions) setContributions(data.contributions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Public Repos",
      value: stats?.publicRepos ?? "—",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Stars",
      value: stats?.totalStars ?? "—",
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Followers",
      value: stats?.followers ?? "—",
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Forks",
      value: stats?.totalForks ?? "—",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-muted)" }}
    >
      <div className="container-max">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-2">Open Source</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            GitHub Activity
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A real-time snapshot of my GitHub contributions and open source work.
          </p>
          <a
            href="https://github.com/AMOS2021-MOI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-primary hover:opacity-80 transition-opacity text-sm font-medium"
          >
            <GitBranch className="w-4 h-4" />
            View GitHub Profile
          </a>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-background rounded-xl border p-6 text-center hover:shadow-md transition-all duration-300"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className={"w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 " + stat.bg}
                >
                  <Icon className={"w-6 h-6 " + stat.color} />
                </div>
                {loading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto mb-1" />
                ) : (
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                )}
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Contribution Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-background rounded-xl border p-6 mb-12 overflow-x-auto"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Contribution Activity
          </h3>
          <div className="flex gap-1 min-w-max">
            {/* --- UPDATED: Mapping over the state variable 'contributions' --- */}
            {contributions.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((count, di) => (
                  <div
                    key={di}
                    className="w-3 h-3 rounded-sm transition-colors"
                    style={{ backgroundColor: getContributionColor(count) }}
                    title={count + " contributions"}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-3">
            <span className="text-xs text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getContributionColor(level) }}
              />
            ))}
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </motion.div>

        {/* Real Repos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            {loading ? "Loading repositories..." : "Top Repositories"}
          </h3>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-background rounded-xl border p-5 animate-pulse"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="h-4 bg-muted rounded mb-3 w-3/4" />
                  <div className="h-3 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-background rounded-xl border p-5 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-primary flex-shrink-0" />
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {repo.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <GitBranch className="w-3 h-3" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>

                  {repo.description && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: repo.languageColor }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {repo.language}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {"Updated " + new Date(repo.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}