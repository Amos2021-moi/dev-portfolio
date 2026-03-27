"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, User, Bell, Shield, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Mark Amos Osiemo",
    email: "amosmark2332@gmail.com",
    title: "Full-Stack Developer & CS Student",
    bio: "Computer Science student at South Eastern Kenya University (SEKU), passionate about building modern web applications and turning ideas into real digital products. Always learning, always building.",
    github: "AMOS2021-MOI",
    location: "Kenya, East Africa",
  });

  const [notifications, setNotifications] = useState({
    emailMessages: true,
    emailComments: true,
    emailNewsletter: false,
    browserNotifications: true,
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Mark Osiemo | Dev Portfolio",
    siteUrl: "https://markdev.vercel.app",
    maintenanceMode: false,
    analyticsEnabled: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const handleSave = async (section: string) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2000);
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSiteChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    setSiteSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    }));
  };

  const handleNotificationChange = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your portfolio settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Profile Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <input
              type="text"
              name="title"
              value={profile.title}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub Username</label>
            <input
              type="text"
              name="github"
              value={profile.github}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleProfileChange}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <button
          onClick={() => handleSave("profile")}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {savedSection === "profile" ? "Saved!" : "Save Profile"}
        </button>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Notifications
        </h2>

        <div className="space-y-3">
          {[
            { key: "emailMessages", label: "Email me when I receive a new message" },
            { key: "emailComments", label: "Email me when someone comments on my project" },
            { key: "emailNewsletter", label: "Send me newsletter performance reports" },
            { key: "browserNotifications", label: "Enable browser push notifications" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-sm">{item.label}</p>
              <button
                onClick={() => handleNotificationChange(item.key)}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                style={{
                  backgroundColor:
                    notifications[item.key as keyof typeof notifications]
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                  style={{
                    transform:
                      notifications[item.key as keyof typeof notifications]
                        ? "translateX(20px)"
                        : "translateX(0)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleSave("notifications")}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {savedSection === "notifications" ? "Saved!" : "Save Notifications"}
        </button>
      </motion.div>

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          Site Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={siteSettings.siteName}
              onChange={handleSiteChange}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Site URL</label>
            <input
              type="url"
              name="siteUrl"
              value={siteSettings.siteUrl}
              onChange={handleSiteChange}
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {[
            { key: "maintenanceMode", label: "Maintenance Mode", desc: "Hide the site from visitors while you make changes" },
            { key: "analyticsEnabled", label: "Analytics Tracking", desc: "Track visitor behavior and page views" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setSiteSettings((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                style={{
                  backgroundColor:
                    siteSettings[item.key as keyof typeof siteSettings]
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                  style={{
                    transform: siteSettings[item.key as keyof typeof siteSettings]
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleSave("site")}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {savedSection === "site" ? "Saved!" : "Save Site Settings"}
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "rgb(239 68 68 / 0.3)" }}
      >
        <h2 className="font-semibold flex items-center gap-2 text-red-500">
          <Shield className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-colors">
            Clear All Analytics Data
          </button>
          <button className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-colors">
            Delete All Messages
          </button>
        </div>
      </motion.div>

    </div>
  );
}
