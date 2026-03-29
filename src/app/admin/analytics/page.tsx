"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  TrendingUp,
  Users,
  Monitor,
  Smartphone,
  BarChart2,
} from "lucide-react";

interface AnalyticsData {
  total: number;
  last30Days: number;
  last7Days: number;
  today: number;
  topPages: { page: string; views: number }[];
  devices: { device: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Visits",
      value: data?.total ?? 0,
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      change: "All time",
    },
    {
      label: "Last 30 Days",
      value: data?.last30Days ?? 0,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
      change: "Past month",
    },
    {
      label: "Last 7 Days",
      value: data?.last7Days ?? 0,
      icon: BarChart2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      change: "Past week",
    },
    {
      label: "Today",
      value: data?.today ?? 0,
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      change: "Past 24 hours",
    },
  ];

  const totalDevices = data?.devices.reduce((sum, d) => sum + d.count, 0) || 1;
  const maxPageViews = Math.max(...(data?.topPages.map((p) => p.views) || [1]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real visitor data from your portfolio
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-background rounded-xl border p-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={"w-10 h-10 rounded-lg flex items-center justify-center " + stat.bg}>
                  <Icon className={"w-5 h-5 " + stat.color} />
                </div>
              </div>
              {loading ? (
                <div className="h-8 w-20 bg-muted rounded animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold mb-1">
                  {stat.value.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="p-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Top Pages
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse" />
              ))
            ) : data?.topPages.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No page views yet. Share your portfolio to get visitors!
              </p>
            ) : (
              data?.topPages.map((page) => (
                <div key={page.page} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground truncate max-w-xs">
                      {page.page || "/"}
                    </span>
                    <span className="font-medium ml-4 flex-shrink-0">
                      {page.views.toLocaleString()} views
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--color-muted)" }}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: Math.round((page.views / maxPageViews) * 100) + "%",
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="p-6 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              Devices
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))
            ) : data?.devices.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No data yet
              </p>
            ) : (
              data?.devices.map((device) => {
                const percentage = Math.round((device.count / totalDevices) * 100);
                return (
                  <div key={device.device} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device.device === "mobile" ? (
                          <Smartphone className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Monitor className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm capitalize">{device.device}</span>
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-muted)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: percentage + "%",
                          backgroundColor:
                            device.device === "mobile"
                              ? "rgb(168 85 247)"
                              : "var(--color-primary)",
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {device.count.toLocaleString()} visits
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}