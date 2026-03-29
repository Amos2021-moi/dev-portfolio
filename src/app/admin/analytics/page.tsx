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
  Globe,
  MapPin,
  Clock,
  Tablet,
} from "lucide-react";

interface AnalyticsData {
  total: number;
  last30Days: number;
  last7Days: number;
  today: number;
  topPages: { page: string; views: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
  countries: { country: string | null; count: number }[];
  cities: { city: string | null; count: number }[];
  recentVisits: {
    page: string;
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    time: string;
    ip: string | null;
  }[];
}

const countryFlags: Record<string, string> = {
  "Kenya": "🇰🇪", "United States": "🇺🇸", "United Kingdom": "🇬🇧",
  "India": "🇮🇳", "Canada": "🇨🇦", "Australia": "🇦🇺",
  "Germany": "🇩🇪", "France": "🇫🇷", "Nigeria": "🇳🇬",
  "South Africa": "🇿🇦", "Uganda": "🇺🇬", "Tanzania": "🇹🇿",
  "Ethiopia": "🇪🇹", "Ghana": "🇬🇭", "Rwanda": "🇷🇼",
  "China": "🇨🇳", "Japan": "🇯🇵", "Brazil": "🇧🇷",
  "Mexico": "🇲🇽", "Netherlands": "🇳🇱", "Sweden": "🇸🇪",
  "Local": "💻",
};

function getDeviceIcon(device: string | null) {
  if (device === "mobile") return <Smartphone className="w-3 h-3" />;
  if (device === "tablet") return <Tablet className="w-3 h-3" />;
  return <Monitor className="w-3 h-3" />;
}

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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Visits", value: data?.total ?? 0, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10", sub: "All time" },
    { label: "Last 30 Days", value: data?.last30Days ?? 0, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10", sub: "Past month" },
    { label: "Last 7 Days", value: data?.last7Days ?? 0, icon: BarChart2, color: "text-purple-500", bg: "bg-purple-500/10", sub: "Past week" },
    { label: "Today", value: data?.today ?? 0, icon: Users, color: "text-orange-500", bg: "bg-orange-500/10", sub: "Past 24 hours" },
  ];

  const totalDevices = data?.devices.reduce((s, d) => s + d.count, 0) || 1;
  const maxPageViews = Math.max(...(data?.topPages.map((p) => p.views) || [1]));
  const maxCountry = Math.max(...(data?.countries.map((c) => c.count) || [1]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real visitor data with location tracking
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
              <div className={"w-10 h-10 rounded-lg flex items-center justify-center mb-4 " + stat.bg}>
                <Icon className={"w-5 h-5 " + stat.color} />
              </div>
              {loading ? (
                <div className="h-8 w-20 bg-muted rounded animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold mb-1">{stat.value.toLocaleString()}</p>
              )}
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
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
          <div className="p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Top Pages
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse" />
              ))
            ) : data?.topPages.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No page views yet. Share your portfolio!
              </p>
            ) : (
              data?.topPages.map((page) => (
                <div key={page.page} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground truncate max-w-xs text-xs">
                      {page.page || "/"}
                    </span>
                    <span className="font-medium ml-4 flex-shrink-0 text-xs">
                      {page.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-muted)" }}>
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: Math.round((page.views / maxPageViews) * 100) + "%" }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Devices & Browsers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
            <h2 className="font-semibold flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              Devices
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))
            ) : data?.devices.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No data yet</p>
            ) : (
              data?.devices.map((device) => {
                const pct = Math.round((device.count / totalDevices) * 100);
                return (
                  <div key={device.device} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize text-xs flex items-center gap-1.5">
                        {getDeviceIcon(device.device)}
                        {device.device}
                      </span>
                      <span className="text-xs font-medium">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-muted)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: pct + "%",
                          backgroundColor: device.device === "mobile"
                            ? "rgb(168 85 247)"
                            : device.device === "tablet"
                            ? "rgb(249 115 22)"
                            : "var(--color-primary)",
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Browsers */}
          {!loading && data?.browsers && data.browsers.length > 0 && (
            <>
              <div className="px-5 pb-2 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
                <p className="text-xs font-medium text-muted-foreground mt-3 mb-2">Browsers</p>
                <div className="flex flex-wrap gap-2">
                  {data.browsers.map((b) => (
                    <span
                      key={b.browser}
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {b.browser} ({b.count})
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Location Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
            <h2 className="font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Visitors by Country
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse" />
              ))
            ) : !data?.countries || data.countries.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm">
                  No location data yet.
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  New visits will show location here.
                </p>
              </div>
            ) : (
              data.countries.map((c) => (
                <div key={c.country} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-xs">
                      <span>{countryFlags[c.country || ""] || "🌍"}</span>
                      <span>{c.country || "Unknown"}</span>
                    </span>
                    <span className="font-medium text-xs">{c.count} visits</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-muted)" }}>
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-500"
                      style={{ width: Math.round((c.count / maxCountry) * 100) + "%" }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Cities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
            <h2 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Visitors by City
            </h2>
          </div>
          <div className="p-5">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded animate-pulse mb-2" />
              ))
            ) : !data?.cities || data.cities.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-muted-foreground text-sm">No city data yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.cities.map((c, i) => (
                  <div
                    key={c.city}
                    className="flex items-center justify-between p-2.5 rounded-lg"
                    style={{ backgroundColor: i === 0 ? "var(--color-primary)" + "15" : "var(--color-muted)" + "50" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">{c.city || "Unknown"}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {c.count} {c.count === 1 ? "visit" : "visits"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Visits Live Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-background rounded-xl border"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
          <h2 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Visits
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))
          ) : !data?.recentVisits || data.recentVisits.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No visits recorded yet. Share your portfolio!
            </div>
          ) : (
            data.recentVisits.map((visit, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-lg flex-shrink-0">
                    {countryFlags[visit.country || ""] || "🌍"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-mono truncate text-muted-foreground">
                      {visit.page}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {visit.city && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {visit.city}{visit.country ? ", " + visit.country : ""}
                        </span>
                      )}
                      {!visit.city && visit.country && (
                        <span className="text-xs text-muted-foreground">
                          {visit.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getDeviceIcon(visit.device)}
                    <span className="hidden sm:inline">{visit.browser}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(visit.time)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
}