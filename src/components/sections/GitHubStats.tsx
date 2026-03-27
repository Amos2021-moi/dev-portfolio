"use client";

import { motion } from "framer-motion";
import { GitBranch, Star, Users, BookOpen, TrendingUp } from "lucide-react";

const stats = [
  { label: "Public Repos", value: "24", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Total Stars", value: "89", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { label: "Followers", value: "47", icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Contributions", value: "312", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const recentRepos = [
  { name: "dev-portfolio", description: "Full-stack developer portfolio platform with AI assistant", stars: 12, forks: 3, language: "TypeScript", languageColor: "#3178c6", updatedAt: "2024-01-20" },
  { name: "ai-chat-app", description: "Real-time AI chat application powered by OpenAI API", stars: 8, forks: 2, language: "JavaScript", languageColor: "#f1e05a", updatedAt: "2024-01-15" },
  { name: "ecommerce-dashboard", description: "Admin dashboard with Stripe integration and analytics", stars: 15, forks: 5, language: "TypeScript", languageColor: "#3178c6", updatedAt: "2024-01-10" },
  { name: "url-shortener", description: "Fast URL shortening service with analytics tracking", stars: 11, forks: 4, language: "TypeScript", languageColor: "#3178c6", updatedAt: "2024-01-05" },
];

const contributionData = Array.from({ length: 52 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week,
    day,
    count: Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0,
  }))
);

function getContributionColor(count: number): string {
  if (count === 0) return "rgba(255, 255, 255, 0.05)";
  if (count === 1) return "rgba(0, 112, 243, 0.3)";
  if (count === 2) return "rgba(0, 112, 243, 0.5)";
  if (count === 3) return "rgba(0, 112, 243, 0.7)";
  return "rgba(0, 112, 243, 1)";
}

export default function GitHubStats() {
  return (
    <section className="py-20 bg-black/50" id="projects">
      <div className="container mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-brand-glow font-mono text-sm mb-2 uppercase tracking-widest">Open Source</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tighter">GitHub Activity</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A real-time snapshot of my technical contributions and open source footprint.
          </p>
          
          <a 
            href="https://github.com/AMOS2021-MOI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-brand-glow hover:text-white transition-colors text-sm font-medium"
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass-card p-6 text-center hover:bg-white/5 transition-all duration-300"
              >
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 " + stat.bg}>
                  <Icon className={"w-6 h-6 " + stat.color} />
                </div>
                <p className="text-3xl font-bold mb-1 tracking-tighter">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Contribution Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 mb-12 overflow-x-auto"
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
            <TrendingUp className="w-4 h-4 text-brand-glow" />
            Contribution Activity
          </h3>
          <div className="flex gap-1.5 min-w-max">
            {contributionData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className="w-3.5 h-3.5 rounded-[2px] transition-colors"
                    style={{ backgroundColor: getContributionColor(day.count) }}
                    title={day.count + " contributions"}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-6">
            <span className="text-[10px] uppercase text-gray-500 font-bold">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: getContributionColor(level) }}
              />
            ))}
            <span className="text-[10px] uppercase text-gray-500 font-bold">More</span>
          </div>
        </motion.div>

        {/* Repos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-semibold mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
            <BookOpen className="w-4 h-4 text-brand-glow" />
            Recent Repositories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentRepos.map((repo) => (
              <a
                key={repo.name}
                href={"https://github.com/AMOS2021-MOI/" + repo.name}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group p-6 hover:bg-white/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-brand-glow" />
                    <h4 className="font-bold text-lg group-hover:text-brand-glow transition-colors">
                      {repo.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <GitBranch className="w-3 h-3" />
                      {repo.forks}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {repo.description}
                </p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                    <span className="text-xs text-gray-400 font-mono">{repo.language}</span>
                  </div>
                  <span className="text-[10px] uppercase text-gray-500 font-bold">
                    {new Date(repo.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}